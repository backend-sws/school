# Auth and RBAC overview

## Two layers: UI vs data

- **Layer 1 — UI (what the user can see and open)**  
  Decided by **roles and permission set** only. The frontend receives `auth.permissions` (effective permission keys for the active college). Sidebar, settings nav, and route middleware use these keys (and role checks) to show/hide menus and allow or deny route access. No scope columns are used in UI logic; the active college is already used when resolving permissions.

- **Layer 2 — Data (what the user can read or change)**  
  Always scoped by **scope_type and scope_id** (in practice, college). Every query or mutation that touches business data must respect scope:
  - **Models** with `college_id` use the `BelongsToDefaultCollege` global scope (and active college from `CollegeContext::getActiveCollegeId()`), so reads/writes are limited to that college.
  - **Assignments** (user_roles, user_workflows, user_permissions) store `scope_type` and `scope_id` so “who has what” is per college; resolution uses these when computing effective permissions for a given college.

So: **UI = roles + permissions** (same permission keys everywhere). **Data = always scope_type / scope_id** (college-scoped models and assignments). A user may have “view students” in two colleges but each request sees data only for the active college.

### Do we follow this?

**Yes, for the most part.**

- **UI:** All web/API/settings routes use `config('route_permissions.middleware.*')` (roles + permission groups). Frontend receives `auth.permissions` (effective keys for active college) and filters sidebar/nav by them.
- **Data – models:** Business-data models (Session, Department, StudentProfile, FeeHead, Notice, Grievance, etc.) use `BelongsToDefaultCollege` with `college_id` and a global scope so queries/mutations are limited to the active college (or config default in single-college mode).
- **Data – assignments:** `user_roles`, `user_workflows`, and `user_permissions` have `scope_type` and `scope_id`; permission resolution uses them so "who has what" is per college. StaffPermissionController and UserController set scope when assigning.

**Gaps / things to watch:** (1) Some controllers (e.g. SessionController::store, ContactController::store) accept `college_id` in the request and pass it to `create()` — for strict data-scope, prefer `CollegeContext::getActiveCollegeId()` on authenticated routes. (2) CollegeProfileController uses `config('ems.default_institution_id')`; in multi-college mode consider `CollegeContext::getActiveCollegeId()` so profile matches session college.

---

## Reusable logic: PermissionResolverService and helpers

Role and permission resolution lives in **App\Services\PermissionResolverService** so it can be used anywhere (controllers, jobs, commands). The User model delegates to it and caches the result per request.

**Inject the service (Laravel approach):**

```php
use App\Services\PermissionResolverService;

public function __construct(
    protected PermissionResolverService $permissionResolver
) {}

// Resolve effective keys for a user in a college context
$keys = $this->permissionResolver->resolveEffectivePermissionKeys($user, $collegeId);

// Check ability
if ($this->permissionResolver->hasAbility($user, 'manage_users', $collegeId)) { ... }

// Scope a relation for use in queries (e.g. staff permissions UI)
$workflowsQuery = $this->permissionResolver->scopeWorkflowsForCollege($user->workflows(), $collegeId);
$overridesQuery = $this->permissionResolver->scopePermissionOverridesForCollege($user->permissionOverrides(), $collegeId);
```

**Global helpers** (optional; require `composer dump-autoload` after adding):

- `permission_resolver()` — returns the service.
- `user_ability($user, $permissionKey, $collegeId = null)` — whether the user has the ability.
- `effective_permission_keys($user, $collegeId = null)` — array of effective permission keys.

**Service methods:**

- `resolveEffectivePermissionKeys(User $user, ?int $collegeId): array`
- `hasAbility(User $user, string $permissionKey, ?int $collegeId): bool`
- `userHasSuperAdmin(User $user): bool`
- `scopeRolesForCollege(BelongsToMany $rolesRelation, ?int $collegeId): BelongsToMany`
- `scopeWorkflowsForCollege(BelongsToMany $workflowsRelation, ?int $collegeId): BelongsToMany`
- `scopePermissionOverridesForCollege(BelongsToMany $relation, ?int $collegeId): BelongsToMany`

---

## Single rule

**Effective permissions for college X** = super_admin → all permissions; else merge:

- From **roles**: user has the role (user_roles) in scope "global" or "college X", and the role applies to X (role.college_id is null or = X).
- From **user_workflows**: assigned workflows in scope global or college X (user_workflows.scope_type / scope_id).
- From **user_permissions**: grant/revoke overrides in scope global or college X (user_permissions.scope_type / scope_id).

Core (permissions and workflows tables) is untouched. "Where" lives in assignments: user_roles, user_workflows, user_permissions each have scope; role definition has roles.college_id.

## One code path

- When callers pass `null`, resolve using **active college** from CollegeContext (session-locked). So `resolveEffectivePermissionKeys(null)` and middleware use the active college.
- Single resolution point: `User::resolveEffectivePermissionKeys($collegeId)`.

## Independent vs grouped

- **Independent (no college_id)**: User (identity only); Permission and Workflow (global/core).
- **College-scoped or scoped assignment**: Role (roles.college_id); user_roles, user_workflows, user_permissions (scope_type / scope_id so College A's assignments apply only when resolving for College A).

## College-scoped user assignments (without touching core)

- **user_workflows** and **user_permissions** have `scope_type` (e.g. 'global', 'college') and `scope_id` (college id when scope is college).
- When College A assigns a workflow or override via the UI/API, the backend sets scope from CollegeContext (scope_type = 'college', scope_id = A). Those assignments only apply when resolving for College A.
- Permissions and workflows tables remain global; no college_id on core definitions.
