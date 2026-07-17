<?php
require 'vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\LmsClass;
use App\Models\LmsClassEnrollment;
use App\Models\FeeRegulationProfile;
use App\Models\StudentFeePeriodBalance;

echo "Starting bulk update for Class 8, 9, 10 (Section B) students...\n\n";

$targetClasses = ['VIII', 'IX', 'X'];
$targetSection = 'B';
$romanToInt = ['VIII' => 8, 'IX' => 9, 'X' => 10];

$totalUpdated = 0;
$totalLedgersCleared = 0;

foreach ($targetClasses as $className) {
    // 1. Find the LMS Class for this Roman Class and Section B
    // We look for class names that contain the roman numeral surrounded by spaces or at the start/end to avoid partial matches
    $lmsClasses = LmsClass::where(function($q) use ($className) {
            $q->where('name', 'LIKE', "% {$className} %")
              ->orWhere('name', 'LIKE', "{$className} %")
              ->orWhere('name', 'LIKE', "% {$className}");
        })
        ->where('section', $targetSection)
        ->get();

    if ($lmsClasses->isEmpty()) {
        echo "⚠️ No Section B class found for {$className}. Skipping.\n";
        continue;
    }

    // 2. Find the Hindi Fee Profile on Production
    // Try matching Roman (e.g. "Class VIII Hindi") or Numeric (e.g. "Class 8 Hindi")
    $numericClass = $romanToInt[$className];
    
    $profile = FeeRegulationProfile::where('name', 'LIKE', "%Hindi%")
        ->where(function($q) use ($className, $numericClass) {
            $q->where('name', 'LIKE', "%{$className}%")
              ->orWhere('name', 'LIKE', "%{$numericClass}%");
        })
        ->first();

    if (!$profile) {
        echo "❌ Could not find a 'Hindi' Fee Profile for Class {$className} (or {$numericClass}). Skipping.\n";
        continue;
    }

    echo "✅ Found Hindi Profile for Class {$className}: '{$profile->name}'\n";

    // 3. Update all students enrolled in these classes
    foreach ($lmsClasses as $lmsClass) {
        $enrollments = LmsClassEnrollment::where('lms_class_id', $lmsClass->id)->where('status', 'active')->get();
        
        if ($enrollments->isEmpty()) {
            echo "   - No active students found in {$lmsClass->name}\n";
            continue;
        }

        echo "   - Updating {$enrollments->count()} students in {$lmsClass->name}...\n";

        foreach ($enrollments as $enrollment) {
            $user = $enrollment->user;
            if ($user && $user->studentProfile) {
                // Update Fee Profile
                $user->studentProfile->fee_regulation_profile_id = $profile->id;
                $user->studentProfile->save();
                $totalUpdated++;

                // Clear unpaid generated ledgers so it recalculates with the Hindi profile
                $deleted = StudentFeePeriodBalance::where('user_id', $user->id)
                    ->where('paid_amount', '<=', 0)
                    ->delete();
                    
                $totalLedgersCleared += $deleted;
            }
        }
    }
    echo "\n";
}

echo "========================================================\n";
echo "🎉 Update Complete!\n";
echo "- Total Students Updated to Hindi Profile: {$totalUpdated}\n";
echo "- Total Old Unpaid Ledgers Cleared (Auto-Recalculate): {$totalLedgersCleared}\n";
echo "========================================================\n";
