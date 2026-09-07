<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$apps = \App\Models\AdmissionApplication::where('applicant_name', 'like', '%Shravan%')
    ->orWhere('application_id', 'like', '%396%')
    ->orWhere('user_id', 1414)
    ->get();

echo "Found " . $apps->count() . " applications:\n";
foreach ($apps as $a) {
    echo "ID: {$a->id}, AppID: {$a->application_id}, Type: {$a->application_type}, Status: {$a->process_status}, UserID: {$a->user_id}, SessionID: {$a->session_id}, Fees: " . json_encode($a->fees_breakdown) . "\n";
}

$users = \App\Models\User::where('reg_no', 'like', '%396%')->orWhere('name', 'like', '%Shravan%')->get();
echo "Found " . $users->count() . " users:\n";
foreach ($users as $u) {
    echo "User ID: {$u->id}, Name: {$u->name}, Reg: {$u->reg_no}\n";
}

$profiles = \App\Models\StudentProfile::withoutGlobalScopes()->where('reg_no', 'like', '%396%')->get();
echo "Found " . $profiles->count() . " profiles with 396:\n";
foreach ($profiles as $p) {
    echo "Profile ID: {$p->id}, User ID: {$p->user_id}, Reg: {$p->reg_no}, Session: {$p->session_id}\n";
}
