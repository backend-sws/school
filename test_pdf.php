<?php
$app = \App\Models\AdmissionApplication::where('application_id', 'APP2026000019')->first();
$branding = app(\App\Services\InstitutionBrandingService::class)->resolve($app->institution_id);
$doc = app(\App\Services\FinancialDocuments\AssembleAdmissionInvoice::class)->assemble($app);
$pdf = \Barryvdh\DomPDF\Facade\Pdf::loadView('pdf.financial_document', ['document' => $doc, 'branding' => $branding, 'metadata' => $doc->metadata])
    ->setPaper('a4', 'portrait')
    ->setOptions(['isHtml5ParserEnabled' => true, 'isRemoteEnabled' => true]);
file_put_contents('public/test.pdf', $pdf->output());
echo "DONE\n";
