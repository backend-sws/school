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
    protected ?int $institutionId;

    public function __construct(string $module, ?int $institutionId = null)
    {
        $this->module = $module;
        $this->institutionId = $institutionId;
    }

    public function sheets(): array
    {
        $template = config("import_templates.templates.{$this->module}", []);
        $notes = config("import_templates.validation_notes.{$this->module}", []);
        $validValues = config("import_templates.valid_values.{$this->module}");

        if ($this->module === 'existing_students' && $this->institutionId) {
            // Load sessions from database
            $sessions = \App\Models\Session::where('institution_id', $this->institutionId)->pluck('name')->toArray();
            if (!empty($sessions)) {
                $validValues['session_name (format)'] = $sessions;
            }

            // Load streams/classes from database + config class_aliases
            $standardClasses = ['NUR', 'LKG', 'UKG', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'NC'];
            $streams = \App\Models\Stream::where('institution_id', $this->institutionId)->pluck('name')->toArray();
            
            // Only add stream names if they are not numeric and not already represented by standard classes (case-insensitive check)
            $standardLower = array_map('strtolower', $standardClasses);
            foreach ($streams as $streamName) {
                $trimmedName = trim($streamName);
                if (is_numeric($trimmedName)) {
                    continue;
                }
                if (!in_array(strtolower($trimmedName), $standardLower)) {
                    $standardClasses[] = $trimmedName;
                }
            }
            $validValues['class (use one)'] = $standardClasses;

            // Load fee profiles and append to notes
            $profiles = \App\Models\FeeRegulationProfile::where('institution_id', $this->institutionId)
                ->get()
                ->map(fn($p) => "{$p->name}" . ($p->is_default ? ' (Default)' : ''))
                ->toArray();
            if (!empty($profiles)) {
                $notes[] = ['fee_profile (auto-assign)', 'Will resolve based on class: ' . implode(', ', $profiles)];
            }
        }

        $sheets = [new ImportDataSheet($this->module, $template, $notes, $validValues)];

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
use PhpOffice\PhpSpreadsheet\Cell\DataValidation;

class ImportDataSheet implements FromArray, WithTitle, WithEvents
{
    public function __construct(
        protected string $module,
        protected array $template,
        protected array $notes = [],
        protected array $validValues = [],
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
                    $dataStart = 2;
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

                // Add data validations for dropdowns
                $genderCol = null;
                $classCol = null;
                $sectionCol = null;
                $sessionCol = null;

                foreach ($headings as $index => $heading) {
                    $colLetter = $this->colLetter($index + 1);
                    if ($heading === 'gender') {
                        $genderCol = $colLetter;
                    } elseif ($heading === 'class') {
                        $classCol = $colLetter;
                    } elseif ($heading === 'section') {
                        $sectionCol = $colLetter;
                    } elseif ($heading === 'session_name') {
                        $sessionCol = $colLetter;
                    }
                }

                if (!empty($this->validValues)) {
                    if ($classCol && !empty($this->validValues['class (use one)'])) {
                        $count = count($this->validValues['class (use one)']);
                        $validation = new DataValidation();
                        $validation->setType(DataValidation::TYPE_LIST);
                        $validation->setErrorStyle(DataValidation::STYLE_STOP);
                        $validation->setAllowBlank(true);
                        $validation->setShowInputMessage(true);
                        $validation->setShowErrorMessage(true);
                        $validation->setShowDropDown(true);
                        $validation->setErrorTitle('Invalid Class');
                        $validation->setError('Please select a class from the dropdown list.');
                        $validation->setPromptTitle('Select Class');
                        $validation->setPrompt('Choose a valid class.');
                        $validation->setFormula1('\'Valid Values\'!$A$2:$A$' . ($count + 1));
                        
                        for ($row = $dataStart; $row <= 500; $row++) {
                            $sheet->getCell("{$classCol}{$row}")->setDataValidation(clone $validation);
                        }
                    }

                    if ($sectionCol && !empty($this->validValues['section (use one)'])) {
                        $count = count($this->validValues['section (use one)']);
                        $validation = new DataValidation();
                        $validation->setType(DataValidation::TYPE_LIST);
                        $validation->setErrorStyle(DataValidation::STYLE_STOP);
                        $validation->setAllowBlank(true);
                        $validation->setShowDropDown(true);
                        $validation->setErrorTitle('Invalid Section');
                        $validation->setError('Please select a section from the dropdown list.');
                        $validation->setFormula1('\'Valid Values\'!$B$2:$B$' . ($count + 1));
                        
                        for ($row = $dataStart; $row <= 500; $row++) {
                            $sheet->getCell("{$sectionCol}{$row}")->setDataValidation(clone $validation);
                        }
                    }

                    if ($genderCol && !empty($this->validValues['gender (use one)'])) {
                        $count = count($this->validValues['gender (use one)']);
                        $validation = new DataValidation();
                        $validation->setType(DataValidation::TYPE_LIST);
                        $validation->setErrorStyle(DataValidation::STYLE_STOP);
                        $validation->setAllowBlank(true);
                        $validation->setShowDropDown(true);
                        $validation->setErrorTitle('Invalid Gender');
                        $validation->setError('Please select a gender from the dropdown list.');
                        $validation->setFormula1('\'Valid Values\'!$C$2:$C$' . ($count + 1));
                        
                        for ($row = $dataStart; $row <= 500; $row++) {
                            $sheet->getCell("{$genderCol}{$row}")->setDataValidation(clone $validation);
                        }
                    }

                    if ($sessionCol && !empty($this->validValues['session_name (format)'])) {
                        $count = count($this->validValues['session_name (format)']);
                        $validation = new DataValidation();
                        $validation->setType(DataValidation::TYPE_LIST);
                        $validation->setErrorStyle(DataValidation::STYLE_STOP);
                        $validation->setAllowBlank(true);
                        $validation->setShowDropDown(true);
                        $validation->setErrorTitle('Invalid Session');
                        $validation->setError('Please select a session from the dropdown list.');
                        $validation->setFormula1('\'Valid Values\'!$D$2:$D$' . ($count + 1));
                        
                        for ($row = $dataStart; $row <= 500; $row++) {
                            $sheet->getCell("{$sessionCol}{$row}")->setDataValidation(clone $validation);
                        }
                    }
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
