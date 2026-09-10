import { z } from "zod";

export const feeCollectionSchema = z.object({
    amount: z.number().min(0, "Amount must be 0 or greater"),
    paid_amount: z.number().min(0, "Amount must be 0 or greater").optional(),
    payment_mode: z.string().min(1, "Select payment mode"),
    cash_amount: z.number().min(0),
    online_amount: z.number().min(0),
    online_transaction_id: z.string().nullable().optional(),
    receipt_no: z.string().nullable().optional(),
    remarks: z.string().nullable().optional(),
    cheque_number: z.string().nullable().optional(),
    bank_name: z.string().nullable().optional(),
    discount_amount: z.number().min(0).optional(),
    discount_reason: z.string().nullable().optional(),
    payment_date: z.string().nullable().optional(),
}).superRefine((data, ctx) => {
    const { payment_mode, amount, paid_amount, cash_amount, online_amount, online_transaction_id, discount_amount, discount_reason } = data;

    const discount = discount_amount || 0;
    const netDue = Math.max(0, amount - discount);
    const effectivePaid = paid_amount !== undefined ? Number(paid_amount) : netDue;

    // If discount is given, reason is required
    if (discount > 0 && !discount_reason?.trim()) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Reason for concession / waiver is required",
            path: ["discount_reason"],
        });
    }

    // If not full waiver, paid amount cannot be 0
    if (netDue > 0 && payment_mode !== "concession" && effectivePaid <= 0) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please enter an amount to collect, or apply a full waiver",
            path: ["paid_amount"],
        });
    }

    // Amount collected cannot exceed net payable
    if (effectivePaid > netDue) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Amount cannot exceed net due of ₹${netDue.toLocaleString()}`,
            path: ["paid_amount"],
        });
    }

    // Split payment validation
    if (payment_mode === "split" && effectivePaid > 0) {
        if (Math.abs((cash_amount + online_amount) - effectivePaid) > 0.01) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Split amounts (₹${cash_amount + online_amount}) must equal amount being collected (₹${effectivePaid})`,
                path: ["online_amount"],
            });
        }
    }

    // Online transaction ID validation
    const isOnlineInvolved = (payment_mode === "online" && effectivePaid > 0) || (payment_mode === "split" && online_amount > 0);
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
    paid_amount?: number;
    payment_mode: string;
    cash_amount: number;
    online_amount: number;
    online_transaction_id?: string | null;
    receipt_no?: string | null;
    remarks?: string | null;
    cheque_number?: string | null;
    bank_name?: string | null;
    discount_amount?: number;
    discount_reason?: string | null;
    payment_date?: string | null;
};
