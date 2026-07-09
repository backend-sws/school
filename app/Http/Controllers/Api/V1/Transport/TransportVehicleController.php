<?php

namespace App\Http\Controllers\Api\V1\Transport;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\TransportVehicle;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TransportVehicleController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('view_transport_vehicles')) {
            return $this->forbidden('You do not have permission to view vehicles.');
        }

        $query = TransportVehicle::query()->with(['transportRoute:id,name,code', 'transportDriver:id,name']);

        if ($request->filled('search')) {
            $search = '%' . strtolower($request->search) . '%';
            $query->whereRaw('LOWER(registration_number) LIKE ?', [$search]);
        }

        if ($request->filled('route_id')) {
            $query->where('transport_route_id', $request->route_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        return $this->paginatedWithMap(
            $query->orderBy('registration_number', 'asc')->paginate($request->input('per_page', 15)),
            'passthrough'
        );
    }

    public function store(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('create_transport_vehicles')) {
            return $this->forbidden('You do not have permission to create vehicles.');
        }

        $validated = $request->validate([
            'registration_number' => 'required|string|max:30',
            'vehicle_type' => 'nullable|string|max:30|in:bus,van,cab',
            'capacity' => 'required|integer|min:1',
            'transport_route_id' => 'nullable|exists:transport_routes,id',
            'transport_driver_id' => 'nullable|exists:transport_drivers,id',
            'status' => 'nullable|string|max:20|in:active,maintenance,inactive',
            'notes' => 'nullable|string',
        ]);

        $validated['vehicle_type'] = $validated['vehicle_type'] ?? 'bus';
        $validated['status'] = $validated['status'] ?? 'active';

        $vehicle = TransportVehicle::create($validated);

        return $this->created($vehicle->load(['transportRoute:id,name', 'transportDriver:id,name']), 'Vehicle created successfully');
    }

    public function show(Request $request, TransportVehicle $transport_vehicle): JsonResponse
    {
        if (! $request->user()->hasAbility('view_transport_vehicles')) {
            return $this->forbidden('You do not have permission to view vehicles.');
        }

        $transport_vehicle->load(['transportRoute', 'transportDriver']);

        return $this->successWithMap($transport_vehicle, 'passthrough');
    }

    public function update(Request $request, TransportVehicle $transport_vehicle): JsonResponse
    {
        if (! $request->user()->hasAbility('update_transport_vehicles')) {
            return $this->forbidden('You do not have permission to update vehicles.');
        }

        $validated = $request->validate([
            'registration_number' => 'sometimes|string|max:30',
            'vehicle_type' => 'nullable|string|max:30|in:bus,van,cab',
            'capacity' => 'sometimes|integer|min:1',
            'transport_route_id' => 'nullable|exists:transport_routes,id',
            'transport_driver_id' => 'nullable|exists:transport_drivers,id',
            'status' => 'nullable|string|max:20|in:active,maintenance,inactive',
            'notes' => 'nullable|string',
        ]);

        $transport_vehicle->update($validated);

        return $this->successWithMap($transport_vehicle->fresh(['transportRoute', 'transportDriver']), 'passthrough', 'Vehicle updated successfully');
    }

    public function destroy(Request $request, TransportVehicle $transport_vehicle): JsonResponse
    {
        if (! $request->user()->hasAbility('delete_transport_vehicles')) {
            return $this->forbidden('You do not have permission to delete vehicles.');
        }

        $transport_vehicle->delete();

        return $this->success(null, 'Vehicle deleted');
    }
}
