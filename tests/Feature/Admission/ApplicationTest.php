<?php

namespace Tests\Feature\Admission;

use App\Models\AdmissionApplication;
use App\Models\AdmissionHead;
use App\Models\FeeType;
use App\Models\Institution;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\Concerns\SeedRbacAndActAsRole;
use Tests\TestCase;

class ApplicationTest extends TestCase
{
    use RefreshDatabase;
    use SeedRbacAndActAsRole;

    protected $admin;
    protected $student;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seedRbac();
        $this->admin = $this->createUserWithRole('institution_admin');
        $this->student = $this->createUserWithRole('student');
    }

    #[Test]
    public function student_can_submit_application()
    {
        $head = AdmissionHead::factory()->published()->create();

        $data = [
            'admission_head_id' => $head->id,
            'applicant_name' => 'John Doe',
            'father_name' => 'Richard Doe',
            'dob' => '2005-01-01',
            'gender' => 'Male',
            'category' => 'General',
            'mobile' => '9999999999',
            'email' => 'john@example.com',
            'subject_preferences' => ['MJC' => 1, 'MIC' => 2],
            'previous_board' => 'CBSE',
            'previous_marks' => 85.5
        ];

        $response = $this->actingAs($this->student)
            ->postJson('/api/v1/applications', $data);

        $response->assertStatus(201);

        $this->assertDatabaseHas('admission_applications', [
            'user_id' => $this->student->id,
            'applicant_name' => 'John Doe',
            'previous_board' => 'CBSE'
        ]);
    }

    #[Test]
    public function admin_can_list_applications()
    {
        AdmissionApplication::factory()->count(5)->create();

        $response = $this->actingAs($this->admin)
            ->getJson('/api/v1/applications');

        $response->assertStatus(200)
            ->assertJsonCount(5, 'data');
    }

    #[Test]
    public function admin_can_process_application()
    {
        $application = AdmissionApplication::factory()->create(['process_status' => 'pending']);

        $response = $this->actingAs($this->admin)
            ->postJson("/api/v1/applications/{$application->id}/process", [
                'status' => 'approved',
                'remarks' => 'Everything looks good'
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('message', 'Application approved');

        $this->assertEquals('approved', $application->fresh()->process_status);
        $this->assertEquals('Everything looks good', $application->fresh()->remarks);
    }

    #[Test]
    public function student_cannot_update_processed_application()
    {
        $application = AdmissionApplication::factory()->create([
            'user_id' => $this->student->id,
            'process_status' => 'approved'
        ]);

        $response = $this->actingAs($this->student)
            ->putJson("/api/v1/applications/{$application->id}", [
                'applicant_name' => 'New Name'
            ]);

        $response->assertStatus(422)
            ->assertJsonPath('message', 'Cannot update processed application');
    }

    #[Test]
    public function admin_can_delete_application()
    {
        $application = AdmissionApplication::factory()->create();

        $response = $this->actingAs($this->admin)
            ->deleteJson("/api/v1/applications/{$application->id}");

        $response->assertStatus(200);
        $this->assertDatabaseMissing('admission_applications', ['id' => $application->id]);
    }

    #[Test]
    public function store_normalizes_fallback_fees_into_canonical_breakdown_shape()
    {
        $institutionId = (int) config('ems.default_institution_id');
        $feeType = FeeType::create([
            'institution_id' => $institutionId,
            'name' => 'Registration Fee',
            'category' => 'admission',
        ]);

        $payload = [
            'stream_id' => 9999,
            'applicant_name' => 'Jane Legacy',
            'father_name' => 'Father Legacy',
            'mobile' => '9123456789',
            'email' => 'legacy-fee@example.com',
            'fees' => [
                [
                    'fee_particular_id' => $feeType->id,
                    'amount' => 1250,
                ],
            ],
        ];

        $response = $this->actingAs($this->student)->postJson('/api/v1/applications', $payload);
        $response->assertStatus(201);

        $application = AdmissionApplication::query()->latest('id')->firstOrFail();
        $this->assertIsArray($application->fee_breakdown);
        $this->assertSame($feeType->id, $application->fee_breakdown[0]['fee_type_id']);
        $this->assertSame('Registration Fee', $application->fee_breakdown[0]['name']);
        $this->assertSame('charge', $application->fee_breakdown[0]['type']);
        $this->assertSame('admission', $application->fee_breakdown[0]['category']);
    }
}
