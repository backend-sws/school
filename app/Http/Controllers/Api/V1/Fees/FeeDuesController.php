<?php

namespace App\Http\Controllers\Api\V1\Fees;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\LmsClassEnrollment;
use App\Models\Session;
use App\Models\User;
use App\Notifications\FeeDueReminderNotification;
use App\Notifications\FeeOverdueReminderNotification;
use App\Services\AcademicCalendarService;
use App\Services\ApiResponseMapService;
use App\Services\FeeCollectionService;
use App\Services\FeeRecipientResolver;
use App\Traits\BelongsToDefaultInstitution;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FeeDuesController extends BaseController
{
    use BelongsToDefaultInstitution;

    public function __construct(
        private FeeCollectionService $feeCollectionService,
        private FeeRecipientResolver $recipientResolver,
        private AcademicCalendarService $academicCalendarService
    ) {
    }

    /**
     * Resolve the appropriate academic session for a period (e.g. "2026-09" => 2026-2027).
     */
    private function resolveSessionIdForPeriod(int $institutionId, ?string $periodKey, ?int $explicitSessionId = null): ?int
    {
        if ($explicitSessionId) {
            return $explicitSessionId;
        }

        if (!$periodKey || $periodKey === 'all') {
            return null;
        }

        try {
            $carbon = Carbon::createFromFormat('Y-m', $periodKey)->startOfMonth();
            $startMonth = $this->academicCalendarService->getStartMonth($institutionId);
            $sessionStartYear = $carbon->month < $startMonth ? $carbon->year - 1 : $carbon->year;

            $session = Session::withoutGlobalScope('institution_scope')
                ->where('institution_id', $institutionId)
                ->where('start_year', $sessionStartYear)
                ->first();

            return $session?->id;
        } catch (\Throwable $e) {
            return null;
        }
    }

    /**
     * GET list of dues for a period (optional class filter).
     * Query: period (Y-m or 'all'), lms_class_id (optional), status (optional).
     */
    public function index(Request $request): JsonResponse
    {
        $institutionId = self::getActiveInstitutionId($request->user());
        if (!$institutionId) {
            return $this->error('Institution context required.', 422);
        }

        $request->validate([
            'period' => ['nullable', 'string', 'regex:/^(\d{4}-\d{2}|all)$/'],
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'academic_session_id' => 'nullable|integer|exists:academic_sessions,id',
            'lms_class_id' => 'nullable|integer|exists:lms_classes,id',
            'status' => 'nullable|string|in:upcoming,due_soon,overdue,paid,partial',
            'search' => 'nullable|string|max:100',
            'search_by' => 'nullable|string|in:name,reg_no',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:200',
        ]);

        $startDateStr = $request->input('start_date');
        $endDateStr = $request->input('end_date');
        $sessionId = $request->input('academic_session_id');
        $classId = $request->input('lms_class_id');
        $statusFilter = $request->input('status');
        $search = $request->input('search');

        $periodInput = $request->input('period');
        $isAllPeriods = ($periodInput === 'all' || empty($periodInput));

        $periods = [];
        if (!$isAllPeriods) {
            if ($startDateStr && $endDateStr) {
                $start = Carbon::parse($startDateStr)->startOfDay();
                $end = Carbon::parse($endDateStr)->endOfDay();
                
                $current = $start->copy()->startOfMonth();
                $endMonth = $end->copy()->startOfMonth();
                while ($current->lte($endMonth)) {
                    $periods[] = $current->format('Y-m');
                    $current->addMonth();
                }
            } else {
                $periods[] = $periodInput ?: now()->format('Y-m');
            }
        }

        $today = now()->startOfDay();

        $query = LmsClassEnrollment::query()
            ->where('role', 'student')
            ->where('status', 'active')
            ->whereHas('user')
            ->whereHas('lmsClass', fn($q) => $q->where('institution_id', $institutionId));

        if ($classId) {
            $query->where('lms_class_id', $classId);
        }

        if ($sessionId) {
            $hasDirect = (clone $query)->where(function ($sq) use ($sessionId) {
                $sq->whereHas('user.studentProfile', fn($q) => $q->where('session_id', $sessionId))
                   ->orWhereHas('lmsClass', fn($q) => $q->where('session_id', $sessionId));
            })->exists();

            if ($hasDirect) {
                $query->where(function ($sq) use ($sessionId) {
                    $sq->whereHas('user.studentProfile', fn($q) => $q->where('session_id', $sessionId))
                       ->orWhereHas('lmsClass', fn($q) => $q->where('session_id', $sessionId));
                });
            }
        }

        $searchBy = $request->input('search_by', 'name');

        if ($search) {
            $query->whereHas('user', fn($q) => $q
                ->where($searchBy, 'LIKE', "%{$search}%")
            );
        }

        $enrollments = $query->with(['user', 'lmsClass'])->get();

        $matrixCache = [];
        $getMatrix = function (User $student, ?int $targetSessionId) use (&$matrixCache, $institutionId) {
            $key = $student->id . '_' . ($targetSessionId ?? 'default');
            if (!isset($matrixCache[$key])) {
                $matrixCache[$key] = $this->feeCollectionService->getStudentLedgerMatrix($student, $institutionId, $targetSessionId);
            }
            return $matrixCache[$key];
        };

        $list = [];
        $allDuesList = [];
        foreach ($enrollments as $enrollment) {
            $student = $enrollment->user;
            if (!$student) {
                continue;
            }

            if ($isAllPeriods) {
                $targetSessionId = $sessionId ?: ($student->studentProfile?->session_id);
                $matrixResult = $getMatrix($student, $targetSessionId);
                if (isset($matrixResult['error'])) {
                    continue;
                }

                $totalExpected = (float) ($matrixResult['periodExpected'] ?? 0);
                $balance = (float) ($matrixResult['total_pending'] ?? 0);
                $paid = 0.0;
                if (!empty($matrixResult['matrix'])) {
                    $paid = (float) collect($matrixResult['matrix'])->sum('paid_amount');
                }

                if ($totalExpected <= 0 && $balance <= 0 && $paid <= 0) {
                    continue;
                }

                if ($balance <= 0) {
                    $status = 'paid';
                } elseif ($paid > 0 && $balance > 0) {
                    $status = 'partial';
                } else {
                    $status = 'overdue';
                }

                $dueItem = [
                    'user_id' => $student->id,
                    'student_name' => $student->name,
                    'reg_no' => $student->reg_no,
                    'lms_class_id' => $enrollment->lms_class_id,
                    'class_name' => $enrollment->lmsClass?->name,
                    'period' => 'all',
                    'due_date' => $today->toDateString(),
                    'expected_amount' => $totalExpected,
                    'paid_amount' => $paid,
                    'balance' => $balance,
                    'status' => $status,
                ];

                $allDuesList[] = $dueItem;

                if ($statusFilter && $status !== $statusFilter) {
                    continue;
                }

                $list[] = $dueItem;
            } else {
                foreach ($periods as $periodKey) {
                    $targetSessionId = $this->resolveSessionIdForPeriod($institutionId, $periodKey, $sessionId);
                    $matrixResult = $getMatrix($student, $targetSessionId);
                    if (isset($matrixResult['error'])) {
                        continue;
                    }
                    $expected = (float) ($matrixResult['periodExpected'] ?? 0);
                    $frequency = $matrixResult['frequency'] ?? null;
                    $dueDate = $this->feeCollectionService->getDueDateForPeriod($institutionId, $periodKey, $frequency);

                    if ($startDateStr && $endDateStr) {
                        if ($dueDate->lt(Carbon::parse($startDateStr)->startOfDay()) || $dueDate->gt(Carbon::parse($endDateStr)->endOfDay())) {
                            continue;
                        }
                    }

                    $periodDues = $this->feeCollectionService->getPeriodDuesForStudent($student, $periodKey, $expected, $matrixResult);
                    $balance = $periodDues['balance'];
                    $paid = $periodDues['paid'];

                    if (($periodDues['expected'] ?? 0) <= 0 && $balance <= 0 && $paid <= 0) {
                        continue;
                    }

                    if ($balance <= 0) {
                        $status = 'paid';
                    } elseif ($paid > 0) {
                        $status = 'partial';
                    } elseif ($dueDate->gt($today)) {
                        $daysUntil = $today->diffInDays($dueDate, false);
                        $reminderDays = $this->feeCollectionService->getSettings($institutionId)['reminder_days_before_due'];
                        $status = $daysUntil <= $reminderDays ? 'due_soon' : 'upcoming';
                    } else {
                        $status = 'overdue';
                    }

                    $dueItem = [
                        'user_id' => $student->id,
                        'student_name' => $student->name,
                        'reg_no' => $student->reg_no,
                        'lms_class_id' => $enrollment->lms_class_id,
                        'class_name' => $enrollment->lmsClass?->name,
                        'period' => $periodKey,
                        'due_date' => $dueDate->toDateString(),
                        'expected_amount' => $periodDues['expected'],
                        'paid_amount' => $periodDues['paid'],
                        'balance' => $balance,
                        'status' => $status,
                    ];

                    $allDuesList[] = $dueItem;

                    if ($statusFilter && $status !== $statusFilter) {
                        continue;
                    }

                    $list[] = $dueItem;
                }
            }
        }

        $page = (int) ($request->input('page', 1));
        $perPage = (int) ($request->input('per_page', 10));
        $filteredList = app(ApiResponseMapService::class)->filterCollection($list, 'fee_dues_index');
        $pagedList = array_slice($filteredList, max(0, ($page - 1) * $perPage), $perPage);

        // Stats calculation (based on all dues in current period/class context, not cut off by statusFilter)
        $totalExpected = 0;
        $totalPaid = 0;
        $totalBalance = 0;
        foreach ($allDuesList as $item) {
            $totalExpected += (float) $item['expected_amount'];
            $totalPaid += (float) $item['paid_amount'];
            $totalBalance += (float) $item['balance'];
        }

        $defaultPeriod = $isAllPeriods ? 'all' : (count($periods) > 0 ? $periods[0] : now()->format('Y-m'));
        $dueDateStr = ($defaultPeriod === 'all')
            ? $today->toDateString()
            : $this->feeCollectionService->getDueDateForPeriod($institutionId, $defaultPeriod)->toDateString();

        return $this->success([
            'period' => $startDateStr && $endDateStr ? "{$startDateStr} to {$endDateStr}" : $defaultPeriod,
            'due_date' => $dueDateStr,
            'list' => $pagedList,
            'stats' => [
                'total_expected' => $totalExpected,
                'total_paid' => $totalPaid,
                'total_balance' => $totalBalance,
                'collection_percentage' => $totalExpected > 0 ? round(($totalPaid / $totalExpected) * 100, 2) : 0,
            ],
            'meta' => [
                'current_page' => $page,
                'per_page' => $perPage,
                'total' => count($filteredList),
                'last_page' => (int) ceil(count($filteredList) / max(1, $perPage)),
            ],
        ]);
    }

    /**
     * GET list of overdue students (balance > 0, due date passed).
     */
    public function overdue(Request $request): JsonResponse
    {
        $institutionId = self::getActiveInstitutionId($request->user());
        if (!$institutionId) {
            return $this->error('Institution context required.', 422);
        }

        $request->validate([
            'from' => 'nullable|string|regex:/^\d{4}-\d{2}$/',
            'to' => 'nullable|string|regex:/^\d{4}-\d{2}$/',
            'lms_class_id' => 'nullable|integer|exists:lms_classes,id',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:200',
        ]);

        $from = $request->input('from', now()->startOfYear()->format('Y-m'));
        $to = $request->input('to', now()->format('Y-m'));
        $classId = $request->input('lms_class_id');

        $today = now()->startOfDay();

        $query = LmsClassEnrollment::query()
            ->where('role', 'student')
            ->where('status', 'active')
            ->whereHas('user')
            ->whereHas('lmsClass', fn($q) => $q->where('institution_id', $institutionId));

        if ($classId) {
            $query->where('lms_class_id', $classId);
        }

        $enrollments = $query->with(['user', 'lmsClass'])->get();

        $matrixCache = [];
        $getMatrix = function (User $student, ?int $targetSessionId) use (&$matrixCache, $institutionId) {
            $key = $student->id . '_' . ($targetSessionId ?? 'default');
            if (!isset($matrixCache[$key])) {
                $matrixCache[$key] = $this->feeCollectionService->getStudentLedgerMatrix($student, $institutionId, $targetSessionId);
            }
            return $matrixCache[$key];
        };

        $overdueList = [];
        foreach ($enrollments as $enrollment) {
            $student = $enrollment->user;
            if (!$student) continue;

            $periodKeys = $this->feeCollectionService->getPeriodKeysInRangeForStudent($student, $institutionId, $from, $to);
            foreach ($periodKeys as $periodKey) {
                $targetSessionId = $this->resolveSessionIdForPeriod($institutionId, $periodKey);
                $matrixResult = $getMatrix($student, $targetSessionId);
                if (isset($matrixResult['error'])) {
                    continue;
                }
                $expected = (float) ($matrixResult['periodExpected'] ?? 0);
                $frequency = $matrixResult['frequency'] ?? null;
                $dueDate = $this->feeCollectionService->getDueDateForPeriod($institutionId, $periodKey, $frequency);
                if ($dueDate->gte($today)) {
                    continue;
                }

                $periodDues = $this->feeCollectionService->getPeriodDuesForStudent($student, $periodKey, $expected, $matrixResult);
                if ($periodDues['balance'] <= 0) {
                    continue;
                }

                $overdueList[] = [
                    'user_id' => $student->id,
                    'student_name' => $student->name,
                    'reg_no' => $student->reg_no,
                    'lms_class_id' => $enrollment->lms_class_id,
                    'class_name' => $enrollment->lmsClass?->name,
                    'period' => $periodKey,
                    'due_date' => $dueDate->toDateString(),
                    'expected_amount' => $periodDues['expected'],
                    'paid_amount' => $periodDues['paid'],
                    'balance' => $periodDues['balance'],
                ];
            }
        }

        $page = (int) ($request->input('page', 1));
        $perPage = (int) ($request->input('per_page', 50));
        $filteredList = app(ApiResponseMapService::class)->filterCollection($overdueList, 'fee_dues_overdue_index');
        $pagedList = array_slice($filteredList, max(0, ($page - 1) * $perPage), $perPage);

        return $this->success([
            'list' => $pagedList,
            'meta' => [
                'current_page' => $page,
                'per_page' => $perPage,
                'total' => count($filteredList),
                'last_page' => (int) ceil(count($filteredList) / max(1, $perPage)),
            ],
        ]);
    }

    /**
     * POST send reminder (due_soon or overdue) for a period, optionally to specific students.
     */
    public function sendReminder(Request $request): JsonResponse
    {
        $institutionId = self::getActiveInstitutionId($request->user());
        if (!$institutionId) {
            return $this->error('Institution context required.', 422);
        }

        $validated = $request->validate([
            'period' => ['required', 'string', 'regex:/^(\d{4}-\d{2}|all)$/'],
            'type' => 'required|string|in:due_soon,overdue',
            'student_ids' => 'nullable|array',
            'student_ids.*' => 'integer|exists:users,id',
            'pay_before_date' => 'nullable|date',
        ]);

        $periodKey = $validated['period'];
        $type = $validated['type'];
        $studentIds = $validated['student_ids'] ?? null;

        $targetSessionId = $this->resolveSessionIdForPeriod($institutionId, $periodKey);
        $settings = $this->feeCollectionService->getSettings($institutionId);

        $payBeforeDate = null;
        if (!empty($validated['pay_before_date'])) {
            $payBeforeDate = \Carbon\Carbon::parse($validated['pay_before_date']);
        } else {
            $graceDays = (int) ($settings['overdue_payment_grace_days'] ?? 3);
            $payBeforeDate = now()->addDays($graceDays);
        }

        $query = LmsClassEnrollment::query()
            ->where('role', 'student')
            ->where('status', 'active')
            ->whereHas('user')
            ->whereHas('lmsClass', fn($q) => $q->where('institution_id', $institutionId));

        if ($studentIds !== null && count($studentIds) > 0) {
            $query->whereIn('user_id', $studentIds);
        }

        $enrollments = $query->with('user')->get();
        $sent = 0;

        foreach ($enrollments as $enrollment) {
            $student = $enrollment->user;
            if (!$student) continue;

            $matrixResult = $this->feeCollectionService->getStudentLedgerMatrix($student, $institutionId, $targetSessionId);
            if (isset($matrixResult['error'])) {
                continue;
            }
            $expected = (float) ($matrixResult['periodExpected'] ?? 0);
            $periodDues = $this->feeCollectionService->getPeriodDuesForStudent($student, $periodKey, $expected, $matrixResult);
            $dueDate = $this->feeCollectionService->getDueDateForPeriod($institutionId, $periodKey, $matrixResult['frequency'] ?? null);

            if ($periodDues['balance'] <= 0) {
                continue;
            }

            $recipients = $this->recipientResolver->recipientsForStudent($student);

            $ledger = $this->feeCollectionService->ledgerBreakdownForReminder($periodDues);
            foreach ($recipients as $notifiable) {
                try {
                    if ($type === 'due_soon') {
                        $notifiable->notify(new FeeDueReminderNotification(
                            $student,
                            $periodKey,
                            $dueDate,
                            $periodDues['expected'],
                            $periodDues['balance'],
                            $institutionId,
                            $ledger,
                        ));
                    } else {
                        $notifiable->notify(new FeeOverdueReminderNotification(
                            $student,
                            $periodKey,
                            $dueDate,
                            $periodDues['expected'],
                            $periodDues['balance'],
                            $institutionId,
                            $ledger,
                            $payBeforeDate,
                        ));
                    }
                } catch (\Throwable $e) {
                    \Log::warning('sendReminder: notification failed', [
                        'student_id' => $student->id,
                        'error' => $e->getMessage(),
                    ]);
                    // Continue — don't fail the whole batch for one broken recipient
                }
            }
            $sent++;
        }

        return $this->success(['sent_count' => $sent], 'Reminders sent.');
    }

    private function getPeriodKeysInRange(int $institutionId, string $from, string $to): array
    {
        $settings = $this->feeCollectionService->getSettings($institutionId);
        $frequency = $settings['fee_collection_frequency'] ?? 'monthly';

        return $this->feeCollectionService->getPeriodKeysInRangeForFrequency($from, $to, $frequency);
    }
}
