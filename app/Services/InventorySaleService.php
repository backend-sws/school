<?php

namespace App\Services;

use App\Models\FeePayment;
use App\Models\InventoryItem;
use App\Models\InventoryMovement;
use App\Models\InventorySale;
use App\Models\InventorySaleLine;
use App\Models\User;
use App\Services\FeeCalculationEngine;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class InventorySaleService
{
    protected FeeCalculationEngine $engine;

    public function __construct(FeeCalculationEngine $engine)
    {
        $this->engine = $engine;
    }

    public const WALK_IN_EMAIL_PREFIX = 'walkin-';

    public const WALK_IN_EMAIL_SUFFIX = '@inventory.internal';

    /**
     * Create a sale: validate lines, create InventorySale + lines + FeePayment. Returns sale with lines and feePayment.
     *
     * @param  array<int, array{inventory_item_id: int, quantity: float|int, unit_price: float|int}>  $lines
     * @throws ValidationException
     */
    public function createSale(
        array $lines,
        string $buyerType,
        ?int $userId,
        ?string $buyerName,
        ?string $remarks,
        int $institutionId,
        ?int $collectedBy = null
    ): InventorySale {
        if (! in_array($buyerType, InventorySale::BUYER_TYPES, true)) {
            throw ValidationException::withMessages(['buyer_type' => ['Invalid buyer type.']]);
        }

        if (in_array($buyerType, ['student', 'parent'], true) && empty($userId)) {
            throw ValidationException::withMessages(['user_id' => ['User is required for student or parent buyer.']]);
        }

        $resolvedUserId = $userId;
        $resolvedBuyerName = $buyerName;

        if ($buyerType === 'other') {
            $walkIn = $this->resolveWalkInUser($institutionId);
            $resolvedUserId = $walkIn->id;
            $resolvedBuyerName = $buyerName ?: 'Walk-in';
        } elseif ($userId) {
            $u = User::find($userId);
            if (! $u) {
                throw ValidationException::withMessages(['user_id' => ['Selected user not found.']]);
            }
            $resolvedBuyerName = $buyerName ?: $u->name;
        }

            $totalAmount = 0;
            $validatedLines = [];

        foreach ($lines as $idx => $line) {
            $itemId = (int) ($line['inventory_item_id'] ?? 0);
            $quantity = (float) ($line['quantity'] ?? 0);
            $unitPrice = (float) ($line['unit_price'] ?? 0);

            if ($itemId <= 0 || $quantity <= 0) {
                throw ValidationException::withMessages(["lines.{$idx}" => ['Invalid line: item and quantity required.']]);
            }

            $item = InventoryItem::withoutGlobalScopes()
                ->with('category')
                ->where('institution_id', $institutionId)
                ->find($itemId);

            if (! $item) {
                throw ValidationException::withMessages(["lines.{$idx}" => ['Item not found or not in this institution.']]);
            }

            if ($item->category && $item->category->is_sellable === false) {
                throw ValidationException::withMessages([
                    "lines.{$idx}" => ["Item '{$item->name}' belongs to category '{$item->category->name}' which is marked for internal use only and cannot be sold."],
                ]);
            }

            if ($item->current_quantity < $quantity) {
                throw ValidationException::withMessages([
                    "lines.{$idx}" => ["Insufficient stock for {$item->name}. Available: {$item->current_quantity}."],
                ]);
            }

            $validatedLines[] = [
                'item' => $item,
                'name' => $item->name,
                'quantity' => $quantity,
                'unit_price' => $unitPrice,
            ];
        }

        $calculation = $this->engine->calculateInventorySaleFee($validatedLines);
        $totalAmount = $calculation['net'];

        if ($totalAmount <= 0) {
            throw ValidationException::withMessages(['lines' => ['At least one line with positive amount is required.']]);
        }

        return DB::transaction(function () use (
            $institutionId,
            $resolvedUserId,
            $buyerType,
            $resolvedBuyerName,
            $totalAmount,
            $remarks,
            $validatedLines,
            $calculation,
            $collectedBy
        ) {
            $sale = InventorySale::create([
                'institution_id' => $institutionId,
                'fee_payment_id' => null,
                'user_id' => $resolvedUserId,
                'buyer_type' => $buyerType,
                'buyer_name' => $resolvedBuyerName,
                'total_amount' => $totalAmount,
                'payment_status' => 'pending',
                'collected_by' => $collectedBy,
                'remarks' => $remarks,
            ]);

            foreach ($calculation['items'] as $idx => $calcItem) {
                InventorySaleLine::create([
                    'inventory_sale_id' => $sale->id,
                    'inventory_item_id' => $validatedLines[$idx]['item']->id,
                    'quantity'          => $calcItem['quantity'],
                    'unit_price'        => $calcItem['unit_price'],
                    'amount'            => $calcItem['amount'],
                ]);
            }

            $paymentId = 'PAY' . date('Ymd') . str_pad((int) FeePayment::withoutGlobalScopes()->count() + 1, 6, '0', STR_PAD_LEFT);

            $feePayment = FeePayment::create([
                'institution_id' => $institutionId,
                'payment_id' => $paymentId,
                'user_id' => $resolvedUserId,
                'fee_head_id' => null,
                'amount' => $totalAmount,
                'late_fee_applied' => 0,
                'total_amount' => $totalAmount,
                'payment_status' => 'pending',
            ]);

            $sale->update(['fee_payment_id' => $feePayment->id]);

            return $sale->load(['lines.item', 'feePayment', 'user']);
        });
    }

    /**
     * When payment is confirmed (paid), create issue movements and reduce stock. Idempotent.
     */
    public function confirmPayment(FeePayment $payment): ?InventorySale
    {
        if ($payment->payment_status !== 'paid') {
            return null;
        }

        $sale = InventorySale::withoutGlobalScopes()
            ->where('fee_payment_id', $payment->id)
            ->with('lines.item')
            ->first();

        if (! $sale) {
            return null;
        }

        $alreadyReduced = InventoryMovement::withoutGlobalScopes()
            ->where('reference_type', 'inventory_sale')
            ->where('reference_id', $sale->id)
            ->exists();

        if ($alreadyReduced) {
            $sale->update([
                'payment_status' => 'paid',
                'collected_by' => $sale->collected_by ?? $payment->collected_by,
            ]);

            return $sale->fresh(['lines.item', 'feePayment', 'user']);
        }

        $institutionId = (int) $sale->institution_id;
        $performedBy = $payment->collected_by ?? auth()->id();

        DB::transaction(function () use ($sale, $institutionId, $performedBy) {
            foreach ($sale->lines as $line) {
                $item = $line->item;
                $qty = (float) $line->quantity;
                $delta = -abs($qty);

                $item->increment('current_quantity', $delta);

                InventoryMovement::create([
                    'institution_id' => $institutionId,
                    'inventory_item_id' => $item->id,
                    'type' => 'issue',
                    'quantity' => $line->quantity,
                    'quantity_after' => $item->fresh()->current_quantity,
                    'reference_type' => 'inventory_sale',
                    'reference_id' => $sale->id,
                    'performed_by' => $performedBy,
                    'remarks' => 'Sale #' . $sale->id,
                ]);
            }

            $sale->update([
                'payment_status' => 'paid',
                'collected_by' => $sale->collected_by ?? $performedBy,
            ]);
        });

        return $sale->fresh(['lines.item', 'feePayment', 'user']);
    }

    protected function resolveWalkInUser(int $institutionId): User
    {
        $email = self::WALK_IN_EMAIL_PREFIX . $institutionId . self::WALK_IN_EMAIL_SUFFIX;
        $user = User::where('email', $email)->first();

        if ($user) {
            return $user;
        }

        return User::create([
            'email' => $email,
            'name' => 'Walk-in Buyer',
            'institution_id' => $institutionId,
            'password' => \Illuminate\Support\Facades\Hash::make(\Illuminate\Support\Str::random(32)),
        ]);
    }

    /**
     * Update a pending sale.
     *
     * @param  array<int, array{inventory_item_id: int, quantity: float|int, unit_price: float|int}>  $lines
     * @throws ValidationException
     */
    public function updateSale(
        InventorySale $sale,
        array $lines,
        string $buyerType,
        ?int $userId,
        ?string $buyerName,
        ?string $remarks,
        int $institutionId,
        ?int $updatedBy = null
    ): InventorySale {
        if ((int) $sale->institution_id !== $institutionId) {
            throw ValidationException::withMessages(['sale' => ['Sale does not belong to this institution.']]);
        }

        if ($sale->payment_status !== 'pending') {
            throw ValidationException::withMessages([
                'sale' => ['Only pending sales can be edited. For paid sales, please use the Sales Return feature.'],
            ]);
        }

        if (! in_array($buyerType, InventorySale::BUYER_TYPES, true)) {
            throw ValidationException::withMessages(['buyer_type' => ['Invalid buyer type.']]);
        }

        if (in_array($buyerType, ['student', 'parent'], true) && empty($userId)) {
            throw ValidationException::withMessages(['user_id' => ['User is required for student or parent buyer.']]);
        }

        $resolvedUserId = $userId;
        $resolvedBuyerName = $buyerName;

        if ($buyerType === 'other') {
            $walkIn = $this->resolveWalkInUser($institutionId);
            $resolvedUserId = $walkIn->id;
            $resolvedBuyerName = $buyerName ?: 'Walk-in';
        } elseif ($userId) {
            $u = User::find($userId);
            if (! $u) {
                throw ValidationException::withMessages(['user_id' => ['Selected user not found.']]);
            }
            $resolvedBuyerName = $buyerName ?: $u->name;
        }

        $validatedLines = [];

        foreach ($lines as $idx => $line) {
            $itemId = (int) ($line['inventory_item_id'] ?? 0);
            $quantity = (float) ($line['quantity'] ?? 0);
            $unitPrice = (float) ($line['unit_price'] ?? 0);

            if ($itemId <= 0 || $quantity <= 0) {
                throw ValidationException::withMessages(["lines.{$idx}" => ['Invalid line: item and quantity required.']]);
            }

            $item = InventoryItem::withoutGlobalScopes()
                ->with('category')
                ->where('institution_id', $institutionId)
                ->find($itemId);

            if (! $item) {
                throw ValidationException::withMessages(["lines.{$idx}" => ['Item not found or not in this institution.']]);
            }

            if ($item->category && $item->category->is_sellable === false) {
                throw ValidationException::withMessages([
                    "lines.{$idx}" => ["Item '{$item->name}' belongs to category '{$item->category->name}' which is marked for internal use only and cannot be sold."],
                ]);
            }

            if ($item->current_quantity < $quantity) {
                throw ValidationException::withMessages([
                    "lines.{$idx}" => ["Insufficient stock for {$item->name}. Available: {$item->current_quantity}."],
                ]);
            }

            $validatedLines[] = [
                'item' => $item,
                'name' => $item->name,
                'quantity' => $quantity,
                'unit_price' => $unitPrice,
            ];
        }

        $calculation = $this->engine->calculateInventorySaleFee($validatedLines);
        $totalAmount = $calculation['net'];

        if ($totalAmount <= 0) {
            throw ValidationException::withMessages(['lines' => ['At least one line with positive amount is required.']]);
        }

        return DB::transaction(function () use (
            $sale,
            $resolvedUserId,
            $buyerType,
            $resolvedBuyerName,
            $totalAmount,
            $remarks,
            $validatedLines,
            $calculation
        ) {
            $sale->update([
                'user_id' => $resolvedUserId,
                'buyer_type' => $buyerType,
                'buyer_name' => $resolvedBuyerName,
                'total_amount' => $totalAmount,
                'remarks' => $remarks,
            ]);

            // Replace line items
            $sale->lines()->delete();

            foreach ($calculation['items'] as $idx => $calcItem) {
                InventorySaleLine::create([
                    'inventory_sale_id' => $sale->id,
                    'inventory_item_id' => $validatedLines[$idx]['item']->id,
                    'quantity'          => $calcItem['quantity'],
                    'unit_price'        => $calcItem['unit_price'],
                    'amount'            => $calcItem['amount'],
                    'returned_quantity' => 0,
                ]);
            }

            // Synchronize linked FeePayment
            if ($sale->fee_payment_id) {
                $feePayment = FeePayment::withoutGlobalScopes()->find($sale->fee_payment_id);
                if ($feePayment && $feePayment->payment_status === 'pending') {
                    $feePayment->update([
                        'user_id' => $resolvedUserId,
                        'amount' => $totalAmount,
                        'total_amount' => $totalAmount,
                    ]);
                }
            }

            return $sale->fresh(['lines.item', 'feePayment', 'user']);
        });
    }

    /**
     * Record a return of items from a completed (paid / partially_returned) sale.
     *
     * @param  array<int, array{inventory_sale_line_id: int, quantity: float|int}>  $returnLines
     * @throws ValidationException
     */
    public function recordReturn(
        InventorySale $sale,
        array $returnLines,
        ?string $reason,
        ?string $refundMode,
        int $institutionId,
        int $performedBy
    ): InventorySale {
        if ((int) $sale->institution_id !== $institutionId) {
            throw ValidationException::withMessages(['sale' => ['Sale does not belong to this institution.']]);
        }

        if (! in_array($sale->payment_status, ['paid', 'partially_returned'], true)) {
            throw ValidationException::withMessages([
                'sale' => ['Returns can only be processed for paid or partially returned sales.'],
            ]);
        }

        if (empty($returnLines)) {
            throw ValidationException::withMessages(['lines' => ['At least one item must be returned.']]);
        }

        $sale->load(['lines.item']);
        $existingLines = $sale->lines->keyBy('id');

        $validatedReturns = [];
        $totalRefundAmount = 0;

        foreach ($returnLines as $idx => $retLine) {
            $lineId = (int) ($retLine['inventory_sale_line_id'] ?? 0);
            $qty = (float) ($retLine['quantity'] ?? 0);

            if ($qty <= 0) {
                continue;
            }

            if (! $existingLines->has($lineId)) {
                throw ValidationException::withMessages(["lines.{$idx}" => ['Invalid sale line item ID.']]);
            }

            $line = $existingLines->get($lineId);
            $remainingReturnable = (float) $line->quantity - (float) $line->returned_quantity;

            if ($qty > $remainingReturnable) {
                $itemName = $line->item ? $line->item->name : "Item #{$line->inventory_item_id}";
                throw ValidationException::withMessages([
                    "lines.{$idx}" => ["Cannot return {$qty} units of '{$itemName}'. Only {$remainingReturnable} unit(s) returnable."],
                ]);
            }

            $lineRefund = round($qty * (float) $line->unit_price, 2);
            $totalRefundAmount += $lineRefund;

            $validatedReturns[] = [
                'line' => $line,
                'quantity' => $qty,
                'refund' => $lineRefund,
            ];
        }

        if (empty($validatedReturns)) {
            throw ValidationException::withMessages(['lines' => ['No valid return quantities provided.']]);
        }

        return DB::transaction(function () use (
            $sale,
            $validatedReturns,
            $totalRefundAmount,
            $reason,
            $refundMode,
            $institutionId,
            $performedBy
        ) {
            foreach ($validatedReturns as $itemReturn) {
                $line = $itemReturn['line'];
                $qty = $itemReturn['quantity'];
                $item = InventoryItem::withoutGlobalScopes()->lockForUpdate()->find($line->inventory_item_id);

                if ($item) {
                    $item->increment('current_quantity', $qty);
                    $newStock = (float) $item->fresh()->current_quantity;

                    $movementRemarks = "Sales Return #{$sale->id} (" . ($refundMode ? "Refund: {$refundMode}" : "Returned") . ")";
                    if ($reason) {
                        $movementRemarks .= " - Reason: {$reason}";
                    }

                    InventoryMovement::create([
                        'institution_id'    => $institutionId,
                        'inventory_item_id' => $item->id,
                        'type'              => 'return',
                        'quantity'          => $qty,
                        'quantity_after'    => $newStock,
                        'reference_type'    => 'inventory_sale',
                        'reference_id'      => $sale->id,
                        'performed_by'      => $performedBy,
                        'remarks'           => $movementRemarks,
                    ]);
                }

                $line->increment('returned_quantity', $qty);
            }

            $newRefundedAmount = round((float) $sale->refunded_amount + $totalRefundAmount, 2);

            // Re-fetch all lines to check if whole sale is fully returned
            $allLines = $sale->lines()->get();
            $allReturned = $allLines->every(function ($l) {
                return (float) $l->returned_quantity >= (float) $l->quantity;
            });

            $newStatus = $allReturned ? 'returned' : 'partially_returned';

            $saleRemarks = $sale->remarks ? $sale->remarks . "\n" : "";
            $saleRemarks .= "[" . now()->format('Y-m-d H:i') . "] Returned ₹{$totalRefundAmount} via " . ($refundMode ?: 'cash');
            if ($reason) {
                $saleRemarks .= " (Reason: {$reason})";
            }

            $sale->update([
                'payment_status' => $newStatus,
                'refunded_amount' => $newRefundedAmount,
                'remarks' => $saleRemarks,
            ]);

            return $sale->fresh(['lines.item', 'feePayment', 'user', 'collectedBy']);
        });
    }
}
