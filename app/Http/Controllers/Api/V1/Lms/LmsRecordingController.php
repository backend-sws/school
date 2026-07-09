<?php

namespace App\Http\Controllers\Api\V1\Lms;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\LmsClass;
use App\Models\LmsClassEnrollment;
use App\Models\LmsRecording;
use App\Notifications\LmsRecordingAddedNotification;
use App\Traits\DispatchesRealtimeNotifications;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LmsRecordingController extends BaseController
{
    use DispatchesRealtimeNotifications;
    public function index(Request $request, int $lms_class_id): JsonResponse
    {
        if (! LmsClass::userCanAccessForRead($request->user(), $lms_class_id)) {
            return $this->forbidden('You do not have permission to view recordings.');
        }

        $class = LmsClass::find($lms_class_id);
        if (! $class) {
            return $this->error('Class not found.', 404);
        }

        $query = LmsRecording::query()
            ->where('lms_class_id', $lms_class_id)
            ->orderBy('sort_order');

        if ($request->filled('allocation_id')) {
            $query->where('class_subject_allocation_id', (int) $request->allocation_id);
        }

        return $this->paginatedWithMap($query->paginate($request->input('per_page', 15)), 'passthrough');
    }

    public function store(Request $request, int $lms_class_id): JsonResponse
    {
        if (! $request->user()->hasAbility('create_lms_classes') && ! LmsClass::userCanEditContentInClass($request->user(), $lms_class_id)) {
            return $this->forbidden('You do not have permission to add recordings.');
        }

        $class = LmsClass::find($lms_class_id);
        if (! $class) {
            return $this->error('Class not found.', 404);
        }

        $validated = $request->validate([
            'lms_live_session_id' => 'nullable|exists:lms_live_sessions,id',
            'title' => 'required|string|max:200',
            'description' => 'nullable|string',
            'video_url' => 'nullable|string|max:500',
            'file_path' => 'nullable|string|max:500',
            'duration_seconds' => 'nullable|integer|min:0',
            'thumbnail_url' => 'nullable|string|max:500',
            'published_at' => 'nullable|date',
            'sort_order' => 'nullable|integer|min:0',
            'class_subject_allocation_id' => 'nullable|exists:class_subject_allocations,id',
        ]);

        $validated['lms_class_id'] = $lms_class_id;
        $validated['class_subject_allocation_id'] = $validated['class_subject_allocation_id'] ?? null;
        $validated['sort_order'] = $validated['sort_order'] ?? 0;

        $recording = LmsRecording::create($validated);

        $enrolledUsers = LmsClassEnrollment::query()
            ->where('lms_class_id', $lms_class_id)
            ->where('role', 'student')
            ->where('status', 'active')
            ->with('user')
            ->get()
            ->pluck('user')
            ->filter();
        if ($enrolledUsers->isNotEmpty()) {
            $this->notifyRealtimeMany($enrolledUsers, new LmsRecordingAddedNotification($recording, $class));
        }

        return $this->created($recording, 'Recording added successfully');
    }

    public function show(Request $request, int $lms_class_id, int $id): JsonResponse
    {
        if (! LmsClass::userCanAccessForRead($request->user(), $lms_class_id)) {
            return $this->forbidden('You do not have permission to view recordings.');
        }

        $recording = LmsRecording::where('lms_class_id', $lms_class_id)->find($id);
        if (! $recording) {
            return $this->error('Recording not found.', 404);
        }

        return $this->successWithMap($recording, 'passthrough');
    }

    public function update(Request $request, int $lms_class_id, int $id): JsonResponse
    {
        if (! $request->user()->hasAbility('update_lms_classes') && ! LmsClass::userCanEditContentInClass($request->user(), $lms_class_id)) {
            return $this->forbidden('You do not have permission to update recordings.');
        }

        $recording = LmsRecording::where('lms_class_id', $lms_class_id)->find($id);
        if (! $recording) {
            return $this->error('Recording not found.', 404);
        }

        $validated = $request->validate([
            'lms_live_session_id' => 'nullable|exists:lms_live_sessions,id',
            'title' => 'sometimes|string|max:200',
            'description' => 'nullable|string',
            'video_url' => 'nullable|string|max:500',
            'file_path' => 'nullable|string|max:500',
            'duration_seconds' => 'nullable|integer|min:0',
            'thumbnail_url' => 'nullable|string|max:500',
            'published_at' => 'nullable|date',
            'sort_order' => 'nullable|integer|min:0',
            'class_subject_allocation_id' => 'nullable|exists:class_subject_allocations,id',
        ]);

        $recording->update($validated);

        return $this->successWithMap($recording->fresh(), 'passthrough', 'Recording updated successfully');
    }

    public function destroy(Request $request, int $lms_class_id, int $id): JsonResponse
    {
        if (! $request->user()->hasAbility('delete_lms_classes') && ! LmsClass::userCanEditContentInClass($request->user(), $lms_class_id)) {
            return $this->forbidden('You do not have permission to delete recordings.');
        }

        $recording = LmsRecording::where('lms_class_id', $lms_class_id)->find($id);
        if (! $recording) {
            return $this->error('Recording not found.', 404);
        }

        $recording->delete();

        return $this->success(null, 'Recording deleted');
    }
}
