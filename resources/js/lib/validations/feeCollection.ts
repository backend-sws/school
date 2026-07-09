import { z } from "zod";

export const feeCollectionSchema = z.object({
    amount: z.number().min(1, "Enter a valid amount"),
    payment_mode: z.string().min(1, "Select payment mode"),
    cash_amount: z.number().min(0),
    online_amount: z.number().min(0),
    online_transaction_id: z.string().nullable().optional(),
    receipt_no: z.string().nullable().optional(),
    remarks: z.string().nullable().optional(),
    cheque_number: z.string().nullable().optional(),
    bank_name: z.string().nullable().optional(),
}).superRefine((data, ctx) => {
    const { payment_mode, amount, cash_amount, online_amount, online_transaction_id } = data;

    // Split payment validation
    if (payment_mode === "split") {
        if (cash_amount + online_amount !== amount) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Split amounts must equal the total amount",
                path: ["online_amount"],
            });
        }
    }

    // Online transaction ID validation
    const isOnlineInvolved = payment_mode === "online" || (payment_mode === "split" && online_amount > 0);
    if (isOnlineInvolved && !online_transaction_id?.trim()) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Online transaction ID is required",
            path: ["online_transaction_id"],
        });
    }
});

export type FeeCollectionFormValues = {
    amount: number;
    payment_mode: string;
    cash_amount: number;
    online_amount: number;
    online_transaction_id?: string | null;
    receipt_no?: string | null;
    remarks?: string | null;
    cheque_number?: string | null;
    bank_name?: string | null;
};
