<?php

namespace App\Http\Controllers\Api\V1\Inventory;

use App\Exports\InventoryPurchaseExport;
use App\Http\Controllers\Api\V1\BaseController;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use App\Models\InventoryBatch;
use App\Models\InventoryItem;
use App\Models\InventoryMovement;
use App\Models\InventoryPurchase;
use App\Models\InventoryPurchaseLine;
use App\Models\InventoryVendor;
use App\Support\InstitutionContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Facades\Excel;

class InventoryPurchaseController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('view_inventory_items')) {
            return $this->forbidden('You do not have permission to view purchases.');
        }

        $query = InventoryPurchase::query()
            ->with(['purchasedBy', 'revertedBy:id,name', 'lines.item', 'vendor:id,name,city,contact_name,contact_phone', 'settlement'])
            ->orderBy('purchased_at', 'desc')
            ->orderBy('id', 'desc');

        // Filter by date range
        if ($request->filled('from_date')) {
            $query->whereDate('purchased_at', '>=', $request->from_date);
        }
        if ($request->filled('to_date')) {
            $query->whereDate('purchased_at', '<=', $request->to_date);
        }

        // Filter by vendor
        if ($request->filled('inventory_vendor_id') && $request->inventory_vendor_id !== 'all') {
            $query->where('inventory_vendor_id', $request->inventory_vendor_id);
        }

        // Filter by payment_status
        if ($request->filled('payment_status') && $request->payment_status !== 'all') {
            $query->where('payment_status', $request->payment_status);
        }

        // Filter by purchased_by (staff)
        if ($request->filled('purchased_by')) {
            $query->where('purchased_by', $request->purchased_by);
        }

        // Filter by item
        if ($request->filled('item_id')) {
            $query->whereHas('lines', fn($q) => $q->where('inventory_item_id', $request->item_id));
        }

        // Search bill_no / supplier / vendor
        if ($request->filled('search')) {
            $search = '%' . strtolower($request->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(COALESCE(bill_no, \'\')) LIKE ?', [$search])
                  ->orWhereRaw('LOWER(COALESCE(supplier_name, \'\')) LIKE ?', [$search])
                  ->orWhereHas('vendor', function ($vq) use ($search) {
                      $vq->whereRaw('LOWER(name) LIKE ?', [$search]);
                  });
            });
        }

        // Stats before pagination
        $statsQuery = (clone $query)->reorder();
        $totalPurchases = $statsQuery->count();
        $totalCost = (float) ((clone $statsQuery)->where('payment_status', '!=', 'reverted')->sum('total_cost') ?? 0);
        $totalCredit = (float) ((clone $statsQuery)->where('payment_status', 'credit')->sum('total_cost') ?? 0);
        $totalSettled = (float) ((clone $statsQuery)->where('payment_status', 'settled')->sum('total_cost') ?? 0);
        $totalReverted = (float) ((clone $statsQuery)->where('payment_status', 'reverted')->sum('total_cost') ?? 0);

        $paginator = $query->paginate($request->input('per_page', 15));

        return response()->json([
            'success' => true,
            'message' => 'Success',
            'data' => $paginator->items(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'stats' => [
                    'total_purchases' => $totalPurchases,
                    'total_cost' => round($totalCost, 2),
                    'total_credit' => round($totalCredit, 2),
                    'total_settled' => round($totalSettled, 2),
                    'total_reverted' => round($totalReverted, 2),
                ],
            ],
        ]);
    }

    public function export(Request $request)
    {
        if (! $request->user()->hasAbility('view_inventory_items')) {
            return $this->forbidden('You do not have permission to export purchases.');
        }

        $filename = 'inventory_purchases_' . now()->format('Ymd_His') . '.xlsx';
        return Excel::download(new InventoryPurchaseExport($request->all()), $filename);
    }

    public function store(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('create_inventory_items')) {
            return $this->forbidden('You do not have permission to record purchases.');
        }

        $validated = $request->validate([
            'bill_no'             => 'nullable|string|max:100',
            'supplier_name'       => 'nullable|string|max:200',
            'inventory_vendor_id' => 'nullable|exists:inventory_vendors,id',
            'purchased_at'        => 'required|date',
            'payment_mode'        => 'nullable|string|max:50',
            'payment_status'      => 'nullable|string|in:paid,credit',
            'remarks'             => 'nullable|string',
            'lines'               => 'required|array|min:1',
            'lines.*.inventory_item_id' => 'required|exists:inventory_items,id',
            'lines.*.quantity'          => 'required|numeric|min:0.001',
            'lines.*.unit_cost'         => 'nullable|numeric|min:0',
        ]);

        if (!empty($validated['inventory_vendor_id']) && empty($validated['supplier_name'])) {
            $vendor = InventoryVendor::find($validated['inventory_vendor_id']);
            if ($vendor) {
                $validated['supplier_name'] = $vendor->name;
            }
        }

        $institutionId = InstitutionContext::getActiveInstitutionId($request->user());
        if ($institutionId === null) {
            return $this->error('Active institution context is required.', 400);
        }

        $purchase = DB::transaction(function () use ($validated, $institutionId, $request) {
            $totalCost = 0;
            $linesData = [];

            // Load all items upfront
            $itemIds = collect($validated['lines'])->pluck('inventory_item_id')->unique()->toArray();
            $items = InventoryItem::whereIn('id', $itemIds)->lockForUpdate()->get()->keyBy('id');

            foreach ($validated['lines'] as $line) {
                $item = $items->get($line['inventory_item_id']);
                $qty = (float) $line['quantity'];
                $unitCost = (float) ($line['unit_cost'] ?? 0);
                $amount = round($qty * $unitCost, 2);
                $totalCost += $amount;

                // Increase stock (receive movement)
                $item->increment('current_quantity', $qty);
                $newQty = (float) $item->fresh()->current_quantity;

                $movement = InventoryMovement::create([
                    'institution_id'    => $institutionId,
                    'inventory_item_id' => $item->id,
                    'type'              => 'receive',
                    'quantity'          => $qty,
                    'quantity_after'    => $newQty,
                    'reference_type'    => 'purchase',
                    'performed_by'      => auth()->id(),
                    'remarks'           => $validated['remarks'] ?? null,
                ]);

                $linesData[] = [
                    'inventory_item_id' => $item->id,
                    'quantity'          => $qty,
                    'unit_cost'         => $unitCost,
                    'amount'            => $amount,
                    'movement_id'       => $movement->id,
                ];
            }

            $paymentStatus = $validated['payment_status'] ?? 'paid';
            $paymentMode = $paymentStatus === 'credit' ? 'credit' : ($validated['payment_mode'] ?? 'cash');

            // Create purchase header
            $purchase = InventoryPurchase::create([
                'institution_id'      => $institutionId,
                'bill_no'             => $validated['bill_no'] ?? null,
                'supplier_name'       => $validated['supplier_name'] ?? null,
                'inventory_vendor_id' => $validated['inventory_vendor_id'] ?? null,
                'purchased_at'        => $validated['purchased_at'],
                'total_cost'          => $totalCost,
                'payment_mode'        => $paymentMode,
                'payment_status'      => $paymentStatus,
                'purchased_by'        => auth()->id(),
                'remarks'             => $validated['remarks'] ?? null,
            ]);

            // Create lines and FIFO batches
            foreach ($linesData as $lineData) {
                $lineData['inventory_purchase_id'] = $purchase->id;
                $createdLine = InventoryPurchaseLine::create($lineData);

                // Create FIFO Batch
                InventoryBatch::create([
                    'institution_id'    => $institutionId,
                    'inventory_item_id' => $createdLine->inventory_item_id,
                    'batch_no'          => $validated['bill_no'] ? ($validated['bill_no'] . '-L' . $createdLine->id) : ('BATCH-' . date('Ymd', strtotime($validated['purchased_at'])) . '-' . $createdLine->id),
                    'purchase_line_id'  => $createdLine->id,
                    'received_quantity' => $createdLine->quantity,
                    'remaining_quantity'=> $createdLine->quantity,
                    'unit_cost'         => $createdLine->unit_cost,
                    'received_at'       => $validated['purchased_at'],
                    'supplier_name'     => $validated['supplier_name'] ?? null,
                    'status'            => 'active',
                ]);

                // Update item's reference purchase_price if available
                if ($createdLine->unit_cost > 0) {
                    InventoryItem::where('id', $createdLine->inventory_item_id)->update([
                        'purchase_price' => $createdLine->unit_cost,
                    ]);
                }
            }

            // Update movement reference_id to purchase id
            InventoryMovement::whereIn('id', collect($linesData)->pluck('movement_id')->filter()->toArray())
                ->update(['reference_id' => $purchase->id]);

            // --- Auto-create Expense entry only for spot-paid purchases ---
            // Credit purchases will log their cash/bank outflow expense upon settlement!
            if ($paymentStatus !== 'credit') {
                $expenseCat = $this->getOrCreateInventoryExpenseCategory($institutionId);
                if ($expenseCat && $totalCost > 0) {
                    $supplier = $validated['supplier_name'] ?? 'Market';
                    $expense = Expense::create([
                        'institution_id'     => $institutionId,
                        'expense_category_id'=> $expenseCat->id,
                        'title'              => 'Inventory Purchase' . ($supplier ? " — {$supplier}" : ''),
                        'amount'             => $totalCost,
                        'date'               => $validated['purchased_at'],
                        'payment_mode'       => $paymentMode,
                        'reference_no'       => $validated['bill_no'] ?? null,
                        'payee'              => $supplier,
                        'description'        => $validated['remarks'] ?? null,
                        'status'             => 'approved',
                        'recorded_by'        => auth()->id(),
                    ]);
                    $purchase->update(['expense_id' => $expense->id]);
                }
            }

            return $purchase;
        });

        return $this->created(
            $purchase->load(['purchasedBy', 'lines.item', 'expense', 'vendor', 'settlement']),
            'Purchase recorded successfully'
        );
    }

    public function show(Request $request, InventoryPurchase $inventory_purchase): JsonResponse
    {
        if (! $request->user()->hasAbility('view_inventory_items')) {
            return $this->forbidden('You do not have permission to view purchases.');
        }

        return $this->success(
            $inventory_purchase->load(['purchasedBy', 'revertedBy:id,name', 'lines.item', 'expense', 'vendor', 'settlement']),
            'Success'
        );
    }

    public function update(Request $request, InventoryPurchase $inventory_purchase): JsonResponse
    {
        if (! $request->user()->hasAbility('update_inventory_items') && ! $request->user()->hasAbility('create_inventory_items')) {
            return $this->forbidden('You do not have permission to update purchases.');
        }

        if ($inventory_purchase->payment_status === 'reverted') {
            return $this->error('Cannot edit a purchase that has been reverted.', 422);
        }

        $validated = $request->validate([
            'bill_no'       => 'nullable|string|max:100',
            'supplier_name' => 'nullable|string|max:200',
            'purchased_at'  => 'required|date',
            'payment_mode'  => 'nullable|string|max:50',
            'remarks'       => 'nullable|string',
            'lines'         => 'required|array|min:1',
            'lines.*.id'    => 'nullable|integer',
            'lines.*.inventory_item_id' => 'required|exists:inventory_items,id',
            'lines.*.quantity'          => 'required|numeric|min:0.001',
            'lines.*.unit_cost'         => 'nullable|numeric|min:0',
        ]);

        $institutionId = InstitutionContext::getActiveInstitutionId($request->user());
        if ($institutionId === null) {
            return $this->error('Active institution context is required.', 400);
        }

        try {
            $purchase = DB::transaction(function () use ($inventory_purchase, $validated, $institutionId) {
                $inventory_purchase->load(['lines']);
                $existingLines = $inventory_purchase->lines->keyBy('id');

                $inputLines = $validated['lines'];
                $retainedLineIds = collect($inputLines)->pluck('id')->filter()->map(fn($id) => (int) $id)->all();
                $removedLines = $existingLines->filter(fn($l) => !in_array($l->id, $retainedLineIds));

                $allItemIds = collect($inputLines)->pluck('inventory_item_id')
                    ->merge($existingLines->pluck('inventory_item_id'))
                    ->unique()->values()->all();

                $items = InventoryItem::whereIn('id', $allItemIds)->lockForUpdate()->get()->keyBy('id');

                // Check removed lines
                foreach ($removedLines as $removedLine) {
                    $batch = InventoryBatch::where('purchase_line_id', $removedLine->id)->first();
                    if ($batch) {
                        $consumed = (float) $batch->received_quantity - (float) $batch->remaining_quantity;
                        if ($consumed > 0) {
                            $item = $items->get($removedLine->inventory_item_id);
                            $itemName = $item ? $item->name : "Item #{$removedLine->inventory_item_id}";
                            throw new \InvalidArgumentException("Cannot remove '{$itemName}' because {$consumed} unit(s) have already been issued/consumed from this purchase batch.");
                        }

                        $item = $items->get($removedLine->inventory_item_id);
                        if ($item) {
                            $item->decrement('current_quantity', (float) $removedLine->quantity);
                        }
                        $batch->delete();
                    }

                    if ($removedLine->movement_id) {
                        InventoryMovement::where('id', $removedLine->movement_id)->delete();
                    }

                    $removedLine->delete();
                }

                $totalCost = 0;
                $supplier = $validated['supplier_name'] ?? null;
                $billNo = $validated['bill_no'] ?? null;
                $purchasedAt = $validated['purchased_at'];

                foreach ($inputLines as $inputLine) {
                    $lineId = isset($inputLine['id']) ? (int) $inputLine['id'] : null;
                    $newItemId = (int) $inputLine['inventory_item_id'];
                    $newQty = (float) $inputLine['quantity'];
                    $newUnitCost = (float) ($inputLine['unit_cost'] ?? 0);
                    $amount = round($newQty * $newUnitCost, 2);
                    $totalCost += $amount;

                    $item = $items->get($newItemId);

                    if ($lineId && $existingLines->has($lineId)) {
                        $existingLine = $existingLines->get($lineId);
                        $oldItemId = (int) $existingLine->inventory_item_id;
                        $oldQty = (float) $existingLine->quantity;
                        $batch = InventoryBatch::where('purchase_line_id', $existingLine->id)->first();

                        if ($oldItemId !== $newItemId) {
                            // Item changed
                            if ($batch) {
                                $consumed = (float) $batch->received_quantity - (float) $batch->remaining_quantity;
                                if ($consumed > 0) {
                                    $oldItem = $items->get($oldItemId);
                                    $oldItemName = $oldItem ? $oldItem->name : "Item #{$oldItemId}";
                                    throw new \InvalidArgumentException("Cannot change item '{$oldItemName}' because {$consumed} unit(s) have already been issued/consumed.");
                                }
                                $batch->delete();
                            }

                            $oldItem = $items->get($oldItemId);
                            if ($oldItem) {
                                $oldItem->decrement('current_quantity', $oldQty);
                            }

                            $item->increment('current_quantity', $newQty);

                            if ($existingLine->movement_id) {
                                InventoryMovement::where('id', $existingLine->movement_id)->update([
                                    'inventory_item_id' => $newItemId,
                                    'quantity' => $newQty,
                                    'quantity_after' => (float) $item->fresh()->current_quantity,
                                    'remarks' => $validated['remarks'] ?? null,
                                ]);
                            }

                            InventoryBatch::create([
                                'institution_id'    => $institutionId,
                                'inventory_item_id' => $newItemId,
                                'batch_no'          => $billNo ? ($billNo . '-L' . $existingLine->id) : ('BATCH-' . date('Ymd', strtotime($purchasedAt)) . '-' . $existingLine->id),
                                'purchase_line_id'  => $existingLine->id,
                                'received_quantity' => $newQty,
                                'remaining_quantity'=> $newQty,
                                'unit_cost'         => $newUnitCost,
                                'received_at'       => $purchasedAt,
                                'supplier_name'     => $supplier,
                                'status'            => 'active',
                            ]);

                            $existingLine->update([
                                'inventory_item_id' => $newItemId,
                                'quantity' => $newQty,
                                'unit_cost' => $newUnitCost,
                                'amount' => $amount,
                            ]);
                        } else {
                            $diff = $newQty - $oldQty;

                            if ($batch) {
                                $consumed = (float) $batch->received_quantity - (float) $batch->remaining_quantity;
                                if ($newQty < $consumed) {
                                    $itemName = $item ? $item->name : "Item #{$newItemId}";
                                    throw new \InvalidArgumentException("Quantity for '{$itemName}' cannot be reduced below {$consumed} as {$consumed} unit(s) have already been issued/consumed.");
                                }

                                $batch->received_quantity = $newQty;
                                $batch->remaining_quantity = (float) $batch->remaining_quantity + $diff;
                                $batch->unit_cost = $newUnitCost;
                                $batch->received_at = $purchasedAt;
                                $batch->supplier_name = $supplier;
                                if ($billNo && empty($batch->batch_no)) {
                                    $batch->batch_no = $billNo . '-L' . $existingLine->id;
                                }
                                $batch->save();
                            } else {
                                InventoryBatch::create([
                                    'institution_id'    => $institutionId,
                                    'inventory_item_id' => $newItemId,
                                    'batch_no'          => $billNo ? ($billNo . '-L' . $existingLine->id) : ('BATCH-' . date('Ymd', strtotime($purchasedAt)) . '-' . $existingLine->id),
                                    'purchase_line_id'  => $existingLine->id,
                                    'received_quantity' => $newQty,
                                    'remaining_quantity'=> $newQty,
                                    'unit_cost'         => $newUnitCost,
                                    'received_at'       => $purchasedAt,
                                    'supplier_name'     => $supplier,
                                    'status'            => 'active',
                                ]);
                            }

                            if ($diff != 0) {
                                if ($diff > 0) {
                                    $item->increment('current_quantity', $diff);
                                } else {
                                    $item->decrement('current_quantity', abs($diff));
                                }
                            }

                            if ($existingLine->movement_id) {
                                InventoryMovement::where('id', $existingLine->movement_id)->update([
                                    'quantity' => $newQty,
                                    'quantity_after' => (float) $item->fresh()->current_quantity,
                                    'remarks' => $validated['remarks'] ?? null,
                                ]);
                            }

                            $existingLine->update([
                                'quantity' => $newQty,
                                'unit_cost' => $newUnitCost,
                                'amount' => $amount,
                            ]);
                        }

                        if ($newUnitCost > 0) {
                            InventoryItem::where('id', $newItemId)->update(['purchase_price' => $newUnitCost]);
                        }
                    } else {
                        // New line added in edit
                        $item->increment('current_quantity', $newQty);
                        $newStock = (float) $item->fresh()->current_quantity;

                        $movement = InventoryMovement::create([
                            'institution_id'    => $institutionId,
                            'inventory_item_id' => $newItemId,
                            'type'              => 'receive',
                            'quantity'          => $newQty,
                            'quantity_after'    => $newStock,
                            'reference_type'    => 'purchase',
                            'reference_id'      => $inventory_purchase->id,
                            'performed_by'      => auth()->id(),
                            'remarks'           => $validated['remarks'] ?? null,
                        ]);

                        $createdLine = InventoryPurchaseLine::create([
                            'inventory_purchase_id' => $inventory_purchase->id,
                            'inventory_item_id' => $newItemId,
                            'quantity' => $newQty,
                            'unit_cost' => $newUnitCost,
                            'amount' => $amount,
                            'movement_id' => $movement->id,
                        ]);

                        InventoryBatch::create([
                            'institution_id'    => $institutionId,
                            'inventory_item_id' => $newItemId,
                            'batch_no'          => $billNo ? ($billNo . '-L' . $createdLine->id) : ('BATCH-' . date('Ymd', strtotime($purchasedAt)) . '-' . $createdLine->id),
                            'purchase_line_id'  => $createdLine->id,
                            'received_quantity' => $newQty,
                            'remaining_quantity'=> $newQty,
                            'unit_cost'         => $newUnitCost,
                            'received_at'       => $purchasedAt,
                            'supplier_name'     => $supplier,
                            'status'            => 'active',
                        ]);

                        if ($newUnitCost > 0) {
                            InventoryItem::where('id', $newItemId)->update(['purchase_price' => $newUnitCost]);
                        }
                    }
                }

                // Update purchase header
                $inventory_purchase->update([
                    'bill_no' => $billNo,
                    'supplier_name' => $supplier,
                    'purchased_at' => $purchasedAt,
                    'total_cost' => $totalCost,
                    'payment_mode' => $validated['payment_mode'] ?? 'cash',
                    'remarks' => $validated['remarks'] ?? null,
                ]);

                // Sync or create Expense entry
                if ($inventory_purchase->expense_id) {
                    $expense = Expense::find($inventory_purchase->expense_id);
                    if ($expense) {
                        $expense->update([
                            'title' => 'Inventory Purchase' . ($supplier ? " — {$supplier}" : ''),
                            'amount' => $totalCost,
                            'date' => $purchasedAt,
                            'payment_mode' => $validated['payment_mode'] ?? 'cash',
                            'reference_no' => $billNo,
                            'payee' => $supplier ?? 'Market',
                            'description' => $validated['remarks'] ?? null,
                        ]);
                    }
                } elseif ($totalCost > 0) {
                    $expenseCat = $this->getOrCreateInventoryExpenseCategory($institutionId);
                    if ($expenseCat) {
                        $expense = Expense::create([
                            'institution_id'     => $institutionId,
                            'expense_category_id'=> $expenseCat->id,
                            'title'              => 'Inventory Purchase' . ($supplier ? " — {$supplier}" : ''),
                            'amount'             => $totalCost,
                            'date'               => $purchasedAt,
                            'payment_mode'       => $validated['payment_mode'] ?? 'cash',
                            'reference_no'       => $billNo,
                            'payee'              => $supplier ?? 'Market',
                            'description'        => $validated['remarks'] ?? null,
                            'status'             => 'approved',
                            'recorded_by'        => auth()->id(),
                        ]);
                        $inventory_purchase->update(['expense_id' => $expense->id]);
                    }
                }

                return $inventory_purchase;
            });

            return $this->success(
                $purchase->load(['purchasedBy', 'lines.item', 'expense']),
                'Purchase updated successfully'
            );
        } catch (\InvalidArgumentException $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    /**
     * Revert an inventory purchase with a mandatory reason.
     * Subtracts stock, marks batches depleted, cancels expense, and logs inventory return movement.
     */
    public function revert(Request $request, InventoryPurchase $inventory_purchase): JsonResponse
    {
        if (! $request->user()->hasAbility('delete_inventory_items') && ! $request->user()->hasAbility('update_inventory_items')) {
            return $this->forbidden('You do not have permission to revert purchases.');
        }

        $validated = $request->validate([
            'reason' => 'required|string|min:3|max:500',
        ]);

        $institutionId = InstitutionContext::getActiveInstitutionId($request->user());
        if ($institutionId === null) {
            return $this->error('Active institution context is required.', 400);
        }

        if ($inventory_purchase->institution_id !== $institutionId) {
            return $this->forbidden('This purchase does not belong to the active institution.');
        }

        if ($inventory_purchase->payment_status === 'reverted') {
            return $this->error('This purchase has already been reverted.', 422);
        }

        if ($inventory_purchase->payment_status === 'settled') {
            return $this->error('Cannot revert a settled purchase. Please reverse the vendor settlement payment first.', 422);
        }

        try {
            $purchase = DB::transaction(function () use ($inventory_purchase, $validated, $institutionId) {
                $inventory_purchase->load(['lines.item']);

                $itemIds = $inventory_purchase->lines->pluck('inventory_item_id')->unique()->values()->all();
                $items = InventoryItem::whereIn('id', $itemIds)->lockForUpdate()->get()->keyBy('id');

                // 1. Validate that no items from this purchase have been consumed/issued
                foreach ($inventory_purchase->lines as $line) {
                    $batch = InventoryBatch::where('purchase_line_id', $line->id)->first();
                    $item = $items->get($line->inventory_item_id);
                    $itemName = $item ? $item->name : "Item #{$line->inventory_item_id}";

                    if ($batch) {
                        $consumed = (float) $batch->received_quantity - (float) $batch->remaining_quantity;
                        if ($consumed > 0.0001) {
                            throw new \InvalidArgumentException("Cannot revert because {$consumed} unit(s) of '{$itemName}' have already been issued or consumed from this purchase.");
                        }
                    }

                    if ($item && (float) $item->current_quantity < (float) $line->quantity) {
                        throw new \InvalidArgumentException("Cannot revert because available stock for '{$itemName}' ({$item->current_quantity}) is less than the purchased quantity ({$line->quantity}).");
                    }
                }

                // 2. Process stock reversal, movements, and batches
                foreach ($inventory_purchase->lines as $line) {
                    $item = $items->get($line->inventory_item_id);
                    $qty = (float) $line->quantity;

                    if ($item) {
                        $item->decrement('current_quantity', $qty);
                        $newQty = (float) $item->fresh()->current_quantity;

                        // Create return/reversal movement
                        InventoryMovement::create([
                            'institution_id'    => $institutionId,
                            'inventory_item_id' => $item->id,
                            'type'              => 'return',
                            'quantity'          => $qty,
                            'quantity_after'    => $newQty,
                            'reference_type'    => 'purchase_revert',
                            'reference_id'      => $inventory_purchase->id,
                            'performed_by'      => auth()->id(),
                            'remarks'           => 'Purchase Revert: ' . $validated['reason'],
                        ]);
                    }

                    // Deplete batch so it is never consumed
                    $batch = InventoryBatch::where('purchase_line_id', $line->id)->first();
                    if ($batch) {
                        $batch->update([
                            'status'             => 'depleted',
                            'remaining_quantity' => 0,
                        ]);
                    }
                }

                // 3. Void/Reject associated expense if one was created
                if ($inventory_purchase->expense_id) {
                    $expense = Expense::find($inventory_purchase->expense_id);
                    if ($expense) {
                        $expense->update([
                            'status'           => 'rejected',
                            'rejection_reason' => 'Purchase reverted: ' . $validated['reason'],
                        ]);
                    }
                }

                // 4. Mark purchase header as reverted
                $inventory_purchase->update([
                    'payment_status' => 'reverted',
                    'reverted_at'    => now(),
                    'reverted_by'    => auth()->id(),
                    'revert_reason'  => $validated['reason'],
                ]);

                return $inventory_purchase;
            });

            return $this->success(
                $purchase->load(['purchasedBy', 'revertedBy:id,name', 'lines.item', 'expense', 'vendor', 'settlement']),
                'Purchase reverted successfully and stock has been restored.'
            );
        } catch (\InvalidArgumentException $e) {
            return $this->error($e->getMessage(), 422);
        } catch (\Throwable $e) {
            return $this->error('Failed to revert purchase: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Get or create a dedicated expense category for inventory purchases
     */
    private function getOrCreateInventoryExpenseCategory(int $institutionId): ?ExpenseCategory
    {
        return ExpenseCategory::firstOrCreate(
            [
                'institution_id' => $institutionId,
                'code' => 'INVENTORY_PURCHASE',
            ],
            [
                'name' => 'Inventory Purchases',
                'description' => 'Auto-created for inventory purchase expenses',
                'is_active' => true,
            ]
        );
    }
}
