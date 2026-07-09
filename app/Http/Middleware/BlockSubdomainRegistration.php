<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Block self-registration on institution subdomains.
 * Registration is only allowed on the main brand domain.
 */
class BlockSubdomainRegistration
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($this->isOnSubdomain()) {
            return $this->redirectToLogin();
        }

        return $next($request);
    }

    private function isOnSubdomain(): bool
    {
        return (bool) config('ems.default_institution_id');
    }

    private function redirectToLogin(): Response
    {
        return redirect()->route('login');
    }
}
