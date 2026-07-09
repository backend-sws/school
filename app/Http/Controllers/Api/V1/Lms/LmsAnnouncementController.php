<?php

namespace App\Http\Controllers\Api\V1\Lms;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\LmsAnnouncement;
use App\Models\LmsClass;
use App\Models\LmsClassEnrollment;
use App\Notifications\LmsAnnouncementCreatedNotification;
use App\Traits\DispatchesRealtimeNotifications;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LmsAnnouncementController extends BaseController
{
    use DispatchesRealtimeNotifications;
    public function index(Request $request, int $lms_class_id): JsonResponse
    {
        if (! LmsClass::userCanAccessForRead($request->user(), $lms_class_id)) {
            return $this->forbidden('You do not have permission to view announcements.');
        }

        $class = LmsClass::find($lms_class_id);
        if (! $class) {
            return $this->error('Class not found.', 404);
        }

        $query = LmsAnnouncement::query()
            ->where('lms_class_id', $lms_class_id)
            ->with('author:id,name')
            ->orderBy('published_at', 'desc');

        if ($request->filled('allocation_id')) {
            $query->where('class_subject_allocation_id', (int) $request->allocation_id);
        }

        return $this->paginatedWithMap($query->paginate($request->input('per_page', 15)), 'passthrough');
    }

    public function store(Request $request, int $lms_class_id): JsonResponse
    {
        if (! $request->user()->hasAbility('create_lms_classes') && ! LmsClass::userCanEditContentInClass($request->user(), $lms_class_id)) {
            return $this->forbidden('You do not have permission to create announcements.');
        }

        $class = LmsClass::find($lms_class_id);
        if (! $class) {
            return $this->error('Class not found.', 404);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'body' => 'required|string',
            'published_at' => 'nullable|date',
            'class_subject_allocation_id' => 'nullable|exists:class_subject_allocations,id',
        ]);

        $validated['lms_class_id'] = $lms_class_id;
        $validated['class_subject_allocation_id'] = $validated['class_subject_allocation_id'] ?? null;
        $validated['author_id'] = $request->user()->id;

        $announcement = LmsAnnouncement::create($validated);

        $enrolledUsers = LmsClassEnrollment::query()
            ->where('lms_class_id', $lms_class_id)
            ->where('role', 'student')
            ->where('status', 'active')
            ->with('user')
            ->get()
            ->pluck('user')
            ->filter();
        if ($enrolledUsers->isNotEmpty()) {
            $this->notifyRealtimeMany($enrolledUsers, new LmsAnnouncementCreatedNotification($announcement, $class));
        }

        return $this->created($announcement->load('author:id,name'), 'Announcement created successfully');
    }

    public function show(Request $request, int $lms_class_id, int $id): JsonResponse
    {
        if (! LmsClass::userCanAccessForRead($request->user(), $lms_class_id)) {
            return $this->forbidden('You do not have permission to view announcements.');
        }

        $announcement = LmsAnnouncement::where('lms_class_id', $lms_class_id)->with('author:id,name')->find($id);
        if (! $announcement) {
            return $this->error('Announcement not found.', 404);
        }

        return $this->successWithMap($announcement, 'passthrough');
    }

    public function update(Request $request, int $lms_class_id, int $id): JsonResponse
    {
        if (! $request->user()->hasAbility('update_lms_classes') && ! LmsClass::userCanEditContentInClass($request->user(), $lms_class_id)) {
            return $this->forbidden('You do not have permission to update announcements.');
        }

        $announcement = LmsAnnouncement::where('lms_class_id', $lms_class_id)->find($id);
        if (! $announcement) {
            return $this->error('Announcement not found.', 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:200',
            'body' => 'sometimes|string',
            'published_at' => 'nullable|date',
            'class_subject_allocation_id' => 'nullable|exists:class_subject_allocations,id',
        ]);

        $announcement->update($validated);

        return $this->successWithMap($announcement->fresh('author:id,name'), 'passthrough', 'Announcement updated successfully');
    }

    public function destroy(Request $request, int $lms_class_id, int $id): JsonResponse
    {
        if (! $request->user()->hasAbility('delete_lms_classes') && ! LmsClass::userCanEditContentInClass($request->user(), $lms_class_id)) {
            return $this->forbidden('You do not have permission to delete announcements.');
        }

        $announcement = LmsAnnouncement::where('lms_class_id', $lms_class_id)->find($id);
        if (! $announcement) {
            return $this->error('Announcement not found.', 404);
        }

        $announcement->delete();

        return $this->success(null, 'Announcement deleted');
    }
}
