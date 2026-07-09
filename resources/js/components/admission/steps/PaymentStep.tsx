import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { StepCard } from "../StepCard";
import { StepNavFooter } from "../StepNavFooter";
import { TotalSummaryCard } from "../TotalSummaryCard";
import { SectionHeader } from "../SectionHeader";
import { FormFieldsFromConfig } from "../FormFieldsFromConfig";
import type { ApplicationDeskFormValues } from "@/lib/validations/admission/application";
import {
    APPLICATION_DESK_STEP_LABELS,
    APPLICATION_DESK_STEP_SUBTITLES,
    APPLICATION_DESK_CONCESSION_FIELDS,
    APPLICATION_DESK_PAYMENT_FIELDS,
    type ApplicationDeskFlowStep,
} from "@/constants/admission/application";
import { useInstitutionContent } from "@/hooks/useInstitutionContent";
import { computeFeeBreakdown, computePaymentSummary } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface PaymentStepProps {
    stepKey: ApplicationDeskFlowStep;
    stepIndex: number;
    totalSteps: number;
    onBack: () => void;
    onContinue: () => void;
}

export function PaymentStep({
    stepKey,
    stepIndex,
    totalSteps,
    onBack,
    onContinue,
}: PaymentStepProps) {
    const { control } = useFormContext<ApplicationDeskFormValues>();
    const content = useInstitutionContent();
    const contentMap = content as unknown as Record<string, string>;
    const stepLabel =
        contentMap[`step_${stepKey}`] ?? APPLICATION_DESK_STEP_LABELS[stepKey];
    const stepSubtitle =
        contentMap[`step_${stepKey}_subtitle`] ??
        APPLICATION_DESK_STEP_SUBTITLES[stepKey];

    // useWatch triggers re-renders on every field change — much more reliable than watch()
    const formValues = useWatch({ control });

    const { feeTotal, inventoryTotal, transportTotal, hostelTotal, discountTotal, grandTotal } = computeFeeBreakdown(formValues);
    const { totalPaid, dueAmount } = computePaymentSummary(formValues, grandTotal);
    const isOverPayment = totalPaid > grandTotal;
    const isPartialPayment = totalPaid > 0 && dueAmount > 0;

    return (
        <StepCard
            title={stepLabel}
            subtitle={stepSubtitle}
            stepIndex={stepIndex}
            totalSteps={totalSteps}
            className="shadow-none border-none rounded-none"
            footer={
                <StepNavFooter onBack={onBack} onPrimary={onContinue} primaryLabel="Review & Submit" />
            }
        >
            <div className="space-y-8">
                {/* 1. CONCESSION / DISCOUNT */}
                <div className="space-y-3">
                    <SectionHeader title="Concession / Discount" isFirstSection={true} />
                    <FormFieldsFromConfig<ApplicationDeskFormValues>
                        control={control}
                        columns="2"
                        compact={true}
                        fields={APPLICATION_DESK_CONCESSION_FIELDS as any}
                    />
                </div>

                {/* 2. Fee breakup + Grand Total */}
                <div>
                    <TotalSummaryCard
                        feeTotal={feeTotal}
                        inventoryTotal={inventoryTotal}
                        transportTotal={transportTotal}
                        hostelTotal={hostelTotal}
                        discountTotal={discountTotal}
                    />
                </div>

                {/* 3. FEE COLLECTION / PAYMENT DETAILS */}
                <div className="space-y-3">
                    <SectionHeader title="Fee Collection / Payment Details" isFirstSection={false} />
                    <div className="flex flex-col gap-4">
                        <FormFieldsFromConfig<ApplicationDeskFormValues>
                            control={control}
                            columns="2"
                            compact={true}
                            fields={APPLICATION_DESK_PAYMENT_FIELDS as any}
                        />

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6 border-t border-border/40">
                            <div className="lg:col-span-12 flex flex-wrap items-center justify-end gap-x-8 gap-y-4">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase text-muted-foreground block tracking-wider">Net Received</span>
                                    <span className="text-2xl font-black text-green-600 tabular-nums">₹{totalPaid.toLocaleString()}</span>
                                </div>
                                <div className="hidden sm:block h-10 w-px bg-border/60" />
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black uppercase text-muted-foreground block tracking-wider">Due Amount</span>
                                    <span className={`text-2xl font-black tabular-nums ${dueAmount > 0 ? "text-amber-500" : "text-green-600"}`}>
                                        ₹{dueAmount.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Overpayment block banner */}
                        {isOverPayment && (
                            <div className="flex items-start gap-3 p-3 rounded-none bg-destructive/10 border border-destructive/30 text-destructive">
                                <AlertCircle className="size-4 mt-0.5 shrink-0" />
                                <p className="text-xs font-medium leading-relaxed">
                                    <span className="font-bold">Overpayment not allowed.</span>{" "}
                                    Total payment cannot exceed the grand total. Please reduce cash/online amount before continuing.
                                </p>
                            </div>
                        )}

                        {/* Partial payment info banner */}
                        {!isOverPayment && isPartialPayment && (
                            <div className="flex items-start gap-3 p-3 rounded-none bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400">
                                <AlertCircle className="size-4 mt-0.5 shrink-0" />
                                <p className="text-xs font-medium leading-relaxed">
                                    <span className="font-bold">Partial payment detected.</span>{" "}
                                    ₹{dueAmount.toLocaleString()} will be recorded as due balance and can be collected later from the student&apos;s fee ledger.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </StepCard>
    );
}

