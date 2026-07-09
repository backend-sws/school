<?php

namespace App\Http\Controllers\Api\V1\Admission;

use App\Models\FeeStructureRule;
use App\Models\SubjectPaper;
use Illuminate\Http\Request;
use App\Models\AdmissionHead;
use App\Models\FeeType;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Services\AdmissionHeadService;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Api\V1\BaseController;

/**
 * @OA\Schema(
 *     schema="AdmissionHead",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="title", type="string"),
 *     @OA\Property(property="course_for", type="string", enum={"new", "re-admission"}),
 *     @OA\Property(property="main_stream_id", type="integer"),
 *     @OA\Property(property="stream_id", type="integer"),
 *     @OA\Property(property="session_id", type="integer"),
 *     @OA\Property(property="last_date", type="string", format="date"),
 *     @OA\Property(property="status", type="integer", enum={0, 1, 2, 3}, description="0: Draft, 1: Published, 2: Unpublished, 3: Archived")
 * )
 */
class AdmissionHeadController extends BaseController
{


    protected $admissionService;

    public function __construct(AdmissionHeadService $admissionService)
    {
        $this->admissionService = $admissionService;
    }
    /**
     * @OA\Get(
     *     path="/admission-heads",
     *     summary="List admission heads",
     *     tags={"Admission"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Parameter(name="session_id", in="query", @OA\Schema(type="integer")),
     *     @OA\Parameter(name="stream_id", in="query", @OA\Schema(type="integer")),
     *     @OA\Parameter(name="category", in="query", @OA\Schema(type="array", @OA\Items(type="string"))),
     *     @OA\Parameter(name="gender", in="query", @OA\Schema(type="array", @OA\Items(type="string"))),
     *     @OA\Parameter(name="course_for", in="query", @OA\Schema(type="string", enum={"new", "re-admission"})),
     * @OA\Parameter(name="status", in="query", @OA\Schema(type="integer", enum={0,1,2,3})),
     *     @OA\Response(response=200, description="List of admission heads")
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $query = AdmissionHead::with(['mainStream', 'stream', 'session', 'subject', 'majorSubject']);

        // 1. Session Filter
        if ($request->has('session_id')) {
            $query->where('session_id', $request->session_id);
        }

        // 2. Stream Filter
        if ($request->has('stream_id')) {
            $query->where('stream_id', $request->stream_id);
        }

        // 3. Category Filter (JSONB array search)
        if ($request->filled('category')) {
            $query->whereJsonContains('category_criteria', $request->category);
        }

        // 4. Gender Filter (JSONB array search)
        if ($request->filled('gender')) {
            $query->whereJsonContains('gender_criteria', $request->gender);
        }

        // 5. Course For Filter
        if ($request->has('course_for')) {
            $query->where('course_for', $request->course_for);
        }

        // 5. Status Filter
        if ($request->has('status')) {

            $query->when($request->has('status'), fn($q) => $q->where('status', $request->status));
        }

        return $this->paginatedWithMap($query->paginate($request->input('per_page', 15)), 'passthrough');
    }

    /**
     * @OA\Post(
     * path="/admission-heads",
     * summary="Create a new Admission Head with Rules, Fees and Paper Limits",
     * description="Stores Admission Head details, JSON criteria (Board, Gender, Category), Fee breakdown, and dynamic Paper selection rules.",
     * tags={"Admission"},
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"title", "course_for", "main_stream_id", "stream_id", "session_id", "major_subject_id", "board_criteria", "gender_criteria", "category_criteria", "fees", "last_date"},
     * @OA\Property(property="title", type="string", example="B.A. Geography Hons Admission 2026"),
     * @OA\Property(property="course_for", type="string", enum={"new", "re-admission"}, example="new"),
     * @OA\Property(property="institution_id", type="integer", example=1),
     * @OA\Property(property="main_stream_id", type="integer", example=1),
     * @OA\Property(property="stream_id", type="integer", example=2),
     * @OA\Property(property="session_id", type="integer", example=1),
     * @OA\Property(property="semester", type="integer", example=1), 
     * @OA\Property(property="major_subject_id", type="integer", example=10, description="Locked MJC Subject ID"),
     * @OA\Property(property="board_criteria", type="array", @OA\Items(type="string"), example={"BSEB", "CBSE", "ICSE"}),
     * @OA\Property(property="gender_criteria", type="array", @OA\Items(type="string"), example={"Male", "Female"}),
     * @OA\Property(property="category_criteria", type="array", @OA\Items(type="string"), example={"General", "OBC", "SC", "ST"}),
     * @OA\Property(property="status", type="integer", enum={0,1}, example=0, description="0: Draft, 1: Publish"),
     * @OA\Property(property="min_credits", type="integer", example=20, description="Minimum total credits required for this course"),
     * @OA\Property(property="max_credits", type="integer", example=24, description="Maximum total credits allowed for this course"),
     * @OA\Property(property="allow_subject_paper_selection", type="boolean", example=true),
     * @OA\Property(property="has_application_fees", type="boolean", example=true),
     * @OA\Property(property="application_fees", type="number", format="float", example=500.00),
     * @OA\Property(property="last_date", type="string", format="date", example="2026-06-30"),
     * 
     * @OA\Property(property="payment_gateway", type="string", nullable=true, example="sabpaisa"),
     * @OA\Property(
     * property="fees",
     * type="array",
     * description="Fee breakdown using Fee Particulars table",
     * @OA\Items(
     * @OA\Property(property="fee_particular_id", type="integer", example=1),
     * @OA\Property(property="amount", type="number", format="float", example=1200.00),
     * @OA\Property(property="category", type="string", example="all"),
     * @OA\Property(property="gender", type="string", example="all")
     * )
     * ),
     * @OA\Property(
     * property="admission_head_papers",
     * type="array",
     * description="Paper limit configuration (Required if allow_subject_paper_selection is true)",
     * @OA\Items(
     * @OA\Property(property="subject_category_id", type="integer", example=2, description="ID of MIC, AEC, etc."),
     * @OA\Property(property="paper_limit", type="integer", example=1),
     * @OA\Property(property="sort_order", type="integer", example=1),
     * @OA\Property(property="is_compulsory", type="boolean", example=true)
     * )
     * )
     * )
     * ),
     * @OA\Response(
     * response=201,
     * description="Admission Head created successfully",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=true),
     * @OA\Property(property="message", type="string", example="Admission head created successfully"),
     * @OA\Property(property="data", type="object")
     * )
     * ),
     * @OA\Response(response=422, description="Validation Error"),
     * @OA\Response(response=500, description="Internal Server Error")
     * )
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:200',
            'course_for' => 'required|in:new,re-admission',
            'main_stream_id' => 'required|exists:main_streams,id',
            'stream_id' => 'required|exists:streams,id',
            'session_id' => 'required|exists:academic_sessions,id',
            'major_subject_id' => 'required|exists:subjects,id',
            'status' => 'required|integer|in:0,1,2,3',

            'semester' => 'nullable|integer|max:20',
            // Criteria Fields (JSON Arrays)
            'board_criteria' => 'required|array',
            'gender_criteria' => 'required|array',
            'category_criteria' => 'required|array',

            // Fee Structure
            'fees' => 'required|array|min:1',
            'fees.*.fee_type_id' => 'required|exists:fee_types,id',
            'fees.*.amount' => 'required|numeric|min:0',

            // Admission Head Papers
            'allow_subject_paper_selection' => 'boolean',
            'admission_head_papers' => 'required_if:allow_subject_paper_selection,true|array',
            'admission_head_papers.*.subject_category_id' => 'required|exists:subject_categories,id',
            'admission_head_papers.*.paper_limit' => 'required|integer|min:1',
            'admission_head_papers.*.sort_order' => 'nullable|integer',
            'admission_head_papers.*.is_compulsory' => 'required|boolean',

            // Other settings
            'last_date' => 'required|date',
            'has_application_fees' => 'boolean',
            'application_fees' => 'required_if:has_application_fees,true|numeric',

            'payment_gateway' => 'nullable|string',
            'min_credits' => 'nullable|integer',
            'max_credits' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $admissionHead = $this->admissionService->storeAdmissionHeadData($request->all());
        return $this->successWithMap($admissionHead, 'passthrough', 'Admission head created successfully');
    }
    /**
     * @OA\Get(
     * path="/admission-heads/{id}",
     * summary="Get full details of a specific Admission Head",
     * description="Returns Admission Head details along with its Stream, Session, Fee Breakdown (Particulars), and Paper Configurations (MJC, MIC, etc.)",
     * tags={"Admission"},
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="ID of the Admission Head",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(
     * response=200,
     * description="Successful operation",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=true),
     * @OA\Property(property="data", type="object",
     * @OA\Property(property="id", type="integer", example=1),
     * @OA\Property(property="title", type="string", example="B.A. Geography Hons Admission 2026"),
     * @OA\Property(property="board_criteria", type="array", @OA\Items(type="string")),
     * @OA\Property(property="gender_criteria", type="array", @OA\Items(type="string")),
     * @OA\Property(property="category_criteria", type="array", @OA\Items(type="string")),
     * @OA\Property(property="fee_structures", type="array", 
     * @OA\Items(
     * @OA\Property(property="amount", type="number"),
     * @OA\Property(property="fee_type", type="string"),
     * @OA\Property(property="particular", type="object",
     * @OA\Property(property="name", type="string")
     * )
     * )
     * ),
     * @OA\Property(property="papers", type="array", 
     * @OA\Items(
     * @OA\Property(property="paper_limit", type="integer"),
     * @OA\Property(property="is_compulsory", type="boolean"),
     * @OA\Property(property="category", type="object",
     * @OA\Property(property="name", type="string"),
     * @OA\Property(property="code", type="string")
     * )
     * )
     * )
     * )
     * )
     * ),
     * @OA\Response(response=404, description="Admission Head not found")
     * )
     */
    public function show(AdmissionHead $admissionHead): JsonResponse
    {
        // Eager loading updated relations to match new schema
        return $this->successWithMap($admissionHead->load([
            'mainStream',
            'stream',
            'session',
            'feeStructures.feeType', // Fee types with amounts
            'papers.category'           // AdmissionHeadPaper aur Category logic
        ]), 'passthrough');
    }

    /**
     * @OA\Put(
     * path="/admission-heads/{id}",
     * summary="Update an existing Admission Head configuration",
     * description="Updates basic info, JSON criteria, and replaces old fee structures and paper limits with new ones.",
     * tags={"Admission"},
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="ID of the Admission Head to update",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * @OA\Property(property="title", type="string", example="Updated B.A. Hons Admission 2026"),
     * @OA\Property(property="major_subject_id", type="integer", example=12),
     * @OA\Property(property="board_criteria", type="array", @OA\Items(type="string"), example={"BSEB", "CBSE"}),
     * @OA\Property(property="gender_criteria", type="array", @OA\Items(type="string"), example={"Male"}),
     * @OA\Property(property="category_criteria", type="array", @OA\Items(type="string"), example={"General", "OBC"}),
     * @OA\Property(property="status", type="integer", enum={0,1,2,3}),
     * @OA\Property(property="allow_subject_paper_selection", type="boolean", example=true),
     * @OA\Property(property="has_application_fees", type="boolean", example=true),
     * @OA\Property(property="has_admission_fees", type="boolean", example=true),
     * @OA\Property(property="application_fees", type="number", format="float", example=600.00),
     * @OA\Property(property="last_date", type="string", format="date", example="2026-07-15"),
     * @OA\Property(property="payment_gateway", type="string", example="razorpay"),
     * @OA\Property(
     * property="fees",
     * type="array",
     * description="Updating this will replace all existing fee particulars for this head.",
     * @OA\Items(
     * @OA\Property(property="fee_particular_id", type="integer", example=1),
     * @OA\Property(property="amount", type="number", example=1500.00)
     * )
     * ),
     * @OA\Property(
     * property="admission_head_papers",
     * type="array",
     * description="Required if allow_subject_paper_selection is true. Replaces existing paper limits.",
     * @OA\Items(
     * @OA\Property(property="subject_category_id", type="integer", example=2),
     * @OA\Property(property="paper_limit", type="integer", example=1),
     * @OA\Property(property="is_compulsory", type="boolean", example=true)
     * )
     * )
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Admission Head updated successfully",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=true),
     * @OA\Property(property="message", type="string", example="Admission head updated successfully")
     * )
     * ),
     * @OA\Response(response=404, description="Admission Head not found"),
     * @OA\Response(response=422, description="Validation Error")
     * )
     */
    public function update(Request $request, $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:200',
            'course_for' => 'sometimes|in:new,re-admission',
            'main_stream_id' => 'sometimes|exists:main_streams,id',
            'stream_id' => 'sometimes|exists:streams,id',
            'session_id' => 'sometimes|exists:academic_sessions,id',
            'major_subject_id' => 'sometimes|exists:subjects,id',
            'semester' => 'nullable|string|max:20',

            'board_criteria' => 'sometimes|array',
            'gender_criteria' => 'sometimes|array',
            'category_criteria' => 'sometimes|array',

            'fees' => 'sometimes|array|min:1',
            'fees.*.fee_type_id' => 'required_with:fees|exists:fee_types,id',
            'fees.*.amount' => 'required_with:fees|numeric|min:0',

            'allow_subject_paper_selection' => 'sometimes|boolean',
            'admission_head_papers' => 'required_if:allow_subject_paper_selection,true|array',
            'admission_head_papers.*.subject_category_id' => 'required_with:admission_head_papers|exists:subject_categories,id',
            'admission_head_papers.*.paper_limit' => 'required_with:admission_head_papers|integer|min:1',
            'admission_head_papers.*.is_compulsory' => 'required_with:admission_head_papers|boolean',

            'status' => 'sometimes|integer|in:0,1,2,3',
            'has_application_fees' => 'sometimes|boolean',
            'application_fees' => 'required_if:has_application_fees,true|numeric',
            'last_date' => 'sometimes|date_format:Y-m-d',
            'payment_gateway' => 'nullable|string',
            'min_credits' => 'nullable|integer',
            'max_credits' => 'nullable|integer',

        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        $result = $this->admissionService->updateAdmissionData($id, $request->all());
        return $this->success($result, 'Admission head updated successfully');
    }
    /**
     * @OA\Delete(
     *     path="/admission-heads/{id}",
     *     summary="Delete admission head",
     *     tags={"Admission"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Admission head deleted")
     * )
     */
    public function destroy($id): JsonResponse
    {
        $admissionHead = AdmissionHead::findOrFail($id);
        $applicationsCount = $admissionHead->applications()->count();

        if ($applicationsCount > 0) {
            return $this->error(
                "This admission head cannot be deleted because it already has {$applicationsCount} student application(s). You can unpublish it instead.",
                422
            );
        }
        $admissionHead->delete();

        return $this->success(null, 'Admission head deleted successfully');
    }
    /**
     * @OA\Patch(
     * path="/admission-heads/{id}/status",
     * summary="Change Admission Head Life-cycle Status",
     * description="Updates the workflow status of an admission configuration.
     * 0: Draft - Configuration phase, not visible to students.
     * 1: Published - Active and visible for student applications.
     * 2: Unpublished - Temporarily hidden/disabled by Admin.
     * 3: Archived - Process completed or session expired.",
     * tags={"Admission"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="Unique ID of the Admission Head",
     * required=true,
     * @OA\Schema(type="integer", example=10)
     * ),
     * @OA\RequestBody(
     * required=true,
     * description="New status value",
     * @OA\JsonContent(
     * required={"status"},
     * @OA\Property(property="status", type="integer", enum={0, 1, 2, 3}, example=1)
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Status updated successfully",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=true),
     * @OA\Property(property="message", type="string", example="Admission Head is now Published"),
     * @OA\Property(property="data", type="integer", example=1, description="The newly updated status value")
     * )
     * ),
     * @OA\Response(
     * response=401,
     * description="Unauthenticated - Token missing or expired"
     * ),
     * @OA\Response(
     * response=404,
     * description="Admission Head not found"
     * ),
     * @OA\Response(
     * response=422,
     * description="Validation Error - Invalid status value provided",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=false),
     * @OA\Property(property="message", type="string", example="The selected status is invalid."),
     * @OA\Property(property="errors", type="object")
     * )
     * )
     * )
     */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $request->validate(['status' => 'required|integer|in:0,1,2,3']);

        $head = AdmissionHead::findOrFail($id);

        $currentStatus = (int) $head->status;
        $newStatus = (int) $request->status;

        if ($currentStatus !== 0 && $newStatus === 0) {
            return $this->error("Cannot revert status to Draft once it has been Published or Archived.", 422);
        }


        if ($currentStatus === $newStatus) {
            return $this->success($head->status, "Status is already set to this value.");
        }

        $head->update(['status' => $newStatus]);

        $labels = [0 => 'Draft', 1 => 'Published', 2 => 'Unpublished', 3 => 'Archived'];

        return $this->success(
            $head->status,
            "Admission Head status changed to " . $labels[$head->status]
        );
    }

    // /**
    //  * @OA\Patch(
    //  * path="/admission-heads/{id}/toggle",
    //  * summary="Toggle enable/disable status of Admission Head",
    //  * tags={"Admission"},
    //  * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
    //  * @OA\Response(
    //  * response=200, 
    //  * description="Status toggled successfully",
    //  * @OA\JsonContent(
    //  * @OA\Property(property="success", type="boolean", example=true),
    //  * @OA\Property(property="message", type="string", example="Admission Head has been enabled successfully.")
    //  * )
    //  * )
    //  * )
    //  */

    // public function toggleStatus(Request $request, int $id)
    // {
    //     $head = AdmissionHead::findOrFail($id);
    //     $head->update([
    //         'is_enabled' => !$head->is_enabled
    //     ]);
    //     return $this->success($head->is_enabled, 'Status updated successfully');
    // }




    /**
     * @OA\Post(
     * path="/admission-heads/{id}/duplicate",
     * summary="Duplicate an existing Admission Head",
     * description="Creates a copy of the admission head along with its fee structures and paper configurations as a 'Draft'.",
     * tags={"Admission"},
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="ID of the Admission Head to duplicate",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(
     * response=201,
     * description="Admission Head duplicated successfully",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=true),
     * @OA\Property(property="message", type="string", example="Admission head duplicated as draft successfully"),
     * @OA\Property(property="data", type="object")
     * )
     * ),
     * @OA\Response(response=404, description="Source Admission Head not found")
     * )
     */
    public function duplicate(int $id): JsonResponse
    {
        // Fetch the original record with its relations
        $originalHead = AdmissionHead::with(['feeStructures', 'papers'])->findOrFail($id);

        // Call service to handle deep copying
        $newHead = $this->admissionService->duplicateAdmissionHead($originalHead);

        return $this->successWithMap($newHead, 'passthrough', 'Admission head duplicated as draft successfully');
    }
}
