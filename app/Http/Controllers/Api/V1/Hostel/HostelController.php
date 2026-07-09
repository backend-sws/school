<?php

namespace App\Http\Controllers\Api\V1\Hostel;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\Hostel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class HostelController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('view_hostels')) {
            return $this->forbidden('You do not have permission to view hostels.');
        }

        $institutionId = \App\Support\InstitutionContext::getActiveInstitutionId();
        if (!$institutionId) {
            return $this->error('Institution context required.', 422);
        }

        $query = Hostel::query()
            ->where('institution_id', $institutionId)
            ->withCount(['rooms', 'beds'])
            ->withCount(['beds as occupied_beds_count' => function ($q) {
                $q->where('status', 'occupied');
            }]);

        if ($request->filled('search')) {
            $search = '%' . strtolower($request->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(COALESCE(code, \'\')) LIKE ?', [$search]);
            });
        }

        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $paginator = $query->orderBy('name', 'asc')->paginate($request->input('per_page', 15));

        $data = app(\App\Services\ApiResponseMapService::class)->filterCollection($paginator->items(), 'passthrough');

        // Stats calculations
        $stats = [
            'total_buildings' => (int) Hostel::where('institution_id', $institutionId)->count(),
            'total_rooms' => (int) \App\Models\HostelRoom::whereHas('hostel', function($q) use ($institutionId) {
                $q->where('institution_id', $institutionId);
            })->count(),
            'total_beds' => (int) \App\Models\HostelBed::whereHas('room.hostel', function($q) use ($institutionId) {
                $q->where('institution_id', $institutionId);
            })->count(),
            'occupied_beds' => (int) \App\Models\HostelBed::where('status', 'occupied')
                ->whereHas('room.hostel', function($q) use ($institutionId) {
                    $q->where('institution_id', $institutionId);
                })->count(),
        ];

        return response()->json([
            'success' => true,
            'message' => 'Success',
            'data' => $data,
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'stats' => $stats,
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('create_hostels')) {
            return $this->forbidden('You do not have permission to create hostels.');
        }

        $currentInstitutionId = \App\Support\InstitutionContext::getActiveInstitutionId();

        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'code' => [
                'nullable',
                'string',
                'max:50',
                Rule::unique('hostels', 'code')->where('institution_id', $currentInstitutionId),
            ],
            'type' => 'required|string|in:boys,girls,co-ed,staff',
            'warden_user_id' => 'nullable|exists:users,id',
            'warden_name' => 'nullable|string|max:150',
            'warden_contact' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'total_capacity' => 'nullable|integer|min:0',
            'description' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        $hostel = Hostel::create($validated);

        return $this->created($hostel, 'Hostel created successfully');
    }

    public function show(Request $request, Hostel $hostel): JsonResponse
    {
        if (! $request->user()->hasAbility('view_hostels')) {
            return $this->forbidden('You do not have permission to view hostels.');
        }

        $hostel->load(['floors.rooms.beds', 'warden']);
        $hostel->loadCount(['rooms', 'beds', 'beds as occupied_beds_count' => function ($q) {
            $q->where('status', 'occupied');
        }]);

        return $this->successWithMap($hostel, 'passthrough');
    }

    public function update(Request $request, Hostel $hostel): JsonResponse
    {
        if (! $request->user()->hasAbility('update_hostels')) {
            return $this->forbidden('You do not have permission to update hostels.');
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:150',
            'code' => [
                'sometimes',
                'nullable',
                'string',
                'max:50',
                Rule::unique('hostels', 'code')
                    ->where('institution_id', $hostel->institution_id)
                    ->ignore($hostel->id),
            ],
            'type' => 'sometimes|string|in:boys,girls,co-ed,staff',
            'warden_user_id' => 'nullable|exists:users,id',
            'warden_name' => 'nullable|string|max:150',
            'warden_contact' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'total_capacity' => 'nullable|integer|min:0',
            'description' => 'nullable|string',
            'is_active' => 'nullable|boolean',
        ]);

        $hostel->update($validated);

        return $this->successWithMap($hostel, 'passthrough', 'Hostel updated successfully');
    }

    public function destroy(Request $request, Hostel $hostel): JsonResponse
    {
        if (! $request->user()->hasAbility('delete_hostels')) {
            return $this->forbidden('You do not have permission to delete hostels.');
        }

        if ($hostel->rooms()->whereHas('activeAllocations')->exists()) {
            return $this->error('Cannot delete hostel with active allocations. Check out or cancel residents first.', 422);
        }

        $hostel->delete();

        return $this->success(null, 'Hostel deleted');
    }
}
