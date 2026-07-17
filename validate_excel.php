<?php
require 'vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Maatwebsite\Excel\Facades\Excel;
use App\Imports\ExistingStudentBulkImport;
use Illuminate\Support\Facades\Validator;
use PhpOffice\PhpSpreadsheet\IOFactory;

$files = ['a1.xlsx', 'b.xlsx', 'c.xlsx', 'd.xlsx'];

$classAliases = [
    'NUR'    => 'NUR',
    'LKG'    => 'LKG',
    'UKG'    => 'UKG',
    'I'      => 'I',
    'II'     => 'II',
    'III'    => 'III',
    'IV'     => 'IV',
    'V'      => 'V',
    'VI'     => 'VI',
    'VII'    => 'VII',
    'VIII'   => 'VIII',
    'IX'     => 'IX',
    'X'      => 'X',
    'XI'     => 'XI',
    'XII'    => 'XII',
    'NC'     => 'NC'
];
$aliasKeys = array_keys($classAliases);
$allVariants = array_unique(array_merge(
    $aliasKeys,
    array_map('strtolower', $aliasKeys),
    array_map('strtoupper', $aliasKeys),
));
$validClasses = implode(',', $allVariants);

$rules = [
    'students'         => 'required_without:*.name|string|max:200',
    'name'             => 'required_without:*.students|string|max:200',
    'class'            => "required|string|in:{$validClasses}",
    'section'          => 'nullable|string|in:A,B,C,D',
    'gender'           => 'nullable|string',
    'email'            => 'required_without:*.mobile|nullable|email',
    'mobile'           => 'required_without:*.email|nullable|string|min:10|max:15',
    'dob'              => 'nullable',
    'previous_dues'    => 'nullable',
];

foreach ($files as $filename) {
    echo "\n======================\n";
    echo "Checking file: $filename\n";
    echo "======================\n";
    
    if (!file_exists($filename)) {
        echo "File not found.\n";
        continue;
    }

    try {
        $spreadsheet = IOFactory::load($filename);
        $worksheet = $spreadsheet->getActiveSheet();
        $rows = $worksheet->toArray(null, true, true, true);
        
        // Find header row (which has 'STUDENTS' or 'NAME')
        $headerRowIndex = 1;
        $headers = [];
        foreach ($rows as $index => $row) {
            $rowValues = array_map(function($v) { return strtolower(trim((string)$v)); }, array_values($row));
            if (in_array('students', $rowValues) || in_array('name', $rowValues) || in_array('class', $rowValues)) {
                $headerRowIndex = $index;
                // create header map
                foreach ($row as $colLetter => $val) {
                    $val = strtolower(trim((string)$val));
                    if ($val) {
                        $headers[$colLetter] = $val;
                    }
                }
                break;
            }
        }
        
        echo "Found headers at row $headerRowIndex\n";
        
        $errorCount = 0;
        $validCount = 0;
        $blankCount = 0;
        
        for ($i = $headerRowIndex + 1; $i <= count($rows); $i++) {
            $row = $rows[$i];
            
            // Check if entirely blank
            $isEmpty = true;
            foreach ($row as $val) {
                if (trim((string)$val) !== '') {
                    $isEmpty = false;
                    break;
                }
            }
            if ($isEmpty) {
                $blankCount++;
                continue;
            }
            
            $data = [];
            foreach ($headers as $colLetter => $headerName) {
                $data[$headerName] = trim((string)($row[$colLetter] ?? ''));
            }
            
            // Fix field names internally for validation
            if (isset($data['students']) && !isset($data['name'])) {
                $data['name'] = $data['students'];
            }
            if (isset($data['student name'])) {
                $data['name'] = $data['student name'];
            }
            if (isset($data['mobile no']) || isset($data['phone'])) {
                $data['mobile'] = $data['mobile no'] ?? $data['phone'] ?? '';
            }
            
            $validator = Validator::make($data, $rules);
            
            if ($validator->fails()) {
                $errorCount++;
                echo "Row $i Errors:\n";
                foreach ($validator->errors()->all() as $err) {
                    echo "  - $err\n";
                    if (str_contains($err, 'class')) {
                        echo "    (Found class value: '" . ($data['class'] ?? '') . "')\n";
                    }
                }
                if ($errorCount >= 10) {
                    echo "... (stopping after 10 errors)\n";
                    break;
                }
            } else {
                $validCount++;
            }
        }
        
        echo "Summary for $filename:\n";
        echo "  - Valid Rows: $validCount\n";
        echo "  - Error Rows: $errorCount\n";
        echo "  - Blank Rows Skipped: $blankCount\n";
        
    } catch (\Exception $e) {
        echo "Error reading file: " . $e->getMessage() . "\n";
    }
}
