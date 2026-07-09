import { FORM_TYPE } from "@/constants/shared/form";
import type { RegisterFormFieldConfig } from "@/constants/auth/registerFormConfig";

/** Card Details form field config (Step 4: Payment) */
export const CARD_DETAILS_FIELDS: RegisterFormFieldConfig[] = [
  {
    name: "card_number",
    label: "Card Number",
    type: FORM_TYPE.CARD_NUMBER,
    placeholder: "1234 5678 9012 3456",
    required: true,
    maxLength: 19,
    tooltip: "Enter 16-digit Visa, Mastercard, or Amex number",
  },
  {
    name: "card_holder",
    label: "Cardholder Name",
    type: FORM_TYPE.TEXT,
    placeholder: "As printed on card",
    required: true,
    maxLength: 50,
    tooltip: "Enter the name exactly as it appears on your card",
  },
  {
    name: "card_expiry",
    label: "Expiry",
    type: FORM_TYPE.CARD_EXPIRY,
    placeholder: "MM/YY",
    required: true,
    maxLength: 5,
    layout: "half",
    tooltip: "Card expiration date in MM/YY format",
  },
  {
    name: "card_cvv",
    label: "CVV",
    type: FORM_TYPE.CARD_CVV,
    placeholder: "•••",
    required: true,
    maxLength: 4,
    layout: "half",
    tooltip: "3 or 4-digit security code on the back of your card",
  },
];
