<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Pivot/scope row: links a permission to a scope (scope_type + scope_id).
 * Same permission can exist in multiple scopes.
 *
 * 3-tier resolution:
 *   1. scope_type = NULL / 'global'     → applies to all institutions
 *   2. scope_type = 'college', scope_id = NULL → applies to all colleges
 *   3. scope_type = 'college', scope_id = 5   → applies only to institution #5
 */
class PermissionScope extends Model
{
    protected $table = 'permission_scopes';

    public $timestamps = false;

    protected $fillable = ['permission_id', 'scope_type', 'scope_id'];

    protected function casts(): array
    {
        return [
            'scope_id' => 'integer',
        ];
    }

    // ─── Relationships ──────────────────────────────────────────────────

    public function permission(): BelongsTo
    {
        return $this->belongsTo(Permission::class);
    }

    // ─── Tier Helpers ───────────────────────────────────────────────────

    /** Applies to all institutions regardless of type. */
    public function isGlobal(): bool
    {
        return $this->scope_type === null || $this->scope_type === 'global';
    }

    /** Applies to all institutions of a given type (e.g. all colleges). */
    public function isTypeWide(): bool
    {
        return $this->scope_type !== null
            && $this->scope_type !== 'global'
            && $this->scope_id === null;
    }

    /** Applies to one specific institution. */
    public function isInstitutionSpecific(): bool
    {
        return $this->scope_type !== null
            && $this->scope_type !== 'global'
            && $this->scope_id !== null;
    }

    // ─── Static Factories ───────────────────────────────────────────────

    public static function createGlobal(int $permissionId): static
    {
        return static::create(['permission_id' => $permissionId, 'scope_type' => 'global', 'scope_id' => null]);
    }

    public static function createForType(int $permissionId, string $institutionType): static
    {
        return static::create(['permission_id' => $permissionId, 'scope_type' => $institutionType, 'scope_id' => null]);
    }

    public static function createForInstitution(int $permissionId, string $institutionType, int $institutionId): static
    {
        return static::create(['permission_id' => $permissionId, 'scope_type' => $institutionType, 'scope_id' => $institutionId]);
    }

    // ─── Scopes ─────────────────────────────────────────────────────────

    public function scopeGlobal($query)
    {
        return $query->where(fn($q) => $q->whereNull('scope_type')->orWhere('scope_type', 'global'));
    }

    public function scopeForType($query, string $institutionType)
    {
        return $query->where('scope_type', $institutionType)->whereNull('scope_id');
    }

    public function scopeForInstitution($query, string $institutionType, int $institutionId)
    {
        return $query->where('scope_type', $institutionType)->where('scope_id', $institutionId);
    }
}
