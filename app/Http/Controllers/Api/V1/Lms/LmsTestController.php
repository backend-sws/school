<?php

namespace App\Http\Controllers\Api\V1\Lms;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\LmsClass;
use App\Models\LmsClassEnrollment;
use App\Models\LmsTest;
use App\Notifications\LmsTestCreatedNotification;
use App\Traits\DispatchesRealtimeNotifications;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LmsTestController extends BaseController
{
    use DispatchesRealtimeNotifications;
    public function index(Request $request, int $lms_class_id): JsonResponse
    {
        if (! LmsClass::userCanAccessForRead($request->user(), $lms_class_id)) {
            return $this->forbidden('You do not have permission to view tests.');
        }

        $class = LmsClass::find($lms_class_id);
        if (! $class) {
            return $this->error('Class not found.', 404);
        }

        $query = LmsTest::query()
            ->where('lms_class_id', $lms_class_id)
            ->with(['createdBy:id,name'])
            ->withCount('questions')
            ->orderBy('sort_order');

        if ($request->filled('allocation_id')) {
            $query->where('class_subject_allocation_id', (int) $request->allocation_id);
        }

        return $this->paginatedWithMap($query->paginate($request->input('per_page', 15)), 'passthrough');
    }

    public function store(Request $request, int $lms_class_id): JsonResponse
    {
        if (! $request->user()->hasAbility('create_lms_classes') && ! LmsClass::userCanEditContentInClass($request->user(), $lms_class_id)) {
            return $this->forbidden('You do not have permission to create tests.');
        }

        $class = LmsClass::find($lms_class_id);
        if (! $class) {
            return $this->error('Class not found.', 404);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'description' => 'nullable|string',
            'duration_minutes' => 'nullable|integer|min:0',
            'max_attempts' => 'nullable|integer|min:1',
            'available_from' => 'nullable|date',
            'available_until' => 'nullable|date',
            'shuffle_questions' => 'nullable|boolean',
            'sort_order' => 'nullable|integer|min:0',
            'class_subject_allocation_id' => 'nullable|exists:class_subject_allocations,id',
        ]);

        $validated['lms_class_id'] = $lms_class_id;
        $validated['class_subject_allocation_id'] = $validated['class_subject_allocation_id'] ?? null;
        $validated['max_attempts'] = $validated['max_attempts'] ?? 1;
        $validated['shuffle_questions'] = $validated['shuffle_questions'] ?? true;
        $validated['sort_order'] = $validated['sort_order'] ?? 0;
        $validated['created_by'] = $request->user()->id;

        $test = LmsTest::create($validated);

        $enrolledUsers = LmsClassEnrollment::query()
            ->where('lms_class_id', $lms_class_id)
            ->where('role', 'student')
            ->where('status', 'active')
            ->with('user')
            ->get()
            ->pluck('user')
            ->filter();
        if ($enrolledUsers->isNotEmpty()) {
            $this->notifyRealtimeMany($enrolledUsers, new LmsTestCreatedNotification($test, $class));
        }

        return $this->created($test->load('createdBy:id,name'), 'Test created successfully');
    }

    public function show(Request $request, int $lms_class_id, int $id): JsonResponse
    {
        if (! LmsClass::userCanAccessForRead($request->user(), $lms_class_id)) {
            return $this->forbidden('You do not have permission to view tests.');
        }

        $test = LmsTest::where('lms_class_id', $lms_class_id)->with(['questions', 'createdBy:id,name'])->find($id);
        if (! $test) {
            return $this->error('Test not found.', 404);
        }

        return $this->successWithMap($test, 'passthrough');
    }

    public function update(Request $request, int $lms_class_id, int $id): JsonResponse
    {
        if (! $request->user()->hasAbility('update_lms_classes') && ! LmsClass::userCanEditContentInClass($request->user(), $lms_class_id)) {
            return $this->forbidden('You do not have permission to update tests.');
        }

        $test = LmsTest::where('lms_class_id', $lms_class_id)->find($id);
        if (! $test) {
            return $this->error('Test not found.', 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:200',
            'description' => 'nullable|string',
            'duration_minutes' => 'nullable|integer|min:0',
            'max_attempts' => 'nullable|integer|min:1',
            'available_from' => 'nullable|date',
            'available_until' => 'nullable|date',
            'shuffle_questions' => 'nullable|boolean',
            'sort_order' => 'nullable|integer|min:0',
            'class_subject_allocation_id' => 'nullable|exists:class_subject_allocations,id',
        ]);

        $test->update($validated);

        return $this->successWithMap($test->fresh('createdBy:id,name'), 'passthrough', 'Test updated successfully');
    }

    public function destroy(Request $request, int $lms_class_id, int $id): JsonResponse
    {
        if (! $request->user()->hasAbility('delete_lms_classes') && ! LmsClass::userCanEditContentInClass($request->user(), $lms_class_id)) {
            return $this->forbidden('You do not have permission to delete tests.');
        }

        $test = LmsTest::where('lms_class_id', $lms_class_id)->find($id);
        if (! $test) {
            return $this->error('Test not found.', 404);
        }

        $test->delete();

        return $this->success(null, 'Test deleted');
    }
}
