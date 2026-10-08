<?php

namespace App\Services\Reports;

use App\Contracts\ReportContract;
use App\Models\AdmissionApplication;
use App\Support\InstitutionContext;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReadmissionReport implements ReportContract
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
        $rawDateSql = 'COALESCE(submitted_at, payment_date, admission_date, created_at)';

        // Base Query — AdmissionApplication uses BelongsToDefaultInstitution so Eloquent scope applies
        $query = AdmissionApplication::where('application_type', 're-admission')
            ->when($institutionId, fn($q) => $q->where('institution_id', $institutionId))
            ->when($selectedSession, fn($q) => $q->where('session_id', $selectedSession->id))
            ->where(function ($q) use ($rawDateSql, $startDate, $endDate) {
                $q->whereBetween(DB::raw($rawDateSql), [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
                  ->orWhereNull('submitted_at');
            })
            ->when($classId, function ($q, $classId) {
                $q->where('class_id', $classId);
            });

        // Statistics
        $eligibleCount = (clone $query)->count();
        $readmittedCount = (clone $query)->where('process_status', 'approved')->count();

        // Pagination / Export for table items
        $isExport = !empty($filters['is_export']) || request()->routeIs('*export*') || request('is_export') || ($filters['per_page'] ?? null) >= 10000;
        $perPage = $filters['per_page'] ?? 15;

        if ($isExport) {
            $records = (clone $query)->orderByDesc(DB::raw($rawDateSql))->get();
            $items = $records->map(function ($app, $index) {
                return [
                    'sl_no' => $index + 1,
                    'student' => $app->applicant_name ?: 'N/A',
                    'target' => $app->session_name ?: 'N/A',
                    'status' => ucfirst($app->process_status),
                    'date' => Carbon::parse($app->submitted_at)->toDateString(),
                ];
            })->toArray();
            $paginationData = null;
        } else {
            $paginator = (clone $query)->orderByDesc(DB::raw($rawDateSql))->paginate($perPage);
            $items = collect($paginator->items())->map(function ($app, $index) use ($paginator) {
                return [
                    'sl_no' => (($paginator->currentPage() - 1) * $paginator->perPage()) + $index + 1,
                    'student' => $app->applicant_name ?: 'N/A',
                    'target' => $app->session_name ?: 'N/A',
                    'status' => ucfirst($app->process_status),
                    'date' => Carbon::parse($app->submitted_at)->toDateString(),
                ];
            })->toArray();
            $paginationData = [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ];
        }

        return [
            'summary' => [
                'eligible' => $eligibleCount,
                'readmitted' => $readmittedCount,
                'extensions' => 0, // Placeholder
                'rollbacks' => 0, // Placeholder
            ],
            'chart' => [
                ['name' => 'Eligible', 'value' => $eligibleCount],
                ['name' => 'Re-Admitted', 'value' => $readmittedCount],
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
            ['key' => 'target', 'label' => 'Target Session'],
            ['key' => 'status', 'label' => 'Status'],
            ['key' => 'date', 'label' => 'Date'],
        ];
    }

    public function getMetadata(): array
    {
        return [
            'title' => 'Re-Admission Analytics',
            'description' => 'Analyze student return patterns and retention trends.',
            'chart_type' => 'funnel',
        ];
    }
}
