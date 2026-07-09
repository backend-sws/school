<?php

namespace App\Services;

use App\Models\Guardian;
use App\Models\Institution;
use App\Models\Role;
use App\Models\User;
use Illuminate\Support\Facades\DB;

/**
 * Resolves or creates guardians and links them to students (one parent → many students).
 * Linking (guardian.user_id) is only set after email verification; switch is allowed only when linked.
 */
class GuardianService
{
    /**
     * Find or create a guardian by contact (email/mobile) and link to the given student user.
     * Same email or same phone => reuse existing guardian (one parent, multiple students).
     *
     * @return array{guardian: \App\Models\Guardian|null, was_existing: bool} was_existing true when contact already had a guardian (parent adding another child)
     */
    public function resolveOrCreateAndLinkToStudent(
        ?int $institutionId,
        ?string $email,
        ?string $mobile,
        ?string $guardianName,
        int $studentUserId,
        string $relation = 'guardian'
    ): array {
        if (empty($email) && empty($mobile)) {
            return ['guardian' => null, 'was_existing' => false];
        }

        // Same email or same phone => same parent: find existing guardian within the SAME institution
        $guardian = Guardian::query()
            ->where('institution_id', $institutionId)
            ->where(function ($q) use ($email, $mobile) {
                if (! empty($email) && ! empty($mobile)) {
                    $q->where('email', $email)->orWhere('mobile', $mobile);
                } elseif (! empty($email)) {
                    $q->where('email', $email);
                } else {
                    $q->where('mobile', $mobile);
                }
            })
            ->first();

        $wasExisting = (bool) $guardian;

        if (! $guardian) {
            $guardian = Guardian::create([
                'institution_id' => $institutionId,
                'name' => $guardianName ?? 'Guardian',
                'email' => $email,
                'mobile' => $mobile,
            ]);
        } else {
            // Update contact if we have new info
            $updates = [];
            if (! empty($email) && empty($guardian->email)) {
                $updates['email'] = $email;
            }
            if (! empty($mobile) && empty($guardian->mobile)) {
                $updates['mobile'] = $mobile;
            }
            if (! empty($updates)) {
                $guardian->update($updates);
            }
        }

        $user = User::find($studentUserId);
        if (! $user) {
            return ['guardian' => $guardian, 'was_existing' => $wasExisting];
        }

        if (! $user->guardians()->where('guardians.id', $guardian->id)->exists()) {
            $user->guardians()->attach($guardian->id, [
                'relation' => $this->normalizeRelation($relation),
                'is_primary' => true,
            ]);
        }

        // Security: do NOT auto-link guardian to user by email. Linking (guardian.user_id) is only set
        // after the user completes email verification (GuardianController::verifyLinkAccount). Switch is allowed only when linked.

        return ['guardian' => $guardian, 'was_existing' => $wasExisting];
    }

    /** Assign parent role to the user for the given institution (idempotent). Used only after email-verified link (GuardianController::verifyLinkAccount). */
    public function assignParentRoleIfMissing(int $userId, ?int $institutionId): void
    {
        if (! $institutionId) {
            return;
        }
        $role = Role::forInstitution($institutionId)->where('key', 'parent')->first()
            ?? Role::withoutGlobalScope('institution_scope')->where('key', 'parent')->first();
        if (! $role) {
            return;
        }
        $exists = DB::table('user_roles')
            ->where('user_id', $userId)
            ->where('role_id', $role->id)
            ->where('institution_id', $institutionId)
            ->exists();
        if (! $exists) {
            DB::table('user_roles')->insert([
                'user_id' => $userId,
                'role_id' => $role->id,
                'institution_id' => $institutionId,
                'assigned_at' => now(),
            ]);
        }
    }

    protected function normalizeRelation(string $relation): string
    {
        $allowed = ['father', 'mother', 'guardian', 'other'];
        $lower = strtolower(trim($relation));

        return in_array($lower, $allowed, true) ? $lower : 'guardian';
    }
}
