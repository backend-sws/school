import { usePage } from '@inertiajs/react';
import { type SharedData, type Auth, type SubscriptionData } from '@/types';

// ---------------------------------------------------------------------------
// Core: single hook that powers everything
// ---------------------------------------------------------------------------

export interface AuthHelpers {
    /** Raw Inertia auth object. */
    auth: Auth;
    /** Raw subscription data (may be null). */
    subscription: SubscriptionData | null;
    /** Does user hold a single permission key? (`""` → true, skips check.) */
    can: (key: string) => boolean;
    /** Does user hold ANY of these permission keys? (OR) */
    canAny: (keys: string[]) => boolean;
    /** Does user hold ALL of these permission keys? (AND) */
    canAll: (keys: string[]) => boolean;
    /** Is a subscription module/add-on active? (`""` or no subscription → true.) */
    hasFeature: (mod: string) => boolean;
    /** Are ANY of these modules active? (OR) */
    hasAnyFeature: (mods: string[]) => boolean;
}

/**
 * Single–`usePage()` hook that exposes every permission and subscription
 * check the app needs.  Call this once per component instead of
 * `useCan` + `useCanAny` + `useCanAll` + `useCanAccessModule` separately.
 */
export function useAuth(): AuthHelpers {
    const { auth, subscription } = usePage<SharedData>().props;
    const permissions = auth?.permissions ?? [];

    // ── permission helpers ──────────────────────────────────────────────
    const can = (key: string): boolean => {
        if (!key) return true;            // no gate
        return permissions.includes(key);
    };

    const canAny = (keys: string[]): boolean => {
        if (!keys.length) return true;
        return keys.some((k) => permissions.includes(k));
    };

    const canAll = (keys: string[]): boolean => {
        if (!keys.length) return true;
        return keys.every((k) => permissions.includes(k));
    };

    // ── subscription / feature helpers ──────────────────────────────────
    const hasFeature = (mod: string): boolean => {
        if (!mod) return true;             // no gate
        if (!subscription) return true;    // no subscription context (public page, etc.)
        return subscription.modules.includes(mod) || subscription.add_ons.includes(mod);
    };

    const hasAnyFeature = (mods: string[]): boolean => {
        if (!mods.length) return true;
        if (!subscription) return true;
        return mods.some((m) => subscription.modules.includes(m) || subscription.add_ons.includes(m));
    };

    return { auth, subscription, can, canAny, canAll, hasFeature, hasAnyFeature };
}

// ---------------------------------------------------------------------------
// Backward-compat thin wrappers (so existing imports keep working)
// ---------------------------------------------------------------------------

/** @deprecated Use `useAuth().auth.permissions` */
export function usePermissions(): string[] {
    const { auth } = useAuth();
    return auth?.permissions ?? [];
}

/** @deprecated Use `useAuth().can(key)` */
export function useCan(key: string): boolean {
    return useAuth().can(key);
}

/** @deprecated Use `useAuth().canAny(keys)` */
export function useCanAny(keys: string[]): boolean {
    return useAuth().canAny(keys);
}

/** @deprecated Use `useAuth().canAll(keys)` */
export function useCanAll(keys: string[]): boolean {
    return useAuth().canAll(keys);
}
