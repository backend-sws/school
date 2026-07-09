<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Permission extends Model
{
    protected $table = 'permissions';

    public $timestamps = false;

    protected $fillable = ['key', 'name', 'module', 'description'];

    /* ── Scopes ────────────────────────────────────────────── */

    /**
     * Permissions visible for the given institution: join permission_scopes for global; or scope_type = institution's type.
     */
    public function scopeForInstitution($query, ?int $institutionId)
    {
        $institutionType = $institutionId !== null ? (Institution::find($institutionId)?->type?->value ?? config('ems.default_institution_type')) : null;
        return $query->whereExists(function ($q) use ($institutionId, $institutionType) {
            $q->from('permission_scopes')
                ->whereColumn('permission_scopes.permission_id', 'permissions.id')
                ->where(function ($q2) use ($institutionId, $institutionType) {
                    $q2->whereNull('permission_scopes.scope_type')->orWhere('permission_scopes.scope_type', 'global');
                    if ($institutionType !== null) {
                        $q2->orWhere(fn ($q3) => $q3->where('permission_scopes.scope_type', $institutionType)->whereNull('permission_scopes.scope_id'));
                        $q2->orWhere(fn ($q3) => $q3->where('permission_scopes.scope_type', $institutionType)->where('permission_scopes.scope_id', $institutionId));
                    }
                });
        });
    }

    /** Filter permissions by module name (e.g. 'admission', 'fees'). */
    public function scopeModule($query, string $module)
    {
        return $query->where('module', $module);
    }

    /* ── Relationships ───────────────────────────────────── */

    /** Scope rows: this permission can exist in multiple scope_type/scope_id. */
    public function permissionScopes(): HasMany
    {
        return $this->hasMany(PermissionScope::class);
    }

    /** Roles that have this permission directly (via role_permissions). */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_permissions');
    }

    /** Workflows that include this permission. */
    public function workflows()
    {
        return $this->belongsToMany(Workflow::class, 'workflow_permissions');
    }
}
