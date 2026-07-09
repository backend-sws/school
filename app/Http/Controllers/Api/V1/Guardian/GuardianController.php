<?php

namespace App\Http\Controllers\Api\V1\Guardian;

use App\Http\Controllers\Api\V1\BaseController;
use App\Mail\GuardianLinkAccountVerificationMail;
use App\Models\Guardian;
use App\Models\User;
use App\Services\GuardianService;
use App\Support\EffectiveStudentContext;
use App\Support\GuardianLinkToken;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;

class GuardianController extends BaseController
{
    /**
     * List students linked to the current user as guardian (one parent → many students).
     */
    public function myStudents(Request $request): JsonResponse
    {
        $user = $request->user();
        $guardians = $user->guardianRecords()
            ->with(['students' => fn ($q) => $q->with(['studentProfile' => fn ($q2) => $q2->with(['stream', 'session', 'institution'])])])
            ->get();

        $students = [];
        $seen = [];
        foreach ($guardians as $guardian) {
            foreach ($guardian->students as $student) {
                if (isset($seen[$student->id])) {
                    continue;
                }
                $seen[$student->id] = true;
                $profile = $student->studentProfile;
                $students[] = [
                    'id' => $student->id,
                    'name' => $student->name,
                    'email' => $student->email,
                    'avatar_url' => $student->avatar_url,
                    'mobile' => $student->mobile,
                    'reg_no' => $profile?->reg_no ?? $profile?->app_no,
                    'stream' => $profile?->stream?->name,
                    'session' => $profile?->session?->name,
                    'institution' => $profile?->institution?->name,
                    'institution_id' => $profile?->institution_id,
                ];
            }
        }

        return $this->success(['students' => array_values($students)], 'List of linked students.');
    }

    /**
     * Request to link current user to a guardian record by email. Sends a verification email;
     * linking and parent role are applied only when the user clicks the link in that email.
     */
    public function linkAccount(Request $request): JsonResponse
    {
        $request->validate([
            'email' => 'required|email|max:150',
        ]);

        $email = $request->input('email');

        $guardian = Guardian::query()
            ->whereNull('user_id')
            ->where('email', $email)
            ->first();

        if (! $guardian) {
            return $this->error('No unlinked guardian found with this email. Use the email used during your child\'s admission.', 404);
        }

        if (empty(trim((string) $guardian->email))) {
            return $this->error('This guardian record has no email; link account requires email verification.', 422);
        }

        $token = GuardianLinkToken::create($guardian->id, $guardian->email);
        $verifyUrl = GuardianLinkToken::verifyUrl($token);

        Mail::to($guardian->email)->send(new GuardianLinkAccountVerificationMail($verifyUrl));

        return $this->success(
            ['email' => $guardian->email],
            'Verification email sent. Check your inbox and click the link to link your account and get parent access.'
        );
    }

    /**
     * Verify link-account token (called when user clicks the link in the verification email).
     * This is the only place we set guardian.user_id (verified link). Without this, switch is not allowed.
     */
    public function verifyLinkAccount(Request $request): JsonResponse
    {
        $request->validate(['token' => 'required|string']);

        $payload = GuardianLinkToken::verify($request->input('token'));
        if (! $payload) {
            return $this->error('Invalid or expired link. Request a new verification email from the link-account page.', 400);
        }

        $guardian = Guardian::find($payload['guardian_id']);
        if (! $guardian || $guardian->user_id !== null) {
            return $this->error('This link has already been used or is no longer valid.', 400);
        }

        $user = $request->user();
        $userEmail = $user->getNotificationEmail();
        if (empty($userEmail) || strcasecmp($userEmail, $payload['email']) !== 0) {
            return $this->error('You must be logged in with the same email that received the verification link.', 403);
        }

        $guardian->update(['user_id' => $user->id]);
        app(GuardianService::class)->assignParentRoleIfMissing($user->id, $guardian->institution_id);

        return $this->success(
            ['guardian_id' => $guardian->id, 'name' => $guardian->name],
            'Account linked successfully. You now have parent access and can view your linked students.'
        );
    }

    /**
     * Set the active student for parent context (session). Subsequent portal APIs will use this student.
     * Security: Only allowed when the user is linked as guardian for that student (guardian.user_id set after email verification). No switch without verified link.
     */
    public function setActiveStudent(Request $request): JsonResponse
    {
        $request->validate(['user_id' => 'required|integer|exists:users,id']);

        $userId = (int) $request->user_id;
        if (! EffectiveStudentContext::setActiveStudentId($userId, $request->user())) {
            return $this->error('You are not linked as guardian for this student. Link your account via the verification email first.', 403);
        }

        return $this->success(
            ['active_student_id' => $userId],
            'Active student updated. Portal will show this student\'s data.'
        );
    }

    /**
     * Clear the active student (switch back to self or leave parent context).
     */
    public function clearActiveStudent(Request $request): JsonResponse
    {
        EffectiveStudentContext::clearActiveStudent();
        return $this->success(null, 'Active student cleared.');
    }

    /**
     * List all users with the same email as the current user (for Switch modal). Each has is_linked (can switch to them).
     */
    public function sameEmailAccounts(Request $request): JsonResponse
    {
        $user = $request->user();
        if (empty($user->email)) {
            return $this->success(['accounts' => []], 'Same-email accounts.');
        }

        $accounts = User::query()
            ->where('email', $user->email)
            ->get(['id', 'name', 'email', 'avatar_url'])
            ->map(fn (User $u) => [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'avatar_url' => $u->avatar_url,
                'is_linked' => (int) $u->id !== (int) $user->id && EffectiveStudentContext::isGuardianOf((int) $user->id, (int) $u->id),
            ])
            ->values()
            ->all();

        return $this->success(['accounts' => $accounts], 'Same-email accounts.');
    }

    /**
     * Get current guardian record(s) and active student for the authenticated user.
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();
        $guardians = $user->guardianRecords()->get(['id', 'name', 'email', 'mobile', 'institution_id']);
        $activeId = EffectiveStudentContext::getEffectiveStudentId($user);
        $isParentContext = $activeId !== (int) $user->id;

        return $this->success([
            'guardians' => $guardians,
            'active_student_id' => $isParentContext ? $activeId : null,
            'is_guardian' => $guardians->isNotEmpty(),
        ], 'Guardian profile.');
    }

}
