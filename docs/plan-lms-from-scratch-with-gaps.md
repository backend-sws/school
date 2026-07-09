# LMS Plan: From Scratch (Existing Flow + Gaps)

This document describes the **Learning Management System (LMS)** as it exists today and what a **proper LMS** would look like, with **gaps** clearly listed so they can be filled in order.

---

## 1. What a Proper LMS Covers

A full LMS typically includes:

| Area | Description |
|------|--------------|
| **Structure** | Academic setup (departments, streams, sessions), classes/sections, subjects per class, classrooms. |
| **Class–subject link** | For each “class” (stream + session), which subjects are taught and in which room (timetable / allocation). |
| **Running sections** | LMS “classes” = run-time sections (e.g. Biology 11 Section A, 2024–25) with optional many sections (A, B, C). |
| **Enrollments** | Which students (and optionally teachers) are in which LMS class. |
| **Content per class/subject** | Assignments, tests, live sessions, recordings, announcements, materials — scoped by class and ideally by subject/room. |
| **Student experience** | Student sees only their enrolled classes and subject-rooms; can submit assignments, take tests, view materials. |
| **Teacher experience** | Teacher sees only classes/rooms they teach; can create and grade content. |
| **Permissions & scope** | Institution-scoped data; roles (admin, teacher, student) with clear abilities. |

Below: what we **have** today, then **gaps** to reach the above.

---

## 2. Existing Flow (What We Have Today)

### 2.1 Academic Setup (Outside LMS)

- **Departments** → `/organization/departments`
- **Main Course Streams** → `/organization/main-streams`
- **Streams & Programs** → `/organization/streams` (these are the “classes” in setup, e.g. Biology 11, BSc)
- **Academic Sessions** → `/organization/sessions`
- **Subject Inventory** → `/organization/subject`
- **Classrooms** → LMS classrooms (API + likely UI under LMS or organization)

There is **no UI** for **Class–Subject Allocations**. The table `class_subject_allocations` (stream_id, subject_id, session_id, classroom_id, instructor_id) exists; data is from seeders or backend only.

### 2.2 LMS Navigation & Entry

- **Sidebar:** LMS has **OVERVIEW** and **CLASSES** (no COURSES in nav).
- **Overview** (`/lms`): Setup cards (Courses, Classes, Classrooms) — some links may go to routes not in nav.
- **Classes** (`/lms/classes`): List of all LMS classes. Filters: Department, Stream, Session. Columns: Name, Code, Stream, Section, Session, Room, Actions. Add/Edit class: Stream, Session, Section, Name, Code, Status (no Course/Room in form).

### 2.3 LMS Class → Subjects & Rooms

- **Open a class** → **Subjects & rooms** page (`/lms/classes/{id}`).
  - **If class has no stream/session:** “Link stream & session” CTA + single **General** room card.
  - **If class has stream + session:** Subject-room cards = allocations for that `stream_id` + `session_id` (from `class_subject_allocations`). Each allocation = one card (Subject – Classroom). If no allocations, single **General** room card.
- **Edit class** from this page opens the class dialog (set stream/session/section).
- Room cards link to **Room detail** (`/lms/classes/{id}/rooms/{roomId}`). `roomId` = allocation id or `"general"`.

### 2.4 Room Detail (Content)

- **URL:** `/lms/classes/{classId}/rooms/{roomId}`.
- **Sections:** Assignments, Tests, Live sessions, Recordings, Announcements, Materials.
- **Backend:** All content APIs are scoped by **`lms_class_id`** only (e.g. `GET/POST .../classes/{lms_class_id}/assignments`). There is **no** `class_subject_allocation_id` or room id in assignments, tests, live sessions, recordings, announcements, or materials tables.
- **Implication:** The same list of assignments/tests/etc. is shown for every room of that class. “Room” is a **navigation grouping** only; content is **per class**, not per subject/room.

### 2.5 Backend (Existing)

- **Classes:** CRUD, `GET classes/{id}/allocations` (read-only).
- **Content:** Full CRUD for assignments (with submissions), tests, live sessions, recordings, announcements, materials — all by `lms_class_id`.
- **Enrollments:** Table `lms_class_enrollments` (lms_class_id, user_id, role, status) exists; **no API or UI** for managing enrollments.
- **Permissions:** LMS workflow with e.g. `view_lms_classes`, `create_lms_classes`, etc. No allocation-specific or enrollment-specific permissions.

### 2.6 Terminology (Quick Reference)

| Term | Meaning |
|------|---------|
| **Stream** | Program / “class” in setup (Biology 11, BSc). Belongs to Department. |
| **Session** | Academic year (2024–25). |
| **LMS Class** | One running section: Stream + Session + Section (e.g. A, B) + Name, Code. |
| **Allocation** | One row: Stream + Session + Subject + Classroom (+ optional Instructor). Many allocations per stream+session = many “subject-rooms” for that class. |
| **Room (in UI)** | One subject-room card = one allocation, or “General” when no allocation. |

---

## 3. Gaps (What’s Missing for a Proper LMS)

### 3.1 Allocation Management

| Gap | Detail | Priority |
|-----|--------|----------|
| **No UI to create/edit allocations** | Staff cannot define “for this stream+session, these subjects in these rooms.” Allocations are read-only in the app. | **High** |
| **No API to create allocations** | Only `GET classes/{id}/allocations`. Need `POST` (and optionally `PUT`/`DELETE`) for allocations, scoped by class or by stream+session. | **High** |
| **No permissions for allocations** | e.g. `view_lms_allocations`, `create_lms_allocations` and role assignment. | **Medium** |

**Suggested direction:** Add “Add subject & room” on the class’s Subjects & rooms page (creates allocation for that class’s stream+session). Optionally add an Academic Setup screen for bulk allocation management.

---

### 3.2 Class Enrollments

| Gap | Detail | Priority |
|-----|--------|----------|
| **No UI to enroll students in a class** | `lms_class_enrollments` exists but there is no screen to add/remove students (or teachers) to/from an LMS class. | **High** |
| **No API for enrollments** | Need list/add/remove/update enrollments for a class (and optionally per user: “my classes”). | **High** |
| **Student view depends on enrollments** | Until enrollments exist and are used in APIs, “student sees only their classes” cannot be implemented. | **High** |

**Suggested direction:** Enrollments API (`GET/POST/DELETE classes/{id}/enrollments`), then UI on class detail or a dedicated “Enrollments” tab/section for the class.

---

### 3.3 Content Scoped by Subject/Room

| Gap | Detail | Priority |
|-----|--------|----------|
| **Content is per class, not per room** | Assignments, tests, live sessions, recordings, announcements, materials are all stored with `lms_class_id` only. So every “room” of a class shows the same content. | **Medium** |
| **No allocation/room id on content** | To have “Physics assignments” vs “Chemistry assignments” per class, content would need an optional `class_subject_allocation_id` (or room identifier) and APIs filtered by it. | **Medium** |

**Suggested direction:** Either (A) add optional `class_subject_allocation_id` to content tables and APIs and filter by room when on a subject-room, or (B) keep content class-level and treat rooms as navigation only (current behavior). (A) is needed for a “proper” subject-wise LMS.

---

### 3.4 Student Experience

| Gap | Detail | Priority |
|-----|--------|----------|
| **No student-portal LMS view** | Students don’t have a dedicated “My classes” / “My subjects” view in the app showing only enrolled classes and subject-rooms. | **High** |
| **No submission/attempt flow for students** | Assignment submission and test attempt APIs may exist; student-facing UI (submit assignment, take test, see results) may be missing or incomplete. | **High** |
| **Permissions** | Student role needs LMS permissions (e.g. `view_lms_courses` or `view_my_lms_classes`) and APIs must filter by enrollments. | **High** |

**Suggested direction:** Student portal section for LMS: list enrolled classes → class → subject-rooms → content (assignments with submit, tests with attempt, materials, etc.).

---

### 3.5 Teacher / Instructor Experience

| Gap | Detail | Priority |
|-----|--------|----------|
| **No “my classes” for teachers** | Teachers/instructors are not restricted to classes (or allocations) they teach. No “assigned to me” view. | **Medium** |
| **Allocation instructor not used** | `class_subject_allocations.instructor_id` exists but is not used to filter what a teacher sees or can edit. | **Medium** |
| **Grading** | Assignment submission grading and test result handling may be missing or partial. | **Medium** |

**Suggested direction:** Use `instructor_id` on allocations (and optionally class-level role) to scope “my classes” and permissions; add grading UI where needed.

---

### 3.6 Other Gaps

| Gap | Detail | Priority |
|-----|--------|----------|
| **Courses in LMS** | Courses (LMS courses) are out of nav and optional; course–class link exists in DB but not in class form. No impact on current “classes + subjects” flow. | **Low** |
| **LMS overview page** | Still shows Courses, Classrooms; nav only has Overview and Classes. Align overview cards with nav and with “class → subjects” story. | **Low** |
| **Due dates & notifications** | No reminder/notification for assignment due dates or live sessions. | **Low** |
| **Analytics/reports** | No dashboards for completion, scores, or engagement per class/subject. | **Low** |

---

## 4. Recommended Order of Work

1. **Allocations:** API + “Add subject & room” (and optionally list/edit) so each class can have multiple subjects in the UI with real data.
2. **Enrollments:** API + UI to enroll students (and optionally teachers) in a class; use enrollments in permission/scope logic.
3. **Student LMS:** Student portal view “My classes” → class → subject-rooms → content (view + submit/attempt).
4. **Content per room (optional):** Add optional `class_subject_allocation_id` to content and filter by room so content is subject-wise.
5. **Teacher scope:** Use allocation instructor and roles to show “my classes” and limit edit access.
6. **Polish:** Overview alignment, grading UX, notifications, analytics as needed.

---

## 5. One-Page Summary

| Layer | Existing | Gap |
|-------|----------|-----|
| **Setup** | Departments, Streams, Sessions, Subjects, Classrooms | **Allocation UI + API** (create/edit subject–room per stream+session) |
| **LMS classes** | List, filters, Add/Edit (Stream, Session, Section, Name, Code), Subjects & rooms page, room cards from allocations | — |
| **Room detail** | Assignments, Tests, Live sessions, Recordings, Announcements, Materials (all by class) | **Content per room** (optional); grading/attempt UI |
| **Enrollments** | Table exists | **API + UI**; use for student/teacher scope |
| **Student** | — | **Portal “My classes”**; view content, submit/attempt |
| **Teacher** | — | **“My classes”** by instructor; grading |

Flow diagrams for the existing flow are in [lms-class-subjects-flow-diagram.md](./lms-class-subjects-flow-diagram.md).
