<?php

namespace Tests\Feature\Redressal;

use App\Models\Grievance;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\Concerns\SeedRbacAndActAsRole;
use Tests\TestCase;

class GrievancesCrudTest extends TestCase
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
    public function authorized_user_can_list_grievances()
    {
        $user = $this->createUserWithRole('institution_admin');
        $response = $this->getJsonAs($user, self::API_PREFIX . '/grievances');
        $response->assertStatus(200);
        $response->assertJsonStructure(['success', 'data', 'meta']);
    }

    #[Test]
    public function authorized_user_can_create_grievance()
    {
        $user = $this->createUserWithRole('institution_admin');
        $payload = [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'mobile' => '9876543210',
            'subject' => 'Test grievance subject',
            'description' => 'Test grievance description body.',
        ];
        $response = $this->postJsonAs($user, self::API_PREFIX . '/grievances', $payload);
        $response->assertStatus(201);
        $response->assertJsonPath('data.subject', 'Test grievance subject');
        $this->assertDatabaseHas('grievances', ['subject' => 'Test grievance subject']);
    }

    #[Test]
    public function authorized_user_can_show_grievance()
    {
        $user = $this->createUserWithRole('institution_admin');
        $grievance = Grievance::withoutGlobalScope('institution_scope')->create([
            'institution_id' => $this->defaultInstitutionId(),
            'ticket_no' => 'GRV-TEST-001',
            'name' => 'Show Test',
            'email' => 'show@test.com',
            'subject' => 'Show test subject',
            'description' => 'Show test description',
            'status' => 'open',
            'priority' => 'medium',
        ]);
        $response = $this->getJsonAs($user, self::API_PREFIX . '/grievances/' . $grievance->id);
        $response->assertStatus(200);
        $response->assertJsonPath('data.subject', 'Show test subject');
    }

    #[Test]
    public function authorized_user_can_update_grievance()
    {
        $user = $this->createUserWithRole('institution_admin');
        $grievance = Grievance::withoutGlobalScope('institution_scope')->create([
            'institution_id' => $this->defaultInstitutionId(),
            'ticket_no' => 'GRV-UPD-001',
            'name' => 'Update Test',
            'email' => 'upd@test.com',
            'subject' => 'Update test subject',
            'description' => 'Update test description',
            'status' => 'open',
            'priority' => 'medium',
        ]);
        $response = $this->putJsonAs($user, self::API_PREFIX . '/grievances/' . $grievance->id, [
            'status' => 'in-progress',
            'priority' => 'high',
        ]);
        $response->assertStatus(200);
        $this->assertDatabaseHas('grievances', ['id' => $grievance->id, 'status' => 'in-progress']);
    }

    #[Test]
    public function authorized_user_can_delete_grievance()
    {
        $user = $this->createUserWithRole('institution_admin');
        $grievance = Grievance::withoutGlobalScope('institution_scope')->create([
            'institution_id' => $this->defaultInstitutionId(),
            'ticket_no' => 'GRV-DEL-001',
            'name' => 'Delete Test',
            'email' => 'del@test.com',
            'subject' => 'Delete test subject',
            'description' => 'Delete test description',
            'status' => 'open',
            'priority' => 'medium',
        ]);
        $response = $this->deleteJsonAs($user, self::API_PREFIX . '/grievances/' . $grievance->id);
        $response->assertStatus(200);
        $this->assertDatabaseMissing('grievances', ['id' => $grievance->id]);
    }

    #[Test]
    public function staff_can_list_and_create_grievances()
    {
        $user = $this->createUserWithRole('staff');
        $response = $this->getJsonAs($user, self::API_PREFIX . '/grievances');
        $response->assertStatus(200);
        $response = $this->postJsonAs($user, self::API_PREFIX . '/grievances', [
            'name' => 'Staff User',
            'subject' => 'Staff grievance',
            'description' => 'Staff grievance description.',
        ]);
        $response->assertStatus(201);
    }

    #[Test]
    public function unauthorized_user_cannot_list_grievances()
    {
        $user = $this->createUserWithRole('student');
        $response = $this->getJsonAs($user, self::API_PREFIX . '/grievances');
        $response->assertStatus(403);
    }

    #[Test]
    public function unauthorized_user_cannot_create_grievance_via_admin_api()
    {
        $user = $this->createUserWithRole('student');
        $response = $this->postJsonAs($user, self::API_PREFIX . '/grievances', [
            'name' => 'Student',
            'subject' => 'Forbidden',
            'description' => 'Should fail.',
        ]);
        $response->assertStatus(403);
    }

    #[Test]
    public function unauthorized_user_cannot_delete_grievance()
    {
        $user = $this->createUserWithRole('student');
        $grievance = Grievance::withoutGlobalScope('institution_scope')->create([
            'institution_id' => $this->defaultInstitutionId(),
            'ticket_no' => 'GRV-FORB-001',
            'name' => 'Forbidden',
            'subject' => 'Forbidden subject',
            'description' => 'Forbidden description',
            'status' => 'open',
            'priority' => 'medium',
        ]);
        $response = $this->deleteJsonAs($user, self::API_PREFIX . '/grievances/' . $grievance->id);
        $response->assertStatus(403);
        $this->assertDatabaseHas('grievances', ['id' => $grievance->id]);
    }
}
