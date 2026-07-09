<?php

namespace App\Http\Controllers\Api\V1\StudentDashboard;

use App\Support\EffectiveStudentContext;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\AdmissionApplication;
use App\Http\Controllers\Api\V1\BaseController;

class StudentDashboardController extends BaseController
{

    /**
     * @OA\Get(
     * path="/student/applications",
     * summary="Get logged-in student's admission applications",
     * tags={"Student Panel"},
     * security={{"cookieAuth":{}}},
     * @OA\Response(
     * response=200,
     * description="Success",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=true),
     * @OA\Property(property="data", type="array", @OA\Items(
     *   @OA\Property(property="id", type="integer", example=1),
     *   @OA\Property(property="application_no", type="string", example="#00000004"),
     *   @OA\Property(property="application_date", type="string", example="01 Jan, 2025"),
     *   @OA\Property(property="applied_for", type="string", example="new"),
     *   @OA\Property(property="session", type="string", example="2025-2029"),
     *   @OA\Property(property="semester", type="string", example="SEM I"),
     *   @OA\Property(property="admission_head", type="string", example="B.Sc. Admission 2025"),
     *   @OA\Property(property="applicant_name", type="string", example="John Doe"),
     *   @OA\Property(property="amount", type="number", format="float", example=500.00),
     *   @OA\Property(property="payment_status", type="string", example="success"),
     *   @OA\Property(property="process_status", type="string", example="approved"),
     *   @OA\Property(property="submitted_at", type="string", example="01 Jan, 2025"),
     *   @OA\Property(property="can_download", type="boolean", example=true)
     * ))
     * )
     * )
     * )
     */

    public function myApplications(Request $request)
    {
        $user = EffectiveStudentContext::getEffectiveUser(auth()->user());
        if (! $user) {
            return $this->error('Unauthorized.', 401);
        }

        // Fetch all applications of the effective student with related admission head info
        $applications = AdmissionApplication::where('user_id', $user->id)
            ->with(['admissionHead'])
            ->latest()
            ->paginate($request->input('per_page', 15)) // 👈 IMPORTANT

            ->through(function ($app) {
                return [
                    'id' => $app->id,
                    'application_no' => $app->application_id, // Format: #00000004 
                    'application_date' => $app?->created_at?->format('d M, Y'),
                    'applied_for' => $app->application_type ?? 'N/A', // new, readmission
                    'session' => $app->session_name,   // e.g., 2025-2029 
                    'semester' => $app->semester,       // e.g., SEM I 
                    'admission_head' => $app->admissionHead->title,
                    'applicant_name' => $app->applicant_name,
                    'amount' => $app->amount,
                    'payment_status' => $app->payment_status, // pending, success , failed
                    'process_status' => $app->process_status, // pending, approved, denied , cancelled
                                       'submitted_at' => $app->submitted_at ? \Carbon\Carbon::parse($app->submitted_at)->format('d M, Y') : ($app->created_at ? \Carbon\Carbon::parse($app->created_at)->format('d M, Y') : 'N/A'),

                    'can_download' => $app->payment_status === 'success', // PDF download only if payment successful
                ];
            });

        return $this->paginatedWithMap($applications, 'application_index', "Your applications retrieved successfully.");
    }
}

