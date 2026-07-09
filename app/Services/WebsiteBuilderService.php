<?php

namespace App\Services;

use App\Models\Setting;
use App\Models\WebsiteTheme;
use App\Models\WebsiteSectionOrder;

use Illuminate\Support\Collection;

class WebsiteBuilderService
{
    // ─── Theme Management ────────────────────────────────────────

    /**
     * Canonical theme catalog — aligned with brand-palettes.css and STATIC_THEMES.
     */
    public function getThemeCatalog(): array
    {
        return require database_path('seeders/data/website_themes.php');
    }

    /**
     * All valid theme slugs from the catalog.
     */
    public function getThemeSlugs(): array
    {
        return array_column($this->getThemeCatalog(), 'slug');
    }

    /**
     * Seed all catalog themes into the database (idempotent).
     */
    public function syncThemeCatalog(): void
    {
        foreach ($this->getThemeCatalog() as $theme) {
            WebsiteTheme::updateOrCreate(
                ['slug' => $theme['slug']],
                $theme
            );
        }
    }

    /**
     * Ensure a theme row exists for the given slug, creating from catalog if needed.
     */
    public function ensureTheme(string $slug): WebsiteTheme
    {
        $entry = collect($this->getThemeCatalog())->firstWhere('slug', $slug);

        if ($entry === null) {
            throw new \InvalidArgumentException("Unknown theme slug: {$slug}");
        }

        return WebsiteTheme::updateOrCreate(
            ['slug' => $entry['slug']],
            $entry
        );
    }

    /**
     * Get the currently active theme for this institution.
     * Reads from settings table (group: website_branding, key: brand_theme).
     */
    public function getActiveTheme(): ?WebsiteTheme
    {
        $slug = Setting::getBranding('brand_theme') ?? 'royal';

        return WebsiteTheme::where('slug', $slug)->first()
            ?? $this->ensureTheme($slug);
    }

    /**
     * Activate a theme for the current institution.
     * Writes slug to settings table — CSS is handled by brand-palettes.css.
     */
    public function activateTheme(string $slug): WebsiteTheme
    {
        $theme = $this->ensureTheme($slug);

        Setting::setBranding('brand_theme', $slug);

        // Bust the shared Inertia institution profile cache
        \App\Http\Controllers\Api\V1\Organization\InstitutionProfileController::clearProfileCache();

        return $theme;
    }

    /**
     * Get all available themes with active flag.
     */
    public function listThemes(): Collection
    {
        if (WebsiteTheme::count() === 0) {
            $this->syncThemeCatalog();
        }

        $activeSlug = Setting::getBranding('brand_theme') ?? 'royal';

        return WebsiteTheme::all()->map(fn(WebsiteTheme $t) => [
            'id'             => $t->id,
            'slug'           => $t->slug,
            'name'           => $t->name,
            'category'       => $t->category,
            'description'    => $t->description,
            'preview_colors' => $t->preview_colors,
            'preview_image'  => $t->preview_image,
            'is_active'      => $t->slug === $activeSlug,
        ]);
    }

    // ─── Section Management ──────────────────────────────────────

    /**
     * Get ordered, visible sections for a given page.
     */
    public function getSectionOrder(string $pageSlug = 'home'): Collection
    {
        return WebsiteSectionOrder::where('page_slug', $pageSlug)
            ->orderBy('sort_order')
            ->get()
            ->map(fn(WebsiteSectionOrder $s) => [
                'section_id'   => $s->section_id,
                'sort_order'   => $s->sort_order,
                'is_visible'   => $s->is_visible,
                'custom_props' => $s->custom_props,
            ]);
    }

    /**
     * Bulk reorder sections for a page.
     */
    public function reorderSections(string $pageSlug, array $sections): void
    {
        foreach ($sections as $item) {
            WebsiteSectionOrder::updateOrCreate(
                [
                    'page_slug'  => $pageSlug,
                    'section_id' => $item['section_id'],
                ],
                [
                    'sort_order'   => $item['sort_order'],
                    'is_visible'   => $item['is_visible'] ?? true,
                    'custom_props' => $item['custom_props'] ?? null,
                ]
            );
        }
        \App\Http\Controllers\Api\V1\Organization\InstitutionProfileController::clearProfileCache();
    }

    /**
     * Toggle visibility of a single section on a page.
     */
    public function toggleSection(string $pageSlug, string $sectionId, bool $visible): void
    {
        WebsiteSectionOrder::updateOrCreate(
            [
                'page_slug'  => $pageSlug,
                'section_id' => $sectionId,
            ],
            ['is_visible' => $visible]
        );
        \App\Http\Controllers\Api\V1\Organization\InstitutionProfileController::clearProfileCache();
    }

    /**
     * Seed default section order for an institution type.
     */
    public function seedDefaultSections(string $institutionType, string $pageSlug = 'home'): void
    {
        $defaults = config("website_sections.{$institutionType}", []);

        if (empty($defaults)) {
            return;
        }

        foreach ($defaults as $index => $section) {
            WebsiteSectionOrder::firstOrCreate(
                [
                    'page_slug'  => $pageSlug,
                    'section_id' => $section['id'],
                ],
                [
                    'sort_order' => $index,
                    'is_visible' => true,
                ]
            );
        }
    }

    // ─── Navigation / Footer Config ──────────────────────────────

    /**
     * Navigation config keys stored in settings table.
     */
    private const NAV_SETTINGS_GROUP = 'website_nav';

    private const NAV_SETTING_KEYS = [
        'footer_description',
        'top_bar_tag',
        'privacy_policy_url',
        'terms_of_service_url',
        'sitemap_url',
        'custom_nav_items',       // JSON string
        'custom_footer_sections', // JSON string
        'custom_utility_links',   // JSON string
        'custom_important_links', // JSON string
    ];

    /**
     * Get website navigation config for this institution.
     * Returns only non-null settings — frontend merges with type defaults.
     */
    public function getNavConfig(): array
    {
        $settings = Setting::where('setting_group', self::NAV_SETTINGS_GROUP)
            ->whereIn('setting_key', self::NAV_SETTING_KEYS)
            ->pluck('setting_value', 'setting_key')
            ->toArray();

        // Decode JSON fields
        foreach (['custom_nav_items', 'custom_footer_sections', 'custom_utility_links', 'custom_important_links'] as $jsonKey) {
            if (isset($settings[$jsonKey])) {
                $settings[$jsonKey] = json_decode($settings[$jsonKey], true);
            }
        }

        return $settings;
    }

    /**
     * Save website navigation config for this institution.
     */
    public function saveNavConfig(array $data): void
    {
        $allowed = array_flip(self::NAV_SETTING_KEYS);

        foreach ($data as $key => $value) {
            if (!isset($allowed[$key])) continue;

            // Encode arrays/objects as JSON
            $storedValue = is_array($value) ? json_encode($value) : (string) $value;

            Setting::updateOrCreate(
                [
                    'setting_group' => self::NAV_SETTINGS_GROUP,
                    'setting_key'   => $key,
                ],
                [
                    'setting_value' => $storedValue,
                ]
            );
        }
        \App\Http\Controllers\Api\V1\Organization\InstitutionProfileController::clearProfileCache();
    }

    // ─── Helpers ─────────────────────────────────────────────────
}
