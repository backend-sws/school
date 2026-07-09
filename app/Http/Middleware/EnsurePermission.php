<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Require at least one of the given permission keys (OR logic).
 * Usage: middleware('ensure-permission:view_applications,manage_applications')
 */
class EnsurePermission
{
    public function handle(Request $request, Closure $next, string ...$permissionKeys): Response
    {
        if (!$request->user()) {
            return $this->unauthenticated($request);
        }

        if (!$this->hasAnyPermission($request->user(), $permissionKeys)) {
            throw new AuthorizationException('You do not have permission to perform this action.');
        }

        return $next($request);
    }

    private function hasAnyPermission($user, array $keys): bool
    {
        $effective = $user->resolveEffectivePermissionKeys();

        return !empty(array_intersect($keys, $effective));
    }

    private function unauthenticated(Request $request): Response
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json(['success' => false, 'message' => 'Unauthenticated.'], 401);
        }

        return redirect()->guest(route('login'));
    }
}
