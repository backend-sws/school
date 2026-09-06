<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$student = App\Models\User::find(771);
$service = app(App\Services\FeeCollectionService::class);
$res = $service->getStudentLedgerMatrix($student, $student->institution_id);

foreach (array_slice($res['matrix'], 0, 3) as $r) {
    echo $r['month_name'] . " -> PaymentID: " . ($r['payment_id'] ?? 'NULL') . " | Receipt: " . ($r['receipt_no'] ?? 'NULL') . " | Mode: " . ($r['payment_mode'] ?? 'NULL') . " | PayDate: " . ($r['payment_date'] ?? 'NULL') . " | Remarks: " . ($r['remarks'] ?? 'NONE') . PHP_EOL;
}
