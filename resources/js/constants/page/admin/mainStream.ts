import { BreadcrumbItem } from "@/types";
import { FORM_TYPE } from "@/constants/shared/form";

// ── Permission Keys ───────────────────────────────────────────────────
export const MAIN_STREAM_PERMISSIONS = {
  view: "view_main_streams",
  create: "create_main_streams",
  edit: "update_main_streams",
  delete: "delete_main_streams",
} as const;

export const MAIN_STREAM_BREADCRUMBS: BreadcrumbItem[] = [
  { title: "Academic Desk", href: "/organization/sessions" },
  { title: "Main Course Streams", href: "/organization/main-streams" },
];

export const MainStreamTable = [
  { key: "serial", label: "#" },
  { key: "name", label: "Name" },
  { key: "code", label: "Code" },
  { key: "status", label: "Status" },
  { key: "action", label: "Actions" },
];

export const INITIAL_MAIN_STREAM_FILTERS = {
  page: 1,
  per_page: 10,
  search: "",
  search_by: "name",
};

export const MAIN_STREAM_FORM_INITIAL_DATA = {
  name: "",
  code: "",
};

/**
 * Returns institution-type-aware form layout for the MainStreamDialog.
 * Placeholders and tooltips adjust based on the content engine label.
 */
export const getMainStreamFormLayout = (mainStreamLabel: string) => [
  {
    name: "name",
    label: "Name",
    type: FORM_TYPE.TEXT,
    placeholder: mainStreamLabel === "Level"
      ? "e.g. Pre-Primary, Primary, Middle School"
      : mainStreamLabel === "Main Batch"
        ? "e.g. JEE Foundation, NEET Repeater"
        : "e.g. Undergraduate, Postgraduate",
    tooltip: `Name of this ${mainStreamLabel.toLowerCase()}. Used for grouping programs and reporting.`,
    required: true,
    maxLength: 100,
    className: "uppercase",
    lowercase: true,
    permission: "field_main_stream_name",
  },
  {
    name: "code",
    label: "Code",
    type: FORM_TYPE.TEXT,
    placeholder: mainStreamLabel === "Level"
      ? "e.g. PRI, MID, SEC"
      : mainStreamLabel === "Main Batch"
        ? "e.g. JEE, NEET"
        : "e.g. UG, PG",
    tooltip: `Short unique code for this ${mainStreamLabel.toLowerCase()}. Used in institutional reporting and IDs.`,
    required: true,
    maxLength: 20,
    permission: "field_main_stream_code",
  },
];

/** @deprecated Use getMainStreamFormLayout(mainStreamLabel) instead */
export const NOTICE_DIALOG_FORM_LAYOUT = getMainStreamFormLayout("Main Course Stream");

export const MAIN_STREAM_GUIDELINES = [
  "Course streams define the highest level of academic classification (e.g., Undergraduate, Postgraduate).",
  "Each stream must have a standardized identification code used for institutional reporting.",
  "Modifying a stream's status will cascade affecting all nested programs and student enrollments.",
];

