<?php

namespace App\Http\Controllers\Api\V1\Organization;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\Subject;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

/**
 * @OA\Tag(name="Subject Category Mappings", description="Link Subjects to Categories like MJC, MIC, etc.")
 */
class SubjectCategoryMappingController extends BaseController
{
    /**
     * Display a listing of the resource.
     */

    /**
     * @OA\Get(
     * path="/subject-category-mappings",
     * summary="Get all subjects with their mapped categories (with Search)",
     * tags={"Subject Category Mappings"},
     * @OA\Parameter(name="search", in="query", description="Search by subject name, code or category name", @OA\Schema(type="string")),
     * @OA\Parameter(name="per_page", in="query", @OA\Schema(type="integer", default=15)),
     * @OA\Response(response=200, description="Successful operation")
     * )
     */
    public function index(Request $request)
    {
        // Eager load categories and filter only those subjects that have categories
        $query = Subject::with('categories')->has('categories');

        // Search Logic
        if ($request->filled('search')) {
            $search = '%' . strtolower($request->search) . '%';

            $query->where(function ($q) use ($search) {
                // 1. Search in Subject Name or Code
                $q->whereRaw('LOWER(name) LIKE ?', [$search])
                    ->orWhereRaw('LOWER(code) LIKE ?', [$search])

                    // 2. Search in Mapped Category Name (MJC, MIC etc.)
                    ->orWhereHas('categories', function ($subQuery) use ($search) {
                        $subQuery->whereRaw('LOWER(name) LIKE ?', [$search]);
                    });
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
     * path="/subject-category-mappings",
     * summary="Assign categories to a subject",
     * tags={"Subject Category Mappings"},
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"subject_id", "category_ids"},
     * @OA\Property(property="subject_id", type="integer", example=1),
     * @OA\Property(property="category_ids", type="array", @OA\Items(type="integer"), example={1, 2, 3})
     * )
     * ),
     * @OA\Response(response=200, description="Mapping successful")
     * )
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'category_ids' => 'required|array',
            'category_ids.*' => 'exists:subject_categories,id',
        ]);

        $subject = Subject::findOrFail($validated['subject_id']);

        // Syncing categories
        $subject->categories()->sync($validated['category_ids']);

        return $this->successWithMap($subject->load('categories'), 'passthrough', 'Categories mapped successfully');
    }

    /**
     * Display the specified resource.
     */
    /**
     * @OA\Get(
     * path="/subject-category-mappings/{subject_id}",
     * summary="Fetch specific subject with its mapped categories for editing",
     * tags={"Subject Category Mappings"},
     * @OA\Parameter(
     * name="subject_id",
     * in="path",
     * required=true,
     * description="ID of the subject whose mappings you want to fetch",
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(
     * response=200, 
     * description="Data fetched successfully",
     * @OA\JsonContent(
     * @OA\Property(property="id", type="integer", example=1),
     * @OA\Property(property="name", type="string", example="Geography"),
     * @OA\Property(property="categories", type="array", @OA\Items(type="object"))
     * )
     * ),
     * @OA\Response(response=404, description="Subject mapping not found")
     * )
     */
    public function show($subject_id)
    {

        $subject = Subject::with('categories:id,name,code')
            ->findOrFail($subject_id);


        return $this->success([
            'subject_id' => $subject->id,
            'subject_name' => $subject->name,
            'selected_category_ids' => $subject->categories->pluck('id'), // [1, 2, 3]
            'categories' => $subject->categories
        ], 'Mapping data fetched for editing');
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
     * path="/subject-category-mappings/{subject_id}",
     * summary="Update category mappings for a specific subject",
     * tags={"Subject Category Mappings"},
     * @OA\Parameter(
     * name="subject_id",
     * in="path",
     * required=true,
     * description="ID of the subject to update mappings for",
     * @OA\Schema(type="integer")
     * ),
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"category_ids"},
     * @OA\Property(property="category_ids", type="array", @OA\Items(type="integer"), example={1, 4, 5})
     * )
     * ),
     * @OA\Response(response=200, description="Mapping updated successfully"),
     * @OA\Response(response=404, description="Subject not found")
     * )
     */
    public function update(Request $request, $subject_id)
    {
        $validated = $request->validate([
            'category_ids' => 'required|array',
            'category_ids.*' => 'exists:subject_categories,id',
        ]);

        $subject = Subject::findOrFail($subject_id);

        // sync() will update the pivot table
        $subject->categories()->sync($validated['category_ids']);

        return $this->success(
            $subject->load('categories'),
            'Subject category mappings updated successfully'
        );
    }

    /**
     * Remove the specified resource from storage.
     */
    /**
     * @OA\Delete(
     * path="/subject-category-mappings/{subject_id}",
     * summary="Remove all category mappings for a subject",
     * tags={"Subject Category Mappings"},
     * @OA\Parameter(name="subject_id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="Mappings removed")
     * )
     */
    public function destroy($subject_id)
    {
        $subject = Subject::findOrFail($subject_id);
        $subject->categories()->detach();

        return $this->success(null, 'All mappings removed for this subject');
    }
}
