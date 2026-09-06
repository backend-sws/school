<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$student = App\Models\User::find(448);
$service = app(App\Services\FeeCollectionService::class);
$res = $service->getStudentLedgerMatrix($student, $student->institution_id);

echo "Student: " . $student->name . PHP_EOL;
echo "Admission Date: " . $student->studentProfile?->admission_date . PHP_EOL;
echo "Total Pending: " . $res['total_pending'] . PHP_EOL;
foreach ($res['matrix'] as $row) {
    echo sprintf("%s (%s) | Monthly: %s | Prev: %s | TotalPayable: %s | Paid: %s | Balance: %s\n",
        $row['month_name'],
        $row['month_key'],
        $row['monthly_total'],
        $row['previous_dues'],
        $row['total_payable'],
        $row['paid_amount'],
        $row['balance']
    );
}
