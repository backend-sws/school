<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TransportRoute extends Model
{
    use BelongsToDefaultInstitution;

    protected $fillable = [
        'institution_id',
        'name',
        'code',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function routeStops(): HasMany
    {
        return $this->hasMany(TransportRouteStop::class, 'transport_route_id')->orderBy('sequence');
    }

    public function stops(): BelongsToMany
    {
        return $this->belongsToMany(TransportStop::class, 'transport_route_stops', 'transport_route_id', 'transport_stop_id')
            ->withPivot('sequence', 'arrival_time', 'departure_time', 'fare')
            ->withTimestamps()
            ->orderByPivot('sequence');
    }

    public function vehicles(): HasMany
    {
        return $this->hasMany(TransportVehicle::class, 'transport_route_id');
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(TransportAssignment::class, 'transport_route_id');
    }
}
