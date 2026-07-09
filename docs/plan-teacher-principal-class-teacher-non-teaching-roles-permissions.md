# Teacher, Principal, Class Teacher, Non-Teaching Staff – Roles, Permissions, and Role Mapping

## Goal

Define a clear RBAC model for **Principal**, **Teacher** (teaching staff), **Class Teacher**, and **Non-Teaching Staff**: role keys, permission keys, workflows, and role_mapping so each persona has an appropriate default menu and API access. The plan stays consistent with the existing system (PermissionResolverService, workflow-based permissions, sidebar filtered by permissions).

---

## Current State

- **Roles** ([database/seeders/data/roles.php](database/seeders/data/roles.php)): `super_admin`, `institution_admin`, `principal`, `staff`, `student`, `candidate`. No dedicated `teacher`, `class_teacher`, or `non_teaching_staff`.
- **Principal** and **staff** only: Principal gets the same workflows as institution_admin (broad). Staff gets: admin_desk, admission_cell, accounts_room, info_pr_hub, redressal_cell, inventory, transport, lms (no office_registry, no system_console, no academic_setup).
- **Staff** is described as "Teachers, fee collectors, clerks; permission set per user" – one catch-all role with per-user workflows/overrides. Staff directory seed data uses `role` = `staff` or `principal` and `category` = 232 (teaching) or 233 (non_teaching); category is stored in StaffProfile but **not** used for permission resolution.
- **Custom roles** (e.g. [database/seeders/data/inst/tiny-tots/custom_roles.php](database/seeders/data/inst/tiny-tots/custom_roles.php)): `class_teacher`, `sports_teacher`, `lab_incharge`, etc. exist in institution-specific data but are **not** seeded by the main RoleSeeder (which only reads roles.php). StaffDirectorySeeder only allows `staff` and `principal` in STAFF_ROLE_KEYS.
- **LMS**: Permissions include `view_my_lms_classes`, `view_lms_classes`, `manage_lms_enrollments`, `manage_lms_allocations`. Class teacher is represented in the UI as `class_teacher_id` on a class (LmsClass), not as a separate role in auth.
- **Frontend** ([resources/js/hooks/use-navigation.ts](resources/js/hooks/use-navigation.ts)): Injects "My Department" for role `hod` (scope_type department) and "My Teaching Plan" for role `teaching_staff` (scope_type subject). So the app already anticipates a `teaching_staff` (or similar) role with scope for dynamic menu items.

---

## Proposed Role Keys

| Role key               | Name                 | Level | Description |
|------------------------|----------------------|-------|-------------|
| `principal`            | Principal / HOD      | 75    | Already exists. Head of institution; retains current broad workflows. |
| `teacher`              | Teacher              | 35    | Teaching staff: LMS (my classes, allocations for assigned subjects), view students, notices, redressal; no system_console, no full office_registry. |
| `class_teacher`        | Class Teacher        | 32    | Teacher with responsibility for one class section: teacher permissions plus manage enrollments/attendance for that class (scope: lms_class). Can be implemented as teacher + scope or as separate role. |
| `non_teaching_staff`   | Non-Teaching Staff   | 28    | Clerks, fee collectors, office staff: narrow workflows (e.g. accounts_room for fee collection, redressal_cell, view_notices); no LMS create/delete, no academic_setup, no admission_cell by default. |
| `staff`                | Staff (generic)      | 30    | Keep for backward compatibility; can remain as catch-all with per-user workflows, or gradually map teaching users to `teacher` and non-teaching to `non_teaching_staff`. |

**Option A – Add new roles:** Add `teacher`, `class_teacher`, `non_teaching_staff` to roles.php and role_mapping.php; extend StaffDirectorySeeder to allow these role keys where needed.  
**Option B – Keep staff, add workflows only:** Keep only `principal` and `staff`; introduce workflows `teaching_staff` and `non_teaching_staff` and assign via user_workflows (and optionally category 232/233 in seed data to drive which workflow to assign). Class teacher = staff with workflow + assignment to a class (class_teacher_id).

Recommendation: **Option A** for clear audit and UI (e.g. "Teacher", "Class Teacher", "Non-Teaching Staff" in role dropdowns). Option B is valid if you want to avoid new roles and rely on workflows + category.

---

## Permission Keys (existing and optional new)

Existing permissions that matter for these personas:

- **Admin / reports:** `view_dashboard`, `view_all_reports`, `export_reports`, `view_audit`
- **Admission:** `view_applications`, `create_applications`, … (school: stripped for school type via PermissionResolverService)
- **Office / registry:** `view_users`, `view_students`, `view_candidates`, `create_faculty`, `update_faculty`, `delete_faculty`
- **Info / PR:** `view_notices`, `create_notices`, `update_notices`, …
- **Accounts:** `view_fee_heads`, `view_fee_particulars`, `collect_fees`, `view_fee_payments`, `view_fee_reports`
- **Academic setup:** `view_departments`, `view_sessions`, `view_streams`, `view_subjects`, …
- **LMS:** `view_lms_courses`, `view_lms_allocations`, `manage_lms_allocations`, `view_lms_classes`, `create_lms_classes`, `update_lms_classes`, `delete_lms_classes`, `manage_lms_enrollments`, `view_my_lms_classes`
- **Redressal:** `view_grievances`, `create_grievances`, `view_all_support_tickets`, `create_support_tickets`, …
- **System console:** `view_roles`, `view_settings`, … (restrict to principal/admin)

Optional new keys (only if you need finer control):

- `view_my_teaching_classes` – restrict to classes where the user is instructor or class teacher (could be implemented as policy using existing `view_my_lms_classes` + scope).
- `manage_class_attendance` – if attendance is a separate module (add to permissions.php and a workflow when that feature exists).

For the plan, **no new permission keys are required**; use existing keys and workflows.

---

## Workflows to Define or Reuse

| Workflow key           | Purpose | Permissions (summary) |
|------------------------|--------|------------------------|
| `admin_desk`           | Existing | view_dashboard, view_all_reports, export_reports, view_audit |
| `admission_cell`       | Existing | view/create/update/delete/approve applications, admission heads |
| `office_registry`      | Existing | view_users, view_students, view_candidates, create/update/delete_faculty |
| `info_pr_hub`          | Existing | notices, website, news, gallery |
| `accounts_room`        | Existing | fee heads, particulars, collect_fees, view payments/reports |
| `academic_setup`       | Existing | departments, sessions, streams, subjects, subject groups/categories |
| `lms`                  | Existing | view_lms_courses, view_lms_allocations, manage_lms_allocations, view_lms_classes, create/update/delete_lms_classes, manage_lms_enrollments, view_my_lms_classes |
| `redressal_cell`       | Existing | grievances, support tickets, contacts |
| `system_console`       | Existing | roles, workflows, settings |
| **teaching_lms**       | **New (optional)** | view_lms_courses, view_lms_allocations, view_lms_classes, view_my_lms_classes, manage_lms_allocations (for assigned classes only – enforcement in policy, not in key). Use for teacher / class_teacher. |
| **non_teaching_operations** | **New (optional)** | view_dashboard, view_notices, view_fee_particulars, collect_fees, view_fee_payments, view_grievances, view_all_support_tickets, create_support_tickets. Use for non_teaching_staff. |

Alternatively, **reuse existing workflows** and assign subsets via role_mapping (e.g. teacher gets admin_desk, info_pr_hub, redressal_cell, lms; non_teaching_staff gets admin_desk, accounts_room, redressal_cell, info_pr_hub with only view/collect permissions if you split workflows later). The table above gives a minimal set for each persona.

---

## Role Mapping (role_mapping.php)

Proposed mapping (workflow keys; permissions from workflows + optional direct permissions):

```php
// Principal – keep current (full operational access except maybe system_console if desired)
'principal' => [
    'permissions' => [],
    'workflows' => [
        'admin_desk', 'admission_cell', 'office_registry', 'info_pr_hub',
        'accounts_room', 'academic_setup', 'service_branch', 'redressal_cell',
        'system_console', 'inventory', 'transport', 'lms',
    ],
],

// Teacher – teaching staff: dashboard, LMS (my classes, allocations), students view, notices, redressal
'teacher' => [
    'permissions' => [],
    'workflows' => [
        'admin_desk',           // view_dashboard, view_all_reports, view_audit
        'info_pr_hub',          // notices
        'redressal_cell',       // grievances, support tickets
        'lms',                  // view_my_lms_classes, view_lms_classes, view_lms_allocations, manage_lms_allocations, etc.
    ],
    // Optional: add office_registry with only view_students (e.g. new workflow office_registry_view_only) or grant view_students via permission
],

// Class teacher – teacher + ability to manage enrollments for assigned class (same as teacher; scope enforced by class_teacher_id in app logic)
'class_teacher' => [
    'permissions' => [],
    'workflows' => [
        'admin_desk', 'info_pr_hub', 'redressal_cell', 'lms',
    ],
],

// Non-teaching staff – fee collection, support tickets, view notices; no LMS, no academic setup, no admission
'non_teaching_staff' => [
    'permissions' => [],
    'workflows' => [
        'admin_desk',           // view_dashboard
        'info_pr_hub',          // view_notices (or create a view_only subset)
        'accounts_room',        // collect_fees, view_fee_particulars, view_fee_payments
        'redressal_cell',       // view_all_support_tickets, create_support_tickets
    ],
],

// Staff – keep for backward compatibility; can mirror teacher or be a superset and rely on user_workflows to narrow
'staff' => [
    'permissions' => [],
    'workflows' => [
        'admin_desk', 'admission_cell', 'accounts_room', 'info_pr_hub',
        'redressal_cell', 'inventory', 'transport', 'lms',
    ],
],
```

If you introduce **teaching_lms** (subset of lms without create/delete lms_classes), teacher and class_teacher could use `teaching_lms` instead of `lms` to restrict creation of classes; principal would keep full `lms`.

---

## Implementation Steps

### 1. Roles (roles.php)

- Add entries for `teacher`, `class_teacher`, `non_teaching_staff` (level between staff and principal as in the table). Keep `principal` and `staff` as-is.
- Ensure `scope_type` is null (institution-scoped) so RoleSeeder and role_scopes work as today.

### 2. Workflows (workflows.php)

- Optionally add `teaching_lms` with permissions: view_lms_courses, view_lms_allocations, view_lms_classes, view_my_lms_classes, manage_lms_allocations (no create/delete lms_classes). Use for teacher and class_teacher if you want to restrict class creation to principal/admin.
- Optionally add `non_teaching_operations` with view_dashboard, view_notices, view_fee_particulars, collect_fees, view_fee_payments, view_grievances, view_all_support_tickets, create_support_tickets. Use for non_teaching_staff.
- If you prefer not to add workflows, reuse existing (e.g. lms, accounts_room, redressal_cell) and rely on role_mapping only.

### 3. Role mapping (role_mapping.php)

- Add `teacher`, `class_teacher`, `non_teaching_staff` with workflows as in the table above.
- Keep `principal` and `staff` mappings unchanged unless you intentionally narrow principal (e.g. remove system_console).

### 4. Route and middleware (config/route_permissions.php)

- No change required if new roles are included in existing middleware (e.g. `check-role:...,teacher,class_teacher,non_teaching_staff` where staff can access). Add new role keys to the admin middleware list so they can access the app.

### 5. Staff directory and seed data

- **StaffDirectorySeeder:** Extend STAFF_ROLE_KEYS to include `teacher`, `class_teacher`, `non_teaching_staff` so institution seeders can assign these roles.
- **Staff seed files** (e.g. demo-school/staff.php, tiny-tots/staff.php): Optionally use `role` = `teacher` or `non_teaching_staff` instead of `staff` where appropriate; class teachers can be `class_teacher` with scope (e.g. scope_type = lms_class, scope_id = class id) if you support scope on user_roles for class_teacher.

### 6. Class teacher scope (optional)

- If class_teacher is scoped to a specific LmsClass: when assigning the role, set user_roles.scope_type and user_roles.scope_id (e.g. scope_type = 'lms_class', scope_id = lms_class.id). Resolver and APIs then filter by this scope (e.g. manage_lms_enrollments only for that class). This may require extending PermissionResolverService or policies to respect lms_class scope.

### 7. Navigation (use-navigation.ts)

- useNavigation already injects "My Teaching Plan" for `teaching_staff` (scope_type subject). Align role key: either rename to `teacher` and keep scope_type subject for subject-wise teaching plan, or add a similar injection for `class_teacher` (e.g. "My Class" linking to the assigned class). Ensure auth.roles from backend includes the new role keys and scope when applicable.

### 8. Backend auth share

- Ensure AuthShareController (or equivalent) sends role key and scope (e.g. role.key, role.scope_type, role.scope_id) for all assigned roles so the frontend can show "My Class" / "My Teaching Plan" for class_teacher and teacher.

---

## Summary Table

| Persona            | Role key             | Workflows (default) |
|--------------------|----------------------|----------------------|
| Principal          | principal            | admin_desk, admission_cell, office_registry, info_pr_hub, accounts_room, academic_setup, service_branch, redressal_cell, system_console, inventory, transport, lms |
| Teacher            | teacher              | admin_desk, info_pr_hub, redressal_cell, lms (or teaching_lms) |
| Class Teacher      | class_teacher        | Same as teacher; scope to one lms_class for enrollment/attendance (app logic or scope in user_roles) |
| Non-Teaching Staff | non_teaching_staff   | admin_desk, info_pr_hub, accounts_room, redressal_cell (or non_teaching_operations) |
| Staff (generic)    | staff                | Current: admin_desk, admission_cell, accounts_room, info_pr_hub, redressal_cell, inventory, transport, lms |

---

## Files to Touch

| File | Action |
|------|--------|
| [database/seeders/data/roles.php](database/seeders/data/roles.php) | Add `teacher`, `class_teacher`, `non_teaching_staff`. |
| [database/seeders/data/role_mapping.php](database/seeders/data/role_mapping.php) | Add workflow mapping for `teacher`, `class_teacher`, `non_teaching_staff`. |
| [database/seeders/data/workflows.php](database/seeders/data/workflows.php) | Optionally add `teaching_lms`, `non_teaching_operations`. |
| [database/seeders/StaffDirectorySeeder.php](database/seeders/StaffDirectorySeeder.php) | Extend STAFF_ROLE_KEYS to include new role keys. |
| [config/route_permissions.php](config/route_permissions.php) | Add new role keys to admin middleware if needed. |
| [resources/js/hooks/use-navigation.ts](resources/js/hooks/use-navigation.ts) | Align role key `teaching_staff` → `teacher` or support both; optional "My Class" for class_teacher. |
| Institution staff seed files | Optionally use `teacher` / `class_teacher` / `non_teaching_staff` in `role` field. |

No change to PermissionResolverService unless you add class_teacher scope (e.g. lms_class) and need to resolve scope_id for policies.
