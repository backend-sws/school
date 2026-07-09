<?php

namespace App\Http\Controllers\Api\V1\Lms;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\LmsClass;
use App\Models\LmsClassEnrollment;
use App\Models\LmsMaterial;
use App\Notifications\LmsMaterialCreatedNotification;
use App\Traits\DispatchesRealtimeNotifications;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class LmsMaterialController extends BaseController
{
    use DispatchesRealtimeNotifications;
    public function index(Request $request, int $lms_class_id): JsonResponse
    {
        if (! LmsClass::userCanAccessForRead($request->user(), $lms_class_id)) {
            return $this->forbidden('You do not have permission to view materials.');
        }

        $class = LmsClass::find($lms_class_id);
        if (! $class) {
            return $this->error('Class not found.', 404);
        }

        $query = LmsMaterial::query()
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
            return $this->forbidden('You do not have permission to add materials.');
        }

        $class = LmsClass::find($lms_class_id);
        if (! $class) {
            return $this->error('Class not found.', 404);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'file_path' => 'required|string|max:500',
            'file_type' => 'nullable|string|max:100',
            'file_size' => 'nullable|integer|min:0',
            'sort_order' => 'nullable|integer|min:0',
            'class_subject_allocation_id' => 'nullable|exists:class_subject_allocations,id',
        ]);

        $validated['lms_class_id'] = $lms_class_id;
        $validated['class_subject_allocation_id'] = $validated['class_subject_allocation_id'] ?? null;
        $validated['sort_order'] = $validated['sort_order'] ?? 0;
        $validated['created_by'] = $request->user()->id;

        $material = LmsMaterial::create($validated);

        $enrolledUsers = LmsClassEnrollment::query()
            ->where('lms_class_id', $lms_class_id)
            ->where('role', 'student')
            ->where('status', 'active')
            ->with('user')
            ->get()
            ->pluck('user')
            ->filter();
        if ($enrolledUsers->isNotEmpty()) {
            $this->notifyRealtimeMany($enrolledUsers, new LmsMaterialCreatedNotification($material, $class));
        }

        return $this->created($material, 'Material added successfully');
    }

    public function show(Request $request, int $lms_class_id, int $id): JsonResponse
    {
        if (! LmsClass::userCanAccessForRead($request->user(), $lms_class_id)) {
            return $this->forbidden('You do not have permission to view materials.');
        }

        $material = LmsMaterial::where('lms_class_id', $lms_class_id)->find($id);
        if (! $material) {
            return $this->error('Material not found.', 404);
        }

        return $this->successWithMap($material, 'passthrough');
    }

    public function update(Request $request, int $lms_class_id, int $id): JsonResponse
    {
        if (! $request->user()->hasAbility('update_lms_classes') && ! LmsClass::userCanEditContentInClass($request->user(), $lms_class_id)) {
            return $this->forbidden('You do not have permission to update materials.');
        }

        $material = LmsMaterial::where('lms_class_id', $lms_class_id)->find($id);
        if (! $material) {
            return $this->error('Material not found.', 404);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string|max:200',
            'file_path' => 'sometimes|string|max:500',
            'file_type' => 'nullable|string|max:100',
            'file_size' => 'nullable|integer|min:0',
            'sort_order' => 'nullable|integer|min:0',
            'class_subject_allocation_id' => 'nullable|exists:class_subject_allocations,id',
        ]);

        $material->update($validated);

        return $this->successWithMap($material->fresh(), 'passthrough', 'Material updated successfully');
    }

    public function destroy(Request $request, int $lms_class_id, int $id): JsonResponse
    {
        if (! $request->user()->hasAbility('delete_lms_classes') && ! LmsClass::userCanEditContentInClass($request->user(), $lms_class_id)) {
            return $this->forbidden('You do not have permission to delete materials.');
        }

        $material = LmsMaterial::where('lms_class_id', $lms_class_id)->find($id);
        if (! $material) {
            return $this->error('Material not found.', 404);
        }

        $material->delete();

        return $this->success(null, 'Material deleted');
    }
}
