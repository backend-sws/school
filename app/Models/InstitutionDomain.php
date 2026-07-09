<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InstitutionDomain extends Model
{
    protected $fillable = ['institution_id', 'domain'];

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    // ─── Static Helpers ─────────────────────────────────────────────────

    /** Check if a domain slug is already in use. */
    public static function isDomainTaken(string $domain): bool
    {
        return static::where('domain', $domain)->exists();
    }

    /** Find an institution by its domain slug. */
    public static function findInstitutionByDomain(string $domain): ?Institution
    {
        return static::where('domain', $domain)->with('institution')->first()?->institution;
    }

    // ─── Scopes ─────────────────────────────────────────────────────────

    public function scopeForInstitution($query, int $institutionId)
    {
        return $query->where('institution_id', $institutionId);
    }
}
