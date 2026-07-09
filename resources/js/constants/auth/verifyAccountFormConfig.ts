import { FORM_TYPE } from "@/constants/shared/form";

export interface VerifyAccountFieldConfig {
    name: string;
    label: string;
    type: string;
    placeholder: string;
    required?: boolean;
    autoComplete?: string;
    tooltip?: string;
    maxLength?: number;
    showVisibilityToggle?: boolean;
}

export const VERIFY_ACCOUNT_REQUEST_FIELDS: VerifyAccountFieldConfig[] = [
    {
        name: "login_id",
        label: "Email or Mobile Number",
        type: FORM_TYPE.TEXT,
        placeholder: "Enter your registered email or mobile",
        required: true,
        tooltip: "We will send a 6-digit verification code to this address/number.",
    },
];

export const VERIFY_ACCOUNT_SUBMIT_FIELDS: VerifyAccountFieldConfig[] = [
    {
        name: "password",
        label: "New Password",
        type: FORM_TYPE.PASSWORD,
        placeholder: "Enter new password",
        required: true,
        autoComplete: "new-password",
        showVisibilityToggle: true,
        tooltip: 'Use a strong password with at least 8 characters.',
    },
    {
        name: "password_confirmation",
        label: "Confirm Password",
        type: FORM_TYPE.PASSWORD,
        placeholder: "Confirm new password",
        required: true,
        autoComplete: "new-password",
        showVisibilityToggle: true,
        tooltip: 'Re-enter your new password to confirm it matches.',
    },
];
