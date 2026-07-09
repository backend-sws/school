<?php

namespace App\Services\FinancialDocuments;

use App\Models\FeePayment;
use App\Models\User;

final class AssembleFeePaymentReceipt implements FinancialDocumentAssemblerInterface
{
    public function kind(): string
    {
        return 'fee_receipt';
    }

    public function assemble(FeePayment $payment, ?User $student): FinancialDocument
    {
        $snap = $payment->ledger_snapshot ?? [];
        $student = $student ?? $payment->user;

        $receiptNo = $payment->receipt_no ?? $payment->payment_id;
        $dateStr = $payment->payment_date ? $payment->payment_date->format('d M Y') : now()->format('d M Y');

        $metaRows = [
            ['Receipt No:', (string) $receiptNo, 'Date:', $dateStr],
            ['Student Name:', $student?->name ?? '—', 'Registration No:', $student?->studentProfile?->reg_no ?? $student?->reg_no ?? '—'],
        ];
        if ($payment->for_month) {
            $metaRows[] = ['Payment Period:', $payment->for_month, '', ''];
        }
        if (isset($snap['total_fees']) && (float) $snap['total_fees'] > 0.009) {
            $metaRows[] = ['Billable total (reference):', Money::inr((float) $snap['total_fees']), '', ''];
        }

        $sections = [
            ['type' => 'meta_table', 'rows' => $metaRows],
        ];

        $showLedger = (isset($snap['previous_dues']) && (float) $snap['previous_dues'] > 0.009)
            || isset($snap['monthly_total'])
            || isset($snap['total_payable_before']);
        if ($showLedger) {
            $ledgerRows = [];
            if (isset($snap['previous_dues']) && (float) $snap['previous_dues'] > 0) {
                $ledgerRows[] = ['Previous dues / arrears', Money::inr((float) $snap['previous_dues'])];
            }
            if (isset($snap['monthly_total'])) {
                $ledgerRows[] = ['Period fee (this cycle)', Money::inr((float) $snap['monthly_total'])];
            }
            if (isset($snap['total_payable_before'])) {
                $ledgerRows[] = ['Total payable (before this payment)', Money::inr((float) $snap['total_payable_before'])];
            }
            $sections[] = ['type' => 'callout', 'title' => 'Ledger context', 'rows' => $ledgerRows];
        }

        $feesList = isset($snap['fees']) && is_array($snap['fees']) ? $snap['fees'] : [];
        $feesLineSum = 0.0;
        foreach ($feesList as $row) {
            $feesLineSum += (float) ($row['amount'] ?? 0);
        }
        $baseAmount = (float) $payment->amount;
        $lateAmount = (float) $payment->late_fee_applied;
        $useLineSum = count($feesList) > 0 && abs($feesLineSum - $baseAmount) < 0.02;
        $subtotalBase = $useLineSum ? $feesLineSum : $baseAmount;
        $subtotalWithLate = $subtotalBase + $lateAmount;

        $lineRows = [];
        if (count($feesList) > 0) {
            foreach ($feesList as $fee) {
                $lineRows[] = [
                    'description' => (string) ($fee['name'] ?? 'Fee Component'),
                    'amount' => Money::inr((float) ($fee['amount'] ?? 0)),
                ];
            }
        } else {
            $periodNote = $payment->for_month ? " for {$payment->for_month}" : '';
            $lineRows[] = [
                'description' => 'Tuition / Monthly Fees'.$periodNote,
                'amount' => Money::inr($baseAmount),
            ];
        }
        if ($lateAmount > 0) {
            $lineRows[] = ['description' => 'Late Fee Applied', 'amount' => Money::inr($lateAmount)];
        }

        $sections[] = ['type' => 'line_items', 'rows' => $lineRows];

        $discountAmount = 0.0;
        if (($snap['discount'] ?? 0) > 0) {
            $discountAmount = (float) $snap['discount'];
        } else {
            // Fallback for advance payments (where ledger_snapshot is empty)
            $receiptNoRaw = $payment->receipt_no;
            $discountReceiptNo = '';
            if (preg_match('/^(.*?)-(\d+)$/', $receiptNoRaw, $matches)) {
                $base = $matches[1];
                $idx = $matches[2];
                $discountReceiptNo = $base . '-D' . $idx;
            } else {
                $discountReceiptNo = $receiptNoRaw . '-D';
            }
            
            $discountPayment = FeePayment::where('receipt_no', $discountReceiptNo)
                ->where('payment_mode', 'concession')
                ->where('user_id', $payment->user_id)
                ->first();
                
            if ($discountPayment) {
                $discountAmount = (float) $discountPayment->amount;
            }
        }

        $summaryRows = [
            ['label' => 'Subtotal (fees + late fee):', 'amount' => Money::inr($subtotalWithLate + $discountAmount), 'style' => 'normal'],
        ];
        if ($discountAmount > 0) {
            $summaryRows[] = [
                'label' => 'Discount / concession:',
                'amount' => '− '.Money::inr($discountAmount),
                'style' => 'discount',
            ];
        }
        $summaryRows[] = [
            'label' => 'Total paid (this receipt):',
            'amount' => Money::inr((float) $payment->total_amount),
            'style' => 'total',
        ];

        $dueAfter = isset($snap['balance_after']) ? (float) $snap['balance_after'] : (isset($snap['due']) ? (float) $snap['due'] : null);
        if ($dueAfter !== null && $dueAfter > 0.009) {
            $summaryRows[] = ['label' => 'Balance due after payment:', 'amount' => Money::inr($dueAfter), 'style' => 'balance'];
        } elseif ($dueAfter !== null && $dueAfter <= 0.009) {
            $summaryRows[] = ['label' => '', 'amount' => 'No balance remaining for this context.', 'style' => 'note'];
        }

        $sections[] = ['type' => 'summary_float', 'rows' => $summaryRows];

        $kvRows = [['Payment Mode', strtoupper((string) ($payment->payment_mode ?? ''))]];
        if (strtolower((string) $payment->payment_mode) === 'split' || ($payment->cash_amount ?? 0) > 0 || ($payment->online_amount ?? 0) > 0) {
            if (($payment->cash_amount ?? 0) > 0) {
                $kvRows[] = ['Cash', Money::inr((float) $payment->cash_amount)];
            }
            if (($payment->online_amount ?? 0) > 0) {
                $kvRows[] = ['Online', Money::inr((float) $payment->online_amount)];
            }
        }
        if ($payment->online_transaction_id) {
            $kvRows[] = ['Transaction ID', (string) $payment->online_transaction_id];
        }
        if ($payment->remarks) {
            $kvRows[] = ['Remarks', (string) $payment->remarks];
        }
        $sections[] = ['type' => 'key_value_box', 'rows' => $kvRows];

        return new FinancialDocument(
            kind: 'fee_receipt',
            documentTitle: 'Fee Payment Receipt',
            metadata: [
                'id' => $receiptNo,
                'title' => 'Fee Receipt',
            ],
            sections: $sections,
            showSignatory: true,
        );
    }
}
