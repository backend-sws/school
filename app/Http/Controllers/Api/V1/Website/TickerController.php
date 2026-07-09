<?php

namespace App\Http\Controllers\Api\V1\Website;

use App\Http\Controllers\Api\V1\BaseController;
use App\Enums\PublishStatus;
use App\Models\Ticker;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @OA\Schema(
 *     schema="Ticker",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="content", type="string"),
 *     @OA\Property(property="tags", type="array", @OA\Items(type="string")),
 *     @OA\Property(property="status", type="string", enum={"draft", "published"}, description="Accepts string, stored as int"),
 *     @OA\Property(property="created_at", type="string", format="date-time")
 * )
 */
class TickerController extends BaseController
{
    /**
     * @OA\Get(
     *     path="/website/tickers",
     *     summary="List tickers",
     *     tags={"Website"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Parameter(name="per_page", in="query", @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Paginated list of tickers")
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $query = Ticker::query()->orderBy('created_at', 'desc');

        if (!auth()->check()) {
            $query->where('status', PublishStatus::PUBLISHED);
        }

        return $this->paginatedWithMap($query->paginate($request->input('per_page', 12)), 'passthrough');
    }

    /**
     * @OA\Post(
     *     path="/website/tickers",
     *     summary="Create ticker",
     *     tags={"Website"},
     *     security={{"cookieAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"content"},
     *             @OA\Property(property="content", type="string"),
     *             @OA\Property(property="status", type="integer", enum={0, 1})
     *         )
     *     ),
     *     @OA\Response(response=201, description="Ticker created")
     * )
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'content' => 'required|string',
            'tags' => 'nullable|array|max:3',
            'tags.*' => 'string|max:20',
            'status' => 'nullable|string|in:draft,published',
        ]);

        // Convert status string to int using PublishStatus enum
        $validated['status'] = PublishStatus::fromString($validated['status'] ?? 'draft');

        $ticker = Ticker::create($validated);

        return $this->created($ticker, 'Ticker created successfully');
    }

    /**
     * @OA\Get(
     *     path="/website/tickers/{id}",
     *     summary="Get ticker",
     *     tags={"Website"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Ticker details")
     * )
     */
    public function show(Ticker $ticker): JsonResponse
    {
        return $this->successWithMap($ticker, 'passthrough');
    }

    /**
     * @OA\Put(
     *     path="/website/tickers/{id}",
     *     summary="Update ticker",
     *     tags={"Website"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             @OA\Property(property="content", type="string"),
     *             @OA\Property(property="status", type="integer", enum={0, 1})
     *         )
     *     ),
     *     @OA\Response(response=200, description="Ticker updated")
     * )
     */
    public function update(Request $request, Ticker $ticker): JsonResponse
    {
        $validated = $request->validate([
            'content' => 'sometimes|string',
            'tags' => 'nullable|array|max:3',
            'tags.*' => 'string|max:20',
            'status' => 'nullable|string|in:draft,published',
        ]);

        // Convert status string to int using PublishStatus enum if provided
        if (isset($validated['status'])) {
            $validated['status'] = PublishStatus::fromString($validated['status']);
        }

        $ticker->update($validated);

        return $this->successWithMap($ticker, 'passthrough', 'Ticker updated successfully');
    }

    /**
     * @OA\Delete(
     *     path="/website/tickers/{id}",
     *     summary="Delete ticker",
     *     tags={"Website"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Ticker deleted")
     * )
     */
    public function destroy(Ticker $ticker): JsonResponse
    {
        $ticker->delete();

        return $this->success(null, 'Ticker deleted successfully');
    }
}
