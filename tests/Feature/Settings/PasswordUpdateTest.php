<?php

namespace Tests\Feature\Settings;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;
use Tests\TestCase;

class PasswordUpdateTest extends TestCase
{
    use RefreshDatabase;

    public function test_password_update_page_is_displayed()
    {
        $user = User::factory()->create();
        $roleId = \DB::table('roles')->insertGetId([
            'key' => 'staff',
            'name' => 'Staff',
            'level' => 5,
            'is_system' => true
        ]);
        \DB::table('user_roles')->insert(['user_id' => $user->id, 'role_id' => $roleId]);

        $response = $this
            ->actingAs($user)
            ->get(route('user-password.edit'));

        $response->assertStatus(200);
    }

    public function test_password_can_be_updated()
    {
        $user = User::factory()->create();
        $roleId = \DB::table('roles')->insertGetId([
            'key' => 'staff',
            'name' => 'Staff',
            'level' => 5,
            'is_system' => true
        ]);
        \DB::table('user_roles')->insert(['user_id' => $user->id, 'role_id' => $roleId]);

        $response = $this
            ->actingAs($user)
            ->from(route('user-password.edit'))
            ->put(route('user-password.update'), [
                'current_password' => 'password',
                'password' => 'new-password',
                'password_confirmation' => 'new-password',
            ]);

        $response
            ->assertSessionHasNoErrors()
            ->assertRedirect(route('user-password.edit'));

        $this->assertTrue(Hash::check('new-password', $user->refresh()->password));
    }

    public function test_correct_password_must_be_provided_to_update_password()
    {
        $user = User::factory()->create();
        $roleId = \DB::table('roles')->insertGetId([
            'key' => 'staff',
            'name' => 'Staff',
            'level' => 5,
            'is_system' => true
        ]);
        \DB::table('user_roles')->insert(['user_id' => $user->id, 'role_id' => $roleId]);

        $response = $this
            ->actingAs($user)
            ->from(route('user-password.edit'))
            ->put(route('user-password.update'), [
                'current_password' => 'wrong-password',
                'password' => 'new-password',
                'password_confirmation' => 'new-password',
            ]);

        $response
            ->assertSessionHasErrors('current_password')
            ->assertRedirect(route('user-password.edit'));
    }
}
