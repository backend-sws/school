<?php

namespace Tests\Unit\FinancialDocuments;

use App\Models\FeePayment;
use App\Models\User;
use App\Services\FinancialDocuments\AssembleFeePaymentReceipt;
use Illuminate\Support\Facades\View;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class FinancialDocumentViewSmokeTest extends TestCase
{
    #[Test]
    public function financial_document_view_renders_fee_receipt_without_error(): void
    {
        $student = new User(['name' => 'A', 'reg_no' => 'R']);
        $payment = new FeePayment([
            'amount' => 50,
            'late_fee_applied' => 0,
            'total_amount' => 50,
            'payment_mode' => 'cash',
            'ledger_snapshot' => [],
        ]);
        $payment->setRelation('user', $student);

        $document = (new AssembleFeePaymentReceipt)->assemble($payment, $student);

        $html = View::make('pdf.financial_document', [
            'document' => $document,
            'branding' => ['name' => 'Test School', 'logo' => '', 'address' => '', 'phone' => '', 'email' => ''],
            'metadata' => $document->metadata,
        ])->render();

        $this->assertStringContainsString('Fee Payment Receipt', $html);
        $this->assertStringContainsString('Test Student', $html);
        $this->assertStringContainsString('Tuition / Monthly Fees', $html);
    }
}
