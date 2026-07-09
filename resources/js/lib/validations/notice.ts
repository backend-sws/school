import { z } from "zod";
import {
    safeRequiredString,
    safeOptionalString,
    safeStringRefine,
    safeStringRefineOptional,
    SAFE_STRING_MESSAGE,
} from "./common";

/**
 * Schema for stream-session combo used in selective notices
 */
const comboSchema = z.object({
    stream_id: z.number(),
    session_id: z.number(),
    id: safeOptionalString(50, "ID"),
});

const booleanFromRadio = z.preprocess(
    (val) => val === true || val === "true",
    z.boolean({ message: "Please select a publish option" }),
);

/**
 * Base Notice form validation schema
 */
export const noticeFormSchema = z
    .object({
        title: safeRequiredString(255, "Title is required"),
        description: safeOptionalString(5000, "Description"),
        target_type: z.enum(["all", "selective"], {
            message: "Please select a target audience",
        }),
        is_published: booleanFromRadio,
        scheduled_at: safeOptionalString(50, "Scheduled at"),
        expired_at: safeOptionalString(50, "Expired at"),
        combos: z.array(comboSchema).optional(),
    })
    .refine(
        (data) => {
            // If scheduling for later, scheduled_at is required
            if (data.is_published === false && !data.scheduled_at) {
                return false;
            }
            return true;
        },
        {
            message: "Schedule date & time is required when scheduling for later",
            path: ["scheduled_at"],
        }
    )
    .refine(
        (data) => {
            // If selective target, combos must have at least one item
            if (data.target_type === "selective" && (!data.combos || data.combos.length === 0)) {
                return false;
            }
            return true;
        },
        {
            message: "Please select at least one stream-session combination",
            path: ["combos"],
        }
    );

/**
 * Type inference from schema
 */
export type NoticeFormData = z.infer<typeof noticeFormSchema>;

/**
 * Schema for updating notice status
 */
export const noticeStatusSchema = z.object({
    status: z.boolean(),
});

export type NoticeStatusData = z.infer<typeof noticeStatusSchema>;
