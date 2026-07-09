<?php

namespace App\Traits;

use App\Models\Institution;
use App\Models\Organization;
use App\Support\InstitutionContext;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

/**
 * Provides request-cached context helpers for the authenticated user.
 *
 * Centralises institution/organization/role resolution so every consumer
 * (AuthShareController, HandleInertiaRequests, API controllers, etc.)
 * goes through the same path instead of duplicating queries.
 *
 *   $user->activeInstitutionId()   → int|null
 *   $user->activeInstitution()     → Institution|null
 *   $user->activeOrganization()    → Organization|null
 *   $user->resolveRolesWithContext() → Collection
 *   $user->activeRoles()           → Collection (scoped to institution)
 *   $user->activeRoleKey()         → string|null
 *   $user->toSafeArray()           → array (safe-to-share fields)
 */
trait ResolvesUserContext
{
    /* ── Safe-to-Share Fields ─────────────────────────────────────────── */

    /**
     * Fields exposed to the browser via Inertia / API.
     * Everything else (password, tokens, OTP, timestamps…) stays server-side.
     */
    private const SAFE_USER_FIELDS = [
        'id',
        'name',
        'email',
        'avatar_url',
        'email_verified_at',
    ];

    /* ── Request-Scoped Cache ─────────────────────────────────────────── */

    protected ?int $resolvedInstitutionId = null;
    protected ?Institution $resolvedInstitution = null;
    protected ?Organization $resolvedOrganization = null;
    protected bool $contextResolved = false;

    /* ── Public API ───────────────────────────────────────────────────── */

    /**
     * Active institution ID (session → default → config → onboarded fallback).
     * Cached per request on the model instance.
     */
    public function activeInstitutionId(?Request $request = null): ?int
    {
        if (!$this->contextResolved) {
            $this->resolveContext($request);
        }

        return $this->resolvedInstitutionId;
    }

    /**
     * Active Institution model (cached).
     */
    public function activeInstitution(): ?Institution
    {
        if (!$this->contextResolved) {
            $this->resolveContext();
        }

        return $this->resolvedInstitution;
    }

    /**
     * Active Organization model via Institution → organization FK (cached).
     */
    public function activeOrganization(): ?Organization
    {
        if (!$this->contextResolved) {
            $this->resolveContext();
        }

        return $this->resolvedOrganization;
    }

    /**
     * All roles with their institution_id mapped for sharing.
     */
    public function resolveRolesWithContext(): Collection
    {
        return $this->roles()
            ->withoutGlobalScope('institution_scope')
            ->get()
            ->map(fn($role) => [
                'key' => $role->key,
                'name' => $role->name,
                'institution_id' => $role->pivot->institution_id,
            ]);
    }

    /**
     * Roles filtered to the active institution (institution-scoped + global).
     */
    public function activeRoles(?int $institutionId = null): Collection
    {
        $instId = $institutionId ?? $this->activeInstitutionId();
        $allRoles = $this->resolveRolesWithContext();

        if (!$instId) {
            return $allRoles;
        }

        return $allRoles->filter(fn($r) =>
            $r['institution_id'] === null || (int) $r['institution_id'] === $instId
        );
    }

    /**
     * Primary active role key (first match in active context).
     */
    public function activeRoleKey(?int $institutionId = null): ?string
    {
        return $this->activeRoles($institutionId)->first()['key'] ?? null;
    }

    /**
     * Safe-to-share user fields for Inertia / API payloads.
     */
    public function toSafeArray(): array
    {
        return $this->only(self::SAFE_USER_FIELDS);
    }

    /* ── Internal ─────────────────────────────────────────────────────── */

    /**
     * Resolve institution → organization chain once, cache everything.
     */
    protected function resolveContext(?Request $request = null): void
    {
        $this->contextResolved = true;

        // 1. Resolve institution ID
        $this->resolvedInstitutionId = InstitutionContext::getActiveInstitutionId($this)
            ?? ($request?->session()?->get('onboarded_institution_id'));

        if (!$this->resolvedInstitutionId) {
            return;
        }

        // 2. Load institution with its organization
        $this->resolvedInstitution = Institution::withoutGlobalScopes()
            ->with('organization')
            ->find($this->resolvedInstitutionId);

        // 3. Extract organization
        if ($this->resolvedInstitution?->organization_id) {
            $this->resolvedOrganization = $this->resolvedInstitution->organization;
        }
    }

    /**
     * Reset the cached context (e.g. after institution switch).
     */
    public function resetContext(): static
    {
        $this->resolvedInstitutionId = null;
        $this->resolvedInstitution = null;
        $this->resolvedOrganization = null;
        $this->contextResolved = false;

        return $this;
    }
}
