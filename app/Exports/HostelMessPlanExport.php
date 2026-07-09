<?php

namespace App\Exports;

use App\Models\HostelMessPlan;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class HostelMessPlanExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    protected int $institutionId;
    protected array $filters;

    public function __construct(int $institutionId, array $filters = [])
    {
        $this->institutionId = $institutionId;
        $this->filters = $filters;
    }

    public function query()
    {
        $query = HostelMessPlan::query()
            ->where('institution_id', $this->institutionId);

        if (!empty($this->filters['type']) && $this->filters['type'] !== 'all') {
            $query->where('type', $this->filters['type']);
        }

        if (isset($this->filters['is_active']) && $this->filters['is_active'] !== 'all') {
            $query->where('is_active', filter_var($this->filters['is_active'], FILTER_VALIDATE_BOOLEAN));
        }

        if (!empty($this->filters['search'])) {
            $search = '%' . strtolower($this->filters['search']) . '%';
            $query->whereRaw('LOWER(name) LIKE ?', [$search]);
        }

        return $query->orderBy('name', 'asc');
    }

    public function headings(): array
    {
        return [
            'S.No.',
            'Plan Name',
            'Meal Type',
            'Monthly Fee (₹)',
            'Status',
            'Description'
        ];
    }

    private int $rowNumber = 0;

    public function map($row): array
    {
        $this->rowNumber++;

        return [
            $this->rowNumber,
            $row->name ?? '—',
            ucfirst($row->type ?? '—'),
            number_format($row->monthly_fee ?? 0.00, 2),
            $row->is_active ? 'Active' : 'Inactive',
            $row->description ?? '—'
        ];
    }
}
