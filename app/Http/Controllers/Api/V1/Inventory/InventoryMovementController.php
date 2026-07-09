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

        $query = InventoryMovement::query()->with(['item', 'performer']);

        if ($request->filled('item_id')) {
            $query->where('inventory_item_id', $request->item_id);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
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

        return $this->created($movement->load(['item', 'performer']), 'Movement recorded successfully');
    }

    public function show(Request $request, InventoryMovement $inventory_movement): JsonResponse
    {
        if (! $request->user()->hasAbility('view_inventory_movements')) {
            return $this->forbidden('You do not have permission to view stock movements.');
        }

        return $this->successWithMap($inventory_movement->load(['item', 'performer']), 'passthrough');
    }
}
