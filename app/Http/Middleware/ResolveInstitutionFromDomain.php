<?php

namespace App\Http\Middleware;

use App\Models\Institution;
use App\Models\InstitutionDomain;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;
use Symfony\Component\HttpFoundation\Response;

/**
 * Resolve institution from request host.
 * Known subdomain → set institution context.
 * Unknown subdomain → redirect to main domain.
 * No subdomain → Brand Mode.
 */
class ResolveInstitutionFromDomain
{
    private const CACHE_TTL = 300;
    private const CACHE_PREFIX = 'institution_domain:';

    public function handle(Request $request, Closure $next): Response
    {
        $host = $request->getHost();
        $originalAppHost = parse_url(config('app.url'), PHP_URL_HOST);

        // Always fix app.url to match the actual host (for URL generation, redirects, etc.)
        $this->overrideAppUrl($request, $host);

        // Authenticated users: context is resolved from user_roles (role-first),
        // NOT from the subdomain. But we still need to set the config so that
        // InstitutionProfileController::getProfile() returns the correct type.
        if ($request->hasSession() && auth()->check()) {
            $this->applyAuthenticatedContext();
            return $next($request);
        }

        // Unauthenticated requests: resolve institution from subdomain for public pages
        // Use the original app host (before override) so slug extraction works correctly.
        $slug = Institution::extractSlugFromHost($host, $originalAppHost);
        $resolved = $this->resolve($host, $slug);

        if ($resolved) {
            return $this->applyInstitution($resolved, $request, $next);
        }

        if ($slug !== null) {
            $port = $request->getPort();
            $portSuffix = in_array($port, [80, 443], true) ? '' : ':' . $port;
            $mainUrl = $request->getScheme() . '://' . $originalAppHost . $portSuffix;
            return $this->redirectToMain($request, $mainUrl);
        }

        return $this->applyBrandMode($request, $next);
    }

    private function resolve(string $host, ?string $slug): mixed
    {
        $key = self::CACHE_PREFIX . $host;

        if ($cached = Cache::get($key)) {
            return $cached;
        }

        $institution = $this->findByDomainAlias($host)
            ?? $this->findBySlug($slug)
            ?? $this->findInConfig($host);

        if ($institution) {
            Cache::put($key, $institution, self::CACHE_TTL);
        }

        return $institution;
    }

    private function findByDomainAlias(string $host): ?object
    {
        return InstitutionDomain::findInstitutionByDomain($host);
    }

    private function findBySlug(?string $slug): ?object
    {
        return $slug ? InstitutionDomain::findInstitutionByDomain($slug) : null;
    }

    private function findInConfig(string $host): ?object
    {
        $path = config('ems.institutions_config_path');
        if (empty($path))
            return null;

        $path = str_starts_with($path, '/') ? $path : base_path($path);
        if (!is_file($path))
            return null;

        $data = json_decode(@file_get_contents($path) ?: '', true);
        if (!is_array($data['institutions'] ?? null))
            return null;

        foreach ($data['institutions'] as $entry) {
            if (($entry['domain'] ?? '') === $host && isset($entry['institution_id'])) {
                return (object) [
                    'id' => (int) $entry['institution_id'],
                    'type' => $entry['type'] ?? config('ems.default_institution_type'),
                ];
            }
        }

        return null;
    }

    private function applyInstitution(object $institution, Request $request, Closure $next): Response
    {
        Config::set('ems.default_institution_id', (string) $institution->id);
        $type = $institution->type;
        Config::set('ems.default_institution_type', $type instanceof \BackedEnum ? $type->value : (string) $type);

        return $next($request);
    }

    private function applyBrandMode(Request $request, Closure $next): Response
    {
        // Singleton mode: keep the env-configured institution as context
        // so the public website renders instead of redirecting to login.
        if (config('ems.skip_landing')) {
            return $next($request);
        }

        Config::set('ems.default_institution_id', null);
        Config::set('ems.default_institution_type', null);

        return $next($request);
    }

    private function redirectToMain(Request $request, string $mainUrl): Response
    {
        if ($request->is('api/*') || $request->expectsJson()) {
            return response()->json([
                'success' => false,
                'message' => 'Institution not found for this domain.',
            ], 404);
        }

        return redirect()->to($mainUrl . $request->getRequestUri(), 302);
    }

    private function overrideAppUrl(Request $request, string $host): void
    {
        $port = $request->getPort();
        $portSuffix = in_array($port, [80, 443], true) ? '' : ':' . $port;
        Config::set('app.url', $request->getScheme() . '://' . $host . $portSuffix);
    }

    /**
     * For authenticated users: resolve institution from InstitutionContext (session → user_roles)
     * and set config so InstitutionProfileController::getProfile() returns the correct type.
     */
    private function applyAuthenticatedContext(): void
    {
        $institutionId = \App\Support\InstitutionContext::getActiveInstitutionId();

        if ($institutionId !== null) {
            Config::set('ems.default_institution_id', (string) $institutionId);

            $institution = \App\Models\Institution::find($institutionId);
            if ($institution) {
                $type = $institution->type;
                Config::set(
                    'ems.default_institution_type',
                    $type instanceof \BackedEnum ? $type->value : (string) $type,
                );
            }
        }
    }
}
