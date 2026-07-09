<?php

namespace Tests\Unit\FinancialDocuments;

use App\Models\FeePayment;
use App\Models\User;
use App\Services\FinancialDocuments\AssembleFeePaymentReceipt;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AssembleFeePaymentReceiptTest extends TestCase
{
    #[Test]
    public function it_builds_line_items_from_ledger_snapshot_fees(): void
    {
        $student = new User(['name' => 'Test Student', 'reg_no' => 'REG-1']);

        $payment = new FeePayment([
            'receipt_no' => 'RCP-99',
            'payment_id' => 'PAY-1',
            'for_month' => '2026-01',
            'amount' => 100.0,
            'late_fee_applied' => 10.0,
            'total_amount' => 110.0,
            'payment_mode' => 'cash',
            'ledger_snapshot' => [
                'fees' => [
                    ['name' => 'Tuition', 'amount' => 100.0],
                ],
                'discount' => 0,
                'balance_after' => 0,
            ],
        ]);
        $payment->setRelation('user', $student);

        $doc = (new AssembleFeePaymentReceipt)->assemble($payment, $student);

        $this->assertSame('fee_receipt', $doc->kind);
        $this->assertStringContainsString('Fee Payment Receipt', $doc->documentTitle);

        $lineSection = collect($doc->sections)->firstWhere('type', 'line_items');
        $this->assertNotNull($lineSection);
        $this->assertCount(2, $lineSection['rows']);
        $this->assertSame('Tuition', $lineSection['rows'][0]['description']);
        $this->assertStringContainsString('100.00', $lineSection['rows'][0]['amount']);
        $this->assertStringContainsString('10.00', $lineSection['rows'][1]['amount']);
    }
}
