<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Support\VerificationToken;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Generic verify-email + set-password entry (students, staff, etc.).
 */
class VerifyEmailController extends Controller
{
    /**
     * Verify token from email link and show set-password page, or redirect to login with error.
     */
    public function __invoke(Request $request): Response|RedirectResponse
    {
        $token = $request->query('token');

        if (empty($token)) {
            return redirect('/login')->with('error', 'Invalid or missing verification link.');
        }

        $user = VerificationToken::verifyToken($token);

        if (!$user) {
            return redirect('/login')->with('error', 'This link has expired or is invalid. Please request a new one.');
        }

        return Inertia::render('auth/set-password', [
            'token' => $token,
        ]);
    }
}
