<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class AttendanceRecord extends Model
{
    use BelongsToDefaultInstitution;

    protected $table = 'attendance_records';

    protected $fillable = [
        'institution_id',
        'lms_class_id',
        'class_subject_allocation_id',
        'user_id',
        'date',
        'status',
        'marked_by',
        'remarks',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function lmsClass(): BelongsTo
    {
        return $this->belongsTo(LmsClass::class, 'lms_class_id');
    }

    public function classSubjectAllocation(): BelongsTo
    {
        return $this->belongsTo(ClassSubjectAllocation::class, 'class_subject_allocation_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function markedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'marked_by');
    }

    public function scopeForClass(Builder $query, int $lmsClassId): Builder
    {
        return $query->where('lms_class_id', $lmsClassId);
    }

    public function scopeForDate(Builder $query, string $date): Builder
    {
        return $query->whereDate('date', $date);
    }

    public function scopeClassLevel(Builder $query): Builder
    {
        return $query->whereNull('class_subject_allocation_id');
    }

    public function scopeSubjectLevel(Builder $query): Builder
    {
        return $query->whereNotNull('class_subject_allocation_id');
    }

    public function scopeForSession(Builder $query, int $sessionId): Builder
    {
        return $query->whereHas('lmsClass', fn (Builder $q) => $q->where('session_id', $sessionId));
    }

    public function isClassLevel(): bool
    {
        return $this->class_subject_allocation_id === null;
    }

    public function isSubjectLevel(): bool
    {
        return $this->class_subject_allocation_id !== null;
    }
}
