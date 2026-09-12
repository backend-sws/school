import React, { useState, useMemo } from "react";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api/api";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { RotateCcw, AlertTriangle, Receipt, Calendar, User, CreditCard, Sparkles, Layers } from "lucide-react";
import { formatCurrency } from "@/constants/accounts/ledgerDetailConfig";
import { PREMIUM_LABEL_CLASSES } from "@/components/shared/form/types";
import { cn } from "@/lib/utils";

interface RevertPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    student: any;
    paymentRow: any;
    matrix?: any[];
    onSuccess: () => void;
}

export default function RevertPaymentModal({
    isOpen,
    onClose,
    student,
    paymentRow,
    matrix,
    onSuccess,
}: RevertPaymentModalProps) {
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");
    const [revertMode, setRevertMode] = useState<"batch" | "single">("batch");

    const isAdvancePayment = Boolean(
        paymentRow?.is_advance ||
        (paymentRow?.remarks && paymentRow.remarks.includes("[Advance:")) ||
        (paymentRow?.receipt_no && paymentRow.receipt_no.includes("RCP-ADV"))
    );

    // Identify sibling payments from the same advance collection
    const advanceSiblings = useMemo(() => {
        if (!isAdvancePayment || !matrix || matrix.length === 0) return paymentRow ? [paymentRow] : [];

        const baseReceipt = paymentRow?.receipt_no ? paymentRow.receipt_no.replace(/-(?:D)?\d+$/, '') : null;
        const advBatchId = paymentRow?.advance_batch_id || null;

        const matches = matrix.filter((r: any) => {
            if (!r.payment_id) return false;
            if (advBatchId && r.advance_batch_id === advBatchId) return true;
            if (baseReceipt && r.receipt_no) {
                const rBase = r.receipt_no.replace(/-(?:D)?\d+$/, '');
                if (rBase === baseReceipt) return true;
            }
            if (paymentRow?.remarks && r.remarks) {
                const tagMatch = paymentRow.remarks.match(/\[Advance:[^\]]+\]/)?.[0];
                if (tagMatch && r.remarks.includes(tagMatch)) return true;
            }
            return false;
        });

        return matches.length > 0 ? matches : [paymentRow];
    }, [paymentRow, matrix, isAdvancePayment]);

    const isBatch = advanceSiblings.length > 1;

    const batchTotal = useMemo(
        () => advanceSiblings.reduce((sum, r) => sum + Number(r.paid_amount || 0), 0),
        [advanceSiblings]
    );

    const batchMonthsText = useMemo(
        () => advanceSiblings.map(r => r.month_name).join(", "),
        [advanceSiblings]
    );

    const revertMutation = useMutation({
        mutationFn: (data: { payment_id: number | string; reason: string; revert_batch?: boolean }) =>
            api.post("/fees/ledger/revert-payment", data),
        onSuccess: (res: any) => {
            toast.success(res?.data?.message || "Payment reverted successfully. Student ledger updated.");
            setReason("");
            setError("");
            onSuccess();
            onClose();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to revert payment.");
        },
    });

    const handleConfirm = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = reason.trim();
        if (!trimmed || trimmed.length < 3) {
            setError("Please provide a valid reason (at least 3 characters) for reverting this payment.");
            return;
        }

        if (!paymentRow?.payment_id) {
            toast.error("No valid payment ID found for this record.");
            return;
        }

        revertMutation.mutate({
            payment_id: paymentRow.payment_id,
            reason: trimmed,
            revert_batch: isBatch && revertMode === "batch",
        });
    };

    if (!paymentRow) return null;

    const isRevertingBatch = isBatch && revertMode === "batch";

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[480px] border shadow-2xl p-0 overflow-hidden rounded-2xl">
                <DialogHeader className="p-6 pb-2">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                            <AlertTriangle className="size-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-bold text-foreground">
                                {isBatch ? "Undo Advance Payment" : "Undo Fee Payment"}
                            </DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                                {isBatch
                                    ? `Revert advance payments recorded for ${student?.name}`
                                    : "Revert a payment recorded by mistake"}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleConfirm} className="p-6 pt-2 space-y-4">
                    {/* Advance Batch Selection Card (shown when multiple months belong to the advance) */}
                    {isBatch && (
                        <div className="rounded-xl border border-sky-200 bg-sky-50/70 p-3.5 space-y-2.5">
                            <div className="flex items-center gap-1.5 text-sky-950 font-bold text-xs">
                                <Sparkles className="size-4 text-sky-600 shrink-0" />
                                <span>Advance Payment Collection ({advanceSiblings.length} Months)</span>
                            </div>
                            <p className="text-[11px] text-sky-900/90 leading-relaxed">
                                This payment was collected as part of a bulk advance for <strong>{batchMonthsText}</strong> (Total: <strong>{formatCurrency(batchTotal)}</strong>).
                            </p>
                            <div className="grid grid-cols-2 gap-2 pt-0.5">
                                <button
                                    type="button"
                                    onClick={() => setRevertMode("batch")}
                                    className={cn(
                                        "p-2.5 rounded-xl text-left border text-xs transition-all cursor-pointer",
                                        revertMode === "batch"
                                            ? "bg-sky-600 text-white border-sky-600 shadow-md font-bold"
                                            : "bg-background text-foreground border-border hover:bg-muted"
                                    )}
                                >
                                    <div className="flex items-center justify-between text-xs">
                                        <span className="flex items-center gap-1">
                                            <Layers className="size-3" /> All {advanceSiblings.length} Months
                                        </span>
                                        <span className="font-extrabold">{formatCurrency(batchTotal)}</span>
                                    </div>
                                    <div className={cn("text-[10px] mt-0.5 font-normal", revertMode === "batch" ? "text-sky-100" : "text-muted-foreground")}>
                                        Revert whole advance at once
                                    </div>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setRevertMode("single")}
                                    className={cn(
                                        "p-2.5 rounded-xl text-left border text-xs transition-all cursor-pointer",
                                        revertMode === "single"
                                            ? "bg-destructive text-white border-destructive shadow-md font-bold"
                                            : "bg-background text-foreground border-border hover:bg-muted"
                                    )}
                                >
                                    <div className="flex items-center justify-between text-xs">
                                        <span>Only This Month</span>
                                        <span className="font-extrabold">{formatCurrency(paymentRow.paid_amount || 0)}</span>
                                    </div>
                                    <div className={cn("text-[10px] mt-0.5 font-normal", revertMode === "single" ? "text-rose-100" : "text-muted-foreground")}>
                                        {paymentRow.month_name} only
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Payment Info Card */}
                    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-3.5 space-y-2.5 text-xs">
                        <div className="flex items-center justify-between text-muted-foreground">
                            <span className="flex items-center gap-1.5 font-medium">
                                <User className="size-3.5" />
                                Student
                            </span>
                            <span className="font-bold text-foreground">{student?.name}</span>
                        </div>

                        <div className="flex items-center justify-between text-muted-foreground">
                            <span className="flex items-center gap-1.5 font-medium">
                                <Calendar className="size-3.5" />
                                Month / Period
                            </span>
                            <span className="font-bold text-foreground text-right max-w-[240px] truncate">
                                {isRevertingBatch ? `${batchMonthsText} (${advanceSiblings.length} Months)` : paymentRow.month_name}
                            </span>
                        </div>

                        <div className="flex items-center justify-between text-muted-foreground">
                            <span className="flex items-center gap-1.5 font-medium">
                                <CreditCard className="size-3.5" />
                                Total Amount to Revert
                            </span>
                            <span className="font-extrabold text-destructive text-sm tabular-nums">
                                {formatCurrency(isRevertingBatch ? batchTotal : (paymentRow.paid_amount || 0))}
                            </span>
                        </div>

                        {paymentRow.receipt_no && (
                            <div className="flex items-center justify-between text-muted-foreground">
                                <span className="flex items-center gap-1.5 font-medium">
                                    <Receipt className="size-3.5" />
                                    Receipt No.
                                </span>
                                <span className="font-mono text-[11px] font-semibold text-foreground">
                                    {isRevertingBatch
                                        ? paymentRow.receipt_no.replace(/-(?:D)?\d+$/, '')
                                        : paymentRow.receipt_no}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="text-xs text-muted-foreground bg-muted/40 p-3 rounded-lg border leading-relaxed">
                        ⚠️ Reverting will mark {isRevertingBatch ? `all ${advanceSiblings.length} advance payments` : "this payment"} as <strong>cancelled</strong>, restore the outstanding dues in the ledger, and update the student&apos;s account balance.
                    </div>

                    {/* Reason Field */}
                    <div className="space-y-1.5">
                        <Label className={PREMIUM_LABEL_CLASSES}>
                            Reason for Cancellation / Reversal <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                            value={reason}
                            onChange={(e) => {
                                setReason(e.target.value);
                                if (error) setError("");
                            }}
                            placeholder="e.g. Advance paid by mistake, parent requested refund, incorrect student selected..."
                            rows={3}
                            className="text-xs resize-none focus-visible:ring-destructive/20 border-border"
                            required
                        />
                        {error && <p className="text-[11px] text-destructive font-medium">{error}</p>}
                    </div>

                    <DialogFooter className="pt-2 flex gap-2 sm:gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={revertMutation.isPending}
                            className="flex-1 rounded-xl h-10 font-semibold text-xs"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="destructive"
                            disabled={revertMutation.isPending || !reason.trim()}
                            className="flex-1 rounded-xl h-10 font-bold text-xs uppercase tracking-wider shadow-md shadow-destructive/20"
                        >
                            {revertMutation.isPending ? (
                                "Reverting..."
                            ) : isRevertingBatch ? (
                                <>
                                    <RotateCcw className="size-3.5 mr-1.5" />
                                    Revert All {advanceSiblings.length} Months ({formatCurrency(batchTotal)})
                                </>
                            ) : (
                                <>
                                    <RotateCcw className="size-3.5 mr-1.5" />
                                    Confirm & Undo ({formatCurrency(paymentRow.paid_amount || 0)})
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
