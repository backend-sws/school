<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$payments = App\Models\FeePayment::with('user')->latest('id')->take(10)->get();
echo "Total FeePayments in DB: " . App\Models\FeePayment::count() . PHP_EOL;
foreach ($payments as $p) {
    echo sprintf("ID: %d | Student: %s (ID %d) | Month: %s | Amount: %s | Mode: %s | Status: %s | Receipt: %s | Remarks: %s | Date: %s\n",
        $p->id,
        $p->user?->name ?? 'Unknown',
        $p->user_id,
        $p->for_month,
        $p->total_amount,
        $p->payment_mode,
        $p->payment_status,
        $p->receipt_no,
        $p->remarks,
        $p->payment_date
    );
}
