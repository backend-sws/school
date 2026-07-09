<?php

namespace Tests\Feature\Admission;

use App\Models\AdmissionHead;
use App\Models\Institution;
use App\Models\FeeParticular;
use App\Models\MainStream;
use App\Models\Session;
use App\Models\Stream;
use App\Models\Subject;
use App\Models\SubjectCategory;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\Concerns\SeedRbacAndActAsRole;
use Tests\TestCase;

class AdmissionHeadTest extends TestCase
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
    public function can_list_admission_heads()
    {
        AdmissionHead::factory()->count(3)->create();

        $response = $this->actingAs($this->admin)
            ->getJson('/api/v1/admission-heads');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    #[Test]
    public function can_create_admission_head()
    {
        $mainStream = MainStream::factory()->create();
        $stream = Stream::factory()->create(['main_stream_id' => $mainStream->id]);
        $session = Session::factory()->create();
        $subject = Subject::factory()->create(['stream_id' => $stream->id]);
        $category = SubjectCategory::factory()->create();
        $particular = FeeParticular::factory()->create();

        $data = [
            'title' => 'Test Admission 2026',
            'course_for' => 'new',
            'main_stream_id' => $mainStream->id,
            'stream_id' => $stream->id,
            'session_id' => $session->id,
            'major_subject_id' => $subject->id,
            'status' => 0, // Draft
            'board_criteria' => ['BSEB'],
            'gender_criteria' => ['Male', 'Female'],
            'category_criteria' => ['General'],
            'last_date' => '2026-12-31',
            'fees' => [
                [
                    'fee_particular_id' => $particular->id,
                    'amount' => 1000
                ]
            ],
            'allow_subject_paper_selection' => true,
            'admission_head_papers' => [
                [
                    'subject_category_id' => $category->id,
                    'paper_limit' => 1,
                    'is_compulsory' => true
                ]
            ],
            'has_application_fees' => true,
            'application_fees' => 500
        ];

        $response = $this->actingAs($this->admin)
            ->postJson('/api/v1/admission-heads', $data);

        $response->assertStatus(200) // Controller returns 200 for success in store()
            ->assertJsonPath('message', 'Admission head created successfully');

        $this->assertDatabaseHas('admission_heads', [
            'title' => 'Test Admission 2026'
        ]);
    }

    #[Test]
    public function can_update_admission_head_status()
    {
        $head = AdmissionHead::factory()->create(['status' => 0]); // Draft

        $response = $this->actingAs($this->admin)
            ->patchJson("/api/v1/admission-heads/{$head->id}/status", [
                'status' => 1 // Published
            ]);

        $response->assertStatus(200)
            ->assertJsonPath('data', 1);

        $this->assertEquals(1, $head->fresh()->status);
    }

    #[Test]
    public function cannot_revert_published_head_to_draft()
    {
        $head = AdmissionHead::factory()->create(['status' => 1]); // Published

        $response = $this->actingAs($this->admin)
            ->patchJson("/api/v1/admission-heads/{$head->id}/status", [
                'status' => 0 // Draft
            ]);

        $response->assertStatus(422)
            ->assertJsonPath('message', 'Cannot revert status to Draft once it has been Published or Archived.');
    }

    #[Test]
    public function cannot_delete_head_with_applications()
    {
        $head = AdmissionHead::factory()->create();
        \App\Models\AdmissionApplication::factory()->create([
            'admission_head_id' => $head->id
        ]);

        $response = $this->actingAs($this->admin)
            ->deleteJson("/api/v1/admission-heads/{$head->id}");

        $response->assertStatus(422)
            ->assertJsonStructure(['message']);

        $this->assertDatabaseHas('admission_heads', ['id' => $head->id]);
    }
}
