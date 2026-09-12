<?php

namespace App\Exports;

use App\Models\GatePass;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromQuery;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;

class GatePassExport implements FromQuery, WithHeadings, WithMapping, ShouldAutoSize
{
    protected array $filters;
    private int $rowNumber = 0;

    public function __construct(array $filters = [])
    {
        $this->filters = $filters;
    }

    public function query()
    {
        $query = GatePass::query()->with([
            'staff:id,name,email',
            'studentUser:id,name',
            'securityGuard:id,name',
            'exitGuard:id,name',
        ]);

        if (!empty($this->filters['status']) && $this->filters['status'] !== 'all') {
            if ($this->filters['status'] === 'overstayed') {
                $query->overstayed();
            } else {
                $query->where('status', $this->filters['status']);
            }
        }

        if (!empty($this->filters['visitor_type']) && $this->filters['visitor_type'] !== 'all') {
            $query->where('visitor_type', $this->filters['visitor_type']);
        }

        if (!empty($this->filters['gate_name']) && $this->filters['gate_name'] !== 'all') {
            $query->where('gate_name', $this->filters['gate_name']);
        }

        if (!empty($this->filters['from_date'])) {
            $query->whereDate('check_in_at', '>=', $this->filters['from_date']);
        }

        if (!empty($this->filters['to_date'])) {
            $query->whereDate('check_in_at', '<=', $this->filters['to_date']);
        }

        if (!empty($this->filters['search'])) {
            $search = '%' . strtolower($this->filters['search']) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(visitor_name) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(phone) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(pass_number) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(purpose) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(vehicle_number) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(student_name) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(person_to_meet_custom) LIKE ?', [$search])
                    ->orWhereHas('staff', function ($sq) use ($search) {
                        $sq->whereRaw('LOWER(name) LIKE ?', [$search]);
                    });
            });
        }

        return $query->orderBy('check_in_at', 'desc')->orderBy('id', 'desc');
    }

    public function headings(): array
    {
        return [
            '#',
            'Pass Number',
            'Visitor Name',
            'Phone',
            'Visitor Type',
            'Accompanying',
            'ID Proof Type',
            'ID Proof Number',
            'Whom to Meet',
            'Department',
            'Purpose of Visit',
            'Gate Name',
            'Vehicle Type',
            'Vehicle Number',
            'Belongings',
            'Check-in Date & Time',
            'Check-out Date & Time',
            'Duration (Minutes)',
            'Status',
            'Entry Guard',
            'Exit Guard',
            'Exit Remarks',
        ];
    }

    public function map($pass): array
    {
        $this->rowNumber++;

        $whomToMeet = $pass->staff?->name
            ?? $pass->student_name
            ?? $pass->studentUser?->name
            ?? $pass->person_to_meet_custom
            ?? '—';

        return [
            $this->rowNumber,
            $pass->pass_number,
            $pass->visitor_name,
            $pass->phone,
            ucwords(str_replace('_', ' ', $pass->visitor_type)),
            $pass->accompanying_count > 0 ? "+{$pass->accompanying_count} persons" : 'Alone',
            ucwords(str_replace('_', ' ', $pass->id_proof_type)),
            $pass->id_proof_number ?? '—',
            $whomToMeet,
            $pass->department ?? '—',
            $pass->purpose,
            $pass->gate_name,
            ucwords(str_replace('_', ' ', $pass->vehicle_type ?? 'none')),
            $pass->vehicle_number ?? '—',
            $pass->belongings ?? 'None',
            $pass->check_in_at ? Carbon::parse($pass->check_in_at)->format('Y-m-d H:i:s') : '—',
            $pass->check_out_at ? Carbon::parse($pass->check_out_at)->format('Y-m-d H:i:s') : 'Still Inside',
            $pass->duration_minutes !== null ? "{$pass->duration_minutes} mins" : 'Active',
            ucwords(str_replace('_', ' ', $pass->status)),
            $pass->securityGuard?->name ?? '—',
            $pass->exitGuard?->name ?? '—',
            $pass->exit_remarks ?? '—',
        ];
    }
}
