<?php

namespace App\Models;

use App\Enums\SubscriptionTier;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Subscription extends Model
{
    protected $fillable = [
        'organization_id',
        'tier',
        'billing_cycle',
        'max_institutions',
        'max_users',
        'max_staff',
        'max_emails_per_month',
        'storage_quota_gb',
        'subscription_start',
        'subscription_end',
        'trial_ends_at',
        'add_ons',
        'emails_sent_this_month',
        'storage_used_mb',
    ];

    protected $casts = [
        'max_institutions' => 'integer',
        'max_users' => 'integer',
        'max_staff' => 'integer',
        'max_emails_per_month' => 'integer',
        'storage_quota_gb' => 'integer',
        'emails_sent_this_month' => 'integer',
        'storage_used_mb' => 'integer',
        'subscription_start' => 'datetime',
        'subscription_end' => 'datetime',
        'trial_ends_at' => 'datetime',
        'add_ons' => 'array',
        'tier' => SubscriptionTier::class,
    ];

    // ─── Relationships ──────────────────────────────────────────────────

    public function organization(): BelongsTo
    {
        return $this->belongsTo(Organization::class);
    }

    // ─── Tier Helpers ───────────────────────────────────────────────────

    /** Resolved tier enum (with fallback). */
    public function resolvedTier(): SubscriptionTier
    {
        return $this->tier instanceof SubscriptionTier
            ? $this->tier
            : (SubscriptionTier::tryFrom($this->tier) ?? SubscriptionTier::STARTER);
    }

    // ─── Trial / Active Helpers ─────────────────────────────────────────

    public function isOnTrial(): bool
    {
        return $this->trial_ends_at !== null && Carbon::parse($this->trial_ends_at)->isFuture();
    }

    public function isActive(): bool
    {
        if ($this->isOnTrial()) {
            return true;
        }
        if ($this->subscription_end === null) {
            return true; // fresh setup
        }
        return Carbon::parse($this->subscription_end)->isFuture();
    }

    public function isExpired(): bool { return !$this->isActive(); }

    public function isInGracePeriod(): bool
    {
        if ($this->subscription_end === null) {
            return false;
        }
        $end = Carbon::parse($this->subscription_end);
        return $end->isPast() && $end->addDays(7)->isFuture();
    }

    public function daysRemaining(): int
    {
        if ($this->isOnTrial()) {
            return max(0, (int) now()->diffInDays(Carbon::parse($this->trial_ends_at), false));
        }
        if ($this->subscription_end) {
            return max(0, (int) now()->diffInDays(Carbon::parse($this->subscription_end), false));
        }
        return PHP_INT_MAX;
    }

    // ─── Module / Quota Helpers ─────────────────────────────────────────

    public function hasModule(string $module): bool
    {
        $tier = $this->resolvedTier();
        if ($tier->hasModule($module)) {
            return true;
        }
        $addOns = $this->add_ons ?? [];
        return in_array($module, $addOns, true);
    }

    public function hasEmailQuota(): bool
    {
        return $this->emails_sent_this_month < $this->max_emails_per_month;
    }

    public function remainingEmails(): int
    {
        return max(0, $this->max_emails_per_month - $this->emails_sent_this_month);
    }

    public function trackEmailSent(int $count = 1): void
    {
        $this->increment('emails_sent_this_month', $count);
    }

    public function storageUsedPercent(): float
    {
        $maxMb = $this->storage_quota_gb * 1024;
        return $maxMb > 0 ? round(($this->storage_used_mb / $maxMb) * 100, 1) : 0;
    }

    // ─── Tier Application ───────────────────────────────────────────────

    public function applyTier(SubscriptionTier $tier, string $billingCycle = 'monthly'): void
    {
        $this->update([
            'tier' => $tier->value,
            'max_institutions' => $tier->maxInstitutions(),
            'max_users' => $tier->maxUsers(),
            'max_staff' => $tier->maxStaff(),
            'max_emails_per_month' => $tier->maxEmailsPerMonth(),
            'storage_quota_gb' => $tier->storageQuotaGb(),
            'billing_cycle' => $billingCycle,
        ]);
    }

    public function startTrial(SubscriptionTier $tier = SubscriptionTier::PROFESSIONAL): void
    {
        $this->applyTier($tier);
        $this->update([
            'subscription_start' => now(),
            'trial_ends_at' => now()->addDays(14),
        ]);
    }
}
