<?php
require 'vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$log = Illuminate\Support\Facades\DB::table('import_logs')->latest('id')->first();
if ($log) {
    echo "Status: " . $log->status . "\n";
    echo "Errors: " . $log->errors . "\n";
} else {
    echo "No logs found.\n";
}
