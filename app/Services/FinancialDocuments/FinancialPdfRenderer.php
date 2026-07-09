<?php

namespace App\Services\FinancialDocuments;

use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;

final class FinancialPdfRenderer
{
    /**
     * @param  array<string, mixed>  $branding
     */
    public function renderDownload(FinancialDocument $document, array $branding, string $fileName): Response
    {
        $pdf = Pdf::loadView('pdf.financial_document', [
            'document' => $document,
            'branding' => $branding,
            'metadata' => $document->metadata,
        ])
            ->setPaper('a4', 'portrait')
            ->setOptions([
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled' => true,
                'defaultFont' => 'DejaVu Sans',
            ]);

        return response($pdf->output(), 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'attachment; filename="'.$fileName.'"')
            ->header('Cache-Control', 'private, max-age=0, must-revalidate');
    }

    /**
     * @param  array<string, mixed>  $branding
     */
    public function renderInline(FinancialDocument $document, array $branding, string $fileName): Response
    {
        $pdf = Pdf::loadView('pdf.financial_document', [
            'document' => $document,
            'branding' => $branding,
            'metadata' => $document->metadata,
        ])
            ->setPaper('a4', 'portrait')
            ->setOptions([
                'isHtml5ParserEnabled' => true,
                'isRemoteEnabled' => true,
                'defaultFont' => 'DejaVu Sans',
            ]);

        return response($pdf->output(), 200)
            ->header('Content-Type', 'application/pdf')
            ->header('Content-Disposition', 'inline; filename="'.$fileName.'"')
            ->header('Cache-Control', 'private, max-age=0, must-revalidate');
    }
}
