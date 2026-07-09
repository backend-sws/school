/**
 * Student dashboard — static labels, configs, and placeholder content.
 * Config is permission-key–based: use useCan('use_school_student_dashboard') for school-style
 * fields (Class, Roll No, Session); otherwise college default. Backend injects that permission
 * when institution type is school and user has portal.
 */

export type InstitutionType = "school" | "college";

export type QuickInfoStripItem = { key: string; label: string };
export type AcademicFieldItem = { key: string; label: string };

/** Quick info strip: mixed personal + academic for at-a-glance overview (college default) */
export const QUICK_INFO_STRIP_ITEMS: readonly QuickInfoStripItem[] = [
  { key: "university_roll_no", label: "University Roll" },
  { key: "current_semester", label: "Semester" },
  { key: "session_name", label: "Session" },
  { key: "roll_no", label: "College Roll" },
  { key: "category", label: "Category" },
  { key: "dob", label: "Date of Birth" },
  { key: "gender", label: "Gender" },
  { key: "mobile", label: "Mobile" },
];

/** School: Class, Roll No, Session, Category, DOB, Gender, Mobile (no University Roll / Semester / College Roll) */
export const QUICK_INFO_STRIP_ITEMS_SCHOOL: readonly QuickInfoStripItem[] = [
  { key: "stream_name", label: "Class" },
  { key: "roll_no", label: "Roll No" },
  { key: "session_name", label: "Session" },
  { key: "category", label: "Category" },
  { key: "dob", label: "Date of Birth" },
  { key: "gender", label: "Gender" },
  { key: "mobile", label: "Mobile" },
];

/** Guardian & personal card fields */
export const PERSONAL_GUARDIAN_FIELDS = [
  { key: "father_name", label: "Father's Name" },
  { key: "mother_name", label: "Mother's Name" },
  { key: "religion", label: "Religion" },
  { key: "caste", label: "Caste" },
  { key: "blood_group", label: "Blood Group" },
  { key: "aadhar_no", label: "Aadhar No" },
  { key: "abc_no", label: "ABC ID" },
] as const;

/** Academic details — fields NOT already in the quick strip (college default) */
export const ACADEMIC_CURRENT_FIELDS: readonly AcademicFieldItem[] = [
  { key: "stream_name", label: "Programme / Stream" },
  { key: "subject_name", label: "Subject" },
  { key: "college_name", label: "College" },
];

/** School: Class, Subject, Session (school-friendly labels) */
export const ACADEMIC_CURRENT_FIELDS_SCHOOL: readonly AcademicFieldItem[] = [
  { key: "stream_name", label: "Class" },
  { key: "subject_name", label: "Subject" },
  { key: "session_name", label: "Session" },
];

/** Academic identification numbers — shared (Admission Date, Reg No, App No) */
export const ACADEMIC_ID_FIELDS: readonly AcademicFieldItem[] = [
  { key: "admission_date", label: "Admission Date" },
  { key: "reg_no", label: "Reg No" },
  { key: "app_no", label: "App No" },
];

/** Semester roman numerals */
export const SEMESTER_ROMAN = ["I", "II", "III", "IV", "V", "VI"] as const;

/** Previous education row — label and key into last_academic record */
export const PREVIOUS_EDUCATION_META = [
  { label: "Class", key: "class" },
  { label: "Section", key: "section" },
  { label: "Roll", key: "roll_number" },
  { label: "Session", key: "session" },
] as const;

/** Document status badge styles */
export const DOCUMENT_STATUS_CONFIG: Record<
  string,
  { bg: string; text: string; dot: string; border: string }
> = {
  verified: {
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
    text: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
    border: "border-emerald-200 dark:border-emerald-800",
  },
  pending: {
    bg: "bg-amber-50 dark:bg-amber-950/30",
    text: "text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
    border: "border-amber-200 dark:border-amber-800",
  },
  rejected: {
    bg: "bg-red-50 dark:bg-red-950/30",
    text: "text-red-700 dark:text-red-400",
    dot: "bg-red-500",
    border: "border-red-200 dark:border-red-800",
  },
};

/** Card section titles */
export const STUDENT_DASHBOARD_LABELS = {
  guardianCardTitle: "Guardian & Personal",
  academicCardTitle: "Academic Details",
  academicSemesterLabel: "Semester",
  academicPreviousEducationTitle: "Previous Education",
  documentsCardTitle: "Documents",
  documentsEmptyMessage: "No documents uploaded yet.",
  addressesCardTitle: "Contact Addresses",
  addressesEmptyMessage: "No address information available yet.",
  noticeBoardCardTitle: "Important Notices",
  viewDocumentTitle: "View document",
} as const;

/** Static notices (until API-driven) */
export const NOTICE_BOARD_ITEMS = [
  { id: "1", date: "Feb 15, 2026", text: "Semester examination forms are now available.", muted: false },
  { id: "2", date: "Feb 10, 2026", text: "College picnic scheduled for next week.", muted: true },
] as const;

/** Greeting thresholds (hour) */
export const GREETING_HOURS = {
  morningEnd: 12,
  afternoonEnd: 17,
} as const;

export const GREETING_LABELS = {
  morning: "Good morning",
  afternoon: "Good afternoon",
  evening: "Good evening",
} as const;

/** Breadcrumbs for student dashboard page */
export const STUDENT_DASHBOARD_BREADCRUMBS = [
  { title: "Dashboard", href: "/student-portal/dashboard" },
] as const;

/** Labels for dashboard cards — can be overridden per institution type */
export type StudentDashboardLabels = {
  guardianCardTitle: string;
  academicCardTitle: string;
  academicSemesterLabel: string;
  academicPreviousEducationTitle: string;
  documentsCardTitle: string;
  documentsEmptyMessage: string;
  addressesCardTitle: string;
  addressesEmptyMessage: string;
  noticeBoardCardTitle: string;
  viewDocumentTitle: string;
};

export type StudentDashboardConfig = {
  quickInfoStripItems: readonly QuickInfoStripItem[];
  academicCurrentFields: readonly AcademicFieldItem[];
  academicIdFields: readonly AcademicFieldItem[];
  labels: StudentDashboardLabels;
};

/** Resolve dashboard config by type: "school" => Class/Roll/Session; "college" => Programme/Semester/College Roll. */
export function getStudentDashboardConfig(type: InstitutionType): StudentDashboardConfig {
  const isSchool = type === "school";
  return {
    quickInfoStripItems: isSchool ? QUICK_INFO_STRIP_ITEMS_SCHOOL : QUICK_INFO_STRIP_ITEMS,
    academicCurrentFields: isSchool ? ACADEMIC_CURRENT_FIELDS_SCHOOL : ACADEMIC_CURRENT_FIELDS,
    academicIdFields: ACADEMIC_ID_FIELDS,
    labels: { ...STUDENT_DASHBOARD_LABELS },
  };
}
