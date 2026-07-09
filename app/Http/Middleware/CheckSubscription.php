<?php

namespace App\Http\Middleware;

use App\Models\Organization;
use App\Services\SubscriptionService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Gate routes by subscription module access.
 * Usage: ->middleware('subscription:library') or 'subscription:inventory,transport'
 */
class CheckSubscription
{
    public function __construct(private SubscriptionService $subscriptionService)
    {
    }

    public function handle(Request $request, Closure $next, string ...$modules): Response
    {
        $org = $this->resolveOrganization($request);

        if (!$org) {
            return $next($request);
        }

        if (!$this->isSubscriptionValid($org)) {
            return $this->deny($request, 'Your subscription has expired. Please renew to continue.', 'subscription_expired');
        }

        if (!$this->canAccessAnyModule($org, $modules)) {
            return $this->deny($request, 'This feature is not available on your current plan. Please upgrade.', 'module_locked', $modules);
        }

        return $next($request);
    }

    private function isSubscriptionValid(Organization $org): bool
    {
        return $org->isSubscriptionActive() || $org->isOnTrial();
    }

    private function canAccessAnyModule(Organization $org, array $modules): bool
    {
        foreach ($modules as $module) {
            if ($this->subscriptionService->canAccessModule($org, trim($module))) {
                return true;
            }
        }

        return false;
    }

    private function resolveOrganization(Request $request): ?Organization
    {
        $institution = $request->user()?->institution;

        return $institution?->organization_id
            ? Organization::find($institution->organization_id)
            : null;
    }

    private function deny(Request $request, string $message, string $code, array $modules = []): Response
    {
        if ($request->expectsJson()) {
            $payload = ['success' => false, 'message' => $message, 'code' => $code];
            if ($modules)
                $payload['required_modules'] = $modules;
            return response()->json($payload, 403);
        }

        return redirect()->route('billing.plans')->with('error', $message);
    }
}
