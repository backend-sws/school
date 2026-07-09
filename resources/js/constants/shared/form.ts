export const FORM_TYPE = {
  TEXT: "text",
  NUMBER: "number",
  /** Number input rendered as type="text" (no spinners; use for pincode, year, etc.) */
  NUMBER_TEXT: "number_text",
  EMAIL: "email",
  PASSWORD: "password",
  CHECKBOX: "checkbox",
  RADIO: "radio",
  SELECT: "select",
  TEXTAREA: "textarea",
  DATE: "date",
  TIME: "time",
  DATETIME: "datetime",
  FILE: "file",
  FILE_SELECT: "file_select",
  IMAGE: "image",
  VIDEO: "video",
  AUDIO: "audio",
  URL: "url",
  PHONE: "phone",
  PHONE_WITH_CODE: "phone_with_code",
  CURRENCY: "currency",
  PERCENTAGE: "percentage",
  RATING: "rating",
  SLIDER: "slider",
  RANGE: "range",
  COLOR: "color",
  MAP: "map",
  SIGNATURE: "signature",
  DROPDOWN: "dropdown",
  MULTI_SELECT: "multi_select",
  REPEATER: "repeater",
  TITLE: "title",
  EDITOR: "editor",
  LIST: "list", // For simple text list items (stored as JSON array)
  MULTI_TAG: "multi_tag", // For multiple tags with dropdown
  YEAR: "year",
  MONTH: "month",
  CARD_NUMBER: "card_number",
  CARD_EXPIRY: "card_expiry",
  CARD_CVV: "card_cvv",
  DOMAIN_SLUG: "domain_slug",
  ASYNC_SELECT: "async_select",
};

/**
 * Standard form field layout. Use everywhere; do not add extra spacing via CSS classes.
 * Spacing comes only from content (label, control, helper). All three slots stay in the DOM.
 * No fixed height on helper row – height is only what the content needs.
 *
 * Structure (always in DOM):
 * 1. Label slot – label + tooltip, or invisible placeholder
 * 2. Control slot – input/select/textarea etc.
 * 3. Helper slot – error/helper/char count, or invisible placeholder
 */
export const FORM_FIELD_LAYOUT = {
  /** Single-line input/select height. */
  CONTROL_HEIGHT_CLASS: "h-11",
  /** Row below control: error (left), helper (left), or char count (right). No fixed height; no extra spacing. */
  HELPER_ROW_CLASS: "flex items-center justify-between gap-2",
  /** Wrapper for error-only below control. No fixed height; no extra spacing. */
  HELPER_ROW_MIN_HEIGHT_CLASS: "",
} as const;
