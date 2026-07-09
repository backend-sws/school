<?php

namespace App\Providers;

use App\Actions\Fortify\CreateNewUser;
use App\Actions\Fortify\ResetUserPassword;
use App\Http\Middleware\BlockSubdomainRegistration;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Laravel\Fortify\Features;
use Laravel\Fortify\Fortify;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class FortifyServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->app->singleton(
            \Laravel\Fortify\Contracts\LoginResponse::class,
            \App\Http\Responses\LoginResponse::class
        );

        $this->app->singleton(
            \Laravel\Fortify\Contracts\RegisterResponse::class,
            \App\Http\Responses\RegisterResponse::class
        );

        $this->app->singleton(
            \Laravel\Fortify\Contracts\TwoFactorLoginResponse::class,
            \App\Http\Responses\TwoFactorLoginResponse::class
        );
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureActions();
        $this->configureViews();
        $this->configureRateLimiting();

        // ── Support dual-channel password reset (Email or Mobile) ────────
        // Standard Fortify PasswordResetLinkController expects 'email' key.
        // We intercept the request data to resolve users by mobile if email doesn't match.
        if ($this->app['request']->isMethod('post') && $this->app['request']->routeIs('password.email')) {
            $loginId = $this->app['request']->input('email');
            if ($loginId) {
                $userByMobile = User::where('mobile', $loginId)->first();
                if ($userByMobile && $userByMobile->email) {
                    // Redirect internally with the real email if found
                    $this->app['request']->merge(['email' => $userByMobile->email]);
                } elseif ($userByMobile && !$userByMobile->email) {
                    // Handled by User::getEmailForPasswordReset() which returns mobile
                    $this->app['request']->merge(['email' => $userByMobile->mobile]);
                }
            }
        }

        // Block self-registration on institution subdomains (runtime check)
        Route::matched(function (\Illuminate\Routing\Events\RouteMatched $event) {
            $route = $event->route;
            $name = $route->getName();
            if (in_array($name, ['register'], true)) {
                $route->middleware(BlockSubdomainRegistration::class);
            }
            if ($name === 'password.email') {
                $route->middleware('throttle:password-reset');
            }
        });

        Fortify::authenticateUsing(function (Request $request) {
            $loginId = $request->login_id;
            $isEmail = filter_var($loginId, FILTER_VALIDATE_EMAIL);

            if ($isEmail) {
                $candidates = User::where('email', $loginId)->get();
            } else {
                $variants = \App\Services\SmsService::getMobileVariants($loginId);
                $candidates = User::whereIn('mobile', $variants)->get();
            }

            // Prefer guardian among matching users for unified context
            $user = $candidates->filter(fn($u) => Hash::check($request->password, $u->password))
                ->sortByDesc(fn($u) => \App\Support\EffectiveStudentContext::isGuardianUser($u) ? 1 : 0)
                ->first();

            if (!$user) {
                return null;
            }

            if ($user->status != 1) {
                return null;
            }

            // Subdomain login guard: verify the user belongs to this institution
            $institutionId = config('ems.default_institution_id');
            if ($institutionId) {
                $belongsToInstitution = $user->roles()
                    ->withoutGlobalScope('institution_scope')
                    ->where('user_roles.institution_id', $institutionId)
                    ->exists();

                if (!$belongsToInstitution) {
                    throw \Illuminate\Validation\ValidationException::withMessages([
                        'login_id' => __('Your account is not associated with this institution.'),
                    ]);
                }
            }

            $user->update(['last_login' => now()]);
            return $user;
        });
    }

    /**
     * Configure Fortify actions.
     */
    private function configureActions(): void
    {
        Fortify::resetUserPasswordsUsing(ResetUserPassword::class);
        Fortify::createUsersUsing(CreateNewUser::class);
    }

    /**
     * Configure Fortify views.
     */
    private function configureViews(): void
    {
        Fortify::loginView(fn(Request $request) => Inertia::render('auth/login', [
            'canResetPassword' => Features::enabled(Features::resetPasswords()),
            'canRegister' => !config('ems.default_institution_id'),
            'status' => $request->session()->get('status'),
        ]));

        Fortify::resetPasswordView(fn(Request $request) => Inertia::render('auth/reset-password', [
            'email' => $request->email,
            'token' => $request->route('token'),
        ]));

        Fortify::requestPasswordResetLinkView(fn(Request $request) => Inertia::render('auth/forgot-password', [
            'status' => $request->session()->get('status'),
        ]));

        Fortify::verifyEmailView(fn(Request $request) => Inertia::render('auth/verify-email', [
            'status' => $request->session()->get('status'),
        ]));

        // Register view is handled by OnboardingController::showAccountForm
        // Fortify::registerView(fn() => Inertia::render('auth/register'));

        Fortify::twoFactorChallengeView(fn() => Inertia::render('auth/two-factor-challenge'));

        Fortify::confirmPasswordView(fn() => Inertia::render('auth/confirm-password'));
    }

    /**
     * Configure rate limiting.
     */
    private function configureRateLimiting(): void
    {
        RateLimiter::for('two-factor', function (Request $request) {
            return Limit::perMinute(5)->by($request->session()->get('login.id'));
        });

        RateLimiter::for('login', function (Request $request) {
            $throttleKey = Str::transliterate(Str::lower($request->input(Fortify::username())) . '|' . $request->ip());

            return Limit::perMinute(5)->by($throttleKey);
        });

        RateLimiter::for('password-reset', function (Request $request) {
            $id = $request->input('email') ?: $request->ip();
            return Limit::perMinutes(10, 3)->by($id);
        });
    }
}
