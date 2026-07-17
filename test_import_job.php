<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$log = \App\Models\ImportLog::find(5); // My test import log
if (!$log) die("Log not found\n");

// We need to re-run it
// Let's copy the file from local to s3? The s3 disk in local is actually public disk?
// The file path is $log->file_path

$job = new \App\Jobs\ProcessBulkImportJob($log->id);
$job->handle();

dump("Finished Job");
