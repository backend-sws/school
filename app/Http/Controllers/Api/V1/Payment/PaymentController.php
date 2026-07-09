<?php
namespace App\Http\Controllers\Api\V1\Payment;

use App\Enums\PaymentStatus;
use Illuminate\Http\Request;
use App\Services\PayUService;
use Illuminate\Support\Facades\{DB, Auth};
use App\Http\Controllers\Api\V1\BaseController;
use App\Models\{Transaction, AdmissionHead, CertificateHead};


/**
 * @OA\Tag(
 * name="Payments",
 * description="API Endpoints for Payment Initiation and Callbacks"
 * )
 */
class PaymentController extends BaseController
{
    protected $payu;

    public function __construct(PayUService $payu)
    {
        $this->payu = $payu;
    }



    /**
     * @OA\Post(
     * path="/student/payment/initiate",
     * summary="Initiate a new payment transaction",
     * tags={"Payments"},
     * security={{"sanctum":{}}},
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"id", "type"},
     * @OA\Property(property="id", type="integer", example=25, description="The ID of AdmissionApplication, FeePayment, or CertificateApplication"),
     * @OA\Property(property="type", type="string", enum={"admission", "fee", "certificate"}, example="admission")
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Success - Returns gateway parameters and hash",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=true),
     * @OA\Property(property="data", type="object",
     * @OA\Property(property="payment_url", type="string", example="https://test.payu.in/_payment"),
     * @OA\Property(property="params", type="object",
     * @OA\Property(property="key", type="string", example="mKey123"),
     * @OA\Property(property="txnid", type="string", example="A174000123"),
     * @OA\Property(property="amount", type="number", format="float", example=5000.00),
     * @OA\Property(property="hash", type="string", example="abc123hash..."),
     * @OA\Property(property="surl", type="string", example="https://api.college.com/api/v1/payments/payu/callback")
     * )
     * )
     * )
     * ),
     * @OA\Response(response=422, description="Validation Error or Processor Not Implemented")
     * )
     */
    public function initiate(Request $request)
    {
        $request->validate([
            'id' => 'required|integer',
            'type' => 'required|in:admission,fee,certificate'
        ]);

        // 1. Model Mapping
        $modelMap = [
            'admission' => \App\Models\AdmissionApplication::class,
            'fee' => \App\Models\FeePayment::class, // Assuming this is your record table
            'certificate' => \App\Models\CertificateApplication::class,
        ];

        $application = $modelMap[$request->type]::findOrFail($request->id);

        // 2. Get Head/Configuration to fetch Amount and Gateway
        // AdmissionApplication has admission_head_id, FeePayment has fee_head_id , CertificateApplication has certificate_head_id
        $head = match ($request->type) {
            'admission' => $application->admissionHead,
            'fee' => $application->feeHead,
            'certificate' => $application->certificateHead,
        };

        $gateway = $this->getGatewayName($head, $request->type);
        $amount = (float) $application->amount; // Amount already stored in application during submission

        return DB::transaction(function () use ($application, $amount, $gateway, $request) {
            $user = Auth::user();

            // 3.Create Central Transaction Record 
            $transaction = Transaction::create([
                'user_id' => $user->id,
                'txn_id' => strtoupper($gateway[0] ?? 'T') . time() . rand(10, 99),
                'amount' => $amount,
                'status' => 'pending',
                'gateway_name' => $gateway,
                'payable_type' => get_class($application),
                'payable_id' => $application->id,
            ]);

            // 4. Gateway Logic 
            if ($gateway === 'sabpaisa') {
                $params = [
                    'key' => config('services.payu.key'),
                    'txnid' => $transaction->txn_id,
                    'amount' => (float) $transaction->amount,
                    'firstname' => $user->name,
                    'email' => $user->email,
                    'phone' => $user->mobile,
                    'productinfo' => ucfirst($request->type) . " Payment",
                    'surl' => config('services.payu.surl'),
                    'furl' => config('services.payu.furl'),
                ];

                $params['hash'] = $this->payu->generateHash($params);

                return $this->success([
                    'payment_url' => $this->payu->getPayUUrl(),
                    'params' => $params
                ], "Payment data generated.");

            }

            //5  if gateway not implemented then throw error
            return $this->error("Payment processor '{$gateway}' not implemented yet.", 422);
        });
    }

    /**
     * Helper: find gateway name from different tables with fallback to default
     */
    protected function getGatewayName($head, $type)
    {
        if ($type === 'certificate') {
            return $head->payment_processor ?? 'payu'; // Certificate table column
        }

        if ($type === 'admission') {
            return $head->payment_gateway ?? 'payu'; // Admission table column
        }
        // For fee, we can have a specific column or default to 'payu'
        return $head->payment_gateway ?? 'payu'; // Fee table column (if exists) or default
    }

    /**
     * Helper: Get amount based on type with proper casting and fallback to 0.00
     */
    protected function getAmount($head, $type)
    {
        return match ($type) {
            'admission' => (float) $head->total_admission_fees,
            'fee' => (float) $head->amount + (
                ($head->last_date && now()->startOfDay()->gt($head->last_date))
                ? (float) $head->late_fee
                : 0
            ),                            // Base fee + late fee if applicable
            'certificate' => (float) $head->fee_amount,
            default => 0.00
        };
    }

    /**
     * Callback handler
     */


    /**
     * @OA\Post(
     * path="/payments/payu/callback",
     * summary="Handle PayU Success/Failure Callback",
     * description="This endpoint is called by PayU server after transaction completion.",
     * tags={"Payments"},
     * @OA\RequestBody(
     * description="PayU POST Response",
     * @OA\MediaType(mediaType="application/x-www-form-urlencoded")
     * ),
     * @OA\Response(
     * response=302,
     * description="Redirects to Frontend Success or Failure Page"
     * )
     * )
     */
    public function handleCallback(Request $request)
    {
        $transaction = Transaction::where('txn_id', $request->txnid)->firstOrFail();

        // Hash verification (Security)
        if ($transaction->gateway_name === 'sabpaisa' && !$this->payu->verifyHash($request->all())) {
            return $this->error("Security breach: Invalid Hash received.", 403);
        }

        if ($request->status === 'success') {
            $transaction->update(['status' => 'success', 'gateway_txn_id' => $request->txnid, 'raw_response' => json_encode($request->all())]);

            // Update Parent Table Status (Admission/Fee/Cert)
            $transaction->payable->update(['payment_status' => PaymentStatus::SUCCESS, 'transaction_id' => $transaction->id, 'payment_date' => now()]);

            return redirect(config('app.frontend_url') . '/payment/success?txn=' . $transaction->txn_id);
        }

        $transaction->update(['status' => 'failed']);
        return redirect(config('app.frontend_url') . '/payment/failed?txn=' . $transaction->txn_id);
    }
}