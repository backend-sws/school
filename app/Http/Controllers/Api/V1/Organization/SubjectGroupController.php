<?php

namespace App\Http\Controllers\Api\V1\Organization;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\SubjectGroup;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SubjectGroupController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        $query = SubjectGroup::query();

        if ($request->filled('search')) {
            $search = '%' . strtolower($request->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(code) LIKE ?', [$search]);
            });
        }

        return $this->paginatedWithMap(
            $query->orderBy('name', 'asc')->paginate($request->input('per_page', 15)),
            'passthrough'
        );
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:subject_groups,name',
            'code' => 'nullable|string|max:30|unique:subject_groups,code',
        ]);

        $subjectGroup = SubjectGroup::create($validated);
        return $this->created($subjectGroup);
    }

    public function show(SubjectGroup $subjectGroup): JsonResponse
    {
        return $this->successWithMap($subjectGroup, 'passthrough');
    }

    public function update(Request $request, SubjectGroup $subjectGroup): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'code' => 'sometimes|string|max:30',
            'status' => 'sometimes|integer|in:0,1',
        ]);
        $subjectGroup->update($validated);
        return $this->successWithMap($subjectGroup, 'passthrough');
    }

    public function destroy(SubjectGroup $subjectGroup): JsonResponse
    {
        $subjectGroup->delete();
        return $this->success(null, 'Subject Group deleted');
    }

    public function toggleStatus($id): JsonResponse
    {
        $record = SubjectGroup::findOrFail($id);
        $record->status = !((bool) $record->status);
        $record->save();
        return $this->success(['status' => (bool) $record->status], "Status toggled to " . ($record->status ? 'Active' : 'Inactive'));
    }
}
