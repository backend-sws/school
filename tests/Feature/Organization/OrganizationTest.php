<?php

namespace Tests\Feature\Organization;

use App\Models\Institution;
use App\Models\Department;
use App\Models\Subject;
use App\Models\SubjectCategory;
use App\Models\SubjectGroup;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\Concerns\SeedRbacAndActAsRole;
use Tests\TestCase;

class OrganizationTest extends TestCase
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
    public function can_list_departments()
    {
        Department::factory()->count(3)->create();

        $response = $this->actingAs($this->admin)
            ->getJson('/api/v1/departments');

        $response->assertStatus(200)
            ->assertJsonCount(3, 'data');
    }

    #[Test]
    public function can_create_department()
    {
        $data = [
            'name' => 'Department of Science',
            'code' => 'SCI',
            'status' => 1,
        ];

        $response = $this->actingAs($this->admin)
            ->postJson('/api/v1/departments', $data);

        $response->assertStatus(201);
        $this->assertDatabaseHas('departments', ['code' => 'SCI']);
    }

    #[Test]
    public function can_list_subject_categories()
    {
        SubjectCategory::factory()->count(4)->create();

        $response = $this->actingAs($this->admin)
            ->getJson('/api/v1/subject-categories');

        $response->assertStatus(200)
            ->assertJsonCount(4, 'data');
    }

    #[Test]
    public function can_list_subject_groups()
    {
        SubjectGroup::factory()->count(2)->create();

        $response = $this->actingAs($this->admin)
            ->getJson('/api/v1/subject-groups');

        $response->assertStatus(200)
            ->assertJsonCount(2, 'data');
    }

    #[Test]
    public function can_search_departments()
    {
        Department::factory()->create(['name' => 'Physics']);
        Department::factory()->create(['name' => 'Chemistry']);

        $response = $this->actingAs($this->admin)
            ->getJson('/api/v1/departments?search=physics');

        $response->assertStatus(200)
            ->assertJsonCount(1, 'data')
            ->assertJsonPath('data.0.name', 'Physics');
    }

    #[Test]
    public function can_map_subject_to_categories()
    {
        $subject = Subject::factory()->create();
        $categories = SubjectCategory::factory()->count(2)->create();

        $data = [
            'subject_id' => $subject->id,
            'category_ids' => $categories->pluck('id')->toArray()
        ];

        $response = $this->actingAs($this->admin)
            ->postJson('/api/v1/subject-category-mappings', $data);

        $response->assertStatus(200);
        $this->assertCount(2, $subject->fresh()->categories);
    }

    #[Test]
    public function can_update_subject_mappings()
    {
        $subject = Subject::factory()->create();
        $categories = SubjectCategory::factory()->count(3)->create();
        $subject->categories()->attach($categories->pluck('id'));

        $newCategory = SubjectCategory::factory()->create();

        $response = $this->actingAs($this->admin)
            ->putJson("/api/v1/subject-category-mappings/{$subject->id}", [
                'category_ids' => [$newCategory->id]
            ]);

        $response->assertStatus(200);
        $this->assertCount(1, $subject->fresh()->categories);
        $this->assertEquals($newCategory->id, $subject->fresh()->categories->first()->id);
    }
}
