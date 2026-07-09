<?php

namespace App\Http\Controllers\Api\V1\Inventory;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\InventoryCategory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InventoryCategoryController extends BaseController
{
    public function index(Request $request): JsonResponse
    {
        if (! $request->user()->hasAbility('view_inventory_categories')) {
            return $this->forbidden('You do not have permission to view inventory categories.');
        }

        $query = InventoryCategory::query();

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
        if (! $request->user()->hasAbility('create_inventory_categories')) {
            return $this->forbidden('You do not have permission to create inventory categories.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'code' => 'nullable|string|max:50',
            'description' => 'nullable|string',
        ]);

        $category = InventoryCategory::create($validated);
        return $this->created($category, 'Category created successfully');
    }

    public function show(Request $request, InventoryCategory $inventory_category): JsonResponse
    {
        if (! $request->user()->hasAbility('view_inventory_categories')) {
            return $this->forbidden('You do not have permission to view inventory categories.');
        }

        return $this->successWithMap($inventory_category->load('items'), 'passthrough');
    }

    public function update(Request $request, InventoryCategory $inventory_category): JsonResponse
    {
        if (! $request->user()->hasAbility('update_inventory_categories')) {
            return $this->forbidden('You do not have permission to update inventory categories.');
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'code' => 'nullable|string|max:50',
            'description' => 'nullable|string',
        ]);

        $inventory_category->update($validated);
        return $this->successWithMap($inventory_category, 'passthrough', 'Category updated successfully');
    }

    public function destroy(Request $request, InventoryCategory $inventory_category): JsonResponse
    {
        if (! $request->user()->hasAbility('delete_inventory_categories')) {
            return $this->forbidden('You do not have permission to delete inventory categories.');
        }

        if ($inventory_category->items()->exists()) {
            return $this->error('Cannot delete category that has items. Remove or reassign items first.', 422);
        }

        $inventory_category->delete();
        return $this->success(null, 'Category deleted');
    }
}
