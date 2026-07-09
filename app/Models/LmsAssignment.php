<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LmsAssignment extends Model
{
    protected $table = 'lms_assignments';

    protected $fillable = [
        'lms_class_id',
        'class_subject_allocation_id',
        'title',
        'file_path',
        'description',
        'type',
        'due_at',
        'max_score',
        'allow_late',
        'sort_order',
        'created_by',
    ];

    protected $casts = [
        'due_at' => 'datetime',
        'max_score' => 'decimal:2',
        'allow_late' => 'boolean',
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

    public function submissions(): HasMany
    {
        return $this->hasMany(LmsAssignmentSubmission::class, 'lms_assignment_id');
    }
}
