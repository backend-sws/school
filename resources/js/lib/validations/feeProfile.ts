import { z } from "zod";

export const feeProfileSchema = z.object({
    name: z.string().min(1, "Name is required").max(100),
    profile_type: z.string().optional().nullable(),
    category: z.string().optional().nullable(),
    gender: z.string().optional().nullable(),
    description: z.string().optional().nullable(),
    is_default: z.boolean().default(false),
    fee_collection_frequency: z.string().optional().nullable(),
    items: z.array(
        z.object({
            fee_type_id: z.coerce.number().min(1, "Fee type is required"),
            amount: z.coerce.number().min(1, "Amount is required"),
        })
    ).min(1, "At least one fee item is required"),
});

/** Output type after Zod coercion (fee_type_id is always number) */
export type FeeProfileFormData = z.infer<typeof feeProfileSchema>;

/** Input type for useForm — fee_type_id can be string (from ASYNC_SELECT) or number */
export type FeeProfileFormInputValues = Omit<FeeProfileFormData, "items"> & {
    items: { fee_type_id: string | number; amount: number }[];
};
