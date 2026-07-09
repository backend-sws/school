<?php

namespace App\Http\Controllers\Api\V1\Organization;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\MainStream;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MainStreamController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        $query = MainStream::query();

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
            'name' => 'required|string|max:100|unique:main_streams,name',
            'code' => 'nullable|string|max:30|unique:main_streams,code',
        ]);

        $mainStream = MainStream::create($validated);
        return $this->created($mainStream);
    }

    public function show(MainStream $mainStream): JsonResponse
    {
        return $this->successWithMap($mainStream, 'passthrough');
    }

    public function update(Request $request, MainStream $mainStream): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'code' => 'sometimes|string|max:30',
            'status' => 'sometimes|integer|in:0,1',
        ]);
        $mainStream->update($validated);
        return $this->successWithMap($mainStream, 'passthrough');
    }

    public function destroy(MainStream $mainStream): JsonResponse
    {
        $mainStream->delete();
        return $this->success(null, 'Level deleted');
    }

    public function toggleStatus($id): JsonResponse
    {
        $record = MainStream::findOrFail($id);
        $record->status = !((bool) $record->status);
        $record->save();
        return $this->success(['status' => (bool) $record->status], "Status toggled to " . ($record->status ? 'Active' : 'Inactive'));
    }
}
