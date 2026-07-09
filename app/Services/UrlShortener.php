<?php

namespace App\Services;

use App\Models\ShortUrl;
use Illuminate\Support\Str;

/**
 * In-house URL Shortener.
 *
 * Uses SMS_SHORT_URL_BASE env for compact SMS links (under 30 chars).
 * Falls back to APP_URL if not set.
 *
 * Usage:
 *   $short = UrlShortener::shorten('https://school.example.com/set-password?token=abc');
 *   // => "https://pds.in/s/aB3kZ" (if SMS_SHORT_URL_BASE=https://pds.in)
 *   // => "https://pdseducation.tech/s/aB3kZ7m" (fallback)
 *
 *   $short = UrlShortener::shorten($url, now()->addDays(7));
 *   // => expires in 7 days
 */
class UrlShortener
{
    /**
     * Generate a short URL and return the full shortened link.
     *
     * Uses SMS_SHORT_URL_BASE for shorter domains (DLT CTA whitelisting).
     * Example: SMS_SHORT_URL_BASE=https://pds.in → https://pds.in/s/aB3kZ (25 chars)
     */
    public static function shorten(string $originalUrl, ?\DateTimeInterface $expiresAt = null): string
    {
        $code = self::generateUniqueCode();

        ShortUrl::create([
            'code'         => $code,
            'original_url' => $originalUrl,
            'expires_at'   => $expiresAt,
        ]);

        // Resolve the base URL for shortening.
        // Priority: SMS_SHORT_URL_BASE (DLT-whitelisted domain) -> APP_URL
        $base = config('services.sms.short_url_base') ?: config('app.url');

        // Safety: If both are empty (unlikely but possible in misconfigured env),
        // fallback to the current request host or a generic schema-relative link
        if (empty($base)) {
            $base = request()->getSchemeAndHttpHost();
        }

        $base = rtrim($base, '/');
        
        // Ensure the base has a protocol (guarantees absolute URL for DLT compliance)
        if (!str_starts_with($base, 'http')) {
            $base = 'https://' . ltrim($base, '/');
        }

        return "{$base}/{$code}";
    }

    /**
     * Resolve a short code to the original URL.
     * Returns null if not found or expired.
     */
    public static function resolve(string $code): ?string
    {
        $shortUrl = ShortUrl::where('code', $code)->first();

        if (!$shortUrl || $shortUrl->isExpired()) {
            return null;
        }

        $shortUrl->recordClick();

        return $shortUrl->original_url;
    }

    /**
     * Generate a unique 4-character alphanumeric code.
     * 4 chars = 62^4 ≈ 1.4M combinations — plenty for SMS links.
     */
    private static function generateUniqueCode(int $length = 4): string
    {
        do {
            $code = Str::random($length);
        } while (ShortUrl::where('code', $code)->exists());

        return $code;
    }
}

