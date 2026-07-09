<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LmsLiveSession extends Model
{
    protected $table = 'lms_live_sessions';

    protected $fillable = [
        'lms_class_id',
        'class_subject_allocation_id',
        'title',
        'scheduled_at',
        'ends_at',
        'meeting_url',
        'meeting_provider',
        'status',
        'created_by',
    ];

    protected $casts = [
        'scheduled_at' => 'datetime',
        'ends_at' => 'datetime',
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

    public function recordings(): HasMany
    {
        return $this->hasMany(LmsRecording::class, 'lms_live_session_id');
    }
}
