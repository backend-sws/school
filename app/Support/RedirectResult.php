<?php

namespace App\Support;

/**
 * Immutable result from UserRedirectResolver.
 *
 * Represents where a user should be redirected.
 * Consumers interpret this uniformly instead of each building their own redirect.
 */
class RedirectResult
{
    public function __construct(
        /** Route name (e.g. 'dashboard') or full URL (cross-domain). */
        public readonly string $target,

        /** True = $target is a full URL, not a route name. */
        public readonly bool $isExternal = false,

        /** True = "no redirect needed, stop the rule chain". */
        public readonly bool $isStay = false,
    ) {
    }

    /** Convenience: route-based redirect. */
    public static function route(string $name): self
    {
        return new self($name, false);
    }

    /** Convenience: full URL redirect (cross-domain). */
    public static function url(string $url): self
    {
        return new self($url, true);
    }

    /** Sentinel: stop the rule chain without issuing a redirect. */
    public static function stay(): self
    {
        return new self('', false, true);
    }
}
