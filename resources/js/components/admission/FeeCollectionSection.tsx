import React from "react";
import { Control } from "react-hook-form";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { Banknote } from "lucide-react";
import type { ApplicationDeskFormValues } from "@/lib/validations/admission/application";
import { APPLICATION_DESK_PAYMENT_FIELDS } from "@/constants/admission/application";

interface FeeCollectionSectionProps {
  control: Control<ApplicationDeskFormValues>;
  watch: (name: keyof ApplicationDeskFormValues) => unknown;
  grandTotal: number;
}

export function FeeCollectionSection({
  control,
  watch,
  grandTotal,
}: FeeCollectionSectionProps) {
  const cashAmt = Number(watch("cash_amount")) || 0;
  const onlineAmt = Number(watch("online_amount")) || 0;
  const remaining = grandTotal - cashAmt - onlineAmt;
  const [cashField, onlineField, txnField] = APPLICATION_DESK_PAYMENT_FIELDS;

  return (
    <div className="space-y-4 rounded-xl border-2 border-dashed border-primary/20 bg-primary/[0.02] p-5">
      <div className="flex items-center gap-2">
        <Banknote className="size-5 text-primary" />
        <h3 className="font-semibold text-primary">Fee Collection</h3>
        <span className="text-xs text-muted-foreground">
          (optional — leave blank to collect later)
        </span>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ControlledFormComponent
            control={control as any}
            name={cashField.name as keyof ApplicationDeskFormValues}
            type={cashField.type}
            label={cashField.label}
            placeholder={cashField.placeholder}
            tooltip={cashField.tooltip}
          />
          <ControlledFormComponent
            control={control as any}
            name={onlineField.name as keyof ApplicationDeskFormValues}
            type={onlineField.type}
            label={onlineField.label}
            placeholder={onlineField.placeholder}
            tooltip={onlineField.tooltip}
          />
        </div>
        {onlineAmt > 0 && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <ControlledFormComponent
              control={control as any}
              name={txnField.name as keyof ApplicationDeskFormValues}
              type={txnField.type}
              label={
                <>
                  Transaction / UTR ID <span className="text-destructive">*</span>
                </>
              }
              placeholder={txnField.placeholder}
              tooltip={txnField.tooltip}
              maxLength={txnField.maxLength}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Enter the UTR or reference number from the QR/bank payment.
            </p>
          </div>
        )}
        {(cashAmt > 0 || onlineAmt > 0) && (
          <div
            className={`text-sm font-medium flex items-center gap-2 ${
              remaining === 0
                ? "text-green-600"
                : remaining < 0
                  ? "text-destructive"
                  : "text-amber-600"
            }`}
          >
            {remaining === 0
              ? "✓ Fully covered"
              : remaining > 0
                ? `₹${remaining.toLocaleString()} remaining`
                : `₹${Math.abs(remaining).toLocaleString()} over-collected`}
          </div>
        )}
      </div>
    </div>
  );
}
