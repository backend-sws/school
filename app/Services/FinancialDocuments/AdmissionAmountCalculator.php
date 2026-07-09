<?php

namespace App\Services\FinancialDocuments;

use App\Models\AdmissionApplication;
use App\Models\FeeType;

/**
 * Single source for admission-related currency rows (invoice + student summary PDFs).
 */
final class AdmissionAmountCalculator
{
    public function __construct(
        public readonly bool $isReadmission,
        public readonly string $feeLabel,
        public readonly float $feeBase,
        public readonly float $transportAmt,
        public readonly float $hostelAmt,
        public readonly float $grossBillable,
        public readonly float $discountAmt,
        public readonly float $afterDiscount,
        public readonly float $cashAmt,
        public readonly float $onlineAmt,
        public readonly float $paidTotal,
        public readonly float $dueAmt,
    ) {}

    public static function fromApplication(AdmissionApplication $app): self
    {
        $isReadmission = ($app->application_type ?? 'new') === 're-admission';
        $feeLabel = $isReadmission ? 'Re-Admission Fee' : 'Admission Application Fee';

        $feeBase = (float) ($app->amount ?? 0);
        $transportAmt = (float) ($app->transport_amount ?? 0);
        $hostelAmt = (float) ($app->hostel_amount ?? 0);
        $grossBillable = $feeBase + $transportAmt + $hostelAmt;
        $discountAmt = (float) ($app->discount_amount ?? 0);
        $afterDiscount = max(0, $grossBillable - $discountAmt);
        $cashAmt = (float) ($app->cash_amount ?? 0);
        $onlineAmt = (float) ($app->online_amount ?? 0);
        $paidTotal = $cashAmt + $onlineAmt;
        $dueAmt = (float) ($app->due_amount ?? 0);

        return new self(
            $isReadmission,
            $feeLabel,
            $feeBase,
            $transportAmt,
            $hostelAmt,
            $grossBillable,
            $discountAmt,
            $afterDiscount,
            $cashAmt,
            $onlineAmt,
            $paidTotal,
            $dueAmt,
        );
    }

    /**
     * Two-column rows for the student admission PDF fee block (amounts pre-formatted).
     *
     * @return list<array{left: string, right: string, variant?: string}>
     */
    public function studentFeeSummaryRows(AdmissionApplication $app): array
    {
        $rows = [];
        $rows[] = ['left' => 'Admission / course fee', 'right' => Money::inr($this->feeBase), 'variant' => 'bold'];
        if ($this->transportAmt > 0) {
            $rows[] = ['left' => 'Transport', 'right' => Money::inr($this->transportAmt)];
        }
        if ($this->hostelAmt > 0) {
            $rows[] = ['left' => 'Hostel', 'right' => Money::inr($this->hostelAmt)];
        }
        $rows[] = ['left' => 'Subtotal', 'right' => Money::inr($this->grossBillable), 'variant' => 'bold'];
        if ($this->discountAmt > 0) {
            $rows[] = ['left' => 'Concession / discount', 'right' => '− '.Money::inr($this->discountAmt)];
        }
        if ($this->paidTotal > 0) {
            $rows[] = ['left' => 'Amount received (cash + online)', 'right' => Money::inr($this->paidTotal), 'variant' => 'bold'];
        }
        $rows[] = ['left' => 'Balance due', 'right' => Money::inr($this->dueAmt), 'variant' => 'balance'];
        $rows[] = ['left' => 'Payment status', 'right' => strtoupper((string) ($app->payment_status ?? '—')), 'variant' => 'status'];

        return $rows;
    }

    /**
     * Rows for admission invoice "Amount summary" table partial.
     *
     * @return list<array<string, mixed>>
     */
    public function invoiceAmountSummaryRows(AdmissionApplication $app): array
    {
        $subtotal = (float) ($app->amount ?? $this->grossBillable);
        $netAfterDiscount = max(0, $subtotal - $this->discountAmt);
        $rows = [];
        foreach ($this->invoiceComponentRows($app) as $component) {
            $rows[] = [
                'variant' => 'pair',
                'left' => $component['label'],
                'right' => Money::inr($component['amount']),
            ];
        }
        $rows[] = ['variant' => 'pair', 'left' => 'Subtotal (billable)', 'right' => Money::inr($subtotal), 'left_bold' => true, 'right_bold' => true];
        if ($this->discountAmt > 0) {
            $discountLeft = 'Concession / discount';
            if ($app->discount_reason) {
                $discountLeft .= ' ('.$app->discount_reason.')';
            }
            $rows[] = ['variant' => 'pair', 'left' => $discountLeft, 'right' => '− '.Money::inr($this->discountAmt), 'right_class' => 'brand-accent-text'];
            $rows[] = ['variant' => 'pair', 'left' => 'Net after concession', 'right' => Money::inr($netAfterDiscount), 'left_bold' => true, 'right_bold' => true];
        }

        $rows[] = ['variant' => 'label_span', 'text' => 'Amount received'];
        $rows[] = ['variant' => 'pair', 'left' => 'Cash', 'right' => Money::inr($this->cashAmt)];
        $onlineLeft = 'Online';
        if ($app->online_transaction_id) {
            $onlineLeft .= ' ('.$app->online_transaction_id.')';
        }
        $rows[] = ['variant' => 'pair', 'left' => $onlineLeft, 'right' => Money::inr($this->onlineAmt)];
        $rows[] = ['variant' => 'pair', 'left' => 'Total received', 'right' => Money::inr($this->paidTotal), 'left_bold' => true, 'right_bold' => true];

        if ($this->paidTotal > $netAfterDiscount) {
            $rows[] = [
                'variant' => 'pair',
                'left' => 'Excess paid (legacy)',
                'right' => Money::inr($this->paidTotal - $netAfterDiscount),
                'right_class' => 'brand-accent-text',
            ];
        }

        $rows[] = ['variant' => 'balance', 'left' => 'Balance due', 'right' => Money::inr($this->dueAmt)];

        return $rows;
    }

    /**
     * @return list<array{label: string, amount: float}>
     */
    public function invoiceComponentRows(AdmissionApplication $app): array
    {
        $components = [];
        $breakdown = is_array($app->fee_breakdown ?? null) ? $app->fee_breakdown : [];
        $feeTypeIds = collect($breakdown)
            ->map(function ($item) {
                $rawId = $item['fee_type_id'] ?? $item['fee_particular_id'] ?? null;

                return is_numeric($rawId) ? (int) $rawId : null;
            })
            ->filter(fn ($id) => $id !== null && $id > 0)
            ->unique()
            ->values()
            ->all();
        $feeTypeNameMap = [];
        if ($feeTypeIds !== []) {
            $feeTypeNameMap = FeeType::withoutGlobalScope('institution_scope')
                ->whereIn('id', $feeTypeIds)
                ->pluck('name', 'id')
                ->map(fn ($name) => trim((string) $name))
                ->all();
        }

        foreach ($breakdown as $item) {
            $type = strtolower((string) ($item['type'] ?? 'charge'));
            if ($type === 'discount') {
                continue;
            }
            $rawFeeTypeId = $item['fee_type_id'] ?? $item['fee_particular_id'] ?? null;
            $feeTypeId = is_numeric($rawFeeTypeId) ? (int) $rawFeeTypeId : null;
            $label = trim((string) (
                $item['name']
                ?? $item['head_name']
                ?? $item['fee_name']
                ?? $item['fee_type']
                ?? $item['label']
                ?? (($feeTypeId && isset($feeTypeNameMap[$feeTypeId])) ? $feeTypeNameMap[$feeTypeId] : null)
                ?? ''
            ));
            if ($label === '') {
                $label = $this->feeLabel;
            }
            $components[] = [
                'label' => $label,
                'amount' => (float) ($item['amount'] ?? 0),
            ];
        }

        if ($components === []) {
            $components[] = ['label' => $this->feeLabel, 'amount' => $this->feeBase];
        }
        if ($this->transportAmt > 0) {
            $components[] = ['label' => 'Transport charges', 'amount' => $this->transportAmt];
        }
        if ($this->hostelAmt > 0) {
            $components[] = ['label' => 'Hostel charges', 'amount' => $this->hostelAmt];
        }

        return $components;
    }
}
