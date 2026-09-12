<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransportVehicleLog extends Model
{
    use BelongsToDefaultInstitution, Auditable;

    protected $fillable = [
        'institution_id',
        'transport_vehicle_id',
        'transport_driver_id',
        'transport_route_id',
        'log_date',
        'trip_type',
        'purpose',
        'start_odometer',
        'end_odometer',
        'total_km',
        'start_time',
        'end_time',
        'status',
        'notes',
        'created_by',
    ];

    protected $casts = [
        'log_date' => 'date',
        'start_odometer' => 'decimal:2',
        'end_odometer' => 'decimal:2',
        'total_km' => 'decimal:2',
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

    public function transportRoute(): BelongsTo
    {
        return $this->belongsTo(TransportRoute::class, 'transport_route_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
