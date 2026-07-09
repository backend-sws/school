<?php

namespace App\Http\Controllers\Api\V1\Lms;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\ClassSubjectAllocation;
use App\Models\LmsClass;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClassSubjectAllocationController extends BaseController
{
    /**
     * Create an allocation for a class (stream + session from class).
     * Body: subject_id, instructor_id (optional).
     */
    public function storeForClass(Request $request, LmsClass $lms_class): JsonResponse
    {
        if (! $request->user()->hasAbility('manage_lms_allocations')) {
            return $this->forbidden('You do not have permission to manage allocations.');
        }

        if (! $lms_class->stream_id || ! $lms_class->session_id) {
            return $this->error('Class must have a stream and session to add subject-room allocations.', 422);
        }

        $validated = $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'instructor_id' => 'nullable|exists:users,id',
        ]);

        $allocation = ClassSubjectAllocation::create([
            'institution_id' => $lms_class->institution_id,
            'stream_id' => $lms_class->stream_id,
            'session_id' => $lms_class->session_id,
            'subject_id' => $validated['subject_id'],
            'instructor_id' => $validated['instructor_id'] ?? null,
        ]);

        $allocation->load(['subject:id,name,code', 'instructor:id,name,email']);

        return $this->created(
            [
                'id' => $allocation->id,
                'subject' => $allocation->subject ? ['id' => $allocation->subject->id, 'name' => $allocation->subject->name, 'code' => $allocation->subject->code] : null,
                'instructor' => $allocation->instructor ? ['id' => $allocation->instructor->id, 'name' => $allocation->instructor->name] : null,
            ],
            'Allocation created successfully'
        );
    }

    /**
     * Update an allocation.
     */
    public function update(Request $request, ClassSubjectAllocation $class_subject_allocation): JsonResponse
    {
        if (! $request->user()->hasAbility('manage_lms_allocations')) {
            return $this->forbidden('You do not have permission to manage allocations.');
        }

        $validated = $request->validate([
            'subject_id' => 'sometimes|exists:subjects,id',
            'instructor_id' => 'nullable|exists:users,id',
        ]);

        $class_subject_allocation->update($validated);
        $class_subject_allocation->load(['subject:id,name,code', 'instructor:id,name,email']);

        return $this->success([
            'id' => $class_subject_allocation->id,
            'subject' => $class_subject_allocation->subject ? ['id' => $class_subject_allocation->subject->id, 'name' => $class_subject_allocation->subject->name, 'code' => $class_subject_allocation->subject->code] : null,
            'instructor' => $class_subject_allocation->instructor ? ['id' => $class_subject_allocation->instructor->id, 'name' => $class_subject_allocation->instructor->name] : null,
        ], 'Allocation updated successfully');
    }

    /**
     * Delete an allocation.
     */
    public function destroy(Request $request, ClassSubjectAllocation $class_subject_allocation): JsonResponse
    {
        if (! $request->user()->hasAbility('manage_lms_allocations')) {
            return $this->forbidden('You do not have permission to manage allocations.');
        }

        $class_subject_allocation->delete();

        return $this->success(null, 'Allocation deleted successfully');
    }
}
