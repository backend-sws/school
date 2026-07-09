# Student/Parent Portal Flow for School – From Login to Every Menu

## Scope

- **Persona:** Student or parent/guardian logging into the **student portal** (same app; roles `student` or `candidate`).
- **Context:** School-type institution. Staff-side simplification (no Admission Enquiry / Admission Heads) does **not** change what students see; students only interact with **My Applications**, certificates, tickets, etc.
- **Layout:** All portal pages currently use AppLayout (shared with staff). A dedicated PortalLayout exists but is **not** used by any student-portal page.

---

## 1. Entry and authentication

| Step             | Where                                                                 | What happens                                                                                                                                                                                                                                                                                                           |
| ---------------- | --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **1.1 Entry**    | School website / landing (e.g. `school.localhost` or public pages)    | Links such as "Student Portal", "Parent Portal", "Fee Payment", "Student Dashboard" in `database/seeders/data/inst/demo-school/settings.php` point to `/student-portal/login`.                                                                                                               |
| **1.2 Login**    | `resources/js/pages/student-portal/auth/login.tsx` – route `/student-portal/login` | User enters login_id + password. On success, `router.visit("/student-portal/dashboard")`. Uses AuthApi.Login.                                                                                                                                                               |
| **1.3 Register** | `resources/js/pages/student-portal/auth/register.tsx` – route `/student-portal/register` | New candidate/student registration. On success, redirect to `/student-portal/dashboard`.                                                                                                                                                                                                                               |
| **1.4 Guard**    | Middleware                                                            | Portal routes use `auth`, `verified`, and `route_permissions.middleware.portal` (`config/route_permissions.php`): roles `candidate` or `student` and at least one permission from group `student_portal` (portal, apply_admission, request_certificate, submit_grievance, view_notices). |

**Dashboard redirect:** Visiting `/dashboard` while having `portal` triggers `RedirectDashboard` and sends the user to `student.student-dashboard` → `/student-portal/dashboard`.

---

## 2. Post-login layout and sidebar

- **Layout:** Every student-portal page uses **AppLayout** (sidebar + AppSidebarHeader). Sidebar is built from `unifiedSidebarConfig` (`resources/js/constants/navigation.ts`) and filtered by **permissions** in `filterByPermissions` (`resources/js/constants/sidebar/index.ts`).
- **What students see:**
  - **Main item:** Dashboard (permission `portal`) → `/student-portal/dashboard`.
  - **My Portal group:**
    - My Applications → `/student-portal/my-applications` (permission `apply_admission`).
    - My Certificates → `/student-portal/my-certificates` (permission `request_certificate`).
    - My Tickets → `/student-portal/tickets` (permission `submit_support_ticket`).
  - **My Classes** is **not** in the sidebar (commented out; would use `view_my_lms_classes`). Students can still open `/student-portal/my-classes` if linked from elsewhere (e.g. dashboard).
- **Roles and permissions:** `database/seeders/data/role_mapping.php`: `student` has workflow `student_portal` + permissions `portal`, `view_lms_courses`; `candidate` has workflow `student_portal` + permission `portal`. Workflow `student_portal` in `database/seeders/data/workflows.php` grants portal-related keys (e.g. apply_admission, request_certificate, submit_support_ticket, submit_grievance, view_notices).

---

## 3. Menu and page flow (every reachable page)

| #   | Menu / page                        | Route                                            | Permission              | Purpose                                                                                                                                                                            |
| --- | ---------------------------------- | ------------------------------------------------ | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Dashboard**                      | `/student-portal/dashboard`                      | `portal`                | First screen after login. Profile banner, quick info, personal/guardian, academic details, addresses, verified documents, notice board. Data from `AdmissionApi.studentProfile()`. |
| 2   | **My Applications**                | `/student-portal/my-applications`                | `apply_admission`       | List of own admission applications; status, payment; pay via PayU; download invoice.                                                                                               |
| 3   | **My Certificates**                | `/student-portal/my-certificates`                | `request_certificate`   | List of certificate requests and status; request/pay for certificates.                                                                                                             |
| 4   | **My Tickets**                     | `/student-portal/tickets`                        | `submit_support_ticket` | Support tickets: list, create, view.                                                                                                                                               |
| 5   | **Admission** (no sidebar link)    | `/student-portal/admission`                      | Portal group            | Multi-step admission form (filter → fee head → instruction → verify → form steps). Used for **new** applications. Reachable via direct link or future dashboard card.              |
| 6   | **Re-admission** (no sidebar link) | `/student-portal/readmission`                    | Portal group            | Re-admission flow. Direct link or future dashboard card.                                                                                                                           |
| 7   | **Certificates** (list)            | `/student-portal/certificates`                   | Portal group            | Certificate application list/entry. Linked from My Certificates or direct.                                                                                                         |
| 8   | **Fees**                           | `/student-portal/fees`                           | Portal group            | Placeholder page ("Fees"). Route exists; minimal UI.                                                                                                                               |
| 9   | **My Classes** (no sidebar link)   | `/student-portal/my-classes`                     | —                       | List of enrolled classes (LMS). Student role has `view_lms_courses` but sidebar item is commented out.                                                                             |
| 10  | **My Class detail**                | `/student-portal/my-classes/{id}`                | —                       | Single class view.                                                                                                                                                                 |
| 11  | **Class room**                     | `/student-portal/my-classes/{id}/rooms/{roomId}` | —                       | Room within a class.                                                                                                                                                               |

All above routes are defined in `routes/student.php` under the same `student-portal` prefix and portal middleware.

---

## 4. School-specific notes

- **Staff vs student:** For **school** type, staff see only Application Desk (Admission Enquiry and Admission Heads hidden by PermissionResolverService). **Students/parents** are unaffected: they do not see staff menus; they only see portal menu items (Dashboard, My Applications, My Certificates, My Tickets) and can use admission/readmission/fees/my-classes if linked or known URLs.
- **Institution context:** Login and API calls use the current institution (e.g. resolved by domain or session). School name/branding comes from `useCollege()` / institution settings (e.g. demo-school settings "Parent Portal", "Student Dashboard" links).
- **Application Desk:** Staff-only. Students do **not** see "Application Desk"; they use **My Applications** to view and pay for their own applications. One-go onboarding (new/re-admit) is done by **staff** on Application Desk; students may still use **Admission** or **Re-admission** flows for self-service where offered.

---

## 5. Flow diagram

```mermaid
flowchart TB
  subgraph entry [Entry]
    A[School / landing page]
    B["/student-portal/login"]
    C["/student-portal/register"]
    A --> B
    A --> C
  end

  subgraph auth [After auth]
    B --> D[Redirect: /student-portal/dashboard]
    C --> D
    D --> E[AppLayout + Sidebar]
  end

  subgraph menu [Sidebar menu]
    E --> F[Dashboard]
    E --> G[My Applications]
    E --> H[My Certificates]
    E --> I[My Tickets]
  end

  subgraph direct [Reachable by direct link or future cards]
    J[/admission]
    K[/readmission]
    L[/certificates]
    M[/fees]
    N[/my-classes]
    N --> O["/my-classes/:id"]
    O --> P["/my-classes/:id/rooms/:roomId"]
  end
```

---

## 6. Optional improvements (out of scope for this plan)

- **Use PortalLayout for portal pages:** Switch student-portal pages from AppLayout to PortalLayout and fix PortalLayout nav hrefs (e.g. `/student-portal/my-applications`) so students get a dedicated portal UI instead of the staff-style sidebar.
- **Expose My Classes in sidebar:** Uncomment and gate "My Classes" by `view_my_lms_classes` (or `portal`) so enrolled students can open it from the menu.
- **Dashboard shortcuts:** Add cards or links on the dashboard to Admission, Re-admission, Fees, and My Classes for clearer discovery.
- **Fees page:** Replace placeholder with real fee list/payment UI for students.

No backend or permission changes are required for the current flow; this document describes behaviour and suggests optional UX improvements.
