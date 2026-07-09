import { FORM_TYPE } from "@/constants/shared/form";
import type { IdCardHolderData } from "@/components/certificates/IdCardPreview";

// ─── Placeholder defaults for preview ────────────────────
export const ID_CARD_PLACEHOLDER: Required<IdCardHolderData> = {
    name: "John Doe",
    reg_no: "REG-2025-001",
    stream: "Grade 10 - Section A",
    blood_group: "O+",
    dob: "15 June 2010",
    mobile: "+91 98765-43210",
    valid_until: "March 2026",
    photo_url: "",
    father_name: "Robert Doe",
    mother_name: "Jane Doe",
    address: "12 Park Street, Kolkata",
    department: "Computer Science",
    session: "2024-25",
    employee_id: "EMP-001",
    designation: "Assistant Teacher",
    joining_date: "01 Jan 2020",
    purpose: "Parent meeting",
    host_name: "Reception Desk",
    organization: "ABC Corp",
    email: "john.doe@example.com",
};

export const EMPTY_CARD_DATA: IdCardHolderData = {
    name: "",
    reg_no: "",
    stream: "",
    blood_group: "",
    dob: "",
    mobile: "",
    valid_until: "",
    photo_url: "",
    father_name: "",
    mother_name: "",
    address: "",
    department: "",
    session: "",
    employee_id: "",
    designation: "",
    joining_date: "",
    purpose: "",
    host_name: "",
    organization: "",
    email: "",
};

// ─── Blood group options ─────────────────────────────────
export const BLOOD_GROUP_OPTIONS = [
    { key: "a_pos", value: "A+", text: "A+" },
    { key: "a_neg", value: "A-", text: "A-" },
    { key: "b_pos", value: "B+", text: "B+" },
    { key: "b_neg", value: "B-", text: "B-" },
    { key: "ab_pos", value: "AB+", text: "AB+" },
    { key: "ab_neg", value: "AB-", text: "AB-" },
    { key: "o_pos", value: "O+", text: "O+" },
    { key: "o_neg", value: "O-", text: "O-" },
];

export type CardType = "student" | "staff" | "temporary";

export interface FieldEditorConfig {
    type: string;
    label: string;
    placeholder?: string;
    tooltip?: string;
    options?: { key: string; value: string; text: string }[];
    readOnly?: boolean;
    permission?: string;
    scopeType?: "all" | "higher";
}

export const FIELD_EDITOR_MAP: Record<string, FieldEditorConfig> = {
    photo: {
        type: "image",
        label: "Photo",
        placeholder: "Upload photo",
        tooltip: "Passport-size photo for the ID card",
        permission: "field_id_card_photo",
        scopeType: "all",
    },
    name: {
        type: FORM_TYPE.TEXT,
        label: "Full Name",
        placeholder: "Enter full name",
        tooltip: "Full name as printed on the card",
        permission: "field_id_card_name",
        scopeType: "all",
    },
    reg_no: {
        type: FORM_TYPE.TEXT,
        label: "Registration No",
        placeholder: "e.g. REG-2025-001",
        tooltip: "Registration or ID number on the card",
        permission: "field_id_card_reg_no",
        scopeType: "all",
    },
    stream: {
        type: FORM_TYPE.TEXT,
        label: "Class / Stream",
        placeholder: "e.g. Grade 10 - Section A",
        tooltip: "Class, stream, or batch on the card",
        permission: "field_id_card_stream",
        scopeType: "all",
    },
    blood_group: {
        type: FORM_TYPE.SELECT,
        label: "Blood Group",
        placeholder: "Select blood group",
        tooltip: "Blood group for the ID card",
        options: BLOOD_GROUP_OPTIONS,
        permission: "field_id_card_blood_group",
        scopeType: "all",
    },
    dob: {
        type: FORM_TYPE.TEXT,
        label: "Date of Birth",
        placeholder: "e.g. 15 June 2010",
        tooltip: "Date of birth as printed on the card",
        permission: "field_id_card_dob",
        scopeType: "all",
    },
    mobile: {
        type: FORM_TYPE.PHONE_WITH_CODE,
        label: "Mobile",
        placeholder: "98765-43210",
        tooltip: "Contact number for the ID card",
        permission: "field_id_card_mobile",
        scopeType: "all",
    },
    email: {
        type: FORM_TYPE.TEXT,
        label: "Email",
        placeholder: "name@example.com",
        tooltip: "Email address for the ID card",
        scopeType: "all",
    },
    valid_until: {
        type: FORM_TYPE.TEXT,
        label: "Valid Until",
        placeholder: "e.g. March 2026",
        tooltip: "Expiry date printed on the ID card",
        permission: "field_id_card_valid_until",
        scopeType: "all",
    },
    father_name: {
        type: FORM_TYPE.TEXT,
        label: "Father's Name",
        placeholder: "Enter father's name",
        tooltip: "Father's name as printed on the ID card",
        permission: "field_id_card_father_name",
        scopeType: "all",
    },
    mother_name: {
        type: FORM_TYPE.TEXT,
        label: "Mother's Name",
        placeholder: "Enter mother's name",
        tooltip: "Mother's name as printed on the ID card",
        permission: "field_id_card_mother_name",
        scopeType: "all",
    },
    address: {
        type: FORM_TYPE.TEXT,
        label: "Address",
        placeholder: "Enter address",
        tooltip: "Address for the ID card",
        permission: "field_id_card_address",
        scopeType: "all",
    },
    department: {
        type: FORM_TYPE.TEXT,
        label: "Department",
        placeholder: "e.g. Computer Science",
        tooltip: "Department as printed on the card",
        permission: "field_id_card_department",
        scopeType: "all",
    },
    session: {
        type: FORM_TYPE.TEXT,
        label: "Session",
        placeholder: "e.g. 2024-25",
        tooltip: "Academic session on the card",
        permission: "field_id_card_session",
        scopeType: "all",
    },
    employee_id: {
        type: FORM_TYPE.TEXT,
        label: "Employee ID",
        placeholder: "e.g. EMP-001",
        tooltip: "Employee ID for staff cards",
        permission: "field_id_card_reg_no",
        scopeType: "all",
    },
    designation: {
        type: FORM_TYPE.TEXT,
        label: "Designation",
        placeholder: "e.g. Assistant Professor",
        tooltip: "Job title or designation",
        permission: "field_id_card_stream",
        scopeType: "all",
    },
    joining_date: {
        type: FORM_TYPE.TEXT,
        label: "Joining Date",
        placeholder: "e.g. 01 Jan 2020",
        tooltip: "Date of joining",
        permission: "field_id_card_dob",
        scopeType: "all",
    },
    purpose: {
        type: FORM_TYPE.TEXT,
        label: "Purpose of Visit",
        placeholder: "e.g. Parent meeting",
        tooltip: "Reason for the visit",
        scopeType: "all",
    },
    host_name: {
        type: FORM_TYPE.TEXT,
        label: "Host / Contact",
        placeholder: "e.g. Reception Desk",
        tooltip: "Person or desk hosting the visitor",
        scopeType: "all",
    },
    organization: {
        type: FORM_TYPE.TEXT,
        label: "Organization",
        placeholder: "e.g. ABC Corp",
        tooltip: "Visitor's organization",
        scopeType: "all",
    },
};

export const NON_EDITABLE_FIELDS = new Set([
    "institution_name",
    "institution_logo",
    "qr_code",
    "roll_no",
]);

export const getEditableFieldsForTemplate = (
    frontLayout: string[],
    backLayout: string[],
): (FieldEditorConfig & { key: string })[] => {
    const allFields = [...new Set([...frontLayout, ...backLayout])];
    return allFields
        .filter((key) => !NON_EDITABLE_FIELDS.has(key) && FIELD_EDITOR_MAP[key])
        .map((key) => ({ key, ...FIELD_EDITOR_MAP[key] }));
};

export function getCardDetailsHeaderLabel(cardType?: string): string {
    switch (cardType) {
        case "staff":
            return "Staff Details";
        case "temporary":
            return "Visitor Details";
        default:
            return "Student Details";
    }
}

export function getLoadDirectoryLabel(cardType?: CardType): string | null {
    switch (cardType) {
        case "student":
            return "Load from student";
        case "staff":
            return "Load from staff";
        default:
            return null;
    }
}
