<?php

namespace App\Support;

use App\Models\Institution;
use App\Models\User;
use Illuminate\Http\Request;

/**
 * Single source of truth for "where should this user go?"
 *
 * Polymorphic rule chain — first match wins:
 *   1. Inactive + unverified   → verify notice
 *   2. Inactive + verified     → onboarding plan
 *   3. Guard: inactive         → stay (stop cascade)
 *   4. Cross-domain needed     → institution subdomain
 *   5. Force password reset    → /settings/password
 *   6. Active + roles          → landing page from config
 *
 * Every controller and middleware calls resolve() instead of
 * duplicating status / role / domain checks.
 *
 * IMPORTANT: All role queries MUST use withoutGlobalScope('institution_scope')
 * because this resolver runs on the brand domain where no institution context
 * exists — the global scope would filter out every role.
 */
class UserRedirectResolver
{
    /**
     * Ordered rule chain. Each method receives (User, Request) and returns
     * ?RedirectResult. First non-null result wins.
     */
    private const RULES = [
        'inactiveUnverified',
        'inactiveVerified',
        // Guard: inactive users must not cascade into active-user rules
        'inactiveGuard',
        'crossDomain',
        'forcePasswordReset',
        'landingPage',
    ];

    /**
     * Resolve the intended destination for the given user.
     *
     * @return RedirectResult|null  null = no redirect needed (stay on current page)
     */
    public static function resolve(?User $user, Request $request): ?RedirectResult
    {
        if (!$user) {
            return null;
        }

        foreach (self::RULES as $rule) {
            $result = static::$rule($user, $request);
            if ($result !== null) {
                // Stay sentinel: stop the chain, no redirect needed
                return $result->isStay ? null : $result;
            }
        }

        return null;
    }

    // ─── Rule 1: Inactive + not verified ─────────────────────────────────

    private static function inactiveUnverified(User $user, Request $request): ?RedirectResult
    {
        if ($user->status != 0 || $user->email_verified_at) {
            return null;
        }

        return RedirectResult::route('onboarding.verify.notice');
    }

    // ─── Rule 2: Inactive + verified (mid-onboarding) ───────────────────

    private static function inactiveVerified(User $user, Request $request): ?RedirectResult
    {
        if ($user->status != 0 || !$user->email_verified_at) {
            return null;
        }

        // Already on plan page — don't re-redirect
        if ($request->routeIs('onboarding.plan')) {
            return null;
        }

        return RedirectResult::route('onboarding.plan');
    }

    // ─── Guard: stop cascade for inactive users ─────────────────────────

    /**
     * If user is inactive but none of the above rules triggered a redirect
     * (e.g. they're already on the correct onboarding page), return a special
     * "stay" signal to prevent falling through to active-user rules.
     *
     * Returns STAY (null from chain) by halting the loop — implemented as a
     * sentinel that makes resolve() return null.
     */
    private static function inactiveGuard(User $user, Request $request): ?RedirectResult
    {
        // Inactive users must never reach crossDomain/forcePasswordReset/landingPage.
        // Return a "no-redirect" sentinel that exits the chain.
        if ($user->status == 0) {
            return RedirectResult::stay();
        }

        return null;
    }

    // ─── Rule 4: Cross-domain redirect ──────────────────────────────────

    private static function crossDomain(User $user, Request $request): ?RedirectResult
    {
        // Already on an institution subdomain — no cross-domain needed
        if (static::isOnSubdomain()) {
            return null;
        }

        $institution = static::resolveUserInstitution($user);

        if (!$institution?->domain) {
            return null;
        }

        // Build cross-domain URL via single-source-of-truth helper
        $targetRoute = static::resolveTargetRoute($user);
        $url = $institution->buildSubdomainUrl(
            route($targetRoute, [], false),
            $request
        );

        return RedirectResult::url($url);
    }

    // ─── Rule 5: Force password reset for system-generated passwords ────

    private static function forcePasswordReset(User $user, Request $request): ?RedirectResult
    {
        if (!$user->system_generated_password) {
            return null;
        }

        // Already on the password page — don't re-redirect
        if ($request->routeIs('user-password.edit')) {
            return RedirectResult::stay();
        }

        return RedirectResult::route('user-password.edit');
    }

    // ─── Rule 6: Active user with roles → landing page ──────────────────

    private static function landingPage(User $user, Request $request): ?RedirectResult
    {
        $route = static::resolveTargetRoute($user);

        return RedirectResult::route($route);
    }

    // ─── Shared helpers ─────────────────────────────────────────────────

    /**
     * Check if the current request is on an institution subdomain.
     */
    private static function isOnSubdomain(): bool
    {
        return (bool) config('ems.default_institution_id');
    }

    /**
     * Find the user's primary institution via their role scope.
     *
     * Bypasses institution_scope global scope — on brand domain there's no
     * institution context, so the scope would filter out every role.
     *
     * Uses institution_id (not null) for pivot lookup.
     */
    public static function resolveUserInstitution(User $user): ?Institution
    {
        $roleWithScope = $user->roles()
            ->withoutGlobalScope('institution_scope')
            ->wherePivotNotNull('institution_id')
            ->first();

        if (!$roleWithScope?->pivot?->institution_id) {
            return null;
        }

        return Institution::find($roleWithScope->pivot->institution_id);
    }

    /**
     * Resolve the landing route from config/route_permissions.landing_pages.
     *
     * Iterates an ordered permission → route map (first match wins).
     * No hardcoded role names or conditionals — purely permission-based.
     */
    private static function resolveTargetRoute(User $user): string
    {
        $institutionId = InstitutionContext::getActiveInstitutionId($user);

        foreach (config('route_permissions.landing_pages', []) as $permission => $route) {
            if ($user->hasAbility($permission, $institutionId)) {
                return $route;
            }
        }

        return 'dashboard';
    }
}
