<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Resources\ConfigurableResource;
use App\Services\ApiResponseMapService;
use Illuminate\Http\JsonResponse;

/**
 * @OA\Info(
 *     version="1.0.0",
 *     title="College Management System API",
 *     description="RESTful API for School Management System",
 *     @OA\Contact(
 *         email="admin@school.edu.in"
 *     )
 * )
 * 
 * @OA\Server(
 *     url="/api/v1",
 *     description="API v1 Server"
 * )
 * 
 * @OA\SecurityScheme(
 *     securityScheme="cookieAuth",
 *     type="apiKey",
 *     in="cookie",
 *     name="auth_session",
 *     description="Session cookie authentication"
 * )
 * 
 * @OA\Tag(name="Auth", description="Authentication endpoints")
 * @OA\Tag(name="Users", description="User management")
 * @OA\Tag(name="Roles", description="Role management")
 * @OA\Tag(name="Permissions", description="Permission management")
 * @OA\Tag(name="Colleges", description="College management")
 * @OA\Tag(name="Departments", description="Department management")
 * @OA\Tag(name="Streams", description="Course/Stream management")
 * @OA\Tag(name="Sessions", description="Academic session management")
 * @OA\Tag(name="Students", description="Student profile management")
 * @OA\Tag(name="Admission", description="Admission heads and applications")
 * @OA\Tag(name="Fees", description="Fee heads and payments")
 * @OA\Tag(name="Certificates", description="Certificate management")
 * @OA\Tag(name="Website", description="Website content (sliders, news, galleries)")
 * @OA\Tag(name="Grievances", description="Grievance and contact management")
 * @OA\Tag(name="Settings", description="System settings")
 */
/**
 * Base API controller. Use successWithMap() / paginatedWithMap() for config-driven
 * responses (see config/api_response_maps.php). Use success() / paginated() for raw data.
 */
abstract class BaseController extends Controller
{
    /**
     * Success response
     */
    protected function success(mixed $data = null, string $message = 'Success', int $code = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    /**
     * Created response
     */
    protected function created(mixed $data = null, string $message = 'Created successfully'): JsonResponse
    {
        return $this->success($data, $message, 201);
    }

    /**
     * Error response
     */
    protected function error(string $message = 'Error', int $code = 400, mixed $errors = null): JsonResponse
    {
        return response()->json([
            'success' => false,
            'message' => $message,
            'errors' => $errors,
        ], $code);
    }

    /**
     * Not found response
     */
    protected function notFound(string $message = 'Resource not found'): JsonResponse
    {
        return $this->error($message, 404);
    }

    /**
     * Unauthorized response
     */
    protected function unauthorized(string $message = 'Unauthorized'): JsonResponse
    {
        return $this->error($message, 401);
    }

    /**
     * Forbidden response
     */
    protected function forbidden(string $message = 'Forbidden'): JsonResponse
    {
        return $this->error($message, 403);
    }

    /**
     * Validation error response
     */
    protected function validationError(mixed $errors, string $message = 'Validation failed'): JsonResponse
    {
        return $this->error($message, 422, $errors);
    }

    /**
     * Paginated response (success, message, data, meta only — no links).
     * Use this for all list/paginated API responses so the pattern is consistent.
     */
    protected function paginated($paginator, string $message = 'Success'): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $paginator->items(),
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }

    /**
     * Config-driven single resource response.
     * Exposes only keys defined for the map in config/api_response_maps.php.
     * Add a map (and optional enricher) in config; use this for show/get endpoints.
     */
    protected function successWithMap(mixed $resource, string $mapName, string $message = 'Success', int $code = 200): JsonResponse
    {
        $data = (new ConfigurableResource($resource, $mapName))->resolve();

        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
        ], $code);
    }

    /**
     * Config-driven paginated response.
     * Each item in data is filtered by the map in config/api_response_maps.php.
     * Use for index/list endpoints when you want only allowed keys per item.
     */
    protected function paginatedWithMap($paginator, string $mapName, string $message = 'Success'): JsonResponse
    {
        $data = app(ApiResponseMapService::class)->filterCollection($paginator->items(), $mapName);

        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data,
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
        ]);
    }
}
