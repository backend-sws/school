<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$payments = \App\Models\FeePayment::where('user_id', 3)->get();
foreach($payments as $p) {
    echo "Payment: {$p->payment_id} | Mode: {$p->payment_mode} | Amt: {$p->amount} | Total: {$p->total_amount} | Month: {$p->for_month}\n";
}
