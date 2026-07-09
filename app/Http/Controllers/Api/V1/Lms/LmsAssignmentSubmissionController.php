<?php

namespace App\Http\Controllers\Api\V1\Lms;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\LmsAssignment;
use App\Models\LmsAssignmentSubmission;
use App\Models\LmsClass;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LmsAssignmentSubmissionController extends BaseController
{
    public function index(Request $request, int $lms_class_id, int $assignment_id): JsonResponse
    {
        if (! $request->user()->hasAbility('view_lms_classes')) {
            return $this->forbidden('You do not have permission to view submissions.');
        }

        $assignment = LmsAssignment::where('lms_class_id', $lms_class_id)->find($assignment_id);
        if (! $assignment) {
            return $this->error('Assignment not found.', 404);
        }

        $submissions = $assignment->submissions()->with('user:id,name,email')->orderBy('submitted_at', 'desc')->get();

        return $this->success($submissions);
    }

    public function store(Request $request, int $lms_class_id, int $assignment_id): JsonResponse
    {
        if (! LmsClass::userCanAccessForRead($request->user(), $lms_class_id)) {
            return $this->forbidden('You do not have permission to submit to this class.');
        }

        $assignment = LmsAssignment::where('lms_class_id', $lms_class_id)->find($assignment_id);
        if (! $assignment) {
            return $this->error('Assignment not found.', 404);
        }

        $userId = $request->user()->id;
        $validated = $request->validate([
            'feedback' => 'nullable|string',
            'file_path' => 'nullable|string|max:500',
            'status' => 'nullable|string|in:draft,submitted',
        ]);

        $submission = LmsAssignmentSubmission::firstOrNew(
            ['lms_assignment_id' => $assignment_id, 'user_id' => $userId],
            ['status' => 'draft']
        );

        $submission->feedback = $validated['feedback'] ?? $submission->feedback;
        $submission->file_path = $validated['file_path'] ?? $submission->file_path;
        $submission->status = $validated['status'] ?? $submission->status;
        if (($validated['status'] ?? '') === 'submitted') {
            $submission->submitted_at = $submission->submitted_at ?? now();
        }
        $submission->save();

        return $this->successWithMap($submission->load('user:id,name,email'), 'passthrough', 'Submission saved');
    }

    public function update(Request $request, int $lms_class_id, int $assignment_id, int $submission_id): JsonResponse
    {
        if (! LmsClass::userCanGradeInClass($request->user(), $lms_class_id)) {
            return $this->forbidden('You do not have permission to grade submissions.');
        }

        $submission = LmsAssignmentSubmission::where('lms_assignment_id', $assignment_id)
            ->whereHas('lmsAssignment', fn ($q) => $q->where('lms_class_id', $lms_class_id))
            ->find($submission_id);
        if (! $submission) {
            return $this->error('Submission not found.', 404);
        }

        $validated = $request->validate([
            'score' => 'nullable|numeric|min:0',
            'feedback' => 'nullable|string',
            'status' => 'nullable|string|in:draft,submitted,graded',
        ]);

        if (array_key_exists('score', $validated)) {
            $submission->score = $validated['score'];
        }
        if (array_key_exists('feedback', $validated)) {
            $submission->feedback = $validated['feedback'];
        }
        if (isset($validated['status'])) {
            $submission->status = $validated['status'];
        }
        $submission->save();

        return $this->successWithMap($submission->fresh('user:id,name,email'), 'passthrough', 'Submission updated');
    }
}
