<?php

namespace App\Console\Commands;

use App\Models\User;
use App\Models\Institution;
use App\Models\Role;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class CreateAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cms:create-admin {email} {--name=Admin} {--password=password} {--institution=}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Create a new administrator for an institution or global scope';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $email = $this->argument('email');
        $name = $this->option('name');
        $password = $this->option('password');
        $institutionCode = $this->option('institution');

        $user = User::updateOrCreate(
            ['email' => $email],
            [
                'name' => $name,
                'password' => Hash::make($password),
                'email_verified_at' => now(),
                'status' => 1,
            ]
        );

        if ($institutionCode) {
            $institution = Institution::where('code', $institutionCode)->first();
            if (!$institution) {
                $this->error("Institution with code '{$institutionCode}' not found.");
                return 1;
            }

            $role = Role::where('key', 'institution_admin')->first();
            $institutionId = $institution->id;
            $msg = "Created Institution Admin for '{$institution->name}'";
        } else {
            // Super admin is normally created via SuperAdminSeeder (env). This path is for convenience.
            $role = Role::where('key', 'super_admin')->first();
            $institutionId = null;
            $msg = "Created Global Super Admin";
        }

        if (!$role) {
            $this->error("Required role not found. Run seeders first.");
            return 1;
        }

        DB::table('user_roles')->updateOrInsert(
            ['user_id' => $user->id, 'role_id' => $role->id],
            [
                'institution_id' => $institutionId,
                'assigned_at' => now(),
            ]
        );

        $this->info("{$msg}: {$email}");
        return 0;
    }
}
