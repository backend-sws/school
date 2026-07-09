<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Organization extends Model
{
    use Auditable, HasFactory;

    protected $fillable = [
        'name',
        'code',
        'address',
        'city',
        'state',
        'pincode',
        'phone',
        'email',
        'website',
        'logo_url',
        'status',
    ];

    protected $casts = [
        'status' => 'integer',
    ];

    // ─── Relationships ───────────────────────────────────────────────────

    /** Institutions (schools/colleges/universities) under this organization. */
    public function institutions(): HasMany
    {
        return $this->hasMany(Institution::class);
    }

    /** Active subscription for this organization (1:1). */
    public function subscription(): HasOne
    {
        return $this->hasOne(Subscription::class);
    }

    // ─── Subscription Delegators ─────────────────────────────────────────

    /** Get the active subscription, creating a default starter if none exists. */
    public function activeSubscription(): Subscription
    {
        return $this->subscription ?? $this->subscription()->create();
    }

    /** Delegates to subscription.isActive(). */
    public function isSubscriptionActive(): bool
    {
        return $this->subscription?->isActive() ?? false;
    }

    /** Delegates to subscription.isExpired(). */
    public function isExpired(): bool
    {
        return $this->subscription?->isExpired() ?? true;
    }

    /** Delegates to subscription.isOnTrial(). */
    public function isOnTrial(): bool
    {
        return $this->subscription?->isOnTrial() ?? false;
    }

    // ─── Status Helpers ─────────────────────────────────────────────────

    public function isActive(): bool { return (int) $this->status === 1; }
}
