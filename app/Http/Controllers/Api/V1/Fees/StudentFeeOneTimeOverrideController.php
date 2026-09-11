<?php

namespace App\Http\Controllers\Api\V1\Fees;

use App\Http\Controllers\Controller;
use App\Models\StudentFeeOneTimeOverride;
use App\Support\InstitutionContext;
use Illuminate\Http\Request;

class StudentFeeOneTimeOverrideController extends Controller
{
    /**
     * Upsert a per-student override for a one-time charge (by fee_type_id or charge_name).
     */
    public function upsert(Request $request)
    {
        $validated = $request->validate([
            'user_id'            => 'required|exists:users,id',
            'fee_type_id'        => 'nullable|integer',
            'charge_name'        => 'nullable|string|max:255',
            'original_amount'    => 'required|numeric',
            'overridden_amount'  => 'required|numeric|min:0',
            'remarks'            => 'nullable|string|max:500',
        ]);

        if (empty($validated['fee_type_id']) && empty($validated['charge_name'])) {
            return response()->json(['message' => 'Either fee_type_id or charge_name is required.'], 422);
        }

        $institutionId = InstitutionContext::getActiveInstitutionId($request->user());

        if (!$institutionId) {
            return response()->json(['message' => 'Institution context required.'], 422);
        }

        $userId = (int) $validated['user_id'];
        $feeTypeId = !empty($validated['fee_type_id']) ? (int) $validated['fee_type_id'] : null;
        $chargeName = !empty($validated['charge_name']) ? trim($validated['charge_name']) : null;
        $newOverriddenAmount = (float) $validated['overridden_amount'];
        $originalAmount = (float) $validated['original_amount'];

        // Find existing override if any
        $query = StudentFeeOneTimeOverride::where('institution_id', $institutionId)
            ->where('user_id', $userId);
        if ($feeTypeId) {
            $query->where('fee_type_id', $feeTypeId);
        } else {
            $query->where('charge_name', $chargeName);
        }
        $existing = $query->first();

        $previousAmount = $existing ? (float) $existing->overridden_amount : $originalAmount;
        $diff = $newOverriddenAmount - $previousAmount;

        $override = StudentFeeOneTimeOverride::updateOrCreate(
            $feeTypeId ? [
                'institution_id' => $institutionId,
                'user_id'        => $userId,
                'fee_type_id'    => $feeTypeId,
            ] : [
                'institution_id' => $institutionId,
                'user_id'        => $userId,
                'charge_name'    => $chargeName,
            ],
            [
                'charge_name'       => $chargeName,
                'fee_type_id'       => $feeTypeId,
                'original_amount'   => $originalAmount,
                'overridden_amount' => $newOverriddenAmount,
                'remarks'           => $validated['remarks'] ?? null,
                'created_by'        => $request->user()->id,
            ]
        );

        // Adjust student_fee_period_balances 'arrears' row if present
        $arrearsRow = \App\Models\StudentFeePeriodBalance::where('institution_id', $institutionId)
            ->where('user_id', $userId)
            ->where('period_key', 'arrears')
            ->first();

        if ($arrearsRow && $diff != 0) {
            $newOpening = max(0, (float) $arrearsRow->opening_balance + $diff);
            $newTotalPayable = max(0, (float) $arrearsRow->total_payable + $diff);
            $newClosing = max(0, (float) $arrearsRow->closing_balance + $diff);
            $arrearsRow->update([
                'opening_balance' => $newOpening,
                'total_payable'   => $newTotalPayable,
                'closing_balance' => $newClosing,
                'version_hash'    => md5((string) $newOpening),
            ]);
        }

        // Adjust AdmissionApplication fee_breakdown if present
        $admissionApp = \App\Models\AdmissionApplication::where('institution_id', $institutionId)
            ->where('user_id', $userId)
            ->first();

        if ($admissionApp && is_array($admissionApp->fee_breakdown)) {
            $updatedBreakdown = false;
            $breakdown = $admissionApp->fee_breakdown;
            foreach ($breakdown as &$item) {
                $matched = false;
                if ($feeTypeId && ($item['fee_type_id'] ?? null) == $feeTypeId) {
                    $matched = true;
                } elseif ($chargeName && strtolower(trim((string) ($item['name'] ?? ''))) === strtolower(trim($chargeName))) {
                    $matched = true;
                }
                if ($matched) {
                    $item['amount'] = $newOverriddenAmount;
                    $item['is_overridden'] = true;
                    $item['original_amount'] = $originalAmount;
                    $item['remarks'] = $validated['remarks'] ?? null;
                    $updatedBreakdown = true;
                    break;
                }
            }
            if ($updatedBreakdown) {
                $newAppAmount = max(0, (float) ($admissionApp->amount ?? 0) + $diff);
                $newAppDue = max(0, (float) ($admissionApp->due_amount ?? 0) + $diff);
                $admissionApp->update([
                    'fee_breakdown' => $breakdown,
                    'amount'        => $newAppAmount,
                    'due_amount'    => $newAppDue,
                ]);
            }
        }

        return response()->json([
            'message'  => 'Fee override saved successfully.',
            'override' => $override,
        ]);
    }

    /**
     * Revert a per-student override (restore system rate and previous dues).
     */
    public function destroy(Request $request, $id)
    {
        $override = StudentFeeOneTimeOverride::findOrFail($id);

        $institutionId = InstitutionContext::getActiveInstitutionId($request->user());
        if ($institutionId && $override->institution_id != $institutionId) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $userId = $override->user_id;
        $feeTypeId = $override->fee_type_id;
        $chargeName = $override->charge_name;
        $originalAmount = (float) $override->original_amount;
        $overriddenAmount = (float) $override->overridden_amount;
        $diff = $originalAmount - $overriddenAmount; // positive restores the previous deduction

        // Restore arrears in student_fee_period_balances if present
        $arrearsRow = \App\Models\StudentFeePeriodBalance::where('institution_id', $override->institution_id)
            ->where('user_id', $userId)
            ->where('period_key', 'arrears')
            ->first();

        if ($arrearsRow && $diff != 0) {
            $newOpening = max(0, (float) $arrearsRow->opening_balance + $diff);
            $newTotalPayable = max(0, (float) $arrearsRow->total_payable + $diff);
            $newClosing = max(0, (float) $arrearsRow->closing_balance + $diff);
            $arrearsRow->update([
                'opening_balance' => $newOpening,
                'total_payable'   => $newTotalPayable,
                'closing_balance' => $newClosing,
                'version_hash'    => md5((string) $newOpening),
            ]);
        }

        // Restore AdmissionApplication fee_breakdown if present
        $admissionApp = \App\Models\AdmissionApplication::where('institution_id', $override->institution_id)
            ->where('user_id', $userId)
            ->first();

        if ($admissionApp && is_array($admissionApp->fee_breakdown)) {
            $updatedBreakdown = false;
            $breakdown = $admissionApp->fee_breakdown;
            foreach ($breakdown as &$item) {
                $matched = false;
                if ($feeTypeId && ($item['fee_type_id'] ?? null) == $feeTypeId) {
                    $matched = true;
                } elseif ($chargeName && strtolower(trim((string) ($item['name'] ?? ''))) === strtolower(trim($chargeName))) {
                    $matched = true;
                }
                if ($matched) {
                    $item['amount'] = $originalAmount;
                    unset($item['is_overridden'], $item['original_amount'], $item['remarks']);
                    $updatedBreakdown = true;
                    break;
                }
            }
            if ($updatedBreakdown) {
                $newAppAmount = max(0, (float) ($admissionApp->amount ?? 0) + $diff);
                $newAppDue = max(0, (float) ($admissionApp->due_amount ?? 0) + $diff);
                $admissionApp->update([
                    'fee_breakdown' => $breakdown,
                    'amount'        => $newAppAmount,
                    'due_amount'    => $newAppDue,
                ]);
            }
        }

        $override->delete();

        return response()->json(['message' => 'Override reverted. System rate now applies.']);
    }
}
