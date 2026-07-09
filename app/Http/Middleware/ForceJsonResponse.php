<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Force Accept: application/json header on API requests.
 */
class ForceJsonResponse
{
    public function handle(Request $request, Closure $next): Response
    {
        $this->setJsonAcceptHeader($request);

        return $next($request);
    }

    private function setJsonAcceptHeader(Request $request): void
    {
        $request->headers->set('Accept', 'application/json');
    }
}
