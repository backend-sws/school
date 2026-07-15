<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;
use App\Traits\Auditable;
use App\Traits\NotifiableRealtime;
use App\Traits\ResolvesUserContext;

use App\Services\PermissionResolverService;
use App\Support\InstitutionContext;


use Illuminate\Database\Eloquent\Builder;

use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use App\Notifications\Auth\ResetPasswordNotification as CustomResetPasswordNotification;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, NotifiableRealtime, TwoFactorAuthenticatable, Auditable, ResolvesUserContext, \App\Traits\BelongsToDefaultInstitution;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'institution_id',
        'name',
        'email',
        'contact_email', // real address for notifications when email is a placeholder (e.g. +student suffix)
        'password',
        'reg_no',
        'mobile',
        'photo_url',
        'avatar_url', // mapped to photo_url via setAvatarUrlAttribute for API/frontend
        'last_login',
        'email_verified_at',
        'two_factor_confirmed_at',
        'otp_code',
        'otp_expires_at',
        'status',
        'onboarding_token',
        'onboarding_data',
        'system_generated_password',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'two_factor_secret',
        'two_factor_recovery_codes',
        'remember_token',
        'otp_code',
        'two_factor_confirmed_at',
        'otp_expires_at',
        'otp_confirmed_at',
        'onboarding_token',
        'onboarding_data',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $appends = ['avatar_url', 'primary_email', 'effective_email_verified'];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
            'onboarding_data' => 'array',
            'system_generated_password' => 'boolean',
        ];
    }

    /**
     * Avatar URL (alias for photo_url for API/frontend).
     */
    public function getAvatarUrlAttribute(): ?string
    {
        return $this->attributes['photo_url'] ?? null;
    }

    public function setAvatarUrlAttribute(?string $value): void
    {
        $this->attributes['photo_url'] = $value;
    }

    /**
     * Avatar image URL for display (header/sidebar use auth.user.avatar).
     */
    public function getAvatarAttribute(): ?string
    {
        return $this->avatar_url ?? $this->attributes['photo_url'] ?? null;
    }

    /**
     * Primary (contact) email for display and notifications (real address, not placeholder).
     * Appended as primary_email in API so lists can show the real contact.
     */
    public function getPrimaryEmailAttribute(): ?string
    {
        return $this->getNotificationEmail();
    }

    /**
     * Email address to use for verification/notification (real contact, not placeholder).
     * Prefer contact_email; if user.email is a placeholder, fall back to linked guardian's email so mail goes to parent.
     */
    public function getNotificationEmail(): ?string
    {
        $contact = $this->attributes['contact_email'] ?? null;
        if (!empty($contact)) {
            return $contact;
        }
        $email = $this->email ?? null;
        // Placeholder emails (same parent contact → unique per student) should not receive mail; use guardian's real email
        if ($email && (str_contains($email, '+student') || str_contains($email, '@internal.local'))) {
            $guardianEmail = $this->guardians()->whereNotNull('email')->where('email', '!=', '')->value('email');
            if (!empty($guardianEmail)) {
                return $guardianEmail;
            }
        }
        return $email;
    }

    /**
     * Route mail notifications to the effective contact email (primary_email / contact_email).
     */
    public function routeNotificationForMail(): ?string
    {
        return $this->getNotificationEmail();
    }

    /** Whether this user's email is considered verified (no need to send verification link). */
    public function isEmailVerified(): bool
    {
        return !empty($this->email_verified_at);
    }

    /**
     * Effectively verified: either this user is verified, or their primary (parent) email is already verified on another user.
     * So multiple students with the same primary email are not asked to verify again once one is verified.
     */
    public function isEffectivelyVerified(): bool
    {
        if ($this->isEmailVerified()) {
            return true;
        }
        $email = $this->getNotificationEmail();
        if (empty($email)) {
            return false;
        }
        return static::isPrimaryEmailVerifiedElsewhere($email, $this->id);
    }

    /** Check if this primary/contact email is already verified on any user (optionally excluding one user id). */
    public static function isPrimaryEmailVerifiedElsewhere(string $email, ?int $excludeUserId = null): bool
    {
        $query = static::query()
            ->where(fn($q) => $q->where('email', $email)->orWhere('contact_email', $email))
            ->where(fn($q) => $q->whereNotNull('email_verified_at'));
        if ($excludeUserId !== null) {
            $query->where('id', '!=', $excludeUserId);
        }
        return $query->exists();
    }

    /** For list/API: true if this user or their primary email is already verified (so same-parent siblings show verified). */
    public function getEffectiveEmailVerifiedAttribute(): bool
    {
        return $this->isEffectivelyVerified();
    }

    public function hasRole($role): bool
    {
        return $this->roles()->where('key', $role)->exists();
    }

    /**
     * Roles relationship
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'user_roles')
            ->withPivot(['institution_id', 'assigned_at']);
    }

    /** Workflows assigned directly to this user (permissions from these are added to effective set). */
    public function workflows()
    {
        return $this->belongsToMany(Workflow::class, 'user_workflows')
            ->withPivot(['institution_id', 'assigned_by', 'assigned_at']);
    }

    /** Direct permission grant/revoke overrides (user_permissions). */
    public function permissionOverrides()
    {
        return $this->belongsToMany(Permission::class, 'user_permissions')
            ->withPivot(['granted', 'institution_id']);
    }

    /**
     * Check if user has global administrative access
     */
    public function isGlobal(): bool
    {
        return $this->roles()->whereHas('roleScopes', fn($q) => $q->where('scope_type', 'global'))->exists();
    }

    /**
     * Student Profile relationship
     */
    public function studentProfile(): HasOne
    {
        return $this->hasOne(StudentProfile::class);
    }

    /**
     * Guardians (parents) linked to this student. One student can have multiple guardians (e.g. father, mother).
     */
    public function guardians(): BelongsToMany
    {
        return $this->belongsToMany(Guardian::class, 'guardian_students', 'user_id', 'guardian_id')
            ->withPivot(['relation', 'is_primary'])
            ->withTimestamps();
    }

    /**
     * When this User is a parent: Guardian records they own (user_id = this user). One parent User → many Guardian records → each has many students.
     */
    public function guardianRecords(): HasMany
    {
        return $this->hasMany(Guardian::class, 'user_id');
    }

    public function staffProfile(): HasOne
    {
        return $this->hasOne(StaffProfile::class);
    }

    /** Payment cards stored for billing (one user → many cards). */
    public function paymentCards(): HasMany
    {
        return $this->hasMany(PaymentCard::class);
    }

    /** Default payment card (convenience accessor). */
    public function defaultPaymentCard(): HasOne
    {
        return $this->hasOne(PaymentCard::class)->where('is_default', true);
    }

    public function transportAssignments(): HasMany
    {
        return $this->hasMany(TransportAssignment::class, 'user_id');
    }

    public function hostelAllocations(): HasMany
    {
        return $this->hasMany(HostelAllocation::class, 'user_id');
    }

    // ─── Status Helpers ─────────────────────────────────────────────────

    public function isActive(): bool
    {
        return (int) $this->status === 1;
    }

    public function isDisabled(): bool
    {
        return (int) $this->status === 0;
    }

    public function markAsActive(): void
    {
        $this->update(['status' => 1]);
    }

    public function markAsDisabled(): void
    {
        $this->update(['status' => 0]);
    }

    public function markEmailVerified(): void
    {
        $this->update(['email_verified_at' => now()]);
    }

    // ─── Role Helpers (polymorphic — any role key, any institution) ──────

    /** Check if user has a specific role at a given institution. */
    public function hasRoleAt(string $roleKey, ?int $institutionId = null): bool
    {
        return $this->roles()
            ->where('roles.key', $roleKey)
            ->when($institutionId, fn($q) => $q->where('user_roles.institution_id', $institutionId))
            ->exists();
    }

    public function isSuperAdmin(): bool
    {
        return $this->hasRoleAt('super_admin');
    }

    // ─── Scopes ─────────────────────────────────────────────────────────

    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 1);
    }

    public function scopeDisabled(Builder $query): Builder
    {
        return $query->where('status', 0);
    }

    public function scopeVerified(Builder $query): Builder
    {
        return $query->whereNotNull('email_verified_at');
    }

    public function scopeWithRoleAt(Builder $query, string $roleKey, int $institutionId): Builder
    {
        return $query->whereHas('roles', fn($q) => $q
            ->where('roles.key', $roleKey)
            ->where('user_roles.institution_id', $institutionId));
    }

    /**
     * Request-scoped cache of effective permission keys. 
     * Keyed by institution_id (or 'all' for un-scoped resolution).
     * @var array<string, array<string>>
     */
    protected array $cachedPermissionKeys = [];

    /**
     * Resolve and return the user's effective permission keys for a specific institution context.
     * When $institutionId is null, uses InstitutionContext::getActiveInstitutionId($this).
     * Delegates to PermissionResolverService; result is cached per request on the user.
     *
     * @param int|null $institutionId When null, resolved from InstitutionContext (session-locked).
     * @return array<string>
     */
    public function resolveEffectivePermissionKeys(?int $institutionId = null): array
    {
        if ($institutionId === null) {
            $institutionId = InstitutionContext::getActiveInstitutionId($this);
        }
        $cacheKey = $institutionId ?? 'all';

        if (isset($this->cachedPermissionKeys[$cacheKey])) {
            return $this->cachedPermissionKeys[$cacheKey];
        }

        $resolver = app(PermissionResolverService::class);
        $this->cachedPermissionKeys[$cacheKey] = $resolver->resolveEffectivePermissionKeys($this, $institutionId);

        return $this->cachedPermissionKeys[$cacheKey];
    }

    /**
     * Check if user has ability in a specific institution context.
     * Prefer passing $institutionId explicitly (e.g. from InstitutionContext::getActiveInstitutionId()).
     * When null, resolves via InstitutionContext so one-arg calls keep working.
     *
     * @param string $permissionKey
     * @param int|null $institutionId Active institution id; when null, uses InstitutionContext::getActiveInstitutionId($this)
     */
    public function hasAbility(string $permissionKey, ?int $institutionId = null): bool
    {
        $contextId = $institutionId ?? InstitutionContext::getActiveInstitutionId($this);

        $keys = $this->resolveEffectivePermissionKeys($contextId);

        return in_array($permissionKey, $keys, true);
    }

    public function academicInfo(): HasMany
    {
        return $this->hasMany(StudentAcademicInfo::class, 'user_id');
    }
    public function documents(): HasMany
    {
        return $this->hasMany(StudentDocument::class);
    }

    public function attendanceRecords(): HasMany
    {
        return $this->hasMany(AttendanceRecord::class, 'user_id');
    }

    /**
     * Scope: users who have admission_cell workflow for the given institution (for notification targeting).
     *
     * @param  Builder<User>  $query
     * @return Builder<User>
     */
    public function scopeWithAdmissionCellForInstitution(Builder $query, int $institutionId): Builder
    {
        return $query->whereHas('workflows', function ($q) use ($institutionId) {
            $q->where('workflows.key', 'admission_cell')
                ->where(function ($q2) use ($institutionId) {
                    $q2->where('user_workflows.institution_id', $institutionId)
                        ->orWhereNull('user_workflows.institution_id');
                });
        });
    }

    /**
     * Scope: users who have redressal_cell workflow for the given institution (for notification targeting).
     *
     * @param  Builder<User>  $query
     * @return Builder<User>
     */
    public function scopeWithRedressalCellForInstitution(Builder $query, int $institutionId): Builder
    {
        return $query->whereHas('workflows', function ($q) use ($institutionId) {
            $q->where('workflows.key', 'redressal_cell')
                ->where(function ($q2) use ($institutionId) {
                    $q2->where('user_workflows.institution_id', $institutionId)
                        ->orWhereNull('user_workflows.institution_id');
                });
        });
    }

    /**
     * Send the password reset notification.
     * Overridden to support dual-channel delivery (Email + SMS/WhatsApp).
     *
     * @param  string  $token
     * @return void
     */
    public function sendPasswordResetNotification($token): void
    {
        $this->notify(new CustomResetPasswordNotification($token));
    }

    /**
     * Get the e-mail address used for password reset.
     * Overridden to support mobile-only users (returns mobile if email is null).
     *
     * @return string|null
     */
    public function getEmailForPasswordReset()
    {
        return $this->email ?? $this->mobile;
    }

    /**
     * Payroll relations
     */
    public function salaryStructure(): HasOne
    {
        return $this->hasOne(StaffSalaryStructure::class, 'user_id');
    }

    public function payslips(): HasMany
    {
        return $this->hasMany(Payslip::class, 'user_id');
    }

}

