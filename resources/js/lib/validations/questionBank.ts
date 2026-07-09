import { z } from "zod";

export const questionBankQuestionSchema = z.object({
    category_id: z.number({ error: "Category is required" }),
    type: z.enum(["mcq", "true_false", "short_answer", "long_answer", "fill_in_blank"]),
    difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
    question_text: z.string().min(1, "Question text is required").max(5000),
    question_image: z.string().optional(),
    options: z
        .array(
            z.object({
                text: z.string().min(1),
                is_correct: z.boolean(),
            })
        )
        .optional(),
    correct_answer: z.string().max(2000).optional(),
    explanation: z.string().max(5000).optional(),
    marks: z.number().min(0).default(1),
    negative_marks: z.number().min(0).default(0),
    tags: z.string().max(500).optional(),
});

export type QuestionBankQuestionFormData = z.infer<typeof questionBankQuestionSchema>;

export const questionBankCategorySchema = z.object({
    name: z.string().min(1, "Name is required").max(255),
    description: z.string().max(1000).optional(),
    parent_id: z.number().optional(),
});

export type QuestionBankCategoryFormData = z.infer<typeof questionBankCategorySchema>;

export const aiQuizGenerateSchema = z.object({
    topic: z.string().min(1, "Topic is required").max(500),
    category_id: z.number({ error: "Category is required" }),
    difficulty: z.enum(["easy", "medium", "hard"]),
    type: z.enum(["mcq", "true_false", "fill_in_blank"]),
    count: z.number().min(1).max(25).default(10),
});

export type AiQuizGenerateFormData = z.infer<typeof aiQuizGenerateSchema>;
