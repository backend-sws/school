<?php

namespace App\Http\Middleware;

use App\Support\UserRedirectResolver;
use Closure;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

/**
 * Redirect authenticated users to the appropriate destination.
 *
 * All decision logic lives in UserRedirectResolver.
 * This middleware only handles the HTTP response mechanics.
 */
class RedirectDashboard
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (!$user) {
            return $next($request);
        }

        $result = UserRedirectResolver::resolve($user, $request);

        if (!$result) {
            return $next($request);
        }

        // Don't redirect if already on the target route
        if (!$result->isExternal) {
            if ($request->routeIs($result->target)) {
                return $next($request);
            }
            // Also check path match as safety net
            try {
                $targetPath = route($result->target, [], false);
                if ($request->is(ltrim($targetPath, '/'))) {
                    return $next($request);
                }
            } catch (\Exception $e) {
                // Route doesn't exist — let it redirect and fail naturally
            }
        }

        // Cross-domain: use Inertia::location for XHR, redirect()->away for normal
        if ($result->isExternal) {
            return $request->header('X-Inertia')
                ? Inertia::location($result->target)
                : redirect()->away($result->target);
        }

        return redirect()->route($result->target);
    }
}
