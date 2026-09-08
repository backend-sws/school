<?php

namespace App\Models;

use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use App\Traits\Auditable;

class AdmissionApplication extends Model
{
    use Auditable;

    use HasFactory, BelongsToDefaultInstitution;

    protected $table = 'admission_applications';

    public $timestamps = false;
    protected $fillable = [
        'application_id',
        'application_type', // new, readmission
        'user_id',
        'institution_id',
        'admission_head_id',
        'session_id',
        'session_name',
        'semester',
        'applicant_name',
        'father_name',
        'father_mobile',
        'father_qualification',
        'father_occupation',
        'mother_name',
        'class_id',
        'section_id',
        'transport_route_id',
        'transport_stop_id',
        'transport_amount',
        'dob',
        'gender',
        'category',
        'caste',
        'religion',
        'nationality',
        'mobile',
        'email',
        'abc_id',
        'apaar_id',
        'aadhaar_no',
        'blood_group',
        'previous_roll_no',
        'previous_school_name',
        'has_tc',
        'has_government_portal',
        'government_portal_name',
        'photo_url',
        'hostel_required',
        'hostel_amount',
        'medical_condition',
        'disability',
        'allergy',
        'address_snapshot',
        'guardian_snapshot',
        'amount',
        'payment_status',
        'transaction_id',
        'payment_date',
        'process_status',
        'remarks',
        'processed_by',
        'processed_at',
        'submitted_at',
        'admission_date',
        'subject_preferences',
        'previous_board',
        'previous_marks',
        'place',
        'cash_amount',
        'online_amount',
        'online_transaction_id',
        'payment_mode',
        'discount_amount',
        'discount_reason',
        'due_amount',
        'fee_breakdown',
        'fee_regulation_profile_id',
        'hostel_id',
        'hostel_room_id',
        'hostel_bed_id',
    ];

    protected function casts(): array
    {
        return [
            'dob' => 'date:Y-m-d',
            'amount' => 'decimal:2',
            'transport_amount' => 'decimal:2',
            'hostel_amount' => 'decimal:2',
            'cash_amount' => 'decimal:2',
            'online_amount' => 'decimal:2',
            'discount_amount' => 'decimal:2',
            'due_amount' => 'decimal:2',
            'address_snapshot' => 'array',
            'payment_date' => 'datetime',
            'processed_at' => 'datetime',
            'submitted_at' => 'datetime',
            'subject_preferences' => 'array',
            'previous_marks' => 'decimal:2',
            'guardian_snapshot' => 'array',
            'has_tc' => 'boolean',
            'has_government_portal' => 'boolean',
            'hostel_required' => 'boolean',
            'admission_date' => 'date:Y-m-d',
            'created_at' => 'datetime',
            'updated_at' => 'datetime',
            'fee_breakdown' => 'array',
        ];
    }

    // --- Relationships ---

    /**
     * User who applied
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function feeRegulationProfile(): BelongsTo
    {
        return $this->belongsTo(FeeRegulationProfile::class, 'fee_regulation_profile_id');
    }

    /**
     * Institution associated with application
     */
    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    /**
     * Admission configuration (Head)
     */
    public function admissionHead(): BelongsTo
    {
        return $this->belongsTo(AdmissionHead::class);
    }

    /**
     * Academic Session (String based foreign key if applicable)
     */
    public function session(): BelongsTo
    {
        return $this->belongsTo(Session::class, 'session_id');
    }

    /**
     * Class associated with the application (fallback for Application Desk)
     */
    public function lmsClass(): BelongsTo
    {
        return $this->belongsTo(LmsClass::class, 'class_id');
    }

    /**
     * Stream associated via class_id (Application Desk stores stream IDs in class_id)
     */
    public function stream(): BelongsTo
    {
        return $this->belongsTo(Stream::class, 'class_id');
    }

    /**
     * Section associated with the application (LMS class)
     */
    public function lmsSection(): BelongsTo
    {
        return $this->belongsTo(LmsClass::class, 'section_id');
    }

    public function getSectionNameAttribute(): ?string
    {
        if ($this->relationLoaded('lmsSection') && $this->lmsSection) {
            return $this->lmsSection->section ? "{$this->lmsSection->name} ({$this->lmsSection->section})" : $this->lmsSection->name;
        }
        if (!empty($this->section_id)) {
            $sec = LmsClass::withoutGlobalScopes()->find($this->section_id);
            return $sec?->section ? "{$sec->name} ({$sec->section})" : $sec?->name;
        }
        return null;
    }

    public function getClassNameAttribute(): ?string
    {
        if ($this->relationLoaded('lmsClass') && $this->lmsClass) {
            return $this->lmsClass->name;
        }
        if ($this->relationLoaded('stream') && $this->stream) {
            return $this->stream->name;
        }
        if (!empty($this->class_id)) {
            return Stream::withoutGlobalScopes()->find($this->class_id)?->name
                ?? LmsClass::withoutGlobalScopes()->find($this->class_id)?->name;
        }
        return null;
    }

    public function getMainStreamNameAttribute(): ?string
    {
        if (!empty($this->stream_id)) {
            $ms = MainStream::withoutGlobalScopes()->find($this->stream_id);
            if ($ms) return $ms->name;
        }
        if ($this->relationLoaded('admissionHead') && $this->admissionHead) {
            $name = $this->admissionHead->mainStream?->name ?? $this->admissionHead->stream?->mainStream?->name;
            if ($name) return $name;
            if ($this->admissionHead->main_stream_id) {
                return MainStream::withoutGlobalScopes()->find($this->admissionHead->main_stream_id)?->name;
            }
        }
        if (!empty($this->subject_preferences['_draft_stream_id'])) {
            return MainStream::withoutGlobalScopes()->find($this->subject_preferences['_draft_stream_id'])?->name;
        }
        return null;
    }

    public function getSessionNameAttribute(): ?string
    {
        if ($this->relationLoaded('session') && $this->session) {
            return $this->session->name;
        }
        if (!empty($this->session_id)) {
            return Session::withoutGlobalScopes()->find($this->session_id)?->name;
        }
        return null;
    }

    /**
     * Admin/Staff who processed this application
     */
    public function processor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'processed_by');
    }

    /**
     * Selected Subjects for this application (MJC, MIC etc.)
     */
    public function subjects()
    {
        return $this->hasMany(AdmissionApplicationSubject::class);
    }

    public function hostel(): BelongsTo
    {
        return $this->belongsTo(Hostel::class);
    }

    public function hostelRoom(): BelongsTo
    {
        return $this->belongsTo(HostelRoom::class);
    }

    public function hostelBed(): BelongsTo
    {
        return $this->belongsTo(HostelBed::class);
    }

    // --- Scopes ---

    public function scopePending($query)
    {
        return $query->where('process_status', 'pending');
    }

    public function scopePaid($query)
    {
        return $query->where('payment_status', 'success');
    }

    public function transactions()
    {
        return $this->morphMany(Transaction::class, 'payable');
    }


    public function transaction()
    {
        return $this->hasOne(Transaction::class, 'transaction_id', 'transaction_id');
    }

    // ─── Status Helpers ─────────────────────────────────────────────────

    public function isPending(): bool { return $this->process_status === 'pending'; }

    public function isApproved(): bool { return $this->process_status === 'approved'; }

    public function isRejected(): bool { return $this->process_status === 'rejected'; }

    public function isPaid(): bool { return $this->payment_status === 'success'; }

    public function isUnpaid(): bool { return $this->payment_status !== 'success'; }

    public function hasDue(): bool { return ($this->due_amount ?? 0) > 0; }

    /**
     * Recalculate total from the stored fee breakdown.
     */
    public function getItemizedTotal(): float
    {
        if (!is_array($this->fee_breakdown) || empty($this->fee_breakdown)) {
            return (float) ($this->amount ?? 0);
        }

        return (float) collect($this->fee_breakdown)
            ->sum(fn($item) => (float) ($item['amount'] ?? 0));
    }

    // ─── Status Mutations ───────────────────────────────────────────────

    public function markApproved(int $processedBy, ?string $remarks = null): void
    {
        $this->update([
            'process_status' => 'approved',
            'processed_by' => $processedBy,
            'processed_at' => now(),
            'remarks' => $remarks ?? $this->remarks,
        ]);
    }

    public function markRejected(int $processedBy, string $remarks): void
    {
        $this->update([
            'process_status' => 'rejected',
            'processed_by' => $processedBy,
            'processed_at' => now(),
            'remarks' => $remarks,
        ]);
    }

    public function markPaid(string $transactionId, ?string $mode = null): void
    {
        $this->update([
            'payment_status' => 'success',
            'transaction_id' => $transactionId,
            'payment_date' => now(),
            'payment_mode' => $mode ?? $this->payment_mode,
        ]);
    }

    // ─── Scopes ─────────────────────────────────────────────────────────

    public function scopeApproved($query) { return $query->where('process_status', 'approved'); }

    public function scopeRejected($query) { return $query->where('process_status', 'rejected'); }

    public function scopeForSession($query, int $sessionId) { return $query->where('session_id', $sessionId); }

    public function scopeForStream($query, int $streamId)
    {
        return $query->whereHas('admissionHead', fn($q) => $q->where('stream_id', $streamId));
    }
}

