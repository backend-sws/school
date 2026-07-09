<?php

namespace Tests\Unit\FinancialDocuments;

use App\Models\AdmissionApplication;
use App\Models\AdmissionHead;
use App\Models\FeeType;
use App\Models\Stream;
use App\Services\FinancialDocuments\AssembleAdmissionInvoice;
use Illuminate\Foundation\Testing\RefreshDatabase;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class AssembleAdmissionInvoiceTest extends TestCase
{
    use RefreshDatabase;

    #[Test]
    public function it_emits_admission_invoice_sections(): void
    {
        $stream = new Stream(['name' => 'Science']);
        $head = new AdmissionHead(['title' => 'B.Sc Computer Science']);
        $head->setRelation('stream', $stream);

        $app = new AdmissionApplication([
            'application_id' => '#APP-1',
            'application_type' => 'new',
            'submitted_at' => '2026-02-01 10:00:00',
            'session_name' => '2025-26',
            'applicant_name' => 'Jane Doe',
            'dob' => '2005-05-05',
            'father_name' => 'F',
            'mother_name' => 'M',
            'mobile' => '999',
            'email' => 'j@example.com',
            'gender' => 'female',
            'category' => 'GEN',
            'amount' => 1000,
            'transport_amount' => 0,
            'hostel_amount' => 0,
            'discount_amount' => 0,
            'cash_amount' => 500,
            'online_amount' => 500,
            'due_amount' => 0,
            'payment_status' => 'paid',
            'payment_mode' => 'online',
            'process_status' => 'approved',
        ]);
        $app->setRelation('admissionHead', $head);

        $doc = (new AssembleAdmissionInvoice)->assemble($app);

        $this->assertSame('admission_invoice', $doc->kind);
        $types = array_column($doc->sections, 'type');
        $this->assertContains('three_col_table', $types);
        $this->assertContains('amount_summary_table', $types);
    }

    #[Test]
    public function it_lists_distinct_includes_labels_for_legacy_fee_particular_rows(): void
    {
        $institutionId = (int) config('ems.default_institution_id');
        $registration = FeeType::create([
            'institution_id' => $institutionId,
            'name' => 'Registration Fee',
            'category' => 'admission',
        ]);
        $admission = FeeType::create([
            'institution_id' => $institutionId,
            'name' => 'Admission Fee',
            'category' => 'admission',
        ]);

        $stream = new Stream(['name' => 'Science']);
        $head = new AdmissionHead(['title' => 'B.Sc Computer Science']);
        $head->setRelation('stream', $stream);

        $app = new AdmissionApplication([
            'application_id' => '#APP-2',
            'application_type' => 'new',
            'amount' => 3000,
            'fee_breakdown' => [
                ['fee_particular_id' => $registration->id, 'amount' => 1000],
                ['fee_particular_id' => $admission->id, 'amount' => 2000],
            ],
            'payment_status' => 'pending',
            'process_status' => 'pending',
        ]);
        $app->setRelation('admissionHead', $head);

        $doc = (new AssembleAdmissionInvoice)->assemble($app);
        $threeCol = collect($doc->sections)->firstWhere('type', 'three_col_table');
        $subtext = $threeCol['rows'][0]['subtext'] ?? '';

        $this->assertStringContainsString('Registration Fee', $subtext);
        $this->assertStringContainsString('Admission Fee', $subtext);
        $this->assertStringNotContainsString('Admission Application Fee (', $subtext);
    }

    #[Test]
    public function it_always_includes_amount_received_rows_even_for_zero_payments(): void
    {
        $stream = new Stream(['name' => 'Commerce']);
        $head = new AdmissionHead(['title' => 'B.Com']);
        $head->setRelation('stream', $stream);

        $app = new AdmissionApplication([
            'application_id' => '#APP-3',
            'application_type' => 'new',
            'amount' => 2500,
            'cash_amount' => 0,
            'online_amount' => 0,
            'discount_amount' => 0,
            'due_amount' => 2500,
            'payment_status' => 'pending',
            'process_status' => 'pending',
        ]);
        $app->setRelation('admissionHead', $head);

        $doc = (new AssembleAdmissionInvoice)->assemble($app);
        $summarySection = collect($doc->sections)->firstWhere('type', 'amount_summary_table');
        $rows = $summarySection['rows'] ?? [];

        $this->assertTrue(collect($rows)->contains(fn (array $row) => ($row['variant'] ?? '') === 'label_span' && ($row['text'] ?? '') === 'Amount received'));
        $this->assertTrue(collect($rows)->contains(fn (array $row) => ($row['left'] ?? '') === 'Cash' && ($row['right'] ?? '') === '₹0.00'));
        $this->assertTrue(collect($rows)->contains(fn (array $row) => str_starts_with((string) ($row['left'] ?? ''), 'Online') && ($row['right'] ?? '') === '₹0.00'));
        $this->assertTrue(collect($rows)->contains(fn (array $row) => ($row['left'] ?? '') === 'Total received' && ($row['right'] ?? '') === '₹0.00'));
    }

    #[Test]
    public function it_shows_legacy_excess_paid_row_when_paid_exceeds_net_payable(): void
    {
        $stream = new Stream(['name' => 'Arts']);
        $head = new AdmissionHead(['title' => 'B.A']);
        $head->setRelation('stream', $stream);

        $app = new AdmissionApplication([
            'application_id' => '#APP-4',
            'application_type' => 'new',
            'amount' => 9285,
            'discount_amount' => 0,
            'cash_amount' => 10285,
            'online_amount' => 0,
            'due_amount' => 0,
            'payment_status' => 'success',
            'process_status' => 'pending',
        ]);
        $app->setRelation('admissionHead', $head);

        $doc = (new AssembleAdmissionInvoice)->assemble($app);
        $summarySection = collect($doc->sections)->firstWhere('type', 'amount_summary_table');
        $rows = $summarySection['rows'] ?? [];

        $this->assertTrue(collect($rows)->contains(fn (array $row) => ($row['left'] ?? '') === 'Excess paid (legacy)' && ($row['right'] ?? '') === '₹1,000.00'));
    }
}
