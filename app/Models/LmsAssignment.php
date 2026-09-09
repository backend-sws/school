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

    protected $appends = [
        'file_url',
        'my_submission',
    ];

    public function getFileUrlAttribute(): ?string
    {
        if (empty($this->file_path)) {
            return null;
        }

        if (str_starts_with($this->file_path, 'http://') || str_starts_with($this->file_path, 'https://')) {
            return $this->file_path;
        }

        $r2Url = config('filesystems.disks.r2.url');
        if (!empty($r2Url)) {
            return rtrim($r2Url, '/') . '/' . ltrim($this->file_path, '/');
        }

        return '/api/v1/r2/asset?path=' . urlencode($this->file_path);
    }

    public function getMySubmissionAttribute(): ?LmsAssignmentSubmission
    {
        $userId = auth()->id();
        if (!$userId) {
            return null;
        }

        if ($this->relationLoaded('submissions')) {
            return $this->submissions->firstWhere('user_id', $userId);
        }

        return $this->submissions()->where('user_id', $userId)->first();
    }

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
