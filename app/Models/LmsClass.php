<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class LmsClass extends Model
{
    use BelongsToDefaultInstitution;

    protected $table = 'lms_classes';

    protected $fillable = [
        'institution_id',
        'stream_id',
        'lms_course_id',
        'class_subject_allocation_id',
        'session_id',
        'section',
        'name',
        'code',
        'status',
        'created_by',
        'class_teacher_id',
        'fee_collection_frequency',
    ];

    protected $casts = [
        'status' => 'integer',
    ];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function stream(): BelongsTo
    {
        return $this->belongsTo(Stream::class);
    }

    public function lmsCourse(): BelongsTo
    {
        return $this->belongsTo(LmsCourse::class, 'lms_course_id');
    }

    public function classSubjectAllocation(): BelongsTo
    {
        return $this->belongsTo(ClassSubjectAllocation::class, 'class_subject_allocation_id');
    }

    public function session(): BelongsTo
    {
        return $this->belongsTo(Session::class, 'session_id');
    }

    public function createdBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function classTeacher(): BelongsTo
    {
        return $this->belongsTo(User::class, 'class_teacher_id');
    }

    public function enrollments(): HasMany
    {
        return $this->hasMany(LmsClassEnrollment::class, 'lms_class_id');
    }


    /** Fee structure rules (unified fee_structures table, scope_type=class). */
    public function feeStructureRules(): HasMany
    {
        return $this->hasMany(FeeStructureRule::class, 'scope_id', 'id')
            ->where('scope_type', FeeStructureRule::SCOPE_CLASS);
    }

    public function assignments(): HasMany
    {
        return $this->hasMany(LmsAssignment::class, 'lms_class_id')->orderBy('sort_order');
    }

    public function tests(): HasMany
    {
        return $this->hasMany(LmsTest::class, 'lms_class_id')->orderBy('sort_order');
    }

    public function liveSessions(): HasMany
    {
        return $this->hasMany(LmsLiveSession::class, 'lms_class_id');
    }

    public function recordings(): HasMany
    {
        return $this->hasMany(LmsRecording::class, 'lms_class_id')->orderBy('sort_order');
    }

    public function announcements(): HasMany
    {
        return $this->hasMany(LmsAnnouncement::class, 'lms_class_id');
    }

    public function materials(): HasMany
    {
        return $this->hasMany(LmsMaterial::class, 'lms_class_id')->orderBy('sort_order');
    }

    public function attendanceRecords(): HasMany
    {
        return $this->hasMany(AttendanceRecord::class, 'lms_class_id');
    }

    /**
     * Whether the user can access this class for read (view class, allocations, content).
     * True if user has view_lms_classes OR (view_my_lms_classes AND is enrolled with status active).
     */
    public static function userCanAccessForRead($user, int $lmsClassId): bool
    {
        if ($user->hasAbility('view_lms_classes')) {
            return true;
        }
        if (!$user->hasAbility('view_my_lms_classes') && !$user->hasAbility('student_portal_classes')) {
            return false;
        }

        $effectiveUser = \App\Support\EffectiveStudentContext::getEffectiveUser($user);
        $userId = $effectiveUser ? $effectiveUser->id : $user->id;

        return self::query()
            ->where('id', $lmsClassId)
            ->where(function ($q) use ($userId) {
                $q->whereHas('enrollments', fn ($eq) => $eq->where('user_id', $userId)->where('status', 'active'))
                    ->orWhereExists(function ($sub) use ($userId) {
                        $sub->selectRaw(1)
                            ->from('class_subject_allocations as csa')
                            ->whereColumn('csa.stream_id', 'lms_classes.stream_id')
                            ->whereColumn('csa.session_id', 'lms_classes.session_id')
                            ->where('csa.instructor_id', $userId);
                    });
            })
            ->exists();
    }

    /**
     * Whether the user can grade (score/feedback) submissions in this class.
     * True if user has update_lms_classes, or is enrolled as teacher, or is instructor on any allocation for this class's stream+session.
     */
    public static function userCanGradeInClass($user, int $lmsClassId): bool
    {
        if ($user->hasAbility('update_lms_classes')) {
            return true;
        }

        $class = self::find($lmsClassId);
        if (!$class || !$class->stream_id || !$class->session_id) {
            return false;
        }

        $userId = $user->id;

        if (
            LmsClassEnrollment::query()
                ->where('lms_class_id', $lmsClassId)
                ->where('user_id', $userId)
                ->where('status', 'active')
                ->where('role', 'teacher')
                ->exists()
        ) {
            return true;
        }

        return ClassSubjectAllocation::query()
            ->where('stream_id', $class->stream_id)
            ->where('session_id', $class->session_id)
            ->where('instructor_id', $userId)
            ->exists();
    }

    /**
     * Whether the user can create/edit/delete content (assignments, tests, etc.) in this class.
     * True if user has the relevant admin ability, or is enrolled as teacher, or is instructor on any allocation for this class's stream+session.
     */
    public static function userCanEditContentInClass($user, int $lmsClassId): bool
    {
        return self::userCanGradeInClass($user, $lmsClassId);
    }
}
