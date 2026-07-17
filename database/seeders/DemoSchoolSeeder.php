<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Organization;
use App\Models\Institution;
use App\Enums\InstitutionType;
use App\Enums\SubscriptionTier;
use App\Services\OnboardingService;

class DemoSchoolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $org = Organization::firstOrCreate(
            ['code' => 'DEMO_ORG'],
            [
                'name' => 'Demo Organization',
                'email' => 'demo@example.com',
                'phone' => '1234567890',
            ]
        );

        $tier = SubscriptionTier::PLUS;
        $cap = fn($v) => min($v, 2147483647);
        $org->subscription()->updateOrCreate(
            ['organization_id' => $org->id],
            [
                'tier'                 => $tier->value,
                'billing_cycle'        => 'annual',
                'max_institutions'     => $cap($tier->maxInstitutions()),
                'max_users'            => $cap($tier->maxUsers()),
                'max_staff'            => $cap($tier->maxStaff()),
                'max_emails_per_month' => $cap($tier->maxEmailsPerMonth()),
                'storage_quota_gb'     => $cap($tier->storageQuotaGb()),
                'subscription_start'   => now(),
            ]
        );

        $institution = Institution::firstOrCreate(
            ['code' => 'DEMO_SCH'],
            [
                'organization_id' => $org->id,
                'name' => 'Demo School',
                'type' => InstitutionType::SCHOOL,
                'email' => 'school@demo.com',
                'phone' => '1234567890',
                'address' => 'Demo Address',
                'city' => 'Demo City',
                'state' => 'Demo State',
                'pincode' => '123456',
                'status' => 1,
            ]
        );

        $user = \App\Models\User::updateOrCreate(
            ['email' => 'school@demo.com'],
            [
                'name' => 'Demo Admin',
                'institution_id' => $institution->id,
                'password' => \Illuminate\Support\Facades\Hash::make('1234567890'),
                'email_verified_at' => now(),
                'status' => 1,
            ]
        );

        $role = \App\Models\Role::withoutGlobalScope('institution_scope')
            ->where('key', 'institution_admin')
            ->first();

        if ($role) {
            \Illuminate\Support\Facades\DB::table('user_roles')->updateOrInsert(
                [
                    'user_id' => $user->id,
                    'role_id' => $role->id,
                    'institution_id' => $institution->id,
                ],
                ['assigned_at' => now()]
            );
        }

        $onboarding = app(OnboardingService::class);
        $user->workflows()->wherePivot('institution_id', $institution->id)->detach();
        $onboarding->activateWorkflows($user, $institution, $tier);

        // --- Seed Basic Academics for Demo School ---
        $session2025 = \App\Models\Session::updateOrCreate(
            ['institution_id' => $institution->id, 'start_year' => 2025, 'end_year' => 2026],
            ['name' => '2025-2026', 'is_current' => false, 'status' => 1]
        );

        $session2026 = \App\Models\Session::updateOrCreate(
            ['institution_id' => $institution->id, 'start_year' => 2026, 'end_year' => 2027],
            ['name' => '2026-2027', 'is_current' => true, 'status' => 1]
        );

        $session = $session2026;

        $mainStreams = [
            'PREPRI' => ['name' => 'Pre-Primary'],
            'PRI'    => ['name' => 'Primary'],
            'MID'    => ['name' => 'Middle'],
            'SEC'    => ['name' => 'Secondary'],
            'SRSEC'  => ['name' => 'Sr. Secondary'],
        ];

        $msModels = [];
        foreach ($mainStreams as $code => $msData) {
            $msModels[$code] = \App\Models\MainStream::withoutGlobalScope('institution_scope')->updateOrCreate(
                ['institution_id' => $institution->id, 'code' => $code],
                ['name' => $msData['name'], 'status' => 1]
            );
        }

        $streams = [
            ['ms' => 'PREPRI', 'name' => 'Nursery', 'code' => 'NUR'],
            ['ms' => 'PREPRI', 'name' => 'LKG', 'code' => 'LKG'],
            ['ms' => 'PREPRI', 'name' => 'UKG', 'code' => 'UKG'],
            ['ms' => 'PRI', 'name' => 'Class I', 'code' => 'CLS-1'],
            ['ms' => 'PRI', 'name' => 'Class II', 'code' => 'CLS-2'],
            ['ms' => 'PRI', 'name' => 'Class III', 'code' => 'CLS-3'],
            ['ms' => 'PRI', 'name' => 'Class IV', 'code' => 'CLS-4'],
            ['ms' => 'PRI', 'name' => 'Class V', 'code' => 'CLS-5'],
            ['ms' => 'MID', 'name' => 'Class VI', 'code' => 'CLS-6'],
            ['ms' => 'MID', 'name' => 'Class VII', 'code' => 'CLS-7'],
            ['ms' => 'MID', 'name' => 'Class VIII', 'code' => 'CLS-8'],
            ['ms' => 'SEC', 'name' => 'Class IX', 'code' => 'CLS-9'],
            ['ms' => 'SEC', 'name' => 'Class X', 'code' => 'CLS-10'],
            ['ms' => 'SRSEC', 'name' => 'Class XI - Science', 'code' => 'CLS-11-SCI'],
            ['ms' => 'SRSEC', 'name' => 'Class XI - Commerce', 'code' => 'CLS-11-COM'],
            ['ms' => 'SRSEC', 'name' => 'Class XII - Science', 'code' => 'CLS-12-SCI'],
            ['ms' => 'SRSEC', 'name' => 'Class XII - Commerce', 'code' => 'CLS-12-COM'],
        ];

        foreach ($streams as $s) {
            $stream = \App\Models\Stream::withoutGlobalScope('institution_scope')->updateOrCreate(
                ['institution_id' => $institution->id, 'code' => $s['code']],
                ['main_stream_id' => $msModels[$s['ms']]->id, 'name' => $s['name'], 'duration_years' => 1, 'status' => 1]
            );
            
            \App\Models\LmsClass::withoutGlobalScopes()->updateOrCreate(
                ['institution_id' => $institution->id, 'stream_id' => $stream->id, 'session_id' => $session->id, 'section' => 'A'],
                ['name' => $stream->name . ' - Section A', 'code' => $stream->code, 'status' => 1]
            );
        }

        // --- Seed Examination Data ---
        // 1. Subjects
        $subjectsByStream = [
            'NUR' => ['English', 'Hindi', 'Mathematics', 'Drawing', 'Rhymes'],
            'LKG' => ['English', 'Hindi', 'Mathematics', 'Drawing', 'Rhymes', 'GK'],
            'UKG' => ['English', 'Hindi', 'Mathematics', 'Drawing', 'GK', 'Computer'],
            'CLS-1' => ['English', 'Hindi', 'Mathematics', 'EVS', 'Art', 'Physical Education'],
            'CLS-2' => ['English', 'Hindi', 'Mathematics', 'EVS', 'Art', 'Physical Education'],
            'CLS-3' => ['English', 'Hindi', 'Mathematics', 'EVS', 'Art', 'Physical Education'],
            'CLS-4' => ['English', 'Hindi', 'Mathematics', 'EVS', 'Art', 'Physical Education'],
            'CLS-5' => ['English', 'Hindi', 'Mathematics', 'EVS', 'Computer Science', 'Physical Education'],
            'CLS-6' => ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Sanskrit', 'Physical Education'],
            'CLS-7' => ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Sanskrit', 'Physical Education'],
            'CLS-8' => ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Sanskrit', 'Computer Science', 'Physical Education'],
            'CLS-9' => ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Computer Applications', 'Physical Education'],
            'CLS-10' => ['English', 'Hindi', 'Mathematics', 'Science', 'Social Science', 'Computer Applications', 'Physical Education'],
            'CLS-11-SCI' => ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'PE'],
            'CLS-11-COM' => ['Accountancy', 'Business Studies', 'Economics', 'Mathematics', 'English', 'PE'],
            'CLS-12-SCI' => ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'English', 'PE'],
            'CLS-12-COM' => ['Accountancy', 'Business Studies', 'Economics', 'Mathematics', 'English', 'PE'],
        ];

        $allSubjectModels = [];

        foreach ($subjectsByStream as $streamCode => $subjects) {
            $stream = \App\Models\Stream::withoutGlobalScope('institution_scope')->where('institution_id', $institution->id)->where('code', $streamCode)->first();
            if ($stream) {
                foreach ($subjects as $idx => $subjName) {
                    $subject = \App\Models\Subject::withoutGlobalScope('institution_scope')->updateOrCreate(
                        ['institution_id' => $institution->id, 'code' => strtoupper(substr($subjName, 0, 3)) . '-' . $streamCode],
                        ['name' => $subjName, 'status' => 1, 'stream_id' => $stream->id]
                    );
                    $allSubjectModels[$streamCode][] = $subject;

                    \App\Models\ClassSubjectAllocation::updateOrCreate([
                        'institution_id' => $institution->id,
                        'session_id' => $session->id,
                        'stream_id' => $stream->id,
                        'subject_id' => $subject->id,
                    ]);
                }
            }
        }

        // 2. Grading Scale
        $gradingScale = \App\Models\ExamGradingScale::withoutGlobalScope('institution_scope')->updateOrCreate(
            ['institution_id' => $institution->id, 'name' => 'CBSE Grading Scale'],
            ['description' => 'Standard CBSE 9-point grading scale', 'status' => 1]
        );

        $gradeRules = [
            ['grade' => 'A1', 'min_percentage' => 91, 'max_percentage' => 100, 'grade_point' => 10, 'description' => 'Outstanding'],
            ['grade' => 'A2', 'min_percentage' => 81, 'max_percentage' => 90, 'grade_point' => 9, 'description' => 'Excellent'],
            ['grade' => 'B1', 'min_percentage' => 71, 'max_percentage' => 80, 'grade_point' => 8, 'description' => 'Very Good'],
            ['grade' => 'B2', 'min_percentage' => 61, 'max_percentage' => 70, 'grade_point' => 7, 'description' => 'Good'],
            ['grade' => 'C1', 'min_percentage' => 51, 'max_percentage' => 60, 'grade_point' => 6, 'description' => 'Above Average'],
            ['grade' => 'C2', 'min_percentage' => 41, 'max_percentage' => 50, 'grade_point' => 5, 'description' => 'Average'],
            ['grade' => 'D', 'min_percentage' => 33, 'max_percentage' => 40, 'grade_point' => 4, 'description' => 'Marginal'],
            ['grade' => 'E', 'min_percentage' => 0, 'max_percentage' => 32, 'grade_point' => 0, 'description' => 'Needs Improvement'],
        ];

        foreach ($gradeRules as $rule) {
            \App\Models\ExamGradingRule::updateOrCreate(
                ['exam_grading_scale_id' => $gradingScale->id, 'grade' => $rule['grade']],
                $rule
            );
        }

        // 3. Exam Term
        $term1 = \App\Models\ExamTerm::withoutGlobalScope('institution_scope')->updateOrCreate(
            ['institution_id' => $institution->id, 'session_id' => $session->id, 'name' => 'Term 1'],
            ['status' => 1]
        );

        \App\Models\ExamTerm::withoutGlobalScope('institution_scope')->updateOrCreate(
            ['institution_id' => $institution->id, 'session_id' => $session->id, 'name' => 'Term 2'],
            ['status' => 1]
        );

        // 4. Exam
        $exam = \App\Models\Exam::withoutGlobalScope('institution_scope')->updateOrCreate(
            ['institution_id' => $institution->id, 'session_id' => $session->id, 'exam_term_id' => $term1->id, 'name' => 'Half Yearly Examination'],
            ['exam_grading_scale_id' => $gradingScale->id, 'status' => 1]
        );

        // 5. Exam Schedules & 6. Students for All Streams
        $allClasses = \App\Models\LmsClass::withoutGlobalScopes()->where('institution_id', $institution->id)->get();
        
        $studentCounter = 1;

        foreach ($allClasses as $lmsClass) {
            $stream = \App\Models\Stream::withoutGlobalScope('institution_scope')->find($lmsClass->stream_id);
            if (!$stream) continue;

            $streamSubjects = $allSubjectModels[$stream->code] ?? [];
            
            $startDate = now()->addDays(10);
            foreach ($streamSubjects as $idx => $subject) {
                \App\Models\ExamSchedule::withoutGlobalScope('institution_scope')->updateOrCreate(
                    [
                        'exam_id' => $exam->id,
                        'lms_class_id' => $lmsClass->id,
                        'subject_id' => $subject->id,
                        'type' => 'theory'
                    ],
                    [
                        'exam_date' => $startDate->copy()->addDays($idx * 2)->format('Y-m-d'),
                        'start_time' => '10:00:00',
                        'end_time' => '13:00:00',
                        'full_marks' => 100,
                        'pass_marks' => 33,
                    ]
                );
            }

            // Removed Demo Student seeding as per user request
            // for ($i = 1; $i <= 5; $i++) { ... }
        }

        $this->command->info('Demo School and Admin User (school@demo.com / 1234567890) seeded successfully with full workflow access!');
    }
}
