import { FilterOption } from "@/components/filter-bar";
import { BreadcrumbItem } from "@/types";
import { FORM_TYPE } from "@/constants/shared/form";

export const MY_APPLICATIONS_BREADCRUMBS: BreadcrumbItem[] = [
  { title: "My Portal", href: "/student-portal/dashboard" },
  { title: "My Applications", href: "/student-portal/my-applications" },
];

export const INITIAL_APPLICATION_FILTERS = {
  page: 1,
  per_page: 10,
  target_type: "all",
};

export const APPLICATION_COLUMNS = [
  { key: "serial", label: "#" },
  { key: "application_no", label: "Application Number" },
  { key: "applied_for", label: "Applied For" },
  { key: "session", label: "Session" },
  { key: "semester", label: "Semester" },
  { key: "admission_head", label: "Admission Head" },
  { key: "payment_status", label: "payment Status" },
  { key: "process_status", label: "Process Status" },
  { key: "submitted_at", label: "Submitted At" },

  { key: "actions", label: "Actions" },
];
