<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserRole extends Model
{
    protected $table = 'user_roles';

    public $timestamps = false;

    protected $fillable = [
        'user_id',
        'role_id',
        'scope_type',
        'scope_id',
        'assigned_by',
        'expires_at',
    ];

    protected $casts = [
        'assigned_at' => 'datetime',
        'expires_at' => 'datetime',
    ];

    /* ── Relationships ───────────────────────────────────── */

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function role()
    {
        return $this->belongsTo(Role::class);
    }

    public function assignedBy()
    {
        return $this->belongsTo(User::class, 'assigned_by');
    }

    /* ── Scopes ──────────────────────────────────────────── */

    /** Filter by scope type (global, college, department, stream). */
    public function scopeOfScope($query, string $scopeType, ?int $scopeId = null)
    {
        $query->where('scope_type', $scopeType);
        if ($scopeId !== null) {
            $query->where('scope_id', $scopeId);
        }
        return $query;
    }

    /** Only active (non-expired) assignments. */
    public function scopeActive($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('expires_at')
                ->orWhere('expires_at', '>', now());
        });
    }
}
