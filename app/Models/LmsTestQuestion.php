<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class LmsTestQuestion extends Model
{
    protected $table = 'lms_test_questions';

    protected $fillable = [
        'lms_test_id',
        'question_text',
        'type',
        'options',
        'correct_answer',
        'points',
        'sort_order',
    ];

    protected $casts = [
        'options' => 'array',
        'points' => 'decimal:2',
        'sort_order' => 'integer',
    ];

    public function lmsTest(): BelongsTo
    {
        return $this->belongsTo(LmsTest::class, 'lms_test_id');
    }
}
