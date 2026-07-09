<?php

namespace App\Http\Controllers\Web;

use App\Models\Organization;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Create institution under an organisation. organisation_id is required.
 */
class CreateInstitutionController
{
    public function __invoke(Request $request): Response|RedirectResponse
    {
        $organizationId = $request->query('organization_id');
        if (! $organizationId || ! is_numeric($organizationId)) {
            return redirect()->route('my-organisation.index')->with('error', 'Select an organisation to create an institution.');
        }

        $org = Organization::find((int) $organizationId);
        if (! $org) {
            return redirect()->route('my-organisation.index')->with('error', 'Organisation not found.');
        }

        return Inertia::render('my-organisation/create-institution', [
            'organization_id' => (int) $organizationId,
            'organization_name' => $org->name,
        ]);
    }
}
