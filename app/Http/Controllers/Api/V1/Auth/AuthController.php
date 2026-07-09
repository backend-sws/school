<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Http\Controllers\Api\V1\BaseController;
use App\Models\User;
use App\Support\EffectiveStudentContext;
use App\Support\VerificationToken;
use App\Http\Controllers\Api\V1\Organization\InstitutionProfileController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

/**
 * @OA\Schema(
 *     schema="LoginRequest",
 *     required={"email", "password"},
 *     @OA\Property(property="email", type="string", format="email", example="admin@gdcollege.edu.in"),
 *     @OA\Property(property="password", type="string", example="password")
 * )
 * 
 * @OA\Schema(
 *     schema="UserResponse",
 *     @OA\Property(property="id", type="integer"),
 *     @OA\Property(property="name", type="string"),
 *     @OA\Property(property="email", type="string")
 * )
 */
class AuthController extends BaseController
{
    protected $authService;

    public function __construct(\App\Services\AuthService $authService)
    {
        $this->authService = $authService;
    }

    /**
     * Find a user by email or mobile, normalizing phone input to handle
     * formats like 9939826940, +919939826940, 919939826940.
     * DB stores mobile as +91XXXXXXXXXX.
     */
    private function findUserByLoginId(string $loginId): ?User
    {
        if (filter_var($loginId, FILTER_VALIDATE_EMAIL)) {
            $candidates = User::where('email', $loginId)->get();
        } else {
            $variants = \App\Services\SmsService::getMobileVariants($loginId);
            $candidates = User::whereIn('mobile', $variants)->get();
        }

        return $candidates
            ->sortByDesc(fn($u) => EffectiveStudentContext::isGuardianUser($u) ? 1 : 0)
            ->first();
    }

    /**
     * @OA\Post(
     *     path="/auth/request-otp-login",
     *     summary="Request OTP for Staff/Admin Login",
     *     tags={"Auth"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"login_id"},
     *             @OA\Property(property="login_id", type="string", description="Registered Email address or Mobile number")
     *         )
     *     ),
     *     @OA\Response(response=200, description="OTP Sent")
     * )
     */
    public function requestOtpLogin(Request $request): JsonResponse
    {
        $request->validate([
            'login_id' => 'required|string',
        ]);

        $user = $this->findUserByLoginId($request->login_id);

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
     *     path="/auth/verify-otp-and-set-password",
     *     summary="Verify OTP, Set Password, and Login",
     *     tags={"Auth"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"login_id", "otp", "password", "password_confirmation"},
     *             @OA\Property(property="login_id", type="string"),
     *             @OA\Property(property="otp", type="string"),
     *             @OA\Property(property="password", type="string"),
     *             @OA\Property(property="password_confirmation", type="string")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Login successful")
     * )
     */
    public function verifyOtpAndSetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'login_id' => 'required|string',
            'otp' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $loginId = $request->input('login_id');
        $otp = $request->input('otp');

        $user = $this->findUserByLoginId($loginId);

        if (!$user) {
            return $this->error('User not found', 404);
        }

        // Verify OTP against the user's actual stored mobile/email (cache key used during sendOtp)
        $isValid = false;
        if ($user->mobile && $this->authService->verifyOtp($user->mobile, $otp)) {
            $isValid = true;
        } elseif ($user->email && $this->authService->verifyOtp($user->email, $otp)) {
            $isValid = true;
        }

        if (!$isValid) {
            return $this->error('Invalid or expired OTP', 400);
        }

        // Set password and mark as verified
        $user->password = Hash::make($request->input('password'));
        $user->status = 1; // Verified
        $user->update();

        // Clear OTP from both keys
        if ($user->mobile) $this->authService->clearOtp($user->mobile);
        if ($user->email) $this->authService->clearOtp($user->email);

        // Update last login
        $user->update(['last_login' => now()]);

        // Login
        Auth::login($user);

        return $this->success([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
            'redirect' => '/dashboard',
        ], 'Account verified and logged in successfully.');
    }

    /**
     * @OA\Post(
     *     path="/auth/login",
     *     summary="Login user",
     *     tags={"Auth"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(ref="#/components/schemas/LoginRequest")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Login successful",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean", example=true),
     *             @OA\Property(property="message", type="string", example="Login successful"),
     *             @OA\Property(property="data", ref="#/components/schemas/UserResponse")
     *         )
     *     ),
     *     @OA\Response(response=422, description="Invalid credentials")
     * )
     */
    public function login(Request $request): JsonResponse
    {
        $request->validate([
            'login_id' => 'required|string',
            'password' => 'required|string',
        ]);

        $user = $this->findUserByLoginId($request->login_id);

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'login_id' => ['The provided credentials are incorrect.'],
            ]);
        }

        if ($user->status != 1) {
            return $this->error("Your account is inactive. Please contact admin.", 403);
        }
        // Update last login
        $user->update(['last_login' => now()]);

        // For cookie-based auth, we use Laravel's session
        Auth::login($user);

        return $this->success([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,

            ],
        ], 'Login successful');
    }

    /**
     * @OA\Post(
     *     path="/auth/register",
     *     summary="Register new user",
     *     tags={"Auth"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"name", "email", "password", "password_confirmation"},
     *             @OA\Property(property="name", type="string"),
     *             @OA\Property(property="email", type="string", format="email"),
     *             @OA\Property(property="password", type="string", minLength=8),
     *             @OA\Property(property="password_confirmation", type="string")
     *         )
     *     ),
     *     @OA\Response(response=201, description="Registration successful"),
     *     @OA\Response(response=422, description="Validation error")
     * )
     */
    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:150',
            'email' => 'required|email',
            'password' => 'required|string|min:8|confirmed',
            'mobile' => 'nullable|string|max:15',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'mobile' => $validated['mobile'] ?? null,
            'status' => 2, // pending_verification
        ]);

        return $this->created([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ],
        ], 'Registration successful');
    }

    /**
     * @OA\Post(
     *     path="/auth/logout",
     *     summary="Logout user",
     *     tags={"Auth"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Response(response=200, description="Logout successful")
     * )
     */
    public function logout(Request $request): JsonResponse
    {
        InstitutionProfileController::clearProfileCache();
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return $this->success(null, 'Logout successful');
    }

    /**
     * @OA\Post(
     *     path="/auth/verify-otp",
     *     summary="Verify OTP only (Step 2)",
     *     tags={"Auth"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"login_id", "otp"},
     *             @OA\Property(property="login_id", type="string"),
     *             @OA\Property(property="otp", type="string")
     *         )
     *     ),
     *     @OA\Response(response=200, description="OTP is valid")
     * )
     */
    public function verifyOtp(Request $request): JsonResponse
    {
        $request->validate([
            'login_id' => 'required|string',
            'otp' => 'required|string',
        ]);

        $loginId = $request->input('login_id');
        $otp = $request->input('otp');

        $user = $this->findUserByLoginId($loginId);
        if (!$user) {
            return $this->error('User not found', 404);
        }

        // Check OTP without clearing it
        $isValid = false;
        if ($user->mobile && $this->authService->verifyOtp($user->mobile, $otp)) {
            $isValid = true;
        } elseif ($user->email && $this->authService->verifyOtp($user->email, $otp)) {
            $isValid = true;
        }

        if (!$isValid) {
            return $this->error('Invalid or expired OTP', 400);
        }

        return $this->success(null, 'OTP verified successfully.');
    }

    /**
     * @OA\Get(
     *     path="/auth/me",
     *     summary="Get current user",
     *     tags={"Auth"},
     *     security={{"cookieAuth":{}}},
     *     @OA\Response(
     *         response=200,
     *         description="Current user data",
     *         @OA\JsonContent(
     *             @OA\Property(property="success", type="boolean"),
     *             @OA\Property(property="data", ref="#/components/schemas/UserResponse")
     *         )
     *     )
     * )
     */
    public function me(Request $request): JsonResponse
    {
        // dd($request->user());
        $user = $request->user();

        return $this->success([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'mobile' => $user->mobile,
                'photo_url' => $user->photo_url,
                'status' => $user->status,
            ],
        ]);
    }

    /**
     * Set password using verification token (generic: students, staff, etc.).
     * Verifies token, updates password, sets email_verified_at, logs in, returns redirect URL by role.
     *
     * @OA\Post(
     *     path="/auth/set-password-with-token",
     *     summary="Set password with verification token",
     *     tags={"Auth"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"token", "password", "password_confirmation"},
     *             @OA\Property(property="token", type="string"),
     *             @OA\Property(property="password", type="string", minLength=8),
     *             @OA\Property(property="password_confirmation", type="string")
     *         )
     *     ),
     *     @OA\Response(response=200, description="Password set, redirect URL returned"),
     *     @OA\Response(response=422, description="Invalid or expired token")
     * )
     */
    public function setPasswordWithToken(Request $request): JsonResponse
    {
        $request->validate([
            'token' => 'required|string',
            'password' => 'required|string|min:8|confirmed',
            'password_confirmation' => 'required',
        ]);

        $user = VerificationToken::verifyToken($request->token);

        if (!$user) {
            return $this->error('Invalid or expired link. Please request a new verification email.', 422);
        }

        if ($user->status != 1 && $user->status != 2) {
            return $this->error('Your account is inactive. Please contact support.', 403);
        }

        $user->update([
            'password' => Hash::make($request->password),
            'email_verified_at' => $user->email_verified_at ?? now(),
            'status' => 1, // Set to active after password setup
        ]);

        $user->update(['last_login' => now()]);
        Auth::login($user);

        $redirect = ($user->hasRole('student') || $user->hasRole('candidate'))
            ? '/student-portal/dashboard'
            : '/dashboard';

        return $this->success(['redirect' => $redirect], 'Password set successfully.');
    }
}
