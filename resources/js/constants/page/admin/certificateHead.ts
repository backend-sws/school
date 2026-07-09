import { BreadcrumbItem } from "@/types";
import { FORM_TYPE } from "@/constants/shared/form";

export const CERTIFICATE_HEAD_BREADCRUMBS: BreadcrumbItem[] = [
  { title: "Certificates", href: "/certificates/applications" },
  { title: "Certificate Heads", href: "/certificates/manage-certificate-head" },
];

export const INITIAL_CERTIFICATEHEAD_FILTERS = {
  page: 1,
  per_page: 15,
  status: null,
  ticket_no: null,
  search: "",
  is_read: null,
};

export const certificate_templates = [
  {
    key: "TLC",
    value: "TLC",
    text: "TLC",
  },
  {
    key: "CHARACTER CERTIFICATE",
    value: "CHARACTER CERTIFICATE",
    text: "CHARACTER CERTIFICATE",
  },
];
export const CERTIFICATEHEAD_COLUMNS = [
  { key: "serial", label: "#" }, // Serial number

  { key: "title", label: "Certificate Title" },

  { key: "main_stream", label: "Main Stream" },
  // e.g. Under Graduate (UG)

  { key: "stream", label: "Stream" },
  // e.g. BSc (4 Year CBCS System)

  { key: "fee_amount", label: "Fee Amount" },

  { key: "processing_days", label: "Processing Days" },

  { key: "payment_processor", label: "Payment Gateway" },

  { key: "web_certificate_required", label: "Web Certificate Required" },

  { key: "status", label: "Status" },

  { key: "created_at", label: "Created On" },

  { key: "action", label: "Actions" },
];

export const CERTIFICATEHEAD_FORM_INITIAL_DATA = {
  title: "", // Text input
  description: "", // Text input
  main_stream_id: "", // Dropdown (depends on main_streams)
  stream_id: "", // Dropdown (depends on main_stream_id)
  fee_amount: 0, // Number input
  processing_days: 0, // Number input
  payment_processor: "", // Dropdown
  web_certificate_required: false, // Dropdown with true/false
  certificate_template: "", // Dropdown (certificateTemplates)
  header_image: "", // R2 File path
  status: "1", // Dropdown (default to 'Active')
  custom_fields: [], // Custom fields (from your initial data)
};

export const CERTIFICATEHEAD_DIALOG_FORM_LAYOUT = [
  {
    name: "title",
    label: "Title",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. Migration Certificate, Character Certificate",
    tooltip: "Display name for this certificate type. Shown to students when applying.",
    required: true,
    maxLength: 255,
  },
  {
    name: "description",
    label: "Description",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. Issued for students migrating to another university",
    tooltip: "Brief description of when and why this certificate is issued.",
    maxLength: 500,
  },
  {
    name: "main_stream_id",
    label: "Main Stream",
    type: FORM_TYPE.DROPDOWN,
    optionsKey: "main_streams",
    placeholder: "e.g. Undergraduate",
    tooltip: "Main course stream this certificate type applies to.",
    required: true,
  },
  {
    name: "stream_id",
    label: "Stream",
    type: FORM_TYPE.DROPDOWN,
    optionsKey: "streams",
    dependsOn: "main_stream_id",
    placeholder: "e.g. B.Sc. Honors",
    tooltip: "Program or stream. Options load after main stream is selected.",
    required: true,
  },
  {
    name: "fee_amount",
    label: "Fee Amount",
    type: FORM_TYPE.NUMBER,
    placeholder: "e.g. 200",
    tooltip: "Application fee for this certificate. Use 0 for free certificates.",
  },
  {
    name: "processing_days",
    label: "Processing Days",
    type: FORM_TYPE.NUMBER,
    placeholder: "e.g. 5",
    tooltip: "Expected working days to process the certificate after payment and submission.",
    required: true,
  },
  {
    name: "payment_processor",
    label: "Payment Processor",
    type: FORM_TYPE.DROPDOWN,
    optionsKey: "payment_gateways",
    placeholder: "e.g. Razorpay",
    tooltip: "Payment gateway used to collect the certificate application fee.",
  },
  {
    name: "web_certificate_required",
    label: "Web Certification Required",
    type: FORM_TYPE.DROPDOWN,
    tooltip: "Whether a web-based verification link is required for this certificate type.",
    options: [
      { key: true, value: true, text: "Yes" },
      { key: false, value: false, text: "No" },
    ],
  },
  {
    name: "certificate_template",
    label: "Certificate Template",
    type: FORM_TYPE.DROPDOWN,
    optionsKey: "certificateTemplates",
    placeholder: "e.g. Select a template",
    tooltip: "Layout/template used to generate the certificate document.",
  },
  {
    name: "header_image",
    label: "Header Image",
    type: FORM_TYPE.FILE,
    placeholder: "e.g. Upload logo or letterhead",
    tooltip: "Image shown at the top of the certificate (e.g. college logo, letterhead).",
    required: true,
  },
  {
    name: "status",
    label: "Status",
    type: FORM_TYPE.DROPDOWN,
    required: true,
    options: [
      { key: "active", value: "1", text: "Active" },
      { key: "inactive", value: "0", text: "Inactive" },
    ],
    tooltip: "Inactive certificate types are hidden from students and cannot be applied for.",
  },
];

export const CERTIFICATE_HEAD_GUIDELINES = [
  "Define different types of certificates issued by the institution (e.g., Transfer, Character, Migration).",
  "Set application fees and expected processing durations for each certificate type.",
  "Assign templates and configure custom fields to collect specific data from applicants.",
];

export const CERTIFICATE_HEAD_TIP = "Enable 'Web Certification' for self-verifiable certificates that include a secure validation link for employers or universities.";
