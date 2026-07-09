<?php

namespace App\Http\Controllers\Api\V1\Website;

use App\Enums\PublishStatus;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Api\V1\BaseController;

class GalleryController extends BaseController
{
    /**
     * @OA\Get(
     * path="/public/galleries",
     * summary="List published galleries for public website",
     * tags={"Website"},
     * @OA\Response(response=200, description="List of galleries")
     * )
     */
    public function publicIndex(Request $request): JsonResponse
    {
        $query = Gallery::query()
            ->withCount('images')
            ->with(['images' => fn ($q) => $q->orderBy('sort_order')->limit(1)])
            ->orderBy('created_at', 'desc');

        // Admin (authenticated): show all galleries; Public: only published
        if (!auth()->check()) {
            $query->where('status', PublishStatus::PUBLISHED);
        }

        return $this->paginatedWithMap($query->paginate($request->input('per_page', 12)), 'passthrough');
    }

    /**
     * @OA\Post(
     * path="/website/galleries",
     * summary="Create a new gallery (Admin)",
     * tags={"Website"},
     * security={{"cookieAuth":{}}},
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"title"},
     * @OA\Property(property="title", type="string", example="Convocation 2026"),
     * @OA\Property(property="description", type="string", example="Photos of convocation ceremony"),
     * @OA\Property(property="status", type="string", enum={"draft", "published"}, example="draft")
     * )
     * ),
     * @OA\Response(response=201, description="Gallery created")
     * )
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'description' => 'nullable|string',
            'status' => 'nullable|string|in:draft,published',
        ]);

        $validated['status'] = PublishStatus::fromString($validated['status'] ?? null);
        $gallery = Gallery::create($validated);
        return $this->created($gallery, 'Gallery created successfully');
    }

    /**
     * @OA\Get(
     * path="/website/galleries/{id}",
     * summary="Get gallery details with images",
     * tags={"Website"},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="Gallery details")
     * )
     */
    public function show($id): JsonResponse
    {
        $gallery = Gallery::with(['images' => fn($q) => $q->orderBy('sort_order')])->findOrFail($id);
        return $this->successWithMap($gallery, 'passthrough');
    }

    /**
     * @OA\Put(
     * path="/website/galleries/{id}",
     * summary="Update an existing gallery (Admin)",
     * description="Update title, description, or status of a gallery.",
     * tags={"Website"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="ID of the gallery to update",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * @OA\Property(property="title", type="string", example="Updated Annual Day 2026"),
     * @OA\Property(property="description", type="string", example="New description for the event"),
     * @OA\Property(property="status", type="string", enum={"draft", "published"}, example="published")
     * )
     * ),
     * @OA\Response(
     * response=200, 
     * description="Gallery updated successfully",
     * @OA\JsonContent(type="object", @OA\Property(property="message", type="string", example="Gallery updated successfully"))
     * )
     * )     
     */
    public function update(Request $request, $id): JsonResponse
    {
        $gallery = Gallery::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:200',
            'description' => 'nullable|string',
            'status' => 'sometimes|string|in:draft,published',
        ]);

        if (isset($validated['status'])) {
            $validated['status'] = PublishStatus::fromString($validated['status']);
        }
        $gallery->update($validated);

        return $this->successWithMap($gallery, 'passthrough', 'Gallery updated successfully');
    }

    /**
     * @OA\Delete(
     * path="/website/galleries/{id}",
     * summary="Delete a gallery",
     * tags={"Website"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="Gallery deleted")
     * )
     */
    public function destroy($id): JsonResponse
    {
        $gallery = Gallery::findOrFail($id);
        $gallery->delete(); // Automatically deletes images due to cascadeOnDelete in migration
        return $this->success(null, 'Gallery and related images deleted');
    }


    /**
     * @OA\Post(
     * path="/website/galleries/bulk-store",
     * summary="Create gallery with multiple images in one request",
     * tags={"Website"},
     * security={{"cookieAuth":{}}},
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"title", "images"},
     * @OA\Property(property="title", type="string", example="Sports Meet 2026"),
     * @OA\Property(property="description", type="string", example="All event photos"),
     * @OA\Property(property="status", type="string", enum={"draft", "published"}),
     * @OA\Property(
     * property="images",
     * type="array",
     * @OA\Items(
     * @OA\Property(property="image_url", type="string", example="https://link.com/img1.jpg"),
     * @OA\Property(property="caption", type="string", example="Race start"),
     * @OA\Property(property="sort_order", type="integer", example=1)
     * )
     * )
     * )
     * ),
     * @OA\Response(response=201, description="Gallery and images created")
     * )
     */
    public function bulkStore(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'description' => 'nullable|string',
            'status' => 'required|string|in:draft,published',
            'images' => 'required|array|min:1',
            'images.*.media_type' => 'nullable|string|in:image,video,youtube',
            'images.*.image_url' => 'required|string',
            'images.*.caption' => 'nullable|string|max:200',
            'images.*.sort_order' => 'nullable|integer',
        ]);

        $validated['status'] = PublishStatus::fromString($validated['status']);

        $images = collect($validated['images'])->map(fn ($img) => array_merge($img, [
            'media_type' => $img['media_type'] ?? 'image',
        ]))->toArray();

        return DB::transaction(function () use ($validated, $images) {
            // 1. Create Gallery
            $gallery = Gallery::create(collect($validated)->except('images')->toArray());

            // 2. Create Images via Relationship
            $gallery->images()->createMany($images);

            return $this->successWithMap($gallery->load('images'), 'passthrough', 'Gallery and images saved successfully', 201);
        });
    }

    /**
     * @OA\Put(
     * path="/website/galleries/{id}/bulk-update",
     * summary="Update gallery details and replace all images",
     * tags={"Website"},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * @OA\Property(property="title", type="string"),
     * @OA\Property(property="status", type="string"),
     * @OA\Property(property="images", type="array", @OA\Items(
     * @OA\Property(property="image_url", type="string"),
     * @OA\Property(property="caption", type="string"),
     * @OA\Property(property="sort_order", type="integer")
     * ))
     * )
     * ),
     * @OA\Response(response=200, description="Gallery updated")
     * )
     */
    public function bulkUpdate(Request $request, $id): JsonResponse
    {
        $gallery = Gallery::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:200',
            'description' => 'nullable|string',
            'status' => 'sometimes|string|in:draft,published',
            'images' => 'sometimes|array',
            'images.*.media_type' => 'nullable|string|in:image,video,youtube',
            'images.*.image_url' => 'required_with:images|string',
            'images.*.caption' => 'nullable|string',
            'images.*.sort_order' => 'nullable|integer',
        ]);

        if (isset($validated['status'])) {
            $validated['status'] = PublishStatus::fromString($validated['status']);
        }

        if (isset($validated['images'])) {
            $validated['images'] = collect($validated['images'])->map(fn ($img) => array_merge($img, [
                'media_type' => $img['media_type'] ?? 'image',
            ]))->toArray();
        }

        return DB::transaction(function () use ($validated, $gallery) {
            //Update Gallery Info
            $gallery->update(collect($validated)->except('images')->toArray());

            // Update Images (If provided)
            if (isset($validated['images'])) {
                $gallery->images()->delete();
                $gallery->images()->createMany($validated['images']); 
            }

            return $this->successWithMap($gallery->load('images'), 'passthrough', 'Gallery updated successfully');
        });
    }


    /**
     * @OA\Get(
     * path="/website/galleries",
     * summary="List all galleries for admin (Draft + Published)",
     * tags={"Website"},
     * security={{"cookieAuth":{}}},
     * @OA\Response(response=200, description="Full list of galleries")
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $query = Gallery::query()
            ->withCount('images')
            ->with(['images' => fn ($q) => $q->orderBy('sort_order')->limit(1)])
            ->orderBy('created_at', 'desc');

        return $this->paginatedWithMap($query->paginate($request->input('per_page', 15)), 'passthrough');
    }
}