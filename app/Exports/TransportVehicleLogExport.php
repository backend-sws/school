<?php

namespace App\Exports;

use App\Models\TransportVehicleLog;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class TransportVehicleLogExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    protected array $filters;
    private int $rowNumber = 0;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    public function query()
    {
        $query = TransportVehicleLog::query()->with([
            'transportVehicle:id,registration_number,model_name,vehicle_type',
            'transportDriver:id,name',
            'transportRoute:id,name,code',
        ]);

        if (!empty($this->filters['transport_vehicle_id']) && $this->filters['transport_vehicle_id'] !== 'all') {
            $query->where('transport_vehicle_id', $this->filters['transport_vehicle_id']);
        }

        if (!empty($this->filters['transport_driver_id']) && $this->filters['transport_driver_id'] !== 'all') {
            $query->where('transport_driver_id', $this->filters['transport_driver_id']);
        }

        if (!empty($this->filters['status']) && $this->filters['status'] !== 'all') {
            $query->where('status', $this->filters['status']);
        }

        if (!empty($this->filters['from_date'])) {
            $query->whereDate('log_date', '>=', $this->filters['from_date']);
        }

        if (!empty($this->filters['to_date'])) {
            $query->whereDate('log_date', '<=', $this->filters['to_date']);
        }

        if (!empty($this->filters['search'])) {
            $search = '%' . strtolower($this->filters['search']) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(purpose) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(notes) LIKE ?', [$search])
                    ->orWhereHas('transportVehicle', function ($vq) use ($search) {
                        $vq->whereRaw('LOWER(registration_number) LIKE ?', [$search]);
                    });
            });
        }

        return $query->orderBy('log_date', 'desc')->orderBy('id', 'desc');
    }

    public function headings(): array
    {
        return [
            'S.No.',
            'Trip Date',
            'Vehicle Reg No',
            'Vehicle Model',
            'Driver Name',
            'Assigned Route',
            'Trip Type',
            'Trip Purpose',
            'Start Odometer (KM)',
            'End Odometer (KM)',
            'Total Distance (KM)',
            'Start Time',
            'End Time',
            'Status',
            'Notes / Remarks'
        ];
    }

    public function map($row): array
    {
        $this->rowNumber++;

        return [
            $this->rowNumber,
            $row->log_date ? $row->log_date->format('Y-m-d') : '—',
            $row->transportVehicle?->registration_number ?? '—',
            $row->transportVehicle?->model_name ?? ($row->transportVehicle?->vehicle_type ?? '—'),
            $row->transportDriver?->name ?? '—',
            $row->transportRoute?->name ?? '—',
            ucfirst($row->trip_type ?? 'regular'),
            $row->purpose ?? '—',
            number_format((float) $row->start_odometer, 2),
            $row->end_odometer !== null ? number_format((float) $row->end_odometer, 2) : '—',
            number_format((float) ($row->total_km ?? 0), 2),
            $row->start_time ? substr($row->start_time, 0, 5) : '—',
            $row->end_time ? substr($row->end_time, 0, 5) : '—',
            ucfirst($row->status ?? 'completed'),
            $row->notes ?? '—',
        ];
    }
}
