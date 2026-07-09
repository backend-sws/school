// src/validations/change-password.schema.ts
import { z } from "zod";
import { safeStringRefine, SAFE_STRING_MESSAGE } from "./common";

export const changePasswordSchema = z
  .object({
    current_password: z
      .string()
      .min(6, "Current password is required")
      .refine(safeStringRefine, SAFE_STRING_MESSAGE),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .refine(safeStringRefine, SAFE_STRING_MESSAGE),
    password_confirmation: z
      .string()
      .min(8, "Confirm password is required")
      .refine(safeStringRefine, SAFE_STRING_MESSAGE),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
