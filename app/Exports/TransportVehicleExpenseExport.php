<?php

namespace App\Exports;

use App\Models\TransportVehicleExpense;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class TransportVehicleExpenseExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    protected array $filters;
    private int $rowNumber = 0;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    public function query()
    {
        $query = TransportVehicleExpense::query()->with([
            'transportVehicle:id,registration_number,model_name,vehicle_type',
        ]);

        if (!empty($this->filters['transport_vehicle_id']) && $this->filters['transport_vehicle_id'] !== 'all') {
            $query->where('transport_vehicle_id', $this->filters['transport_vehicle_id']);
        }

        if (!empty($this->filters['category']) && $this->filters['category'] !== 'all') {
            $query->where('category', $this->filters['category']);
        }

        if (!empty($this->filters['from_date'])) {
            $query->whereDate('expense_date', '>=', $this->filters['from_date']);
        }

        if (!empty($this->filters['to_date'])) {
            $query->whereDate('expense_date', '<=', $this->filters['to_date']);
        }

        if (!empty($this->filters['search'])) {
            $search = '%' . strtolower($this->filters['search']) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(title) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(vendor_name) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(invoice_number) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(notes) LIKE ?', [$search])
                    ->orWhereHas('transportVehicle', function ($vq) use ($search) {
                        $vq->whereRaw('LOWER(registration_number) LIKE ?', [$search]);
                    });
            });
        }

        return $query->orderBy('expense_date', 'desc')->orderBy('id', 'desc');
    }

    public function headings(): array
    {
        return [
            'S.No.',
            'Expense Date',
            'Vehicle Reg No',
            'Vehicle Model',
            'Category',
            'Work Description / Title',
            'Amount (₹)',
            'Odometer at Service (KM)',
            'Workshop / Vendor',
            'Invoice No',
            'Next Service Due Date',
            'Next Service Due KM',
            'Payment Mode',
            'Notes / Remarks'
        ];
    }

    public function map($row): array
    {
        $this->rowNumber++;

        return [
            $this->rowNumber,
            $row->expense_date ? $row->expense_date->format('Y-m-d') : '—',
            $row->transportVehicle?->registration_number ?? '—',
            $row->transportVehicle?->model_name ?? '—',
            ucfirst($row->category ?? 'maintenance'),
            $row->title ?? '—',
            number_format((float) $row->amount, 2),
            $row->odometer_reading ? number_format((float) $row->odometer_reading, 2) : '—',
            $row->vendor_name ?? '—',
            $row->invoice_number ?? '—',
            $row->next_service_date ? $row->next_service_date->format('Y-m-d') : '—',
            $row->next_service_odometer ? number_format((float) $row->next_service_odometer, 2) . ' km' : '—',
            ucfirst($row->payment_mode ?? 'cash'),
            $row->notes ?? '—',
        ];
    }
}
