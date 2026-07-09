<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PeriodSlot extends Model
{
    protected $fillable = [
        'timetable_template_id',
        'name',
        'start_time',
        'end_time',
        'type',
        'sort_order',
    ];

    public function template(): BelongsTo
    {
        return $this->belongsTo(TimetableTemplate::class, 'timetable_template_id');
    }
}
