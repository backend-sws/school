<?php

namespace Tests\Unit\Fees;

use App\Models\Session;
use App\Models\StudentFeePeriodBalance;
use App\Models\User;
use App\Services\FeeCollectionService;
use App\Services\Fees\StudentFeePeriodBalanceProjector;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class StudentFeePeriodBalanceProjectorTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_upserts_projected_balance_for_period(): void
    {
        $user = User::factory()->create([
            'institution_id' => config('ems.default_institution_id'),
        ]);
        $session = Session::factory()->create([
            'institution_id' => config('ems.default_institution_id'),
        ]);

        $service = $this->createMock(FeeCollectionService::class);
        $service->method('getStudentLedgerMatrix')->willReturn([
            'frequency' => 'monthly',
            'matrix' => [
                [
                    'month_key' => '2026-04',
                    'previous_dues' => 100.00,
                    'monthly_total' => 500.00,
                    'discount' => 25.00,
                    'late_fee' => 10.00,
                    'total_payable' => 610.00,
                    'paid_amount' => 200.00,
                    'balance' => 410.00,
                ],
            ],
        ]);

        $projector = new StudentFeePeriodBalanceProjector($service);
        $projector->projectPeriod($user, (int) config('ems.default_institution_id'), '2026-04', $session->id);

        $this->assertDatabaseHas('student_fee_period_balances', [
            'institution_id' => (int) config('ems.default_institution_id'),
            'user_id' => $user->id,
            'session_id' => $session->id,
            'period_key' => '2026-04',
        ]);

        $row = StudentFeePeriodBalance::query()->where('user_id', $user->id)->firstOrFail();
        $this->assertEquals(410.00, (float) $row->closing_balance);
        $this->assertEquals('monthly', $row->frequency);
    }
}
