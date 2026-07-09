<?php

namespace Tests\Concerns;

use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use App\Models\Workflow;
use Illuminate\Testing\TestResponse;

trait SeedRbacAndActAsRole
{
    /**
     * Seed RBAC foundation: roles, permissions, workflows, role-mapping.
     * Call from setUp() after parent::setUp().
     */
    protected function seedRbac(): void
    {
        $this->seed(\Database\Seeders\RoleSeeder::class);
        $this->seed(\Database\Seeders\PermissionSeeder::class);
        $this->seed(\Database\Seeders\WorkflowSeeder::class);
        $this->seed(\Database\Seeders\RoleMappingSeeder::class);
    }

    /**
     * Create a user and attach a role with the given scope.
     * When scope is institution (or legacy 'college'), uses the test's default institution so permission
     * resolution sees the same context.
     *
     * @param  string  $roleKey  Role key (e.g. super_admin, institution_admin, staff, student)
     * @param  string  $scopeType  Ignored (kept for backward compat). Use $scopeId for institution scoping.
     * @param  int|null  $scopeId  Institution ID; null for global.
     */
    protected function createUserWithRole(string $roleKey, string $scopeType = 'college', ?int $scopeId = null): User
    {
        $user = User::factory()->create();
        $role = Role::withoutGlobalScope('institution_scope')->where('key', $roleKey)->firstOrFail();

        $institutionId = in_array($scopeType, ['institution', 'college', 'school', 'coaching', 'university'], true)
            ? ($scopeId ?? $this->defaultInstitutionId() ?? 1)
            : null; // global

        $user->roles()->attach($role->id, [
            'institution_id' => $institutionId,
            'assigned_at' => now(),
        ]);

        return $user;
    }

    /**
     * Create a user with no role but with one workflow attached (for custom-role-like tests).
     * When attaching for a college, uses the test's default college so permission resolution matches.
     *
     * @param  string  $workflowKey  Workflow key (e.g. redressal_cell, system_console)
     * @param  int|null  $collegeId  College ID for workflow scope; omit to use test default college
     */
    protected function createUserWithWorkflow(string $workflowKey, ?int $collegeId = null): User
    {
        $user = User::factory()->create();
        $workflow = Workflow::withoutGlobalScope('institution_scope')->where('key', $workflowKey)->firstOrFail();

        $resolvedCollegeId = $collegeId ?? $this->defaultInstitutionId() ?? 1;
        $user->workflows()->attach($workflow->id, [
            'institution_id' => $resolvedCollegeId,
        ]);

        return $user;
    }

    /**
     * GET request as the given user (API).
     */
    protected function getJsonAs(User $user, string $uri, array $headers = []): TestResponse
    {
        return $this->actingAs($user)->getJson($uri, $headers);
    }

    /**
     * POST request as the given user (API).
     */
    protected function postJsonAs(User $user, string $uri, array $data = [], array $headers = []): TestResponse
    {
        return $this->actingAs($user)->postJson($uri, $data, $headers);
    }

    /**
     * PUT request as the given user (API).
     */
    protected function putJsonAs(User $user, string $uri, array $data = [], array $headers = []): TestResponse
    {
        return $this->actingAs($user)->putJson($uri, $data, $headers);
    }

    /**
     * PATCH request as the given user (API).
     */
    protected function patchJsonAs(User $user, string $uri, array $data = [], array $headers = []): TestResponse
    {
        return $this->actingAs($user)->patchJson($uri, $data, $headers);
    }

    /**
     * DELETE request as the given user (API).
     */
    protected function deleteJsonAs(User $user, string $uri, array $headers = []): TestResponse
    {
        return $this->actingAs($user)->deleteJson($uri, $headers);
    }

    /**
     * Return the default institution ID used in tests (from config set in TestCase).
     */
    protected function defaultInstitutionId(): ?int
    {
        $id = config('ems.default_institution_id');

        return $id !== null && $id !== '' ? (int) $id : null;
    }

    /**
     * Assert that the user has at least one permission from each of the given groups.
     *
     * @param  array<string>  $groupNames  Keys from config('route_permissions') (e.g. admin_desk, system_console)
     */
    protected function assertUserHasPermissionGroup(User $user, array $groupNames, ?int $collegeId = null): void
    {
        $collegeId = $collegeId ?? $this->defaultInstitutionId();
        $keys = $user->resolveEffectivePermissionKeys($collegeId);

        foreach ($groupNames as $group) {
            $groupKeys = config("route_permissions.{$group}");
            $this->assertIsArray($groupKeys, "Permission group '{$group}' should be an array.");
            $hasOne = false;
            foreach ($groupKeys as $key) {
                if (in_array($key, $keys, true)) {
                    $hasOne = true;
                    break;
                }
            }
            $this->assertTrue($hasOne, "User should have at least one permission from group '{$group}'.");
        }
    }

    /**
     * Assert that the user has no permission from any of the given groups.
     *
     * @param  array<string>  $groupNames  Keys from config('route_permissions')
     */
    protected function assertUserLacksPermissionGroup(User $user, array $groupNames, ?int $collegeId = null): void
    {
        $collegeId = $collegeId ?? $this->defaultInstitutionId();
        $keys = $user->resolveEffectivePermissionKeys($collegeId);

        foreach ($groupNames as $group) {
            $groupKeys = config("route_permissions.{$group}");
            if (! is_array($groupKeys)) {
                continue;
            }
            foreach ($groupKeys as $key) {
                $this->assertNotContains($key, $keys, "User should not have permission '{$key}' from group '{$group}'.");
            }
        }
    }
}
