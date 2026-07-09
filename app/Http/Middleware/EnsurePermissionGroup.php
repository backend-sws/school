<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Auth\Access\AuthorizationException;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Require at least one permission from the named group(s).
 * Groups defined in config/route_permissions.php.
 * Usage: middleware('ensure-permission-group:admin_desk')
 */
class EnsurePermissionGroup
{
    public function handle(Request $request, Closure $next, string ...$groupNames): Response
    {
        if (!$request->user()) {
            return $this->unauthenticated($request);
        }

        $required = $this->resolveGroupPermissions($groupNames);



        if (empty($required) || !$this->hasAny($request->user(), $required)) {
            throw new AuthorizationException('You do not have permission to perform this action.');
        }

        return $next($request);
    }

    private function resolveGroupPermissions(array $groupNames): array
    {
        $keys = [];
        foreach ($groupNames as $group) {
            $groupKeys = config("route_permissions.{$group}", []);
            if (is_array($groupKeys)) {
                $keys = array_merge($keys, $groupKeys);
            }
        }

        return array_unique($keys);
    }

    private function hasAny($user, array $required): bool
    {
        $effective = $user->resolveEffectivePermissionKeys();

        return !empty(array_intersect($required, $effective));
    }

    private function unauthenticated(Request $request): Response
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            return response()->json(['success' => false, 'message' => 'Unauthenticated.'], 401);
        }

        return redirect()->guest(route('login'));
    }
}
