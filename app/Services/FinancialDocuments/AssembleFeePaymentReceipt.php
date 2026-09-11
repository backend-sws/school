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

        $studentClass = $student?->studentProfile?->academicClass?->name ?? $student?->studentProfile?->class ?? null;
        $studentSection = $student?->studentProfile?->section?->name ?? $student?->studentProfile?->section ?? null;
        $classSec = trim(($studentClass ?? '') . ($studentSection ? ' - ' . $studentSection : ''));

        $metaRows = [
            ['Student Name:', $student?->name ?? '—', 'Registration No:', $student?->studentProfile?->reg_no ?? $student?->reg_no ?? '—'],
            ['Class / Section:', $classSec ?: '—', 'Payment Period:', $payment->for_month ?: '—'],
        ];

        $sections = [
            ['type' => 'meta_table', 'rows' => $metaRows],
        ];

        $previousDues = isset($snap['previous_dues']) ? (float) $snap['previous_dues'] : 0.0;
        $feesList = isset($snap['fees']) && is_array($snap['fees']) ? $snap['fees'] : [];
        $feesLineSum = 0.0;
        foreach ($feesList as $row) {
            $feesLineSum += (float) ($row['amount'] ?? 0);
        }
        $baseAmount = (float) $payment->amount;
        $lateAmount = (float) $payment->late_fee_applied;

        $lineRows = [];

        // 1. Previous dues / arrears if any
        if ($previousDues > 0.009) {
            $lineRows[] = [
                'description' => 'Previous Dues / Arrears',
                'amount' => Money::inr($previousDues),
            ];
        }

        // 2. Current period fee components
        if (count($feesList) > 0) {
            foreach ($feesList as $fee) {
                $lineRows[] = [
                    'description' => (string) ($fee['name'] ?? 'Fee Component'),
                    'amount' => Money::inr((float) ($fee['amount'] ?? 0)),
                ];
            }
        } else {
            $periodNote = $payment->for_month ? " ({$payment->for_month})" : '';
            $lineRows[] = [
                'description' => 'Tuition / Period Fees' . $periodNote,
                'amount' => Money::inr($baseAmount),
            ];
        }

        // 3. Late fee if any
        if ($lateAmount > 0.009) {
            $lineRows[] = [
                'description' => 'Late Fee Applied',
                'amount' => Money::inr($lateAmount),
            ];
        }

        $sections[] = ['type' => 'line_items', 'rows' => $lineRows];

        $discountAmount = 0.0;
        if (($snap['discount'] ?? 0) > 0) {
            $discountAmount = (float) $snap['discount'];
        } else {
            // Fallback for advance/concession payments
            $receiptNoRaw = (string) $payment->receipt_no;
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

        $currentCycleFees = count($feesList) > 0 ? $feesLineSum : $baseAmount;
        $totalBilled = $previousDues + $currentCycleFees + $lateAmount;
        if (isset($snap['total_payable_before']) && (float) $snap['total_payable_before'] > $totalBilled) {
            $totalBilled = (float) $snap['total_payable_before'];
        }

        $summaryRows = [
            ['label' => 'Total Amount Due:', 'amount' => Money::inr($totalBilled), 'style' => 'normal'],
        ];

        if ($discountAmount > 0.009) {
            $summaryRows[] = [
                'label' => 'Discount / Concession:',
                'amount' => '− ' . Money::inr($discountAmount),
                'style' => 'discount',
            ];

            $netPayable = max(0, round($totalBilled - $discountAmount, 2));
            $summaryRows[] = [
                'label' => 'Net Amount Payable:',
                'amount' => Money::inr($netPayable),
                'style' => 'normal',
            ];
        }

        $summaryRows[] = [
            'label' => 'Total Paid (This Receipt):',
            'amount' => Money::inr((float) $payment->total_amount),
            'style' => 'total',
        ];

        $balanceRemaining = max(0, round($totalBilled - $discountAmount - (float) $payment->total_amount, 2));

        if ($balanceRemaining > 0.009) {
            $summaryRows[] = ['label' => 'Remaining Balance Due:', 'amount' => Money::inr($balanceRemaining), 'style' => 'balance'];
        } else {
            $summaryRows[] = ['label' => 'Balance Due:', 'amount' => '₹0.00 (Fully Paid)', 'style' => 'balance'];
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
