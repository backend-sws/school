<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\Auditable;

class News extends Model
{
    use Auditable;

    use BelongsToDefaultInstitution;

    public $timestamps = false;
    protected $fillable = [
        'institution_id',
        'title',
        'news_for',
        'news_types',
        'content',
        'event_start_at',
        'event_end_at',
        'event_venue',
        'event_date',   // mapped to event_start_at
        'event_location', // mapped to event_venue
        'tags',
        'status',
        'created_by',
    ];

    protected $casts = [
        'news_types' => 'array',
        'tags' => 'array',
        'status' => 'integer',
        'event_start_at' => 'datetime',
        'event_end_at' => 'datetime',
    ];

    protected $appends = ['target', 'type'];

    /** Alias for event_start_at date (API/frontend may use event_date). */
    public function getEventDateAttribute(): ?string
    {
        return $this->event_start_at?->format('Y-m-d');
    }

    /** Alias for event_venue (API/frontend may use event_location). */
    public function getEventLocationAttribute(): ?string
    {
        return $this->event_venue ?? null;
    }

    /** Seed/API pass event_date; store as event_start_at. */
    public function setEventDateAttribute($value): void
    {
        if ($value !== null) {
            $this->attributes['event_start_at'] = is_string($value) ? $value : $value?->format('Y-m-d H:i:s');
        }
    }

    /** Seed/API pass event_location; store as event_venue. */
    public function setEventLocationAttribute($value): void
    {
        $this->attributes['event_venue'] = $value;
    }

    /**
     * Frontend-compatible target (maps news_for to target: official -> others).
     */
    public function getTargetAttribute(): string
    {
        return match ($this->news_for ?? '') {
            'official' => 'others',
            default => $this->news_for ?? 'all',
        };
    }

    /**
     * Frontend-compatible type (alias for news_types).
     */
    public function getTypeAttribute(): array
    {
        return $this->news_types ?? [];
    }

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function author(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
