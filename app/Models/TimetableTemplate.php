<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TimetableTemplate extends Model
{
    use BelongsToDefaultInstitution;

    protected $fillable = [
        'institution_id',
        'name',
        'type',
        'is_active',
        'is_default',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_default' => 'boolean',
    ];

    public function periodSlots(): HasMany
    {
        return $this->hasMany(PeriodSlot::class)->orderBy('sort_order')->orderBy('start_time');
    }

    public function timetables(): HasMany
    {
        return $this->hasMany(Timetable::class);
    }
}
