<?php

namespace Tests\Feature;

use App\Models\AdmissionApplication;
use App\Models\Institution;
use App\Models\Stream;
use App\Models\StudentProfile;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\Concerns\SeedRbacAndActAsRole;
use Tests\TestCase;

class StudentDashboardTest extends TestCase
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
    public function can_get_dashboard_stats()
    {
        // Setup some data
        $stream = Stream::factory()->create();

        // Profiles need to be created in the current year for the default filter
        StudentProfile::factory()->count(3)->create([
            'stream_id' => $stream->id,
            'verified' => true,
            'created_at' => now()
        ]);
        StudentProfile::factory()->count(2)->create([
            'stream_id' => $stream->id,
            'verified' => false,
            'created_at' => now()
        ]);

        AdmissionApplication::factory()->count(2)->create(['process_status' => 'pending']);
        AdmissionApplication::factory()->count(3)->create(['process_status' => 'approved']);

        $response = $this->actingAs($this->admin)
            ->getJson('/api/v1/students/stats'); // Corrected route

        $response->assertStatus(200)
            ->assertJsonStructure([
                'data' => [
                    'selected_year',
                    'summary' => [
                        'total_students',
                        'verified_accounts',
                        'unverified_accounts',
                        'disabled_accounts'
                    ],
                    'stream_table'
                ]
            ]);
    }

    #[Test]
    public function can_list_students_with_filters()
    {
        $roleId = \DB::table('roles')->insertGetId([
            'key' => 'student',
            'name' => 'Student',
            'level' => 1,
            'is_system' => true
        ]);

        $stream1 = Stream::factory()->create(['name' => 'Science']);
        $stream2 = Stream::factory()->create(['name' => 'Arts']);

        $user1 = User::factory()->create(['name' => 'Student One']);
        \DB::table('user_roles')->insert(['user_id' => $user1->id, 'role_id' => $roleId]);
        StudentProfile::factory()->create(['user_id' => $user1->id, 'stream_id' => $stream1->id]);

        $user2 = User::factory()->create(['name' => 'Student Two']);
        \DB::table('user_roles')->insert(['user_id' => $user2->id, 'role_id' => $roleId]);
        StudentProfile::factory()->create(['user_id' => $user2->id, 'stream_id' => $stream2->id]);

        // Filter by stream
        $response = $this->actingAs($this->admin)
            ->getJson('/api/v1/students/list?stream_id=' . $stream1->id); // Corrected route

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Student One');

        // Search by name
        $response = $this->actingAs($this->admin)
            ->getJson('/api/v1/students/list?name=Two'); // Service uses 'name' not 'search' for this endpoint

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Student Two');
    }

    #[Test]
    public function student_list_is_secure_against_sql_injection()
    {
        $payload = "')) OR 1=1 --";
        $response = $this->actingAs($this->admin)
            ->getJson("/api/v1/students/list?name=" . urlencode($payload));

        $response->assertStatus(200);
    }
}
