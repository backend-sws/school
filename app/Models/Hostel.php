<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class Hostel extends Model
{
    use BelongsToDefaultInstitution;

    protected $fillable = [
        'institution_id',
        'name',
        'code',
        'type',
        'warden_user_id',
        'warden_name',
        'warden_contact',
        'address',
        'total_capacity',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'total_capacity' => 'integer',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function warden(): BelongsTo
    {
        return $this->belongsTo(User::class, 'warden_user_id');
    }

    public function floors(): HasMany
    {
        return $this->hasMany(HostelFloor::class)->orderBy('floor_number');
    }

    public function rooms(): HasMany
    {
        return $this->hasMany(HostelRoom::class);
    }

    public function beds(): HasManyThrough
    {
        return $this->hasManyThrough(HostelBed::class, HostelRoom::class);
    }

    public function allocations(): HasManyThrough
    {
        return $this->hasManyThrough(HostelAllocation::class, HostelRoom::class, 'hostel_id', 'hostel_room_id');
    }
}
