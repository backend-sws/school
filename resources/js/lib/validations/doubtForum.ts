import { z } from "zod";

export const doubtThreadSchema = z.object({
    title: z.string().min(1, "Title is required").max(255),
    body: z.string().min(1, "Question body is required").max(10000),
    lms_class_id: z.number().optional(),
    class_subject_allocation_id: z.number().optional(),
    tags: z.string().max(500).optional(),
});

export type DoubtThreadFormData = z.infer<typeof doubtThreadSchema>;

export const doubtReplySchema = z.object({
    body: z.string().min(1, "Reply body is required").max(10000),
});

export type DoubtReplyFormData = z.infer<typeof doubtReplySchema>;

export const questionBankQuestionSchema = z.object({
    category_id: z.number({ required_error: "Category is required" }),
    type: z.enum(["mcq", "true_false", "short_answer", "long_answer", "fill_in_blank"]),
    difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
    question_text: z.string().min(1, "Question text is required").max(5000),
    question_image: z.string().optional(),
    options: z.array(z.object({
        text: z.string().min(1),
        is_correct: z.boolean(),
    })).optional(),
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
