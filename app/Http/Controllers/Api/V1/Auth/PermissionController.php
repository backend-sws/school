<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\Permission;
use App\Services\PermissionResolverService;
use App\Support\InstitutionContext;
use Illuminate\Http\JsonResponse;

class PermissionController extends BaseController
{
    /**
     * Permission module visible only to super_admin (e.g. system_console).
     */
    private const PROTECTED_PERMISSION_MODULE = 'system_console';

    /**
     * Portal-only permission keys: assigned only by seeders to student/candidate. Never shown in role UI.
     */
    private const PORTAL_PERMISSION_KEYS = ['portal', 'apply_admission', 'request_certificate', 'submit_grievance', 'submit_support_ticket'];

    /**
     * @OA\Get(
     *     path="/permissions",
     *     summary="List all permissions",
     *     tags={"Permissions"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Parameter(name="module", in="query", @OA\Schema(type="string")),
     *     @OA\Response(response=200, description="List of permissions")
     * )
     */
    public function index(): JsonResponse
    {
        $user = auth()->user();
        $activeCollegeId = InstitutionContext::getActiveInstitutionId($user);

        $query = Permission::forInstitution($activeCollegeId)
            ->whereNotIn('key', self::PORTAL_PERMISSION_KEYS)
            ->orderBy('module')
            ->orderBy('name');

        if (! app(PermissionResolverService::class)->userHasSuperAdmin($user)) {
            $query->where('module', '!=', self::PROTECTED_PERMISSION_MODULE);
        }

        $permissions = $query->get();

        // Group by module
        $grouped = $permissions->groupBy('module');

        return $this->success($grouped);
    }
}
