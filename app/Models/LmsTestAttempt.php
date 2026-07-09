<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LmsTestAttempt extends Model
{
    protected $table = 'lms_test_attempts';

    protected $fillable = [
        'lms_test_id',
        'user_id',
        'started_at',
        'submitted_at',
        'score',
        'answers_snapshot',
        'status',
    ];

    protected $casts = [
        'started_at' => 'datetime',
        'submitted_at' => 'datetime',
        'score' => 'decimal:2',
        'answers_snapshot' => 'array',
    ];

    public function lmsTest(): BelongsTo
    {
        return $this->belongsTo(LmsTest::class, 'lms_test_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
