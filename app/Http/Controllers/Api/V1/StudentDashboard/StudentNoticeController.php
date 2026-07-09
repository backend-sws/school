<?php

namespace App\Http\Controllers\Api\V1\StudentDashboard;

use App\Models\Notice;
use App\Support\EffectiveStudentContext;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Api\V1\BaseController;

class StudentNoticeController extends BaseController
{
    /**
     * @OA\Get(
     * path="/student/notices",
     * summary="Get applicable notices for the student",
     * tags={"Student Notices"},
     * security={{"cookieAuth":{}}},
     * @OA\Response(response=200, description="List of notices")
     * )
     */
    public function index()
    {
        $user = EffectiveStudentContext::getEffectiveUser(Auth::user());
        if (! $user) {
            return $this->error('Unauthorized.', 401);
        }
        $profile = $user->studentProfile;

        if (!$profile) {
            return $this->error("Student profile not found.", 404);
        }

       /**
         * Query Logic:
         * 1. Filter by Publication Status: Must be published and finalized.
         * 2. Filter by Expiry: expired_at should be in the future or null.
         * 3. Filter by Target: 
         * - Notices marked for 'all'
         * - OR Targeted notices matching student's stream_id and session_id
         */
        $notices = Notice::where('is_published', true)
            ->where('final_publish', true)
            ->where(function ($query) {
                $query->whereNull('expired_at')
                      ->orWhere('expired_at', '>', now());
            })
            ->where(function ($query) use ($profile) {
                // Case 1: Target is 'all'
                $query->where('target_type', 'all')
                // Case 2: Specific Targets
                ->orWhereHas('targets', function ($subQuery) use ($profile) {
                    $subQuery->where('stream_id', $profile->stream_id)
                             ->where('session_id', $profile->session_id);
                });
            })
            ->orderBy('published_at', 'desc')
            ->get();

        $result = $notices->map(function ($notice) {
            return [
                'id' => $notice->id,
                'title' => $notice->title,
                'description' => $notice->description,
                'published_at' => $notice->published_at ? $notice->published_at->format('d M, Y h:i A') : null,
                'is_new' => $notice->published_at && $notice->published_at->gt(now()->subDays(3)), // 3 din tak 'New' tag dikhane ke liye
            ];
        });

        return $this->success($result);
    }

    /**
     * Detail View (In case notice description is long)
     */

    /**
     * @OA\Get(
     * path="/student/notices/{id}",
     * summary="Get details of a specific notice",
     * tags={"Student Notices"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="ID of the notice",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\Response(response=200, description="Notice details")
     * )
     */
    public function show($id)
    {
        $notice = Notice::where('is_published', true)
            ->where('final_publish', true)
            ->findOrFail($id);

        return $this->successWithMap($notice, 'passthrough');
    }
}
