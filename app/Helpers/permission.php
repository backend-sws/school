<?php

use App\Models\User;
use App\Services\PermissionResolverService;

if (! function_exists('permission_resolver')) {
    /**
     * Get the permission resolver service (role and permission verification).
     * Use for resolving effective keys or checking abilities outside the User model.
     *
     * @return PermissionResolverService
     */
    function permission_resolver(): PermissionResolverService
    {
        return app(PermissionResolverService::class);
    }
}

if (! function_exists('user_ability')) {
    /**
     * Check if a user has an ability in the given institution context.
     * When $institutionId is null, uses the active institution from InstitutionContext.
     *
     * @param  User  $user
     * @param  string  $permissionKey
     * @param  int|null  $institutionId
     */
    function user_ability(User $user, string $permissionKey, ?int $institutionId = null): bool
    {
        return permission_resolver()->hasAbility($user, $permissionKey, $institutionId);
    }
}

if (! function_exists('effective_permission_keys')) {
    /**
     * Resolve effective permission keys for a user in an institution context.
     * When $institutionId is null, uses the active institution from InstitutionContext.
     *
     * @param  User  $user
     * @param  int|null  $institutionId
     * @return array<string>
     */
    function effective_permission_keys(User $user, ?int $institutionId = null): array
    {
        return permission_resolver()->resolveEffectivePermissionKeys($user, $institutionId);
    }
}
