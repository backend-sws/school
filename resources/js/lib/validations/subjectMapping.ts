import { z } from "zod";
import { safeStringRefine, SAFE_STRING_MESSAGE } from "./common";

export const subjectMappingDialogFormSchema = z.object({
  subject_id: z
    .union([z.string(), z.number()])
    .refine(
      (val) => val !== undefined && val !== null && val !== "",
      "Subject is required",
    )
    .refine(
      (val) => typeof val !== "string" || safeStringRefine(val),
      SAFE_STRING_MESSAGE,
    )
    .transform((val) => Number(val)), // safe transform

  category_ids: z
    .array(z.union([z.string(), z.number()]))
    .min(1, "At least one category must be selected")
    .refine(
      (arr) =>
        arr.every((v) => typeof v !== "string" || safeStringRefine(v)),
      SAFE_STRING_MESSAGE,
    )
    .transform((arr) => arr.map((v) => Number(v))), // use Number(), not v.toString
});
