<?php

namespace App\Http\Middleware;

use App\Models\Setting;
use App\Support\InstitutionContext;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\View;
use Symfony\Component\HttpFoundation\Response;

/**
 * Share SEO settings (favicon, meta tags) with app.blade.php.
 */
class ShareSeoSettings
{
    public const CACHE_KEY_PREFIX = 'seo_settings_';
    public const CACHE_TTL_SECONDS = 3600;

    public function handle(Request $request, Closure $next): Response
    {
        $this->shareSeo();

        return $next($request);
    }

    private function shareSeo(): void
    {
        $institutionId = $this->resolveInstitutionId();
        $seo = $this->loadSettings($institutionId);
        View::share('seo', $seo);
    }

    private function resolveInstitutionId(): int
    {
        if (auth()->check()) {
            $id = InstitutionContext::getActiveInstitutionId(auth()->user());
            if ($id !== null) {
                return (int) $id;
            }
        }

        return (int) config('ems.default_institution_id', 1);
    }

    private function loadSettings(int $institutionId): array
    {
        $dbSettings = Cache::remember(
            self::CACHE_KEY_PREFIX . $institutionId,
            self::CACHE_TTL_SECONDS,
            fn() => Setting::withoutGlobalScopes()
                ->where('institution_id', $institutionId)
                ->where('setting_group', 'seo')
                ->pluck('setting_value', 'setting_key')
                ->all()
        ) ?: [];

        $brandName = config('ems_branding.brand_name');

        // Merge env defaults — DB values take priority if set
        $defaults = [
            'meta_title' => $brandName . ' — Modern Education Management System',
            'meta_description' => $brandName . ' is a comprehensive education management platform for schools, colleges, and universities. Manage admissions, fees, attendance, LMS, and more.',
            'favicon_url' => null,
            'og_image' => null,
            'brand_name' => $brandName,
            'site_url' => config('ems_branding.site_url'),
            'powered_by' => config('ems_branding.powered_by'),
        ];

        return array_merge($defaults, array_filter($dbSettings, fn($v) => $v !== null && $v !== ''));
    }

    public static function clearCache(?int $institutionId = null): void
    {
        $id = $institutionId ?? (int) config('ems.default_institution_id', 1);
        Cache::forget(self::CACHE_KEY_PREFIX . $id);
    }
}
