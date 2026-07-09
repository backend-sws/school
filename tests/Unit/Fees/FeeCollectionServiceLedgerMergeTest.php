<?php

namespace Tests\Unit\Fees;

use App\Services\FeeCollectionService;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class FeeCollectionServiceLedgerMergeTest extends TestCase
{
    #[Test]
    public function it_merges_projected_balances_while_preserving_payment_metadata(): void
    {
        $service = app(FeeCollectionService::class);

        $computed = [
            [
                'month_key' => '2026-04',
                'month_name' => 'Apr 2026',
                'due_date' => '2026-04-05',
                'previous_dues' => 0.0,
                'expected_particulars' => [['name' => 'Tuition', 'amount' => 500.0]],
                'monthly_total' => 500.0,
                'gross_amount' => 500.0,
                'discount' => 0.0,
                'late_fee' => 0.0,
                'total_payable' => 500.0,
                'paid_amount' => 500.0,
                'balance' => 0.0,
                'payment_id' => 42,
                'receipt_no' => 'RCP-TEST',
                'payment_mode' => 'cash',
                'payment_date' => '2026-04-10',
                'status' => 'paid',
            ],
            [
                'month_key' => '2026-05',
                'month_name' => 'May 2026',
                'due_date' => '2026-05-05',
                'previous_dues' => 0.0,
                'expected_particulars' => [],
                'monthly_total' => 500.0,
                'gross_amount' => 500.0,
                'discount' => 0.0,
                'late_fee' => 0.0,
                'total_payable' => 500.0,
                'paid_amount' => 0.0,
                'balance' => 500.0,
                'payment_id' => null,
                'receipt_no' => null,
                'payment_mode' => null,
                'payment_date' => null,
                'status' => 'unpaid',
            ],
        ];

        $projected = [
            [
                'month_key' => '2026-04',
                'month_name' => '2026-04',
                'due_date' => null,
                'previous_dues' => 0.0,
                'expected_particulars' => [],
                'monthly_total' => 500.0,
                'gross_amount' => 500.0,
                'discount' => 0.0,
                'late_fee' => 0.0,
                'total_payable' => 500.0,
                'paid_amount' => 500.0,
                'balance' => 0.0,
                'payment_id' => null,
                'receipt_no' => null,
                'payment_mode' => null,
                'payment_date' => null,
                'status' => 'paid',
            ],
        ];

        $merged = $service->mergeLedgerMatrixWithProjected($computed, $projected);

        $this->assertCount(2, $merged);
        $this->assertSame(42, $merged[0]['payment_id']);
        $this->assertSame('RCP-TEST', $merged[0]['receipt_no']);
        $this->assertSame(0.0, $merged[0]['balance']);
        $this->assertSame('Apr 2026', $merged[0]['month_name']);
        $this->assertNull($merged[1]['payment_id']);
        $this->assertSame(500.0, $merged[1]['balance']);
    }
}
