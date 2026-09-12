import React from 'react';
import { useAuth } from '@/hooks/use-can';

interface PermissionGateProps {
    /** Single permission key. */
    can?: string;
    /** Alias for can. */
    permission?: string;
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
    permission,
    feature,
    canAny: canAnyKeys,
    canAll: canAllKeys,
    fallback = null,
    children,
}: PermissionGateProps) {
    const auth = useAuth();
    const requiredPermission = can ?? permission;

    // No gates specified → always render
    if (!requiredPermission && !feature && !canAnyKeys && !canAllKeys) {
        return <>{children}</>;
    }

    let allowed = true;

    if (requiredPermission) allowed &&= auth.can(requiredPermission);
    if (feature) allowed &&= auth.hasFeature(feature);
    if (canAnyKeys && canAnyKeys.length > 0) allowed &&= auth.canAny(canAnyKeys);
    if (canAllKeys && canAllKeys.length > 0) allowed &&= auth.canAll(canAllKeys);

    return <>{allowed ? children : fallback}</>;
}
