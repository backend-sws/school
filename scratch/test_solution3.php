<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$student = App\Models\User::find(448);
$service = app(App\Services\FeeCollectionService::class);

echo "--- BEFORE ANY PAYMENT ---\n";
$resBefore = $service->getStudentLedgerMatrix($student, $student->institution_id);
echo "Total Pending: " . $resBefore['total_pending'] . "\n";
echo "Apr 2025: Monthly=" . $resBefore['matrix'][0]['monthly_total'] . ", Prev=" . $resBefore['matrix'][0]['previous_dues'] . ", Balance=" . $resBefore['matrix'][0]['balance'] . "\n";
echo "May 2025: Monthly=" . $resBefore['matrix'][1]['monthly_total'] . ", Prev=" . $resBefore['matrix'][1]['previous_dues'] . ", Balance=" . $resBefore['matrix'][1]['balance'] . "\n";

// TEST SCENARIO: Mid-session waiver (Solution 3) on April 2025
// April 2025 has Monthly: 2850, Prev: 7500, Balance: 10350
// Suppose we waive the April monthly fee (2850) using concession!
DB::beginTransaction();
try {
    $receiptNo = 'RCP-TEST-' . uniqid();
    
    // 1. Concession payment of 2850 for April
    App\Models\FeePayment::create([
        'institution_id' => $student->institution_id,
        'payment_id' => 'PAY-DISC-TEST',
        'user_id' => $student->id,
        'for_month' => '2025-04',
        'amount' => 2850,
        'late_fee_applied' => 0,
        'total_amount' => 2850,
        'payment_mode' => 'concession',
        'payment_status' => 'paid',
        'payment_date' => now(),
        'collected_by' => 1,
        'receipt_no' => $receiptNo . '-D',
        'remarks' => 'Mid-session admission waiver for April',
    ]);
    
    App\Services\FeeCollectionService::clearCache();
    $resAfterDisc = $service->getStudentLedgerMatrix($student, $student->institution_id);
    
    echo "\n--- AFTER APRIL MONTHLY FEE CONCESSION (2850 waived) ---\n";
    echo "Total Pending: " . $resAfterDisc['total_pending'] . " (Should drop from 41700 to 38850)\n";
    echo "Apr 2025: Discount=" . $resAfterDisc['matrix'][0]['discount'] . ", Balance=" . $resAfterDisc['matrix'][0]['balance'] . " (Should be 7500 remaining arrears)\n";
    echo "May 2025: Prev=" . $resAfterDisc['matrix'][1]['previous_dues'] . " (Should be 7500)\n";
    
    // 2. Now pay the 7500 opening arrears in April!
    App\Models\FeePayment::create([
        'institution_id' => $student->institution_id,
        'payment_id' => 'PAY-REG-TEST',
        'user_id' => $student->id,
        'for_month' => '2025-04',
        'amount' => 7500,
        'late_fee_applied' => 0,
        'total_amount' => 7500,
        'payment_mode' => 'cash',
        'payment_status' => 'paid',
        'payment_date' => now(),
        'collected_by' => 1,
        'receipt_no' => $receiptNo,
        'remarks' => 'Arrears cleared | Concession: 2850',
    ]);
    
    App\Services\FeeCollectionService::clearCache();
    $resAfterArrearsPay = $service->getStudentLedgerMatrix($student, $student->institution_id);
    
    echo "\n--- AFTER PAYING REMAINING 7500 ARREARS IN APRIL ---\n";
    echo "Total Pending: " . $resAfterArrearsPay['total_pending'] . " (Should drop to 31350)\n";
    echo "Apr 2025: Balance=" . $resAfterArrearsPay['matrix'][0]['balance'] . " (Should be 0, fully cleared!)\n";
    echo "May 2025: Prev=" . $resAfterArrearsPay['matrix'][1]['previous_dues'] . " (Should be 0!)\n";
    echo "May 2025: TotalPayable=" . $resAfterArrearsPay['matrix'][1]['total_payable'] . " (Should be 2850)\n";
    echo "Jun 2025: Prev=" . $resAfterArrearsPay['matrix'][2]['previous_dues'] . " (Should be 2850)\n";
} finally {
    DB::rollBack();
}
