import { z } from "zod";
import { safeRequiredString } from "./common";

export const subjectDialogFormSchema = z.object({
  name: safeRequiredString(255, "Name is required"),
  code: safeRequiredString(100, "Code is required"),

  stream_id: z
    .union([z.string(), z.array(z.string()), z.number(), z.array(z.number())])
    .transform((val) => {
      if (Array.isArray(val)) {
        return val.map((v) => Number(v)).filter((n) => !isNaN(n) && n > 0);
      }
      const num = Number(val);
      return !isNaN(num) && num > 0 ? [num] : [];
    })
    .refine((val) => val.length > 0, "Stream is required"),

  subject_group_id: z
    .string()
    .optional()
    .transform((val) => val ? Number(val) : undefined)
    .refine((val) => val === undefined || (!isNaN(val) && val > 0), "Subject Group must be valid"),

  is_practical: z.boolean().optional(),
});
