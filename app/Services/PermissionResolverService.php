<?php

namespace App\Services;

use App\Models\Institution;
use App\Models\Permission;
use App\Models\User;
use App\Support\InstitutionContext;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Query\Builder as QueryBuilder;

/**
 * Centralised role and permission resolution. Use this service (or the user methods that delegate to it)
 * whenever you need effective permission keys or scope checks for an institution context.
 */
class PermissionResolverService
{
    /**
     * Resolve effective permission keys for a user in an institution context.
     * When $institutionId is null, uses InstitutionContext::getActiveInstitutionId($user).
     *
     * @return array<string>
     */
    public function resolveEffectivePermissionKeys(User $user, ?int $institutionId = null): array
    {
        if ($this->userHasSuperAdmin($user)) {
            return Permission::pluck('key')->all();
        }

        if ($institutionId === null) {
            $institutionId = InstitutionContext::getActiveInstitutionId($user);
        }

        // 1. From roles (assignment scope + role institution). Super admin permissions come from database/seeders/data/role_mapping.php via RoleMappingSeeder.
        $rolesQuery = $this->scopeRolesForInstitution($user->roles()->withoutGlobalScope('institution_scope'), $institutionId);
        $fromRoles = $rolesQuery->with(['permissions', 'workflows.permissions'])
            ->get()
            ->flatMap(fn($role) => $role->getAllPermissionKeys($institutionId));

        // 2. From user workflows (scoped)
        $workflowsQuery = $this->scopeWorkflowsForInstitution($user->workflows()->with('permissions'), $institutionId);
        $fromUserWorkflows = $workflowsQuery->get()->flatMap(fn($w) => $w->permissions->pluck('key'));

        // 3. Permission overrides: granted and revoked (scoped)
        $granted = $this->scopePermissionOverridesForInstitution(
            $user->permissionOverrides()->wherePivot('granted', true),
            $institutionId
        )->pluck('key');

        $revoked = $this->scopePermissionOverridesForInstitution(
            $user->permissionOverrides()->wherePivot('granted', false),
            $institutionId
        )->pluck('key');

        // 4. Merge and apply revokes
        $all = $fromRoles->merge($fromUserWorkflows)->merge($granted)->unique()->values();
        $revokedArray = $revoked->toArray();
        $effective = $all->reject(fn($key) => in_array($key, $revokedArray, true))->values();

        // Done — DB-driven workflows already contain only the right permissions per scope type.
        // No runtime overrides needed.

        return $effective->all();
    }

    /**
     * Check if the user has an ability in the given institution context.
     */
    public function hasAbility(User $user, string $permissionKey, ?int $institutionId = null): bool
    {
        $institutionId = $institutionId ?? InstitutionContext::getActiveInstitutionId($user);
        $keys = $this->resolveEffectivePermissionKeys($user, $institutionId);

        return in_array($permissionKey, $keys, true);
    }

    /**
     * Whether the user has the super_admin role (any scope).
     */
    public function userHasSuperAdmin(User $user): bool
    {
        return $user->roles()
            ->withoutGlobalScope('institution_scope')
            ->where('key', 'super_admin')
            ->exists();
    }

    /**
     * Apply institution scope to a roles relation (user_roles scope + role_scopes eligibility).
     * Uses normalized scope_type = 'institution' for pivot matching.
     * Role eligibility is checked via role_scopes (which still uses institution-type values like 'school').
     */
    public function scopeRolesForInstitution(BelongsToMany $rolesRelation, ?int $institutionId): BelongsToMany
    {
        // Deny-by-default: no institution context = no roles = no permissions
        if ($institutionId === null) {
            return $rolesRelation->whereRaw('1 = 0');
        }

        // Institution type is needed only for role_scopes eligibility check (definition-level)
        $institutionType = Institution::find($institutionId)?->type?->value ?? config('ems.default_institution_type');

        // 1. Match user_roles pivot: institution_id = this institution, or NULL (global)
        $rolesRelation->where(function (Builder $q) use ($institutionId) {
            $q->whereNull('user_roles.institution_id')
                ->orWhere('user_roles.institution_id', $institutionId);
        });

        // 2. Check role_scopes eligibility: role must be allowed for this institution type
        $rolesRelation->whereExists(function (QueryBuilder $q) use ($institutionId, $institutionType) {
            $q->from('role_scopes')
                ->whereColumn('role_scopes.role_id', 'roles.id')
                ->where(function (QueryBuilder $q2) use ($institutionType, $institutionId) {
                    $q2->whereNull('role_scopes.scope_type')->orWhere('role_scopes.scope_type', 'global');
                    $q2->orWhere(fn(QueryBuilder $sq) => $sq->where('role_scopes.scope_type', $institutionType)->whereNull('role_scopes.scope_id'));
                    $q2->orWhere(fn(QueryBuilder $sq) => $sq->where('role_scopes.scope_type', $institutionType)->where('role_scopes.scope_id', $institutionId));
                });
        });

        return $rolesRelation;
    }

    /**
     * Apply institution scope to a user_workflows relation.
     * Uses normalized scope_type = 'institution' for pivot matching.
     */
    public function scopeWorkflowsForInstitution(BelongsToMany $workflowsRelation, ?int $institutionId): BelongsToMany
    {
        // Deny-by-default: no institution context = no workflows = no permissions
        if ($institutionId === null) {
            return $workflowsRelation->whereRaw('1 = 0');
        }

        return $workflowsRelation->where(function (Builder $q) use ($institutionId) {
            $q->whereNull('user_workflows.institution_id')
                ->orWhere('user_workflows.institution_id', $institutionId);
        });
    }

    /**
     * Apply institution scope to a user_permissions (permission overrides) relation.
     * Uses normalized scope_type = 'institution' for pivot matching.
     */
    public function scopePermissionOverridesForInstitution(BelongsToMany $relation, ?int $institutionId): BelongsToMany
    {
        // Deny-by-default: no institution context = no overrides
        if ($institutionId === null) {
            return $relation->whereRaw('1 = 0');
        }

        return $relation->where(function (Builder $q) use ($institutionId) {
            $q->whereNull('user_permissions.institution_id')
                ->orWhere('user_permissions.institution_id', $institutionId);
        });
    }
}
