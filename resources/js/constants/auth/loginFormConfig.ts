import { FORM_TYPE } from "@/constants/shared/form";
import { request } from "@/routes/password";

export const LOGIN_FIELD_ICON = {
  MAIL: "mail",
  LOCK: "lock",
} as const;

export type LoginFieldIconKey = (typeof LOGIN_FIELD_ICON)[keyof typeof LOGIN_FIELD_ICON];

export interface LoginFormFieldConfig {
  name: string;
  label: string;
  type: string;
  placeholder: string;
  required?: boolean;
  autoComplete?: string;
  leftIcon?: LoginFieldIconKey;
  showVisibilityToggle?: boolean;
  tooltip?: string;
  maxLength?: number;
  /** When set on a password field, shows "Forgot password?" link below the input */
  forgotPasswordHref?: string;
}

/** Unified Login: login_id (Email or Mobile), password */
export const UNIFIED_LOGIN_FIELDS: LoginFormFieldConfig[] = [
  {
    name: "login_id",
    label: "Email or Mobile",
    type: FORM_TYPE.TEXT,
    placeholder: "Email or 10-digit mobile number",
    required: true,
    autoComplete: "username",
    leftIcon: LOGIN_FIELD_ICON.MAIL,
    tooltip: "Enter your registered email or mobile number",
    maxLength: 255,
  },
  {
    name: "password",
    label: "Password",
    type: FORM_TYPE.PASSWORD,
    placeholder: "e.g:••••••••",
    required: true,
    autoComplete: "current-password",
    leftIcon: LOGIN_FIELD_ICON.LOCK,
    showVisibilityToggle: true,
    tooltip: "Your account password.",
    forgotPasswordHref: request.url(),
  },
];
