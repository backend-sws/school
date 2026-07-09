<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Normalize broadcast channel_name to prevent duplicate prefix issues.
 * e.g. private-private-App.Models.User.22 → private-App.Models.User.22
 */
class NormalizeBroadcastChannelName
{
    public function handle(Request $request, Closure $next): Response
    {
        if ($this->isBroadcastAuth($request)) {
            $this->normalizeChannelName($request);
        }

        return $next($request);
    }

    private function isBroadcastAuth(Request $request): bool
    {
        return ($request->is('broadcasting/auth') || $request->is('/broadcasting/auth')) && $request->has('channel_name');
    }

    private function normalizeChannelName(Request $request): void
    {
        $channel = $request->input('channel_name');

        if (!is_string($channel) || $channel === '') {
            return;
        }

        $normalized = $this->collapsePrefix($channel);

        if ($normalized !== $channel) {
            $request->merge(['channel_name' => $normalized]);
        }
    }

    private function collapsePrefix(string $channel): string
    {
        $channel = preg_replace('/^(private-)+/', 'private-', $channel);
        $channel = preg_replace('/^(presence-)+/', 'presence-', $channel);

        return $channel;
    }
}
