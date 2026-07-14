<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransportAssignment extends Model
{
    use BelongsToDefaultInstitution;

    protected $fillable = [
        'institution_id',
        'user_id',
        'transport_route_id',
        'transport_stop_id',
        'effective_from',
        'effective_until',
        'remarks',
        'monthly_amount',
    ];

    protected $casts = [
        'effective_from'  => 'date',
        'effective_until' => 'date',
        'monthly_amount'  => 'decimal:2',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function transportRoute(): BelongsTo
    {
        return $this->belongsTo(TransportRoute::class, 'transport_route_id');
    }

    public function transportStop(): BelongsTo
    {
        return $this->belongsTo(TransportStop::class, 'transport_stop_id');
    }

    public function routeStop(): \Illuminate\Database\Eloquent\Relations\HasOne
    {
        return $this->hasOne(TransportRouteStop::class, 'transport_route_id', 'transport_route_id')
            ->where('transport_stop_id', $this->transport_stop_id);
    }
}
