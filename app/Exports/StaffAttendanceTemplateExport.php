<?php

namespace App\Exports;

use App\Models\User;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class StaffAttendanceTemplateExport implements FromArray, WithStyles, ShouldAutoSize, WithTitle
{
    protected int $institutionId;
    protected ?string $defaultDate;

    public function __construct(int $institutionId, ?string $defaultDate = null)
    {
        $this->institutionId = $institutionId;
        $this->defaultDate = $defaultDate ?: Carbon::today()->toDateString();
    }

    public function title(): string
    {
        return 'Attendance Template';
    }

    public function array(): array
    {
        $staff = User::whereHas('staffProfile', function ($q) {
            $q->where('institution_id', $this->institutionId);
        })->with('staffProfile')->get();

        $rows = [
            // Row 1: Headers
            [
                'employee_id',
                'name',
                'email',
                'date',
                'status',
                'leave_type',
                'remarks'
            ],
        ];

        // Populate with current active staff as helper rows
        foreach ($staff as $user) {
            $rows[] = [
                $user->staffProfile?->employee_id ?? '',
                $user->name,
                $user->email,
                $this->defaultDate,
                'present', // default
                '',
                '',
            ];
        }

        // If no staff, provide a sample row
        if ($staff->isEmpty()) {
            $rows[] = [
                'EMP001',
                'John Doe',
                'john@school.edu',
                Carbon::today()->toDateString(),
                'present',
                '',
                'Sample record',
            ];
        }

        return $rows;
    }

    public function styles(Worksheet $sheet)
    {
        // Header Row Style
        $sheet->getStyle('A1:G1')->getFont()->setBold(true)->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('FFFFFFFF'));
        $sheet->getStyle('A1:G1')->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FF1E3A8A');
        $sheet->getStyle('A1:G1')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        $rowCount = $sheet->getHighestRow();
        if ($rowCount > 1) {
            $sheet->getStyle("A1:G{$rowCount}")->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN)->getColor()->setARGB('FFE2E8F0');
        }

        return [];
    }
}
