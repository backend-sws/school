<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

use App\Contracts\ScheduleableActivity;

class ClassSubjectAllocation extends Model implements ScheduleableActivity
{
    use BelongsToDefaultInstitution;

    public function getSchedulingType(): string
    {
        return 'academic';
    }

    public function getAssignedTeacherId(): ?int
    {
        return $this->instructor_id;
    }

    public function getDurationMinutes(): int
    {
        return 45; // Default for class periods, could be refined
    }

    public function getTargetGroupId(): string
    {
        return 'stream_' . $this->stream_id;
    }

    public function getActivityLabel(): string
    {
        return ($this->subject->name ?? 'Subject') . ' (' . ($this->instructor->name ?? 'Teacher') . ')';
    }

    protected $fillable = [
        'institution_id',
        'stream_id',
        'subject_id',
        'session_id',
        'instructor_id',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function stream(): BelongsTo
    {
        return $this->belongsTo(Stream::class);
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class);
    }

    public function session(): BelongsTo
    {
        return $this->belongsTo(Session::class);
    }

    public function instructor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'instructor_id');
    }

    public function attendanceRecords(): HasMany
    {
        return $this->hasMany(AttendanceRecord::class, 'class_subject_allocation_id');
    }
}
