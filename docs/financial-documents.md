# Financial documents (PDF factory)

Financial PDFs share one pipeline: **assemble a `FinancialDocument` view-model → render with `FinancialPdfRenderer` → DomPDF**. Controllers must not call `Pdf::loadView` for these flows.

## Layout

- DTO: `App\Services\FinancialDocuments\FinancialDocument`
- Assemblers: `AssembleFeePaymentReceipt`, `AssembleAdmissionInvoice`, `AssembleInventoryReceipt`, `AssembleStudentAdmissionSummary`
- Ledger snapshot for fee receipts: `LedgerSnapshotFactory::fromMatrixRow()` (used when persisting `FeePayment` and mirrored in the receipt assembler)
- Renderer: `FinancialPdfRenderer` → view `pdf.financial_document` + `pdf/financial/partials/*` and `pdf/financial/kinds/*`
- Mail/push parity: `FinancialDocumentTextFormatter::toPlainLines()` (used by `FeePaymentReceiptNotification` for email body lines)

## Adding a new document type

1. Add a `kind` string on `FinancialDocument` and a dedicated assembler.
2. Either add section `type` partials under `resources/views/pdf/financial/partials/` or a kind-specific include under `resources/views/pdf/financial/kinds/`, and branch in `pdf/financial_document.blade.php`.
3. Route the controller through `FinancialPdfRenderer` only (single DomPDF options array).
4. Put all currency / row visibility logic in PHP (assemblers), not Blade.

## After changing templates

Notification copy for fee receipts is driven by the same assembler output as the PDF; keep field labels aligned when editing assemblers.

## Cleanup checklist

- `rg "loadView\\('pdf\\." app` — financial controllers should only hit `pdf.financial_document` via the renderer.
- Remove legacy `resources/views/pdf/*_receipt*.blade.php` / invoice blades once the factory path is verified.
