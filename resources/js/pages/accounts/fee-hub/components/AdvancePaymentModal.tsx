import React, { useEffect, useMemo, useState } from "react";
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
import { z } from "zod";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { FORM_TYPE } from "@/constants";
import { CalendarRange, CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { formatCurrency } from "@/constants/accounts/ledgerDetailConfig";

// ── Schema ──────────────────────────────────────────────────────────
const advancePaymentSchema = z.object({
    payment_mode: z.string().min(1, "Select payment mode"),
    cash_amount: z.number().min(0),
    online_amount: z.number().min(0),
    online_transaction_id: z.string().nullable().optional(),
    receipt_no: z.string().nullable().optional(),
    remarks: z.string().nullable().optional(),
    discount_amount: z.number().min(0).optional(),
    discount_reason: z.string().nullable().optional(),
    payment_date: z.string().nullable().optional(),
}).superRefine((data, ctx) => {
    const { payment_mode, online_amount, online_transaction_id } = data;
    const isOnlineInvolved = payment_mode === "online" || (payment_mode === "split" && online_amount > 0);
    if (isOnlineInvolved && !online_transaction_id?.trim()) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Online transaction ID is required",
            path: ["online_transaction_id"],
        });
    }
});

type AdvanceFormValues = z.infer<typeof advancePaymentSchema>;

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

// ── Props ───────────────────────────────────────────────────────────
interface AdvancePaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    student: any;
    matrix: any[];
    onSuccess: () => void;
}

export default function AdvancePaymentModal({
    isOpen,
    onClose,
    student,
    matrix,
    onSuccess,
}: AdvancePaymentModalProps) {
    // Only show unpaid months (balance > 0 and no payment recorded)
    const unpaidMonths = useMemo(
        () => matrix.filter((row: any) => {
            const hasPayment = Boolean(row.payment_id) || Number(row.paid_amount || 0) > 0 || row.status === "paid" || row.status === "partial";
            return Number(row.balance) > 0 && !hasPayment;
        }),
        [matrix],
    );

    const [selectedMonthKeys, setSelectedMonthKeys] = useState<Set<string>>(new Set());

    // Reset selection when modal opens
    useEffect(() => {
        if (isOpen) {
            setSelectedMonthKeys(new Set());
        }
    }, [isOpen]);

    const toggleMonth = (key: string) => {
        setSelectedMonthKeys((prev) => {
            const next = new Set(prev);
            if (next.has(key)) next.delete(key);
            else next.add(key);
            return next;
        });
    };

    const selectAll = () => {
        if (selectedMonthKeys.size === unpaidMonths.length) {
            setSelectedMonthKeys(new Set());
        } else {
            setSelectedMonthKeys(new Set(unpaidMonths.map((r: any) => r.month_key)));
        }
    };

    const selectedRows = useMemo(
        () => unpaidMonths.filter((r: any) => selectedMonthKeys.has(r.month_key)),
        [unpaidMonths, selectedMonthKeys],
    );

    /**
     * Calculate each row's actual payable amount.
     * For the first unpaid month: includes carried forward arrears (row.balance).
     * For subsequent months: charges only that month's own fees (total_payable - previous_dues).
     */
    const getRowPayable = (r: any): number => {
        const isFirstUnpaid = unpaidMonths.length > 0 && r.month_key === unpaidMonths[0]?.month_key;
        if (isFirstUnpaid) {
            return Math.max(0, Number(r.balance ?? r.total_payable ?? 0));
        }
        const monthOwn = Number(r.total_payable ?? 0) - Number(r.previous_dues ?? 0);
        return Math.max(0, monthOwn);
    };

    const totalAmount = useMemo(
        () => selectedRows.reduce((sum: number, r: any) => sum + getRowPayable(r), 0),
        [selectedRows, matrix],
    );

    const form = useForm<AdvanceFormValues>({
        resolver: zodResolver(advancePaymentSchema),
        defaultValues: {
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
    const currentDiscount = watch("discount_amount") || 0;
    const netAmount = Math.max(0, totalAmount - currentDiscount);

    useEffect(() => {
        if (isOpen) {
            reset({
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
    }, [isOpen, reset]);

    const collectMutation = useMutation({
        mutationFn: (data: any) => api.post("/fees/ledger/collect-advance", data),
        onSuccess: (res: any) => {
            toast.success(res?.data?.message || "Advance payment recorded successfully!");
            onSuccess();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to record advance payment.");
        },
    });

    const onSubmit = (data: AdvanceFormValues) => {
        if (selectedRows.length === 0) {
            toast.warning("Select at least one month.");
            return;
        }

        let finalCash = data.cash_amount;
        let finalOnline = data.online_amount;
        let finalMode = data.payment_mode;
        const discountAmount = data.discount_amount || 0;
        const netAmount = Math.max(0, totalAmount - discountAmount);

        if (netAmount === 0 && discountAmount > 0) {
            finalMode = "concession";
            finalCash = 0;
            finalOnline = 0;
        } else if (finalMode === "cash") {
            finalCash = netAmount;
            finalOnline = 0;
        } else if (finalMode === "online") {
            finalCash = 0;
            finalOnline = netAmount;
        }

        collectMutation.mutate({
            user_id: student.id,
            months: selectedRows.map((r: any) => ({
                for_month: r.month_key,
                amount: getRowPayable(r),
            })),
            total_amount: totalAmount,
            payment_mode: finalMode,
            payment_date: normalizeDate(data.payment_date) || getTodayDateString(),
            cash_amount: finalCash,
            online_amount: finalOnline,
            online_transaction_id: data.online_transaction_id || "",
            receipt_no: data.receipt_no,
            remarks: data.remarks,
            discount_amount: data.discount_amount,
            discount_reason: data.discount_reason,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[580px] border shadow-2xl p-0 overflow-hidden rounded-xl">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-xl font-bold flex items-center gap-2">
                        <CalendarRange className="size-5 text-primary" />
                        Advance Payment Collection
                    </DialogTitle>
                    <DialogDescription className="text-xs font-medium">
                        Select months to collect advance payment for{" "}
                        <span className="text-primary font-bold">{student.name}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="px-6 py-4 space-y-4 max-h-[60vh] overflow-y-auto">
                    {/* ── Month Selection Table ────────────────────── */}
                    <div className="border rounded-lg overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted hover:bg-muted">
                                    <TableHead className="w-[40px] text-center py-2">
                                        <Checkbox
                                            checked={selectedMonthKeys.size === unpaidMonths.length && unpaidMonths.length > 0}
                                            onCheckedChange={selectAll}
                                        />
                                    </TableHead>
                                    <TableHead className="py-2 text-[10px] font-bold uppercase tracking-wider">Month</TableHead>
                                    <TableHead className="py-2 text-right text-[10px] font-bold uppercase tracking-wider">Transport</TableHead>
                                    <TableHead className="py-2 text-right text-[10px] font-bold uppercase tracking-wider">Hostel & Mess</TableHead>
                                    <TableHead className="py-2 text-right text-[10px] font-bold uppercase tracking-wider">Other</TableHead>
                                    <TableHead className="py-2 text-right text-[10px] font-bold uppercase tracking-wider pr-4">Amount Due</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {unpaidMonths.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground text-sm">
                                            No unpaid months available
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    unpaidMonths.map((row: any) => {
                                        const isSelected = selectedMonthKeys.has(row.month_key);
                                        const isFirstRowWithArrears = unpaidMonths.length > 0 && row.month_key === unpaidMonths[0]?.month_key && Number(row.previous_dues) > 0;
                                        const rowPayable = getRowPayable(row);

                                        return (
                                            <TableRow
                                                key={row.month_key}
                                                className={cn(
                                                    "cursor-pointer transition-colors",
                                                    isSelected ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/30"
                                                )}
                                                onClick={() => toggleMonth(row.month_key)}
                                            >
                                                <TableCell className="text-center py-2.5">
                                                    <Checkbox
                                                        checked={isSelected}
                                                        onCheckedChange={() => toggleMonth(row.month_key)}
                                                    />
                                                </TableCell>
                                                <TableCell className="py-2.5 font-semibold text-sm">
                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                        <span>{row.month_name}</span>
                                                        {isFirstRowWithArrears && (
                                                            <Badge variant="outline" className="text-[9px] font-semibold text-amber-700 bg-amber-50 border-amber-200">
                                                                Incl. ₹{Number(row.previous_dues).toLocaleString()} Arrears
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-2.5 text-right tabular-nums text-sm">
                                                    {Number(row.transport_fee) > 0 ? formatCurrency(row.transport_fee) : "—"}
                                                </TableCell>
                                                <TableCell className="py-2.5 text-right tabular-nums text-sm">
                                                    {Number(row.hostel_fee) > 0 ? formatCurrency(row.hostel_fee) : "—"}
                                                </TableCell>
                                                <TableCell className="py-2.5 text-right tabular-nums text-sm">
                                                    {Number(row.other_fees) > 0 ? formatCurrency(row.other_fees) : "—"}
                                                </TableCell>
                                                <TableCell className="py-2.5 text-right tabular-nums text-sm font-bold text-foreground pr-4">
                                                    {formatCurrency(rowPayable)}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* ── Summary ───────────────────────────────────── */}
                    {selectedRows.length > 0 && (
                        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    {selectedRows.length} month{selectedRows.length > 1 ? "s" : ""} selected
                                </span>
                                <span className="text-lg font-black text-primary tabular-nums">
                                    ₹{totalAmount.toLocaleString()}
                                </span>
                            </div>
                            {currentDiscount > 0 && (
                                <div className="flex items-center justify-between pt-2 border-t border-primary/10">
                                    <span className="text-xs font-bold uppercase tracking-wider text-green-600">
                                        Discount Applied
                                    </span>
                                    <span className="text-sm font-bold text-green-600 tabular-nums">
                                        -₹{currentDiscount.toLocaleString()}
                                    </span>
                                </div>
                            )}
                            {currentDiscount > 0 && (
                                <div className="flex items-center justify-between pt-1">
                                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Net Payable
                                    </span>
                                    <span className="text-lg font-black text-primary tabular-nums">
                                        ₹{netAmount.toLocaleString()}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Payment Details ───────────────────────────── */}
                    {selectedRows.length > 0 && (
                        <div className="space-y-3 pt-2">
                            <div className="grid grid-cols-3 gap-3">
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
                                    onValueChange={(val: any) => {
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
                                <ControlledFormComponent
                                    control={control as any}
                                    name="receipt_no"
                                    type={FORM_TYPE.TEXT}
                                    label="Receipt / Reference"
                                    placeholder="Optional"
                                />
                            </div>

                            {mode === "split" && (
                                <div className="p-4 rounded-lg bg-muted/50 border space-y-3">
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

                            {(mode === "online" || (mode === "split" && onlineAmount > 0)) && (
                                <ControlledFormComponent
                                    control={control as any}
                                    name="online_transaction_id"
                                    type={FORM_TYPE.TEXT}
                                    label="Transaction ID / UTR"
                                    placeholder="Required for online payments"
                                />
                            )}

                            <div className="grid grid-cols-2 gap-4">
                                <ControlledFormComponent
                                    control={control as any}
                                    name="discount_amount"
                                    type={FORM_TYPE.NUMBER}
                                    label="Discount (₹)"
                                    placeholder="0"
                                />
                                <ControlledFormComponent
                                    control={control as any}
                                    name="discount_reason"
                                    type={FORM_TYPE.TEXT}
                                    label="Discount Reason"
                                    placeholder="Optional"
                                />
                            </div>

                            <ControlledFormComponent
                                control={control as any}
                                name="remarks"
                                type={FORM_TYPE.TEXT}
                                label="Internal Note"
                                placeholder="e.g. Advance for 3 months transport + hostel"
                            />
                        </div>
                    )}
                </div>

                <DialogFooter className="p-6 pt-0">
                    <Button
                        onClick={handleSubmit(onSubmit as any)}
                        disabled={collectMutation.isPending || selectedRows.length === 0}
                        className="w-full h-11 font-bold text-sm"
                    >
                        {collectMutation.isPending ? (
                            <><Loader2 className="size-4 animate-spin mr-2" /> Recording...</>
                        ) : (
                            <>
                                <CheckCircle2 className="size-4 mr-2" />
                                Collect ₹{netAmount.toLocaleString()} for {selectedRows.length} month{selectedRows.length > 1 ? "s" : ""}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
