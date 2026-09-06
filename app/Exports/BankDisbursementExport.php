<?php

namespace App\Exports;

use App\Models\Payroll;
use Carbon\Carbon;
use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithStyles;
use Maatwebsite\Excel\Concerns\WithTitle;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class BankDisbursementExport implements FromArray, WithStyles, ShouldAutoSize, WithTitle
{
    protected Payroll $payroll;
    protected int $rowCount = 0;

    public function __construct(Payroll $payroll)
    {
        $this->payroll = $payroll->load(['payslips.user.staffProfile', 'institution']);
    }

    public function array(): array
    {
        $monthName = Carbon::createFromDate($this->payroll->year, $this->payroll->month, 1)->format('F Y');
        $institutionName = $this->payroll->institution?->name ?? 'Institution';

        $rows = [
            // Row 1: Title
            [strtoupper($institutionName) . " — SALARY BANK DISBURSEMENT SHEET"],
            // Row 2: Subtitle
            ["Month: {$monthName} | Generated On: " . date('d M Y, h:i A') . " | Total Payroll Outflow: ₹" . number_format($this->payroll->total_amount, 2)],
            // Row 3: Blank
            [],
            // Row 4: Column Headers
            [
                'S.No',
                'Employee ID',
                'Staff Name',
                'Designation',
                'Bank Name',
                'Account Number',
                'IFSC Code',
                'Basic Pay (₹)',
                'Allowances (₹)',
                'Deductions (₹)',
                'Net Payable (₹)',
                'Payment Status',
            ]
        ];

        $sno = 1;
        $totalNet = 0;
        $totalBasic = 0;
        $totalEarnings = 0;
        $totalDeductions = 0;

        foreach ($this->payroll->payslips as $slip) {
            $user = $slip->user;
            $profile = $user?->staffProfile;
            $empId = $profile?->employee_id ?? sprintf('EMP-%03d', $user?->id ?? 0);

            $rows[] = [
                $sno++,
                $empId,
                $user?->name ?? 'N/A',
                $profile?->designation ?? 'Staff',
                '', // Bank Name
                '', // Account Number
                '', // IFSC Code
                number_format($slip->basic_pay, 2, '.', ''),
                number_format($slip->total_earnings, 2, '.', ''),
                number_format($slip->total_deductions, 2, '.', ''),
                number_format($slip->net_pay, 2, '.', ''),
                strtoupper($slip->status),
            ];

            $totalBasic += (float) $slip->basic_pay;
            $totalEarnings += (float) $slip->total_earnings;
            $totalDeductions += (float) $slip->total_deductions;
            $totalNet += (float) $slip->net_pay;
        }

        // Summary Total Row
        $rows[] = [
            'TOTAL',
            '',
            '',
            '',
            '',
            '',
            '',
            number_format($totalBasic, 2, '.', ''),
            number_format($totalEarnings, 2, '.', ''),
            number_format($totalDeductions, 2, '.', ''),
            number_format($totalNet, 2, '.', ''),
            '',
        ];

        $this->rowCount = count($rows);

        return $rows;
    }

    public function styles(Worksheet $sheet)
    {
        // Title formatting
        $sheet->mergeCells('A1:L1');
        $sheet->getStyle('A1')->getFont()->setBold(true)->setSize(14)->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('FF1E293B'));
        $sheet->getStyle('A1')->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);

        $sheet->mergeCells('A2:L2');
        $sheet->getStyle('A2')->getFont()->setSize(10)->setItalic(true)->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('FF64748B'));

        // Header formatting (Row 4)
        $sheet->getStyle('A4:L4')->applyFromArray([
            'font' => [
                'bold' => true,
                'color' => ['rgb' => 'FFFFFF'],
                'size' => 10,
            ],
            'fill' => [
                'fillType' => Fill::FILL_SOLID,
                'startColor' => ['rgb' => '1E293B'], // Dark slate
            ],
            'alignment' => [
                'horizontal' => Alignment::HORIZONTAL_CENTER,
                'vertical' => Alignment::VERTICAL_CENTER,
            ],
        ]);
        $sheet->getRowDimension(4)->setRowHeight(26);

        // Data rows borders
        if ($this->rowCount > 4) {
            $sheet->getStyle("A4:L{$this->rowCount}")->applyFromArray([
                'borders' => [
                    'allBorders' => [
                        'borderStyle' => Border::BORDER_THIN,
                        'color' => ['rgb' => 'E2E8F0'],
                    ],
                ],
                'alignment' => [
                    'vertical' => Alignment::VERTICAL_CENTER,
                ],
            ]);

            // Summary Row styling
            $sheet->getStyle("A{$this->rowCount}:L{$this->rowCount}")->applyFromArray([
                'font' => ['bold' => true],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['rgb' => 'F1F5F9'],
                ],
            ]);
            $sheet->mergeCells("A{$this->rowCount}:G{$this->rowCount}");
            $sheet->getStyle("A{$this->rowCount}")->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
        }

        return [];
    }

    public function title(): string
    {
        return 'Disbursement_' . $this->payroll->month . '_' . $this->payroll->year;
    }
}
