import { z } from "zod";
import { safeStringRefine, safeStringRefineOptional, SAFE_STRING_MESSAGE } from "./common";

export const adminLoginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .refine(safeStringRefine, SAFE_STRING_MESSAGE)
    .email("Enter a valid email address"),
  password: z
    .string()
    .min(1, "Password is required")
    .refine(safeStringRefine, SAFE_STRING_MESSAGE),
  remember: z.boolean().optional(),
});

export type AdminLoginFormValues = z.infer<typeof adminLoginSchema>;

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const mobileRegex = /^(?:\+?91)?[6-9]\d{9}$/;

export const studentLoginSchema = z.object({
  login_id: z
    .string()
    .min(1, "Email or mobile is required")
    .refine(safeStringRefine, SAFE_STRING_MESSAGE)
    .refine(
      (val) => {
        const t = val.trim();
        const digitsOnly = t.replace(/[\s\-+]/g, "");
        return emailRegex.test(t) || mobileRegex.test(t) || /^[6-9]\d{9}$/.test(digitsOnly);
      },
      "Enter a valid email address or 10-digit mobile number"
    ),
  password: z
    .string()
    .min(1, "Password is required")
    .refine(safeStringRefine, SAFE_STRING_MESSAGE),
});

export type StudentLoginFormValues = z.infer<typeof studentLoginSchema>;

export const unifiedLoginSchema = z.object({
  login_id: z
    .string()
    .min(1, "Email or Mobile is required")
    .refine(safeStringRefine, SAFE_STRING_MESSAGE)
    .refine((val) => {
      const t = val.trim();
      const digitsOnly = t.replace(/[\s\-+]/g, "");
      return emailRegex.test(t) || mobileRegex.test(t) || /^[6-9]\d{9}$/.test(digitsOnly);
    }, "Enter a valid email address or 10-digit mobile number"),
  password: z
    .string()
    .min(1, "Password is required")
    .refine(safeStringRefine, SAFE_STRING_MESSAGE),
  remember: z.boolean().optional(),
});

export type UnifiedLoginFormValues = z.infer<typeof unifiedLoginSchema>;
