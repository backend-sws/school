<?php

namespace App\Http\Controllers\Api\V1\Organization;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\Institution;
use App\Services\OnboardingDataSeederService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @OA\Schema(
 *     schema="Institution",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="name", type="string"),
 *     @OA\Property(property="code", type="string"),
 *     @OA\Property(property="city", type="string"),
 *     @OA\Property(property="state", type="string"),
 *     @OA\Property(property="status", type="integer")
 * )
 */
class InstitutionController extends BaseController
{
    /**
     * @OA\Get(
     *     path="/institutions",
     *     summary="List all institutions",
     *     tags={"Institutions"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Parameter(name="page", in="query", @OA\Schema(type="integer")),
     *     @OA\Parameter(name="per_page", in="query", @OA\Schema(type="integer", default=15)),
     *     @OA\Response(
     *         response=200,
     *         description="List of institutions",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", type="array", @OA\Items(ref="#/components/schemas/Institution"))
     *         )
     *     )
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 15);
        $institutions = Institution::paginate($perPage);

        return $this->paginatedWithMap($institutions, 'passthrough');
    }

    /**
     * @OA\Post(
     *     path="/institutions",
     *     summary="Create an institution",
     *     tags={"Institutions"},
     *     security={{"cookieAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name"},
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="code", type="string"),
     *             @OA\Property(property="address", type="string"),
     *             @OA\Property(property="city", type="string"),
     *             @OA\Property(property="state", type="string")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Institution created")
     * )
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'organization_id' => 'required|exists:organizations,id',
            'name' => 'required|string|max:200',
            'code' => 'nullable|string|max:30|unique:institutions,code',
            'type' => 'nullable|string|in:school,college,coaching,university',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'pincode' => 'nullable|string|max:10',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:150',
            'website' => 'nullable|url|max:200',
        ]);

        $institution = Institution::create($validated);

        app(OnboardingDataSeederService::class)->seed('fee-types', $institution);

        return $this->created($institution, 'Institution created successfully');
    }

    /**
     * @OA\Get(
     *     path="/institutions/{id}",
     *     summary="Get an institution",
     *     tags={"Institutions"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Institution details"),
     *     @OA\Response(response=404, description="Not found")
     * )
     */
    public function show(Institution $institution): JsonResponse
    {
        return $this->successWithMap($institution, 'passthrough');
    }

    /**
     * @OA\Put(
     *     path="/institutions/{id}",
     *     summary="Update an institution",
     *     tags={"Institutions"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/Institution")),
     *     @OA\Response(response=200, description="Institution updated")
     * )
     */
    public function update(Request $request, Institution $institution): JsonResponse
    {
        $validated = $request->validate([
            'organization_id' => 'nullable|exists:organizations,id',
            'name' => 'sometimes|string|max:200',
            'code' => 'sometimes|string|max:30|unique:institutions,code,' . $institution->id,
            'type' => 'sometimes|nullable|string|in:school,college,coaching,university',
            'address' => 'nullable|string',
            'city' => 'nullable|string|max:100',
            'state' => 'nullable|string|max:100',
            'pincode' => 'nullable|string|max:10',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:150',
            'website' => 'nullable|url|max:200',
            'status' => 'sometimes|integer|in:0,1',
        ]);

        $institution->update($validated);

        return $this->successWithMap($institution, 'passthrough', 'Institution updated successfully');
    }

    /**
     * @OA\Delete(
     *     path="/institutions/{id}",
     *     summary="Delete an institution",
     *     tags={"Institutions"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Institution deleted")
     * )
     */
    public function destroy(Institution $institution): JsonResponse
    {
        $institution->delete();

        return $this->success(null, 'Institution deleted successfully');
    }
}
