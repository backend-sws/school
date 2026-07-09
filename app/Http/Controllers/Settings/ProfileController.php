<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Http\Requests\Settings\ProfileUpdateRequest;
use App\Models\User;
use App\Support\EffectiveStudentContext;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the user's profile settings page.
     * Uses effective user so when parent has switched to a student (e.g. Deepa), this shows that student's profile.
     */
    public function edit(Request $request): Response
    {
        $user = $this->resolveProfileUser($request);
        return Inertia::render('settings/profile', [
            'mustVerifyEmail' => $user instanceof MustVerifyEmail,
            'status' => $request->session()->get('status'),
        ]);
    }

    /**
     * Get the user's profile data (API endpoint).
     * Uses effective user by id: when parent has switched to a student, returns that student's profile (never by email).
     */
    public function show(Request $request): JsonResponse
    {
        $user = $this->resolveProfileUser($request);
        return response()->json([
            'success' => true,
            'data' => $user,
        ]);
    }

    /**
     * Update the user's profile settings.
     * Uses effective user by id: when parent has switched to Deepa, updates Deepa's profile.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse|JsonResponse
    {
        $user = $this->resolveProfileUser($request);

        $user->fill($request->validated());

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        $user->save();

        // Return JSON for API requests
        if ($request->expectsJson()) {
            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'data' => $user,
            ]);
        }

        return to_route('profile.edit');
    }

    /**
     * Profile user for display/update: effective user when parent has switched context (e.g. to Deepa), else authenticated user.
     * Resolved by user id only (session + EffectiveStudentContext), never by email.
     */
    private function resolveProfileUser(Request $request): User
    {
        $authUser = $request->user();
        if (! $authUser) {
            abort(401);
        }
        $effective = EffectiveStudentContext::getEffectiveUser($authUser);
        $user = $effective ?? $authUser;
        return User::query()->findOrFail($user->id);
    }

    /**
     * Delete the user's account. Always the authenticated user (not the effective/switch context).
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        // Release FK from audit_logs so the user can be deleted (audit rows kept with user_id = null)
        \App\Models\AuditLog::where('user_id', $user->id)->update(['user_id' => null]);

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
