<?php

namespace App\Exports;

use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class StaffAttendanceMonthlyExport implements FromArray, WithStyles, ShouldAutoSize, WithTitle
{
    protected string $month;
    protected array $ledgerData;
    protected bool $isTemplate;

    public function __construct(string $month, array $ledgerData, bool $isTemplate = false)
    {
        $this->month = $month;
        $this->ledgerData = $ledgerData;
        $this->isTemplate = $isTemplate;
    }

    public function title(): string
    {
        return $this->isTemplate ? 'Attendance Template' : 'Attendance Ledger';
    }

    public function array(): array
    {
        $monthDate = Carbon::parse($this->month . '-01');
        $monthName = $monthDate->format('F Y');
        $daysInMonth = $this->ledgerData['days_in_month'] ?? $monthDate->daysInMonth;
        $matrix = $this->ledgerData['matrix'] ?? [];
        $daysMeta = $this->ledgerData['days_meta'] ?? [];

        $title = $this->isTemplate
            ? 'STAFF ATTENDANCE IMPORT TEMPLATE - ' . strtoupper($monthName)
            : 'STAFF ATTENDANCE LEDGER - ' . strtoupper($monthName);

        $rows = [
            // Row 1: Title
            [$title],
            // Row 2: Metadata & Explicit Month Code for parser
            [
                'Month: ' . $this->month,
                'Generated On: ' . date('d M Y, h:i A'),
                'Total Staff: ' . count($matrix),
                $this->isTemplate ? 'Instructions: Fill daily cells with P (Present), A (Absent), H (Half Day), L (Leave). Leave - or blank for off.' : ''
            ],
            // Row 3: Blank
            [],
        ];

        // Row 4: Table Headers (Calendar view)
        $headerRow = ['Employee ID', 'Staff Name', 'Designation'];
        for ($d = 1; $d <= $daysInMonth; $d++) {
            $headerRow[] = (string) $d;
        }
        $headerRow[] = 'P (Present)';
        $headerRow[] = 'A (Absent)';
        $headerRow[] = 'H (Half Day)';
        $headerRow[] = 'L (Leave)';

        $rows[] = $headerRow;

        // Data Rows
        foreach ($matrix as $row) {
            $staffRow = [
                $row['employee_id'] ?? '',
                $row['name'] ?? 'N/A',
                $row['designation'] ?? 'Staff',
            ];

            for ($d = 1; $d <= $daysInMonth; $d++) {
                $dateStr = sprintf('%s-%02d', $this->month, $d);
                $dayData = $row['days'][$dateStr] ?? null;
                $meta = $daysMeta[$dateStr] ?? null;

                if ($dayData && !empty($dayData['status'])) {
                    switch ($dayData['status']) {
                        case 'present':
                            $staffRow[] = 'P';
                            break;
                        case 'absent':
                            $staffRow[] = 'A';
                            break;
                        case 'half_day':
                            $staffRow[] = 'H';
                            break;
                        case 'on_leave':
                            $staffRow[] = 'L';
                            break;
                        default:
                            $staffRow[] = strtoupper($dayData['status']);
                    }
                } elseif (!empty($meta['holiday'])) {
                    $staffRow[] = 'HOL';
                } elseif (!empty($meta['is_sunday'])) {
                    $staffRow[] = 'SUN';
                } else {
                    $staffRow[] = '-';
                }
            }

            $summary = $row['summary'] ?? [];
            $staffRow[] = $summary['present'] ?? 0;
            $staffRow[] = $summary['absent'] ?? 0;
            $staffRow[] = $summary['half_day'] ?? 0;
            $staffRow[] = $summary['on_leave'] ?? 0;

            $rows[] = $staffRow;
        }

        return $rows;
    }

    public function styles(Worksheet $sheet)
    {
        $daysInMonth = $this->ledgerData['days_in_month'] ?? 30;
        // Columns: 3 (Emp ID, Name, Desig) + $daysInMonth + 4 summary columns
        $totalColumnsCount = 3 + $daysInMonth + 4;
        $lastColumnLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($totalColumnsCount);

        // Style Title Row (Row 1)
        $sheet->mergeCells("A1:{$lastColumnLetter}1");
        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14)->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('FF1E3A8A'));
        $sheet->getStyle('A1')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        // Metadata Row (Row 2)
        $sheet->getStyle('A2:D2')->getFont()->setItalic(true)->setSize(10);

        // Header Row (Row 4)
        $headerRange = "A4:{$lastColumnLetter}4";
        $sheet->getStyle($headerRange)->getFont()->setBold(true)->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('FFFFFFFF'));
        $sheet->getStyle($headerRange)->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FF1E3A8A');
        $sheet->getStyle($headerRange)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        $rowCount = count($this->ledgerData['matrix'] ?? []);
        $lastRow = 4 + $rowCount;

        if ($rowCount > 0) {
            // Apply borders
            $tableRange = "A4:{$lastColumnLetter}{$lastRow}";
            $sheet->getStyle($tableRange)->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN)->getColor()->setARGB('FFE2E8F0');

            // Center day columns and summary columns
            $dayStartLetter = 'D';
            $sheet->getStyle("{$dayStartLetter}5:{$lastColumnLetter}{$lastRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

            // Highlight summary columns
            $summaryStartColIndex = 3 + $daysInMonth + 1;
            $summaryStartLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($summaryStartColIndex);
            $sheet->getStyle("{$summaryStartLetter}5:{$lastColumnLetter}{$lastRow}")->getFont()->setBold(true);
        }

        return [];
    }
}
