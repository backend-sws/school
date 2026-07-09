import { z } from "zod";

export const idCardTemplateSchema = z.object({
    name: z.string().min(1, "Template name is required").max(200),
    card_type: z.enum(["student", "staff", "temporary"], {
        message: "Card type is required",
    }),
    front_layout: z.any().optional(),
    back_layout: z.any().optional(),
    background_color: z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color")
        .optional(),
    background_image_url: z.string().optional(),
    logo_url: z.string().optional(),
    color_scheme: z
        .object({
            primary: z.string().optional(),
            secondary: z.string().optional(),
            text: z.string().optional(),
            bg: z.string().optional(),
        })
        .optional(),
    is_default: z.boolean().optional(),
    is_active: z.boolean().optional(),
});

export const idCardGenerateSchema = z.object({
    template_id: z.coerce.number({ message: "Template is required" }).min(1, "Template is required"),
    session_id: z.preprocess(
        (val) => (val === "" || val === null || val === undefined ? undefined : val),
        z.coerce.number({ message: "Session is required" }).min(1, "Session is required").optional(),
    ),
    stream_id: z.preprocess(
        (val) => (val === "" || val === null || val === undefined ? undefined : val),
        z.coerce.number().optional(),
    ),
});

export type IdCardTemplateFormData = z.infer<typeof idCardTemplateSchema>;
export type IdCardGenerateFormData = z.infer<typeof idCardGenerateSchema>;

export const idCardHolderDetailSchema = z.object({
    name: z.string().optional(),
    reg_no: z.string().optional(),
    stream: z.string().optional(),
    blood_group: z.string().optional(),
    dob: z.string().optional(),
    mobile: z.string().optional(),
    valid_until: z.string().optional(),
    father_name: z.string().optional(),
    mother_name: z.string().optional(),
    address: z.string().optional(),
    department: z.string().optional(),
    session: z.string().optional(),
    employee_id: z.string().optional(),
    designation: z.string().optional(),
    joining_date: z.string().optional(),
    purpose: z.string().optional(),
    host_name: z.string().optional(),
    organization: z.string().optional(),
});

export type IdCardHolderDetailFormData = z.infer<typeof idCardHolderDetailSchema>;

/** @deprecated Use idCardHolderDetailSchema */
export const idCardStudentDetailSchema = idCardHolderDetailSchema;
export type IdCardStudentDetailFormData = IdCardHolderDetailFormData;
