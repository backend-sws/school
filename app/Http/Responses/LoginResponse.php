<?php

namespace App\Http\Responses;

use App\Support\UserRedirectResolver;
use Laravel\Fortify\Contracts\LoginResponse as LoginResponseContract;
use Symfony\Component\HttpFoundation\Response;

class LoginResponse implements LoginResponseContract
{
    /**
     * Create an HTTP response that represents the object.
     *
     * Delegates destination logic to UserRedirectResolver.
     * Handles XHR vs normal request mechanics here.
     */
    public function toResponse($request): Response
    {
        $user = $request->user();

        if ($user) {
            \App\Support\InstitutionContext::refreshDefaultAfterLogin($user);
        }

        $result = UserRedirectResolver::resolve($user, $request);
        $target = $result?->target ?? '/dashboard';
        $isExternal = $result?->isExternal ?? false;

        // XHR/JSON: return redirect URL as JSON to avoid CORS on cross-subdomain
        if ($request->expectsJson()) {
            $url = $isExternal ? $target : route($target);
            return response()->json(['redirect' => $url]);
        }

        return $isExternal
            ? redirect()->away($target)
            : redirect()->route($target);
    }
}
