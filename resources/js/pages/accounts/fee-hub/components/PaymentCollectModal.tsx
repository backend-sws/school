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
import { IndianRupee, Lock, Sparkles, Tag, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface PaymentCollectModalProps {
    isOpen: boolean;
    onClose: () => void;
    student: any;
    monthData: any;
    onSuccess: () => void;
}

const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
};

const normalizeDate = (d: any) => {
    if (!d) return undefined;
    if (typeof d === "string" && /^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
    try {
        const dateObj = new Date(d);
        if (!isNaN(dateObj.getTime())) {
            const y = dateObj.getFullYear();
            const m = String(dateObj.getMonth() + 1).padStart(2, "0");
            const day = String(dateObj.getDate()).padStart(2, "0");
            return `${y}-${m}-${day}`;
        }
    } catch {
        // ignore
    }
    return d;
};

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
            paid_amount: rawBalance,
            payment_mode: "cash",
            payment_date: getTodayDateString(),
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
    const rawPaidInput = watch("paid_amount");

    const netPayable = Math.max(0, rawBalance - discountAmount);
    const isFullWaiver = netPayable === 0 && discountAmount > 0;
    const paidAmount = isFullWaiver ? 0 : Number(rawPaidInput !== undefined ? rawPaidInput : netPayable);
    const remainingBalance = Math.max(0, netPayable - paidAmount);
    const isPartial = paidAmount > 0 && paidAmount < netPayable;
    const isFull = paidAmount >= netPayable && netPayable > 0;

    // Sync default amount when monthData changes or modal opens
    useEffect(() => {
        if (isOpen) {
            reset({
                amount: rawBalance,
                paid_amount: rawBalance,
                payment_mode: "cash",
                payment_date: getTodayDateString(),
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

    // Automatically adjust payment_mode and paid_amount when discount changes
    useEffect(() => {
        if (discountAmount >= rawBalance && rawBalance > 0) {
            setValue("payment_mode", "concession");
            setValue("paid_amount", 0);
            setValue("cash_amount", 0);
            setValue("online_amount", 0);
        } else if (mode === "concession" && netPayable > 0) {
            setValue("payment_mode", "cash");
            setValue("paid_amount", netPayable);
        } else if (paidAmount > netPayable) {
            setValue("paid_amount", netPayable);
        }
    }, [discountAmount, rawBalance, netPayable, mode, paidAmount, setValue]);

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
        setValue("paid_amount", 0, { shouldValidate: true });
        setValue("payment_mode", "concession");
    };

    const applyMonthFeeWaiver = () => {
        if (monthFee > 0) {
            const waived = Math.min(rawBalance, monthFee);
            setValue("discount_amount", waived, { shouldValidate: true });
            setValue("discount_reason", "Mid-session admission waiver (month fee)", { shouldValidate: true });
            setValue("paid_amount", Math.max(0, rawBalance - waived), { shouldValidate: true });
        }
    };

    const clearDiscount = () => {
        setValue("discount_amount", 0, { shouldValidate: true });
        setValue("discount_reason", "");
        setValue("paid_amount", rawBalance, { shouldValidate: true });
        setValue("payment_mode", "cash");
    };

    const onSubmit = (data: FeeCollectionFormValues) => {
        const fixedAmount = rawBalance;
        const discount = Number(data.discount_amount || 0);
        const currentNet = Math.max(0, fixedAmount - discount);
        const finalPaid = isFullWaiver ? 0 : Number(data.paid_amount ?? currentNet);

        let finalCash = data.cash_amount;
        let finalOnline = data.online_amount;
        let finalMode = data.payment_mode;

        if (currentNet === 0 || isFullWaiver) {
            finalMode = "concession";
            finalCash = 0;
            finalOnline = 0;
        } else if (finalMode === "cash") {
            finalCash = finalPaid;
            finalOnline = 0;
        } else if (finalMode === "online") {
            finalCash = 0;
            finalOnline = finalPaid;
        } else if (finalMode === "split") {
            const sum = (Number(finalCash) || 0) + (Number(finalOnline) || 0);
            if (Math.abs(sum - finalPaid) > 0.01) {
                toast.error(`Cash and online split (₹${sum}) must equal the required collection amount of ₹${finalPaid}`);
                return;
            }
        }

        collectMutation.mutate({
            user_id: student.id,
            for_month: monthData.month_key,
            amount: fixedAmount,
            paid_amount: finalPaid,
            payment_mode: finalMode,
            payment_date: normalizeDate(data.payment_date) || getTodayDateString(),
            cash_amount: finalCash,
            online_amount: finalOnline,
            online_transaction_id: data.online_transaction_id || "",
            receipt_no: data.receipt_no,
            remarks: data.remarks,
            discount_amount: discount,
            discount_reason: data.discount_reason,
        });
    };

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

                <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3.5">
                    {/* ── Concession / Waiver Section ── */}
                    <div className="rounded-lg border border-indigo-100 bg-indigo-50/20 p-3 space-y-2.5">
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

                        <div className="grid grid-cols-2 gap-3">
                            <ControlledFormComponent
                                control={control as any}
                                name="discount_amount"
                                type={FORM_TYPE.NUMBER}
                                label="Discount Amount (₹)"
                                placeholder="0.00"
                            />
                            <ControlledFormComponent
                                control={control as any}
                                name="discount_reason"
                                type={FORM_TYPE.TEXT}
                                label="Discount Reason"
                                placeholder="e.g. Mid-session waiver"
                            />
                        </div>
                    </div>

                    {/* ── Net Payable Summary ── */}
                    {discountAmount > 0 && (
                        <div className="bg-emerald-50/70 border border-emerald-200 rounded-md px-3 py-2 flex items-center justify-between text-xs">
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

                    {/* ── Payment Details (shown only if !isFullWaiver) ── */}
                    {!isFullWaiver && (
                        <div className="space-y-3">
                            {/* ── Amount to Collect / Paying Section ── */}
                            <div className="rounded-lg border border-primary/20 bg-primary/[0.02] p-3 space-y-2">
                                <div className="flex items-center justify-between gap-2">
                                    <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                        <IndianRupee className="size-3 text-primary" />
                                        <span>Amount Collected / Paying (₹)</span>
                                        <span className="text-rose-500">*</span>
                                    </label>
                                    <div className="flex items-center gap-1 flex-wrap justify-end">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setValue("paid_amount", netPayable, { shouldValidate: true })}
                                            className={cn(
                                                "h-6 text-[10px] px-2 font-semibold transition-colors",
                                                paidAmount === netPayable
                                                    ? "bg-primary/15 border-primary/40 text-primary hover:bg-primary/25"
                                                    : "bg-muted/80 hover:bg-muted text-muted-foreground"
                                            )}
                                        >
                                            Pay Full (₹{netPayable.toLocaleString()})
                                        </Button>
                                        {prevDues > 0 && monthFee > 0 && (
                                            <>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setValue("paid_amount", Math.min(monthFee, netPayable), { shouldValidate: true })}
                                                    className={cn(
                                                        "h-6 text-[10px] px-2 font-semibold transition-colors",
                                                        paidAmount === Math.min(monthFee, netPayable)
                                                            ? "bg-amber-100 border-amber-300 text-amber-900"
                                                            : "bg-muted/80 hover:bg-muted text-muted-foreground"
                                                    )}
                                                >
                                                    Month Only (₹{Math.min(monthFee, netPayable).toLocaleString()})
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setValue("paid_amount", Math.min(prevDues, netPayable), { shouldValidate: true })}
                                                    className={cn(
                                                        "h-6 text-[10px] px-2 font-semibold transition-colors",
                                                        paidAmount === Math.min(prevDues, netPayable)
                                                            ? "bg-amber-100 border-amber-300 text-amber-900"
                                                            : "bg-muted/80 hover:bg-muted text-muted-foreground"
                                                    )}
                                                >
                                                    Prev Dues (₹{Math.min(prevDues, netPayable).toLocaleString()})
                                                </Button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <ControlledFormComponent
                                    control={control as any}
                                    name="paid_amount"
                                    type={FORM_TYPE.NUMBER}
                                    placeholder={`Enter amount (max ₹${netPayable.toLocaleString()})`}
                                />

                                {/* Dynamic settlement message */}
                                {isPartial && (
                                    <div className="flex items-start gap-2 p-2.5 rounded-md bg-amber-50 border border-amber-200 text-amber-950 text-xs leading-relaxed">
                                        <Info className="size-3.5 text-amber-600 shrink-0 mt-0.5" />
                                        <div>
                                            <span className="font-bold text-amber-900 block">Partial Payment Note:</span>
                                            <span>
                                                ₹<strong>{paidAmount.toLocaleString()}</strong> collected now. The remaining balance of <strong>₹{remainingBalance.toLocaleString()}</strong> will carry forward and settle in the next month's ledger dues.
                                            </span>
                                        </div>
                                    </div>
                                )}

                                {isFull && (
                                    <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px]">
                                        <CheckCircle2 className="size-3.5 text-emerald-600 shrink-0" />
                                        <span><strong>Full Clearance:</strong> Clears all ₹{netPayable.toLocaleString()} dues for this month.</span>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
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
                                    name="payment_date"
                                    type={FORM_TYPE.DATE}
                                    label="Payment Date"
                                    placeholder="Select payment date"
                                />
                            </div>

                            <div className={`grid ${mode === "online" || (mode === "split" && Number(onlineAmount) > 0) ? "grid-cols-2" : "grid-cols-1"} gap-3`}>
                                <ControlledFormComponent
                                    control={control as any}
                                    name="receipt_no"
                                    type={FORM_TYPE.TEXT}
                                    label="Receipt / Reference"
                                    placeholder="Optional"
                                />

                                {(mode === "online" || (mode === "split" && Number(onlineAmount) > 0)) && (
                                    <ControlledFormComponent
                                        control={control as any}
                                        name="online_transaction_id"
                                        type={FORM_TYPE.TEXT}
                                        label="Transaction ID / UTR"
                                        placeholder="Required for online payments"
                                    />
                                )}
                            </div>

                            {mode === "split" && (
                                <div className="p-3 rounded-lg bg-muted/40 border grid grid-cols-2 gap-3">
                                    <ControlledFormComponent
                                        control={control as any}
                                        name="cash_amount"
                                        type={FORM_TYPE.NUMBER}
                                        label="Cash Pmt (₹)"
                                    />
                                    <ControlledFormComponent
                                        control={control as any}
                                        name="online_amount"
                                        type={FORM_TYPE.NUMBER}
                                        label="Online Pmt (₹)"
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {isFullWaiver && (
                        <div>
                            <ControlledFormComponent
                                control={control as any}
                                name="payment_date"
                                type={FORM_TYPE.DATE}
                                label="Waiver / Effective Date"
                                placeholder="Select date"
                            />
                        </div>
                    )}

                    <ControlledFormComponent
                        control={control as any}
                        name="remarks"
                        type={FORM_TYPE.TEXT}
                        label="Internal Remarks / Note"
                        placeholder="Optional remarks"
                    />
                </div>

                <DialogFooter className="px-5 py-3 border-t bg-muted/10 shrink-0">
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
                            : isPartial
                            ? `Collect ₹${paidAmount.toLocaleString()} & Update Ledger (₹${remainingBalance.toLocaleString()} Due in Next Month)`
                            : `Collect ₹${paidAmount.toLocaleString()} & Update Ledger`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
