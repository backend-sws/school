<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Organization;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;
use Inertia\Response;

class MainLandingController extends Controller
{
    /**
     * Display the main EMS landing page.
     */
    public function __invoke(Request $request): Response|\Illuminate\Http\RedirectResponse
    {
        // Client deployments skip the product landing page entirely
        if (config('ems.skip_landing')) {
            return redirect(auth()->check() ? '/dashboard' : '/login');
        }

        $data = require database_path('seeders/data/landing.php');

        // Onboarded partners — cached 1 hour, public-safe fields only
        $data['partners'] = Cache::remember('landing_partners', 3600, function () {
            return Organization::where('status', 1)
                ->select('name', 'city', 'state', 'logo_url')
                ->orderBy('name')
                ->get()
                ->toArray();
        });

        return Inertia::render('main-landing', $data);
    }
}
