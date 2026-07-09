<?php

namespace Tests\Unit\Fees;

use App\Models\FeePayment;
use App\Models\Session;
use App\Models\StudentFeePeriodBalance;
use App\Models\User;
use App\Services\FeeCollectionService;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class FeeCollectionServiceProjectedPaymentMetadataTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function projected_rows_include_previous_payment_metadata(): void
    {
        $institutionId = (int) config('ems.default_institution_id');
        $user = User::factory()->create(['institution_id' => $institutionId]);
        $session = Session::factory()->create(['institution_id' => $institutionId]);

        $payment = FeePayment::create([
            'institution_id' => $institutionId,
            'payment_id' => 'PAY-TEST-001',
            'user_id' => $user->id,
            'for_month' => '2026-03',
            'amount' => 400.00,
            'total_amount' => 400.00,
            'payment_mode' => 'cash',
            'payment_status' => 'paid',
            'payment_date' => now()->setDate(2026, 3, 12),
            'receipt_no' => 'RCP-MAR',
        ]);

        StudentFeePeriodBalance::create([
            'institution_id' => $institutionId,
            'user_id' => $user->id,
            'session_id' => $session->id,
            'period_key' => '2026-03',
            'frequency' => 'monthly',
            'opening_balance' => 0,
            'period_fee' => 400,
            'discount' => 0,
            'late_fee' => 0,
            'total_payable' => 400,
            'paid_amount' => 400,
            'closing_balance' => 0,
        ]);

        $service = app(FeeCollectionService::class);
        $rows = $service->getProjectedPeriodBalances($user, $institutionId, $session->id);

        $this->assertCount(1, $rows);
        $this->assertSame($payment->id, $rows[0]['payment_id']);
        $this->assertSame('RCP-MAR', $rows[0]['receipt_no']);
        $this->assertSame('cash', $rows[0]['payment_mode']);
        $this->assertSame('2026-03-12', $rows[0]['payment_date']);
    }
}
