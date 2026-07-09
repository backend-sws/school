<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransportVehicle extends Model
{
    use BelongsToDefaultInstitution;

    protected $fillable = [
        'institution_id',
        'registration_number',
        'vehicle_type',
        'capacity',
        'transport_route_id',
        'transport_driver_id',
        'status',
        'notes',
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
}
