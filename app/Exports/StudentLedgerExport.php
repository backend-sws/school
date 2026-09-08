<?php

namespace App\Exports;

use App\Models\User;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;

class StudentLedgerExport implements FromArray, WithStyles, ShouldAutoSize, WithTitle
{
    protected User $student;
    protected array $ledgerData;

    public function __construct(User $student, array $ledgerData)
    {
        $this->student = $student;
        $this->ledgerData = $ledgerData;
    }

    public function title(): string
    {
        return 'Fee Ledger';
    }

    public function array(): array
    {
        $matrix = $this->ledgerData['matrix'] ?? [];
        $studentProfile = $this->student->studentProfile;
        $sessionName = $studentProfile?->session?->name ?? 'Current Session';
        $className = $this->ledgerData['class']['name'] ?? ($studentProfile?->stream?->name ?? 'N/A');
        $regNo = $studentProfile?->registration_no ?? 'N/A';
        $rollNo = $studentProfile?->roll_no ?? 'N/A';
        $parentName = $studentProfile?->father_name ?? ($studentProfile?->guardian_name ?? 'N/A');
        $mobile = $this->student->phone ?? ($studentProfile?->guardian_phone ?? 'N/A');

        $totalPaidSum = 0;
        $totalConcessionSum = 0;
        $finalBalance = 0;

        if (!empty($matrix)) {
            $lastRow = end($matrix);
            $finalBalance = $lastRow['balance'] ?? 0;
            foreach ($matrix as $row) {
                $totalPaidSum += (float)($row['paid_amount'] ?? 0);
                $totalConcessionSum += (float)($row['concession_amount'] ?? 0);
            }
        }

        $rows = [
            // Row 1: Title Header
            ['STUDENT FINANCIAL FEE LEDGER'],
            // Row 2: Empty
            [],
            // Rows 3-5: Student Profile Info
            ['Student Name:', $this->student->name, '', 'Registration No:', $regNo, '', 'Academic Session:', $sessionName],
            ['Class / Stream:', $className, '', 'Roll No:', $rollNo, '', 'Parent / Guardian:', $parentName],
            ['Contact Mobile:', $mobile, '', 'Generated On:', date('d M Y, h:i A'), '', 'Current Net Due:', 'Rs. ' . number_format($finalBalance, 2)],
            // Row 6: Empty
            [],
            // Row 7: Table Headings
            [
                'Month',
                'Due Date',
                'Previous Dues (Rs.)',
                'Tuition / Monthly (Rs.)',
                'Transport (Rs.)',
                'Hostel & Mess (Rs.)',
                'Other Fees (Rs.)',
                'Monthly Total (Rs.)',
                'Total Payable (Rs.)',
                'Paid Amount (Rs.)',
                'Discount / Waiver (Rs.)',
                'Balance Due (Rs.)',
                'Status',
                'Pay Date',
                'Payment Mode',
                'Receipt No',
                'Remarks / Note',
            ],
        ];

        // Rows 8+: Matrix Data Rows
        foreach ($matrix as $row) {
            $monthName = $row['month_name'] ?? $row['month_key'];
            $dueDate = $row['due_date'] ?? 'N/A';
            $prevDues = (float)($row['previous_dues'] ?? 0);
            $tuition = (float)($row['tuition_fee'] ?? 0);
            $transport = (float)($row['transport_fee'] ?? 0);
            $hostel = (float)($row['hostel_fee'] ?? 0);
            $other = (float)($row['other_fees'] ?? 0);
            $monthTotal = (float)($row['monthly_total'] ?? 0);
            $totalPayable = (float)($row['total_payable'] ?? 0);
            $paidAmount = (float)($row['paid_amount'] ?? 0);
            $concession = (float)($row['concession_amount'] ?? 0);
            $balance = (float)($row['balance'] ?? 0);
            $status = strtoupper($row['status'] ?? 'UNPAID');
            $payDate = $row['payment_date'] ?? '-';
            $mode = strtoupper($row['payment_mode'] ?? '-');
            $receiptNo = $row['receipt_no'] ?? '-';
            $remarks = $row['remarks'] ?? '-';

            $rows[] = [
                $monthName,
                $dueDate,
                $prevDues,
                $tuition,
                $transport,
                $hostel,
                $other,
                $monthTotal,
                $totalPayable,
                $paidAmount,
                $concession,
                $balance,
                $status,
                $payDate,
                $mode,
                $receiptNo,
                $remarks,
            ];
        }

        // Summary Row at bottom
        $rows[] = [];
        $rows[] = [
            'TOTAL / SUMMARY',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            '',
            $totalPaidSum,
            $totalConcessionSum,
            $finalBalance,
            $finalBalance <= 0 ? 'CLEARED' : 'PENDING',
            '',
            '',
            '',
            '',
        ];

        return $rows;
    }

    public function styles(Worksheet $sheet)
    {
        // Style main title
        $sheet->mergeCells('A1:Q1');
        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14)->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('FF1E3A8A'));
        $sheet->getStyle('A1')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        // Style student info labels (rows 3 to 5)
        $sheet->getStyle('A3:A5')->getFont()->setBold(true);
        $sheet->getStyle('D3:D5')->getFont()->setBold(true);
        $sheet->getStyle('G3:G5')->getFont()->setBold(true);

        // Table Header (Row 7)
        $headerRange = 'A7:Q7';
        $sheet->getStyle($headerRange)->getFont()->setBold(true)->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('FFFFFFFF'));
        $sheet->getStyle($headerRange)->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FF1E3A8A');
        $sheet->getStyle($headerRange)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);

        // Matrix Data Rows start at 8
        $matrixCount = count($this->ledgerData['matrix'] ?? []);
        $lastDataRow = 7 + $matrixCount;

        if ($matrixCount > 0) {
            // Apply borders to table
            $tableRange = "A7:Q{$lastDataRow}";
            $sheet->getStyle($tableRange)->getBorders()->getAllBorders()->setBorderStyle(Border::BORDER_THIN)->getColor()->setARGB('FFE2E8F0');

            // Align numeric columns (C to L)
            $sheet->getStyle("C8:L{$lastDataRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
            // Format currency
            $sheet->getStyle("C8:L{$lastDataRow}")->getNumberFormat()->setFormatCode('#,##0.00');

            // Total summary row
            $totalRow = $lastDataRow + 2;
            $totalRange = "A{$totalRow}:Q{$totalRow}";
            $sheet->getStyle($totalRange)->getFont()->setBold(true);
            $sheet->getStyle($totalRange)->getFill()->setFillType(Fill::FILL_SOLID)->getStartColor()->setARGB('FFF1F5F9');
            $sheet->getStyle("J{$totalRow}:L{$totalRow}")->getNumberFormat()->setFormatCode('#,##0.00');
            $sheet->getStyle("J{$totalRow}:L{$totalRow}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
        }

        return [];
    }
}
