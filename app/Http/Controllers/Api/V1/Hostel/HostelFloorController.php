<?php

namespace App\Http\Controllers\Api\V1\Hostel;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\Hostel;
use App\Models\HostelFloor;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HostelFloorController extends BaseController
{
    public function index(Request $request, Hostel $hostel): JsonResponse
    {
        if (! $request->user()->hasAbility('view_hostels')) {
            return $this->forbidden('You do not have permission to view hostels.');
        }

        $floors = $hostel->floors()->withCount('rooms')->orderBy('floor_number')->get();

        return $this->success($floors);
    }

    public function store(Request $request, Hostel $hostel): JsonResponse
    {
        if (! $request->user()->hasAbility('update_hostels')) {
            return $this->forbidden('You do not have permission to update hostels.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'floor_number' => 'required|integer|min:0',
            'description' => 'nullable|string',
        ]);

        $validated['hostel_id'] = $hostel->id;

        $floor = HostelFloor::create($validated);

        return $this->created($floor, 'Floor added successfully');
    }

    public function update(Request $request, Hostel $hostel, HostelFloor $floor): JsonResponse
    {
        if (! $request->user()->hasAbility('update_hostels')) {
            return $this->forbidden('You do not have permission to update hostels.');
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'floor_number' => 'sometimes|integer|min:0',
            'description' => 'nullable|string',
        ]);

        $floor->update($validated);

        return $this->successWithMap($floor, 'passthrough', 'Floor updated successfully');
    }

    public function destroy(Request $request, Hostel $hostel, HostelFloor $floor): JsonResponse
    {
        if (! $request->user()->hasAbility('update_hostels')) {
            return $this->forbidden('You do not have permission to update hostels.');
        }

        if ($floor->rooms()->whereHas('activeAllocations')->exists()) {
            return $this->error('Cannot delete floor with active room allocations.', 422);
        }

        $floor->delete();

        return $this->success(null, 'Floor deleted');
    }
}
