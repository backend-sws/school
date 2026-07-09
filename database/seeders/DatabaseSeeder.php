<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * Run the PDS Education seeder to set up the standalone institution:
     *   php artisan db:seed --class=PdsEducationSeeder
     */
    public function run(): void
    {
        // 1. Core Infrastructure (Global). WorkflowSeeder before RoleMappingSeeder so workflow keys exist.
        $this->call([
            RoleSeeder::class,
            PermissionSeeder::class,
            WorkflowSeeder::class,
            RoleMappingSeeder::class,
            PdsEducationSeeder::class,
            NotificationTemplateSeeder::class,
            WebsiteThemeSeeder::class,
            DemoSchoolSeeder::class,
            HostelSeeder::class,
        ]);

        $this->command->info('PDS Education seeding completed successfully!');
    }
}
