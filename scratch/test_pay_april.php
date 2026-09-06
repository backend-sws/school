<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$student = App\Models\User::find(448);
$service = app(App\Services\FeeCollectionService::class);

// Dry run: simulate what happens if a payment of 10350 is made in 2025-04
DB::beginTransaction();
try {
    $p = App\Models\FeePayment::create([
        'institution_id' => $student->institution_id,
        'payment_id' => 'TEST-PAY-' . uniqid(),
        'user_id' => $student->id,
        'for_month' => '2025-04',
        'amount' => 10350,
        'late_fee_applied' => 0,
        'total_amount' => 10350,
        'payment_mode' => 'cash',
        'payment_status' => 'paid',
        'payment_date' => now(),
        'collected_by' => 1,
        'receipt_no' => 'TEST-001',
    ]);
    
    App\Services\FeeCollectionService::clearCache();
    $res = $service->getStudentLedgerMatrix($student, $student->institution_id);
    
    echo "After paying 10,350 in Apr 2025:\n";
    echo "Total Pending: " . $res['total_pending'] . "\n";
    foreach (array_slice($res['matrix'], 0, 4) as $row) {
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
} finally {
    DB::rollBack();
}
