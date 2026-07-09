<?php

namespace Tests\Feature\Auth;

use App\Enums\InstitutionType;
use App\Http\Controllers\Api\V1\Auth\AuthShareController;
use App\Models\Institution;
use App\Models\Permission;
use App\Models\Role;
use App\Models\User;
use App\Models\Workflow;
use App\Support\InstitutionContext;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Auth;
use PHPUnit\Framework\Attributes\Test;
use Tests\Concerns\SeedRbacAndActAsRole;
use Tests\TestCase;

class AuthSharePermissionsTest extends TestCase
{
    use RefreshDatabase;
    use SeedRbacAndActAsRole;

    /**
     * Seed RBAC foundation: roles → permissions → workflows → role-mapping.
     */
    protected function setUp(): void
    {
        parent::setUp();
        $this->seedRbac();
    }

    /* ─── Guest ──────────────────────────────────────────────── */

    #[Test]
    public function guest_auth_payload_returns_empty_permissions()
    {
        $payload = AuthShareController::getAuth();

        $this->assertNull($payload['user']);
        $this->assertNull($payload['role']);
        $this->assertIsArray($payload['permissions']);
        $this->assertEmpty($payload['permissions']);
    }

    /* ─── Super Admin ────────────────────────────────────────── */

    #[Test]
    public function super_admin_gets_limited_permission_keys()
    {
        $user = $this->createUserWithRole('super_admin', 'global', null);
        Auth::login($user);

        $payload = AuthShareController::getAuth();

        $roleMapping = require database_path('seeders/data/role_mapping.php');
        $expectedKeys = $roleMapping['super_admin']['permissions'] ?? [];
        $returned = collect($payload['permissions'])->sort()->values()->toArray();

        $this->assertEqualsCanonicalizing($expectedKeys, $returned, 'Super admin should receive only the permissions defined in database/seeders/data/role_mapping.php.');
    }

    #[Test]
    public function super_admin_auth_payload_has_correct_role_key()
    {
        $user = $this->createUserWithRole('super_admin', 'global', null);
        Auth::login($user);

        $payload = AuthShareController::getAuth();

        $this->assertEquals('super_admin', $payload['role']);
    }

    /* ─── College Admin ──────────────────────────────────────── */

    #[Test]
    public function institution_admin_has_management_permissions()
    {
        $user = $this->createUserWithRole('institution_admin');
        Auth::login($user);

        $permissions = $user->resolveEffectivePermissionKeys();

        // College admin should have broad management access (current granular keys)
        $this->assertContains('view_students', $permissions);
        $this->assertContains('view_settings', $permissions);
        $this->assertContains('view_departments', $permissions);
        $this->assertContains('view_sessions', $permissions);
        $this->assertContains('view_streams', $permissions);
        $this->assertContains('view_subjects', $permissions);
        $this->assertContains('view_fee_heads', $permissions);
        $this->assertContains('view_certificates', $permissions);
        $this->assertContains('view_grievances', $permissions);
        $this->assertContains('view_all_reports', $permissions);
    }

    #[Test]
    public function institution_admin_auth_payload_has_correct_structure()
    {
        $user = $this->createUserWithRole('institution_admin');
        Auth::login($user);

        $payload = AuthShareController::getAuth();

        $this->assertArrayHasKey('user', $payload);
        $this->assertArrayHasKey('role', $payload);
        $this->assertArrayHasKey('permissions', $payload);
        $this->assertEquals('institution_admin', $payload['role']);
        $this->assertIsArray($payload['permissions']);
        $this->assertNotEmpty($payload['permissions']);
    }

    /* ─── Principal ──────────────────────────────────────────── */

    #[Test]
    public function principal_has_academic_and_student_permissions()
    {
        $user = $this->createUserWithRole('principal');
        Auth::login($user);

        $permissions = $user->resolveEffectivePermissionKeys();

        // Principal should have academic + student management (current granular keys)
        $this->assertContains('view_students', $permissions);
        $this->assertContains('view_departments', $permissions);
        $this->assertContains('view_all_reports', $permissions);
    }

    /* ─── Staff ──────────────────────────────────────────────── */

    #[Test]
    public function staff_has_limited_operational_permissions()
    {
        $user = $this->createUserWithRole('staff');
        Auth::login($user);

        $permissions = $user->resolveEffectivePermissionKeys();

        // Staff should have some operational access
        $this->assertNotEmpty($permissions);

        // Staff should NOT have system_console (view_roles, view_settings)
        $this->assertNotContains('view_roles', $permissions);
        $this->assertNotContains('view_settings', $permissions);
    }

    /* ─── Student ────────────────────────────────────────────── */

    #[Test]
    public function student_has_portal_only_permissions()
    {
        $user = $this->createUserWithRole('student');
        Auth::login($user);

        $permissions = $user->resolveEffectivePermissionKeys();

        // Students should have portal-specific permissions (student_portal workflow)
        $this->assertContains('apply_admission', $permissions);
        $this->assertContains('request_certificate', $permissions);
        $this->assertContains('submit_support_ticket', $permissions);
        $this->assertContains('submit_grievance', $permissions);
        $this->assertContains('view_notices', $permissions);
        $this->assertContains('portal', $permissions);

        // Students should NOT have admin permissions
        $this->assertNotContains('view_students', $permissions);
        $this->assertNotContains('view_settings', $permissions);
        $this->assertNotContains('view_departments', $permissions);
        $this->assertNotContains('view_fee_heads', $permissions);
    }

    #[Test]
    public function student_auth_payload_role_is_student()
    {
        $user = $this->createUserWithRole('student');
        Auth::login($user);

        $payload = AuthShareController::getAuth();

        $this->assertEquals('student', $payload['role']);
        $this->assertNotEmpty($payload['permissions']);
    }

    /* ─── Candidate ──────────────────────────────────────────── */

    #[Test]
    public function candidate_has_admission_only_permissions()
    {
        $user = $this->createUserWithRole('candidate');
        Auth::login($user);

        $permissions = $user->resolveEffectivePermissionKeys();

        // Candidate should have student_portal (apply_admission, submit_support_ticket, etc.)
        $this->assertContains('apply_admission', $permissions);
        $this->assertContains('submit_support_ticket', $permissions);

        // Candidate should NOT have admin permissions
        $this->assertNotContains('view_students', $permissions);
        $this->assertNotContains('view_settings', $permissions);
    }

    /* ─── User Permission Overrides ──────────────────────────── */

    #[Test]
    public function revoking_a_permission_removes_it_from_effective_set()
    {
        $user = $this->createUserWithRole('staff');
        Auth::login($user);

        // Verify staff initially has some permissions
        $before = $user->resolveEffectivePermissionKeys();
        $this->assertNotEmpty($before);

        // Pick a permission the staff role has and revoke it
        $targetKey = $before[0];
        $perm = Permission::where('key', $targetKey)->first();
        $user->permissionOverrides()->attach($perm->id, ['granted' => false]);

        // Clear the cached permission keys
        $freshUser = User::find($user->id);

        $after = $freshUser->resolveEffectivePermissionKeys();
        $this->assertNotContains($targetKey, $after, "Revoked permission '{$targetKey}' should be absent.");
    }

    #[Test]
    public function granting_an_extra_permission_adds_it_to_effective_set()
    {
        $user = $this->createUserWithRole('student');
        Auth::login($user);

        $before = $user->resolveEffectivePermissionKeys();

        // Students shouldn't have view_students — grant it directly
        $this->assertNotContains('view_students', $before);

        $perm = Permission::where('key', 'view_students')->first();
        $this->assertNotNull($perm);
        $user->permissionOverrides()->attach($perm->id, ['granted' => true]);

        // Fresh user to clear cache
        $freshUser = User::find($user->id);
        $after = $freshUser->resolveEffectivePermissionKeys();

        $this->assertContains('view_students', $after, 'Directly granted permission should appear in effective set.');
    }

    /* ─── User Workflow Override ──────────────────────────────── */

    #[Test]
    public function assigning_workflow_directly_to_user_adds_its_permissions()
    {
        $user = $this->createUserWithRole('student');
        Auth::login($user);

        $before = $user->resolveEffectivePermissionKeys();

        // Redressal workflow has view_grievances; student doesn't have it by default
        $workflow = Workflow::withoutGlobalScope('institution_scope')
            ->whereHas('permissions', fn ($q) => $q->where('key', 'view_grievances'))
            ->first();

        $this->assertNotNull($workflow, 'Redressal workflow with view_grievances should exist.');
        $this->assertNotContains('view_grievances', $before);

        $user->workflows()->attach($workflow->id, ['institution_id' => $this->defaultInstitutionId()]);

        $freshUser = User::find($user->id);
        $after = $freshUser->resolveEffectivePermissionKeys();

        $this->assertContains('view_grievances', $after, 'Workflow permissions should merge into effective set.');
    }

    /* ─── hasAbility() ───────────────────────────────────────── */

    #[Test]
    public function has_ability_returns_true_for_granted_permission()
    {
        $user = $this->createUserWithRole('student');
        Auth::login($user);

        $this->assertTrue($user->hasAbility('apply_admission'));
    }

    #[Test]
    public function has_ability_returns_false_for_missing_permission()
    {
        $user = $this->createUserWithRole('student');
        Auth::login($user);

        $this->assertFalse($user->hasAbility('view_settings'));
    }

    /* ─── Auth Payload Safe Fields ───────────────────────────── */

    #[Test]
    public function auth_payload_does_not_expose_sensitive_fields()
    {
        $user = $this->createUserWithRole('institution_admin');
        Auth::login($user);

        $payload = AuthShareController::getAuth();

        // These should never appear in the auth payload
        $this->assertArrayNotHasKey('password', $payload['user']);
        $this->assertArrayNotHasKey('remember_token', $payload['user']);
        $this->assertArrayNotHasKey('otp_code', $payload['user']);
        $this->assertArrayNotHasKey('two_factor_secret', $payload['user']);
    }

    #[Test]
    public function auth_payload_exposes_only_safe_user_fields()
    {
        $user = $this->createUserWithRole('staff');
        Auth::login($user);

        $payload = AuthShareController::getAuth();

        $this->assertArrayHasKey('id', $payload['user']);
        $this->assertArrayHasKey('name', $payload['user']);
        $this->assertArrayHasKey('email', $payload['user']);
    }

    /* ─── Multi-role (edge case) ─────────────────────────────── */

    #[Test]
    public function user_with_multiple_roles_gets_union_of_all_permissions()
    {
        $user = User::factory()->create();

        // Assign both student and staff roles
        $studentRole = Role::where('key', 'student')->firstOrFail();
        $staffRole = Role::where('key', 'staff')->firstOrFail();

        $user->roles()->attach($studentRole->id, [
            'institution_id' => 1,
            'assigned_at' => now(),
        ]);
        $user->roles()->attach($staffRole->id, [
            'institution_id' => 1,
            'assigned_at' => now(),
        ]);

        Auth::login($user);

        $permissions = $user->resolveEffectivePermissionKeys();

        // Should have student-portal permissions
        $this->assertContains('apply_admission', $permissions);
        $this->assertContains('request_certificate', $permissions);

        // AND staff operational permissions (union)
        $this->assertNotEmpty(array_diff(
            $permissions,
            $this->createUserWithRole('student')->resolveEffectivePermissionKeys()
        ), 'Multi-role user should have permissions beyond just student.');
    }

    /* ─── School-type: admission permissions stripped ───────────────── */

    #[Test]
    public function school_type_institution_strips_view_candidates_and_view_admission_heads_keeps_view_applications()
    {
        $this->seedRbac();

        $school = Institution::factory()->create(['type' => InstitutionType::SCHOOL]);
        $user = $this->createUserWithRole('principal', 'school', $school->id);

        $permissions = $user->resolveEffectivePermissionKeys($school->id);

        $this->assertNotContains('view_candidates', $permissions, 'School type should strip view_candidates.');
        $this->assertNotContains('view_admission_heads', $permissions, 'School type should strip view_admission_heads.');
        $this->assertContains('view_applications', $permissions, 'School type should keep view_applications.');
    }

    #[Test]
    public function school_type_explicit_grant_keeps_view_admission_heads()
    {
        $this->seedRbac();

        $school = Institution::factory()->create(['type' => InstitutionType::SCHOOL]);
        $user = $this->createUserWithRole('principal', 'school', $school->id);

        $before = $user->resolveEffectivePermissionKeys($school->id);
        $this->assertNotContains('view_admission_heads', $before);

        $perm = Permission::where('key', 'view_admission_heads')->firstOrFail();
        $user->permissionOverrides()->attach($perm->id, [
            'granted' => true,
            'institution_id' => $school->id,
        ]);

        $freshUser = User::find($user->id);
        $after = $freshUser->resolveEffectivePermissionKeys($school->id);
        $this->assertContains('view_admission_heads', $after, 'Explicit grant in school scope should keep view_admission_heads.');
    }

    /* ─── InstitutionContext (session-locked) ─────────────────────── */

    #[Test]
    public function after_login_auth_payload_current_institution_id_comes_from_context()
    {
        $user = $this->createUserWithRole('institution_admin');
        Auth::login($user);

        $payload = AuthShareController::getAuth();

        $expectedId = $this->defaultInstitutionId();
        $this->assertArrayHasKey('current_institution_id', $payload);
        $this->assertSame($expectedId, $payload['current_institution_id'], 'Institution-scoped user should have current_institution_id from context (default/session).');
        $this->assertSame(
            InstitutionContext::getActiveInstitutionId($user),
            $payload['current_institution_id'],
            'Auth payload current_institution_id should match InstitutionContext::getActiveInstitutionId.'
        );
    }
}
