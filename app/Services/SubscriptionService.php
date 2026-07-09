<?php

namespace App\Services;

use App\Enums\SubscriptionTier;
use App\Models\Institution;
use App\Models\Organization;
use App\Models\Subscription;
use Illuminate\Support\Facades\DB;

class SubscriptionService
{
    /**
     * Get the resolved subscription tier for an organization.
     */
    public function getTier(Organization $org): SubscriptionTier
    {
        return $org->activeSubscription()->resolvedTier();
    }

    /**
     * Check if a module is accessible for the organization.
     */
    public function canAccessModule(Organization $org, string $module): bool
    {
        return $org->activeSubscription()->hasModule($module);
    }

    /**
     * Check if the organization has reached its institution limit.
     */
    public function hasReachedInstitutionLimit(Organization $org): bool
    {
        $sub = $org->activeSubscription();
        $current = $org->institutions()->count();
        return $current >= $sub->max_institutions;
    }

    /**
     * Check if the organization has reached its total user limit (org-wide).
     */
    public function hasReachedUserLimit(Organization $org): bool
    {
        $sub = $org->activeSubscription();
        $current = $this->getTotalUsers($org);
        return $current >= $sub->max_users;
    }

    /**
     * Check if the organization has reached its staff limit (org-wide).
     */
    public function hasReachedStaffLimit(Organization $org): bool
    {
        $sub = $org->activeSubscription();
        $current = $this->getTotalStaff($org);
        return $current >= $sub->max_staff;
    }

    /**
     * Check if the organization has remaining email quota this month.
     */
    public function hasEmailQuota(Organization $org): bool
    {
        return $org->activeSubscription()->hasEmailQuota();
    }

    /**
     * Get remaining email count for the month.
     */
    public function getRemainingEmails(Organization $org): int
    {
        return $org->activeSubscription()->remainingEmails();
    }

    /**
     * Increment email counter after sending.
     */
    public function trackEmailSent(Organization $org, int $count = 1): void
    {
        $org->activeSubscription()->trackEmailSent($count);
    }

    /**
     * Reset monthly email counters (call via scheduled command on 1st of each month).
     */
    public function resetMonthlyEmailCounters(): int
    {
        return Subscription::query()->update(['emails_sent_this_month' => 0]);
    }

    /**
     * Get comprehensive usage data for the organization.
     */
    public function getUsage(Organization $org): array
    {
        $sub = $org->activeSubscription();
        $tier = $sub->resolvedTier();

        return [
            'tier' => $tier->value,
            'tier_label' => $tier->label(),
            'institutions' => [
                'used' => $org->institutions()->count(),
                'max' => $sub->max_institutions,
            ],
            'users' => [
                'used' => $this->getTotalUsers($org),
                'max' => $sub->max_users,
            ],
            'staff' => [
                'used' => $this->getTotalStaff($org),
                'max' => $sub->max_staff,
            ],
            'emails' => [
                'used' => $sub->emails_sent_this_month,
                'max' => $sub->max_emails_per_month,
            ],
            'storage' => [
                'used_mb' => $sub->storage_used_mb,
                'max_mb' => $sub->storage_quota_gb * 1024,
            ],
            'modules' => $tier->modules(),
            'add_ons' => $sub->add_ons ?? [],
            'billing_cycle' => $sub->billing_cycle,
            'subscription_start' => $sub->subscription_start?->toDateString(),
            'subscription_end' => $sub->subscription_end?->toDateString(),
            'trial_ends_at' => $sub->trial_ends_at?->toDateString(),
            'is_trial' => $sub->isOnTrial(),
            'is_active' => $sub->isActive(),
        ];
    }

    /**
     * Apply a new tier to the organization, updating all limits.
     */
    public function applyTier(Organization $org, SubscriptionTier $tier, string $billingCycle = 'monthly'): void
    {
        $org->activeSubscription()->applyTier($tier, $billingCycle);
    }

    /**
     * Start a 14-day trial for the organization.
     */
    public function startTrial(Organization $org, SubscriptionTier $tier = SubscriptionTier::PROFESSIONAL): void
    {
        $org->activeSubscription()->startTrial($tier);
    }

    // ─── Private helpers (FIXED: use user_roles join, not users.institution_id) ──

    private function getTotalUsers(Organization $org): int
    {
        $institutionIds = $org->institutions()->pluck('id');
        if ($institutionIds->isEmpty()) {
            return 0;
        }

        return DB::table('user_roles')
            ->whereIn('institution_id', $institutionIds)
            ->distinct('user_id')
            ->count('user_id');
    }

    private function getTotalStaff(Organization $org): int
    {
        $institutionIds = $org->institutions()->pluck('id');
        if ($institutionIds->isEmpty()) {
            return 0;
        }

        return DB::table('user_roles')
            ->join('roles', 'user_roles.role_id', '=', 'roles.id')
            ->whereIn('user_roles.institution_id', $institutionIds)
            ->where('roles.key', 'staff')
            ->distinct('user_roles.user_id')
            ->count('user_roles.user_id');
    }
}
