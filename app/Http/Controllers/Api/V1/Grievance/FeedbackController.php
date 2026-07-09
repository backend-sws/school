<?php

namespace App\Http\Controllers\Api\V1\Grievance;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\Feedback;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @OA\Tag(name="Feedback", description="User feedback and suggestions")
 */
class FeedbackController extends BaseController
{
   /**
     * @OA\Get(
     * path="/feedbacks",
     * summary="List all feedbacks (Admin)",
     * tags={"Feedback"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="is_read", in="query", @OA\Schema(type="boolean"), description="Filter by read/unread status"),
     * @OA\Parameter(name="search", in="query", @OA\Schema(type="string"), description="Search by name or email"),
     * @OA\Parameter(name="per_page", in="query", @OA\Schema(type="integer", default=15)),
     * @OA\Response(response=200, description="List of feedbacks")
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $query = Feedback::query()
            // Boolean filter for read status
            ->when($request->has('is_read'), function ($q) use ($request) {
                return $q->where('is_read', $request->boolean('is_read'));
            })
            // Multi-column Case-Insensitive Search
            ->when($request->filled('search'), function ($q) use ($request) {
                $search = strtolower($request->search);
                return $q->where(function($subQuery) use ($search) {
                    $subQuery->whereRaw('LOWER(name) LIKE ?', ["%{$search}%"])
                             ->orWhereRaw('LOWER(email) LIKE ?', ["%{$search}%"]);
                });
            })
            ->latest();

        return $this->paginatedWithMap($query->paginate($request->input('per_page', 15)), 'passthrough');
    }

    /**
     * @OA\Post(
     * path="/public/feedback",
     * summary="Submit feedback (Public)",
     * tags={"Feedback"},
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"name", "email", "mobile", "message"},
     * @OA\Property(property="institution_id", type="integer", example=1, description="Optional; institution scope"),
     * @OA\Property(property="name", type="string", example="Amit Kumar"),
     * @OA\Property(property="email", type="string", example="amit@example.com"),
     * @OA\Property(property="mobile", type="string", example="9876543210"),
     * @OA\Property(property="subject", type="string", example="Library Facilities"),
     * @OA\Property(property="message", type="string", example="Please improve library seating.")
     * )
     * ),
     * @OA\Response(response=201, description="Feedback submitted")
     * )
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'institution_id' => 'nullable|exists:institutions,id',
            'name' => 'required|string|max:200',
            'email' => 'required|email|max:200',
            'mobile' => 'required|string|max:15',
            'subject' => 'required|string|max:500',
            'message' => 'required|string',
        ]);

        $feedback = Feedback::create($validated);

        return $this->successWithMap($feedback, 'passthrough', 'Thank you for your feedback!', 201);
    }

    /**
     * @OA\Get(
     * path="/feedbacks/{id}",
     * summary="View feedback and mark as read",
     * tags={"Feedback"},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="Feedback details")
     * )
     */
    public function show($id): JsonResponse
    {
        $feedback = Feedback::findOrFail($id);

        if (!$feedback->is_read) {
            $feedback->update(['is_read' => true]);
        }

        return $this->successWithMap($feedback, 'passthrough');
    }

    /**
     * @OA\Patch(
     * path="/feedbacks/{id}/toggle-read",
     * summary="Toggle read/unread status",
     * tags={"Feedback"},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="Status toggled")
     * )
     */
    public function toggleRead($id): JsonResponse
    {
        $feedback = Feedback::findOrFail($id);
        $feedback->is_read = !$feedback->is_read;
        $feedback->save();

        return $this->success(['is_read' => $feedback->is_read], 'Feedback status updated');
    }

    /**
     * @OA\Delete(
     * path="/feedbacks/{id}",
     * summary="Delete feedback",
     * tags={"Feedback"},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="Feedback deleted")
     * )
     */
    public function destroy($id): JsonResponse
    {
        $feedback = Feedback::findOrFail($id);
        $feedback->delete();

        return $this->success(null, 'Feedback deleted successfully');
    }
}