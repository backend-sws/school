<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Pivot/scope row: links a role to a scope (scope_type + scope_id).
 * Same role can exist in multiple scopes.
 */
class RoleScope extends Model
{
    protected $table = 'role_scopes';

    public $timestamps = false;

    protected $fillable = ['role_id', 'scope_type', 'scope_id'];

    protected function casts(): array
    {
        return [
            'scope_id' => 'integer',
        ];
    }

    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class);
    }
}
