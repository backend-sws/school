<?php

namespace App\Exports;

use App\Models\TransportVehicle;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class TransportVehicleExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    protected array $filters;
    private int $rowNumber = 0;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    public function query()
    {
        $query = TransportVehicle::query()->with(['transportRoute:id,name,code', 'transportDriver:id,name,mobile']);

        if (!empty($this->filters['search'])) {
            $search = '%' . strtolower($this->filters['search']) . '%';
            $query->whereRaw('LOWER(registration_number) LIKE ?', [$search]);
        }

        if (!empty($this->filters['route_id']) && $this->filters['route_id'] !== 'all') {
            $query->where('transport_route_id', $this->filters['route_id']);
        }

        if (!empty($this->filters['status']) && $this->filters['status'] !== 'all') {
            $query->where('status', $this->filters['status']);
        }

        if (!empty($this->filters['vehicle_type']) && $this->filters['vehicle_type'] !== 'all') {
            $query->where('vehicle_type', $this->filters['vehicle_type']);
        }

        return $query->orderBy('registration_number', 'asc');
    }

    public function headings(): array
    {
        return [
            'S.No.',
            'Registration Number',
            'Make / Model',
            'Vehicle Type',
            'Fuel Type',
            'Seating Capacity',
            'Current Odometer (KM)',
            'Assigned Route',
            'Assigned Driver',
            'Driver Contact',
            'Status',
            'Insurance Policy No',
            'Insurance Expiry',
            'PUC Expiry',
            'Fitness Expiry',
            'School Bus Permit Expiry',
            'Road Tax Expiry',
            'Notes'
        ];
    }

    public function map($row): array
    {
        $this->rowNumber++;

        return [
            $this->rowNumber,
            $row->registration_number,
            $row->model_name ?? '—',
            ucfirst($row->vehicle_type ?? 'bus'),
            ucfirst($row->fuel_type ?? 'diesel'),
            $row->capacity ?? '—',
            number_format((float) ($row->current_odometer ?? 0), 2),
            $row->transportRoute?->name ?? '—',
            $row->transportDriver?->name ?? '—',
            $row->transportDriver?->mobile ?? '—',
            ucfirst($row->status ?? 'active'),
            $row->insurance_policy_number ?? '—',
            $row->insurance_expiry_date ? $row->insurance_expiry_date->format('Y-m-d') : '—',
            $row->puc_expiry_date ? $row->puc_expiry_date->format('Y-m-d') : '—',
            $row->fitness_expiry_date ? $row->fitness_expiry_date->format('Y-m-d') : '—',
            $row->permit_expiry_date ? $row->permit_expiry_date->format('Y-m-d') : '—',
            $row->road_tax_expiry_date ? $row->road_tax_expiry_date->format('Y-m-d') : '—',
            $row->notes ?? '—',
        ];
    }
}
