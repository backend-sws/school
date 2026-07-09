<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Database\Eloquent\Builder;

/**
 * Polymorphic service for querying users by role.
 *
 * Centralizes the "who has role X?" query so every consumer
 * (enrollment, analytics, attendance, etc.) uses the same
 * definition instead of duplicating whereHas/role checks.
 *
 * Each role key maps to a set of strategies that define how
 * to identify users of that type. New roles or identification
 * methods can be added to the STRATEGY_MAP without touching
 * any consuming code.
 *
 * Usage:
 *   UserQueryService::byRole('student')                           → base Builder
 *   UserQueryService::byRole('teacher', institutionId: 1)         → scoped
 *   UserQueryService::search('student', 'John', institutionId: 1) → search
 *   UserQueryService::availableForClass('student', $classId)      → not enrolled
 */
class UserQueryService
{
    /* ── Strategy Map ────────────────────────────────────────────────── */

    /**
     * Polymorphic strategy map: role key → array of closures.
     * Each closure adds an "orWhere" branch to widen the match.
     * To add a new role or identification method, just add an entry.
     *
     * @return array<string, array<\Closure(Builder): void>>
     */
    protected static function strategyMap(): array
    {
        return [
            'student' => [
                fn(Builder $q) => $q->whereHas('roles', fn($r) => $r->where('key', 'student')),
                fn(Builder $q) => $q->whereHas('studentProfile'),
            ],
            'teacher' => [
                fn(Builder $q) => $q->whereHas('roles', fn($r) => $r->where('key', 'teacher')),
            ],
            'parent' => [
                fn(Builder $q) => $q->whereHas('roles', fn($r) => $r->where('key', 'parent')),
                fn(Builder $q) => $q->whereHas('guardianProfile'),
            ],
            'staff' => [
                fn(Builder $q) => $q->whereHas('roles', fn($r) => $r->whereIn('key', ['admin', 'staff', 'teacher'])),
            ],
        ];
    }

    /* ── Public API ──────────────────────────────────────────────────── */

    /**
     * Base query for a given role key — matches users via any registered strategy.
     */
    public static function byRole(string $roleKey, ?int $institutionId = null): Builder
    {
        $strategies = static::strategyMap()[$roleKey] ?? [
            // Fallback: simple role‑key lookup
            fn(Builder $q) => $q->whereHas('roles', fn($r) => $r->where('key', $roleKey)),
        ];

        return User::where(function (Builder $q) use ($strategies) {
            $first = true;
            foreach ($strategies as $apply) {
                $first ? $apply($q) : $q->orWhere(fn($sq) => $apply($sq));
                $first = false;
            }
        })->when($institutionId, fn(Builder $q) => $q->whereHas(
            'roles',
            fn($r) => $r->where('user_roles.institution_id', $institutionId)
        ));
    }

    /**
     * Search users of a given role by name or email.
     */
    public static function search(string $roleKey, ?string $term, ?int $institutionId = null): Builder
    {
        return static::byRole($roleKey, $institutionId)
            ->when($term, function (Builder $q, string $search) {
                $q->where(fn($sq) => $sq
                    ->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%"));
            });
    }

    /**
     * Users of a given role NOT yet enrolled in a given LMS class.
     * Eager‑loads studentProfile so the consumer can backfill names.
     */
    public static function availableForClass(
        string $roleKey,
        int $classId,
        ?string $search = null,
        ?int $institutionId = null,
        int $limit = 100
    ) {
        $enrolledIds = \App\Models\LmsClassEnrollment::where('lms_class_id', $classId)
            ->pluck('user_id');

        $users = static::search($roleKey, $search, $institutionId)
            ->whereNotIn('id', $enrolledIds)
            ->with('studentProfile:id,user_id,first_name,last_name')
            ->limit($limit)
            ->get(['id', 'name', 'email']);

        // Backfill name from student profile when User.name is empty
        $users->transform(function (User $user) {
            if (empty($user->name) && $user->studentProfile) {
                $user->name = trim(
                    ($user->studentProfile->first_name ?? '') . ' ' .
                    ($user->studentProfile->last_name ?? '')
                );
            }
            return $user;
        });

        return $users;
    }
}
