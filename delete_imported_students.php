<?php
require 'vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\StudentProfile;
use App\Models\FeePayment;
use App\Models\StudentFeePeriodBalance;
use App\Models\LmsClassEnrollment;
use Illuminate\Support\Facades\DB;

$today = now()->toDateString();

// Find users who are students and were created today
$userIds = User::whereHas('roles', function($q) {
        $q->where('key', 'student');
    })
    ->whereDate('created_at', $today)
    ->pluck('id')
    ->toArray();

echo "Found " . count($userIds) . " students imported today.\n";

if(count($userIds) > 0) {
    DB::transaction(function() use ($userIds) {
        // Delete fee payments
        $fp = FeePayment::whereIn('user_id', $userIds)->delete();
        echo "Deleted $fp fee payments.\n";

        // Delete period balances
        $pb = StudentFeePeriodBalance::whereIn('user_id', $userIds)->delete();
        echo "Deleted $pb fee period balances.\n";

        // Delete enrollments
        $ce = LmsClassEnrollment::whereIn('user_id', $userIds)->delete();
        echo "Deleted $ce class enrollments.\n";

        // Delete profiles
        $sp = StudentProfile::whereIn('user_id', $userIds)->delete();
        echo "Deleted $sp student profiles.\n";

        // Delete role assignments
        $ur = DB::table('user_roles')->whereIn('user_id', $userIds)->delete();
        echo "Deleted $ur user role assignments.\n";

        // Delete the users
        $u = User::whereIn('id', $userIds)->delete();
        echo "Deleted $u users.\n";
    });
}

echo "Cleanup complete.\n";
