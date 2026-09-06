<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$payment = App\Models\FeePayment::find(13);
$controller = app(App\Http\Controllers\Api\V1\Fees\StudentLedgerController::class);

try {
    $res = $controller->downloadReceipt($payment);
    echo "Receipt download test: SUCCESS! Response class: " . get_class($res) . PHP_EOL;
} catch (\Throwable $e) {
    echo "Receipt download ERROR: " . $e->getMessage() . PHP_EOL . $e->getTraceAsString() . PHP_EOL;
}
