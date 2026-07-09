<?php

namespace App\Services;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Support\Str;

/**
 * Polymorphic Registration Number Generator.
 *
 * Pattern: {ROLE_PREFIX}-{ORG_CODE}-{YY}{RANDOM}
 * Example: STU-ACME-257KX3P
 *
 * - ROLE_PREFIX: from config('reg_no.prefixes') map (polymorphic, one-line to add new roles)
 * - ORG_CODE:    from organizations.code (dynamic, fetched at runtime per institution)
 * - YY:          2-digit year of enrollment/joining
 * - RANDOM:      collision-checked random alphanumeric string
 */
class RegistrationNumberService
{
    /**
     * Generate a unique reg_no for a user in the given institution.
     *
     * @param int    $institutionId  The institution the user belongs to
     * @param string $roleKey        Key from config('reg_no.prefixes'), e.g. 'student', 'teaching_staff'
     * @return string  e.g. 'STU-ACME-257KX3P'
     *
     * @throws \InvalidArgumentException If roleKey is not in the config prefixes map
     */
    public function generate(int $institutionId, string $roleKey): string
    {
        $config  = config('reg_no');
        $prefix  = $config['prefixes'][$roleKey]
            ?? throw new \InvalidArgumentException("Unknown role key for reg_no generation: {$roleKey}");
        $orgCode = $this->getOrgCode($institutionId);
        $year    = date('y');
        $sep     = $config['separator'];

        // Retry-safe: generate random, check uniqueness, retry on collision
        $maxAttempts = 10;
        for ($attempt = 0; $attempt < $maxAttempts; $attempt++) {
            $random    = $this->randomString($config['random_length'], $config['random_charset']);
            $candidate = "{$prefix}{$sep}{$orgCode}{$sep}{$year}{$random}";

            if (!User::where('reg_no', $candidate)->exists()) {
                return $candidate;
            }
        }

        // Fallback: extremely unlikely (33M+ combinations per prefix-org-year)
        throw new \RuntimeException("Failed to generate unique reg_no after {$maxAttempts} attempts for {$prefix}-{$orgCode}-{$year}");
    }

    /**
     * Get the organisation code for an institution.
     * Fetches from the parent organization's `code` field.
     */
    protected function getOrgCode(int $institutionId): string
    {
        $code = Organization::whereHas('institutions', fn ($q) => $q->where('id', $institutionId))
            ->value('code');

        if (empty($code)) {
            throw new \RuntimeException("No organization code found for institution ID: {$institutionId}");
        }

        return strtoupper($code);
    }

    /**
     * Generate a random string from the given charset.
     */
    protected function randomString(int $length, string $charset): string
    {
        $charsetLength = strlen($charset);
        $result = '';

        for ($i = 0; $i < $length; $i++) {
            $result .= $charset[random_int(0, $charsetLength - 1)];
        }

        return $result;
    }
}
