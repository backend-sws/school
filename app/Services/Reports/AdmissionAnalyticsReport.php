<?php

namespace App\Services\Reports;

use App\Models\AdmissionApplication;
use Illuminate\Support\Facades\DB;

class AdmissionAnalyticsReport extends BaseReport
{
    protected function generate(array $filters): array
    {
        $startDate = $filters['start_date'] ?? now()->startOfYear()->toDateString();
        $endDate = $filters['end_date'] ?? now()->toDateString();
        $institutionId = $this->getInstitutionId();

        $query = AdmissionApplication::query()
            ->leftJoin('admission_heads', 'admission_applications.admission_head_id', '=', 'admission_heads.id')
            ->whereBetween('admission_applications.submitted_at', [$startDate, $endDate]);

        // Summary Stats
        $stats = (clone $query)->select(
            DB::raw('COUNT(admission_applications.id) as total_received'),
            DB::raw("COUNT(CASE WHEN admission_applications.payment_status = 'success' THEN 1 END) as total_paid"),
            DB::raw("COUNT(CASE WHEN admission_applications.process_status = 'approved' THEN 1 END) as total_enrolled"),
            DB::raw("SUM(CASE WHEN admission_applications.payment_status = 'success' THEN admission_applications.amount ELSE 0 END) as total_collected")
        )->first();

        // Stream distribution — join via classes since admission_head_id is null in seeders/records
        $streamDistQuery = DB::table('streams as s')
            ->join('lms_classes as c', 's.id', '=', 'c.stream_id')
            ->join('admission_applications as a', 'c.id', '=', 'a.class_id')
            ->whereBetween('a.submitted_at', [$startDate, $endDate])
            ->select('s.name', DB::raw('COUNT(a.id) as total')); // Rename select value to total to match Chart xAxis/yAxis structure

        if ($institutionId) {
            $streamDistQuery->where('a.institution_id', $institutionId);
        }

        // Detailed transaction items for Excel/data table
        $perPage = $filters['per_page'] ?? 15;
        $paginator = (clone $query)
            ->select('admission_applications.*')
            ->orderByDesc('admission_applications.submitted_at')
            ->paginate($perPage);

        $items = collect($paginator->items())->map(function ($app, $index) use ($paginator) {
            return [
                'sl_no' => (($paginator->currentPage() - 1) * $paginator->perPage()) + $index + 1,
                'application_id' => $app->application_id ?: 'N/A',
                'applicant_name' => $app->applicant_name ?: 'N/A',
                'email' => $app->email ?: 'N/A',
                'mobile' => $app->mobile ?: 'N/A',
                'payment_status' => ucfirst($app->payment_status),
                'process_status' => ucfirst($app->process_status),
                'amount' => '₹' . number_format($app->amount, 2),
                'date' => \Carbon\Carbon::parse($app->submitted_at)->toDateString(),
            ];
        })->toArray();

        return [
            'summary' => [
                'received' => (int) $stats->total_received,
                'paid' => (int) $stats->total_paid,
                'enrolled' => (int) $stats->total_enrolled,
                'revenue' => (float) $stats->total_collected,
                'conversion_rate' => $stats->total_received > 0
                    ? round(($stats->total_enrolled / $stats->total_received) * 100, 2)
                    : 0,
            ],
            'funnel' => [
                'Applied' => (int) $stats->total_received,
                'Paid' => (int) $stats->total_paid,
                'Enrolled' => (int) $stats->total_enrolled,
            ],
            'daily_trend' => (clone $query)
                ->select(DB::raw('DATE(admission_applications.submitted_at) as date'), DB::raw('COUNT(*) as total')) // yAxisKey is total in line chart
                ->groupBy('date')
                ->orderBy('date')
                ->get(),
            'stream_distribution' => $streamDistQuery
                ->groupBy('s.id', 's.name')
                ->get(),
            'items' => $items,
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
            ['key' => 'application_id', 'label' => 'App ID'],
            ['key' => 'applicant_name', 'label' => 'Applicant Name'],
            ['key' => 'email', 'label' => 'Email'],
            ['key' => 'mobile', 'label' => 'Mobile'],
            ['key' => 'payment_status', 'label' => 'Payment Status'],
            ['key' => 'process_status', 'label' => 'Process Status'],
            ['key' => 'amount', 'label' => 'Amount', 'align' => 'right'],
            ['key' => 'date', 'label' => 'Submitted Date'],
        ];
    }

    public function getMetadata(): array
    {
        return [
            'title' => 'Admission Analytics',
            'description' => 'Analysis of the admission pipeline and application trends.',
            'type' => 'dashboard_complex',
            'charts' => [
                'funnel' => 'funnel',
                'daily_trend' => 'area',
                'stream_distribution' => 'pie',
            ],
        ];
    }
}
