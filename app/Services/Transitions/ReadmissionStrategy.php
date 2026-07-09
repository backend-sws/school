<?php

namespace App\Services\Transitions;

use App\Contracts\TransitionStrategyInterface;
use App\Models\LmsClassEnrollment;
use App\Models\ReadmissionDetail;
use App\Models\StudentProfile;
use App\Models\StudentTransition;
use InvalidArgumentException;

class ReadmissionStrategy implements TransitionStrategyInterface
{
    public function validate(StudentProfile $student, array $data): void
    {
        $eligible = config('admission.readmission_eligible_statuses', ['dropped', 'transferred', 'alumni']);

        if (!in_array($student->enrollment_status, $eligible)) {
            throw new InvalidArgumentException(
                "Student #{$student->id} is not eligible for re-admission (current: {$student->enrollment_status}). Must be one of: " . implode(', ', $eligible)
            );
        }

        if (empty($data['to_session_id'])) {
            throw new InvalidArgumentException('Target session is required for re-admission.');
        }

        // Prevent re-admitting to the same session
        if ($student->session_id && (int) $student->session_id === (int) $data['to_session_id']) {
            throw new InvalidArgumentException(
                "Student #{$student->id} is already enrolled in session #{$data['to_session_id']}."
            );
        }
    }

    public function execute(StudentTransition $transition, array $data): void
    {
        $student = $transition->studentProfile;

        // 1. Create readmission detail (morph)
        $detail = ReadmissionDetail::create([
            'admission_application_id' => $data['admission_application_id'] ?? null,
            'dropout_reason' => $data['dropout_reason'] ?? null,
            'gap_duration_months' => $data['gap_duration_months'] ?? null,
            'previous_enrollment_status' => $student->enrollment_status,
        ]);

        $transition->update([
            'transitionable_type' => ReadmissionDetail::class,
            'transitionable_id' => $detail->id,
            'status' => 'approved',
            'processed_at' => now(),
        ]);

        // 2. Deactivate old class enrollment (mirroring PromotionStrategy)
        if ($transition->from_class_id) {
            LmsClassEnrollment::where('user_id', $student->user_id)
                ->where('lms_class_id', $transition->from_class_id)
                ->where('status', 'active')
                ->update(['status' => 'readmitted']);
        }

        // 3. Update student profile to new session/semester
        $student->update([
            'session_id' => $transition->to_session_id,
            'current_semester' => $transition->to_semester ?? $student->current_semester,
            'stream_id' => $data['to_stream_id'] ?? $student->stream_id,
        ]);

        // 4. Create new class enrollment if target class specified
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

        // 5. Mark as active
        $student->update(['enrollment_status' => 'active']);
    }

    public function rollback(StudentTransition $transition): void
    {
        $student = $transition->studentProfile;
        $detail = $transition->transitionable;

        // Restore previous session/semester/status
        $student->update([
            'session_id' => $transition->from_session_id,
            'current_semester' => $transition->from_semester,
            'enrollment_status' => $detail?->previous_enrollment_status ?? 'dropped',
        ]);

        // Restore old class enrollment
        if ($transition->from_class_id) {
            LmsClassEnrollment::where('user_id', $student->user_id)
                ->where('lms_class_id', $transition->from_class_id)
                ->where('status', 'readmitted')
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
