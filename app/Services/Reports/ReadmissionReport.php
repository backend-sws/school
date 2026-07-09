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
        $startDate = $filters['start_date'] ?? now()->startOfYear()->toDateString();
        $endDate = $filters['end_date'] ?? now()->toDateString();
        $institutionId = InstitutionContext::getActiveInstitutionId();
        $classId = $filters['class_id'] ?? null;

        // Base Query — AdmissionApplication uses BelongsToDefaultInstitution so Eloquent scope applies
        $query = AdmissionApplication::where('application_type', 're-admission')
            ->whereBetween('submitted_at', [$startDate, $endDate])
            ->when($classId, function ($q, $classId) {
                $q->where('class_id', $classId);
            });

        // Statistics
        $eligibleCount = (clone $query)->count();
        $readmittedCount = (clone $query)->where('process_status', 'approved')->count();

        // Pagination for table items
        $perPage = $filters['per_page'] ?? 15;
        $paginator = (clone $query)
            ->orderByDesc('submitted_at')
            ->paginate($perPage);

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
            'items' => collect($paginator->items())->map(function ($app, $index) use ($paginator) {
                return [
                    'sl_no' => (($paginator->currentPage() - 1) * $paginator->perPage()) + $index + 1,
                    'student' => $app->applicant_name ?: 'N/A',
                    'target' => $app->session_name ?: 'N/A',
                    'status' => ucfirst($app->process_status),
                    'date' => Carbon::parse($app->submitted_at)->toDateString(),
                ];
            })->toArray(),
            'pagination' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
            ],
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
