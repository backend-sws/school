import React, { useMemo, useEffect } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { StepCard } from "../StepCard";
import { StepNavFooter } from "../StepNavFooter";
import { SectionHeader } from "../SectionHeader";
import { FormFieldsFromConfig, type FieldConfig } from "../FormFieldsFromConfig";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import type { ApplicationDeskFormValues } from "@/lib/validations/admission/application";
import {
  APPLICATION_DESK_STEP_LABELS,
  APPLICATION_DESK_STEP_SUBTITLES,
  APPLICATION_DESK_CORRESPONDENCE_ADDRESS_FIELDS,
  APPLICATION_DESK_PERMANENT_ADDRESS_FIELDS,
  APPLICATION_DESK_GUARDIAN_FIELDS,
  APPLICATION_DESK_LOCAL_GUARDIAN_FIELDS,
  APPLICATION_DESK_EMERGENCY_CONTACT_FIELDS,
  PERMANENT_ADDRESS_TYPE_FIELD,
  HAS_LOCAL_GUARDIAN_FIELD,
  type ApplicationDeskFlowStep,
} from "@/constants/admission/application";
import { useInstitutionContent } from "@/hooks/useInstitutionContent";



interface AddressGuardianStepProps {
  stepKey: ApplicationDeskFlowStep;
  stepIndex: number;
  totalSteps: number;
  onBack: () => void;
  onContinue: () => void;
}

export function AddressGuardianStep({
  stepKey,
  stepIndex,
  totalSteps,
  onBack,
  onContinue,
}: AddressGuardianStepProps) {
  const { control, watch, setValue } = useFormContext<ApplicationDeskFormValues>();
  const content = useInstitutionContent();
  const contentMap = content as unknown as Record<string, string>;
  const stepLabel =
    contentMap[`step_${stepKey}`] ?? APPLICATION_DESK_STEP_LABELS[stepKey];
  const stepSubtitle =
    contentMap[`step_${stepKey}_subtitle`] ??
    APPLICATION_DESK_STEP_SUBTITLES[stepKey];

  const permanentAddressType = useWatch({ control, name: "permanent_address_type", defaultValue: "same" });
  const resolvedType = String(permanentAddressType ?? "same") as "same" | "different";
  const isSameAsCorrespondence = resolvedType === "same";
  const showDifferentAddressFields = resolvedType === "different";
  const corrLine1 = watch("address_snapshot.correspondence.line1") ?? "";
  const corrLine2 = watch("address_snapshot.correspondence.line2") ?? "";
  const corrCity = watch("address_snapshot.correspondence.city") ?? "";
  const corrState = watch("address_snapshot.correspondence.state") ?? "";
  const corrPincode = watch("address_snapshot.correspondence.pincode") ?? "";

  // When "Same as correspondence" is selected, keep permanent in sync so submit has correct data
  useEffect(() => {
    if (!isSameAsCorrespondence) return;
    setValue("address_snapshot.permanent", {
      line1: corrLine1,
      line2: corrLine2,
      city: corrCity,
      state: corrState,
      pincode: corrPincode,
    });
  }, [isSameAsCorrespondence, corrLine1, corrLine2, corrCity, corrState, corrPincode, setValue]);

  const correspondenceFields = useMemo((): FieldConfig[] => {
    return [...APPLICATION_DESK_CORRESPONDENCE_ADDRESS_FIELDS].map((f, i) => ({
      ...f,
      section: i === 0 ? ("Correspondence address" as const) : undefined,
    })) as FieldConfig[];
  }, []);

  const permanentTypeRadioField: FieldConfig = useMemo(
    () => ({
      ...PERMANENT_ADDRESS_TYPE_FIELD,
      section: "Permanent address" as const,
    }),
    []
  );

  const permanentFields = useMemo(
    () => [...APPLICATION_DESK_PERMANENT_ADDRESS_FIELDS] as FieldConfig[],
    []
  );

  const guardianFields = useMemo((): FieldConfig[] => {
    return [...APPLICATION_DESK_GUARDIAN_FIELDS].map((f, i) => ({
      ...f,
      section: i === 0 ? ("Guardian details" as const) : undefined,
    })) as FieldConfig[];
  }, []);

  const hasLocalGuardian = useWatch({ control, name: "has_local_guardian", defaultValue: false });
  const localGuardianCheckbox: FieldConfig = useMemo(
    () => ({ ...HAS_LOCAL_GUARDIAN_FIELD, section: "Local guardian" as const }),
    []
  );
  const localGuardianFields = useMemo(() => [...APPLICATION_DESK_LOCAL_GUARDIAN_FIELDS] as FieldConfig[], []);
  const emergencyContactFields = useMemo((): FieldConfig[] => {
    return [...APPLICATION_DESK_EMERGENCY_CONTACT_FIELDS].map((f, i) => ({
      ...f,
      section: i === 0 ? ("Emergency contact" as const) : undefined,
    })) as FieldConfig[];
  }, []);

  return (
    <StepCard
      title={stepLabel}
      subtitle={stepSubtitle}
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      className="shadow-none border-none rounded-none"
      footer={
        <StepNavFooter onBack={onBack} onPrimary={onContinue} primaryLabel="Continue" />
      }
    >
      <div className="space-y-8">
        <FormFieldsFromConfig<ApplicationDeskFormValues>
          control={control}
          fields={correspondenceFields}
          columns="2"
          compact
          renderSectionHeader={(section, isFirst) => (
            <SectionHeader title={section} isFirstSection={isFirst} />
          )}
        />

        <div className="space-y-3">
          <SectionHeader title="Permanent address" isFirstSection={false} />
          <FormFieldsFromConfig<ApplicationDeskFormValues>
            control={control}
            fields={[permanentTypeRadioField]}
            columns="2"
            compact
          />
          {isSameAsCorrespondence ? (
            <p className="text-sm text-muted-foreground">
              Permanent address will be the same as the correspondence address above. No need to enter it again.
            </p>
          ) : null}
          {showDifferentAddressFields ? (
            <div className="pt-0.5">
              <FormFieldsFromConfig<ApplicationDeskFormValues>
                control={control}
                fields={permanentFields}
                columns="2"
                compact
              />
            </div>
          ) : null}
        </div>

        <FormFieldsFromConfig<ApplicationDeskFormValues>
          control={control}
          fields={guardianFields}
          columns="2"
          compact
          renderSectionHeader={(section) => <SectionHeader title={section} isFirstSection={false} />}
        />

        <div className="space-y-3">
          <SectionHeader title="Local guardian" isFirstSection={false} />
          <div className="flex items-center gap-2">
            <Controller
              name="has_local_guardian"
              control={control}
              render={({ field }) => (
                <Switch
                  id="has_local_guardian"
                  checked={!!field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
            <Label htmlFor="has_local_guardian" className="text-sm font-normal cursor-pointer">
              Has local guardian
            </Label>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className="size-4 text-muted-foreground shrink-0" aria-hidden />
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs">
                  <p>Turn on if there is a local guardian (e.g. relative in city) for emergencies or local contact.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {hasLocalGuardian ? (
            <div className="pt-0.5">
              <FormFieldsFromConfig<ApplicationDeskFormValues>
                control={control}
                fields={localGuardianFields}
                columns="2"
                compact
              />
            </div>
          ) : null}
        </div>

        <FormFieldsFromConfig<ApplicationDeskFormValues>
          control={control}
          fields={emergencyContactFields}
          columns="2"
          compact
          renderSectionHeader={(section) => <SectionHeader title={section} isFirstSection={false} />}
        />
      </div>
    </StepCard>
  );
}
