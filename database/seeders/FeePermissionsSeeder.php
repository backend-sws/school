<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\PermissionScope;
use App\Models\Role;
use App\Models\Workflow;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class FeePermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            [
                'key' => 'edit_fee_ledger',
                'name' => 'Edit Fee Ledger Charges & Overrides',
                'module' => 'accounts_room',
                'description' => 'Allows editing one-time fee charges and overriding fee amounts for specific students in the ledger.',
            ],
            [
                'key' => 'revert_fee_overrides',
                'name' => 'Revert Fee Ledger Overrides',
                'module' => 'accounts_room',
                'description' => 'Allows reverting customized one-time fee overrides back to the system rate.',
            ],
            [
                'key' => 'view_adhoc_charges',
                'name' => 'View Ad-Hoc Fee Charges',
                'module' => 'accounts_room',
                'description' => 'Allows viewing assigned ad-hoc charges and batch logs.',
            ],
            [
                'key' => 'create_adhoc_charges',
                'name' => 'Create Ad-Hoc Fee Charges',
                'module' => 'accounts_room',
                'description' => 'Allows creating and assigning ad-hoc charges to individual students or classes.',
            ],
            [
                'key' => 'revert_adhoc_charges',
                'name' => 'Revert Ad-Hoc Fee Charges',
                'module' => 'accounts_room',
                'description' => 'Allows reverting and deleting ad-hoc charges from student ledgers.',
            ],
            [
                'key' => 'revert_fee_payments',
                'name' => 'Revert Fee Payments',
                'module' => 'accounts_room',
                'description' => 'Allows undoing/reverting recorded fee payments with audit reason.',
            ],
            [
                'key' => 'download_fee_receipt',
                'name' => 'Download Fee Receipts & Invoices',
                'module' => 'accounts_room',
                'description' => 'Allows downloading PDF receipts and invoices for collected fee payments.',
            ],
        ];

        $scopeTypes = config('ems.institution_types', ['school', 'college', 'coaching', 'university']);
        // Include global and null scopes so Permission::forInstitution always finds them
        $allScopes = array_unique(array_merge($scopeTypes, ['global', null]));

        $createdPermissionIds = [];

        foreach ($permissions as $p) {
            $perm = Permission::updateOrCreate(
                ['key' => $p['key']],
                [
                    'name' => $p['name'],
                    'module' => $p['module'],
                    'description' => $p['description'],
                ]
            );

            $createdPermissionIds[] = $perm->id;

            foreach ($allScopes as $st) {
                PermissionScope::firstOrCreate([
                    'permission_id' => $perm->id,
                    'scope_type' => $st,
                    'scope_id' => null,
                ]);
            }
        }

        // 2. Attach to accounts_room workflow
        $workflow = Workflow::where('key', 'accounts_room')->first();
        if ($workflow) {
            foreach ($createdPermissionIds as $pid) {
                DB::table('workflow_permissions')->updateOrInsert([
                    'workflow_id' => $workflow->id,
                    'permission_id' => $pid,
                ]);
            }
        }

        // 3. Grant to roles that have accounts_room workflow or administrative roles
        $targetRoles = Role::withoutGlobalScope('institution_scope')
            ->where(function ($query) {
                $query->whereHas('workflows', function ($q) {
                    $q->where('key', 'accounts_room');
                })
                ->orWhere('key', 'like', 'principal%')
                ->orWhere('key', 'like', 'accountant%')
                ->orWhere('key', 'like', 'manager%')
                ->orWhere('key', 'like', 'institution_admin%')
                ->orWhere('key', 'like', 'super_admin%');
            })
            ->get();

        foreach ($targetRoles as $role) {
            // If the role doesn't have accounts_room workflow, ensure it has it if it's an accounts/principal role
            if ($workflow && !$role->workflows()->where('key', 'accounts_room')->exists()) {
                $role->workflows()->attach($workflow->id);
            }

            // If the role has direct permissions configured, attach these permissions directly too
            if ($role->permissions()->count() > 0 || in_array($role->key, ['accountant_M7lp', 'principal_hod_1M3E'])) {
                foreach ($createdPermissionIds as $pid) {
                    DB::table('role_permissions')->updateOrInsert([
                        'role_id' => $role->id,
                        'permission_id' => $pid,
                    ]);
                }
            }
        }
    }
}
