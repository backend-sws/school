<?php

namespace App\Http\Middleware;

use App\Http\Controllers\Api\V1\Auth\AuthShareController;
use App\Http\Controllers\Api\V1\Organization\InstitutionProfileController;
use App\Services\SubscriptionService;
use App\Services\WebsiteBuilderService;
use Illuminate\Foundation\Inspiring;
use Illuminate\Http\Request;
use Inertia\Middleware;

/**
 * Share default Inertia props: auth, institution, subscription, sidebar, quote.
 */
class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'app_url' => config('app.url'),
            'quote' => $this->resolveQuote(),
            'auth' => fn() => AuthShareController::getAuth($request),
            'sidebarOpen' => $this->resolveSidebarState($request),
            'institution' => fn() => InstitutionProfileController::getProfile(),
            'subscription' => fn() => $this->resolveSubscription($request),
            'branding' => [
                'powered_by'          => config('ems_branding.powered_by'),
                'powered_by_url'      => config('ems_branding.powered_by_url'),
                'designed_by'         => config('ems_branding.designed_by'),
                'designed_by_url'     => config('ems_branding.designed_by_url'),
                'copyright_by'        => config('ems_branding.copyright_by'),
                'site_url'            => config('ems_branding.site_url'),
                'brand_name'          => config('ems_branding.brand_name'),
                'default_brand_theme' => config('ems.default_brand_theme'),
            ],
            // Website CMS nav config (DB overrides for footer, links, etc.)
            'websiteNav' => fn() => $this->resolveWebsiteNav(),
        ];
    }

    private function resolveQuote(): array
    {
        [$message, $author] = str(Inspiring::quotes()->random())->explode('-');

        return ['message' => trim($message), 'author' => trim($author)];
    }

    private function resolveSidebarState(Request $request): bool
    {
        return !$request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true';
    }

    private function resolveSubscription(Request $request): ?array
    {
        $org = $request->user()?->activeOrganization();

        return $org ? app(SubscriptionService::class)->getUsage($org) : null;
    }

    private function resolveWebsiteNav(): array
    {
        try {
            return app(WebsiteBuilderService::class)->getNavConfig();
        } catch (\Throwable) {
            return [];
        }
    }
}
