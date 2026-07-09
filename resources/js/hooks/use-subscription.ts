import { SharedData, SubscriptionData } from '@/types';
import { usePage } from '@inertiajs/react';
import { useAuth } from './use-can';

/**
 * Hook to access raw organization subscription data.
 */
export function useSubscription(): SubscriptionData | null {
    const { subscription } = usePage<SharedData>().props;
    return subscription;
}

/** @deprecated Use `useAuth().hasFeature(moduleName)` */
export function useCanAccessModule(moduleName: string): boolean {
    return useAuth().hasFeature(moduleName);
}

/** @deprecated Use `useAuth().hasAnyFeature(moduleNames)` */
export function useCanAccessAnyModule(moduleNames: string[]): boolean {
    return useAuth().hasAnyFeature(moduleNames);
}

/**
 * Hook to check if subscription is currently active (not expired).
 */
export function useIsSubscriptionActive(): boolean {
    const subscription = useSubscription();
    if (!subscription) return true;
    return subscription.is_active || subscription.is_trial;
}
