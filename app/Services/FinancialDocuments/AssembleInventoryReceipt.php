<?php

namespace App\Services\FinancialDocuments;

use App\Models\InventorySale;

final class AssembleInventoryReceipt implements FinancialDocumentAssemblerInterface
{
    public function kind(): string
    {
        return 'inventory_receipt';
    }

    public function assemble(InventorySale $sale, string $buyerName): FinancialDocument
    {
        $sale->loadMissing(['lines.item', 'feePayment', 'collectedBy']);
        $payment = $sale->feePayment;

        $lineRows = [];
        foreach ($sale->lines as $line) {
            $name = $line->item ? $line->item->name : 'Item #'.$line->inventory_item_id;
            $code = $line->item && $line->item->code ? (string) $line->item->code : null;
            $unit = ($line->item && $line->item->unit) ? (string) $line->item->unit : 'pcs';
            $qtyDisplay = rtrim(rtrim(number_format((float) $line->quantity, 3), '0'), '.').' '.$unit;

            $lineRows[] = [
                'name' => $name,
                'code' => $code,
                'rate' => Money::inr((float) $line->unit_price),
                'qty' => $qtyDisplay,
                'amount' => Money::inr((float) $line->amount),
            ];
        }

        $dateDisplay = $payment && $payment->payment_date
            ? $payment->payment_date->format('d M Y')
            : $sale->created_at->format('d M Y');

        $txn = $payment ? ($payment->online_transaction_id ?? $payment->transaction_id) : null;

        $extra = [
            'buyer_name' => $buyerName,
            'buyer_type' => strtoupper((string) $sale->buyer_type),
            'collector_name' => $sale->collectedBy ? $sale->collectedBy->name : 'System',
            'date_display' => $dateDisplay,
            'payment_status' => $sale->payment_status === 'paid' ? 'PAID' : 'UNPAID',
            'status_paid' => $sale->payment_status === 'paid',
            'mode_display' => $payment ? strtoupper((string) $payment->payment_mode) : 'N/A',
            'txn_display' => $txn ? (string) $txn : 'N/A',
            'line_rows' => $lineRows,
            'remarks' => $sale->remarks,
            'subtotal' => Money::inr((float) $sale->total_amount),
            'total' => Money::inr((float) $sale->total_amount),
            'amount_paid' => $payment ? Money::inr((float) ($payment->total_amount ?? $sale->total_amount)) : null,
        ];

        return new FinancialDocument(
            kind: 'inventory_receipt',
            documentTitle: 'Inventory Sale Receipt',
            metadata: [
                'id' => $payment?->receipt_no ?? $sale->id,
                'title' => 'Sale Receipt',
            ],
            sections: [],
            showSignatory: false,
            extra: $extra,
        );
    }
}
