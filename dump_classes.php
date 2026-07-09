<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$exam = \App\Models\Exam::where('name', 'gfgf')->first();
if (!$exam) {
    echo "Exam not found (namespace App\Models)\n";
} else {
    echo "Exam found (namespace App\Models)\n";
    $institutionId = $exam->institution_id;
    $sessionId = $exam->session_id;

    echo "Exam session_id: " . $sessionId . "\n";

    $firstClass = \App\Models\LmsClass::where('institution_id', $institutionId)->first();
    echo "First Class session_id: " . $firstClass->session_id . "\n";
    echo "First Class status: " . $firstClass->status . "\n";

    $classes = \App\Models\LmsClass::where('institution_id', $institutionId)
        ->where('session_id', $sessionId)
        ->get();
    echo "Classes count matching session_id: " . $classes->count() . "\n";
}
