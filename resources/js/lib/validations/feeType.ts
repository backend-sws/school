import { z } from "zod";

export const feeTypeSchema = z.object({
    name: z.string().min(1, "Name is required").max(200),
    category: z.string().min(1, "Type is required"),
    profile_type: z.string().nullable().optional(),
    reservation_category: z.string().nullable().optional(),
    gender: z.string().nullable().optional(),
});

export type FeeTypeFormData = z.infer<typeof feeTypeSchema>;
