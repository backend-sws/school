<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;

class HostelBed extends Model
{
    protected $fillable = [
        'hostel_room_id',
        'bed_label',
        'status',
        'notes',
    ];

    public function room(): BelongsTo
    {
        return $this->belongsTo(HostelRoom::class, 'hostel_room_id');
    }

    public function activeAllocation(): HasOne
    {
        return $this->hasOne(HostelAllocation::class)->where('status', 'active');
    }
}
