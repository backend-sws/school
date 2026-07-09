import { BreadcrumbItem } from "@/types";
import { FORM_TYPE } from "@/constants/shared/form";
import { generateYearOptions } from "@/lib/utils";

export const SESSION_BREADCRUMBS: BreadcrumbItem[] = [
  { title: "Academic Desk", href: "/organization/sessions" },
  { title: "Academic Sessions", href: "/organization/sessions" },
];

export const SessionTable = [
  { key: "serial", label: "#" },
  { key: "name", label: "Name" },
  { key: "start_year", label: "Start Year" },
  { key: "end_year", label: "End Year" },
  { key: "duration", label: "Duration" },
  { key: "status", label: "Status" },
  //   { key: "is_current", label: "Current" },
  { key: "action", label: "Actions" },
];
export const SESSION_TOOLTIPS = {
  filter: "Filter by Main Stream",
  yearRange: "Filter sessions by year range",
};

export const INITIAL_SESSION_FILTERS = {
  page: 1,
  perPage: 10,
  search: "",
};
export const SESSION_FORM_INITIAL_DATA = {
  start_year: new Date().getFullYear(),
  end_year: new Date().getFullYear() + 4,
};

const YEAR_OPTIONS = generateYearOptions(1900, 2100);

/** Year options for filter dropdowns (includes "All" to clear) - use "__all__" since Radix Select disallows empty string */
export const YEAR_FILTER_ALL = "__all__";
export const YEAR_FILTER_OPTIONS = [
  { value: YEAR_FILTER_ALL, text: "All years", key: "all" },
  ...generateYearOptions(2000, 2030).map((o) => ({ ...o, value: String(o.value) })),
];

export const SESSION_DIALOG_FORM_LAYOUT = [
  {
    name: "start_year",
    label: "Start Year",
    type: FORM_TYPE.DROPDOWN,
    placeholder: "e.g. 2024",
    tooltip: "Academic year when this session begins. Pre-filled from your institution's Academic Calendar setting.",
    options: YEAR_OPTIONS,
    searchable: true,
    editable: true,
    required: true,
  },
  {
    name: "end_year",
    label: "End Year",
    type: FORM_TYPE.DROPDOWN,
    placeholder: "e.g. 2028",
    tooltip: "Academic year when this session ends. Typically start year + program duration.",
    options: YEAR_OPTIONS,
    searchable: true,
    editable: true,
    required: true,
  },
];

export const SESSION_GUIDELINES = [
  "Academic sessions establish the temporal boundary for enrollment and program duration.",
  "Ensure start and end years precisely match the university's academic calendar.",
  "Active sessions are required for generating student IDs and automated roll numbers.",
];

export const SESSION_TIP = "We recommend creating a new session at least one month before the academic year starts to allow for early admissions and roster planning.";
