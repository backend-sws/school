import type { BreadcrumbItem } from "@/types";

export const ATTENDANCE_BREADCRUMBS: BreadcrumbItem[] = [
  { title: "Attendance Desk", href: "/attendance" },
  { title: "Attendance", href: "/attendance" },
];

export const ATTENDANCE_MARK_BREADCRUMBS: BreadcrumbItem[] = [
  ...ATTENDANCE_BREADCRUMBS,
  { title: "Mark Attendance", href: "/attendance/mark" },
];

export const ATTENDANCE_DAILY_BREADCRUMBS: BreadcrumbItem[] = [
  ...ATTENDANCE_BREADCRUMBS,
  { title: "Daily Register", href: "/attendance/reports/daily" },
];

export const ATTENDANCE_SUMMARY_BREADCRUMBS: BreadcrumbItem[] = [
  ...ATTENDANCE_BREADCRUMBS,
  { title: "Summary & Reports", href: "/attendance/reports/summary" },
];

export const ATTENDANCE_GUIDELINES = [
  "Mark daily attendance at class (root) level or by subject. Class teachers mark whole-class attendance; subject teachers mark per subject.",
  "Use Daily Register to view or export attendance for a class and date. Use Summary for aggregated counts and percentage (e.g. for exam eligibility).",
];

export const ATTENDANCE_MARK_GUIDELINES = [
  "Choose Class (root) for whole-class daily attendance, or By subject to mark per subject.",
  "Select class and date, then set status for each student. Save to record.",
];

export const ATTENDANCE_STATUS_OPTIONS = [
  { value: "present", label: "Present" },
  { value: "absent", label: "Absent" },
  { value: "late", label: "Late" },
  { value: "leave", label: "Leave" },
  { value: "holiday", label: "Holiday" },
] as const;

export const ATTENDANCE_LEVEL_OPTIONS = [
  { value: "class" as const, label: "Class (root)" },
  { value: "subject" as const, label: "By subject" },
];
