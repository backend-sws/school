<?php

namespace App\Http\Controllers\Api\V1\Lms;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\LmsAssignment;
use App\Models\LmsClass;
use App\Models\LmsClassEnrollment;
use App\Notifications\LmsAssignmentCreatedNotification;
use App\Traits\DispatchesRealtimeNotifications;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LmsAssignmentController extends BaseController
{
    use DispatchesRealtimeNotifications;
    public function index(Request $request, int $lms_class_id): JsonResponse
    {
        if (!LmsClass::userCanAccessForRead($request->user(), $lms_class_id)) {
            return $this->forbidden('You do not have permission to view assignments.');
        }

        $class = LmsClass::find($lms_class_id);
        if (!$class) {
            return $this->error('Class not found.', 404);
        }

        $query = LmsAssignment::query()
            ->where('lms_class_id', $lms_class_id)
            ->with(['createdBy:id,name'])
            ->orderBy('sort_order');

        if ($request->filled('allocation_id')) {
            $query->where('class_subject_allocation_id', (int) $request->allocation_id);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        return $this->paginatedWithMap($query->paginate($request->input('per_page', 15)), 'passthrough');
    }

    public function store(Request $request, int $lms_class_id): JsonResponse
    {
        if (!$request->user()->hasAbility('create_lms_classes') && !LmsClass::userCanEditContentInClass($request->user(), $lms_class_id)) {
            return $this->forbidden('You do not have permission to create assignments.');
        }

        $class = LmsClass::find($lms_class_id);
        if (!$class) {
            return $this->error('Class not found.', 404);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'file_path' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'type' => 'nullable|string|in:assignment,homework,project',
            'due_at' => 'nullable|date',
            'max_score' => 'nullable|numeric|min:0',
            'allow_late' => 'nullable|boolean',
            'sort_order' => 'nullable|integer|min:0',
            'class_subject_allocation_id' => 'nullable|exists:class_subject_allocations,id',
        ]);

        $validated['lms_class_id'] = $lms_class_id;
        $validated['class_subject_allocation_id'] = $validated['class_subject_allocation_id'] ?? null;
        $validated['type'] = $validated['type'] ?? 'assignment';
        $validated['allow_late'] = $validated['allow_late'] ?? false;
        $validated['sort_order'] = $validated['sort_order'] ?? 0;
        $validated['created_by'] = $request->user()->id;

        $assignment = LmsAssignment::create($validated);

        $enrolledUsers = LmsClassEnrollment::query()
            ->where('lms_class_id', $lms_class_id)
            ->where('role', 'student')
            ->where('status', 'active')
            ->with('user')
            ->get()
            ->pluck('user')
            ->filter();
        if ($enrolledUsers->isNotEmpty()) {
            $this->notifyRealtimeMany($enrolledUsers, new LmsAssignmentCreatedNotification($assignment, $class));
        }

        return $this->created($assignment->load('createdBy:id,name'), 'Assignment created successfully');
    }

    public function show(Request $request, int $lms_class_id, int $id): JsonResponse
    {
        if (!LmsClass::userCanAccessForRead($request->user(), $lms_class_id)) {
            return $this->forbidden('You do not have permission to view assignments.');
        }

        $assignment = LmsAssignment::where('lms_class_id', $lms_class_id)->with(['createdBy:id,name', 'submissions.user:id,name,email'])->find($id);
        if (!$assignment) {
            return $this->error('Assignment not found.', 404);
        }

        return $this->successWithMap($assignment, 'passthrough');
    }

    public function update(Request $request, int $lms_class_id, int $id): JsonResponse
    {
        if (!$request->user()->hasAbility('update_lms_classes') && !LmsClass::userCanEditContentInClass($request->user(), $lms_class_id)) {
            return $this->forbidden('You do not have permission to update assignments.');
        }

        $assignment = LmsAssignment::where('lms_class_id', $lms_class_id)->find($id);
        if (!$assignment) {
            return $this->error('Assignment not found.', 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:200',
            'file_path' => 'nullable|string|max:500',
            'description' => 'nullable|string',
            'type' => 'nullable|string|in:assignment,homework,project',
            'due_at' => 'nullable|date',
            'max_score' => 'nullable|numeric|min:0',
            'allow_late' => 'nullable|boolean',
            'sort_order' => 'nullable|integer|min:0',
            'class_subject_allocation_id' => 'nullable|exists:class_subject_allocations,id',
        ]);

        $assignment->update($validated);

        return $this->successWithMap($assignment->fresh('createdBy:id,name'), 'passthrough', 'Assignment updated successfully');
    }

    public function destroy(Request $request, int $lms_class_id, int $id): JsonResponse
    {
        if (!$request->user()->hasAbility('delete_lms_classes') && !LmsClass::userCanEditContentInClass($request->user(), $lms_class_id)) {
            return $this->forbidden('You do not have permission to delete assignments.');
        }

        $assignment = LmsAssignment::where('lms_class_id', $lms_class_id)->find($id);
        if (!$assignment) {
            return $this->error('Assignment not found.', 404);
        }

        $assignment->delete();

        return $this->success(null, 'Assignment deleted');
    }
}
