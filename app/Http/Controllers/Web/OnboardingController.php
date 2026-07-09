<?php

namespace App\Http\Controllers\Web;

use App\Enums\InstitutionType;
use App\Enums\SubscriptionTier;
use App\Http\Controllers\Controller;
use App\Models\Institution;
use App\Models\Organization;
use App\Models\Role;
use App\Models\User;
use App\Models\Workflow;
use App\Support\UserRedirectResolver;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class OnboardingController extends Controller
{
    // ─── Step 1: Account Details ─────────────────────────────────────────

    /**
     * Show the registration form (Step 1).
     * Handles logged-in users too (from shared session via subdomain).
     */
    public function showAccountForm(Request $request): Response|\Illuminate\Http\RedirectResponse
    {
        $result = UserRedirectResolver::resolve($request->user(), $request);

        if ($result) {
            return $result->isExternal
                ? redirect()->away($result->target)
                : redirect()->route($result->target);
        }

        return Inertia::render('auth/register');
    }

    /**
     * Validate account data, create inactive user, send verification email.
     * New flow: Account → Verify (no org step before verify).
     */
    public function storeAccountData(Request $request)
    {

        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => [
                'required',
                'string',
                'email',
                'max:150',
                Rule::unique('users', 'email')->where(function ($query) {
                    return $query->where('status', '!=', 0);
                })
            ],
            'mobile' => [
                'nullable',
                'regex:/^\+?\d{1,4}\d{6,14}$/',
                // Allow mobile reuse if the previous account is unverified
                Rule::unique('users', 'mobile')->where(function ($query) {
                    return $query->where('status', '!=', 0);
                })
            ],
            'password' => 'required|string|min:8|max:72|confirmed',
        ], [
            'mobile.regex' => 'Enter a valid phone number with country code.',
            'mobile.unique' => 'This mobile number is already registered.',
            'email.unique' => 'This email is already registered and verified. Please sign in.',
        ]);

        // Generate verification token
        $token = Str::random(64);

        // 2. Updated to updateOrCreate to bypass the duplicate entry error
        $user = User::updateOrCreate(
            ['email' => $validated['email']], // Find by email
            [
                // Update or set these values
                'name' => $validated['name'],
                'mobile' => $validated['mobile'] ?? null,
                'password' => Hash::make($validated['password']),
                'status' => 0,
                'onboarding_token' => $token,
            ]
        );

        // 3. Changed attach to syncWithoutDetaching to prevent duplicate roles
        $role = Role::where('key', 'institution_admin')->first();
        if ($role) {
            $user->roles()->syncWithoutDetaching([
                $role->id => [
                    'institution_id' => null,
                    'assigned_at' => now(),
                ]
            ]);
        }

        // Store user ID in session
        $request->session()->put('onboarding_user_id', $user->id);

        // Send verification email (never crash registration on mail failure)
        try {
            $verifyUrl = route('onboarding.verify', ['token' => $token]);
            $appName = config('app.name', 'PDS Education');

            Mail::send('emails.onboarding-verify', [
                'user' => $user,
                'verifyUrl' => $verifyUrl,
            ], function ($message) use ($user, $appName) {
                $message->to($user->email)
                    ->subject("Verify Your Email — {$appName}");
            });
        } catch (\Throwable $e) {
            \Log::warning('Onboarding verification email failed', [
                'email' => $user->email,
                'error' => $e->getMessage(),
            ]);
        }

        // Redirect to "check your inbox" page
        return redirect()->route('onboarding.verify.notice', ['email' => $user->email]);
    }

    // ─── Step 3: Plan Selection (after verify) ──────────────────────────

    /**
     * Store plan selection in session and redirect to card details.
     */
    public function storePlanSelection(Request $request)
    {
        $validated = $request->validate([
            'plan_key' => 'required|string|in:starter,professional,enterprise,plus',
            'billing_cycle' => 'required|string|in:monthly,annual',
        ]);

        $request->session()->put('onboarding_plan', $validated);

        return redirect()->route('onboarding.card');
    }

    // ─── Step 4: Card Details ────────────────────────────────────────────

    /**
     * Show card details form (Step 4).
     */
    public function showCardDetails(Request $request): Response
    {
        return Inertia::render('Onboarding/CardDetails');
    }

    /**
     * Store card details with AES-256 encryption.
     */
    public function storeCardDetails(Request $request)
    {
        $user = $request->user();

        // Handle "Skip" option
        if ($request->input('skip')) {
            return redirect()->route('onboarding.setup');
        }

        $validated = $request->validate([
            'card_number' => 'required|string|min:13|max:16|regex:/^\d+$/',
            'card_holder' => 'required|string|max:50',
            'card_expiry' => 'required|string|regex:/^\d{2}\/\d{2}$/',
            'card_cvv' => 'required|string|min:3|max:4|regex:/^\d+$/',
        ]);

        // Encrypt sensitive data with AES-256-CBC (Laravel Crypt uses APP_KEY)
        // Mark any existing default card as non-default
        $user->paymentCards()->where('is_default', true)->update(['is_default' => false]);

        $user->paymentCards()->create([
            'label' => 'Primary',
            'card_last_four' => substr($validated['card_number'], -4),
            'card_holder_name' => $validated['card_holder'],
            'card_expiry_encrypted' => \Illuminate\Support\Facades\Crypt::encryptString($validated['card_expiry']),
            'card_token_encrypted' => \Illuminate\Support\Facades\Crypt::encryptString($validated['card_number']),
            'is_default' => true,
        ]);

        return redirect()->route('onboarding.setup');
    }

    // ─── Step 5: Organization Details (now after plan+card) ──────────────

    /**
     * Show organization setup form (Step 5).
     */
    /** Allowed non-festival theme keys (must match [data-theme] in brand-palettes.css) */
    public const BRAND_THEMES = [
        'nature', 'royal', 'vibrant', 'heritage', 'intelligence', 'serenity',
        'energy', 'oxford', 'crimson', 'teal', 'sunset', 'forest', 'plum',
        'cobalt', 'rose', 'slate', 'jade', 'saffron', 'pdseducation', 'navratri',
    ];

    public function showOrgSetup(Request $request): Response
    {
        return Inertia::render('Onboarding/OrganizationSetup', [
            'institutionTypes' => array_map(fn($type) => [
                'value' => $type->value,
                'label' => $type->label(),
            ], InstitutionType::cases()),
        ]);
    }

    // ─── Email Verification ─────────────────────────────────────────────

    /**
     * Show "Check your inbox" page.
     * If user is already verified, redirect them to the next step.
     */
    public function showVerifyNotice(Request $request): Response|\Illuminate\Http\RedirectResponse
    {
        $user = $request->user();

        // If logged in, let the resolver decide where they should be
        if ($user) {
            $result = UserRedirectResolver::resolve($user, $request);
            // Only redirect away if the resolver says they don't belong here
            if ($result && $result->target !== 'onboarding.verify.notice') {
                return $result->isExternal
                    ? redirect()->away($result->target)
                    : redirect()->route($result->target);
            }
        }

        $email = $request->query('email', '');

        // If no email provided and no user logged in, go to register
        if (!$email && !$user) {
            return redirect()->route('register');
        }

        // Use the user's email if logged in
        if ($user) {
            $email = $user->email;
        }

        // Check if verified by email (user clicked link in another tab/device)
        if (!$user && $email) {
            $dbUser = User::where('email', $email)->first();
            if ($dbUser && $dbUser->email_verified_at) {
                Auth::login($dbUser);
                if ($dbUser->onboarding_data) {
                    session(['onboarding_org' => $dbUser->onboarding_data]);
                }
                return redirect()->route('onboarding.plan');
            }
        }

        return Inertia::render('Onboarding/VerifyEmailNotice', [
            'email' => $email,
            'redirectUrl' => route('onboarding.plan'),
        ]);
    }

    /**
     * Poll endpoint: check if verification is done (called by frontend).
     */
    public function checkVerificationStatus(Request $request): \Illuminate\Http\JsonResponse
    {
        $email = $request->query('email', '');
        if (!$email) {
            return response()->json(['verified' => false]);
        }

        $user = User::where('email', $email)->first();
        if ($user && $user->email_verified_at) {
            // Log them in so the redirect to /onboarding/plan works
            Auth::login($user);
            if ($user->onboarding_data) {
                session(['onboarding_org' => $user->onboarding_data]);
            }
            return response()->json(['verified' => true]);
        }

        return response()->json(['verified' => false]);
    }

    /**
     * Handle verification link click.
     */
    public function verifyEmail(string $token)
    {
        $user = User::where('onboarding_token', $token)->first();

        if (!$user) {
            // Token already used — check if user is already logged in and verified
            $authUser = Auth::user();
            if ($authUser && $authUser->email_verified_at) {
                if ($authUser->status == 0) {
                    return redirect()->route('onboarding.plan');
                }
                return redirect()->route('dashboard');
            }

            return redirect()->route('register')->withErrors([
                'email' => \App\Support\ApiErrorMap::message('onboarding.verification_expired'),
            ]);
        }

        // Mark as verified
        $user->update([
            'email_verified_at' => now(),
            'onboarding_token' => null,
        ]);

        // Pull stored org data into session for the current step
        if ($user->onboarding_data) {
            session(['onboarding_org' => $user->onboarding_data]);
        }

        // Log them in
        Auth::login($user);

        return redirect()->route('onboarding.plan');
    }

    /**
     * Resend verification email.
     */
    public function resendVerification(Request $request)
    {
        // Try to find user by session ID first, then by email from the request
        $userId = $request->session()->get('onboarding_user_id');
        $user = $userId ? User::find($userId) : null;

        // Fallback: look up by email from the request body or the authenticated user
        if (!$user) {
            $email = $request->input('email') ?? ($request->user()?->email);
            if ($email) {
                $user = User::where('email', $email)->where('status', 0)->first();
            }
        }

        if (!$user || $user->email_verified_at) {
            return back()->with('error', \App\Support\ApiErrorMap::message('onboarding.resend_failed'));
        }

        // Generate new token
        $token = Str::random(64);
        $user->update(['onboarding_token' => $token]);

        // Store in session for future resends
        $request->session()->put('onboarding_user_id', $user->id);

        $verifyUrl = route('onboarding.verify', ['token' => $token]);

        try {
            Mail::send('emails.onboarding-verify', [
                'user' => $user,
                'verifyUrl' => $verifyUrl,
            ], function ($message) use ($user) {
                $message->to($user->email)
                    ->subject('Verify Your Email — SutraEMS');
            });
        } catch (\Throwable $e) {
            \Log::warning('Resend verification email failed', [
                'email' => $user->email,
                'error' => $e->getMessage(),
            ]);

            return back()->with('error', 'Failed to send verification email. Please try again later.');
        }

        return back()->with('success', 'Verification email resent.');
    }

    // ─── Step 3: Plan Selection (show only) ────────────────────────────────
    // storePlanSelection is defined above (redirects to card step)

    /**
     * Show plan selection (Step 3).
     */
    public function showPlanSelection(Request $request): Response|\Illuminate\Http\RedirectResponse
    {
        $user = $request->user();

        $result = UserRedirectResolver::resolve($user, $request);
        if ($result && $result->target !== 'onboarding.plan') {
            return $result->isExternal
                ? redirect()->away($result->target)
                : redirect()->route($result->target);
        }

        $plans = array_map(fn($tier) => [
            'key' => $tier->value,
            'name' => $tier->label(),
            'monthly' => '₹' . number_format($tier->monthlyPriceInr()),
            'annual' => '₹' . number_format($tier->annualPricePerMonthInr()),
            'is_popular' => $tier === SubscriptionTier::PROFESSIONAL,
            'limits' => array_map(fn($k, $v) => ['label' => ucfirst($k), 'value' => $v === PHP_INT_MAX ? 'Unlimited' : $v], array_keys($tier->limits()), array_values($tier->limits())),
            'modules' => array_map(fn($m) => ['name' => str_replace('_', ' ', ucfirst($m)), 'included' => true], $tier->modules()),
        ], SubscriptionTier::cases());

        return Inertia::render('Onboarding/PlanSelection', [
            'plans' => $plans,
        ]);
    }

    // ─── Step 5: Organization Setup (creates org + inst) ────────────────

    /**
     * Validate org data, create Org, Inst, Assign Roles & Workflows, activate user.
     * Happens after plan + card steps.
     */
    public function storeOrgSetup(Request $request)
    {
        $planData = $request->session()->get('onboarding_plan');
        if (!$planData) {
            $planData = ['plan_key' => 'starter', 'billing_cycle' => 'monthly'];
            $request->session()->put('onboarding_plan', $planData);
        }

        $validated = $request->validate([
            'org_name' => 'required|string|max:200',
            'inst_type' => 'required|string|in:school,college,coaching,university',
            'brand_theme' => 'nullable|string|in:' . implode(',', self::BRAND_THEMES),
            'slug' => 'required|string|alpha_dash|max:30',
            'udise_code' => ['nullable', 'string', 'digits:11', 'unique:institutions,udise_code'],
        ]);

        // Check domain uniqueness
        if (\App\Models\InstitutionDomain::isDomainTaken($validated['slug'])) {
            return \App\Support\ApiErrorMap::validationError('onboarding.domain_taken', 'slug');
        }

        $validated['inst_name'] = $validated['org_name'];
        $user = $request->user();

        // Delegate all provisioning to the reusable service
        $institution = app(\App\Services\OnboardingService::class)
            ->provision($user, $validated, $planData);

        // Session bookkeeping
        $request->session()->put('onboarding_org', $validated);
        $request->session()->put('onboarded_institution_id', $institution->id);
        $request->session()->put('active_institution_id', $institution->id);
        \App\Support\InstitutionContext::setActiveInstitutionId($institution->id, $user);
        $request->session()->forget('onboarding_plan');

        return redirect()->route('onboarding.data-import');
    }

    // ─── Step 6: Data Import ────────────────────────────────────────────


    /**
     * Show data import page (Step 6).
     */
    public function showDataImport(Request $request): Response|\Illuminate\Http\RedirectResponse
    {
        $user = $request->user();
        $institutionId = \App\Support\InstitutionContext::getActiveInstitutionId($user)
            ?? $request->session()->get('onboarded_institution_id');
        $institution = $institutionId ? Institution::find($institutionId) : null;

        if (!$institution) {
            return redirect()->route('onboarding.setup');
        }

        return Inertia::render('Onboarding/DataImport', [
            'instType' => $institution->type->value,
            'institutionName' => $institution->name,
            'institutionId' => $institution->id,
        ]);
    }

    /**
     * Auto-seed a data category for the current institution.
     */
    public function autoSeedCategory(Request $request, string $category): \Illuminate\Http\JsonResponse
    {
        $institution = $this->resolveOnboardingInstitution($request);
        if (!$institution) {
            return response()->json(['message' => 'Institution not found'], 404);
        }

        try {
            $seeder = app(\App\Services\OnboardingDataSeederService::class);
            $count = $seeder->seed($category, $institution);

            return response()->json(['status' => 'seeded', 'category' => $category, 'count' => $count]);
        } catch (\Throwable $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    /**
     * Handle CSV upload for a data category.
     */
    public function uploadCategory(Request $request, string $category): \Illuminate\Http\JsonResponse
    {
        $request->validate(['file' => 'required|file|mimes:csv,xlsx|max:5120']);

        // TODO: Implement CSV parsing & import per category
        return response()->json(['status' => 'uploaded', 'category' => $category]);
    }

    /**
     * Download a sample CSV template for a data category.
     * Delegates headers + data to OnboardingDataSeederService for single source of truth.
     */
    public function downloadSampleTemplate(Request $request, string $category): \Symfony\Component\HttpFoundation\StreamedResponse
    {
        $seeder = app(\App\Services\OnboardingDataSeederService::class);

        $headers = \App\Services\OnboardingDataSeederService::csvHeaders($category);
        if (!$headers) {
            \App\Support\ApiErrorMap::abort('onboarding.unknown_category');
        }

        $institution = $this->resolveOnboardingInstitution($request);
        $type = $institution?->type?->value ?? config('ems.default_institution_type', 'school');
        $rows = $seeder->csvSampleData($category, $type);

        $filename = str_replace('-', '_', $category) . '_sample.csv';

        return response()->streamDownload(function () use ($headers, $rows) {
            $out = fopen('php://output', 'w');
            fputcsv($out, $headers);
            foreach ($rows as $row) {
                $line = [];
                foreach ($headers as $col) {
                    $line[] = $row[$col] ?? '';
                }
                fputcsv($out, $line);
            }
            fclose($out);
        }, $filename, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"{$filename}\"",
        ]);
    }

    /**
     * Resolve the institution for onboarding-related actions.
     */
    private function resolveOnboardingInstitution(Request $request): ?Institution
    {
        $user = $request->user();
        $institutionId = \App\Support\InstitutionContext::getActiveInstitutionId($user)
            ?? $request->session()->get('onboarded_institution_id');
        return $institutionId ? Institution::find($institutionId) : null;
    }

    // ─── Platform Setup (Post-Onboarding Bootstrapper) ────────────────

    /**
     * Show the "Setting Up Your Platform" loader page.
     */
    public function showPlatformSetup(Request $request): Response|\Illuminate\Http\RedirectResponse
    {
        $user = $request->user();
        if (!$user) {
            return redirect()->route('register');
        }

        $institutionId = \App\Support\InstitutionContext::getActiveInstitutionId($user)
            ?? $request->session()->get('onboarded_institution_id');
        $institution = $institutionId ? Institution::find($institutionId) : null;

        // Build full subdomain URL via single-source-of-truth helper
        $dashboardUrl = $institution?->buildSubdomainUrl('/dashboard', $request)
            ?? '/dashboard';

        return Inertia::render('Onboarding/PlatformSetup', [
            'redirectUrl' => $dashboardUrl,
            'institutionName' => $institution?->name ?? 'your institution',
        ]);
    }

}

