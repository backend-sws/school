import React from "react";
import { useFormContext } from "react-hook-form";
import { StepCard } from "../StepCard";
import { StepNavFooter } from "../StepNavFooter";
import { SectionHeader } from "../SectionHeader";
import { FormFieldsFromConfig, type FieldConfig } from "../FormFieldsFromConfig";
import type { ApplicationDeskFormValues } from "@/lib/validations/admission/application";
import {
  APPLICATION_DESK_STEP_LABELS,
  APPLICATION_DESK_STEP_SUBTITLES,
  type ApplicationDeskFlowStep,
} from "@/constants/admission/application";
import { useInstitutionContent } from "@/hooks/useInstitutionContent";

interface IdentityStepProps {
  stepKey: ApplicationDeskFlowStep;
  stepIndex: number;
  totalSteps: number;
  fields: FieldConfig[];
  onContinue: () => void;
}



export function IdentityStep({
  stepKey,
  stepIndex,
  totalSteps,
  fields,
  onContinue,
}: IdentityStepProps) {
  const { control } = useFormContext<ApplicationDeskFormValues>();
  const content = useInstitutionContent();
  const contentMap = content as unknown as Record<string, string>;
  const stepLabel =
    contentMap[`step_${stepKey}`] ?? APPLICATION_DESK_STEP_LABELS[stepKey];
  const stepSubtitle =
    contentMap[`step_${stepKey}_subtitle`] ??
    APPLICATION_DESK_STEP_SUBTITLES[stepKey];
  return (
    <StepCard
      title={stepLabel}
      subtitle={stepSubtitle}
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      className="shadow-none border-none rounded-none"
      footer={
        <StepNavFooter
          cancelHref="/admission/applications"
          onPrimary={onContinue}
          primaryLabel="Continue"
        />
      }
    >
      <div className="space-y-8">
        <FormFieldsFromConfig<ApplicationDeskFormValues>
          control={control}
          fields={fields}
          columns="2"
          compact={true}
          renderSectionHeader={(section, isFirst) => (
            <SectionHeader title={section} isFirstSection={isFirst} />
          )}
        />
      </div>
    </StepCard>
  );
}
