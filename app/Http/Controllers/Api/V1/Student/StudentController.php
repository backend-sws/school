<?php

namespace App\Http\Controllers\Api\V1\Student;

use App\Models\User;
use App\Models\Stream;
use Illuminate\Http\Request;
use App\Models\StudentProfile;
use Illuminate\Http\JsonResponse;
use App\Services\StudentDashboardService;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Api\V1\BaseController;
use App\Support\InstitutionContext;
use App\Support\VerificationToken;

/**
 * @OA\Schema(
 *     schema="StudentProfile",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="user_id", type="integer"),
 *     @OA\Property(property="stream_id", type="integer"),
 *     @OA\Property(property="reg_no", type="string"),
 *     @OA\Property(property="roll_no", type="string"),
 *     @OA\Property(property="current_semester", type="integer"),
 *     @OA\Property(property="verified", type="boolean")
 * )
 */
class StudentController extends BaseController
{


    protected $dashboardService;

    // Dependency Injection
    public function __construct(StudentDashboardService $dashboardService)
    {
        $this->dashboardService = $dashboardService;
    }
    /**
     * @OA\Get(
     *     path="/students",
     *     summary="List students",
     *     tags={"Students"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Parameter(name="stream_id", in="query", @OA\Schema(type="integer")),
     *     @OA\Parameter(name="verified", in="query", @OA\Schema(type="boolean")),
     *     @OA\Response(response=200, description="List of students")
     * )
     */
    public function index(Request $request): JsonResponse
    {
        $query = StudentProfile::with(['user', 'stream']);
        if ($request->has('stream_id')) {
            $query->where('stream_id', $request->stream_id);
        }
        if ($request->has('verified')) {
            $query->where('verified', $request->boolean('verified'));
        }
        return $this->paginatedWithMap($query->paginate($request->input('per_page', 15)), 'passthrough');
    }

    /**
     * @OA\Post(
     *     path="/students",
     *     summary="Create student profile",
     *     tags={"Students"},
     *     security={{"cookieAuth":{}}},
     *     @OA\RequestBody(required=true, @OA\JsonContent(
     *         required={"user_id", "stream_id", "session_id"},
     *         @OA\Property(property="user_id", type="integer"),
     *         @OA\Property(property="stream_id", type="integer"),
     *         @OA\Property(property="session_id", type="integer"),
     *         @OA\Property(property="reg_no", type="string"),
     *         @OA\Property(property="roll_no", type="string"),
     *         @OA\Property(property="father_name", type="string"),
     *         @OA\Property(property="mother_name", type="string")
     *     )),
     *     @OA\Response(response=201, description="Student created")
     * )
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'user_id' => 'required|exists:users,id|unique:student_profiles',
            'stream_id' => 'required|exists:streams,id',
            'session_id' => 'required|exists:academic_sessions,id',
            'reg_no' => 'nullable|string|max:50|unique:student_profiles',
            'roll_no' => 'nullable|string|max:50',
            'father_name' => 'nullable|string|max:150',
            'mother_name' => 'nullable|string|max:150',
            'dob' => 'nullable|date',
            'gender' => 'nullable|string|max:20',
            'category' => 'nullable|string|max:30',
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }

        return $this->created(StudentProfile::create($validator->validated()));
    }

    /**
     * @OA\Get(
     *     path="/students/{id}",
     *     summary="Get student",
     *     tags={"Students"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Student details")
     * )
     */
    public function show(StudentProfile $student): JsonResponse
    {
        $student->load(['user', 'user.documents', 'stream', 'session']);

        $transport = \App\Models\TransportAssignment::where('user_id', $student->user_id)
            ->where('institution_id', $student->institution_id)
            ->whereNull('effective_until')
            ->first();

        $hostel = \App\Models\HostelAllocation::where('user_id', $student->user_id)
            ->where('institution_id', $student->institution_id)
            ->where('status', 'active')
            ->whereNull('check_out_date')
            ->first();

        $student->setAttribute('transport_id', $transport ? $transport->id : null);
        $student->setAttribute('hostel_id', $hostel ? $hostel->id : null);

        return $this->successWithMap($student, 'passthrough');
    }

    /*
     * Update student details
     */

    /**
     * @OA\Put(
     * path="/students/{id}",
     * summary="Update Student full details",
     * tags={"Students"},
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="User ID",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"name", "email", "mobile"},
     * @OA\Property(property="name", type="string", example="Student 48"),
     * @OA\Property(property="email", type="string", format="email", example="student48@example.com"),
     * @OA\Property(property="mobile", type="string", example="9876543248"),
     * @OA\Property(property="photo_url", type="string", example="https://example.com/photos/student48.jpg"),
     * @OA\Property(
     * property="student_profile",
     * type="object",
     * @OA\Property(property="stream_id", type="integer", example="1"),  
     * @OA\Property(property="session_id", type="integer", example="1"),
     * @OA\Property(property="subject_id", type="integer", example="1"),
     * @OA\Property(property="reg_no", type="string", example="REG-48"),
     * @OA\Property(property="father_name", type="string", example="Father Name 48"),
     * @OA\Property(property="father_mobile", type="string", example="9988776648"),
     * @OA\Property(property="father_qualification", type="string", example="Graduate"),
     * @OA\Property(property="father_occupation", type="string", example="Business"),
     * @OA\Property(property="mother_name", type="string", example="Mother Name 48"),
     * @OA\Property(property="dob", type="string", format="date", example="2005-01-01"),
     * @OA\Property(property="gender", type="string", example="Male"),
     * @OA\Property(property="aadhar_no", type="string", example="197538039803"),
     * @OA\Property(property="current_semester", type="integer", example=1),
     * @OA\Property(property="is_differently_abled", type="boolean", example=true),
     * @OA\Property(property="caste", type="string", example="Bharatiya"),
     * @OA\Property(property="category", type="string", example="General"),
     * @OA\Property(property="nationality", type="string", example="Indian"),
     * @OA\Property(property="blood_group", type="string", example="A+"),
     * @OA\Property(property="roll_no", type="string", example="145-2026-48"),
     * 
     * @OA\Property(
     * property="permanent_address",
     * type="object",
     * @OA\Property(property="village_mohalla", type="string", example="Village 48"),
     * @OA\Property(property="district", type="string", example="District 5"),
     * @OA\Property(property="state", type="string", example="Bihar"),
     * @OA\Property(property="pincode", type="string", example="848628"),
     * @OA\Property(property="post_office", type="string", example="patna city"),
     * @OA\Property(property="police_station", type="string", example="patna"),
     * ),
     * @OA\Property(
     * property="correspondence_address",
     * type="object",
     * @OA\Property(property="village_mohalla", type="string", example="Village 48"),
     * @OA\Property(property="district", type="string", example="District 3"),
     * @OA\Property(property="state", type="string", example="Bihar"),
     * @OA\Property(property="pincode", type="string", example="846476"),
     * @OA\Property(property="post_office", type="string", example="patna city"),
     * @OA\Property(property="police_station", type="string", example="patna"), 
     * )
     * )
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Student details updated successfully",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=true),
     * @OA\Property(property="message", type="string", example="Candidate details updated successfully")
     * )
     * ),
     * @OA\Response(
     * response=422,
     * description="Validation Error"
     * ),
     * @OA\Response(
     * response=500,
     * description="Internal Server Error"
     * )
     * )
     */


    public function update(Request $request, $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            // User Fields
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'mobile' => 'required|digits:10|unique:users,mobile,' . $id,
            'password' => 'nullable|string|min:6|confirmed',
            'photo_url' => 'nullable|url',


            // Profile Fields
            'student_profile.reg_no' => 'nullable|string',
            // 'student_profile.main_stream_id' => 'nullable|exists:main_streams,id',
            'student_profile.stream_id' => 'nullable|exists:streams,id',
            'student_profile.session_id' => 'nullable|exists:academic_sessions,id',
            'student_profile.subject_id' => 'nullable|exists:subjects,id',
            'student_profile.roll_no' => 'nullable|string',
            'student_profile.current_semester' => 'nullable|integer|between:1,12',
            'student_profile.father_name' => 'nullable|string|max:255',
            'student_profile.mother_name' => 'nullable|string|max:255',
            'student_profile.dob' => 'nullable|date',
            'student_profile.gender' => 'nullable|string|in:Male,Female,Other',
            'student_profile.aadhar_no' => 'nullable|digits:12',
            'student_profile.nationality' => 'nullable|string',
            'student_profile.blood_group' => 'nullable|string',
            'student_profile.marital_status' => 'nullable|string',
            'student_profile.is_differently_abled' => 'nullable|boolean',
            'student_profile.caste' => 'nullable|string',
            'student_profile.category' => 'nullable|string',
            'student_profile.father_mobile' => 'nullable|string|max:20',
            'student_profile.father_qualification' => 'nullable|string',
            'student_profile.father_occupation' => 'nullable|string',
            'student_profile.medical_condition' => 'nullable|string',
            'student_profile.allergy' => 'nullable|string',
            'student_profile.previous_school_name' => 'nullable|string',
            'student_profile.previous_roll_no' => 'nullable|string',
            'student_profile.previous_board' => 'nullable|string',
            'student_profile.previous_marks' => 'nullable|numeric',
            'student_profile.has_tc' => 'nullable|boolean',
            'student_profile.has_government_portal' => 'nullable|boolean',
            'student_profile.government_portal_name' => 'nullable|string',
            'student_profile.abc_no' => 'nullable|string',
            'student_profile.apaar_id' => 'nullable|string',
            'student_profile.disability_type' => 'nullable|string',
            'student_profile.religion' => 'nullable|string',
            'student_profile.guardian_snapshot' => 'nullable|array',


            // Permanent Address Validation
            'student_profile.permanent_address.village_mohalla' => 'nullable|string',
            'student_profile.permanent_address.post_office' => 'nullable|string',
            'student_profile.permanent_address.police_station' => 'nullable|string',
            'student_profile.permanent_address.district' => 'nullable|string',
            'student_profile.permanent_address.state' => 'nullable|string',
            'student_profile.permanent_address.pincode' => 'nullable|digits:6',

            // Correspondence Address Validation
            'student_profile.correspondence_address.village_mohalla' => 'nullable|string',
            'student_profile.correspondence_address.post_office' => 'nullable|string',
            'student_profile.correspondence_address.police_station' => 'nullable|string',
            'student_profile.correspondence_address.district' => 'nullable|string',
            'student_profile.correspondence_address.state' => 'nullable|string',
            'student_profile.correspondence_address.pincode' => 'nullable|digits:6',

        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }
        $collegeId = InstitutionContext::getActiveInstitutionId($request->user());
        $candidateDetails = $this->dashboardService->updateCandidateDetails($id, $request->all(), $collegeId);
        if ($candidateDetails === null) {
            return $this->notFound('Candidate not found or does not belong to this institution.');
        }
        return $this->success($candidateDetails, 'Candidate details updated successfully');
    }

    /**
     * @OA\Post(
     *     path="/students/resend-verification",
     *     summary="Resend verification email (set-password link) to student",
     *     tags={"Students"},
     *     security={{"cookieAuth":{}}},
     *     @OA\RequestBody(required=true, @OA\JsonContent(
     *         required={"user_id"},
     *         @OA\Property(property="user_id", type="integer", description="User ID of the student")
     *     )),
     *     @OA\Response(response=200, description="Verification email sent"),
     *     @OA\Response(response=422, description="Invalid user or no email")
     * )
     */
    public function resendVerificationEmail(Request $request): JsonResponse
    {
        $request->validate(['user_id' => 'required|integer|exists:users,id']);

        $user = User::find($request->input('user_id'));
        $notificationEmail = $user?->getNotificationEmail();
        if (!$user || empty($notificationEmail)) {
            return $this->error('User has no email address. Cannot send verification link.', 422);
        }
        if ($user->isEffectivelyVerified()) {
            return $this->error('Email is already verified. No need to send verification again.', 422);
        }

        try {
            $regNo = $user->studentProfile?->reg_no ?? '';
            $institutionId = $user->studentProfile?->institution_id ?? (int) config('ems.default_institution_id');
            $user->notify(new \App\Notifications\StudentOnboardNotification($institutionId, $regNo));
        } catch (\Throwable $e) {
            \Log::warning('Resend verification failed: ' . $e->getMessage());
            return $this->error('Failed to send verification. Check mail configuration and logs.', 500);
        }
        return $this->success(null, 'Verification link has been sent to the student via email & SMS.');
    }

    /**
     * @OA\Post(
     *     path="/students/verification-link",
     *     summary="Get verification URL for a student (for copying/sharing)",
     *     tags={"Students"},
     *     security={{"cookieAuth":{}}},
     *     @OA\RequestBody(required=true, @OA\JsonContent(
     *         required={"user_id"},
     *         @OA\Property(property="user_id", type="integer", description="User ID of the student")
     *     )),
     *     @OA\Response(response=200, description="Verification URL returned")
     * )
     */
    public function getVerificationLink(Request $request): JsonResponse
    {
        $request->validate(['user_id' => 'required|integer|exists:users,id']);

        $user = User::find($request->input('user_id'));
        if (!$user) {
            return $this->error('User not found.', 404);
        }

        if ($user->isEffectivelyVerified()) {
            return $this->error('Email is already verified. Verification link is not needed.', 422);
        }

        $url = VerificationToken::verifyEmailUrl($user);
        return $this->success(['url' => $url], 'Verification link generated.');
    }

    /**
     * @OA\Post(
     *     path="/students/{id}/verify",
     *     summary="Verify student",
     *     tags={"Students"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Student verified")
     * )
     */
    public function verify(Request $request, StudentProfile $student): JsonResponse
    {
        $student->update([
            'verified' => true,
            'verified_by' => $request->user()->id,
            'verified_at' => now(),
        ]);
        return $this->successWithMap($student, 'passthrough', 'Student verified');
    }

    /**
     * @OA\Delete(
     *     path="/students/{id}",
     *     summary="Delete student",
     *     tags={"Students"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Parameter(name="id", in="path", required=true, @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Student deleted")
     * )
     */
    public function destroy(StudentProfile $student): JsonResponse
    {
        $student->delete();
        return $this->success(null, 'Student profile deleted');
    }


    /**
     * @OA\Get(
     * path="/students/stats",
     * summary="Get student dashboard summary and stream-wise stats",
     * tags={"Students Dashboard"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(
     * name="year",
     * in="query",
     * description="Filter stats by year (e.g. 2025)",
     * required=false,
     * @OA\Schema(type="integer", default=2026)
     * ),
     * @OA\Response(
     * response=200,
     * description="Dashboard data fetched successfully",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=true),
     * @OA\Property(property="selected_year", type="integer", example=2026),
     * @OA\Property(property="summary", type="object",
     * @OA\Property(property="total_students", type="integer", example=500),
     * @OA\Property(property="verified_accounts", type="integer", example=450),
     * @OA\Property(property="unverified_accounts", type="integer", example=50),
     * @OA\Property(property="disabled_accounts", type="integer", example=5)
     * ),
     * @OA\Property(property="stream_table", type="array",
     * @OA\Items(
     * @OA\Property(property="sl_no", type="integer", example=1),
     * @OA\Property(property="main_stream", type="string", example="Undergraduate (UG)"),
     * @OA\Property(property="stream", type="string", example="B.Sc Physics"),
     * @OA\Property(property="total_students", type="integer", example=120),
     * @OA\Property(property="unverified_students", type="integer", example=15),
     * @OA\Property(property="disabled_students", type="integer", example=2)
     * )
     * )
     * )
     * ),
     * @OA\Response(response=401, description="Unauthenticated"),
     * @OA\Response(response=500, description="Internal Server Error")
     * )
     */

    public function studentStats(Request $request): JsonResponse
    {
        // Institution ID filter logic (trait)
        $collegeId = StudentProfile::getEffectiveInstitutionId($request->header('X-Institution-ID'));
        $year = $request->input('year', date('Y'));
        $page = $request->input('page', 1);
        $perPage = $request->input('per_page', 10);

        // Service se data mangwayein
        $data = $this->dashboardService->getDashboardStats($collegeId, (int) $year, (int) $page, (int) $perPage);

        return $this->success($data);
    }



    /**
     * @OA\Get(
     * path="/students/candidates",
     * summary="List Candidates with specific filters",
     * tags={"Students Dashboard"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="per_page", in="query", @OA\Schema(type="integer"), description="Number of items per page"),
     * @OA\Parameter(name="page", in="query", @OA\Schema(type="integer"), description="Current page"),
     * @OA\Parameter(name="name", in="query", @OA\Schema(type="string"), description="Search by name"),
     * @OA\Parameter(name="email", in="query", @OA\Schema(type="string"), description="Search by email"),
     * @OA\Parameter(name="mobile", in="query", @OA\Schema(type="string"), description="Search by mobile"),
     * @OA\Parameter(name="is_verified", in="query", @OA\Schema(type="integer", enum={0, 1}), description="1: Verified, 0: Non-Verified"),
     * @OA\Response(
     * response=200,
     * description="Filtered candidates list",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=true),
     * @OA\Property(property="data", type="object",
     * @OA\Property(property="current_page", type="integer"),
     * @OA\Property(property="data", type="array", @OA\Items(
     * @OA\Property(property="id", type="integer"),
     * @OA\Property(property="name", type="string"),
     * @OA\Property(property="email", type="string"),
     * @OA\Property(property="mobile", type="string"),
     * @OA\Property(property="status", type="integer")
     * ))
     * )
     * )
     * )
     * )
     */


    public function candidates(Request $request): JsonResponse
    {
        // Get filters from request
        $filters = $request->only([
            'name',
            'email',
            'mobile',
            'is_verified', // 1 for Verified, 0 for Non-verified
            'per_page'
        ]);

        $collegeId = InstitutionContext::getActiveInstitutionId($request->user());
        $candidates = $this->dashboardService->getCandidatesList($filters, $collegeId);

        return $this->paginatedWithMap($candidates, 'passthrough');
    }



    /**
     * Edit candidate details
     */

    /**
     * @OA\Get(
     *     path="/students/candidates/{id}/edit",
     *     summary="Edit candidate details",
     *     tags={"Students Dashboard"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Response(response=200, description="Candidate details retrieved successfully"),
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Candidate ID",
     *         @OA\Schema(type="integer")
     *     )
     * )
     */

    public function editCandidate(Request $request, $id): JsonResponse
    {
        $collegeId = InstitutionContext::getActiveInstitutionId($request->user());
        $candidateDetails = $this->dashboardService->getCandidateDetails($id, $collegeId);
        if ($candidateDetails === null) {
            return $this->notFound('Candidate not found or does not belong to this institution.');
        }
        return $this->success($candidateDetails, 'Candidate details retrieved successfully');
    }


    /*
     * Update candidate details
     */

    /**
     * @OA\Put(
     * path="/students/candidates/{id}",
     * summary="Update candidate full details",
     * tags={"Students Dashboard"},
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="User ID",
     * required=true,
     * @OA\Schema(type="integer")
     * ),
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"name", "email", "mobile"},
     * @OA\Property(property="name", type="string", example="Student 48"),
     * @OA\Property(property="email", type="string", format="email", example="student48@example.com"),
     * @OA\Property(property="mobile", type="string", example="9876543248"),
     * @OA\Property(property="photo_url", type="string", example="https://example.com/photos/student48.jpg"),
     * @OA\Property(
     * property="student_profile",
     * type="object",
     * @OA\Property(property="father_name", type="string", example="Father Name 48"),
     * @OA\Property(property="father_mobile", type="string", example="9988776648"),
     * @OA\Property(property="father_qualification", type="string", example="Graduate"),
     * @OA\Property(property="father_occupation", type="string", example="Business"),
     * @OA\Property(property="mother_name", type="string", example="Mother Name 48"),
     * @OA\Property(property="dob", type="string", format="date", example="2005-01-01"),
     * @OA\Property(property="gender", type="string", example="Male"),
     * @OA\Property(property="aadhar_no", type="string", example="197538039803"),
     * @OA\Property(property="current_semester", type="integer", example=1),
     * @OA\Property(property="is_differently_abled", type="boolean", example=true),
     * @OA\Property(property="caste", type="string", example="Bharatiya"),
     * @OA\Property(property="category", type="string", example="General"),
     * @OA\Property(property="nationality", type="string", example="Indian"),
     * @OA\Property(property="blood_group", type="string", example="A+"),
     * @OA\Property(property="roll_no", type="string", example="145-2026-48"),
     * 
     * @OA\Property(
     * property="permanent_address",
     * type="object",
     * @OA\Property(property="village_mohalla", type="string", example="Village 48"),
     * @OA\Property(property="district", type="string", example="District 5"),
     * @OA\Property(property="state", type="string", example="Bihar"),
     * @OA\Property(property="pincode", type="string", example="848628"),
     * @OA\Property(property="post_office", type="string", example="patna city"),
     * @OA\Property(property="police_station", type="string", example="patna"),
     * ),
     * @OA\Property(
     * property="correspondence_address",
     * type="object",
     * @OA\Property(property="village_mohalla", type="string", example="Village 48"),
     * @OA\Property(property="district", type="string", example="District 3"),
     * @OA\Property(property="state", type="string", example="Bihar"),
     * @OA\Property(property="pincode", type="string", example="846476"),
     * @OA\Property(property="post_office", type="string", example="patna city"),
     * @OA\Property(property="police_station", type="string", example="patna"), 
     * )
     * )
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Candidate updated successfully",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=true),
     * @OA\Property(property="message", type="string", example="Candidate details updated successfully")
     * )
     * ),
     * @OA\Response(
     * response=422,
     * description="Validation Error"
     * ),
     * @OA\Response(
     * response=500,
     * description="Internal Server Error"
     * )
     * )
     */



    public function updateCandidate(Request $request, $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            // User Fields
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $id,
            'mobile' => 'nullable|string|max:20|unique:users,mobile,' . $id,
            'password' => 'nullable|string|min:6|confirmed',
            'photo_url' => 'nullable|url',

            // Profile Fields
            'student_profile.roll_no' => 'nullable|string',
            'student_profile.current_semester' => 'nullable|integer|between:1,12',
            'student_profile.father_name' => 'nullable|string|max:255',
            'student_profile.mother_name' => 'nullable|string|max:255',
            'student_profile.dob' => 'nullable|date',
            'student_profile.gender' => 'nullable|string|in:Male,Female,Other',
            'student_profile.aadhar_no' => 'nullable|digits:12',
            'student_profile.nationality' => 'nullable|string',
            'student_profile.blood_group' => 'nullable|string',
            'student_profile.marital_status' => 'nullable|string',
            'student_profile.is_differently_abled' => 'nullable|boolean',
            'student_profile.caste' => 'nullable|string',
            'student_profile.category' => 'nullable|string',
            'student_profile.father_mobile' => 'nullable|string|max:20',
            'student_profile.father_qualification' => 'nullable|string',
            'student_profile.father_occupation' => 'nullable|string',


            // Permanent Address Validation
            'student_profile.permanent_address.village_mohalla' => 'nullable|string',
            'student_profile.permanent_address.post_office' => 'nullable|string',
            'student_profile.permanent_address.police_station' => 'nullable|string',
            'student_profile.permanent_address.district' => 'nullable|string',
            'student_profile.permanent_address.state' => 'nullable|string',
            'student_profile.permanent_address.pincode' => 'nullable|digits:6',

            // Correspondence Address Validation
            'student_profile.correspondence_address.village_mohalla' => 'nullable|string',
            'student_profile.correspondence_address.post_office' => 'nullable|string',
            'student_profile.correspondence_address.police_station' => 'nullable|string',
            'student_profile.correspondence_address.district' => 'nullable|string',
            'student_profile.correspondence_address.state' => 'nullable|string',
            'student_profile.correspondence_address.pincode' => 'nullable|digits:6',

            // Documents Validation
            'documents' => 'nullable|array',
            'documents.*.doc_type' => 'required|string',
            'documents.*.path' => 'required|string',
        ]);

        if ($validator->fails()) {
            return $this->validationError($validator->errors());
        }
        $collegeId = InstitutionContext::getActiveInstitutionId($request->user());
        $candidateDetails = $this->dashboardService->updateCandidateDetails($id, $request->all(), $collegeId);
        if ($candidateDetails === null) {
            return $this->notFound('Candidate not found or does not belong to this institution.');
        }
        return $this->success($candidateDetails, 'Candidate details updated successfully');
    }



    /*
    update candidate status
    */


    /**
     * @OA\Put(
     *     path="/students/candidates/{id}/status",
     *     summary="Toggle candidate status (active/disabled)",
     *     tags={"Students Dashboard"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         required=true,
     *         description="Candidate ID",
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(response=200, description="Candidate status updated successfully")
     * )
     */

    public function toggleCandidateStatus(Request $request, int $id): JsonResponse
    {
        $collegeId = InstitutionContext::getActiveInstitutionId($request->user());
        $data = $this->dashboardService->toggleCandidateStatus($id, $collegeId);
        if ($data === null) {
            return $this->notFound('Candidate not found or does not belong to this institution.');
        }

        return $this->success($data, 'Candidate status updated successfully');
    }



    /**
     * Get Students List which admitted in a particular academic session
     */

    /**
     * @OA\Get(
     * path="/students/list",
     * summary="Get list of students",
     * tags={"Students Dashboard"},
     * security={{"cookieAuth":{}}},
     * @OA\Parameter(name="academic_session_id", in="query", @OA\Schema(type="integer")),
     * @OA\Parameter(
     * name="stream_id", 
     * in="query", 
     * description="Stream ID", 
     * @OA\Schema(type="integer")
     * ),
     * @OA\Parameter(
     * name="status", 
     * in="query", 
     * description="1: Active, 0: Disabled", 
     * @OA\Schema(type="integer", enum={0, 1})
     * ),
     * @OA\Parameter(name="page", in="query", @OA\Schema(type="integer"), description="Current page"),
     * @OA\Parameter(name="name", in="query", @OA\Schema(type="string")),
     * @OA\Parameter(name="email", in="query", @OA\Schema(type="string")),
     * @OA\Parameter(name="mobile", in="query", @OA\Schema(type="string")),
     * @OA\Parameter(name="reg_no", in="query", @OA\Schema(type="string")),
     * @OA\Parameter(
     * name="is_verified", 
     * in="query", 
     * description="1: Verified, 0: Non-Verified",
     * @OA\Schema(type="integer", enum={0, 1})
     * ),
     * @OA\Parameter(name="per_page", in="query", @OA\Schema(type="integer")),
     * @OA\Response(response=200, description="List of students")
     * )
     */


    public function getStudents(Request $request): JsonResponse
    {
        $filters = $request->only([
            'academic_session_id', 'stream_id', 'status', 'name', 'email', 
            'mobile', 'per_page', 'is_verified', 'reg_no', 'lms_class_id',
            'abc_status', 'hostel_status', 'transport_status'
        ]);
        $collegeId = InstitutionContext::getActiveInstitutionId($request->user());
        $paginator = $this->dashboardService->getStudentsList($filters, $collegeId);
        
        $data = app(\App\Services\ApiResponseMapService::class)->filterCollection($paginator->items(), 'passthrough');

        // Dynamic stats query
        $statsQuery = User::whereHas('roles', function ($q) use ($collegeId) {
            $q->where('roles.key', 'student')
                ->where('user_roles.institution_id', $collegeId);
        });

        if (!empty($filters['name']) && is_string($filters['name'])) {
            $statsQuery->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($filters['name']) . '%']);
        }
        if (!empty($filters['email']) && is_string($filters['email'])) {
            $statsQuery->whereRaw('LOWER(email) LIKE ?', ['%' . strtolower($filters['email']) . '%']);
        }
        if (!empty($filters['mobile']) && is_string($filters['mobile'])) {
            $statsQuery->where('mobile', 'like', "%{$filters['mobile']}%");
        }
        if (!empty($filters['reg_no']) && is_string($filters['reg_no'])) {
            $statsQuery->whereHas('studentProfile', function ($q) use ($filters, $collegeId) {
                $q->where('student_profiles.institution_id', $collegeId)->where('reg_no', 'like', "%{$filters['reg_no']}%");
            });
        }
        if (!empty($filters['academic_session_id'])) {
            $statsQuery->whereHas('studentProfile', function ($q) use ($filters, $collegeId) {
                $q->where('student_profiles.institution_id', $collegeId)->where('session_id', $filters['academic_session_id']);
            });
        }
        if (!empty($filters['stream_id'])) {
            $statsQuery->whereHas('studentProfile', function ($q) use ($filters, $collegeId) {
                $q->where('student_profiles.institution_id', $collegeId)->where('stream_id', $filters['stream_id']);
            });
        }
        if (!empty($filters['lms_class_id'])) {
            $statsQuery->whereIn('id', function ($q) use ($filters) {
                $q->select('user_id')
                  ->from('lms_class_enrollments')
                  ->where('lms_class_id', $filters['lms_class_id'])
                  ->where('role', 'student')
                  ->where('status', 'active');
            });
        }
        if (isset($filters['is_verified'])) {
            $filters['is_verified']
                ? $statsQuery->whereNotNull('email_verified_at')
                : $statsQuery->whereNull('email_verified_at');
        }
        if (isset($filters['status'])) {
            $statsQuery->where('status', $filters['status']);
        }
        if (!empty($filters['abc_status'])) {
            $statsQuery->whereHas('studentProfile', function ($q) use ($filters) {
                if ($filters['abc_status'] === 'registered') {
                    $q->whereNotNull('abc_id')->where('abc_id', '!=', '');
                } else {
                    $q->where(fn($sq) => $sq->whereNull('abc_id')->orWhere('abc_id', ''));
                }
            });
        }
        if (!empty($filters['hostel_status'])) {
            $statsQuery->whereHas('studentProfile', function ($q) use ($filters) {
                $q->where('hostel_required', $filters['hostel_status'] === 'required');
            });
        }
        if (!empty($filters['transport_status'])) {
            $statsQuery->whereIn('id', function($q) use ($filters) {
                if ($filters['transport_status'] === 'active') {
                    $q->select('user_id')->from('transport_assignments')->whereNull('effective_until')->orWhere('effective_until', '>=', now());
                } else {
                    $q->select('id')->from('users')->whereNotIn('id', function($sq) {
                        $sq->select('user_id')->from('transport_assignments')->whereNull('effective_until')->orWhere('effective_until', '>=', now());
                    });
                }
            });
        }

        $totalStudents = (clone $statsQuery)->count();
        $activeStudents = (clone $statsQuery)->where('status', 1)->count();
        $verifiedStudents = (clone $statsQuery)->whereNotNull('email_verified_at')->count();
        $unverifiedStudents = (clone $statsQuery)->whereNull('email_verified_at')->count();

        $stats = [
            'total_students' => (int) $totalStudents,
            'active_students' => (int) $activeStudents,
            'verified_students' => (int) $verifiedStudents,
            'unverified_students' => (int) $unverifiedStudents,
        ];

        return response()->json([
            'success' => true,
            'message' => 'Success',
            'data' => $data,
            'meta' => [
                'current_page' => $paginator->currentPage(),
                'last_page' => $paginator->lastPage(),
                'per_page' => $paginator->perPage(),
                'total' => $paginator->total(),
                'stats' => $stats,
            ],
        ]);
    }

    /**
     * @OA\Get(
     *     path="/students/export",
     *     summary="Export existing students for bulk update",
     *     tags={"Students Dashboard"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Parameter(name="academic_session_id", in="query", @OA\Schema(type="integer")),
     *     @OA\Parameter(name="stream_id", in="query", @OA\Schema(type="integer")),
     *     @OA\Response(response=200, description="Excel file download")
     * )
     */
    public function export(Request $request)
    {
        $collegeId = InstitutionContext::getActiveInstitutionId($request->user());
        $filters = $request->only([
            'academic_session_id', 'stream_id', 'status', 'name', 'email', 
            'mobile', 'is_verified', 'reg_no', 'lms_class_id',
            'abc_status', 'hostel_status', 'transport_status'
        ]);
        
        return \Maatwebsite\Excel\Facades\Excel::download(
            new \App\Exports\ExistingStudentExport($collegeId, $filters),
            'students_export_' . now()->format('Y_m_d_His') . '.xlsx'
        );
    }

}
