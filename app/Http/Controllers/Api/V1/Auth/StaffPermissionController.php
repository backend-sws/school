<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\Institution;
use App\Models\User;
use App\Services\PermissionResolverService;
use App\Support\InstitutionContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StaffPermissionController extends BaseController
{
    public function __construct(
        protected PermissionResolverService $permissionResolver
    ) {}

    /**
     * Get permission-related details for a specific staff member.
     * Returns effective keys, direct workflows, and granular overrides in scope for the active college.
     */
    public function show(User $user): JsonResponse
    {
        $collegeId = InstitutionContext::getActiveInstitutionId($user);

        // 1. Effective keys (for active college)
        $effectiveKeys = $user->resolveEffectivePermissionKeys($collegeId);

        // 2. Direct Workflows in scope for this college (for UI to show/edit)
        $workflowsQuery = $this->permissionResolver->scopeWorkflowsForInstitution($user->workflows(), $collegeId);
        $directWorkflows = $workflowsQuery->pluck('workflows.id');

        // 3. Granular Overrides in scope for this college
        $overridesQuery = $this->permissionResolver->scopePermissionOverridesForInstitution($user->permissionOverrides(), $collegeId);
        $overrides = $overridesQuery->select('permissions.id', 'user_permissions.granted')
            ->get()
            ->mapWithKeys(fn($item) => [$item->id => $item->granted]);

        return $this->success([
            'user_id' => $user->id,
            'effective_keys' => $effectiveKeys,
            'workflow_ids' => $directWorkflows,
            'overrides' => $overrides,
        ]);
    }

    /**
     * Sync direct workflows for a staff member. Assignments are scoped to the active college.
     */
    public function syncWorkflows(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'workflow_ids' => 'present|array',
            'workflow_ids.*' => 'exists:workflows,id',
        ]);

        $collegeId = InstitutionContext::getActiveInstitutionId($user);

        $syncData = [];
        foreach ($validated['workflow_ids'] as $workflowId) {
            $syncData[$workflowId] = ['institution_id' => $collegeId];
        }
        $user->workflows()->sync($syncData);

        return $this->success(null, 'Staff workflows updated');
    }

    /**
     * Sync granular permission overrides for a staff member. Overrides are scoped to the active college.
     * Payload: { overrides: [ { id: 1, granted: true }, { id: 2, granted: false } ] }
     */
    public function syncOverrides(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'overrides' => 'present|array',
            'overrides.*.id' => 'required|exists:permissions,id',
            'overrides.*.granted' => 'required|boolean',
        ]);

        $collegeId = InstitutionContext::getActiveInstitutionId($user);

        DB::transaction(function () use ($user, $validated, $collegeId) {
            // Table has one row per (user_id, permission_id); new rows get current scope
            DB::table('user_permissions')->where('user_id', $user->id)->delete();

            $inserts = array_map(fn($o) => [
                'user_id' => $user->id,
                'permission_id' => $o['id'],
                'granted' => $o['granted'],
                'institution_id' => $collegeId,
            ], $validated['overrides']);

            if (!empty($inserts)) {
                DB::table('user_permissions')->insert($inserts);
            }
        });

        return $this->success(null, 'Staff permission overrides updated');
    }
}
