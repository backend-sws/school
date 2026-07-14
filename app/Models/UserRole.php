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
        'institution_id',
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

    /** Filter by institution. */
    public function scopeForInstitution($query, ?int $institutionId)
    {
        return $query->where('institution_id', $institutionId);
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
