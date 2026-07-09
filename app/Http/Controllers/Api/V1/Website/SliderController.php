<?php

namespace App\Http\Controllers\Api\V1\Website;

use App\Enums\PublishStatus;
use App\Models\HomeSlider;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Api\V1\BaseController;


/**
 * @OA\Schema(
 * schema="HomeSlider",
 * @OA\Property(property="id", type="integer"),
 * @OA\Property(property="title", type="string"),
 * @OA\Property(property="description", type="string"),
 * @OA\Property(property="image_url", type="string"),
 * @OA\Property(property="button_caption", type="string"),
 * @OA\Property(property="button_url", type="string"),
 * @OA\Property(property="status", type="string", enum={"draft", "published"}, description="Accepts string, stored as int"),
 * @OA\Property(property="sort_order", type="integer")
 * )
 */
class SliderController extends BaseController
{
    /**
     * @OA\Get(
     * path="/public/sliders",
     * summary="List public sliders",
     * tags={"Website"},
     * @OA\Parameter(name="institution_id", in="query", required=false, @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="List of published sliders")
     * )
     */
    public function publicIndex(Request $request): JsonResponse
    {
        $query = HomeSlider::query()->orderBy('sort_order', 'asc');

        if (!auth()->check()) {
            $query->where('status', PublishStatus::PUBLISHED);
        }

        if (auth()->check()) {
            return $this->paginatedWithMap($query->paginate($request->input('per_page', 12)), 'passthrough');
        }

        return $this->success($query->get());
    }

    /**
     * @OA\Post(
     * path="/website/sliders",
     * summary="Create slider",
     * tags={"Website"},
     * security={{"cookieAuth":{}}},
     * @OA\RequestBody(required=true, @OA\JsonContent(
     * @OA\Property(property="title", type="string"),
     * @OA\Property(property="description", type="string"),
     * @OA\Property(property="image_url", type="string"),
     * @OA\Property(property="button_caption", type="string"),
     * @OA\Property(property="button_url", type="string" , example="https://google.com"),
     * @OA\Property(property="status", type="string", enum={"draft", "published"}),
     * @OA\Property(property="sort_order", type="integer")
     * )),
     * @OA\Response(response=201, description="Slider created")
     * )
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'description' => 'nullable|string',
            'image_url' => 'required|string',
            'button_caption' => 'nullable|string|max:100',
            'button_url' => 'nullable|url|max:500',
            'status' => 'nullable|string|in:draft,published',
            'sort_order' => 'nullable|integer',
        ]);

        $validated['created_by'] = Auth::id();

        // Convert status string to int using enum
        $validated['status'] = PublishStatus::fromString($validated['status'] ?? 'published');

        return DB::transaction(function () use ($validated, $request) {

            if (!$request->filled('sort_order')) {
                $maxOrder = HomeSlider::max('sort_order');
                $validated['sort_order'] = ($maxOrder ?? 0) + 1;
            } else {
                HomeSlider::where('sort_order', '>=', $validated['sort_order'])
                    ->increment('sort_order');
            }

            $slider = HomeSlider::create($validated);
            return $this->created($slider);
        });
    }

    /**
     * @OA\Get(
     * path="/website/sliders/{id}",
     * summary="Get slider",
     * tags={"Website"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="Slider details")
     * )
     */
    public function show(HomeSlider $slider): JsonResponse
    {
        return $this->successWithMap($slider, 'passthrough');
    }

    /**
     * @OA\Put(
     * path="/website/sliders/{id}",
     * summary="Update slider",
     * tags={"Website"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\RequestBody(required=true, @OA\JsonContent(ref="#/components/schemas/HomeSlider")),
     * @OA\Response(response=200, description="Slider updated")
     * )
     */
    public function update(Request $request, HomeSlider $slider): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:200',
            'description' => 'nullable|string',
            'image_url' => 'sometimes|string',
            'button_caption' => 'nullable|string|max:100',
            'button_url' => 'nullable|url|max:500',
            'status' => 'sometimes|string|in:draft,published',
            'sort_order' => 'nullable|integer',
        ]);

        // Convert status string to int using enum if provided
        if (isset($validated['status'])) {
            $validated['status'] = PublishStatus::fromString($validated['status']);
        }

        $slider->update($validated);

        return $this->successWithMap($slider->fresh(), 'passthrough');
    }

    /**
     * @OA\Delete(
     * path="/website/sliders/{id}",
     * summary="Delete slider",
     * tags={"Website"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="Slider deleted")
     * )
     */
    public function destroy(HomeSlider $slider): JsonResponse
    {
        $slider->delete();
        return $this->success(null, 'Slider deleted');
    }

    /**
     * @OA\Patch(
     * path="/website/sliders/{id}/toggle-status",
     * summary="Toggle slider status (draft <-> published)",
     * tags={"Website"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="Status updated successfully")
     * )
     */
    public function toggleStatus(HomeSlider $slider): JsonResponse
    {
        $newStatus = ($slider->status === PublishStatus::PUBLISHED) 
            ? PublishStatus::DRAFT 
            : PublishStatus::PUBLISHED;

        $slider->update(['status' => $newStatus]);

        return $this->success(
            ['status' => PublishStatus::toString($newStatus)],
            'Slider status changed to ' . PublishStatus::toString($newStatus)
        );
    }


    /**
     * @OA\Get(
     * path="/website/sliders",
     * summary="List all sliders for the authenticated college",
     * tags={"Website"},
     * security={{"cookieAuth":{}}},
     * @OA\Response(response=200, description="List of all sliders")
     * )
     */
    public function index(Request $request): JsonResponse
    {
       
        $sliders = HomeSlider::orderBy('sort_order', 'asc')
            ->paginate($request->input('per_page', 15));

        return $this->paginatedWithMap($sliders, 'passthrough');
    }
}