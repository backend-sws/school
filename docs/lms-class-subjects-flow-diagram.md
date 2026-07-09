# LMS: Class Setup → Multiple Subjects — Flow Diagrams

These diagrams describe the **existing** LMS flow (current implementation). For the full plan from scratch and **gaps**, see [plan-lms-from-scratch-with-gaps.md](./plan-lms-from-scratch-with-gaps.md).

Use any [Mermaid](https://mermaid.js.org)-compatible viewer (e.g. GitHub, VS Code with Mermaid extension, or [mermaid.live](https://mermaid.live)) to render the code blocks below.

---

## 1. Data & structure flow (what feeds what)

```mermaid
flowchart TB
    subgraph setup["Academic Setup"]
        Dept[("Departments")]
        Streams[("Streams & Programs\n(e.g. Biology 11, BSc)")]
        Sessions[("Academic Sessions\n(e.g. 2024-25)")]
        Subjects[("Subject Inventory\n(Physics, Math, …)")]
        Rooms[("Classrooms\n(Room 101, …)")]
        Dept --> Streams
    end

    subgraph allocations["Class–Subject Allocations"]
        A1["Stream + Session\n+ Subject + Classroom\n(+ optional Instructor)"]
        A2["One row per\nsubject-room per\nstream+session"]
    end

    subgraph lms["LMS"]
        LmsClass["LMS Class\n= Stream + Session + Section\n(e.g. Biology 11, 2024-25, Section A)"]
        SubjectRooms["Subjects & rooms page\n= cards from allocations\nfor this stream + session"]
        RoomDetail["Room detail\nAssignments, Tests,\nLive sessions, Recordings"]
    end

    Streams --> A1
    Sessions --> A1
    Subjects --> A1
    Rooms --> A1

    A1 --> A2
    A2 --> SubjectRooms

    Streams --> LmsClass
    Sessions --> LmsClass
    LmsClass --> SubjectRooms
    SubjectRooms --> RoomDetail
```

---

## 2. User journey (existing flow)

```mermaid
flowchart LR
    subgraph step1["1. Setup (Academic Setup)"]
        S1[("Departments\nStreams\nSessions\nSubjects\nClassrooms")]
    end

    subgraph step2["2. Allocations"]
        S2["Data in DB only\n(no UI yet)\nStream+Session+Subject+Room"]
    end

    subgraph step3["3. LMS Classes"]
        S3["Create LMS Class:\nStream, Session, Section\nName, Code"]
    end

    subgraph step4["4. Use class"]
        S4["Open class\n→ Subject-room cards\n(from allocations or General)"]
        S5["Open a room\n→ Assignments, Tests,\nLive sessions, etc."]
    end

    S1 --> S2
    S2 --> S3
    S3 --> S4
    S4 --> S5
```

---

## 3. One class, many subjects (detail)

```mermaid
flowchart TB
    subgraph class["One LMS Class"]
        C["Biology 11 · 2024-25 · Section A"]
    end

    subgraph link["Linked to"]
        Stream["Stream: Biology 11"]
        Session["Session: 2024-25"]
    end

    subgraph alloc["Allocations for same Stream + Session"]
        A1["Biology 11 + 2024-25\n→ Physics  → Room 101"]
        A2["Biology 11 + 2024-25\n→ Chemistry → Room 102"]
        A3["Biology 11 + 2024-25\n→ Math     → Room 103"]
    end

    subgraph ui["What user sees on Subjects & rooms"]
        R1["[Physics – Room 101]"]
        R2["[Chemistry – Room 102]"]
        R3["[Math – Room 103]"]
    end

    C --> Stream
    C --> Session
    Stream --> alloc
    Session --> alloc
    A1 --> R1
    A2 --> R2
    A3 --> R3
```

---

## 4. Terminology at a glance

```mermaid
flowchart LR
    subgraph setup_term["In Setup"]
        Dept["Department\n(Science, Arts)"]
        Stream["Stream\n(Biology 11, BSc)\n= 'class' in setup"]
        Session["Session\n(2024-25)"]
        Subject["Subject\n(Physics, Math)"]
        Room["Classroom\n(Room 101)"]
    end

    subgraph lms_term["In LMS"]
        LmsClass["LMS Class\n= Stream + Session + Section\n(running section)"]
        Allocation["Allocation\nStream+Session+Subject+Room"]
    end

    Dept --> Stream
    Stream --> LmsClass
    Session --> LmsClass
    Stream --> Allocation
    Session --> Allocation
    Subject --> Allocation
    Room --> Allocation
    Allocation --> LmsClass
```

---

## 5. When a class has no stream/session vs has allocations

```mermaid
flowchart TB
    Open["Open LMS Class"]

    Open --> Check{"Class has\nStream + Session?"}

    Check -->|No| General["Show: 'Link stream & session'\n+ single General room"]
    Check -->|Yes| Alloc{"Any allocations for\nthis Stream + Session?"}

    Alloc -->|No| General
    Alloc -->|Yes| Cards["Show one card per allocation\n(Subject – Classroom)\n+ optional General"]

    General --> RoomDetail["Room detail:\nAssignments, Tests, etc."]
    Cards --> RoomDetail
```

---

*Rendered example: paste the code blocks into [mermaid.live](https://mermaid.live) or view this file on GitHub.*
