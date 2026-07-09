<?php

namespace App\Http\Responses;

use Laravel\Fortify\Contracts\RegisterResponse as RegisterResponseContract;
use Symfony\Component\HttpFoundation\Response;

class RegisterResponse implements RegisterResponseContract
{
    /**
     * After registration, redirect straight to plan selection.
     * Org data was already stashed in the session by CreateNewUser.
     */
    public function toResponse($request): Response
    {
        return redirect()->route('onboarding.setup');
    }
}
