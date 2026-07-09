<?php

namespace App\Http\Controllers\Api\V1\Inventory;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\InventoryLocation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InventoryLocationController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('view_inventory_locations')) {
            return $this->forbidden('You do not have permission to view inventory locations.');
        }

        $query = InventoryLocation::query();

        if ($request->filled('search')) {
            $search = '%' . strtolower($request->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(COALESCE(code, \'\')) LIKE ?', [$search]);
            });
        }

        return $this->paginatedWithMap(
            $query->orderBy('name', 'asc')->paginate($request->input('per_page', 15)),
            'passthrough'
        );
    }

    public function store(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('create_inventory_locations')) {
            return $this->forbidden('You do not have permission to create inventory locations.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'code' => 'nullable|string|max:50',
        ]);

        $location = InventoryLocation::create($validated);
        return $this->created($location, 'Location created successfully');
    }

    public function show(Request $request, InventoryLocation $inventory_location): JsonResponse
    {
        if (! $request->user()->hasAbility('view_inventory_locations')) {
            return $this->forbidden('You do not have permission to view inventory locations.');
        }

        return $this->successWithMap($inventory_location, 'passthrough');
    }

    public function update(Request $request, InventoryLocation $inventory_location): JsonResponse
    {
        if (! $request->user()->hasAbility('update_inventory_locations')) {
            return $this->forbidden('You do not have permission to update inventory locations.');
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:150',
            'code' => 'nullable|string|max:50',
        ]);

        $inventory_location->update($validated);
        return $this->successWithMap($inventory_location, 'passthrough', 'Location updated successfully');
    }

    public function destroy(Request $request, InventoryLocation $inventory_location): JsonResponse
    {
        if (! $request->user()->hasAbility('delete_inventory_locations')) {
            return $this->forbidden('You do not have permission to delete inventory locations.');
        }

        $inventory_location->delete();
        return $this->success(null, 'Location deleted');
    }
}
