<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$payments = App\Models\FeePayment::where('user_id', 448)->get();
echo 'Payments count: ' . $payments->count() . PHP_EOL;
foreach ($payments as $p) {
    echo sprintf("ID: %d | Month: %s | Amount: %s | Mode: %s | Status: %s | Receipt: %s | Remarks: %s\n",
        $p->id, $p->for_month, $p->total_amount, $p->payment_mode, $p->payment_status, $p->receipt_no, $p->remarks
    );
}

$student = App\Models\User::find(448);
$service = app(App\Services\FeeCollectionService::class);
$res = $service->getStudentLedgerMatrix($student, $student->institution_id);
echo PHP_EOL . 'Matrix Rows:' . PHP_EOL;
foreach ($res['matrix'] as $r) {
    echo sprintf("%s (%s) | Balance: %s | Paid: %s | Status: %s | PaymentID: %s | Receipt: %s | PayDate: %s\n",
        $r['month_name'], $r['month_key'], $r['balance'], $r['paid_amount'], $r['status'], $r['payment_id'] ?? 'NULL', $r['receipt_no'] ?? 'NULL', $r['payment_date'] ?? 'NULL'
    );
}
