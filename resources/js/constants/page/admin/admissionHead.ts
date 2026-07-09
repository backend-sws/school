import { BreadcrumbItem } from "@/types";
import { FORM_TYPE } from "@/constants/shared/form";
import { LayoutDashboard, UserCheck, CreditCard } from "lucide-react";
import { SEMESTER_OPTIONS, GENDER_OPTIONS, CATEGORY_OPTIONS } from "./common";

export const ADMISSION_HEAD_BREADCRUMBS: BreadcrumbItem[] = [
  { title: "Admission Cell", href: "/admission/applications" },
  { title: "Admission Heads", href: "/admission/manage-course" },
];

export const ADMISSION_STATS_BREADCRUMBS: BreadcrumbItem[] = [
  { title: "Analytics", href: "/admission/stats" },
  { title: "Overview", href: "/admission/stats" },
];

export const INITIAL_MANAGECOURSE_FILTERS = {
  stream_id: null,
  category: "",
  gender: "",
  status: "",
  page: 1,
  per_page: 10,
  search: "",
};

/* =======================
   Table Columns
======================= */
export const MANAGECOURSE_COLUMNS = [
  { key: "serial", label: "#" },
  { key: "for", label: "Type" },
  { key: "title", label: "Admission Head" },
  { key: "stream", label: "Stream" },
  { key: "application_fee", label: "App Fee" },
  { key: "admission_fee", label: "Adm Fee" },
  { key: "category", label: "Category" },
  { key: "board", label: "Board" },
  { key: "gender", label: "Gender" },
  { key: "last_date", label: "Last Date" },
  { key: "subjects", label: "Subjects" },
  { key: "pg_processor", label: "PG" },
  { key: "status", label: "Status" },
  { key: "action", label: "Actions" },
];

/* =======================
   Form Initial Data
======================= */
export const MANAGECOURSE_FORM_INITIAL_DATA = {
  title: "",
  course_for: "new",
  main_stream_id: "",
  stream_id: "",
  session_id: "",
  major_subject_id: "",
  semester: "",
  allow_subject_paper_selection: false,
  subject_paper_categories: [],
  board_criteria: [],
  gender_criteria: [],
  category_criteria: [],
  status: 0,
  has_application_fees: true,
  application_fees: 100,
  payment_gateway: "sabpaisa",
  last_date: "",
  fees: [{ fee_particular_id: "", amount: 0 }],
};


/* =======================
   Dialog Form Layout
======================= */
// export const MANAGECOURSE_DIALOG_FORM_LAYOUT = [
//   {
//     name: "title",
//     label: "Subject",
//     type: FORM_TYPE.DROPDOWN,
//     placeholder: "Enter Subject Name",
//     required: true,
//     disabled: true,
//   },
//   {
//     name: "category_ids",
//     label: "Category",
//     type: FORM_TYPE.MULTI_SELECT,
//     placeholder: "Enter Category Name",
//     optionsKey: "catgeory_id",

//     required: true,
//   },
// ];

export const MANAGECOURSE_DIALOG_FORM_LAYOUT = [
  {
    name: "course_for",
    label: "Course For",
    type: FORM_TYPE.DROPDOWN,
    placeholder: "e.g. New Admission / Re Admission",
    tooltip: "Whether this admission head is for first-time applicants (New) or for students rejoining after a break (Re Admission).",
    options: [
      { text: "New Admission", value: "new", key: "new" },
      { text: "Re Admission", value: "re-admission", key: "re-admission" },
    ],
    required: true,
  },
  {
    name: "title",
    label: "Head Title",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. BA 2024-28",
    tooltip: "Short display name for this admission process (max 30 characters). Shown to students and in lists; keep it concise.",
    required: true,
    maxLength: 30,
  },
  {
    name: "main_stream_id",
    label: "Main Stream",
    type: FORM_TYPE.DROPDOWN,
    placeholder: "e.g. Undergraduate, Postgraduate",
    tooltip: "Top-level course stream. Select this first; it controls which streams and sessions appear in the next dropdowns.",
    optionsKey: "mainStreams",
    searchable: true,
    required: true,
  },
  {
    name: "stream_id",
    label: "Stream",
    type: FORM_TYPE.DROPDOWN,
    placeholder: "e.g. B.A., B.Sc. (Hons)",
    tooltip: "Specific program or stream under the main stream. Required to load sessions and subjects.",
    optionsKey: "streams",
    searchable: true,
    required: true,
  },
  {
    name: "session_id",
    label: "Session",
    type: FORM_TYPE.DROPDOWN,
    placeholder: "e.g. 2024-28",
    tooltip: "Academic session (year range) for this admission. Must match the selected stream.",
    optionsKey: "sessions",
    searchable: true,
    required: true,
  },
  {
    name: "semester",
    label: "Semester",
    type: FORM_TYPE.DROPDOWN,
    placeholder: "e.g. SEM-I",
    tooltip: "Starting semester for this admission (e.g. SEM-I for first semester).",
    required: true,
    options: SEMESTER_OPTIONS,
  },
  {
    name: "major_subject_id",
    label: "Major Subject",
    type: FORM_TYPE.DROPDOWN,
    placeholder: "e.g. Select subject",
    tooltip: "Primary or major subject for this admission head. Used for eligibility and application display.",
    optionsKey: "subjects",
    searchable: true,
    required: true,
  },
  {
    name: "allow_subject_paper_selection",
    label: "Allow Subject Paper Selection",
    type: FORM_TYPE.DROPDOWN,
    placeholder: "e.g. Yes / No",
    tooltip: "If enabled, applicants can choose paper categories (e.g. elective groups) during application. Disable for fixed curricula.",
    required: true,
    options: [
      { key: "yes", value: true, text: "Yes, Enable" },
      { key: "no", value: false, text: "No, Disable" },
    ],
  },
  {
    name: "board_criteria",
    label: "Board",
    type: FORM_TYPE.MULTI_SELECT,
    placeholder: "e.g. CBSE, BSEB",
    tooltip: "Only students from the selected boards (e.g. CBSE, BSEB, ICSE) can apply. Leave as needed for your policy.",
    options: [
      { key: "BSEB", value: "BSEB", text: "BSEB" },
      { key: "CBSE", value: "CBSE", text: "CBSE" },
      { key: "ICSE", value: "ICSE", text: "ICSE" },
    ],
    required: true,
  },
  {
    name: "gender_criteria",
    label: "Gender",
    type: FORM_TYPE.MULTI_SELECT,
    placeholder: "e.g. Male, Female",
    tooltip: "Eligible genders for this admission. Select all that apply; used for reporting and quota rules.",
    options: GENDER_OPTIONS,
    required: true,
  },
  {
    name: "category_criteria",
    label: "Category",
    type: FORM_TYPE.MULTI_SELECT,
    placeholder: "e.g. General, OBC, SC",
    tooltip: "Reservation categories allowed to apply. Select all that are eligible for this head.",
    options: CATEGORY_OPTIONS,
    required: true,
  },
  {
    name: "has_application_fees",
    label: "Has Application Fee",
    type: FORM_TYPE.DROPDOWN,
    placeholder: "e.g. Yes / No",
    tooltip: "Whether applicants must pay a one-time application fee before submitting. No means free application.",
    required: true,
    options: [
      { key: "yes", value: true, text: "Yes, Required" },
      { key: "no", value: false, text: "No, Free" },
    ],
  },
  {
    name: "application_fees",
    label: "Application Fee (₹)",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. 100",
    tooltip: "Amount in rupees charged as application fee. Only used when Has Application Fee is Yes.",
    required: true,
    maxLength: 10,
  },
  {
    name: "payment_gateway",
    label: "Payment Processor",
    type: FORM_TYPE.DROPDOWN,
    placeholder: "e.g. SabPaisa",
    tooltip: "Gateway through which application fee is collected. Must be configured in college settings.",
    options: [{ text: "SabPaisa", value: "sabpaisa", key: "sabpaisa" }],
    required: true,
  },
  {
    name: "last_date",
    label: "Last Submission Date",
    type: FORM_TYPE.DATE,
    placeholder: "e.g. 30 Jun 2025",
    tooltip: "Deadline for submitting applications. No new or edited submissions after this date.",
    required: true,
  },
  {
    name: "status",
    label: "Status",
    type: FORM_TYPE.DROPDOWN,
    placeholder: "e.g. Draft / Published",
    tooltip: "Draft: not visible to students. Published: open for applications. Unpublished: temporarily off. Archived: cycle over.",
    required: true,
    options: [
      { key: "draft", value: 0, text: "Draft - Configuration phase, not visible to students." },
      { key: "published", value: 1, text: "Published - Active and visible for student applications." },
      { key: "unpublished", value: 2, text: "Unpublished - Temporarily hidden/disabled by Admin." },
      { key: "archived", value: 3, text: "Archived - Process completed or session expired." },
    ],
  },
];

// Reorganized segments for Tabbed Layout (General, Eligibility, Fees & Dates)
export const MANAGECOURSE_SEGMENT_GENERAL = [
  MANAGECOURSE_DIALOG_FORM_LAYOUT[0],  // Course For
  MANAGECOURSE_DIALOG_FORM_LAYOUT[1],  // Head Title
  MANAGECOURSE_DIALOG_FORM_LAYOUT[2],  // Main Stream
  MANAGECOURSE_DIALOG_FORM_LAYOUT[3],  // Stream
  MANAGECOURSE_DIALOG_FORM_LAYOUT[4],  // Session
  MANAGECOURSE_DIALOG_FORM_LAYOUT[5],  // Semester
  MANAGECOURSE_DIALOG_FORM_LAYOUT[6],  // Major Subject
  MANAGECOURSE_DIALOG_FORM_LAYOUT[10], // Category
];

export const MANAGECOURSE_SEGMENT_ELIGIBILITY = [
  MANAGECOURSE_DIALOG_FORM_LAYOUT[7], // Allow Subject Paper Selection
  MANAGECOURSE_DIALOG_FORM_LAYOUT[8], // Board
  MANAGECOURSE_DIALOG_FORM_LAYOUT[9], // Gender
];

export const MANAGECOURSE_SEGMENT_FEES = [
  MANAGECOURSE_DIALOG_FORM_LAYOUT[11], // Has Application Fee
  MANAGECOURSE_DIALOG_FORM_LAYOUT[12], // Application Fee (₹)
  MANAGECOURSE_DIALOG_FORM_LAYOUT[13], // Payment Gateway
  MANAGECOURSE_DIALOG_FORM_LAYOUT[14], // Last Date
  MANAGECOURSE_DIALOG_FORM_LAYOUT[15], // Status
];

export const MANAGECOURSE_TAB_VALIDATION_MAP: Record<string, string[]> = {
  general: [
    "course_for",
    "title",
    "main_stream_id",
    "stream_id",
    "session_id",
    "major_subject_id",
    "semester",
    "category_criteria",
  ],
  eligibility: [
    "allow_subject_paper_selection",
    "board_criteria",
    "gender_criteria",
  ],
  fees: [
    "has_application_fees",
    "application_fees",
    "payment_gateway",
    "last_date",
    "status",
  ],
};

export const MANAGECOURSE_TAB_IDS = {
  GENERAL: "general",
  ELIGIBILITY: "eligibility",
  FEES: "fees",
} as const;

export const ADMISSION_HEAD_STATUS = {
  DRAFT: 0,
  PUBLISHED: 1,
  UNPUBLISHED: 2,
  ARCHIVED: 3,
} as const;

export const ADMISSION_HEAD_STATUS_OPTIONS = [
  {
    label: "Draft",
    value: "0",
    color: "bg-slate-100 text-slate-700 border-slate-200",
  },
  {
    label: "Published",
    value: "1",
    color: "bg-green-100 text-green-700 border-green-200",
  },
  {
    label: "Unpublished",
    value: "2",
    color: "bg-amber-100 text-amber-700 border-amber-200",
  },
  {
    label: "Archived",
    value: "3",
    color: "bg-red-100 text-red-700 border-red-200",
  },
];

export const GENDER_FILTER_OPTIONS = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];

export const CATEGORY_FILTER_OPTIONS = [
  { label: "General", value: "general" },
  { label: "EWS", value: "ews" },
  { label: "SC", value: "sc" },
  { label: "ST", value: "st" },
  { label: "BC-1", value: "bc1" },
  { label: "BC-2", value: "bc2" },
];

export const MANAGECOURSE_TABS = [
  { id: "general", label: "General Info", icon: LayoutDashboard },
  { id: "eligibility", label: "Eligibility", icon: UserCheck },
  { id: "fees", label: "Fees & Dates", icon: CreditCard },
] as const;

export const MANAGE_COURSE_CONDITIONAL_PAPER_SELECTION_FORM_LAYOUT = [];

export const MANAGE_ADMISSION_HEAD_GUIDELINES = [
  "Admission courses function as active portals for student applications and document verification.",
  "Verify that fee structures and core eligibility criteria are finalized before going live.",
  "The application window is strictly enforced based on the configured submission deadline.",
];
