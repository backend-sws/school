<?php

namespace App\Services;

use App\Models\AdmissionApplication;
use App\Models\StudentProfile;
use App\Support\InstitutionContext;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

/**
 * ReAdmissionService — Orchestrator (Software Factory Pattern)
 *
 * Single entry point for all session-to-session re-admission operations.
 * Pipeline: Eligibility → Fee Preview → Create Application → Execute Transition
 *
 * Reuses:
 *  - FeeCalculationEngine   (fee math)
 *  - StudentTransitionService (transition orchestration)
 *  - ReadmissionStrategy      (enrollment changes)
 */
class ReAdmissionService
{
    public function __construct(
        protected FeeCalculationEngine $feeEngine,
        protected StudentTransitionService $transitionService,
    ) {}

    // ═══════════════════════════════════════════════════════════════════
    //  ELIGIBILITY
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Get students eligible for session-to-session re-admission.
     * Filters active/promoted students in the given session who haven't
     * already been re-admitted to the target session.
     */
    public function getEligibleStudents(int $institutionId, ?int $fromSessionId = null, ?int $streamId = null): Collection
    {
        $filters = [
            'include_active' => true,
        ];

        if ($fromSessionId) {
            $filters['session_id'] = $fromSessionId;
        }
        if ($streamId) {
            $filters['stream_id'] = $streamId;
        }

        return $this->transitionService->getReadmissionEligible($institutionId, $filters);
    }

    // ═══════════════════════════════════════════════════════════════════
    //  FEE PREVIEW
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Preview the fee breakdown for a student being re-admitted.
     * Delegates entirely to FeeCalculationEngine (Software Factory reuse).
     */
    public function previewFees(
        int $institutionId,
        int $admissionHeadId,
        ?string $category = null,
        ?string $gender = null,
    ): array {
        return $this->feeEngine->calculateAdmissionFee(
            $institutionId,
            $admissionHeadId,
            $category,
            $gender,
        );
    }

    // ═══════════════════════════════════════════════════════════════════
    //  PROCESS (Individual)
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Process a single student re-admission.
     *
     * Pipeline:
     * 1. Validate student exists and is eligible
     * 2. Create AdmissionApplication (type: readmission) from existing profile
     * 3. Execute transition via StudentTransitionService
     *
     * @return array{transition: \App\Models\StudentTransition, application: AdmissionApplication|null}
     */
    public function process(int $studentProfileId, array $data, int $processedBy): array
    {
        $student = StudentProfile::with('user')->findOrFail($studentProfileId);

        return DB::transaction(function () use ($student, $data, $processedBy) {
            // 1. Optionally create an AdmissionApplication for audit trail
            $application = null;
            if ($data['create_application'] ?? false) {
                $application = $this->createReadmissionApplication($student, $data);
            }

            // 2. Execute the transition
            $transition = $this->transitionService->process('readmission', $student, array_merge($data, [
                'admission_application_id' => $application?->id,
            ]), $processedBy);

            return [
                'transition' => $transition,
                'application' => $application,
            ];
        });
    }

    // ═══════════════════════════════════════════════════════════════════
    //  BULK PROCESS
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Batch re-admit students by filters.
     * Delegates to StudentTransitionService::bulkReadmit() (Software Factory reuse).
     */
    public function bulkProcess(
        int $toSessionId,
        ?int $toSemester,
        ?int $toClassId,
        array $filters,
        array $excludeIds,
        int $processedBy,
    ): array {
        return $this->transitionService->bulkReadmit(
            $toSessionId,
            $toSemester,
            $toClassId,
            $filters,
            $excludeIds,
            $processedBy,
        );
    }

    // ═══════════════════════════════════════════════════════════════════
    //  PRIVATE HELPERS
    // ═══════════════════════════════════════════════════════════════════

    /**
     * Create an AdmissionApplication record (type: readmission) from existing StudentProfile.
     * Auto-fills fields from the student profile — no re-entry of data.
     */
    private function createReadmissionApplication(StudentProfile $student, array $data): AdmissionApplication
    {
        return AdmissionApplication::create([
            'application_type' => 'readmission',
            'user_id' => $student->user_id,
            'institution_id' => $student->institution_id,
            'session_id' => $data['to_session_id'],
            'applicant_name' => $student->user?->name,
            'father_name' => $student->father_name,
            'mother_name' => $student->mother_name,
            'dob' => $student->dob,
            'gender' => $student->gender,
            'category' => $student->category,
            'religion' => $student->religion,
            'nationality' => $student->nationality,
            'mobile' => $student->mobile,
            'email' => $student->user?->email,
            'blood_group' => $student->blood_group,
            'process_status' => 'approved',
            'processed_by' => $data['processed_by'] ?? null,
            'processed_at' => now(),
            'submitted_at' => now(),
            'admission_date' => now(),
            'remarks' => $data['remarks'] ?? 'Session-to-session re-admission',
        ]);
    }
}
