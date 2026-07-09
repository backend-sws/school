<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Api\V1\Organization\InstitutionProfileController;
use App\Models\Setting;
use Illuminate\Http\Request;
use App\Services\AuthService;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Api\V1\BaseController;
use Illuminate\Support\Facades\{DB, Hash, Auth, Validator};
use App\Models\{User, Role, StudentProfile, AdmissionVerificationData};
use App\Support\EffectiveStudentContext;

/**
 * @OA\Tag(name="Student Auth", description="Student Registration & Password Management")
 */
class StudentAuthController extends BaseController
{
    protected $authService;

    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * @OA\Post(
     * path="/student-auth/find-application",
     * summary="Step 1: Search Application details from Excel",
     * tags={"Student Auth"},
     * @OA\RequestBody(required=true, @OA\JsonContent(@OA\Property(property="app_no", type="string", example="APP2026001"))),
     * @OA\Response(response=200, description="Data found"),
     * @OA\Response(response=404, description="Not found")
     * )
     */
    public function findApplication(Request $request)
    {
        $request->validate(['app_no' => 'required|string']);

        if (StudentProfile::where('app_no', $request->app_no)->exists()) {
            return $this->error("This Application is already registered. Please Login.", 422);
        }

        $excelData = AdmissionVerificationData::where('admission_id', $request->app_no)->first();

        if (!$excelData) {
            return $this->error("No record found in the university admission list.", 404);
        }

        return $this->success([
            'name' => $excelData->student_name,
            'father_name' => $excelData->fathers_name,
            'dob' => $excelData->dob,
            'gender' => $excelData->gender,
            'category' => $excelData->category,
            'mobile' => $excelData->mobile_number,
            'email' => $excelData->email,
        ]);
    }

    /**
     * @OA\Post(
     * path="/student-auth/send-otp",
     * summary="Step 2: Send OTP to Email & Mobile",
     * tags={"Student Auth"},
     * @OA\RequestBody(required=true, @OA\JsonContent(@OA\Property(property="mobile", type="string"), @OA\Property(property="email", type="string"))),
     * @OA\Response(response=200, description="OTP Sent")
     * )
     */
    public function sendOtp(Request $request)
    {
        $request->validate(['mobile' => 'required|digits:10', 'email' => 'required|email']);
        $this->authService->sendOtp($request->mobile, $request->email);
        return $this->success(null, "OTP has been sent to your mobile and email.");
    }

    /**
     * @OA\Post(
     * path="/student-auth/register",
     * summary="Step 3: Final Register (Save Excel details & Set Cookie)",
     * tags={"Student Auth"},
     * @OA\RequestBody(required=true, @OA\JsonContent(
     * @OA\Property(property="app_no", type="string"),
     * @OA\Property(property="otp", type="string"),
     * @OA\Property(property="password", type="string"),
     * @OA\Property(property="password_confirmation", type="string"),
     * @OA\Property(property="stream_id", type="integer"),
     * @OA\Property(property="session_id", type="integer")
     * )),
     * @OA\Response(response=201, description="Registered & Logged in")
     * )
     */
    public function register(Request $request)
    {
        $request->validate([
            'app_no' => 'required',
            'otp' => 'required|digits:6',
            'password' => 'required|confirmed|min:8',
            'password_confirmation' => 'required',
            'stream_id' => 'required|integer|exists:streams,id',
            'session_id' => 'required|integer|exists:academic_sessions,id',
        ]);

        $excel = AdmissionVerificationData::where('admission_id', $request->app_no)->first();
        if (!$excel)
            return $this->error("Verification failed.", 404);


        // 2. SETTINGS CHECK (Global & Stream Basis)

        // A. Global Check
        $globalKey = 'global_admission_id_verification';
        $isGlobalActive = Setting::where('setting_key', $globalKey)
            ->where('setting_value', '1') // Maan rahe hain 'active' status hai
            ->exists();

        if (!$isGlobalActive) {
            return $this->error("Admission registration is globally disabled.", 403);
        }

        $main_stream_id = $excel->main_stream_id;
        // B. Stream Specific Check (Dynamic Key: verification_status_stream_{id})
        $streamKey = 'verification_status_stream_' . $main_stream_id;
        $isStreamActive = Setting::where('setting_key', $streamKey)
            ->where('setting_value', '1')
            ->exists();

        if (!$isStreamActive) {
            return $this->error("Registration for the selected stream is currently closed.", 403);
        }

        // OTP Verification using mobile from Excel
        if (!$this->authService->verify($excel->mobile_number, $request->otp)) {
            return $this->error("Invalid or expired OTP.", 422);
        }

        return DB::transaction(function () use ($request, $excel) {
            // 1. Create Clean User
            $user = User::create([
                'name' => $excel->student_name,
                'email' => $excel->email,
                'mobile' => $excel->mobile_number,
                'password' => Hash::make($request->password),
                'email_verified_at' => now(),
                'status' => 1, // active

            ]);

            // 2. Assign Role Candidate
            $role = Role::where('key', 'candidate')->first();
            $user->roles()->attach($role->id, ['assigned_at' => now()]);

            // 3. Create Profile with ALL Excel Details
            StudentProfile::create([
                'user_id' => $user->id,
                'app_no' => $request->app_no,
                'stream_id' => $request->stream_id,
                'session_id' => $request->session_id,
                'institution_id' => $excel->institution_id,
                'student_name' => $excel->student_name,
                'father_name' => $excel->fathers_name,
                'dob' => $excel->dob,
                'gender' => $excel->gender,
                'category' => $excel->category,
                'verified' => false,
            ]);

            // 4. Manual Login for Cookie Auth (Sanctum/Fortify style)
            Auth::login($user);

            return $this->successWithMap($user, 'passthrough', "Registration successful. You are now logged in.");
        });
    }

    /**
     * @OA\Post(
     * path="/student-auth/forgot-password",
     * summary="Forgot Password - Send OTP",
     * tags={"Student Auth"},
     * @OA\RequestBody(required=true, @OA\JsonContent(@OA\Property(property="login_id", type="string", description="Registered Email or Mobile"))),
     * @OA\Response(response=200, description="OTP Sent")
     * )
     */
    public function forgotPassword(Request $request)
    {
        $user = User::where('email', $request->login_id)->orWhere('mobile', $request->login_id)->first();
        if (!$user)
            return $this->error("User not found.", 404);

        $this->authService->sendOtp($user->mobile, $user->email);
        return $this->success(null, "Reset OTP sent to registered mobile and email.");
    }

    /**
     * @OA\Post(
     * path="/student-auth/reset-password",
     * summary="Reset Password with OTP",
     * tags={"Student Auth"},
     * @OA\RequestBody(required=true, @OA\JsonContent(
     * @OA\Property(property="login_id", type="string", description="Registered Email or Mobile"),
     * @OA\Property(property="otp", type="string"),
     * @OA\Property(property="password", type="string")
     * )),
     * @OA\Response(response=200, description="Success")
     * )
     */
    public function resetPassword(Request $request)
    {
        $user = User::where('email', $request->login_id)->orWhere('mobile', $request->login_id)->first();
        if (!$user || !$this->authService->verify($user->mobile, $request->otp)) {
            return $this->error("Invalid OTP or User.", 422);
        }

        $user->update(['password' => Hash::make($request->password)]);
        return $this->success(null, "Password reset successfully.");
    }

    /**
     * @OA\Post(
     * path="/student-auth/login",
     * summary="Student Login (Email or Mobile)",
     * description="Authenticate student using registered Email/Mobile and Password. Uses Cookie-based authentication.",
     * tags={"Student Auth"},
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"login_id", "password"},
     * @OA\Property(property="login_id", type="string", example="student@example.com", description="Registered Email address or Mobile number"),
     * @OA\Property(property="password", type="string", format="password", example="password123")
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Login successful",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=true),
     * @OA\Property(property="message", type="string", example="Login successful."),
     * @OA\Property(property="data", ref="#/components/schemas/User")
     * )
     * ),
     * @OA\Response(
     * response=401,
     * description="Invalid credentials",
     * @OA\JsonContent(
     * @OA\Property(property="success", type="boolean", example=false),
     * @OA\Property(property="message", type="string", example="Invalid credentials.")
     * )
     * ),
     * @OA\Response(
     * response=422,
     * description="Validation Error"
     * )
     * )
     */

    public function login(Request $request)
    {
        // Validate request
        $request->validate([
            'login_id' => 'required|string',
            'password' => 'required|string',
        ]);

        // Same email can have multiple users (parent + students); prefer student/candidate for student-portal login.
        $candidates = User::where('email', $request->login_id)->orWhere('mobile', $request->login_id)->get();
        $user = $candidates->filter(fn ($u) => Hash::check($request->password, $u->password))
            ->first(fn ($u) => $u->hasRole('student') || $u->hasRole('candidate'))
            ?? $candidates->filter(fn ($u) => Hash::check($request->password, $u->password))->first();

        if (! $user) {
            return $this->error("Invalid credentials.", 401);
        }

        if ($user->status != 1) {
            return $this->error("Your account is inactive. Please contact admin.", 403);
        }
        if (! $user->hasRole('student') && ! $user->hasRole('candidate') && ! $user->hasRole('parent')) {
            return $this->error("Access Denied: Not a student account.", 403);
        }
        
        $user->update(['last_login' => now()]);
        // Manual Login for Cookie Auth (Sanctum/Fortify style)
        Auth::login($user);

        return $this->successWithMap($user, 'passthrough', "Login successful.");
    }

    /**
     * @OA\Post(
     * path="/student-auth/request-otp-login",
     * summary="Request OTP for Student Login",
     * tags={"Student Auth"},
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"login_id"},
     * @OA\Property(property="login_id", type="string", description="Registered Email address or Mobile number")
     * )
     * ),
     * @OA\Response(response=200, description="OTP Sent")
     * )
     */
    public function requestOtpLogin(Request $request)
    {
        $request->validate([
            'login_id' => 'required|string',
        ]);

        $candidates = User::where('email', $request->login_id)->orWhere('mobile', $request->login_id)->get();
        // Priority to students over parents
        $user = $candidates->first(fn ($u) => $u->hasRole('student') || $u->hasRole('candidate')) ?? $candidates->first();

        if (!$user) {
            return $this->error("No account found with this email or mobile.", 404);
        }

        if ($user->status != 1) {
            return $this->error("Your account is inactive. Please contact admin.", 403);
        }

        $this->authService->sendOtp($user->mobile, $user->email);

        return $this->success(null, "OTP sent to your registered mobile and email.");
    }

    /**
     * @OA\Post(
     * path="/student-auth/verify-otp-login",
     * summary="Verify OTP for Student Login",
     * tags={"Student Auth"},
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * required={"login_id", "otp"},
     * @OA\Property(property="login_id", type="string"),
     * @OA\Property(property="otp", type="string")
     * )
     * ),
     * @OA\Response(response=200, description="Login successful")
     * )
     */
    public function verifyOtpLogin(Request $request)
    {
        $request->validate([
            'login_id' => 'required|string',
            'otp' => 'required|string',
        ]);

        $candidates = User::where('email', $request->login_id)->orWhere('mobile', $request->login_id)->get();
        $user = $candidates->first(fn ($u) => $u->hasRole('student') || $u->hasRole('candidate')) ?? $candidates->first();

        if (!$user || !$this->authService->verify($user->mobile, $request->otp)) {
            return $this->error("Invalid OTP or User.", 422);
        }

        if ($user->status != 1) {
            return $this->error("Your account is inactive. Please contact admin.", 403);
        }

        $user->update(['last_login' => now()]);
        Auth::login($user);

        return $this->successWithMap($user, 'passthrough', "Login successful.");
    }

    /**
     * @OA\Post(
     * path="/student-auth/change-password",
     * summary="Change password for logged-in student",
     * tags={"Student Auth"},
     * security={{"cookieAuth":{}}},
     * @OA\RequestBody(
     * required=true,
     * @OA\JsonContent(
     * @OA\Property(property="old_password", type="string", example="old_pass_123"),
     * @OA\Property(property="password", type="string", example="new_pass_123"),
     * @OA\Property(property="password_confirmation", type="string", example="new_pass_123")
     * )
     * ),
     * @OA\Response(response=200, description="Password changed successfully"),
     * @OA\Response(response=422, description="Validation error or Incorrect old password")
     * )
     */
    public function changePassword(Request $request)
    {
        $request->validate([
            'old_password' => 'required',
            'password' => 'required|confirmed|min:8|different:old_password',
        ], [
            'password.different' => 'New password must be different from the old password.'
        ]);

        $user = Auth::user();

        // 1. Check if Old Password Matches
        if (!Hash::check($request->old_password, $user->password)) {
            return $this->error("The old password you entered is incorrect.", 422);
        }

        // 2. Update to New Password
        $user->update([
            'password' => Hash::make($request->password)
        ]);

        // 3. Optional: Logout from other devices (Audit log already handled globally)
        Auth::logoutOtherDevices($request->password);

        return $this->success(null, "Your password has been changed successfully.");
    }


    /**
     * @OA\Post(
     * path="/student-auth/logout",
     * summary="Logout the logged-in student",
     * tags={"Student Auth"},
     * security={{"cookieAuth":{}}},
     * @OA\Response(response=200, description="Logout successful")
     * )
     */
    public function logout(Request $request)
    {
        InstitutionProfileController::clearProfileCache();
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return $this->success(null, "You have been logged out successfully.");
    }
}