import { FORM_TYPE } from "@/constants/shared/form";

export interface SetPasswordFieldConfig {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  required?: boolean;
  autoComplete?: string;
  tooltip?: string;
  maxLength?: number;
}

export const SET_PASSWORD_FIELDS: SetPasswordFieldConfig[] = [
  {
    name: "password",
    label: "Password",
    type: FORM_TYPE.PASSWORD,
    placeholder: "At least 8 characters",
    required: true,
    autoComplete: "new-password",
    tooltip: "Choose a secure password (minimum 8 characters).",
    maxLength: 255,
  },
  {
    name: "password_confirmation",
    label: "Confirm password",
    type: FORM_TYPE.PASSWORD,
    placeholder: "Confirm your password",
    required: true,
    autoComplete: "new-password",
    tooltip: "Re-enter your password to confirm.",
    maxLength: 255,
  },
];
