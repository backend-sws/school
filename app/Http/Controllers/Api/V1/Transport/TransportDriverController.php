<?php

namespace App\Http\Controllers\Api\V1\Transport;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\TransportDriver;
use App\Support\InstitutionContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TransportDriverController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('view_transport_drivers')) {
            return $this->forbidden('You do not have permission to view drivers.');
        }

        $query = TransportDriver::query()->with('user:id,name,email');

        if ($request->filled('search')) {
            $search = '%' . strtolower($request->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(COALESCE(license_number, \'\')) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(COALESCE(mobile, \'\')) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(COALESCE(email, \'\')) LIKE ?', [$search]);
            });
        }

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        return $this->paginatedWithMap(
            $query->orderBy('name', 'asc')->paginate($request->input('per_page', 15)),
            'passthrough'
        );
    }

    public function store(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('create_transport_drivers')) {
            return $this->forbidden('You do not have permission to create drivers.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'license_number' => 'nullable|string|max:80',
            'license_valid_until' => 'nullable|date',
            'mobile' => 'nullable|string|regex:/^\+?[0-9]{10,15}$/',
            'email' => 'nullable|email|max:100',
            'user_id' => 'nullable|exists:users,id',
            'is_active' => 'nullable|boolean',
        ]);

        $institutionId = InstitutionContext::getActiveInstitutionId();
        if ($institutionId) {
            $validated['institution_id'] = $institutionId;
        }

        $driver = TransportDriver::create($validated);

        return $this->created($driver, 'Driver created successfully');
    }

    public function show(Request $request, TransportDriver $transport_driver): JsonResponse
    {
        if (! $request->user()->hasAbility('view_transport_drivers')) {
            return $this->forbidden('You do not have permission to view drivers.');
        }

        $transport_driver->load('user:id,name,email');

        return $this->successWithMap($transport_driver, 'passthrough');
    }

    public function update(Request $request, TransportDriver $transport_driver): JsonResponse
    {
        if (! $request->user()->hasAbility('update_transport_drivers')) {
            return $this->forbidden('You do not have permission to update drivers.');
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:150',
            'license_number' => 'nullable|string|max:80',
            'license_valid_until' => 'nullable|date',
            'mobile' => 'nullable|string|regex:/^\+?[0-9]{10,15}$/',
            'email' => 'nullable|email|max:100',
            'user_id' => 'nullable|exists:users,id',
            'is_active' => 'nullable|boolean',
        ]);

        $transport_driver->update($validated);

        return $this->successWithMap($transport_driver, 'passthrough', 'Driver updated successfully');
    }

    public function destroy(Request $request, TransportDriver $transport_driver): JsonResponse
    {
        if (! $request->user()->hasAbility('delete_transport_drivers')) {
            return $this->forbidden('You do not have permission to delete drivers.');
        }

        $transport_driver->delete();

        return $this->success(null, 'Driver deleted');
    }
}
