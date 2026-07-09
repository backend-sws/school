import React, { useEffect, useMemo, useState } from "react";
import { ModalDialog } from "../shared/Modal";
import Each from "../Each";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import { useForm } from "react-hook-form";
import {
  CERTIFICATE_DIALOG_FORM_LAYOUT,
  CERTIFICATE_FORM_INITIAL_DATA,
} from "@/constants/page/admin/certificate";
import { useMutation, useQuery } from "@tanstack/react-query";
import StudentCertificateApi from "@/lib/api/certificateApi";
import { queryClient } from "@/lib/query.client";
import { FORM_TYPE } from "@/constants";
import SettingApi from "@/lib/api/settingApi";
import { ChevronLeft } from "lucide-react";
import { usePayment } from "@/hooks/usePaymentHook";

interface CertificateProps {
  open: boolean;
  onClose: (open: boolean) => void;
  data?: any | null;
}

export function CertificateApplyDialog({
  open,
  onClose,
  data,
}: CertificateProps) {
  const isEditMode = !!data?.id;
  const dataId = data?.id;
  const { mutate: startPayment, isPending: isPaymentLoading } = usePayment();

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: CERTIFICATE_FORM_INITIAL_DATA,
    mode: "onChange",
  });

  // ===============================
  // FETCH CERTIFICATE DETAILS
  // ===============================
  const { data: certificateResponse, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["certificate-detail", dataId],
    queryFn: () => StudentCertificateApi.getCertificateDetails(dataId),
    enabled: open && !!dataId,
  });
  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const { data: rulesResponse, isLoading: isRulesLoading } = useQuery({
    queryKey: ["certificate-rules"],
    queryFn: () => SettingApi.getSettingsByGroup("certificate_rules"),
    enabled: open,
  });

  const rulesData = rulesResponse?.data || [];

  const certificationInstruction =
    rulesData.find(
      (item: any) => item.setting_key === "certification_instruction",
    )?.setting_value || "";

  const certificateTC =
    rulesData.find((item: any) => item.setting_key === "certificate_tc")
      ?.setting_value || "";

  const terms =
    rulesResponse?.data?.find(
      (item: any) => item.key === "certificate_terms_conditions",
    )?.value || "";

  const certificateInfo = certificateResponse?.data?.certificate_info;
  const prefillData = certificateResponse?.data?.prefill_data;

  // ===============================
  // DYNAMIC CUSTOM FIELDS
  // ===============================
  const dynamicCustomFields = useMemo(() => {
    if (!certificateInfo?.custom_fields) return [];

    return certificateInfo.custom_fields.map((field: any, index: number) => ({
      name: `custom_data.${field.field_title
        .toLowerCase()
        .replace(/\s+/g, "_")}`,
      label: field.field_title,
      type: FORM_TYPE.TEXT,
      placeholder: field.description,
      required: field.is_required,
    }));
  }, [certificateInfo]);

  // ===============================
  // FINAL FORM LAYOUT
  // ===============================
  useEffect(() => {
    if (open) {
      setStep(1);
      setAgreed(false);
    }
  }, [open]);

  const dynamicSubjectFields = useMemo(() => {
    if (!prefillData?.subjects?.length) return [];

    return [
      {
        type: FORM_TYPE.TITLE,
        label: "Subjects Taken",
      },
      ...prefillData.subjects.map((sub: any, index: number) => ({
        name: `subjects_taken.${index}.name`,
        label: `Subject`,
        type: FORM_TYPE.TEXT,
        required: true,
        defaultValue: sub.name,
      })),
    ];
  }, [prefillData]);
  const formLayout = useMemo(() => {
    return [
      ...CERTIFICATE_DIALOG_FORM_LAYOUT,
      ...dynamicSubjectFields,
      ...dynamicCustomFields,
    ];
  }, [dynamicCustomFields, dynamicSubjectFields]);

  // ===============================
  // AUTO PREFILL DATA
  // ===============================

  useEffect(() => {
    if (!certificateResponse) return;

    const academic = prefillData?.academic_info?.[0];
    const address = prefillData?.permanent_address;
    const subjects = prefillData?.subjects;

    reset({
      purpose: certificateInfo?.description,

      // academic info
      academic_info: {
        institute_name: academic?.institute_name,
        class: academic?.class,
        roll_number: academic?.roll_number,
      },

      // address
      permanent_address: {
        village_mohalla: address?.village_mohalla,
        post_office: address?.post_office,
        pincode: address?.pincode,
      },

      // subjects repeater
      subjects_taken: subjects?.map((sub: any) => ({
        id: sub.id,
        name: sub.name,
        code: sub.code,
      })),

      custom_data: {},
    });
  }, [certificateResponse, reset]);

  // ===============================
  // SUBMIT
  // ===============================
  const { mutate: handleMutation, isPending: isSaving } = useMutation({
    mutationFn: (submitData: any) =>
      StudentCertificateApi.submitCertificate(submitData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["certificate-list"] });
      reset(CERTIFICATE_FORM_INITIAL_DATA);
      startPayment({
        id: dataId,
        type: "certificate",
      });

      onClose(false);
    },
  });

  const onSubmit = (formData: any) => {
    const payload = {
      ...formData,
      certificate_head_id: certificateInfo?.id,
    };

    handleMutation(payload);
  };

  return (
    <ModalDialog
      title="Apply for Certificate"
      open={open}
      onClose={onClose}
      onPrimaryClick={step === 1 ? () => setStep(2) : handleSubmit(onSubmit)}
      submitLabel={step === 1 ? "Next" : "Submit"}
      onSecondaryClick={step === 2 ? () => setStep(1) : undefined}
      secondaryLabel={
        step === 2 ? (
          <div className="flex items-center gap-1.5">
            <ChevronLeft className="size-4" />
            <span>Previous</span>
          </div>
        ) : undefined
      }
      primaryDisabled={step === 1 && !agreed}
      isLoading={isSaving || isLoadingDetail}
      className="sm:max-w-5xl max-h-[85vh]"
    >
      {/* Step Indicator */}

      {/* STEP 1 — TERMS */}
      {step === 1 && (
        <div className="space-y-6">
          {/* Instruction */}
          {certificationInstruction && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Instructions</h3>

              <div
                className="border rounded-md p-4 bg-muted/30 max-h-[200px] overflow-y-auto text-sm prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: certificationInstruction,
                }}
              />
            </div>
          )}

          {/* Terms & Conditions */}
          {certificateTC && (
            <div>
              <h3 className="text-sm font-semibold mb-2">Terms & Conditions</h3>

              <div
                className="border rounded-md p-4 bg-muted/30 max-h-[200px] overflow-y-auto text-sm prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: certificateTC,
                }}
              />
            </div>
          )}

          {/* Agreement Checkbox */}
          <div className="flex items-center gap-2 pt-2 border-t">
            <input
              type="checkbox"
              id="agree_tc"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="size-4"
            />

            <label
              htmlFor="agree_tc"
              className="text-sm font-medium cursor-pointer"
            >
              I have read and agree to the above instructions and terms
            </label>
          </div>
        </div>
      )}

      {/* STEP 2 — YOUR EXISTING FORM */}
      {step === 2 && (
        <div className="grid gap-2">
          <Each
            of={formLayout}
            render={(form: any) => (
              <ControlledFormComponent
                control={control}
                options={form.options}
                {...form}
              />
            )}
          />
        </div>
      )}
    </ModalDialog>
  );
}
