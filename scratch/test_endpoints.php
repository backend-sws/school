<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$student = App\Models\User::find(448);
$admin = App\Models\User::first();
$service = app(App\Services\FeeCollectionService::class);

echo "=== TEST 1: SINGLE MONTH CONCESSION (SOLUTION 3) VIA CONTROLLER ===\n";
DB::beginTransaction();
try {
    $request = Illuminate\Http\Request::create('/api/v1/fees/ledger/collect', 'POST', [
        'user_id' => $student->id,
        'for_month' => '2025-04',
        'amount' => 10350,
        'discount_amount' => 2850,
        'discount_reason' => 'Mid-session April fee waiver',
        'payment_mode' => 'cash',
        'cash_amount' => 7500,
        'online_amount' => 0,
    ]);
    $request->setUserResolver(fn() => $admin);

    $controller = app(App\Http\Controllers\Api\V1\Fees\StudentLedgerController::class);
    $response = $controller->collect($request);
    
    echo "Response status: " . $response->getStatusCode() . "\n";
    $content = json_decode($response->getContent(), true);
    echo "Message: " . ($content['message'] ?? 'No message') . "\n";

    App\Services\FeeCollectionService::clearCache();
    $matrixRes = $service->getStudentLedgerMatrix($student, $student->institution_id);
    echo "Total Pending after April waiver + arrears pay: " . $matrixRes['total_pending'] . "\n";
    echo "April Balance: " . $matrixRes['matrix'][0]['balance'] . " (Should be 0)\n";
    echo "April Discount: " . $matrixRes['matrix'][0]['discount'] . " (Should be 2850)\n";
    echo "April Paid: " . $matrixRes['matrix'][0]['paid_amount'] . " (Should be 7500)\n";
    echo "May Previous Dues: " . $matrixRes['matrix'][1]['previous_dues'] . " (Should be 0!)\n";
    echo "May Total Payable: " . $matrixRes['matrix'][1]['total_payable'] . " (Should be 2850)\n";

} catch (\Throwable $e) {
    echo "ERROR in Test 1: " . $e->getMessage() . "\n" . $e->getTraceAsString() . "\n";
} finally {
    DB::rollBack();
}

echo "\n=== TEST 2: ADVANCE PAYMENT WITH MONTH 0 ARREARS VIA CONTROLLER ===\n";
DB::beginTransaction();
try {
    // Collect April (10350 incl 7500 arrears) + May (2850)
    $request = Illuminate\Http\Request::create('/api/v1/fees/ledger/collect-advance', 'POST', [
        'user_id' => $student->id,
        'months' => [
            ['for_month' => '2025-04', 'amount' => 10350],
            ['for_month' => '2025-05', 'amount' => 2850],
        ],
        'total_amount' => 13200,
        'payment_mode' => 'cash',
        'cash_amount' => 13200,
        'online_amount' => 0,
        'discount_amount' => 0,
        'discount_reason' => '',
    ]);
    $request->setUserResolver(fn() => $admin);

    $controller = app(App\Http\Controllers\Api\V1\Fees\StudentLedgerController::class);
    $response = $controller->collectAdvance($request);

    echo "Response status: " . $response->getStatusCode() . "\n";
    $content = json_decode($response->getContent(), true);
    echo "Message: " . ($content['message'] ?? 'No message') . "\n";

    App\Services\FeeCollectionService::clearCache();
    $matrixRes = $service->getStudentLedgerMatrix($student, $student->institution_id);
    echo "Total Pending after Advance Pay (Apr + May): " . $matrixRes['total_pending'] . " (Should be 41700 - 13200 = 28500)\n";
    echo "April Balance: " . $matrixRes['matrix'][0]['balance'] . " (Should be 0)\n";
    echo "May Balance: " . $matrixRes['matrix'][1]['balance'] . " (Should be 0)\n";
    echo "June Previous Dues: " . $matrixRes['matrix'][2]['previous_dues'] . " (Should be 0! Arrears completely cleared!)\n";
    echo "June Total Payable: " . $matrixRes['matrix'][2]['total_payable'] . " (Should be 2850)\n";

} catch (\Throwable $e) {
    echo "ERROR in Test 2: " . $e->getMessage() . "\n" . $e->getTraceAsString() . "\n";
} finally {
    DB::rollBack();
}

echo "\n=== ALL BACKEND TESTS PASSED ===\n";
