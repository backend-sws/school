<?php

namespace App\Support;

/**
 * Polymorphic helper for email template design tokens.
 *
 * Every Blade email layout and template calls EmailTemplate::tokens()
 * to get a flat array of CSS-ready values. The tokens come from
 * config('ems.email') so institutions can override via .env or
 * config publishing without touching any Blade file.
 *
 * Usage in Blade:
 *   @php($t = \App\Support\EmailTemplate::tokens())
 *   <td style="background:{{ $t['gradient'] }};">
 */
class EmailTemplate
{
    /**
     * Resolved token cache (per-request).
     *
     * @var array<string, string>|null
     */
    protected static ?array $cache = null;

    /**
     * Return all design tokens as a flat key→value array.
     *
     * @return array<string, string>
     */
    public static function tokens(): array
    {
        if (static::$cache !== null) {
            return static::$cache;
        }

        $c = config('ems.email.colors', []);
        $b = config('ems.email.brand', []);

        static::$cache = [
            // Gradient helpers
            'gradient' => "linear-gradient(135deg,{$c['primary']} 0%,{$c['primary_end']} 100%)",
            'gradient_full' => "linear-gradient(135deg,{$c['primary']} 0%,{$c['primary_end']} 50%,{$c['accent']} 100%)",

            // Colors
            'primary' => $c['primary'] ?? '#1a1a2e',
            'primary_end' => $c['primary_end'] ?? '#0f3460',
            'accent' => $c['accent'] ?? '#e94560',
            'bg' => $c['bg'] ?? '#f0f2f5',
            'card' => $c['card'] ?? '#ffffff',
            'text' => $c['text'] ?? '#334155',
            'text_muted' => $c['text_muted'] ?? '#64748b',
            'text_faint' => $c['text_faint'] ?? '#94a3b8',
            'border' => $c['border'] ?? '#e2e8f0',
            'info_bg' => $c['info_bg'] ?? '#f8fafc',
            'fallback_bg' => $c['fallback_bg'] ?? '#f1f5f9',
            'footer_bg' => $c['footer_bg'] ?? '#1a1a2e',
            'footer_text' => $c['footer_text'] ?? 'rgba(255,255,255,0.7)',
            'footer_faint' => $c['footer_faint'] ?? 'rgba(255,255,255,0.3)',
            'btn_shadow' => $c['btn_shadow'] ?? 'rgba(15,52,96,0.3)',

            // Brand
            'powered_by' => $b['powered_by'] ?? 'Sutracode',
            'powered_by_url' => $b['powered_by_url'] ?? 'https://sutracode.com',
            'designed_by' => $b['designed_by'] ?? 'Sutracode',
            'designed_by_url' => $b['designed_by_url'] ?? 'https://sutracode.com',
            'copyright_by' => $b['copyright_by'] ?? null,
            'site_url' => $b['site_url'] ?? null,
        ];

        return static::$cache;
    }

    /**
     * Get a single token value.
     */
    public static function get(string $key, string $default = ''): string
    {
        return static::tokens()[$key] ?? $default;
    }

    /**
     * Clear the per-request cache (useful in tests).
     */
    public static function flush(): void
    {
        static::$cache = null;
    }
}
