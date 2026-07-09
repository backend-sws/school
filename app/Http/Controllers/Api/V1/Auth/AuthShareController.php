<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Models\User;
use App\Support\EffectiveStudentContext;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/**
 * Builds the auth payload shared to the frontend via Inertia.
 *
 * Uses a polymorphic strategy-map (SHARE_SECTIONS) so new data
 * sections can be added without modifying existing code.
 */
class AuthShareController
{
    /* ── Strategy Map ─────────────────────────────────────────────────── */

    /**
     * Ordered list of section builders. Each entry corresponds to a
     * build{Section}() method. Add a new section by adding an entry
     * here and implementing the corresponding method.
     */
    private const SHARE_SECTIONS = [
        'core',       // user, role, roles, permissions
        'context',    // current_institution_id, current_organization_id/name
        'portal',     // portal_config, vapid_public_key
        'effective',  // effective_user (parent → student switching)
        'multiUser',  // has_multiple_users_same_email
    ];

    /**
     * Payload returned when no user is authenticated.
     */
    private const GUEST_PAYLOAD = [
        'user' => null,
        'role' => null,
        'roles' => [],
        'permissions' => [],
        'current_institution_id' => null,
        'current_organization_id' => null,
        'current_organization_name' => null,
        'portal_config' => [
            'portal_menu_permission' => 'portal',
            'parent_dashboard_permission' => 'view_my_students',
        ],
        'vapid_public_key' => null,
    ];

    /* ── Public API ───────────────────────────────────────────────────── */

    /**
     * Return the authenticated user's safe-to-share data, or null.
     * Re-usable in middleware, controllers, API responses, etc.
     */
    public static function getUser(): ?array
    {
        $user = Auth::user();

        return $user?->toSafeArray();
    }

    /**
     * Return full auth payload for Inertia sharing.
     * Iterates SHARE_SECTIONS and merges each builder's output.
     */
    public static function getAuth(?Request $request = null): array
    {
        $user = $request ? $request->user() : Auth::user();

        if (!$user) {
            return self::GUEST_PAYLOAD;
        }

        // Prime context resolution with the request (for session access)
        $user->activeInstitutionId($request);

        $payload = [];
        foreach (self::SHARE_SECTIONS as $section) {
            $method = 'build' . ucfirst($section);
            $payload = array_merge($payload, self::$method($user, $request));
        }

        return $payload;
    }

    /* ── Section Builders ─────────────────────────────────────────────── */

    /**
     * Core identity: user info, active role, all roles, resolved permissions.
     */
    private static function buildCore(User $user, ?Request $request): array
    {
        $institutionId = $user->activeInstitutionId();

        return [
            'user' => $user->toSafeArray(),
            'role' => $user->activeRoleKey($institutionId),
            'roles' => $user->resolveRolesWithContext()->toArray(),
            'permissions' => $user->resolveEffectivePermissionKeys($institutionId),
        ];
    }

    /**
     * Institutional context: active institution and organization IDs/name.
     */
    private static function buildContext(User $user, ?Request $request): array
    {
        $org = $user->activeOrganization();

        return [
            'current_institution_id' => $user->activeInstitutionId(),
            'current_organization_id' => $org?->id,
            'current_organization_name' => $org?->name,
        ];
    }

    /**
     * Portal configuration and push notification keys.
     */
    private static function buildPortal(User $user, ?Request $request): array
    {
        return [
            'portal_config' => [
                'portal_menu_permission' => 'portal',
                'parent_dashboard_permission' => 'view_my_students',
            ],
            'vapid_public_key' => config('webpush.vapid.public_key'),
        ];
    }

    /**
     * Effective user for parent → student viewing context.
     */
    private static function buildEffective(User $user, ?Request $request): array
    {
        $effectiveId = EffectiveStudentContext::getEffectiveStudentId($user);

        if ($effectiveId === null || (int) $effectiveId === (int) $user->id) {
            return [];
        }

        $effectiveUser = User::find($effectiveId);

        return $effectiveUser
            ? ['effective_user' => $effectiveUser->toSafeArray()]
            : [];
    }

    /**
     * Whether the user's email is shared with multiple user accounts (switch hint).
     */
    private static function buildMultiUser(User $user, ?Request $request): array
    {
        return [
            'has_multiple_users_same_email' => $user->email
                && User::where('email', $user->email)->count() > 1,
        ];
    }
}
