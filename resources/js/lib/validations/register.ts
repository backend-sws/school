import { z } from "zod";
import { safeStringRefine, safeRequiredString, SAFE_STRING_MESSAGE } from "./common";

const mobileRegex = /^[6-9]\d{9}$/;
const slugRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;

/** Known dial code prefixes — ordered longest first for greedy matching */
const KNOWN_DIAL_CODES = [
    "+880", "+971", "+966", "+977", "+234",  // 4-char
    "+91", "+44", "+61", "+65", "+94", "+92", "+49", "+33", "+81", "+82", "+86", "+60", "+27", // 3-char
    "+1",                                     // 2-char
];

/** Strip international dial code prefix (e.g. "+91", "+1") to get bare phone digits */
const stripDialCode = (val: string): string => {
    for (const code of KNOWN_DIAL_CODES) {
        if (val.startsWith(code)) return val.slice(code.length);
    }
    // Fallback: strip +X, +XX, or +XXX (non-greedy, max 3 digits)
    return val.replace(/^\+\d{1,3}/, "");
};

/** Step 1: Account Creation Schema */
export const registerAccountSchema = z.object({
    name: safeRequiredString(100, "Full name is required"),
    email: z
        .string()
        .min(1, "Email is required")
        .email("Enter a valid email address")
        .max(150, "Email must be at most 150 characters")
        .refine(safeStringRefine, SAFE_STRING_MESSAGE),
    mobile: z
        .string()
        .optional()
        .or(z.literal(""))
        .refine(
            (val) => {
                if (!val || val.trim() === "") return true;
                const onlyNumbers = val.replace(/\D/g, "");
                const finalNumber =
                    onlyNumbers.length > 10 && onlyNumbers.startsWith("91")
                        ? onlyNumbers.slice(2)
                        : onlyNumbers;
                // return finalNumber.length === 10;
                return mobileRegex.test(finalNumber);
            },
            "Enter a valid 10-digit mobile number"
        ),
    password: z
        .string()
        .min(8, "Password must be at least 8 characters")
        .max(72, "Password must be at most 72 characters")
        .refine(safeStringRefine, SAFE_STRING_MESSAGE),
    password_confirmation: z
        .string()
        .min(1, "Please confirm your password"),
}).refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
});

export type RegisterAccountFormValues = z.infer<typeof registerAccountSchema>;

/** Step 2: Organization Setup Schema */
export const onboardingOrgSchema = z.object({
    org_name: safeRequiredString(200, "Organization name is required"),
    inst_type: z
        .string()
        .min(1, "Select an institution type"),
    brand_theme: z.string(),
    slug: z
        .string()
        .min(2, "Subdomain must be at least 2 characters")
        .max(30, "Subdomain must be at most 30 characters")
        .regex(slugRegex, "Only lowercase letters, numbers, and hyphens allowed")
        .refine(safeStringRefine, SAFE_STRING_MESSAGE),
    udise_code: z
        .string()
        .optional()
        .or(z.literal(""))
        .refine(
            (val) => !val || /^\d{11}$/.test(val),
            "UDISE code must be exactly 11 digits"
        ),
});

export type OnboardingOrgFormValues = z.infer<typeof onboardingOrgSchema>;

/** Step 4: Card Details Schema */
export const cardDetailsSchema = z.object({
    card_number: z
        .string()
        .min(13, "Enter a valid card number (13-16 digits)")
        .max(19, "Card number is too long")
        .refine(
            (val) => {
                const digits = val.replace(/\s/g, "");
                return /^\d{13,16}$/.test(digits);
            },
            "Enter a valid card number"
        ),
    card_holder: safeRequiredString(50, "Cardholder name is required"),
    card_expiry: z
        .string()
        .regex(/^\d{2}\/\d{2}$/, "Use MM/YY format"),
    card_cvv: z
        .string()
        .regex(/^\d{3,4}$/, "Enter 3 or 4 digit CVV"),
});

export type CardDetailsFormValues = z.infer<typeof cardDetailsSchema>;

/** Consolidated schema (for legacy or full-flow reference) */
export const registerSchema = registerAccountSchema.and(onboardingOrgSchema);
export type RegisterFormValues = z.infer<typeof registerSchema>;
