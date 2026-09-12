<?php

namespace App\Http\Controllers\Api\V1\Transport;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\TransportVehicle;
use App\Models\TransportVehicleFuel;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TransportVehicleFuelController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('view_transport_vehicles')) {
            return $this->forbidden('You do not have permission to view fuel logs.');
        }

        $query = TransportVehicleFuel::query()->with([
            'transportVehicle:id,registration_number,vehicle_type,fuel_type,current_odometer',
            'transportDriver:id,name',
            'creator:id,name',
        ]);

        if ($request->filled('transport_vehicle_id')) {
            $query->where('transport_vehicle_id', $request->transport_vehicle_id);
        }

        if ($request->filled('fuel_type')) {
            $query->where('fuel_type', $request->fuel_type);
        }

        if ($request->filled('from_date')) {
            $query->whereDate('fuel_date', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $query->whereDate('fuel_date', '<=', $request->to_date);
        }

        if ($request->filled('search')) {
            $search = '%' . strtolower($request->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(vendor_name) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(invoice_number) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(notes) LIKE ?', [$search])
                    ->orWhereHas('transportVehicle', function ($vq) use ($search) {
                        $vq->whereRaw('LOWER(registration_number) LIKE ?', [$search]);
                    });
            });
        }

        return $this->paginatedWithMap(
            $query->orderBy('fuel_date', 'desc')->orderBy('id', 'desc')->paginate($request->input('per_page', 15)),
            'passthrough'
        );
    }

    public function store(Request $request): JsonResponse
    {
        if (! ($request->user()->hasAbility('create_transport_vehicles') || $request->user()->hasAbility('update_transport_vehicles'))) {
            return $this->forbidden('You do not have permission to log vehicle fuel.');
        }

        $validated = $request->validate([
            'transport_vehicle_id' => 'required|exists:transport_vehicles,id',
            'transport_driver_id' => 'nullable|exists:transport_drivers,id',
            'fuel_date' => 'required|date',
            'fuel_time' => 'nullable|string',
            'fuel_type' => 'nullable|string|max:30',
            'odometer_reading' => 'required|numeric|min:0',
            'liters' => 'required|numeric|gt:0',
            'rate_per_liter' => 'required|numeric|gt:0',
            'total_amount' => 'nullable|numeric|min:0',
            'is_full_tank' => 'nullable|boolean',
            'vendor_name' => 'nullable|string|max:150',
            'payment_mode' => 'nullable|string|max:50',
            'invoice_number' => 'nullable|string|max:100',
            'bill_url' => 'nullable|string',
            'bill_file' => 'nullable|file|mimes:jpeg,png,jpg,pdf,webp|max:10240',
            'notes' => 'nullable|string',
        ]);

        $liters = (float) $validated['liters'];
        $rate = (float) $validated['rate_per_liter'];
        $odometer = (float) $validated['odometer_reading'];
        $isFullTank = filter_var($validated['is_full_tank'] ?? true, FILTER_VALIDATE_BOOLEAN);

        $validated['total_amount'] = isset($validated['total_amount']) && (float) $validated['total_amount'] > 0
            ? (float) $validated['total_amount']
            : round($liters * $rate, 2);

        $validated['is_full_tank'] = $isFullTank;
        $validated['fuel_type'] = $validated['fuel_type'] ?? 'diesel';
        $validated['payment_mode'] = $validated['payment_mode'] ?? 'cash';
        $validated['created_by'] = $request->user()->id;

        // Handle bill file upload
        $billUrl = $this->handleFileUpload($request, 'bill_file', 'transport/fuels');
        if ($billUrl) {
            $validated['bill_url'] = $billUrl;
        }

        // Automatic Mileage (Tank-to-Tank) calculation
        if ($isFullTank && $liters > 0) {
            $prevFullFuel = TransportVehicleFuel::where('transport_vehicle_id', $validated['transport_vehicle_id'])
                ->where('is_full_tank', true)
                ->where('odometer_reading', '<', $odometer)
                ->orderBy('odometer_reading', 'desc')
                ->first();

            if ($prevFullFuel) {
                $distance = $odometer - (float) $prevFullFuel->odometer_reading;
                if ($distance > 0) {
                    $validated['calculated_mileage'] = round($distance / $liters, 2);
                }
            }
        }

        unset($validated['bill_file']);
        $fuel = TransportVehicleFuel::create($validated);

        // Sync vehicle current odometer
        $vehicle = TransportVehicle::find($validated['transport_vehicle_id']);
        if ($vehicle && $odometer > (float) $vehicle->current_odometer) {
            $vehicle->update(['current_odometer' => $odometer]);
        }

        return $this->created(
            $fuel->load(['transportVehicle', 'transportDriver', 'creator']),
            'Fuel refill recorded successfully'
        );
    }

    public function show(Request $request, TransportVehicleFuel $vehicle_fuel): JsonResponse
    {
        if (! $request->user()->hasAbility('view_transport_vehicles')) {
            return $this->forbidden('You do not have permission to view fuel details.');
        }

        $vehicle_fuel->load(['transportVehicle', 'transportDriver', 'creator']);

        return $this->successWithMap($vehicle_fuel, 'passthrough');
    }

    public function update(Request $request, TransportVehicleFuel $vehicle_fuel): JsonResponse
    {
        if (! $request->user()->hasAbility('update_transport_vehicles')) {
            return $this->forbidden('You do not have permission to update fuel logs.');
        }

        $validated = $request->validate([
            'transport_vehicle_id' => 'sometimes|required|exists:transport_vehicles,id',
            'transport_driver_id' => 'nullable|exists:transport_drivers,id',
            'fuel_date' => 'sometimes|required|date',
            'fuel_time' => 'nullable|string',
            'fuel_type' => 'nullable|string|max:30',
            'odometer_reading' => 'sometimes|required|numeric|min:0',
            'liters' => 'sometimes|required|numeric|gt:0',
            'rate_per_liter' => 'sometimes|required|numeric|gt:0',
            'total_amount' => 'nullable|numeric|min:0',
            'is_full_tank' => 'nullable|boolean',
            'vendor_name' => 'nullable|string|max:150',
            'payment_mode' => 'nullable|string|max:50',
            'invoice_number' => 'nullable|string|max:100',
            'bill_url' => 'nullable|string',
            'bill_file' => 'nullable|file|mimes:jpeg,png,jpg,pdf,webp|max:10240',
            'notes' => 'nullable|string',
        ]);

        $liters = isset($validated['liters']) ? (float) $validated['liters'] : (float) $vehicle_fuel->liters;
        $rate = isset($validated['rate_per_liter']) ? (float) $validated['rate_per_liter'] : (float) $vehicle_fuel->rate_per_liter;

        if (array_key_exists('total_amount', $validated) && (float) $validated['total_amount'] > 0) {
            $validated['total_amount'] = (float) $validated['total_amount'];
        } elseif (isset($validated['liters']) || isset($validated['rate_per_liter'])) {
            $validated['total_amount'] = round($liters * $rate, 2);
        }

        $billUrl = $this->handleFileUpload($request, 'bill_file', 'transport/fuels');
        if ($billUrl) {
            $validated['bill_url'] = $billUrl;
        }

        unset($validated['bill_file']);
        $vehicle_fuel->update($validated);

        // Update vehicle odometer if higher
        $vehicle = $vehicle_fuel->transportVehicle;
        $odometer = (float) $vehicle_fuel->odometer_reading;
        if ($vehicle && $odometer > (float) $vehicle->current_odometer) {
            $vehicle->update(['current_odometer' => $odometer]);
        }

        return $this->successWithMap(
            $vehicle_fuel->fresh(['transportVehicle', 'transportDriver', 'creator']),
            'passthrough',
            'Fuel record updated successfully'
        );
    }

    public function destroy(Request $request, TransportVehicleFuel $vehicle_fuel): JsonResponse
    {
        if (! $request->user()->hasAbility('delete_transport_vehicles')) {
            return $this->forbidden('You do not have permission to delete fuel logs.');
        }

        $vehicle_fuel->delete();

        return $this->success(null, 'Fuel record deleted successfully');
    }

    public function export(Request $request)
    {
        if (! $request->user()->hasAbility('view_transport_vehicles')) {
            return $this->forbidden('You do not have permission to export fuel records.');
        }

        return \Maatwebsite\Excel\Facades\Excel::download(
            new \App\Exports\TransportVehicleFuelExport($request->all()),
            'transport_vehicle_fuels_' . now()->format('Y-m-d') . '.xlsx'
        );
    }

    protected function handleFileUpload(Request $request, string $field = 'bill_file', string $folder = 'transport/fuels'): ?string
    {
        if ($request->hasFile($field)) {
            $file = $request->file($field);
            $originalName = $file->getClientOriginalName();
            $mimeType = $file->getClientMimeType() ?: 'application/octet-stream';
            try {
                $r2Service = app(\App\Services\R2Service::class);
                $sanitized = preg_replace('/[^a-zA-Z0-9._-]/', '_', basename($originalName));
                $r2Path = $folder . '/' . uniqid() . '_' . $sanitized;
                $r2Service->put($r2Path, fopen($file->getRealPath(), 'r'), $mimeType);
                return $r2Service->viewUrl($r2Path);
            } catch (\Throwable $e) {
                $path = $file->store($folder, 'public');
                return Storage::url($path);
            }
        }
        return $request->input('bill_url');
    }
}
