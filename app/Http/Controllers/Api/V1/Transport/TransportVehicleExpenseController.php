<?php

namespace App\Http\Controllers\Api\V1\Transport;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\TransportVehicle;
use App\Models\TransportVehicleExpense;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class TransportVehicleExpenseController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('view_transport_vehicles')) {
            return $this->forbidden('You do not have permission to view vehicle expenses.');
        }

        $query = TransportVehicleExpense::query()->with([
            'transportVehicle:id,registration_number,vehicle_type,current_odometer',
            'creator:id,name',
        ]);

        if ($request->filled('transport_vehicle_id')) {
            $query->where('transport_vehicle_id', $request->transport_vehicle_id);
        }

        if ($request->filled('category')) {
            $query->where('category', $request->category);
        }

        if ($request->filled('from_date')) {
            $query->whereDate('expense_date', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $query->whereDate('expense_date', '<=', $request->to_date);
        }

        if ($request->filled('search')) {
            $search = '%' . strtolower($request->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(title) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(vendor_name) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(invoice_number) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(notes) LIKE ?', [$search])
                    ->orWhereHas('transportVehicle', function ($vq) use ($search) {
                        $vq->whereRaw('LOWER(registration_number) LIKE ?', [$search]);
                    });
            });
        }

        return $this->paginatedWithMap(
            $query->orderBy('expense_date', 'desc')->orderBy('id', 'desc')->paginate($request->input('per_page', 15)),
            'passthrough'
        );
    }

    public function store(Request $request): JsonResponse
    {
        if (! ($request->user()->hasAbility('create_transport_vehicles') || $request->user()->hasAbility('update_transport_vehicles'))) {
            return $this->forbidden('You do not have permission to record vehicle expenses.');
        }

        $validated = $request->validate([
            'transport_vehicle_id' => 'required|exists:transport_vehicles,id',
            'expense_date' => 'required|date',
            'category' => 'nullable|string|max:50',
            'title' => 'required|string|max:200',
            'amount' => 'required|numeric|min:0',
            'odometer_reading' => 'nullable|numeric|min:0',
            'vendor_name' => 'nullable|string|max:150',
            'invoice_number' => 'nullable|string|max:100',
            'bill_url' => 'nullable|string',
            'bill_file' => 'nullable|file|mimes:jpeg,png,jpg,pdf,webp|max:10240',
            'next_service_date' => 'nullable|date',
            'next_service_odometer' => 'nullable|numeric|min:0',
            'payment_mode' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
        ]);

        $validated['category'] = $validated['category'] ?? 'maintenance';
        $validated['payment_mode'] = $validated['payment_mode'] ?? 'cash';
        $validated['created_by'] = $request->user()->id;

        $billUrl = $this->handleFileUpload($request, 'bill_file', 'transport/expenses');
        if ($billUrl) {
            $validated['bill_url'] = $billUrl;
        }

        unset($validated['bill_file']);
        $expense = TransportVehicleExpense::create($validated);

        // Sync vehicle current odometer if provided
        if (! empty($validated['odometer_reading'])) {
            $odometer = (float) $validated['odometer_reading'];
            $vehicle = TransportVehicle::find($validated['transport_vehicle_id']);
            if ($vehicle && $odometer > (float) $vehicle->current_odometer) {
                $vehicle->update(['current_odometer' => $odometer]);
            }
        }

        return $this->created(
            $expense->load(['transportVehicle', 'creator']),
            'Expense recorded successfully'
        );
    }

    public function show(Request $request, TransportVehicleExpense $vehicle_expense): JsonResponse
    {
        if (! $request->user()->hasAbility('view_transport_vehicles')) {
            return $this->forbidden('You do not have permission to view vehicle expense details.');
        }

        $vehicle_expense->load(['transportVehicle', 'creator']);

        return $this->successWithMap($vehicle_expense, 'passthrough');
    }

    public function update(Request $request, TransportVehicleExpense $vehicle_expense): JsonResponse
    {
        if (! $request->user()->hasAbility('update_transport_vehicles')) {
            return $this->forbidden('You do not have permission to update vehicle expenses.');
        }

        $validated = $request->validate([
            'transport_vehicle_id' => 'sometimes|required|exists:transport_vehicles,id',
            'expense_date' => 'sometimes|required|date',
            'category' => 'nullable|string|max:50',
            'title' => 'sometimes|required|string|max:200',
            'amount' => 'sometimes|required|numeric|min:0',
            'odometer_reading' => 'nullable|numeric|min:0',
            'vendor_name' => 'nullable|string|max:150',
            'invoice_number' => 'nullable|string|max:100',
            'bill_url' => 'nullable|string',
            'bill_file' => 'nullable|file|mimes:jpeg,png,jpg,pdf,webp|max:10240',
            'next_service_date' => 'nullable|date',
            'next_service_odometer' => 'nullable|numeric|min:0',
            'payment_mode' => 'nullable|string|max:50',
            'notes' => 'nullable|string',
        ]);

        $billUrl = $this->handleFileUpload($request, 'bill_file', 'transport/expenses');
        if ($billUrl) {
            $validated['bill_url'] = $billUrl;
        }

        unset($validated['bill_file']);
        $vehicle_expense->update($validated);

        if (! empty($validated['odometer_reading'])) {
            $odometer = (float) $validated['odometer_reading'];
            $vehicle = $vehicle_expense->transportVehicle;
            if ($vehicle && $odometer > (float) $vehicle->current_odometer) {
                $vehicle->update(['current_odometer' => $odometer]);
            }
        }

        return $this->successWithMap(
            $vehicle_expense->fresh(['transportVehicle', 'creator']),
            'passthrough',
            'Expense updated successfully'
        );
    }

    public function destroy(Request $request, TransportVehicleExpense $vehicle_expense): JsonResponse
    {
        if (! $request->user()->hasAbility('delete_transport_vehicles')) {
            return $this->forbidden('You do not have permission to delete vehicle expenses.');
        }

        $vehicle_expense->delete();

        return $this->success(null, 'Expense deleted successfully');
    }

    public function export(Request $request)
    {
        if (! $request->user()->hasAbility('view_transport_vehicles')) {
            return $this->forbidden('You do not have permission to export vehicle expenses.');
        }

        return \Maatwebsite\Excel\Facades\Excel::download(
            new \App\Exports\TransportVehicleExpenseExport($request->all()),
            'transport_vehicle_expenses_' . now()->format('Y-m-d') . '.xlsx'
        );
    }

    protected function handleFileUpload(Request $request, string $field = 'bill_file', string $folder = 'transport/expenses'): ?string
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
