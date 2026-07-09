import React from 'react';
import { useAuth } from '@/hooks/use-can';

interface PermissionGateProps {
    /** Single permission key. */
    can?: string;
    /** Subscription module key. */
    feature?: string;
    /** Show if user has ANY of these permissions (OR). */
    canAny?: string[];
    /** Show if user has ALL of these permissions (AND). */
    canAll?: string[];
    /** Rendered when denied. Default: null. */
    fallback?: React.ReactNode;
    children: React.ReactNode;
}

/**
 * Declarative permission + feature gate.
 *
 * Uses a single `useAuth()` hook internally (one `usePage()` call).
 *
 * @example
 * <PermissionGate can="manage_users">
 *   <Button>Create User</Button>
 * </PermissionGate>
 *
 * @example
 * <PermissionGate can="view_students" feature="core">
 *   <StudentList />
 * </PermissionGate>
 */
export function PermissionGate({
    can,
    feature,
    canAny: canAnyKeys,
    canAll: canAllKeys,
    fallback = null,
    children,
}: PermissionGateProps) {
    const auth = useAuth();

    // No gates specified → always render
    if (!can && !feature && !canAnyKeys && !canAllKeys) {
        return <>{children}</>;
    }

    let allowed = true;

    if (can) allowed &&= auth.can(can);
    if (feature) allowed &&= auth.hasFeature(feature);
    if (canAnyKeys && canAnyKeys.length > 0) allowed &&= auth.canAny(canAnyKeys);
    if (canAllKeys && canAllKeys.length > 0) allowed &&= auth.canAll(canAllKeys);

    return <>{allowed ? children : fallback}</>;
}
