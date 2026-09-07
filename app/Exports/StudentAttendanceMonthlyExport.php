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

class StudentAttendanceMonthlyExport implements FromArray, WithStyles, ShouldAutoSize, WithTitle
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
        return $this->isTemplate ? 'Attendance Template' : 'Attendance Register';
    }

    public function array(): array
    {
        $monthDate = Carbon::parse($this->month . '-01');
        $monthName = $monthDate->format('F Y');
        $daysInMonth = $this->ledgerData['days_in_month'] ?? $monthDate->daysInMonth;
        $matrix = $this->ledgerData['matrix'] ?? [];
        $daysMeta = $this->ledgerData['days_meta'] ?? [];
        $className = $this->ledgerData['class_name'] ?? 'Class';
        $subjectName = $this->ledgerData['subject_name'] ?? 'General Attendance';

        $title = $this->isTemplate
            ? "STUDENT ATTENDANCE TEMPLATE - {$className} ({$subjectName}) - " . strtoupper($monthName)
            : "STUDENT ATTENDANCE REGISTER - {$className} ({$subjectName}) - " . strtoupper($monthName);

        $rows = [
            // Row 1: Title
            [$title],
            // Row 2: Metadata & Explicit Month Code for parser
            [
                'Class: ' . $className,
                'Subject: ' . $subjectName,
                'Month: ' . $this->month,
                'Generated On: ' . date('d M Y, h:i A'),
                'Total Students: ' . count($matrix),
                $this->isTemplate ? 'Instructions: Fill cells with P (Present), A (Absent), L (Leave), LT (Late), H (Holiday). Leave - or blank for off.' : ''
            ],
            // Row 3: Blank
            [],
        ];

        // Row 4: Table Headers (Calendar view)
        $headerRow = ['Roll No / ID', 'Student Name'];
        for ($d = 1; $d <= $daysInMonth; $d++) {
            $headerRow[] = (string) $d;
        }
        $headerRow[] = 'P (Present)';
        $headerRow[] = 'A (Absent)';
        $headerRow[] = 'LT (Late)';
        $headerRow[] = 'L (Leave)';
        $headerRow[] = 'H (Holiday)';

        $rows[] = $headerRow;

        // Data Rows
        foreach ($matrix as $row) {
            $studentRow = [
                $row['roll_no'] ?? ($row['user_id'] ? 'ID: ' . $row['user_id'] : ''),
                $row['name'] ?? 'N/A',
            ];

            for ($d = 1; $d <= $daysInMonth; $d++) {
                $dateStr = sprintf('%s-%02d', $this->month, $d);
                $dayData = $row['days'][$dateStr] ?? null;
                $meta = $daysMeta[$dateStr] ?? null;

                if ($dayData && !empty($dayData['status'])) {
                    switch ($dayData['status']) {
                        case 'present':
                            $studentRow[] = 'P';
                            break;
                        case 'absent':
                            $studentRow[] = 'A';
                            break;
                        case 'late':
                            $studentRow[] = 'LT';
                            break;
                        case 'leave':
                            $studentRow[] = 'L';
                            break;
                        case 'holiday':
                            $studentRow[] = 'H';
                            break;
                        default:
                            $studentRow[] = strtoupper($dayData['status']);
                    }
                } elseif (!empty($meta['holiday'])) {
                    $studentRow[] = 'HOL';
                } elseif (!empty($meta['is_sunday'])) {
                    $studentRow[] = 'SUN';
                } else {
                    $studentRow[] = '-';
                }
            }

            $summary = $row['summary'] ?? [];
            $studentRow[] = $summary['present'] ?? 0;
            $studentRow[] = $summary['absent'] ?? 0;
            $studentRow[] = $summary['late'] ?? 0;
            $studentRow[] = $summary['leave'] ?? 0;
            $studentRow[] = $summary['holiday'] ?? 0;

            $rows[] = $studentRow;
        }

        return $rows;
    }

    public function styles(Worksheet $sheet)
    {
        $daysInMonth = $this->ledgerData['days_in_month'] ?? 30;
        // Columns: 2 (Roll No, Name) + $daysInMonth + 5 summary columns (P, A, LT, L, H)
        $totalColumnsCount = 2 + $daysInMonth + 5;
        $lastColumnLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($totalColumnsCount);

        // Style Title Row (Row 1)
        $sheet->mergeCells("A1:{$lastColumnLetter}1");
        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14)->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('FF065F46'));
        $sheet->getStyle('A1')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        // Metadata Row (Row 2)
        $sheet->getStyle('A2:F2')->getFont()->setItalic(true)->setSize(10);

        // Header Row (Row 4)
        $headerRange = "A4:{$lastColumnLetter}4";
        $sheet->getStyle($headerRange)->getFont()->setBold(true)->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('FFFFFFFF'));
        $sheet->getStyle($headerRange)->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FF047857');
        $sheet->getStyle($headerRange)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        $rowCount = count($this->ledgerData['matrix'] ?? []);
        $lastRow = 4 + $rowCount;

        if ($rowCount > 0) {
            // Apply borders
            $tableRange = "A4:{$lastColumnLetter}{$lastRow}";
            $sheet->getStyle($tableRange)->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN)->getColor()->setARGB('FFE2E8F0');

            // Center day columns and summary columns
            $dayStartLetter = 'C';
            $sheet->getStyle("{$dayStartLetter}5:{$lastColumnLetter}{$lastRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

            // Highlight summary columns
            $summaryStartColIndex = 2 + $daysInMonth + 1;
            $summaryStartLetter = \PhpOffice\PhpSpreadsheet\Cell\Coordinate::stringFromColumnIndex($summaryStartColIndex);
            $sheet->getStyle("{$summaryStartLetter}5:{$lastColumnLetter}{$lastRow}")->getFont()->setBold(true);
        }

        return [];
    }
}
