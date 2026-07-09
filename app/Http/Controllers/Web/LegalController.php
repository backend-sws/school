<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\File;
use Inertia\Inertia;

/**
 * Serves legal / policy pages.
 * Reads raw markdown from resources/md/ and passes it to the React component.
 */
class LegalController extends Controller
{
    /**
     * Mapping of slug → [md file, Inertia component].
     */
    private const PAGES = [
        'terms'   => ['file' => 'terms.md',   'component' => 'Legal/TermsAndConditions'],
        'privacy' => ['file' => 'privacy.md', 'component' => 'Legal/PrivacyPolicy'],
    ];

    /**
     * Render a legal page by slug.
     */
    public function show(string $slug)
    {
        $page = self::PAGES[$slug] ?? null;

        if (!$page) {
            abort(404);
        }

        $path = resource_path("md/{$page['file']}");

        if (!File::exists($path)) {
            abort(404, 'Legal document not found.');
        }

        return Inertia::render($page['component'], [
            'content' => File::get($path),
        ]);
    }
}
