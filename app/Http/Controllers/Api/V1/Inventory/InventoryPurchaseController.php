<?php

namespace App\Http\Controllers\Api\V1\Inventory;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\Expense;
use App\Models\ExpenseCategory;
use App\Models\InventoryBatch;
use App\Models\InventoryItem;
use App\Models\InventoryMovement;
use App\Models\InventoryPurchase;
use App\Models\InventoryPurchaseLine;
use App\Support\InstitutionContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InventoryPurchaseController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('view_inventory_items')) {
            return $this->forbidden('You do not have permission to view purchases.');
        }

        $query = InventoryPurchase::query()
            ->with(['purchasedBy', 'lines.item'])
            ->orderBy('purchased_at', 'desc')
            ->orderBy('id', 'desc');

        // Filter by date range
        if ($request->filled('from_date')) {
            $query->whereDate('purchased_at', '>=', $request->from_date);
        }
        if ($request->filled('to_date')) {
            $query->whereDate('purchased_at', '<=', $request->to_date);
        }

        // Filter by purchased_by (staff)
        if ($request->filled('purchased_by')) {
            $query->where('purchased_by', $request->purchased_by);
        }

        // Filter by item
        if ($request->filled('item_id')) {
            $query->whereHas('lines', fn($q) => $q->where('inventory_item_id', $request->item_id));
        }

        // Search bill_no / supplier
        if ($request->filled('search')) {
            $search = '%' . strtolower($request->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(COALESCE(bill_no, \'\')) LIKE ?', [$search])
                  ->orWhereRaw('LOWER(COALESCE(supplier_name, \'\')) LIKE ?', [$search]);
            });
        }

        // Stats before pagination
        $statsQuery = (clone $query)->reorder();
        $totalPurchases = $statsQuery->count();
        $totalCost = (float) ($statsQuery->sum('total_cost') ?? 0);

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
                ],
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('create_inventory_items')) {
            return $this->forbidden('You do not have permission to record purchases.');
        }

        $validated = $request->validate([
            'bill_no'       => 'nullable|string|max:100',
            'supplier_name' => 'nullable|string|max:200',
            'purchased_at'  => 'required|date',
            'payment_mode'  => 'nullable|string|max:50',
            'remarks'       => 'nullable|string',
            'lines'         => 'required|array|min:1',
            'lines.*.inventory_item_id' => 'required|exists:inventory_items,id',
            'lines.*.quantity'          => 'required|numeric|min:0.001',
            'lines.*.unit_cost'         => 'nullable|numeric|min:0',
        ]);

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

            // Create purchase header
            $purchase = InventoryPurchase::create([
                'institution_id' => $institutionId,
                'bill_no'        => $validated['bill_no'] ?? null,
                'supplier_name'  => $validated['supplier_name'] ?? null,
                'purchased_at'   => $validated['purchased_at'],
                'total_cost'     => $totalCost,
                'payment_mode'   => $validated['payment_mode'] ?? 'cash',
                'purchased_by'   => auth()->id(),
                'remarks'        => $validated['remarks'] ?? null,
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

            // --- Auto-create Expense entry ---
            $expenseCat = $this->getOrCreateInventoryExpenseCategory($institutionId);
            if ($expenseCat && $totalCost > 0) {
                $supplier = $validated['supplier_name'] ?? 'Market';
                $expense = Expense::create([
                    'institution_id'     => $institutionId,
                    'expense_category_id'=> $expenseCat->id,
                    'title'              => 'Inventory Purchase' . ($supplier ? " — {$supplier}" : ''),
                    'amount'             => $totalCost,
                    'date'               => $validated['purchased_at'],
                    'payment_mode'       => $validated['payment_mode'] ?? 'cash',
                    'reference_no'       => $validated['bill_no'] ?? null,
                    'payee'              => $supplier,
                    'description'        => $validated['remarks'] ?? null,
                    'status'             => 'approved',
                    'recorded_by'        => auth()->id(),
                ]);
                $purchase->update(['expense_id' => $expense->id]);
            }

            return $purchase;
        });

        return $this->created(
            $purchase->load(['purchasedBy', 'lines.item', 'expense']),
            'Purchase recorded successfully'
        );
    }

    public function show(Request $request, InventoryPurchase $inventory_purchase): JsonResponse
    {
        if (! $request->user()->hasAbility('view_inventory_items')) {
            return $this->forbidden('You do not have permission to view purchases.');
        }

        return $this->success(
            $inventory_purchase->load(['purchasedBy', 'lines.item', 'expense']),
            'Success'
        );
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
