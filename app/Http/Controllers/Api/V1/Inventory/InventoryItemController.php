<?php

namespace App\Http\Controllers\Api\V1\Inventory;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\InventoryItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InventoryItemController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        if (!$request->user()->hasAbility('view_inventory_items')) {
            return $this->forbidden('You do not have permission to view inventory items.');
        }

        $query = InventoryItem::query()->with('category');

        // Filter items available for sale (excludes non-sellable categories)
        if ($request->boolean('for_sale')) {
            $query->where('is_active', true)
                ->where(function ($q) {
                    $q->whereHas('category', function ($cq) {
                        $cq->where('is_sellable', true);
                    })->orWhereNull('inventory_category_id');
                });
        }

        // 1. Category filter
        if ($request->filled('category_id') && $request->category_id !== 'all') {
            $query->where('inventory_category_id', $request->category_id);
        }

        // 2. Active status filter
        if ($request->filled('active_status') && $request->active_status !== 'all') {
            $query->where('is_active', $request->active_status === 'active');
        }

        // 3. Location filter
        if ($request->filled('location')) {
            $query->where('location', 'like', '%' . $request->location . '%');
        }

        // 4. General Search (Matches name or code)
        if ($request->filled('search')) {
            $search = '%' . strtolower($request->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(COALESCE(code, \'\')) LIKE ?', [$search]);
            });
        }

        // Calculate dynamic stats before applying stock status filter
        $statsQuery = clone $query;
        $totalItems = $statsQuery->count();
        $totalStock = (int) $statsQuery->sum('current_quantity');
        
        $lowStockQuery = clone $query;
        $lowStockCount = $lowStockQuery->whereColumn('current_quantity', '<=', 'min_stock')->count();
        
        $outOfStockQuery = clone $query;
        $outOfStockCount = $outOfStockQuery->where('current_quantity', '=', 0)->count();

        $totalStockValue = (float) ((clone $statsQuery)->selectRaw('SUM(COALESCE(current_quantity, 0) * COALESCE(NULLIF(purchase_price, 0), selling_price, 0)) as total_value')->value('total_value') ?? 0);
        $totalRetailValue = (float) ((clone $statsQuery)->selectRaw('SUM(COALESCE(current_quantity, 0) * COALESCE(selling_price, 0)) as total_value')->value('total_value') ?? 0);

        $stats = [
            'total_items_count' => (int) $totalItems,
            'total_stock_quantity' => (int) $totalStock,
            'total_stock_value' => round($totalStockValue, 2),
            'total_retail_value' => round($totalRetailValue, 2),
            'low_stock_count' => (int) $lowStockCount,
            'out_of_stock_count' => (int) $outOfStockCount,
        ];

        // 5. Stock status filter
        if ($request->filled('stock_status') && $request->stock_status !== 'all') {
            if ($request->stock_status === 'in_stock') {
                $query->where('current_quantity', '>', 0);
            } elseif ($request->stock_status === 'out_of_stock') {
                $query->where('current_quantity', '=', 0);
            } elseif ($request->stock_status === 'low_stock') {
                $query->whereColumn('current_quantity', '<=', 'min_stock');
            }
        }

        $paginator = $query->orderBy('name', 'asc')->paginate($request->input('per_page', 15));

        return response()->json([
            'success' => true,
            'message' => 'Success',
            'data' => $paginator->items(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'stats' => $stats,
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        if (!$request->user()->hasAbility('create_inventory_items')) {
            return $this->forbidden('You do not have permission to create inventory items.');
        }

        // dd($request->all());
        $validated = $request->validate([
            'inventory_category_id' => 'required|exists:inventory_categories,id',
            'name' => 'required|string|max:200',
            'code' => 'nullable|string|max:80',
            'unit' => 'nullable|string|max:20',
            'min_stock' => 'nullable|numeric|min:0',
            'location' => 'nullable|string|max:150',
            'description' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'selling_price' => 'nullable|numeric|min:0',
            'purchase_price' => 'nullable|numeric|min:0',
            'margin_percentage' => 'nullable|numeric|min:0',
            'gst_rate' => 'nullable|numeric|min:0|max:100',
            'hsn_code' => 'nullable|string|max:20',
        ]);

        // dd($validated);

        $validated['unit'] = $validated['unit'] ?? 'piece';
        $validated['min_stock'] = $validated['min_stock'] ?? 0;
        $validated['is_active'] = $validated['is_active'] ?? true;

        $item = InventoryItem::create($validated);
        return $this->created($item->load('category'), 'Item created successfully');
    }

    public function show(Request $request, InventoryItem $inventory_item): JsonResponse
    {
        if (!$request->user()->hasAbility('view_inventory_items')) {
            return $this->forbidden('You do not have permission to view inventory items.');
        }

        return $this->successWithMap($inventory_item->load([
            'category',
            'batches' => fn($q) => $q->orderBy('received_at', 'desc')->orderBy('id', 'desc'),
            'movements' => fn($q) => $q->latest('created_at')->limit(50)->with('performer')
        ]), 'passthrough');
    }

    public function update(Request $request, InventoryItem $inventory_item): JsonResponse
    {
        if (!$request->user()->hasAbility('update_inventory_items')) {
            return $this->forbidden('You do not have permission to update inventory items.');
        }

        $validated = $request->validate([
            'inventory_category_id' => 'sometimes|exists:inventory_categories,id',
            'name' => 'sometimes|string|max:200',
            'code' => 'nullable|string|max:80',
            'unit' => 'nullable|string|max:20',
            'min_stock' => 'nullable|numeric|min:0',
            'location' => 'nullable|string|max:150',
            'description' => 'nullable|string',
            'is_active' => 'nullable|boolean',
            'selling_price' => 'nullable|numeric|min:0',
            'purchase_price' => 'nullable|numeric|min:0',
            'margin_percentage' => 'nullable|numeric|min:0',
            'gst_rate' => 'nullable|numeric|min:0|max:100',
            'hsn_code' => 'nullable|string|max:20',
        ]);

        // dd($validated);
        $inventory_item->update($validated);
        return $this->successWithMap($inventory_item->fresh('category'), 'passthrough', 'Item updated successfully');
    }

    public function destroy(Request $request, InventoryItem $inventory_item): JsonResponse
    {
        if (!$request->user()->hasAbility('delete_inventory_items')) {
            return $this->forbidden('You do not have permission to delete inventory items.');
        }

        $inventory_item->delete();
        return $this->success(null, 'Item deleted');
    }

    public function batches(Request $request, InventoryItem $inventory_item): JsonResponse
    {
        $batches = \App\Models\InventoryBatch::where('inventory_item_id', $inventory_item->id)
            ->where('remaining_quantity', '>', 0)
            ->orderBy('received_at', 'asc')
            ->orderBy('id', 'asc')
            ->get();

        return $this->success($batches, 'Success');
    }
}
