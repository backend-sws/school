<?php

namespace App\Http\Controllers\Api\V1\Organization;

use App\Enums\InstitutionType;
use App\Models\Institution;
use App\Models\Setting;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\URL;

class InstitutionProfileController
{
    /**
     * Get institution profile info, cached for 1 hour.
     *
     * Primary source: institutions table (name, code, address, city, state, pincode, phone, email, website, logo_url).
     * Extra fields: settings table (short_name, motto, established_year).
     * logo_url is resolved to a full URL so the frontend can use it directly (no auth required for public logo).
     */
    public static function getProfile(): array
    {
        $institutionId = config('ems.default_institution_id');

        if (!$institutionId) {
            return [
                'name' => config('app.name'),
                'short_name' => 'EMS',
                'motto' => 'Next-Gen Education Management',
                'logo_url' => null, // Only from DB — no local assets
                'is_brand' => true,
                'type' => 'brand',
                'type_label' => 'Product',
                'profile_settings_title' => 'Product Profile',
                'address' => '',
                'city' => '',
                'state' => '',
                'pincode' => '',
                'phone' => '',
                'email' => '',
                'website' => '',
                'established' => '',
                'auth_panel' => [
                    'quote' => [
                        'message' => 'The future of education management is here.',
                        'author' => 'SutraCode Team',
                    ],
                    'features' => [
                        ['label' => 'Multi-Tenant Architecture', 'href' => '#'],
                        ['label' => 'Scalable Solutions', 'href' => '#'],
                    ],
                ],
            ];
        }

        $institutionId = (int) $institutionId;
        $cached = Cache::remember('institution_profile_' . $institutionId, 3600, function () use ($institutionId) {
            $institution = Institution::find($institutionId);

            // Extra fields only available in the settings table
            $settings = self::getSettingsByGroup('general');
            $social = self::getSettingsByGroup('social');
            $authSettings = self::getSettingsByGroup('auth_panel');

            $typeRaw = $institution?->type;
            $type = $typeRaw instanceof InstitutionType ? $typeRaw->value : (is_string($typeRaw) ? $typeRaw : config('ems.default_institution_type'));

            return [
                'name' => $institution?->name ?? config('app.name'),
                'code' => $institution?->code ?? '',
                'address' => $institution?->address ?? $social['full_address'] ?? '',
                'city' => $institution?->city ?? $social['contact_city'] ?? '',
                'state' => $institution?->state ?? $social['contact_state'] ?? '',
                'pincode' => $institution?->pincode ?? $social['contact_pincode'] ?? '',
                'phone' => $institution?->phone ?? $social['contact_phone'] ?? '',
                'email' => $institution?->email ?? $social['contact_email'] ?? '',
                'website' => $institution?->website ?? '',
                'logo_path' => $institution?->logo_url ?? $settings['college_logo'] ?? null,
                'type' => $type,
                'is_brand' => false,
                'type_label' => self::institutionTypeLabel($type),
                'profile_settings_title' => self::profileSettingsTitle($type),
                // Extra from settings
                'short_name' => $settings['college_short_name'] ?? '',
                'motto' => $settings['college_motto'] ?? '',
                'established' => $settings['established_year'] ?? '',
                // Brand tokens (from settings table — website_branding group)
                'brand_theme' => Setting::getBranding('brand_theme'),
                'brand_font' => Setting::getBranding('brand_font'),
                'brand_color' => Setting::getBranding('brand_color'),
                // Auth panel (login left side): config per institution
                'auth_panel' => self::buildAuthPanel($authSettings),
            ];
        });

        $rawLogo = $cached['logo_path'] ?? $cached['logo_url'] ?? null;
        $cached['logo_url'] = self::resolveLogoUrl($rawLogo);
        unset($cached['logo_path']);

        return $cached;
    }

    /**
     * Clear institution profile cache (call on logout, institution update, etc.).
     */
    public static function clearProfileCache(): void
    {
        $institutionId = config('ems.default_institution_id');
        if ($institutionId) {
            Cache::forget('institution_profile_' . (int) $institutionId);
        }
    }

    /**
     * Base64 data URI for embedding the institution logo in PDFs / server-rendered views.
     */
    public static function getLogoDataUri(): ?string
    {
        $path = self::getRawLogoPath();
        if (empty($path) || ! is_string($path)) {
            return null;
        }
        $path = trim($path);

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            try {
                $contents = @file_get_contents($path);
                if ($contents === false) {
                    return null;
                }
                $mime = self::guessImageMime($contents) ?? 'image/png';

                return 'data:' . $mime . ';base64,' . base64_encode($contents);
            } catch (\Throwable) {
                return null;
            }
        }

        if (str_starts_with($path, '/')) {
            $absolute = public_path($path);
            if (! is_file($absolute)) {
                return null;
            }
            $mime = mime_content_type($absolute) ?: 'image/png';

            return 'data:' . $mime . ';base64,' . base64_encode((string) file_get_contents($absolute));
        }

        try {
            $r2 = app(\App\Services\R2Service::class);
            $object = $r2->getObject($path);
            if (! $object) {
                return null;
            }
            $contents = $object['Body']->getContents();
            $mime = $object['ContentType'] ?? self::guessImageMime($contents) ?? 'image/png';

            return 'data:' . $mime . ';base64,' . base64_encode($contents);
        } catch (\Throwable) {
            return null;
        }
    }

    private static function guessImageMime(string $bytes): ?string
    {
        if (str_starts_with($bytes, "\xFF\xD8\xFF")) {
            return 'image/jpeg';
        }
        if (str_starts_with($bytes, "\x89PNG\r\n\x1a\n")) {
            return 'image/png';
        }
        if (str_starts_with($bytes, 'GIF87a') || str_starts_with($bytes, 'GIF89a')) {
            return 'image/gif';
        }
        if (str_starts_with($bytes, 'RIFF') && str_contains(substr($bytes, 0, 16), 'WEBP')) {
            return 'image/webp';
        }

        return null;
    }

    /**
     * Resolve stored logo path to a URL the frontend can use (works without auth).
     * - null/empty → null
     * - http(s) → as-is
     * - path starting with / → asset URL (public file)
     * - R2 path (e.g. uploads/...) → public institution-logo endpoint URL
     */
    public static function resolveLogoUrl(?string $rawLogo): ?string
    {
        if (empty($rawLogo)) {
            return null;
        }
        $rawLogo = trim($rawLogo);
        if (str_starts_with($rawLogo, 'http://') || str_starts_with($rawLogo, 'https://')) {
            return $rawLogo;
        }
        if (str_starts_with($rawLogo, '/')) {
            return null; // No local asset fallback — logo must come from DB/R2
        }
        // R2 path exists — serve via the public endpoint
        return URL::to(URL::route('api.public.institution-logo'));
    }

    /**
     * Raw logo path from DB/settings (for backend use, e.g. streaming).
     */
    public static function getRawLogoPath(): ?string
    {
        $institutionId = config('ems.default_institution_id');
        $institution = Institution::find($institutionId);
        $settings = self::getSettingsByGroup('general');

        return $institution?->logo_url ?? $settings['college_logo'] ?? null;
    }

    /**
     * Build auth panel config from auth_panel settings (quote + feature links).
     * Stored as: auth_quote_message, auth_quote_author, auth_features (JSON array of { "label": "...", "href": "..." }).
     */
    private static function buildAuthPanel(array $auth): array
    {
        $quoteMessage = $auth['auth_quote_message'] ?? null;
        $quoteAuthor = $auth['auth_quote_author'] ?? null;
        $featuresJson = $auth['auth_features'] ?? null;
        $features = [];
        if (!empty($featuresJson) && is_string($featuresJson)) {
            $decoded = json_decode($featuresJson, true);
            if (is_array($decoded)) {
                foreach ($decoded as $item) {
                    if (is_array($item) && !empty($item['label'])) {
                        $features[] = [
                            'label' => $item['label'],
                            'href' => $item['href'] ?? '#',
                        ];
                    }
                }
            }
        }

        return [
            'quote' => [
                'message' => $quoteMessage,
                'author' => $quoteAuthor,
            ],
            'features' => $features,
        ];
    }

    /**
     * Helper: Get settings by group as key-value array.
     */
    private static function getSettingsByGroup(string $group): array
    {
        return Setting::where('setting_group', $group)
            ->get()
            ->pluck('setting_value', 'setting_key')
            ->all();
    }

    private static function institutionTypeLabel(string $type): string
    {
        return match ($type) {
            'school' => 'School',
            'college' => 'College',
            'coaching' => 'Coaching',
            'university' => 'University',
            default => 'Institution',
        };
    }

    private static function profileSettingsTitle(string $type): string
    {
        return match ($type) {
            'school' => 'School Profile',
            'college' => 'College Profile',
            'coaching' => 'Coaching Profile',
            'university' => 'University Profile',
            default => 'Institution Profile',
        };
    }
}
