<?php

namespace Tests\Feature\Organization;

use App\Models\Session;
use App\Services\AcademicCalendarService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\Concerns\SeedRbacAndActAsRole;
use Tests\TestCase;

class AcademicCalendarSettingsTest extends TestCase
{
    use RefreshDatabase;
    use SeedRbacAndActAsRole;

    private int $institutionId;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seedRbac();
        $this->institutionId = (int) config('ems.default_institution_id');
    }

    #[Test]
    public function can_read_and_update_academic_calendar_settings(): void
    {
        $admin = $this->createUserWithWorkflow('system_console');

        $show = $this->actingAs($admin)->getJson('/api/v1/academic-calendar/settings');
        $show->assertOk()
            ->assertJsonPath('data.session_start_month', 4)
            ->assertJsonStructure([
                'data' => [
                    'session_start_month',
                    'start_month_label',
                    'expected_session' => ['start_year', 'end_year', 'name'],
                ],
            ]);

        $update = $this->actingAs($admin)->patchJson('/api/v1/academic-calendar/settings', [
            'session_start_month' => 3,
        ]);

        $update->assertOk()
            ->assertJsonPath('data.session_start_month', 3)
            ->assertJsonPath('data.start_month_label', 'March');

        $this->assertDatabaseHas('settings', [
            'institution_id' => $this->institutionId,
            'setting_key' => AcademicCalendarService::KEY_START_MONTH,
            'setting_value' => '3',
            'setting_group' => AcademicCalendarService::SETTING_GROUP,
        ]);
    }

    #[Test]
    public function current_session_endpoint_uses_calendar_resolution(): void
    {
        Carbon::setTestNow(Carbon::create(2026, 6, 1));

        app(AcademicCalendarService::class)->updateStartMonth($this->institutionId, 4);

        $expected = Session::factory()->create([
            'institution_id' => $this->institutionId,
            'start_year' => 2026,
            'end_year' => 2027,
            'name' => '2026-2027',
            'is_current' => false,
            'status' => 1,
        ]);

        Session::factory()->create([
            'institution_id' => $this->institutionId,
            'start_year' => 2024,
            'end_year' => 2025,
            'is_current' => true,
            'status' => 1,
        ]);

        $admin = $this->createUserWithWorkflow('academic_setup');

        $response = $this->actingAs($admin)->getJson('/api/v1/sessions/current');

        $response->assertOk()
            ->assertJsonPath('data.id', $expected->id);

        Carbon::setTestNow();
    }

    #[Test]
    public function suggested_years_endpoint_returns_calendar_based_defaults(): void
    {
        Carbon::setTestNow(Carbon::create(2026, 6, 1));

        app(AcademicCalendarService::class)->updateStartMonth($this->institutionId, 4);

        $admin = $this->createUserWithWorkflow('academic_setup');

        $response = $this->actingAs($admin)->getJson('/api/v1/sessions/suggested-years?duration_years=4');

        $response->assertOk()
            ->assertJsonPath('data.start_year', 2026)
            ->assertJsonPath('data.end_year', 2030);

        Carbon::setTestNow();
    }
}
