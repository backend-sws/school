<?php

namespace Tests\Feature\Roles;

use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\Concerns\SeedRbacAndActAsRole;
use Tests\TestCase;

class RolesCrudTest extends TestCase
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
    public function authorized_user_can_list_custom_roles()
    {
        $user = $this->createUserWithRole('institution_admin');
        $response = $this->getJsonAs($user, self::API_PREFIX . '/roles/custom');
        $response->assertStatus(200);
        $response->assertJsonStructure(['success', 'data', 'meta' => ['current_page', 'last_page', 'per_page', 'total']]);
    }

    #[Test]
    public function authorized_user_can_create_custom_role()
    {
        $user = $this->createUserWithRole('institution_admin');
        $payload = [
            'name' => 'Test Role',
            'description' => 'Role for testing',
        ];
        $response = $this->postJsonAs($user, self::API_PREFIX . '/roles', $payload);
        $response->assertStatus(201);
        $response->assertJsonPath('data.name', 'Test Role');
        $this->assertDatabaseHas('roles', ['name' => 'Test Role', 'is_system' => false]);
    }

    #[Test]
    public function authorized_user_can_show_custom_role()
    {
        $user = $this->createUserWithRole('institution_admin');
        $role = Role::withoutGlobalScope('institution_scope')->create([
            'key' => 'test_role_abc1',
            'name' => 'Show Test Role',
            'level' => 10,
            'description' => null,
            'is_system' => false,
        ]);
        $role->roleScopes()->create(['scope_type' => 'college', 'scope_id' => $this->defaultInstitutionId()]);
        $response = $this->getJsonAs($user, self::API_PREFIX . '/roles/' . $role->id);
        $response->assertStatus(200);
        $response->assertJsonPath('data.name', 'Show Test Role');
    }

    #[Test]
    public function authorized_user_can_update_custom_role()
    {
        $user = $this->createUserWithRole('institution_admin');
        $role = Role::withoutGlobalScope('institution_scope')->create([
            'key' => 'update_test_xyz1',
            'name' => 'Update Test Role',
            'level' => 10,
            'description' => null,
            'is_system' => false,
        ]);
        $role->roleScopes()->create(['scope_type' => 'college', 'scope_id' => $this->defaultInstitutionId()]);
        $response = $this->putJsonAs($user, self::API_PREFIX . '/roles/' . $role->id, [
            'name' => 'Updated Role Name',
            'description' => 'Updated description',
        ]);
        $response->assertStatus(200);
        $response->assertJsonPath('data.name', 'Updated Role Name');
        $this->assertDatabaseHas('roles', ['id' => $role->id, 'name' => 'Updated Role Name']);
    }

    #[Test]
    public function authorized_user_can_delete_custom_role()
    {
        $user = $this->createUserWithRole('institution_admin');
        $role = Role::withoutGlobalScope('institution_scope')->create([
            'key' => 'delete_test_def1',
            'name' => 'Delete Test Role',
            'level' => 10,
            'description' => null,
            'is_system' => false,
        ]);
        $role->roleScopes()->create(['scope_type' => 'college', 'scope_id' => $this->defaultInstitutionId()]);
        $response = $this->deleteJsonAs($user, self::API_PREFIX . '/roles/' . $role->id);
        $response->assertStatus(200);
        $this->assertDatabaseMissing('roles', ['id' => $role->id]);
    }

    #[Test]
    public function unauthorized_user_cannot_list_custom_roles()
    {
        $user = $this->createUserWithRole('student');
        $response = $this->getJsonAs($user, self::API_PREFIX . '/roles/custom');
        $response->assertStatus(403);
    }

    #[Test]
    public function unauthorized_user_cannot_create_role()
    {
        $user = $this->createUserWithRole('student');
        $response = $this->postJsonAs($user, self::API_PREFIX . '/roles', [
            'name' => 'Forbidden Role',
            'description' => 'Should fail',
        ]);
        $response->assertStatus(403);
        $this->assertDatabaseMissing('roles', ['name' => 'Forbidden Role']);
    }

    #[Test]
    public function unauthorized_user_cannot_update_role()
    {
        $user = $this->createUserWithRole('student');
        $role = Role::withoutGlobalScope('institution_scope')->create([
            'key' => 'forbidden_up_xyz1',
            'name' => 'Forbidden Update',
            'level' => 10,
            'description' => null,
            'is_system' => false,
        ]);
        $role->roleScopes()->create(['scope_type' => 'college', 'scope_id' => $this->defaultInstitutionId()]);
        $response = $this->putJsonAs($user, self::API_PREFIX . '/roles/' . $role->id, ['name' => 'Hacked']);
        $response->assertStatus(403);
        $this->assertDatabaseHas('roles', ['id' => $role->id, 'name' => 'Forbidden Update']);
    }

    #[Test]
    public function unauthorized_user_cannot_delete_role()
    {
        $user = $this->createUserWithRole('student');
        $role = Role::withoutGlobalScope('institution_scope')->create([
            'key' => 'forbidden_del_abc1',
            'name' => 'Forbidden Delete',
            'level' => 10,
            'description' => null,
            'is_system' => false,
        ]);
        $role->roleScopes()->create(['scope_type' => 'college', 'scope_id' => $this->defaultInstitutionId()]);
        $response = $this->deleteJsonAs($user, self::API_PREFIX . '/roles/' . $role->id);
        $response->assertStatus(403);
        $this->assertDatabaseHas('roles', ['id' => $role->id]);
    }
}
