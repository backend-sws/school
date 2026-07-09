# Plan: Class Setup → Each Class Has Multiple Subjects

This document plans how **Academic Setup** (departments, streams, sessions, subjects) connects to **LMS Classes** so that **each LMS class has multiple subjects** (subject-wise rooms).

**Flow diagrams:** See [lms-class-subjects-flow-diagram.md](./lms-class-subjects-flow-diagram.md).  
**Full LMS plan (existing flow + gaps):** See [plan-lms-from-scratch-with-gaps.md](./plan-lms-from-scratch-with-gaps.md).

---

## 1. Terminology

| Term in UI / code | Meaning |
|-------------------|--------|
| **Department** | Academic department (e.g. Science, Arts). Has many Streams. |
| **Stream** | Academic program / “class” in setup (e.g. Biology 11, BSc CBCS, BA CBCS). Belongs to Department (optional) and Main Stream. |
| **Session** | Academic session / year (e.g. 2024–25). |
| **Subject** | Subject from Subject Inventory (e.g. Physics, Mathematics). |
| **Classroom** | Physical room (e.g. Room 101). |
| **LMS Class** | One **running section**: Stream + Session + optional Section (e.g. “A”, “B”). This is what appears in LMS → Classes. |
| **Class–Subject Allocation** | One row: for a given **Stream + Session**, a **Subject** is taught in a **Classroom** (optional **Instructor**). Many allocations per stream+session = many subjects per “class”. |

So: **“Class” in setup** = Stream (the program). **“Class” in LMS** = one running section (stream + session + section). **Multiple subjects in that class** = all allocations for that stream + session, shown as subject–room cards.

---

## 2. Current Flow (As Implemented)

### 2.1 Academic Setup (existing)

- **Departments** → `/organization/departments`
- **Main Course Streams** → `/organization/main-streams`
- **Streams & Programs** → `/organization/streams` (these are the “classes” in setup: e.g. Biology 11, BSc 1st year)
- **Academic Sessions** → `/organization/sessions`
- **Subject Inventory** → `/organization/subject`
- **Classrooms** → LMS has classrooms; can be under Organization or LMS depending on codebase.

There is **no dedicated UI** today for **Class–Subject Allocations** (the table `class_subject_allocations`: stream_id, subject_id, session_id, classroom_id, instructor_id). Allocations may be created via seeders or backend only.

### 2.2 LMS Classes (existing)

- **LMS → Classes** lists **LmsClass** rows: each = Stream + Session + Section + Name, Code, Status.
- **Filters:** Department, Stream, Session.
- **Open a class** → **Subjects & rooms** page.
  - If the class has **no stream/session** linked: show “Link stream & session” and a single **General** room.
  - If the class has **stream + session**: subject-wise rooms = **allocations** where `allocation.stream_id = class.stream_id` and `allocation.session_id = class.session_id`. Each allocation = one card (subject + classroom). If there are no allocations, show single **General** room.
- **Open a room** (subject or General) → room detail: Assignments, Tests, Live sessions, Recordings, Announcements, Materials.

So **each LMS class already has multiple subjects** whenever:
1. The class is linked to a **Stream** and **Session**.
2. There exist **ClassSubjectAllocation** rows for that stream_id + session_id.

The missing piece is **where and how** allocations are created (UI).

---

## 3. Intended End-to-End Flow

1. **Academic Setup**
   - Define **Departments** and **Streams** (programs / “classes”).
   - Define **Sessions**, **Subjects**, **Classrooms**.
   - Define **Class–Subject Allocations**: for each (Stream, Session), add rows (Subject, Classroom, optional Instructor). This answers: “For Biology 11 in 2024–25, which subjects are taught in which room?”

2. **LMS**
   - **Create LMS Classes** = create running sections: choose Stream + Session + optional Section (A/B/C) + Name, Code.
   - **Open a class** → see **multiple subject–room cards** (from allocations for that stream+session), or **General** if no allocations.
   - **Open a subject room** → manage content (assignments, tests, live sessions, etc.) for that class + subject.

So: **Class setup (departments, streams, etc.)** defines the structure; **allocations** define “which subjects in which room” per stream+session; **LMS class** is one section of that stream+session and **inherits** those subjects as rooms.

---

## 4. Gaps and Plan

### 4.1 Allocation management UI (recommended)

- **Add a screen** to create/edit/delete **Class–Subject Allocations**.
- **Placement options:**
  - **A. Academic Setup**  
    New item e.g. **“Subject–Room Allocations”** or **“Class subject allocations”** under Academic Setup (with Departments, Streams, Sessions, Subject Inventory).  
    - List/filter by Stream, Session (and optionally Department).  
    - Form: Stream, Session, Subject, Classroom, optional Instructor.  
    - One allocation = one subject in one room for that stream+session.
  - **B. From LMS class page**  
    On the class’s “Subjects & rooms” page, add **“Add subject & room”** that creates an allocation for that class’s stream+session (subject, classroom, optional instructor). Session/institution come from the class.

- **Recommendation:** Do **both** in the long run: (A) for bulk setup and timetabling view, (B) for quick add while viewing a class. Minimum: **(B)** so staff can add subject-rooms from the class page without leaving LMS.

### 4.2 Permissions

- Add permissions for allocation management, e.g. `view_lms_allocations`, `create_lms_allocations`, `update_lms_allocations`, `delete_lms_allocations` (or reuse existing if already present).
- Add them to the `lms` workflow and assign to appropriate roles (e.g. institution_admin, principal, staff).

### 4.3 Backend

- **API:**  
  - Already: `GET lms/classes/{id}/allocations` returns allocations for the class’s stream+session.  
  - Add: `POST lms/classes/{id}/allocations` (or `POST lms/allocations` with stream_id, session_id from body) to create an allocation; validate stream_id/session_id match class if scoped to class.  
  - Add: `PUT/DELETE` for allocation by id (and optionally list allocations with filters for the allocations management page if using option A).

### 4.4 Data model (no change)

- **ClassSubjectAllocation:** stream_id, subject_id, session_id, classroom_id, instructor_id, institution_id.  
- **LmsClass:** stream_id, session_id, section, name, code, … (no change).  
- Allocations are **not** stored on LmsClass; they are queried by stream_id + session_id when showing a class’s subject rooms.

---

## 5. Summary

- **Class setup** = Departments, Streams (programs), Sessions, Subjects, Classrooms.  
- **Each LMS class** = one running section (Stream + Session + Section).  
- **Each such class has multiple subjects** by defining **Class–Subject Allocations** (stream + session + subject + classroom + optional instructor).  
- **Current state:** Allocations are read and shown as subject–room cards; **missing:** UI (and optionally API) to **create/edit** allocations.  
- **Plan:** Add allocation creation (at least from LMS class page; optionally also an Academic Setup screen), plus permissions and APIs as above.
