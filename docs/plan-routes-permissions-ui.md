# Plan: Routes, permissions, and UI alignment

## Goal

- One source of truth for which permission(s) guard each route.
- Web and API routes use the same permission groups from `config/route_permissions.php`.
- UI (sidebar/settings nav) uses the **exact same permission keys** so links are shown only when the user can access the route.
- No duplicate unguarded route blocks; fix missing config keys and broken hrefs.

---

## 1. Config fixes (route_permissions.php)

| Issue | Fix |
|-------|-----|
| **middleware.fees** is used in [routes/web.php](routes/web.php) (line 164) but does not exist in config | Add `'fees' => ['ensure-permission-group:accounts_room']` (fees routes are accounts-room; reuse same group). |
| **middleware.organization** is used in [routes/settings.php](routes/settings.php) (line 39) but does not exist | Add `'organization' => ['ensure-permission-group:system_console']` (or a dedicated group). Settings pages (college, SEO, staff-directory, etc.) are currently gated by admin + organization; system_console includes view_settings, update_settings which fit institutional settings. |
| **system_console** group does not include **view_workflows** | Add `'view_workflows'` to the `system_console` array in config so workflow routes and UI stay consistent. |

---

## 2. Web routes: remove duplicates and keep single permission mapping

**Current problem:** In [routes/web.php](routes/web.php), after the permission-guarded blocks (academic_setup, office_registry, system_console, etc.) there are **duplicate** blocks (lines ~232–337) for:

- certificates
- website
- grievances
- admin (users, roles, workflows, audit-logs)

Those duplicates are only under `admin` (role check) and have **no** `ensure-permission-group`. So any college_admin/principal/staff can open those URLs without having the right permission.

**Change:**

- **Remove** the duplicate blocks (the second occurrence of certificates, website, grievances, admin).
- Keep **only** the first set of routes, each wrapped in its correct middleware (academic_setup, accounts_room, office_registry, admission_cell, fees, service_branch, info_pr_hub, redressal_cell, system_console).
- Ensure every protected web route lives in exactly one such group so route → permission group is 1:1.

**Resulting web route → permission group map:**

| Route prefix / area | Middleware (config key) | Permission group (at least one of) |
|--------------------|-------------------------|--------------------------------------|
| /dashboard | dashboard-redirect | (landing by permission) |
| /organization/* | academic_setup | academic_setup |
| /fee-payment/*, /fees/* (first block) | accounts_room | accounts_room |
| /students/*, /admin/users (first block) | office_registry | office_registry |
| /admission/* | admission_cell | admission_cell |
| /fees/* (second block – fee heads/payments) | fees → accounts_room | accounts_room |
| /certificates/* | service_branch | service_branch |
| /website/*, /notice-management | info_pr_hub | info_pr_hub |
| /grievances/* | redressal_cell | redressal_cell |
| /admin/roles, /admin/workflows, /admin/audit-logs | system_console | system_console |
| /settings/* (institutional) | admin + organization | system_console (after adding organization) |
| /settings/profile, password, etc. | personal_settings | (role only) |

---

## 3. API routes

- Already grouped by the same config keys (office_registry, admission_cell, accounts_room, service_branch, info_pr_hub, redressal_cell, system_console, admin_desk, academic_setup).
- No structural change needed once config has `fees` and `organization` and system_console includes `view_workflows`.
- Optional: add a short comment above each API group stating the config key and group name so route → permission stays obvious.

---

## 4. UI: navigation → route → permission

**Rule:** For every sidebar/settings link, the `permission` on the item must be a key that is **included in the permission group** that guards the route for that href. Then `auth.permissions` (effective keys for current college) will hide the link when the user cannot access the route.

**Fixes in [resources/js/constants/navigation.ts](resources/js/constants/navigation.ts):**

| Item | Current href | Correct href | Permission (must be in route group) |
|------|--------------|--------------|------------------------------------|
| Security Workflows (SETTINGS_NAVIGATION) | `/workflows` | `/admin/workflows` | `view_workflows` (add to system_console in config) |

**Consistency checks:**

- Main sidebar: each item’s `permission` should match the “minimum” permission for that page (e.g. view_users for Staff Directory). These already align with office_registry, accounts_room, etc.
- Settings nav: “Security Roles” → `/admin/roles` (correct), “Security Workflows” → must be `/admin/workflows` with permission `view_workflows`.
- Footer “Settings” → `/settings` (redirects to profile); permission `view_settings` is correct for settings area; ensure `view_settings` is in the group used for institutional settings if you gate by permission.

**Optional (recommended):** Add a single constant or small map in the frontend that lists **route path → required permission key** for the main guarded routes, and use it for (a) sidebar href + permission, and (b) any client-side redirect or “access denied” logic. That keeps UI and backend in sync.

---

## 5. RedirectDashboard and landing_pages

- [config/route_permissions.php](config/route_permissions.php) `landing_pages` maps permission → route name.
- [RedirectDashboard](app/Http/Middleware/RedirectDashboard.php) uses `hasAbility($permission)` and redirects to the first matching route.
- Ensure each key in `landing_pages` exists in the permissions list and that the route name exists in web.php (e.g. `student.student-dashboard` for portal). No change needed if already correct.

---

## 6. Implementation order

1. **Config**  
   - Add `fees` and `organization` to `route_permissions.middleware`.  
   - Add `view_workflows` to `route_permissions.system_console`.

2. **Web routes**  
   - Remove duplicate blocks (certificates, website, grievances, admin) so each path is under exactly one permission group.

3. **Settings routes**  
   - Keep using `middleware.admin` + `middleware.organization`; after adding `organization`, institutional settings stay gated.

4. **UI**  
   - Fix “Security Workflows” href from `/workflows` to `/admin/workflows`.  
   - Optionally add a small route–permission map (e.g. in constants) and use it for sidebar and any permission-based redirects.

5. **Docs / regression**  
   - After changes, run a quick smoke test: log in as a user with only one group (e.g. office_registry); confirm sidebar and settings show only allowed items and that duplicate routes return 403 or redirect as expected.

---

## 7. Route–permission reference (summary)

| Permission group (config key) | Typical permissions (subset) | Web route prefix | Nav section |
|------------------------------|------------------------------|------------------|-------------|
| admin | (role: college_admin, principal, staff, super_admin) | Wraps all admin UI | — |
| admin_desk | view_dashboard, view_all_reports, view_audit | (API only for now) | Analytics |
| admission_cell | view_applications, view_admission_heads, apply_admission | /admission/* | Admission Cell |
| office_registry | view_users, view_students, view_candidates | /admin/users, /students/* | Office Registry |
| accounts_room / fees | view_fee_heads, view_fee_particulars, view_fee_payments | /fees/*, /fee-payment/* | Accounts Room |
| academic_setup | view_departments, view_sessions, view_streams, view_subjects | /organization/* | Academic Setup |
| service_branch | view_certificates, issue_certificates | /certificates/* | Service Branch |
| info_pr_hub | view_notices, update_website, update_gallery, update_news | /website/*, /notice-management | Information & PR Hub |
| redressal_cell | view_grievances, view_all_support_tickets, view_contacts | /grievances/* | Redressal Cell |
| system_console | view_roles, view_workflows, view_settings, update_settings | /admin/roles, /admin/workflows, /admin/audit-logs; settings (institutional) | System Console |

This plan gives you a single mapping from route → permission group → exact permissions, and aligns the UI with that mapping so routes are properly gated and nav items match backend rules.
