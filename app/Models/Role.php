<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Collection;
use App\Traits\Auditable;
use App\Traits\BelongsToDefaultInstitution;

class Role extends Model
{
    use Auditable, BelongsToDefaultInstitution;

    protected $table = 'roles';

    public $timestamps = false;

    protected $fillable = ['key', 'name', 'level', 'description', 'is_system'];

    /* ── Scopes ────────────────────────────────────────────── */

    /**
     * Roles visible for the given institution: join role_scopes for global; or scope_type = institution's type.
     */
    public function scopeForInstitution($query, ?int $institutionId)
    {
        $institutionType = $institutionId !== null ? (Institution::find($institutionId)?->type?->value ?? config('ems.default_institution_type')) : null;
        return $query->whereExists(function ($q) use ($institutionId, $institutionType) {
            $q->from('role_scopes')
                ->whereColumn('role_scopes.role_id', 'roles.id')
                ->where(function ($q2) use ($institutionId, $institutionType) {
                    $q2->whereNull('role_scopes.scope_type')->orWhere('role_scopes.scope_type', 'global');
                    if ($institutionType !== null) {
                        $q2->orWhere(fn($q3) => $q3->where('role_scopes.scope_type', $institutionType)->whereNull('role_scopes.scope_id'));
                        $q2->orWhere(fn($q3) => $q3->where('role_scopes.scope_type', $institutionType)->where('role_scopes.scope_id', $institutionId));
                    }
                });
        });
    }

    /* ── Relationships ───────────────────────────────────── */

    /** Scope rows: this role can exist in multiple scope_type/scope_id. */
    public function roleScopes(): HasMany
    {
        return $this->hasMany(RoleScope::class);
    }

    /** Users assigned this role. */
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_roles')
            ->withPivot(['institution_id', 'assigned_at']);
    }

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'role_permissions');
    }

    public function workflows()
    {
        return $this->belongsToMany(Workflow::class, 'role_workflows');
    }

    /**
     * All permission keys for this role (direct role_permissions + permissions from scoped workflows).
     * When $institutionId is provided, workflows are filtered via workflow_scopes
     * so institution-type-specific variants (e.g. academic_setup_school) are used.
     */
    public function getAllPermissionKeys(?int $institutionId = null): Collection
    {
        $fromDirect = $this->relationLoaded('permissions')
            ? $this->permissions->pluck('key')
            : $this->permissions()->pluck('key');

        // Get workflow IDs assigned to this role
        $roleWorkflowIds = $this->workflows()->pluck('workflows.id');

        // Filter by institution scope (workflow_scopes) when institution context is available
        $workflowsQuery = Workflow::whereIn('workflows.id', $roleWorkflowIds)
            ->with('permissions');
        if ($institutionId !== null) {
            $workflowsQuery->forInstitution($institutionId);
        }
        $fromWorkflows = $workflowsQuery->get()
            ->flatMap(fn($w) => $w->permissions->pluck('key'));

        return $fromDirect->merge($fromWorkflows)->unique()->values();
    }
}
