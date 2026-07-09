<?php

namespace App\Http\Controllers;

use App\Services\UrlShortener;
use Illuminate\Http\Request;

/**
 * Handles short URL redirects.
 * Route: GET /s/{code}
 */
class ShortUrlController extends Controller
{
    public function __invoke(string $code)
    {
        $originalUrl = UrlShortener::resolve($code);

        if (!$originalUrl) {
            abort(404, 'Link expired or not found.');
        }

        return redirect()->away($originalUrl);
    }
}
