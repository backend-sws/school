<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class TransportStop extends Model
{
    use BelongsToDefaultInstitution;

    protected $fillable = [
        'institution_id',
        'name',
        'code',
        'address',
        'landmark',
        'latitude',
        'longitude',
        'is_active',
    ];

    protected $casts = [
        'latitude' => 'decimal:7',
        'longitude' => 'decimal:7',
        'is_active' => 'boolean',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function routeStops(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(TransportRouteStop::class, 'transport_stop_id');
    }

    public function routes(): BelongsToMany
    {
        return $this->belongsToMany(TransportRoute::class, 'transport_route_stops', 'transport_stop_id', 'transport_route_id')
            ->withPivot('sequence', 'arrival_time', 'departure_time')
            ->withTimestamps();
    }
}
