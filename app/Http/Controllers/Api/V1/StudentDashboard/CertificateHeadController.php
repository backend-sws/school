<?php

namespace App\Http\Controllers\Api\V1\StudentDashboard;

use App\Http\Controllers\Api\V1\BaseController;
use App\Http\Controllers\Controller;
use App\Models\CertificateHead;
use App\Support\EffectiveStudentContext;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CertificateHeadController extends BaseController
{
    /**
     * @OA\Get(
     * path="/student/certificate/list",
     * summary="Get all certificates based on student's stream",
     * tags={"Student Dashboard Certificates"},
     * security={{"cookieAuth":{}}},
     * @OA\Response(response=200, description="List of available certificates")
     * )
     */
    public function getAvailableCertificates()
    {
        $user = EffectiveStudentContext::getEffectiveUser(Auth::user());
        if (! $user) {
            return $this->error('No student context available.', 422);
        }
        $profile = $user->studentProfile;

        if (!$profile) {
            return $this->error("Student profile not found.", 404);
        }

        $certificateHeads = CertificateHead::where('status', 1)
            ->where(function ($query) use ($profile) {
                $query->where('stream_id', $profile->stream_id)
                    ->orWhereNull('stream_id');
            })
            ->get(['id', 'title', 'description', 'fee_amount', 'web_certificate_required']);

        return $this->success($certificateHeads);
    }

    /**
     * @OA\Get(
     * path="/student/certificate/details/{id}",
     * summary="Get details of a specific certificate",
     * tags={"Student Dashboard Certificates"},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="Certificate details")
     * )
     */
    public function getCertificateDetails($id)
    {
        $user = EffectiveStudentContext::getEffectiveUser(Auth::user());
        if (! $user) {
            return $this->error('No student context available.', 422);
        }
        $profile = $user->studentProfile;

        if (!$profile) {
            return $this->error("Student profile not found.", 404);
        }

        $head = CertificateHead::findOrFail($id);

        // 1. Academic Info (Latest 10th/12th/Graduation data)
        $academicInfo = $user->academicInfo; 

        // 2. Permanent Address
        $permanentAddress = $profile->addresses()
            ->where('address_type', 'permanent')
            ->first();

        // 3. Subjects Taken (for dynamic fields if needed)
        $subjects = $profile->subject()->get(['id', 'name', 'code']);

        return $this->success([
            'certificate_info' => [
                'id' => $head->id,
                'title' => $head->title,
                'description' => $head->description,
                'amount' => $head->fee_amount,
                'web_certificate_required' => $head->web_certificate_required,
                'custom_fields' => $head->custom_fields,
                'processing_days' => $head->processing_days,
            ],
            'prefill_data' => [
                'academic_info' => $academicInfo,
                'permanent_address' => $permanentAddress,
                'subjects' => $subjects,
            ]
        ]);
    }
}
