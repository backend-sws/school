<?php

namespace Database\Seeders;

use App\Models\Institution;
use App\Models\User;
use App\Models\Role;
use App\Services\OnboardingDataSeederService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class SchoolOnboardingSeeder extends Seeder
{
    public function run(): void
    {
        $institutionId = (int) $this->command->ask('Enter Institution ID to onboard', Institution::latest('id')->first()?->id ?? 0);

        $institution = Institution::find($institutionId);

        if (!$institution) {
            $this->command->error("Institution ID {$institutionId} not found.");
            return;
        }

        if ($institution->type->value !== 'school') {
            $this->command->warn("Warning: This institution is not a 'school' type. Proceeding anyway...");
        }

        $this->command->info("Onboarding Institution: {$institution->name}");

        // 1. Ensure global roles and workflows are seeded (Idempotent)
        $this->command->info('Ensuring global workflows and roles exist...');
        $this->call([
            WorkflowSeeder::class,
            PermissionSeeder::class,
            RoleSeeder::class,
            RoleMappingSeeder::class,
        ]);

        // 2. Seed mandatory institution defaults (fee types, sessions, etc.)
        $this->command->info('Seeding mandatory institution data...');
        app(OnboardingDataSeederService::class)->seedMandatory($institution);

        // 3. Auto-assign institution_admin role to the admin user
        $this->command->info('Setting up institution_admin...');
        $adminUser = User::whereHas('roles', function($q) use ($institution) {
            $q->where('key', 'institution_admin')
              ->where('user_roles.institution_id', $institution->id);
        })->first();

        if (!$adminUser) {
            $adminEmail = 'admin_' . $institution->id . '@demo.com';
            $adminUser = User::firstOrCreate(
                ['email' => $adminEmail],
                [
                    'name' => 'Institution Admin',
                    'password' => Hash::make('password'),
                    'email_verified_at' => now(),
                    'status' => 1,
                ]
            );

            $adminRole = Role::where('key', 'institution_admin')->first();
            if ($adminRole) {
                DB::table('user_roles')->updateOrInsert(
                    [
                        'user_id' => $adminUser->id,
                        'role_id' => $adminRole->id,
                        'institution_id' => $institution->id,
                    ],
                    ['assigned_at' => now()]
                );
            }
        }
        
        $this->command->info("Institution {$institution->name} onboarded successfully.");
        $this->command->info("Admin User: {$adminUser->email} / password");
    }
}
