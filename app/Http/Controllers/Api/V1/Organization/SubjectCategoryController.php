<?php

namespace App\Http\Controllers\Api\V1\Organization;

use Illuminate\Http\Request;
use App\Models\SubjectCategory;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\V1\BaseController;

/**
 * @OA\Tag(name="Subject Categories", description="Manage Categories like MJC, MIC, AEC, etc.")
 */
class SubjectCategoryController extends BaseController
{
    /**
     * Display a listing of the resource.
     */


    /**
     * @OA\Get(
     * path="/subject-categories",
     * summary="List all subject categories with search",
     * tags={"Subject Categories"},
     * @OA\Parameter(name="search", in="query", description="Search by category name or code", @OA\Schema(type="string")),
     * @OA\Parameter(name="per_page", in="query", @OA\Schema(type="integer", default=15)),
     * @OA\Response(response=200, description="Successful operation")
     * )
     */
    public function index(Request $request)
    {
        $query = SubjectCategory::query();

        // Searching Logic
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
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    /**
     * @OA\Post(
     * path="/subject-categories",
     * summary="Create a new category",
     * tags={"Subject Categories"},
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"name", "code"},
     * @OA\Property(property="name", type="string", example="Major Course"),
     * @OA\Property(property="code", type="string", example="MJC")
     * )
     * ),
     * @OA\Response(response=201, description="Category created")
     * )
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'code' => 'required|string|max:20|unique:subject_categories,code',
        ]);

        return $this->created(SubjectCategory::create($validated));
    }

    /**
     * Display the specified resource.
     */
    /**
     * @OA\Get(
     * path="/subject-categories/{id}",
     * summary="Get category details",
     * tags={"Subject Categories"},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="Successful operation")
     * )
     */
    public function show(SubjectCategory $subjectCategory)
    {
        return $this->successWithMap($subjectCategory, 'passthrough');
    }
    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    /**
     * @OA\Put(
     * path="/subject-categories/{id}",
     * summary="Update category",
     * tags={"Subject Categories"},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\RequestBody(
     * @OA\JsonContent(
     * @OA\Property(property="name", type="string", example="Minor Course"),
     * @OA\Property(property="code", type="string", example="MIC")
     * )
     * ),
     * @OA\Response(response=200, description="Updated")
     * )
     */
    public function update(Request $request, SubjectCategory $subjectCategory)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'code' => 'sometimes|string|max:20|unique:subject_categories,code,' . $subjectCategory->id,
        ]);

        $subjectCategory->update($validated);
        return $this->successWithMap($subjectCategory, 'passthrough');
    }

    /**
     * Remove the specified resource from storage.
     */
    /**
     * @OA\Delete(
     * path="/subject-categories/{id}",
     * summary="Delete category",
     * tags={"Subject Categories"},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="Deleted")
     * )
     */
    public function destroy(SubjectCategory $subjectCategory)
    {
        $subjectCategory->delete();
        return $this->success(null, 'Category deleted successfully');
    }
}
