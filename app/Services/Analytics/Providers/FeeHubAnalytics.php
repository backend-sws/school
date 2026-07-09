<?php

namespace App\Services\Analytics\Providers;

use App\Contracts\AnalyticsContract;
use App\Models\AdmissionApplication;
use App\Models\CertificateApplication;
use App\Models\FeePayment;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class FeeHubAnalytics implements AnalyticsContract
{
    public function getAnalytics(array $filters): array
    {
        $startDate = $filters['start_date'] ?? now()->startOfYear()->toDateString();
        $endDate = $filters['end_date'] ?? now()->toDateString();
        $classId = $filters['lms_class_id'] ?? null;

        // Normalize YYYY-MM to YYYY-MM-DD
        if (strlen($startDate) === 7) {
            $startDate .= '-01';
        }
        if (strlen($endDate) === 7) {
            $endDate = Carbon::parse($endDate . '-01')->endOfMonth()->toDateString();
        }

        return [
            'widgets' => $this->getWidgets($startDate, $endDate, $classId),
            'collection_trend' => $this->getCollectionTrend($startDate, $endDate, $classId),
            'breakdown' => $this->getBreakdown($startDate, $endDate, $classId),
        ];
    }

    private function getWidgets($start, $end, $classId = null)
    {
        $admissionRev = AdmissionApplication::where('payment_status', 'success')
            ->whereBetween('payment_date', [$start, $end])
            ->when($classId, function ($q) use ($classId) {
                $q->whereHas('admissionHead.mainStream', function ($h) use ($classId) {
                    $lmsClass = \App\Models\LmsClass::find($classId);
                    if ($lmsClass) {
                        $h->where('stream_id', $lmsClass->stream_id)
                            ->where('session_id', $lmsClass->session_id);
                    }
                });
            })
            ->sum('amount');

        $certRev = CertificateApplication::where('payment_status', 'success')
            ->whereBetween('submitted_at', [$start, $end])
            ->when($classId, function ($q) use ($classId) {
                $q->whereHas('user.academicInfo', fn($ai) => $ai->where('lms_class_id', $classId));
            })
            ->sum('amount');

        $generalRev = FeePayment::where('payment_status', 'success')
            ->whereBetween('payment_date', [$start, $end])
            ->when($classId, function ($q) use ($classId) {
                $q->whereHas('student.academicInfo', fn($ai) => $ai->where('lms_class_id', $classId));
            })
            ->sum('total_amount');

        return [
            [
                'title' => 'Total Collection',
                'value' => number_format($admissionRev + $certRev + $generalRev, 2),
                'description' => 'Total fees collected in period',
                'trend' => '+12%',
            ],
            [
                'title' => 'Admission Fees',
                'value' => number_format($admissionRev, 2),
                'description' => 'Fees from new/re-admissions',
            ],
            [
                'title' => 'Service Fees',
                'value' => number_format($certRev, 2),
                'description' => 'Fees from certificates/etc',
            ],
            [
                'title' => 'General Fees',
                'value' => number_format($generalRev, 2),
                'description' => 'Recurring tuition/other fees',
            ],
        ];
    }

    private function getCollectionTrend($start, $end, $classId = null)
    {
        $admissionQuery = AdmissionApplication::select(DB::raw('amount, payment_date as date'))
            ->where('payment_status', 'success')
            ->when($classId, function ($q) use ($classId) {
                $q->whereHas('admissionHead', function ($h) use ($classId) {
                    $lmsClass = \App\Models\LmsClass::find($classId);
                    if ($lmsClass) {
                        $h->where('stream_id', $lmsClass->stream_id)
                            ->where('session_id', $lmsClass->session_id);
                    }
                });
            });

        $certQuery = CertificateApplication::select(DB::raw('amount, submitted_at as date'))
            ->where('payment_status', 'success')
            ->when($classId, function ($q) use ($classId) {
                $q->whereHas('user.academicInfo', fn($ai) => $ai->where('lms_class_id', $classId));
            });

        $generalQuery = FeePayment::select(DB::raw('total_amount as amount, payment_date as date'))
            ->where('payment_status', 'success')
            ->when($classId, function ($q) use ($classId) {
                $q->whereHas('student.academicInfo', fn($ai) => $ai->where('lms_class_id', $classId));
            });

        $monthExpr = DB::connection()->getDriverName() === 'pgsql' ? "to_char(date, 'Mon')" : "DATE_FORMAT(date, '%b')";

        return DB::table(DB::raw("({$admissionQuery->toSql()} UNION ALL {$certQuery->toSql()} UNION ALL {$generalQuery->toSql()}) as combined_fees"))
            ->mergeBindings($admissionQuery->getQuery())
            ->mergeBindings($certQuery->getQuery())
            ->mergeBindings($generalQuery->getQuery())
            ->select(
                DB::raw("{$monthExpr} as month"),
                DB::raw('SUM(amount) as total'),
                DB::raw("extract(month from date) as month_num")
            )
            ->whereBetween('date', [$start, $end])
            ->groupBy('month', 'month_num')
            ->orderBy('month_num')
            ->get()
            ->map(function ($item) {
                return [
                    'month' => $item->month,
                    'total' => (float) $item->total,
                ];
            });
    }

    private function getBreakdown($start, $end, $classId = null)
    {
        $admission = AdmissionApplication::where('payment_status', 'success')
            ->whereBetween('payment_date', [$start, $end])
            ->when($classId, function ($q) use ($classId) {
                $q->whereHas('admissionHead', function ($h) use ($classId) {
                    $lmsClass = \App\Models\LmsClass::find($classId);
                    if ($lmsClass) {
                        $h->where('stream_id', $lmsClass->stream_id)
                            ->where('session_id', $lmsClass->session_id);
                    }
                });
            })
            ->sum('amount');

        $certs = CertificateApplication::where('payment_status', 'success')
            ->whereBetween('submitted_at', [$start, $end])
            ->when($classId, function ($q) use ($classId) {
                $q->whereHas('user.academicInfo', fn($ai) => $ai->where('lms_class_id', $classId));
            })
            ->sum('amount');

        $general = FeePayment::where('payment_status', 'success')
            ->whereBetween('payment_date', [$start, $end])
            ->when($classId, function ($q) use ($classId) {
                $q->whereHas('student.academicInfo', fn($ai) => $ai->where('lms_class_id', $classId));
            })
            ->sum('total_amount');

        return [
            ['name' => 'Admission', 'value' => (float) $admission],
            ['name' => 'Certificates', 'value' => (float) $certs],
            ['name' => 'General', 'value' => (float) $general],
        ];
    }
}
