<?php

namespace App\Http\Controllers\Api\V1\Settings;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @OA\Schema(
 *     schema="AuditLog",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="user_id", type="integer"),
 *     @OA\Property(property="action", type="string"),
 *     @OA\Property(property="entity_type", type="string"),
 *     @OA\Property(property="entity_id", type="integer"),
 *     @OA\Property(property="old_values", type="object"),
 *     @OA\Property(property="new_values", type="object"),
 *     @OA\Property(property="ip_address", type="string"),
 *     @OA\Property(property="created_at", type="string", format="datetime")
 * )
 */
class AuditLogController extends BaseController
{
    /**
     * @OA\Get(
     *     path="/audit-logs",
     *     summary="List audit logs",
     *     tags={"Settings"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Parameter(name="user_id", in="query", @OA\Schema(type="integer")),
     *     @OA\Parameter(name="action", in="query", @OA\Schema(type="string")),
     *     @OA\Parameter(name="entity_type", in="query", @OA\Schema(type="string")),
     *     @OA\Parameter(name="from_date", in="query", @OA\Schema(type="string", format="date")),
     *     @OA\Parameter(name="to_date", in="query", @OA\Schema(type="string", format="date")),
     *     @OA\Response(response=200, description="List of audit logs")
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $query = AuditLog::with('user');
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }
        if ($request->has('action')) {
            $query->where('action', $request->action);
        }
        if ($request->has('entity_type')) {
            $query->where('entity_type', 'like', '%' . $request->entity_type . '%');
        }
        if ($request->has('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }
        if ($request->has('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }
        return $this->paginatedWithMap($query->orderBy('created_at', 'desc')->paginate($request->input('per_page', 50)), 'passthrough');
    }

    /**
     * @OA\Get(
     *     path="/audit-logs/{id}",
     *     summary="Get audit log",
     *     tags={"Settings"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Audit log details")
     * )
     */
    public function show(AuditLog $auditLog): JsonResponse
    {
        return $this->successWithMap($auditLog->load('user'), 'passthrough');
    }
}
