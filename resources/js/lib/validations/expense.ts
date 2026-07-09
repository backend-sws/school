import { z } from "zod";

export const expenseCategorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(100),
  code: z.string().max(50).optional().nullable(),
  description: z.string().optional().nullable(),
  is_active: z.preprocess((val) => val === true || val === "true" || val === 1 || val === "1", z.boolean()).default(true),
});

export type ExpenseCategoryFormData = z.infer<typeof expenseCategorySchema>;

export const expenseSchema = z.object({
  expense_category_id: z.coerce.number().min(1, "Please select a category"),
  title: z.string().min(1, "Title is required").max(200),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  date: z.string().min(1, "Date is required"),
  payment_mode: z.string().min(1, "Payment mode is required"),
  reference_no: z.string().max(100).optional().nullable(),
  payee: z.string().max(150).optional().nullable(),
  description: z.string().optional().nullable(),
  attachment: z.string().max(255).optional().nullable(),
  status: z.string().default("pending"),
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;

export const expenseBudgetSchema = z.object({
  expense_category_id: z.coerce.number().min(1, "Please select a category"),
  session_id: z.coerce.number().min(1, "Please select an academic session"),
  amount: z.coerce.number().positive("Budget amount must be greater than 0"),
  alert_threshold: z.coerce.number().min(1).max(100).default(90),
});

export type ExpenseBudgetFormData = z.infer<typeof expenseBudgetSchema>;
