<?php

namespace App\Http\Controllers\Api\V1\Organization;

use App\Services\R2Service;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\StreamedResponse;

class InstitutionLogoController
{
    /**
     * Stream the institution logo (public, no auth).
     * Used when logo is stored in R2 or local storage so the login page can show it.
     */
    public function __invoke(Request $request): mixed
    {
        $path = InstitutionProfileController::getRawLogoPath();
        if (empty($path) || ! is_string($path)) {
            abort(404);
        }
        $path = trim($path);

        // Local public path (e.g. /assets/logo.png)
        if (str_starts_with($path, '/')) {
            $absolute = public_path($path);
            if (! is_file($absolute)) {
                abort(404);
            }
            return response()->file($absolute);
        }

        // Full URL – redirect
        if (str_starts_with($path, 'http://') || str_starts_with($path, 'https://')) {
            return redirect($path);
        }

        // R2 path (e.g. uploads/2/xxx.jpeg)
        try {
            $r2 = app(R2Service::class);
            $object = $r2->getObject($path);
            if (! $object) {
                abort(404);
            }
            $body = $object['Body'];
            $contentType = $object['ContentType'] ?? 'application/octet-stream';

            return response()->stream(function () use ($body) {
                while (! $body->eof()) {
                    echo $body->read(8192);
                }
            }, 200, [
                'Content-Type' => $contentType,
                'Cache-Control' => 'public, max-age=3600',
            ]);
        } catch (\Throwable) {
            abort(404);
        }
    }
}
