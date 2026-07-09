<?php

namespace App\Services;

use App\Enums\FeeCategory;
use App\Models\AdmissionApplication;
use App\Models\FeePayment;
use App\Models\FeeStructureRule;
use App\Models\LmsClass;
use App\Models\LmsClassEnrollment;
use App\Models\Session;
use App\Models\Setting;
use App\Models\StudentFeePeriodBalance;
use App\Models\User;
use App\Services\AcademicCalendarService;
use Carbon\Carbon;

/**
 * FeeCollectionService — Ledger Orchestrator
 *
 * Orchestrates the student ledger by combining:
 *   - FeeCalculationEngine (for fee amounts)
 *   - Settings (for frequency, due dates, late fees)
 *   - FeePayment records (for paid amounts)
 *
 * All actual fee math is delegated to FeeCalculationEngine.
 */
class FeeCollectionService
{
    public const SETTING_GROUP = 'fee_collection';

    private FeeCalculationEngine $engine;

    public function __construct(FeeCalculationEngine $engine)
    {
        $this->engine = $engine;
    }

    /**
     * Get fee collection settings for an institution.
     */
    protected static array $settingsCache = [];

    protected static ?array $bulkAdmissionApps = null;
    protected static ?array $bulkPayments = null;
    protected static ?array $bulkTransportAssignments = null;
    protected static ?array $bulkHostelAllocations = null;
    protected static ?array $bulkAdHocCharges = null;

    public function getSettings(int $institutionId): array
    {
        if (isset(self::$settingsCache[$institutionId])) {
            return self::$settingsCache[$institutionId];
        }

        $rows = Setting::withoutGlobalScope('institution_scope')
            ->where('institution_id', $institutionId)
            ->where('setting_group', self::SETTING_GROUP)
            ->pluck('setting_value', 'setting_key');

        $defaults = config('fee_collection', []);
        $settings = [
            'fee_collection_frequency' => $rows->get('fee_collection_frequency', $defaults['frequency'] ?? 'monthly'),
            'fee_due_day_of_month' => (int) ($rows->get('fee_due_day_of_month') ?? $defaults['due_day_of_month'] ?? 5),
            'reminder_days_before_due' => (int) ($rows->get('reminder_days_before_due') ?? $defaults['reminder_days_before_due'] ?? 3),
            'overdue_reminder_after_days' => (int) ($rows->get('overdue_reminder_after_days') ?? $defaults['overdue_reminder_after_days'] ?? 7),
            'late_fee_enabled' => filter_var($rows->get('late_fee_enabled', $defaults['late_fee']['enabled'] ?? false), FILTER_VALIDATE_BOOLEAN),
            'late_fee_after_days' => (int) ($rows->get('late_fee_after_days') ?? $defaults['late_fee']['after_days'] ?? 10),
            'late_fee_type' => $rows->get('late_fee_type', $defaults['late_fee']['type'] ?? 'fixed'),
            'late_fee_value' => (float) ($rows->get('late_fee_value') ?? $defaults['late_fee']['value'] ?? 0),
            'reminder_send_email' => filter_var($rows->get('reminder_send_email', $defaults['notifications']['send_email_reminder'] ?? true), FILTER_VALIDATE_BOOLEAN),
            'receipt_send_email' => filter_var($rows->get('receipt_send_email', $defaults['notifications']['send_email_receipt'] ?? true), FILTER_VALIDATE_BOOLEAN),
        ];

        self::$settingsCache[$institutionId] = $settings;
        return $settings;
    }

    public static function clearCache(): void
    {
        self::$bulkAdmissionApps = null;
        self::$bulkPayments = null;
        self::$bulkTransportAssignments = null;
        self::$bulkHostelAllocations = null;
        self::$bulkAdHocCharges = null;
    }

    /**
     * Get due date for a period key.
     */
    public function getDueDateForPeriod(int $institutionId, string $periodKey, ?string $frequency = null): Carbon
    {
        $settings = $this->getSettings($institutionId);
        $day = $settings['fee_due_day_of_month'];
        $effectiveFrequency = $frequency ?? $settings['fee_collection_frequency'];

        if ($effectiveFrequency === 'quarterly') {
            $month = (int) substr($periodKey, 5, 2);
            $year = (int) substr($periodKey, 0, 4);
            return Carbon::createFromDate($year, $month, min($day, 28))->startOfDay();
        }

        $date = Carbon::createFromFormat('Y-m', $periodKey);
        return Carbon::createFromDate($date->year, $date->month, min($day, $date->copy()->endOfMonth()->day))->startOfDay();
    }

    /**
     * Compute the full fee matrix for a student, incorporating multi-scope inheritance and arrears.
     * This is the "Source of Truth" for all ledger data.
     *
     * All fee calculations are delegated to FeeCalculationEngine.
     */
    public function getStudentLedgerMatrix(User $student, int $institutionId, ?int $sessionId = null): array
    {
        // 1. Initialise bulk caches on the first run of the request context
        if (self::$bulkAdmissionApps === null) {
            self::$bulkAdmissionApps = AdmissionApplication::where('institution_id', $institutionId)
                ->whereIn('process_status', ['approved', 'admitted', 'completed'])
                ->with('admissionHead')
                ->get()
                ->groupBy('user_id')
                ->all();
        }
        if (self::$bulkPayments === null) {
            self::$bulkPayments = FeePayment::whereIn('payment_status', ['paid', 'success'])
                ->get()
                ->groupBy('user_id')
                ->all();
        }
        if (self::$bulkTransportAssignments === null) {
            self::$bulkTransportAssignments = \App\Models\TransportAssignment::where('institution_id', $institutionId)
                ->get()
                ->groupBy('user_id')
                ->all();
        }
        if (self::$bulkHostelAllocations === null) {
            self::$bulkHostelAllocations = \App\Models\HostelAllocation::where('institution_id', $institutionId)
                ->whereIn('status', ['active', 'checked_out'])
                ->get()
                ->groupBy('user_id')
                ->all();
        }
        if (self::$bulkAdHocCharges === null) {
            self::$bulkAdHocCharges = \App\Models\StudentAdHocCharge::where('institution_id', $institutionId)
                ->get()
                ->groupBy('user_id')
                ->all();
        }

        $profile = $student->studentProfile;
        $session = $profile?->session;
        if ($sessionId) {
            $session = Session::withoutGlobalScope('institution_scope')
                ->where('institution_id', $institutionId)
                ->find($sessionId) ?? $session;
        }

        if (!$profile || !$session) {
            return ['error' => 'Student profile or academic session missing.'];
        }

        $institutionSettings = $this->getSettings($institutionId);
        $class = $this->resolveStudentClass($student, $institutionId, $profile?->stream_id);

        // 2. Determine frequency
        $frequency = $this->resolveFrequencyForStudent($student, $institutionId, $class);
        $periodCount = $frequency === 'quarterly' ? 4 : 12;

        $feeBreakdown = $this->engine->calculateRecurringFee(
            $institutionId,
            $profile->stream_id,
            $class?->id,
            $profile->category ?? null,
            $profile->gender ?? null,
            null,
            $profile->fee_regulation_profile_id,
        );

        $isHistoricalSession = $sessionId && $sessionId != $profile->session_id;
        if ($isHistoricalSession) {
            $feeBreakdown = [
                'net' => 0,
                'gross' => 0,
                'discount' => 0,
                'items' => [],
                'one_time_charges' => [],
            ];
        }

        $grossExpected = $feeBreakdown['gross'];
        $totalDiscount = $feeBreakdown['discount'];
        $periodExpected = $feeBreakdown['net'];
        $allParticulars = $feeBreakdown['items'];
        $oneTimeCharges = $feeBreakdown['one_time_charges'] ?? [];

        // Also pull admission-head-scoped one-time fees for the given session
        $admissionApp = collect(self::$bulkAdmissionApps[$student->id] ?? [])
            ->filter(function($app) use ($session) {
                return $app->session_id == $session->id || ($app->admissionHead && $app->admissionHead->session_id == $session->id);
            })
            ->sortByDesc('submitted_at')
            ->first();

        // Respect custom fee type exclusions from student's individual admission/readmission fee breakdown
        if ($admissionApp && is_array($admissionApp->fee_breakdown) && !empty($admissionApp->fee_breakdown) && !empty($allParticulars)) {
            $safeName = function($name) {
                if (is_array($name)) {
                    $name = $name['en'] ?? $name['name'] ?? reset($name) ?? '';
                }
                return strtolower(trim((string) $name));
            };

            $allowedNames = collect($admissionApp->fee_breakdown)
                ->pluck('name')
                ->filter()
                ->map(fn($n) => $safeName($n))
                ->all();

            $allParticulars = collect($allParticulars)->filter(function ($item) use ($allowedNames, $safeName) {
                $name = $safeName($item['name'] ?? '');
                return in_array($name, $allowedNames);
            })->values()->all();

            $oneTimeCharges = collect($oneTimeCharges)->filter(function ($item) use ($allowedNames, $safeName) {
                $name = $safeName($item['name'] ?? '');
                return in_array($name, $allowedNames);
            })->values()->all();

            // Re-calculate the expected net/gross values based on the filtered list of fees
            $grossExpected = collect($allParticulars)->sum('amount');
            $periodExpected = $grossExpected;
        }

        // If the engine returned no recurring fees (e.g. missing profile), fallback to the admission application's recurring items
        // so they correctly appear in the matrix as separate columns (Tuition, Electricity, etc)
        if ($admissionApp && empty($allParticulars) && is_array($admissionApp->fee_breakdown)) {
            $fallbackGross = 0;
            
            foreach ($admissionApp->fee_breakdown as $item) {
                $category = $item['category'] ?? '';
                if ($category === 'recurring') {
                    $amt = (float) ($item['amount'] ?? 0);
                    $allParticulars[] = [
                        'name'     => $item['name'] ?? 'Fee',
                        'amount'   => $amt,
                        'type'     => $item['type'] ?? 'charge',
                        'category' => $category,
                    ];
                    
                    $fallbackGross += $amt;
                }
            }

            if (!empty($allParticulars)) {
                $grossExpected = $fallbackGross;
                $totalDiscount = 0; // Discounts from admission will be handled as one-time
                $periodExpected = $fallbackGross; 
            }
        }

        if ($admissionApp && is_array($admissionApp->fee_breakdown)) {
            $safeName = function($name) {
                if (is_array($name)) {
                    $name = $name['en'] ?? $name['name'] ?? reset($name) ?? '';
                }
                return strtolower(trim((string) $name));
            };

            $appCharges = collect($admissionApp->fee_breakdown)
                ->filter(function ($item) {
                    $cat = $item['category'] ?? '';
                    return in_array($cat, ['one_time', 'refundable', 'inventory']);
                })
                ->map(function ($item) {
                    return [
                        'fee_type_id' => $item['fee_type_id'] ?? null,
                        'name'        => $item['name'] ?? 'Fee',
                        'amount'      => (float) ($item['amount'] ?? 0),
                        'category'    => $item['category'] ?? 'one_time',
                    ];
                })->values()->all();

            $appFeeTypeIds = collect($appCharges)->pluck('fee_type_id')->filter()->all();
            $appNames = collect($appCharges)->pluck('name')->filter()->map(fn($n) => $safeName($n))->all();

            $oneTimeCharges = collect($oneTimeCharges)->filter(function ($item) use ($appFeeTypeIds, $appNames, $safeName) {
                if (isset($item['fee_type_id']) && in_array($item['fee_type_id'], $appFeeTypeIds)) {
                    return false;
                }
                $name = $safeName($item['name'] ?? '');
                if ($name && in_array($name, $appNames)) {
                    return false;
                }
                return true;
            })->values()->all();

            $oneTimeCharges = array_merge($oneTimeCharges, $appCharges);
        }

        // Admission summary
        $admissionSummary = null;
        $admissionFeeDisplay = [
            'admission_fee' => 0.0,
            'transport_fee' => 0.0,
            'hostel_fee'    => 0.0,
            'other_fees'    => 0.0,
        ];
        if ($admissionApp) {
            $admAmount   = (float) ($admissionApp->amount ?? 0);
            $admDiscount = (float) ($admissionApp->discount_amount ?? 0);
            $admCash     = (float) ($admissionApp->cash_amount ?? 0);
            $admOnline   = (float) ($admissionApp->online_amount ?? 0);
            $admPaid     = $admCash + $admOnline;
            // Use the engine's universal formula
            $admDue = (float) ($admissionApp->due_amount ?? $this->engine->calculateDue($admAmount, $admDiscount, $admPaid));

            $admissionSummary = [
                'application_id'   => $admissionApp->application_id,
                'admission_date'   => $admissionApp->admission_date?->toDateString(),
                'total_amount'     => $admAmount,
                'transport_amount' => (float) ($admissionApp->transport_amount ?? 0),
                'hostel_amount'    => (float) ($admissionApp->hostel_amount ?? 0),
                'discount_amount'  => $admDiscount,
                'paid_amount'      => $admPaid,
                'due_amount'       => $admDue,
                'payment_status'   => $admissionApp->payment_status,
                'payment_mode'     => $admissionApp->payment_mode,
            ];

            $admissionFeeDisplay = $this->resolveAdmissionFeeDisplay($admissionApp, $admissionSummary, $periodExpected);
        }

        // 4. Fetch all payments (including admission payments so they show as "paid" in the ledger)
        $payments = collect(self::$bulkPayments[$student->id] ?? [])
            ->sortBy('payment_date');

        // 5. Generate matrix — use the academic calendar start month, not January
        $academicStartMonth = app(AcademicCalendarService::class)->getStartMonth($institutionId);
        $startDate = Carbon::createFromDate($session->start_year, $academicStartMonth, 1)->startOfDay();

        $matrix = [];
        // Admission dues are no longer seeded into accumulatedArrears because admission
        // payments are now included in the payment query and will be matched to their
        // respective month automatically. The admission summary card handles the rest.
        $accumulatedArrears = 0.0;
        $current = $startDate->copy();

        $studentTransports = collect(self::$bulkTransportAssignments[$student->id] ?? []);
        $studentHostels = collect(self::$bulkHostelAllocations[$student->id] ?? []);
        $studentAdHoc = collect(self::$bulkAdHocCharges[$student->id] ?? []);

        for ($i = 0; $i < $periodCount; $i++) {
            $monthKey = $current->format('Y-m');
            $monthName = $frequency === 'quarterly'
                ? 'Q' . (floor(($current->month - 1) / 3) + 1) . ' ' . $current->format('Y')
                : $current->format('M Y');

            $dueDate = $this->getDueDateForPeriod($institutionId, $monthKey, $frequency);

            $monthPayments = $payments->filter(function ($p) use ($monthKey, $i) {
                if ($p->for_month === $monthKey) return true;
                if (!$p->for_month && $p->payment_date) {
                    if ($p->payable_entity_type === 'admission_application' || str_starts_with($p->payment_id ?? '', 'PAY-ADM-')) {
                        return $i === 0;
                    }
                    return $p->payment_date->format('Y-m') === $monthKey;
                }
                return false;
            });

            $actualPayments = $monthPayments->filter(fn($p) => $p->payment_mode !== 'concession');
            $concessionPayments = $monthPayments->filter(fn($p) => $p->payment_mode === 'concession');

            $paidInMonth = (float) $actualPayments->sum('total_amount');
            $monthlyConcession = (float) $concessionPayments->sum('amount');
            $recordedLateFee = (float) $actualPayments->sum('late_fee_applied');

            // Late fee: use recorded value if paid, else calculate for overdue
            $lateFee = $recordedLateFee;
            if ($paidInMonth <= 0 && now()->startOfDay()->gt($dueDate->copy()->addDays($institutionSettings['late_fee_after_days']))) {
                $lateFee = $this->engine->calculateLateFee($institutionSettings, $periodExpected);
            }

            // --- Dynamic Services (Transport & Hostel) for this month ---
            $monthStart = $current->copy()->startOfMonth();
            $monthEnd = $current->copy()->endOfMonth();

            $monthExpected = $periodExpected;
            $monthGross = $grossExpected;
            $monthParticulars = $allParticulars;
            $monthDiscount = $totalDiscount;

            $monthsInPeriod = match($frequency) {
                'annual' => 12,
                'half_yearly' => 6,
                'quarterly' => 3,
                'bi_monthly' => 2,
                default => 1,
            };

            // Check Transport Assignment
            $tAmount = 0.0;
            $transport = $studentTransports->filter(function ($t) use ($monthStart, $monthEnd) {
                return $t->effective_from <= $monthEnd && (is_null($t->effective_until) || $t->effective_until >= $monthEnd);
            })->first();

            if ($transport) {
                // To avoid double charging the first month, we skip if $i === 0 AND admission paid it.
                $skipTransport = ($i === 0 && ($admissionSummary['transport_amount'] ?? 0) > 0);
                if (!$skipTransport) {
                    $monthlyTransport = (float) $transport->monthly_amount > 0 
                        ? (float) $transport->monthly_amount 
                        : (float) ($admissionSummary['transport_amount'] ?? 0);
                    $tAmount = $monthlyTransport * $monthsInPeriod;
                    $monthExpected += $tAmount;
                    $monthGross += $tAmount;
                }
            } 
            
            if ($tAmount <= 0 && $i > 0 && ($admissionSummary['transport_amount'] ?? 0) > 0) {
                // Fallback: only if no assignment record has ever been created for this student
                if ($studentTransports->isEmpty()) {
                    $tAmount = (float) $admissionSummary['transport_amount'] * $monthsInPeriod;
                    $monthExpected += $tAmount;
                    $monthGross += $tAmount;
                }
            }

            // Check Hostel Allocation
            $hAmount = 0.0;
            $hostel = $studentHostels->filter(function ($h) use ($monthStart, $monthEnd) {
                return $h->check_in_date <= $monthEnd && (is_null($h->check_out_date) || $h->check_out_date >= $monthEnd);
            })->first();

            if ($hostel) {
                $skipHostel = ($i === 0 && ($admissionSummary['hostel_amount'] ?? 0) > 0);
                if (!$skipHostel) {
                    $monthlyHostel = (float) $hostel->monthly_amount > 0 
                        ? (float) $hostel->monthly_amount 
                        : (float) ($admissionSummary['hostel_amount'] ?? 0);
                    $hAmount = $monthlyHostel * $monthsInPeriod;
                    $monthExpected += $hAmount;
                    $monthGross += $hAmount;
                }
            }
            
            if ($hAmount <= 0 && $i > 0 && ($admissionSummary['hostel_amount'] ?? 0) > 0) {
                // Fallback: only if no allocation record has ever been created for this student
                if ($studentHostels->isEmpty()) {
                    $hAmount = (float) $admissionSummary['hostel_amount'] * $monthsInPeriod;
                    $monthExpected += $hAmount;
                    $monthGross += $hAmount;
                }
            }

            // Check Ad-Hoc Charges for this period
            $monthKeysInPeriod = [];
            for ($m = 0; $m < $monthsInPeriod; $m++) {
                $monthKeysInPeriod[] = $current->copy()->addMonths($m)->format('Y-m');
            }

            $adHocCharges = $studentAdHoc->filter(function ($charge) use ($monthKeysInPeriod) {
                return in_array($charge->for_month, $monthKeysInPeriod);
            });

            $adHocTotal = 0.0;
            foreach ($adHocCharges as $charge) {
                $monthExpected += (float) $charge->amount;
                $monthGross += (float) $charge->amount;
                $adHocTotal += (float) $charge->amount;
                $monthParticulars[] = [
                    'name' => $charge->name,
                    'amount' => (float) $charge->amount,
                    'type' => 'ad_hoc',
                    'category' => 'other',
                ];
            }
            // ------------------------------------------------------------

            // Admission fee columns only appear on the first row to avoid visual duplication.
            // A separate Admission Fee Summary card already provides the full breakdown.
            // We map the recurring Transport and Hostel amounts to their respective static columns.
            $rowAdmissionFee  = $i === 0 ? $admissionFeeDisplay['admission_fee'] : 0.0;
            $rowTransportFee  = ($i === 0 ? $admissionFeeDisplay['transport_fee'] : 0.0) + $tAmount;
            $rowHostelFee     = ($i === 0 ? $admissionFeeDisplay['hostel_fee']    : 0.0) + $hAmount;
            $rowOtherFees     = ($i === 0 ? $admissionFeeDisplay['other_fees']    : 0.0) + $adHocTotal;

            $totalPayable = $accumulatedArrears + $monthExpected + $lateFee;
            if ($monthlyConcession > 0) {
                // Do not add to monthParticulars to avoid duplicating the column in UI
                $totalPayable -= $monthlyConcession;
                $monthDiscount += $monthlyConcession;
            }
            if ($i === 0) {
                $totalPayable += (
                    $admissionFeeDisplay['admission_fee'] + 
                    $admissionFeeDisplay['transport_fee'] + 
                    $admissionFeeDisplay['hostel_fee'] + 
                    $admissionFeeDisplay['other_fees']
                );
                
                // Add the one-time discounts from admission application fee_breakdown as negative particulars
                $breakdown = $admissionApp && is_array($admissionApp->fee_breakdown) ? $admissionApp->fee_breakdown : [];
                foreach ($breakdown as $item) {
                    if (($item['category'] ?? '') === 'discount') {
                        $amt = (float) ($item['amount'] ?? 0);
                        if ($amt > 0) {
                            $monthParticulars[] = [
                                'name'     => $item['name'] ?? 'Discount',
                                'amount'   => -$amt,
                                'type'     => 'discount',
                                'category' => 'discount',
                            ];
                            $totalPayable -= $amt;
                            $monthDiscount += $amt; // Still accumulate for the total scalar just in case
                        }
                    }
                }
                
                // Add the overall admission concession as a negative particular if it exists
                $admDiscount = (float) ($admissionSummary['discount_amount'] ?? 0);
                if ($admDiscount > 0) {
                    $monthParticulars[] = [
                        'name'     => 'Concession',
                        'amount'   => -$admDiscount,
                        'type'     => 'discount',
                        'category' => 'discount',
                    ];
                    $totalPayable -= $admDiscount;
                    $monthDiscount += $admDiscount;
                }
            }
            
            $balance = $totalPayable - $paidInMonth;
            
            $firstActualPayment = $actualPayments->first();

            $matrix[] = [
                'month_key'            => $monthKey,
                'month_name'           => $monthName,
                'due_date'             => $dueDate->toDateString(),
                'previous_dues'        => $accumulatedArrears,
                'admission_fee'        => $rowAdmissionFee,
                'transport_fee'        => $rowTransportFee,
                'hostel_fee'           => $rowHostelFee,
                'other_fees'           => $rowOtherFees,
                'expected_particulars' => $monthParticulars,
                'monthly_total'        => $monthExpected,
                'gross_amount'         => $monthGross,
                'discount'             => $monthDiscount,
                'late_fee'             => $lateFee,
                'total_payable'        => $totalPayable,
                'paid_amount'          => $paidInMonth,
                'balance'              => $balance,
                'payment_id'           => $actualPayments->pluck('id')->filter()->first(),
                'receipt_no'           => $actualPayments->pluck('receipt_no')->filter()->first(),
                'payment_mode'         => $firstActualPayment?->payment_mode,
                'payment_date'         => $firstActualPayment?->payment_date?->toDateString(),
                'status'               => $balance <= 0 ? 'paid' : ($paidInMonth > 0 ? 'partial' : 'unpaid'),
            ];

            // Carry forward balance as arrears for next row (negative means overpayment credit)
            $accumulatedArrears = $balance;
            $current = $frequency === 'quarterly' ? $current->addMonths(3) : $current->addMonth();
        }

        return [
            'class'               => $class,
            'frequency'           => $frequency,
            'institutionSettings' => $institutionSettings,
            'periodExpected'      => $periodExpected,
            'grossExpected'       => $grossExpected,
            'totalDiscount'       => $totalDiscount,
            'matrix'              => $matrix,
            'total_pending'       => $accumulatedArrears,
            'admission_summary'   => $admissionSummary,
            'one_time_charges'    => $oneTimeCharges,
        ];
    }

    // --- Legacy compatibility methods ---

    public function getExpectedAmountForStudent(User $student): float
    {
        $enrollment = LmsClassEnrollment::where('user_id', $student->id)->where('role', 'student')->where('status', 'active')->with('lmsClass')->first();
        if (!$enrollment) return 0.0;

        $institutionId = $enrollment->lmsClass?->institution_id ?? 0;
        if (!$institutionId) return 0.0;

        $res = $this->getStudentLedgerMatrix($student, $institutionId);
        return $res['periodExpected'] ?? 0.0;
    }

    public function getPeriodDuesForStudent(User $student, string $periodKey, float $expectedAmount = 0.0, ?array $matrixResult = null): array
    {
        $empty = ['expected' => 0.0, 'paid' => 0.0, 'balance' => 0.0, 'previous_dues' => 0.0, 'total_payable' => 0.0, 'late_fee' => 0.0, 'discount' => 0.0, 'monthly_total' => 0.0];

        if ($matrixResult === null) {
            $enrollment = LmsClassEnrollment::where('user_id', $student->id)->where('role', 'student')->where('status', 'active')->with('lmsClass')->first();
            if (! $enrollment) {
                return $empty;
            }
            $institutionId = $enrollment->lmsClass?->institution_id ?? 0;
            $matrixResult = $this->getStudentLedgerMatrix($student, $institutionId);
        }

        if (isset($matrixResult['matrix'])) {
            $row = collect($matrixResult['matrix'])->firstWhere('month_key', $periodKey);
            if ($row) {
                return [
                    'expected' => $row['monthly_total'],
                    'paid' => $row['paid_amount'],
                    'balance' => $row['balance'],
                    'previous_dues' => $row['previous_dues'],
                    'total_payable' => $row['total_payable'],
                    'late_fee' => $row['late_fee'],
                    'discount' => $row['discount'],
                    'monthly_total' => $row['monthly_total'],
                ];
            }
        }

        return $empty;
    }

    protected static array $resolvedClassCache = [];

    public function resolveStudentClass(User $student, int $institutionId, ?int $streamId = null): ?LmsClass
    {
        if (isset(self::$resolvedClassCache[$student->id])) {
            return self::$resolvedClassCache[$student->id];
        }

        $enrollment = LmsClassEnrollment::where('user_id', $student->id)
            ->where('role', 'student')
            ->where('status', 'active')
            ->with('lmsClass')
            ->first();
        $class = $enrollment?->lmsClass;

        if (!$class && $streamId) {
            $class = LmsClass::where('stream_id', $streamId)
                ->where('institution_id', $institutionId)
                ->first();
        }

        self::$resolvedClassCache[$student->id] = $class;
        return $class;
    }

    public function resolveFrequencyForStudent(User $student, int $institutionId, ?LmsClass $class = null): string
    {
        $settings = $this->getSettings($institutionId);
        $class = $class ?? $this->resolveStudentClass($student, $institutionId, $student->studentProfile?->stream_id);

        $profile = $student->studentProfile?->feeRegulationProfile;

        return $profile?->fee_collection_frequency
            ?? $class?->fee_collection_frequency
            ?? $settings['fee_collection_frequency']
            ?? 'monthly';
    }

    /**
     * @return list<string>
     */
    public function getPeriodKeysInRangeForFrequency(string $from, string $to, string $frequency): array
    {
        $start = Carbon::createFromFormat('Y-m', $from)->startOfMonth();
        $end = Carbon::createFromFormat('Y-m', $to)->startOfMonth();
        $keys = [];
        $current = $start->copy();

        while ($current->lte($end)) {
            $keys[] = $current->format('Y-m');
            $frequency === 'quarterly' ? $current->addMonths(3) : $current->addMonth();
        }

        return array_values(array_unique($keys));
    }

    /**
     * @return list<string>
     */
    public function getPeriodKeysInRangeForStudent(User $student, int $institutionId, string $from, string $to): array
    {
        $frequency = $this->resolveFrequencyForStudent($student, $institutionId);

        return $this->getPeriodKeysInRangeForFrequency($from, $to, $frequency);
    }

    /**
     * @return list<int>
     */
    public function getInstitutionIdsWithFeeCollection(): array
    {
        return Setting::withoutGlobalScope('institution_scope')
            ->where('setting_group', self::SETTING_GROUP)
            ->whereNotNull('institution_id')
            ->distinct()
            ->pluck('institution_id')
            ->map(fn ($id) => (int) $id)
            ->values()
            ->all();
    }

    /**
     * @return list<array{period_key: string, due_date: string}>
     */
    public function getPeriodsDueForReminder(int $institutionId): array
    {
        $settings = $this->getSettings($institutionId);
        $frequency = $settings['fee_collection_frequency'] ?? 'monthly';
        $today = now()->startOfDay();
        $windowEnd = $today->copy()->addDays((int) ($settings['reminder_days_before_due'] ?? 3));
        $from = $today->copy()->subMonths($frequency === 'quarterly' ? 3 : 1)->format('Y-m');
        $to = $windowEnd->format('Y-m');
        $keys = $this->getPeriodKeysInRangeForFrequency($from, $to, $frequency);

        $periods = [];
        foreach ($keys as $periodKey) {
            $dueDate = $this->getDueDateForPeriod($institutionId, $periodKey, $frequency);
            if ($dueDate->gte($today) && $dueDate->lte($windowEnd)) {
                $periods[] = [
                    'period_key' => $periodKey,
                    'due_date' => $dueDate->toDateString(),
                ];
            }
        }

        return $periods;
    }

    /**
     * @return list<array{period_key: string, due_date: string}>
     */
    public function getPeriodsOverdueForReminder(int $institutionId): array
    {
        $settings = $this->getSettings($institutionId);
        $frequency = $settings['fee_collection_frequency'] ?? 'monthly';
        $today = now()->startOfDay();
        $cutoff = $today->copy()->subDays((int) ($settings['overdue_reminder_after_days'] ?? 7));
        $from = $today->copy()->subMonths($frequency === 'quarterly' ? 15 : 15)->format('Y-m');
        $to = $today->format('Y-m');
        $keys = $this->getPeriodKeysInRangeForFrequency($from, $to, $frequency);

        $periods = [];
        foreach ($keys as $periodKey) {
            $dueDate = $this->getDueDateForPeriod($institutionId, $periodKey, $frequency);
            if ($dueDate->lt($cutoff)) {
                $periods[] = [
                    'period_key' => $periodKey,
                    'due_date' => $dueDate->toDateString(),
                ];
            }
        }

        return $periods;
    }

    public function calculateLateFeeForPeriod(int $institutionId, string $periodKey, float $baseAmount, ?array $settings = null, ?string $frequency = null): float
    {
        $settings = $settings ?? $this->getSettings($institutionId);
        $dueDate = $this->getDueDateForPeriod($institutionId, $periodKey, $frequency);
        $lateFeeDue = $dueDate->copy()->addDays((int) ($settings['late_fee_after_days'] ?? 10));
        if (now()->startOfDay()->gt($lateFeeDue)) {
            return $this->engine->calculateLateFee($settings, $baseAmount);
        }

        return 0.0;
    }

    /**
     * @return list<array<string,mixed>>
     */
    public function getProjectedPeriodBalances(User $student, int $institutionId, ?int $sessionId = null, ?string $fromPeriod = null, ?string $toPeriod = null): array
    {
        $query = StudentFeePeriodBalance::query()
            ->where('institution_id', $institutionId)
            ->where('user_id', $student->id);

        if ($sessionId) {
            $query->where('session_id', $sessionId);
        }
        if ($fromPeriod) {
            $query->where('period_key', '>=', $fromPeriod);
        }
        if ($toPeriod) {
            $query->where('period_key', '<=', $toPeriod);
        }

        $paymentsByPeriod = $this->getPeriodPaymentMetadataForStudent($student);

        return $query->orderBy('period_key')->get()->map(function (StudentFeePeriodBalance $row) use ($paymentsByPeriod) {
            $paymentMeta = $paymentsByPeriod[$row->period_key] ?? [];

            return [
                'month_key' => $row->period_key,
                'month_name' => $row->period_key,
                'due_date' => null,
                'previous_dues' => (float) $row->opening_balance,
                'expected_particulars' => [],
                'monthly_total' => (float) $row->period_fee,
                'gross_amount' => (float) $row->period_fee + (float) $row->discount,
                'discount' => (float) $row->discount,
                'late_fee' => (float) $row->late_fee,
                'total_payable' => (float) $row->total_payable,
                'paid_amount' => (float) $row->paid_amount,
                'balance' => (float) $row->closing_balance,
                'payment_id' => $paymentMeta['payment_id'] ?? null,
                'receipt_no' => $paymentMeta['receipt_no'] ?? null,
                'payment_mode' => $paymentMeta['payment_mode'] ?? null,
                'payment_date' => $paymentMeta['payment_date'] ?? null,
                'status' => (float) $row->closing_balance <= 0 ? 'paid' : ((float) $row->paid_amount > 0 ? 'partial' : 'unpaid'),
            ];
        })->all();
    }

    /**
     * Merge projected balance rows into computed ledger rows while preserving payment metadata.
     *
     * @param  list<array<string,mixed>>  $computedMatrix
     * @param  list<array<string,mixed>>  $projectedRows
     * @return list<array<string,mixed>>
     */
    public function mergeLedgerMatrixWithProjected(array $computedMatrix, array $projectedRows): array
    {
        if ($projectedRows === []) {
            return $computedMatrix;
        }

        $projectedByKey = collect($projectedRows)->keyBy('month_key');
        $computedKeys = collect($computedMatrix)->pluck('month_key')->filter()->all();

        $merged = collect($computedMatrix)->map(function (array $row) use ($projectedByKey) {
            $key = $row['month_key'] ?? null;
            if (!$key || !$projectedByKey->has($key)) {
                return $row;
            }

            $projected = $projectedByKey->get($key);

            return array_merge($row, [
                'previous_dues' => $projected['previous_dues'],
                'monthly_total' => $projected['monthly_total'],
                'gross_amount' => $projected['gross_amount'],
                'discount' => $projected['discount'],
                'late_fee' => $projected['late_fee'],
                'total_payable' => $projected['total_payable'],
                'paid_amount' => $projected['paid_amount'],
                'balance' => $projected['balance'],
                'status' => $projected['status'],
                'payment_id' => $row['payment_id'] ?? $projected['payment_id'] ?? null,
                'receipt_no' => $row['receipt_no'] ?? $projected['receipt_no'] ?? null,
                'payment_mode' => $row['payment_mode'] ?? $projected['payment_mode'] ?? null,
                'payment_date' => $row['payment_date'] ?? $projected['payment_date'] ?? null,
                'due_date' => $row['due_date'] ?? $projected['due_date'] ?? null,
                'month_name' => $row['month_name'] ?? $projected['month_name'] ?? null,
                'expected_particulars' => $row['expected_particulars'] ?? $projected['expected_particulars'] ?? [],
            ]);
        })->values()->all();

        foreach ($projectedRows as $projected) {
            $key = $projected['month_key'] ?? null;
            if ($key && !in_array($key, $computedKeys, true)) {
                $merged[] = $projected;
            }
        }

        return $merged;
    }

    /**
     * @return array<string, array{payment_id: int|null, receipt_no: string|null, payment_mode: string|null, payment_date: string|null}>
     */
    private function getPeriodPaymentMetadataForStudent(User $student): array
    {
        $payments = FeePayment::query()
            ->where('user_id', $student->id)
            ->whereIn('payment_status', ['paid', 'success'])
            ->orderBy('payment_date', 'asc')
            ->get();

        $metadata = [];

        foreach ($payments as $payment) {
            $periodKey = $payment->for_month;
            if (!$periodKey && $payment->payment_date) {
                $periodKey = $payment->payment_date->format('Y-m');
            }
            if (!$periodKey || isset($metadata[$periodKey])) {
                continue;
            }

            $metadata[$periodKey] = [
                'payment_id' => $payment->id,
                'receipt_no' => $payment->receipt_no,
                'payment_mode' => $payment->payment_mode,
                'payment_date' => $payment->payment_date?->toDateString(),
            ];
        }

        return $metadata;
    }

    /**
     * Normalized shape for fee reminder notifications (mail / push / templates).
     *
     * @param  array<string, float>  $periodDues  Output of getPeriodDuesForStudent
     * @return array<string, float>
     */
    public function ledgerBreakdownForReminder(array $periodDues): array
    {
        return [
            'previous_dues' => (float) ($periodDues['previous_dues'] ?? 0),
            'total_payable' => (float) ($periodDues['total_payable'] ?? 0),
            'late_fee' => (float) ($periodDues['late_fee'] ?? 0),
            'period_fee' => (float) ($periodDues['monthly_total'] ?? $periodDues['expected'] ?? 0),
            'paid_in_period' => (float) ($periodDues['paid'] ?? 0),
            'discount' => (float) ($periodDues['discount'] ?? 0),
        ];
    }

    /**
     * Informational admission-fee columns repeated on each matrix row.
     *
     * @return array{admission_fee: float, transport_fee: float, hostel_fee: float, other_fees: float, discount: float}
     */
    private function resolveAdmissionFeeDisplay(AdmissionApplication $admissionApp, array $admissionSummary, float $periodExpected = 0.0): array
    {
        $transportFee = (float) ($admissionSummary['transport_amount'] ?? 0);
        $hostelFee = (float) ($admissionSummary['hostel_amount'] ?? 0);
        $admissionFee = 0.0;
        $otherFees = 0.0;
        $discount = 0.0;

        $breakdown = is_array($admissionApp->fee_breakdown) ? $admissionApp->fee_breakdown : [];
        if (! empty($breakdown)) {
            foreach ($breakdown as $item) {
                $amount = (float) ($item['amount'] ?? 0);
                $type = (string) ($item['type'] ?? '');
                $category = (string) ($item['category'] ?? '');

                if ($category === 'discount') {
                    $discount += $amount;
                } elseif ($type === 'inventory' || $category === 'inventory') {
                    $otherFees += $amount;
                } elseif ($category === 'admission' || $category === 'mandatory' || $category === 'one_time' || $type === 'charge') {
                    if ($category === 'recurring') {
                        // If the engine did not generate recurring fees ($periodExpected <= 0),
                        // we must include the ones charged during admission in other_fees to ensure Total Dues matches Paid.
                        if ($periodExpected <= 0) {
                            $otherFees += $amount;
                        }
                    } else {
                        $admissionFee += $amount;
                    }
                } else {
                    $otherFees += $amount;
                }
            }
        } else {
            $amount = (float) ($admissionSummary['total_amount'] ?? 0);
            $admissionFee = max(0, $amount - $transportFee - $hostelFee);
        }

        return [
            'admission_fee' => $admissionFee,
            'transport_fee' => $transportFee,
            'hostel_fee'    => $hostelFee,
            'other_fees'    => $otherFees,
            'discount'      => $discount,
        ];
    }
}
