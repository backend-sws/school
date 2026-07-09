<?php

namespace Tests\Unit\FinancialDocuments;

use App\Services\FinancialDocuments\LedgerSnapshotFactory;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class LedgerSnapshotFactoryTest extends TestCase
{
    #[Test]
    public function it_maps_matrix_row_to_snapshot_shape(): void
    {
        $row = [
            'balance' => 500.0,
            'previous_dues' => 100.0,
            'monthly_total' => 400.0,
            'late_fee' => 0.0,
            'discount' => 50.0,
            'total_payable' => 450.0,
            'gross_amount' => 500.0,
            'paid_amount' => 0.0,
            'expected_particulars' => [
                ['type' => 'charge', 'name' => 'Tuition', 'amount' => 400.0],
                ['type' => 'discount', 'name' => 'Waiver', 'amount' => 50.0],
            ],
        ];

        $snap = (new LedgerSnapshotFactory)->fromMatrixRow($row, 200.0);

        $this->assertSame(100.0, $snap['previous_dues']);
        $this->assertSame(400.0, $snap['monthly_total']);
        $this->assertSame(50.0, $snap['discount']);
        $this->assertCount(1, $snap['fees']);
        $this->assertSame('Tuition', $snap['fees'][0]['name']);
        $this->assertSame(300.0, $snap['balance_after']);
    }
}
