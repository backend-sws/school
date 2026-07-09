<?php

namespace App\Services\Reports;

use App\Models\InventoryItem;
use App\Models\InventoryMovement;
use Illuminate\Support\Facades\DB;

class InventoryReport extends BaseReport
{
    protected function generate(array $filters): array
    {
        $categoryId = $filters['category_id'] ?? null;

        $itemsQuery = InventoryItem::query()->with('category');
        if ($categoryId) {
            $itemsQuery->where('inventory_category_id', $categoryId);
        }

        $items = $itemsQuery->get();

        $tableItems = collect($items)->map(function ($item, $index) {
            $status = 'In Stock';
            if ($item->current_quantity <= 0) {
                $status = 'Out of Stock';
            } elseif ($item->current_quantity <= $item->min_stock) {
                $status = 'Low Stock';
            }

            return [
                'sl_no' => $index + 1,
                'name' => $item->name,
                'category' => $item->category->name ?? 'N/A',
                'quantity' => (float) $item->current_quantity,
                'min_stock' => (float) $item->min_stock,
                'valuation' => '₹' . number_format($item->current_quantity * ($item->purchase_price ?: $item->selling_price ?: 0.0), 2),
                'status' => $status,
            ];
        })->toArray();

        return [
            'summary' => [
                'total_items' => $items->count(),
                'low_stock_count' => $items->filter(function ($item) {
                    return $item->current_quantity <= $item->min_stock;
                })->count(),
                'total_valuation' => $items->sum(function ($item) {
                    return $item->current_quantity * ($item->purchase_price ?: $item->selling_price ?: 0.0);
                }),
            ],
            'daily_trend' => [], // Empty to satisfy layout structure
            'breakdown' => collect($items)->groupBy('category.name')->map(function ($group, $name) {
                return [
                    'name' => $name ?: 'Uncategorized',
                    'total' => $group->count(),
                ];
            })->values()->toArray(),
            'items' => $tableItems,
            'pagination' => [
                'current_page' => 1,
                'last_page' => 1,
                'per_page' => max(15, count($tableItems)),
                'total' => count($tableItems),
            ],
        ];
    }

    public function getHeaders(): array
    {
        return [
            ['key' => 'sl_no', 'label' => 'SL No'],
            ['key' => 'name', 'label' => 'Item Name'],
            ['key' => 'category', 'label' => 'Category'],
            ['key' => 'quantity', 'label' => 'Current Stock'],
            ['key' => 'min_stock', 'label' => 'Min Threshold'],
            ['key' => 'valuation', 'label' => 'Valuation', 'align' => 'right'],
            ['key' => 'status', 'label' => 'Status'],
        ];
    }

    public function getMetadata(): array
    {
        return [
            'title' => 'Inventory Report',
            'description' => 'Stock levels, valuation, and movement analysis.',
            'type' => 'dashboard_complex',
            'charts' => [
                'daily_trend' => 'line',
                'fee_type_breakdown' => 'pie',
            ],
        ];
    }
}
