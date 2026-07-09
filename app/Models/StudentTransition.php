<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class StudentTransition extends Model
{
    use BelongsToDefaultInstitution;

    protected $fillable = [
        'institution_id',
        'student_profile_id',
        'user_id',
        'type',
        'from_session_id',
        'to_session_id',
        'from_semester',
        'to_semester',
        'from_class_id',
        'to_class_id',
        'from_section_id',
        'to_section_id',
        'status',
        'transitionable_type',
        'transitionable_id',
        'remarks',
        'processed_by',
        'processed_at',
    ];

    protected $casts = [
        'from_semester' => 'integer',
        'to_semester' => 'integer',
        'processed_at' => 'datetime',
    ];

    // ── Polymorphic detail ──────────────────────────────

    public function transitionable(): MorphTo
    {
        return $this->morphTo();
    }

    // ── Common relationships ────────────────────────────

    public function studentProfile(): BelongsTo
    {
        return $this->belongsTo(StudentProfile::class);
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function fromSession(): BelongsTo
    {
        return $this->belongsTo(Session::class, 'from_session_id');
    }

    public function toSession(): BelongsTo
    {
        return $this->belongsTo(Session::class, 'to_session_id');
    }

    public function fromClass(): BelongsTo
    {
        return $this->belongsTo(LmsClass::class, 'from_class_id');
    }

    public function toClass(): BelongsTo
    {
        return $this->belongsTo(LmsClass::class, 'to_class_id');
    }

    public function processedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    // ── Scopes ──────────────────────────────────────────

    public function scopeOfType($query, string $type)
    {
        return $query->where('type', $type);
    }

    public function scopePromotions($query)
    {
        return $query->where('type', 'promotion');
    }

    public function scopeReadmissions($query)
    {
        return $query->where('type', 'readmission');
    }

    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }
}
