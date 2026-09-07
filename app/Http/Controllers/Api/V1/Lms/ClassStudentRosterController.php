<?php

namespace App\Http\Controllers\Api\V1\Lms;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\AttendanceRecord;
use App\Models\LmsAssignment;
use App\Models\LmsAssignmentSubmission;
use App\Models\LmsClass;
use App\Models\LmsClassEnrollment;
use App\Models\LmsTest;
use App\Models\LmsTestAttempt;
use App\Models\StudentLeaveApplication;
use App\Models\StudentProfile;
use App\Models\StudentTransition;
use App\Models\User;
use Carbon\Carbon;
use Carbon\CarbonPeriod;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ClassStudentRosterController extends BaseController
{
    /**
     * Get summary KPIs for all students enrolled in a class.
     * Includes attendance percentage, LMS test completion count/percentage, and leave counts.
     */
    public function studentsSummary(Request $request, LmsClass $lms_class): JsonResponse
    {
        $user = $request->user();
        if (!LmsClass::userCanAccessForRead($user, $lms_class->id)) {
            return $this->forbidden('You do not have permission to view this classroom roster.');
        }

        $classId = $lms_class->id;
        $institutionId = (int) ($lms_class->institution_id ?? config('ems.default_institution_id', 1));

        // 1. Fetch enrolled students with their profile
        $enrollments = LmsClassEnrollment::query()
            ->where('lms_class_id', $classId)
            ->where('role', 'student')
            ->with([
                'user:id,name,email,reg_no,mobile,photo_url,status',
                'user.studentProfile',
            ])
            ->get();

        $studentUserIds = $enrollments->pluck('user_id')->filter()->values()->all();

        if (empty($studentUserIds)) {
            return $this->success([
                'class' => [
                    'id' => $lms_class->id,
                    'name' => $lms_class->name,
                    'section' => $lms_class->section,
                    'session_id' => $lms_class->session_id,
                ],
                'stats' => [
                    'total_students' => 0,
                    'total_class_tests' => 0,
                    'average_class_attendance' => 0,
                ],
                'students' => [],
            ]);
        }

        // 2. Fetch class level attendance records aggregation
        $attendanceAgg = AttendanceRecord::query()
            ->where('lms_class_id', $classId)
            ->whereNull('class_subject_allocation_id')
            ->whereIn('user_id', $studentUserIds)
            ->select(
                'user_id',
                DB::raw('COUNT(*) as total_marked_days'),
                DB::raw("SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present_days"),
                DB::raw("SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent_days"),
                DB::raw("SUM(CASE WHEN status = 'late' THEN 1 ELSE 0 END) as late_days"),
                DB::raw("SUM(CASE WHEN status = 'leave' THEN 1 ELSE 0 END) as leave_days"),
                DB::raw("SUM(CASE WHEN status = 'holiday' THEN 1 ELSE 0 END) as holiday_days")
            )
            ->groupBy('user_id')
            ->get()
            ->keyBy('user_id');

        // Total unique dates recorded for this class
        $totalClassRecordedDates = AttendanceRecord::query()
            ->where('lms_class_id', $classId)
            ->whereNull('class_subject_allocation_id')
            ->distinct('date')
            ->count('date');

        // 3. Fetch LMS Tests in this class
        $classTests = LmsTest::query()
            ->where('lms_class_id', $classId)
            ->select('id', 'title', 'available_from', 'available_until')
            ->get();
        $totalClassTests = $classTests->count();
        $classTestIds = $classTests->pluck('id')->all();

        // 4. Fetch test attempts by student
        $testAttemptsAgg = collect();
        if (!empty($classTestIds)) {
            $testAttemptsAgg = LmsTestAttempt::query()
                ->whereIn('lms_test_id', $classTestIds)
                ->whereIn('user_id', $studentUserIds)
                ->where('status', 'submitted')
                ->select(
                    'user_id',
                    DB::raw('COUNT(DISTINCT lms_test_id) as completed_tests'),
                    DB::raw('AVG(score) as average_score')
                )
                ->groupBy('user_id')
                ->get()
                ->keyBy('user_id');
        }

        // 5. Fetch leave applications count
        $leavesAgg = StudentLeaveApplication::query()
            ->where('lms_class_id', $classId)
            ->whereIn('user_id', $studentUserIds)
            ->select(
                'user_id',
                DB::raw('COUNT(*) as total_leaves_applied'),
                DB::raw("SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved_leaves"),
                DB::raw('SUM(total_days) as total_leave_days')
            )
            ->groupBy('user_id')
            ->get()
            ->keyBy('user_id');

        // 6. Map students data
        $studentsList = $enrollments->map(function ($enrollment) use ($attendanceAgg, $totalClassRecordedDates, $totalClassTests, $testAttemptsAgg, $leavesAgg) {
            $u = $enrollment->user;
            $sp = $u?->studentProfile;
            $userId = $enrollment->user_id;

            $atnd = $attendanceAgg->get($userId);
            $totalMarked = (int) ($atnd?->total_marked_days ?? 0);
            $present = (int) ($atnd?->present_days ?? 0);
            $absent = (int) ($atnd?->absent_days ?? 0);
            $late = (int) ($atnd?->late_days ?? 0);
            $leave = (int) ($atnd?->leave_days ?? 0);
            $holiday = (int) ($atnd?->holiday_days ?? 0);

            // Attendance rate calculation
            $effectiveWorkingDays = $totalMarked - $holiday;
            $attendancePercentage = $effectiveWorkingDays > 0
                ? round((($present + $late + ($leave * 0.5)) / $effectiveWorkingDays) * 100, 1)
                : 0.0;

            // Test stats
            $testAttempt = $testAttemptsAgg->get($userId);
            $completedTests = (int) ($testAttempt?->completed_tests ?? 0);
            $testCompletionRate = $totalClassTests > 0
                ? round(($completedTests / $totalClassTests) * 100, 1)
                : 0.0;
            $avgScore = $testAttempt?->average_score !== null ? round((float) $testAttempt->average_score, 1) : null;

            // Leave stats
            $leaveData = $leavesAgg->get($userId);
            $leaveCount = (int) ($leaveData?->total_leaves_applied ?? 0);
            $approvedLeaveCount = (int) ($leaveData?->approved_leaves ?? 0);
            $totalLeaveDays = (int) ($leaveData?->total_leave_days ?? 0);

            return [
                'enrollment_id' => $enrollment->id,
                'user_id' => $userId,
                'name' => $u?->name ?? 'Student',
                'email' => $u?->email,
                'reg_no' => $sp?->reg_no ?? $u?->reg_no,
                'roll_no' => $sp?->roll_no,
                'mobile' => $sp?->mobile ?? $u?->mobile,
                'photo_url' => $u?->photo_url ?? $u?->avatar_url,
                'father_name' => $sp?->father_name,
                'mother_name' => $sp?->mother_name,
                'gender' => $sp?->gender,
                'enrollment_status' => $enrollment->status,
                'attendance' => [
                    'percentage' => $attendancePercentage,
                    'total_recorded_dates' => $totalClassRecordedDates,
                    'total_marked' => $totalMarked,
                    'present' => $present,
                    'absent' => $absent,
                    'late' => $late,
                    'leave' => $leave,
                    'holiday' => $holiday,
                ],
                'tests' => [
                    'total_assigned' => $totalClassTests,
                    'completed' => $completedTests,
                    'completion_rate' => $testCompletionRate,
                    'average_score' => $avgScore,
                ],
                'leaves' => [
                    'applied_count' => $leaveCount,
                    'approved_count' => $approvedLeaveCount,
                    'total_days' => $totalLeaveDays,
                ],
            ];
        });

        // Overall class metrics
        $avgAttendance = $studentsList->count() > 0
            ? round($studentsList->avg('attendance.percentage'), 1)
            : 0;

        return $this->success([
            'class' => [
                'id' => $lms_class->id,
                'name' => $lms_class->name,
                'section' => $lms_class->section,
                'session_id' => $lms_class->session_id,
            ],
            'stats' => [
                'total_students' => $studentsList->count(),
                'total_class_tests' => $totalClassTests,
                'total_recorded_dates' => $totalClassRecordedDates,
                'average_class_attendance' => $avgAttendance,
            ],
            'students' => $studentsList,
        ]);
    }

    /**
     * Get detailed 360° profile of a student for a specific class.
     * Includes personal info, daily attendance ledger, LMS tests & attempt scores,
     * assignments, physical leave applications with files, and lifetime session history.
     */
    public function student360(Request $request, LmsClass $lms_class, User $student_user): JsonResponse
    {
        $user = $request->user();
        if (!LmsClass::userCanAccessForRead($user, $lms_class->id) && $user->id !== $student_user->id) {
            return $this->forbidden('You do not have permission to view this student profile.');
        }

        return $this->buildStudent360Response($student_user, $lms_class);
    }

    /**
     * Global 360° lookup for student (accessible from /students/manage and /students/manage/:id).
     * Auto-detects active class or uses requested class_id.
     */
    public function globalStudent360(Request $request, User $student_user): JsonResponse
    {
        $requestedClassId = $request->query('class_id');
        $lmsClass = null;

        if ($requestedClassId) {
            $lmsClass = LmsClass::find($requestedClassId);
        }

        if (!$lmsClass) {
            // Find student's active class enrollment
            $activeEnrollment = LmsClassEnrollment::query()
                ->where('user_id', $student_user->id)
                ->where('role', 'student')
                ->where('status', 'active')
                ->latest('enrolled_at')
                ->first();

            if ($activeEnrollment) {
                $lmsClass = LmsClass::find($activeEnrollment->lms_class_id);
            } else {
                // Fallback to any latest class enrollment
                $anyEnrollment = LmsClassEnrollment::query()
                    ->where('user_id', $student_user->id)
                    ->where('role', 'student')
                    ->latest('id')
                    ->first();
                if ($anyEnrollment) {
                    $lmsClass = LmsClass::find($anyEnrollment->lms_class_id);
                }
            }
        }

        return $this->buildStudent360Response($student_user, $lmsClass);
    }

    /**
     * Get lifetime chronological history across all academic sessions & classes.
     */
    public function lifetimeHistory(Request $request, User $student_user): JsonResponse
    {
        $history = $this->buildLifetimeAcademicJourney($student_user);
        return $this->success($history);
    }

    // ─── Private Helper Builders ───────────────────────────────────────────────

    private function buildStudent360Response(User $studentUser, ?LmsClass $lmsClass): JsonResponse
    {
        $studentUser->loadMissing(['studentProfile.stream', 'studentProfile.session']);
        $sp = $studentUser->studentProfile;
        $classId = $lmsClass?->id;

        // 1. Attendance breakdown & logs
        $attendanceRecords = collect();
        $attendanceSummary = [
            'percentage' => 0,
            'total_recorded_dates' => 0,
            'total_marked' => 0,
            'present' => 0,
            'absent' => 0,
            'late' => 0,
            'leave' => 0,
            'holiday' => 0,
        ];
        $monthlyAttendance = [];

        if ($classId) {
            $records = AttendanceRecord::query()
                ->where('lms_class_id', $classId)
                ->where('user_id', $studentUser->id)
                ->whereNull('class_subject_allocation_id')
                ->orderBy('date', 'desc')
                ->with('markedBy:id,name')
                ->get();

            $attendanceRecords = $records->map(fn($r) => [
                'id' => $r->id,
                'date' => $r->date->format('Y-m-d'),
                'status' => $r->status,
                'remarks' => $r->remarks,
                'marked_by' => $r->markedBy?->name,
            ]);

            $present = $records->where('status', 'present')->count();
            $absent = $records->where('status', 'absent')->count();
            $late = $records->where('status', 'late')->count();
            $leave = $records->where('status', 'leave')->count();
            $holiday = $records->where('status', 'holiday')->count();
            $totalMarked = $records->count();
            $effectiveWorkingDays = $totalMarked - $holiday;
            $percentage = $effectiveWorkingDays > 0
                ? round((($present + $late + ($leave * 0.5)) / $effectiveWorkingDays) * 100, 1)
                : 0.0;

            $attendanceSummary = [
                'percentage' => $percentage,
                'total_marked' => $totalMarked,
                'present' => $present,
                'absent' => $absent,
                'late' => $late,
                'leave' => $leave,
                'holiday' => $holiday,
            ];

            // Group by Month (Y-m)
            $monthlyGroups = $records->groupBy(fn($r) => $r->date->format('Y-m'));
            foreach ($monthlyGroups as $monthKey => $monthRecords) {
                $mPresent = $monthRecords->where('status', 'present')->count();
                $mAbsent = $monthRecords->where('status', 'absent')->count();
                $mLate = $monthRecords->where('status', 'late')->count();
                $mLeave = $monthRecords->where('status', 'leave')->count();
                $mHoliday = $monthRecords->where('status', 'holiday')->count();
                $mTotal = $monthRecords->count();
                $mWorking = $mTotal - $mHoliday;
                $mPct = $mWorking > 0 ? round((($mPresent + $mLate + ($mLeave * 0.5)) / $mWorking) * 100, 1) : 0;

                $monthlyAttendance[] = [
                    'month' => $monthKey,
                    'month_name' => Carbon::createFromFormat('Y-m', $monthKey)->format('F Y'),
                    'present' => $mPresent,
                    'absent' => $mAbsent,
                    'late' => $mLate,
                    'leave' => $mLeave,
                    'holiday' => $mHoliday,
                    'total' => $mTotal,
                    'percentage' => $mPct,
                ];
            }
        }

        // 2. LMS Tests & Test Attempts
        $testsList = collect();
        $testsSummary = [
            'total_assigned' => 0,
            'completed' => 0,
            'in_progress' => 0,
            'not_attempted' => 0,
            'completion_rate' => 0,
            'average_score' => null,
        ];

        if ($classId) {
            $classTests = LmsTest::query()
                ->where('lms_class_id', $classId)
                ->with(['questions:id,lms_test_id,marks'])
                ->orderBy('created_at', 'desc')
                ->get();

            $testIds = $classTests->pluck('id')->all();

            $attempts = LmsTestAttempt::query()
                ->whereIn('lms_test_id', $testIds)
                ->where('user_id', $studentUser->id)
                ->get()
                ->groupBy('lms_test_id');

            $totalTests = $classTests->count();
            $completedCount = 0;
            $totalScoreAchieved = 0;
            $totalScoreMax = 0;

            $testsList = $classTests->map(function ($test) use ($attempts, &$completedCount, &$totalScoreAchieved, &$totalScoreMax) {
                $maxTestMarks = (float) $test->questions->sum('marks');
                if ($maxTestMarks <= 0) $maxTestMarks = 100.0;

                $testAttempts = $attempts->get($test->id) ?? collect();
                $latestAttempt = $testAttempts->sortByDesc('id')->first();

                $attemptStatus = 'not_attempted';
                $score = null;
                $percentage = null;
                $submittedAt = null;

                if ($latestAttempt) {
                    $attemptStatus = $latestAttempt->status; // 'submitted', 'in_progress', etc.
                    $score = $latestAttempt->score !== null ? (float) $latestAttempt->score : null;
                    $submittedAt = $latestAttempt->submitted_at?->format('Y-m-d H:i');

                    if ($attemptStatus === 'submitted') {
                        $completedCount++;
                        if ($score !== null && $maxTestMarks > 0) {
                            $percentage = round(($score / $maxTestMarks) * 100, 1);
                            $totalScoreAchieved += $score;
                            $totalScoreMax += $maxTestMarks;
                        }
                    }
                }

                return [
                    'id' => $test->id,
                    'title' => $test->title,
                    'description' => $test->description,
                    'duration_minutes' => $test->duration_minutes,
                    'max_attempts' => $test->max_attempts,
                    'available_from' => $test->available_from?->format('Y-m-d H:i'),
                    'available_until' => $test->available_until?->format('Y-m-d H:i'),
                    'max_marks' => $maxTestMarks,
                    'attempt' => [
                        'status' => $attemptStatus,
                        'score' => $score,
                        'percentage' => $percentage,
                        'submitted_at' => $submittedAt,
                        'attempts_count' => $testAttempts->count(),
                    ],
                ];
            });

            $testsSummary = [
                'total_assigned' => $totalTests,
                'completed' => $completedCount,
                'not_attempted' => max(0, $totalTests - $completedCount),
                'completion_rate' => $totalTests > 0 ? round(($completedCount / $totalTests) * 100, 1) : 0,
                'average_score' => $totalScoreMax > 0 ? round(($totalScoreAchieved / $totalScoreMax) * 100, 1) : null,
            ];
        }

        // 3. LMS Assignments
        $assignmentsList = collect();
        if ($classId) {
            $classAssignments = LmsAssignment::query()
                ->where('lms_class_id', $classId)
                ->with(['submissions' => fn($q) => $q->where('user_id', $studentUser->id)])
                ->orderBy('due_at', 'desc')
                ->get();

            $assignmentsList = $classAssignments->map(function ($assignment) {
                $sub = $assignment->submissions->first();
                return [
                    'id' => $assignment->id,
                    'title' => $assignment->title,
                    'due_date' => $assignment->due_at?->format('Y-m-d H:i'),
                    'max_score' => $assignment->max_score,
                    'submission' => $sub ? [
                        'id' => $sub->id,
                        'status' => $sub->status,
                        'score' => $sub->score,
                        'submitted_at' => $sub->submitted_at?->format('Y-m-d H:i'),
                        'feedback' => $sub->feedback,
                    ] : null,
                ];
            });
        }

        // 4. Physical Leave Applications
        $leavesList = collect();
        if ($classId) {
            $leaves = StudentLeaveApplication::query()
                ->where('lms_class_id', $classId)
                ->where('user_id', $studentUser->id)
                ->with(['approvedBy:id,name', 'appliedBy:id,name'])
                ->orderBy('from_date', 'desc')
                ->get();

            $leavesList = $leaves->map(fn($l) => [
                'id' => $l->id,
                'document_category' => $l->document_category ?? 'leave',
                'document_title' => $l->document_title,
                'document_disk' => $l->document_disk,
                'leave_type' => $l->leave_type,
                'from_date' => $l->from_date->format('Y-m-d'),
                'to_date' => $l->to_date ? $l->to_date->format('Y-m-d') : $l->from_date->format('Y-m-d'),
                'total_days' => $l->total_days,
                'reason' => $l->reason,
                'document_url' => $l->document_url,
                'document_original_name' => $l->document_original_name,
                'document_mime_type' => $l->document_mime_type,
                'document_size' => $l->document_size,
                'status' => $l->status,
                'auto_marked_attendance' => (bool) $l->auto_marked_attendance,
                'approved_by' => $l->approvedBy?->name,
                'approved_at' => $l->approved_at?->format('Y-m-d H:i'),
                'admin_remarks' => $l->admin_remarks,
                'created_at' => $l->created_at?->format('Y-m-d H:i'),
            ]);
        }

        // 5. Lifetime Academic Journey & Sessions Timeline
        $lifetimeJourney = $this->buildLifetimeAcademicJourney($studentUser);

        return $this->success([
            'student' => [
                'id' => $studentUser->id,
                'name' => $studentUser->name,
                'email' => $studentUser->email,
                'reg_no' => $sp?->reg_no ?? $studentUser->reg_no,
                'roll_no' => $sp?->roll_no,
                'mobile' => $sp?->mobile ?? $studentUser->mobile,
                'photo_url' => $studentUser->photo_url ?? $studentUser->avatar_url,
                'gender' => $sp?->gender,
                'dob' => $sp?->dob?->format('Y-m-d'),
                'blood_group' => $sp?->blood_group,
                'category' => $sp?->category,
                'admission_date' => $sp?->admission_date?->format('Y-m-d'),
                'father_name' => $sp?->father_name,
                'father_mobile' => $sp?->father_mobile,
                'mother_name' => $sp?->mother_name,
                'address' => $sp?->address,
                'city' => $sp?->city,
                'state' => $sp?->state,
                'pincode' => $sp?->pincode,
                'medical_condition' => $sp?->medical_condition,
                'allergy' => $sp?->allergy,
                'previous_school_name' => $sp?->previous_school_name,
                'previous_board' => $sp?->previous_board,
                'previous_marks' => $sp?->previous_marks,
                'enrollment_status' => $sp?->enrollment_status ?? 'active',
            ],
            'current_class' => $lmsClass ? [
                'id' => $lmsClass->id,
                'name' => $lmsClass->name,
                'section' => $lmsClass->section,
                'code' => $lmsClass->code,
                'session' => $lmsClass->session ? [
                    'id' => $lmsClass->session->id,
                    'name' => $lmsClass->session->name,
                ] : null,
            ] : null,
            'attendance' => [
                'summary' => $attendanceSummary,
                'monthly' => $monthlyAttendance,
                'records' => $attendanceRecords,
            ],
            'tests' => [
                'summary' => $testsSummary,
                'list' => $testsList,
            ],
            'assignments' => $assignmentsList,
            'leaves' => $leavesList,
            'lifetime_journey' => $lifetimeJourney,
        ]);
    }

    private function buildLifetimeAcademicJourney(User $studentUser): array
    {
        $userId = $studentUser->id;

        // Fetch all class enrollments across history
        $enrollments = LmsClassEnrollment::query()
            ->where('user_id', $userId)
            ->where('role', 'student')
            ->with([
                'lmsClass.session',
                'lmsClass.stream',
            ])
            ->orderBy('id', 'desc')
            ->get();

        // Fetch all transition audit trail (promotions & readmissions)
        $transitions = StudentTransition::query()
            ->where('user_id', $userId)
            ->with(['fromSession:id,name', 'toSession:id,name', 'fromClass:id,name,section', 'toClass:id,name,section', 'processedBy:id,name'])
            ->orderBy('id', 'desc')
            ->get()
            ->map(fn($t) => [
                'id' => $t->id,
                'type' => $t->type, // 'promotion' or 'readmission'
                'status' => $t->status,
                'from_session' => $t->fromSession?->name,
                'to_session' => $t->toSession?->name,
                'from_class' => $t->fromClass ? "{$t->fromClass->name} ({$t->fromClass->section})" : null,
                'to_class' => $t->toClass ? "{$t->toClass->name} ({$t->toClass->section})" : null,
                'remarks' => $t->remarks,
                'processed_by' => $t->processedBy?->name,
                'processed_at' => $t->processed_at?->format('Y-m-d H:i'),
            ]);

        // Build history nodes per class enrollment
        $sessionsTimeline = $enrollments->map(function ($enr) use ($userId) {
            $cls = $enr->lmsClass;
            if (!$cls) return null;

            // Attendance metrics for this specific historical class
            $atnd = AttendanceRecord::query()
                ->where('lms_class_id', $cls->id)
                ->where('user_id', $userId)
                ->whereNull('class_subject_allocation_id')
                ->select(
                    DB::raw('COUNT(*) as total_days'),
                    DB::raw("SUM(CASE WHEN status = 'present' THEN 1 ELSE 0 END) as present"),
                    DB::raw("SUM(CASE WHEN status = 'absent' THEN 1 ELSE 0 END) as absent"),
                    DB::raw("SUM(CASE WHEN status = 'leave' THEN 1 ELSE 0 END) as leave_count")
                )
                ->first();

            $totalDays = (int) ($atnd?->total_days ?? 0);
            $present = (int) ($atnd?->present ?? 0);
            $pct = $totalDays > 0 ? round(($present / $totalDays) * 100, 1) : 0;

            // Tests completed in this class
            $testsCount = LmsTest::where('lms_class_id', $cls->id)->count();
            $testsAttempted = 0;
            if ($testsCount > 0) {
                $testIds = LmsTest::where('lms_class_id', $cls->id)->pluck('id');
                $testsAttempted = LmsTestAttempt::whereIn('lms_test_id', $testIds)->where('user_id', $userId)->where('status', 'submitted')->count();
            }

            // Physical leaves in this class
            $leavesCount = StudentLeaveApplication::where('lms_class_id', $cls->id)->where('user_id', $userId)->count();

            return [
                'enrollment_id' => $enr->id,
                'class_id' => $cls->id,
                'class_name' => $cls->name,
                'section' => $cls->section,
                'stream_name' => $cls->stream?->name,
                'session_name' => $cls->session?->name ?? 'Academic Session',
                'session_id' => $cls->session_id,
                'enrollment_status' => $enr->status, // 'active', 'promoted', 'inactive'
                'enrolled_at' => $enr->enrolled_at?->format('Y-m-d'),
                'metrics' => [
                    'attendance_percentage' => $pct,
                    'attendance_days' => $totalDays,
                    'tests_assigned' => $testsCount,
                    'tests_completed' => $testsAttempted,
                    'leaves_uploaded' => $leavesCount,
                ],
            ];
        })->filter()->values();

        return [
            'sessions_timeline' => $sessionsTimeline,
            'transitions' => $transitions,
        ];
    }
}
