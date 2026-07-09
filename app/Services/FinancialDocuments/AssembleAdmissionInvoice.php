<?php

namespace App\Services\FinancialDocuments;

use App\Models\AdmissionApplication;
use Carbon\Carbon;

final class AssembleAdmissionInvoice implements FinancialDocumentAssemblerInterface
{
    public function kind(): string
    {
        return 'admission_invoice';
    }

    public function assemble(AdmissionApplication $app): FinancialDocument
    {
        $app->loadMissing(['admissionHead', 'admissionHead.stream', 'lmsClass']);

        $calc = AdmissionAmountCalculator::fromApplication($app);
        $isReadmission = $calc->isReadmission;
        $docTitle = $isReadmission ? 'Re-Admission Receipt' : 'Admission Application Invoice';
        $typeLabel = $isReadmission ? 'RE-ADMISSION' : 'NEW';

        $submitted = $app->submitted_at
            ? Carbon::parse($app->submitted_at)->format('d M Y')
            : '—';

        $lmsClass = $app->lmsClass ?? ($app->class_id ? \App\Models\LmsClass::find($app->class_id) : null);
        $className = $lmsClass?->name ?? optional($app->admissionHead)->title ?? '—';
        $programText = (string) $className;
        if ($app->session_name) {
            $programText .= ' ('.$app->session_name.')';
        }
        
        $sectionName = $lmsClass?->section ?? optional(optional($app->admissionHead)->stream)->name ?? '—';

        $includedParts = collect($calc->invoiceComponentRows($app))
            ->map(fn (array $component) => $component['label'].' ('.Money::inr((float) $component['amount']).')')
            ->values()
            ->all();
        $inclusionText = 'Includes: '.implode(', ', $includedParts);

        $sections = [
            ['type' => 'subsection_title', 'title' => 'Application Details'],
            ['type' => 'meta_table', 'rows' => [
                ['Application ID:', (string) ($app->application_id ?? '—'), 'Submitted On:', $submitted],
                ['Class:', $programText, '', ''],
                [
                    'Section:',
                    (string) $sectionName,
                    'Type:',
                    $typeLabel,
                ],
            ]],
            ['type' => 'subsection_title', 'title' => 'Applicant Information'],
            ['type' => 'meta_table', 'rows' => [
                ['Name:', (string) ($app->applicant_name ?? '—'), 'Date of Birth:', $app->dob ? Carbon::parse($app->dob)->format('d M Y') : '—'],
                ['Father\'s Name:', (string) ($app->father_name ?? '—'), 'Mother\'s Name:', (string) ($app->mother_name ?? '—')],
                ['Mobile:', (string) ($app->mobile ?? '—'), 'Email:', (string) ($app->email ?? '—')],
                ['Gender:', strtoupper((string) ($app->gender ?? '—')), 'Category:', strtoupper((string) ($app->category ?? '—'))],
            ]],
            ['type' => 'subsection_title', 'title' => 'Amount summary'],
            ['type' => 'amount_summary_table', 'rows' => $calc->invoiceAmountSummaryRows($app)],
            ['type' => 'subsection_title', 'title' => 'Fee & Payment Status'],
            ['type' => 'three_col_table', 'headers' => ['Description', 'Status', 'Amount'], 'rows' => [[
                'cells' => [
                    'Total billable fee',
                    strtoupper((string) ($app->payment_status ?? 'pending')),
                    Money::inr((float) ($app->amount ?? $calc->grossBillable)),
                ],
                'subtext' => $inclusionText,
                'status_paid' => in_array($app->payment_status, ['paid', 'success'], true),
            ]]],
            ['type' => 'footer_status_strip', 'left_title' => 'Process Status', 'left_value' => strtoupper((string) ($app->process_status ?? 'pending')), 'left_highlight' => ($app->process_status ?? '') === 'approved', 'right_title' => 'Payment mode', 'right_value' => strtoupper((string) ($app->payment_mode ?? '—'))],
        ];

        return new FinancialDocument(
            kind: 'admission_invoice',
            documentTitle: $docTitle,
            metadata: [
                'id' => $app->application_id,
                'title' => $isReadmission ? 'Re-Admission Receipt' : 'Admission Invoice',
            ],
            sections: $sections,
            showSignatory: false,
        );
    }
}
