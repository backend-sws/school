<?php

namespace Database\Seeders;

use App\Models\Institution;
use App\Models\Role;
use App\Models\User;
use App\Models\StaffProfile;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class StaffDirectorySeeder extends Seeder
{
    /** Role keys that are allowed for staff directory (non-protected). */
    private const STAFF_ROLE_KEYS = ['staff', 'principal'];

    /** No global staff data; use seedForInstitution() from institutional seeders (e.g. GdcInstitutionSeeder). */
    public function run(): void
    {
        $this->command->warn('Staff directory is seeded per institution. Run GdcInstitutionSeeder to seed staff for GDC.');
    }

    /** Seed staff directory for an institution using provided entries. */
    public function seedForInstitution(Institution $institution, array $entries): int
    {
        $collegeId = $institution->id;
        $institutionType = $institution->type?->value ?? config('ems.default_institution_type');
        $count = 0;

        foreach ($entries as $row) {
            $role = Role::withoutGlobalScope('institution_scope')->where('key', $row['role'])->first();
            if (!$role || !in_array($role->key, self::STAFF_ROLE_KEYS, true)) {
                $this->command->warn("Skipping {$row['email']}: role '{$row['role']}' not found or not allowed for staff directory.");
                continue;
            }

            $user = User::updateOrCreate(
                ['email' => $row['email']],
                [
                    'name' => $row['name'],
                    'password' => Hash::make($row['password'] ?? 'password'),
                    'email_verified_at' => now(),
                    'status' => 1,
                    'email_verified' => true,
                    'system_generated_password' => true,
                ]
            );

            DB::table('user_roles')->updateOrInsert(
                [
                    'user_id' => $user->id,
                    'role_id' => $role->id,
                    'institution_id' => $collegeId,
                ],
                [
                    'assigned_at' => now(),
                ]
            );

            // Ensure staff_profiles row exists (category from seed data). Without global scope so lookup finds existing row when re-seeding.
            $category = isset($row['category']) ? (int) $row['category'] : null;
            \App\Models\StaffProfile::withoutGlobalScope('institution_scope')->updateOrCreate(
                ['user_id' => $user->id, 'institution_id' => $collegeId],
                ['category' => $category, 'status' => 1]
            );

            // 3. Workflows (Bundles) — scope to this college so assignments apply only when resolving for this college
            if (isset($row['workflows']) && is_array($row['workflows'])) {
                $workflowIds = DB::table('workflows')
                    ->whereIn('key', $row['workflows'])
                    ->pluck('id');
                $syncData = [];
                foreach ($workflowIds as $workflowId) {
                    $syncData[$workflowId] = ['institution_id' => $collegeId];
                }
                $user->workflows()->sync($syncData);
            }

            // 4. Surgical Overrides (Direct Grants/Revokes) — scope-specific so other institutions are not affected
            if (isset($row['overrides']) && is_array($row['overrides'])) {
                $inserts = [];
                foreach ($row['overrides'] as $permKey => $granted) {
                    $pid = DB::table('permissions')->where('key', $permKey)->value('id');
                    if ($pid) {
                        $inserts[] = [
                            'user_id' => $user->id,
                            'permission_id' => $pid,
                            'granted' => (bool) $granted,
                            'institution_id' => $collegeId,
                        ];
                    }
                }
                if (!empty($inserts)) {
                    DB::table('user_permissions')
                        ->where('user_id', $user->id)
                        ->where('institution_id', $collegeId)
                        ->delete();
                    DB::table('user_permissions')->insert($inserts);
                }
            }

            $count++;
        }

        $this->command->info("Staff directory seeded: {$count} staff members for institution [{$institution->name}] (id: {$collegeId}).");
        return $count;
    }
}
