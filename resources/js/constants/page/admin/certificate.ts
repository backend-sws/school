import { FilterOption } from "@/components/filter-bar";
import { BreadcrumbItem } from "@/types";
import { FORM_TYPE } from "@/constants/shared/form";

export const MY_CERTIFICATES_BREADCRUMBS: BreadcrumbItem[] = [
  { title: "My Portal", href: "/student-portal/dashboard" },
  { title: "My Certificates", href: "/student-portal/certificates" },
];

export const INITIAL_CERTIFICATE_FILTERS = {
  page: 1,
  per_page: 10,
};

export const MY_CERTIFICATE_COLUMNS = [
  { key: "serial", label: "#" },
  { key: "application_id", label: "Application Number" },
  { key: "certificate_name", label: "Certification Name" },
  { key: "amount", label: "Amount" },
  { key: "payment_status", label: "Payment Status" },
  { key: "process_status", label: "Process Status" },
  { key: "remarks", label: "Remarks" },
  { key: "submitted_at", label: "Subitted At" },
  { key: "completed_at", label: "Completed At" },
  { key: "actions", label: "Actions" },
];
export const CERTIFICATE_FORM_INITIAL_DATA = {
  purpose: "",
  dob_proof_url: null,

  academic_info: {
    institute_name: "",
    class: "",
    roll_number: "",
  },

  permanent_address: {
    village_mohalla: "",
    post_office: "",
    pincode: "",
  },

  subjects_taken: [],

  custom_data: {}, // ✅ MUST be object
};

export const CERTIFICATE_DIALOG_FORM_LAYOUT = [
  {
    name: "purpose",
    label: "Purpose",
    type: FORM_TYPE.TEXTAREA,
    placeholder: "e.g. Required for higher studies application",
    tooltip: "Reason for requesting this certificate. Used for processing and records.",
    required: true,
    maxLength: 1000,
  },
  {
    name: "dob_proof_url",
    label: "DOB Proof Document",
    type: FORM_TYPE.FILE,
    placeholder: "e.g. Upload DOB certificate or mark sheet",
    tooltip: "Document proving date of birth (e.g. birth certificate, 10th marksheet).",
    required: true,
  },
  {
    type: FORM_TYPE.TITLE,
    label: "Academic Information",
  },
  {
    name: "academic_info.institute_name",
    label: "Institute Name",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. ABC School, Patna",
    tooltip: "Name of the school or institute from the previous academic record.",
    required: true,
    maxLength: 200,
  },
  {
    name: "academic_info.class",
    label: "Class",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. 10th, 12th",
    tooltip: "Class or grade from the submitted academic record.",
    required: true,
    maxLength: 20,
  },
  {
    name: "academic_info.roll_number",
    label: "Roll Number",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. 12345",
    tooltip: "Roll number as per the board or institute record.",
    required: true,
    maxLength: 30,
  },
  {
    type: FORM_TYPE.TITLE,
    label: "Permanent Address",
  },
  {
    name: "permanent_address.village_mohalla",
    label: "Village / Mohalla",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. Ward 5, Cityville",
    tooltip: "Village, mohalla, or locality as in official records.",
    required: true,
    maxLength: 150,
  },
  {
    name: "permanent_address.post_office",
    label: "Post Office",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. Cityville S.O",
    tooltip: "Nearest post office name for the address.",
    required: true,
    maxLength: 100,
  },
  {
    name: "permanent_address.pincode",
    label: "Pincode",
    type: FORM_TYPE.NUMBER,
    placeholder: "e.g. 803116",
    tooltip: "6-digit PIN code of the area.",
    required: true,
    maxLength: 6,
  },
];

export const CERTIFICATE_COLUMNS = [
  { key: "serial", label: "#" },
  { key: "title", label: "Title" },
  { key: "description", label: "Description" },
  { key: "fee_amount", label: "Fee Amount" },

  { key: "actions", label: "Actions" },
];

export const CERTIFICATE_RULES_GROUP = [
  {
    name: "certification_instruction",
    label: "Instruction for Certificate",
    type: FORM_TYPE.EDITOR,
    tooltip:
      "Detailed instructions shown to students during certificate application",
  },
  {
    name: "certificate_tc",
    label: "Terms & Conditions for Certificate",
    type: FORM_TYPE.EDITOR,
    tooltip: "Legal terms and conditions for certificate",
  },
];
