import { z } from "zod";
import { safeRequiredString, safeStringRefine, SAFE_STRING_MESSAGE } from "./common";

// Duration options as a tuple

export const DepartmentFormSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters")
    .refine(safeStringRefine, SAFE_STRING_MESSAGE),

  code: z
    .string()
    .min(1, "Code is required")
    .max(100, "Code must be less than 100 characters")
    .refine(safeStringRefine, SAFE_STRING_MESSAGE),
});