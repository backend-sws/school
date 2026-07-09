<?php

namespace App\Http\Controllers\Api\V1\Organization;

use App\Models\Session;
use App\Services\AcademicCalendarService;
use App\Traits\BelongsToDefaultInstitution;
use App\Traits\Filterable;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Api\V1\BaseController;

/**
 * @OA\Schema(
 *     schema="AcademicSession",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="institution_id", type="integer"),
 *     @OA\Property(property="name", type="string"),
 *     @OA\Property(property="start_year", type="integer"),
 *     @OA\Property(property="end_year", type="integer"),
 *     @OA\Property(property="is_current", type="boolean"),
 *     @OA\Property(property="status", type="integer")
 * )
 */
class SessionController extends BaseController
{
    use BelongsToDefaultInstitution;
    use Filterable;

    public function __construct(
        private AcademicCalendarService $academicCalendarService
    ) {}
   /**
     * @OA\Get(
     * path="/sessions",
     * summary="List academic sessions with duration matching",
     * tags={"Sessions"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="stream_id", in="query", @OA\Schema(type="integer"), description="Filter sessions by Stream's duration"),
     * @OA\Parameter(name="search", in="query", @OA\Schema(type="string")),
     * @OA\Parameter(name="all", in="query", @OA\Schema(type="boolean")),
     * @OA\Response(response=200, description="Filtered session list")
     * )
     */
   public function index(Request $request): JsonResponse
    {
        $query = Session::query();

        // Filter by Stream's duration if stream_id provided
        $query->when($request->filled('stream_id'), function ($q) use ($request) {
            $streamDuration = \App\Models\Stream::where('id', $request->stream_id)
                                ->value('duration_years'); // Fixed: streams table column

            if ($streamDuration !== null) {
                return $q->where('duration_months', $streamDuration * 12);
            }
        });

        // Apply filters
        return $this->applyFilters($request, $query, ['name', 'start_year', 'end_year', 'duration_months']);
    }


    public function publicIndex(){
        $data = Session::where('status', 1)->get();
        return $this->success($data);
    }

    /**
     * Return the current academic session for the institution (is_current = true, status active).
     * Used by Application Desk and other flows that require a single "current" session.
     */
    public function current(): JsonResponse
    {
        $institutionId = self::getActiveInstitutionId(auth()->user());

        $session = $institutionId
            ? $this->academicCalendarService->resolveCurrentSession($institutionId)
            : Session::current()->where('status', 1)->first();

        if (!$session) {
            return $this->success(null, 'No current session set.');
        }

        return $this->successWithMap($session, 'passthrough');
    }

    /**
     * Suggest start/end years for a new session based on the institution calendar setting.
     */
    public function suggestedYears(Request $request): JsonResponse
    {
        $institutionId = self::getActiveInstitutionId($request->user());
        if (!$institutionId) {
            return $this->error('Institution context required.', 422);
        }

        $durationYears = max(1, (int) $request->query('duration_years', 4));

        return $this->success(
            $this->academicCalendarService->suggestSessionForDuration($institutionId, $durationYears)
        );
    }

    /**
     * @OA\Post(
     * path="/sessions",
     * summary="Create academic session with automated naming",
     * description="The system automatically generates the name (e.g., 2025-29) and calculates duration.",
     * tags={"Sessions"},
     * security={{"cookieAuth":{}}},
     * @OA\RequestBody(
     * required=true, 
     * @OA\JsonContent(
     * required={"start_year", "end_year"},
     * @OA\Property(property="start_year", type="integer", example=2025),
     * @OA\Property(property="end_year", type="integer", example=2029),
     * )
     * ),
     * @OA\Response(response=201, description="Session created successfully")
     * )
     */
    public function store(Request $request): JsonResponse
    {
        // 1. Strict Validation
        $validated = $request->validate([
            'institution_id' => 'nullable|exists:institutions,id',
            'start_year' => [
                'required',
                'integer',
                'min:2000',
                'max:2100',
                // Multi-column unique check: College + Start + End
                Rule::unique('academic_sessions')->where(function ($query) use ($request) {
                    return $query->where('end_year', $request->end_year);
                }),
            ],
            'end_year' => 'required|integer|min:2000|max:2100|gt:start_year',
        ], [
            'end_year.gt' => 'End year must be greater than start year.',
            'start_year.unique' => "The session {$request->start_year}-{$request->end_year} already exists for this college.",
        ]);

        // 2. Data Preparation
        $validated['name'] = $validated['start_year'] . '-' . $validated['end_year'];
        $validated['duration_months'] = ($validated['end_year'] - $validated['start_year']) * 12;

        // 3. Optional: Future is_current logic (abhi commented hai)
        /*
        if ($request->is_current ?? false) {
            Session::where('institution_id', $validated['institution_id'] ?? null)
                   ->update(['is_current' => false]);
            $validated['is_current'] = true;
        }
        */

        // 4. Create Session
        $session = Session::create($validated);

        return $this->created($session, "Academic session {$session->name} created with {$session->duration} years duration.");
    }

    /**
     * @OA\Get(
     *     path="/sessions/{id}",
     *     summary="Get academic session",
     *     tags={"Sessions"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Session details")
     * )
     */
    public function show(Session $session): JsonResponse
    {
        return $this->successWithMap($session, 'passthrough');
    }

    /**
     * @OA\Put(
     * path="/sessions/{id}",
     * summary="Update academic session with automated naming",
     * tags={"Sessions"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\RequestBody(
     * required=true, 
     * @OA\JsonContent(
     * @OA\Property(property="start_year", type="integer", example=2025),
     * @OA\Property(property="end_year", type="integer", example=2028),
     * @OA\Property(property="status", type="integer", enum={0,1})
     * )
     * ),
     * @OA\Response(response=200, description="Session updated successfully")
     * )
     */
    public function update(Request $request, Session $session): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'sometimes|integer|in:0,1',
            'start_year' => [
                'sometimes',
                'integer',
                'min:2000',
                'max:2100',
                // Unique check: College + Start + End excluding current
                Rule::unique('academic_sessions')->where(function ($query) use ($request, $session) {
                    $start = $request->start_year ?? $session->start_year;
                    $end = $request->end_year ?? $session->end_year;
                    return $query->where('start_year', $start)
                        ->where('end_year', $end);
                })->ignore($session->id),
            ],
            'end_year' => 'sometimes|integer|min:2000|max:2100|gt:start_year',
        ], [
            'start_year.unique' => 'This session combination already exists.',
        ]);

        // 1. Auto Update Name and Duration if start_year or end_year changed
        if ($request->has('start_year') || $request->has('end_year')) {
            $start = $request->start_year ?? $session->start_year;
            $end = $request->end_year ?? $session->end_year;

            $validated['name'] = $start . '-' . $end;
            $validated['duration_months'] = ($end - $start) * 12;
        }

        // 2. Is Current logic 
        // if ($request->is_current ?? false) {
        //     Session::where('institution_id', $session->institution_id)
        //            ->where('id', '!=', $session->id)
        //            ->update(['is_current' => false]);
        //     $validated['is_current'] = true;
        // }

        $session->update($validated);

        return $this->successWithMap($session, 'passthrough', 'Session updated successfully');
    }

    /**
     * @OA\Delete(
     *     path="/sessions/{id}",
     *     summary="Delete academic session",
     *     tags={"Sessions"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Session deleted")
     * )
     */
    public function destroy(Session $session): JsonResponse
    {
        try {
            // Option 1: Manual check (Better for specific error messages)

            $usageCount = \DB::table('student_profiles')->where('session_id', $session->id)->count();

            if ($usageCount > 0) {
                return $this->error("Cannot delete session. It is currently linked to $usageCount student profiles.", 422);
            }
            $session->delete();

            return $this->success(null, 'Session deleted successfully');

        } catch (\Illuminate\Database\QueryException $e) {

            if ($e->getCode() == "23000" || $e->getCode() == "23503") {
                return $this->error('This session cannot be deleted because it is being used in other parts of the system (Students, Admissions, etc.).', 422);
            }
            return $this->error('An unexpected database error occurred.', 500);
        }
    }

    /**
     * @OA\Patch(
     * path="/sessions/{id}/toggle-status",
     * summary="Toggle status using True/False",
     * tags={"Sessions"},
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
        $record = Session::findOrFail($id);
        $record->status = !((bool) $record->status);
        $record->save();

        return $this->success(
            ['status' => (bool) $record->status],
            "Status toggled to " . ($record->status ? 'Active' : 'Inactive')
        );
    }

}
