<?php

namespace App\Http\Controllers\Api\V1\Organization;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\Stream;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StreamController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        $query = Stream::with('mainStream', 'department');

        if ($request->filled('search')) {
            $search = '%' . strtolower($request->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(code) LIKE ?', [$search]);
            });
        }

        if ($request->filled('main_stream_id')) {
            $query->where('main_stream_id', $request->main_stream_id);
        }

        if ($request->boolean('all')) {
            $data = app(\App\Services\ApiResponseMapService::class)->filterCollection(
                $query->orderBy('name', 'asc')->get(),
                'passthrough'
            );
            return response()->json([
                'success' => true,
                'message' => 'Success',
                'data' => $data,
            ]);
        }

        return $this->paginatedWithMap(
            $query->orderBy('name', 'asc')->paginate($request->input('per_page', 15)),
            'passthrough'
        );
    }

    public function store(Request $request): JsonResponse
    {
        $institutionId = \App\Support\InstitutionContext::getActiveInstitutionId();
        $validated = $request->validate([
            'main_stream_id' => 'required|exists:main_streams,id',
            'name' => [
                'required', 'string', 'max:100',
                \Illuminate\Validation\Rule::unique('streams', 'name')->where('institution_id', $institutionId)
            ],
            'code' => [
                'nullable', 'string', 'max:30',
                \Illuminate\Validation\Rule::unique('streams', 'code')->where('institution_id', $institutionId)
            ],
            'duration_years' => 'nullable|integer',
            'department_id' => 'nullable|exists:departments,id',
        ]);

        $stream = Stream::create($validated);
        return $this->created($stream);
    }

    public function show($id): JsonResponse
    {
        $stream = Stream::with('mainStream', 'department')->findOrFail($id);
        return $this->successWithMap($stream, 'passthrough');
    }

    public function update(Request $request, Stream $stream): JsonResponse
    {
        $validated = $request->validate([
            'main_stream_id' => 'sometimes|exists:main_streams,id',
            'name' => 'sometimes|string|max:100',
            'code' => 'sometimes|string|max:30',
            'duration_years' => 'sometimes|integer',
            'department_id' => 'sometimes|exists:departments,id',
            'status' => 'sometimes|integer|in:0,1',
        ]);
        $stream->update($validated);
        return $this->successWithMap($stream, 'passthrough');
    }

    public function destroy(Stream $stream): JsonResponse
    {
        $stream->delete();
        return $this->success(null, 'Class deleted');
    }

    public function toggleStatus($id): JsonResponse
    {
        $record = Stream::findOrFail($id);
        $record->status = !((bool) $record->status);
        $record->save();
        return $this->success(['status' => (bool) $record->status], "Status toggled to " . ($record->status ? 'Active' : 'Inactive'));
    }

    public function publicIndex(): JsonResponse
    {
        return response()->json(Stream::where('status', 1)->get(['id', 'name', 'main_stream_id']));
    }
}
