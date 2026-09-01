<?php

namespace App\Http\Controllers\Api\V1\Analytics;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\AdmissionApplication;
use App\Models\AttendanceRecord;
use App\Models\CertificateApplication;
use App\Models\Expense;
use App\Models\FeePayment;
use App\Models\LmsClass;
use App\Models\LmsClassEnrollment;
use App\Models\MainStream;
use App\Models\Notice;
use App\Models\StaffProfile;
use App\Models\StudentProfile;
use App\Models\Stream;
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
     * description="Successful analytics retrieval"
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

        // ─── Total Staff ─────────────────────────────────────────────────────
        $totalStaff = StaffProfile::where('status', 1)->count();

        // ─── Total Active Classes ────────────────────────────────────────────
        $totalClasses = LmsClass::where('status', 1)->count();

        // ─── Admission Stats ─────────────────────────────────────────────────
        $admissionTotal = AdmissionApplication::whereBetween('created_at', [$startDate, $endDate])->count();
        $admissionNew = AdmissionApplication::where('application_type', 'new')->whereBetween('created_at', [$startDate, $endDate])->count();
        $admissionRe = AdmissionApplication::where('application_type', 're-admission')->whereBetween('created_at', [$startDate, $endDate])->count();

        // ─── Fee Collection Stats ────────────────────────────────────────────
        $totalFeeCollection = $this->calculateTotalRevenue($startDate, $endDate);
        $pendingFee = FeePayment::where('payment_status', 'pending')
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->sum('total_amount');
        
        // Fee paid count & total for rate
        $paidFeeCount = FeePayment::whereIn('payment_status', ['paid', 'success'])->count();
        $totalFeeCount = FeePayment::whereIn('payment_status', ['paid', 'success', 'pending'])->count();
        $feeCollectionRate = $totalFeeCount > 0 ? round(($paidFeeCount / $totalFeeCount) * 100, 1) : 0;

        // ─── Attendance Rate (Last 30 Days) ──────────────────────────────────
        $attendanceFrom = now()->subDays(30)->toDateString();
        $totalAttendance = AttendanceRecord::whereBetween('date', [$attendanceFrom, $endDate])->count();
        $presentAttendance = AttendanceRecord::whereBetween('date', [$attendanceFrom, $endDate])
            ->where('status', 'present')->count();
        $attendanceRate = $totalAttendance > 0 ? round(($presentAttendance / $totalAttendance) * 100, 1) : 0;

        // ─── Expenses ────────────────────────────────────────────────────────
        $totalExpenses = Expense::where('status', 'approved')
            ->whereBetween('date', [$startDate, $endDate])
            ->sum('amount');
        $netRevenue = $totalFeeCollection - $totalExpenses;

        // ─── Pending Tasks ───────────────────────────────────────────────────
        $pendingTasks = $this->calculatePendingTasks();

        // 1. TOP WIDGETS
        $stats = [
            'total_students' => $totalStudents,
            'total_staff' => $totalStaff,
            'total_classes' => $totalClasses,
            'admission_stats' => [
                'total' => $admissionTotal,
                'new_admission' => $admissionNew,
                're_admission' => $admissionRe,
            ],
            'total_fee_collection' => $totalFeeCollection,
            'pending_fee' => $pendingFee,
            'fee_collection_rate' => $feeCollectionRate,
            'attendance_rate' => $attendanceRate,
            'total_expenses' => $totalExpenses,
            'net_revenue' => $netRevenue,
            'pending_tasks' => $pendingTasks,
        ];

        // 2. GENDER DISTRIBUTION
        $genderDistribution = StudentProfile::select('gender', DB::raw('count(*) as count'))
            ->whereNotNull('gender')
            ->where('gender', '!=', '')
            ->groupBy('gender')
            ->get()
            ->map(function ($item) {
                $label = match (strtolower($item->gender)) {
                    'male', 'm' => 'Male',
                    'female', 'f' => 'Female',
                    default => 'Other',
                };
                return ['name' => $label, 'value' => (int) $item->count, 'fill' => match ($label) {
                    'Male' => 'hsl(221, 83%, 53%)',
                    'Female' => 'hsl(330, 81%, 60%)',
                    default => 'hsl(45, 93%, 47%)',
                }];
            })
            ->values();

        // 3. FEE COLLECTION BY MODE
        $feeByMode = FeePayment::select('payment_mode', DB::raw('SUM(total_amount) as total'))
            ->whereIn('payment_status', ['paid', 'success'])
            ->whereBetween('payment_date', [$startDate, $endDate])
            ->whereNotNull('payment_mode')
            ->groupBy('payment_mode')
            ->get()
            ->map(function ($item) {
                $label = ucfirst($item->payment_mode ?? 'Other');
                $colors = [
                    'Cash' => 'hsl(142, 71%, 45%)',
                    'Online' => 'hsl(221, 83%, 53%)',
                    'Cheque' => 'hsl(45, 93%, 47%)',
                    'Upi' => 'hsl(262, 83%, 58%)',
                    'Card' => 'hsl(0, 84%, 60%)',
                ];
                return [
                    'name' => $label,
                    'value' => round((float) $item->total, 2),
                    'fill' => $colors[$label] ?? 'hsl(200, 18%, 46%)',
                ];
            })
            ->values();

        // 4. FEE COLLECTION BY CATEGORY
        $feeByCategory = [
            ['name' => 'Admission Fees', 'value' => round((float) AdmissionApplication::whereIn('payment_status', ['paid', 'success'])->whereBetween('updated_at', [$startDate, $endDate])->sum('amount'), 2), 'fill' => 'hsl(221, 83%, 53%)'],
            ['name' => 'Certificate Fees', 'value' => round((float) CertificateApplication::whereIn('payment_status', ['paid', 'success'])->whereBetween('submitted_at', [$startDate, $endDate])->sum('amount'), 2), 'fill' => 'hsl(142, 71%, 45%)'],
            ['name' => 'General Fees', 'value' => round((float) FeePayment::whereIn('payment_status', ['success', 'paid'])->whereBetween('payment_date', [$startDate, $endDate])->sum('total_amount'), 2), 'fill' => 'hsl(45, 93%, 47%)'],
        ];
        // Filter out zero-value categories
        $feeByCategory = collect($feeByCategory)->filter(fn($c) => $c['value'] > 0)->values();

        // 5. STUDENTS PER CLASS (Top 12)
        $studentsPerClass = LmsClassEnrollment::select('lms_class_id', DB::raw('count(*) as student_count'))
            ->where('status', 'active')
            ->groupBy('lms_class_id')
            ->orderByDesc('student_count')
            ->limit(12)
            ->get()
            ->map(function ($item) {
                $class = LmsClass::withoutGlobalScopes()->find($item->lms_class_id);
                return [
                    'name' => $class ? $class->name : "Class #{$item->lms_class_id}",
                    'students' => (int) $item->student_count,
                ];
            })
            ->values();

        // 6. ADMISSION BY STREAM / MAIN STREAM
        $admissionByStream = StudentProfile::select('stream_id', DB::raw('count(*) as count'))
            ->whereNotNull('stream_id')
            ->groupBy('stream_id')
            ->get()
            ->map(function ($item) {
                $stream = Stream::withoutGlobalScope('institution_scope')->find($item->stream_id);
                $mainStreamName = null;
                if ($stream && $stream->main_stream_id) {
                    $mainStream = MainStream::withoutGlobalScope('institution_scope')->find($stream->main_stream_id);
                    $mainStreamName = $mainStream?->name;
                }
                return [
                    'stream' => $stream?->name ?? 'Unknown',
                    'main_stream' => $mainStreamName ?? 'Other',
                    'count' => (int) $item->count,
                ];
            })
            ->values();

        // Aggregate by main stream for chart
        $admissionByMainStream = $admissionByStream->groupBy('main_stream')->map(function ($items, $key) {
            return ['name' => $key, 'students' => $items->sum('count')];
        })->values();

        // 7. MONTHLY REVENUE VS EXPENSES (Last 6 months)
        $revenueVsExpenses = $this->getRevenueVsExpenses();

        // 8. ATTENDANCE TREND (Last 7 days)
        $attendanceTrend = $this->getAttendanceTrend();

        // 9. RECENT NOTICES (Last 5)
        $recentNotices = Notice::select('id', 'title', 'created_at', 'is_published')
            ->where('is_published', true)
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(function ($notice) {
                return [
                    'id' => $notice->id,
                    'title' => $notice->title,
                    'time' => \Carbon\Carbon::parse($notice->created_at)->diffForHumans(),
                ];
            });

        return $this->success([
            'widgets' => $stats,
            'gender_distribution' => $genderDistribution,
            'fee_by_mode' => $feeByMode,
            'fee_by_category' => $feeByCategory,
            'students_per_class' => $studentsPerClass,
            'admission_by_stream' => $admissionByStream,
            'admission_by_main_stream' => $admissionByMainStream,
            'revenue_vs_expenses' => $revenueVsExpenses,
            'attendance_trend' => $attendanceTrend,
            'fee_trend_chart' => $this->getAggregatedFeeTrends($startDate, $endDate),
            'recent_activity' => $this->getRecentActivity(),
            'recent_notices' => $recentNotices,
            'date_range' => ['from' => $startDate, 'to' => $endDate],
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

    private function getRevenueVsExpenses()
    {
        $months = collect();
        for ($i = 5; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            $monthStart = $date->copy()->startOfMonth()->toDateString();
            $monthEnd = $date->copy()->endOfMonth()->toDateString();
            $monthLabel = $date->format('M');

            // Revenue from all sources
            $admissionRev = (float) AdmissionApplication::whereIn('payment_status', ['paid', 'success'])
                ->whereBetween('updated_at', [$monthStart, $monthEnd])->sum('amount');
            $certRev = (float) CertificateApplication::whereIn('payment_status', ['paid', 'success'])
                ->whereBetween('submitted_at', [$monthStart, $monthEnd])->sum('amount');
            $generalRev = (float) FeePayment::whereIn('payment_status', ['success', 'paid'])
                ->whereBetween('payment_date', [$monthStart, $monthEnd])->sum('total_amount');
            $totalRev = $admissionRev + $certRev + $generalRev;

            // Expenses
            $totalExp = (float) Expense::where('status', 'approved')
                ->whereBetween('date', [$monthStart, $monthEnd])->sum('amount');

            $months->push([
                'month' => $monthLabel,
                'revenue' => round($totalRev, 2),
                'expenses' => round($totalExp, 2),
            ]);
        }
        return $months;
    }

    private function getAttendanceTrend()
    {
        $trend = collect();
        for ($i = 6; $i >= 0; $i--) {
            $date = now()->subDays($i)->toDateString();
            $dayLabel = now()->subDays($i)->format('D');

            $total = AttendanceRecord::whereDate('date', $date)->count();
            $present = AttendanceRecord::whereDate('date', $date)->where('status', 'present')->count();

            $rate = $total > 0 ? round(($present / $total) * 100, 1) : 0;

            $trend->push([
                'day' => $dayLabel,
                'date' => $date,
                'rate' => $rate,
                'present' => $present,
                'total' => $total,
            ]);
        }
        return $trend;
    }

    private function getAggregatedFeeTrends($start, $end)
    {
        $institutionId = InstitutionContext::getActiveInstitutionId();
        $instFilter = $institutionId ? " AND institution_id = {$institutionId}" : '';

        $monthExpr = DB::connection()->getDriverName() === 'pgsql' ? "to_char(created_at, 'Mon')" : "DATE_FORMAT(created_at, '%b')";

        return DB::table(DB::raw("(
            SELECT amount, created_at FROM admission_applications WHERE payment_status IN ('paid', 'success'){$instFilter}
            UNION ALL
            SELECT amount, submitted_at as created_at FROM certificate_applications WHERE payment_status IN ('paid', 'success'){$instFilter}
            UNION ALL
            SELECT total_amount as amount, payment_date as created_at FROM fee_payments WHERE payment_status IN ('success', 'paid'){$instFilter}
        ) as combined_fees"))
            ->select(
                DB::raw("{$monthExpr} as month"),
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
