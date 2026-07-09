<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LmsTest extends Model
{
    protected $table = 'lms_tests';

    protected $fillable = [
        'lms_class_id',
        'class_subject_allocation_id',
        'title',
        'description',
        'duration_minutes',
        'max_attempts',
        'available_from',
        'available_until',
        'shuffle_questions',
        'sort_order',
        'created_by',
    ];

    protected $casts = [
        'duration_minutes' => 'integer',
        'max_attempts' => 'integer',
        'available_from' => 'datetime',
        'available_until' => 'datetime',
        'shuffle_questions' => 'boolean',
        'sort_order' => 'integer',
    ];

    public function lmsClass(): BelongsTo
    {
        return $this->belongsTo(LmsClass::class, 'lms_class_id');
    }

    public function classSubjectAllocation(): BelongsTo
    {
        return $this->belongsTo(ClassSubjectAllocation::class, 'class_subject_allocation_id');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function questions(): HasMany
    {
        return $this->hasMany(LmsTestQuestion::class, 'lms_test_id')->orderBy('sort_order');
    }

    public function attempts(): HasMany
    {
        return $this->hasMany(LmsTestAttempt::class, 'lms_test_id');
    }
}
