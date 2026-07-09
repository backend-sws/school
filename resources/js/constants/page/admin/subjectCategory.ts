import { FORM_TYPE } from "@/constants/shared/form";
import { BreadcrumbItem } from "@/types";

export const SUBJECT_CATEGORY_BREADCRUMBS: BreadcrumbItem[] = [
  { title: "Academic Desk", href: "/organization/sessions" },
  { title: "Subject Categories", href: "/organization/subject-category" },
];


export const INITIAL_SUBJECT_CATEGORY_FILTERS = {
  page: 1,
  per_page: 10,
  search: "",
};

export const SUBJECT_CATEGORY_COLUMNS = [
  { key: "serial", label: "#" },
  { key: "name", label: "Name" },
  { key: "code", label: "Code" },
  { key: "action", label: "Actions" },
];

export const SUBJECT_CATEGORY_FORM_INITIAL_DATA = {
  name: "",
  code: "",
};

export const SUBJECT_CATEGORY_DIALOG_FORM_LAYOUT = [
  {
    name: "name",
    label: "Name",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. Core, GE, AECC, SEC",
    tooltip: "Classification name (e.g. Core, Generic Elective). Used for university-compliant grade sheets.",
    required: true,
    maxLength: 100,
    className: "uppercase",
    lowercase: true,
  },
  {
    name: "code",
    label: "Code",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. CORE, GE",
    tooltip: "Short unique code for this category. Used in subject mapping and reporting.",
    required: true,
    maxLength: 20,
    className: "uppercase",
    lowercase: true,
  },
];

export const SUBJECT_CATEGORY_GUIDELINES = [
  "Classifications define the functional role of a subject (e.g., Core, GE, AECC, SEC).",
  "These taxonomy labels are critical for generating university-compliant grade sheets.",
  "System-wide updates to classifications will propagate to all historical academic records.",
];
