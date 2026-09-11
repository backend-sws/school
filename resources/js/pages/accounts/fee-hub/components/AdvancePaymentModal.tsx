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
import { CalendarRange, CheckCircle2, Loader2, Sparkles } from "lucide-react";
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
    // Overall net arrears of the student across the entire session
    const totalStudentArrears = useMemo(() => {
        if (!matrix || matrix.length === 0) return 0;
        const validRows = matrix.filter((r: any) => r.month_key !== "arrears");
        const lastRow = validRows[validRows.length - 1];
        return Math.max(0, Number(lastRow?.balance ?? 0));
    }, [matrix]);

    // All session months with outstanding balance (excluding fully paid and phantom arrears)
    const unpaidMonths = useMemo(
        () => (matrix || []).filter((row: any) => {
            if (row.month_key === "arrears") return false;
            return row.status !== "paid" && Number(row.balance) > 0;
        }),
        [matrix],
    );

    const [selectedMonthKeys, setSelectedMonthKeys] = useState<Set<string>>(new Set());

    // Reset selection to all unpaid months when modal opens
    useEffect(() => {
        if (isOpen) {
            setSelectedMonthKeys(new Set(unpaidMonths.map((r: any) => r.month_key)));
        }
    }, [isOpen, unpaidMonths]);

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
     * FIFO allocation of actual outstanding fees across selected months.
     * Prevents overcharging when sporadic/partial payments exist.
     */
    const { allocatedMap, totalAmount } = useMemo(() => {
        const map: Record<string, number> = {};
        let remainingBalance = totalStudentArrears;
        let total = 0;

        selectedRows.forEach((r: any) => {
            const ownFee = Math.max(0, Number(r.total_payable ?? 0) - Number(r.previous_dues ?? 0));
            const paidAlready = Number(r.paid_amount ?? 0);
            const netUncollected = Math.max(0, ownFee - paidAlready);

            const alloc = Math.min(netUncollected, remainingBalance);
            map[r.month_key] = alloc;
            total += alloc;
            remainingBalance = Math.max(0, remainingBalance - alloc);
        });

        return { allocatedMap: map, totalAmount: total };
    }, [selectedRows, totalStudentArrears]);

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

        if (totalAmount <= 0) {
            toast.info("Selected months have already been covered by previous payments.");
            return;
        }

        let finalCash = data.cash_amount;
        let finalOnline = data.online_amount;
        let finalMode = data.payment_mode;
        const discountAmount = data.discount_amount || 0;
        const finalNetAmount = Math.max(0, totalAmount - discountAmount);

        if (finalNetAmount === 0 && discountAmount > 0) {
            finalMode = "concession";
            finalCash = 0;
            finalOnline = 0;
        } else if (finalMode === "cash") {
            finalCash = finalNetAmount;
            finalOnline = 0;
        } else if (finalMode === "online") {
            finalCash = 0;
            finalOnline = finalNetAmount;
        }

        // Send only months with positive allocation
        const payablePayload = selectedRows
            .map((r: any) => ({
                for_month: r.month_key,
                amount: allocatedMap[r.month_key] ?? 0,
            }))
            .filter((m: any) => m.amount > 0);

        collectMutation.mutate({
            user_id: student.id,
            months: payablePayload,
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
            <DialogContent className="sm:max-w-3xl md:max-w-4xl w-full max-h-[92vh] flex flex-col p-0 gap-0 overflow-hidden shadow-2xl rounded-2xl border border-border/70 bg-background">
                <DialogHeader className="p-5 pb-4 bg-muted/20 border-b shrink-0 pr-12">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                            <DialogTitle className="text-lg font-bold flex items-center gap-2">
                                <CalendarRange className="size-5 text-primary" />
                                Advance / Bulk Fee Payment
                            </DialogTitle>
                            <DialogDescription className="text-xs font-medium text-muted-foreground mt-0.5">
                                Select months to collect advance or outstanding fees for{" "}
                                <span className="text-primary font-bold">{student.name}</span>
                            </DialogDescription>
                        </div>
                        <Badge variant="outline" className="text-xs px-3 py-1 font-mono font-bold bg-amber-50 text-amber-800 border-amber-300 dark:bg-amber-950/40 dark:text-amber-400 self-start sm:self-auto">
                            Total Net Due: {formatCurrency(totalStudentArrears)}
                        </Badge>
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 min-h-0">
                    {/* ── Month Selection Table ────────────────────── */}
                    <div className="border border-border/70 rounded-xl overflow-hidden shadow-xs bg-card">
                        <div className="overflow-x-auto">
                            <Table className="min-w-[620px]">
                                <TableHeader>
                                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                                        <TableHead className="w-[45px] text-center py-2.5">
                                            <Checkbox
                                                checked={selectedMonthKeys.size === unpaidMonths.length && unpaidMonths.length > 0}
                                                onCheckedChange={selectAll}
                                            />
                                        </TableHead>
                                        <TableHead className="py-2.5 text-[11px] font-bold uppercase tracking-wider">Month</TableHead>
                                        <TableHead className="py-2.5 text-right text-[11px] font-bold uppercase tracking-wider">Monthly Fee</TableHead>
                                        <TableHead className="py-2.5 text-right text-[11px] font-bold uppercase tracking-wider">Other / Exam</TableHead>
                                        <TableHead className="py-2.5 text-right text-[11px] font-bold uppercase tracking-wider">Month Gross</TableHead>
                                        <TableHead className="py-2.5 text-right text-[11px] font-bold uppercase tracking-wider">Paid So Far</TableHead>
                                        <TableHead className="py-2.5 text-center text-[11px] font-bold uppercase tracking-wider">Status</TableHead>
                                        <TableHead className="py-2.5 text-right text-[11px] font-bold uppercase tracking-wider pr-4">Payable Now</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {unpaidMonths.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center py-10 text-muted-foreground text-sm">
                                                <CheckCircle2 className="size-6 text-emerald-500 mx-auto mb-1.5" />
                                                All fees for this session have been fully cleared!
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        unpaidMonths.map((row: any) => {
                                            const isSelected = selectedMonthKeys.has(row.month_key);
                                            const ownFee = Math.max(0, Number(row.total_payable ?? 0) - Number(row.previous_dues ?? 0));
                                            const monthlyFee = Number(row.monthly_total ?? 0);
                                            const otherFee = Math.max(0, ownFee - monthlyFee);
                                            const paidAmount = Number(row.paid_amount ?? 0);
                                            const allocated = allocatedMap[row.month_key] ?? 0;
                                            const isCoveredByOther = isSelected && allocated === 0;

                                            return (
                                                <TableRow
                                                    key={row.month_key}
                                                    className={cn(
                                                        "cursor-pointer transition-colors",
                                                        isSelected ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/30",
                                                        isCoveredByOther && "opacity-75"
                                                    )}
                                                    onClick={() => toggleMonth(row.month_key)}
                                                >
                                                    <TableCell className="text-center py-2.5" onClick={(e) => e.stopPropagation()}>
                                                        <Checkbox
                                                            checked={isSelected}
                                                            onCheckedChange={() => toggleMonth(row.month_key)}
                                                        />
                                                    </TableCell>
                                                    <TableCell className="py-2.5 font-semibold text-sm">
                                                        <span>{row.month_name}</span>
                                                    </TableCell>
                                                    <TableCell className="py-2.5 text-right tabular-nums text-sm">
                                                        {monthlyFee > 0 ? formatCurrency(monthlyFee) : "—"}
                                                    </TableCell>
                                                    <TableCell className="py-2.5 text-right tabular-nums text-sm">
                                                        {otherFee > 0 ? formatCurrency(otherFee) : "—"}
                                                    </TableCell>
                                                    <TableCell className="py-2.5 text-right tabular-nums text-sm font-medium">
                                                        {formatCurrency(ownFee)}
                                                    </TableCell>
                                                    <TableCell className="py-2.5 text-right tabular-nums text-sm text-muted-foreground">
                                                        {paidAmount > 0 ? formatCurrency(paidAmount) : "—"}
                                                    </TableCell>
                                                    <TableCell className="py-2.5 text-center">
                                                        <Badge
                                                            variant="outline"
                                                            className={cn(
                                                                "text-[10px] uppercase font-bold py-0.5 px-2",
                                                                row.status === "partial"
                                                                    ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400"
                                                                    : "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400"
                                                            )}
                                                        >
                                                            {row.status}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell className="py-2.5 text-right tabular-nums text-sm font-bold text-foreground pr-4">
                                                        {isSelected ? (
                                                            allocated > 0 ? (
                                                                <span className="text-primary">{formatCurrency(allocated)}</span>
                                                            ) : (
                                                                <Badge variant="outline" className="text-[10px] text-emerald-600 bg-emerald-50 border-emerald-200 font-normal">
                                                                    Covered
                                                                </Badge>
                                                            )
                                                        ) : (
                                                            <span className="text-muted-foreground/60">—</span>
                                                        )}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* ── Summary Card ───────────────────────────────── */}
                    {selectedRows.length > 0 && (
                        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                    {selectedRows.length} month{selectedRows.length > 1 ? "s" : ""} selected
                                </span>
                                <span className="text-xl font-bold font-mono text-primary">
                                    {formatCurrency(totalAmount)}
                                </span>
                            </div>
                            {currentDiscount > 0 && (
                                <div className="flex items-center justify-between pt-2 border-t border-primary/10">
                                    <span className="text-xs font-bold uppercase tracking-wider text-green-600">
                                        Discount Applied
                                    </span>
                                    <span className="text-sm font-bold text-green-600 tabular-nums">
                                        -{formatCurrency(currentDiscount)}
                                    </span>
                                </div>
                            )}
                            {currentDiscount > 0 && (
                                <div className="flex items-center justify-between pt-1">
                                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Net Payable
                                    </span>
                                    <span className="text-xl font-bold font-mono text-primary">
                                        {formatCurrency(netAmount)}
                                    </span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* ── Payment Details Form ───────────────────────── */}
                    {selectedRows.length > 0 && totalAmount > 0 && (
                        <div className="space-y-3 pt-2">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                                placeholder="e.g. Full settlement for academic session"
                            />
                        </div>
                    )}
                </div>

                <DialogFooter className="p-4 px-6 bg-muted/20 border-t shrink-0 flex items-center justify-between sm:justify-end gap-3">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={collectMutation.isPending}
                        className="px-4"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit(onSubmit as any)}
                        disabled={collectMutation.isPending || selectedRows.length === 0 || totalAmount <= 0}
                        className="h-10 px-6 font-bold text-sm shadow-md"
                    >
                        {collectMutation.isPending ? (
                            <><Loader2 className="size-4 animate-spin mr-2" /> Recording...</>
                        ) : (
                            <>
                                <CheckCircle2 className="size-4 mr-2" />
                                Collect {formatCurrency(netAmount)} for {selectedRows.length} month{selectedRows.length > 1 ? "s" : ""}
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
