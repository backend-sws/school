<?php

namespace App\Http\Controllers\Api\V1\DoubtForum;

use App\Http\Controllers\Controller;
use App\Models\DoubtReply;
use App\Models\DoubtThread;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DoubtForumController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $institutionId = config('ems.default_institution_id');

        $query = DoubtThread::forInstitution($institutionId)
            ->with('user:id,name,email')
            ->withCount('replies');

        if ($status = $request->query('status')) {
            $query->where('status', $status);
        }
        if ($classId = $request->query('lms_class_id')) {
            $query->where('lms_class_id', $classId);
        }
        if ($search = $request->query('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'ilike', "%{$search}%")
                  ->orWhere('body', 'ilike', "%{$search}%");
            });
        }

        $threads = $query->orderByDesc('is_pinned')
            ->orderByDesc('created_at')
            ->paginate($request->input('per_page', 20));

        return response()->json($threads);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string|max:10000',
            'lms_class_id' => 'nullable|integer|exists:lms_classes,id',
            'class_subject_allocation_id' => 'nullable|integer|exists:class_subject_allocations,id',
            'tags' => 'nullable|string|max:500',
        ]);

        $thread = DoubtThread::create([
            'institution_id' => config('ems.default_institution_id'),
            'user_id' => $request->user()->id,
            ...$validated,
        ]);

        return response()->json(['data' => $thread->load('user:id,name,email')], 201);
    }

    public function show(int $id): JsonResponse
    {
        $thread = DoubtThread::forInstitution(config('ems.default_institution_id'))
            ->with(['user:id,name,email', 'replies.user:id,name,email', 'lmsClass', 'classSubjectAllocation'])
            ->findOrFail($id);

        return response()->json(['data' => $thread]);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $thread = DoubtThread::forInstitution(config('ems.default_institution_id'))
            ->findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'body' => 'sometimes|string|max:10000',
            'tags' => 'nullable|string|max:500',
        ]);

        $thread->update($validated);

        return response()->json(['data' => $thread]);
    }

    public function destroy(int $id): JsonResponse
    {
        $thread = DoubtThread::forInstitution(config('ems.default_institution_id'))
            ->findOrFail($id);

        $thread->replies()->delete();
        $thread->delete();

        return response()->json(['message' => 'Doubt thread deleted.']);
    }

    // ── Reply Operations ───────────────────────────────────────────

    public function storeReply(Request $request, int $threadId): JsonResponse
    {
        $thread = DoubtThread::forInstitution(config('ems.default_institution_id'))
            ->findOrFail($threadId);

        $validated = $request->validate([
            'body' => 'required|string|max:10000',
        ]);

        $reply = DoubtReply::create([
            'doubt_thread_id' => $thread->id,
            'user_id' => $request->user()->id,
            'body' => $validated['body'],
        ]);

        $thread->increment('reply_count');

        if ($thread->status === 'open') {
            $thread->update(['status' => 'answered']);
        }

        return response()->json(['data' => $reply->load('user:id,name,email')], 201);
    }

    public function acceptReply(int $threadId, int $replyId): JsonResponse
    {
        DoubtThread::forInstitution(config('ems.default_institution_id'))
            ->findOrFail($threadId);

        $reply = DoubtReply::where('doubt_thread_id', $threadId)->findOrFail($replyId);
        $reply->markAccepted();

        return response()->json(['data' => $reply]);
    }

    public function resolveThread(int $id): JsonResponse
    {
        $thread = DoubtThread::forInstitution(config('ems.default_institution_id'))
            ->findOrFail($id);

        $thread->markResolved();

        return response()->json(['data' => $thread]);
    }

    public function upvoteThread(int $id): JsonResponse
    {
        $thread = DoubtThread::forInstitution(config('ems.default_institution_id'))
            ->findOrFail($id);

        $thread->increment('upvotes');

        return response()->json(['data' => $thread->fresh()]);
    }

    public function upvoteReply(int $threadId, int $replyId): JsonResponse
    {
        DoubtThread::forInstitution(config('ems.default_institution_id'))
            ->findOrFail($threadId);

        $reply = DoubtReply::where('doubt_thread_id', $threadId)->findOrFail($replyId);
        $reply->increment('upvotes');

        return response()->json(['data' => $reply->fresh()]);
    }

    public function togglePin(int $id): JsonResponse
    {
        $thread = DoubtThread::forInstitution(config('ems.default_institution_id'))
            ->findOrFail($id);

        $thread->update(['is_pinned' => !$thread->is_pinned]);

        return response()->json(['data' => $thread]);
    }
}
