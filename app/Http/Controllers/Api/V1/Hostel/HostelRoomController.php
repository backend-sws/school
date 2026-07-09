<?php

namespace App\Http\Controllers\Api\V1\Hostel;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\HostelRoom;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HostelRoomController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('view_hostel_rooms')) {
            return $this->forbidden('You do not have permission to view hostel rooms.');
        }

        $institutionId = \App\Support\InstitutionContext::getActiveInstitutionId();
        if (!$institutionId) {
            return $this->error('Institution context required.', 422);
        }

        $query = HostelRoom::query()
            ->whereHas('hostel', function($q) use ($institutionId) {
                $q->where('institution_id', $institutionId);
            })
            ->with(['hostel:id,name,code,type', 'floor:id,name,floor_number'])
            ->withCount(['beds', 'beds as occupied_beds_count' => function ($q) {
                $q->where('status', 'occupied');
            }]);

        if ($request->filled('search')) {
            $search = '%' . strtolower($request->search) . '%';
            $query->whereRaw('LOWER(room_number) LIKE ?', [$search]);
        }

        if ($request->filled('hostel_id') && $request->hostel_id !== 'all') {
            $query->where('hostel_id', $request->hostel_id);
        }

        if ($request->filled('hostel_floor_id') && $request->hostel_floor_id !== 'all') {
            $query->where('hostel_floor_id', $request->hostel_floor_id);
        }

        if ($request->filled('type') && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        if ($request->filled('is_active') && $request->is_active !== 'all') {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($request->filled('availability') && $request->availability !== 'all') {
            if ($request->availability === 'available') {
                $query->whereColumn(
                    \DB::raw('(SELECT COUNT(*) FROM hostel_beds WHERE hostel_beds.hostel_room_id = hostel_rooms.id AND hostel_beds.status = \'occupied\')'),
                    '<',
                    'bed_count'
                );
            } elseif ($request->availability === 'full') {
                $query->whereColumn(
                    \DB::raw('(SELECT COUNT(*) FROM hostel_beds WHERE hostel_beds.hostel_room_id = hostel_rooms.id AND hostel_beds.status = \'occupied\')'),
                    '>=',
                    'bed_count'
                );
            }
        }

        $paginator = $query->orderBy('room_number', 'asc')->paginate($request->input('per_page', 15));

        $data = app(\App\Services\ApiResponseMapService::class)->filterCollection($paginator->items(), 'passthrough');

        // Dynamic stats calculations
        $totalRooms = HostelRoom::whereHas('hostel', function($q) use ($institutionId) {
            $q->where('institution_id', $institutionId);
        })->count();

        $totalBeds = HostelRoom::whereHas('hostel', function($q) use ($institutionId) {
            $q->where('institution_id', $institutionId);
        })->sum('bed_count');

        $occupiedBeds = \App\Models\HostelBed::whereHas('room.hostel', function($q) use ($institutionId) {
            $q->where('institution_id', $institutionId);
        })->where('status', 'occupied')->count();

        $availableBeds = max(0, $totalBeds - $occupiedBeds);

        $stats = [
            'total_rooms' => (int) $totalRooms,
            'total_beds' => (int) $totalBeds,
            'occupied_beds' => (int) $occupiedBeds,
            'available_beds' => (int) $availableBeds,
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

    public function export(Request $request)
    {
        if (! $request->user()->hasAbility('view_hostel_rooms')) {
            return $this->forbidden('You do not have permission to view hostel rooms.');
        }

        $institutionId = \App\Support\InstitutionContext::getActiveInstitutionId();
        if (!$institutionId) {
            return $this->error('Institution context required.', 422);
        }

        return \Maatwebsite\Excel\Facades\Excel::download(
            new \App\Exports\HostelRoomExport($institutionId, $request->all()),
            'hostel_rooms.xlsx'
        );
    }

    public function store(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('create_hostel_rooms')) {
            return $this->forbidden('You do not have permission to create hostel rooms.');
        }

        $validated = $request->validate([
            'hostel_id' => 'required|exists:hostels,id',
            'hostel_floor_id' => 'nullable|exists:hostel_floors,id',
            'floor_name' => 'nullable|string|max:50',
            'room_number' => 'required|string|max:30',
            'type' => 'required|string|in:single,double,triple,dormitory',
            'bed_count' => 'required|integer|min:1|max:50',
            'monthly_fee' => 'required|numeric|min:0',
            'amenities' => 'nullable|array',
            'amenities.*' => 'string',
            'is_active' => 'nullable|boolean',
        ]);

        if (!empty($validated['floor_name'])) {
            $floor = \App\Models\HostelFloor::firstOrCreate(
                ['hostel_id' => $validated['hostel_id'], 'name' => $validated['floor_name']],
                ['floor_number' => ((int)\App\Models\HostelFloor::where('hostel_id', $validated['hostel_id'])->max('floor_number')) + 1]
            );
            $validated['hostel_floor_id'] = $floor->id;
        }

        $room = HostelRoom::create($validated);

        // Auto-create bed entities
        for ($i = 1; $i <= $validated['bed_count']; $i++) {
            $room->beds()->create([
                'bed_label' => (string) $i,
                'status' => 'vacant',
            ]);
        }

        $room->loadCount('beds');

        return $this->created($room, 'Room created successfully');
    }

    public function show(Request $request, HostelRoom $hostel_room): JsonResponse
    {
        if (! $request->user()->hasAbility('view_hostel_rooms')) {
            return $this->forbidden('You do not have permission to view hostel rooms.');
        }

        $hostel_room->load(['hostel:id,name,code,type', 'floor:id,name,floor_number', 'beds.activeAllocation.user']);
        $hostel_room->loadCount(['beds', 'beds as occupied_beds_count' => function ($q) {
            $q->where('status', 'occupied');
        }]);

        return $this->successWithMap($hostel_room, 'passthrough');
    }

    public function update(Request $request, HostelRoom $hostel_room): JsonResponse
    {
        if (! $request->user()->hasAbility('update_hostel_rooms')) {
            return $this->forbidden('You do not have permission to update hostel rooms.');
        }

        $validated = $request->validate([
            'hostel_id' => 'sometimes|exists:hostels,id',
            'hostel_floor_id' => 'nullable|exists:hostel_floors,id',
            'floor_name' => 'nullable|string|max:50',
            'room_number' => 'sometimes|string|max:30',
            'type' => 'sometimes|string|in:single,double,triple,dormitory',
            'bed_count' => 'sometimes|integer|min:1|max:50',
            'monthly_fee' => 'sometimes|required|numeric|min:0',
            'amenities' => 'nullable|array',
            'amenities.*' => 'string',
            'is_active' => 'nullable|boolean',
        ]);

        if (!empty($validated['floor_name'])) {
            $hostelId = $validated['hostel_id'] ?? $hostel_room->hostel_id;
            $floor = \App\Models\HostelFloor::firstOrCreate(
                ['hostel_id' => $hostelId, 'name' => $validated['floor_name']],
                ['floor_number' => ((int)\App\Models\HostelFloor::where('hostel_id', $hostelId)->max('floor_number')) + 1]
            );
            $validated['hostel_floor_id'] = $floor->id;
        }

        $hostel_room->update($validated);

        // Sync beds if bed_count changed
        if (isset($validated['bed_count'])) {
            $currentCount = $hostel_room->beds()->count();
            $newCount = $validated['bed_count'];

            if ($newCount > $currentCount) {
                for ($i = $currentCount + 1; $i <= $newCount; $i++) {
                    $hostel_room->beds()->create([
                        'bed_label' => (string) $i,
                        'status' => 'vacant',
                    ]);
                }
            }
            // Note: we don't auto-delete beds if count reduced (to avoid data loss)
        }

        return $this->successWithMap($hostel_room, 'passthrough', 'Room updated successfully');
    }

    public function destroy(Request $request, HostelRoom $hostel_room): JsonResponse
    {
        if (! $request->user()->hasAbility('delete_hostel_rooms')) {
            return $this->forbidden('You do not have permission to delete hostel rooms.');
        }

        if ($hostel_room->activeAllocations()->exists()) {
            return $this->error('Cannot delete room with active allocations.', 422);
        }

        $hostel_room->delete();

        return $this->success(null, 'Room deleted');
    }
}
