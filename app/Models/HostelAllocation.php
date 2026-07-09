<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class HostelAllocation extends Model
{
    use BelongsToDefaultInstitution;

    protected $fillable = [
        'institution_id',
        'user_id',
        'hostel_room_id',
        'hostel_bed_id',
        'check_in_date',
        'check_out_date',
        'status',
        'remarks',
        'monthly_amount',
    ];

    protected $casts = [
        'check_in_date' => 'date',
        'check_out_date' => 'date',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(HostelRoom::class, 'hostel_room_id');
    }

    public function bed(): BelongsTo
    {
        return $this->belongsTo(HostelBed::class, 'hostel_bed_id');
    }

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'active');
    }
}
