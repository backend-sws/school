<?php

namespace App\Http\Controllers\Api\V1\Website;

use App\Models\Gallery;
use App\Models\GalleryImage;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Controllers\Api\V1\BaseController;

class GalleryImageController extends BaseController
{
    /**
     * @OA\Get(
     * path="/website/galleries/{gallery}/images",
     * summary="List all media items in a gallery",
     * tags={"Website"},
     * @OA\Parameter(name="gallery", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="List of media items")
     * )
     */
    public function index($galleryId): JsonResponse
    {
        $gallery = Gallery::findOrFail($galleryId);
        $images = $gallery->images()->orderBy('sort_order')->get();
        return $this->success($images);
    }

    /**
     * @OA\Post(
     * path="/website/galleries/{gallery}/images",
     * summary="Add an image to a gallery",
     * tags={"Website"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="gallery", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"image_url"},
     * @OA\Property(property="image_url", type="string", example="https://cdn.example.com/photo.jpg"),
     * @OA\Property(property="caption", type="string", example="Group Photo"),
     * @OA\Property(property="sort_order", type="integer", example=1)
     * )
     * ),
     * @OA\Response(response=201, description="Image added")
     * )
     */
    public function store(Request $request, $galleryId): JsonResponse
    {
        $gallery = Gallery::findOrFail($galleryId);

        $validated = $request->validate([
            'media_type' => 'nullable|string|in:image,video,youtube',
            'image_url' => 'required|string',
            'caption' => 'nullable|string|max:200',
            'sort_order' => 'nullable|integer',
        ]);
        $validated['media_type'] = $validated['media_type'] ?? 'image';

        $image = $gallery->images()->create($validated);
        return $this->created($image, 'Image added to gallery');
    }

    /**
     * @OA\Delete(
     * path="/website/galleries/images/{id}",
     * summary="Delete a specific image from gallery",
     * tags={"Website"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="Image deleted")
     * )
     */
    public function destroy($id): JsonResponse
    {
        $galleryImage = GalleryImage::findOrFail($id);
        $galleryImage->delete();
        return $this->success(null, 'Image deleted successfully');
    }

    /**
     * @OA\Patch(
     * path="/website/galleries/images/sort",
     * summary="Bulk update image sorting",
     * tags={"Website"},
     * security={{"cookieAuth":{}}},
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * @OA\Property(property="images", type="array", @OA\Items(
     * @OA\Property(property="id", type="integer"),
     * @OA\Property(property="sort_order", type="integer")
     * ))
     * )
     * ),
     * @OA\Response(response=200, description="Sorting updated")
     * )
     */
    public function updateSorting(Request $request): JsonResponse
    {
        $request->validate([
            'images' => 'required|array',
            'images.*.id' => 'required|exists:gallery_images,id',
            'images.*.sort_order' => 'required|integer',
        ]);

        foreach ($request->images as $item) {
            GalleryImage::where('id', $item['id'])->update(['sort_order' => $item['sort_order']]);
        }

        return $this->success(null, 'Sorting updated successfully');
    }
}