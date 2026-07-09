<?php

namespace App\Services\FinancialDocuments;

/**
 * Plain-text lines from a FinancialDocument (mail / push parity with PDF rows).
 */
final class FinancialDocumentTextFormatter
{
    /**
     * @return list<string>
     */
    public function toPlainLines(FinancialDocument $document): array
    {
        $lines = [$document->documentTitle];

        if ($document->kind === 'inventory_receipt') {
            $x = $document->extra;
            $lines[] = 'Billed to: '.($x['buyer_name'] ?? '');
            $lines[] = 'Date: '.($x['date_display'] ?? '').' | Status: '.($x['payment_status'] ?? '');
            $lines[] = 'Mode: '.($x['mode_display'] ?? '').' | Txn: '.($x['txn_display'] ?? '');
            foreach ($x['line_rows'] ?? [] as $row) {
                $lines[] = ($row['name'] ?? '').' '.$row['qty'].' @ '.$row['rate'].' = '.$row['amount'];
            }
            $lines[] = 'Total: '.($x['total'] ?? '');

            return $lines;
        }

        if ($document->kind === 'student_admission_summary') {
            $app = $document->extra['app'] ?? null;
            if ($app) {
                $lines[] = 'Application: '.($app->application_id ?? '');
            }
            foreach ($document->extra['fee_rows'] ?? [] as $r) {
                $lines[] = ($r['left'] ?? '').': '.($r['right'] ?? '');
            }

            return $lines;
        }

        foreach ($document->sections as $section) {
            $type = $section['type'] ?? '';
            if ($type === 'subsection_title') {
                $lines[] = $section['title'] ?? '';
            } elseif ($type === 'meta_table') {
                foreach ($section['rows'] ?? [] as $row) {
                    $lines[] = implode(' ', array_filter($row));
                }
            } elseif ($type === 'callout') {
                $lines[] = $section['title'] ?? 'Note';
                foreach ($section['rows'] ?? [] as $r) {
                    $lines[] = ($r[0] ?? '').' '.$r[1];
                }
            } elseif ($type === 'line_items') {
                foreach ($section['rows'] ?? [] as $r) {
                    $lines[] = ($r['description'] ?? '').' '.($r['amount'] ?? '');
                }
            } elseif ($type === 'summary_float') {
                foreach ($section['rows'] ?? [] as $r) {
                    if (($r['label'] ?? '') !== '') {
                        $lines[] = ($r['label'] ?? '').' '.($r['amount'] ?? '');
                    } else {
                        $lines[] = (string) ($r['amount'] ?? '');
                    }
                }
            } elseif ($type === 'key_value_box') {
                foreach ($section['rows'] ?? [] as $r) {
                    $lines[] = ($r[0] ?? '').': '.$r[1];
                }
            } elseif ($type === 'three_col_table') {
                foreach ($section['rows'] ?? [] as $r) {
                    $c = $r['cells'] ?? [];
                    $lines[] = implode(' | ', $c);
                }
            } elseif ($type === 'amount_summary_table') {
                foreach ($section['rows'] ?? [] as $r) {
                    $v = $r['variant'] ?? 'pair';
                    if ($v === 'label_span') {
                        $lines[] = (string) ($r['text'] ?? '');
                    } elseif ($v === 'balance') {
                        $lines[] = ($r['left'] ?? '').' '.($r['right'] ?? '');
                    } else {
                        $lines[] = ($r['left'] ?? '').' '.($r['right'] ?? '');
                    }
                }
            } elseif ($type === 'footer_status_strip') {
                $lines[] = ($section['left_title'] ?? '').': '.($section['left_value'] ?? '')
                    .' | '.($section['right_title'] ?? '').': '.($section['right_value'] ?? '');
            }
        }

        return $lines;
    }

    /**
     * Short SMS-safe summary (first lines only, length-capped).
     */
    public function toShortSummary(FinancialDocument $document, int $maxLen = 300): string
    {
        $plain = implode(' ', $this->toPlainLines($document));

        return strlen($plain) <= $maxLen ? $plain : substr($plain, 0, $maxLen - 3).'...';
    }
}
