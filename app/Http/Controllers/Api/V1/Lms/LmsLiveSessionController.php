<?php

namespace App\Http\Controllers\Api\V1\Lms;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\LmsClass;
use App\Models\LmsClassEnrollment;
use App\Models\LmsLiveSession;
use App\Notifications\LmsLiveSessionScheduledNotification;
use App\Traits\DispatchesRealtimeNotifications;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LmsLiveSessionController extends BaseController
{
    use DispatchesRealtimeNotifications;
    public function index(Request $request, int $lms_class_id): JsonResponse
    {
        if (! LmsClass::userCanAccessForRead($request->user(), $lms_class_id)) {
            return $this->forbidden('You do not have permission to view live sessions.');
        }

        $class = LmsClass::find($lms_class_id);
        if (! $class) {
            return $this->error('Class not found.', 404);
        }

        $query = LmsLiveSession::query()
            ->where('lms_class_id', $lms_class_id)
            ->with('createdBy:id,name')
            ->orderBy('scheduled_at', 'desc');

        if ($request->filled('allocation_id')) {
            $query->where('class_subject_allocation_id', (int) $request->allocation_id);
        }

        return $this->paginatedWithMap($query->paginate($request->input('per_page', 15)), 'passthrough');
    }

    public function store(Request $request, int $lms_class_id): JsonResponse
    {
        if (! $request->user()->hasAbility('create_lms_classes') && ! LmsClass::userCanEditContentInClass($request->user(), $lms_class_id)) {
            return $this->forbidden('You do not have permission to create live sessions.');
        }

        $class = LmsClass::find($lms_class_id);
        if (! $class) {
            return $this->error('Class not found.', 404);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'scheduled_at' => 'required|date',
            'ends_at' => 'nullable|date',
            'meeting_url' => 'nullable|string|max:500',
            'meeting_provider' => 'nullable|string|max:50',
            'status' => 'nullable|string|in:scheduled,live,ended,cancelled',
            'class_subject_allocation_id' => 'nullable|exists:class_subject_allocations,id',
        ]);

        $validated['lms_class_id'] = $lms_class_id;
        $validated['class_subject_allocation_id'] = $validated['class_subject_allocation_id'] ?? null;
        $validated['status'] = $validated['status'] ?? 'scheduled';
        $validated['created_by'] = $request->user()->id;

        $session = LmsLiveSession::create($validated);

        $enrolledUsers = LmsClassEnrollment::query()
            ->where('lms_class_id', $lms_class_id)
            ->where('role', 'student')
            ->where('status', 'active')
            ->with('user')
            ->get()
            ->pluck('user')
            ->filter();
        if ($enrolledUsers->isNotEmpty()) {
            $this->notifyRealtimeMany($enrolledUsers, new LmsLiveSessionScheduledNotification($session, $class));
        }

        return $this->created($session->load('createdBy:id,name'), 'Live session created successfully');
    }

    public function show(Request $request, int $lms_class_id, int $id): JsonResponse
    {
        if (! LmsClass::userCanAccessForRead($request->user(), $lms_class_id)) {
            return $this->forbidden('You do not have permission to view live sessions.');
        }

        $session = LmsLiveSession::where('lms_class_id', $lms_class_id)->with('createdBy:id,name')->find($id);
        if (! $session) {
            return $this->error('Live session not found.', 404);
        }

        return $this->successWithMap($session, 'passthrough');
    }

    public function update(Request $request, int $lms_class_id, int $id): JsonResponse
    {
        if (! $request->user()->hasAbility('update_lms_classes') && ! LmsClass::userCanEditContentInClass($request->user(), $lms_class_id)) {
            return $this->forbidden('You do not have permission to update live sessions.');
        }

        $session = LmsLiveSession::where('lms_class_id', $lms_class_id)->find($id);
        if (! $session) {
            return $this->error('Live session not found.', 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:200',
            'scheduled_at' => 'sometimes|date',
            'ends_at' => 'nullable|date',
            'meeting_url' => 'nullable|string|max:500',
            'meeting_provider' => 'nullable|string|max:50',
            'status' => 'nullable|string|in:scheduled,live,ended,cancelled',
            'class_subject_allocation_id' => 'nullable|exists:class_subject_allocations,id',
        ]);

        $session->update($validated);

        return $this->successWithMap($session->fresh('createdBy:id,name'), 'passthrough', 'Live session updated successfully');
    }

    public function destroy(Request $request, int $lms_class_id, int $id): JsonResponse
    {
        if (! $request->user()->hasAbility('delete_lms_classes') && ! LmsClass::userCanEditContentInClass($request->user(), $lms_class_id)) {
            return $this->forbidden('You do not have permission to delete live sessions.');
        }

        $session = LmsLiveSession::where('lms_class_id', $lms_class_id)->find($id);
        if (! $session) {
            return $this->error('Live session not found.', 404);
        }

        $session->delete();

        return $this->success(null, 'Live session deleted');
    }
}
