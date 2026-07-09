import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ModalDialog } from "@/components/shared/Modal";
import { TotalSummaryCard } from "@/components/admission/TotalSummaryCard";
import { FormFieldsFromConfig } from "@/components/admission/FormFieldsFromConfig";
import {
  paymentDeskFormSchema,
  type PaymentDeskFormValues,
} from "@/lib/validations/admission/payment";
import {
  PAY_DESK_CONCESSION_FIELDS,
  PAY_DESK_PAYMENT_FIELDS,
} from "@/constants/admission/application";
import AdmissionApi from "@/lib/api/admissionApi";
import { ApplicationQueryKeys } from "@/lib/querykey/application";
import { computePaymentDeskTotals } from "@/lib/utils";

interface RecordPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicationId: number | string;
  application: Record<string, any>;
  scope?: "school" | "college";
}

export function RecordPaymentDialog({
  open,
  onOpenChange,
  applicationId,
  application,
  scope = "school",
}: RecordPaymentDialogProps) {
  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    setValue,
  } = useForm<PaymentDeskFormValues>({
    resolver: zodResolver(paymentDeskFormSchema) as any,
    defaultValues: {
      cash_amount: "" as unknown as number,
      online_amount: "" as unknown as number,
      remaining_due: Number(application?.due_amount ?? 0) as unknown as number,
      online_transaction_id: "",
      concession_amount: (application?.discount_amount ? Number(application.discount_amount) : "") as unknown as number,
      concession_reason: application?.discount_reason || "",
      notes: "",
    },
  });

  const cashAmount = watch("cash_amount");
  const onlineAmount = watch("online_amount");
  const concessionAmount = watch("concession_amount");

  const desk = computePaymentDeskTotals(
    application,
    { cash: Number(cashAmount) || 0, online: Number(onlineAmount) || 0 },
    concessionAmount !== "" && concessionAmount != null ? Number(concessionAmount) : undefined
  );
  const isOverCollection = desk.totalCollected > desk.dueAmount;
  const remainingBalance = Math.max(0, desk.remaining);

  useEffect(() => {
    if (open) {
      reset({
        cash_amount: "" as unknown as number,
        online_amount: "" as unknown as number,
        remaining_due: Number(application?.due_amount ?? 0) as unknown as number,
        online_transaction_id: "",
        concession_amount: (application?.discount_amount ? Number(application.discount_amount) : "") as unknown as number,
        concession_reason: application?.discount_reason || "",
        notes: "",
      });
    }
  }, [open, application, reset]);

  useEffect(() => {
    setValue("remaining_due", desk.dueAmount, { shouldValidate: true });
  }, [desk.dueAmount, setValue]);

  // Payment fields (PAY_DESK_PAYMENT_FIELDS already contains only cash, online, transaction ID, notes)
  const visiblePaymentFields = PAY_DESK_PAYMENT_FIELDS;

  const recordPaymentMutation = useMutation({
    mutationFn: (data: any) =>
      AdmissionApi.recordPayment(applicationId, data),
    onSuccess: () => {
      toast.success("Payment recorded successfully!");
      queryClient.invalidateQueries({
        queryKey: ApplicationQueryKeys.detail(applicationId),
      });
      reset();
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Failed to record payment.");
    },
  });

  const onSubmit = (data: PaymentDeskFormValues) => {
    const cash = Number(data.cash_amount) || 0;
    const online = Number(data.online_amount) || 0;
    const totalCollected = cash + online;

    if (totalCollected > desk.dueAmount) {
      toast.error("Collected amount cannot exceed remaining due amount.");
      return;
    }

    recordPaymentMutation.mutate({
      cash_amount: cash || undefined,
      online_amount: online || undefined,
      online_transaction_id:
        data.online_transaction_id?.trim() || undefined,
      concession_amount:
        data.concession_amount !== "" && data.concession_amount != null
          ? Number(data.concession_amount)
          : undefined,
      concession_reason:
        data.concession_amount !== "" && data.concession_amount != null && data.concession_reason?.trim()
          ? data.concession_reason.trim()
          : undefined,
      notes: data.notes?.trim() || undefined,
    });
  };

  const description = application?.applicant_name
    ? `Collect payment for ${application.applicant_name}`
    : "Collect payment for this application";

  return (
    <ModalDialog
      open={open}
      onClose={onOpenChange}
      title="Record Payment"
      description={description}
      className="sm:max-w-2xl"
      handleSubmit={handleSubmit(onSubmit)}
      submitLabel={
        recordPaymentMutation.isPending
          ? "Recording..."
          : "Confirm & Record Payment"
      }
      isLoading={recordPaymentMutation.isPending}
      primaryDisabled={desk.totalCollected <= 0 || isOverCollection}
    >
      <div className="space-y-5">
        {/* Due amount highlight */}
        {desk.dueAmount > 0 && (
          <div className="rounded-xl border-2 border-amber-400/50 bg-amber-50 dark:bg-amber-950/20 px-4 py-3 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-700 dark:text-amber-400">
                Outstanding Due
              </p>
              <p className="text-2xl font-black text-amber-700 dark:text-amber-300 tabular-nums">
                ₹{desk.dueAmount.toLocaleString()}
              </p>
            </div>
            {desk.alreadyPaid > 0 && (
              <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                  Already Paid
                </p>
                <p className="text-lg font-bold text-green-600 tabular-nums">
                  ₹{desk.alreadyPaid.toLocaleString()}
                </p>
              </div>
            )}
          </div>
        )}

        {desk.dueAmount === 0 && (
          <div className="rounded-xl border-2 border-green-400/50 bg-green-50 dark:bg-green-950/20 px-4 py-3 text-center">
            <p className="text-sm font-bold text-green-700 dark:text-green-400">
              ✓ All dues are cleared. No pending amount.
            </p>
          </div>
        )}

        {/* Fee breakdown */}
        <TotalSummaryCard
          feeTotal={desk.admissionFee}
          inventoryTotal={0}
          transportTotal={desk.transportAmount}
          hostelTotal={desk.hostelAmount}
          discountTotal={desk.concession}
          scope={scope}
          cashAmount={desk.existingCash}
          onlineAmount={desk.existingOnline}
          dueAmount={desk.dueAmount}
        />

        {/* Concession fields */}
        <section className="flex flex-col gap-4 p-4 rounded-xl bg-muted/20 border border-border/60">
          <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
            Concession / Discount
          </label>
          <FormFieldsFromConfig<PaymentDeskFormValues>
            control={control}
            columns="2"
            fields={PAY_DESK_CONCESSION_FIELDS as any}
          />
        </section>

        {/* Payment collection fields */}
        <section className="flex flex-col gap-4 p-4 rounded-xl bg-muted/20 border border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
              Fee Collection / Payment Details
            </label>
            <p className="text-sm font-semibold tabular-nums text-foreground">
              Amount to collect:{" "}
              <span className="text-blue-700 dark:text-blue-400">
                ₹{desk.dueAmount.toLocaleString()}
              </span>
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <FormFieldsFromConfig<PaymentDeskFormValues>
              control={control}
              columns="2"
              fields={visiblePaymentFields}
              renderSectionHeader={(section) => (
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground pt-2 first:pt-0 border-t border-border/40 first:border-t-0 mt-2 first:mt-0">
                  {section === "amounts"
                    ? "Payment amounts"
                    : "Payment details"}
                </p>
              )}
            />

            {/* Net received / remaining */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 border-t border-border/40">
              <div className="lg:col-span-12 flex flex-wrap items-center justify-end gap-x-8 gap-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-muted-foreground block tracking-wider">
                    Net Received
                  </span>
                  <span className="text-2xl font-black text-green-600 tabular-nums">
                    ₹{desk.totalCollected.toLocaleString()}
                  </span>
                </div>
                <div className="hidden sm:block h-10 w-px bg-border/60" />
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-muted-foreground block tracking-wider">
                    Remaining Balance
                  </span>
                  <span
                    className={`text-2xl font-black tabular-nums ${
                      remainingBalance > 0
                        ? "text-destructive"
                        : "text-foreground/40"
                    }`}
                  >
                    ₹{remainingBalance.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Status banner */}
        {desk.totalCollected > 0 && (
          <div
            className={`rounded-lg border px-4 py-3 text-sm font-medium ${
              isOverCollection
                ? "border-destructive/30 bg-destructive/10 text-destructive"
                : remainingBalance === 0
                ? "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-950/30 dark:text-green-300"
                : remainingBalance > 0
                ? "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300"
                : "border-destructive/30 bg-destructive/10 text-destructive"
            }`}
          >
            {isOverCollection
              ? `Over-collection is not allowed. Reduce by ₹${Math.abs(desk.remaining).toLocaleString()}.`
              : remainingBalance === 0
              ? "✓ Fully covered"
              : remainingBalance > 0
              ? `₹${remainingBalance.toLocaleString()} remaining`
              : "✓ Fully covered"}
          </div>
        )}
      </div>
    </ModalDialog>
  );
}
