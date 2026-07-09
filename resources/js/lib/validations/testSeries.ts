import { z } from "zod";

export const testSeriesSchema = z.object({
    title: z.string().min(1, "Title is required").max(255),
    description: z.string().max(2000).optional(),
    category: z.string().max(100).optional(),
    difficulty: z.enum(["easy", "medium", "hard"]).optional(),
    starts_at: z.string().optional(),
    ends_at: z.string().optional(),
    test_ids: z.array(z.number()).optional(),
});

export type TestSeriesFormData = z.infer<typeof testSeriesSchema>;
