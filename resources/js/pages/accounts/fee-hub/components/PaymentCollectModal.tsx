import React, { useEffect, useMemo } from "react";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { feeCollectionSchema, type FeeCollectionFormValues } from "@/lib/validations/feeCollection";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { FORM_TYPE } from "@/constants";
import { IndianRupee, Lock, Sparkles, Tag, CheckCircle2 } from "lucide-react";

interface PaymentCollectModalProps {
    isOpen: boolean;
    onClose: () => void;
    student: any;
    monthData: any;
    onSuccess: () => void;
}

export default function PaymentCollectModal({
    isOpen,
    onClose,
    student,
    monthData,
    onSuccess,
}: PaymentCollectModalProps) {
    const rawBalance = Number(monthData?.balance ?? 0);
    const prevDues = Number(monthData?.previous_dues ?? 0);
    const monthFee = Number(monthData?.monthly_total ?? (rawBalance - prevDues));

    const form = useForm<FeeCollectionFormValues>({
        resolver: zodResolver(feeCollectionSchema),
        defaultValues: {
            amount: rawBalance,
            payment_mode: "cash",
            cash_amount: 0,
            online_amount: 0,
            online_transaction_id: "",
            receipt_no: "",
            remarks: "",
            discount_amount: 0,
            discount_reason: "",
        },
        mode: "onChange",
    });

    const { control, handleSubmit, watch, setValue, reset } = form;
    const mode = watch("payment_mode");
    const onlineAmount = watch("online_amount");
    const discountAmount = Number(watch("discount_amount") || 0);

    const netPayable = Math.max(0, rawBalance - discountAmount);

    // Sync default amount when monthData changes
    useEffect(() => {
        if (isOpen) {
            reset({
                amount: rawBalance,
                payment_mode: "cash",
                cash_amount: 0,
                online_amount: 0,
                online_transaction_id: "",
                receipt_no: "",
                remarks: "",
                discount_amount: 0,
                discount_reason: "",
            });
        }
    }, [isOpen, rawBalance, reset]);

    // Automatically set payment_mode to concession if 100% waived
    useEffect(() => {
        if (discountAmount >= rawBalance && rawBalance > 0) {
            setValue("payment_mode", "concession");
            setValue("cash_amount", 0);
            setValue("online_amount", 0);
        } else if (mode === "concession" && netPayable > 0) {
            setValue("payment_mode", "cash");
        }
    }, [discountAmount, rawBalance, netPayable, mode, setValue]);

    const collectMutation = useMutation({
        mutationFn: (data: any) => api.post("/fees/ledger/collect", data),
        onSuccess: (res: any) => {
            toast.success(res?.data?.message || "Payment recorded successfully!");
            onSuccess();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to record payment.");
        },
    });

    const applyFullWaiver = () => {
        setValue("discount_amount", rawBalance, { shouldValidate: true });
        setValue("discount_reason", "Mid-session admission waiver", { shouldValidate: true });
        setValue("payment_mode", "concession");
    };

    const applyMonthFeeWaiver = () => {
        if (monthFee > 0) {
            setValue("discount_amount", Math.min(rawBalance, monthFee), { shouldValidate: true });
            setValue("discount_reason", "Mid-session admission waiver (month fee)", { shouldValidate: true });
        }
    };

    const clearDiscount = () => {
        setValue("discount_amount", 0, { shouldValidate: true });
        setValue("discount_reason", "");
        setValue("payment_mode", "cash");
    };

    const onSubmit = (data: FeeCollectionFormValues) => {
        const fixedAmount = rawBalance;
        const discount = Number(data.discount_amount || 0);
        const currentNet = Math.max(0, fixedAmount - discount);

        let finalCash = data.cash_amount;
        let finalOnline = data.online_amount;
        let finalMode = data.payment_mode;

        if (currentNet === 0) {
            finalMode = "concession";
            finalCash = 0;
            finalOnline = 0;
        } else if (finalMode === "cash") {
            finalCash = currentNet;
            finalOnline = 0;
        } else if (finalMode === "online") {
            finalCash = 0;
            finalOnline = currentNet;
        } else if (finalMode === "split") {
            const sum = (Number(finalCash) || 0) + (Number(finalOnline) || 0);
            if (Math.abs(sum - currentNet) > 0.01) {
                toast.error(`Cash and online split (₹${sum}) must equal the required net total of ₹${currentNet}`);
                return;
            }
        }

        collectMutation.mutate({
            user_id: student.id,
            for_month: monthData.month_key,
            amount: fixedAmount,
            payment_mode: finalMode,
            cash_amount: finalCash,
            online_amount: finalOnline,
            online_transaction_id: data.online_transaction_id || "",
            receipt_no: data.receipt_no,
            remarks: data.remarks,
            discount_amount: discount,
            discount_reason: data.discount_reason,
        });
    };

    const isFullWaiver = netPayable === 0 && discountAmount > 0;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[460px] border shadow-2xl p-0 overflow-hidden rounded-xl">
                <DialogHeader className="p-6 pb-2">
                    <DialogTitle className="text-xl font-bold flex items-center justify-between">
                        <span>Collect Payment / Waiver</span>
                        <Badge variant="outline" className="text-xs font-semibold px-2.5 py-0.5">
                            {monthData?.month_name}
                        </Badge>
                    </DialogTitle>
                    <DialogDescription className="text-xs font-medium text-muted-foreground pt-1">
                        Recording financial transaction for <span className="text-primary font-bold">{student?.name}</span>
                    </DialogDescription>
                </DialogHeader>

                {/* ── Fee Breakdown Summary Card ── */}
                <div className="px-6">
                    <div className="bg-muted/40 border rounded-xl p-3.5 space-y-2">
                        {prevDues > 0 && (
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-amber-700 font-semibold flex items-center gap-1">
                                    Previous Dues / Arrears:
                                </span>
                                <span className="font-bold text-amber-800 tabular-nums">
                                    ₹{prevDues.toLocaleString()}
                                </span>
                            </div>
                        )}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Current Month Charge:</span>
                            <span className="font-semibold text-foreground tabular-nums">
                                ₹{Math.max(0, monthFee).toLocaleString()}
                            </span>
                        </div>
                        <div className="flex items-center justify-between pt-1.5 border-t border-border/70">
                            <span className="text-xs font-bold text-foreground">Total Balance Due:</span>
                            <span className="text-base font-black text-primary tabular-nums">
                                ₹{rawBalance.toLocaleString()}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-2 space-y-4 max-h-[60vh] overflow-y-auto">
                    {/* ── Solution 3: Concession / Waiver Section ── */}
                    <div className="rounded-xl border border-indigo-100 bg-indigo-50/20 p-3.5 space-y-2.5">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                                <Tag className="size-3.5 text-indigo-600" />
                                Discount / Concession / Waiver
                            </label>
                            {discountAmount > 0 && (
                                <button
                                    type="button"
                                    onClick={clearDiscount}
                                    className="text-[10px] font-semibold text-rose-600 hover:underline"
                                >
                                    Remove Discount
                                </button>
                            )}
                        </div>

                        {/* Quick waiver action buttons */}
                        <div className="flex flex-wrap items-center gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={applyFullWaiver}
                                className="h-7 text-[11px] px-2.5 bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-800 font-semibold flex items-center gap-1"
                            >
                                <Sparkles className="size-3 text-indigo-600" />
                                ⚡ 100% Full Waiver
                            </Button>
                            {prevDues > 0 && monthFee > 0 && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={applyMonthFeeWaiver}
                                    className="h-7 text-[11px] px-2.5 bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800 font-semibold"
                                >
                                    Waive Month Fee Only (₹{monthFee.toLocaleString()})
                                </Button>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-1">
                            <ControlledFormComponent
                                control={control as any}
                                name="discount_amount"
                                type={FORM_TYPE.NUMBER}
                                label="Discount Amount (₹)"
                                placeholder="0.00"
                                className="h-9 font-bold tabular-nums"
                            />
                            <ControlledFormComponent
                                control={control as any}
                                name="discount_reason"
                                type={FORM_TYPE.TEXT}
                                label="Discount Reason"
                                placeholder="e.g. Mid-session waiver"
                                className="h-9"
                            />
                        </div>
                    </div>

                    {/* ── Net Payable Summary ── */}
                    {discountAmount > 0 && (
                        <div className="bg-emerald-50/50 border border-emerald-200 rounded-lg p-3 flex items-center justify-between text-xs">
                            <div>
                                <span className="font-bold text-emerald-800 flex items-center gap-1">
                                    <CheckCircle2 className="size-3.5 text-emerald-600" />
                                    {isFullWaiver ? "100% Waived (No Payment Required)" : "Net Amount to Collect"}
                                </span>
                                <span className="text-[10px] text-muted-foreground">
                                    Original: ₹{rawBalance.toLocaleString()} | Discount: -₹{discountAmount.toLocaleString()}
                                </span>
                            </div>
                            <span className="text-lg font-black text-emerald-700 tabular-nums">
                                ₹{netPayable.toLocaleString()}
                            </span>
                        </div>
                    )}

                    {/* ── Payment Details (shown only if netPayable > 0) ── */}
                    {!isFullWaiver && (
                        <div className="space-y-3 pt-1">
                            <div className="grid grid-cols-2 gap-3">
                                <ControlledFormComponent
                                    control={control as any}
                                    name="receipt_no"
                                    type={FORM_TYPE.TEXT}
                                    label="Receipt / Reference"
                                    placeholder="Optional"
                                    className="h-9"
                                />
                                <ControlledFormComponent
                                    control={control as any}
                                    name="payment_mode"
                                    type={FORM_TYPE.SELECT}
                                    label="Payment Mode"
                                    options={[
                                        { value: "cash", key: "cash", text: "Cash" },
                                        { value: "online", key: "online", text: "Online / UPI" },
                                        { value: "split", key: "split", text: "Split Payment" },
                                    ]}
                                    onValueChange={(val) => {
                                        if (val !== "split") {
                                            setValue("cash_amount", 0);
                                            setValue("online_amount", 0);
                                        }
                                    }}
                                />
                            </div>

                            {mode === "split" && (
                                <div className="p-3 rounded-lg bg-muted/40 border space-y-2">
                                    <div className="grid grid-cols-2 gap-3">
                                        <ControlledFormComponent
                                            control={control as any}
                                            name="cash_amount"
                                            type={FORM_TYPE.NUMBER}
                                            label="Cash Pmt"
                                            className="h-9"
                                        />
                                        <ControlledFormComponent
                                            control={control as any}
                                            name="online_amount"
                                            type={FORM_TYPE.NUMBER}
                                            label="Online Pmt"
                                            className="h-9"
                                        />
                                    </div>
                                </div>
                            )}

                            {(mode === "online" || (mode === "split" && Number(onlineAmount) > 0)) && (
                                <ControlledFormComponent
                                    control={control as any}
                                    name="online_transaction_id"
                                    type={FORM_TYPE.TEXT}
                                    label="Transaction ID / UTR"
                                    placeholder="Required for online payments"
                                    className="h-9"
                                />
                            )}
                        </div>
                    )}

                    <ControlledFormComponent
                        control={control as any}
                        name="remarks"
                        type={FORM_TYPE.TEXT}
                        label="Internal Remarks / Note"
                        placeholder="Optional remarks"
                        className="h-9"
                    />
                </div>

                <DialogFooter className="p-6 pt-2">
                    <Button
                        onClick={handleSubmit(onSubmit as any)}
                        disabled={collectMutation.isPending}
                        className={`w-full h-11 font-bold text-sm ${
                            isFullWaiver ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""
                        }`}
                    >
                        {collectMutation.isPending
                            ? "Recording..."
                            : isFullWaiver
                            ? `Confirm & Waive Month (₹${discountAmount.toLocaleString()})`
                            : `Collect ₹${netPayable.toLocaleString()} & Update Ledger`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
