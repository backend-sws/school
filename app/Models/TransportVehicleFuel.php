<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransportVehicleFuel extends Model
{
    use BelongsToDefaultInstitution, Auditable;

    protected $fillable = [
        'institution_id',
        'transport_vehicle_id',
        'transport_driver_id',
        'fuel_date',
        'fuel_time',
        'fuel_type',
        'odometer_reading',
        'liters',
        'rate_per_liter',
        'total_amount',
        'is_full_tank',
        'vendor_name',
        'payment_mode',
        'invoice_number',
        'bill_url',
        'calculated_mileage',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'fuel_date' => 'date',
        'odometer_reading' => 'decimal:2',
        'liters' => 'decimal:2',
        'rate_per_liter' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'is_full_tank' => 'boolean',
        'calculated_mileage' => 'decimal:2',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function transportVehicle(): BelongsTo
    {
        return $this->belongsTo(TransportVehicle::class, 'transport_vehicle_id');
    }

    public function transportDriver(): BelongsTo
    {
        return $this->belongsTo(TransportDriver::class, 'transport_driver_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
