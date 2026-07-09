<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TestSeriesResult extends Model
{
    protected $table = 'test_series_results';

    protected $fillable = [
        'test_series_id',
        'user_id',
        'tests_completed',
        'total_tests',
        'average_score',
        'best_score',
        'worst_score',
        'total_time_seconds',
        'rank',
        'subject_scores',
        'performance_trend',
    ];

    protected $casts = [
        'tests_completed' => 'integer',
        'total_tests' => 'integer',
        'average_score' => 'decimal:2',
        'best_score' => 'decimal:2',
        'worst_score' => 'decimal:2',
        'total_time_seconds' => 'integer',
        'rank' => 'integer',
        'subject_scores' => 'array',
        'performance_trend' => 'array',
    ];

    // ── Relationships ──────────────────────────────────────────────

    public function testSeries(): BelongsTo
    {
        return $this->belongsTo(TestSeries::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // ── Helpers ────────────────────────────────────────────────────

    public function getCompletionPercentage(): float
    {
        if ($this->total_tests === 0) return 0;
        return round(($this->tests_completed / $this->total_tests) * 100, 1);
    }

    public function getFormattedTime(): string
    {
        $hours = intdiv($this->total_time_seconds, 3600);
        $mins = intdiv($this->total_time_seconds % 3600, 60);
        return $hours > 0 ? "{$hours}h {$mins}m" : "{$mins}m";
    }
}
