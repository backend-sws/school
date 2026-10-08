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
        $institutionId = InstitutionContext::getActiveInstitutionId();
        $sessionId = $filters['academic_session_id'] ?? ($filters['session_id'] ?? null);

        $selectedSession = null;
        if ($sessionId && $sessionId !== 'all') {
            $selectedSession = \App\Models\Session::when($institutionId, fn($q) => $q->where('institution_id', $institutionId))
                ->where('id', (int) $sessionId)
                ->first();
        }

        if ($selectedSession && empty($filters['start_date'])) {
            $startDate = "{$selectedSession->start_year}-04-01";
            $endDate = $selectedSession->is_current ? now()->toDateString() : "{$selectedSession->end_year}-03-31";
        } else {
            $startDate = $filters['start_date'] ?? now()->startOfYear()->toDateString();
            $endDate = $filters['end_date'] ?? now()->toDateString();
        }

        $classId = $filters['class_id'] ?? null;

        // Statistics
        $eligibleCount = StudentProfile::where('institution_id', $institutionId)
            ->where('enrollment_status', 'active')
            ->when($selectedSession, fn($q) => $q->where('session_id', $selectedSession->id))
            ->when($classId, function ($q, $classId) {
                $q->whereHas('user.academicInfo', fn($ai) => $ai->where('lms_class_id', $classId));
            })
            ->count();

        $promotedCount = StudentTransition::where('institution_id', $institutionId)
            ->where('type', 'promotion')
            ->when($selectedSession, fn($q) => $q->where('from_session_id', $selectedSession->id))
            ->whereBetween('processed_at', [$startDate, $endDate])
            ->when($classId, function ($q, $classId) {
                $q->where('from_class_id', $classId);
            })
            ->count();

        // Pagination / Export for table items
        $isExport = !empty($filters['is_export']) || request()->routeIs('*export*') || request('is_export') || ($filters['per_page'] ?? null) >= 10000;
        $perPage = $filters['per_page'] ?? 15;

        $tQuery = StudentTransition::where('institution_id', $institutionId)
            ->where('type', 'promotion')
            ->when($selectedSession, fn($q) => $q->where('from_session_id', $selectedSession->id))
            ->whereBetween('processed_at', [$startDate, $endDate])
            ->when($classId, function ($q, $classId) {
                $q->where('from_class_id', $classId);
            })
            ->with(['studentProfile.user', 'fromSession', 'toSession'])
            ->orderByDesc('processed_at');

        if ($isExport) {
            $records = $tQuery->get();
            $items = $records->map(function ($t, $index) {
                return [
                    'sl_no' => $index + 1,
                    'student' => $t->studentProfile->user->name ?? 'N/A',
                    'transition' => ($t->fromSession->name ?? 'N/A') . ' → ' . ($t->toSession->name ?? 'N/A'),
                    'status' => ucfirst($t->status ?? 'Completed'),
                    'date' => Carbon::parse($t->processed_at)->toDateString(),
                ];
            })->toArray();
            $paginationData = null;
        } else {
            $transitions = $tQuery->paginate($perPage);
            $items = collect($transitions->items())->map(function ($t, $index) use ($transitions) {
                return [
                    'sl_no' => (($transitions->currentPage() - 1) * $transitions->perPage()) + $index + 1,
                    'student' => $t->studentProfile->user->name ?? 'N/A',
                    'transition' => ($t->fromSession->name ?? 'N/A') . ' → ' . ($t->toSession->name ?? 'N/A'),
                    'status' => ucfirst($t->status ?? 'Completed'),
                    'date' => Carbon::parse($t->processed_at)->toDateString(),
                ];
            })->toArray();
            $paginationData = [
                'current_page' => $transitions->currentPage(),
                'last_page' => $transitions->lastPage(),
                'per_page' => $transitions->perPage(),
                'total' => $transitions->total(),
            ];
        }

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
            'items' => $items,
            'pagination' => $paginationData,
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
