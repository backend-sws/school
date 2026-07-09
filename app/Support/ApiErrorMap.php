<?php

namespace App\Support;

use Illuminate\Http\JsonResponse;
use Symfony\Component\HttpKernel\Exception\HttpException;

/**
 * Centralized error response helper.
 *
 * Reads from config/api_error_maps.php. Keeps error messages
 * and HTTP status codes in one place instead of scattered inline.
 *
 * Usage:
 *   ApiErrorMap::respond('onboarding.domain_taken')
 *   ApiErrorMap::respond('auth.unauthorized', ['detail' => '...'])
 *   ApiErrorMap::abort('generic.not_found')
 *   ApiErrorMap::message('billing.invalid_plan')
 *   ApiErrorMap::status('generic.forbidden')
 *   ApiErrorMap::validationError('onboarding.domain_taken', 'slug')
 */
class ApiErrorMap
{
    /**
     * Return a JsonResponse for the given error key.
     *
     * @param string $key     Dot-notation key (e.g. 'onboarding.domain_taken')
     * @param array  $extra   Extra data to merge into the response payload
     */
    public static function respond(string $key, array $extra = []): JsonResponse
    {
        $entry = static::resolve($key);

        return response()->json(array_merge([
            'success' => false,
            'message' => $entry['message'],
            'error_code' => $key,
        ], $extra), $entry['status']);
    }

    /**
     * Throw an HttpException (for non-JSON flows or abort-style usage).
     *
     * @param string $key     Dot-notation key
     * @param array  $headers Optional headers for the HTTP exception
     *
     * @throws HttpException
     */
    public static function abort(string $key, array $headers = []): never
    {
        $entry = static::resolve($key);

        throw new HttpException($entry['status'], $entry['message'], null, $headers);
    }

    /**
     * Return a redirect-back with validation errors (for Inertia/web flows).
     *
     * @param string $key   Error map key
     * @param string $field Form field name for the error bag
     */
    public static function validationError(string $key, string $field): \Illuminate\Http\RedirectResponse
    {
        return back()->withErrors([$field => static::message($key)])->withInput();
    }

    /**
     * Get just the message string for a key.
     */
    public static function message(string $key): string
    {
        return static::resolve($key)['message'];
    }

    /**
     * Get just the HTTP status code for a key.
     */
    public static function status(string $key): int
    {
        return static::resolve($key)['status'];
    }

    /**
     * Resolve the error entry from config, with fallback.
     *
     * @return array{message: string, status: int}
     */
    private static function resolve(string $key): array
    {
        $entry = config("api_error_maps.{$key}");

        if (!$entry) {
            return [
                'message' => "Unknown error: {$key}",
                'status' => 500,
            ];
        }

        return [
            'message' => $entry['message'] ?? 'An error occurred.',
            'status' => $entry['status'] ?? 500,
        ];
    }
}
