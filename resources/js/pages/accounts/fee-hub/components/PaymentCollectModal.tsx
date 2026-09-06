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
            <DialogContent className="sm:max-w-[540px] border shadow-2xl p-0 overflow-hidden rounded-xl max-h-[90vh] flex flex-col">
                <DialogHeader className="px-5 pt-4 pb-2">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-lg font-bold flex items-center gap-2">
                            <span>Collect Payment / Waiver</span>
                            <Badge variant="outline" className="text-xs font-semibold px-2 py-0.5 bg-muted/50">
                                {monthData?.month_name}
                            </Badge>
                        </DialogTitle>
                    </div>
                    <DialogDescription className="text-xs text-muted-foreground pt-0.5">
                        Recording transaction for <span className="text-foreground font-semibold">{student?.name}</span>
                    </DialogDescription>
                </DialogHeader>

                {/* ── Compact Fee Breakdown Summary Card ── */}
                <div className="px-5 pt-0.5">
                    <div className="bg-muted/40 border rounded-lg px-3.5 py-2 flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs">
                            {prevDues > 0 && (
                                <div className="border-r pr-4">
                                    <span className="text-[10px] text-amber-800 font-semibold uppercase tracking-wider block">Prev Dues</span>
                                    <span className="font-bold text-amber-900 tabular-nums">₹{prevDues.toLocaleString()}</span>
                                </div>
                            )}
                            <div>
                                <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider block">Month Fee</span>
                                <span className="font-semibold text-foreground tabular-nums">₹{Math.max(0, monthFee).toLocaleString()}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <span className="text-[10px] text-primary font-bold uppercase tracking-wider block">Total Due</span>
                            <span className="text-base font-black text-primary tabular-nums">₹{rawBalance.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                <div className="px-5 py-2 space-y-2.5 overflow-y-auto max-h-[calc(90vh-140px)]">
                    {/* ── Concession / Waiver Section ── */}
                    <div className="rounded-lg border border-indigo-100 bg-indigo-50/20 p-2.5 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                            <label className="text-xs font-bold text-indigo-950 flex items-center gap-1.5 shrink-0">
                                <Tag className="size-3 text-indigo-600" />
                                Discount / Waiver
                            </label>

                            {/* Quick action buttons on same line */}
                            <div className="flex items-center gap-1.5 flex-wrap justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={applyFullWaiver}
                                    className="h-6 text-[10px] px-2 bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-800 font-semibold flex items-center gap-1"
                                >
                                    <Sparkles className="size-2.5 text-indigo-600" />
                                    ⚡ 100% Full Waiver
                                </Button>
                                {prevDues > 0 && monthFee > 0 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={applyMonthFeeWaiver}
                                        className="h-6 text-[10px] px-2 bg-amber-50 hover:bg-amber-100 border-amber-200 text-amber-800 font-semibold"
                                    >
                                        Month Only (₹{monthFee.toLocaleString()})
                                    </Button>
                                )}
                                {discountAmount > 0 && (
                                    <button
                                        type="button"
                                        onClick={clearDiscount}
                                        className="text-[10px] font-semibold text-rose-600 hover:underline px-1"
                                    >
                                        Reset
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                            <ControlledFormComponent
                                control={control as any}
                                name="discount_amount"
                                type={FORM_TYPE.NUMBER}
                                label="Discount Amount (₹)"
                                placeholder="0.00"
                                className="h-8 font-bold tabular-nums text-xs"
                            />
                            <ControlledFormComponent
                                control={control as any}
                                name="discount_reason"
                                type={FORM_TYPE.TEXT}
                                label="Discount Reason"
                                placeholder="e.g. Mid-session waiver"
                                className="h-8 text-xs"
                            />
                        </div>
                    </div>

                    {/* ── Net Payable Summary ── */}
                    {discountAmount > 0 && (
                        <div className="bg-emerald-50/70 border border-emerald-200 rounded-md px-3 py-1.5 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                                <div>
                                    <span className="font-bold text-emerald-900 block leading-tight text-xs">
                                        {isFullWaiver ? "100% Waived (No Cash/Online Collection)" : "Net Payable Amount"}
                                    </span>
                                    <span className="text-[10px] text-muted-foreground">
                                        Original: ₹{rawBalance.toLocaleString()} | Discount: -₹{discountAmount.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                            <span className="text-base font-black text-emerald-700 tabular-nums">
                                ₹{netPayable.toLocaleString()}
                            </span>
                        </div>
                    )}

                    {/* ── Payment Details (shown only if netPayable > 0) ── */}
                    {!isFullWaiver && (
                        <div className="space-y-2">
                            <div className="grid grid-cols-2 gap-2.5">
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
                                <ControlledFormComponent
                                    control={control as any}
                                    name="receipt_no"
                                    type={FORM_TYPE.TEXT}
                                    label="Receipt / Reference"
                                    placeholder="Optional"
                                    className="h-8 text-xs"
                                />
                            </div>

                            {mode === "split" && (
                                <div className="p-2.5 rounded-lg bg-muted/40 border grid grid-cols-2 gap-2.5">
                                    <ControlledFormComponent
                                        control={control as any}
                                        name="cash_amount"
                                        type={FORM_TYPE.NUMBER}
                                        label="Cash Pmt (₹)"
                                        className="h-8 text-xs font-bold"
                                    />
                                    <ControlledFormComponent
                                        control={control as any}
                                        name="online_amount"
                                        type={FORM_TYPE.NUMBER}
                                        label="Online Pmt (₹)"
                                        className="h-8 text-xs font-bold"
                                    />
                                </div>
                            )}

                            {(mode === "online" || (mode === "split" && Number(onlineAmount) > 0)) && (
                                <ControlledFormComponent
                                    control={control as any}
                                    name="online_transaction_id"
                                    type={FORM_TYPE.TEXT}
                                    label="Transaction ID / UTR"
                                    placeholder="Required for online payments"
                                    className="h-8 text-xs"
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
                        className="h-8 text-xs"
                    />
                </div>

                <DialogFooter className="px-5 pt-1 pb-4">
                    <Button
                        onClick={handleSubmit(onSubmit as any)}
                        disabled={collectMutation.isPending}
                        className={`w-full h-10 font-bold text-xs shadow-md ${
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
