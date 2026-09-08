<?php

namespace App\Http\Controllers\Api\V1\Inventory;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\InventoryItem;
use App\Models\InventoryMovement;
use App\Support\InstitutionContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InventoryMovementController extends BaseController
{
    public const TYPES = ['issue', 'return', 'receive', 'adjust'];

    public function index(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('view_inventory_movements')) {
            return $this->forbidden('You do not have permission to view stock movements.');
        }

        $query = InventoryMovement::query()->with(['item', 'performer', 'revertedBy']);

        if ($request->filled('item_id')) {
            $query->where('inventory_item_id', $request->item_id);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('status')) {
            if ($request->status === 'reverted') {
                $query->where('is_reverted', true);
            } elseif ($request->status === 'active') {
                $query->where('is_reverted', false);
            }
        }

        return $this->paginatedWithMap(
            $query->orderBy('created_at', 'desc')->paginate($request->input('per_page', 15)),
            'passthrough'
        );
    }

    public function store(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('create_inventory_movements')) {
            return $this->forbidden('You do not have permission to create stock movements.');
        }

        $validated = $request->validate([
            'inventory_item_id' => 'required|exists:inventory_items,id',
            'type' => 'required|string|in:issue,return,receive,adjust',
            'quantity' => 'required|numeric',
            'reference_type' => 'nullable|string|max:50',
            'reference_id' => 'nullable|integer',
            'remarks' => 'nullable|string',
        ]);

        $item = InventoryItem::findOrFail($validated['inventory_item_id']);
        $qty = (float) $validated['quantity'];

        $delta = match ($validated['type']) {
            'receive', 'return' => $qty,
            'issue' => -abs($qty),
            'adjust' => $qty,
            default => 0,
        };

        $newQuantity = $item->current_quantity + $delta;
        if ($newQuantity < 0) {
            return $this->validationError(['quantity' => ['Resulting quantity cannot be negative.']]);
        }

        $institutionId = InstitutionContext::getActiveInstitutionId($request->user());
        if ($institutionId === null) {
            return $this->error('Active institution context is required.', 400);
        }

        $movement = DB::transaction(function () use ($validated, $item, $delta, $newQuantity, $institutionId) {
            $item->increment('current_quantity', $delta);

            return InventoryMovement::create([
                'institution_id' => $institutionId,
                'inventory_item_id' => $item->id,
                'type' => $validated['type'],
                'quantity' => $validated['quantity'],
                'quantity_after' => $item->fresh()->current_quantity,
                'reference_type' => $validated['reference_type'] ?? null,
                'reference_id' => $validated['reference_id'] ?? null,
                'performed_by' => auth()->id(),
                'remarks' => $validated['remarks'] ?? null,
            ]);
        });

        return $this->created($movement->load(['item', 'performer', 'revertedBy']), 'Movement recorded successfully');
    }

    public function show(Request $request, InventoryMovement $inventory_movement): JsonResponse
    {
        if (! $request->user()->hasAbility('view_inventory_movements')) {
            return $this->forbidden('You do not have permission to view stock movements.');
        }

        return $this->successWithMap($inventory_movement->load(['item', 'performer', 'revertedBy']), 'passthrough');
    }

    public function revert(Request $request, InventoryMovement $inventory_movement): JsonResponse
    {
        if (! $request->user()->hasAbility('create_inventory_movements')) {
            return $this->forbidden('You do not have permission to revert stock movements.');
        }

        if ($inventory_movement->is_reverted) {
            return $this->error('This movement has already been reverted.', 422);
        }

        $request->validate([
            'reason' => 'nullable|string|max:500',
        ]);

        $item = $inventory_movement->item;
        if (! $item) {
            return $this->error('Associated inventory item not found.', 404);
        }

        $qty = (float) $inventory_movement->quantity;

        // Determine original delta applied by this movement
        $origDelta = match ($inventory_movement->type) {
            'receive', 'return' => $qty,
            'issue' => -abs($qty),
            'adjust' => $qty,
            default => 0,
        };

        // Reversal delta is the opposite
        $reverseDelta = -$origDelta;

        $newQuantity = (float) $item->current_quantity + $reverseDelta;
        if ($newQuantity < 0) {
            return $this->error(
                "Cannot revert movement: insufficient stock in inventory. Resulting stock for '{$item->name}' would become {$newQuantity}. Current stock is {$item->current_quantity}.",
                422
            );
        }

        $reason = $request->input('reason') ? trim($request->input('reason')) : 'Reverted by user';

        DB::transaction(function () use ($inventory_movement, $item, $reverseDelta, $reason) {
            $item->increment('current_quantity', $reverseDelta);

            $inventory_movement->update([
                'is_reverted' => true,
                'reverted_at' => now(),
                'reverted_by' => auth()->id(),
                'revert_reason' => $reason,
            ]);
        });

        return $this->successWithMap(
            $inventory_movement->fresh(['item', 'performer', 'revertedBy']),
            'passthrough',
            'Stock movement reverted successfully.'
        );
    }
}
