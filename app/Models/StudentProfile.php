<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentProfile extends Model
{
    use HasFactory, BelongsToDefaultInstitution;

    public $timestamps = false;
    protected $fillable = [
        'user_id',
        'institution_id',
        'stream_id',
        'session_id',
        'subject_id',
        'mobile',
        'aadhar_no',
        'admission_date',
        'nationality',
        'blood_group',
        'marital_status',
        'is_differently_abled',
        'caste',
        'reg_no',
        'roll_no',
        'father_name',
        'father_mobile',
        'father_qualification',
        'father_occupation',
        'guardian_snapshot',
        'mother_name',
        'dob',
        'gender',
        'category',
        'religion',
        'current_semester',
        'address',
        'city',
        'state',
        'pincode',
        'verified',
        'verified_by',
        'verified_at',
        'app_no',
        'abc_no',
        'university_roll_no',
        'university_confidential_no',
        'signature_url',
        'enrollment_status',
        'apaar_id',
        'disability_type',
        'minority_status',
        'transport_mode',
        'free_textbook',
        'midday_meal_beneficiary',
        'fee_regulation_profile_id',
        'medical_condition',
        'allergy',
        'previous_school_name',
        'previous_roll_no',
        'previous_board',
        'previous_marks',
        'has_tc',
        'has_government_portal',
        'government_portal_name',
    ];

    protected $casts = [
        'dob' => 'date',
        'current_semester' => 'integer',
        'verified' => 'boolean',
        'verified_at' => 'datetime',
        'admission_date' => 'date',
        'enrollment_status' => 'string',
        'is_differently_abled' => 'boolean',
        'minority_status' => 'boolean',
        'free_textbook' => 'boolean',
        'midday_meal_beneficiary' => 'boolean',
        'has_tc' => 'boolean',
        'has_government_portal' => 'boolean',
        'previous_marks' => 'decimal:2',
        'guardian_snapshot' => 'array',
    ];

    protected static function booted()
    {
        static::creating(function ($model) {
            $model->created_at = now();
        });

        static::updated(function ($model) {
            if ($model->isDirty('fee_regulation_profile_id')) {
                \App\Models\StudentFeePeriodBalance::where('user_id', $model->user_id)->delete();
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function feeRegulationProfile(): BelongsTo
    {
        return $this->belongsTo(FeeRegulationProfile::class, 'fee_regulation_profile_id');
    }

    public function stream(): BelongsTo
    {
        return $this->belongsTo(Stream::class);
    }

    public function session(): BelongsTo
    {
        return $this->belongsTo(Session::class);
    }

    public function verifiedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function subject(): BelongsTo
    {
        return $this->belongsTo(Subject::class, 'subject_id');
    }

    public function addresses(): HasMany
    {
        return $this->hasMany(StudentAddress::class);
    }

    // Helpers to get specific address
    public function permanentAddress()
    {
        return $this->hasOne(StudentAddress::class)->where('address_type', 'permanent');
    }

    public function correspondenceAddress()
    {
        return $this->hasOne(StudentAddress::class)->where('address_type', 'correspondence');
    }

    public function mainStream()
    {
        return $this->belongsTo(Stream::class, 'stream_id');
    }

    public function transitions(): \Illuminate\Database\Eloquent\Relations\HasMany
    {
        return $this->hasMany(StudentTransition::class);
    }

    // ─── Status Helpers ─────────────────────────────────────────────────

    public function isVerified(): bool { return (bool) $this->verified; }

    public function markVerified(int $verifiedBy): void
    {
        $this->update([
            'verified' => true,
            'verified_by' => $verifiedBy,
            'verified_at' => now(),
        ]);
    }

    public function isEnrolled(): bool { return $this->enrollment_status === 'active'; }

    public function isDropped(): bool { return $this->enrollment_status === 'dropped'; }

    // ─── Scopes ─────────────────────────────────────────────────────────

    public function scopeVerified($query) { return $query->where('verified', true); }

    public function scopeUnverified($query) { return $query->where('verified', false); }

    public function scopeForSession($query, int $sessionId) { return $query->where('session_id', $sessionId); }

    public function scopeForStream($query, int $streamId) { return $query->where('stream_id', $streamId); }

    public function scopeEnrolled($query) { return $query->where('enrollment_status', 'active'); }

    /** Active LMS class enrollments for this student (via user_id). */
    public function currentEnrollments(): HasMany
    {
        return $this->hasMany(LmsClassEnrollment::class, 'user_id', 'user_id')
            ->where('status', 'active');
    }

    /** Alias used by ExamResultController to find the student's class. */
    public function lmsAllocations(): HasMany
    {
        return $this->hasMany(LmsClassEnrollment::class, 'user_id', 'user_id')
            ->where('status', 'active');
    }
}
