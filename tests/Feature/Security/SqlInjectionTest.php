<?php

namespace Tests\Feature\Security;

use App\Models\User;
use App\Models\Department;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use PHPUnit\Framework\Attributes\Test;
use Tests\Concerns\SeedRbacAndActAsRole;
use Tests\TestCase;

class SqlInjectionTest extends TestCase
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
    public function user_search_escapes_sql_injection_payload()
    {
        $payload = "'; DROP TABLE users; --";

        $response = $this->actingAs($this->admin)
            ->getJson("/api/v1/users?search=" . urlencode($payload));

        $response->assertStatus(200);
        // Verify users table still exists and query didn't crash
        $this->assertTrue(DB::table('users')->exists());
    }

    #[Test]
    public function department_search_escapes_sql_injection_payload()
    {
        $payload = "'; SELECT SLEEP(5); --";

        $response = $this->actingAs($this->admin)
            ->getJson("/api/v1/departments?search=" . urlencode($payload));

        $response->assertStatus(200);
    }

    #[Test]
    public function student_list_search_escapes_sql_injection_payload()
    {
        $payload = "')) OR 1=1 --";

        $response = $this->actingAs($this->admin)
            ->getJson("/api/v1/students?search=" . urlencode($payload));

        $response->assertStatus(200);
    }
}
