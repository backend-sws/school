<?php

define('LARAVEL_START', microtime(true));
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$userId = 89;
$application = \App\Models\AdmissionApplication::where('user_id', $userId)->first();
echo "App ID: {$application->id}\n";
echo "fee_regulation_profile_id: " . ($application->fee_regulation_profile_id ?? 'NULL') . "\n";
echo "fee_breakdown: \n";
print_r($application->fee_breakdown);
