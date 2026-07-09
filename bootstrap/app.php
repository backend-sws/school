<?php

use App\Http\Middleware\CheckUserRole;
use App\Http\Middleware\EnsurePermission;
use App\Http\Middleware\EnsurePermissionGroup;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use App\Http\Middleware\ShareSeoSettings;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Support\Facades\Route;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
        then: function () {
            Route::middleware('web')->group(base_path('routes/public.php'));
        },
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->trustProxies(at: '*');
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->web(prepend: [
            \App\Http\Middleware\ResolveInstitutionFromDomain::class,
            \App\Http\Middleware\NormalizeBroadcastChannelName::class,
        ]);
        $middleware->web(append: [
            HandleAppearance::class,
            ShareSeoSettings::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
        $middleware->validateCsrfTokens(except: [
            'api/v1/payments/payu/callback',
            'metrics',
            '/metrics',
            'broadcasting/auth',
            '/broadcasting/auth',
            'broadcasting/*',
        ]);

        $middleware->api(prepend: [
            \App\Http\Middleware\ResolveInstitutionFromDomain::class,
            \App\Http\Middleware\ForceJsonResponse::class,
            \Illuminate\Routing\Middleware\ThrottleRequests::class . ':api',
            \Illuminate\Cookie\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
        ]);

        $middleware->alias([
            'check-role' => CheckUserRole::class,
            'ensure-permission' => EnsurePermission::class,
            'ensure-permission-group' => EnsurePermissionGroup::class,
            'dashboard-redirect' => \App\Http\Middleware\RedirectDashboard::class,
            'subscription' => \App\Http\Middleware\CheckSubscription::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(function ($request, $e) {
            if ($request->is('api/*')) {
                return true;
            }

            return $request->expectsJson();
        });

        // Gracefully recover from stale/corrupt sessions (e.g. after container restart)
        $exceptions->render(function (\Illuminate\Database\QueryException $e, \Illuminate\Http\Request $request) {
            $msg = $e->getMessage();
            if (str_contains($msg, 'sessions') || str_contains($msg, 'pdo_stmt_')) {
                // Nuke the broken session cookie and redirect to login
                if ($request->hasSession()) {
                    $request->session()->invalidate();
                    $request->session()->regenerateToken();
                }
                if (!$request->is('api/*') && !$request->expectsJson()) {
                    return redirect('/login')->withCookie(
                        cookie()->forget(config('session.cookie'))
                    );
                }
            }
        });

        $exceptions->render(function (\Throwable $e, \Illuminate\Http\Request $request) {
            if ($request->is('api/*')) {
                $statusCode = method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500;

                // Set status code for specific exceptions if not default
                if ($e instanceof \Illuminate\Auth\AuthenticationException) {
                    $statusCode = 401;
                } elseif ($e instanceof \Illuminate\Validation\ValidationException) {
                    $statusCode = 422;
                } elseif ($e instanceof \Symfony\Component\HttpKernel\Exception\NotFoundHttpException) {
                    $statusCode = 404;
                } elseif ($e instanceof \Illuminate\Auth\Access\AuthorizationException) {
                    $statusCode = 403;
                }

                $statusText = \Symfony\Component\HttpFoundation\Response::$statusTexts[$statusCode] ?? 'Unknown Status';

                $message = $e->getMessage() ?: $statusText;

                // Mask database errors to avoid leaking SQL/schema details
                if ($e instanceof \Illuminate\Database\QueryException || $e instanceof \PDOException) {
                    $message = 'Internal Server Error';
                }

                return response()->json([
                    'success' => false,
                    'message' => $message,
                    'status_code' => $statusCode,
                    'status_text' => $statusText,
                    'errors' => ($e instanceof \Illuminate\Validation\ValidationException) ? $e->errors() : null,
                ], $statusCode);
            }
        });
    })->create();
