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
use App\Models\Session;
use App\Models\StaffProfile;
use App\Models\StudentProfile;
use App\Models\Stream;
use App\Models\User;
use App\Support\InstitutionContext;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardAnalyticsController extends BaseController
{
    /**
     * @OA\Get(
     * path="/dashboard-stats",
     * summary="Get comprehensive dashboard analytics",
     * description="Returns aggregated statistics for widgets and charts, including fee collection, transport, hostel, and admission type breakdown by academic session.",
     * tags={"Admin: Dashboard Analytics"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(
     * name="academic_session_id",
     * in="query",
     * description="Academic session ID or 'all'. Default is the current active session.",
     * required=false,
     * @OA\Schema(type="string", example="2")
     * ),
     * @OA\Parameter(
     * name="start_date",
     * in="query",
     * description="Filter data from this date (YYYY-MM-DD).",
     * required=false,
     * @OA\Schema(type="string", format="date", example="2026-04-01")
     * ),
     * @OA\Parameter(
     * name="end_date",
     * in="query",
     * description="Filter data up to this date (YYYY-MM-DD).",
     * required=false,
     * @OA\Schema(type="string", format="date", example="2027-03-31")
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
        $institutionId = InstitutionContext::getActiveInstitutionId();

        // ─── 1. Academic Sessions Resolution ──────────────────────────────────
        $allSessions = Session::when($institutionId, fn($q) => $q->where('institution_id', $institutionId))
            ->orderByDesc('start_year')
            ->get(['id', 'name', 'start_year', 'end_year', 'is_current', 'status']);

        $reqSessionId = $request->input('academic_session_id');
        $isAllSessions = ($reqSessionId === 'all');

        $selectedSession = null;
        if (!$isAllSessions) {
            if ($reqSessionId && is_numeric($reqSessionId)) {
                $selectedSession = $allSessions->firstWhere('id', (int) $reqSessionId);
            }
            if (!$selectedSession) {
                $selectedSession = $allSessions->firstWhere('is_current', true) ?? $allSessions->first();
            }
        }

        $sessionId = $selectedSession?->id;

        // Default date range based on session
        if ($selectedSession) {
            $defaultStartDate = "{$selectedSession->start_year}-04-01";
            $defaultEndDate = $selectedSession->is_current
                ? now()->toDateString()
                : "{$selectedSession->end_year}-03-31";
        } else {
            $defaultStartDate = '2024-01-01';
            $defaultEndDate = now()->toDateString();
        }

        $startDate = $request->input('start_date', $defaultStartDate);
        $endDate = $request->input('end_date', $defaultEndDate);
        $startDateTime = Carbon::parse($startDate)->startOfDay();
        $endDateTime = Carbon::parse($endDate)->endOfDay();
        $startMonth = Carbon::parse($startDate)->format('Y-m');
        $endMonth = Carbon::parse($endDate)->format('Y-m');

        // ─── 2. Students & Classes Count (Session-aware) ──────────────────────
        $totalStudents = StudentProfile::when($institutionId, fn($q) => $q->where('institution_id', $institutionId))
            ->when($sessionId, fn($q) => $q->where('session_id', $sessionId))
            ->count();

        // Fallback if no profiles have session_id
        if ($totalStudents === 0 && !$sessionId) {
            $totalStudents = User::when($institutionId, fn($q) => $q->where('institution_id', $institutionId))
                ->whereHas('roles', fn($q) => $q->where('key', 'student'))
                ->count();
        }

        $totalClasses = LmsClass::when($institutionId, fn($q) => $q->where('institution_id', $institutionId))
            ->when($sessionId, fn($q) => $q->where('session_id', $sessionId))
            ->where('status', 1)
            ->count();

        $totalStaff = StaffProfile::when($institutionId, fn($q) => $q->where('institution_id', $institutionId))->count();

        // ─── 3. Admissions Analytics ──────────────────────────────────────────
        $admissionsQuery = AdmissionApplication::when($institutionId, fn($q) => $q->where('institution_id', $institutionId))
            ->when($sessionId, fn($q) => $q->where('session_id', $sessionId))
            ->where(function ($q) use ($startDateTime, $endDateTime) {
                $q->whereBetween(DB::raw('COALESCE(submitted_at, payment_date, admission_date, created_at)'), [$startDateTime, $endDateTime])
                  ->orWhereNull('submitted_at');
            });

        $admissionTotal = (clone $admissionsQuery)->count();
        $admissionNew = (clone $admissionsQuery)->where('application_type', 'new')->count();
        $admissionRe = (clone $admissionsQuery)->where('application_type', 're-admission')->count();
        $admissionPaid = (float) (clone $admissionsQuery)->whereIn('payment_status', ['paid', 'success'])->sum('amount');
        $admissionDues = (float) (clone $admissionsQuery)->sum('due_amount');
        $admissionTransportRev = (float) (clone $admissionsQuery)->whereIn('payment_status', ['paid', 'success'])->sum('transport_amount');
        $admissionHostelRev = (float) (clone $admissionsQuery)->whereIn('payment_status', ['paid', 'success'])->sum('hostel_amount');

        // ─── 4. Fee Payments & Breakdown (No Double Counting) ─────────────────
        $feePaymentsQuery = FeePayment::when($institutionId, fn($q) => $q->where('institution_id', $institutionId))
            ->whereIn('payment_status', ['paid', 'success'])
            ->where(function ($q) use ($startMonth, $endMonth, $sessionId, $startDateTime, $endDateTime) {
                // By period (for_month)
                $q->whereBetween('for_month', [$startMonth, $endMonth])
                  // Or admission payment linked to this session
                  ->orWhere(function ($sub) use ($sessionId) {
                      $sub->where('payable_entity_type', 'admission_application')
                          ->whereIn('payable_entity_id', function ($admq) use ($sessionId) {
                              $admq->select('id')->from('admission_applications')->when($sessionId, fn($sq) => $sq->where('session_id', $sessionId));
                          });
                  })
                  // Or for_month is null and payment date in range
                  ->orWhere(function ($sub) use ($startDateTime, $endDateTime) {
                      $sub->whereNull('for_month')
                          ->whereNull('payable_entity_type')
                          ->where(function ($dt) use ($startDateTime, $endDateTime) {
                              $dt->whereBetween('payment_date', [$startDateTime, $endDateTime])
                                 ->orWhereBetween('created_at', [$startDateTime, $endDateTime]);
                          });
                  });
            });

        // Exclude admission desk payments from general fee to prevent double counting
        $generalNonAdmFeeRevenue = (float) (clone $feePaymentsQuery)
            ->where(function ($q) {
                $q->whereNull('payable_entity_type')->orWhere('payable_entity_type', '!=', 'admission_application');
            })
            ->sum('total_amount');

        // Certificates revenue
        $certificateRevenue = (float) CertificateApplication::when($institutionId, fn($q) => $q->where('institution_id', $institutionId))
            ->whereIn('payment_status', ['paid', 'success'])
            ->whereBetween('submitted_at', [$startDateTime, $endDateTime])
            ->sum('amount');

        // Extract transport & hostel monthly components from fee payments ledger_snapshots
        $feeRows = (clone $feePaymentsQuery)
            ->where(function ($q) {
                $q->whereNull('payable_entity_type')->orWhere('payable_entity_type', '!=', 'admission_application');
            })
            ->whereNotNull('ledger_snapshot')
            ->get(['ledger_snapshot', 'total_amount']);

        $monthlyTransportCollected = 0.0;
        $monthlyHostelCollected = 0.0;

        foreach ($feeRows as $row) {
            $snap = is_array($row->ledger_snapshot) ? $row->ledger_snapshot : json_decode($row->ledger_snapshot ?? '', true);
            if (isset($snap['fees']) && is_array($snap['fees'])) {
                foreach ($snap['fees'] as $f) {
                    $name = strtolower($f['name'] ?? '');
                    $amt = (float) ($f['amount'] ?? 0);
                    if (str_contains($name, 'transport')) {
                        $monthlyTransportCollected += $amt;
                    } elseif (str_contains($name, 'hostel')) {
                        $monthlyHostelCollected += $amt;
                    }
                }
            }
        }

        // Consolidated Module Collections
        $totalTransportRevenue = round($admissionTransportRev + $monthlyTransportCollected, 2);
        $totalHostelRevenue = round($admissionHostelRev + $monthlyHostelCollected, 2);
        $totalAdmissionRevenue = round($admissionPaid, 2);
        $totalCertificateRevenue = round($certificateRevenue, 2);
        $pureTuitionRevenue = max(0, round($generalNonAdmFeeRevenue - $monthlyTransportCollected - $monthlyHostelCollected, 2));

        // Total Net Revenue Collected
        $totalFeeCollection = round($generalNonAdmFeeRevenue + $admissionPaid + $certificateRevenue, 2);

        // ─── 5. Pending Fees & Collection Rate ────────────────────────────────
        $pendingBalances = (float) DB::table('student_fee_period_balances')
            ->when($institutionId, fn($q) => $q->where('institution_id', $institutionId))
            ->when($sessionId, fn($q) => $q->where('session_id', $sessionId))
            ->where('closing_balance', '>', 0)
            ->sum('closing_balance');

        $pendingFee = round($pendingBalances + $admissionDues, 2);
        $totalReceivable = $totalFeeCollection + $pendingFee;
        $feeCollectionRate = $totalReceivable > 0 ? round(($totalFeeCollection / $totalReceivable) * 100, 1) : 0;

        // ─── 6. Attendance Rate ───────────────────────────────────────────────
        $attendanceFrom = now()->subDays(30)->startOfDay();
        $totalAttendance = AttendanceRecord::when($institutionId, fn($q) => $q->where('institution_id', $institutionId))
            ->whereBetween('date', [$attendanceFrom->toDateString(), $endDateTime->toDateString()])->count();
        $presentAttendance = AttendanceRecord::when($institutionId, fn($q) => $q->where('institution_id', $institutionId))
            ->whereBetween('date', [$attendanceFrom->toDateString(), $endDateTime->toDateString()])
            ->where('status', 'present')->count();
        $attendanceRate = $totalAttendance > 0 ? round(($presentAttendance / $totalAttendance) * 100, 1) : 0;

        // ─── 7. Expenses & Net Profit ─────────────────────────────────────────
        $totalExpenses = (float) Expense::when($institutionId, fn($q) => $q->where('institution_id', $institutionId))
            ->where('status', 'approved')
            ->whereBetween('date', [$startDateTime->toDateString(), $endDateTime->toDateString()])
            ->sum('amount');
        $netRevenue = round($totalFeeCollection - $totalExpenses, 2);

        // ─── 8. Transport Analytics ───────────────────────────────────────────
        $activeTransportSubs = DB::table('transport_assignments')
            ->when($institutionId, fn($q) => $q->where('institution_id', $institutionId))
            ->where(function ($q) {
                $q->whereNull('effective_until')->orWhere('effective_until', '>=', now()->toDateString());
            })
            ->count();

        $monthlyTransportRunRate = (float) DB::table('transport_assignments')
            ->when($institutionId, fn($q) => $q->where('institution_id', $institutionId))
            ->where(function ($q) {
                $q->whereNull('effective_until')->orWhere('effective_until', '>=', now()->toDateString());
            })
            ->sum('monthly_amount');

        $totalTransportRoutes = DB::table('transport_routes')
            ->when($institutionId, fn($q) => $q->where('institution_id', $institutionId))
            ->count();

        $totalTransportVehicles = DB::table('transport_vehicles')
            ->when($institutionId, fn($q) => $q->where('institution_id', $institutionId))
            ->count();

        $topRoutes = DB::table('transport_routes')
            ->when($institutionId, fn($q) => $q->where('transport_routes.institution_id', $institutionId))
            ->leftJoin('transport_assignments', 'transport_routes.id', '=', 'transport_assignments.transport_route_id')
            ->select(
                'transport_routes.id',
                'transport_routes.name',
                DB::raw('count(transport_assignments.id) as assigned_students'),
                DB::raw('coalesce(sum(transport_assignments.monthly_amount), 0) as monthly_revenue')
            )
            ->groupBy('transport_routes.id', 'transport_routes.name')
            ->orderByDesc('assigned_students')
            ->limit(6)
            ->get()
            ->map(fn($r) => [
                'id' => $r->id,
                'name' => $r->name,
                'assigned_students' => (int) $r->assigned_students,
                'monthly_revenue' => round((float) $r->monthly_revenue, 2),
            ]);

        $transportAnalytics = [
            'total_revenue' => $totalTransportRevenue,
            'active_subscriptions' => $activeTransportSubs,
            'monthly_run_rate' => round($monthlyTransportRunRate, 2),
            'total_routes' => $totalTransportRoutes,
            'total_vehicles' => $totalTransportVehicles,
            'top_routes' => $topRoutes,
        ];

        // ─── 9. Hostel Analytics ──────────────────────────────────────────────
        $totalHostels = DB::table('hostels')
            ->when($institutionId, fn($q) => $q->where('institution_id', $institutionId))
            ->count();

        $totalHostelRooms = DB::table('hostel_rooms')
            ->when($institutionId, fn($q) => $q->where('institution_id', $institutionId))
            ->count();

        $totalBeds = DB::table('hostel_beds')
            ->when($institutionId, fn($q) => $q->whereExists(function ($sub) use ($institutionId) {
                $sub->select(DB::raw(1))->from('hostel_rooms')
                    ->whereColumn('hostel_rooms.id', 'hostel_beds.hostel_room_id')
                    ->where('hostel_rooms.institution_id', $institutionId);
            }))
            ->count();

        $occupiedBeds = DB::table('hostel_beds')
            ->when($institutionId, fn($q) => $q->whereExists(function ($sub) use ($institutionId) {
                $sub->select(DB::raw(1))->from('hostel_rooms')
                    ->whereColumn('hostel_rooms.id', 'hostel_beds.hostel_room_id')
                    ->where('hostel_rooms.institution_id', $institutionId);
            }))
            ->where('status', 'occupied')
            ->count();

        $vacantBeds = max(0, $totalBeds - $occupiedBeds);
        $hostelOccupancyRate = $totalBeds > 0 ? round(($occupiedBeds / $totalBeds) * 100, 1) : 0;

        $activeHostelResidents = DB::table('hostel_allocations')
            ->when($institutionId, fn($q) => $q->where('institution_id', $institutionId))
            ->where('status', 'active')
            ->count();

        $monthlyHostelRunRate = (float) DB::table('hostel_allocations')
            ->when($institutionId, fn($q) => $q->where('institution_id', $institutionId))
            ->where('status', 'active')
            ->sum('monthly_amount');

        $hostelAnalytics = [
            'total_revenue' => $totalHostelRevenue,
            'total_beds' => $totalBeds,
            'occupied_beds' => $occupiedBeds,
            'vacant_beds' => $vacantBeds,
            'occupancy_rate' => $hostelOccupancyRate,
            'active_residents' => $activeHostelResidents,
            'monthly_run_rate' => round($monthlyHostelRunRate, 2),
            'total_hostels' => $totalHostels,
            'total_rooms' => $totalHostelRooms,
        ];

        // ─── 10. Revenue Streams Breakdown (For Visualizer & Donut) ───────────
        $revenueStreams = [
            [
                'key' => 'tuition',
                'name' => 'Tuition & Academic Fees',
                'value' => $pureTuitionRevenue,
                'fill' => 'hsl(221, 83%, 53%)',
                'percentage' => $totalFeeCollection > 0 ? round(($pureTuitionRevenue / $totalFeeCollection) * 100, 1) : 0,
            ],
            [
                'key' => 'admission',
                'name' => 'Admission Fees',
                'value' => round(max(0, $totalAdmissionRevenue - $admissionTransportRev - $admissionHostelRev), 2),
                'fill' => 'hsl(262, 83%, 58%)',
                'percentage' => $totalFeeCollection > 0 ? round((max(0, $totalAdmissionRevenue - $admissionTransportRev - $admissionHostelRev) / $totalFeeCollection) * 100, 1) : 0,
            ],
            [
                'key' => 'transport',
                'name' => 'Transport Fees',
                'value' => $totalTransportRevenue,
                'fill' => 'hsl(38, 92%, 50%)',
                'percentage' => $totalFeeCollection > 0 ? round(($totalTransportRevenue / $totalFeeCollection) * 100, 1) : 0,
            ],
            [
                'key' => 'hostel',
                'name' => 'Hostel Fees',
                'value' => $totalHostelRevenue,
                'fill' => 'hsl(142, 71%, 45%)',
                'percentage' => $totalFeeCollection > 0 ? round(($totalHostelRevenue / $totalFeeCollection) * 100, 1) : 0,
            ],
            [
                'key' => 'certificate',
                'name' => 'Certificates & Others',
                'value' => $totalCertificateRevenue,
                'fill' => 'hsl(199, 89%, 48%)',
                'percentage' => $totalFeeCollection > 0 ? round(($totalCertificateRevenue / $totalFeeCollection) * 100, 1) : 0,
            ],
        ];

        $feeByCategory = collect($revenueStreams)
            ->filter(fn($c) => $c['value'] > 0)
            ->values();

        // ─── 11. Top Widgets Payload ──────────────────────────────────────────
        $widgets = [
            'total_students' => $totalStudents,
            'total_staff' => $totalStaff,
            'total_classes' => $totalClasses,
            'admission_stats' => [
                'total' => $admissionTotal,
                'new_admission' => $admissionNew,
                're_admission' => $admissionRe,
                'paid_revenue' => $totalAdmissionRevenue,
                'due_amount' => $admissionDues,
            ],
            'total_fee_collection' => $totalFeeCollection,
            'tuition_revenue' => $pureTuitionRevenue,
            'transport_revenue' => $totalTransportRevenue,
            'hostel_revenue' => $totalHostelRevenue,
            'pending_fee' => $pendingFee,
            'fee_collection_rate' => $feeCollectionRate,
            'attendance_rate' => $attendanceRate,
            'total_expenses' => round($totalExpenses, 2),
            'net_revenue' => $netRevenue,
            'pending_tasks' => $this->calculatePendingTasks(),
        ];

        // ─── 12. Gender Distribution ──────────────────────────────────────────
        $genderDistribution = StudentProfile::select('gender', DB::raw('count(*) as count'))
            ->when($institutionId, fn($q) => $q->where('institution_id', $institutionId))
            ->when($sessionId, fn($q) => $q->where('session_id', $sessionId))
            ->whereNotNull('gender')
            ->where('gender', '!=', '')
            ->groupBy('gender')
            ->get()
            ->map(function ($item) {
                $label = match (strtolower(trim($item->gender))) {
                    'male', 'm' => 'Male',
                    'female', 'f' => 'Female',
                    default => 'Other',
                };
                return [
                    'name' => $label,
                    'value' => (int) $item->count,
                    'fill' => match ($label) {
                        'Male' => 'hsl(221, 83%, 53%)',
                        'Female' => 'hsl(330, 81%, 60%)',
                        default => 'hsl(45, 93%, 47%)',
                    },
                ];
            })
            ->values();

        // ─── 13. Fee Collection by Mode ───────────────────────────────────────
        $feeByMode = FeePayment::select('payment_mode', DB::raw('SUM(total_amount) as total'))
            ->when($institutionId, fn($q) => $q->where('institution_id', $institutionId))
            ->whereIn('payment_status', ['paid', 'success'])
            ->where(function ($q) use ($startDateTime, $endDateTime, $startMonth, $endMonth) {
                $q->whereBetween('for_month', [$startMonth, $endMonth])
                  ->orWhereBetween('payment_date', [$startDateTime, $endDateTime])
                  ->orWhereBetween('created_at', [$startDateTime, $endDateTime]);
            })
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

        // ─── 14. Students per Class ───────────────────────────────────────────
        $studentsPerClass = LmsClass::when($institutionId, fn($q) => $q->where('institution_id', $institutionId))
            ->when($sessionId, fn($q) => $q->where('session_id', $sessionId))
            ->withCount(['enrollments' => fn($q) => $q->where('status', 'active')])
            ->orderByDesc('enrollments_count')
            ->limit(12)
            ->get()
            ->map(fn($c) => [
                'name' => $c->name,
                'students' => (int) $c->enrollments_count,
            ])
            ->values();

        // ─── 15. Admission by Stream ──────────────────────────────────────────
        $admissionByStream = StudentProfile::select('stream_id', DB::raw('count(*) as count'))
            ->when($institutionId, fn($q) => $q->where('institution_id', $institutionId))
            ->when($sessionId, fn($q) => $q->where('session_id', $sessionId))
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

        $admissionByMainStream = $admissionByStream->groupBy('main_stream')->map(function ($items, $key) {
            return ['name' => $key, 'students' => $items->sum('count')];
        })->values();

        // ─── 16. Monthly Revenue vs Expenses (Session Aware) ─────────────────
        $revenueVsExpenses = $this->getRevenueVsExpensesForSession($selectedSession, $startDate, $endDate, $institutionId);

        // ─── 17. Attendance Trend (Last 7 days) ──────────────────────────────
        $attendanceTrend = $this->getAttendanceTrend();

        // ─── 18. Fee Trend Chart ─────────────────────────────────────────────
        $feeTrendChart = $this->getAggregatedFeeTrends($startDate, $endDate, $sessionId, $institutionId);

        // ─── 19. Recent Activity & Notices ────────────────────────────────────
        $recentActivity = $this->getRecentActivity();
        $recentNotices = Notice::select('id', 'title', 'created_at', 'is_published')
            ->where('is_published', true)
            ->orderByDesc('created_at')
            ->limit(5)
            ->get()
            ->map(fn($n) => [
                'id' => $n->id,
                'title' => $n->title,
                'time' => Carbon::parse($n->created_at)->diffForHumans(),
            ]);

        return $this->success([
            'academic_sessions' => $allSessions,
            'active_session' => $selectedSession ? [
                'id' => $selectedSession->id,
                'name' => $selectedSession->name,
                'start_year' => $selectedSession->start_year,
                'end_year' => $selectedSession->end_year,
                'is_current' => (bool) $selectedSession->is_current,
                'start_date' => "{$selectedSession->start_year}-04-01",
                'end_date' => "{$selectedSession->end_year}-03-31",
            ] : null,
            'widgets' => $widgets,
            'revenue_streams' => $revenueStreams,
            'transport_analytics' => $transportAnalytics,
            'hostel_analytics' => $hostelAnalytics,
            'gender_distribution' => $genderDistribution,
            'fee_by_mode' => $feeByMode,
            'fee_by_category' => $feeByCategory,
            'students_per_class' => $studentsPerClass,
            'admission_by_stream' => $admissionByStream,
            'admission_by_main_stream' => $admissionByMainStream,
            'revenue_vs_expenses' => $revenueVsExpenses,
            'attendance_trend' => $attendanceTrend,
            'fee_trend_chart' => $feeTrendChart,
            'recent_activity' => $recentActivity,
            'recent_notices' => $recentNotices,
            'date_range' => ['from' => $startDate, 'to' => $endDate],
        ]);
    }

    private function calculatePendingTasks(): int
    {
        return AdmissionApplication::where('process_status', 'pending')->count() +
            CertificateApplication::where('process_status', 'pending')->count();
    }

    /**
     * Generate monthly comparison of revenue vs expenses for the selected academic session.
     */
    private function getRevenueVsExpensesForSession($selectedSession, $startDate, $endDate, $institutionId)
    {
        $months = collect();

        if ($selectedSession) {
            $currentMonth = Carbon::parse("{$selectedSession->start_year}-04-01");
            $endMonthDate = Carbon::parse("{$selectedSession->end_year}-03-01");
        } else {
            $currentMonth = Carbon::parse($startDate)->startOfMonth();
            $endMonthDate = Carbon::parse($endDate)->startOfMonth();
        }

        while ($currentMonth->lte($endMonthDate)) {
            $mKey = $currentMonth->format('Y-m');
            $mLabel = $currentMonth->format('M');
            $mStart = $currentMonth->copy()->startOfMonth()->startOfDay();
            $mEnd = $currentMonth->copy()->endOfMonth()->endOfDay();

            // General Fee collection in this month
            $genRev = (float) DB::table('fee_payments')
                ->when($institutionId, fn($q) => $q->where('institution_id', $institutionId))
                ->whereIn('payment_status', ['paid', 'success'])
                ->where(function ($q) use ($mKey) {
                    $q->where('for_month', $mKey);
                })
                ->where(function ($q) {
                    $q->whereNull('payable_entity_type')->orWhere('payable_entity_type', '!=', 'admission_application');
                })
                ->sum('total_amount');

            // Admission revenue in this month
            $admRev = (float) DB::table('admission_applications')
                ->when($institutionId, fn($q) => $q->where('institution_id', $institutionId))
                ->when($selectedSession, fn($q) => $q->where('session_id', $selectedSession->id))
                ->whereIn('payment_status', ['paid', 'success'])
                ->whereBetween(DB::raw('COALESCE(submitted_at, payment_date, admission_date, created_at)'), [$mStart, $mEnd])
                ->sum('amount');

            // Approved Expenses in this month
            $expRev = (float) DB::table('expenses')
                ->when($institutionId, fn($q) => $q->where('institution_id', $institutionId))
                ->where('status', 'approved')
                ->whereBetween('date', [$mStart->toDateString(), $mEnd->toDateString()])
                ->sum('amount');

            $months->push([
                'month' => $mLabel,
                'period' => $mKey,
                'revenue' => round($genRev + $admRev, 2),
                'expenses' => round($expRev, 2),
            ]);

            $currentMonth->addMonth();
        }

        return $months->values();
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

    private function getAggregatedFeeTrends($start, $end, $sessionId = null, $institutionId = null)
    {
        $instFilter = $institutionId ? " AND institution_id = {$institutionId}" : '';
        $sessionFilter = $sessionId ? " AND session_id = {$sessionId}" : '';

        $isPgsql = DB::connection()->getDriverName() === 'pgsql';
        $monthExpr = $isPgsql ? "to_char(created_at, 'Mon')" : "DATE_FORMAT(created_at, '%b')";
        $monthNumExpr = $isPgsql ? "extract(month from created_at)" : "MONTH(created_at)";

        return DB::table(DB::raw("(
            SELECT amount, COALESCE(submitted_at, payment_date, admission_date, created_at) as created_at FROM admission_applications WHERE payment_status IN ('paid', 'success'){$instFilter}{$sessionFilter}
            UNION ALL
            SELECT amount, submitted_at as created_at FROM certificate_applications WHERE payment_status IN ('paid', 'success'){$instFilter}
            UNION ALL
            SELECT total_amount as amount, COALESCE(payment_date, created_at) as created_at FROM fee_payments WHERE payment_status IN ('success', 'paid'){$instFilter} AND (payable_entity_type IS NULL OR payable_entity_type != 'admission_application')
        ) as combined_fees"))
            ->select(
                DB::raw("{$monthExpr} as month"),
                DB::raw('SUM(amount) as total'),
                DB::raw("{$monthNumExpr} as month_num")
            )
            ->whereBetween('created_at', [$start, $end])
            ->groupBy('month', 'month_num')
            ->orderBy('month_num')
            ->get();
    }

    private function getRecentActivity()
    {
        $admissions = AdmissionApplication::select(
            'applicant_name as user',
            'amount',
            DB::raw('COALESCE(submitted_at, payment_date, admission_date, created_at) as created_at')
        )
            ->selectRaw("'Admission' as type")
            ->latest('id')->take(5)->get()->map(fn($item) => [
                'type' => 'Admission',
                'user' => $item->user,
                'amount' => $item->amount,
                'created_at' => $item->created_at,
            ]);

        $fees = FeePayment::with('student:id,name')->select('user_id', 'total_amount as amount', 'created_at')
            ->selectRaw("'Fee Payment' as type")
            ->latest()->take(5)->get()->map(fn($fee) => [
                'type' => 'Fee Payment',
                'user' => $fee->student ? $fee->student->name : 'Unknown Student',
                'amount' => $fee->amount,
                'created_at' => $fee->created_at,
            ]);

        $activities = collect($admissions)->concat($fees)
            ->sortByDesc(fn($item) => Carbon::parse($item['created_at']))
            ->take(6)
            ->values()
            ->map(function ($activity) {
                $type = $activity['type'];
                return [
                    'type' => $type,
                    'user' => $activity['user'],
                    'amount' => (float) ($activity['amount'] ?? 0),
                    'time' => Carbon::parse($activity['created_at'])->diffForHumans(),
                    'icon' => $type === 'Admission' ? 'GraduationCap' : 'IndianRupee',
                    'color' => $type === 'Admission' ? 'text-indigo-500' : 'text-emerald-500',
                ];
            });

        return $activities;
    }
}
