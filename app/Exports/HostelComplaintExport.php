<?php

namespace App\Exports;

use App\Models\HostelComplaint;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;

class HostelComplaintExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
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
        $query = HostelComplaint::query()
            ->with([
                'user:id,name,email',
                'room:id,room_number,hostel_id',
                'room.hostel:id,name,code'
            ])
            ->where('institution_id', $this->institutionId);

        if (!empty($this->filters['status']) && $this->filters['status'] !== 'all') {
            $query->where('status', $this->filters['status']);
        }

        if (!empty($this->filters['hostel_id']) && $this->filters['hostel_id'] !== 'all') {
            $query->whereHas('room', function ($q) {
                $q->where('hostel_id', $this->filters['hostel_id']);
            });
        }

        if (!empty($this->filters['search'])) {
            $search = '%' . strtolower($this->filters['search']) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(subject) LIKE ?', [$search])
                    ->orWhereHas('user', function ($uq) use ($search) {
                        $uq->whereRaw('LOWER(name) LIKE ?', [$search]);
                    });
            });
        }

        return $query->orderBy('created_at', 'desc');
    }

    public function headings(): array
    {
        return [
            'S.No.',
            'Subject',
            'Resident Name',
            'Email',
            'Hostel Name',
            'Room Number',
            'Date Logged',
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
            $row->subject ?? '—',
            $row->user?->name ?? '—',
            $row->user?->email ?? '—',
            $row->room?->hostel?->name ?? '—',
            $row->room?->room_number ?? '—',
            $row->created_at ? $row->created_at->format('Y-m-d H:i') : '—',
            ucfirst(str_replace('_', ' ', $row->status ?? '—')),
            $row->description ?? '—'
        ];
    }
}
