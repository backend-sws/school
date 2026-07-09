<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$projector = app(App\Services\Fees\StudentFeePeriodBalanceProjector::class);
$feeCollectionService = app(App\Services\FeeCollectionService::class);

$students = App\Models\User::where('role', 'student')->get();
foreach($students as $student) {
    $enrollments = App\Models\LmsClassEnrollment::where('user_id', $student->id)->where('status', 'active')->with('lmsClass')->get();
    foreach($enrollments as $enrollment) {
        if ($enrollment->lmsClass) {
            $institutionId = $enrollment->lmsClass->institution_id;
            $matrix = $feeCollectionService->getStudentLedgerMatrix($student, $institutionId);
            if (!isset($matrix['error'])) {
                foreach($matrix['matrix'] as $row) {
                    $projector->projectPeriod($student, $institutionId, $row['month_key']);
                }
            }
        }
    }
}
echo "Projections updated successfully.";
