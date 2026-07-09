import { BreadcrumbItem } from "@/types";
import { FORM_TYPE } from "@/constants/shared/form";

export const SUBJECT_BREADCRUMBS: BreadcrumbItem[] = [
  { title: "Academic Desk", href: "/organization/sessions" },
  { title: "Subject Inventory", href: "/organization/subject" },
];

/* =======================
   Initial Filters
======================= */
export const INITIAL_SUBJECT_FILTERS = {
  page: 1,
  per_page: 10,
  stream_id: null,
  subject_group_id: null,
};

/* =======================
   Table Columns
======================= */
export const SUBJECT_COLUMNS = [
  { key: "serial", label: "#" },
  { key: "name", label: "Name" },
  { key: "code", label: "Code" },
  { key: "stream", label: "Stream" },
  { key: "status", label: "Status" },


  { key: "is_practical", label: "Practical" },
  { key: "action", label: "Actions" },
];

/* =======================
   Form Initial Data
======================= */
export const SUBJECT_FORM_INITIAL_DATA = {
  name: "",
  code: "",
  stream_id: "",

  is_practical: false,
};

/* =======================
   Dialog Form Layout
======================= */
export const SUBJECT_DIALOG_FORM_LAYOUT = [
  {
    name: "name",
    label: "Name",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. Geography, Introduction to Programming",
    tooltip: "Full subject name. These are the credit-bearing units in the curriculum.",
    required: true,
    maxLength: 150,
    className: "uppercase",
    lowercase: true,
  },
  {
    name: "code",
    label: "Code",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. GEO-101, CS101",
    tooltip: "Short unique code for the subject. Used in timetables and result processing.",
    required: true,
    maxLength: 30,
    className: "uppercase",
    lowercase: true,
  },
  {
    name: "stream_id",
    label: "Stream",
    type: FORM_TYPE.DROPDOWN,
    placeholder: "e.g. B.Sc. Honors",
    tooltip: "Program or stream this subject belongs to. Filters by main stream when applicable.",
    optionsKey: "streams",
    required: true,
  },

  {
    name: "is_practical",
    label: "Is Practical",
    type: FORM_TYPE.RADIO,
    options: [
      { key: "true", text: "Yes", value: true },
      { key: "false", text: "No", value: false },
    ],
    tooltip: "Whether this subject has a practical/lab component. Affects fee and scheduling.",
  },
];

/* =======================
   Example Payload
======================= */
export const SUBJECT_EXAMPLE_DATA = {
  name: "Geography",
  code: "GEO-101",
  stream_id: 1,
  subject_group_id: 2,
  is_practical: true,
};

export const SUBJECT_GUIDELINES = [
  "Subjects are the fundamental credit-bearing units within the institutional curriculum.",
  "Map subjects to their respective groups to ensure students fulfill elective requirements.",
  "Practical designations automatically trigger laboratory fee components where applicable.",
];

export const SUBJECT_TIP = "Use descriptive subject codes that include the semester (e.g., 'CS-101' for Sem-I) to help students identify their curriculum path quickly.";
