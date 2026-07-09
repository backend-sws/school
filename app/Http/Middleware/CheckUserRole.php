<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

/**
 * Require at least one of the given roles (OR logic).
 * Usage: middleware('check-role:student,candidate')
 */
class CheckUserRole
{
    public function handle(Request $request, Closure $next, string ...$roles)
    {
        if (!auth()->check()) {
            return $this->unauthenticated($request);
        }

        if (!$this->hasAnyRole($roles)) {
            abort(403, 'You do not have permission to access this resource.');
        }

        return $next($request);
    }

    private function hasAnyRole(array $roles): bool
    {
        $allowed = array_map('strtolower', $roles);
        $userRoles = auth()->user()
            ->roles()
            ->withoutGlobalScope('institution_scope')
            ->pluck('key')
            ->map(fn($k) => strtolower($k))
            ->toArray();

        return !empty(array_intersect($userRoles, $allowed));
    }

    private function unauthenticated(Request $request)
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json(['success' => false, 'message' => 'Unauthenticated.'], 401);
        }

        return redirect('/login');
    }
}
