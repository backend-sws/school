import { BreadcrumbItem } from "@/types";
import { FORM_TYPE } from "@/constants/shared/form";

export const SUBJECT_GROUP_BREADCRUMBS: BreadcrumbItem[] = [
  { title: "Academic Desk", href: "/organization/sessions" },
  { title: "Elective Groups", href: "/organization/subject-groups" },
];

export const INITIAL_SUBJECT_GROUP_FILTERS = {
  page: 1,
  per_page: 15,
};

export const SUBJECT_GROUP_COLUMNS = [
  { key: "serial", label: "#" },
  { key: "name", label: "Name" },
  { key: "code", label: "Code" },
  { key: "action", label: "Actions" },
];

export const SUBJECT_GROUP_FORM_INITIAL_DATA = {
  name: "",
  code: "",
};

export const SUBJECT_GROUP_DIALOG_FORM_LAYOUT = [
  {
    name: "name",
    label: "Name",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. Core Electives, Optional Group A",
    tooltip: "Name of the elective or subject group. Used for student choice and workload rules.",
    required: true,
    maxLength: 100,
    className: "uppercase",
    lowercase: true,
  },
  {
    name: "code",
    label: "Code",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. CE, OPA",
    tooltip: "Short unique code for the group. Required for scheduling and result processing.",
    required: true,
    maxLength: 20,
    className: "uppercase",
    lowercase: true,
  },
];

export const SUBJECT_GROUPS_GUIDELINES = [
  "Elective groups facilitate logical clustering for student choice and workload management.",
  "Groups ensure that subject selection remains within the bounds of program regulations.",
  "A unique group code is mandatory for automated scheduling and result processing.",
];
