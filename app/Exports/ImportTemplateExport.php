<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\WithMultipleSheets;

/**
 * Multi-sheet template export for bulk imports (Software Factory pattern).
 *
 * Sheet 1: Data — instruction rows at top + heading row + sample row
 * Sheet 2: Valid Values — reference table
 *
 * ALL template definitions live in config/import_templates.php.
 * To extend: add entries there — no code changes needed here.
 *
 * Usage: Excel::download(new ImportTemplateExport('existing_students'), 'template.xlsx');
 */
class ImportTemplateExport implements WithMultipleSheets
{
    protected string $module;

    public function __construct(string $module)
    {
        $this->module = $module;
    }

    public function sheets(): array
    {
        $template = config("import_templates.templates.{$this->module}", []);
        $notes = config("import_templates.validation_notes.{$this->module}", []);
        $validValues = config("import_templates.valid_values.{$this->module}");

        $sheets = [new ImportDataSheet($this->module, $template, $notes)];

        if (!empty($validValues)) {
            $sheets[] = new ImportReferenceSheet($validValues);
        }

        return $sheets;
    }

    /**
     * Get the heading row number for a module (after instruction rows).
     *
     * Used by importers via SkipsInstructionRows trait to know where data starts.
     */
    public static function getHeadingRow(string $module): int
    {
        $notes = config("import_templates.validation_notes.{$module}", []);
        $noteCount = count($notes);
        if ($noteCount === 0) {
            return 1;
        }
        return $noteCount + 2; // notes + 1 empty separator + 1 (1-indexed)
    }

    public static function getAvailableModules(): array
    {
        return array_keys(config('import_templates.templates', []));
    }

    public static function isValidModule(string $module): bool
    {
        return config("import_templates.templates.{$module}") !== null;
    }
}

// ── Sheet 1: Data Entry (with instruction rows at top) ──────────────────

use Maatwebsite\Excel\Concerns\FromArray;
use Maatwebsite\Excel\Concerns\WithTitle;
use Maatwebsite\Excel\Concerns\ShouldAutoSize;
use Maatwebsite\Excel\Concerns\WithEvents;
use Maatwebsite\Excel\Events\AfterSheet;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;

class ImportDataSheet implements FromArray, WithTitle, WithEvents
{
    public function __construct(
        protected string $module,
        protected array $template,
        protected array $notes = [],
    ) {
    }

    public function array(): array
    {
        $rows = [];
        $headings = $this->template['headings'] ?? [];

        if (!empty($this->notes)) {
            // Row 1: Title banner (merged in afterSheet)
            $rows[] = ['📋 IMPORT GUIDE — Read before filling data'];

            // Rows 2..N: Note rows — "field: values" as single merged cell
            foreach ($this->notes as $i => $note) {
                if ($i === 0)
                    continue; // skip the ⚠️ header, we replaced it with banner
                $rows[] = ["{$note[0]}:  {$note[1]}"];
            }

            // Empty separator
            $rows[] = [];
        }

        // Heading row
        $rows[] = $headings;

        // Sample data row
        $rows[] = $this->template['sample'] ?? [];

        return $rows;
    }

    public function title(): string
    {
        return 'Data';
    }

    public function registerEvents(): array
    {
        return [
            AfterSheet::class => function (AfterSheet $event) {
                $sheet = $event->sheet->getDelegate();
                $noteCount = count($this->notes);
                $headings = $this->template['headings'] ?? [];
                $sample = $this->template['sample'] ?? [];
                $colCount = count($headings);
                $lastCol = $this->colLetter($colCount);

                // ── Set explicit column widths based on heading/sample content ──
                for ($c = 1; $c <= $colCount; $c++) {
                    $heading = $headings[$c - 1] ?? '';
                    $sampleVal = $sample[$c - 1] ?? '';
                    // Extra generous padding: max of heading/sample plus 8 buffer chars
                    $width = max(mb_strlen($heading), mb_strlen((string) $sampleVal), 20) + 10;
                    $width = min($width, 60); // cap at 60
                    $sheet->getColumnDimension($this->colLetter($c))->setWidth($width);
                }

                if ($noteCount > 0) {
                    $noteRowCount = $noteCount; // 1 banner + (N-1) notes = N rows total
    
                    // ── Row 1: Title banner (dark blue, white text, merged) ──
                    $sheet->mergeCells("A1:{$lastCol}1");
                    $sheet->getRowDimension(1)->setRowHeight(32);
                    $sheet->getStyle("A1")->applyFromArray([
                        'font' => ['bold' => true, 'size' => 14, 'color' => ['argb' => 'FFFFFFFF']],
                        'fill' => [
                            'fillType' => Fill::FILL_SOLID,
                            'startColor' => ['argb' => 'FF1A237E'], // deep indigo
                        ],
                        'alignment' => [
                            'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
                        ],
                    ]);

                    // ── Rows 2..N: Note rows (light yellow, merged, with padding) ──
                    for ($row = 2; $row <= $noteRowCount; $row++) {
                        $sheet->mergeCells("A{$row}:{$lastCol}{$row}");
                        $sheet->getRowDimension($row)->setRowHeight(22);
                        $sheet->getStyle("A{$row}")->applyFromArray([
                            'font' => ['size' => 10, 'color' => ['argb' => 'FF333333']],
                            'fill' => [
                                'fillType' => Fill::FILL_SOLID,
                                'startColor' => ['argb' => 'FFFFFDE7'], // soft cream
                            ],
                            'alignment' => [
                                'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
                                'wrapText' => true,
                            ],
                        ]);

                        // Bold the field name (everything before the colon)
                        $cellValue = $sheet->getCell("A{$row}")->getValue() ?? '';
                        $colonPos = mb_strpos($cellValue, ':');
                        if ($colonPos !== false) {
                            $richText = new \PhpOffice\PhpSpreadsheet\RichText\RichText();
                            $bold = $richText->createTextRun(mb_substr($cellValue, 0, $colonPos + 1));
                            $bold->getFont()->setBold(true)->setSize(10)->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('FF1565C0'));
                            $normal = $richText->createTextRun(mb_substr($cellValue, $colonPos + 1));
                            $normal->getFont()->setSize(10)->setColor(new \PhpOffice\PhpSpreadsheet\Style\Color('FF555555'));
                            $sheet->getCell("A{$row}")->setValue($richText);
                        }
                    }

                    // ── Spacer row (thin blank divider, NO background) ──
                    $separatorRow = $noteRowCount + 1;
                    $sheet->getRowDimension($separatorRow)->setRowHeight(25);

                    // ── Heading row (LIGHT GREY BG + BLACK BOLD — column titles) ──
                    $headingRow = $noteRowCount + 2;
                    $sheet->getRowDimension($headingRow)->setRowHeight(25);
                    $sheet->getStyle("A{$headingRow}:{$lastCol}{$headingRow}")->applyFromArray([
                        'font' => ['bold' => true, 'size' => 12, 'color' => ['argb' => 'FF000000']],
                        'fill' => [
                            'fillType' => Fill::FILL_SOLID,
                            'startColor' => ['argb' => 'FFE0E0E0'],
                        ],
                        'alignment' => [
                            'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_LEFT,
                            'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
                            'indent' => 1,
                        ],
                        'borders' => [
                            'allBorders' => [
                                'borderStyle' => Border::BORDER_THIN,
                                'color' => ['argb' => 'FFBDBDBD'],
                            ],
                            'bottom' => [
                                'borderStyle' => Border::BORDER_MEDIUM,
                                'color' => ['argb' => 'FF757575'],
                            ],
                            'top' => [
                                'borderStyle' => Border::BORDER_MEDIUM,
                                'color' => ['argb' => 'FF757575'],
                            ],
                        ],
                    ]);

                    // ── Sample row (Clean White Background + Normal Text + Borders) ──
                    // $sampleRow = $headingRow + 1;
                    // $sheet->getRowDimension($sampleRow)->setRowHeight(25);
                    // $sheet->getStyle("A{$sampleRow}:{$lastCol}{$sampleRow}")->applyFromArray([
                    //     'font' => ['italic' => true, 'size' => 10, 'color' => ['argb' => 'FF555555']],
                    //     'fill' => [
                    //         'fillType' => Fill::FILL_NONE,
                    //     ],
                    //     'alignment' => [
                    //         'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
                    //     ],
                    //     'borders' => [
                    //         'allBorders' => [
                    //             'borderStyle' => Border::BORDER_THIN,
                    //             'color' => ['argb' => 'FFDDDDDD'],
                    //         ],
                    //     ],
                    // ]);
    
                    // Freeze below heading row
                    $dataStart = $headingRow + 1;
                    $sheet->freezePane("A{$dataStart}");
                } else {
                    // No notes — Standard Table styling
                    $sheet->getRowDimension(1)->setRowHeight(32);
                    $sheet->getStyle("A1:{$lastCol}1")->applyFromArray([
                        'font' => ['bold' => true, 'size' => 11, 'color' => ['argb' => 'FF000000']],
                        'fill' => [
                            'fillType' => Fill::FILL_SOLID,
                            'startColor' => ['argb' => 'FFEBEBEB'],
                        ],
                        'alignment' => [
                            'horizontal' => \PhpOffice\PhpSpreadsheet\Style\Alignment::HORIZONTAL_CENTER,
                            'vertical' => \PhpOffice\PhpSpreadsheet\Style\Alignment::VERTICAL_CENTER,
                        ],
                        'borders' => [
                            'allBorders' => [
                                'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                            ],
                        ],
                    ]);
                    // Sample row
                    $sheet->getStyle("A2:{$lastCol}2")->applyFromArray([
                        'font' => ['italic' => true, 'size' => 10, 'color' => ['argb' => 'FF555555']],
                        'borders' => [
                            'allBorders' => [
                                'borderStyle' => \PhpOffice\PhpSpreadsheet\Style\Border::BORDER_THIN,
                            ],
                        ],
                    ]);
                }
            },
        ];
    }

    protected function colLetter(int $colIndex): string
    {
        $letter = '';
        while ($colIndex > 0) {
            $colIndex--;
            $letter = chr(65 + ($colIndex % 26)) . $letter;
            $colIndex = intdiv($colIndex, 26);
        }
        return $letter;
    }
}

// ── Sheet 2: Valid Values Reference ─────────────────────────────────────

use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class ImportReferenceSheet implements FromArray, WithTitle, ShouldAutoSize, WithStyles
{
    public function __construct(
        protected array $validValues,
    ) {
    }

    public function array(): array
    {
        $columns = array_values($this->validValues);
        $maxRows = max(array_map('count', $columns));
        $rows = [];

        // Row 1 = headers
        $rows[] = array_keys($this->validValues);

        for ($i = 0; $i < $maxRows; $i++) {
            $row = [];
            foreach ($columns as $col) {
                $row[] = $col[$i] ?? '';
            }
            $rows[] = $row;
        }

        return $rows;
    }

    public function title(): string
    {
        return 'Valid Values';
    }

    public function styles(Worksheet $sheet)
    {
        return [
            1 => [
                'font' => ['bold' => true, 'size' => 11, 'color' => ['argb' => 'FFFFFFFF']],
                'fill' => [
                    'fillType' => Fill::FILL_SOLID,
                    'startColor' => ['argb' => 'FF4CAF50'],
                ],
            ],
        ];
    }
}
