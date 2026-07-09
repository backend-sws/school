<?php

namespace App\Http\Controllers\Api\V1\Admission;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\StudentProfile;
use App\Models\StudentTransition;
use App\Services\StudentTransitionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class PromotionController extends BaseController
{
    protected StudentTransitionService $service;

    public function __construct(StudentTransitionService $service)
    {
        $this->service = $service;
    }

    /**
     * List eligible students for promotion.
     */
    public function eligible(Request $request): JsonResponse
    {
        $request->validate([
            'session_id' => 'required|exists:academic_sessions,id',
            'stream_id' => 'nullable|exists:streams,id',
            'semester' => 'nullable|integer|min:1',
            'class_id' => 'nullable|exists:lms_classes,id',
        ]);

        $institutionId = $request->user()->institution_id;

        $query = StudentProfile::where('institution_id', $institutionId)
            ->where('enrollment_status', 'active')
            ->where('session_id', $request->session_id)
            ->with(['user', 'stream', 'session']);

        if ($request->stream_id) {
            $query->where('stream_id', $request->stream_id);
        }
        if ($request->semester) {
            $query->where('current_semester', $request->semester);
        }

        $students = $query->get();

        return $this->success($students, 'Eligible students retrieved.');
    }

    /**
     * Promote a single student.
     */
    public function promote(Request $request): JsonResponse
    {
        $data = $request->validate([
            'student_profile_id' => 'required|exists:student_profiles,id',
            'to_session_id' => 'required|exists:academic_sessions,id',
            'to_semester' => 'nullable|integer|min:1',
            'to_class_id' => 'nullable|exists:lms_classes,id',
            'from_class_id' => 'nullable|exists:lms_classes,id',
            'is_detained' => 'nullable|boolean',
            'detention_reason' => 'nullable|string|max:500',
            'academic_result' => 'nullable|string|in:pass,fail,compartment',
            'remarks' => 'nullable|string|max:500',
        ]);

        $student = StudentProfile::findOrFail($data['student_profile_id']);

        try {
            $transition = $this->service->process('promotion', $student, $data, $request->user()->id);
            return $this->success($transition->load('transitionable'), 'Student promoted successfully.');
        } catch (\InvalidArgumentException $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    /**
     * Bulk promote students.
     */
    public function bulkPromote(Request $request): JsonResponse
    {
        $data = $request->validate([
            'from_session_id' => 'required|exists:academic_sessions,id',
            'to_session_id' => 'required|exists:academic_sessions,id',
            'to_semester' => 'nullable|integer|min:1',
            'to_class_id' => 'nullable|exists:lms_classes,id',
            'stream_id' => 'nullable|exists:streams,id',
            'semester' => 'nullable|integer|min:1',
            'class_id' => 'nullable|exists:lms_classes,id',
            'exclude_ids' => 'nullable|array',
            'exclude_ids.*' => 'integer|exists:student_profiles,id',
        ]);

        $result = $this->service->bulkPromote(
            toSessionId: $data['to_session_id'],
            toSemester: $data['to_semester'] ?? null,
            toClassId: $data['to_class_id'] ?? null,
            filters: [
                'institution_id' => $request->user()->institution_id,
                'session_id' => $data['from_session_id'],
                'stream_id' => $data['stream_id'] ?? null,
                'semester' => $data['semester'] ?? null,
                'class_id' => $data['class_id'] ?? null,
            ],
            excludeIds: $data['exclude_ids'] ?? [],
            processedBy: $request->user()->id,
            extraData: $data,
        );

        return $this->success([
            'promoted' => $result['promoted'],
            'skipped' => $result['skipped'],
        ], "Bulk promotion complete: {$result['promoted']} promoted, {$result['skipped']} skipped.");
    }

    /**
     * Rollback a promotion.
     */
    public function rollback(Request $request, StudentTransition $transition): JsonResponse
    {
        if ($transition->type !== 'promotion') {
            return $this->error('This transition is not a promotion.', 422);
        }

        try {
            $this->service->rollback($transition, $request->user()->id);
            return $this->success(null, 'Promotion rolled back successfully.');
        } catch (\InvalidArgumentException $e) {
            return $this->error($e->getMessage(), 422);
        }
    }

    /**
     * Promotion history.
     */
    public function history(Request $request): JsonResponse
    {
        $institutionId = $request->user()->institution_id;

        $transitions = StudentTransition::where('institution_id', $institutionId)
            ->promotions()
            ->with(['studentProfile.user', 'fromSession', 'toSession', 'processedBy', 'transitionable'])
            ->orderByDesc('created_at')
            ->paginate($request->get('per_page', 20));

        return $this->paginated($transitions);
    }
}
