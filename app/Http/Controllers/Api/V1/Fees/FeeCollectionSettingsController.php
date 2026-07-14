<?php

namespace App\Http\Controllers\Api\V1\Fees;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\Setting;
use App\Services\FeeCollectionService;
use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FeeCollectionSettingsController extends BaseController
{
    use BelongsToDefaultInstitution;

    public function __construct(
        private FeeCollectionService $feeCollectionService
    ) {}

    /**
     * GET fee collection settings for the active institution.
     */
    public function show(Request $request): JsonResponse
    {
        $institutionId = self::getActiveInstitutionId($request->user());
        if (!$institutionId) {
            return $this->error('Institution context required.', 422);
        }

        $settings = $this->feeCollectionService->getSettings($institutionId);
        return $this->success($settings);
    }

    /**
     * PATCH fee collection settings (partial update).
     */
    public function update(Request $request): JsonResponse
    {
        $institutionId = self::getActiveInstitutionId($request->user());
        if (!$institutionId) {
            return $this->error('Institution context required.', 422);
        }

        $validated = $request->validate([
            'fee_collection_frequency' => 'nullable|string|in:monthly,quarterly',
            'fee_due_day_of_month' => 'nullable|integer|min:1|max:28',
            'reminder_days_before_due' => 'nullable|integer|min:0|max:31',
            'overdue_reminder_after_days' => 'nullable|integer|min:0|max:90',
            'late_fee_enabled' => 'nullable|boolean',
            'late_fee_after_days' => 'nullable|integer|min:0|max:90',
            'late_fee_type' => 'nullable|string|in:fixed,percent',
            'late_fee_value' => 'nullable|numeric|min:0',
            'reminder_send_email' => 'nullable|boolean',
            'receipt_send_email' => 'nullable|boolean',
            'charge_fees_from_admission_month' => 'nullable|boolean',
        ]);

        $keys = array_keys($validated);
        foreach ($keys as $key) {
            $value = $validated[$key];
            if (is_bool($value)) {
                $value = $value ? '1' : '0';
            } else {
                $value = (string) $value;
            }
            Setting::withoutGlobalScope('institution_scope')->updateOrCreate(
                [
                    'institution_id' => $institutionId,
                    'setting_key' => $key,
                ],
                [
                    'setting_value' => $value,
                    'setting_group' => FeeCollectionService::SETTING_GROUP,
                ]
            );
        }

        $settings = $this->feeCollectionService->getSettings($institutionId);
        return $this->success($settings, 'Fee collection settings updated.');
    }
}
