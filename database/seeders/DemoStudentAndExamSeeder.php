<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Institution;
use App\Models\User;
use App\Models\StudentProfile;
use App\Models\LmsClass;
use App\Models\LmsClassEnrollment;
use App\Models\ExamSchedule;
use App\Models\ExamMark;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class DemoStudentAndExamSeeder extends Seeder
{
    public function run(): void
    {
        $institution = Institution::where('code', 'DEMO_SCH')->first();
        if (!$institution) {
            $this->command->error('Demo school not found. Please run DemoSchoolSeeder first.');
            return;
        }

        $session = \App\Models\Session::where('institution_id', $institution->id)
            ->where('is_current', true)
            ->first();

        if (!$session) {
            $this->command->error('No active session found.');
            return;
        }

        $allClasses = LmsClass::withoutGlobalScopes()->where('institution_id', $institution->id)->get();
        $studentRole = \App\Models\Role::withoutGlobalScopes()->where('key', 'student')->first();
        
        if (!$studentRole) {
            $this->command->error('Student role not found.');
            return;
        }

        DB::beginTransaction();
        try {
            foreach ($allClasses as $lmsClass) {
                $this->command->info("Seeding students for class: {$lmsClass->name}");
                
                $stream = \App\Models\Stream::withoutGlobalScope('institution_scope')->find($lmsClass->stream_id);
                if (!$stream) continue;

                $schedules = ExamSchedule::withoutGlobalScope('institution_scope')
                    ->where('lms_class_id', $lmsClass->id)
                    ->get();

                for ($i = 1; $i <= 5; $i++) {
                    // Create User
                    $email = strtolower(str_replace(' ', '', $lmsClass->code)) . "_student{$i}@demo.com";
                    $user = User::updateOrCreate(
                        ['email' => $email],
                        [
                            'name' => "Student {$i} ({$lmsClass->name})",
                            'institution_id' => $institution->id,
                            'password' => Hash::make('password'),
                            'email_verified_at' => now(),
                            'status' => 1,
                        ]
                    );

                    // Assign Role
                    DB::table('user_roles')->updateOrInsert(
                        [
                            'user_id' => $user->id,
                            'role_id' => $studentRole->id,
                            'institution_id' => $institution->id,
                        ],
                        ['assigned_at' => now()]
                    );

                    // Create StudentProfile
                    $profile = StudentProfile::updateOrCreate(
                        ['user_id' => $user->id],
                        [
                            'institution_id' => $institution->id,
                            'stream_id' => $stream->id,
                            'session_id' => $session->id,
                            'reg_no' => "REG-" . $lmsClass->id . "-" . $i,
                            'roll_no' => $i,
                            'gender' => $i % 2 == 0 ? 'Female' : 'Male',
                            'dob' => now()->subYears(15)->format('Y-m-d'),
                            'enrollment_status' => 'enrolled',
                            'blood_group' => 'O+',
                        ]
                    );

                    // Create Class Enrollment
                    LmsClassEnrollment::updateOrCreate(
                        ['lms_class_id' => $lmsClass->id, 'user_id' => $user->id],
                        ['role' => 'student', 'status' => 'active', 'enrolled_at' => now()]
                    );

                    // Seed Exam Marks
                    foreach ($schedules as $schedule) {
                        ExamMark::updateOrCreate(
                            [
                                'exam_schedule_id' => $schedule->id,
                                'student_profile_id' => $profile->id,
                                'user_id' => $user->id,
                            ],
                            [
                                'marks_obtained' => rand((int) $schedule->pass_marks, (int) $schedule->full_marks),
                                'is_absent' => false,
                                'grader_id' => null,
                            ]
                        );
                    }
                }
            }
            DB::commit();
            $this->command->info('Students and exam marks seeded successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            $this->command->error("Error seeding students: " . $e->getMessage());
        }
    }
}
