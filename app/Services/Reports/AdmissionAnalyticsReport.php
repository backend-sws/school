<?php

namespace App\Services\Reports;

use App\Models\AdmissionApplication;
use Illuminate\Support\Facades\DB;

class AdmissionAnalyticsReport extends BaseReport
{
    protected function generate(array $filters): array
    {
        $institutionId = $this->getInstitutionId();
        $sessionId = $filters['academic_session_id'] ?? ($filters['session_id'] ?? null);

        $selectedSession = null;
        if ($sessionId && $sessionId !== 'all') {
            $selectedSession = \App\Models\Session::when($institutionId, fn($q) => $q->where('institution_id', $institutionId))
                ->where('id', (int) $sessionId)
                ->first();
        } elseif (!$sessionId && empty($filters['start_date'])) {
            $selectedSession = \App\Models\Session::when($institutionId, fn($q) => $q->where('institution_id', $institutionId))
                ->where('is_current', true)
                ->first();
        }

        if ($selectedSession && empty($filters['start_date'])) {
            $startDate = "{$selectedSession->start_year}-04-01";
            $endDate = $selectedSession->is_current ? now()->toDateString() : "{$selectedSession->end_year}-03-31";
        } else {
            $startDate = $filters['start_date'] ?? now()->startOfYear()->toDateString();
            $endDate = $filters['end_date'] ?? now()->toDateString();
        }

        $rawDateSql = 'COALESCE(admission_applications.submitted_at, admission_applications.payment_date, admission_applications.admission_date, admission_applications.created_at)';

        $query = AdmissionApplication::query()
            ->when($institutionId, fn($q) => $q->where('admission_applications.institution_id', $institutionId))
            ->when($selectedSession, fn($q) => $q->where('admission_applications.session_id', $selectedSession->id))
            ->where(function ($q) use ($rawDateSql, $startDate, $endDate) {
                $q->whereBetween(DB::raw($rawDateSql), [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
                  ->orWhereNull('admission_applications.submitted_at');
            });

        // Summary Stats
        $stats = (clone $query)->select(
            DB::raw('COUNT(admission_applications.id) as total_received'),
            DB::raw("COUNT(CASE WHEN admission_applications.payment_status IN ('paid', 'success') THEN 1 END) as total_paid"),
            DB::raw("COUNT(CASE WHEN admission_applications.process_status IN ('approved', 'admitted', 'enrolled') THEN 1 END) as total_enrolled"),
            DB::raw("SUM(CASE WHEN admission_applications.payment_status IN ('paid', 'success') THEN admission_applications.amount ELSE 0 END) as total_collected")
        )->first();

        // Stream distribution
        $streamDistQuery = DB::table('streams as s')
            ->join('lms_classes as c', 's.id', '=', 'c.stream_id')
            ->join('admission_applications as a', 'c.id', '=', 'a.class_id')
            ->when($institutionId, fn($q) => $q->where('a.institution_id', $institutionId))
            ->when($selectedSession, fn($q) => $q->where('a.session_id', $selectedSession->id))
            ->where(function ($q) use ($startDate, $endDate) {
                $subDateExpr = DB::raw('COALESCE(a.submitted_at, a.payment_date, a.admission_date, a.created_at)');
                $q->whereBetween($subDateExpr, [$startDate . ' 00:00:00', $endDate . ' 23:59:59'])
                  ->orWhereNull('a.submitted_at');
            })
            ->select('s.name', DB::raw('COUNT(a.id) as total'));

        // Detailed transaction items
        $isExport = !empty($filters['is_export']) || request()->routeIs('*export*') || request('is_export') || ($filters['per_page'] ?? null) >= 10000;
        $perPage = $filters['per_page'] ?? 15;

        if ($isExport) {
            $records = (clone $query)
                ->select('admission_applications.*')
                ->orderByDesc(DB::raw($rawDateSql))
                ->get();

            $items = $records->map(function ($app, $index) {
                $dispDate = $app->submitted_at ?: ($app->payment_date ?: ($app->admission_date ?: $app->created_at));
                return [
                    'sl_no' => $index + 1,
                    'application_id' => $app->application_id ?: 'N/A',
                    'applicant_name' => $app->applicant_name ?: 'N/A',
                    'email' => $app->email ?: 'N/A',
                    'mobile' => $app->mobile ?: 'N/A',
                    'payment_status' => ucfirst($app->payment_status ?: 'unpaid'),
                    'process_status' => ucfirst($app->process_status ?: 'pending'),
                    'amount' => '₹' . number_format($app->amount, 2),
                    'date' => $dispDate ? \Carbon\Carbon::parse($dispDate)->toDateString() : 'N/A',
                ];
            })->toArray();
            $paginationData = null;
        } else {
            $paginator = (clone $query)
                ->select('admission_applications.*')
                ->orderByDesc(DB::raw($rawDateSql))
                ->paginate($perPage);

            $items = collect($paginator->items())->map(function ($app, $index) use ($paginator) {
                $dispDate = $app->submitted_at ?: ($app->payment_date ?: ($app->admission_date ?: $app->created_at));
                return [
                    'sl_no' => (($paginator->currentPage() - 1) * $paginator->perPage()) + $index + 1,
                    'application_id' => $app->application_id ?: 'N/A',
                    'applicant_name' => $app->applicant_name ?: 'N/A',
                    'email' => $app->email ?: 'N/A',
                    'mobile' => $app->mobile ?: 'N/A',
                    'payment_status' => ucfirst($app->payment_status ?: 'unpaid'),
                    'process_status' => ucfirst($app->process_status ?: 'pending'),
                    'amount' => '₹' . number_format($app->amount, 2),
                    'date' => $dispDate ? \Carbon\Carbon::parse($dispDate)->toDateString() : 'N/A',
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
                'received' => (int) ($stats->total_received ?? 0),
                'paid' => (int) ($stats->total_paid ?? 0),
                'enrolled' => (int) ($stats->total_enrolled ?? 0),
                'revenue' => (float) ($stats->total_collected ?? 0),
                'conversion_rate' => ($stats && $stats->total_received > 0)
                    ? round(($stats->total_enrolled / $stats->total_received) * 100, 2)
                    : 0,
            ],
            'funnel' => [
                'Applied' => (int) ($stats->total_received ?? 0),
                'Paid' => (int) ($stats->total_paid ?? 0),
                'Enrolled' => (int) ($stats->total_enrolled ?? 0),
            ],
            'daily_trend' => (clone $query)
                ->select(DB::raw("DATE({$rawDateSql}) as date"), DB::raw('COUNT(*) as total'))
                ->whereNotNull(DB::raw($rawDateSql))
                ->groupBy('date')
                ->orderBy('date')
                ->get(),
            'stream_distribution' => $streamDistQuery
                ->groupBy('s.id', 's.name')
                ->get(),
            'items' => $items,
            'pagination' => $paginationData,
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
