<?php

namespace Tests\Feature\Auth;

use App\Models\Permission;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\Concerns\SeedRbacAndActAsRole;
use Tests\TestCase;

class RolePermissionMatrixTest extends TestCase
{
    use RefreshDatabase;
    use SeedRbacAndActAsRole;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedRbac();
    }

    #[Test]
    public function super_admin_has_limited_permission_keys()
    {
        $user = $this->createUserWithRole('super_admin', 'global', null);

        $keys = $user->resolveEffectivePermissionKeys($this->defaultInstitutionId());
        $roleMapping = require database_path('seeders/data/role_mapping.php');
        $expectedKeys = $roleMapping['super_admin']['permissions'] ?? [];

        $this->assertEqualsCanonicalizing($expectedKeys, $keys);
    }

    #[Test]
    public function institution_admin_has_all_admin_permission_groups()
    {
        $user = $this->createUserWithRole('institution_admin');

        $this->assertUserHasPermissionGroup($user, [
            'admin_desk',
            'admission_cell',
            'office_registry',
            'info_pr_hub',
            'accounts_room',
            'academic_setup',
            'service_branch',
            'redressal_cell',
            'system_console',
        ]);
    }

    #[Test]
    public function principal_has_same_admin_groups_as_institution_admin()
    {
        $user = $this->createUserWithRole('principal');

        $this->assertUserHasPermissionGroup($user, [
            'admin_desk',
            'admission_cell',
            'office_registry',
            'info_pr_hub',
            'accounts_room',
            'academic_setup',
            'service_branch',
            'redressal_cell',
            'system_console',
        ]);
    }

    #[Test]
    public function staff_has_limited_admin_groups_no_system_console_or_office_registry_or_academic_setup_or_service_branch()
    {
        $user = $this->createUserWithRole('staff');

        $this->assertUserHasPermissionGroup($user, [
            'admin_desk',
            'admission_cell',
            'accounts_room',
            'info_pr_hub',
            'redressal_cell',
        ]);
        $this->assertUserLacksPermissionGroup($user, ['system_console', 'office_registry', 'academic_setup', 'service_branch']);
    }

    #[Test]
    public function student_has_only_student_portal_group()
    {
        $user = $this->createUserWithRole('student');

        $this->assertUserHasPermissionGroup($user, ['student_portal']);
        $this->assertUserLacksPermissionGroup($user, [
            'system_console',
            'admin_desk',
            'office_registry',
            'accounts_room',
            'redressal_cell',
        ]);
    }

    #[Test]
    public function candidate_has_only_student_portal_group()
    {
        $user = $this->createUserWithRole('candidate');

        $this->assertUserHasPermissionGroup($user, ['student_portal']);
        $this->assertUserLacksPermissionGroup($user, [
            'system_console',
            'admin_desk',
            'office_registry',
        ]);
    }
}
