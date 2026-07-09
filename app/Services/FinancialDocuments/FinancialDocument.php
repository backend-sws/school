<?php

namespace App\Services\FinancialDocuments;

/**
 * View-model for PDF.financial_document — assembly output only (no math in Blade).
 *
 * @phpstan-type Section array{type: string, ...}
 */
final class FinancialDocument
{
    /**
     * @param  array<string, mixed>  $metadata  Passed to print-base (id, title, …)
     * @param  list<Section>  $sections
     * @param  array<string, mixed>  $extra  Kind-specific payload for dedicated partials when needed
     */
    public function __construct(
        public string $kind,
        public string $documentTitle,
        public array $metadata = [],
        public array $sections = [],
        public bool $showSignatory = true,
        public array $extra = [],
    ) {
    }
}
