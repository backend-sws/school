<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\WebsiteBuilderService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class WebsiteBuilderController extends Controller
{
    public function __construct(private readonly WebsiteBuilderService $builder)
    {
    }

    /**
     * GET /api/website/themes — list all themes with active flag.
     */
    public function themes(): JsonResponse
    {
        return response()->json([
            'themes' => $this->builder->listThemes(),
        ]);
    }

    /**
     * POST /api/website/themes/activate — set active theme.
     */
    public function activateTheme(Request $request): JsonResponse
    {
        $request->validate([
            'slug' => ['required', 'string', Rule::in($this->builder->getThemeSlugs())],
        ]);

        $theme = $this->builder->activateTheme($request->input('slug'));

        return response()->json([
            'message' => "Theme '{$theme->name}' activated.",
            'theme'   => $theme,
        ]);
    }

    /**
     * GET /api/website/sections/{page} — get section order for a page.
     */
    public function sections(string $page = 'home'): JsonResponse
    {
        return response()->json([
            'sections' => $this->builder->getSectionOrder($page),
        ]);
    }

    /**
     * POST /api/website/sections/{page}/reorder — bulk reorder sections.
     */
    public function reorderSections(Request $request, string $page = 'home'): JsonResponse
    {
        $request->validate([
            'sections'              => 'required|array',
            'sections.*.section_id' => 'required|string',
            'sections.*.sort_order' => 'required|integer|min:0',
            'sections.*.is_visible' => 'sometimes|boolean',
        ]);

        $this->builder->reorderSections($page, $request->input('sections'));

        return response()->json([
            'message'  => 'Sections reordered.',
            'sections' => $this->builder->getSectionOrder($page),
        ]);
    }

    /**
     * PATCH /api/website/sections/{page}/{section} — toggle visibility.
     */
    public function toggleSection(Request $request, string $page, string $section): JsonResponse
    {
        $request->validate([
            'is_visible' => 'required|boolean',
        ]);

        $this->builder->toggleSection($page, $section, $request->boolean('is_visible'));

        return response()->json([
            'message' => 'Section visibility updated.',
        ]);
    }

    // ─── Navigation / Footer Config ──────────────────────────────

    /**
     * GET /api/website/builder/nav — get website nav config.
     */
    public function getNavConfig(): JsonResponse
    {
        return response()->json([
            'config' => $this->builder->getNavConfig(),
        ]);
    }

    /**
     * POST /api/website/builder/nav — save website nav config.
     */
    public function saveNavConfig(Request $request): JsonResponse
    {
        $request->validate([
            'footer_description'      => 'sometimes|nullable|string|max:500',
            'top_bar_tag'             => 'sometimes|nullable|string|max:100',
            'privacy_policy_url'      => 'sometimes|nullable|string|max:255',
            'terms_of_service_url'    => 'sometimes|nullable|string|max:255',
            'sitemap_url'             => 'sometimes|nullable|string|max:255',
            'custom_nav_items'        => 'sometimes|nullable|array',
            'custom_footer_sections'  => 'sometimes|nullable|array',
            'custom_utility_links'    => 'sometimes|nullable|array',
            'custom_important_links'  => 'sometimes|nullable|array',
        ]);

        $this->builder->saveNavConfig($request->only([
            'footer_description',
            'top_bar_tag',
            'privacy_policy_url',
            'terms_of_service_url',
            'sitemap_url',
            'custom_nav_items',
            'custom_footer_sections',
            'custom_utility_links',
            'custom_important_links',
        ]));

        return response()->json([
            'message' => 'Navigation config saved.',
            'config'  => $this->builder->getNavConfig(),
        ]);
    }
}
