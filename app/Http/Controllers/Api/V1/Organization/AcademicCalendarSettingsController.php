<?php

namespace App\Http\Controllers\Api\V1\Organization;

use App\Http\Controllers\Api\V1\BaseController;
use App\Services\AcademicCalendarService;
use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AcademicCalendarSettingsController extends BaseController
{
    use BelongsToDefaultInstitution;

    public function __construct(
        private AcademicCalendarService $academicCalendarService
    ) {}

    public function show(Request $request): JsonResponse
    {
        $institutionId = self::getActiveInstitutionId($request->user());
        if (!$institutionId) {
            return $this->error('Institution context required.', 422);
        }

        $durationYears = max(1, (int) $request->query('duration_years', 1));

        return $this->success($this->academicCalendarService->getSettings($institutionId, $durationYears));
    }

    public function update(Request $request): JsonResponse
    {
        $institutionId = self::getActiveInstitutionId($request->user());
        if (!$institutionId) {
            return $this->error('Institution context required.', 422);
        }

        $validated = $request->validate([
            'session_start_month' => 'required|integer|min:1|max:12',
            'sync_current_session' => 'nullable|boolean',
            'duration_years' => 'nullable|integer|min:1|max:10',
        ]);

        $this->academicCalendarService->updateStartMonth(
            $institutionId,
            (int) $validated['session_start_month']
        );

        if ($request->boolean('sync_current_session')) {
            $this->academicCalendarService->syncCurrentFlag(
                $institutionId,
                max(1, (int) ($validated['duration_years'] ?? 1))
            );
        }

        $durationYears = max(1, (int) ($validated['duration_years'] ?? 1));

        return $this->success(
            $this->academicCalendarService->getSettings($institutionId, $durationYears),
            'Academic calendar settings updated.'
        );
    }
}
