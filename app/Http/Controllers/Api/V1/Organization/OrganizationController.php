<?php

namespace App\Http\Controllers\Api\V1\Organization;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\Organization;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Organizations (parent) can have multiple institutions (schools/colleges/universities).
 *
 * @OA\Tag(name="Organizations", description="Organization (parent) management")
 */
class OrganizationController extends BaseController
{
    /**
     * List all organizations.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 15);
        $organizations = Organization::withCount('institutions')
            ->orderBy('name')
            ->paginate($perPage);

        return $this->paginatedWithMap($organizations, 'passthrough');
    }

    /**
     * Create an organization.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:200',
            'code' => 'nullable|string|max:30|unique:organizations,code',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'pincode' => 'nullable|string|max:10',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:150',
            'website' => 'nullable|url|max:200',
            'status' => 'nullable|integer|in:0,1',
        ]);

        $validated['status'] = $validated['status'] ?? 1;
        $organization = Organization::create($validated);

        return $this->created($organization, 'Organization created successfully');
    }

    /**
     * Get a single organization with its institutions.
     */
    public function show(Request $request, Organization $organization): JsonResponse
    {
        $organization->load('institutions');

        return $this->successWithMap($organization, 'passthrough');
    }

    /**
     * Update an organization.
     */
    public function update(Request $request, Organization $organization): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:200',
            'code' => 'sometimes|nullable|string|max:30|unique:organizations,code,' . $organization->id,
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'pincode' => 'nullable|string|max:10',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:150',
            'website' => 'nullable|url|max:200',
            'status' => 'sometimes|integer|in:0,1',
        ]);

        $organization->update($validated);

        return $this->successWithMap($organization, 'passthrough', 'Organization updated successfully');
    }

    /**
     * Delete an organization. Institutions under it become unassigned (organization_id set to null).
     */
    public function destroy(Organization $organization): JsonResponse
    {
        $organization->delete();

        return $this->success(null, 'Organization deleted successfully');
    }

    /**
     * List institutions (schools/colleges/universities) under an organization.
     * Supports pagination and filter: search (name/code), type.
     */
    public function institutions(Request $request, Organization $organization): JsonResponse
    {
        $perPage = $request->input('per_page', 15);
        $search = $request->input('search');
        $type = $request->input('type');

        $query = $organization->institutions()->orderBy('type')->orderBy('name');

        if ($search && is_string($search)) {
            $term = '%' . addcslashes($search, '%_') . '%';
            $query->where(function ($q) use ($term) {
                $q->where('name', 'like', $term)
                    ->orWhere('code', 'like', $term)
                    ->orWhere('city', 'like', $term)
                    ->orWhere('state', 'like', $term);
            });
        }

        if ($type && in_array($type, ['school', 'college', 'coaching', 'university'], true)) {
            $query->where('type', $type);
        }

        $institutions = $query->paginate($perPage);

        return $this->paginatedWithMap($institutions, 'passthrough');
    }
}
