import { z } from "zod";
import { safeRequiredString } from "./common";

const durationOptions = ["1", "2", "3", "4", "5"] as const;

export const streamSchema = z.object({
  name: safeRequiredString(255, "Name is required"),
  code: safeRequiredString(100, "Code is required"),
  duration_years: z
    .enum(durationOptions, { message: "Invalid duration selected" })
    .optional()
    .default("1"),
  main_stream_id: safeRequiredString(50, "Main Stream / Level is required"),
});

export type StreamFormData = z.infer<typeof streamSchema>;

/** @deprecated Use `streamSchema` instead */
export const streamDialogFormSchema = streamSchema;
