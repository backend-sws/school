<?php

namespace App\Http\Controllers\Api\V1\Organization;

use App\Models\Subject;
use App\Traits\Filterable;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\V1\BaseController;

class SubjectController extends BaseController
{
    use Filterable ;
    /**
     * Display a listing of the resource.
     */

    /**
     * @OA\Get(
     * path="/subjects",
     * summary="List subjects with filtering, searching, and pagination",
     * tags={"Subjects"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="stream_id", in="query", @OA\Schema(type="integer"), description="Filter by stream ID"),
     * @OA\Parameter(name="subject_group_id", in="query", @OA\Schema(type="integer"), description="Filter by subject group ID"),
     * @OA\Parameter(name="active_only", in="query", @OA\Schema(type="boolean"), description="Show only active subjects (status=1)"),
     * @OA\Parameter(name="search", in="query", @OA\Schema(type="string"), description="Search by subject name (case-insensitive)"),
     * @OA\Parameter(name="all", in="query", @OA\Schema(type="boolean"), description="Return all subjects without pagination"),
     * @OA\Parameter(name="per_page", in="query", @OA\Schema(type="integer", default=15), description="Number of results per page"),
     * @OA\Response(response=200, description="List of subjects")
     * )
     */
    public function index(Request $request)
    {
        $query = Subject::with(['subjectGroup', 'stream'])
            // Filter by Stream
            ->when($request->filled('stream_id'), function ($q) use ($request) {
                return $q->where('stream_id', $request->stream_id);
            })
            // Filter by Subject Group
            ->when($request->filled('subject_group_id'), function ($q) use ($request) {
                return $q->where('subject_group_id', $request->subject_group_id);
            })
            ->latest();

        $searchBy = $request->input('search_by', 'name');
        $searchableColumns = in_array($searchBy, ['name', 'code']) ? [$searchBy] : ['name'];

        return $this->applyFilters($request, $query, $searchableColumns);
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
     * path="/subjects",
     * summary="Create a new subject",
     * tags={"Subjects"},
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"name", "stream_id", "institution_id"},
     * @OA\Property(property="name", type="string", example="Geography"),
     * @OA\Property(property="stream_id", type="integer", example=1),
     * @OA\Property(property="subject_group_id", type="integer", nullable=true, example=2, description="Optional group ID for Major/Minor logic"),
     * @OA\Property(property="code", type="string", example="GEO-101"),
     * @OA\Property(property="is_practical", type="boolean", example=true)
     * )
     * ),
     * @OA\Response(response=201, description="Subject created successfully")
     * )
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'stream_id' => 'required|exists:streams,id',
            'subject_group_id' => 'nullable|exists:subject_groups,id',
            'parent_id' => 'nullable|exists:subjects,id',
            'code' => 'nullable|string|max:50',
            'is_practical' => 'boolean',
            'status' => 'integer|in:0,1'
        ]);

        return $this->created(Subject::create($validated));
    }
    /**
     * Display the specified resource.
     */
    /**
     * @OA\Get(
     * path="/subjects/{id}",
     * summary="Get a specific subject details",
     * tags={"Subjects"},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="Successful operation")
     * )
     */
    public function show(Subject $subject)
    {
        return $this->successWithMap($subject->load('subjectGroup'), 'passthrough');
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
     * path="/subjects/{id}",
     * summary="Update subject details",
     * tags={"Subjects"},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\RequestBody(
     * @OA\JsonContent(
     * @OA\Property(property="name", type="string"),
     * @OA\Property(property="subject_group_id", type="integer", nullable=true),
     * @OA\Property(property="is_practical", type="boolean"),
     * @OA\Property(property="status", type="integer", enum={0, 1})
     * )
     * ),
     * @OA\Response(response=200, description="Subject updated successfully")
     * )
     */
    public function update(Request $request, Subject $subject)
    {
        $validated = $request->validate([
            'name' => 'sometimes|string|max:150',
            'subject_group_id' => 'nullable|exists:subject_groups,id',
            'is_practical' => 'sometimes|boolean',
            'status' => 'sometimes|integer|in:0,1',
            'code' => 'sometimes|string|max:50'
        ]);



        $subject->update($validated);
        return $this->successWithMap($subject, 'passthrough');
    }

    /**
     * Remove the specified resource from storage.
     */
    /**
     * @OA\Delete(
     * path="/subjects/{id}",
     * summary="Delete a subject",
     * tags={"Subjects"},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="Subject deleted successfully")
     * )
     */
    public function destroy(Subject $subject)
    {
        if ($subject->applications()->exists() || $subject->academicInfo()->exists()) {
            return $this->error('Cannot delete: This subject is already linked to student applications or records.', 422);
        }
        $subject->delete();
        return $this->success(null, 'Subject deleted successfully');
    }


    /**
     * @OA\Patch(
     * path="/subjects/{id}/toggle-status",
     * summary="Toggle subject status (Active/Inactive)",
     * tags={"Subjects"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(
     * name="id",
     * in="path",
     * required=true,
     * description="ID of the subject",
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(
     * response=200,
     * description="Status toggled successfully",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=true),
     * @OA\Property(property="message", type="string", example="Subject status changed to Active successfully."),
     * @OA\Property(property="data", type="object", nullable=true)
     * )
     * ),
     * @OA\Response(
     * response=404,
     * description="Subject not found",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=false),
     * @OA\Property(property="message", type="string", example="Subject not found.")
     * )
     * )
     * )
     */
    public function toggleStatus($id)
    {
        $subject = Subject::find($id);

        if (!$subject) {
            return $this->error('Subject not found', 404);
        }

        $subject->status = !$subject->status;
        $subject->save();

        $statusLabel = $subject->status ? 'Active' : 'Inactive';
        return $this->success(null, "Subject status changed to $statusLabel successfully.");
    }

    /**
     * @OA\Get(
     * path="/subjects/{id}/mapped-categories",
     * summary="Get categories mapped to a subject for Admin Head configuration",
     * tags={"Subjects"},
     * @OA\Parameter(
     * name="id",
     * in="path",
     * required=true,
     * description="Subject ID",
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(
     * response=200,
     * description="List of mapped categories retrieved successfully"
     * )
     * )
     */
    public function getMappedCategories($id)
    {
        // fetch the subject
        $subject = Subject::with('categories')->find($id);

        if (!$subject) {
            return $this->error('Subject not found', 404);
        }

        // 2. Map the categories
        $mappedCategories = $subject->categories->map(function ($category) {
            return [
                'subject_category_id' => $category->id,
                'name' => $category->name,
                'code' => $category->code,
                // Add other fields as needed
                'paper_limit' => 1,
                'sort_order' => 1,
                'is_compulsory' => (str_contains(strtoupper($category->code), 'MJC')) ? true : false,
            ];
        });

        return $this->success($mappedCategories, 'Mapped categories for the selected subject retrieved.');
    }
}
