<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

$u1 = \App\Models\User::find(1414);
$u2 = \App\Models\User::find(1419);

echo "User 1414: " . json_encode($u1->toArray(), JSON_PRETTY_PRINT) . "\n";
echo "User 1419: " . json_encode($u2->toArray(), JSON_PRETTY_PRINT) . "\n";

$p1 = \App\Models\StudentProfile::withoutGlobalScopes()->where('user_id', 1414)->first();
$p2 = \App\Models\StudentProfile::withoutGlobalScopes()->where('user_id', 1419)->first();

echo "Profile 1414: " . json_encode($p1 ? $p1->toArray() : null, JSON_PRETTY_PRINT) . "\n";
echo "Profile 1419: " . json_encode($p2 ? $p2->toArray() : null, JSON_PRETTY_PRINT) . "\n";

$apps1 = \App\Models\AdmissionApplication::where('user_id', 1414)->get();
$apps2 = \App\Models\AdmissionApplication::where('user_id', 1419)->get();

echo "Apps 1414: " . json_encode($apps1->toArray(), JSON_PRETTY_PRINT) . "\n";
echo "Apps 1419: " . json_encode($apps2->toArray(), JSON_PRETTY_PRINT) . "\n";

$transitions = \App\Models\StudentTransition::withoutGlobalScopes()->whereIn('user_id', [1414, 1419])->get();
echo "Transitions: " . json_encode($transitions->toArray(), JSON_PRETTY_PRINT) . "\n";
