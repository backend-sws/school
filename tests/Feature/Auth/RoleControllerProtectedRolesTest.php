<?php

namespace Tests\Feature\Auth;

use App\Models\Role;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\Concerns\SeedRbacAndActAsRole;
use Tests\TestCase;

class RoleControllerProtectedRolesTest extends TestCase
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
    public function institution_admin_cannot_see_protected_role_via_show()
    {
        $user = $this->createUserWithRole('institution_admin');
        $protectedRole = Role::withoutGlobalScope('institution_scope')
            ->where('key', 'super_admin')
            ->first();
        $this->assertNotNull($protectedRole, 'super_admin role should exist');

        $response = $this->getJsonAs($user, self::API_PREFIX . '/roles/' . $protectedRole->id);
        $response->assertStatus(404);
    }

    #[Test]
    public function super_admin_can_see_protected_role_via_show()
    {
        $user = $this->createUserWithRole('super_admin', 'global', null);
        $protectedRole = Role::withoutGlobalScope('institution_scope')
            ->where('key', 'institution_admin')
            ->first();
        $this->assertNotNull($protectedRole, 'institution_admin role should exist');

        $response = $this->getJsonAs($user, self::API_PREFIX . '/roles/' . $protectedRole->id);
        $response->assertStatus(200);
        $response->assertJsonPath('data.key', 'institution_admin');
    }

    #[Test]
    public function institution_admin_cannot_update_protected_role()
    {
        $user = $this->createUserWithRole('institution_admin');
        $protectedRole = Role::withoutGlobalScope('institution_scope')
            ->where('key', 'student')
            ->first();
        $this->assertNotNull($protectedRole, 'student role should exist');

        $response = $this->putJsonAs($user, self::API_PREFIX . '/roles/' . $protectedRole->id, [
            'name' => 'Hacked Student',
            'description' => 'Should fail',
        ]);
        $response->assertStatus(404);
    }

    #[Test]
    public function institution_admin_cannot_delete_protected_role()
    {
        $user = $this->createUserWithRole('institution_admin');
        $protectedRole = Role::withoutGlobalScope('institution_scope')
            ->where('key', 'candidate')
            ->first();
        $this->assertNotNull($protectedRole, 'candidate role should exist');

        $response = $this->deleteJsonAs($user, self::API_PREFIX . '/roles/' . $protectedRole->id);
        $response->assertStatus(404);
        $this->assertDatabaseHas('roles', ['id' => $protectedRole->id]);
    }

    #[Test]
    public function roles_custom_returns_paginated_structure()
    {
        $user = $this->createUserWithRole('institution_admin');
        $response = $this->getJsonAs($user, self::API_PREFIX . '/roles/custom?page=1&per_page=10');
        $response->assertStatus(200);
        $response->assertJsonStructure([
            'success',
            'data',
            'meta' => [
                'current_page',
                'last_page',
                'per_page',
                'total',
            ],
        ]);
        $response->assertJsonPath('meta.per_page', 10);
        $response->assertJsonPath('meta.current_page', 1);
    }

    #[Test]
    public function roles_custom_page_2_returns_second_page()
    {
        $user = $this->createUserWithRole('institution_admin');
        $response = $this->getJsonAs($user, self::API_PREFIX . '/roles/custom?page=2&per_page=2');
        $response->assertStatus(200);
        $response->assertJsonPath('meta.current_page', 2);
        $response->assertJsonPath('meta.per_page', 2);
    }
}
