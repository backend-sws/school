<?php

namespace App\Support;

use App\Models\User;
use Illuminate\Support\Facades\Crypt;

/**
 * Generic verification token for any user type (student, staff, etc.).
 * Use for: email verification + set password, invite links, etc.
 */
class VerificationToken
{
    /** Default expiry in days for the verification link. */
    public const EXPIRY_DAYS = 7;

    /**
     * Create an encrypted token for the user (payload: user_id + exp).
     */
    public static function createToken(User $user, int $expiryDays = self::EXPIRY_DAYS): string
    {
        $payload = [
            'user_id' => $user->id,
            'exp' => now()->addDays($expiryDays)->timestamp,
        ];

        return Crypt::encryptString(json_encode($payload));
    }

    /**
     * Verify token and return the user, or null if invalid/expired.
     */
    public static function verifyToken(string $token): ?User
    {
        try {
            $decrypted = Crypt::decryptString($token);
            $payload = json_decode($decrypted, true);

            if (!$payload || empty($payload['user_id']) || empty($payload['exp'])) {
                return null;
            }

            if ($payload['exp'] < now()->timestamp) {
                return null;
            }

            return User::find($payload['user_id']);
        } catch (\Throwable) {
            return null;
        }
    }

    /**
     * Build the full URL for the verify-email + set-password page (generic for any user).
     */
    public static function verifyEmailUrl(User $user, int $expiryDays = self::EXPIRY_DAYS): string
    {
        $token = self::createToken($user, $expiryDays);
        $path = '/verify-email?' . http_build_query(['token' => $token]);

        return rtrim(config('app.url'), '/') . $path;
    }
}
