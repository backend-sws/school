<?php

namespace App\Services\Reports;

use App\Contracts\ReportContract;
use App\Models\StudentProfile;
use App\Models\StudentTransition;
use App\Support\InstitutionContext;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PromotionReport implements ReportContract
{
    public function getData(array $filters): array
    {
        $startDate = $filters['start_date'] ?? now()->startOfYear()->toDateString();
        $endDate = $filters['end_date'] ?? now()->toDateString();
        $institutionId = InstitutionContext::getActiveInstitutionId();
        $classId = $filters['class_id'] ?? null;

        // Statistics
        $eligibleCount = StudentProfile::where('institution_id', $institutionId)
            ->where('enrollment_status', 'active')
            ->when($classId, function ($q, $classId) {
                $q->whereHas('user.academicInfo', fn($ai) => $ai->where('lms_class_id', $classId));
            })
            ->count();

        $promotedCount = StudentTransition::where('institution_id', $institutionId)
            ->where('type', 'promotion')
            ->whereBetween('processed_at', [$startDate, $endDate])
            ->when($classId, function ($q, $classId) {
                $q->where('from_class_id', $classId);
            })
            ->count();

        // Pagination for table items
        $perPage = $filters['per_page'] ?? 15;
        $transitions = StudentTransition::where('institution_id', $institutionId)
            ->where('type', 'promotion')
            ->whereBetween('processed_at', [$startDate, $endDate])
            ->when($classId, function ($q, $classId) {
                $q->where('from_class_id', $classId);
            })
            ->with(['studentProfile.user', 'fromSession', 'toSession'])
            ->orderByDesc('processed_at')
            ->paginate($perPage);

        return [
            'summary' => [
                'eligible' => $eligibleCount,
                'promoted' => $promotedCount,
                'pending' => max(0, $eligibleCount - $promotedCount),
                'success_rate' => $eligibleCount > 0 ? round(($promotedCount / $eligibleCount) * 100, 1) . '%' : '0%',
            ],
            'chart' => [
                ['name' => 'Eligible', 'value' => $eligibleCount],
                ['name' => 'Promoted', 'value' => $promotedCount],
            ],
            'items' => collect($transitions->items())->map(function ($t, $index) use ($transitions) {
                return [
                    'sl_no' => (($transitions->currentPage() - 1) * $transitions->perPage()) + $index + 1,
                    'student' => $t->studentProfile->user->name ?? 'N/A',
                    'transition' => ($t->fromSession->name ?? 'N/A') . ' → ' . ($t->toSession->name ?? 'N/A'),
                    'status' => ucfirst($t->status ?? 'Completed'),
                    'date' => Carbon::parse($t->processed_at)->toDateString(),
                ];
            })->toArray(),
            'pagination' => [
                'current_page' => $transitions->currentPage(),
                'last_page' => $transitions->lastPage(),
                'per_page' => $transitions->perPage(),
                'total' => $transitions->total(),
            ],
        ];
    }

    public function getHeaders(): array
    {
        return [
            ['key' => 'sl_no', 'label' => 'SL No'],
            ['key' => 'student', 'label' => 'Student'],
            ['key' => 'transition', 'label' => 'Transition'],
            ['key' => 'status', 'label' => 'Status'],
            ['key' => 'date', 'label' => 'Date'],
        ];
    }

    public function getMetadata(): array
    {
        return [
            'title' => 'Promotion Analytics',
            'description' => 'Track student transition trends and promotion velocity.',
            'chart_type' => 'funnel',
        ];
    }
}
