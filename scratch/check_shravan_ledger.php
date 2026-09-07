<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$u1414 = \App\Models\User::find(1414);
$feeService = app(\App\Services\FeeCollectionService::class);
$res1414 = $feeService->getStudentLedgerMatrix($u1414, 2, 3);

echo "User 1414 (Session 3) Ledger:\n";
echo "Total Pending: " . ($res1414['total_pending'] ?? 'N/A') . "\n";
echo "Class: " . json_encode($res1414['class'] ?? null) . "\n";
if (!empty($res1414['matrix'])) {
    echo "First row: " . json_encode($res1414['matrix'][0]) . "\n";
} else {
    echo "Matrix is empty!\n";
}

$u1419 = \App\Models\User::find(1419);
$res1419 = $feeService->getStudentLedgerMatrix($u1419, 2, 4);
echo "\nUser 1419 (Session 4) Ledger:\n";
echo "Total Pending: " . ($res1419['total_pending'] ?? 'N/A') . "\n";
echo "Class: " . json_encode($res1419['class'] ?? null) . "\n";
if (!empty($res1419['matrix'])) {
    echo "First row: " . json_encode($res1419['matrix'][0]) . "\n";
}
