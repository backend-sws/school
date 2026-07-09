<?php

namespace App\Http\Controllers\Api\V1\StudentDashboard;

use App\Models\Transaction;
use App\Support\EffectiveStudentContext;
use Illuminate\Http\Request;
use App\Http\Controllers\Api\V1\BaseController;
use Illuminate\Support\Facades\Auth;

class StudentTransactionController extends BaseController
{
    /**
     * @OA\Get(
     *     path="/api/v1/student/transactions",
     *     summary="Get transaction history for the authenticated student",
     *     tags={"Student Dashboard Transactions"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="List of transactions"
     *     )
     * )
     */
    public function index(Request $request)
    {
        $user = EffectiveStudentContext::getEffectiveUser(Auth::user());
        if (! $user) {
            return $this->error('Unauthorized.', 401);
        }

        $query = \App\Models\FeePayment::with(['payableEntity'])
            ->where('user_id', $user->id)
            ->orderBy('payment_date', 'desc');

        if ($request->filled('status') && ! in_array($request->input('status'), ['all', ''], true)) {
            $query->where('payment_status', $request->input('status'));
        }

        $feePayments = $query->paginate($request->input('per_page', 15));

        $feePayments->getCollection()->transform(function ($payment) {
            $payableType = $payment->payable_entity_type;
            
            $payableTitle = 'Academic Fee';
            $applicationId = null;

            if ($payableType && str_contains($payableType, 'AdmissionApplication')) {
                $payableType = 'AdmissionApplication';
                $applicationId = $payment->payableEntity?->application_id ?? 'N/A';
            } else {
                $payableType = 'FeePayment';
                if ($payment->for_month) {
                    $payableTitle = 'Fee - ' . date('M Y', strtotime($payment->for_month . '-01'));
                }
            }

            return [
                'id' => $payment->id,
                'transaction_id' => $payment->transaction_id ?? $payment->payment_id ?? $payment->receipt_no ?? 'N/A',
                'gateway_txn_id' => $payment->online_transaction_id,
                'amount' => $payment->total_amount ?? $payment->amount,
                'status' => $payment->payment_status,
                'gateway_name' => $payment->payment_mode,
                'payable_type' => $payableType,
                'payable_id' => $payment->payable_entity_id,
                'created_at' => $payment->payment_date,
                'payable' => [
                    'title' => $payableTitle,
                    'application_id' => $applicationId,
                ],
            ];
        });

        return $this->paginated($feePayments, 'Success');
    }
}
