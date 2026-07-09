<?php

namespace App\Exports;

use App\Models\HostelAllocation;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class HostelAllocationExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
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
        $query = HostelAllocation::query()
            ->with([
                'user:id,name,email',
                'user.studentProfile',
                'user.studentProfile.currentEnrollments.lmsClass:id,name,code',
                'room:id,room_number,hostel_id,type,monthly_fee',
                'room.hostel:id,name,code',
                'bed:id,bed_label'
            ])
            ->where('institution_id', $this->institutionId);

        if (!empty($this->filters['hostel_id']) && $this->filters['hostel_id'] !== 'all') {
            $query->whereHas('room', function ($q) {
                $q->where('hostel_id', $this->filters['hostel_id']);
            });
        }

        if (!empty($this->filters['status']) && $this->filters['status'] !== 'all') {
            $query->where('status', $this->filters['status']);
        }

        if (!empty($this->filters['search'])) {
            $search = '%' . strtolower($this->filters['search']) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereHas('user', function ($q2) use ($search) {
                    $q2->whereRaw('LOWER(name) LIKE ?', [$search])
                        ->orWhereRaw('LOWER(email) LIKE ?', [$search]);
                })->orWhereHas('room', function ($q3) use ($search) {
                    $q3->whereRaw('LOWER(room_number) LIKE ?', [$search]);
                });
            });
        }

        return $query->orderBy('created_at', 'desc');
    }

    public function headings(): array
    {
        return [
            'S.No.',
            'Resident Name',
            'Email',
            'Class',
            'Hostel Name',
            'Room Number',
            'Bed Label',
            'Monthly Rent (₹)',
            'Check-in Date',
            'Check-out Date',
            'Status',
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

        return [
            $this->rowNumber,
            $row->user?->name ?? '—',
            $row->user?->email ?? '—',
            $className,
            $row->room?->hostel?->name ?? '—',
            $row->room?->room_number ?? '—',
            $row->bed?->bed_label ?? '—',
            number_format($row->monthly_amount ?? $row->room?->monthly_fee ?? 0.00, 2),
            $row->check_in_date,
            $row->check_out_date ?? '—',
            ucfirst($row->status ?? '—'),
            $row->remarks ?? '—'
        ];
    }
}
