<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;

class PermissionSeeder extends Seeder
{
    /**
     * Seed permissions from the data file (single source of truth).
     * Scopes (scope_type, scope_id) are in permission_scopes so the same permission can exist in multiple scopes.
     */
    public function run(): void
    {
        $permissions = require __DIR__ . '/data/permissions.php';
        $scopeType = config('ems.default_institution_type');
        $scopeId = null;

        foreach ($permissions as $permission) {
            $perm = Permission::updateOrCreate(
                ['key' => $permission['key']],
                [
                    'name' => $permission['name'],
                    'module' => $permission['module'] ?? null,
                    'description' => $permission['description'] ?? null,
                ]
            );
            $perm->permissionScopes()->firstOrCreate(
                ['scope_type' => $scopeType, 'scope_id' => $scopeId],
                []
            );
        }
    }
}
