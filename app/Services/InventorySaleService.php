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
                ->where('institution_id', $institutionId)
                ->find($itemId);

            if (! $item) {
                throw ValidationException::withMessages(["lines.{$idx}" => ['Item not found or not in this institution.']]);
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

}
