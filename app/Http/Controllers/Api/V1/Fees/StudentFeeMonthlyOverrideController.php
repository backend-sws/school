<?php

namespace App\Http\Controllers\Api\V1\Fees;

use App\Http\Controllers\Controller;
use App\Models\StudentFeeMonthlyOverride;
use App\Services\FeeCollectionService;
use App\Support\InstitutionContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentFeeMonthlyOverrideController extends Controller
{
    /**
     * Upsert a per-student override for recurring monthly fee (for all months, single month, or multiple months).
     */
    public function upsert(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id'           => 'required|exists:users,id',
            'session_id'        => 'nullable|integer',
            'scope'             => 'required|in:all,single,multiple',
            'for_month'         => 'nullable|string|regex:/^\d{4}-\d{2}$/',
            'months'            => 'nullable|array',
            'months.*'          => 'string|regex:/^\d{4}-\d{2}$/',
            'fee_name'          => 'nullable|string|max:255',
            'original_amount'   => 'required|numeric',
            'overridden_amount' => 'required|numeric|min:0',
            'remarks'           => 'nullable|string|max:500',
        ]);

        if (!$request->user()->isSuperAdmin() && !$request->user()->hasAbility('edit_fee_ledger')) {
            return response()->json(['message' => 'You do not have permission to edit fee ledger charges.'], 403);
        }

        $institutionId = InstitutionContext::getActiveInstitutionId($request->user());
        if (!$institutionId) {
            return response()->json(['message' => 'Institution context required.'], 422);
        }

        $userId = (int) $validated['user_id'];
        $sessionId = !empty($validated['session_id']) ? (int) $validated['session_id'] : null;
        $feeName = !empty($validated['fee_name']) ? trim($validated['fee_name']) : 'Monthly Fee';
        $originalAmount = (float) $validated['original_amount'];
        $overriddenAmount = (float) $validated['overridden_amount'];
        $remarks = $validated['remarks'] ?? null;
        $authUserId = $request->user()->id;

        $scope = $validated['scope'];
        $createdOverrides = [];

        if ($scope === 'all') {
            // Delete existing month-specific overrides for this user/session so universal override applies everywhere cleanly
            StudentFeeMonthlyOverride::where('institution_id', $institutionId)
                ->where('user_id', $userId)
                ->when($sessionId, fn($q) => $q->where('session_id', $sessionId))
                ->delete();

            $override = StudentFeeMonthlyOverride::create([
                'institution_id'    => $institutionId,
                'user_id'           => $userId,
                'session_id'        => $sessionId,
                'for_month'         => null,
                'fee_name'          => $feeName,
                'original_amount'   => $originalAmount,
                'overridden_amount' => $overriddenAmount,
                'remarks'           => $remarks,
                'created_by'        => $authUserId,
            ]);
            $createdOverrides[] = $override;
        } elseif ($scope === 'single') {
            $month = $validated['for_month'] ?? null;
            if (!$month) {
                return response()->json(['message' => 'Month is required for single month override.'], 422);
            }

            $override = StudentFeeMonthlyOverride::updateOrCreate(
                [
                    'institution_id' => $institutionId,
                    'user_id'        => $userId,
                    'for_month'      => $month,
                ],
                [
                    'session_id'        => $sessionId,
                    'fee_name'          => $feeName,
                    'original_amount'   => $originalAmount,
                    'overridden_amount' => $overriddenAmount,
                    'remarks'           => $remarks,
                    'created_by'        => $authUserId,
                ]
            );
            $createdOverrides[] = $override;
        } elseif ($scope === 'multiple') {
            $months = $validated['months'] ?? [];
            if (empty($months)) {
                return response()->json(['message' => 'At least one month must be selected.'], 422);
            }

            foreach ($months as $month) {
                $override = StudentFeeMonthlyOverride::updateOrCreate(
                    [
                        'institution_id' => $institutionId,
                        'user_id'        => $userId,
                        'for_month'      => $month,
                    ],
                    [
                        'session_id'        => $sessionId,
                        'fee_name'          => $feeName,
                        'original_amount'   => $originalAmount,
                        'overridden_amount' => $overriddenAmount,
                        'remarks'           => $remarks,
                        'created_by'        => $authUserId,
                    ]
                );
                $createdOverrides[] = $override;
            }
        }

        FeeCollectionService::clearCache();

        return response()->json([
            'message'   => 'Monthly fee override saved successfully.',
            'overrides' => $createdOverrides,
        ]);
    }

    /**
     * Revert a per-student monthly override (restore standard class rate).
     */
    public function destroy(Request $request, $id): JsonResponse
    {
        $override = StudentFeeMonthlyOverride::findOrFail($id);

        $institutionId = InstitutionContext::getActiveInstitutionId($request->user());
        if ($institutionId && $override->institution_id != $institutionId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if (!$request->user()->isSuperAdmin() && !$request->user()->hasAnyAbility(['revert_fee_overrides', 'edit_fee_ledger'])) {
            return response()->json(['message' => 'You do not have permission to revert fee overrides.'], 403);
        }

        $override->delete();
        FeeCollectionService::clearCache();

        return response()->json(['message' => 'Monthly fee override reverted. Standard class rate restored.']);
    }
}
