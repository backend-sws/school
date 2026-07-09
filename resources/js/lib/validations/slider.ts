import { z } from "zod";
import {
    safeRequiredString,
    safeOptionalString,
    safeStringRefine,
    SAFE_STRING_MESSAGE,
} from "./common";

export const sliderDialogFormSchema = z.object({
    title: safeRequiredString(255, "Title is required"),
    description: safeOptionalString(1000, "Description"),
    image_url: z.string().min(1, "Banner image is required").max(500),
    button_caption: safeOptionalString(100, "Button caption"),
    button_url: z
        .union([
            z.literal(""),
            z
                .string()
                .min(1)
                .refine(safeStringRefine, SAFE_STRING_MESSAGE)
                .url("Must be a valid URL"),
        ])
        .optional()
        .transform((val) => (val === "" || val === undefined ? null : val)),
    status: z.enum(["draft", "published"]).default("published"),
    sort_order: z.coerce.number().default(0),
});

export type SliderFormData = z.infer<typeof sliderDialogFormSchema>;
