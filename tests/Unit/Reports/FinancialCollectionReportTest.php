<?php

namespace Tests\Unit\Reports;

use App\Models\FeePayment;
use App\Models\User;
use App\Services\Reports\FinancialCollectionReport;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class FinancialCollectionReportTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_includes_manual_paid_fee_payments_in_summary(): void
    {
        $institutionId = (int) config('ems.default_institution_id');
        $user = User::factory()->create(['institution_id' => $institutionId]);
        $today = now()->toDateString();

        FeePayment::create([
            'institution_id' => $institutionId,
            'payment_id' => 'PAY-PAID-001',
            'user_id' => $user->id,
            'amount' => 750.00,
            'total_amount' => 750.00,
            'payment_mode' => 'cash',
            'payment_status' => 'paid',
            'payment_date' => $today,
            'for_month' => now()->format('Y-m'),
            'receipt_no' => 'RCP-PAID',
        ]);

        $report = app(FinancialCollectionReport::class);
        $data = $report->getData([
            'start_date' => $today,
            'end_date' => $today,
            'view_mode' => 'daily',
        ]);

        $this->assertSame(750.0, $data['summary']['total_general_fees']);
        $this->assertCount(1, $data['items']);
    }
}
