<?php

namespace App\Http\Controllers\Api\V1\Hostel;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\HostelBed;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class HostelBedController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('view_hostel_beds')) {
            return $this->forbidden('You do not have permission to view hostel beds.');
        }

        $query = HostelBed::query()->with(['room.hostel:id,name,code']);

        if ($request->filled('hostel_room_id')) {
            $query->where('hostel_room_id', $request->hostel_room_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return $this->paginatedWithMap(
            $query->orderBy('bed_label', 'asc')->paginate($request->input('per_page', 50)),
            'passthrough'
        );
    }

    public function update(Request $request, HostelBed $hostel_bed): JsonResponse
    {
        if (! $request->user()->hasAbility('update_hostel_beds')) {
            return $this->forbidden('You do not have permission to update hostel beds.');
        }

        $validated = $request->validate([
            'bed_label' => 'sometimes|string|max:30',
            'status' => 'sometimes|string|in:vacant,occupied,maintenance',
            'notes' => 'nullable|string',
        ]);

        $hostel_bed->update($validated);

        return $this->successWithMap($hostel_bed, 'passthrough', 'Bed updated successfully');
    }

    public function destroy(Request $request, HostelBed $hostel_bed): JsonResponse
    {
        if (! $request->user()->hasAbility('delete_hostel_beds')) {
            return $this->forbidden('You do not have permission to delete hostel beds.');
        }

        if ($hostel_bed->activeAllocation()->exists()) {
            return $this->error('Cannot delete bed with active allocation.', 422);
        }

        $hostel_bed->delete();

        return $this->success(null, 'Bed deleted');
    }
}
