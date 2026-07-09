<?php
namespace App\Http\Controllers\Api\V1\Certificates;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\CertificateApplication;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * @OA\Tag(name="Admin: Certificate Applications", description="Admin operations for student certificate requests")
 */
class CertificateApplicationController extends BaseController
{
    /**
     * @OA\Get(
     * path="/certificate-applications",
     * summary="List all certificate applications with UI filters",
     * tags={"Certificate Applications"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="certificate_head_id", in="query", @OA\Schema(type="integer"), description="Filter by Applied For (Certificate Type)"),
     * @OA\Parameter(name="status", in="query", @OA\Schema(type="string", enum={"pending", "approved", "rejected"}), description="Process status"),
     * @OA\Parameter(name="payment_status", in="query", @OA\Schema(type="string", enum={"pending", "success", "failed"}), description="Payment status"),
     * @OA\Parameter(name="search_by", in="query", @OA\Schema(type="string", enum={"app_id", "name", "mobile", "email"})),
     * @OA\Parameter(name="search_text", in="query", @OA\Schema(type="string")),
     * @OA\Response(response=200, description="Paginated applications")
     * )
     */
    public function index(Request $request): JsonResponse
    {

        $query = CertificateApplication::with(['user.studentProfile', 'certificateHead', 'transaction']);


        // Filter: Applied For (Certificate Type)
        $query->when($request->filled('certificate_head_id'), function ($q) use ($request) {
            return $q->where('certificate_head_id', $request->certificate_head_id);
        });

        // Filter: Status (Pending, Approved, Rejected)
        $query->when($request->filled('status'), fn($q) => $q->where('process_status', $request->status));

        // Filter: Payment Status
        $query->when($request->filled('payment_status'), fn($q) => $q->where('payment_status', $request->payment_status));

        $query->when($request->filled('search_text'), function ($q) use ($request) {
            $text = $request->search_text;
            switch ($request->search_by) {
                case 'app_id':
                    return $q->where('application_id', 'like', "%$text%");
                case 'name':
                    return $q->where('applicant_name', 'like', "%$text%");
                case 'mobile':
                    return $q->where('mobile', 'like', "%$text%");
                case 'email':
                    return $q->where('email', 'like', "%$text%");
            }
        });


        return $this->paginatedWithMap(
            $query->orderBy('submitted_at', 'desc')->paginate($request->input('per_page', 15)),
            'passthrough'
        );
    }

    /**
     * @OA\Patch(
     * path="/certificate-applications/{id}/toggle-download",
     * summary="Allow or restrict Web Certificate download",
     * tags={"Certificate Applications"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="Download permission updated")
     * )
     */
    public function toggleDownload(int $id): JsonResponse
    {
        $application = CertificateApplication::findOrFail($id);

        $application->update([
            'web_certificate_allowed' => !$application->web_certificate_allowed
        ]);

        $statusLabel = $application->web_certificate_allowed ? 'Allowed' : 'Not Allowed Yet';
        return $this->successWithMap($application, 'passthrough', "Web Certificate download is now: " . $statusLabel);
    }

    /**
     * @OA\Post(
     * path="/certificate-applications/{id}/process",
     * summary="Process certificate application (Approve/Reject)",
     * tags={"Certificate Applications"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\RequestBody(required=true, @OA\JsonContent(
     * @OA\Property(property="status", type="string", enum={"approved", "rejected"}),
     * @OA\Property(property="remarks", type="string")
     * )),
     * @OA\Response(response=200, description="Process status updated")
     * )
     */
    public function process(Request $request, int $id): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:approved,rejected',
            'remarks' => 'nullable|string|max:500',
        ]);

        $application = CertificateApplication::findOrFail($id);

        $application->update([
            'process_status' => $validated['status'],
            'remarks' => $validated['remarks'],
            'issued_by' => $request->user()->id,
            'completed_at' => now(),
        ]);

        return $this->successWithMap($application, 'passthrough', "Application has been marked as " . $validated['status']);
    }



    /**
     * @OA\Get(
     * path="/certificate-applications/{id}/edit",
     * summary="Get certificate application data for editing",
     * tags={"Certificate Applications"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="Application data fetched successfully")
     * )
     */
    public function edit($id): JsonResponse
    {

        $application = CertificateApplication::with(['user.studentProfile', 'certificateHead'])
            ->findOrFail($id);

        return $this->successWithMap($application, 'passthrough');
    }

    /**
     * @OA\Put(
     * path="/certificate-applications/{id}",
     * summary="Update student-filled fields in a certificate application",
     * description="Allows Admin to correct or update any field, including nested JSON data like address and academic info.",
     * tags={"Certificate Applications"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * @OA\Property(property="applicant_name", type="string", example="Rahul Kumar"),
     * @OA\Property(property="purpose", type="string", example="Required for higher studies"),
     * @OA\Property(property="dob_proof_url", type="string", example="https://storage.com/doc.pdf"),
     * @OA\Property(
     * property="academic_info", 
     * type="object",
     * @OA\Property(property="institute_name", type="string", example="Zytrixon College"),
     * @OA\Property(property="class", type="string", example="B.Sc"),
     * @OA\Property(property="roll_number", type="string", example="123")
     * ),
     * @OA\Property(
     * property="permanent_address", 
     * type="object",
     * @OA\Property(property="village_mohalla", type="string", example="Main Road"),
     * @OA\Property(property="post_office", type="string", example="Town"),
     * @OA\Property(property="pincode", type="string", example="800001")
     * ),
     * @OA\Property(
     * property="subjects_taken", 
     * type="array",
     * @OA\Items(
     * @OA\Property(property="id", type="integer"),
     * @OA\Property(property="name", type="string"),
     * @OA\Property(property="code", type="string")
     * )
     * ),
     * @OA\Property(
     * property="custom_data", 
     * type="object",
     * @OA\Property(property="reason_for_late", type="string"),
     * @OA\Property(property="graduation_year", type="string")
     * )
     * )
     * ),
     * @OA\Response(response=200, description="Application updated successfully"),
     * @OA\Response(response=422, description="Validation error")
     * )
     */
    public function update(Request $request, $id): JsonResponse
    {
        $application = CertificateApplication::findOrFail($id);

        $validated = $request->validate([
            'applicant_name' => 'sometimes|string|max:150',
            'purpose' => 'sometimes|string|max:500',
            'dob_proof_url' => 'nullable|string',
            'academic_info' => 'sometimes|array',
            'permanent_address' => 'sometimes|array',
            'subjects_taken' => 'sometimes|array',
            'custom_data' => 'sometimes|array',
            'remarks' => 'nullable|string'
        ]);

        return DB::transaction(function () use ($application, $validated) {

            // Updating standard fields and JSON columns
            $application->update([
                'applicant_name' => $validated['applicant_name'] ?? $application->applicant_name,
                'purpose' => $validated['purpose'] ?? $application->purpose,
                'dob_proof_url' => $validated['dob_proof_url'] ?? $application->dob_proof_url,

                // Mapping permanent_address to your address_snapshot column
                'address_snapshot' => $validated['permanent_address'] ?? $application->address_snapshot,

                // Mapping subjects_taken to your subject_preferences column
                'subject_preferences' => $validated['subjects_taken'] ?? $application->subject_preferences,

                // Storing academic_info and custom_data inside raw_response JSON
                'raw_response' => array_merge(
                    (array) $application->raw_response,
                    [
                        'academic_info' => $validated['academic_info'] ?? ($application->raw_response['academic_info'] ?? []),
                        'custom_data' => $validated['custom_data'] ?? ($application->raw_response['custom_data'] ?? [])
                    ]
                ),
                'remarks' => $validated['remarks'] ?? $application->remarks
            ]);

            return $this->successWithMap($application, 'passthrough', 'Certificate application details updated by Admin.');
        });
    }
}