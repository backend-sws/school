<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TransportFuelVendor extends Model
{
    use BelongsToDefaultInstitution, Auditable;

    protected $fillable = [
        'institution_id',
        'name',
        'location',
        'city',
        'state',
        'pincode',
        'contact_name',
        'contact_phone',
        'gstin',
        'credit_limit',
        'payment_terms',
        'is_active',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'credit_limit'  => 'decimal:2',
        'is_active'     => 'boolean',
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

    public function fuelLogs(): HasMany
    {
        return $this->hasMany(TransportVehicleFuel::class, 'transport_fuel_vendor_id');
    }

    public function settlements(): HasMany
    {
        return $this->hasMany(TransportFuelVendorSettlement::class, 'transport_fuel_vendor_id');
    }

    // ── Computed: outstanding balance ─────────────────────────────────────

    /**
     * Total credit fuel amount minus total settled amount for this vendor.
     */
    public function getOutstandingBalanceAttribute(): float
    {
        $totalCredit = $this->fuelLogs()
            ->whereIn('payment_status', ['credit'])
            ->sum('total_amount');

        $totalSettled = $this->settlements()->sum('amount');

        return max(0, (float) $totalCredit - (float) $totalSettled);
    }

    /**
     * Total amount of fuel filled on credit (ever).
     */
    public function getTotalCreditAttribute(): float
    {
        return (float) $this->fuelLogs()
            ->whereIn('payment_status', ['credit', 'settled'])
            ->sum('total_amount');
    }
}
