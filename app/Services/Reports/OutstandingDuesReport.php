<?php

namespace App\Services\Reports;

use App\Models\LmsClassEnrollment;
use App\Services\FeeCollectionService;
use Carbon\Carbon;

class OutstandingDuesReport extends BaseReport
{
    protected FeeCollectionService $feeCollectionService;

    public function __construct(FeeCollectionService $feeCollectionService)
    {
        $this->feeCollectionService = $feeCollectionService;
    }

    protected function generate(array $filters): array
    {
        @set_time_limit(300);

        $institutionId = \App\Support\InstitutionContext::getActiveInstitutionId() ?? (int) ($filters['institution_id'] ?? config('ems.default_institution_id'));
        $classId = $filters['class_id'] ?? null;

        $today = now()->startOfDay();

        // Convert start_date/end_date filter parameters to Y-m strings
        $from = isset($filters['start_date'])
            ? Carbon::parse($filters['start_date'])->format('Y-m')
            : ($filters['from'] ?? now()->startOfYear()->format('Y-m'));

        $to = isset($filters['end_date'])
            ? Carbon::parse($filters['end_date'])->format('Y-m')
            : ($filters['to'] ?? now()->format('Y-m'));

        $periodKeys = $this->getPeriodKeysInRange($institutionId, $from, $to);

        $query = LmsClassEnrollment::query()
            ->where('role', 'student')
            ->where('status', 'active')
            ->whereHas('lmsClass', fn($q) => $q->where('institution_id', $institutionId));

        if ($classId) {
            $query->where('lms_class_id', $classId);
        }

        $enrollments = $query->with(['user.studentProfile.session', 'lmsClass'])->get();

        $overdueList = [];
        $agingSummary = [
            '0_30' => 0,
            '31_60' => 0,
            '61_90' => 0,
            '91_plus' => 0,
        ];

        foreach ($enrollments as $enrollment) {
            $student = $enrollment->user;
            if (!$student)
                continue;

            $matrixResult = $this->feeCollectionService->getStudentLedgerMatrix($student, $institutionId);
            if (isset($matrixResult['error'])) {
                continue;
            }
            $expected = (float) ($matrixResult['periodExpected'] ?? 0);
            $frequency = $matrixResult['frequency'] ?? null;
            $studentPeriodKeys = $this->feeCollectionService->getPeriodKeysInRangeForStudent($student, $institutionId, $from, $to);
            $studentLatestOutstanding = null;

            foreach ($studentPeriodKeys as $periodKey) {
                $dueDate = $this->feeCollectionService->getDueDateForPeriod($institutionId, $periodKey, $frequency);

                if ($dueDate->gte($today)) {
                    continue; // Not overdue yet
                }

                $periodDues = $this->feeCollectionService->getPeriodDuesForStudent($student, $periodKey, $expected, $matrixResult);
                $balance = $periodDues['balance'];

                if ($balance <= 0) {
                    continue;
                }

                $daysOverdue = $today->diffInDays($dueDate);

                if ($studentLatestOutstanding === null || strcmp($periodKey, $studentLatestOutstanding['period']) > 0) {
                    $studentLatestOutstanding = [
                        'period' => $periodKey,
                        'days_overdue' => $daysOverdue,
                        'balance' => $balance,
                    ];
                }

                $overdueList[] = [
                    'student_name' => $student->name,
                    'reg_no' => $student->reg_no ?: ($student->studentProfile->reg_no ?? 'N/A'),
                    'class' => $enrollment->lmsClass?->name ?? 'N/A',
                    'period' => $periodKey,
                    'due_date' => $dueDate->toDateString(),
                    'days_overdue' => $daysOverdue,
                    'balance' => $balance,
                ];
            }

            if ($studentLatestOutstanding !== null) {
                $daysOverdue = $studentLatestOutstanding['days_overdue'];
                $balance = (float) $studentLatestOutstanding['balance'];
                if ($daysOverdue <= 30) {
                    $agingSummary['0_30'] += $balance;
                } elseif ($daysOverdue <= 60) {
                    $agingSummary['31_60'] += $balance;
                } elseif ($daysOverdue <= 90) {
                    $agingSummary['61_90'] += $balance;
                } else {
                    $agingSummary['91_plus'] += $balance;
                }
            }
        }

        // Calculate daily trend of overdue amounts
        $dailyTrend = [];
        $groupedTrend = collect($overdueList)->groupBy('due_date')->map(function ($items) {
            return $items->sum('balance');
        })->sortKeys();

        foreach ($groupedTrend as $date => $total) {
            $dailyTrend[] = [
                'date' => $date,
                'total' => (float) $total,
            ];
        }

        return [
            'summary' => [
                'total_outstanding' => array_sum($agingSummary),
                '0_30_days' => $agingSummary['0_30'],
                '31_60_days' => $agingSummary['31_60'],
                '61_plus_days' => $agingSummary['61_90'] + $agingSummary['91_plus'],
            ],
            'daily_trend' => $dailyTrend,
            'breakdown' => [
                ['name' => '0-30 Days', 'total' => (float) $agingSummary['0_30']],
                ['name' => '31-60 Days', 'total' => (float) $agingSummary['31_60']],
                ['name' => '61-90 Days', 'total' => (float) $agingSummary['61_90']],
                ['name' => '91+ Days', 'total' => (float) $agingSummary['91_plus']],
            ],
            'items' => collect($overdueList)->map(function ($item, $index) {
                return [
                    'sl_no' => $index + 1,
                    'student_name' => $item['student_name'] ?: 'N/A',
                    'reg_no' => $item['reg_no'] ?: 'N/A',
                    'class' => $item['class'] ?: 'N/A',
                    'period' => $item['period'] ?: 'N/A',
                    'due_date' => $item['due_date'] ?: 'N/A',
                    'days_overdue' => $item['days_overdue'] ?: 0,
                    'balance' => '₹' . number_format($item['balance'], 2),
                ];
            })->toArray(),
            'pagination' => [
                'current_page' => 1,
                'last_page' => 1,
                'per_page' => max(15, count($overdueList)),
                'total' => count($overdueList),
            ],
        ];
    }

    private function getPeriodKeysInRange(int $institutionId, string $from, string $to): array
    {
        $settings = $this->feeCollectionService->getSettings($institutionId);
        $frequency = $settings['fee_collection_frequency'] ?? 'monthly';

        return $this->feeCollectionService->getPeriodKeysInRangeForFrequency($from, $to, $frequency);
    }

    public function getHeaders(): array
    {
        return [
            ['key' => 'sl_no', 'label' => 'SL No'],
            ['key' => 'student_name', 'label' => 'Student'],
            ['key' => 'reg_no', 'label' => 'Reg No'],
            ['key' => 'class', 'label' => 'Class'],
            ['key' => 'period', 'label' => 'Period'],
            ['key' => 'due_date', 'label' => 'Due Date'],
            ['key' => 'days_overdue', 'label' => 'Days Overdue'],
            ['key' => 'balance', 'label' => 'Outstanding Balance', 'align' => 'right'],
        ];
    }

    public function getMetadata(): array
    {
        return [
            'title' => 'Outstanding Dues Report',
            'description' => 'Aging analysis and list of students with pending fees.',
            'type' => 'dashboard_complex',
            'charts' => [
                'daily_trend' => 'line',
                'fee_type_breakdown' => 'pie',
            ],
        ];
    }
}
