<?php

namespace App\Exports;

use App\Models\InventoryItem;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class LowStockExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    protected array $filters;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    public function query()
    {
        $query = InventoryItem::query()
            ->with('category')
            ->whereColumn('current_quantity', '<=', 'min_stock')
            ->where('is_active', true);

        // 1. Category filter
        if (!empty($this->filters['category_id']) && $this->filters['category_id'] !== 'all') {
            $query->where('inventory_category_id', $this->filters['category_id']);
        }

        // 2. General Search (Matches name or code)
        if (!empty($this->filters['search'])) {
            $search = '%' . strtolower($this->filters['search']) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(COALESCE(code, \'\')) LIKE ?', [$search]);
            });
        }

        // 3. Max Quantity filter
        if (isset($this->filters['max_quantity']) && $this->filters['max_quantity'] !== '') {
            $query->where('current_quantity', '<=', (float) $this->filters['max_quantity']);
        }

        return $query->orderBy('current_quantity', 'asc');
    }

    public function headings(): array
    {
        return [
            'S.No.',
            'Item Name',
            'Code',
            'Category',
            'Current Quantity',
            'Min Stock',
            'Deficit Qty',
            'Location',
            'Description'
        ];
    }

    private int $rowNumber = 0;

    public function map($row): array
    {
        $this->rowNumber++;

        $current = (float) ($row->current_quantity ?? 0);
        $min = (float) ($row->min_stock ?? 0);
        $deficit = max(0, $min - $current);

        return [
            $this->rowNumber,
            $row->name ?? '—',
            $row->code ?? '—',
            $row->category?->name ?? '—',
            $current,
            $min,
            $deficit,
            $row->location ?? '—',
            $row->description ?? '—'
        ];
    }
}
