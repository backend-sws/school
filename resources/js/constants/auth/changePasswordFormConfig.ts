import { FORM_TYPE } from "@/constants/shared/form";

export const CHANGE_PASSWORD_FORM_CONFIG = [
    {
        name: "current_password",
        label: "Current Password",
        type: FORM_TYPE.PASSWORD,
        placeholder: "Enter current password",
        required: true,
        autoComplete: "current-password",
    },
    {
        name: "password",
        label: "New Password",
        type: FORM_TYPE.PASSWORD,
        placeholder: "Enter new password",
        required: true,
        autoComplete: "new-password",
        tooltip: "Ensure your account is using a long, random password to stay secure",
    },
    {
        name: "password_confirmation",
        label: "Confirm New Password",
        type: FORM_TYPE.PASSWORD,
        placeholder: "Confirm new password",
        required: true,
        autoComplete: "new-password",
    },
];
