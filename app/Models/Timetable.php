<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Timetable extends Model
{
    use BelongsToDefaultInstitution;

    protected $fillable = [
        'institution_id',
        'session_id',
        'scheduleable_type',
        'scheduleable_id',
        'timetable_template_id',
        'status',
        'effective_from',
    ];

    protected $casts = [
        'effective_from' => 'date',
    ];

    public function session(): BelongsTo
    {
        return $this->belongsTo(Session::class, 'session_id');
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(TimetableTemplate::class, 'timetable_template_id');
    }

    public function scheduleable(): MorphTo
    {
        return $this->morphTo();
    }

    public function entries(): HasMany
    {
        return $this->hasMany(TimetableEntry::class);
    }
}
