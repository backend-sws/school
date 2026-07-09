<?php

namespace App\Services\FinancialDocuments;

/**
 * Point-in-time ledger snapshot from a FeeCollectionService matrix row.
 */
final class LedgerSnapshotFactory
{
    /**
     * @param  array<string, mixed>  $row
     * @return array<string, mixed>
     */
    public function fromMatrixRow(array $row, float $totalPaidThisReceipt): array
    {
        $particulars = $row['expected_particulars'] ?? [];
        $fees = [];
        foreach ($particulars as $p) {
            if (($p['type'] ?? 'charge') === 'discount') {
                continue;
            }
            $fees[] = [
                'name' => $p['name'] ?? 'Fee',
                'amount' => (float) ($p['amount'] ?? 0),
            ];
        }

        $balanceBefore = (float) ($row['balance'] ?? 0);

        return [
            'fees' => $fees,
            'previous_dues' => (float) ($row['previous_dues'] ?? 0),
            'monthly_total' => (float) ($row['monthly_total'] ?? 0),
            'late_fee_snapshot' => (float) ($row['late_fee'] ?? 0),
            'discount' => (float) ($row['discount'] ?? 0),
            'total_payable_before' => (float) ($row['total_payable'] ?? 0),
            'total_fees' => (float) ($row['gross_amount'] ?? 0),
            'paid_amount_in_ledger' => (float) ($row['paid_amount'] ?? 0),
            'balance_after' => max(0, round($balanceBefore - $totalPaidThisReceipt, 2)),
        ];
    }
}
