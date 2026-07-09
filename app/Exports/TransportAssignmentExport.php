<?php

namespace App\Exports;

use App\Models\TransportAssignment;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class TransportAssignmentExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
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
        $query = TransportAssignment::query()
            ->with([
                'user:id,name,email',
                'user.studentProfile',
                'user.studentProfile.currentEnrollments.lmsClass:id,name,code',
                'transportRoute',
                'transportStop'
            ])
            ->where('institution_id', $this->institutionId);

        if (!empty($this->filters['route_id']) && $this->filters['route_id'] !== 'all') {
            $query->where('transport_route_id', $this->filters['route_id']);
        }

        if (!empty($this->filters['stop_id']) && $this->filters['stop_id'] !== 'all') {
            $query->where('transport_stop_id', $this->filters['stop_id']);
        }

        if (!empty($this->filters['class_id']) && $this->filters['class_id'] !== 'all') {
            $classId = $this->filters['class_id'];
            $query->whereHas('user', function ($q) use ($classId) {
                $q->whereHas('studentProfile.currentEnrollments', function ($q2) use ($classId) {
                    $q2->where('lms_class_id', $classId);
                });
            });
        }

        if (!empty($this->filters['vehicle_id']) && $this->filters['vehicle_id'] !== 'all') {
            $vehicleRouteIds = \App\Models\TransportVehicle::where('id', $this->filters['vehicle_id'])->pluck('transport_route_id');
            $query->whereIn('transport_route_id', $vehicleRouteIds);
        }

        if (!empty($this->filters['search'])) {
            $search = '%' . strtolower($this->filters['search']) . '%';
            $query->whereHas('user', function ($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', [$search]);
            });
        }

        return $query->orderBy('effective_from', 'desc');
    }

    public function headings(): array
    {
        return [
            'S.No.',
            'Student Name',
            'Admission No / Reg No',
            'Class',
            'Route Name',
            'Route Code',
            'Stop Name',
            'Monthly Fare (₹)',
            'Effective From',
            'Effective Until',
            'Remarks'
        ];
    }

    private int $rowNumber = 0;

    public function map($row): array
    {
        $this->rowNumber++;
        $studentProfile = $row->user?->studentProfile;
        $className = '—';
        $enrollments = $studentProfile?->currentEnrollments;
        if ($enrollments && $enrollments->isNotEmpty()) {
            $className = $enrollments->first()->lmsClass?->name ?? '—';
        }

        $monthlyAmount = (float) ($row->monthly_amount ?? 0);
        if ($monthlyAmount === 0.0) {
            $routeStop = \App\Models\TransportRouteStop::where('transport_route_id', $row->transport_route_id)
                ->where('transport_stop_id', $row->transport_stop_id)
                ->first();
            $monthlyAmount = $routeStop ? (float) $routeStop->fare : 0.00;
        }

        return [
            $this->rowNumber,
            $row->user?->name ?? '—',
            $studentProfile?->reg_no ?? '—',
            $className,
            $row->transportRoute?->name ?? '—',
            $row->transportRoute?->code ?? '—',
            $row->transportStop?->name ?? '—',
            number_format($monthlyAmount, 2),
            $row->effective_from,
            $row->effective_until ?? 'Active',
            $row->remarks ?? '—'
        ];
    }
}
