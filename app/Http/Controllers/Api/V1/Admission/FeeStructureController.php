<?php

namespace App\Http\Controllers\Api\V1\Admission;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\AdmissionHead;
use App\Models\FeeStructureRule;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @OA\Schema(
 *     schema="FeeStructure",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="admission_head_id", type="integer"),
 *     @OA\Property(property="fee_type", type="string"),
 *     @OA\Property(property="amount", type="number"),
 *     @OA\Property(property="category", type="string"),
 *     @OA\Property(property="gender", type="string")
 * )
 */
class FeeStructureController extends BaseController
{
    /**
     * List fee structures for admission head (unified fee_structures, scope_type=admission_head).
     */
    public function index(AdmissionHead $admissionHead): JsonResponse
    {
        $structures = FeeStructureRule::where('scope_type', FeeStructureRule::SCOPE_ADMISSION_HEAD)
            ->where('scope_id', $admissionHead->id)
            ->whereHas('feeType')
            ->with('feeType')
            ->get()
            ->map(fn ($s) => [
                'id' => $s->id,
                'admission_head_id' => $admissionHead->id,
                'fee_type' => $s->feeType?->name ?? 'Fee',
                'fee_type_id' => $s->fee_type_id,
                'amount' => (float) $s->amount,
                'category' => 'all',
                'gender' => 'all',
            ]);

        return $this->success($structures);
    }

    // /**
    //  * @OA\Post(
    //  *     path="/admission-heads/{admission_head}/fee-structures",
    //  *     summary="Create fee structure",
    //  *     tags={"Admission"},
    //  *     security={{"cookieAuth":{}}},
    //  *     @OA\Parameter(name="admission_head", in="path", required=true, @OA\Schema(type="integer")),
    //  *     @OA\RequestBody(required=true, @OA\JsonContent(
    //  *         required={"fee_type", "amount"},
    //  *         @OA\Property(property="fee_type", type="string"),
    //  *         @OA\Property(property="amount", type="number"),
    //  *         @OA\Property(property="category", type="string", default="all"),
    //  *         @OA\Property(property="gender", type="string", default="all")
    //  *     )),
    //  *     @OA\Response(response=201, description="Fee structure created")
    //  * )
    //  */
    // public function store(Request $request, AdmissionHead $admissionHead): JsonResponse
    // {
    //     $validated = $request->validate([
    //         'fee_type' => 'required|string|max:100',
    //         'amount' => 'required|numeric|min:0',
    //         'category' => 'nullable|string|max:50',
    //         'gender' => 'nullable|string|max:20',
    //     ]);
    //     $validated['admission_head_id'] = $admissionHead->id;
    //     return $this->created(FeeStructure::create($validated));
    // }

    // /**
    //  * @OA\Delete(
    //  *     path="/fee-structures/{id}",
    //  *     summary="Delete fee structure",
    //  *     tags={"Admission"},
    //  *     security={{"cookieAuth":{}}},
    //  *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
    //  *     @OA\Response(response=200, description="Fee structure deleted")
    //  * )
    //  */
    // public function destroy(FeeStructure $feeStructure): JsonResponse
    // {
    //     $feeStructure->delete();
    //     return $this->success(null, 'Fee structure deleted');
    // }
}
