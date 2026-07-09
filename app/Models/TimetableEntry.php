<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class TimetableEntry extends Model
{
    protected $fillable = [
        'timetable_id',
        'period_slot_id',
        'day_of_week',
        'room_id',
        'activity_type',
        'activity_id',
        'teacher_id', // Cache for quick lookup, though often part of activity
    ];

    public function timetable(): BelongsTo
    {
        return $this->belongsTo(Timetable::class);
    }

    public function periodSlot(): BelongsTo
    {
        return $this->belongsTo(PeriodSlot::class);
    }

    public function room(): BelongsTo
    {
        return $this->belongsTo(Room::class);
    }

    public function activity(): MorphTo
    {
        return $this->morphTo();
    }

    public function teacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function substitutions(): HasMany
    {
        return $this->hasMany(Substitution::class);
    }
}
