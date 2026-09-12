<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class TransportVehicle extends Model
{
    use BelongsToDefaultInstitution, Auditable;

    protected $fillable = [
        'institution_id',
        'registration_number',
        'vehicle_type',
        'model_name',
        'make_year',
        'chassis_number',
        'engine_number',
        'fuel_type',
        'capacity',
        'current_odometer',
        'transport_route_id',
        'transport_driver_id',
        'status',
        'notes',
        'insurance_policy_number',
        'insurance_expiry_date',
        'puc_expiry_date',
        'fitness_expiry_date',
        'road_tax_expiry_date',
        'permit_expiry_date',
        'documents',
    ];

    protected $casts = [
        'capacity' => 'integer',
        'make_year' => 'integer',
        'current_odometer' => 'decimal:2',
        'insurance_expiry_date' => 'date',
        'puc_expiry_date' => 'date',
        'fitness_expiry_date' => 'date',
        'road_tax_expiry_date' => 'date',
        'permit_expiry_date' => 'date',
        'documents' => 'array',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function transportRoute(): BelongsTo
    {
        return $this->belongsTo(TransportRoute::class, 'transport_route_id');
    }

    public function transportDriver(): BelongsTo
    {
        return $this->belongsTo(TransportDriver::class, 'transport_driver_id');
    }

    public function logs(): HasMany
    {
        return $this->hasMany(TransportVehicleLog::class, 'transport_vehicle_id');
    }

    public function fuels(): HasMany
    {
        return $this->hasMany(TransportVehicleFuel::class, 'transport_vehicle_id');
    }

    public function expenses(): HasMany
    {
        return $this->hasMany(TransportVehicleExpense::class, 'transport_vehicle_id');
    }

    public function latestLog(): HasOne
    {
        return $this->hasOne(TransportVehicleLog::class, 'transport_vehicle_id')->latestOfMany('log_date');
    }

    public function latestFuel(): HasOne
    {
        return $this->hasOne(TransportVehicleFuel::class, 'transport_vehicle_id')->latestOfMany('fuel_date');
    }
}
