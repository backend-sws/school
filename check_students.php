<?php

use App\Models\StudentProfile;
use App\Models\Session;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';

$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "Sessions:\n";
foreach (Session::all() as $session) {
    echo "- ID: {$session->id}, Name: {$session->name}\n";
}

echo "\nStudent Counts by Status:\n";
$counts = StudentProfile::select('enrollment_status', \DB::raw('count(*) as count'))
    ->groupBy('enrollment_status')
    ->get();

foreach ($counts as $row) {
    echo "- Status: {$row->enrollment_status}, Count: {$row->count}\n";
}

echo "\nActive Students by Session:\n";
$activeBySession = StudentProfile::where('enrollment_status', 'active')
    ->select('session_id', \DB::raw('count(*) as count'))
    ->groupBy('session_id')
    ->get();

foreach ($activeBySession as $row) {
    echo "- Session ID: {$row->session_id}, Count: {$row->count}\n";
}
