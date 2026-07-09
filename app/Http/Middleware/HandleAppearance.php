<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\View;
use Symfony\Component\HttpFoundation\Response;

/**
 * Share user's appearance preference (dark/light/system) with all views.
 */
class HandleAppearance
{
    public function handle(Request $request, Closure $next): Response
    {
        $this->shareAppearance($request);

        return $next($request);
    }

    private function shareAppearance(Request $request): void
    {
        $appearance = $this->resolveAppearance($request);
        View::share('appearance', $appearance);
    }

    private function resolveAppearance(Request $request): string
    {
        return $request->cookie('appearance') ?? 'system';
    }
}
