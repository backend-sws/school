import { z } from "zod";
import { numericStringOptional, safeOptionalString } from "../common";

/** Zod schema for Payment Desk form (standalone pay page). */
export const paymentDeskFormSchema = z
    .object({
        cash_amount: numericStringOptional(),
        online_amount: numericStringOptional(),
        remaining_due: numericStringOptional(),
        online_transaction_id: z.preprocess((v) => (v === undefined ? "" : v), safeOptionalString(100, "Transaction ID")),
        concession_amount: numericStringOptional(),
        concession_reason: z.preprocess((v) => (v === undefined ? "" : v), safeOptionalString(500, "Concession reason")),
        notes: z.preprocess((v) => (v === undefined ? "" : v), safeOptionalString(2000, "Notes")),
    })
    .refine(
        (data) => {
            const cash = Number(data.cash_amount) || 0;
            const online = Number(data.online_amount) || 0;
            return cash > 0 || online > 0;
        },
        { message: "Please enter at least one payment amount (cash or online).", path: ["online_amount"] }
    )
    .refine(
        (data) => {
            const online = Number(data.online_amount) || 0;
            const tid = (data.online_transaction_id ?? "").trim();
            return online <= 0 || tid.length > 0;
        },
        { message: "Transaction / UTR ID is required for online payments.", path: ["online_transaction_id"] }
    )
    .refine(
        (data) => {
            const cash = Number(data.cash_amount) || 0;
            const online = Number(data.online_amount) || 0;
            const totalCollected = cash + online;
            const remainingDue = Number(data.remaining_due);

            if (!Number.isFinite(remainingDue) || remainingDue < 0) {
                return true;
            }

            return totalCollected <= remainingDue;
        },
        { message: "Collected amount cannot exceed remaining due amount.", path: ["online_amount"] }
    );

export type PaymentDeskFormValues = z.infer<typeof paymentDeskFormSchema>;

