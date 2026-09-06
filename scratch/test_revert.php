<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$student = App\Models\User::find(771);
$admin = App\Models\User::first();
$service = app(App\Services\FeeCollectionService::class);
$controller = app(App\Http\Controllers\Api\V1\Fees\StudentLedgerController::class);

DB::beginTransaction();
try {
    $request = Illuminate\Http\Request::create('/api/v1/fees/ledger/revert-payment', 'POST', [
        'payment_id' => 13,
        'reason' => 'Testing revert functionality on concession payment',
    ]);
    $request->setUserResolver(fn() => $admin);

    $response = $controller->revertPayment($request);
    echo "Revert status: " . $response->getStatusCode() . PHP_EOL;
    $content = json_decode($response->getContent(), true);
    echo "Message: " . ($content['message'] ?? 'No message') . PHP_EOL;

    App\Services\FeeCollectionService::clearCache();
    $matrixRes = $service->getStudentLedgerMatrix($student, $student->institution_id);
    echo "April balance after reverting payment 13: " . $matrixRes['matrix'][0]['balance'] . " (Should be restored to 8100!)" . PHP_EOL;
    echo "Total Pending after revert: " . $matrixRes['total_pending'] . PHP_EOL;
    echo "Reverted history count in matrix: " . count($matrixRes['reverted_history']) . PHP_EOL;
} catch (\Throwable $e) {
    echo "Revert ERROR: " . $e->getMessage() . PHP_EOL . $e->getTraceAsString() . PHP_EOL;
} finally {
    DB::rollBack();
}
