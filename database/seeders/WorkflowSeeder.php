<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Workflow;

class WorkflowSeeder extends Seeder
{
    /**
     * Seed default workflows from data file. Workflows are stored in DB and editable
     * (name, description, and permissions can be changed via admin or directly).
     * Scopes (scope_type, scope_id) are in workflow_scopes so the same workflow can exist in multiple scopes.
     * Re-running this seeder resets each workflow's permission set to the default in data/workflows.php.
     *
     * Each workflow may define `scope_types` (array of institution types like 'school', 'college', etc.).
     * When set, workflow_scopes are created only for those types.
     * When omitted, all institution types from config get a scope entry (universal workflow).
     */
    public function run(): void
    {
        $workflows = require __DIR__ . '/data/workflows.php';
        $allTypes = config('ems.institution_types', ['school', 'college', 'coaching', 'university']);

        foreach ($workflows as $row) {
            $permissionKeys = $row['permissions'] ?? [];
            $scopeTypes = $row['scope_types'] ?? $allTypes; // default to all types if not specified
            unset($row['permissions'], $row['scope_types']);

            $workflow = Workflow::updateOrCreate(
                ['key' => $row['key']],
                [
                    'name' => $row['name'],
                    'description' => $row['description'] ?? null,
                    'subscription_module' => $row['subscription_module'] ?? null,
                ]
            );

            // Replace workflow_scopes: delete old entries, create fresh ones for specified types
            $workflow->workflowScopes()->delete();
            foreach ($scopeTypes as $scopeType) {
                $workflow->workflowScopes()->create(
                    ['scope_type' => $scopeType, 'scope_id' => null]
                );
            }

            $workflowId = $workflow->id;

            $permissionIds = DB::table('permissions')
                ->whereIn('key', $permissionKeys)
                ->pluck('id')
                ->all();

            DB::table('workflow_permissions')->where('workflow_id', $workflowId)->delete();
            foreach ($permissionIds as $permissionId) {
                DB::table('workflow_permissions')->insert([
                    'workflow_id' => $workflowId,
                    'permission_id' => $permissionId,
                ]);
            }
        }
    }
}
