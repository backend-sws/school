<?php

namespace App\Http\Controllers\Api\V1\Inventory;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\InventoryItem;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InventoryReportController extends BaseController
{
    public function lowStock(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('view_inventory_reports')) {
            return $this->forbidden('You do not have permission to view inventory reports.');
        }

        $query = InventoryItem::query()
            ->with('category')
            ->whereColumn('current_quantity', '<=', 'min_stock')
            ->where('is_active', true);

        // 1. Category filter
        if ($request->filled('category_id') && $request->category_id !== 'all') {
            $query->where('inventory_category_id', $request->category_id);
        }

        // 2. General Search (Matches name or code)
        if ($request->filled('search')) {
            $search = '%' . strtolower($request->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(COALESCE(code, \'\')) LIKE ?', [$search]);
            });
        }

        // 3. Max Quantity filter
        if ($request->filled('max_quantity')) {
            $query->where('current_quantity', '<=', (float) $request->max_quantity);
        }

        // Calculate dynamic stats before pagination
        $statsQuery = clone $query;
        $totalLowStock = $statsQuery->count();
        $outOfStock = (clone $statsQuery)->where('current_quantity', '=', 0)->count();
        $warningStock = (clone $statsQuery)->where('current_quantity', '>', 0)->count();
        $totalDeficit = (clone $statsQuery)->selectRaw('SUM(COALESCE(min_stock, 0) - COALESCE(current_quantity, 0)) as deficit')->value('deficit') ?? 0;

        $stats = [
            'total_low_stock' => (int) $totalLowStock,
            'out_of_stock' => (int) $outOfStock,
            'warning_stock' => (int) $warningStock,
            'total_deficit' => (float) $totalDeficit,
        ];

        $paginator = $query->orderBy('current_quantity', 'asc')
            ->paginate($request->input('per_page', 15));

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

    public function exportLowStock(Request $request)
    {
        if (! $request->user()->hasAbility('view_inventory_reports')) {
            return $this->forbidden('You do not have permission to view inventory reports.');
        }

        $filters = $request->only(['category_id', 'search', 'max_quantity']);
        
        return \Maatwebsite\Excel\Facades\Excel::download(
            new \App\Exports\LowStockExport($filters),
            'low_stock_report_' . now()->format('Y_m_d_His') . '.xlsx'
        );
    }
}
