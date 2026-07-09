<?php

namespace App\Http\Controllers\Api\V1\Analytics;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\AdmissionApplication;
use App\Models\CertificateApplication;
use App\Models\FeePayment;
use App\Models\User;
use App\Support\InstitutionContext;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardAnalyticsController extends BaseController
{

    /**
     * @OA\Get(
     * path="/dashboard-stats",
     * summary="Get comprehensive dashboard analytics",
     * description="Returns aggregated statistics for widgets and charts, including fee collection from all modules and admission type breakdown.",
     * tags={"Admin: Dashboard Analytics"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(
     * name="start_date",
     * in="query",
     * description="Filter data from this date (YYYY-MM-DD). Default is start of current year.",
     * required=false,
     * @OA\Schema(type="string", format="date", example="2026-01-01")
     * ),
     * @OA\Parameter(
     * name="end_date",
     * in="query",
     * description="Filter data up to this date (YYYY-MM-DD). Default is today.",
     * required=false,
     * @OA\Schema(type="string", format="date", example="2026-12-31")
     * ),
     * @OA\Response(
     * response=200,
     * description="Successful analytics retrieval",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=true),
     * @OA\Property(
     * property="data",
     * type="object",
     * @OA\Property(
     * property="widgets",
     * type="object",
     * @OA\Property(property="total_students", type="integer", example=2450),
     * @OA\Property(
     * property="admission_stats",
     * type="object",
     * @OA\Property(property="total", type="integer", example=342),
     * @OA\Property(property="new_admission", type="integer", example=200),
     * @OA\Property(property="re_admission", type="integer", example=142)
     * ),
     * @OA\Property(property="total_fee_collection", type="number", format="float", example=2450000.50),
     * @OA\Property(property="pending_tasks", type="integer", example=18)
     * ),
     * @OA\Property(
     * property="admission_breakdown_chart",
     * type="array",
     * @OA\Items(
     * @OA\Property(property="month", type="string", example="Jan"),
     * @OA\Property(property="new_admissions", type="integer", example=45),
     * @OA\Property(property="re_admissions", type="integer", example=20),
     * @OA\Property(property="month_num", type="integer", example=1)
     * )
     * ),
     * @OA\Property(
     * property="fee_by_category",
     * type="object",
     * @OA\Property(property="admission_fees", type="number", example=1500000),
     * @OA\Property(property="certificate_fees", type="number", example=50000),
     * @OA\Property(property="general_fees", type="number", example=900000)
     * ),
     * @OA\Property(
     * property="fee_trend_chart",
     * type="array",
     * @OA\Items(
     * @OA\Property(property="month", type="string", example="Feb"),
     * @OA\Property(property="total", type="number", example=450000),
     * @OA\Property(property="month_num", type="integer", example=2)
     * )
     * ),
     * @OA\Property(
     * property="date_range",
     * type="object",
     * @OA\Property(property="from", type="string", example="2026-01-01"),
     * @OA\Property(property="to", type="string", example="2026-02-12")
     * )
     * )
     * )
     * ),
     * @OA\Response(response=401, description="Unauthenticated"),
     * @OA\Response(response=500, description="Internal Server Error")
     * )
     */
    public function index(Request $request): JsonResponse
    {
        // Date filters (Default: Current Year)
        $startDate = $request->input('start_date', now()->startOfYear()->toDateString());
        $endDate = $request->input('end_date', now()->toDateString());

        $totalStudents = User::whereHas('roles', function ($q) {
            $q->where('key', 'student');
        })->count();
        // 1. TOP WIDGETS (With Breakdown)
        $stats = [
            'total_students' => $totalStudents,
            'admission_stats' => [
                'total' => AdmissionApplication::whereBetween('created_at', [$startDate, $endDate])->count(),
                'new_admission' => AdmissionApplication::where('application_type', 'new')->whereBetween('created_at', [$startDate, $endDate])->count(),
                're_admission' => AdmissionApplication::where('application_type', 're-admission')->whereBetween('created_at', [$startDate, $endDate])->count(),
            ],
            'total_fee_collection' => $this->calculateTotalRevenue($startDate, $endDate),
            'pending_tasks' => $this->calculatePendingTasks(),
        ];

        // 2. ADMISSION TYPE BREAKDOWN (Monthly Comparison Chart)
        $admissionBreakdownChart = AdmissionApplication::select(
            DB::raw("to_char(created_at, 'Mon') as month"),
            DB::raw("SUM(CASE WHEN application_type = 'new' THEN 1 ELSE 0 END) as new_admissions"),
            DB::raw("SUM(CASE WHEN application_type = 'readmission' THEN 1 ELSE 0 END) as re_admissions"),
            DB::raw("extract(month from created_at) as month_num")
        )
            ->whereBetween('created_at', [$startDate, $endDate])
            ->groupBy('month', 'month_num')
            ->orderBy('month_num')
            ->get();

        // 3. FEE COLLECTION BY CATEGORY (For specific breakdown)
        $feeByCategory = [
            'admission_fees' => AdmissionApplication::whereIn('payment_status', ['paid', 'success'])->whereBetween('updated_at', [$startDate, $endDate])->sum('amount'),
            'certificate_fees' => CertificateApplication::whereIn('payment_status', ['paid', 'success'])->whereBetween('submitted_at', [$startDate, $endDate])->sum('amount'),
            'general_fees' => FeePayment::whereIn('payment_status', ['success', 'paid'])->whereBetween('payment_date', [$startDate, $endDate])->sum('total_amount'),
        ];

        return $this->success([
            'widgets' => $stats,
            'admission_breakdown_chart' => $admissionBreakdownChart,
            'fee_by_category' => $feeByCategory,
            'fee_trend_chart' => $this->getAggregatedFeeTrends($startDate, $endDate),
            'recent_activity' => $this->getRecentActivity(),
            'date_range' => ['from' => $startDate, 'to' => $endDate]
        ]);
    }

    private function calculateTotalRevenue($start, $end)
    {
        $admissionRev = AdmissionApplication::whereIn('payment_status', ['paid', 'success'])->whereBetween('updated_at', [$start, $end])->sum('amount');
        $certRev = CertificateApplication::whereIn('payment_status', ['paid', 'success'])->whereBetween('submitted_at', [$start, $end])->sum('amount');
        $generalRev = FeePayment::whereIn('payment_status', ['success', 'paid'])->whereBetween('payment_date', [$start, $end])->sum('total_amount');

        return $admissionRev + $certRev + $generalRev;
    }

    private function calculatePendingTasks()
    {
        return AdmissionApplication::where('process_status', 'pending')->count() +
            CertificateApplication::where('process_status', 'pending')->count();
    }

    private function getAggregatedFeeTrends($start, $end)
    {
        $institutionId = InstitutionContext::getActiveInstitutionId();
        $instFilter = $institutionId ? " AND institution_id = {$institutionId}" : '';

        return DB::table(DB::raw("(
            SELECT amount, created_at FROM admission_applications WHERE payment_status IN ('paid', 'success'){$instFilter}
            UNION ALL
            SELECT amount, submitted_at as created_at FROM certificate_applications WHERE payment_status IN ('paid', 'success'){$instFilter}
            UNION ALL
            SELECT total_amount as amount, payment_date as created_at FROM fee_payments WHERE payment_status IN ('success', 'paid'){$instFilter}
        ) as combined_fees"))
            ->select(
                DB::raw("to_char(created_at, 'Mon') as month"),
                DB::raw('SUM(amount) as total'),
                DB::raw("extract(month from created_at) as month_num")
            )
            ->whereBetween('created_at', [$start, $end])
            ->groupBy('month', 'month_num')
            ->orderBy('month_num')
            ->get();
    }

    private function getRecentActivity()
    {
        $admissions = AdmissionApplication::select('applicant_name as user', 'created_at')
            ->selectRaw("'Admission' as type")
            ->latest()->take(5)->get();
            
        $fees = FeePayment::with('student:id,name')->select('user_id', 'created_at')
            ->selectRaw("'Fee Payment' as type")
            ->latest()->take(5)->get()->map(function($fee) {
                return [
                    'user' => $fee->student ? $fee->student->name : 'Unknown',
                    'created_at' => $fee->created_at,
                    'type' => $fee->type,
                ];
            });

        $activities = collect($admissions)->concat($fees)
            ->sortByDesc(function($item) {
                return \Carbon\Carbon::parse($item['created_at'] ?? $item->created_at);
            })
            ->take(5)
            ->values()
            ->map(function($activity) {
                $type = $activity['type'] ?? $activity->type;
                return [
                    'type' => $type,
                    'user' => $activity['user'] ?? ($activity->user ?? 'Unknown'),
                    'time' => \Carbon\Carbon::parse($activity['created_at'] ?? $activity->created_at)->diffForHumans(),
                    'icon' => $type === 'Admission' ? 'GraduationCap' : 'IndianRupee',
                    'color' => $type === 'Admission' ? 'text-indigo-500' : 'text-emerald-500',
                ];
            });
            
        return $activities;
    }
}
