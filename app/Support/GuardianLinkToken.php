<?php

namespace App\Support;

use App\Models\Guardian;
use Illuminate\Support\Facades\Crypt;

/**
 * Token for guardian link-account email verification. Payload: guardian_id, email, exp.
 * Only after the user clicks the link in the email do we link the guardian and assign parent role.
 */
class GuardianLinkToken
{
    public const EXPIRY_HOURS = 24;

    public static function create(int $guardianId, string $email): string
    {
        $payload = [
            'guardian_id' => $guardianId,
            'email' => $email,
            'exp' => now()->addHours(self::EXPIRY_HOURS)->timestamp,
        ];

        return Crypt::encryptString(json_encode($payload));
    }

    /**
     * @return array{guardian_id: int, email: string}|null
     */
    public static function verify(string $token): ?array
    {
        try {
            $decrypted = Crypt::decryptString($token);
            $payload = json_decode($decrypted, true);

            if (! $payload || empty($payload['guardian_id']) || empty($payload['email']) || empty($payload['exp'])) {
                return null;
            }

            if ($payload['exp'] < now()->timestamp) {
                return null;
            }

            return [
                'guardian_id' => (int) $payload['guardian_id'],
                'email' => $payload['email'],
            ];
        } catch (\Throwable) {
            return null;
        }
    }

    public static function verifyUrl(string $token): string
    {
        $path = '/student-portal/link-account/verify?' . http_build_query(['token' => $token]);

        return rtrim(config('app.url'), '/') . $path;
    }
}
