import { BreadcrumbItem } from "@/types";
import { FORM_TYPE } from "@/constants/shared/form";

export const DEPARTMENT_BREADCRUMBS: BreadcrumbItem[] = [
  { title: "Academic Desk", href: "/organization/sessions" },
  { title: "Departments", href: "/organization/departments" },
];

export const INITIAL_DEPARTMENT_FILTERS = {
  page: 1,
  per_page: 15,
};

export const DEPARTMENT_COLUMNS = [
  { key: "serial", label: "#" },
  { key: "name", label: "Name" },
  { key: "code", label: "Code" },
  { key: "action", label: "Actions" },
];

export const DEPARTMENT_FORM_INITIAL_DATA = {
  name: "",
  code: "",
};

export const DEPARTMENT_GUIDELINES = [
  "Departments represent the core administrative units responsible for academic delivery.",
  "Departmental codes are used as prefixes for subject indexing and faculty assignments.",
];

export const DEPARTMENT_TIP = "Use standard short codes (e.g., 'PHY', 'MATH') to keep generated subject codes professional and easy to read.";

export const DEPARTMENT_DIALOG_FORM_LAYOUT = [
  {
    name: "name",
    label: "Name",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. Mathematics, Computer Science",
    tooltip: "Full name of the department. Used for display and reporting.",
    required: true,
    maxLength: 100,
    className: "uppercase",
    lowercase: true,
  },
  {
    name: "code",
    label: "Code",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. MATH, CSE",
    tooltip: "Short unique code for the department. Used in subject codes and faculty assignments.",
    required: true,
    maxLength: 20,
    className: "uppercase",
    lowercase: true,
  },
];
