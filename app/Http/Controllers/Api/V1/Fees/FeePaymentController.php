<?php

namespace App\Http\Controllers\Api\V1\Fees;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\FeePayment;
use App\Services\InventorySaleService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @OA\Schema(
 *     schema="FeePayment",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="payment_id", type="string"),
 *     @OA\Property(property="user_id", type="integer"),
 *     @OA\Property(property="fee_head_id", type="integer"),
 *     @OA\Property(property="amount", type="number"),
 *     @OA\Property(property="late_fee_applied", type="number"),
 *     @OA\Property(property="total_amount", type="number"),
 *     @OA\Property(property="payment_status", type="string", enum={"pending", "paid", "failed"}),
 *     @OA\Property(property="transaction_id", type="string")
 * )
 */
class FeePaymentController extends BaseController
{
    /**
     * @OA\Get(
     *     path="/fee-payments",
     *     summary="List fee payments",
     *     tags={"Fees"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Parameter(name="user_id", in="query", @OA\Schema(type="integer")),
     *     @OA\Parameter(name="fee_head_id", in="query", @OA\Schema(type="integer")),
     *     @OA\Parameter(name="payment_status", in="query", @OA\Schema(type="string")),
     *     @OA\Response(response=200, description="List of payments")
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $query = FeePayment::with(['user', 'feeHead']);
        if ($request->has('user_id')) {
            $query->where('user_id', $request->user_id);
        }
        if ($request->has('fee_head_id')) {
            $query->where('fee_head_id', $request->fee_head_id);
        }
        if ($request->has('payment_status')) {
            $query->where('payment_status', $request->payment_status);
        }
        return $this->paginatedWithMap($query->orderBy('created_at', 'desc')->paginate($request->input('per_page', 15)), 'passthrough');
    }

    /**
     * @OA\Post(
     *     path="/fee-payments",
     *     summary="Create fee payment",
     *     tags={"Fees"},
     *     security={{"cookieAuth":{}}},
     *     @OA\RequestBody(required=true, @OA\JsonContent(
     *         required={"user_id", "fee_head_id", "amount"},
     *         @OA\Property(property="user_id", type="integer"),
     *         @OA\Property(property="fee_head_id", type="integer"),
     *         @OA\Property(property="amount", type="number"),
     *         @OA\Property(property="late_fee_applied", type="number"),
     *         @OA\Property(property="payment_mode", type="string")
     *     )),
     *     @OA\Response(response=201, description="Payment record created")
     * )
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'fee_head_id' => 'required|exists:fee_heads,id',
            'amount' => 'required|numeric|min:0',
            'late_fee_applied' => 'nullable|numeric|min:0',
            'payment_mode' => 'nullable|string|max:50|in:cash,online,cheque,dd,split',
            'cash_amount' => 'nullable|numeric|min:0',
            'online_amount' => 'nullable|numeric|min:0',
            'online_transaction_id' => 'nullable|required_with:online_amount|string|max:100',
            'cheque_number' => 'nullable|string|max:50',
            'bank_name' => 'nullable|string|max:100',
            'cheque_date' => 'nullable|date',
        ]);
        $validated['payment_id'] = 'PAY' . date('Ymd') . str_pad(FeePayment::count() + 1, 6, '0', STR_PAD_LEFT);
        $validated['total_amount'] = $validated['amount'] + ($validated['late_fee_applied'] ?? 0);

        // Auto-derive payment_mode from split amounts
        $cash = $validated['cash_amount'] ?? 0;
        $online = $validated['online_amount'] ?? 0;
        if (!isset($validated['payment_mode']) || empty($validated['payment_mode'])) {
            if ($cash > 0 || $online > 0) {
                $validated['payment_mode'] = ($cash > 0 && $online > 0) ? 'split' : ($online > 0 ? 'online' : 'cash');
            }
        }

        return $this->created(FeePayment::create($validated));
    }

    /**
     * @OA\Get(
     *     path="/fee-payments/{id}",
     *     summary="Get payment",
     *     tags={"Fees"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Payment details")
     * )
     */
    public function show(FeePayment $feePayment): JsonResponse
    {
        return $this->successWithMap($feePayment->load(['user', 'feeHead', 'collectedBy']), 'passthrough');
    }

    /**
     * @OA\Post(
     *     path="/fee-payments/{id}/confirm",
     *     summary="Confirm payment",
     *     tags={"Fees"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\RequestBody(required=true, @OA\JsonContent(
     *         required={"transaction_id"},
     *         @OA\Property(property="transaction_id", type="string")
     *     )),
     *     @OA\Response(response=200, description="Payment confirmed")
     * )
     */
    public function confirm(Request $request, FeePayment $feePayment): JsonResponse
    {
        $validated = $request->validate([
            'transaction_id' => 'required|string|max:100',
            'cash_amount' => 'nullable|numeric|min:0',
            'online_amount' => 'nullable|numeric|min:0',
            'online_transaction_id' => 'nullable|string|max:100',
            'cheque_number' => 'nullable|string|max:50',
            'bank_name' => 'nullable|string|max:100',
            'cheque_date' => 'nullable|date',
        ]);

        $updateData = [
            'payment_status' => 'paid',
            'transaction_id' => $validated['transaction_id'],
            'payment_date' => now(),
            'collected_by' => $request->user()->id,
        ];

        if (isset($validated['cash_amount']))
            $updateData['cash_amount'] = $validated['cash_amount'];
        if (isset($validated['online_amount']))
            $updateData['online_amount'] = $validated['online_amount'];
        if (isset($validated['online_transaction_id']))
            $updateData['online_transaction_id'] = $validated['online_transaction_id'];

        $feePayment->update($updateData);

        $saleService = app(InventorySaleService::class);
        $saleService->confirmPayment($feePayment);

        return $this->successWithMap($feePayment->fresh(['user', 'feeHead', 'collectedBy']), 'passthrough', 'Payment confirmed');
    }

    /**
     * @OA\Delete(
     *     path="/fee-payments/{id}",
     *     summary="Delete payment",
     *     tags={"Fees"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Payment deleted")
     * )
     */
    public function destroy(FeePayment $feePayment): JsonResponse
    {
        $feePayment->delete();
        return $this->success(null, 'Payment record deleted');
    }
}
