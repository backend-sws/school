<?php

namespace App\Http\Controllers\Api\V1\Admission;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\StudentProfile;
use App\Models\StudentTransition;
use App\Services\ReAdmissionService;
use App\Services\StudentTransitionService;
use App\Support\InstitutionContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReadmissionController extends BaseController
{
    public function __construct(
        protected StudentTransitionService $service,
        protected ReAdmissionService $reAdmissionService,
    ) {}

    /**
     * List students eligible for re-admission.
     * Supports ?include_active=1 for session-to-session, ?from_session_id, ?stream_id filters.
     */
    public function eligible(Request $request): JsonResponse
    {
        $institutionId = InstitutionContext::getActiveInstitutionId($request->user());

        $includeActive = $request->boolean('include_active');

        if ($includeActive) {
            $students = $this->reAdmissionService->getEligibleStudents(
                $institutionId,
                $request->integer('from_session_id') ?: null,
                $request->integer('stream_id') ?: null,
            );
        } else {
            $students = $this->service->getReadmissionEligible($institutionId);
        }

        return $this->success($students, 'Re-admission eligible students retrieved.');
    }

    /**
     * Get pre-filled data from an existing student profile for re-admission form.
     * Returns complete form-compatible shape for the admission wizard.
     */
    public function prefill(Request $request, StudentProfile $studentProfile): JsonResponse
    {
        $studentProfile->load(['user', 'stream', 'session']);

        $feeService = app(\App\Services\FeeCollectionService::class);
        $institutionId = InstitutionContext::getActiveInstitutionId($request->user());
        $ledger = $feeService->getStudentLedgerMatrix($studentProfile->user, $institutionId, $studentProfile->session_id);
        $previousSessionDues = $ledger['total_pending'] ?? 0;

        // Build address_snapshot from StudentProfile flat fields
        $addressSnapshot = [
            'correspondence' => [
                'line1' => $studentProfile->address ?? '',
                'line2' => '',
                'city'  => $studentProfile->city ?? '',
                'state' => $studentProfile->state ?? '',
                'pincode' => $studentProfile->pincode ?? '',
            ],
            'permanent' => [
                'line1' => $studentProfile->address ?? '',
                'line2' => '',
                'city'  => $studentProfile->city ?? '',
                'state' => $studentProfile->state ?? '',
                'pincode' => $studentProfile->pincode ?? '',
            ],
        ];

        // Try to fetch previous admission application to get original guardian snapshot
        $previousApp = \App\Models\AdmissionApplication::where('user_id', $studentProfile->user_id)
            ->whereNotNull('guardian_snapshot')
            ->latest('id')
            ->first();

        $prevGuardian = $previousApp ? $previousApp->guardian_snapshot : [];

        // Check if there is an existing draft or pending application for this student
        $existingDraft = \App\Models\AdmissionApplication::where('user_id', $studentProfile->user_id)
            ->where('application_type', 're-admission')
            ->whereIn('process_status', ['draft', 'pending'])
            ->latest('id')
            ->first();

        // Map guardian from StudentProfile parent columns and fallback to previous app
        $guardianSnapshot = [
            'name'       => $studentProfile->father_name ?? $prevGuardian['name'] ?? '',
            'occupation' => $studentProfile->father_occupation ?? $prevGuardian['occupation'] ?? '',
            'aadhaar_no' => $prevGuardian['aadhaar_no'] ?? '',
            'income'     => $prevGuardian['income'] ?? 0,
            'local_guardian' => [
                'name' => $prevGuardian['local_guardian']['name'] ?? '',
                'phone' => $prevGuardian['local_guardian']['phone'] ?? '',
                'relationship' => $prevGuardian['local_guardian']['relationship'] ?? ''
            ],
            'emergency_contact' => [
                'name' => $prevGuardian['emergency_contact']['name'] ?? '',
                'relationship' => $prevGuardian['emergency_contact']['relationship'] ?? '',
                'mobile' => $studentProfile->father_mobile ?? $prevGuardian['emergency_contact']['mobile'] ?? '',
                'alternate_mobile' => $prevGuardian['emergency_contact']['alternate_mobile'] ?? ''
            ],
        ];
        
        $hasLocalGuardian = !empty($guardianSnapshot['local_guardian']['name']);

        return $this->success([
            'student_profile_id' => $studentProfile->id,
            'prefill' => $existingDraft ? array_merge([
                // Base prefill data
                'id' => $existingDraft->id,
                'application_id' => $existingDraft->application_id,
                'process_status' => $existingDraft->process_status,
            ], $existingDraft->toArray(), [
                // Overrides to ensure UI compatibility
                '_from_stream_id'   => $studentProfile->stream_id,
                '_from_stream_name' => $studentProfile->stream?->name,
                '_from_session_id'  => $studentProfile->session_id,
                '_from_session_name' => $studentProfile->session?->name,
                '_from_semester'    => $studentProfile->current_semester,
                '_from_reg_no'      => $studentProfile->reg_no,
                '_previous_session_dues' => $previousSessionDues,
                // Fetch assignments (latest, even if expired, for prefill convenience)
                '_transportAssignment' => $transportAssignment = \App\Models\TransportAssignment::where('user_id', $studentProfile->user_id)
                                ->latest('created_at')->first(),
                '_hostelAllocation' => $hostelAllocation = \App\Models\HostelAllocation::where('user_id', $studentProfile->user_id)
                                ->latest('created_at')->first(),
            ]) : [
                // Identity
                'applicant_name' => $studentProfile->user?->name,
                'father_name'    => $studentProfile->father_name,
                'father_mobile'  => $studentProfile->father_mobile,
                'father_qualification' => $studentProfile->father_qualification,
                'mother_name'    => $studentProfile->mother_name,
                'dob'            => $studentProfile->dob?->format('Y-m-d'),
                'gender'         => $studentProfile->gender,
                'category'       => $studentProfile->category,
                'caste'          => $studentProfile->caste,
                'religion'       => $studentProfile->religion,
                'nationality'    => $studentProfile->nationality,
                'mobile'         => $studentProfile->mobile,
                'email'          => $studentProfile->user?->email,
                'aadhaar_no'     => $studentProfile->aadhar_no,
                'abc_id'         => $studentProfile->abc_no,
                'apaar_id'       => $studentProfile->apaar_id,
                'blood_group'    => $studentProfile->blood_group,

                // Address & Guardian
                'address_snapshot'  => $addressSnapshot,
                'guardian_snapshot'  => $guardianSnapshot,
                'has_local_guardian' => $hasLocalGuardian,

                // Medical
                'medical_condition' => $studentProfile->medical_condition,
                'disability'     => $studentProfile->disability_type,
                'allergy'        => $studentProfile->allergy,

                // Documents
                'documents' => \App\Models\StudentDocument::where('user_id', $studentProfile->user_id)
                                ->where('institution_id', $studentProfile->institution_id)
                                ->pluck('file_url', 'document_type')
                                ->toArray(),
                
                // Fetch assignments (latest, even if expired, for prefill convenience)
                '_transportAssignment' => $transportAssignment = \App\Models\TransportAssignment::where('user_id', $studentProfile->user_id)
                                ->latest('created_at')->first(),
                '_hostelAllocation' => $hostelAllocation = \App\Models\HostelAllocation::where('user_id', $studentProfile->user_id)
                                ->latest('created_at')->first(),

                // Display-only metadata for "From → To" transition
                '_from_stream_id'   => $studentProfile->stream_id,
                '_from_stream_name' => $studentProfile->stream?->name,
                '_from_session_id'  => $studentProfile->session_id,
                '_from_session_name' => $studentProfile->session?->name,
                '_from_semester'    => $studentProfile->current_semester,
                '_from_reg_no'      => $studentProfile->reg_no,
                '_previous_session_dues' => $previousSessionDues,

                // Previous Education (pre-fill with current org since they are re-admitting)
                'previous_school_name' => $studentProfile->institution?->name ?? '',
                'previous_board'       => $studentProfile->previous_board,
                'previous_marks'       => $studentProfile->previous_marks,
                'has_tc'               => (bool)$studentProfile->has_tc,
                'has_government_portal'=> (bool)$studentProfile->has_government_portal,
                'government_portal_name'=> $studentProfile->government_portal_name,
                // Transport
                'transport_route_id' => $transportAssignment?->transport_route_id ?? '',
                'transport_stop_id'  => $transportAssignment?->transport_stop_id ?? '',
                'transport_amount'   => $transportAssignment?->monthly_amount ?? 0,

                // Hostel
                'hostel_required' => $hostelAllocation ? true : false,
                'hostel_id'       => $hostelAllocation?->room?->hostel_id ?? '',
                'hostel_room_id'  => $hostelAllocation?->hostel_room_id ?? '',
                'hostel_amount'   => $hostelAllocation?->room?->monthly_fee ?? $hostelAllocation?->monthly_amount ?? 0,
            ],
        ], 'Pre-filled data retrieved.');
    }

    /**
     * Preview fee breakdown for a student being re-admitted.
     */
    public function previewFees(Request $request, int $studentProfileId): JsonResponse
    {
        $request->validate([
            'admission_head_id' => 'required|integer|exists:admission_heads,id',
        ]);

        $institutionId = InstitutionContext::getActiveInstitutionId($request->user());
        $student = StudentProfile::findOrFail($studentProfileId);

        $breakdown = $this->reAdmissionService->previewFees(
            $institutionId,
            $request->integer('admission_head_id'),
            $student->category,
            $student->gender,
        );

        return $this->success($breakdown, 'Fee preview generated.');
    }

    /**
     * Process a single re-admission.
     */
    public function process(Request $request): JsonResponse
    {
        $data = $request->validate([
            'student_profile_id' => 'required|exists:student_profiles,id',
            'to_session_id' => 'required|exists:sessions,id',
            'to_semester' => 'nullable|integer|min:1',
            'to_class_id' => 'nullable|exists:lms_classes,id',
            'to_stream_id' => 'nullable|exists:streams,id',
            'dropout_reason' => 'nullable|string|max:500',
            'gap_duration_months' => 'nullable|integer|min:0',
            'admission_application_id' => 'nullable|exists:admission_applications,id',
            'remarks' => 'nullable|string|max:500',
            'create_application' => 'nullable|boolean',
        ]);

        try {
            $result = $this->reAdmissionService->process(
                $data['student_profile_id'],
                array_merge($data, ['processed_by' => $request->user()->id]),
                $request->user()->id,
            );

            return $this->success($result, 'Student re-admitted successfully.');
        } catch (\InvalidArgumentException $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    /**
     * Bulk re-admit students by session/stream/class filters.
     */
    public function bulk(Request $request): JsonResponse
    {
        $request->validate([
            'to_session_id' => 'required|integer|exists:sessions,id',
            'to_semester' => 'nullable|integer',
            'to_class_id' => 'nullable|integer|exists:lms_classes,id',
            'from_session_id' => 'nullable|integer|exists:sessions,id',
            'stream_id' => 'nullable|integer|exists:streams,id',
            'exclude_ids' => 'nullable|array',
            'exclude_ids.*' => 'integer',
        ]);

        $institutionId = InstitutionContext::getActiveInstitutionId($request->user());

        try {
            $result = $this->reAdmissionService->bulkProcess(
                $request->integer('to_session_id'),
                $request->integer('to_semester') ?: null,
                $request->integer('to_class_id') ?: null,
                [
                    'institution_id' => $institutionId,
                    'session_id' => $request->integer('from_session_id') ?: null,
                    'stream_id' => $request->integer('stream_id') ?: null,
                ],
                $request->input('exclude_ids', []),
                $request->user()->id,
            );

            return $this->success($result, "Bulk re-admission completed: {$result['readmitted']} re-admitted, {$result['skipped']} skipped.");
        } catch (\Throwable $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    /**
     * Rollback a re-admission.
     */
    public function rollback(Request $request, StudentTransition $transition): JsonResponse
    {
        if ($transition->type !== 'readmission') {
            return $this->error('This transition is not a re-admission.', 422);
        }

        try {
            $this->service->rollback($transition, $request->user()->id);
            return $this->success(null, 'Re-admission rolled back successfully.');
        } catch (\InvalidArgumentException $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    /**
     * Re-admission history.
     */
    public function history(Request $request): JsonResponse
    {
        $institutionId = InstitutionContext::getActiveInstitutionId($request->user());

        $transitions = StudentTransition::where('institution_id', $institutionId)
            ->readmissions()
            ->with(['studentProfile.user', 'fromSession', 'toSession', 'processedBy', 'transitionable'])
            ->orderByDesc('created_at')
            ->paginate($request->get('per_page', 20));

        return $this->paginated($transitions);
    }
}

