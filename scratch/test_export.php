<?php

require __DIR__ . '/../vendor/autoload.php';
$app = require_once __DIR__ . '/../bootstrap/app.php';
$kernel = $app->make(\Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Services\FeeCollectionService;
use App\Exports\StudentLedgerExport;
use Maatwebsite\Excel\Facades\Excel;

try {
    $student = User::with(['studentProfile.session', 'studentProfile.stream'])->find(771);
    if (!$student) {
        echo "Student 771 not found\n";
        exit(1);
    }

    $service = app(FeeCollectionService::class);
    $result = $service->getStudentLedgerMatrix($student, 1, null);

    $export = new StudentLedgerExport($student, $result);
    $data = $export->array();

    echo "Export Rows Count: " . count($data) . "\n";
    echo "First 5 Rows:\n";
    foreach (array_slice($data, 0, 8) as $idx => $r) {
        echo "Row {$idx}: " . implode(' | ', array_filter($r, fn($v) => $v !== '')) . "\n";
    }

    // Try storing to temporary file
    $filePath = storage_path('app/test_ledger_export.xlsx');
    Excel::store($export, 'test_ledger_export.xlsx', 'local');
    echo "Excel successfully generated and saved to storage/app/test_ledger_export.xlsx!\n";
} catch (\Throwable $e) {
    echo "ERROR: " . $e->getMessage() . "\n" . $e->getTraceAsString() . "\n";
}
