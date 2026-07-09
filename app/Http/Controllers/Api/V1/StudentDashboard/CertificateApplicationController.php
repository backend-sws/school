<?php

namespace App\Http\Controllers\Api\V1\StudentDashboard;

use Illuminate\Support\Str;
use App\Enums\PaymentStatus;
use App\Enums\ProcessStatus;
use App\Enums\PublishStatus;
use Illuminate\Http\Request;
use App\Models\CertificateHead;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\CertificateApplication;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Api\V1\BaseController;

class CertificateApplicationController extends BaseController
{
    /**
     * Submit Certificate Application with Reviewed Snapshots
     */


    /**
     * @OA\Post(
     * path="/student/certificate/submit",
     * summary="Submit Certificate Application with Snapshots",
     * description="Submits a certificate request by capturing snapshots of academic, address, and subject data as reviewed by the student.",
     * tags={"Student Dashboard Certificates"},
     * security={{"sanctum":{}}},
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"certificate_head_id", "purpose", "academic_info", "permanent_address", "subjects_taken"},
     * @OA\Property(property="certificate_head_id", type="integer", example=1),
     * @OA\Property(property="purpose", type="string", example="Required for higher studies admission"),
     * @OA\Property(property="dob_proof_url", type="string", nullable=true, example="https://r2.storage.com/path/to/doc.pdf"),
     * @OA\Property(
     * property="academic_info", 
     * type="object", 
     * example={"institute_name": "Zytrixon College", "class": "B.Sc", "roll_number": "123"}
     * ),
     * @OA\Property(
     * property="permanent_address", 
     * type="object", 
     * example={"village_mohalla": "Main Road", "post_office": "Town", "pincode": "800001"}
     * ),
     * @OA\Property(
     * property="subjects_taken", 
     * type="array", 
     * @OA\Items(type="object", example={"id": 5, "name": "Mathematics", "code": "MAT101"})
     * ),
     * @OA\Property(
     * property="custom_data", 
     * type="object", 
     * nullable=true, 
     * example={"reason_for_late": "Medical issue", "graduation_year": "2025"}
     * )
     * )
     * ),
     * @OA\Response(
     * response=201,
     * description="Application submitted successfully",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=true),
     * @OA\Property(property="message", type="string", example="Certificate application submitted successfully."),
     * @OA\Property(property="data", type="object",
     * @OA\Property(property="application_id", type="string", example="CERT-2026-ABC123"),
     * @OA\Property(property="amount", type="number", format="float", example=500.00),
     * @OA\Property(property="is_payment_required", type="boolean", example=true)
     * )
     * )
     * ),
     * @OA\Response(
     * response=422,
     * description="Validation Error",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=false),
     * @OA\Property(property="message", type="string", example="The purpose field is required.")
     * )
     * )
     * )
     */

    public function submitCertificateApplication(Request $request)
    {
        // 1. Validation
        $validator = Validator::make($request->all(), [
            'certificate_head_id' => 'required|exists:certificate_heads,id',
            'purpose' => 'required|string|max:500',
            'dob_proof_url' => 'nullable|string',
            'academic_info' => 'required|array',
            'permanent_address' => 'required|array',
            'subjects_taken' => 'required|array',
            'custom_data' => 'nullable|array'
        ]);

        if ($validator->fails()) {
            return $this->error($validator->errors()->first(), 422, $validator->errors());
        }

        $user = Auth::user();
        $head = CertificateHead::findOrFail($request->certificate_head_id);

        return DB::transaction(function () use ($request, $user, $head) {

            // 2. Unique Application ID (CERT-2026-XXXX)
            $applicationId = 'CERT-' . date('Y') . '-' . strtoupper(Str::random(6));
            // 3. Create Application
            $application = CertificateApplication::create([
                'application_id' => $applicationId,
                'user_id' => $user->id,
                'certificate_head_id' => $head->id,
                'purpose' => $request->purpose,
                'amount' => $head->fee_amount,
                'payment_status' => $head->fee_amount > 0 ? PaymentStatus::PENDING->value : PaymentStatus::NOT_APPLICABLE->value,
                'process_status' => ProcessStatus::PENDING->value,
                'dob_proof_url' => $request->dob_proof_url,
                // Saving the Reviewed Snapshots (JSON format)
                'custom_fields_data' => $request->custom_data,
                'academic_info_snapshot' => $request->academic_info,
                'permanent_address_snapshot' => $request->permanent_address,
                'subjects_taken_snapshot' => $request->subjects_taken,

                'serial_no' => null, // Will be generated upon approval
                'submitted_at' => now(),
            ]);

            return $this->success([
                'application_id' => $application->application_id,
                'amount' => $application->amount,
                'is_payment_required' => $application->amount > 0,
                'message' => "Certificate application submitted successfully."
            ], 201);
        });
    }






    /**
     * Get list of all certificate applications with download permission check
     */

 
    /**
     * @OA\Get(
     * path="/student/certificate/my-applications",
     * summary="Get list of student's certificate applications",
     * description="Returns a history of all certificates applied by the authenticated student along with their payment and processing status.",
     * tags={"Student Dashboard Certificates"},
     * security={{"CookieAuth":{}}},
     * @OA\Response(
     * response=200,
     * description="Applications list retrieved successfully",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=true),
     * @OA\Property(
     * property="data", 
     * type="array", 
     * @OA\Items(
     * @OA\Property(property="id", type="integer", example=101),
     * @OA\Property(property="application_id", type="string", example="CERT-2026-X123Y"),
     * @OA\Property(property="certificate_name", type="string", example="Transfer Certificate (T.C.)"),
     * @OA\Property(property="amount", type="number", format="float", example=250.00),
     * @OA\Property(property="payment_status", type="string", example="success", description="Values: pending, success, failed, not_applicable"),
     * @OA\Property(property="process_status", type="string", example="pending", description="Values: pending, under_review, approved, rejected, completed"),
     * @OA\Property(property="serial_no", type="string", nullable=true, example="TC/2026/0045"),
     * @OA\Property(property="remarks", type="string", nullable=true, example="Please upload a clearer DOB proof."),
     * @OA\Property(property="submitted_at", type="string", example="09-02-2026 05:15 PM"),
     * @OA\Property(property="completed_at", type="string", nullable=true, example="12-02-2026 11:30 AM"),
     * @OA\Property(property="can_download", type="boolean", example=true, description="True if status is completed, serial_no exists, and web_download is allowed"),
     * )
     * )
     * )
     * ),
     * @OA\Response(
     * response=401,
     * description="Unauthenticated"
     * )
     * )
     */
   public function myApplications(Request $request)
{
    $user = Auth::user();

    $applications = CertificateApplication::with('certificateHead:id,title')
        ->where('user_id', $user->id)
        ->orderBy('submitted_at', 'desc')
        ->paginate($request->input('per_page', 15)) // 👈 IMPORTANT
        ->through(function ($app) {

            $canDownload = (
                $app->process_status === ProcessStatus::COMPLETED && 
                !empty($app->serial_no) && 
                (bool) $app->web_certificate_allowed === true
            );

            return [
                'id' => $app->id,
                'application_id' => $app->application_id,
                'certificate_name' => $app->certificateHead->title ?? 'N/A',
                'amount' => $app->amount,
                'payment_status' => $app->payment_status,
                'process_status' => $app->process_status,
                'serial_no' => $app->serial_no,
                'remarks' => $app->remarks,
                'submitted_at' => $app->submitted_at?->format('d-m-Y h:i A'),
                'completed_at' => $app->completed_at?->format('d-m-Y h:i A'),
                'can_download' => $canDownload,
            ];
        });

    return $this->paginatedWithMap($applications, 'passthrough');
}

}
