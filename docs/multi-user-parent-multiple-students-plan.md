# Multi-User Support: One Parent, Multiple Students

## Goal
Support the case where **one parent** has **multiple students** (e.g. siblings). Same contact (phone/email) can be used for different children without conflating their accounts.

## Data model (one parent → many students)

| Entity | Role |
|--------|------|
| **Guardian** | One parent record (contact: name, email, mobile). **One Guardian has many students** (Users) via `guardian_students` pivot. |
| **User** (student) | One login per student. A student User has many **guardians** (parents) via `guardian_students`. |
| **User** (parent) | When a User links as parent, `Guardian.user_id` is set. That **parent User** has many **guardianRecords** (Guardian where `user_id` = parent), and each Guardian has many **students**. So **one parent User → many students**. |
| **guardian_students** | Pivot: `guardian_id`, `user_id` (student), `relation`, `is_primary`. |

**Future-safe & flexible approach:** Guardian is the single place for parent contact; one User per student for login; parent User can own one or more Guardian records, each with many students. See [Recommended: Future-Safe & Flexible Approach](#recommended-future-safe--flexible-approach) below.

---

## How the multiple-user flow works

| Step | What happens |
|------|----------------|
| **1. First child** | Application submitted with parent email (e.g. `parent@example.com`) and mobile. A new **User** is created for the student; a **Guardian** is created with that email/mobile and linked to that student. |
| **2. Second child (same contact)** | Application submitted with the **same** email or phone but different applicant name. System creates a **new User** for the second student (so each child has their own login). It looks up **Guardian** by that email/phone — finds the existing one — and **automatically links that same Guardian (parent) to the new student**. No duplicate parent; one guardian, two students. |
| **3. Verification email** | Sent to the **real** contact address (`contact_email` or application email), not the placeholder, so the parent/student receives it. |
| **4. Parent later** | Parent can log in (after linking their account to the Guardian record), see “My students”, and switch which child’s dashboard they’re viewing. |

**Auto-add as parent when existing mail/phone is used:** Yes. If the application uses an email or mobile that already exists on a **Guardian** record, that Guardian is reused and linked to the new student. Matching is by **contact only** (email or mobile), so the same contact always implies the same parent for all linked students.

---

## Email flows (what gets sent when)

| When | Email sent | Who receives |
|------|------------|--------------|
| **First application** (first child, new guardian) | **Student verification** (set-password link) | Contact email from the form. They set password and can log in as that student. |
| **Second (and later) application** (same guardian email/phone) | **Parent onboarding** (“Your student X is onboarded, log in to your panel”) | Guardian’s email. They already have an account from the first child (or they use “Link account” with email verification to claim the guardian). |

The **second student is already linked** in the database when the second application is approved (new student is attached to the existing Guardian). We do **not** “link the other student” after login — that link is created at approval time. When the parent logs in (and their user is linked to the Guardian, either by auto-link or by “Link account” + email verification), they see both students under My Students.

---

## Parent menu, panel, dashboard, permissions & workflow

| Item | Implementation |
|------|----------------|
| **Permission** | `view_my_students` – gates “My Students” in sidebar and portal access for parent. |
| **Workflow** | `parent_portal` – permissions: portal, view_my_students, apply_admission, request_certificate, submit_grievance, submit_support_ticket, view_my_lms_classes, view_lms_as_student, view_notices. |
| **Role mapping** | Parent role uses workflow `parent_portal` (not `student_portal`). |
| **Route permissions** | `config/route_permissions.php`: group `parent_portal` lists the same keys; `landing_pages`: `view_my_students` → My Students (used when resolving by permission). |
| **Sidebar** | “My Students” main item with permission `view_my_students` (only parents see it). Dashboard, Fees, Certificates, etc. use existing permissions. |
| **Dashboard** | `/dashboard` → RedirectDashboard sends parent to `student.student-dashboard` (`/student-portal/dashboard`). Page branches on `auth.role`: if `parent`, renders `ParentDashboardContent` (linked students + set active student + quick links to Fees/Certificates/Classes/Support); else student dashboard. |
| **Panel** | Same AppLayout/sidebar as student portal; parent sees Dashboard + My Students + remaining portal items. Header user dropdown uses `StudentMenuContent` for parent (Change password, Log out). |

**Seeders:** After adding the permission and workflow data, run `PermissionSeeder`, `WorkflowSeeder`, and `RoleMappingSeeder` (or full `DatabaseSeeder`) so the parent role gets `parent_portal` and the new permission exists.

**Permission-based behaviour (no role boolean):** Use permission keys and config only. `config/route_permissions.php` defines `portal_config.portal_menu_permission` (e.g. `portal`) and `portal_config.parent_dashboard_permission` (e.g. `view_my_students`). RedirectDashboard uses `landing_pages` (permission → route); dashboard and sidebar header use `auth.permissions` + `auth.portal_config` to decide parent dashboard and portal menu. No `auth.role === 'parent'` checks.

**Multiple students → multiple class access:** When a parent has linked students, they click a student (e.g. "Classes" or "Dashboard") → we set active student context via `setActiveStudent` API → then navigate to My Classes (or Dashboard, Fees, Certificates). Portal APIs use `EffectiveStudentContext::getEffectiveUser()` so the selected student’s data is returned (profile, classes, fees, notices, certificates). So "click on that student" behaves like acting as that student for data fetch.

---

## Current State

| Aspect | Current behaviour |
|--------|-------------------|
| **User ↔ Student** | One `User` per student; `StudentProfile` has `user_id`. |
| **Contact lookup** | Application desk reuses a user only when **both** (email or mobile) **and** applicant name match. Same number + different name → new user. |
| **Schema** | `users.email` is **unique**; `users.mobile` is **nullable**, no unique constraint (multiple users can share same mobile). |
| **Guardian** | Implemented: `guardians` table + `guardian_students` pivot. One Guardian has many students; one parent User has many students via their Guardian record(s). |

---

## Constraints

1. **Email** – Unique per user. So we cannot create two users with the same parent email unless we use a unique variant (e.g. `parent+student2@domain.com`) or a generated placeholder for additional students.
2. **Mobile** – Can be shared across users (no unique). Same parent mobile can be stored on multiple student users.
3. **Login** – Today login is per user (email/mobile + password). So each student has their own login, or we introduce a “parent login” that can switch between linked students.

---

## Option A: Multiple Student Accounts, Shared Contact (Current Direction)

**Idea:** Keep one `User` per student. Allow the same **mobile** (and optionally same **email** via a unique variant) for multiple users so one parent’s contact can be on many student records.

**Already done:**
- Reuse only when (email or mobile) **and** applicant name match → same number, different student → new user.
- Mobile is not unique → multiple students can have the same mobile.

**To do:**
1. **Duplicate email handling** – When creating a new user for a second sibling, if the given email already exists, assign a **unique email** (e.g. `base+student{id}@domain` or a generated placeholder) so the new user is created and the parent’s real email can be stored elsewhere (e.g. `guardian_snapshot` or a future guardian table) for communication.
2. **Optional: Guardian contact on profile** – Store “guardian email / mobile” on `StudentProfile` or application so communications can still go to the parent while the student’s `User` has a unique email for login.

**Pros:** No schema change for “guardian”; works with current login (one login per student).  
**Cons:** Parent has no single login to see all children; each child has a separate account.

---

## Option B: Parent Account + Linked Students (Future)

**Idea:** Introduce a **Guardian/Parent** entity. One parent user can be linked to multiple students and (after login) choose which student to act as or view.

**Model sketch:**
- **Guardians** – e.g. `guardians` table: `id`, `user_id` (optional parent login), `name`, `email`, `mobile`, etc.
- **Guardian–Student link** – e.g. `guardian_students`: `guardian_id`, `user_id` (student user), optional `relation` (father/mother).

**Flow:**
- Parent logs in with one account.
- Dashboard shows “My students” (list of linked students).
- Parent selects a student → view fees, attendance, etc. for that student (or impersonate for limited actions, depending on policy).

**Requires:** New migrations (guardians, guardian_students), parent registration/link flow, and UI for “switch student” / “my students”.

---

## Option C: Hybrid (Recommended Long-Term)

1. **Phase 1 (now):** Option A – Multiple student users, shared mobile; unique email per user (suffix or placeholder when parent email is reused). Optional: store guardian email/mobile on `StudentProfile` or application for communication.
2. **Phase 2:** Option B – Add guardians and linking; parent can register and link to existing students (matched by mobile/email + student name or application id). Parent dashboard with student switcher.

---

## Recommended: Future-Safe & Flexible Approach

**The most future-safe and flexible path is to introduce a first-class Guardian concept early**, then keep student accounts and add parent login on top. That way the data model stays clear and you can grow features without reworking it later.

### Why Guardian-first is future-safe and flexible

| Concern | Guardian-first approach | Contact-only (no guardian entity) |
|--------|-------------------------|------------------------------------|
| **Single source of truth** | One guardian record = one parent; all students link to it. No duplicated parent contact across users. | Parent email/mobile copied or derived per student; harder to update “all my children” when parent changes number. |
| **Parent login later** | Add `user_id` to guardian and “My students” UI; no change to how students are stored. | Would need to infer “same parent” from shared mobile/email and names; fragile and no place to attach parent credentials. |
| **Communications** | Send SMS/email to guardian; one place to store preferences (language, channel). | Must pick one student’s user or duplicate logic. |
| **Fees / consent** | “Bill or notify guardian” is a clear relation: guardian ↔ many students. | No clear entity to represent “the parent” for consent or billing. |
| **Multiple guardians** | Pivot can support father, mother, etc. with relation type. | Would require ad‑hoc fields on each profile. |

### Recommended model (minimal, then grow)

1. **Guardians table** (minimal)
   - `id`, `institution_id` (optional, for scoping), `name`, `email`, `mobile`
   - Later: `user_id` (nullable) for parent login

2. **Guardian–student link**
   - `guardian_students`: `guardian_id`, `user_id` (student’s User), `relation` (father/mother/guardian), optional `is_primary`

3. **Keep current behaviour**
   - One **User** per student (for login, roles, profile). Student’s `User` can still hold a unique email (or placeholder) and shared mobile for backward compatibility.
   - On application/admission: resolve or create **Guardian** by parent contact (email/mobile + optional name); create/link **User** for the student; create **guardian_students** row linking that guardian to that student. Siblings get the same guardian, different users.

4. **Later, without breaking anything**
   - Parent portal: guardian gets `user_id`; login shows “My students” and switch context.
   - Notifications: “notify guardian” uses guardian email/mobile.
   - Fees: “guardian responsible” is a clear relation.

### Phasing

- **Phase 1 (implemented):** `guardians` and `guardian_students` tables exist. `GuardianService::resolveOrCreateAndLinkToStudent()` runs on application create and on approval. Every new/approved application gets a guardian and a link to the student user. No parent login yet.
- **Phase 2:** Add `user_id` on guardians, parent registration/link flow, and “My students” + switch-student UI.

This keeps today’s behaviour working while making the model ready for parent accounts, communications, and consent without refactors later.

---

## Immediate Implementation (Phase 1)

1. **Application desk – unique email for new users**  
   When creating a new `User` for an application and the submitted email already exists:
   - Generate a unique email, e.g.:
     - `{local_part}+student{short_id}@{domain}` if the address looks like a valid email, or
     - `guardian-{mobile_slug}-{short_id}@internal.local` when no valid email.
   - Use this for `users.email` so the row is created; keep the real parent email in `guardian_snapshot` or on the application for correspondence.

2. **Keep mobile as-is**  
   No change; multiple users can already share the same mobile.

3. **Documentation**  
   In application form or admin docs: “Same parent contact (phone/email) can be used for multiple students; each student gets a separate account.”

---

## Summary

| Scenario | Behaviour |
|----------|-----------|
| Same mobile, same applicant name | Reuse existing user. |
| Same mobile, different applicant name | Create new user; same mobile allowed; email made unique if needed. |
| Same email, different applicant name | Create new user; assign unique email variant; mobile/parent email stored for contact. |
| Future: parent login | Guardian model + links; parent sees list of students and switches context. |

This plan keeps the current one-user-per-student model, allows one parent to have multiple students (same contact, different accounts), and leaves room for a later parent account and multi-student view.
