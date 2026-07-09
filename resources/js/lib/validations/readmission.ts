import { z } from "zod";

export const readmissionProcessSchema = z.object({
  to_session_id: z.string().min(1, "Target session is required"),
  to_semester: z.string().optional(),
  to_class_id: z.string().optional(),
  to_stream_id: z.string().optional(),
  dropout_reason: z.string().optional(),
  gap_duration_months: z
    .string()
    .optional()
    .refine(
      (v) => !v || (!isNaN(Number(v)) && Number(v) >= 0),
      "Must be a valid number"
    ),
  remarks: z.string().optional(),
  create_application: z.boolean().optional(),
});

export type ReadmissionProcessFormValues = z.infer<typeof readmissionProcessSchema>;

export const READMISSION_PROCESS_DEFAULTS: ReadmissionProcessFormValues = {
  to_session_id: "",
  to_semester: "",
  to_class_id: "",
  to_stream_id: "",
  dropout_reason: "",
  gap_duration_months: "",
  remarks: "",
  create_application: false,
};

export const bulkReadmissionSchema = z.object({
  to_session_id: z.string().min(1, "Target session is required"),
  to_semester: z.string().optional(),
  to_class_id: z.string().optional(),
  from_session_id: z.string().min(1, "Source session is required"),
  stream_id: z.string().optional(),
});

export type BulkReadmissionFormValues = z.infer<typeof bulkReadmissionSchema>;

export const BULK_READMISSION_DEFAULTS: BulkReadmissionFormValues = {
  to_session_id: "",
  to_semester: "",
  to_class_id: "",
  from_session_id: "",
  stream_id: "",
};

