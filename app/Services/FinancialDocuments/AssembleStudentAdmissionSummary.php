<?php

namespace App\Services\FinancialDocuments;

use App\Models\AdmissionApplication;

/**
 * Student portal admission PDF: fee ladder from calculator + profile payload for kind partial.
 *
 * @param  array<string, mixed>  $payload  Keys: profile, permAddr, corrAddr, academic, selectedSubjects, photo, sign, qrcode, docUrls (same as legacy view)
 */
final class AssembleStudentAdmissionSummary implements FinancialDocumentAssemblerInterface
{
    public function kind(): string
    {
        return 'student_admission_summary';
    }

    public function assemble(AdmissionApplication $app, array $payload): FinancialDocument
    {
        $app->loadMissing(['admissionHead', 'admissionHead.majorSubject']);
        $calc = AdmissionAmountCalculator::fromApplication($app);
        $feeRows = $calc->studentFeeSummaryRows($app);

        $extra = array_merge($payload, [
            'app' => $app,
            'fee_rows' => $feeRows,
        ]);

        return new FinancialDocument(
            kind: 'student_admission_summary',
            documentTitle: 'Admission Application',
            metadata: [
                'id' => $app->application_id,
                'title' => 'Admission Application',
            ],
            sections: [],
            showSignatory: false,
            extra: $extra,
        );
    }
}
