<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * Workflow: named permission set. Scopes (scope_type + scope_id) are in workflow_scopes so the same workflow can exist in multiple scopes.
 */
class Workflow extends Model
{
    protected $table = 'workflows';

    protected $fillable = ['key', 'name', 'description', 'subscription_module'];

    /* ── Scopes ────────────────────────────────────────────── */

    /**
     * Workflows visible for the given institution: join workflow_scopes for global; or scope_type = institution's type (school|college|coaching|university).
     */
    public function scopeForInstitution($query, ?int $institutionId)
    {
        $institutionType = $institutionId !== null ? (Institution::find($institutionId)?->type?->value ?? config('ems.default_institution_type')) : null;
        return $query->whereExists(function ($q) use ($institutionId, $institutionType) {
            $q->from('workflow_scopes')
                ->whereColumn('workflow_scopes.workflow_id', 'workflows.id')
                ->where(function ($q2) use ($institutionId, $institutionType) {
                    $q2->whereNull('workflow_scopes.scope_type')->orWhere('workflow_scopes.scope_type', 'global');
                    if ($institutionType !== null) {
                        $q2->orWhere(fn($q3) => $q3->where('workflow_scopes.scope_type', $institutionType)->whereNull('workflow_scopes.scope_id'));
                        $q2->orWhere(fn($q3) => $q3->where('workflow_scopes.scope_type', $institutionType)->where('workflow_scopes.scope_id', $institutionId));
                    }
                });
        });
    }

    /* ── Relationships ───────────────────────────────────── */

    /** Scope rows: this workflow can exist in multiple scope_type/scope_id. */
    public function workflowScopes(): HasMany
    {
        return $this->hasMany(WorkflowScope::class);
    }

    /** Permissions in this workflow. */
    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'workflow_permissions');
    }

    /** Roles that use this workflow. */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_workflows');
    }

    /** Users directly assigned this workflow. */
    public function users()
    {
        return $this->belongsToMany(User::class, 'user_workflows');
    }
}
