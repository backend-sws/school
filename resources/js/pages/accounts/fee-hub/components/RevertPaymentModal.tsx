import React, { useState } from "react";
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
import { RotateCcw, AlertTriangle, Receipt, Calendar, User, CreditCard } from "lucide-react";
import { formatCurrency } from "@/constants/accounts/ledgerDetailConfig";
import { PREMIUM_LABEL_CLASSES } from "@/components/shared/form/types";

interface RevertPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    student: any;
    paymentRow: any;
    onSuccess: () => void;
}

export default function RevertPaymentModal({
    isOpen,
    onClose,
    student,
    paymentRow,
    onSuccess,
}: RevertPaymentModalProps) {
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");

    const revertMutation = useMutation({
        mutationFn: (data: { payment_id: number | string; reason: string }) =>
            api.post("/fees/ledger/revert-payment", data),
        onSuccess: () => {
            toast.success("Payment reverted successfully. Student ledger updated.");
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
        });
    };

    if (!paymentRow) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[440px] border shadow-2xl p-0 overflow-hidden rounded-2xl">
                <DialogHeader className="p-6 pb-2">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                            <AlertTriangle className="size-5" />
                        </div>
                        <div>
                            <DialogTitle className="text-lg font-bold text-foreground">
                                Undo Fee Payment
                            </DialogTitle>
                            <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                                Revert a payment recorded by mistake
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <form onSubmit={handleConfirm} className="p-6 pt-2 space-y-4">
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
                            <span className="font-bold text-foreground">{paymentRow.month_name}</span>
                        </div>

                        <div className="flex items-center justify-between text-muted-foreground">
                            <span className="flex items-center gap-1.5 font-medium">
                                <CreditCard className="size-3.5" />
                                Amount Paid
                            </span>
                            <span className="font-extrabold text-destructive text-sm tabular-nums">
                                {formatCurrency(paymentRow.paid_amount || 0)}
                            </span>
                        </div>

                        {paymentRow.receipt_no && (
                            <div className="flex items-center justify-between text-muted-foreground">
                                <span className="flex items-center gap-1.5 font-medium">
                                    <Receipt className="size-3.5" />
                                    Receipt No.
                                </span>
                                <span className="font-mono text-[11px] font-semibold text-foreground">
                                    {paymentRow.receipt_no}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="text-xs text-muted-foreground bg-muted/40 p-3 rounded-lg border leading-relaxed">
                        ⚠️ Reverting will mark this payment as <strong>cancelled</strong>, restore the pending dues for <strong>{paymentRow.month_name}</strong>, and update the student&apos;s ledger.
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
                            placeholder="e.g. Paid by mistake, incorrect student selected, cash not received, duplicate entry..."
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
                            ) : (
                                <>
                                    <RotateCcw className="size-3.5 mr-1.5" />
                                    Confirm & Undo
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
