import { BreadcrumbItem } from "@/types";

export const EXAM_BASE_BREADCRUMBS: BreadcrumbItem[] = [
  { title: "Examination", href: "#" },
];

export const EXAM_LIST_BREADCRUMBS: BreadcrumbItem[] = [
  ...EXAM_BASE_BREADCRUMBS,
  { title: "Exams", href: "/examination/exams" },
];

export const SCHEDULE_LIST_BREADCRUMBS: BreadcrumbItem[] = [
  ...EXAM_BASE_BREADCRUMBS,
  { title: "Schedules", href: "/examination/schedules" },
];

export const GRADING_SCALES_BREADCRUMBS: BreadcrumbItem[] = [
  ...EXAM_BASE_BREADCRUMBS,
  { title: "Grading Scales", href: "/examination/grading-scales" },
];

export const STUDENT_PORTAL_BREADCRUMBS: BreadcrumbItem[] = [
  { title: "Student Portal", href: "#" },
];
