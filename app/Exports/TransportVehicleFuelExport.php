<?php

namespace App\Exports;

use App\Models\TransportVehicleFuel;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class TransportVehicleFuelExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    protected array $filters;
    private int $rowNumber = 0;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    public function query()
    {
        $query = TransportVehicleFuel::query()->with([
            'transportVehicle:id,registration_number,model_name,fuel_type',
            'transportDriver:id,name',
        ]);

        if (!empty($this->filters['transport_vehicle_id']) && $this->filters['transport_vehicle_id'] !== 'all') {
            $query->where('transport_vehicle_id', $this->filters['transport_vehicle_id']);
        }

        if (!empty($this->filters['fuel_type']) && $this->filters['fuel_type'] !== 'all') {
            $query->where('fuel_type', $this->filters['fuel_type']);
        }

        if (!empty($this->filters['from_date'])) {
            $query->whereDate('fuel_date', '>=', $this->filters['from_date']);
        }

        if (!empty($this->filters['to_date'])) {
            $query->whereDate('fuel_date', '<=', $this->filters['to_date']);
        }

        if (!empty($this->filters['search'])) {
            $search = '%' . strtolower($this->filters['search']) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(vendor_name) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(invoice_number) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(notes) LIKE ?', [$search])
                    ->orWhereHas('transportVehicle', function ($vq) use ($search) {
                        $vq->whereRaw('LOWER(registration_number) LIKE ?', [$search]);
                    });
            });
        }

        return $query->orderBy('fuel_date', 'desc')->orderBy('id', 'desc');
    }

    public function headings(): array
    {
        return [
            'S.No.',
            'Refill Date',
            'Time',
            'Vehicle Reg No',
            'Vehicle Model',
            'Driver Name',
            'Fuel Type',
            'Odometer Reading (KM)',
            'Quantity Filled (Liters)',
            'Price / Liter (₹)',
            'Total Amount (₹)',
            'Full Tank?',
            'Calculated Mileage (km/L)',
            'Petrol Pump / Vendor',
            'Invoice / Slip No',
            'Payment Mode',
            'Notes / Remarks'
        ];
    }

    public function map($row): array
    {
        $this->rowNumber++;

        return [
            $this->rowNumber,
            $row->fuel_date ? $row->fuel_date->format('Y-m-d') : '—',
            $row->fuel_time ? substr($row->fuel_time, 0, 5) : '—',
            $row->transportVehicle?->registration_number ?? '—',
            $row->transportVehicle?->model_name ?? '—',
            $row->transportDriver?->name ?? '—',
            ucfirst($row->fuel_type ?? 'diesel'),
            number_format((float) $row->odometer_reading, 2),
            number_format((float) $row->liters, 2),
            number_format((float) $row->rate_per_liter, 2),
            number_format((float) $row->total_amount, 2),
            $row->is_full_tank ? 'Yes' : 'No',
            $row->calculated_mileage ? number_format((float) $row->calculated_mileage, 2) . ' km/L' : '—',
            $row->vendor_name ?? '—',
            $row->invoice_number ?? '—',
            ucfirst($row->payment_mode ?? 'cash'),
            $row->notes ?? '—',
        ];
    }
}
