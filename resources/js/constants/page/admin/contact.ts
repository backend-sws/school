import { FORM_TYPE } from "@/constants/shared/form";

export const INITIAL_CONTACT_FILTERS = {
  page: 1,
  per_page: 15,
  status: null,
  search: "",
  search_by: "name",
};

export const CONTACT_BREADCRUMBS = [
  { title: "Redressal", href: "/grievances" },
  { title: "Contact Directory", href: "/grievances/contacts" },
];

export const CONTACT_COLUMNS = [
  { key: "serial", label: "#" },
  { key: "name", label: "Name" },
  { key: "email", label: "email" },
  { key: "mobile", label: "Phone" },

  { key: "subject", label: "Subject" },
  { key: "message", label: "Message" },
  { key: "status", label: "Status" },

  { key: "created_at", label: "Posted on" },

  { key: "action", label: "Actions" },
];

export const CONTACT_FORM_INITIAL_DATA = {
  name: "",

  status: "",
  email: "",
  mobile: "",
  subject: "",
  message: "",
  created_at: "",
};
export const CONTACT_DIALOG_FORM_LAYOUT = [
  {
    name: "name",
    label: "Name",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. Sender name",
    tooltip: "Name of the person who submitted the contact form.",
    maxLength: 100,
  },
  {
    name: "email",
    label: "Email",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. user@example.com",
    tooltip: "Email address provided by the sender.",
    maxLength: 100,
  },
  {
    name: "mobile",
    label: "Mobile",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. +91 98765 43210",
    tooltip: "Phone number provided by the sender.",
    maxLength: 20,
  },
  {
    name: "subject",
    label: "Subject",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. Admission query",
    tooltip: "Subject or topic of the contact message.",
    maxLength: 255,
  },
  {
    name: "message",
    label: "Message",
    type: FORM_TYPE.TEXTAREA,
    placeholder: "e.g. Full message from sender",
    tooltip: "Content of the contact form submission.",
    maxLength: 3000,
  },
  {
    name: "resolution",
    label: "Resolution",
    type: FORM_TYPE.TEXTAREA,
    placeholder: "e.g. Replied via email on...",
    tooltip: "Internal note or resolution details. Not shown to the sender.",
    maxLength: 2000,
  },
  {
    name: "status",
    label: "Status",
    type: FORM_TYPE.DROPDOWN,
    placeholder: "e.g. Open / Read",
    tooltip: "Open: not yet handled. Read: viewed or addressed.",
    required: true,
    options: [
      { key: "open", value: "open", text: "Open" },
      { key: "read", value: "read", text: "Read" },
    ],
  },
];
