import { z } from "zod";
import { safeRequiredString } from "./common";

export const subjectDialogFormSchema = z.object({
  name: safeRequiredString(255, "Name is required"),
  code: safeRequiredString(100, "Code is required"),

  stream_id: z
    .string("Stream is required")
    .min(1, "Stream is required")
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val > 0, "Stream must be selected"),

  subject_group_id: z
    .string()
    .optional()
    .transform((val) => val ? Number(val) : undefined)
    .refine((val) => val === undefined || (!isNaN(val) && val > 0), "Subject Group must be valid"),

  is_practical: z.boolean().optional(),
});
