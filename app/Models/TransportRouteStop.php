<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransportRouteStop extends Model
{
    protected $table = 'transport_route_stops';

    protected $fillable = [
        'transport_route_id',
        'transport_stop_id',
        'sequence',
        'arrival_time',
        'departure_time',
        'fare',
    ];

    protected $casts = [
        'fare' => 'float',
    ];

    public function transportRoute(): BelongsTo
    {
        return $this->belongsTo(TransportRoute::class, 'transport_route_id');
    }

    public function transportStop(): BelongsTo
    {
        return $this->belongsTo(TransportStop::class, 'transport_stop_id');
    }
}
