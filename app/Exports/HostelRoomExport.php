<?php

namespace App\Exports;

use App\Models\HostelRoom;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class HostelRoomExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
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
        $query = HostelRoom::query()
            ->whereHas('hostel', function($q) {
                $q->where('institution_id', $this->institutionId);
            })
            ->with(['hostel:id,name', 'floor:id,name'])
            ->withCount(['beds', 'beds as occupied_beds_count' => function ($q) {
                $q->where('status', 'occupied');
            }]);

        if (!empty($this->filters['hostel_id']) && $this->filters['hostel_id'] !== 'all') {
            $query->where('hostel_id', $this->filters['hostel_id']);
        }

        if (!empty($this->filters['hostel_floor_id']) && $this->filters['hostel_floor_id'] !== 'all') {
            $query->where('hostel_floor_id', $this->filters['hostel_floor_id']);
        }

        if (!empty($this->filters['type']) && $this->filters['type'] !== 'all') {
            $query->where('type', $this->filters['type']);
        }

        if (isset($this->filters['is_active']) && $this->filters['is_active'] !== 'all') {
            $query->where('is_active', filter_var($this->filters['is_active'], FILTER_VALIDATE_BOOLEAN));
        }

        if (!empty($this->filters['availability']) && $this->filters['availability'] !== 'all') {
            if ($this->filters['availability'] === 'available') {
                $query->whereColumn(
                    \DB::raw('(SELECT COUNT(*) FROM hostel_beds WHERE hostel_beds.hostel_room_id = hostel_rooms.id AND hostel_beds.status = \'occupied\')'),
                    '<',
                    'bed_count'
                );
            } elseif ($this->filters['availability'] === 'full') {
                $query->whereColumn(
                    \DB::raw('(SELECT COUNT(*) FROM hostel_beds WHERE hostel_beds.hostel_room_id = hostel_rooms.id AND hostel_beds.status = \'occupied\')'),
                    '>=',
                    'bed_count'
                );
            }
        }

        if (!empty($this->filters['search'])) {
            $search = '%' . strtolower($this->filters['search']) . '%';
            $query->whereRaw('LOWER(room_number) LIKE ?', [$search]);
        }

        return $query->orderBy('room_number', 'asc');
    }

    public function headings(): array
    {
        return [
            'S.No.',
            'Hostel Name',
            'Floor Name',
            'Room Number',
            'Room Type',
            'Total Beds (Capacity)',
            'Occupied Beds',
            'Available Beds',
            'Monthly Rent (₹)',
            'Status'
        ];
    }

    private int $rowNumber = 0;

    public function map($row): array
    {
        $this->rowNumber++;
        $occupied = $row->occupied_beds_count ?? 0;
        $capacity = $row->bed_count ?? 0;
        $available = max(0, $capacity - $occupied);

        return [
            $this->rowNumber,
            $row->hostel?->name ?? '—',
            $row->floor?->name ?? 'No Floor',
            $row->room_number ?? '—',
            ucfirst($row->type ?? '—'),
            $capacity,
            $occupied,
            $available,
            number_format($row->monthly_fee ?? 0.00, 2),
            $row->is_active ? 'Active' : 'Inactive'
        ];
    }
}
