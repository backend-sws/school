<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$user = \App\Models\User::where('name', 'like', '%Shravan%')->first();
if (!$user) {
    $profile = \App\Models\StudentProfile::withoutGlobalScopes()->where('reg_no', 'like', '%396%')->first();
    $user = $profile?->user;
}

if ($user) {
    echo "User ID: {$user->id}, Name: {$user->name}\n";
    $p = \App\Models\StudentProfile::withoutGlobalScopes()->where('user_id', $user->id)->first();
    echo "Profile: " . json_encode($p ? $p->toArray() : null, JSON_PRETTY_PRINT) . "\n";
    
    $transitions = \App\Models\StudentTransition::withoutGlobalScopes()->where('user_id', $user->id)->get();
    echo "Transitions: " . json_encode($transitions->toArray(), JSON_PRETTY_PRINT) . "\n";
    
    $apps = \App\Models\AdmissionApplication::where('user_id', $user->id)->get();
    echo "Applications: " . json_encode($apps->toArray(), JSON_PRETTY_PRINT) . "\n";
    
    $enrollments = \App\Models\LmsClassEnrollment::where('user_id', $user->id)->with('lmsClass.session')->get();
    echo "Enrollments: " . json_encode($enrollments->toArray(), JSON_PRETTY_PRINT) . "\n";
} else {
    echo "Shravan Kumar not found in local DB (it's in production DB).\n";
}
