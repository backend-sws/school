<?php

namespace App\Http\Controllers\Api\V1\Organization;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\Department;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @OA\Schema(
 *     schema="Department",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="name", type="string"),
 *     @OA\Property(property="code", type="string"),
 *     @OA\Property(property="status", type="integer")
 * )
 */
class DepartmentController extends BaseController
{
    /**
     * @OA\Get(
     * path="/departments",
     * summary="List departments with search",
     * tags={"Departments"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="search", in="query", description="Search by dept name or code", @OA\Schema(type="string")),
     * @OA\Parameter(name="per_page", in="query", @OA\Schema(type="integer", default=15)),
     * @OA\Response(response=200, description="List of departments")
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $query = Department::query();

        if ($request->filled('search')) {
            $search = '%' . strtolower($request->search) . '%';
            $query->where(function ($q) use ($search) {
                $q->whereRaw('LOWER(name) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(code) LIKE ?', [$search]);
            });
        }

        return $this->paginatedWithMap(
            $query->orderBy('name', 'asc')->paginate($request->input('per_page', 15)),
            'passthrough'
        );
    }

    /**
     * @OA\Post(
     *     path="/departments",
     *     summary="Create department",
     *     tags={"Departments"},
     *     security={{"cookieAuth":{}}},
     *     @OA\RequestBody(required=true, @OA\JsonContent(
     *         required={"name"},
     *         @OA\Property(property="name", type="string"),
     *         @OA\Property(property="code", type="string")
     *     )),
     *     @OA\Response(response=201, description="Department created")
     * )
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100|unique:departments,name',
            'code' => 'nullable|string|max:30|unique:departments,code',
        ]);

        $department = Department::create($validated);
        return $this->created($department);
    }

    /**
     * @OA\Get(
     *     path="/departments/{id}",
     *     summary="Get department",
     *     tags={"Departments"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Department details")
     * )
     */
    public function show(Department $department): JsonResponse
    {
        return $this->successWithMap($department, 'passthrough');
    }

    /**
     * @OA\Put(
     *     path="/departments/{id}",
     *     summary="Update department",
     *     tags={"Departments"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/Department")),
     *     @OA\Response(response=200, description="Department updated")
     * )
     */
    public function update(Request $request, Department $department): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'code' => 'sometimes|string|max:30',
            'status' => 'sometimes|integer|in:0,1',
        ]);
        $department->update($validated);
        return $this->successWithMap($department, 'passthrough');
    }

    /**
     * @OA\Delete(
     *     path="/departments/{id}",
     *     summary="Delete department",
     *     tags={"Departments"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Department deleted")
     * )
     */
    public function destroy(Department $department): JsonResponse
    {
        $department->delete();
        return $this->success(null, 'Department deleted');
    }

    /**
     * @OA\Patch(
     * path="/departments/{id}/toggle-status",
     * summary="Toggle status using True/False",
     * tags={"Departments"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\Response(
     * response=200, 
     * description="Status toggled",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=true),
     * @OA\Property(property="new_status", type="boolean", example=true)
     * )
     * )
     * )
     */

    public function toggleStatus($id): JsonResponse
    {
        $record = Department::findOrFail($id);
        $record->status = !((bool) $record->status);
        $record->save();
        return $this->success(['status' => (bool) $record->status], "Status toggled to " . ($record->status ? 'Active' : 'Inactive'));
    }
}
