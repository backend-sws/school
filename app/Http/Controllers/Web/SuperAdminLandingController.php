<?php

namespace App\Http\Controllers\Web;

use App\Models\Institution;
use App\Models\Organization;
use App\Models\Role;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
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

        $institutions = Institution::withoutGlobalScopes()
            ->with(['organization', 'domains'])
            ->get()
            ->map(fn($inst) => [
                'id' => $inst->id,
                'name' => $inst->name,
                'type' => $inst->type->value ?? 'school',
                'status' => $inst->status === 1 ? 'Active' : 'Inactive',
                'udise_code' => $inst->udise_code,
                'org_name' => $inst->organization->name ?? 'N/A',
                'domain' => $inst->domains->first()?->domain ?? 'N/A',
            ]);

        return Inertia::render('admin/super-admin-landing', [
            'summary' => [
                'institutions_count' => count($institutions),
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
            'institutions' => $institutions,
        ]);
    }

    /**
     * Onboard a new school (Institution) and Organization.
     */
    public function onboard(Request $request)
    {
        $validated = $request->validate([
            // Org Details
            'org_name' => 'required|string|max:100',
            'plan_key' => 'required|string|in:starter,professional,enterprise,plus',
            'billing_cycle' => 'required|string|in:monthly,annual',
            // School Details
            'inst_name' => 'required|string|max:100',
            'inst_type' => 'required|string|in:school,college,university,coaching',
            'slug' => 'required|string|max:50|alpha_dash|unique:institution_domains,domain',
            'udise_code' => 'nullable|string|max:50',
            'brand_theme' => 'nullable|string|in:nature,royal,vibrant,heritage,intelligence,serenity,energy,oxford,crimson,teal,sunset,forest,plum,cobalt,rose,slate,jade,saffron,pdseducation,navratri',
            // Admin user details
            'admin_name' => 'required|string|max:100',
            'admin_email' => 'required|email|max:150|unique:users,email',
            'admin_mobile' => 'nullable|regex:/^\+?\d{1,4}\d{6,14}$/|unique:users,mobile',
            'admin_password' => 'required|string|min:8|max:72',
        ]);

        // Create the admin user
        $user = User::create([
            'name' => $validated['admin_name'],
            'email' => $validated['admin_email'],
            'mobile' => $validated['admin_mobile'] ?? null,
            'password' => Hash::make($validated['admin_password']),
            'status' => 1,
            'email_verified_at' => now(),
        ]);

        // Sync standard institution admin role key
        $role = Role::withoutGlobalScope('institution_scope')->where('key', 'institution_admin')->first();
        if ($role) {
            $user->roles()->syncWithoutDetaching([
                $role->id => [
                    'institution_id' => null,
                    'assigned_at' => now(),
                ]
            ]);
        }

        // Provision organization & school
        $onboardingService = app(\App\Services\OnboardingService::class);
        $institution = $onboardingService->provision(
            $user,
            [
                'org_name' => $validated['org_name'],
                'inst_name' => $validated['inst_name'],
                'inst_type' => \App\Enums\InstitutionType::from($validated['inst_type']),
                'slug' => $validated['slug'],
                'udise_code' => $validated['udise_code'] ?? null,
                'brand_theme' => $validated['brand_theme'] ?? 'nature',
            ],
            [
                'plan_key' => $validated['plan_key'],
                'billing_cycle' => $validated['billing_cycle'],
            ]
        );

        return redirect()->back()->with('success', "School '{$institution->name}' onboarded successfully!");
    }
}
