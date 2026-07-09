<?php

namespace App\Services\Fees;

use App\Models\StudentFeePeriodBalance;
use App\Models\User;
use App\Services\FeeCollectionService;

class StudentFeePeriodBalanceProjector
{
    public function __construct(private FeeCollectionService $feeCollectionService)
    {
    }

    public function projectPeriod(User $student, int $institutionId, string $periodKey, ?int $sessionId = null): ?StudentFeePeriodBalance
    {
        $matrixResult = $this->feeCollectionService->getStudentLedgerMatrix($student, $institutionId, $sessionId);
        if (isset($matrixResult['error'])) {
            return null;
        }

        $row = collect($matrixResult['matrix'] ?? [])->firstWhere('month_key', $periodKey);
        if (!$row) {
            return null;
        }

        $sessionId = $sessionId ?: $student->studentProfile?->session_id;
        if (!$sessionId) {
            return null;
        }

        $payload = [
            'opening_balance' => (float) ($row['previous_dues'] ?? 0),
            'period_fee' => (float) ($row['monthly_total'] ?? 0),
            'discount' => (float) ($row['discount'] ?? 0),
            'late_fee' => (float) ($row['late_fee'] ?? 0),
            'total_payable' => (float) ($row['total_payable'] ?? 0),
            'paid_amount' => (float) ($row['paid_amount'] ?? 0),
            'closing_balance' => (float) ($row['balance'] ?? 0),
            'frequency' => (string) ($matrixResult['frequency'] ?? 'monthly'),
        ];
        $payload['version_hash'] = md5(json_encode($payload));

        return StudentFeePeriodBalance::updateOrCreate(
            [
                'institution_id' => $institutionId,
                'user_id' => $student->id,
                'session_id' => $sessionId,
                'period_key' => $periodKey,
            ],
            $payload
        );
    }
}
