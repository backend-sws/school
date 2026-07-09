<?php

namespace App\Services;

use App\Contracts\TransitionStrategyInterface;
use App\Models\StudentProfile;
use App\Models\StudentTransition;
use App\Services\Transitions\PromotionStrategy;
use App\Services\Transitions\ReadmissionStrategy;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use InvalidArgumentException;

class StudentTransitionService
{
    /**
     * Resolve the strategy for the given transition type.
     */
    protected function resolveStrategy(string $type): TransitionStrategyInterface
    {
        return match ($type) {
            'promotion' => new PromotionStrategy(),
            'readmission' => new ReadmissionStrategy(),
            default => throw new InvalidArgumentException("Unknown transition type: {$type}"),
        };
    }

    /**
     * Process a single student transition.
     */
    public function process(string $type, StudentProfile $student, array $data, int $processedBy): StudentTransition
    {
        $strategy = $this->resolveStrategy($type);
        $strategy->validate($student, $data);

        return DB::transaction(function () use ($type, $student, $data, $strategy, $processedBy) {
            $transition = StudentTransition::create([
                'institution_id' => $student->institution_id,
                'student_profile_id' => $student->id,
                'user_id' => $student->user_id,
                'type' => $type,
                'from_session_id' => $student->session_id,
                'to_session_id' => $data['to_session_id'],
                'from_semester' => $student->current_semester,
                'to_semester' => $data['to_semester'] ?? null,
                'from_class_id' => $data['from_class_id'] ?? null,
                'to_class_id' => $data['to_class_id'] ?? null,
                'from_section_id' => $data['from_section_id'] ?? null,
                'to_section_id' => $data['to_section_id'] ?? null,
                'status' => 'pending',
                'remarks' => $data['remarks'] ?? null,
                'processed_by' => $processedBy,
            ]);

            $strategy->execute($transition, $data);

            return $transition->fresh('transitionable');
        });
    }

    /**
     * Bulk promote students from one session/semester to another.
     *
     * @param  array  $filters  Keys: session_id, stream_id, semester, class_id (all optional)
     * @param  array  $excludeIds  Student profile IDs to exclude (detained)
     * @return array{promoted: int, skipped: int, transitions: Collection}
     */
    public function bulkPromote(
        int $toSessionId,
        ?int $toSemester,
        ?int $toClassId,
        array $filters,
        array $excludeIds,
        int $processedBy,
        array $extraData = []
    ): array {
        $query = StudentProfile::where('institution_id', $filters['institution_id'] ?? null)
            ->where('enrollment_status', 'active');

        if (!empty($filters['session_id'])) {
            $query->where('session_id', $filters['session_id']);
        }
        if (!empty($filters['stream_id'])) {
            $query->where('stream_id', $filters['stream_id']);
        }
        if (!empty($filters['semester'])) {
            $query->where('current_semester', $filters['semester']);
        }

        if (!empty($excludeIds)) {
            $query->whereNotIn('id', $excludeIds);
        }

        $students = $query->get();
        $transitions = collect();
        $skipped = 0;

        foreach ($students as $student) {
            try {
                $transition = $this->process('promotion', $student, array_merge($extraData, [
                    'to_session_id' => $toSessionId,
                    'to_semester' => $toSemester,
                    'to_class_id' => $toClassId,
                    'from_class_id' => $filters['class_id'] ?? null,
                ]), $processedBy);

                $transitions->push($transition);
            } catch (\Throwable $e) {
                $skipped++;
            }
        }

        return [
            'promoted' => $transitions->count(),
            'skipped' => $skipped,
            'transitions' => $transitions,
        ];
    }

    /**
     * Rollback a previously approved transition.
     */
    public function rollback(StudentTransition $transition, int $rolledBackBy): void
    {
        if ($transition->status !== 'approved') {
            throw new InvalidArgumentException(
                "Only approved transitions can be rolled back (current: {$transition->status})."
            );
        }

        $strategy = $this->resolveStrategy($transition->type);

        DB::transaction(function () use ($transition, $strategy) {
            $strategy->rollback($transition);
        });
    }

    /**
     * Bulk re-admit students from one session to another.
     * Mirrors the bulkPromote() pattern (Software Factory reuse).
     *
     * @param  array  $filters  Keys: institution_id, session_id, stream_id, class_id
     * @param  array  $excludeIds  Student profile IDs to exclude
     * @return array{readmitted: int, skipped: int, transitions: Collection}
     */
    public function bulkReadmit(
        int $toSessionId,
        ?int $toSemester,
        ?int $toClassId,
        array $filters,
        array $excludeIds,
        int $processedBy,
        array $extraData = []
    ): array {
        $students = $this->getReadmissionEligible(
            $filters['institution_id'] ?? 0,
            array_merge($filters, ['include_active' => true])
        );

        if (!empty($excludeIds)) {
            $students = $students->whereNotIn('id', $excludeIds);
        }

        $transitions = collect();
        $skipped = 0;

        foreach ($students as $student) {
            try {
                $transition = $this->process('readmission', $student, array_merge($extraData, [
                    'to_session_id' => $toSessionId,
                    'to_semester' => $toSemester,
                    'to_class_id' => $toClassId,
                    'from_class_id' => $filters['class_id'] ?? null,
                ]), $processedBy);

                $transitions->push($transition);
            } catch (\Throwable $e) {
                $skipped++;
            }
        }

        return [
            'readmitted' => $transitions->count(),
            'skipped' => $skipped,
            'transitions' => $transitions,
        ];
    }

    /**
     * Get students eligible for re-admission.
     *
     * @param  array  $filters  Optional keys: include_active, session_id, stream_id
     *   - include_active=true: includes active/promoted students (for session-to-session)
     *   - session_id: filter to specific session
     *   - stream_id: filter to specific stream
     */
    public function getReadmissionEligible(int $institutionId, array $filters = []): Collection
    {
        $query = StudentProfile::where('institution_id', $institutionId)
            ->with('user', 'stream', 'session');

        $includeActive = $filters['include_active'] ?? false;

        if ($includeActive) {
            $query->whereIn('enrollment_status', config('admission.readmission_eligible_statuses', ['dropped', 'transferred', 'alumni']));
        } else {
            $query->whereIn('enrollment_status', config('admission.dropout_readmission_statuses', ['dropped', 'transferred', 'alumni']));
        }

        if (!empty($filters['session_id'])) {
            $query->where('session_id', $filters['session_id']);
        }

        if (!empty($filters['stream_id'])) {
            $query->where('stream_id', $filters['stream_id']);
        }

        return $query->get();
    }
}
