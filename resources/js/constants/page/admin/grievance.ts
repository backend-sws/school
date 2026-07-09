import { BreadcrumbItem } from "@/types";
import { FORM_TYPE } from "@/constants/shared/form";

export const GRIEVANCE_BREADCRUMBS: BreadcrumbItem[] = [
  { title: "Redressal Cell", href: "/grievances" },
  { title: "Grievance Board", href: "/grievances" },
];

export const INITIAL_GRIEVANCE_FILTERS = {
  page: 1,
  per_page: 15,
  status: null,
  ticket_no: null,
  search: "",
  search_by: "name",
};

export const GRIEVANCE_COLUMNS = [
  { key: "serial", label: "#" },
  { key: "ticket_no", label: "Ticket Number" },
  { key: "name", label: "Name" },
  { key: "mobile", label: "Phone" },

  { key: "subject", label: "Subject" },
  { key: "status", label: "Status" },
  { key: "created_at", label: "Posted on" },

  { key: "action", label: "Actions" },
];

export const GRIEVANCE_FORM_INITIAL_DATA = {
  resolution: "",
  status: "",
};

export const GRIEVANCE_DIALOG_FORM_LAYOUT = [
  {
    name: "resolution",
    label: "Resolution",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. Issue was addressed by...",
    tooltip: "Summary of the resolution or action taken. Visible to the complainant and for records.",
    required: true,
    maxLength: 2000,
  },
  {
    name: "status",
    label: "Status",
    type: FORM_TYPE.DROPDOWN,
    placeholder: "e.g. Resolved / Closed",
    tooltip: "Resolved: grievance addressed. Closed: ticket closed (e.g. duplicate or invalid).",
    required: true,
    options: [
      { key: "closed", value: "closed", text: "Closed" },
      { key: "resolved", value: "resolved", text: "Resolved" },
    ],
  },
];
