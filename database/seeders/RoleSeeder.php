<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Seed roles from the data file. Scopes (scope_type, scope_id) are in role_scopes so the same role can exist in multiple scopes.
     */
    public function run(): void
    {
        $roles = require __DIR__ . '/data/roles.php';

        foreach ($roles as $role) {
            $scopeType = $role['scope_type'] ?? config('ems.default_institution_type');
            $scopeId = null;

            $r = Role::withoutGlobalScope('institution_scope')->updateOrCreate(
                ['key' => $role['key']],
                [
                    'name' => $role['name'],
                    'level' => $role['level'],
                    'description' => $role['description'] ?? null,
                    'is_system' => $role['is_system'] ?? false,
                ]
            );
            $r->roleScopes()->firstOrCreate(
                ['scope_type' => $scopeType, 'scope_id' => $scopeId],
                []
            );
        }
    }
}
