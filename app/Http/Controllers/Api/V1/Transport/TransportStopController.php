<?php

namespace App\Http\Controllers\Api\V1\Transport;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\TransportStop;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class TransportStopController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        if (!$request->user()->hasAbility('view_transport_stops')) {
            return $this->forbidden('You do not have permission to view transport stops.');
        }

        $query = TransportStop::query();

        if ($request->filled('search')) {
            $search = '%' . strtolower($request->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(COALESCE(code, \'\')) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(COALESCE(address, \'\')) LIKE ?', [$search]);
            });
        }

        if ($request->filled('is_active') && $request->input('is_active') !== 'all') {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($request->filled('route_id') && $request->input('route_id') !== 'all') {
            $query->whereHas('routes', function ($q) use ($request) {
                $q->where('transport_routes.id', $request->input('route_id'));
            });
        }

        return $this->paginatedWithMap(
            $query->orderBy('name', 'asc')->paginate($request->input('per_page', 15)),
            'passthrough'
        );
    }

    public function store(Request $request): JsonResponse
    {
        if (!$request->user()->hasAbility('create_transport_stops')) {
            return $this->forbidden('You do not have permission to create transport stops.');
        }

        $currentInstitutionId = \App\Support\InstitutionContext::getActiveInstitutionId();
        if (!$currentInstitutionId) {
            return $this->error('Institution context required.', 422);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'code' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('transport_stops', 'code')->where('institution_id', $currentInstitutionId),
            ],
            'address' => 'nullable|string|max:255',
            'landmark' => 'nullable|string|max:150',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'is_active' => 'nullable|boolean',
        ]);

        $validated['institution_id'] = $currentInstitutionId;

        $stop = TransportStop::create($validated);
        return $this->created($stop, 'Stop created successfully');
    }

    public function show(Request $request, TransportStop $transport_stop): JsonResponse
    {
        if (!$request->user()->hasAbility('view_transport_stops')) {
            return $this->forbidden('You do not have permission to view transport stops.');
        }

        return $this->successWithMap($transport_stop, 'passthrough');
    }

    public function update(Request $request, TransportStop $transport_stop): JsonResponse
    {
        if (!$request->user()->hasAbility('update_transport_stops')) {
            return $this->forbidden('You do not have permission to update transport stops.');
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:150',
            'code' => [
                'sometimes',
                'nullable',
                'string',
                'max:50',
                Rule::unique('transport_stops', 'code')
                    ->where('institution_id', $transport_stop->institution_id)
                    ->ignore($transport_stop->id),
            ],
            'address' => 'nullable|string|max:255',
            'landmark' => 'nullable|string|max:150',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
            'is_active' => 'nullable|boolean',
        ]);

        $transport_stop->update($validated);

        return $this->successWithMap($transport_stop, 'passthrough', 'Stop updated successfully');
    }

    public function destroy(Request $request, TransportStop $transport_stop): JsonResponse
    {
        if (!$request->user()->hasAbility('delete_transport_stops')) {
            return $this->forbidden('You do not have permission to delete transport stops.');
        }

        $transport_stop->delete();

        return $this->success(null, 'Stop deleted');
    }
}
