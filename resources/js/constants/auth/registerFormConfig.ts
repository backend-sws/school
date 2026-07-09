import { FORM_TYPE } from "@/constants/shared/form";

export interface RegisterFormFieldConfig {
    name: string;
    label: string;
    type: string;
    placeholder: string;
    required?: boolean;
    autoComplete?: string;
    tooltip?: string;
    maxLength?: number;
    hideCharCount?: boolean;
    options?: { key: string; text: string; value: string }[];
    /** Layout hint: 'half' renders in a 2-column grid cell */
    layout?: "full" | "half";
    /** Section divider title rendered before this field */
    sectionTitle?: string;
    /** Lowercase transform on input */
    lowercase?: boolean;
    /** Custom CSS class for the field wrapper or input */
    className?: string;
    /** Show password visibility toggle */
    showVisibilityToggle?: boolean;
}

/** ─── Account Details ─── */
const ACCOUNT_FIELDS: RegisterFormFieldConfig[] = [
    {
        name: "name",
        label: "Full Name",
        type: FORM_TYPE.TEXT,
        placeholder: "e.g: Alice ",
        required: true,
        autoComplete: "name",
        maxLength: 100,
        tooltip: 'Your full name as it appears on official documents.'
    },
    {
        name: "email",
        label: "Email Address",
        type: FORM_TYPE.TEXT,
        placeholder: "e.g:name@example.com",
        required: true,
        autoComplete: "email",
        maxLength: 150,
        tooltip: 'We will send a verification link to this email.'
    },
    {
        name: "password",
        label: "Password",
        type: FORM_TYPE.PASSWORD,
        placeholder: "Min. 8 characters",
        required: true,
        autoComplete: "new-password",
        showVisibilityToggle: true,
        tooltip: 'Use a strong password with at least 8 characters, including uppercase, lowercase, numbers, and symbols.'
    },
    {
        name: "password_confirmation",
        label: "Confirm Password",
        type: FORM_TYPE.PASSWORD,
        placeholder: "Confirm password",
        required: true,
        autoComplete: "new-password",
        showVisibilityToggle: true,
        tooltip: 'Please re-enter your password to confirm it matches.'

    },
    {
        name: "mobile",
        label: "Mobile Number",
        type: FORM_TYPE.PHONE_WITH_CODE,
        placeholder: "Enter phone number",
        autoComplete: "tel",
        tooltip: 'We will send a verification code to this number.'

    },
];

/** ─── Organization Details ─── */
const ORG_FIELDS: RegisterFormFieldConfig[] = [
    {
        name: "org_name",
        label: "Organization Name",
        type: FORM_TYPE.TEXT,
        placeholder: "e.g. Acme Educational Trust",
        required: true,
        maxLength: 200,
        hideCharCount: true,
        tooltip: "The registered name of your educational institution.",
        layout: "full",
    },
    {
        name: "inst_type",
        label: "Institution Type",
        type: FORM_TYPE.SELECT,
        placeholder: "Select institution type",
        required: true,
        tooltip: "Choose the category that best describes your organization.",
        options: [
            { key: "school", text: "School", value: "school" },
            { key: "college", text: "College", value: "college" },
            { key: "coaching", text: "Coaching", value: "coaching" },
            { key: "university", text: "University", value: "university" },
        ],
        layout: "full",
    },
];

/** Slug field is special (has a domain suffix) — not in config array, rendered manually */
export const SLUG_FIELD: RegisterFormFieldConfig = {
    name: "slug",
    label: "Workspace Domain",
    type: FORM_TYPE.DOMAIN_SLUG,
    placeholder: "your-school",
    required: true,
    tooltip: "This will be your unique URL. Use letters, numbers, and hyphens.",
    maxLength: 30,
    hideCharCount: true,
    lowercase: true,
    layout: "full",
};

/** Brand Theme field — rendered as a dropdown with color swatches */
export const BRAND_THEME_FIELD: RegisterFormFieldConfig = {
    name: "brand_theme",
    label: "Brand Theme",
    type: FORM_TYPE.SELECT,
    placeholder: "Select a theme",
    required: false,
    tooltip: "Choose your institution's color palette. You can change this later in settings.",
    layout: "full",
};

/** UDISE Code field — shown only when inst_type is 'school' */
export const UDISE_CODE_FIELD: RegisterFormFieldConfig = {
    name: "udise_code",
    label: "UDISE+ Code",
    type: FORM_TYPE.TEXT,
    placeholder: "e.g. 09060100101",
    required: false,
    maxLength: 11,
    hideCharCount: false,
    tooltip: "11-digit UDISE+ code assigned by MHRD to all recognized institutions. Find it on your recognition certificate or from the Block/District Education Office.",
    layout: "full",
};

export const REGISTER_ACCOUNT_FIELDS = ACCOUNT_FIELDS;
export const REGISTER_ORG_FIELDS = ORG_FIELDS;
