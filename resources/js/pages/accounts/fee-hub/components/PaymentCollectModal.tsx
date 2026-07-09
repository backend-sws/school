import React, { useEffect } from "react";
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
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { feeCollectionSchema, type FeeCollectionFormValues } from "@/lib/validations/feeCollection";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { FORM_TYPE } from "@/constants";
import { IndianRupee } from "lucide-react";

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
    onSuccess
}: PaymentCollectModalProps) {
    const form = useForm<FeeCollectionFormValues>({
        resolver: zodResolver(feeCollectionSchema),
        defaultValues: {
            amount: Number(monthData.balance) || 0,
            payment_mode: "cash",
            cash_amount: 0,
            online_amount: 0,
            online_transaction_id: "",
            receipt_no: "",
            remarks: "",
        },
        mode: "onChange",
    });

    const { control, handleSubmit, watch, setValue, reset } = form;
    const mode = watch("payment_mode");
    const amount = watch("amount");
    const onlineAmount = watch("online_amount");

    // Sync default amount when monthData changes
    useEffect(() => {
        if (isOpen) {
            reset({
                amount: Number(monthData.balance) || 0,
                payment_mode: "cash",
                cash_amount: 0,
                online_amount: 0,
                online_transaction_id: "",
                receipt_no: "",
                remarks: "",
            });
        }
    }, [isOpen, monthData, reset]);

    const collectMutation = useMutation({
        mutationFn: (data: any) => api.post("/fees/ledger/collect", data),
        onSuccess: () => {
            toast.success("Payment recorded successfully!");
            onSuccess();
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || "Failed to record payment.");
        }
    });

    const onSubmit = (data: FeeCollectionFormValues) => {
        // Calculate final cash/online based on mode before sending
        let finalCash = data.cash_amount;
        let finalOnline = data.online_amount;

        if (data.payment_mode === "cash") {
            finalCash = data.amount;
            finalOnline = 0;
        } else if (data.payment_mode === "online") {
            finalCash = 0;
            finalOnline = data.amount;
        }

        collectMutation.mutate({
            user_id: student.id,
            for_month: monthData.month_key,
            amount: data.amount,
            payment_mode: data.payment_mode,
            cash_amount: finalCash,
            online_amount: finalOnline,
            online_transaction_id: data.online_transaction_id || "",
            receipt_no: data.receipt_no,
            remarks: data.remarks,
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px] border shadow-2xl p-0 overflow-hidden rounded-xl">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="text-xl font-bold">Collect Payment</DialogTitle>
                    <DialogDescription className="text-xs font-medium">
                        Recording fees for <span className="text-primary font-bold">{student.name}</span> for <span className="font-bold">{monthData.month_name}</span>
                        {monthData.balance > 0 && (
                            <span className="block mt-1 text-muted-foreground">Amount due: ₹{Number(monthData.balance).toLocaleString()}</span>
                        )}
                    </DialogDescription>
                </DialogHeader>

                <div className="p-6 space-y-4">
                    <ControlledFormComponent
                        control={control as any}
                        name="amount"
                        type={FORM_TYPE.NUMBER}
                        label="Amount to record (₹)"
                        placeholder="0.00"
                        className="h-11"
                        leftElement={<IndianRupee className="w-4 h-4 text-muted-foreground" />}
                    />

                    <div className="grid grid-cols-2 gap-4">
                        <ControlledFormComponent
                            control={control as any}
                            name="receipt_no"
                            type={FORM_TYPE.TEXT}
                            label="Receipt / Reference"
                            placeholder="Optional"
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

                    <ControlledFormComponent
                        control={control as any}
                        name="remarks"
                        type={FORM_TYPE.TEXT}
                        label="Internal Note"
                        placeholder="Optional remarks"
                    />
                </div>

                <DialogFooter className="p-6 pt-0">
                    <Button
                        onClick={handleSubmit(onSubmit as any)}
                        disabled={collectMutation.isPending}
                        className="w-full h-11 font-bold text-sm"
                    >
                        {collectMutation.isPending ? "Recording..." : "Confirm & Update Ledger"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
