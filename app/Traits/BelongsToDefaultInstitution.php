<?php

namespace App\Traits;

use App\Enums\InstitutionType;
use App\Models\Institution;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Session;

trait BelongsToDefaultInstitution
{
    /** Session key for the active institution id (scope_id; used when multi-institution mode is on). */
    public const SESSION_ACTIVE_INSTITUTION_ID = 'active_institution_id';

    /**
     * Resolve the active institution id for the current request.
     *
     * For AUTHENTICATED users: Session → user_roles.institution_id → profile fallbacks.
     * Subdomain config is NEVER used for authenticated users.
     *
     * For UNAUTHENTICATED requests: config('ems.default_institution_id') (set by middleware from subdomain).
     */
    public static function getActiveInstitutionId(?User $user = null): ?int
    {
        $user = $user ?? request()->user() ?? auth()->user();

        if ($user) {
            // Authenticated: role-first resolution (subdomain is irrelevant)
            $sessionId = Session::get(static::SESSION_ACTIVE_INSTITUTION_ID);
            if ($sessionId !== null && $sessionId !== '') {
                $allowed = static::allowedInstitutionIds($user);
                if (in_array((int) $sessionId, $allowed, true)) {
                    return (int) $sessionId;
                }
            }

            return static::getDefaultInstitutionId($user);
        }

        // Unauthenticated: subdomain config (public pages like landing, admission forms)
        $id = config('ems.default_institution_id');
        return $id !== null && $id !== '' ? (int) $id : null;
    }

    /**
     * Resolve the active institution's type (school, college, coaching, university) for scope_type matching.
     */
    public static function getActiveInstitutionType(?User $user = null): ?string
    {
        $institutionId = static::getActiveInstitutionId($user);
        if ($institutionId === null) {
            return null;
        }
        $institution = Institution::find($institutionId);

        return $institution?->type instanceof InstitutionType
            ? $institution->type->value
            : (is_string($institution?->type) ? $institution->type : config('ems.default_institution_type'));
    }

    /**
     * Default institution id for the user when no session is set (e.g. first login).
     * Order: first institution-scoped role (institution_id NOT NULL) → student_profiles → staff_profiles.
     */
    public static function getDefaultInstitutionId(User $user): ?int
    {
        // Primary: user_roles with institution_id
        $role = $user->roles()->withoutGlobalScope('institution_scope')
            ->whereNotNull('user_roles.institution_id')
            ->first();

        if ($role && $role->pivot->institution_id !== null) {
            return (int) $role->pivot->institution_id;
        }

        // Fallback: student_profiles (for students without explicit role scope)
        $studentInstitutionId = DB::table('student_profiles')
            ->where('user_id', $user->id)
            ->value('institution_id');
        if ($studentInstitutionId !== null) {
            return (int) $studentInstitutionId;
        }

        // Fallback: staff_profiles
        $staffInstitutionId = DB::table('staff_profiles')
            ->where('user_id', $user->id)
            ->value('institution_id');
        if ($staffInstitutionId !== null) {
            return (int) $staffInstitutionId;
        }

        return null;
    }

    /**
     * Institution ids the user is allowed to access (for session validation and switcher).
     *
     * @return array<int>
     */
    public static function allowedInstitutionIds(User $user): array
    {
        // From roles: institution_id NOT NULL
        $fromRoles = $user->roles()->withoutGlobalScope('institution_scope')
            ->whereNotNull('user_roles.institution_id')
            ->pluck('user_roles.institution_id')
            ->map(fn($id) => (int) $id)
            ->unique()
            ->values()
            ->all();

        // From student profiles (fallback for legacy)
        $fromStudent = DB::table('student_profiles')
            ->where('user_id', $user->id)
            ->pluck('institution_id')
            ->filter()
            ->map(fn($id) => (int) $id)
            ->values()
            ->all();

        // From staff profiles (fallback for legacy)
        $fromStaff = DB::table('staff_profiles')
            ->where('user_id', $user->id)
            ->pluck('institution_id')
            ->filter()
            ->map(fn($id) => (int) $id)
            ->values()
            ->all();

        return array_values(array_unique(array_merge($fromRoles, $fromStudent, $fromStaff)));
    }

    /**
     * Set the active institution (scope_id) for the current session (e.g. institution switcher).
     * Only sets if the institution is in the user's allowed list.
     */
    public static function setActiveInstitutionId(int $institutionId, ?User $user = null): bool
    {
        $user = $user ?? request()->user() ?? auth()->user();
        if (!$user) {
            return false;
        }

        $allowed = static::allowedInstitutionIds($user);
        if (!in_array($institutionId, $allowed, true)) {
            return false;
        }

        Session::put(static::SESSION_ACTIVE_INSTITUTION_ID, $institutionId);
        static::syncSessionTableContext($institutionId);

        return true;
    }

    /**
     * Set session (and sessions table) to the user's default institution. Call after login.
     * Ensures active_institution_id is always set
     * (from role scope_id / student_profiles.institution_id / staff_profiles.institution_id or config).
     */
    public static function refreshDefaultAfterLogin(User $user): void
    {
        $default = static::getDefaultInstitutionId($user);

        if ($default === null && !config('ems.multi_institution_mode')) {
            $configId = config('ems.default_institution_id');
            $default = ($configId !== null && $configId !== '') ? (int) $configId : null;
        }

        if ($default !== null) {
            Session::put(static::SESSION_ACTIVE_INSTITUTION_ID, $default);
            static::syncSessionTableContext($default);
        }

    }

    /**
     * When using database session driver, update the sessions table row with context columns (active_institution_id).
     */
    protected static function syncSessionTableContext(?int $activeInstitutionId): void
    {
        if (config('session.driver') !== 'database') {
            return;
        }

        $id = Session::getId();
        if (!$id) {
            return;
        }

        $table = config('session.table', 'sessions');
        $payload = [
            'context_updated_at' => now(),
            'active_institution_id' => $activeInstitutionId,
        ];

        DB::table($table)->where('id', $id)->update($payload);
    }

    /**
     * Boot the trait: global scope institution_scope (scope_type + scope_id for roles; institution_id for others).
     * Auto-populates scope_id/scope_type or institution_id when not set.
     */
    public static function bootBelongsToDefaultInstitution(): void
    {
        static::creating(function ($model) {
            $table = $model->getTable();
            if ($table === 'roles') {
                return;
            }
            if (empty($model->institution_id)) {
                if (!config('ems.multi_institution_mode')) {
                    $model->institution_id = config('ems.default_institution_id');
                } else {
                    $user = request()->user() ?? auth()->user();
                    if ($user) {
                        $institutionId = static::getActiveInstitutionId($user);
                        if ($institutionId !== null) {
                            $model->institution_id = $institutionId;
                        }
                    }
                }
            }
        });

        static::addGlobalScope('institution_scope', function ($builder) {
            $model = $builder->getModel();
            $table = $model->getTable();

            // Prevent infinite recursion during Auth user resolution
            if ($table === 'users' && !auth()->hasUser()) {
                return;
            }

            $user = request()->user() ?? auth()->user();
            if ($user !== null) {
                $isGlobal = $user->roles()->withoutGlobalScope('institution_scope')->whereHas('roleScopes', fn($q) => $q->where('scope_type', 'global'))->exists();

                if ($isGlobal) {
                    return;
                }

                $institutionId = static::getActiveInstitutionId($user);
                $institutionType = static::getActiveInstitutionType($user);

                if ($table === 'roles') {
                    if ($institutionId !== null && $institutionType !== null) {
                        $builder->whereExists(function ($q) use ($institutionId, $institutionType) {
                            $q->from('role_scopes')
                                ->whereColumn('role_scopes.role_id', 'roles.id')
                                ->where(function ($q2) use ($institutionType, $institutionId) {
                                    $q2->whereNull('role_scopes.scope_type')
                                        ->orWhere('role_scopes.scope_type', 'global')
                                        ->orWhere(fn($q3) => $q3->where('role_scopes.scope_type', $institutionType)->whereNull('role_scopes.scope_id'))
                                        ->orWhere(fn($q3) => $q3->where('role_scopes.scope_type', $institutionType)->where('role_scopes.scope_id', $institutionId));
                                });
                        });
                    }
                    return;
                }

                if ($institutionId !== null) {
                    $builder->where($table . '.institution_id', $institutionId);
                    return;
                }
            }

            if ($table === 'roles') {
                if (!config('ems.multi_institution_mode')) {
                    $defaultId = config('ems.default_institution_id');
                    if ($defaultId !== null && $defaultId !== '') {
                        $defaultId = (int) $defaultId;
                        $defaultType = Institution::find($defaultId)?->type?->value ?? config('ems.default_institution_type');
                        $builder->whereExists(function ($q) use ($defaultId, $defaultType) {
                            $q->from('role_scopes')
                                ->whereColumn('role_scopes.role_id', 'roles.id')
                                ->where(function ($q2) use ($defaultType, $defaultId) {
                                    $q2->whereNull('role_scopes.scope_type')
                                        ->orWhere('role_scopes.scope_type', 'global')
                                        ->orWhere(fn($q3) => $q3->where('role_scopes.scope_type', $defaultType)->where('role_scopes.scope_id', $defaultId));
                                });
                        });
                    }
                }
                return;
            }

            if (!config('ems.multi_institution_mode')) {
                $defaultId = config('ems.default_institution_id');
                if ($defaultId !== null && $defaultId !== '') {
                    $builder->where($table . '.institution_id', $defaultId);
                }
            }
        });
    }

    /**
     * Scope to filter by default institution when in single-institution mode.
     * Roles: by role_scopes; other tables: by institution_id.
     */
    public function scopeForDefaultInstitution($query)
    {
        if (config('ems.multi_institution_mode')) {
            return $query;
        }
        $table = $query->getModel()->getTable();
        $defaultId = config('ems.default_institution_id');
        if ($defaultId === null || $defaultId === '') {
            return $query;
        }
        if ($table === 'roles') {
            $defaultType = Institution::find($defaultId)?->type?->value ?? config('ems.default_institution_type');
            return $query->whereExists(function ($q) use ($defaultId, $defaultType) {
                $q->from('role_scopes')
                    ->whereColumn('role_scopes.role_id', 'roles.id')
                    ->where(function ($q2) use ($defaultType, $defaultId) {
                        $q2->whereNull('role_scopes.scope_type')
                            ->orWhere('role_scopes.scope_type', 'global')
                            ->orWhere(fn($q3) => $q3->where('role_scopes.scope_type', $defaultType)->where('role_scopes.scope_id', $defaultId));
                    });
            });
        }
        return $query->where($table . '.institution_id', $defaultId);
    }

    /**
     * Get the effective institution id (from request or default).
     */
    public static function getEffectiveInstitutionId($requestInstitutionId = null): int
    {
        if ($requestInstitutionId) {
            return (int) $requestInstitutionId;
        }

        if (!config('ems.multi_institution_mode')) {
            return (int) config('ems.default_institution_id');
        }

        throw new \InvalidArgumentException('institution_id (scope_id) is required in multi-institution mode');
    }
}
