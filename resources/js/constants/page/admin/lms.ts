import type { BreadcrumbItem, AsyncSelectConfig } from "@/types";
import { FORM_TYPE } from "@/constants/shared/form";
import type { LucideIcon } from "lucide-react";
import {
  Megaphone,
  ClipboardList,
  BookOpen,
  Video,
  Film,
  FileText,
  Users,
} from "lucide-react";
import StreamApi from "@/lib/api/streamApi";
import DepartmentApi from "@/lib/api/departmentApi";
import SubjectApi from "@/lib/api/subjectApi";
import SessionApi from "@/lib/api/sessionApi";
import UserApi from "@/lib/api/userApi";
import { StreamQueryKeys } from "@/lib/querykey/stream";
import { DepartmentQueryKeys } from "@/lib/querykey/department";
import { SubjectQueryKeys } from "@/lib/querykey/subject";
import { SessionQueryKeys } from "@/lib/querykey/session";
import { UserQueryKeys } from "@/lib/querykey/user";



export const LMS_COURSES_BREADCRUMBS: BreadcrumbItem[] = [
  { title: "Academic Desk", href: "/lms/courses" },
  { title: "Courses", href: "/lms/courses" },
];

export const LMS_CLASSES_BREADCRUMBS: BreadcrumbItem[] = [
  { title: "Academic Desk", href: "/lms/classes" },
  { title: "Classrooms", href: "/lms/classes" },
];

export const LMS_GUIDELINES = [
  "Manage learning courses and class–subject allocations (sections and activities).",
  "Courses can be scoped by stream, department, session, or global. Classrooms are running sections; allocations assign a subject and optional instructor to a stream + session.",
];

export const LMS_COURSES_GUIDELINES = [
  "Create and edit LMS courses. Set scope (global, stream, department, or session) and optionally link to a class (stream), subject, and academic session.",
  "Slug is auto-generated from title; must be unique per institution.",
];

export const LMS_CLASSES_GUIDELINES = [
  "Classrooms are running sections (e.g. Section A, B) under a stream and session. Each classroom can have many subjects and content (assignments, tests, live sessions, recordings).",
  "Select a stream to see its classrooms; open a classroom to manage subjects, class teacher, students, and activities.",
];

export const LMS_TIP = "Set 'Scope' to Global for generic study materials that all students can access, regardless of their stream or semester.";

export const LMS_SCOPE_TYPE_OPTIONS = [
  { key: "global", text: "Global (whole institution)", value: "global" },
  { key: "stream", text: "Stream / Class", value: "stream" },
  { key: "department", text: "Department", value: "department" },
  { key: "session", text: "Academic Session", value: "session" },
];

export const LMS_COURSE_STATUS_OPTIONS = [
  { key: "draft", text: "Draft", value: 0 },
  { key: "active", text: "Active", value: 1 },
  { key: "archived", text: "Archived", value: 2 },
];

// ─── Async select configs for course dialog ──────────────────────────────────
const STREAM_ASYNC_CONFIG: AsyncSelectConfig = {
  queryFn: (params) => StreamApi.index(params),
  queryKey: StreamQueryKeys.all,
  labelKey: "name",
  valueKey: "id",
};

const DEPARTMENT_ASYNC_CONFIG: AsyncSelectConfig = {
  queryFn: (params) => DepartmentApi.getDepartment(params),
  queryKey: DepartmentQueryKeys.all,
  labelKey: "name",
  valueKey: "id",
};

const SUBJECT_ASYNC_CONFIG: AsyncSelectConfig = {
  queryFn: (params) => SubjectApi.index(params),
  queryKey: SubjectQueryKeys.all,
  labelKey: "name",
  valueKey: "id",
};

const SESSION_ASYNC_CONFIG: AsyncSelectConfig = {
  queryFn: (params) => SessionApi.getSessionsWithParams(params),
  queryKey: SessionQueryKeys.all,
  labelKey: "name",
  valueKey: "id",
};

const INSTRUCTOR_ASYNC_CONFIG: AsyncSelectConfig = {
  queryFn: (params) => UserApi.getUser({ ...params, role: "staff" }),
  queryKey: UserQueryKeys.all,
  labelKey: "name",
  valueKey: "id",
  extraParams: { role: "staff" },
};

// ─── Course dialog form (config-based; asyncConfig provides data for async fields) ───
export const LMS_COURSE_FORM_INITIAL = {
  scope_type: "global" as string,
  scope_id: null as number | null,
  stream_id: null as number | null,
  department_id: null as number | null,
  subject_id: null as number | null,
  session_id: null as number | null,
  title: "",
  slug: "",
  description: "",
  status: 1 as number,
  instructor_id: null as number | null,
};

export const LMS_COURSE_DIALOG_FORM_LAYOUT = [
  { name: "title", label: "Title", type: FORM_TYPE.TEXT, placeholder: "e.g. Introduction to Mathematics", required: true, maxLength: 200, tooltip: "Course title. Slug is auto-generated from this (e.g. introduction-to-mathematics). Must be unique per institution." },
  { name: "slug", label: "Slug", type: FORM_TYPE.TEXT, placeholder: "e.g. intro-math-101", maxLength: 220, tooltip: "Optional. URL-friendly identifier. If left blank, generated from title. Must be unique per institution." },
  { name: "scope_type", label: "Scope", type: FORM_TYPE.SELECT, placeholder: "e.g. Global", required: true, options: LMS_SCOPE_TYPE_OPTIONS, tooltip: "Who can see this course: Global = whole institution; Stream/Department/Session = only when viewing that context." },
  { name: "stream_id", label: "Class (Stream)", type: FORM_TYPE.ASYNC_SELECT, placeholder: "e.g. Class 10", asyncConfig: STREAM_ASYNC_CONFIG, tooltip: "Optional. Link course to a stream/class (e.g. B.Sc. 1st year). When Scope = Stream, this sets visibility scope." },
  { name: "department_id", label: "Department", type: FORM_TYPE.ASYNC_SELECT, placeholder: "e.g. Science", asyncConfig: DEPARTMENT_ASYNC_CONFIG, tooltip: "Optional. When Scope = Department, select department for visibility. Otherwise for display only." },
  { name: "subject_id", label: "Subject", type: FORM_TYPE.ASYNC_SELECT, placeholder: "e.g. Mathematics", asyncConfig: SUBJECT_ASYNC_CONFIG, tooltip: "Optional. Subject this course is for (e.g. Mathematics, Physics)." },
  { name: "session_id", label: "Academic Session", type: FORM_TYPE.ASYNC_SELECT, placeholder: "e.g. 2024-25", asyncConfig: SESSION_ASYNC_CONFIG, tooltip: "Optional. Academic session (e.g. 2024-25). When Scope = Session, this sets visibility scope." },
  { name: "description", label: "Description", type: FORM_TYPE.TEXTAREA, placeholder: "e.g. Covers algebra, calculus, and basic statistics.", rows: 4, maxLength: 5000, tooltip: "Optional course description. Max 5000 characters." },
  { name: "status", label: "Status", type: FORM_TYPE.SELECT, placeholder: "e.g. Active", options: LMS_COURSE_STATUS_OPTIONS, tooltip: "Draft = hidden. Active = visible. Archived = hidden; enrollments remain." },
  { name: "instructor_id", label: "Instructor", type: FORM_TYPE.ASYNC_SELECT, placeholder: "e.g. Select teacher", asyncConfig: INSTRUCTOR_ASYNC_CONFIG, tooltip: "Optional. Primary teacher. Teachers see only courses where they are instructor." },
];

// ─── LMS Class (running section / classroom) dialog form ─────────────────────
// Only necessary fields: stream, session, section, name. Code is auto-generated from name; status defaults to Active.
export const LMS_CLASS_FORM_INITIAL = {
  name: "",
  code: "" as string | null,
  stream_id: null as number | null,
  lms_course_id: null as number | null,
  class_subject_allocation_id: null as number | null,
  session_id: null as number | null,
  section: "" as string | null,
  status: 1 as number,
};

// Create mode: only Name (stream & session from context when opened from stream page). Edit mode: same.
export const LMS_CLASS_DIALOG_FORM_LAYOUT = [
  { name: "name", label: "Name", type: FORM_TYPE.TEXT, placeholder: "e.g. Class XI Science Section A", required: true, maxLength: 200, tooltip: "Display name for this classroom. Code is auto-generated from this." },
];

// ─── Subject detail page tabs (Students tab requires create_lms_classes; filter in component) ───
export const LMS_SUBJECT_DETAIL_TABS: {
  id: "announcements" | "curriculum" | "assessments" | "sessions" | "recordings" | "resources" | "students";
  label: string;
  icon: LucideIcon;
  /** If set, tab is only shown when user has this permission (e.g. create_lms_classes for Students). */
  permissionRequired?: string;
}[] = [
    { id: "announcements", label: "Announcements", icon: Megaphone },
    { id: "curriculum", label: "Curriculum", icon: ClipboardList },
    { id: "assessments", label: "Assessments", icon: BookOpen },
    { id: "sessions", label: "Live Sessions", icon: Video },
    { id: "recordings", label: "Recordings", icon: Film },
    { id: "resources", label: "Resources", icon: FileText },
    { id: "students", label: "Students", icon: Users, permissionRequired: "create_lms_classes" },
  ];
