<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\Institution;
use App\Models\Workflow;
use App\Services\PermissionResolverService;
use App\Support\InstitutionContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WorkflowController extends BaseController
{
    /**
     * Workflows visible only to super_admin (e.g. system_console). Hidden from others in list.
     */
    private const PROTECTED_WORKFLOW_KEYS = ['system_console'];

    /**
     * Portal workflow: assigned only by seeders to student/candidate. Never shown in role UI.
     */
    private const PORTAL_WORKFLOW_KEYS = ['student_portal'];

    /**
     * List workflows for the current college. Excludes portal workflow (not assignable). Protected only for super_admin.
     */
    public function index(): JsonResponse
    {
        $user = auth()->user();
        $activeCollegeId = InstitutionContext::getActiveInstitutionId($user);

        $query = Workflow::forInstitution($activeCollegeId)
            ->whereNotIn('key', self::PORTAL_WORKFLOW_KEYS)
            ->withCount('permissions')
            ->with('permissions:id')
            ->orderBy('name');

        if (! app(PermissionResolverService::class)->userHasSuperAdmin($user)) {
            $query->whereNotIn('key', self::PROTECTED_WORKFLOW_KEYS);
        }

        return $this->success($query->get());
    }

    /**
     * Create a new workflow (owned by the current college when in context).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'description' => 'nullable|string',
        ]);

        $activeCollegeId = InstitutionContext::getActiveInstitutionId(auth()->user());

        // Auto-generate unique key
        $key = str($validated['name'])->slug('_')->toString() . '_' . str()->random(4);
        $institutionType = Institution::find($activeCollegeId)?->type?->value ?? config('ems.default_institution_type');

        $workflow = Workflow::create([
            'key' => $key,
            'name' => $validated['name'],
            'description' => $validated['description'],
            'scope_type' => $institutionType,
            'scope_id' => $activeCollegeId,
        ]);

        return $this->created($workflow);
    }

    /**
     * Show workflow details. Protected workflows only for super_admin.
     */
    public function show(Workflow $workflow): JsonResponse
    {
        if (in_array($workflow->key, self::PROTECTED_WORKFLOW_KEYS, true)
            && ! app(PermissionResolverService::class)->userHasSuperAdmin(auth()->user())) {
            return $this->notFound('Workflow not found.');
        }
        return $this->successWithMap($workflow->load('permissions'), 'passthrough');
    }

    /**
     * Update an existing workflow. Protected workflows only for super_admin.
     */
    public function update(Request $request, Workflow $workflow): JsonResponse
    {
        if (in_array($workflow->key, self::PROTECTED_WORKFLOW_KEYS, true)
            && ! app(PermissionResolverService::class)->userHasSuperAdmin(auth()->user())) {
            return $this->notFound('Workflow not found.');
        }
        $validated = $request->validate([
            'name' => 'sometimes|string|max:150',
            'description' => 'nullable|string',
        ]);

        $workflow->update($validated);

        return $this->successWithMap($workflow, 'passthrough');
    }

    /**
     * Delete a workflow. Protected workflows only for super_admin.
     */
    public function destroy(Workflow $workflow): JsonResponse
    {
        if (in_array($workflow->key, self::PROTECTED_WORKFLOW_KEYS, true)
            && ! app(PermissionResolverService::class)->userHasSuperAdmin(auth()->user())) {
            return $this->notFound('Workflow not found.');
        }
        $workflow->delete();
        return $this->success(null, 'Workflow deleted successfully');
    }

    /**
     * Sync permissions for a specific workflow. Protected workflows only for super_admin.
     */
    public function syncPermissions(Request $request, Workflow $workflow): JsonResponse
    {
        if (in_array($workflow->key, self::PROTECTED_WORKFLOW_KEYS, true)
            && ! app(PermissionResolverService::class)->userHasSuperAdmin(auth()->user())) {
            return $this->notFound('Workflow not found.');
        }
        $validated = $request->validate([
            'permission_ids' => 'required|array',
            'permission_ids.*' => 'exists:permissions,id',
        ]);

        // Delete existing mapping
        DB::table('workflow_permissions')->where('workflow_id', $workflow->id)->delete();

        // Insert new mapping
        $inserts = array_map(fn($pid) => [
            'workflow_id' => $workflow->id,
            'permission_id' => $pid,
        ], $validated['permission_ids']);

        DB::table('workflow_permissions')->insert($inserts);

        return $this->success(null, 'Workflow permissions synced successfully');
    }
}
