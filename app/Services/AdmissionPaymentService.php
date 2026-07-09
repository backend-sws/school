<?php

namespace App\Services;

use App\Enums\PaymentStatus;
use App\Models\AdmissionApplication;
use App\Models\FeePayment;
use App\Models\Transaction;
use RuntimeException;

/**
 * AdmissionPaymentService — Single Source of Truth for Admission Payments
 *
 * Handles recording payments and concessions against admission applications.
 * All fee math is delegated to FeeCalculationEngine (one formula, one path).
 *
 * Responsibilities:
 *   - Accumulate payments across multiple rounds (no overwrite)
 *   - Record audit-trail transactions (payment + concession)
 *   - Dual-write to FeePayment for student ledger visibility
 *   - Determine payment status (success / partial / concession)
 */
class AdmissionPaymentService
{
    private FeeCalculationEngine $engine;

    public function __construct(FeeCalculationEngine $engine)
    {
        $this->engine = $engine;
    }

    /**
     * Record a payment (cash/online) and/or concession against an application.
     *
     * @param  AdmissionApplication  $application
     * @param  array  $data  Validated request data
     * @param  int    $recordedBy  User ID of the staff member
     * @return array{application: AdmissionApplication, due_amount: float, cumulative_paid: float}
     */
    public function recordPayment(AdmissionApplication $application, array $data, int $recordedBy): array
    {
        $newCash = (float) ($data['cash_amount'] ?? 0);
        $newOnline = (float) ($data['online_amount'] ?? 0);
        $newCollected = $newCash + $newOnline;

        // Accumulate: existing payments + this round
        $cumulativeCash = (float) ($application->cash_amount ?? 0) + $newCash;
        $cumulativeOnline = (float) ($application->online_amount ?? 0) + $newOnline;
        $cumulativePaid = $cumulativeCash + $cumulativeOnline;

        $discountAmount = (float) ($data['discount_amount'] ?? $application->discount_amount ?? 0);
        $txnId = $data['online_transaction_id'] ?? $data['transaction_id'] ?? ('TXN' . strtoupper(uniqid()));
        $netPayable = max(0, round((float) $application->amount - $discountAmount, 2));
        $remainingAllowed = max(0, round($netPayable - ((float) ($application->cash_amount ?? 0) + (float) ($application->online_amount ?? 0)), 2));

        $this->assertOverpaymentNotAllowed(
            $cumulativePaid,
            $netPayable,
            $remainingAllowed
        );

        // One formula, one path — engine is the single source of truth
        $dueAmount = $this->engine->calculateDue(
            (float) $application->amount,
            $discountAmount,
            $cumulativePaid,
        );

        // Record payment transaction + ledger entry
        if ($newCollected > 0) {
            $paymentMode = $this->resolvePaymentMode($newCash, $newOnline);

            $this->createTransaction($application, [
                'transaction_id' => $txnId,
                'type' => 'admission_payment',
                'amount' => $newCollected,
                'payment_mode' => $paymentMode,
                'meta' => [
                    'cash_amount' => $newCash ?: null,
                    'online_amount' => $newOnline ?: null,
                    'online_transaction_id' => $data['online_transaction_id'] ?? null,
                    'notes' => $data['notes'] ?? null,
                    'recorded_by' => $recordedBy,
                    'recorded_at' => now()->toDateTimeString(),
                ],
            ]);

            $this->createLedgerEntry($application, [
                'amount' => $newCollected,
                'payment_mode' => $paymentMode,
                'collected_by' => $recordedBy,
                'cash_amount' => $newCash,
                'online_amount' => $newOnline,
                'online_transaction_id' => $data['online_transaction_id'] ?? null,
                'remarks' => $data['notes'] ?? 'Admission fee payment',
                'discount' => $discountAmount,
                'due' => $dueAmount,
            ]);

            $this->processInventorySaleForAdmission($application, $newCollected, $recordedBy);
        }

        // Concession-only: record a zero-amount transaction for audit trail
        if ($newCollected <= 0 && $discountAmount > 0) {
            $this->createTransaction($application, [
                'transaction_id' => $txnId,
                'type' => 'admission_concession',
                'amount' => 0,
                'payment_mode' => 'concession',
                'meta' => [
                    'concession_amount' => $discountAmount,
                    'concession_reason' => $data['discount_reason'] ?? null,
                    'notes' => $data['notes'] ?? null,
                    'recorded_by' => $recordedBy,
                    'recorded_at' => now()->toDateTimeString(),
                ],
            ]);
        }

        // Overall payment mode across all rounds
        $overallMode = $this->resolveOverallMode($cumulativeCash, $cumulativeOnline);

        // Update application: accumulate totals, recalculate due via engine
        $application->update([
            'payment_status' => $dueAmount <= 0
                ? PaymentStatus::SUCCESS->value
                : PaymentStatus::PARTIAL->value,
            'payment_mode' => $overallMode,
            'transaction_id' => $txnId,
            'payment_date' => now(),
            'cash_amount' => $cumulativeCash ?: null,
            'online_amount' => $cumulativeOnline ?: null,
            'online_transaction_id' => $data['online_transaction_id'] ?? $application->online_transaction_id,
            'discount_amount' => $discountAmount ?: $application->discount_amount,
            'discount_reason' => $data['discount_reason'] ?? $application->discount_reason,
            'due_amount' => $dueAmount,
        ]);

        return [
            'application' => $application->fresh(),
            'due_amount' => $dueAmount,
            'cumulative_paid' => $cumulativePaid,
            'new_collected' => $newCollected,
            'txn_id' => $txnId,
        ];
    }

    /**
     * Prevent collecting more than payable amount.
     */
    private function assertOverpaymentNotAllowed(float $cumulativePaid, float $netPayable, float $remainingAllowed): void
    {
        if ($cumulativePaid > $netPayable) {
            throw new RuntimeException(sprintf(
                'Overpayment is not allowed. Remaining payable amount is %s.',
                number_format($remainingAllowed, 2, '.', '')
            ));
        }
    }

    // ── Private Helpers ──────────────────────────────────────────────

    private function resolvePaymentMode(float $cash, float $online): string
    {
        $modes = array_filter([
            $cash > 0 ? 'cash' : null,
            $online > 0 ? 'online' : null,
        ]);

        return count($modes) > 1 ? 'split' : (string) (reset($modes) ?: 'concession');
    }

    private function resolveOverallMode(float $cumulativeCash, float $cumulativeOnline): string
    {
        if ($cumulativeCash > 0 && $cumulativeOnline > 0) return 'split';
        if ($cumulativeOnline > 0) return 'online';
        if ($cumulativeCash > 0) return 'cash';
        return 'concession';
    }

    private function createTransaction(AdmissionApplication $application, array $data): Transaction
    {
        return Transaction::create([
            'user_id' => $application->user_id,
            'transaction_id' => $data['transaction_id'],
            'type' => $data['type'],
            'payable_type' => get_class($application),
            'payable_id' => $application->id,
            'amount' => $data['amount'],
            'payment_mode' => $data['payment_mode'],
            'status' => 'success',
            'meta' => $data['meta'],
        ]);
    }

    private function createLedgerEntry(AdmissionApplication $application, array $data): FeePayment
    {
        return FeePayment::create([
            'institution_id'        => $application->institution_id,
            'payment_id'            => 'PAY-ADM-' . strtoupper(uniqid()),
            'user_id'               => $application->user_id,
            'amount'                => $data['amount'],
            'total_amount'          => $data['amount'],
            'payment_mode'          => $data['payment_mode'],
            'payment_status'        => 'paid',
            'payment_date'          => now(),
            'collected_by'          => $data['collected_by'],
            'receipt_no'            => 'RCP-ADM-' . strtoupper(uniqid()),
            'cash_amount'           => $data['cash_amount'] ?: null,
            'online_amount'         => $data['online_amount'] ?: null,
            'online_transaction_id' => $data['online_transaction_id'],
            'remarks'               => $data['remarks'],
            'payable_entity_type'   => 'admission_application',
            'payable_entity_id'     => $application->id,
            'ledger_snapshot'       => [
                'discount'   => $data['discount'],
                'due'        => $data['due'],
                'total_fees' => $application->amount,
            ],
        ]);
     }

    /**
     * Process stock deduction and inventory sale records if the admission payment is successful/paid.
     */
    public function processInventorySaleForAdmission(AdmissionApplication $application, float $amountPaid, int $collectedBy): void
    {
        if ($amountPaid <= 0) {
            return;
        }

        $feeBreakdown = $application->fee_breakdown ?? [];
        if (empty($feeBreakdown)) {
            return;
        }

        $inventoryItems = array_filter($feeBreakdown, function ($item) {
            return isset($item['category']) && $item['category'] === 'inventory' && isset($item['inventory_item_id']);
        });

        if (empty($inventoryItems)) {
            return;
        }

        // Check if an InventorySale has already been recorded for this admission application
        $alreadyExists = \App\Models\InventorySale::where('buyer_type', 'student')
            ->where('user_id', $application->user_id)
            ->where('remarks', 'like', 'Admission application sale%')
            ->exists();

        if ($alreadyExists) {
            return;
        }

        // Prepare lines
        $lines = [];
        foreach ($inventoryItems as $item) {
            $lines[] = [
                'inventory_item_id' => (int) $item['inventory_item_id'],
                'quantity' => (int) ($item['quantity'] ?? 1),
                'unit_price' => (float) ($item['unit_price'] ?? $item['amount'] ?? 0),
            ];
        }

        try {
            $saleService = app(\App\Services\InventorySaleService::class);
            $sale = $saleService->createSale(
                $lines,
                'student',
                $application->user_id,
                $application->applicant_name,
                'Admission application sale (App #' . $application->id . ')',
                $application->institution_id,
                $collectedBy
            );

            if ($sale && $sale->feePayment) {
                $sale->feePayment->update([
                    'payment_status' => 'paid',
                    'collected_by' => $collectedBy,
                ]);
                $saleService->confirmPayment($sale->feePayment);
            }
        } catch (\Exception $e) {
            \Log::error('Failed to create inventory sale for admission application #' . $application->id . ': ' . $e->getMessage());
        }
    }
}
