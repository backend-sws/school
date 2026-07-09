<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class TestSeries extends Model
{
    protected $table = 'test_series';

    protected $fillable = [
        'institution_id',
        'created_by',
        'title',
        'description',
        'slug',
        'category',
        'difficulty',
        'is_published',
        'starts_at',
        'ends_at',
        'sort_order',
        'metadata',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'starts_at' => 'datetime',
        'ends_at' => 'datetime',
        'sort_order' => 'integer',
        'metadata' => 'array',
    ];

    // ── Scopes ─────────────────────────────────────────────────────

    public function scopeForInstitution($query, int $institutionId)
    {
        return $query->where('institution_id', $institutionId);
    }

    public function scopePublished($query)
    {
        return $query->where('is_published', true);
    }

    public function scopeActive($query)
    {
        return $query->published()
            ->where(function ($q) {
                $q->whereNull('starts_at')->orWhere('starts_at', '<=', now());
            })
            ->where(function ($q) {
                $q->whereNull('ends_at')->orWhere('ends_at', '>=', now());
            });
    }

    // ── Relationships ──────────────────────────────────────────────

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function tests(): BelongsToMany
    {
        return $this->belongsToMany(LmsTest::class, 'test_series_tests')
            ->withPivot('sort_order')
            ->orderByPivot('sort_order');
    }

    public function results(): HasMany
    {
        return $this->hasMany(TestSeriesResult::class);
    }

    // ── Helpers ────────────────────────────────────────────────────

    public function getTestCount(): int
    {
        return $this->tests()->count();
    }

    public function getParticipantCount(): int
    {
        return $this->results()->count();
    }

    public function getAverageScore(): float
    {
        return round($this->results()->avg('average_score') ?? 0, 2);
    }
}
