import { z } from "zod";

/**
 * Common validation helpers – block input that could cause security issues (XSS, injection, etc.).
 * Use these in Zod schemas to make validations full-proof across the app.
 */

/** Error message shown when input is rejected for security reasons */
export const SAFE_STRING_MESSAGE =
  "Invalid characters or pattern detected. Please remove any script, HTML, or special control characters.";

/**
 * Patterns that indicate potentially dangerous input.
 * Blocked: script/iframe/object/embed, event handlers, javascript:/vbscript:/data: (script-like),
 * control characters, null bytes, expression(), meta refresh, style with expression/script.
 */
const UNSAFE_PATTERNS: RegExp[] = [
  // Script-like tags (case-insensitive)
  /<script\b[\s\S]*?>|<\/script\s*>/gi,
  /<iframe\b[\s\S]*?>|<\/iframe\s*>/gi,
  /<object\b[\s\S]*?>|<\/object\s*>/gi,
  /<embed\b[\s\S]*?>/gi,
  // Protocol-based (javascript:, vbscript:, data: with script/html)
  /\bjavascript\s*:/gi,
  /\bvbscript\s*:/gi,
  /data\s*:\s*text\s*\/\s*html\s*;/gi,
  /data\s*:\s*application\s*\/\s*(x-)?(java|ecma)script/gi,
  // Event handlers (onclick=, onerror=, etc.)
  /\bon\w+\s*=/gi,
  // expression() used in old IE XSS
  /expression\s*\(/gi,
  // Meta refresh (redirect to script)
  /<meta[\s\S]*?refresh[\s\S]*?>/gi,
  // Style with expression or url(javascript:...)
  /style\s*=[\s\S]*?expression\s*\(/gi,
  /url\s*\(\s*['"]?\s*javascript\s*:/gi,
  // Control characters and null byte (can break parsing / cause injection)
  /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/,
  /\0/,
];

/**
 * Returns true if the string is safe (no dangerous pattern found).
 * Use this to block input that could cause XSS or injection.
 */
export function isSafeString(value: string): boolean {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  for (const pattern of UNSAFE_PATTERNS) {
    pattern.lastIndex = 0;
    if (pattern.test(trimmed)) return false;
  }
  return true;
}

/**
 * Zod refine: use with z.string().refine(safeStringRefine, SAFE_STRING_MESSAGE).
 * Fails validation if the value contains any unsafe pattern.
 */
export function safeStringRefine(value: string): boolean {
  return isSafeString(value);
}

/**
 * Optional: apply safe-string check only when value is non-empty.
 * Use for optional string fields where empty is allowed but content must be safe.
 */
export function safeStringRefineOptional(value: string): boolean {
  if (value == null || String(value).trim() === "") return true;
  return isSafeString(String(value));
}

/**
 * Required string with max length and security check.
 */
export function safeRequiredString(max: number, requiredMessage: string) {
  return z
    .string()
    .min(1, requiredMessage)
    .max(max, `Must be at most ${max} characters`)
    .refine(safeStringRefine, SAFE_STRING_MESSAGE);
}

/**
 * Optional string with max length and security check.
 */
export function safeOptionalString(max: number, fieldName: string) {
  return z
    .string()
    .max(max, `${fieldName} must be at most ${max} characters`)
    .refine(safeStringRefineOptional, SAFE_STRING_MESSAGE)
    .optional()
    .nullable()
    .or(z.literal(""));
}


/** Default max length for email fields (shared across forms). */
export const EMAIL_MAX_LENGTH = 150;

/**
 * Optional email: valid email or empty string. Use in forms where email is not required.
 * @param maxLength - max length (default EMAIL_MAX_LENGTH)
 */
export function emailSchemaOptional(maxLength: number = EMAIL_MAX_LENGTH) {
  return z
    .union([
      z.string().email("Enter a valid email address").max(maxLength, `Email must be at most ${maxLength} characters`),
      z.literal(""),
    ])
    .optional();
}

/**
 * Required email. Use in forms where email is mandatory.
 * @param message - custom error message for invalid email
 */
export function emailSchemaRequired(message: string = "Enter a valid email address") {
  return z.string().min(1, "Valid email is required").email(message).max(EMAIL_MAX_LENGTH, `Email must be at most ${EMAIL_MAX_LENGTH} characters`);
}

/**
 * Standardized numeric string validation for FORM_TYPE.NUMBER_TEXT.
 * Validates that the string is a valid number (handles decimals and optional signs).
 */
export function numericString(message: string = "Please enter a valid number") {
  return z
    .union([z.string(), z.number()])
    .refine(
      (val) => {
        if (typeof val === "number") return !isNaN(val);
        return !isNaN(Number(val.replace(/,/g, "")));
      },
      { message }
    )
    .transform((val) => (typeof val === "number" ? val : Number(val.replace(/,/g, ""))));
}

/**
 * Optional numeric string validation. Returns 0 or null if empty, otherwise validates as number.
 */
export function numericStringOptional() {
  return z
    .union([z.string(), z.number()])
    .optional()
    .or(z.literal(""))
    .transform((val) => {
      if (val == null || val === "") return 0;
      if (typeof val === "number") return val;
      const stripped = val.replace(/,/g, "");
      return stripped.trim() !== "" ? Number(stripped) : 0;
    });
}

/**
 * Aadhaar number validation – 12 digits.
 */
export function aadhaarSchema(message: string = "Aadhaar must be a 12-digit number") {
  return z
    .string()
    .regex(/^\d{12}$/, message)
    .optional()
    .or(z.literal(""));
}

/**
 * Pincode validation – 6 digits (India).
 */
export function pincodeSchema(message: string = "Pincode must be a 6-digit number") {
  return z
    .string()
    .regex(/^\d{6}$/, message)
    .optional()
    .or(z.literal(""));
}

/**
 * Phone number validation – handles country code, defaults to +91 for India.
 * Validates leading + and then 10-15 digits.
 */
export function phoneSchema(message: string = "Enter a valid phone number with country code (e.g. +91...)") {
  return z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+\d{10,15}$/, message);
}

/**
 * Optional phone number validation.
 */
export function phoneSchemaOptional(message: string = "Enter a valid phone number with country code (e.g. +91...)") {
  return z
    .string()
    .regex(/^\+\d{10,15}$/, message)
    .optional()
    .or(z.literal(""));
}


