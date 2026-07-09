<?php

namespace App\Http\Controllers\Api\V1\R2;

use App\Services\R2Service;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * @OA\Tag(name="Storage (R2)", description="Cloudflare R2 Presigned URLs for Direct Upload and Viewing")
 */
class R2Controller extends Controller
{
    /**
     * Allowed file extensions for upload
     */
    private const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'csv'];

    /**
     * Map of extension → allowed MIME types (for cross-validation).
     */
    private const EXTENSION_MIME_MAP = [
        'jpg'  => ['image/jpeg'],
        'jpeg' => ['image/jpeg'],
        'png'  => ['image/png'],
        'gif'  => ['image/gif'],
        'webp' => ['image/webp'],
        'pdf'  => ['application/pdf'],
        'doc'  => ['application/msword'],
        'docx' => ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
        'xls'  => ['application/vnd.ms-excel'],
        'xlsx' => ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'],
        'ppt'  => ['application/vnd.ms-powerpoint'],
        'pptx' => ['application/vnd.openxmlformats-officedocument.presentationml.presentation'],
        'txt'  => ['text/plain'],
        'csv'  => ['text/csv', 'text/plain'],
    ];

    /**
     * Allowed MIME types for upload
     */
    private const ALLOWED_MIME_TYPES = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
        'text/csv'
    ];

    /**
     * Maximum file size in bytes (10MB)
     */
    private const MAX_FILE_SIZE = 10 * 1024 * 1024;

    /**
     * @OA\Post(
     * path="/r2/upload-url",
     * summary="Generate a Presigned Upload URL for Cloudflare R2",
     * tags={"Storage (R2)"},
     * security={{"cookieAuth":{}}},
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"file_name", "content_type"},
     * @OA\Property(property="file_name", type="string", example="my_document.pdf", description="Original file name with extension"),
     * @OA\Property(property="content_type", type="string", example="application/pdf", description="MIME type of the file")
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Presigned URL generated successfully",
     * @OA\JsonContent(
     * @OA\Property(property="upload_url", type="string", example="https://bucket.r2.cloudflarestorage.com/..."),
     * @OA\Property(property="path", type="string", example="uploads/1/65af..._my_document.pdf")
     * )
     * ),
     * @OA\Response(response=401, description="Unauthenticated"),
     * @OA\Response(response=422, description="Validation Error")
     * )
     */
    public function uploadUrl(Request $request, R2Service $r2)
    {
        $request->validate([
            'file_name' => 'required|string|max:255',
            'content_type' => 'required|string',
        ]);

        // Sanitize filename to prevent path traversal
        $sanitizedFileName = basename($request->file_name);

        // Strip any null bytes (poison byte attack)
        $sanitizedFileName = str_replace("\0", '', $sanitizedFileName);

        // Validate file extension
        $extension = strtolower(pathinfo($sanitizedFileName, PATHINFO_EXTENSION));
        if (!in_array($extension, self::ALLOWED_EXTENSIONS)) {
            return response()->json([
                'message' => 'Invalid file type. Allowed: ' . implode(', ', self::ALLOWED_EXTENSIONS)
            ], 422);
        }

        // Validate MIME type
        if (!in_array($request->content_type, self::ALLOWED_MIME_TYPES)) {
            return response()->json([
                'message' => 'Invalid content type.'
            ], 422);
        }

        // Cross-validate: MIME type must match extension
        $allowedMimesForExt = self::EXTENSION_MIME_MAP[$extension] ?? [];
        if (!in_array($request->content_type, $allowedMimesForExt)) {
            return response()->json([
                'message' => 'Content type does not match file extension.'
            ], 422);
        }

        // Generate a safe unique path — only use alnum + underscore in the unique id
        $safeFileName = preg_replace('/[^a-zA-Z0-9._-]/', '_', $sanitizedFileName);
        $path = 'uploads/' . auth()->id() . '/' . uniqid() . '_' . $safeFileName;

        return response()->json([
            'upload_url' => $r2->uploadUrl($path, $request->content_type),
            'path' => $path,
        ]);
    }

    /**
     * @OA\Get(
     * path="/r2/view-url",
     * summary="Generate a temporary view URL for a file",
     * tags={"Storage (R2)"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(
     * name="path",
     * in="query",
     * required=true,
     * description="The path returned during upload",
     * @OA\Schema(type="string", example="uploads/1/file.jpg")
     * ),
     * @OA\Response(
     * response=200,
     * description="Temporary URL generated",
     * @OA\JsonContent(
     * @OA\Property(property="url", type="string", example="https://pub-xyz.r2.dev/uploads/...")
     * )
     * ),
     * @OA\Response(response=404, description="File not found")
     * )
     */
    public function viewUrl(Request $request, R2Service $r2)
    {
        $request->validate([
            'path' => 'required|string|max:500'
        ]);

        $path = $this->sanitizePath($request->path);
        if (!$path) {
            return response()->json(['message' => 'Invalid file path.'], 422);
        }

        return response()->json([
            'url' => $r2->viewUrl($path),
        ]);
    }

    /**
     * @OA\Post(
     * path="/r2/upload",
     * summary="Upload file to R2 (server-side, no CORS)",
     * tags={"Storage (R2)"},
     * security={{"cookieAuth":{}}},
     * @OA\RequestBody(required=true,
     *   @OA\MediaType(mediaType="multipart/form-data",
     *     @OA\Schema(@OA\Property(property="file", type="string", format="binary"))
     *   )
     * ),
     * @OA\Response(response=200, description="File uploaded", @OA\JsonContent(@OA\Property(property="path", type="string"))),
     * @OA\Response(response=422, description="Validation Error")
     * )
     */
    public function upload(Request $request, R2Service $r2)
    {
        // Validate file with size limit (10MB)
        $request->validate([
            'file' => 'required|file|max:' . (self::MAX_FILE_SIZE / 1024) // Convert to KB for validation
        ]);

        $file = $request->file('file');

        // Sanitize filename to prevent path traversal and remove spaces/special chars
        $sanitizedFileName = preg_replace('/[^a-zA-Z0-9._-]/', '_', basename($file->getClientOriginalName()));

        // Validate file extension
        $extension = strtolower(pathinfo($sanitizedFileName, PATHINFO_EXTENSION));
        if (!in_array($extension, self::ALLOWED_EXTENSIONS)) {
            return response()->json([
                'message' => 'Invalid file type. Allowed: ' . implode(', ', self::ALLOWED_EXTENSIONS)
            ], 422);
        }

        // Validate MIME type
        $mimeType = $file->getMimeType();
        if (!in_array($mimeType, self::ALLOWED_MIME_TYPES)) {
            return response()->json([
                'message' => 'Invalid file content type.'
            ], 422);
        }

        // Compress images before uploading to R2
        $imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
        if (in_array($extension, $imageExtensions)) {
            $compressor = app(\App\Services\ImageCompressionService::class);
            $compressed = $compressor->compressForUpload($file->getRealPath());

            if ($compressed) {
                // Update extension to jpg since output is always JPEG
                $baseName = pathinfo($sanitizedFileName, PATHINFO_FILENAME);
                $sanitizedFileName = $baseName . '.jpg';
                $mimeType = $compressed['mime'];

                $path = 'uploads/' . auth()->id() . '/' . uniqid() . '_' . $sanitizedFileName;
                $r2->put($path, $compressed['data'], $mimeType);

                return response()->json(['path' => $path]);
            }
            // Fallback: if compression fails, upload original
        }

        $path = 'uploads/' . auth()->id() . '/' . uniqid() . '_' . $sanitizedFileName;

        $r2->put($path, fopen($file->getRealPath(), 'r'), $mimeType);

        return response()->json(['path' => $path]);
    }

    /**
     * Stream an R2 object for use in img/iframe src (public, path-validated).
     */
    public function streamAsset(Request $request, R2Service $r2): StreamedResponse|\Illuminate\Http\RedirectResponse
    {
        $request->validate(['path' => 'required|string|max:500']);

        $path = $this->sanitizePath($request->path);
        if (!$path) {
            abort(422, 'Invalid file path.');
        }

        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return redirect($path);
        }

        try {
            $object = $r2->getObject($path);
            if (!$object) {
                abort(404);
            }

            $body = $object['Body'];
            $contentType = $object['ContentType'] ?? 'application/octet-stream';

            return response()->stream(function () use ($body) {
                while (!$body->eof()) {
                    echo $body->read(8192);
                }
            }, 200, [
                'Content-Type' => $contentType,
                'Cache-Control' => 'public, max-age=3600',
            ]);
        } catch (\Throwable) {
            abort(404);
        }
    }

    /**
     * Stream R2 asset for authenticated clients (alias of streamAsset).
     */
    public function proxy(Request $request, R2Service $r2): StreamedResponse|\Illuminate\Http\RedirectResponse
    {
        return $this->streamAsset($request, $r2);
    }

    /**
     * Sanitize and validate a storage path to prevent traversal attacks.
     * Returns the sanitized path or null if invalid.
     */
    private function sanitizePath(string $path): ?string
    {
        // Strip null bytes
        $path = str_replace("\0", '', $path);

        // Block path traversal sequences
        if (str_contains($path, '..') || str_contains($path, '//')) {
            return null;
        }

        // Must start with 'uploads/' prefix (all valid paths do)
        if (!str_starts_with($path, 'uploads/')) {
            return null;
        }

        // Only allow safe characters: alphanumeric, /, -, _, ., and spaces
        if (!preg_match('#^[a-zA-Z0-9/_.\s-]+$#', $path)) {
            return null;
        }

        // Must have a valid extension
        $extension = strtolower(pathinfo($path, PATHINFO_EXTENSION));
        if (!in_array($extension, self::ALLOWED_EXTENSIONS)) {
            return null;
        }

        return $path;
    }
}