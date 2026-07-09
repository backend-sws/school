import { BreadcrumbItem } from "@/types";
import { FORM_TYPE } from "@/constants/shared/form";

export const SUPPORT_TICKET_BREADCRUMBS: BreadcrumbItem[] = [
  { title: "Redressal Cell", href: "/grievances" },
  { title: "Support Tickets", href: "/grievances/support-ticket" },
];

export const STUDENT_TICKETS_BREADCRUMBS: BreadcrumbItem[] = [
  { title: "My Portal", href: "/student-portal/dashboard" },
  { title: "My Tickets", href: "/student-portal/tickets" },
];

export const INITIAL_SUPPORT_TICKET_FILTERS = {
  page: 1,
  per_page: 15,
  status: null,
  ticket_no: null,
  priority: null,
  support_for: "All",
  search: "",
  is_read: null,
};

export const SUPPORT_TICKET_COLUMNS = [
  { key: "serial", label: "#" }, // Serial number
  { key: "ticket_id", label: "Ticket Id" },

  { key: "user", label: "User Name" },
  { key: "issue_type", label: "Issue Type" },
  { key: "subject", label: "Subject" },
  { key: "description", label: "Description" },
  { key: "status", label: "Status" },
  { key: "priority", label: "Priority" },
  { key: "created_at", label: "Created on" },

  { key: "action", label: "Actions" },
];

export const STUDENT_SUPPORT_TICKET_COLUMNS = [
  { key: "serial", label: "#" }, // Serial number
  { key: "ticket_id", label: "Ticket Id" },

  { key: "user", label: "User Name" },
  { key: "issue_type", label: "Issue Type" },
  { key: "subject", label: "Subject" },
  { key: "description", label: "Description" },
  { key: "status", label: "Status" },
  { key: "created_at", label: "Created on" },

  { key: "action", label: "Actions" },
];

export const STUDENT_SUPPORT_TICKET_FORM_INITIAL_DATA = {
  support_for: "",
  issue_type: "",
  subject: "",
  description: "",
  attachment: null,
  status: "",
};

export const STUDENT_SUPPORT_TICKET_DIALOG_FORM_LAYOUT = [
  {
    name: "support_for",
    label: "Support For",
    type: FORM_TYPE.DROPDOWN,
    placeholder: "e.g. Certificate, Fee Payment, Admission",
    tooltip: "Category of support this ticket is for. Helps route the ticket to the right team.",
    required: true,
    options: [
      { key: "certificate", text: "Certificate", value: "Certificate" },
      { key: "payment", text: "Fee Payment", value: "Fee Payment" },
      { key: "admission", text: "Admission", value: "Admission" },
    ],
  },
  {
    name: "issue_type",
    label: "Issue Type",
    type: FORM_TYPE.DROPDOWN,
    placeholder: "e.g. General, Fee Payment, Application",
    tooltip: "Type of issue. Enables faster triage and assignment.",
    required: true,
    options: [
      { key: "general", text: "General", value: "General" },
      { key: "feepayment", text: "Fee Payment", value: "Fee Payment" },
      { key: "application", text: "Application", value: "Application" },
    ],
  },
  {
    name: "subject",
    label: "Subject",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. Fee receipt not generated",
    tooltip: "Short summary of the issue. Shown in ticket lists and replies.",
    required: true,
    maxLength: 255,
    className: "col-span-2",
  },
  {
    name: "description",
    label: "Description",
    type: FORM_TYPE.TEXTAREA,
    placeholder: "e.g. I paid on 10 Feb but the receipt is not visible...",
    tooltip: "Detailed description of the issue. Include dates, amounts, or reference numbers if relevant.",
    required: true,
    maxLength: 3000,
    className: "col-span-2",
  },
  {
    name: "attachment",
    label: "Attachment",
    type: FORM_TYPE.FILE,
    placeholder: "e.g. Upload screenshot or document",
    tooltip: "Optional file to support your request. Images, PDF, or Word documents.",
    accept: "image/*,.pdf,.doc,.docx",
    helperText: "Allowed formats: Images, PDF, Word, Excel",
    className: "col-span-2",
  },
];
