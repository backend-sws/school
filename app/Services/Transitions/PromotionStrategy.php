<?php

namespace App\Services\Transitions;

use App\Contracts\TransitionStrategyInterface;
use App\Models\LmsClassEnrollment;
use App\Models\PromotionDetail;
use App\Models\StudentProfile;
use App\Models\StudentTransition;
use InvalidArgumentException;

class PromotionStrategy implements TransitionStrategyInterface
{
    public function validate(StudentProfile $student, array $data): void
    {
        if (!in_array($student->enrollment_status, ['active', null, ''])) {
            throw new InvalidArgumentException(
                "Student #{$student->id} is not in an active enrollment status (current: {$student->enrollment_status})."
            );
        }

        if (empty($data['to_session_id'])) {
            throw new InvalidArgumentException('Target session is required for promotion.');
        }
    }

    public function execute(StudentTransition $transition, array $data): void
    {
        // 1. Create promotion detail (morph)
        $detail = PromotionDetail::create([
            'is_detained' => $data['is_detained'] ?? false,
            'detention_reason' => $data['detention_reason'] ?? null,
            'academic_result' => $data['academic_result'] ?? null,
        ]);

        $transition->update([
            'transitionable_type' => PromotionDetail::class,
            'transitionable_id' => $detail->id,
            'status' => 'approved',
            'processed_at' => now(),
        ]);

        $student = $transition->studentProfile;

        // 2. If detained, mark as detained and stop
        if ($data['is_detained'] ?? false) {
            $student->update(['enrollment_status' => 'detained']);
            return;
        }

        // 3. Update student profile to next session/semester
        $student->update([
            'session_id' => $transition->to_session_id,
            'current_semester' => $transition->to_semester,
            'enrollment_status' => 'promoted',
        ]);

        // 4. Deactivate old class enrollment
        if ($transition->from_class_id) {
            LmsClassEnrollment::where('user_id', $student->user_id)
                ->where('lms_class_id', $transition->from_class_id)
                ->where('status', 'active')
                ->update(['status' => 'promoted']);
        }

        // 5. Create new class enrollment if target class is specified
        if ($transition->to_class_id) {
            LmsClassEnrollment::updateOrCreate(
                [
                    'user_id' => $student->user_id,
                    'lms_class_id' => $transition->to_class_id,
                ],
                [
                    'enrolled_at' => now(),
                    'role' => 'student',
                    'status' => 'active',
                ]
            );
        }

        // 6. After enrollment settles, mark as active again
        $student->update(['enrollment_status' => 'active']);
    }

    public function rollback(StudentTransition $transition): void
    {
        $student = $transition->studentProfile;

        // Restore previous session/semester
        $student->update([
            'session_id' => $transition->from_session_id,
            'current_semester' => $transition->from_semester,
            'enrollment_status' => 'active',
        ]);

        // Restore old class enrollment
        if ($transition->from_class_id) {
            LmsClassEnrollment::where('user_id', $student->user_id)
                ->where('lms_class_id', $transition->from_class_id)
                ->update(['status' => 'active']);
        }

        // Deactivate new class enrollment
        if ($transition->to_class_id) {
            LmsClassEnrollment::where('user_id', $student->user_id)
                ->where('lms_class_id', $transition->to_class_id)
                ->where('status', 'active')
                ->update(['status' => 'rolled_back']);
        }

        $transition->update(['status' => 'rolled_back']);
    }
}
