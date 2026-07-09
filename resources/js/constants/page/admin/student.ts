import { FilterOption } from "@/components/filter-bar";
import { BreadcrumbItem } from "@/types";
import { FORM_TYPE } from "@/constants/shared/form";
import { FilterParamMapping } from "@/hooks/useSearchfilter";
import { getStudentEditFormDisplayConfig } from "@/constants/scopeTypeDisplay";
import { map, pick, pickBy, omitBy, mapValues, includesValue, groupByProp } from "@/lib/helpers";
import { SEMESTER_OPTIONS } from "./common";

/** Form field names that use scope-type-dependent labels (resolved from scopeTypeDisplay). */
const STUDENT_EDIT_FORM_SCOPE_LABEL_FIELDS: (keyof ReturnType<
  typeof getStudentEditFormDisplayConfig
>["fieldLabels"])[] = [
  "main_stream_id",
  "stream_id",
];

export const STUDENT_DIALOG_FORM_LAYOUT = [
  // Basic Info
  {
    name: "name",
    label: "Student Name",
    placeholder: "e.g. Rahul Kumar",
    maxLength: 100,
    tooltip:
      "Full legal name of the student as per school records or government ID. This name is used for certificates, roll calls, and official correspondence. Ensure spelling and order match official documents.",
    type: FORM_TYPE.TEXT,
    required: true,
  },
  {
    name: "email",
    label: "Email",
    placeholder: "e.g. student@college.ac.in",
    maxLength: 100,
    tooltip:
      "Valid email address used for account login, password reset, and institutional communication. Must be unique across the system. Students receive verification and notices at this address.",
    type: FORM_TYPE.EMAIL,
    required: true,
  },
  {
    name: "mobile",
    label: "Mobile Number",
    placeholder: "e.g. 9876543210",
    maxLength: 10,
    tooltip:
      "Active 10-digit Indian mobile number (starting with 6, 7, 8, or 9). Used for OTP verification, emergency contact, and SMS alerts. Ensure the number is reachable for official communication.",
    type: FORM_TYPE.PHONE_WITH_CODE,
  },

  // Academic Info
  {
    name: "roll_no",
    label: "Roll Number",
    placeholder: "e.g. 2024BSC001",
    maxLength: 20,
    tooltip:
      "Unique roll or enrollment number assigned by the institution for exams, attendance, and result processing. Must match the format used in university or board records.",
    type: FORM_TYPE.TEXT,
  },

  // Personal Details
  {
    name: "dob",
    label: "Date of Birth",
    placeholder: "e.g. dd/mm/yyyy",
    tooltip:
      "Date of birth as per school leaving certificate or government ID. Required for age verification, scholarship eligibility, and statutory compliance. Use the same format as in official documents.",
    type: FORM_TYPE.DATE,
  },
  {
    name: "gender",
    label: "Gender",
    placeholder: "e.g. Male / Female",
    tooltip:
      "Gender of the student as per official records. Used for hostel allocation, sports categories, and demographic reporting. Must align with the option set in admission or university records.",
    type: FORM_TYPE.DROPDOWN,
    optionsKey: "gender",
    required: true,
    options: [
      {
        key: "male",
        value: "Male",
        text: "Male",
      },
      {
        key: "female",
        value: "Female",
        text: "Female",
      },
    ],
  },
  {
    name: "blood_group",
    label: "Blood Group",
    placeholder: "e.g. O+",
    tooltip:
      "Blood group of the student for medical emergencies and health records. Optional but recommended for campus health services and emergency response. Select from standard ABO and Rh types.",
    type: FORM_TYPE.DROPDOWN,
    optionsKey: "blood_group",
    options: [
      {
        key: "a+",
        value: "a+",
        text: "A+",
      },
      {
        key: "a-",
        value: "a-",
        text: "A-",
      },
      {
        key: "b+",
        value: "b+",
        text: "B+",
      },
      {
        key: "ab",
        value: "ab",
        text: "AB",
      },

      {
        key: "b-",
        value: "b-",
        text: "B-",
      },

      {
        key: "o+",
        value: "o+",
        text: "O+",
      },
    ],
  },
  {
    name: "aadhar_no",
    label: "Aadhar Number",
    placeholder: "e.g. 123456789012",
    maxLength: 12,
    tooltip:
      "12-digit Aadhar number (UIDAI) for identity verification and statutory compliance. Optional; if provided, it may be used for scholarship verification and government reporting. Do not include spaces or dashes.",
    type: FORM_TYPE.TEXT,
  },

  // Family Details
  {
    name: "father_name",
    label: "Father Name",
    placeholder: "e.g. Rajesh Kumar",
    maxLength: 100,
    tooltip:
      "Full name of the student's father or legal guardian as per official records. Used for parent-teacher communication, fee correspondence, and scholarship or fee-concession applications.",
    type: FORM_TYPE.TEXT,
  },
  {
    name: "father_mobile",
    label: "Father Mobile",
    placeholder: "e.g. 9876543210",
    maxLength: 10,
    tooltip:
      "Contact number of the father or guardian for emergency and official communication. Should be a valid 10-digit Indian mobile number. Used when the student is unreachable or for fee/parent notices.",
    type: FORM_TYPE.PHONE_WITH_CODE,
  },
  {
    name: "father_qualification",
    label: "Father Qualification",
    placeholder: "e.g. B.A. / M.Sc.",
    maxLength: 50,
    tooltip:
      "Highest educational qualification of the father or guardian (e.g. 10th, 12th, Graduation, Post Graduation). Used for demographic and scholarship eligibility reporting where applicable.",
    type: FORM_TYPE.TEXT,
  },
  {
    name: "father_occupation",
    label: "Father Occupation",
    placeholder: "e.g. Teacher / Business",
    maxLength: 50,
    tooltip:
      "Current occupation or profession of the father or guardian. Helps in fee-concession and scholarship assessment and for institutional demographic records. Keep brief but clear.",
    type: FORM_TYPE.TEXT,
  },
  {
    name: "mother_name",
    label: "Mother Name",
    placeholder: "e.g. Sunita Devi",
    maxLength: 100,
    tooltip:
      "Full name of the student's mother as per official records. Used for identification, scholarship forms, and statutory reporting. Ensure it matches the name on supporting documents when required.",
    type: FORM_TYPE.TEXT,
  },

  // Category Details
  {
    name: "category",
    label: "Category",
    placeholder: "e.g. General / SC / ST",
    tooltip:
      "Reservation or social category as per government norms (General, SC, ST, BC, EWS, etc.). Used for fee structure, scholarship eligibility, and mandatory UGC/state reporting. Must match the category in admission records.",
    type: FORM_TYPE.DROPDOWN,
    optionsKey: "category",
    options: [
      {
        key: "general",
        value: "general",
        text: "General",
      },
      {
        key: "sc",
        value: "sc",
        text: "SC",
      },
      {
        key: "st",
        value: "st",
        text: "ST",
      },
      {
        key: "bc1",
        value: "bc1",
        text: "BC 1",
      },
      {
        key: "bc2",
        value: "bc2",
        text: "BC 2",
      },
      {
        key: "ews",
        value: "ews",
        text: "EWS",
      },
    ],
  },

  {
    name: "caste",
    label: "Caste",
    placeholder: "e.g. As per certificate",
    maxLength: 50,
    tooltip:
      "Caste as mentioned on the student's caste certificate or school records. Required for reservation and fee-concession claims. Leave blank if not applicable or not submitted.",
    type: FORM_TYPE.TEXT,
  },
  {
    name: "nationality",
    label: "Nationality",
    placeholder: "e.g. Indian / NRI",
    tooltip:
      "Nationality of the student (e.g. Indian, NRI). Affects fee structure, eligibility for certain scholarships, and compliance reporting. NRI status may require additional documentation.",
    type: FORM_TYPE.DROPDOWN,
    optionsKey: "nationality",
    options: [
      {
        key: "indian",
        value: "indian",
        text: "Indian",
      },
      {
        key: "nri",
        value: "nri",
        text: "NRI",
      },
    ],
  },

  {
    name: "is_differently_abled",
    label: "Differently Abled",
    tooltip:
      "Select Yes if the student has a documented physical or mental disability (as per PwD guidelines). Used for reservation, fee concession, and accessibility support. May require submission of a valid disability certificate.",
    type: FORM_TYPE.RADIO,
    options: [
      { key: "yes", value: true, text: "Yes" },
      { key: "no", value: false, text: "No" },
    ],
  },


  // Religion
  {
    name: "religion",
    label: "Religion",
    placeholder: "e.g. Hindu / Muslim / Christian",
    tooltip: "Religion of the student.",
    type: "text",
    maxLength: 50,
  },

  // Medical Details
  {
    name: "medical_condition",
    label: "Medical Condition",
    placeholder: "e.g. Asthma, Diabetes (if any)",
    tooltip: "Any pre-existing medical conditions that the institution should be aware of.",
    type: "text",
    maxLength: 255,
    section: "medical_details",
    sectionTitle: "Medical Details",
  },
  {
    name: "allergy",
    label: "Allergies",
    placeholder: "e.g. Peanuts, Penicillin (if any)",
    tooltip: "Any known allergies for emergency response.",
    type: "text",
    maxLength: 255,
    section: "medical_details",
  },
  {
    name: "disability_type",
    label: "Disability Type",
    placeholder: "e.g. Visual Impairment",
    tooltip: "If differently abled, specify the type of disability.",
    type: "text",
    maxLength: 255,
    section: "medical_details",
    dependsOn: "is_differently_abled",
  },

  // Previous Academics
  {
    name: "previous_school_name",
    label: "Previous School/College",
    placeholder: "e.g. Delhi Public School",
    tooltip: "Name of the institution last attended.",
    type: "text",
    maxLength: 255,
    section: "previous_academics",
    sectionTitle: "Previous Academic Records",
  },
  {
    name: "previous_board",
    label: "Previous Board/University",
    placeholder: "e.g. CBSE / State Board",
    tooltip: "Board or University of the last qualifying examination.",
    type: "text",
    maxLength: 255,
    section: "previous_academics",
  },
  {
    name: "previous_marks",
    label: "Previous Marks/Percentage",
    placeholder: "e.g. 85.5",
    tooltip: "Percentage or CGPA obtained in the last examination.",
    type: "number",
    section: "previous_academics",
  },
  {
    name: "previous_roll_no",
    label: "Previous Roll Number",
    placeholder: "e.g. 12345678",
    tooltip: "Roll number of the last qualifying examination.",
    type: "text",
    maxLength: 50,
    section: "previous_academics",
  },
  {
    name: "has_tc",
    label: "Transfer Certificate Submitted?",
    tooltip: "Check if the Transfer Certificate / Migration Certificate has been submitted.",
    type: "checkbox",
    section: "previous_academics",
  },

  // Government IDs
  {
    name: "abc_no",
    label: "ABC ID",
    placeholder: "e.g. 123-456-789",
    tooltip: "Academic Bank of Credits ID.",
    type: "text",
    maxLength: 50,
    section: "government_ids",
    sectionTitle: "Government IDs & Portals",
  },
  {
    name: "apaar_id",
    label: "APAAR ID",
    placeholder: "e.g. 123456789012",
    tooltip: "Automated Permanent Academic Account Registry ID.",
    type: "text",
    maxLength: 50,
    section: "government_ids",
  },
  {
    name: "has_government_portal",
    label: "Registered on Govt Portal?",
    tooltip: "Is the student registered on any state/national scholarship portal?",
    type: "checkbox",
    section: "government_ids",
  },
  {
    name: "government_portal_name",
    label: "Govt Portal Name",
    placeholder: "e.g. NSP / State Portal",
    tooltip: "Name of the government portal if registered.",
    type: "text",
    maxLength: 100,
    section: "government_ids",
    dependsOn: "has_government_portal",
  },

  // Guardian Details
  {
    name: "guardian_snapshot.name",
    label: "Local Guardian Name",
    placeholder: "e.g. Amit Sharma",
    tooltip: "Name of the local guardian if applicable.",
    type: "text",
    maxLength: 255,
    section: "guardian_details",
    sectionTitle: "Guardian Details",
  },
  {
    name: "guardian_snapshot.occupation",
    label: "Guardian Occupation",
    placeholder: "e.g. Engineer",
    tooltip: "Occupation of the guardian.",
    type: "text",
    maxLength: 255,
    section: "guardian_details",
  },
  {
    name: "guardian_snapshot.aadhaar_no",
    label: "Guardian Aadhar Number",
    placeholder: "e.g. 123456789012",
    tooltip: "12-digit Aadhar number of the guardian.",
    type: "text",
    maxLength: 12,
    section: "guardian_details",
  },
  {
    name: "guardian_snapshot.income",
    label: "Family Annual Income",
    placeholder: "e.g. 500000",
    tooltip: "Annual income of the family/guardian.",
    type: "number",
    section: "guardian_details",
  },
  {
    name: "guardian_snapshot.local_guardian.phone",
    label: "Guardian Phone",
    placeholder: "e.g. 9876543210",
    tooltip: "Contact number of the local guardian.",
    type: "phone",
    maxLength: 10,
    section: "guardian_details",
  },
  {
    name: "guardian_snapshot.local_guardian.relationship",
    label: "Relationship with Guardian",
    placeholder: "e.g. Uncle / Aunt",
    tooltip: "Relationship of the student with the local guardian.",
    type: "text",
    maxLength: 100,
    section: "guardian_details",
  },
  // Copy Correspondence to Permanent Address
  {
    name: "copy_correspondence",
    label: "Copy Correspondence Address to Permanent Address",
    tooltip:
      "When checked, all fields from the Correspondence Address section are copied into the Permanent Address section in one click. Use this when both addresses are the same to avoid re-entering data.",
    type: FORM_TYPE.CHECKBOX,
  },

  // Address (Permanent)
  {
    name: "permanent_address.village_mohalla",
    label: "Village/Mohalla",
    placeholder: "e.g. Nehru Nagar",
    maxLength: 100,
    tooltip:
      "Village, locality, or mohalla name for the permanent address as per official records. This is the address used for legal and statutory purposes; ensure it matches proof of address documents.",
    type: FORM_TYPE.TEXT,
    section: "permanent_address",
    sectionTitle: "Permanent Address",
    columnSpan: 1,
  },
  {
    name: "permanent_address.post_office",
    label: "Post Office",
    placeholder: "e.g. Main PO",
    maxLength: 100,
    tooltip:
      "Nearest post office serving the permanent address. Used for postal communication and address verification. Enter the official post office name as per India Post.",
    type: FORM_TYPE.TEXT,
    section: "permanent_address",
    columnSpan: 1,
  },
  {
    name: "permanent_address.police_station",
    label: "Police Station",
    placeholder: "e.g. Kotwali",
    maxLength: 100,
    tooltip:
      "Nearest police station to the permanent address. Required for some statutory and verification purposes. Enter the official name of the police station or thana.",
    type: FORM_TYPE.TEXT,
    section: "permanent_address",
    columnSpan: 1,
  },
  {
    name: "permanent_address.district",
    label: "District",
    placeholder: "e.g. Patna",
    maxLength: 50,
    tooltip:
      "District in which the permanent address is located. Must match the state and pincode. Used for regional reporting and address validation.",
    type: FORM_TYPE.TEXT,
    section: "permanent_address",
    columnSpan: 1,
  },
  {
    name: "permanent_address.state",
    label: "State",
    placeholder: "e.g. Bihar",
    maxLength: 50,
    tooltip:
      "State or Union Territory of the permanent address. Required for official records and must match the pincode. Use full state name as per government records.",
    type: FORM_TYPE.TEXT,
    section: "permanent_address",
    columnSpan: 1,
  },
  {
    name: "permanent_address.pincode",
    label: "Pincode",
    placeholder: "e.g. 800001",
    maxLength: 6,
    tooltip:
      "6-digit Indian pincode (PIN) for the permanent address. Required for postal and statutory records. Must be a valid pincode for the given state and district.",
    type: FORM_TYPE.TEXT,
    section: "permanent_address",
    columnSpan: 1,
  },

  // Address (Correspondence)
  {
    name: "correspondence_address.village_mohalla",
    label: "Village/Mohalla",
    placeholder: "e.g. Campus Hostel Block A",
    maxLength: 100,
    tooltip:
      "Village, locality, or building details for the correspondence address where the student currently receives mail. If same as permanent, use the Copy Address option above.",
    type: FORM_TYPE.TEXT,
    section: "correspondence_address",
    sectionTitle: "Correspondence Address",
    columnSpan: 1,
  },
  {
    name: "correspondence_address.post_office",
    label: "Post Office",
    placeholder: "e.g. College PO",
    maxLength: 100,
    tooltip:
      "Nearest post office for the correspondence address. Used for sending notices, admit cards, and other mail to the student's current location.",
    type: FORM_TYPE.TEXT,
    section: "correspondence_address",
    columnSpan: 1,
  },
  {
    name: "correspondence_address.police_station",
    label: "Police Station",
    placeholder: "e.g. Local PS",
    maxLength: 100,
    tooltip:
      "Nearest police station to the correspondence address. Kept for consistency with permanent address format and for any location-based verification.",
    type: FORM_TYPE.TEXT,
    section: "correspondence_address",
    columnSpan: 1,
  },
  {
    name: "correspondence_address.district",
    label: "District",
    placeholder: "e.g. Patna",
    maxLength: 50,
    tooltip:
      "District for the correspondence address. If the student is at a different location (e.g. hostel), enter the district where they currently reside for mail delivery.",
    type: FORM_TYPE.TEXT,
    section: "correspondence_address",
    columnSpan: 1,
  },
  {
    name: "correspondence_address.state",
    label: "State",
    placeholder: "e.g. Bihar",
    maxLength: 50,
    tooltip:
      "State or Union Territory for the correspondence address. Required for official communication. Must match the pincode entered below.",
    type: FORM_TYPE.TEXT,
    section: "correspondence_address",
    columnSpan: 1,
  },
  {
    name: "correspondence_address.pincode",
    label: "Pincode",
    placeholder: "e.g. 800001",
    maxLength: 6,
    tooltip:
      "6-digit pincode for the correspondence address. Required so that notices and admit cards can be sent to the correct delivery zone.",
    type: FORM_TYPE.TEXT,
    section: "correspondence_address",
    columnSpan: 1,
  },

  // Photo
  // {
  //   name: 'photo_url',
  //   label: 'Student Photo',
  //   tooltip: 'Upload student photo',
  //   type: FORM_TYPE.FILE
  // }
];

export const INITIAL_STUDENT_FILTERS = {
  stream: "all",
  session: "all",
  status: "all",
  email_verified: "all",
  abc_status: "all",
  hostel_status: "all",
  transport_status: "all",
  page: 1,
  perPage: 10,
  searchType: "email",
  search: "",
};

// Filter-to-API param mapping configuration for student list
export const STUDENT_FILTER_MAPPING: FilterParamMapping = {
  stream: { paramName: "stream_id", skipValues: ["all"] },
  session: { paramName: "academic_session_id", skipValues: ["all"] },
  status: { paramName: "status", skipValues: ["all"] },
  email_verified: { paramName: "is_verified", skipValues: ["all"] },
  abc_status: { paramName: "abc_status", skipValues: ["all"] },
  hostel_status: { paramName: "hostel_status", skipValues: ["all"] },
  transport_status: { paramName: "transport_status", skipValues: ["all"] },
};

export const STUDENT_COLUMNS = [
  { key: "serial", label: "#" },
  { key: "reg_no", label: "Reg. No" },
  { key: "roll_no", label: "Roll No" },
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "mobile", label: "Mobile" },
  { key: "stream", label: "Stream / Session" },
  { key: "verification", label: "Verification" },
  { key: "status", label: "Status" },
  { key: "action", label: "Actions" },
];

export const STUDENT_VERIFIED_OPTIONS: FilterOption[] = [
  { value: "all", label: "All Status" },
  { value: "1", label: "Verified" },
  { value: "0", label: "Unverified" },
];

export const STUDENT_STATUS_OPTIONS: FilterOption[] = [
  { value: "all", label: "All Accounts" },
  { value: "1", label: "Active" },
  { value: "0", label: "Inactive" },
];

export const STUDENT_ABC_OPTIONS: FilterOption[] = [
  { value: "all", label: "All Students" },
  { value: "registered", label: "Registered (Govt Portal)" },
  { value: "not_registered", label: "Not Registered" },
];

export const STUDENT_HOSTEL_OPTIONS: FilterOption[] = [
  { value: "all", label: "All Hostel Status" },
  { value: "hostel_active", label: "Hostel User" },
  { value: "no_hostel", label: "Non-Hostel User" },
];

export const STUDENT_TRANSPORT_OPTIONS: FilterOption[] = [
  { value: "all", label: "All Transport Status" },
  { value: "transport_active", label: "Transport User" },
  { value: "no_transport", label: "Non-Transport User" },
];

export const STUDENT_SEARCH_TYPES: FilterOption[] = [
  { value: "email", label: "Email" },
  { value: "mobile", label: "Phone" },
  { value: "name", label: "Name" },
  { value: "reg_no", label: "Registration No." },
];

export const STUDENT_TOOLTIPS = {
  search: "Search students by name, email, mobile number or registration number",
  stream: "Filter students by academic stream",
  session: "Filter students by academic session",
  verification: "Filter by email verification status",
  status: "Filter by account active/inactive status",
};

export const STUDENT_LIST_BREADCRUMBS: BreadcrumbItem[] = [
  { title: "Student Hub", href: "/students" },
  { title: "Student Management", href: "/students/manage" },
];

export const STUDENT_ANALYTICS_BREADCRUMBS: BreadcrumbItem[] = [
  ...STUDENT_LIST_BREADCRUMBS,
  { title: "Analytics", href: "/students/analytics" },
];

export const STUDENT_ANALYTICS_COLUMNS = [
  { key: "serial", label: "#" },
  { key: "main_stream", label: "Main Stream" },
  { key: "stream", label: "Stream / Course" },
  { key: "total_students", label: "Total Student(s)" },
  { key: "unverified_students", label: "Un-Verified" },
  { key: "disabled_students", label: "Disabled*" },
];

export const STUDENT_FORM_INITIAL_DATA = {
  name: "",
  email: "",
  mobile: "",
  reg_no: "",
  main_stream_id: "",
  stream_id: "",
  session_id: "",
  roll_no: "",
  dob: "",
  gender: "",
  blood_group: "",
  aadhar_no: "",
  father_name: "",
  father_mobile: "",
  father_qualification: "",
  father_occupation: "",
  mother_name: "",
  category: "",
  caste: "",
  nationality: "",
  is_differently_abled: false,
  permanent_address: {
    address_line1: "",
    city: "",
    state: "",
    pincode: "",
  },
  correspondence_address: {
    address_line1: "",
    city: "",
    state: "",
    pincode: "",
  },
  copy_correspondence: false,
};

export const STUDENT_ADDITIONAL_FORM_LAYOUT = [
  {
    name: "reg_no",
    label: "Registration No",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. REG2024001",
    maxLength: 30,
    required: true,
    tooltip:
      "Unique registration or enrollment number assigned to the student at admission. Used for identity across fee, exams, and certificates. Must match the format used in your institution's system.",
  },
  {
    name: "main_stream_id",
    label: "Main Stream",
    type: FORM_TYPE.DROPDOWN,
    optionsKey: "main_streams",
    placeholder: "e.g. Under Graduate (UG)",
    required: true,
    tooltip:
      "High-level academic division (e.g. UG, PG, Diploma). Determines which streams and sessions are available next. Select the main stream under which this student is enrolled.",
  },
  {
    name: "stream_id",
    label: "Stream",
    type: FORM_TYPE.DROPDOWN,
    optionsKey: "streams",
    dependsOn: "main_stream_id",
    placeholder: "e.g. B.Sc. (Hons)",
    required: true,
    tooltip:
      "Specific program or course stream under the selected main stream. Options load after main stream is chosen. This drives session and subject options and fee structure.",
  },
  {
    name: "session_id",
    label: "Session",
    type: FORM_TYPE.DROPDOWN,
    optionsKey: "sessions",
    placeholder: "e.g. 2024-2028",
    required: true,
    tooltip:
      "Academic session or batch (e.g. year range) for this stream. Sessions are loaded based on the selected stream. Used for fee cycles, exam batches, and cohort reporting.",
  },
];

// ─── Scope-type-aware form layout (labels from config, keep JSX clean) ─────

/**
 * Returns full student edit form layout with labels resolved for the given scope type.
 * Labels come from scopeTypeDisplay config; use in student edit page so JSX stays clean.
 */
export function getStudentEditFormLayout(scopeType?: string | null) {
  const formConfig = getStudentEditFormDisplayConfig(scopeType);
  const base = [...STUDENT_ADDITIONAL_FORM_LAYOUT, ...STUDENT_DIALOG_FORM_LAYOUT];
  return map(base, (field) => {
    const hasScopeLabel = includesValue(STUDENT_EDIT_FORM_SCOPE_LABEL_FIELDS, field.name);
    if (!hasScopeLabel) return { ...field };
    const label = formConfig.fieldLabels[field.name as keyof typeof formConfig.fieldLabels];
    return label != null ? { ...field, label } : { ...field };
  });
}

// ─── Form layout groups (partition by role; no filter logic in pages) ────────

export const STUDENT_EDIT_FORM_GROUP_KEY = {
  COPY_CHECKBOX_NAME: "copy_correspondence",
  SECTION_PERMANENT: "permanent_address",
  SECTION_CORRESPONDENCE: "correspondence_address",
  SECTION_MEDICAL: "medical_details",
  SECTION_ACADEMICS: "previous_academics",
  SECTION_GOVT_IDS: "government_ids",
  SECTION_GUARDIAN: "guardian_details",
} as const;

type FormLayoutField = ReturnType<typeof getStudentEditFormLayout>[number];

function getFormLayoutGroupKey(field: FormLayoutField): "basic" | "copyCheckbox" | "permanent_address" | "correspondence_address" | "medical_details" | "previous_academics" | "government_ids" | "guardian_details" {
  if (field.name === STUDENT_EDIT_FORM_GROUP_KEY.COPY_CHECKBOX_NAME) return "copyCheckbox";
  const section = (field as { section?: string }).section;
  if (section === STUDENT_EDIT_FORM_GROUP_KEY.SECTION_PERMANENT) return "permanent_address";
  if (section === STUDENT_EDIT_FORM_GROUP_KEY.SECTION_CORRESPONDENCE) return "correspondence_address";
  if (section === STUDENT_EDIT_FORM_GROUP_KEY.SECTION_MEDICAL) return "medical_details";
  if (section === STUDENT_EDIT_FORM_GROUP_KEY.SECTION_ACADEMICS) return "previous_academics";
  if (section === STUDENT_EDIT_FORM_GROUP_KEY.SECTION_GOVT_IDS) return "government_ids";
  if (section === STUDENT_EDIT_FORM_GROUP_KEY.SECTION_GUARDIAN) return "guardian_details";
  return "basic";
}

export interface StudentEditFormLayoutGroups {
  basicFields: FormLayoutField[];
  copyCheckboxField: FormLayoutField | undefined;
  permanentAddressFields: FormLayoutField[];
  correspondenceAddressFields: FormLayoutField[];
  medicalFields: FormLayoutField[];
  academicFields: FormLayoutField[];
  govtIdFields: FormLayoutField[];
  guardianFields: FormLayoutField[];
}

/**
 * Returns student edit form layout partitioned into groups. Use in edit page instead of filtering.
 */
export function getStudentEditFormLayoutGroups(scopeType?: string | null): StudentEditFormLayoutGroups {
  const layout = getStudentEditFormLayout(scopeType);
  const grouped = groupByProp(layout, getFormLayoutGroupKey);
  return {
    basicFields: grouped.basic ?? [],
    copyCheckboxField: (grouped.copyCheckbox ?? [])[0],
    permanentAddressFields: grouped.permanent_address ?? [],
    correspondenceAddressFields: grouped.correspondence_address ?? [],
    medicalFields: grouped.medical_details ?? [],
    academicFields: grouped.previous_academics ?? [],
    govtIdFields: grouped.government_ids ?? [],
    guardianFields: grouped.guardian_details ?? [],
  };
}

// ─── Edit form payload (API shape in one place) ─────────────────────────────

/** Top-level keys sent in student update payload. */
export const STUDENT_EDIT_PAYLOAD_TOP_KEYS = [
  "name",
  "email",
  "mobile",
  "reg_no",
  "photo_url",
] as const;

/** Keys nested under student_profile in update payload. */
export const STUDENT_EDIT_PAYLOAD_PROFILE_KEYS = [
  "stream_id",
  "session_id",
  "roll_no",
  "dob",
  "gender",
  "blood_group",
  "aadhar_no",
  "father_name",
  "father_mobile",
  "father_qualification",
  "father_occupation",
  "mother_name",
  "category",
  "caste",
  "religion",
  "nationality",
  "is_differently_abled",
  "disability_type",
  "medical_condition",
  "allergy",
  "abc_no",
  "apaar_id",
  "has_government_portal",
  "government_portal_name",
  "previous_school_name",
  "previous_board",
  "previous_marks",
  "previous_roll_no",
  "has_tc",
  "guardian_snapshot",
  "permanent_address",
  "correspondence_address",
] as const;

const ADDRESS_KEYS = ["permanent_address", "correspondence_address"] as const;

/** Normalize address field: use value if plain object, else {}. */
function normalizeAddressVal(val: unknown): Record<string, unknown> {
  return val != null && typeof val === "object" && !Array.isArray(val) ? (val as Record<string, unknown>) : {};
}

/**
 * Builds the API payload from student edit form data. Keeps payload shape in config.
 */
export function buildStudentEditPayload(formData: Record<string, unknown>): Record<string, unknown> {
  const top = pickBy(pick(formData, [...STUDENT_EDIT_PAYLOAD_TOP_KEYS]), (v) => v !== undefined) as Record<string, unknown>;
  const pickedProfile = pick(formData, [...STUDENT_EDIT_PAYLOAD_PROFILE_KEYS]);
  const profile = omitBy(
    mapValues(pickedProfile, (val, key) =>
      ADDRESS_KEYS.includes(key as (typeof ADDRESS_KEYS)[number]) ? normalizeAddressVal(val) : val
    ),
    (v) => v === undefined
  ) as Record<string, unknown>;
  const docsObject = (formData.documents ?? {}) as Record<string, string>;
  const documentsArray = Object.entries(docsObject)
      .filter(([, path]) => path)
      .map(([doc_type, path]) => ({ doc_type, path }));

  return { ...top, student_profile: profile, documents: documentsArray };
}
