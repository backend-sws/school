<?php

namespace App\Http\Controllers\Api\V1\Website;

use App\Http\Controllers\Api\V1\BaseController;
use App\Enums\PublishStatus;
use App\Models\News;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * @OA\Schema(
 * schema="News",
 * @OA\Property(property="id", type="integer"),
 * @OA\Property(property="institution_id", type="integer"),
 * @OA\Property(property="title", type="string"),
 * @OA\Property(property="news_for", type="string", enum={"student", "official"}),
 * @OA\Property(property="news_types", type="array", @OA\Items(type="string"), description="JSON array of types"),
 * @OA\Property(property="content", type="string"),
 * @OA\Property(property="status", type="string", enum={"draft", "published"}),
 * @OA\Property(property="created_at", type="string", format="date-time")
 * )
 */
class NewsController extends BaseController
{
    /**
     * @OA\Get(
     * path="/public/news",
     * summary="List public news",
     * tags={"Website"},
     * @OA\Parameter(name="news_for", in="query", @OA\Schema(type="string", enum={"student", "official"})),
     * @OA\Response(response=200, description="List of published news")
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $query = News::query()->orderBy('created_at', 'desc');

        if (!auth()->check()) {
            $query->where('status', PublishStatus::PUBLISHED);
        }

        if ($request->has('news_for')) {
            $query->where('news_for', $request->news_for);
        }

        return $this->paginatedWithMap($query->paginate($request->input('per_page', 12)), 'passthrough');
    }

    /**
     * @OA\Post(
     * path="/website/news",
     * summary="Create news",
     * tags={"Website"},
     * security={{"cookieAuth":{}}},
     * @OA\RequestBody(required=true, @OA\JsonContent(
     * required={ "title", "news_for"},
     * @OA\Property(property="title", type="string"),
     * @OA\Property(property="news_for", type="string", enum={"student", "official"}),
     * @OA\Property(property="news_types", type="array", @OA\Items(type="string")),
     * @OA\Property(property="content", type="string"),
     * @OA\Property(property="status", type="string", enum={"draft", "published"})
     * )),
     * @OA\Response(response=201, description="News created")
     * )
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:300',
            'news_for' => 'nullable|string|in:student,official,others,all',
            'target' => 'nullable|string|in:student,others,all',
            'news_types' => 'nullable|array',
            'type' => 'nullable|array',
            'content' => 'nullable|string',
            'event_date' => 'nullable|date',
            'event_location' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'tags.*' => 'nullable|string|max:100',
            'status' => 'nullable|string|in:draft,published',
        ]);

        $validated['news_for'] = $this->normalizeNewsFor($validated['news_for'] ?? $validated['target'] ?? 'official');
        $validated['news_types'] = $validated['news_types'] ?? $validated['type'] ?? [];
        unset($validated['target'], $validated['type']);

        // Convert status string to int (DB column is smallint)
        $statusInt = PublishStatus::fromString($validated['status'] ?? 'draft');
        $validated['status'] = $statusInt;
        $validated['created_by'] = Auth::id();

        return $this->created(News::create($validated));
    }

    /**
     * @OA\Get(
     * path="/website/news/{id}",
     * summary="Get news details",
     * tags={"Website"},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="News details")
     * )
     */
    public function show(News $news): JsonResponse
    {

        return $this->successWithMap($news->load('author'), 'passthrough');
    }

    /**
     * @OA\Put(
     * path="/website/news/{id}",
     * summary="Update news",
     * tags={"Website"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/News")),
     * @OA\Response(response=200, description="News updated")
     * )
     */
    public function update(Request $request, News $news): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:300',
            'news_for' => 'nullable|string|in:student,official,others,all',
            'target' => 'nullable|string|in:student,others,all',
            'news_types' => 'nullable|array',
            'type' => 'nullable|array',
            'content' => 'nullable|string',
            'event_date' => 'nullable|date',
            'event_location' => 'nullable|string|max:255',
            'tags' => 'nullable|array',
            'tags.*' => 'nullable|string|max:100',
            'status' => 'sometimes|string|in:draft,published',
        ]);

        if (isset($validated['target'])) {
            $validated['news_for'] = $this->normalizeNewsFor($validated['target']);
        } elseif (isset($validated['news_for'])) {
            $validated['news_for'] = $this->normalizeNewsFor($validated['news_for']);
        }
        if (isset($validated['type'])) {
            $validated['news_types'] = $validated['type'];
        }
        unset($validated['target'], $validated['type']);

        // Convert status string to int (DB column is smallint)
        if (array_key_exists('status', $validated)) {
            $validated['status'] = PublishStatus::fromString($validated['status']);
        }

        $news->update($validated);
        return $this->successWithMap($news, 'passthrough');
    }

    /**
     * @OA\Delete(
     * path="/website/news/{id}",
     * summary="Delete news",
     * tags={"Website"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="News deleted")
     * )
     */
    public function destroy(News $news): JsonResponse
    {
        $news->delete();
        return $this->success(null, 'News deleted');
    }

    /**
     * @OA\Patch(
     * path="/website/news/{id}/toggle-status",
     * summary="Toggle news status (draft <-> published)",
     * tags={"Website"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="Status updated")
     * )
     */
    public function toggleStatus(News $news): JsonResponse
    {
        $isPublished = $news->status === PublishStatus::PUBLISHED || $news->status === 101;
        $newStatusInt = $isPublished ? PublishStatus::DRAFT : PublishStatus::PUBLISHED;
        $news->update(['status' => $newStatusInt]);
        $newStatusStr = PublishStatus::toString($newStatusInt);

        return $this->success(
            ['status' => $newStatusStr],
            'News status updated to ' . $newStatusStr
        );
    }

    /**
     * Map frontend target (student, others, all) to backend news_for (student, official, all).
     */
    private function normalizeNewsFor(string $value): string
    {
        return match ($value) {
            'others' => 'official',
            default => $value,
        };
    }
}