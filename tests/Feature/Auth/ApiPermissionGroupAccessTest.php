<?php

namespace Tests\Feature\Auth;

use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\Concerns\SeedRbacAndActAsRole;
use Tests\TestCase;

class ApiPermissionGroupAccessTest extends TestCase
{
    use RefreshDatabase;
    use SeedRbacAndActAsRole;

    private const API_PREFIX = '/api/v1';

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedRbac();
    }

    #[Test]
    public function guest_cannot_access_system_console_roles_custom()
    {
        $response = $this->getJson(self::API_PREFIX . '/roles/custom');
        $response->assertStatus(401);
    }

    #[Test]
    public function institution_admin_can_access_roles_custom()
    {
        $user = $this->createUserWithRole('institution_admin');
        $response = $this->getJsonAs($user, self::API_PREFIX . '/roles/custom');
        $response->assertStatus(200);
        $response->assertJsonStructure(['data', 'meta' => ['current_page', 'last_page', 'per_page', 'total']]);
    }

    #[Test]
    public function staff_cannot_access_roles_custom()
    {
        $user = $this->createUserWithRole('staff');
        $response = $this->getJsonAs($user, self::API_PREFIX . '/roles/custom');
        $response->assertStatus(403);
    }

    #[Test]
    public function student_cannot_access_roles_custom()
    {
        $user = $this->createUserWithRole('student');
        $response = $this->getJsonAs($user, self::API_PREFIX . '/roles/custom');
        $response->assertStatus(403);
    }

    #[Test]
    public function guest_cannot_access_admin_desk_dashboard_stats()
    {
        $response = $this->getJson(self::API_PREFIX . '/dashboard-stats');
        $response->assertStatus(401);
    }

    #[Test]
    public function institution_admin_can_access_dashboard_stats()
    {
        $user = $this->createUserWithRole('institution_admin');
        $response = $this->getJsonAs($user, self::API_PREFIX . '/dashboard-stats');
        $response->assertStatus(200);
    }

    #[Test]
    public function student_cannot_access_dashboard_stats()
    {
        $user = $this->createUserWithRole('student');
        $response = $this->getJsonAs($user, self::API_PREFIX . '/dashboard-stats');
        $response->assertStatus(403);
    }

    #[Test]
    public function guest_cannot_access_academic_setup_departments()
    {
        $response = $this->getJson(self::API_PREFIX . '/departments');
        $response->assertStatus(401);
    }

    #[Test]
    public function institution_admin_can_access_departments()
    {
        $user = $this->createUserWithRole('institution_admin');
        $response = $this->getJsonAs($user, self::API_PREFIX . '/departments');
        $response->assertStatus(200);
    }

    #[Test]
    public function student_cannot_access_departments()
    {
        $user = $this->createUserWithRole('student');
        $response = $this->getJsonAs($user, self::API_PREFIX . '/departments');
        $response->assertStatus(403);
    }

    #[Test]
    public function staff_cannot_access_office_registry_students_list()
    {
        $user = $this->createUserWithRole('staff');
        $response = $this->getJsonAs($user, self::API_PREFIX . '/students/list');
        $response->assertStatus(403);
    }

    #[Test]
    public function institution_admin_can_access_students_list()
    {
        $user = $this->createUserWithRole('institution_admin');
        $response = $this->getJsonAs($user, self::API_PREFIX . '/students/list');
        $response->assertStatus(200);
    }

    #[Test]
    public function guest_cannot_access_info_pr_hub_notices()
    {
        $response = $this->getJson(self::API_PREFIX . '/notices');
        $response->assertStatus(401);
    }

    #[Test]
    public function institution_admin_can_access_notices()
    {
        $user = $this->createUserWithRole('institution_admin');
        $response = $this->getJsonAs($user, self::API_PREFIX . '/notices');
        $response->assertStatus(200);
    }

    #[Test]
    public function student_cannot_access_notices_admin_api()
    {
        $user = $this->createUserWithRole('student');
        $response = $this->getJsonAs($user, self::API_PREFIX . '/notices');
        $response->assertStatus(403);
    }

    #[Test]
    public function guest_cannot_access_accounts_room_fee_heads()
    {
        $response = $this->getJson(self::API_PREFIX . '/fee-heads');
        $response->assertStatus(401);
    }

    #[Test]
    public function institution_admin_can_access_fee_heads()
    {
        $user = $this->createUserWithRole('institution_admin');
        $response = $this->getJsonAs($user, self::API_PREFIX . '/fee-heads');
        $response->assertStatus(200);
    }

    #[Test]
    public function student_cannot_access_fee_heads()
    {
        $user = $this->createUserWithRole('student');
        $response = $this->getJsonAs($user, self::API_PREFIX . '/fee-heads');
        $response->assertStatus(403);
    }

    #[Test]
    public function guest_cannot_access_admission_cell_admission_heads()
    {
        $response = $this->getJson(self::API_PREFIX . '/admission-heads');
        $response->assertStatus(401);
    }

    #[Test]
    public function institution_admin_can_access_admission_heads()
    {
        $user = $this->createUserWithRole('institution_admin');
        $response = $this->getJsonAs($user, self::API_PREFIX . '/admission-heads');
        $response->assertStatus(200);
    }

    #[Test]
    public function student_cannot_access_admission_heads()
    {
        $user = $this->createUserWithRole('student');
        $response = $this->getJsonAs($user, self::API_PREFIX . '/admission-heads');
        $response->assertStatus(403);
    }

    #[Test]
    public function staff_cannot_access_service_branch_certificate_heads()
    {
        $user = $this->createUserWithRole('staff');
        $response = $this->getJsonAs($user, self::API_PREFIX . '/certificate-heads');
        $response->assertStatus(403);
    }

    #[Test]
    public function institution_admin_can_access_certificate_heads()
    {
        $user = $this->createUserWithRole('institution_admin');
        $response = $this->getJsonAs($user, self::API_PREFIX . '/certificate-heads');
        $response->assertStatus(200);
    }

    #[Test]
    public function guest_cannot_access_redressal_cell_grievances()
    {
        $response = $this->getJson(self::API_PREFIX . '/grievances');
        $response->assertStatus(401);
    }

    #[Test]
    public function institution_admin_can_access_grievances()
    {
        $user = $this->createUserWithRole('institution_admin');
        $response = $this->getJsonAs($user, self::API_PREFIX . '/grievances');
        $response->assertStatus(200);
    }

    #[Test]
    public function staff_can_access_grievances()
    {
        $user = $this->createUserWithRole('staff');
        $response = $this->getJsonAs($user, self::API_PREFIX . '/grievances');
        $response->assertStatus(200);
    }

    #[Test]
    public function student_cannot_access_grievances_admin_api()
    {
        $user = $this->createUserWithRole('student');
        $response = $this->getJsonAs($user, self::API_PREFIX . '/grievances');
        $response->assertStatus(403);
    }
}
