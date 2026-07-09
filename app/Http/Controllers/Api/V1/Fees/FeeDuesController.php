<?php

namespace App\Http\Controllers\Api\V1\Fees;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\LmsClassEnrollment;
use App\Models\User;
use App\Notifications\FeeDueReminderNotification;
use App\Notifications\FeeOverdueReminderNotification;
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
        private FeeRecipientResolver $recipientResolver
    ) {
    }

    /**
     * GET list of dues for a period (optional class filter).
     * Query: period (Y-m), lms_class_id (optional), status (optional).
     */
    public function index(Request $request): JsonResponse
    {
        $institutionId = self::getActiveInstitutionId($request->user());
        if (!$institutionId) {
            return $this->error('Institution context required.', 422);
        }

        $request->validate([
            'period' => 'nullable|string|regex:/^\d{4}-\d{2}$/',
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

        $periods = [];
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
            $periods[] = $request->input('period', now()->format('Y-m'));
        }

        $today = now()->startOfDay();

        $query = LmsClassEnrollment::query()
            ->where('role', 'student')
            ->where('status', 'active')
            ->whereHas('lmsClass', fn($q) => $q->where('institution_id', $institutionId));

        if ($classId) {
            $query->where('lms_class_id', $classId);
        }

        if ($sessionId) {
            $query->whereHas('user.studentProfile', function ($q) use ($sessionId) {
                $q->where('session_id', $sessionId);
            });
        }

        $searchBy = $request->input('search_by', 'name');

        if ($search) {
            $query->whereHas('user', fn($q) => $q
                ->where($searchBy, 'LIKE', "%{$search}%")
            );
        }

        $enrollments = $query->with(['user', 'lmsClass'])->get();

        $list = [];
        foreach ($enrollments as $enrollment) {
            $student = $enrollment->user;
            if (!$student) {
                continue;
            }
            $matrixResult = $this->feeCollectionService->getStudentLedgerMatrix($student, $institutionId);
            if (isset($matrixResult['error'])) {
                continue;
            }
            $expected = (float) ($matrixResult['periodExpected'] ?? 0);
            $frequency = $matrixResult['frequency'] ?? null;

            foreach ($periods as $periodKey) {
                $dueDate = $this->feeCollectionService->getDueDateForPeriod($institutionId, $periodKey, $frequency);

                if ($startDateStr && $endDateStr) {
                    if ($dueDate->lt(Carbon::parse($startDateStr)->startOfDay()) || $dueDate->gt(Carbon::parse($endDateStr)->endOfDay())) {
                        continue;
                    }
                }

                $periodDues = $this->feeCollectionService->getPeriodDuesForStudent($student, $periodKey, $expected, $matrixResult);
                $balance = $periodDues['balance'];
                $paid = $periodDues['paid'];

                if ($balance <= 0 && $paid > 0) {
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

                if ($statusFilter && $status !== $statusFilter) {
                    continue;
                }

                $list[] = [
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
            }
        }

        $page = (int) ($request->input('page', 1));
        $perPage = (int) ($request->input('per_page', 10));
        $filteredList = app(ApiResponseMapService::class)->filterCollection($list, 'fee_dues_index');
        $pagedList = array_slice($filteredList, max(0, ($page - 1) * $perPage), $perPage);

        // Stats calculation
        $totalExpected = 0;
        $totalPaid = 0;
        $totalBalance = 0;
        foreach ($filteredList as $item) {
            $totalExpected += (float) $item['expected_amount'];
            $totalPaid += (float) $item['paid_amount'];
            $totalBalance += (float) $item['balance'];
        }

        $defaultPeriod = count($periods) > 0 ? $periods[0] : now()->format('Y-m');

        return $this->success([
            'period' => $startDateStr && $endDateStr ? "{$startDateStr} to {$endDateStr}" : $defaultPeriod,
            'due_date' => $this->feeCollectionService->getDueDateForPeriod($institutionId, $defaultPeriod)->toDateString(),
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
            ->whereHas('lmsClass', fn($q) => $q->where('institution_id', $institutionId));

        if ($classId) {
            $query->where('lms_class_id', $classId);
        }

        $enrollments = $query->with(['user', 'lmsClass'])->get();

        $overdueList = [];
        foreach ($enrollments as $enrollment) {
            $student = $enrollment->user;
            $matrixResult = $this->feeCollectionService->getStudentLedgerMatrix($student, $institutionId);
            if (isset($matrixResult['error'])) {
                continue;
            }
            $expected = (float) ($matrixResult['periodExpected'] ?? 0);
            $frequency = $matrixResult['frequency'] ?? null;
            $periodKeys = $this->feeCollectionService->getPeriodKeysInRangeForStudent($student, $institutionId, $from, $to);
            foreach ($periodKeys as $periodKey) {
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
            'period' => 'required|string|regex:/^\d{4}-\d{2}$/',
            'type' => 'required|string|in:due_soon,overdue',
            'student_ids' => 'nullable|array',
            'student_ids.*' => 'integer|exists:users,id',
        ]);

        $periodKey = $validated['period'];
        $type = $validated['type'];
        $studentIds = $validated['student_ids'] ?? null;

        $settings = $this->feeCollectionService->getSettings($institutionId);

        $query = LmsClassEnrollment::query()
            ->where('role', 'student')
            ->where('status', 'active')
            ->whereHas('lmsClass', fn($q) => $q->where('institution_id', $institutionId));

        if ($studentIds !== null && count($studentIds) > 0) {
            $query->whereIn('user_id', $studentIds);
        }

        $enrollments = $query->with('user')->get();
        $sent = 0;

        foreach ($enrollments as $enrollment) {
            $student = $enrollment->user;
            $matrixResult = $this->feeCollectionService->getStudentLedgerMatrix($student, $institutionId);
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
