<?php

namespace App\Http\Controllers\Api\V1\Transport;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\TransportVehicle;
use App\Models\TransportVehicleLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TransportVehicleLogController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('view_transport_vehicles')) {
            return $this->forbidden('You do not have permission to view vehicle logs.');
        }

        $query = TransportVehicleLog::query()->with([
            'transportVehicle:id,registration_number,vehicle_type,current_odometer',
            'transportDriver:id,name,mobile',
            'transportRoute:id,name,code',
            'creator:id,name',
        ]);

        if ($request->filled('transport_vehicle_id')) {
            $query->where('transport_vehicle_id', $request->transport_vehicle_id);
        }

        if ($request->filled('transport_driver_id')) {
            $query->where('transport_driver_id', $request->transport_driver_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('from_date')) {
            $query->whereDate('log_date', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $query->whereDate('log_date', '<=', $request->to_date);
        }

        if ($request->filled('search')) {
            $search = '%' . strtolower($request->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(purpose) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(notes) LIKE ?', [$search])
                    ->orWhereHas('transportVehicle', function ($vq) use ($search) {
                        $vq->whereRaw('LOWER(registration_number) LIKE ?', [$search]);
                    });
            });
        }

        return $this->paginatedWithMap(
            $query->orderBy('log_date', 'desc')->orderBy('id', 'desc')->paginate($request->input('per_page', 15)),
            'passthrough'
        );
    }

    public function store(Request $request): JsonResponse
    {
        if (! ($request->user()->hasAbility('create_transport_vehicles') || $request->user()->hasAbility('update_transport_vehicles'))) {
            return $this->forbidden('You do not have permission to create vehicle logs.');
        }

        $validated = $request->validate([
            'transport_vehicle_id' => 'required|exists:transport_vehicles,id',
            'transport_driver_id' => 'nullable|exists:transport_drivers,id',
            'transport_route_id' => 'nullable|exists:transport_routes,id',
            'log_date' => 'required|date',
            'trip_type' => 'nullable|string|max:40',
            'purpose' => 'nullable|string|max:255',
            'start_odometer' => 'required|numeric|min:0',
            'end_odometer' => 'nullable|numeric|min:0',
            'start_time' => 'nullable|string',
            'end_time' => 'nullable|string',
            'status' => 'nullable|string|in:completed,in_progress,cancelled',
            'notes' => 'nullable|string',
        ]);

        $start = (float) $validated['start_odometer'];
        $end = isset($validated['end_odometer']) && $validated['end_odometer'] !== '' ? (float) $validated['end_odometer'] : null;

        if ($end !== null && $end < $start) {
            return $this->validationError(['end_odometer' => ['End odometer cannot be less than start odometer.']]);
        }

        $validated['total_km'] = $end !== null ? round($end - $start, 2) : 0;
        $validated['trip_type'] = $validated['trip_type'] ?? 'regular';
        $validated['status'] = $validated['status'] ?? 'completed';
        $validated['created_by'] = $request->user()->id;

        $log = TransportVehicleLog::create($validated);

        // Sync vehicle current odometer
        $highestOdometer = max($start, $end ?? $start);
        $vehicle = TransportVehicle::find($validated['transport_vehicle_id']);
        if ($vehicle && $highestOdometer > (float) $vehicle->current_odometer) {
            $vehicle->update(['current_odometer' => $highestOdometer]);
        }

        return $this->created(
            $log->load(['transportVehicle', 'transportDriver', 'transportRoute', 'creator']),
            'Trip log saved successfully'
        );
    }

    public function show(Request $request, TransportVehicleLog $vehicle_log): JsonResponse
    {
        if (! $request->user()->hasAbility('view_transport_vehicles')) {
            return $this->forbidden('You do not have permission to view vehicle logs.');
        }

        $vehicle_log->load(['transportVehicle', 'transportDriver', 'transportRoute', 'creator']);

        return $this->successWithMap($vehicle_log, 'passthrough');
    }

    public function update(Request $request, TransportVehicleLog $vehicle_log): JsonResponse
    {
        if (! $request->user()->hasAbility('update_transport_vehicles')) {
            return $this->forbidden('You do not have permission to update vehicle logs.');
        }

        $validated = $request->validate([
            'transport_vehicle_id' => 'sometimes|required|exists:transport_vehicles,id',
            'transport_driver_id' => 'nullable|exists:transport_drivers,id',
            'transport_route_id' => 'nullable|exists:transport_routes,id',
            'log_date' => 'sometimes|required|date',
            'trip_type' => 'nullable|string|max:40',
            'purpose' => 'nullable|string|max:255',
            'start_odometer' => 'sometimes|required|numeric|min:0',
            'end_odometer' => 'nullable|numeric|min:0',
            'start_time' => 'nullable|string',
            'end_time' => 'nullable|string',
            'status' => 'nullable|string|in:completed,in_progress,cancelled',
            'notes' => 'nullable|string',
        ]);

        $start = isset($validated['start_odometer']) ? (float) $validated['start_odometer'] : (float) $vehicle_log->start_odometer;
        $end = array_key_exists('end_odometer', $validated)
            ? ($validated['end_odometer'] !== null && $validated['end_odometer'] !== '' ? (float) $validated['end_odometer'] : null)
            : ($vehicle_log->end_odometer !== null ? (float) $vehicle_log->end_odometer : null);

        if ($end !== null && $end < $start) {
            return $this->validationError(['end_odometer' => ['End odometer cannot be less than start odometer.']]);
        }

        $validated['total_km'] = $end !== null ? round($end - $start, 2) : 0;
        $vehicle_log->update($validated);

        // Update vehicle odometer if higher
        $vehicle = $vehicle_log->transportVehicle;
        $highestOdometer = max($start, $end ?? $start);
        if ($vehicle && $highestOdometer > (float) $vehicle->current_odometer) {
            $vehicle->update(['current_odometer' => $highestOdometer]);
        }

        return $this->successWithMap(
            $vehicle_log->fresh(['transportVehicle', 'transportDriver', 'transportRoute', 'creator']),
            'passthrough',
            'Trip log updated successfully'
        );
    }

    public function destroy(Request $request, TransportVehicleLog $vehicle_log): JsonResponse
    {
        if (! $request->user()->hasAbility('delete_transport_vehicles')) {
            return $this->forbidden('You do not have permission to delete vehicle logs.');
        }

        $vehicle_log->delete();

        return $this->success(null, 'Trip log deleted successfully');
    }

    public function export(Request $request)
    {
        if (! $request->user()->hasAbility('view_transport_vehicles')) {
            return $this->forbidden('You do not have permission to export vehicle logs.');
        }

        return \Maatwebsite\Excel\Facades\Excel::download(
            new \App\Exports\TransportVehicleLogExport($request->all()),
            'transport_vehicle_trips_' . now()->format('Y-m-d') . '.xlsx'
        );
    }
}
