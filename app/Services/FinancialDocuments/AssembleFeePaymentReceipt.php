<?php

namespace App\Services\FinancialDocuments;

use App\Models\AdmissionApplication;
use App\Models\FeePayment;
use App\Models\FeeType;
use App\Models\LmsClass;
use App\Models\LmsClassEnrollment;
use App\Models\Stream;
use App\Models\User;
use App\Services\FeeCollectionService;
use Carbon\Carbon;

final class AssembleFeePaymentReceipt implements FinancialDocumentAssemblerInterface
{
    public function kind(): string
    {
        return 'fee_receipt';
    }

    public function assemble(FeePayment $payment, ?User $student): FinancialDocument
    {
        $snap = $payment->ledger_snapshot ?? [];
        $student = $student ?? $payment->user;

        $receiptNo = $payment->receipt_no ?? $payment->payment_id;

        // 1. Resolve payment date
        $paymentDate = $payment->payment_date ?? $payment->created_at ?? $payment->processed_at;
        $dateStr = $paymentDate ? Carbon::parse($paymentDate)->format('d M Y') : now()->format('d M Y');

        // 2. Resolve linked application if any (e.g. for admission fees or desk collections)
        $app = null;
        if ($payment->payable_entity_type === 'admission_application' && $payment->payable_entity_id) {
            $app = AdmissionApplication::with(['lmsClass', 'lmsSection', 'admissionHead.stream', 'stream'])->find($payment->payable_entity_id);
        }
        if (!$app && $student) {
            $app = AdmissionApplication::with(['lmsClass', 'lmsSection', 'admissionHead.stream', 'stream'])
                ->where('user_id', $student->id)
                ->latest('id')
                ->first();
        }

        // 3. Resolve Class and Section
        $studentClass = null;
        $studentSection = null;

        // A. From student active / latest enrollments
        $enrollment = $student?->studentProfile?->currentEnrollments()->with('lmsClass')->latest('id')->first()
            ?? ($student ? LmsClassEnrollment::where('user_id', $student->id)->where('status', 'active')->with('lmsClass')->latest('id')->first() : null)
            ?? ($student ? LmsClassEnrollment::where('user_id', $student->id)->with('lmsClass')->latest('id')->first() : null);

        if ($enrollment?->lmsClass) {
            $studentClass = $enrollment->lmsClass->name;
            $studentSection = $enrollment->lmsClass->section;
        }

        // B. From FeeCollectionService
        if (!$studentClass && $student) {
            $resolvedClass = app(FeeCollectionService::class)->resolveStudentClass(
                $student,
                (int) ($payment->institution_id ?? $student->institution_id ?? 0),
                $student->studentProfile?->stream_id,
                $student->studentProfile?->session_id
            );
            if ($resolvedClass) {
                $studentClass = $resolvedClass->name;
                $studentSection = $resolvedClass->section;
            }
        }

        // C. From linked or latest AdmissionApplication
        if ($app) {
            $appSection = $app->lmsSection ?? (!empty($app->section_id) ? LmsClass::withoutGlobalScopes()->find($app->section_id) : null);
            $appClass = $app->lmsClass ?? (!empty($app->class_id) ? LmsClass::withoutGlobalScopes()->find($app->class_id) : null);
            $appStream = $app->stream ?? (!empty($app->class_id) ? Stream::withoutGlobalScopes()->find($app->class_id) : null);

            $studentClass = $studentClass ?? $appSection?->name ?? $appClass?->name ?? $appStream?->name ?? optional($app->admissionHead)->title;
            $studentSection = $studentSection ?? $appSection?->section ?? $appClass?->section ?? optional(optional($app->admissionHead)->stream)->name;
        }

        // D. From studentProfile stream fallback
        if (!$studentClass && $student?->studentProfile?->stream_id) {
            $stream = $student->studentProfile->stream ?? Stream::withoutGlobalScopes()->find($student->studentProfile->stream_id);
            if ($stream) {
                $studentClass = $stream->name;
            }
        }

        // Format Class / Section string nicely
        $classSec = '';
        if ($studentClass && $studentSection) {
            $alreadyHasSection = preg_match('/\b' . preg_quote((string) $studentSection, '/') . '\b/i', (string) $studentClass);
            $classSec = $alreadyHasSection ? (string) $studentClass : "{$studentClass} - {$studentSection}";
        } elseif ($studentClass) {
            $classSec = (string) $studentClass;
        } elseif ($studentSection) {
            $classSec = (string) $studentSection;
        }

        // 4. Resolve Payment Period
        $period = $payment->for_month;
        if ($period && preg_match('/^\d{4}-\d{2}$/', $period)) {
            $period = Carbon::parse($period . '-01')->format('M Y');
        } elseif (!$period) {
            if ($app?->session_name) {
                $period = 'Admission (' . $app->session_name . ')';
            } elseif ($student?->studentProfile?->session?->name) {
                $period = 'Admission (' . $student->studentProfile->session->name . ')';
            } elseif ($payment->payable_entity_type === 'admission_application' || str_starts_with((string) $receiptNo, 'RCP-ADM')) {
                $period = 'Admission';
            }
        }

        $regNo = $student?->studentProfile?->reg_no ?? $student?->reg_no ?? $app?->application_id ?? '—';

        $studentId = $student?->studentProfile?->student_id ?? $student?->student_id;
        $regNo = $student?->studentProfile?->reg_no ?? $student?->reg_no;
        $idParts = array_filter([
            $studentId ? "ID: {$studentId}" : null,
            $regNo ? "Reg: {$regNo}" : null,
        ]);
        $idDisplay = count($idParts) > 0 ? implode(' • ', $idParts) : '—';

        $metaRows = [
            ['Student Name:', $student?->name ?? '—', 'Student ID / Reg No:', $idDisplay],
            ['Class / Section:', $classSec ?: '—', 'Payment Period:', $payment->for_month ?: '—'],
        ];

        $sections = [
            ['type' => 'meta_table', 'rows' => $metaRows],
        ];

        $previousDues = isset($snap['previous_dues']) ? (float) $snap['previous_dues'] : 0.0;
        $feesList = isset($snap['fees']) && is_array($snap['fees']) ? $snap['fees'] : [];
        $feesLineSum = 0.0;
        foreach ($feesList as $row) {
            $feesLineSum += (float) ($row['amount'] ?? 0);
        }
        $baseAmount = (float) $payment->amount;
        $lateAmount = (float) $payment->late_fee_applied;

        $lineRows = [];

        // 1. Previous dues / arrears if any
        if ($previousDues > 0.009) {
            $lineRows[] = [
                'description' => 'Previous Dues / Arrears',
                'amount' => Money::inr($previousDues),
            ];
        }

        // 2. Current period fee components
        $feeBreakdownMap = [];
        if ($app && is_array($app->fee_breakdown)) {
            foreach ($app->fee_breakdown as $item) {
                $key = $item['fee_type_id'] ?? $item['fee_particular_id'] ?? null;
                if ($key && !empty($item['name'])) {
                    $feeBreakdownMap[$key] = $item['name'];
                }
            }
        }

        if (count($feesList) > 0) {
            foreach ($feesList as $fee) {
                $feeDesc = $fee['name'] ?? $fee['title'] ?? $fee['label'] ?? null;
                if (!$feeDesc) {
                    $feeId = $fee['fee_particular_id'] ?? $fee['fee_type_id'] ?? $fee['id'] ?? null;
                    if ($feeId && isset($feeBreakdownMap[$feeId])) {
                        $feeDesc = $feeBreakdownMap[$feeId];
                    } elseif ($feeId) {
                        $feeDesc = FeeType::withoutGlobalScopes()->find($feeId)?->name;
                    }
                }

                $lineRows[] = [
                    'description' => (string) ($feeDesc ?: 'Fee Component'),
                    'amount' => Money::inr((float) ($fee['amount'] ?? 0)),
                ];
            }
        } else {
            $periodNote = $payment->for_month ? " ({$payment->for_month})" : '';
            $lineRows[] = [
                'description' => 'Tuition / Period Fees' . $periodNote,
                'amount' => Money::inr($baseAmount),
            ];
        }

        // 3. Late fee if any
        if ($lateAmount > 0.009) {
            $lineRows[] = [
                'description' => 'Late Fee Applied',
                'amount' => Money::inr($lateAmount),
            ];
        }

        $sections[] = ['type' => 'line_items', 'rows' => $lineRows];

        $discountAmount = 0.0;
        if (($snap['discount'] ?? 0) > 0) {
            $discountAmount = (float) $snap['discount'];
        } else {
            // Fallback for advance/concession payments
            $receiptNoRaw = (string) $payment->receipt_no;
            $discountReceiptNo = '';
            if (preg_match('/^(.*?)-(\d+)$/', $receiptNoRaw, $matches)) {
                $base = $matches[1];
                $idx = $matches[2];
                $discountReceiptNo = $base . '-D' . $idx;
            } else {
                $discountReceiptNo = $receiptNoRaw . '-D';
            }

            $discountPayment = FeePayment::where('receipt_no', $discountReceiptNo)
                ->where('payment_mode', 'concession')
                ->where('user_id', $payment->user_id)
                ->first();

            if ($discountPayment) {
                $discountAmount = (float) $discountPayment->amount;
            }
        }

        $currentCycleFees = count($feesList) > 0 ? $feesLineSum : $baseAmount;
        $totalBilled = $previousDues + $currentCycleFees + $lateAmount;
        if (isset($snap['total_payable_before']) && (float) $snap['total_payable_before'] > $totalBilled) {
            $totalBilled = (float) $snap['total_payable_before'];
        }

        $summaryRows = [
            ['label' => 'Total Amount Due:', 'amount' => Money::inr($totalBilled), 'style' => 'normal'],
        ];

        if ($discountAmount > 0.009) {
            $summaryRows[] = [
                'label' => 'Discount / Concession:',
                'amount' => '− ' . Money::inr($discountAmount),
                'style' => 'discount',
            ];

            $netPayable = max(0, round($totalBilled - $discountAmount, 2));
            $summaryRows[] = [
                'label' => 'Net Amount Payable:',
                'amount' => Money::inr($netPayable),
                'style' => 'normal',
            ];
        }

        $summaryRows[] = [
            'label' => 'Total Paid (This Receipt):',
            'amount' => Money::inr((float) $payment->total_amount),
            'style' => 'total',
        ];

        $balanceRemaining = max(0, round($totalBilled - $discountAmount - (float) $payment->total_amount, 2));

        if ($balanceRemaining > 0.009) {
            $summaryRows[] = ['label' => 'Remaining Balance Due:', 'amount' => Money::inr($balanceRemaining), 'style' => 'balance'];
        } else {
            $summaryRows[] = ['label' => 'Balance Due:', 'amount' => '₹0.00 (Fully Paid)', 'style' => 'balance'];
        }

        $sections[] = ['type' => 'summary_float', 'rows' => $summaryRows];

        $kvRows = [['Payment Mode', strtoupper((string) ($payment->payment_mode ?? ''))]];
        if (strtolower((string) $payment->payment_mode) === 'split' || ($payment->cash_amount ?? 0) > 0 || ($payment->online_amount ?? 0) > 0) {
            if (($payment->cash_amount ?? 0) > 0) {
                $kvRows[] = ['Cash', Money::inr((float) $payment->cash_amount)];
            }
            if (($payment->online_amount ?? 0) > 0) {
                $kvRows[] = ['Online', Money::inr((float) $payment->online_amount)];
            }
        }
        if ($payment->online_transaction_id) {
            $kvRows[] = ['Transaction ID', (string) $payment->online_transaction_id];
        }
        if ($payment->remarks) {
            $kvRows[] = ['Remarks', (string) $payment->remarks];
        }
        $sections[] = ['type' => 'key_value_box', 'rows' => $kvRows];

        return new FinancialDocument(
            kind: 'fee_receipt',
            documentTitle: 'Fee Payment Receipt',
            metadata: [
                'id' => $receiptNo,
                'title' => 'Fee Receipt',
                'date' => $dateStr,
            ],
            sections: $sections,
            showSignatory: true,
        );
    }
}
