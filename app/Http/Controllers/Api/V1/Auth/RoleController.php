<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\Institution;
use App\Models\Permission;
use App\Models\Role;
use App\Models\Workflow;
use App\Services\PermissionResolverService;
use App\Support\InstitutionContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class RoleController extends BaseController
{
    /**
     * Protected role keys: visible only to super_admin. Hidden from everyone else in list/show/update/destroy/sync.
     */
    private const PROTECTED_ROLE_KEYS = ['super_admin', 'institution_admin', 'student', 'candidate'];

    /** Portal workflow: assignable only by seeders; reject if included in sync. */
    private const PORTAL_WORKFLOW_KEYS = ['student_portal'];

    /** Portal-only permissions: assignable only by seeders; reject if included in sync. */
    private const PORTAL_PERMISSION_KEYS = ['portal', 'apply_admission', 'request_certificate', 'submit_grievance', 'submit_support_ticket'];

    /**
     * List roles. Protected keys are included only for super_admin; others get roles excluding protected.
     *
     * @OA\Get(
     *     path="/roles",
     *     summary="List roles (excludes protected unless super_admin)",
     *     tags={"Roles"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Response(response=200, description="List of roles")
     * )
     */
    public function index(): JsonResponse
    {
        $user = auth()->user();
        $activeCollegeId = InstitutionContext::getActiveInstitutionId($user);

        $query = Role::withoutGlobalScope('institution_scope')
            ->forInstitution($activeCollegeId)
            ->orderBy('level', 'desc');

        if (! app(PermissionResolverService::class)->userHasSuperAdmin($user)) {
            $query->whereNotIn('key', self::PROTECTED_ROLE_KEYS);
        }

        return $this->success($query->get());
    }

    /**
     * List only custom (institution-created) roles for the current college. No system roles.
     * Used by the Security Roles settings page. Protected roles are never custom (is_system), so no extra filter.
     */
    public function customIndex(Request $request): JsonResponse
    {
        $activeCollegeId = InstitutionContext::getActiveInstitutionId(auth()->user());

        $query = Role::withoutGlobalScope('institution_scope')
            ->where('is_system', false)
            ->forInstitution($activeCollegeId)
            ->orderBy('level', 'desc');

        $perPage = (int) $request->input('per_page', 15);
        $paginator = $query->paginate($perPage);

        return $this->paginatedWithMap($paginator, 'passthrough');
    }

    /**
     * @OA\Post(
     * path="/roles",
     * summary="Create a new role",
     * tags={"Roles"},
     * security={{"cookieAuth":{}}},
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"key", "name", "level"},
     * @OA\Property(property="key", type="string", example="clerk", description="Unique key for system use"),
     * @OA\Property(property="name", type="string", example="Office Clerk"),
     * @OA\Property(property="level", type="integer", example=10),
     * @OA\Property(property="description", type="string", example="Handle college office tasks")
     * )
     * ),
     * @OA\Response(response=201, description="Role created successfully")
     * )
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'level' => 'nullable|integer',
            'description' => 'nullable|string|max:500',
        ]);

        $activeCollegeId = InstitutionContext::getActiveInstitutionId(auth()->user());

        // Auto-generate key: unique per college/global
        $key = str($validated['name'])->slug('_')->toString() . '_' . str()->random(4);

        $institutionType = Institution::find($activeCollegeId)?->type?->value ?? config('ems.default_institution_type');
        $role = Role::create([
            'key' => $key,
            'name' => $validated['name'],
            'level' => $validated['level'] ?? 10,
            'description' => $validated['description'],
            'is_system' => false,
        ]);
        $role->roleScopes()->create([
            'scope_type' => $institutionType,
            'scope_id' => $activeCollegeId,
        ]);

        return $this->created($role);
    }

    /**
     * @OA\Get(
     *     path="/roles/{id}",
     *     summary="Get a role",
     *     tags={"Roles"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Role details")
     * )
     */
    public function show(Role $role): JsonResponse
    {
        if (in_array($role->key, self::PROTECTED_ROLE_KEYS, true)
            && ! app(PermissionResolverService::class)->userHasSuperAdmin(auth()->user())) {
            return $this->notFound('Role not found.');
        }
        $role->load(['workflows', 'permissions']);
        return $this->successWithMap($role, 'passthrough');
    }

    /**
     * @OA\Put(
     * path="/roles/{id}",
     * summary="Update an existing role",
     * tags={"Roles"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * @OA\Property(property="name", type="string", example="Faculty", description="Name of the role"),
     * @OA\Property(property="level", type="integer", example=15),
     * @OA\Property(property="description", type="string", example="Handle senior level tasks")
     * )
     * ),
     * @OA\Response(response=200, description="Role updated successfully")
     * )
     */
    public function update(Request $request, Role $role): JsonResponse
    {
        if (in_array($role->key, self::PROTECTED_ROLE_KEYS, true)
            && ! app(PermissionResolverService::class)->userHasSuperAdmin(auth()->user())) {
            return $this->notFound('Role not found.');
        }
        if ($role->is_system) {
            return $this->error('Cannot modify system role', 403);
        }

        $validated = $request->validate([
            'name' => 'sometimes|string|max:100',
            'level' => 'sometimes|integer',
            'description' => 'nullable|string|max:500',
        ]);

        $role->update($validated);
        return $this->successWithMap($role, 'passthrough');
    }

    /**
     * @OA\Delete(
     *     path="/roles/{id}",
     *     summary="Delete a role",
     *     tags={"Roles"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Role deleted")
     * )
     */
    public function destroy(Role $role): JsonResponse
    {
        if (in_array($role->key, self::PROTECTED_ROLE_KEYS, true)
            && ! app(PermissionResolverService::class)->userHasSuperAdmin(auth()->user())) {
            return $this->notFound('Role not found.');
        }
        if ($role->is_system) {
            return $this->error('Cannot delete system role', 403);
        }

        $role->delete();
        return $this->success(null, 'Role deleted');
    }

    /**
     * @OA\Post(
     * path="/roles/{role}/permissions",
     * summary="Sync permissions for a specific role",
     * tags={"Roles"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="role", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"permission_ids"},
     * @OA\Property(property="permission_ids", type="array", @OA\Items(type="integer"), example={1, 2, 5})
     * )
     * ),
     * @OA\Response(response=200, description="Permissions synced successfully")
     * )
     */
    public function syncPermissions(Request $request, Role $role): JsonResponse
    {
        if (in_array($role->key, self::PROTECTED_ROLE_KEYS, true)
            && ! app(PermissionResolverService::class)->userHasSuperAdmin(auth()->user())) {
            return $this->notFound('Role not found.');
        }

        $validated = $request->validate([
            'permission_ids' => 'required|array',
            'permission_ids.*' => 'exists:permissions,id',
        ]);

        $portalIds = Permission::whereIn('key', self::PORTAL_PERMISSION_KEYS)->pluck('id')->all();
        $allowedIds = array_values(array_diff($validated['permission_ids'], $portalIds));

        DB::table('role_permissions')->where('role_id', $role->id)->delete();

        $inserts = array_map(fn ($pid) => [
            'role_id' => $role->id,
            'permission_id' => $pid,
        ], $allowedIds);

        if (! empty($inserts)) {
            DB::table('role_permissions')->insert($inserts);
        }

        return $this->success(null, 'Permissions synced');
    }

    /**
     * Sync workflows for a role. Role gets all permissions from these workflows.
     */
    public function syncWorkflows(Request $request, Role $role): JsonResponse
    {
        if (in_array($role->key, self::PROTECTED_ROLE_KEYS, true)
            && ! app(PermissionResolverService::class)->userHasSuperAdmin(auth()->user())) {
            return $this->notFound('Role not found.');
        }

        $validated = $request->validate([
            'workflow_ids' => 'required|array',
            'workflow_ids.*' => 'exists:workflows,id',
        ]);

        $portalWorkflowIds = Workflow::whereIn('key', self::PORTAL_WORKFLOW_KEYS)->pluck('id')->all();
        $allowedWorkflowIds = array_values(array_diff($validated['workflow_ids'], $portalWorkflowIds));

        $role->workflows()->sync($allowedWorkflowIds);

        return $this->success(null, 'Workflows synced');
    }
}
