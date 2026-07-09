import { z } from "zod";
import {
  safeStringRefine,
  safeStringRefineOptional,
  SAFE_STRING_MESSAGE,
  safeRequiredString,
  safeOptionalString,
} from "./common";

export const admissionHeadSchema = z
  .object({
    title: safeRequiredString(255, "Title is required"),
    course_for: safeRequiredString(100, "Course type is required"),
    main_stream_id: z
      .string()
      .trim()
      .min(1, "Main stream is required")
      .refine(safeStringRefine, SAFE_STRING_MESSAGE),
    stream_id: z
      .string()
      .trim()
      .min(1, "Stream is required")
      .refine(safeStringRefine, SAFE_STRING_MESSAGE),
    semester: z.string().trim().min(1, "Semester is required").refine(
      (val) => /^([1-9]|1[0-2])$/.test(val),
      "Semester must be 1–12",
    ).refine(safeStringRefine, SAFE_STRING_MESSAGE),
    session_id: z
      .string()
      .trim()
      .min(1, "Session is required")
      .refine(safeStringRefine, SAFE_STRING_MESSAGE),
    major_subject_id: z
      .string()
      .trim()
      .min(1, "Subject is required")
      .refine(safeStringRefine, SAFE_STRING_MESSAGE),
    allow_subject_paper_selection: z.boolean(),
    subject_paper_categories: z.array(
      z.object({
        subject_category_id: z.any().optional(),
        category_name: z
          .string()
          .trim()
          .refine(safeStringRefine, SAFE_STRING_MESSAGE),
        is_enabled: z.boolean(),
        limit: z.coerce.number().int().min(0).max(100),
        order: z.coerce.number().int().min(0).max(1000),
      }),
    ),
    board_criteria: z
      .array(
        z.string().trim().refine(safeStringRefine, SAFE_STRING_MESSAGE),
      )
      .min(1, "Select at least one board"),
    gender_criteria: z
      .array(
        z.string().trim().refine(safeStringRefine, SAFE_STRING_MESSAGE),
      )
      .min(1, "Select at least one gender"),
    category_criteria: z
      .array(
        z.string().trim().refine(safeStringRefine, SAFE_STRING_MESSAGE),
      )
      .min(1, "Select at least one category"),
    status: z.coerce.number().int().min(0).max(3),
    has_application_fees: z.boolean(),
    application_fees: z.coerce
      .number()
      .min(0, "Fee cannot be negative")
      .max(1000000)
      .default(0),
    payment_gateway: safeRequiredString(100, "Payment gateway is required"),
    last_date: z
      .string()
      .trim()
      .min(1, "Last submission date is required")
      .refine(safeStringRefine, SAFE_STRING_MESSAGE)
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Invalid date format",
      }),
    fees: z
      .array(
        z.object({
          fee_particular_id: z
            .string()
            .trim()
            .min(1, "Particular is required")
            .refine(safeStringRefine, SAFE_STRING_MESSAGE),
          amount: z.coerce
            .number()
            .min(0, "Amount must be at least 0")
            .max(1000000),
        }),
      )
      .min(1, "Add at least one fee component"),
  })
  .refine(
    (data) => {
      if (data.has_application_fees) {
        return data.application_fees > 0;
      }
      return true;
    },
    {
      message: "Application fee must be greater than 0 if required",
      path: ["application_fees"],
    },
  );
