<?php

namespace App\Http\Controllers\Api\V1\Notices;

use App\Models\Notice;
use App\Notifications\PublicNoticeNotification;
use App\Services\NoticeService;
use App\Traits\DispatchesRealtimeNotifications;
use App\Http\Controllers\Api\V1\BaseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class NoticeController extends BaseController
{
    use DispatchesRealtimeNotifications;

    private $noticeService;

    public function __construct(NoticeService $noticeService)
    {
        $this->noticeService = $noticeService;
    }

    /**
     * @OA\Get(
     * path="/notices",
     * summary="Get list of notices with pair filters",
     * tags={"Notices"},
     * @OA\Parameter(
     * name="target_type",
     * in="query",
     * @OA\Schema(type="string", enum={"all", "selective"})
     * ),
     * @OA\Parameter(
     * name="stream_id",
     * in="query",
     * description="Filter notices by specific Stream ID",
     * @OA\Schema(type="integer")
     * ),
     * @OA\Parameter(
     * name="session_id",
     * in="query",
     * description="Filter notices by specific Session ID",
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(
     * response=200,
     * description="Successful operation",
     * @OA\JsonContent(
     * @OA\Property(property="data", type="array",
     * @OA\Items(
     * @OA\Property(property="id", type="integer", example=1),
     * @OA\Property(property="title", type="string", example="Exam Schedule"),
     * @OA\Property(property="notice_for", type="string", example="Undergraduate BCA (2024-2027)")
     * )
     * )
     * )
     * )
     * )
     */
    public function index(Request $request)
    {
        // Service handles the transformation to keep response consistent
        return $this->paginatedWithMap($this->noticeService->getNotices($request), 'passthrough', 'Notices fetched successfully');
    }

    /**
     * @OA\Post(
     * path="/notices",
     * summary="Create a new college notice",
     * description="Stores a notice. If target_type is 'selective', you must provide a list of stream and session combinations.",
     * tags={"Notices"},
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"title", "target_type", "is_published"},
     * @OA\Property(property="title", type="string", example="BCA Semester-I Internal Exam Notice"),
     * @OA\Property(property="description", type="string", example="The internal exams will be held in the last week of January."),
     * @OA\Property(property="target_type", type="string", enum={"all", "selective"}, example="selective"),
     * @OA\Property(property="is_published", type="boolean", example=true),
     * @OA\Property(property="scheduled_at", type="string", format="date-time", example="2026-01-20T10:00:00Z"),
     * @OA\Property(property="expired_at", type="string", format="date-time", example="2026-01-30T18:00:00Z"),
     * @OA\Property(
     * property="combos",
     * type="array",
     * description="Required only if target_type is selective. Send pairs of stream and session IDs.",
     * @OA\Items(
     * type="object",
     * required={"stream", "session_id"},
     * @OA\Property(property="stream", type="integer", example=1, description="ID of the specific Stream (e.g., BCA)"),
     * @OA\Property(property="session_id", type="integer", example=5, description="ID of the Academic Session (e.g., 2024-2027)")
     * ),
     * example={
     * {"stream": 1, "session_id": 10},
     * {"stream": 1, "session_id": 11},
     * {"stream": 3, "session_id": 10}
     * }
     * )
     * )
     * ),
     * @OA\Response(
     * response=201,
     * description="Notice created successfully",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=true),
     * @OA\Property(property="message", type="string", example="Notice created successfully"),
     * @OA\Property(
     * property="data",
     * type="object",
     * @OA\Property(property="id", type="integer", example=15),
     * @OA\Property(property="title", type="string", example="BCA Semester-I Internal Exam Notice"),
     * @OA\Property(property="final_publish", type="boolean", example=true)
     * )
     * )
     * ),
     * @OA\Response(
     * response=422,
     * description="Validation Error - Check if combos are missing for selective target_type"
     * ),
     * @OA\Response(
     * response=500,
     * description="Internal Server Error"
     * )
     * )
     */
    public function store(Request $request)
    {
        $request->merge([
            'scheduled_at' => $request->filled('scheduled_at') ? $request->scheduled_at : null,
            'expired_at' => $request->filled('expired_at') ? $request->expired_at : null,
        ]);

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'target_type' => 'required|in:all,selective',
            'is_published' => 'required|boolean',
            'scheduled_at' => 'nullable|date',
            'expired_at' => 'nullable|date|after:scheduled_at',

            // Combinations: required for selective notices
            'combos' => 'exclude_unless:target_type,selective|array|min:1',
            'combos.*.stream_id' => 'required_with:combos|integer|exists:streams,id',
            'combos.*.session_id' => 'required_with:combos|integer|exists:academic_sessions,id',
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        // Pass validated data to service
        $notice = $this->noticeService->createNotice($validator->validated());
        if ($notice->is_published) {
            $users = $this->noticeService->getNotifiableUsersForNotice($notice);
            if ($users->isNotEmpty()) {
                $this->notifyRealtimeMany($users, new PublicNoticeNotification($notice));
            }
        }
        return $this->success($notice, 'Notice created successfully', 201);
    }

    /**
     * @OA\Get(
     * path="/notices/{id}/edit",
     * summary="Get notice data for editing",
     * tags={"Notices"},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="Notice data with combo IDs")
     * )
     */
    public function edit($id)
    {
        $data = $this->noticeService->getNoticeById($id);
        return $this->success($data, 'Notice data fetched successfully');
    }

    /**
     * @OA\Put(
     * path="/notices/{id}",
     * summary="Update an existing college notice",
     * description="Updates the notice details and refreshes the target combinations. Note: If final_publish is true, the notice is locked and cannot be updated.",
     * tags={"Notices"},
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="ID of the notice to update",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"title", "target_type"},
     * @OA\Property(property="title", type="string", example="Revised Exam Schedule 2026"),
     * @OA\Property(property="description", type="string", example="The dates for BCA and BBA exams have been shifted by one week."),
     * @OA\Property(property="target_type", type="string", enum={"all", "selective"}, example="selective"),
     * @OA\Property(property="scheduled_at", type="string", format="date-time", example="2026-02-01T09:00:00Z"),
     * @OA\Property(property="expired_at", type="string", format="date-time", example="2026-02-15T17:00:00Z"),
     * @OA\Property(
     * property="combos",
     * type="array",
     * description="The complete list of stream-session pairs. Existing pairs will be replaced by this list.",
     * @OA\Items(
     * type="object",
     * required={"stream_id", "session_id"},
     * @OA\Property(property="stream_id", type="integer", example=1),
     * @OA\Property(property="session_id", type="integer", example=5)
     * ),
     * example={
     * {"stream_id": 1, "session_id": 10},
     * {"stream_id": 2, "session_id": 10}
     * }
     * )
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Notice updated successfully",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=true),
     * @OA\Property(property="message", type="string", example="Notice updated successfully"),
     * @OA\Property(property="data", type="object")
     * )
     * ),
     * @OA\Response(
     * response=403,
     * description="Forbidden - Occurs if the notice is already marked as final_publish"
     * ),
     * @OA\Response(
     * response=422,
     * description="Validation Error - Invalid IDs or missing required fields"
     * ),
     * @OA\Response(
     * response=404,
     * description="Notice not found"
     * )
     * )
     */
    public function update(Request $request, string $id)
    {
        $request->merge([
            'scheduled_at' => $request->filled('scheduled_at') ? $request->scheduled_at : null,
            'expired_at' => $request->filled('expired_at') ? $request->expired_at : null,
        ]);

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'target_type' => 'required|in:all,selective',
            'scheduled_at' => 'nullable|date',
            'expired_at' => 'nullable|date|after:scheduled_at',
            'is_published' => 'required|boolean',
            // New validation for combinations in update
            'combos' => 'exclude_unless:target_type,selective|array|min:1',
            'combos.*.stream_id' => 'required_with:combos|integer|exists:streams,id',
            'combos.*.session_id' => 'required_with:combos|integer|exists:academic_sessions,id',
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        try {
            $notice = $this->noticeService->updateNotice($id, $validator->validated());
            if ($notice->is_published) {
                $users = $this->noticeService->getNotifiableUsersForNotice($notice);
                if ($users->isNotEmpty()) {
                    $this->notifyRealtimeMany($users, new PublicNoticeNotification($notice));
                }
            }
            return $this->success($notice, 'Notice updated successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 403);
        }
    }

    /**
     * Remove the specified resource from storage.
     */

    /**
     * @OA\Delete(
     * path="/notices/{id}",
     * summary="Delete a notice",
     * description="Deletes the notice and its target mappings. Note: If final_publish is true, the notice cannot be deleted.",
     * tags={"Notices"},
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="ID of the notice to delete",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(
     * response=200,
     * description="Notice deleted successfully",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=true),
     * @OA\Property(property="message", type="string", example="Notice deleted successfully")
     * )
     * ),
     * @OA\Response(response=403, description="Forbidden: Final published notice cannot be deleted"),
     * @OA\Response(response=404, description="Notice not found")
     * )
     */
    public function destroy(string $id)
    {
        $this->noticeService->deleteNotice($id);
        return $this->success(null, 'Notice deleted successfully');
    }


    /*
    toggle status
    */

    /**
     * @OA\Patch(
     * path="/notices/{id}/toggle-status",
     * summary="Toggle notice visibility (is_published)",
     * description="Switch notice between Published and Draft status.",
     * tags={"Notices"},
     * @OA\Parameter(
     * name="id",
     * in="path",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(
     * response=200, 
     * description="Status toggled successfully",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=true),
     * @OA\Property(property="message", type="string", example="Notice published successfully")
     * )
     * )
     * )
     */

    public function toggleStatus(Request $request, string $id)
    {
        $notice = $this->noticeService->toggleIsPublished($id);
        if ($notice->is_published) {
            $users = $this->noticeService->getNotifiableUsersForNotice($notice);
            if ($users->isNotEmpty()) {
                $this->notifyRealtimeMany($users, new PublicNoticeNotification($notice));
            }
        }
        return $this->success($notice, 'Notice status toggled successfully');
    }
}
