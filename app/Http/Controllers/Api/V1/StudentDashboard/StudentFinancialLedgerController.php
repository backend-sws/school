<?php

namespace App\Http\Controllers\Api\V1\StudentDashboard;

use App\Http\Controllers\Api\V1\BaseController;
use App\Services\ApiResponseMapService;
use App\Services\FeeCollectionService;
use App\Support\EffectiveStudentContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentFinancialLedgerController extends BaseController
{
    public function __construct(private FeeCollectionService $feeCollectionService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        if (!$request->user()->hasAbility('view_my_ledger')) {
            return $this->forbidden('You do not have permission to view your ledger.');
        }

        $validated = $request->validate([
            'session_id' => 'nullable|integer|exists:academic_sessions,id',
            'from_period' => 'nullable|string|regex:/^\d{4}-\d{2}$/',
            'to_period' => 'nullable|string|regex:/^\d{4}-\d{2}$/',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        $student = EffectiveStudentContext::getEffectiveUser($request->user());
        if (!$student) {
            return $this->unauthorized('Unauthorized.');
        }

        $institutionId = (int) ($student->institution_id ?? $request->user()->institution_id ?? config('ems.default_institution_id'));
        $projectedRows = $this->feeCollectionService->getProjectedPeriodBalances(
            $student,
            $institutionId,
            $validated['session_id'] ?? null,
            $validated['from_period'] ?? null,
            $validated['to_period'] ?? null,
        );
        $result = $this->feeCollectionService->getStudentLedgerMatrix($student, $institutionId, $validated['session_id'] ?? null);
        if (isset($result['error'])) {
            return $this->error($result['error'], 422);
        }

        $matrix = $projectedRows !== [] ? $projectedRows : ($result['matrix'] ?? []);
        $fromPeriod = $validated['from_period'] ?? null;
        $toPeriod = $validated['to_period'] ?? null;
        if ($fromPeriod || $toPeriod) {
            $matrix = collect($matrix)->filter(function (array $row) use ($fromPeriod, $toPeriod) {
                $key = $row['month_key'] ?? null;
                if (!$key) {
                    return false;
                }
                if ($fromPeriod && strcmp($key, $fromPeriod) < 0) {
                    return false;
                }
                if ($toPeriod && strcmp($key, $toPeriod) > 0) {
                    return false;
                }

                return true;
            })->values()->all();
        }

        $page = (int) ($validated['page'] ?? 1);
        $perPage = (int) ($validated['per_page'] ?? count($matrix) ?: 1);
        $offset = max(0, ($page - 1) * $perPage);
        $pagedMatrix = array_slice($matrix, $offset, $perPage);

        // Determine which sessions the student is actually associated with
        $studentSessionIds = collect([$student->studentProfile?->session_id])
            ->merge(\Illuminate\Support\Facades\DB::table('student_fee_period_balances')->where('user_id', $student->id)->pluck('session_id'))
            ->merge(\Illuminate\Support\Facades\DB::table('admission_applications')->where('user_id', $student->id)->pluck('session_id'))
            ->filter()
            ->unique()
            ->values()
            ->toArray();

        $availableSessions = \App\Models\Session::where('institution_id', $institutionId)
            ->whereIn('id', $studentSessionIds)
            ->orderByDesc('start_year')
            ->get(['id', 'name']);

        $student->loadMissing(['studentProfile.session', 'studentProfile.stream']);

        return $this->success([
            'student' => $student,
            'class' => $result['class'] ?? null,
            'collection_settings' => [
                'fee_collection_frequency' => $result['frequency'] ?? 'monthly',
                'fee_due_day_of_month' => $result['institutionSettings']['fee_due_day_of_month'] ?? 5,
            ],
            'matrix' => app(ApiResponseMapService::class)->filterCollection($pagedMatrix, 'fee_ledger_matrix_row'),
            'total_pending' => $result['total_pending'] ?? 0,
            'admission_summary' => $result['admission_summary'] ?? null,
            'one_time_charges' => $result['one_time_charges'] ?? [],
            'available_sessions' => $availableSessions,
            'source' => $projectedRows !== [] ? 'projected' : 'computed',
            'meta' => [
                'current_page' => $page,
                'per_page' => $perPage,
                'total' => count($matrix),
                'last_page' => (int) ceil(count($matrix) / max(1, $perPage)),
            ],
        ]);
    }
}
