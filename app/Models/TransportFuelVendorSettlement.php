<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TransportFuelVendorSettlement extends Model
{
    use BelongsToDefaultInstitution, Auditable;

    protected $fillable = [
        'institution_id',
        'transport_fuel_vendor_id',
        'settlement_date',
        'amount',
        'payment_mode',
        'reference_number',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'settlement_date' => 'date',
        'amount'          => 'decimal:2',
    ];

    public function vendor(): BelongsTo
    {
        return $this->belongsTo(TransportFuelVendor::class, 'transport_fuel_vendor_id');
    }

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /** Fuel entries marked against this settlement */
    public function fuelLogs(): HasMany
    {
        return $this->hasMany(TransportVehicleFuel::class, 'transport_fuel_vendor_settlement_id');
    }
}
