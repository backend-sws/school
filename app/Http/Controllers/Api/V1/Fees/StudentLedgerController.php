<?php

namespace App\Http\Controllers\Api\V1\Fees;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\FeePayment;
use App\Models\User;
use App\Notifications\FeePaymentReceiptNotification;
use App\Services\ApiResponseMapService;
use App\Services\FeeCollectionService;
use App\Services\FeeRecipientResolver;
use App\Services\Fees\StudentFeePeriodBalanceProjector;
use App\Services\FinancialDocuments\AssembleFeePaymentReceipt;
use App\Services\FinancialDocuments\FinancialPdfRenderer;
use App\Services\FinancialDocuments\LedgerSnapshotFactory;
use App\Traits\BelongsToDefaultInstitution;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StudentLedgerController extends BaseController
{
    use BelongsToDefaultInstitution;

    public function __construct(
        private FeeCollectionService $feeCollectionService,
        private FeeRecipientResolver $recipientResolver,
        private \App\Services\InstitutionBrandingService $brandingService,
        private LedgerSnapshotFactory $ledgerSnapshotFactory,
        private StudentFeePeriodBalanceProjector $periodBalanceProjector,
        private AssembleFeePaymentReceipt $assembleFeePaymentReceipt,
        private FinancialPdfRenderer $financialPdfRenderer,
    ) {
    }

    // ─── GET  /fees/ledger/student/{id} ──────────────────────────────────

    public function getMatrix(Request $request, int $studentId): JsonResponse
    {
        $validated = $request->validate([
            'session_id' => 'nullable|integer|exists:academic_sessions,id',
            'from_period' => 'nullable|string|regex:/^\d{4}-\d{2}$/',
            'to_period' => 'nullable|string|regex:/^\d{4}-\d{2}$/',
            'page' => 'nullable|integer|min:1',
            'per_page' => 'nullable|integer|min:1|max:100',
        ]);

        $student = User::with(['studentProfile.session', 'studentProfile.stream'])->findOrFail($studentId);

        \Illuminate\Support\Facades\DB::table('student_fee_period_balances')->where('user_id', $studentId)->delete();

        $institutionId = self::getActiveInstitutionId($request->user());
        $projectedRows = $this->feeCollectionService->getProjectedPeriodBalances(
            $student,
            $institutionId,
            $validated['session_id'] ?? null,
            $validated['from_period'] ?? null,
            $validated['to_period'] ?? null,
        );
        $result = $this->feeCollectionService->getStudentLedgerMatrix($student, $institutionId, $validated['session_id'] ?? null);

        if (isset($result['error'])) {
            return $this->error($result['error'], 404);
        }

        $matrix = $this->feeCollectionService->mergeLedgerMatrixWithProjected(
            $result['matrix'] ?? [],
            $projectedRows,
        );
        $fromPeriod = $validated['from_period'] ?? null;
        $toPeriod = $validated['to_period'] ?? null;
        if ($fromPeriod || $toPeriod) {
            $matrix = collect($matrix)->filter(function (array $row) use ($fromPeriod, $toPeriod) {
                $key = $row['month_key'] ?? null;
                if (!$key) {
                    return false;
                }
                if ($fromPeriod && strcmp($key, $fromPeriod) < 0) {
                    return false;
                }
                if ($toPeriod && strcmp($key, $toPeriod) > 0) {
                    return false;
                }

                return true;
            })->values()->all();
        }

        $page = (int) ($validated['page'] ?? 1);
        $perPage = (int) ($validated['per_page'] ?? count($matrix) ?: 1);
        $offset = max(0, ($page - 1) * $perPage);
        $pagedMatrix = array_slice($matrix, $offset, $perPage);

        // Determine which sessions the student is actually associated with
        $studentSessionIds = collect([$student->studentProfile?->session_id])
            ->merge(\Illuminate\Support\Facades\DB::table('student_fee_period_balances')->where('user_id', $studentId)->pluck('session_id'))
            ->merge(\Illuminate\Support\Facades\DB::table('admission_applications')->where('user_id', $studentId)->pluck('session_id'))
            ->filter()
            ->unique()
            ->values()
            ->toArray();

        $availableSessions = \App\Models\Session::where('institution_id', $institutionId)
            ->whereIn('id', $studentSessionIds)
            ->orderByDesc('start_year')
            ->get(['id', 'name']);

        return $this->success([
            'student' => $student,
            'class' => $result['class'],
            'collection_settings' => [
                'fee_collection_frequency' => $result['frequency'],
                'fee_due_day_of_month' => $result['institutionSettings']['fee_due_day_of_month'] ?? 5,
            ],
            'matrix' => app(ApiResponseMapService::class)->filterCollection($pagedMatrix, 'fee_ledger_matrix_row'),
            'total_pending' => $result['total_pending'],
            'admission_summary' => $result['admission_summary'],
            'one_time_charges' => $result['one_time_charges'],
            'available_sessions' => $availableSessions,
            'source' => $projectedRows !== [] ? 'merged' : 'computed',
            'meta' => [
                'current_page' => $page,
                'per_page' => $perPage,
                'total' => count($matrix),
                'last_page' => (int) ceil(count($matrix) / max(1, $perPage)),
            ],
        ]);
    }

    // ─── POST /fees/ledger/collect ───────────────────────────────────────

    public function collect(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'for_month' => 'required|string|regex:/^\d{4}-\d{2}$/',
            'amount' => 'required|numeric|min:0',
            'payment_mode' => 'required|string|in:cash,online,cheque,dd,split',
            'cash_amount' => 'nullable|numeric|min:0',
            'online_amount' => 'nullable|numeric|min:0',
            'online_transaction_id' => 'nullable|string',
            'cheque_number' => 'nullable|string|max:50',
            'bank_name' => 'nullable|string|max:100',
            'receipt_no' => 'nullable|string|max:50',
            'remarks' => 'nullable|string',
            'late_fee_applied' => 'nullable|numeric|min:0',
        ]);

        $institutionId = self::getActiveInstitutionId($request->user());
        $baseAmount = (float) $validated['amount'];
        $lateFee = (float) ($validated['late_fee_applied'] ?? 0);

        if ($institutionId && $lateFee <= 0) {
            $settings = $this->feeCollectionService->getSettings($institutionId);
            $lateFee = $this->feeCollectionService->calculateLateFeeForPeriod(
                $institutionId,
                $validated['for_month'],
                $baseAmount,
                $settings
            );
        }

        $totalAmount = $baseAmount + $lateFee;
        $receiptNo = $validated['receipt_no'] ?? ('RCP-' . strtoupper(uniqid()));

        $student = User::with(['studentProfile.session', 'studentProfile.stream'])->findOrFail($validated['user_id']);

        $ledgerSnapshot = null;
        if ($institutionId) {
            $matrixResult = $this->feeCollectionService->getStudentLedgerMatrix($student, $institutionId);
            if (! isset($matrixResult['error'])) {
                $row = collect($matrixResult['matrix'] ?? [])->firstWhere('month_key', $validated['for_month']);
                if ($row) {
                    $ledgerSnapshot = $this->ledgerSnapshotFactory->fromMatrixRow($row, $totalAmount);
                }
            }
        }

        $payment = DB::transaction(function () use ($institutionId, $validated, $baseAmount, $lateFee, $totalAmount, $request, $receiptNo, $ledgerSnapshot, $student) {
            $payment = FeePayment::create([
                'institution_id' => $institutionId,
                'payment_id' => 'PAY-LEDGER-' . strtoupper(uniqid()),
                'user_id' => $validated['user_id'],
                'fee_head_id' => null,
                'for_month' => $validated['for_month'],
                'amount' => $baseAmount,
                'late_fee_applied' => $lateFee,
                'total_amount' => $totalAmount,
                'payment_mode' => $validated['payment_mode'],
                'payment_status' => 'paid',
                'payment_date' => now(),
                'collected_by' => $request->user()->id,
                'receipt_no' => $receiptNo,
                'remarks' => $validated['remarks'] ?? null,
                'cash_amount' => $validated['cash_amount'] ?? null,
                'online_amount' => $validated['online_amount'] ?? null,
                'online_transaction_id' => $validated['online_transaction_id'] ?? null,
                'cheque_number' => $validated['cheque_number'] ?? null,
                'bank_name' => $validated['bank_name'] ?? null,
                'ledger_snapshot' => $ledgerSnapshot,
            ]);

            if ($institutionId) {
                \App\Services\FeeCollectionService::clearCache();
                $this->periodBalanceProjector->projectPeriod($student, $institutionId, $validated['for_month']);
            }

            return $payment;
        });
        $sendReceipt = $institutionId && ($this->feeCollectionService->getSettings($institutionId)['receipt_send_email'] ?? true);
        if ($student && $sendReceipt) {
            $recipients = $this->recipientResolver->recipientsForStudent($student);
            foreach ($recipients as $notifiable) {
                $notifiable->notify(new FeePaymentReceiptNotification($student, $payment));
            }
        }
        return $this->created($payment, 'Payment recorded and ledger updated.');
    }

    // ─── POST /fees/ledger/resend-receipt ────────────────────────────────

    public function resendReceipt(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'payment_id' => 'required|exists:fee_payments,id',
            'via' => 'required|in:email,push',
        ]);

        $payment = FeePayment::with('user')->findOrFail($validated['payment_id']);
        $student = $payment->user;

        if (!$student) {
            return $this->error('Student not found for this payment.', 404);
        }

        $recipients = $this->recipientResolver->recipientsForStudent($student);

        $channels = $validated['via'] === 'email'
            ? ['mail']
            : [\NotificationChannels\WebPush\WebPushChannel::class];

        foreach ($recipients as $notifiable) {
            $notifiable->notify(new FeePaymentReceiptNotification($student, $payment));
        }

        return $this->success(null, 'Receipt sent ' . ($validated['via'] === 'email' ? 'via email' : 'via push notification') . '.');
    }

    // ─── POST /fees/ledger/mark-as-paid ──────────────────────────────────

    public function markAsPaid(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'for_month' => 'required|string|regex:/^\d{4}-\d{2}$/',
        ]);

        $institutionId = self::getActiveInstitutionId($request->user());
        $student = User::with(['studentProfile.session', 'studentProfile.stream'])
            ->findOrFail($validated['user_id']);

        $result = $this->feeCollectionService->getStudentLedgerMatrix($student, $institutionId);

        if (isset($result['error'])) {
            return $this->error($result['error'], 422);
        }

        // Find the exact row from the matrix
        $targetRow = collect($result['matrix'])->firstWhere('month_key', $validated['for_month']);

        if (!$targetRow) {
            return $this->error('Period not found in ledger matrix.', 422);
        }

        $balance = (float) $targetRow['balance'];
        if ($balance <= 0) {
            return $this->error('No balance due for this period.', 422);
        }

        // Late-fee calculation
        $lateFee = 0.0;
        $settings = $result['institutionSettings'];
        if ($institutionId && $settings) {
            $lateFee = $this->feeCollectionService->calculateLateFeeForPeriod(
                $institutionId,
                $validated['for_month'],
                (float) ($targetRow['monthly_total'] ?? $balance),
                $settings,
                $result['frequency'] ?? null,
            );
        }

        $receiptNo = 'RCP-' . strtoupper(uniqid());

        $totalPaid = $balance + $lateFee;
        $ledgerSnapshot = $this->ledgerSnapshotFactory->fromMatrixRow($targetRow, $totalPaid);

        $payment = DB::transaction(function () use ($institutionId, $student, $validated, $balance, $lateFee, $totalPaid, $request, $receiptNo, $ledgerSnapshot) {
            $payment = FeePayment::create([
                'institution_id' => $institutionId,
                'payment_id' => 'PAY-QUICK-' . strtoupper(uniqid()),
                'user_id' => $student->id,
                'for_month' => $validated['for_month'],
                'amount' => $balance,
                'late_fee_applied' => $lateFee,
                'total_amount' => $totalPaid,
                'payment_mode' => 'cash',
                'payment_status' => 'paid',
                'payment_date' => now(),
                'collected_by' => $request->user()->id,
                'receipt_no' => $receiptNo,
                'remarks' => 'Quick pay marked as paid.',
                'ledger_snapshot' => $ledgerSnapshot,
            ]);

            if ($institutionId) {
                $this->periodBalanceProjector->projectPeriod($student, $institutionId, $validated['for_month']);
            }

            return $payment;
        });

        $sendReceipt = $institutionId && ($settings['receipt_send_email'] ?? true);
        if ($sendReceipt) {
            try {
                $recipients = $this->recipientResolver->recipientsForStudent($student);
                foreach ($recipients as $notifiable) {
                    $notifiable->notify(new FeePaymentReceiptNotification($student, $payment));
                }
            } catch (\Throwable $e) {
                \Log::warning('markAsPaid: receipt notification failed', ['error' => $e->getMessage()]);
            }
        }

        return $this->success($payment, 'Month marked as paid.');
    }

    // ─── GET  /fees/ledger/download-receipt/{payment} ────────────────────

    public function downloadReceipt(FeePayment $payment)
    {
        $payment->load('user');
        $student = $payment->user;

        $branding = $this->brandingService->resolve($payment->institution_id);
        $document = $this->assembleFeePaymentReceipt->assemble($payment, $student);
        $fileName = 'Receipt_' . ($payment->receipt_no ?? $payment->payment_id) . '.pdf';

        return $this->financialPdfRenderer->renderDownload($document, $branding, $fileName);
    }

    // ─── POST /fees/ledger/collect-advance ─────────────────────────────

    public function collectAdvance(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'months' => 'required|array|min:1',
            'months.*.for_month' => 'required|string|regex:/^\d{4}-\d{2}$/',
            'months.*.amount' => 'required|numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
            'payment_mode' => 'required|string|in:cash,online,cheque,dd,split',
            'cash_amount' => 'nullable|numeric|min:0',
            'online_amount' => 'nullable|numeric|min:0',
            'online_transaction_id' => 'nullable|string',
            'receipt_no' => 'nullable|string|max:50',
            'remarks' => 'nullable|string',
            'discount_amount' => 'nullable|numeric|min:0',
            'discount_reason' => 'nullable|string|max:500',
        ]);

        $institutionId = self::getActiveInstitutionId($request->user());
        $student = User::with(['studentProfile.session', 'studentProfile.stream'])->findOrFail($validated['user_id']);

        $receiptNo = $validated['receipt_no'] ?? ('RCP-ADV-' . strtoupper(uniqid()));
        $monthCount = count($validated['months']);
        $monthKeys = collect($validated['months'])->pluck('for_month')->implode(', ');

        $payments = DB::transaction(function () use ($institutionId, $student, $validated, $request, $receiptNo, $monthCount, $monthKeys) {
            $payments = [];

            foreach ($validated['months'] as $idx => $monthItem) {
                $monthKey = $monthItem['for_month'];
                $amount = (float) $monthItem['amount'];

                if ($amount <= 0) continue;

                // Proportional split of cash/online for each month
                // Calculate discount first
                $totalAmount = (float) $validated['total_amount'];
                $ratio = $totalAmount > 0 ? ($amount / $totalAmount) : 0;

                $monthDiscount = 0;
                if (($validated['discount_amount'] ?? 0) > 0) {
                    $monthDiscount = round(((float) $validated['discount_amount']) * $ratio, 2);
                }
                $netMonthAmount = $amount - $monthDiscount;

                $monthCash = null;
                $monthOnline = null;
                if ($validated['payment_mode'] === 'cash') {
                    $monthCash = $netMonthAmount;
                    $monthOnline = 0;
                } elseif ($validated['payment_mode'] === 'online') {
                    $monthCash = 0;
                    $monthOnline = $netMonthAmount;
                } elseif ($validated['payment_mode'] === 'split') {
                    $monthCash = round(((float) ($validated['cash_amount'] ?? 0)) * $ratio, 2);
                    $monthOnline = round(((float) ($validated['online_amount'] ?? 0)) * $ratio, 2);
                }

                if ($monthDiscount > 0) {
                    $payments[] = FeePayment::create([
                        'institution_id' => $institutionId,
                        'payment_id' => 'PAY-ADV-DISC-' . strtoupper(uniqid()),
                        'user_id' => $student->id,
                        'for_month' => $monthKey,
                        'amount' => $monthDiscount,
                        'late_fee_applied' => 0,
                        'total_amount' => $monthDiscount,
                        'payment_mode' => 'concession',
                        'payment_status' => 'paid',
                        'payment_date' => now(),
                        'collected_by' => $request->user()->id,
                        'receipt_no' => $receiptNo . ($monthCount > 1 ? '-D' . ($idx + 1) : '-D'),
                        'remarks' => trim(($validated['discount_reason'] ?? 'Discount applied during advance payment') . " [Advance: {$monthCount} months — {$monthKeys}]"),
                    ]);
                }

                if ($netMonthAmount > 0) {
                    $actualRemarks = trim(($validated['remarks'] ?? ''));
                    if ($monthDiscount > 0 && !empty($validated['discount_reason'])) {
                        $actualRemarks .= ($actualRemarks ? ' | ' : '') . 'Discount Reason: ' . trim($validated['discount_reason']);
                    }
                    $actualRemarks .= ($actualRemarks ? ' ' : '') . "[Advance: {$monthCount} months — {$monthKeys}]";

                    $payments[] = FeePayment::create([
                        'institution_id' => $institutionId,
                        'payment_id' => 'PAY-ADV-' . strtoupper(uniqid()),
                        'user_id' => $student->id,
                        'for_month' => $monthKey,
                        'amount' => $netMonthAmount,
                        'late_fee_applied' => 0,
                        'total_amount' => $netMonthAmount,
                        'payment_mode' => $validated['payment_mode'],
                        'payment_status' => 'paid',
                        'payment_date' => now(),
                        'collected_by' => $request->user()->id,
                        'receipt_no' => $receiptNo . ($monthCount > 1 ? '-' . ($idx + 1) : ''),
                        'remarks' => trim($actualRemarks),
                        'cash_amount' => $monthCash,
                        'online_amount' => $monthOnline,
                        'online_transaction_id' => $validated['online_transaction_id'] ?? null,
                    ]);
                }

                if ($institutionId) {
                    \App\Services\FeeCollectionService::clearCache();
                    $this->periodBalanceProjector->projectPeriod($student, $institutionId, $monthKey);
                }
            }

            return $payments;
        });

        // Send one receipt notification
        $sendReceipt = $institutionId && ($this->feeCollectionService->getSettings($institutionId)['receipt_send_email'] ?? true);
        if ($sendReceipt && !empty($payments)) {
            try {
                $recipients = $this->recipientResolver->recipientsForStudent($student);
                foreach ($recipients as $notifiable) {
                    $notifiable->notify(new FeePaymentReceiptNotification($student, $payments[0]));
                }
            } catch (\Throwable $e) {
                \Log::warning('collectAdvance: receipt notification failed', ['error' => $e->getMessage()]);
            }
        }

        return $this->created([
            'payments' => $payments,
            'count' => count($payments),
        ], "Advance payment recorded for {$monthCount} month(s).");
    }
}
