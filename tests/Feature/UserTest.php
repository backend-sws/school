<?php

namespace Tests\Feature;

use App\Models\Institution;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\Concerns\SeedRbacAndActAsRole;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;
    use SeedRbacAndActAsRole;

    protected $admin;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedRbac();
        $this->admin = $this->createUserWithRole('institution_admin');
    }

    #[Test]
    public function can_list_users_with_search()
    {
        User::factory()->create(['name' => 'John Doe', 'email' => 'john@example.com']);
        User::factory()->create(['name' => 'Jane Smith', 'email' => 'jane@example.com']);

        $response = $this->actingAs($this->admin)
            ->getJson('/api/v1/users?search=john');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'John Doe');
    }

    #[Test]
    public function user_search_is_secure_against_sql_injection()
    {
        User::factory()->create(['name' => 'Secure User']);

        $payload = "'; DROP TABLE users; --";
        $response = $this->actingAs($this->admin)
            ->getJson("/api/v1/users?search=" . urlencode($payload));

        $response->assertStatus(200);
        // Ensure table still exists by making another successful request
        $this->assertDatabaseHas('users', ['name' => 'Secure User']);
    }
}
