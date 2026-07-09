<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class DocumentationController extends Controller
{
    /**
     * List all available documentation guides.
     */
    public function index(): Response
    {
        $files = File::files(base_path('docs'));
        $guides = [];

        foreach ($files as $file) {
            if ($file->getExtension() !== 'md') {
                continue;
            }

            $slug = $file->getBasename('.md');
            $raw  = File::get($file->getPathname());
            $title = str_replace('-', ' ', ucfirst($slug));

            if (preg_match('/^#\s+(.*)$/m', $raw, $m)) {
                $title = trim(preg_replace('/[🛠️🎓📋💰✅📅📜📚📦🚌🌐🛡️⚙️🎒🗺️📝🔐📊📐📒⚠️📢👥₹]/u', '', $m[1]));
            }

            $guides[] = [
                'slug'  => $slug,
                'title' => $title,
            ];
        }

        return Inertia::render('admin/docs/index', [
            'guides' => $guides,
        ]);
    }

    /**
     * Render a single documentation page.
     */
    public function show(string $slug): Response
    {
        $path = base_path("docs/{$slug}.md");

        if (!File::exists($path)) {
            abort(404, "Documentation not found.");
        }

        $raw = File::get($path);

        // Extract title
        $title = str_replace('-', ' ', ucfirst($slug));
        if (preg_match('/^#\s+(.*)$/m', $raw, $m)) {
            $title = trim(preg_replace('/[🛠️🎓📋💰✅📅📜📚📦🚌🌐🛡️⚙️🎒🗺️📝🔐📊📐📒⚠️📢👥₹]/u', '', $m[1]));
        }

        // Convert markdown → HTML (Laravel ships with commonmark)
        $html = Str::markdown($raw, [
            'html_input' => 'allow',
            'allow_unsafe_links' => false,
        ]);

        // Collect all guide slugs for sidebar nav
        $files = File::files(base_path('docs'));
        $allGuides = [];
        foreach ($files as $file) {
            if ($file->getExtension() !== 'md') continue;
            $s = $file->getBasename('.md');
            $r = File::get($file->getPathname());
            $t = str_replace('-', ' ', ucfirst($s));
            if (preg_match('/^#\s+(.*)$/m', $r, $m2)) {
                $t = trim(preg_replace('/[🛠️🎓📋💰✅📅📜📚📦🚌🌐🛡️⚙️🎒🗺️📝🔐📊📐📒⚠️📢👥₹]/u', '', $m2[1]));
            }
            $allGuides[] = ['slug' => $s, 'title' => $t];
        }

        return Inertia::render('admin/docs/viewer', [
            'slug'      => $slug,
            'title'     => $title,
            'html'      => $html,
            'allGuides' => $allGuides,
        ]);
    }
}
