<?php

namespace Tests\Unit;

use App\Models\Session;
use App\Services\AcademicCalendarService;
use Carbon\Carbon;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AcademicCalendarServiceTest extends TestCase
{
    use RefreshDatabase;

    private AcademicCalendarService $service;

    private int $institutionId;

    protected function setUp(): void
    {
        parent::setUp();

        $this->service = app(AcademicCalendarService::class);
        $this->institutionId = (int) config('ems.default_institution_id');
    }

    private function setStartMonth(int $month): void
    {
        $this->service->updateStartMonth($this->institutionId, $month);
    }

    #[Test]
    public function april_start_resolves_session_years_by_date(): void
    {
        $this->setStartMonth(4);

        $feb = $this->service->resolveExpectedSessionYears(
            $this->institutionId,
            Carbon::create(2026, 2, 15),
            1
        );
        $jun = $this->service->resolveExpectedSessionYears(
            $this->institutionId,
            Carbon::create(2026, 6, 1),
            1
        );

        $this->assertSame(2025, $feb['start_year']);
        $this->assertSame(2026, $feb['end_year']);
        $this->assertSame(2026, $jun['start_year']);
        $this->assertSame(2027, $jun['end_year']);
    }

    #[Test]
    public function march_start_resolves_session_years_by_date(): void
    {
        $this->setStartMonth(3);

        $feb = $this->service->resolveExpectedSessionYears(
            $this->institutionId,
            Carbon::create(2026, 2, 15),
            1
        );
        $apr = $this->service->resolveExpectedSessionYears(
            $this->institutionId,
            Carbon::create(2026, 4, 1),
            1
        );

        $this->assertSame(2025, $feb['start_year']);
        $this->assertSame(2026, $feb['end_year']);
        $this->assertSame(2026, $apr['start_year']);
        $this->assertSame(2027, $apr['end_year']);
    }

    #[Test]
    public function resolve_current_session_prefers_calendar_match_over_stale_is_current(): void
    {
        $this->setStartMonth(4);

        Carbon::setTestNow(Carbon::create(2026, 6, 1));

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
            'name' => '2024-2025',
            'is_current' => true,
            'status' => 1,
        ]);

        $resolved = $this->service->resolveCurrentSession($this->institutionId);

        $this->assertNotNull($resolved);
        $this->assertSame($expected->id, $resolved->id);

        Carbon::setTestNow();
    }

    #[Test]
    public function resolve_current_session_falls_back_to_is_current_when_no_calendar_match(): void
    {
        $this->setStartMonth(4);

        Carbon::setTestNow(Carbon::create(2026, 6, 1));

        $flagged = Session::factory()->create([
            'institution_id' => $this->institutionId,
            'start_year' => 2020,
            'end_year' => 2021,
            'name' => '2020-2021',
            'is_current' => true,
            'status' => 1,
        ]);

        $resolved = $this->service->resolveCurrentSession($this->institutionId);

        $this->assertNotNull($resolved);
        $this->assertSame($flagged->id, $resolved->id);

        Carbon::setTestNow();
    }

    #[Test]
    public function sync_current_flag_updates_is_current_on_matching_session(): void
    {
        $this->setStartMonth(4);

        Carbon::setTestNow(Carbon::create(2026, 6, 1));

        $expected = Session::factory()->create([
            'institution_id' => $this->institutionId,
            'start_year' => 2026,
            'end_year' => 2027,
            'is_current' => false,
            'status' => 1,
        ]);

        $stale = Session::factory()->create([
            'institution_id' => $this->institutionId,
            'start_year' => 2024,
            'end_year' => 2025,
            'is_current' => true,
            'status' => 1,
        ]);

        $synced = $this->service->syncCurrentFlag($this->institutionId);

        $this->assertNotNull($synced);
        $this->assertSame($expected->id, $synced->id);
        $this->assertTrue($expected->fresh()->is_current);
        $this->assertFalse($stale->fresh()->is_current);

        Carbon::setTestNow();
    }

    #[Test]
    public function defaults_to_april_when_setting_missing(): void
    {
        $this->assertSame(4, $this->service->getStartMonth($this->institutionId));
    }
}
