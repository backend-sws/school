<?php

namespace App\Http\Controllers\Api\V1\Fees;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\FeePayment;
use App\Models\AdmissionApplication;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MonthlyLedgerController extends BaseController
{
    /**
     * Monthly fee collection ledger.
     *
     * GET /api/v1/fees/ledger/monthly?from=YYYY-MM&to=YYYY-MM&lms_class_id=optional
     */
    public function index(Request $request): JsonResponse
    {
        $request->validate([
            'from' => 'nullable|date_format:Y-m',
            'to' => 'nullable|date_format:Y-m',
            'lms_class_id' => 'nullable|integer|exists:lms_classes,id',
        ]);

        $from = $request->input('from', now()->startOfYear()->format('Y-m'));
        $to = $request->input('to', now()->format('Y-m'));
        $classId = $request->input('lms_class_id');

        // If filtering by class, get enrolled user IDs
        $enrolledUserIds = null;
        if ($classId) {
            $enrolledUserIds = DB::table('lms_class_enrollments')
                ->where('lms_class_id', $classId)
                ->pluck('user_id')
                ->toArray();
        }

        // DB-agnostic month extraction (works on both PostgreSQL and MySQL)
        $monthExpr = DB::connection()->getDriverName() === 'pgsql'
            ? "to_char(payment_date, 'YYYY-MM')"
            : "DATE_FORMAT(payment_date, '%Y-%m')";

        // Fee payments (collected fees: fee heads)
        $feePaymentsQuery = DB::table('fee_payments')
            ->select(
                DB::raw("{$monthExpr} as month"),
                DB::raw("SUM(total_amount) as collected")
            )
            ->whereIn('payment_status', ['paid', 'success'])
            ->whereNotNull('payment_date')
            ->whereRaw("{$monthExpr} >= ?", [$from])
            ->whereRaw("{$monthExpr} <= ?", [$to]);

        if ($enrolledUserIds !== null) {
            $feePaymentsQuery->whereIn('user_id', $enrolledUserIds);
        }

        $feePayments = $feePaymentsQuery->groupBy('month')->pluck('collected', 'month');

        // Admission application payments
        $admissionQuery = DB::table('admission_applications')
            ->select(
                DB::raw("{$monthExpr} as month"),
                DB::raw("SUM(amount) as collected")
            )
            ->where('payment_status', 'success')
            ->whereNotNull('payment_date')
            ->whereRaw("{$monthExpr} >= ?", [$from])
            ->whereRaw("{$monthExpr} <= ?", [$to]);

        if ($classId) {
            $admissionQuery->where('class_id', $classId);
        }

        $admissionPayments = $admissionQuery->groupBy('month')->pluck('collected', 'month');

        // Certificate application payments
        $certPayments = collect();
        if (DB::getSchemaBuilder()->hasTable('certificate_applications')) {
            $certMonthExpr = DB::connection()->getDriverName() === 'pgsql'
                ? "to_char(submitted_at, 'YYYY-MM')"
                : "DATE_FORMAT(submitted_at, '%Y-%m')";

            $certQuery = DB::table('certificate_applications')
                ->select(
                    DB::raw("{$certMonthExpr} as month"),
                    DB::raw("SUM(amount) as collected")
                )
                ->where('payment_status', 'success')
                ->whereNotNull('submitted_at')
                ->whereRaw("{$certMonthExpr} >= ?", [$from])
                ->whereRaw("{$certMonthExpr} <= ?", [$to]);

            if ($enrolledUserIds !== null) {
                $certQuery->whereIn('user_id', $enrolledUserIds);
            }

            $certPayments = $certQuery->groupBy('month')->pluck('collected', 'month');
        }

        // Build month range
        $start = \Carbon\Carbon::createFromFormat('Y-m', $from)->startOfMonth();
        $end = \Carbon\Carbon::createFromFormat('Y-m', $to)->endOfMonth();
        $result = [];

        while ($start->lte($end)) {
            $key = $start->format('Y-m');
            $fees = (float) ($feePayments[$key] ?? 0);
            $admission = (float) ($admissionPayments[$key] ?? 0);
            $cert = (float) ($certPayments[$key] ?? 0);
            $result[] = [
                'month' => $key,
                'month_label' => $start->format('M Y'),
                'collected_fees' => $fees,
                'collected_admission' => $admission,
                'collected_certificate' => $cert,
                'total_collected' => $fees + $admission + $cert,
            ];
            $start->addMonth();
        }

        return $this->success($result);
    }
}
