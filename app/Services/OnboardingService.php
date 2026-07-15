<?php

namespace App\Services;

use App\Enums\InstitutionType;
use App\Enums\SubscriptionTier;
use App\Models\Institution;
use App\Models\Organization;
use App\Models\Role;
use App\Models\User;
use App\Models\Workflow;
use Illuminate\Support\Facades\DB;

/**
 * Reusable onboarding orchestration service.
 *
 * Extracted from OnboardingController::storeOrgSetup() so the logic can
 * be reused by admin-created institutions, API onboarding, tests, etc.
 *
 * Each public method is a standalone, reusable building block.
 */
class OnboardingService
{
    /**
     * Full onboarding: create org + institution + assign role + workflows + seed + activate user.
     *
     * Wraps everything in a single DB transaction.
     *
     * @param User   $user         The user being onboarded
     * @param array  $validated    ['org_name', 'inst_name', 'inst_type', 'slug']
     * @param array  $planData     ['plan_key', 'billing_cycle']
     * @return Institution The newly created institution
     */
    public function provision(User $user, array $validated, array $planData): Institution
    {
        $tier = SubscriptionTier::from($planData['plan_key']);
        $institution = null;

        // 1. Clean up stale records from failed previous attempts
        $this->cleanupStaleRecords($validated['slug'], $validated['org_name']);
        $user->workflows()->detach();

        // 2. Reset sequences (PostgreSQL/MySQL)
        $this->resetSequences();

        DB::transaction(function () use ($user, $validated, $planData, $tier, &$institution) {
            // 3. Create Organization + Institution
            $organization = $this->createOrganization($validated['org_name'], $tier, $planData['billing_cycle']);
            $institution = $this->createInstitution($organization, $validated);

            // 4. Scope the institution_admin role (already attached at registration, just update scope)
            $this->scopeRole($user, $institution, 'institution_admin');

            // 5. Activate tier-based workflows
            $this->activateWorkflows($user, $institution, $tier);

            // 6. Seed mandatory institution defaults (fee types, sessions, classes, etc.)
            app(OnboardingDataSeederService::class)->seedMandatory($institution);

            // 7. Activate user and link to institution
            $user->update([
                'status' => 1,
                'institution_id' => $institution->id,
                'onboarding_data' => $validated,
            ]);
        });

        return $institution;
    }

    /**
     * Clean up stale records from previous failed onboarding attempts.
     */
    public function cleanupStaleRecords(string $slug, string $orgName): void
    {
        // Find institutions by slug via model helper
        $staleInstIds = \App\Models\InstitutionDomain::where('domain', $slug)->pluck('institution_id');
        if ($staleInstIds->isNotEmpty()) {
            \App\Models\InstitutionDomain::whereIn('institution_id', $staleInstIds)->delete();
            Institution::whereIn('id', $staleInstIds)->delete();
        }

        $staleOrgIds = Organization::where('name', $orgName)->pluck('id');
        if ($staleOrgIds->isNotEmpty()) {
            Institution::whereIn('organization_id', $staleOrgIds)->delete();
            Organization::whereIn('id', $staleOrgIds)->delete();
        }
    }

    /**
     * Reset database sequences/auto-increment counters after cleanup to avoid ID collisions.
     */
    public function resetSequences(): void
    {
        $driver = DB::getDriverName();

        if ($driver === 'pgsql') {
            DB::statement("SELECT setval('institutions_id_seq', COALESCE((SELECT MAX(id) FROM institutions), 0) + 1, false)");
            DB::statement("SELECT setval('organizations_id_seq', COALESCE((SELECT MAX(id) FROM organizations), 0) + 1, false)");
        } elseif ($driver === 'mysql') {
            $nextInstId = (int) DB::table('institutions')->max('id') + 1;
            $nextOrgId = (int) DB::table('organizations')->max('id') + 1;
            DB::statement("ALTER TABLE institutions AUTO_INCREMENT = {$nextInstId}");
            DB::statement("ALTER TABLE organizations AUTO_INCREMENT = {$nextOrgId}");
        }
    }

    /**
     * Create an Organization record from tier + billing info.
     */
    public function createOrganization(string $name, SubscriptionTier $tier, string $billingCycle): Organization
    {
        $cap = fn($v) => min($v, 2147483647);

        $organization = Organization::create([
            'name' => $name,
            'status' => 1,
        ]);

        // Create subscription record on the dedicated table
        $organization->subscription()->create([
            'tier' => $tier->value,
            'billing_cycle' => $billingCycle,
            'max_institutions' => $cap($tier->maxInstitutions()),
            'max_users' => $cap($tier->maxUsers()),
            'max_staff' => $cap($tier->maxStaff()),
            'max_emails_per_month' => $cap($tier->maxEmailsPerMonth()),
            'storage_quota_gb' => $cap($tier->storageQuotaGb()),
            'subscription_start' => now(),
        ]);

        return $organization;
    }

    /**
     * Create a primary Institution under an Organization.
     */
    public function createInstitution(Organization $organization, array $validated): Institution
    {
        $institution = Institution::create([
            'organization_id' => $organization->id,
            'name' => $validated['inst_name'],
            'type' => $validated['inst_type'],
            'udise_code' => $validated['udise_code'] ?? null,
            'status' => 1,
        ]);

        // Store the domain slug in institution_domains (multi-domain support)
        $institution->domains()->create(['domain' => $validated['slug']]);

        // Store brand theme in settings table (website_branding group)
        $brandTheme = $validated['brand_theme'] ?? config('ems.default_brand_theme', 'nature');
        \App\Models\Setting::setBranding('brand_theme', $brandTheme);

        return $institution;
    }

    /**
     * Ensure the user has the given role scoped to the given institution.
     * Uses syncWithoutDetaching so the pivot is CREATED if missing, or
     * UPDATED if it already exists — bulletproof against lost sessions
     * or container rebuilds between registration and org setup.
     *
     * @param User        $user        The user whose role to scope
     * @param Institution $institution The institution to scope to
     * @param string      $roleKey     Role key (e.g. 'institution_admin')
     */
    public function scopeRole(User $user, Institution $institution, string $roleKey): void
    {
        $role = Role::withoutGlobalScope('institution_scope')
            ->where('key', $roleKey)
            ->first();

        if (!$role) {
            return;
        }

        // syncWithoutDetaching: creates pivot if missing, updates if exists
        $user->roles()->syncWithoutDetaching([
            $role->id => [
                'institution_id' => $institution->id,
                'assigned_at'    => now(),
            ],
        ]);
    }

    /**
     * Activate tier-based workflows for a user scoped to an institution.
     */
    public function activateWorkflows(User $user, Institution $institution, SubscriptionTier $tier): void
    {
        $modules = $tier->modules();
        $workflowKeys = self::mapModulesToWorkflows($modules, $institution->type->value);
        $workflows = Workflow::whereIn('key', $workflowKeys)->get();

        foreach ($workflows as $wf) {
            $user->workflows()->attach($wf->id, [
                'institution_id' => $institution->id,
                'assigned_at' => now(),
            ]);
        }
    }

    /**
     * Map subscription modules to institution-type-specific workflow keys.
     * School gets simplified workflows; college/coaching/university get full versions.
     */
    public static function mapModulesToWorkflows(array $modules, string $instType = 'college'): array
    {
        $mapping = [
            'core' => [
                'admin_desk',
                'info_pr_hub',
                'office_registry',
                'system_console',
            ],
            'academics' => ['academic_setup', 'attendance', 'timetable'],
            'fee_management' => ['accounts_room', 'expense_tracker'],
            'admissions' => ['admission_cell'],
            'certificates' => ['service_branch'],
            'library' => ['library'],
            'inventory' => ['inventory'],
            'transport' => ['transport'],
            'lms' => ['lms'],
            'grievances' => ['redressal_cell'],
            'multi_campus' => ['my_organisation'],
            'question_bank' => ['question_bank'],
        ];

        $keys = [];
        foreach ($modules as $mod) {
            if (isset($mapping[$mod])) {
                $keys = array_merge($keys, $mapping[$mod]);
            }
        }

        return array_unique($keys);
    }
}
