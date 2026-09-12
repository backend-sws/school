<?php

namespace App\Models;

use App\Support\InstitutionContext;
use App\Traits\Auditable;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GatePass extends Model
{
    use HasFactory, Auditable;

    protected $table = 'gate_passes';

    protected $fillable = [
        'institution_id',
        'pass_number',
        'visitor_name',
        'phone',
        'email',
        'address',
        'id_proof_type',
        'id_proof_number',
        'photo_url',
        'visitor_type',
        'accompanying_count',
        'purpose',
        'department',
        'staff_id',
        'student_user_id',
        'student_name',
        'person_to_meet_custom',
        'gate_name',
        'guard_user_id',
        'vehicle_type',
        'vehicle_number',
        'belongings',
        'check_in_at',
        'check_out_at',
        'duration_minutes',
        'status',
        'exit_guard_user_id',
        'exit_remarks',
        'is_blocked',
        'block_reason',
        'created_by',
        'updated_by',
    ];

    protected $casts = [
        'check_in_at' => 'datetime',
        'check_out_at' => 'datetime',
        'duration_minutes' => 'integer',
        'accompanying_count' => 'integer',
        'is_blocked' => 'boolean',
    ];

    protected $appends = [
        'entry_time',
        'exit_time',
        'belongings_declared',
        'is_inside',
        'stay_duration_minutes',
    ];

    protected static function booted(): void
    {
        static::creating(function (GatePass $pass) {
            if (empty($pass->institution_id) && auth()->check()) {
                $pass->institution_id = InstitutionContext::getActiveInstitutionId(auth()->user());
            }

            if (empty($pass->created_by) && auth()->check()) {
                $pass->created_by = auth()->id();
            }

            if (empty($pass->guard_user_id) && auth()->check()) {
                $pass->guard_user_id = auth()->id();
            }

            if (empty($pass->pass_number)) {
                $pass->pass_number = static::generatePassNumber();
            }

            if (empty($pass->check_in_at)) {
                $pass->check_in_at = Carbon::now();
            }

            if (empty($pass->status)) {
                $pass->status = 'inside_campus';
            }
        });

        static::updating(function (GatePass $pass) {
            if (auth()->check()) {
                $pass->updated_by = auth()->id();
            }
        });
    }

    /**
     * Generate sequential human-friendly pass number (e.g. GP-202609-0001)
     */
    public static function generatePassNumber(): string
    {
        $prefix = 'GP-' . date('Ym') . '-';
        $lastPass = static::withoutGlobalScopes()
            ->where('pass_number', 'like', $prefix . '%')
            ->orderBy('id', 'desc')
            ->first();

        if (! $lastPass) {
            return $prefix . '0001';
        }

        $lastSeq = (int) substr($lastPass->pass_number, -4);

        return $prefix . str_pad((string) ($lastSeq + 1), 4, '0', STR_PAD_LEFT);
    }

    /**
     * Mark exit / check-out with calculated duration.
     */
    public function markExit(?string $remarks = null, ?int $exitGuardId = null): self
    {
        $now = Carbon::now();
        $inTime = $this->check_in_at ? Carbon::parse($this->check_in_at) : $now;
        $minutes = (int) max(0, $inTime->diffInMinutes($now));

        $this->update([
            'check_out_at' => $now,
            'duration_minutes' => $minutes,
            'status' => 'checked_out',
            'exit_guard_user_id' => $exitGuardId ?? (auth()->check() ? auth()->id() : null),
            'exit_remarks' => $remarks,
        ]);

        return $this;
    }

    // ── Attribute Accessors & Mutators ──────────────────────────────────────

    public function getEntryTimeAttribute()
    {
        return $this->check_in_at;
    }

    public function setEntryTimeAttribute($value): void
    {
        $this->attributes['check_in_at'] = $value;
    }

    public function getExitTimeAttribute()
    {
        return $this->check_out_at;
    }

    public function setExitTimeAttribute($value): void
    {
        $this->attributes['check_out_at'] = $value;
    }

    public function getBelongingsDeclaredAttribute()
    {
        return $this->belongings;
    }

    public function setBelongingsDeclaredAttribute($value): void
    {
        $this->attributes['belongings'] = $value;
    }

    public function getStayDurationMinutesAttribute(): ?int
    {
        return $this->duration_minutes;
    }

    public function getIsInsideAttribute(): bool
    {
        return in_array($this->status, ['inside_campus', 'inside']) && is_null($this->check_out_at);
    }

    // ── Relationships ────────────────────────────────────────────────────────

    public function staff(): BelongsTo
    {
        return $this->belongsTo(User::class, 'staff_id');
    }

    public function studentUser(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_user_id');
    }

    public function securityGuard(): BelongsTo
    {
        return $this->belongsTo(User::class, 'guard_user_id');
    }

    public function exitGuard(): BelongsTo
    {
        return $this->belongsTo(User::class, 'exit_guard_user_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    // ── Scopes ───────────────────────────────────────────────────────────────

    public function scopeInsideCampus(Builder $query): Builder
    {
        return $query->whereIn('status', ['inside_campus', 'inside'])->whereNull('check_out_at');
    }

    public function scopeCheckedOut(Builder $query): Builder
    {
        return $query->where('status', 'checked_out')->orWhereNotNull('check_out_at');
    }

    public function scopeToday(Builder $query): Builder
    {
        return $query->whereDate('check_in_at', Carbon::today());
    }

    public function scopeOverstayed(Builder $query, int $thresholdHours = 3): Builder
    {
        return $query->whereIn('status', ['inside_campus', 'inside'])
            ->whereNull('check_out_at')
            ->where('check_in_at', '<', Carbon::now()->subHours($thresholdHours));
    }
}
