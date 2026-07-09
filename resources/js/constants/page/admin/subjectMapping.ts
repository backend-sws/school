import { FORM_TYPE } from "@/constants/shared/form";
import { BreadcrumbItem } from "@/types";

export const SUBJECT_CATEGORY_MAPPING_BREADCRUMBS: BreadcrumbItem[] = [
  { title: "Academic Desk", href: "/organization/sessions" },
  { title: "Category Mapping", href: "/organization/subject-category-mapping" },
];


/* =======================
   Initial Filters
======================= */
export const INITIAL_SUBJECT_MAPPING_FILTERS = {
  page: 1,
  per_page: 20,
  search: "",
};

/* =======================
   Table Columns
======================= */
export const SUBJECT_MAPPING_COLUMNS = [
  { key: "serial", label: "#" },
  { key: "name", label: "Subject Name" },
  { key: "code", label: "Code" },
  { key: "status", label: "Status" },
  { key: "category", label: "Category" },
  { key: "action", label: "Actions" },
];

/* =======================
   Form Initial Data
======================= */
export const SUBJECT_MAPPING_FORM_INITIAL_DATA = {
  subject_id: "", // empty string for controlled input
  category_ids: [], // empty array for multi-select
};

/* =======================
   Dialog Form Layout
======================= */
export const SUBJECT_MAPPING_DIALOG_FORM_LAYOUT = [
  {
    name: "subject_id",
    label: "Subject",
    type: FORM_TYPE.DROPDOWN,
    placeholder: "e.g. Select subject",
    tooltip: "Subject to map to one or more categories (e.g. Core, GE). Used for admission and grade sheets.",
    required: true,
  },
  {
    name: "category_ids",
    label: "Category",
    type: FORM_TYPE.MULTI_SELECT,
    optionsKey: "catgeory_id",
    placeholder: "e.g. Select categories",
    tooltip: "One or more subject categories this subject belongs to. Affects how it appears in admission and results.",
    required: true,
  },
];

export const SUBJECT_CATEGORY_MAPPING_GUIDELINES = [
  "Establish valid mappings to govern which subjects appear for specific admission courses.",
  "Multi-category mapping allows a single subject to serve different roles across programs.",
  "Accuracy in mapping is vital for the automated validation of student application forms.",
];
