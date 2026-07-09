import { FORM_TYPE } from "@/constants/shared/form";
import { GENDER_OPTIONS, CATEGORY_OPTIONS, BLOOD_GROUP_OPTIONS } from "@/constants/shared/options";

/** Application type for one-go flow: new student or re-admission */
export type ApplicationDeskType = "new" | "re-admission";

/** Options for application type radio (step 1) */
export const APPLICATION_TYPE_OPTIONS = [
  {
    key: "new",
    value: "new",
    text: "New student",
  },
  {
    key: "re-admission",
    value: "re-admission",
    text: "Re-admission",
  },
] as const;

/** Default form values for the one-go application form */
export const APPLICATION_DESK_FORM_DEFAULT_VALUES = {
  application_type: "new" as ApplicationDeskType,
  student_id: "" as string | number,
  stream_id: "" as string | number,
  applicant_name: "",
  father_name: "",
  mother_name: "",
  dob: "",
  gender: "",
  category: "",
  religion: "",
  nationality: "",
  blood_group: "",
  aadhaar_no: "",
  previous_school_name: "",
  previous_board: "",
  previous_marks: "" as string | number,
  has_government_portal: false,
  government_portal_name: "",
  has_tc: false,
  hostel_required: false,
  hostel_amount: 0,
  mobile: "",
  email: "",
  address_snapshot: {
    correspondence: {} as Record<string, string>,
    permanent: {} as Record<string, string>,
  },
  permanent_address_type: "same" as "same" | "different",
  has_local_guardian: false,
  guardian_snapshot: {
    name: "",
    occupation: "",
    aadhaar_no: "",
    income: 0,
    local_guardian: {
      name: "",
      phone: "",
      relationship: "",
    },
    emergency_contact: {
      name: "",
      relationship: "",
      mobile: "",
      alternate_mobile: "",
    },
  },
  medical_condition: "",
  disability: "",
  allergy: "",
  class_id: "" as string | number,
  section_id: "" as string | number,
  fee_regulation_profile_id: "" as string | number,
  fees: [] as { fee_particular_id: number | string; amount: number; _title?: string }[],
  inventory_items: [] as { item_id: number | string; quantity: number; price: number; _title?: string }[],
  transport_route_id: "" as string | number,
  transport_stop_id: "" as string | number,
  transport_amount: 0,
  discount_amount: 0,
  discount_reason: "",
  cash_amount: 0,
  online_amount: 0,
  online_transaction_id: "",

  documents: {} as Record<string, string>,
};

/** Form field config for Step 1: Application type (used with ControlledFormComponent RADIO) */
export const APPLICATION_TYPE_FIELD = {
  name: "application_type",
  label: "Application type",
  type: FORM_TYPE.RADIO,
  required: true,
  options: APPLICATION_TYPE_OPTIONS as unknown as { key: string; value: string; text: string }[],
  tooltip: "Choose whether this is a first-time admission or re-admission of an existing student.",
};

/** Form fields config for Step 2: Basic application details (one-go flow). Session is not taken from frontend; backend uses current session from model. */
export const APPLICATION_DESK_BASIC_FIELDS = [
  {
    section: "Academic details",
    name: "stream_id",
    label: "Main class",
    type: FORM_TYPE.ASYNC_SELECT,
    placeholder: "Select stream",
    tooltip: "Select main class (e.g. Primary, Senior Secondary). Classes will load based on this.",
    required: true,
    permission: "field_application_stream_id",
  },
  {
    section: "Applicant details",
    name: "applicant_name",
    label: "Applicant name",
    type: FORM_TYPE.TEXT,
    placeholder: "Full name as in certificates",
    tooltip: "Full name of the student as it appears on academic and identity documents.",
    required: true,
    maxLength: 150,
    permission: "field_application_applicant_name",
  },
  {
    name: "father_name",
    label: "Father's name",
    type: FORM_TYPE.TEXT,
    placeholder: "Father or guardian name",
    tooltip: "Full name of father or legal guardian as in official records.",
    required: true,
    maxLength: 150,
    permission: "field_application_father_name",
  },
  {
    name: "father_mobile",
    label: "Father's mobile",
    type: FORM_TYPE.PHONE_WITH_CODE,
    placeholder: "Enter father's mobile",
    tooltip: "Contact mobile number of the father.",
    permission: "field_application_father_mobile",
  },
  {
    name: "father_qualification",
    label: "Father's qualification",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. Graduate",
    tooltip: "Educational qualification of the father.",
    maxLength: 100,
    permission: "field_application_father_qualification",
  },
  {
    name: "mother_name",
    label: "Mother's name",
    type: FORM_TYPE.TEXT,
    placeholder: "Mother's name",
    tooltip: "Full name of mother as in official records.",
    required: true,
    maxLength: 150,
    permission: "field_application_mother_name",
  },
  {
    name: "dob",
    label: "Date of birth",
    type: FORM_TYPE.DATE,
    placeholder: "Select date of birth",
    tooltip: "Date of birth as per 10th certificate or birth certificate.",
    required: true,
    permission: "field_application_dob",
  },
  {
    name: "email",
    label: "Email",
    type: FORM_TYPE.EMAIL,
    placeholder: "e.g. applicant@example.com",
    tooltip: "Email address for correspondence.",
    required: true,
    maxLength: 150,
    permission: "field_application_email",
  },
  {
    name: "mobile",
    label: "Mobile number",
    type: FORM_TYPE.PHONE_WITH_CODE,
    placeholder: "Enter phone number",
    tooltip: "Contact mobile number of the applicant or guardian.",
    required: true,
    permission: "field_application_mobile",
  },
  {
    name: "gender",
    label: "Gender",
    type: FORM_TYPE.DROPDOWN,
    placeholder: "Select gender",
    tooltip: "Gender as per official records.",
    required: true,
    options: GENDER_OPTIONS,
    permission: "field_application_gender",
  },
  {
    name: "category",
    label: "Category",
    type: FORM_TYPE.DROPDOWN,
    placeholder: "Select category",
    tooltip: "Reservation category (General, SC, ST, OBC, etc.) as per certificate.",
    options: CATEGORY_OPTIONS,
    permission: "field_application_category",
  },
  {
    name: "caste",
    label: "Caste",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. Sub-caste",
    tooltip: "Specific caste or sub-caste as per records.",
    maxLength: 50,
    permission: "field_application_caste",
  },
  {
    section: "Additional details",
    name: "blood_group",
    label: "Blood group",
    type: FORM_TYPE.DROPDOWN,
    placeholder: "Select blood group",
    tooltip: "Blood group as per medical records.",
    options: BLOOD_GROUP_OPTIONS,
    permission: "field_application_blood_group",
  },
  {
    name: "religion",
    label: "Religion",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. As per records",
    tooltip: "Religion as in official records.",
    maxLength: 50,
    permission: "field_application_religion",
  },
  {
    name: "nationality",
    label: "Nationality",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. Indian",
    tooltip: "Nationality of the applicant.",
    maxLength: 50,
    permission: "field_application_nationality",
  },
  {
    name: "aadhaar_no",
    label: "Aadhaar number",
    type: FORM_TYPE.TEXT,
    placeholder: "12-digit Aadhaar",
    tooltip: "Student's 12-digit Aadhaar number for identity verification.",
    maxLength: 12,
    permission: "field_application_aadhaar_no",
  },
  {
    name: "abc_id",
    label: "ABC ID",
    type: FORM_TYPE.TEXT,
    placeholder: "Enter ABC ID",
    tooltip: "Academic Bank of Credits ID.",
    maxLength: 50,
    permission: "field_application_abc_id",
  },
  {
    name: "apaar_id",
    label: "APAAR ID",
    type: FORM_TYPE.TEXT,
    placeholder: "Enter APAAR ID",
    tooltip: "Automated Permanent Academic Account Registry ID.",
    maxLength: 50,
    permission: "field_application_apaar_id",
  },
];

/** Previous school fields for the Academic step */
export const APPLICATION_DESK_PREVIOUS_SCHOOL_FIELDS = [
  {
    name: "previous_school_name",
    label: "Previous school name",
    type: FORM_TYPE.TEXT,
    placeholder: "Name of last school attended",
    tooltip: "Previous school or institution name.",
    maxLength: 200,
    className: "md:col-span-2",
    permission: "field_application_previous_school",
  },
  {
    name: "previous_board",
    label: "Previous board",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. CBSE, ICSE, State Board",
    tooltip: "Board of examination from previous school.",
    maxLength: 100,
    permission: "field_application_previous_board",
  },
  {
    name: "previous_marks",
    label: "Previous marks / percentage",
    type: FORM_TYPE.NUMBER_TEXT,
    placeholder: "e.g. 85",
    tooltip: "Marks or percentage obtained in the last qualifying exam.",
    maxLength: 10,
    permission: "field_application_previous_marks",
  },
];

/** Checkbox: has government portal (shows portal name field when checked) */
export const HAS_GOVERNMENT_PORTAL_FIELD = {
  name: "has_government_portal" as const,
  label: "Government portal",
  type: FORM_TYPE.CHECKBOX,
  tooltip: "Tick if the student is registered on a government education portal.",
  options: [{ key: "has_government_portal", value: true, text: "Registered on government portal" }],
  permission: "field_application_government_portal",
};

/** Government portal name field (shown when has_government_portal is true) */
export const GOVERNMENT_PORTAL_NAME_FIELD = {
  name: "government_portal_name" as const,
  label: "Government portal name",
  type: FORM_TYPE.TEXT,
  placeholder: "e.g. UDISE+, Samagra, MIS",
  tooltip: "Name of the government portal where the student is registered.",
  maxLength: 200,
  className: "md:col-span-2",
  permission: "field_application_government_portal_name",
};

/** Address snapshot keys for address panel (key-only; use APPLICATION_DESK_ADDRESS_FIELDS for form config) */
export const APPLICATION_DESK_ADDRESS_KEYS = [
  { name: "line1", label: "Address line 1", placeholder: "Street, area" },
  { name: "line2", label: "Address line 2", placeholder: "Landmark (optional)" },
  { name: "city", label: "City", placeholder: "City" },
  { name: "state", label: "State", placeholder: "State" },
  { name: "pincode", label: "Pincode", placeholder: "Pincode" },
] as const;

/** Shared address field definitions (used to build correspondence and permanent) */
const ADDRESS_FIELD_BASE = [
  {
    name: "line1",
    label: "Address line 1",
    type: FORM_TYPE.TEXT,
    placeholder: "Street, area" as const,
    tooltip: "Street name, locality, or area. Used for correspondence and student profile.",
    maxLength: 255,
    permission: "field_application_addr_line1",
  },
  {
    name: "line2",
    label: "Address line 2",
    type: FORM_TYPE.TEXT,
    placeholder: "Landmark (optional)" as const,
    tooltip: "Landmark or additional address detail (e.g. near temple, house no.). Optional.",
    maxLength: 255,
    permission: "field_application_addr_line2",
  },
  {
    name: "city",
    label: "City",
    type: FORM_TYPE.TEXT,
    placeholder: "City" as const,
    tooltip: "City or town. Used in student profile and certificates.",
    maxLength: 100,
    permission: "field_application_addr_city",
  },
  {
    name: "state",
    label: "State",
    type: FORM_TYPE.TEXT,
    placeholder: "State" as const,
    tooltip: "State or union territory. As per official address proof.",
    maxLength: 100,
    permission: "field_application_addr_state",
  },
  {
    name: "pincode",
    label: "Pincode",
    type: FORM_TYPE.TEXT,
    placeholder: "6-digit Pincode" as const,
    tooltip: "Postal index number (6 digits). Used for address verification.",
    maxLength: 6,
    className: "md:col-span-2",
    permission: "field_application_addr_pincode",
  },
] as const;

/** Form config for correspondence address (use with ControlledFormComponent) */
export const APPLICATION_DESK_CORRESPONDENCE_ADDRESS_FIELDS = ADDRESS_FIELD_BASE.map((f) => ({
  ...f,
  name: `address_snapshot.correspondence.${f.name}` as const,
})) as { name: `address_snapshot.correspondence.${string}`; label: string; type: string; placeholder: string; tooltip: string; maxLength: number }[];

/** Form config for permanent address (use with ControlledFormComponent) */
export const APPLICATION_DESK_PERMANENT_ADDRESS_FIELDS = ADDRESS_FIELD_BASE.map((f) => ({
  ...f,
  name: `address_snapshot.permanent.${f.name}` as const,
})) as { name: `address_snapshot.permanent.${string}`; label: string; type: string; placeholder: string; tooltip: string; maxLength: number; className?: string }[];

/** Event-based options: same = sync permanent with correspondence; different = enter permanent address separately */
export const PERMANENT_ADDRESS_TYPE_OPTIONS = [
  { key: "same", value: "same", text: "Same as correspondence address" },
  { key: "different", value: "different", text: "Different permanent address" },
] as const;

/** Radio field for permanent address type (drives sync vs manual entry) */
export const PERMANENT_ADDRESS_TYPE_FIELD = {
  name: "permanent_address_type" as const,
  label: "Permanent address",
  type: FORM_TYPE.RADIO,
  tooltip: "Choose whether permanent address is same as correspondence or enter it separately.",
  options: [...PERMANENT_ADDRESS_TYPE_OPTIONS],
  className: "md:col-span-2",
};

/** @deprecated Use APPLICATION_DESK_CORRESPONDENCE_ADDRESS_FIELDS and APPLICATION_DESK_PERMANENT_ADDRESS_FIELDS */
export const APPLICATION_DESK_ADDRESS_FIELDS = APPLICATION_DESK_CORRESPONDENCE_ADDRESS_FIELDS;

/** Guardian snapshot keys (key-only; use APPLICATION_DESK_GUARDIAN_FIELDS for form config) */
export const APPLICATION_DESK_GUARDIAN_KEYS = [
  { name: "name", label: "Name", placeholder: "Guardian full name" },
  { name: "occupation", label: "Occupation", placeholder: "e.g. Business, Service" },
  { name: "aadhaar_no", label: "Aadhaar number", placeholder: "12-digit Aadhaar" },
  { name: "income", label: "Annual income", placeholder: "Approximate annual income" },
] as const;

/** Form config for guardian fields (Guardian details section) */
export const APPLICATION_DESK_GUARDIAN_FIELDS = [
  {
    name: "guardian_snapshot.name",
    label: "Name",
    type: FORM_TYPE.TEXT,
    placeholder: "Guardian full name" as const,
    tooltip: "Full name of father, mother, or legal guardian. Used in student profile and certificates.",
    maxLength: 150,
    permission: "field_application_guardian_name",
  },
  {
    name: "guardian_snapshot.occupation",
    label: "Occupation",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. Business, Service" as const,
    tooltip: "Guardian's occupation (e.g. Business, Government service, Private job). For records only.",
    maxLength: 100,
    permission: "field_application_guardian_occupation",
  },
  {
    name: "guardian_snapshot.aadhaar_no",
    label: "Aadhaar number",
    type: FORM_TYPE.TEXT,
    placeholder: "12-digit Aadhaar" as const,
    tooltip: "Guardian's 12-digit Aadhaar number. Optional.",
    maxLength: 12,
    permission: "field_application_guardian_aadhaar",
  },
  {
    name: "guardian_snapshot.income",
    label: "Annual income (₹)",
    type: FORM_TYPE.NUMBER_TEXT,
    placeholder: "Approximate annual income" as const,
    tooltip: "Approximate annual family income. Used for fee waiver or scholarship eligibility if applicable.",
    maxLength: 10,
    permission: "field_application_guardian_income",
  },
] as const;

/** Checkbox: has local guardian (shows local guardian fields when checked) */
export const HAS_LOCAL_GUARDIAN_FIELD = {
  name: "has_local_guardian" as const,
  label: "Local guardian",
  type: FORM_TYPE.CHECKBOX,
  tooltip: "Tick if there is a local guardian (e.g. relative in city) for emergencies or local contact.",
  options: [{ key: "has_local_guardian", value: true, text: "Has local guardian" }],
};

/** Form config for local guardian (when has local guardian is checked) */
export const APPLICATION_DESK_LOCAL_GUARDIAN_FIELDS = [
  {
    name: "guardian_snapshot.local_guardian.name",
    label: "Name",
    type: FORM_TYPE.TEXT,
    placeholder: "Local guardian full name",
    tooltip: "Full name of the local guardian.",
    maxLength: 150,
    permission: "field_application_local_guardian_name",
  },
  {
    name: "guardian_snapshot.local_guardian.phone",
    label: "Phone",
    type: FORM_TYPE.PHONE_WITH_CODE,
    placeholder: "Enter phone number",
    tooltip: "Contact number of local guardian.",
    permission: "field_application_local_guardian_phone",
  },
  {
    name: "guardian_snapshot.local_guardian.relationship",
    label: "Relationship",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. Uncle, Aunt, Family friend",
    tooltip: "Relationship with the applicant.",
    maxLength: 50,
    permission: "field_application_local_guardian_rel",
  },
] as const;

/** Form config for emergency contact */
export const APPLICATION_DESK_EMERGENCY_CONTACT_FIELDS = [
  {
    name: "guardian_snapshot.emergency_contact.name",
    label: "Name",
    type: FORM_TYPE.TEXT,
    placeholder: "Contact person full name",
    tooltip: "Person to contact in case of emergency.",
    maxLength: 150,
    permission: "field_application_emergency_name",
  },
  {
    name: "guardian_snapshot.emergency_contact.relationship",
    label: "Relationship",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. Father, Mother, Guardian",
    tooltip: "Relationship with the applicant.",
    maxLength: 50,
    permission: "field_application_emergency_rel",
  },
  {
    name: "guardian_snapshot.emergency_contact.mobile",
    label: "Mobile",
    type: FORM_TYPE.PHONE_WITH_CODE,
    placeholder: "Enter phone number",
    tooltip: "Primary emergency contact number.",
    permission: "field_application_emergency_mobile",
  },
  {
    name: "guardian_snapshot.emergency_contact.alternate_mobile",
    label: "Alternate mobile",
    type: FORM_TYPE.PHONE_WITH_CODE,
    placeholder: "Alternate number",
    tooltip: "Alternate number for emergency contact.",
    permission: "field_application_emergency_alt_mobile",
  },
] as const;

/** Form config for medical info (use with ControlledFormComponent) */
export const APPLICATION_DESK_MEDICAL_FIELDS = [
  {
    name: "medical_condition",
    label: "Medical condition",
    type: FORM_TYPE.TEXT,
    placeholder: "If any" as const,
    maxLength: 200,
    tooltip: "Any known medical condition (e.g. asthma, epilepsy). Leave blank if none. Used for care and emergency planning.",
    permission: "field_application_medical_condition",
  },
  {
    name: "disability",
    label: "Disability",
    type: FORM_TYPE.TEXT,
    placeholder: "If any" as const,
    maxLength: 200,
    tooltip: "Any disability or special needs. Leave blank if none. Helps in providing appropriate support and facilities.",
    permission: "field_application_disability",
  },
  {
    name: "allergy",
    label: "Allergy",
    type: FORM_TYPE.TEXT,
    placeholder: "If any" as const,
    maxLength: 200,
    tooltip: "Known allergies (e.g. food, medicine). Leave blank if none. Important for hostel and medical safety.",
    permission: "field_application_allergy",
  },
] as const;

/** Accepted file types for document upload (PDF and images) */
export const APPLICATION_DESK_DOCUMENT_ACCEPT =
  "application/pdf,image/*,.pdf,.jpg,.jpeg,.png,.gif,.webp";

/** Document types for document upload section (label + tooltip per type) */
export const APPLICATION_DESK_DOCUMENT_TYPES = [
  {
    key: "birth_certificate",
    label: "Birth Certificate",
    tooltip: "Date of birth proof. Required for admission. PDF or image.",
    permission: "field_application_doc_birth_cert",
  },
  {
    key: "aadhaar",
    label: "Aadhaar",
    tooltip: "Student's or guardian's Aadhaar card. Used for identity verification.",
    permission: "field_application_doc_aadhaar",
  },
  {
    key: "tc",
    label: "Transfer Certificate (T.C.)",
    tooltip: "Transfer certificate from the previous school. Required when applicable.",
    permission: "field_application_doc_tc",
  },
  {
    key: "marksheet",
    label: "Marksheet",
    tooltip: "Last qualifying exam marksheet (e.g. previous class). For verification.",
    permission: "field_application_doc_marksheet",
  },
  {
    key: "caste",
    label: "Caste Certificate",
    tooltip: "Caste or category certificate if claiming reservation. Optional.",
    permission: "field_application_doc_caste",
  },
  {
    key: "parent_signature",
    label: "Parent Signature",
    tooltip: "Signed undertaking or consent form from parent/guardian.",
    permission: "field_application_doc_parent_sig",
  },
] as const;

/** Document upload fields for FormFieldsFromConfig / ControlledFormComponent (name, label, tooltip, type FILE, accept, required) */
export const APPLICATION_DESK_DOCUMENT_FIELDS = APPLICATION_DESK_DOCUMENT_TYPES.map((doc) => ({
  name: `documents.${doc.key}` as const,
  label: doc.label,
  tooltip: doc.tooltip,
  type: FORM_TYPE.FILE,
  accept: APPLICATION_DESK_DOCUMENT_ACCEPT,
  required: false,
}));

/** Flow step keys and labels for application desk (steps import these for title/subtitle) */
export const APPLICATION_DESK_FLOW_STEPS = [
  "identity",
  "address_guardian",
  "medical_documents",
  "academic",
  "services",
  "payment",
  "review",
] as const;

export type ApplicationDeskFlowStep = (typeof APPLICATION_DESK_FLOW_STEPS)[number];

export const APPLICATION_DESK_STEP_LABELS: Record<ApplicationDeskFlowStep, string> = {
  identity: "Applicant details",
  address_guardian: "Address & guardian",
  medical_documents: "Medical & documents",
  academic: "Academic enrolment",
  services: "Fees & services",
  payment: "Payment collection",
  review: "Review & submit",
};

export const APPLICATION_DESK_STEP_SUBTITLES: Record<ApplicationDeskFlowStep, string> = {
  identity: "Enter applicant details as per certificates.",
  address_guardian: "Address and guardian details.",
  medical_documents: "Medical information and document upload.",
  academic: "Define program, class, and section.",
  services: "Confirm fees and add optional services.",
  payment: "Collect payment and apply concessions.",
  review: "Final confirmation of onboarding details.",
};

/**
 * Unified step config: step key → route slug, label, icon name, validation fields.
 * Single source of truth for StepHeader, routing, and forward-gating.
 */
export interface AdmissionStepConfig {
  key: ApplicationDeskFlowStep;
  slug: string;
  label: string;
  iconName: string; // lucide-react icon name
  validationFields: string[];
}

export const ADMISSION_STEP_CONFIG: AdmissionStepConfig[] = [
  {
    key: "identity",
    slug: "identity",
    label: "Applicant Details",
    iconName: "User",
    validationFields: ["applicant_name", "dob", "gender", "father_name", "mother_name", "category", "mobile", "email"],
  },
  {
    key: "address_guardian",
    slug: "address-guardian",
    label: "Address & Guardian",
    iconName: "MapPin",
    validationFields: ["address_snapshot", "guardian_snapshot", "permanent_address_type", "has_local_guardian"],
  },
  {
    key: "medical_documents",
    slug: "medical-documents",
    label: "Medical & Docs",
    iconName: "FileText",
    validationFields: ["documents", "medical_condition", "disability", "allergy"],
  },
  {
    key: "academic",
    slug: "academic",
    label: "Academics",
    iconName: "GraduationCap",
    validationFields: ["stream_id", "class_id"],
  },
  {
    key: "services",
    slug: "services",
    label: "Fees & Services",
    iconName: "Wallet",
    validationFields: ["fees", "inventory_items", "transport_stop_id", "transport_amount", "hostel_required", "hostel_amount", "discount_amount", "discount_reason"],
  },
  {
    key: "payment",
    slug: "payment",
    label: "Payment",
    iconName: "CreditCard",
    validationFields: ["cash_amount", "online_amount", "online_transaction_id"],
  },
  {
    key: "review",
    slug: "review",
    label: "Review",
    iconName: "ClipboardCheck",
    validationFields: [],
  },
];

/** Lookup: slug → step key */
export const SLUG_TO_STEP_KEY: Record<string, ApplicationDeskFlowStep> = Object.fromEntries(
  ADMISSION_STEP_CONFIG.map((s) => [s.slug, s.key]),
) as Record<string, ApplicationDeskFlowStep>;

/** Lookup: step key → slug */
export const STEP_KEY_TO_SLUG: Record<ApplicationDeskFlowStep, string> = Object.fromEntries(
  ADMISSION_STEP_CONFIG.map((s) => [s.key, s.slug]),
) as Record<ApplicationDeskFlowStep, string>;

/** Transfer certificate field for Academic step */
export const APPLICATION_DESK_TC_FIELD = {
  section: "Documents" as const,
  name: "has_tc" as const,
  label: "Transfer certificate (TC) submitted",
  type: FORM_TYPE.CHECKBOX,
  tooltip: "Whether transfer certificate is submitted.",
  options: [{ key: "has_tc", value: true, text: "Yes, TC submitted" }],
  permission: "field_application_has_tc",
};

/** Form fields: Main class → Class (e.g. Class I, Class X). Section auto-assigned on approval. */
export const APPLICATION_DESK_CLASS_FIELDS = [
  {
    name: "class_id",
    label: "Class",
    type: FORM_TYPE.ASYNC_SELECT,
    placeholder: "Select class",
    tooltip: "Select a class. Loaded based on main class selection.",
    required: true,
    permission: "field_application_class_id",
  },
];

/** Hostel accommodation field for Services step */
export const APPLICATION_DESK_HOSTEL_FIELD = {
  section: "Accommodation" as const,
  name: "hostel_required" as const,
  label: "Hostel accommodation required",
  type: FORM_TYPE.CHECKBOX,
  tooltip: "Whether applicant needs hostel accommodation.",
  options: [{ key: "hostel_required", value: true, text: "Yes, hostel required" }],
  permission: "field_application_hostel_required",
};

export const APPLICATION_DESK_HOSTEL_AMOUNT_FIELD = {
  name: "hostel_amount" as const,
  label: "Monthly Hostel Charge (₹)",
  type: FORM_TYPE.NUMBER_TEXT,
  placeholder: "Enter amount",
  maxLength: 10,
  permission: "field_application_hostel_amount",
};

export const APPLICATION_DESK_CONCESSION_FIELDS = [
  { name: "discount_amount", label: "Amount (₹)", type: FORM_TYPE.NUMBER_TEXT, placeholder: "0", maxLength: 10, tooltip: "Enter the discount or concession amount to be deducted from the total.", permission: "field_application_discount_amount" },
  { name: "discount_reason", label: "Reason / Remarks", type: FORM_TYPE.TEXT, placeholder: "e.g. Merit Scholarship", tooltip: "Specify the reason for this concession (e.g. Staff ward, Sibling discount).", permission: "field_application_discount_reason" },
];

/** Payment Desk (standalone pay page) – concession fields; uses concession_* for API. */
export const PAY_DESK_CONCESSION_FIELDS = [
  { name: "concession_amount", label: "Amount (₹)", type: FORM_TYPE.NUMBER_TEXT, placeholder: "0", maxLength: 10, tooltip: "Enter the discount or concession amount to be deducted from the total.", permission: "field_application_discount_amount" },
  { name: "concession_reason", label: "Reason / Remarks", type: FORM_TYPE.TEXT, placeholder: "e.g. Merit Scholarship", maxLength: 500, tooltip: "Specify the reason for this concession (e.g. Staff ward, Sibling discount).", permission: "field_application_discount_reason" },
];

/** Payment Desk (standalone pay page) – fee collection fields. Filter by showWhen in pay.tsx for online_transaction_id and bank_reference. */
export const PAY_DESK_PAYMENT_FIELDS = [
  { name: "cash_amount", label: "Cash Amount (₹)", type: FORM_TYPE.NUMBER_TEXT, placeholder: "0", maxLength: 10, tooltip: "Amount received in hard cash.", section: "amounts", permission: "field_application_cash_amount" },
  { name: "online_amount", label: "Online Amount (₹)", type: FORM_TYPE.NUMBER_TEXT, placeholder: "0", maxLength: 10, tooltip: "Amount received via UPI, IMPS, or Card.", permission: "field_application_online_amount" },
  { name: "online_transaction_id", label: "Transaction / UTR ID*", type: FORM_TYPE.TEXT, placeholder: "e.g. UTR1234567890", maxLength: 100, required: true, tooltip: "Mandatory for online payments. Enter the 12-digit UTR or Ref No.", className: "md:col-span-2 w-full min-w-0", permission: "field_application_txn_id" },
  { name: "notes", label: "Internal Notes", type: FORM_TYPE.TEXTAREA, placeholder: "Add any specific details...", maxLength: 2000, tooltip: "Optional internal notes for this payment (e.g. cheque number, receipt reference).", className: "md:col-span-2 w-full min-w-0 rounded-lg min-h-[80px]", permission: "field_application_notes" },
];

export const APPLICATION_DESK_PAYMENT_FIELDS = [
  { name: "cash_amount", label: "Cash Amount (₹)", type: FORM_TYPE.NUMBER_TEXT, placeholder: "0" as const, maxLength: 10, tooltip: "Amount received in hard cash.", permission: "field_application_cash_amount" },
  { name: "online_amount", label: "Online Amount (₹)", type: FORM_TYPE.NUMBER_TEXT, placeholder: "0" as const, maxLength: 10, tooltip: "Amount received via UPI, IMPS, or Card.", permission: "field_application_online_amount" },
  { name: "online_transaction_id", label: "Transaction / UTR ID", type: FORM_TYPE.TEXT, placeholder: "e.g. UTR1234567890" as const, maxLength: 100, tooltip: "Mandatory for online payments. Enter the 12-digit UTR or Ref No.", permission: "field_application_txn_id" },
] as const;

export type ReviewSectionKey = "academic" | "applicant" | "contact" | "guardian" | "medical" | "financial";

export const REVIEW_SECTION_CONFIG: { key: ReviewSectionKey; title: string; iconName: string; className?: string }[] = [
  { key: "academic", title: "Academic details", iconName: "GraduationCap" },
  { key: "applicant", title: "Applicant details", iconName: "User" },
  { key: "contact", title: "Contact & address", iconName: "MapPin" },
  { key: "guardian", title: "Guardian & emergency", iconName: "ShieldCheck" },
  { key: "medical", title: "Medical & documents", iconName: "Stethoscope" },
  { key: "financial", title: "Financial summary", iconName: "CreditCard", className: "bg-primary/[0.02] border-primary/20" },
];

/** Section configs for ServicesStep — drives polymorphic rendering of service sections */
export const SERVICES_STEP_SECTIONS = [
  { key: "fees",      label: "Fee Particulars",       iconName: "CreditCard" },
  { key: "inventory", label: "Inventory & Kits",      iconName: "Package"    },
  { key: "transport", label: "Transport Services",     iconName: "Bus"       },
  { key: "hostel",    label: "Hostel Accommodation",   iconName: "Landmark"  },
] as const;

export type ServicesStepSectionKey = (typeof SERVICES_STEP_SECTIONS)[number]["key"];
