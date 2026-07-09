import React from "react";
import { useFormContext } from "react-hook-form";
import { StepCard } from "../StepCard";
import { StepNavFooter } from "../StepNavFooter";
import { SectionHeader } from "../SectionHeader";
import { FormFieldsFromConfig } from "../FormFieldsFromConfig";
import type { ApplicationDeskFormValues } from "@/lib/validations/admission/application";
import {
  APPLICATION_DESK_STEP_LABELS,
  APPLICATION_DESK_STEP_SUBTITLES,
  APPLICATION_DESK_MEDICAL_FIELDS,
  APPLICATION_DESK_DOCUMENT_FIELDS,
  type ApplicationDeskFlowStep,
} from "@/constants/admission/application";
import { useInstitutionContent } from "@/hooks/useInstitutionContent";
interface DocProps {
  docFileNames: Record<string, string>;
  uploadingDocKey: string | null;
  fileInputRefs: React.RefObject<Record<string, HTMLInputElement | null>>;
  onDocUpload: (key: string, file: File) => void;
  onDocRemove: (key: string) => void;
}

interface MedicalDocumentsStepProps {
  stepKey: ApplicationDeskFlowStep;
  stepIndex: number;
  totalSteps: number;
  onBack: () => void;
  onContinue: () => void;
  docProps: DocProps;
}

export function MedicalDocumentsStep({
  stepKey,
  stepIndex,
  totalSteps,
  onBack,
  onContinue,
}: MedicalDocumentsStepProps) {
  const { control } = useFormContext<ApplicationDeskFormValues>();
  const content = useInstitutionContent();
  const contentMap = content as unknown as Record<string, string>;
  const stepLabel =
    contentMap[`step_${stepKey}`] ?? APPLICATION_DESK_STEP_LABELS[stepKey];
  const stepSubtitle =
    contentMap[`step_${stepKey}_subtitle`] ??
    APPLICATION_DESK_STEP_SUBTITLES[stepKey];
  const medicalFields = [...APPLICATION_DESK_MEDICAL_FIELDS];

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
        <div className="space-y-3">
          <SectionHeader title="Medical information" isFirstSection={true} />
          <FormFieldsFromConfig<ApplicationDeskFormValues>
            control={control}
            fields={medicalFields as any}
            columns="2"
            compact
            getClassName={(f) => (f.name === "allergy" ? "md:col-span-2" : "")}
          />
        </div>

        <div className="space-y-3">
          <SectionHeader title="Document upload" isFirstSection={false} />
          <p className="text-sm text-muted-foreground mb-4">
            Upload required documents (PDF or image). Drag and drop or click to upload. You can add or
            replace files before submitting.
          </p>
          <FormFieldsFromConfig<ApplicationDeskFormValues>
            control={control}
            fields={APPLICATION_DESK_DOCUMENT_FIELDS}
            columns="2"
            compact
          />
        </div>
      </div>
    </StepCard>
  );
}
