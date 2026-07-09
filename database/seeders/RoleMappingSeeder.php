<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;
use App\Models\Workflow;

class RoleMappingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Syncs roles with their intended workflows and direct permissions.
     */
    public function run(): void
    {
        $mapping = require __DIR__ . '/data/role_mapping.php';

        foreach ($mapping as $roleKey => $data) {
            $role = Role::withoutGlobalScope('institution_scope')->where('key', $roleKey)->first();

            if (!$role) {
                $this->command->warn("Role not found: {$roleKey}");
                continue;
            }

            // Sync Workflows
            if (isset($data['workflows'])) {
                $workflowIds = Workflow::whereIn('key', $data['workflows'])->pluck('id')->toArray();
                $role->workflows()->sync($workflowIds);
            }

            // Sync Direct Permissions
            if (array_key_exists('permissions', $data)) {
                if ($data['permissions'] === null) {
                    // Super admin case: all permissions (using pluck on model to be safer with relationships)
                    $permissionIds = Permission::pluck('id')->toArray();
                    $role->permissions()->sync($permissionIds);
                } else {
                    $permissionIds = Permission::whereIn('key', $data['permissions'])->pluck('id')->toArray();
                    $role->permissions()->sync($permissionIds);
                }
            }
        }
    }
}
