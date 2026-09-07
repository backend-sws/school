<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class StudentLeaveApplication extends Model
{
    use HasFactory, BelongsToDefaultInstitution;

    protected $table = 'student_leave_applications';

    protected $fillable = [
        'institution_id',
        'user_id',
        'student_profile_id',
        'lms_class_id',
        'session_id',
        'document_category',
        'document_title',
        'leave_type',
        'from_date',
        'to_date',
        'total_days',
        'reason',
        'document_path',
        'document_original_name',
        'document_mime_type',
        'document_size',
        'document_disk',
        'status',
        'auto_marked_attendance',
        'applied_by',
        'approved_by',
        'approved_at',
        'admin_remarks',
    ];

    protected $casts = [
        'from_date' => 'date',
        'to_date' => 'date',
        'total_days' => 'integer',
        'auto_marked_attendance' => 'boolean',
        'approved_at' => 'datetime',
        'document_size' => 'integer',
    ];

    protected $appends = [
        'document_url',
    ];

    public function getDocumentUrlAttribute(): ?string
    {
        if (empty($this->document_path)) {
            return null;
        }

        if (str_starts_with($this->document_path, 'http://') || str_starts_with($this->document_path, 'https://')) {
            return $this->document_path;
        }

        // If Cloudflare R2 custom domain/URL is configured
        $r2Url = config('filesystems.disks.r2.url');
        if (!empty($r2Url)) {
            return rtrim($r2Url, '/') . '/' . ltrim($this->document_path, '/');
        }

        return "/api/v1/r2/asset?path=" . urlencode($this->document_path);
    }

    // ─── Relationships ─────────────────────────────────────────────────────────

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function studentProfile(): BelongsTo
    {
        return $this->belongsTo(StudentProfile::class);
    }

    public function lmsClass(): BelongsTo
    {
        return $this->belongsTo(LmsClass::class, 'lms_class_id');
    }

    public function session(): BelongsTo
    {
        return $this->belongsTo(Session::class, 'session_id');
    }

    public function appliedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'applied_by');
    }

    public function approvedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    // ─── Scopes ───────────────────────────────────────────────────────────────

    public function scopeForStudent($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeForClass($query, int $classId)
    {
        return $query->where('lms_class_id', $classId);
    }

    public function scopeForSession($query, int $sessionId)
    {
        return $query->where('session_id', $sessionId);
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
