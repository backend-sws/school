<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$studentId = 92;

$controller = app(\App\Http\Controllers\Api\V1\Admission\ReadmissionController::class);
$request = new \Illuminate\Http\Request();
$request->setUserResolver(function() { return \App\Models\User::find(2); });

$service = app(\App\Services\StudentIdentifierService::class);
echo "Next Reg No: " . $service->generateRegNumber(2, 4) . "\n";
