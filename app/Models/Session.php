<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\Auditable;

class Session extends Model
{
    use Auditable;

    use HasFactory, BelongsToDefaultInstitution;

    protected $table = 'academic_sessions';

    protected $fillable = [
        'institution_id',
        'name',
        'start_year',
        'end_year',
        'is_current',
        'status',
        'duration_months',
    ];

    protected $casts = [
        'start_year' => 'integer',
        'end_year' => 'integer',
        'is_current' => 'boolean',
        'status' => 'integer',
    ];

    public $timestamps = false;

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function scopeCurrent($query)
    {
        return $query->where('is_current', true);
    }

    /** Duration in years (derived from duration_months). */
    public function getDurationAttribute(): ?int
    {
        return $this->duration_months !== null
            ? (int) round($this->duration_months / 12)
            : null;
    }
}
