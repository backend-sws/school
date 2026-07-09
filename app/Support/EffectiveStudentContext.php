<?php

namespace App\Support;

use App\Models\User;
use Illuminate\Support\Facades\Session;

/**
 * Resolves the "effective" student user ID for the current request.
 * When a parent has selected a linked student, that student's ID is used; otherwise the authenticated user's ID.
 *
 * Security: Switch is only allowed for verified-linked students. "Linked" means guardian.user_id is set
 * (done only after the user completes email verification in GuardianController::verifyLinkAccount).
 * We never allow switch based on same email alone; isGuardianOf() checks guardian_students + guardian.user_id.
 */
class EffectiveStudentContext
{
    public const SESSION_KEY = 'active_guardian_student_id';

    public static function getEffectiveStudentId(?User $user = null): ?int
    {
        $user = $user ?? auth()->user();
        if (! $user) {
            return null;
        }
        $activeId = Session::get(self::SESSION_KEY);
        if ($activeId !== null && $activeId !== '') {
            $activeId = (int) $activeId;
            if (self::isGuardianOf($user->id, $activeId)) {
                return $activeId;
            }
            Session::forget(self::SESSION_KEY);
        }
        // Guardian with no selection: default to first linked student so the dashboard always shows a student context.
        if (self::isGuardianUser($user)) {
            $first = self::getFirstLinkedStudentId($user->id);
            if ($first !== null) {
                return $first;
            }
        }
        return (int) $user->id;
    }

    /** First linked student user id for this guardian (who has a student_profile), or null if none. */
    public static function getFirstLinkedStudentId(int $guardianUserId): ?int
    {
        $guardianUser = User::find($guardianUserId);
        if (! $guardianUser) {
            return null;
        }
        $students = $guardianUser->guardianRecords()
            ->with(['students' => fn ($q) => $q->whereHas('studentProfile')])
            ->get()
            ->flatMap(fn ($g) => $g->students)
            ->filter(fn ($u) => (int) $u->id !== $guardianUserId);
        $first = $students->first();
        return $first ? (int) $first->id : null;
    }

    /** Return the effective student User model (for parent context or self). */
    public static function getEffectiveUser(?User $user = null): ?User
    {
        $id = self::getEffectiveStudentId($user);
        return $id ? User::find($id) : null;
    }

    /** Whether the given user (parent) is guardian of the given student user. Only true when guardian record has user_id set (i.e. link was verified via email). */
    public static function isGuardianOf(int $guardianUserId, int $studentUserId): bool
    {
        $guardianUser = User::find($guardianUserId);
        return $guardianUser && $guardianUser->guardianRecords()
            ->whereHas('students', fn ($q) => $q->where('users.id', $studentUserId))
            ->exists();
    }

    public static function setActiveStudentId(int $studentUserId, ?User $user = null): bool
    {
        $user = $user ?? auth()->user();
        if (! $user || ! self::isGuardianOf($user->id, $studentUserId)) {
            return false;
        }
        Session::put(self::SESSION_KEY, $studentUserId);
        return true;
    }

    public static function clearActiveStudent(): void
    {
        Session::forget(self::SESSION_KEY);
    }

    public static function isGuardianUser(?User $user = null): bool
    {
        $user = $user ?? auth()->user();
        if (! $user) {
            return false;
        }
        return $user->guardianRecords()->exists();
    }
}
