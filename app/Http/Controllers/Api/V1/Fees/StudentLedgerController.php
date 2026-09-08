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

        \Illuminate\Support\Facades\DB::table('student_fee_period_balances')
            ->where('user_id', $studentId)
            ->where('period_key', '!=', 'arrears')
            ->delete();

        $institutionId = self::getActiveInstitutionId($request->user());
        $requestedSessionId = $validated['session_id'] ?? null;
        $effectiveStudent = $this->feeCollectionService->resolveEffectiveStudentUserForSession($student, $institutionId, $requestedSessionId);

        $projectedRows = $this->feeCollectionService->getProjectedPeriodBalances(
            $effectiveStudent,
            $institutionId,
            $requestedSessionId,
            $validated['from_period'] ?? null,
            $validated['to_period'] ?? null,
        );
        $result = $this->feeCollectionService->getStudentLedgerMatrix($effectiveStudent, $institutionId, $requestedSessionId);

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
        $studentSessionIds = $this->feeCollectionService->getStudentAssociatedSessionIds($student, $institutionId);

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
            'reverted_history' => $result['reverted_history'] ?? [],
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
            'payment_mode' => 'required|string|in:cash,online,cheque,dd,split,concession',
            'cash_amount' => 'nullable|numeric|min:0',
            'online_amount' => 'nullable|numeric|min:0',
            'online_transaction_id' => 'nullable|string',
            'cheque_number' => 'nullable|string|max:50',
            'bank_name' => 'nullable|string|max:100',
            'receipt_no' => 'nullable|string|max:50',
            'remarks' => 'nullable|string',
            'late_fee_applied' => 'nullable|numeric|min:0',
            'discount_amount' => 'nullable|numeric|min:0',
            'discount_reason' => 'nullable|string|max:500',
            'payment_date' => 'nullable|date',
        ]);

        $institutionId = self::getActiveInstitutionId($request->user());
        $baseAmount = (float) $validated['amount'];
        $discountAmount = (float) ($validated['discount_amount'] ?? 0);
        $discountReason = trim($validated['discount_reason'] ?? '');
        $netAmount = max(0.0, $baseAmount - $discountAmount);
        $lateFee = (float) ($validated['late_fee_applied'] ?? 0);

        if ($institutionId && $lateFee <= 0 && $netAmount > 0) {
            $settings = $this->feeCollectionService->getSettings($institutionId);
            $lateFee = $this->feeCollectionService->calculateLateFeeForPeriod(
                $institutionId,
                $validated['for_month'],
                $netAmount,
                $settings
            );
        }

        $totalPaidAmount = $netAmount + $lateFee;
        $receiptNo = $validated['receipt_no'] ?? ('RCP-' . strtoupper(uniqid()));

        $student = User::with(['studentProfile.session', 'studentProfile.stream'])->findOrFail($validated['user_id']);

        $paymentDate = !empty($validated['payment_date'])
            ? \Carbon\Carbon::parse($validated['payment_date'])->setTimezone(config('app.timezone', 'Asia/Kolkata'))->setTimeFrom(now())
            : now();

        $ledgerSnapshot = null;
        if ($institutionId) {
            $matrixResult = $this->feeCollectionService->getStudentLedgerMatrix($student, $institutionId);
            if (! isset($matrixResult['error'])) {
                $row = collect($matrixResult['matrix'] ?? [])->firstWhere('month_key', $validated['for_month']);
                if ($row) {
                    $ledgerSnapshot = $this->ledgerSnapshotFactory->fromMatrixRow($row, $totalPaidAmount > 0 ? $totalPaidAmount : $discountAmount);
                }
            }
        }

        $payment = DB::transaction(function () use (
            $institutionId, $validated, $baseAmount, $discountAmount, $discountReason,
            $netAmount, $lateFee, $totalPaidAmount, $request, $receiptNo, $ledgerSnapshot, $student, $paymentDate
        ) {
            $primaryPayment = null;

            // 1. If discount / concession is provided, create a concession FeePayment
            if ($discountAmount > 0) {
                $concessionRemarks = trim($discountReason ?: 'Discount / Concession applied');
                if (!empty($validated['remarks'])) {
                    $concessionRemarks .= ' | Note: ' . trim($validated['remarks']);
                }
                $concessionRemarks .= ($netAmount > 0 ? ' [Partial Concession with payment]' : ' [Full Waiver]');

                $concessionPayment = FeePayment::create([
                    'institution_id' => $institutionId,
                    'payment_id' => 'PAY-DISC-' . strtoupper(uniqid()),
                    'user_id' => $validated['user_id'],
                    'fee_head_id' => null,
                    'for_month' => $validated['for_month'],
                    'amount' => $discountAmount,
                    'late_fee_applied' => 0,
                    'total_amount' => $discountAmount,
                    'payment_mode' => 'concession',
                    'payment_status' => 'paid',
                    'payment_date' => $paymentDate,
                    'collected_by' => $request->user()->id,
                    'receipt_no' => $receiptNo . '-D',
                    'remarks' => $concessionRemarks,
                    'ledger_snapshot' => $ledgerSnapshot,
                ]);

                $primaryPayment = $concessionPayment;
            }

            // 2. If netAmount > 0, create the regular payment
            if ($netAmount > 0) {
                $actualRemarks = trim($validated['remarks'] ?? '');
                if ($discountAmount > 0) {
                    $discNote = 'Concession: ₹' . number_format($discountAmount, 2) . ($discountReason ? " ({$discountReason})" : '');
                    $actualRemarks = trim(($actualRemarks ? $actualRemarks . ' | ' : '') . $discNote);
                }

                $primaryPayment = FeePayment::create([
                    'institution_id' => $institutionId,
                    'payment_id' => 'PAY-LEDGER-' . strtoupper(uniqid()),
                    'user_id' => $validated['user_id'],
                    'fee_head_id' => null,
                    'for_month' => $validated['for_month'],
                    'amount' => $netAmount,
                    'late_fee_applied' => $lateFee,
                    'total_amount' => $totalPaidAmount,
                    'payment_mode' => $validated['payment_mode'],
                    'payment_status' => 'paid',
                    'payment_date' => $paymentDate,
                    'collected_by' => $request->user()->id,
                    'receipt_no' => $receiptNo,
                    'remarks' => $actualRemarks ?: null,
                    'cash_amount' => $validated['cash_amount'] ?? null,
                    'online_amount' => $validated['online_amount'] ?? null,
                    'online_transaction_id' => $validated['online_transaction_id'] ?? null,
                    'cheque_number' => $validated['cheque_number'] ?? null,
                    'bank_name' => $validated['bank_name'] ?? null,
                    'ledger_snapshot' => $ledgerSnapshot,
                ]);
            }

            if ($institutionId) {
                \App\Services\FeeCollectionService::clearCache();
                $this->periodBalanceProjector->projectPeriod($student, $institutionId, $validated['for_month']);
            }

            return $primaryPayment;
        });

        $sendReceipt = $institutionId && ($this->feeCollectionService->getSettings($institutionId)['receipt_send_email'] ?? true);
        if ($student && $sendReceipt && $netAmount > 0 && $payment) {
            try {
                $recipients = $this->recipientResolver->recipientsForStudent($student);
                foreach ($recipients as $notifiable) {
                    $notifiable->notify(new FeePaymentReceiptNotification($student, $payment));
                }
            } catch (\Throwable $e) {
                \Log::warning('collectPayment: receipt notification failed', [
                    'payment_id' => $payment->id ?? null,
                    'student_id' => $student->id ?? null,
                    'error' => $e->getMessage(),
                ]);
            }
        }

        $message = $netAmount > 0 
            ? 'Payment recorded and ledger updated.' 
            : 'Concession / waiver recorded and ledger updated.';

        return $this->created($payment, $message);
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

        try {
            foreach ($recipients as $notifiable) {
                $notifiable->notify(new FeePaymentReceiptNotification($student, $payment));
            }
        } catch (\Throwable $e) {
            \Log::warning('resendReceipt: notification failed', [
                'payment_id' => $payment->id,
                'error' => $e->getMessage(),
            ]);
            return $this->error('Failed to send receipt: ' . $e->getMessage(), 500);
        }

        return $this->success(null, 'Receipt sent ' . ($validated['via'] === 'email' ? 'via email' : 'via push notification') . '.');
    }

    // ─── POST /fees/ledger/revert-payment ────────────────────────────────

    public function revertPayment(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'payment_id' => 'required|exists:fee_payments,id',
            'reason' => 'required|string|min:3|max:500',
        ]);

        $institutionId = self::getActiveInstitutionId($request->user());
        $payment = FeePayment::findOrFail($validated['payment_id']);

        if ($institutionId && (int) $payment->institution_id !== (int) $institutionId) {
            return $this->error('Unauthorized action for this institution.', 403);
        }

        if (in_array($payment->payment_status, ['cancelled', 'reversed'], true)) {
            return $this->error('This payment has already been reverted.', 422);
        }

        $student = User::with(['studentProfile.session', 'studentProfile.stream'])->find($payment->user_id);
        $reason = trim($validated['reason']);
        $adminName = $request->user()->name ?? 'Admin';
        $timestamp = now()->format('d M Y, h:i A');

        DB::transaction(function () use ($payment, $reason, $adminName, $timestamp, $student, $institutionId) {
            $auditNote = "Reverted by {$adminName} on {$timestamp}. Reason: {$reason}";
            $newRemarks = trim(($payment->remarks ? $payment->remarks . " | " : "") . $auditNote);

            $snapshot = $payment->ledger_snapshot;
            if (is_string($snapshot)) {
                $snapshot = json_decode($snapshot, true) ?: [];
            }
            if (!is_array($snapshot)) {
                $snapshot = [];
            }
            $snapshot['reversal'] = [
                'reverted_by' => $adminName,
                'reverted_at' => now()->toIso8601String(),
                'reverted_at_formatted' => $timestamp,
                'reason' => $reason,
            ];

            $payment->update([
                'payment_status' => 'cancelled',
                'remarks' => $newRemarks,
                'ledger_snapshot' => $snapshot,
            ]);

            // If there's an associated discount/concession payment for the same month/receipt, cancel it as well
            if ($payment->receipt_no) {
                $baseReceipt = preg_replace('/-D(\d+)?$/', '', $payment->receipt_no);
                $concessionPayments = FeePayment::where('user_id', $payment->user_id)
                    ->where('for_month', $payment->for_month)
                    ->where('payment_mode', 'concession')
                    ->whereIn('payment_status', ['paid', 'success'])
                    ->where(function ($q) use ($baseReceipt) {
                        $q->where('receipt_no', 'like', "{$baseReceipt}-D%");
                    })
                    ->get();

                foreach ($concessionPayments as $cp) {
                    $cp->update([
                        'payment_status' => 'cancelled',
                        'remarks' => trim(($cp->remarks ? $cp->remarks . " | " : "") . "Reverted with payment #{$payment->id}. Reason: {$reason}"),
                    ]);
                }
            }

            if ($institutionId) {
                \App\Services\FeeCollectionService::clearCache();
                if ($student) {
                    $this->periodBalanceProjector->projectPeriod($student, $institutionId, $payment->for_month);
                }
            }
        });

        return $this->success(null, 'Payment has been reverted successfully.');
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
                \App\Services\FeeCollectionService::clearCache();
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

    public function downloadReceipt(Request $request, FeePayment $payment)
    {
        $user = $request->user();
        $effectiveStudentId = \App\Support\EffectiveStudentContext::getEffectiveStudentId($user);

        $hasStaffAccess = $user->hasAbility('accounts_room')
            || $user->hasRole(['admin', 'super_admin'])
            || $user->hasAnyPermission(['admin_desk', 'office_registry', 'accounts_room']);

        if (!$hasStaffAccess && (int) $payment->user_id !== (int) $effectiveStudentId) {
            abort(403, 'You are not authorized to download this receipt.');
        }

        $payment->load('user');
        $student = $payment->user;

        $branding = $this->brandingService->resolve($payment->institution_id);
        $document = $this->assembleFeePaymentReceipt->assemble($payment, $student);
        $fileName = 'Receipt_' . ($payment->receipt_no ?? $payment->payment_id) . '.pdf';

        return $this->financialPdfRenderer->renderDownload($document, $branding, $fileName)
            ->header('Access-Control-Expose-Headers', 'Content-Disposition');
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
            'payment_mode' => 'required|string|in:cash,online,cheque,dd,split,concession',
            'cash_amount' => 'nullable|numeric|min:0',
            'online_amount' => 'nullable|numeric|min:0',
            'online_transaction_id' => 'nullable|string',
            'receipt_no' => 'nullable|string|max:50',
            'remarks' => 'nullable|string',
            'discount_amount' => 'nullable|numeric|min:0',
            'discount_reason' => 'nullable|string|max:500',
            'payment_date' => 'nullable|date',
        ]);

        $institutionId = self::getActiveInstitutionId($request->user());
        $student = User::with(['studentProfile.session', 'studentProfile.stream'])->findOrFail($validated['user_id']);

        $receiptNo = $validated['receipt_no'] ?? ('RCP-ADV-' . strtoupper(uniqid()));
        $monthCount = count($validated['months']);
        $monthKeys = collect($validated['months'])->pluck('for_month')->implode(', ');

        $paymentDate = !empty($validated['payment_date'])
            ? \Carbon\Carbon::parse($validated['payment_date'])->setTimezone(config('app.timezone', 'Asia/Kolkata'))->setTimeFrom(now())
            : now();

        $payments = DB::transaction(function () use ($institutionId, $student, $validated, $request, $receiptNo, $monthCount, $monthKeys, $paymentDate) {
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
                    $advRemarks = trim($validated['discount_reason'] ?? 'Discount applied during advance payment');
                    if (!empty($validated['remarks'])) {
                        $advRemarks .= ' | Note: ' . trim($validated['remarks']);
                    }
                    $advRemarks .= " [Advance: {$monthCount} months — {$monthKeys}]";

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
                        'payment_date' => $paymentDate,
                        'collected_by' => $request->user()->id,
                        'receipt_no' => $receiptNo . ($monthCount > 1 ? '-D' . ($idx + 1) : '-D'),
                        'remarks' => $advRemarks,
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
                        'payment_date' => $paymentDate,
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

    // ─── GET  /fees/ledger/student/{id}/export ───────────────────────────

    public function exportExcel(Request $request, int $studentId)
    {
        $validated = $request->validate([
            'session_id' => 'nullable|integer|exists:academic_sessions,id',
        ]);

        $student = User::with(['studentProfile.session', 'studentProfile.stream'])->findOrFail($studentId);
        $institutionId = self::getActiveInstitutionId($request->user());
        $requestedSessionId = $validated['session_id'] ?? null;
        $effectiveStudent = $this->feeCollectionService->resolveEffectiveStudentUserForSession($student, $institutionId, $requestedSessionId);

        $result = $this->feeCollectionService->getStudentLedgerMatrix($effectiveStudent, $institutionId, $requestedSessionId);

        if (isset($result['error'])) {
            return $this->error($result['error'], 404);
        }

        $sessionName = $student->studentProfile?->session?->name ?? 'Current_Session';
        $safeStudentName = preg_replace('/[^A-Za-z0-9_\-]/', '_', $student->name);
        $filename = "Fee_Ledger_{$safeStudentName}_{$sessionName}.xlsx";

        return \Maatwebsite\Excel\Facades\Excel::download(
            new \App\Exports\StudentLedgerExport($student, $result),
            $filename
        );
    }
}
