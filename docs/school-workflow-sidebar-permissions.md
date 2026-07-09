# School Workflow: Sidebar Permissions and Role Visibility

This document is the single source of truth for which sidebar routes and actions each role can see and use, for both **college** and **school** institution types. School-specific behaviour is achieved by stripping certain permissions in `PermissionResolverService` using config `config/ems.php` (`school_hidden_*`).

## Architecture

- **Roles:** `super_admin`, `institution_admin`, `principal`, `staff`, `student`, `candidate`, `parent` (see `database/seeders/data/roles.php`).
- **Workflows** define permission sets; `database/seeders/data/role_mapping.php` maps each role to workflows.
- **Effective permissions** are resolved by `App\Services\PermissionResolverService`. For institution type **school**, the following permissions are removed from the effective set unless explicitly granted via user_permissions:
  - **Admission:** `view_candidates`, `view_admission_heads` (config: `ems.school_hidden_admission_permissions`)
  - **Fee heads:** `view_fee_heads`, `create_fee_heads`, `update_fee_heads`, `delete_fee_heads` (config: `ems.school_hidden_fee_head_permissions`)
  - **Portal:** `request_certificate`, `apply_admission` (config: `ems.school_hidden_portal_permissions`)
  - **Staff links:** `view_staff_links`, `update_staff_links` (config: `ems.school_hidden_staff_permissions`)
- **Sidebar** (`resources/js/constants/navigation.ts`) filters by `auth.permissions`; each item has a single `permission` key.
- **Routes** use `config/route_permissions.php` middleware; each group lists the permission keys that allow access.

## Seeders

For sidebar visibility and route access to match this document, the following seeders must be run so that roles, permissions, workflows, and role–workflow mappings exist in the database. Order matters: workflows depend on permissions; role mapping depends on roles and workflows.

| Order | Seeder | Purpose |
|-------|--------|---------|
| 1 | `RoleSeeder` | Creates roles (super_admin, institution_admin, principal, staff, student, candidate, parent). |
| 2 | `PermissionSeeder` | Creates all permission records from `database/seeders/data/permissions.php`. |
| 3 | `WorkflowSeeder` | Creates workflows and their permission sets from `database/seeders/data/workflows.php`. |
| 4 | `RoleMappingSeeder` | Maps each role to workflows (and direct permissions) from `database/seeders/data/role_mapping.php`. |

**Run all four (recommended):**

```bash
php artisan db:seed --class=RoleSeeder
php artisan db:seed --class=PermissionSeeder
php artisan db:seed --class=WorkflowSeeder
php artisan db:seed --class=RoleMappingSeeder
```

Or run the full `DatabaseSeeder`, which runs these in the correct order along with organisation, institution, and other seeders:

```bash
php artisan db:seed
```

After seeding, assign users to roles (and optionally workflows) for the active institution; `PermissionResolverService` will then resolve `auth.permissions` and the sidebar will filter accordingly.

## Admin roles – workflows (from role_mapping)

| Role                  | Workflows                                                                                                                                                  | Office Registry | Academic Setup | System Console |
|-----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------------|----------------|----------------|
| **institution_admin**  | admin_desk, admission_cell, office_registry, info_pr_hub, accounts_room, academic_setup, service_branch, redressal_cell, system_console, inventory, transport, attendance, lms | Yes             | Yes            | Yes            |
| **principal**         | Same as institution_admin                                                                                                                                  | Yes             | Yes            | Yes            |
| **staff**             | admin_desk, admission_cell, accounts_room, info_pr_hub, redressal_cell, inventory, transport, attendance, lms (no office_registry, academic_setup, system_console) | No              | No             | No             |

## Sidebar sections and required permission

- **My Organisation:** `view_institutes`
- **Admission & Registry:** `view_candidates`, `view_applications`, `view_admission_heads`, `view_students`
- **Treasury & Fees:** `view_fee_regulations`, `view_fee_heads`, `view_students`
- **Academic:** `view_sessions`, `view_departments`, `view_streams`, `view_subjects`, `view_subject_groups`, `view_lms_classes`
- **Certificate:** `view_certificates`, `issue_certificates`
- **Redressal:** `view_grievances`, `view_all_support_tickets`, `view_contacts`
- **Website & PR:** `view_notices`, `update_website`, `update_gallery`, `update_news`
- **Inventory / Transport / Analytics:** per-section keys (e.g. `view_inventory_categories`, `view_transport_routes`, `view_all_reports`, `view_fee_reports`, `view_students`, `view_audit`)

## Visibility matrix – College vs School (admin roles)

| Sidebar item                    | Permission(s)                   | institution_admin / principal (College) | institution_admin / principal (School) | staff (College)         | staff (School)           |
|---------------------------------|----------------------------------|------------------------------------------|----------------------------------------|--------------------------|--------------------------|
| Candidates                      | view_candidates                  | Yes                                      | **No** (stripped)                      | No (no office_registry)  | No                       |
| Applications                    | view_applications                | Yes                                      | Yes                                    | Yes                     | Yes                      |
| Admission Heads                 | view_admission_heads             | Yes                                      | **No** (stripped)                      | No (no office_registry)  | No                       |
| Students                        | view_students                    | Yes                                      | Yes                                    | No                      | No                       |
| Fee Types / Fee profile         | view_fee_regulations             | Yes                                      | Yes                                    | Yes                     | Yes                      |
| Fee Heads                       | view_fee_heads                   | Yes                                      | **No** (stripped)                      | Yes                     | **No** (stripped)        |
| Student Ledgers                 | view_students                    | Yes                                      | Yes                                    | No                      | No                       |
| Sessions, Departments, Streams, Subjects, Subject Groups, Classrooms | academic_setup / lms            | Yes                                      | Yes                                    | No (no academic_setup)   | No                       |
| Certificate heads / Applications| view_certificates, issue_certificates | Yes                                   | Yes                                    | No (no service_branch)   | No                       |
| Grievances, Tickets, Contacts   | redressal_cell                  | Yes                                      | Yes                                    | Yes                     | Yes                      |
| Notices, Sliders, Galleries, News| info_pr_hub                      | Yes                                      | Yes                                    | Yes                     | Yes                      |
| Inventory, Transport, Analytics  | per section                      | Yes                                      | Yes                                    | Yes (except Audit)       | Same; Fee Heads hidden in school |
| Settings – Staff Directory      | view_users                       | Yes                                      | Yes                                    | No (no office_registry)  | No                       |
| Settings – Security Roles      | view_roles                       | Yes                                      | Yes                                    | No (no system_console)   | No                       |
| Settings – Institution / Operational | update_settings, etc.        | Yes                                      | Yes                                    | No                      | No                       |

## Portal roles (student, candidate, parent)

- **student / candidate:** Main items (Dashboard, My Classes, Fees, Transactions, Certificates, My Applications, Support) are gated by `portal`, `view_my_lms_classes`, `request_certificate`, `apply_admission`, `submit_support_ticket`. In **school**, `request_certificate` and `apply_admission` are stripped, so Certificates and My Applications disappear unless explicitly granted via user_permissions.
- **parent:** Same portal items plus `view_my_students` for parent dashboard; school stripping does not remove `view_my_students`.

## Actions (create / update / delete)

Actions are gated by the same permission keys (e.g. `create_applications`, `update_applications`, `approve_applications`). Backend middleware uses the same groups in `config/route_permissions.php`. Pages should hide or disable buttons when the user lacks the corresponding permission.

## Verification checklist

- **institution_admin (school):** Candidates, Admission Heads, and Fee Heads should be hidden; Applications and the rest visible.
- **staff (school):** Same stripping as above; in addition Students, Academic section, Certificate section, Staff Directory, Security Roles, and institutional Settings should be hidden.
- **staff (college):** Fee Heads and full Admission & Registry (Candidates, Admission Heads) and Students visible only if office_registry is assigned; otherwise only Applications and other non–office_registry items.
