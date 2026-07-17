<?php
require 'vendor/autoload.php';
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Spreadsheet;

$files = ['a1.xlsx', 'b.xlsx', 'c.xlsx', 'd.xlsx'];

foreach ($files as $filename) {
    if (!file_exists($filename)) continue;
    
    echo "Cleaning $filename...\n";
    $spreadsheet = IOFactory::load($filename);
    $worksheet = $spreadsheet->getActiveSheet();
    
    $maxRow = $worksheet->getHighestRow();
    
    for ($row = $maxRow; $row >= 1; $row--) {
        $isEmpty = true;
        foreach ($worksheet->getRowIterator($row, $row) as $r) {
            $cellIterator = $r->getCellIterator();
            $cellIterator->setIterateOnlyExistingCells(false); 
            foreach ($cellIterator as $cell) {
                if (trim((string)$cell->getValue()) !== '') {
                    $isEmpty = false;
                    break;
                }
            }
        }
        
        // Also check if Name or Students column is empty
        $nameVal = trim((string)$worksheet->getCell('B' . $row)->getValue()); // Assuming Name is B
        if ($isEmpty || $nameVal === '') {
            $worksheet->removeRow($row, 1);
        }
    }
    
    $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
    $writer->save(str_replace('.xlsx', '_clean.xlsx', $filename));
    echo "Saved cleaned version as " . str_replace('.xlsx', '_clean.xlsx', $filename) . "\n";
}
