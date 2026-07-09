<?php

namespace App\Http\Controllers\Web;

use App\Models\Institution;
use App\Models\Organization;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Super Admin landing: analytics overview and audit log link.
 */
class SuperAdminLandingController
{
    /**
     * Show super admin landing with summary stats and analytics.
     */
    public function __invoke(Request $request): Response
    {
        $organizations = Organization::with('subscription')->get();

        $tierBreakdown = $organizations
            ->map(fn($org) => $org->subscription?->resolvedTier()?->value ?? 'starter')
            ->countBy()
            ->toArray();

        $activeTrials = $organizations->filter(fn($org) => $org->isOnTrial())->count();

        $totalMonthlyRevenue = $organizations->filter(fn($org) => $org->isSubscriptionActive() && !$org->isOnTrial())
            ->sum(fn($org) => $org->subscription?->resolvedTier()?->monthlyPrice() ?? 0);

        return Inertia::render('admin/super-admin-landing', [
            'summary' => [
                'institutions_count' => Institution::withoutGlobalScopes()->count(),
                'organizations_count' => $organizations->count(),
                'active_trials' => $activeTrials,
                'monthly_revenue' => $totalMonthlyRevenue,
                'tier_breakdown' => $tierBreakdown,
            ],
            'organizations' => $organizations->map(fn($org) => [
                'id' => $org->id,
                'name' => $org->name,
                'tier' => $org->subscription?->resolvedTier()?->value ?? 'starter',
                'status' => $org->isSubscriptionActive() ? 'Active' : ($org->isExpired() ? 'Expired' : 'Inactive'),
                'ends_at' => $org->subscription?->subscription_end?->toDateString(),
                'institutions_count' => Institution::withoutGlobalScopes()->where('organization_id', $org->id)->count(),
            ]),
        ]);
    }
}
