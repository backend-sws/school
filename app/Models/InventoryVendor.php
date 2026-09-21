<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class InventoryVendor extends Model
{
    use BelongsToDefaultInstitution, Auditable;

    protected $fillable = [
        'institution_id',
        'name',
        'contact_name',
        'contact_phone',
        'contact_email',
        'location',
        'city',
        'state',
        'pincode',
        'gstin',
        'pan',
        'bank_name',
        'bank_account_no',
        'bank_ifsc',
        'credit_limit',
        'payment_terms',
        'is_active',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'credit_limit' => 'decimal:2',
        'is_active'    => 'boolean',
    ];

    // ── Relationships ────────────────────────────────────────────────────

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function purchases(): HasMany
    {
        return $this->hasMany(InventoryPurchase::class, 'inventory_vendor_id');
    }

    public function settlements(): HasMany
    {
        return $this->hasMany(InventoryVendorSettlement::class, 'inventory_vendor_id');
    }

    // ── Computed: outstanding balance ─────────────────────────────────────

    /**
     * Total credit purchase amount minus total settled amount for this vendor.
     */
    public function getOutstandingBalanceAttribute(): float
    {
        $totalCredit = $this->purchases()
            ->whereIn('payment_status', ['credit'])
            ->sum('total_cost');

        $totalSettled = $this->settlements()->sum('amount');

        return max(0, (float) $totalCredit - (float) $totalSettled);
    }

    /**
     * Total amount of inventory purchased on credit (ever).
     */
    public function getTotalCreditAttribute(): float
    {
        return (float) $this->purchases()
            ->whereIn('payment_status', ['credit', 'settled'])
            ->sum('total_cost');
    }

    /**
     * Total amount of all purchases from this vendor.
     */
    public function getTotalPurchasesAmountAttribute(): float
    {
        return (float) $this->purchases()->sum('total_cost');
    }

    /**
     * Total settled amount paid to this vendor.
     */
    public function getSettledAmountAttribute(): float
    {
        return (float) $this->settlements()->sum('amount');
    }
}
