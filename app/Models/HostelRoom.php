<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class HostelRoom extends Model
{
    use BelongsToDefaultInstitution;

    protected $fillable = [
        'institution_id',
        'hostel_id',
        'hostel_floor_id',
        'room_number',
        'type',
        'bed_count',
        'monthly_fee',
        'amenities',
        'is_active',
    ];

    protected $casts = [
        'bed_count' => 'integer',
        'monthly_fee' => 'decimal:2',
        'amenities' => 'array',
        'is_active' => 'boolean',
    ];

    public function hostel(): BelongsTo
    {
        return $this->belongsTo(Hostel::class);
    }

    public function floor(): BelongsTo
    {
        return $this->belongsTo(HostelFloor::class, 'hostel_floor_id');
    }

    public function beds(): HasMany
    {
        return $this->hasMany(HostelBed::class);
    }

    public function allocations(): HasMany
    {
        return $this->hasMany(HostelAllocation::class);
    }

    public function activeAllocations(): HasMany
    {
        return $this->hasMany(HostelAllocation::class)->where('status', 'active');
    }
}
