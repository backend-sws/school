import { FORM_TYPE } from "@/constants/shared/form";

export const INSTITUTION_TYPE_OPTIONS = [
  { key: "school", text: "School", value: "school" },
  { key: "college", text: "College", value: "college" },
  { key: "coaching", text: "Coaching", value: "coaching" },
  { key: "university", text: "University", value: "university" },
] as const;

export const INSTITUTION_FORM_INITIAL_DATA = {
  name: "",
  code: "",
  type: "" as "" | "school" | "college" | "coaching" | "university",
  address: "",
  city: "",
  state: "",
  pincode: "",
  phone: "",
  email: "",
  website: "",
};

export const INSTITUTION_DIALOG_FORM_LAYOUT = [
  {
    name: "name",
    label: "Name",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. Demo Public School",
    tooltip: "Full name of the institution.",
    required: true,
    maxLength: 200,
  },
  {
    name: "code",
    label: "Code",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. DEMOSCH",
    tooltip: "Short unique code for the institution.",
    maxLength: 30,
  },
  {
    name: "type",
    label: "Type",
    type: FORM_TYPE.SELECT,
    placeholder: "Select type",
    options: [...INSTITUTION_TYPE_OPTIONS],
    tooltip: "Institution type: school, college, coaching, or university.",
  },
  {
    name: "address",
    label: "Address",
    type: FORM_TYPE.TEXTAREA,
    placeholder: "Full address",
    rows: 2,
  },
  {
    name: "city",
    label: "City",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. Patna",
    maxLength: 100,
  },
  {
    name: "state",
    label: "State",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. Bihar",
    maxLength: 100,
  },
  {
    name: "pincode",
    label: "Pincode",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. 800001",
    maxLength: 10,
  },
  {
    name: "phone",
    label: "Phone",
    type: FORM_TYPE.PHONE_WITH_CODE,
    placeholder: "Enter phone number",
  },
  {
    name: "email",
    label: "Email",
    type: FORM_TYPE.EMAIL,
    placeholder: "e.g. info@institution.edu",
    maxLength: 150,
  },
  {
    name: "website",
    label: "Website",
    type: FORM_TYPE.URL,
    placeholder: "https://...",
    maxLength: 200,
  },
];

export const INSTITUTION_TABLE_COLUMNS = [
  { key: "serial", label: "#" },
  { key: "name", label: "Name" },
  { key: "code", label: "Code" },
  { key: "type", label: "Type" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "action", label: "Actions" },
];

export const INITIAL_INSTITUTION_FILTERS = {
  page: 1,
  per_page: 15,
  search: "",
  type: "all" as string,
};

export const INSTITUTION_TYPE_FILTER_OPTIONS = [
  { value: "all", label: "All types" },
  ...INSTITUTION_TYPE_OPTIONS.map((o) => ({ value: o.value, label: o.text })),
];
