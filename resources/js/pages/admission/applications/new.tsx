import React, { useMemo, useRef, useState, useCallback, useEffect } from "react";
import FullPageLayout from "@/layouts/full-page-layout";
import { Head, router, usePage } from "@inertiajs/react";
import { FormProvider } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import AdmissionApi from "@/lib/api/admissionApi";
import SessionApi from "@/lib/api/sessionApi";
import MainStreamApi from "@/lib/api/mainStreamApi";
import StreamApi from "@/lib/api/streamApi";
import { computeFeeBreakdown, computePaymentSummary } from "@/lib/utils";
import { MainStreamQueryKeys } from "@/lib/querykey/mainStream";
import { StreamQueryKeys } from "@/lib/querykey/stream";

import {
  APPLICATION_DESK_BASIC_FIELDS,
  APPLICATION_DESK_FLOW_STEPS,
  ADMISSION_STEP_CONFIG,
  SLUG_TO_STEP_KEY,
  STEP_KEY_TO_SLUG,
  APPLICATION_DESK_DOCUMENT_TYPES,
  type ApplicationDeskFlowStep,
} from "@/constants/admission/application";
import { useInstitutionContent } from "@/hooks/useInstitutionContent";
import { useAdmissionFormStore } from "@/hooks/useAdmissionFormStore";
import { StepHeader, type StepItem } from "@/components/shared/StepHeader";
import R2Api from "@/lib/api/r2Api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { IdentityStep } from "@/components/admission/steps/IdentityStep";
import { AddressGuardianStep } from "@/components/admission/steps/AddressGuardianStep";
import { MedicalDocumentsStep } from "@/components/admission/steps/MedicalDocumentsStep";
import { AcademicStep } from "@/components/admission/steps/AcademicStep";
import { ServicesStep } from "@/components/admission/steps/ServicesStep";
import { PaymentStep } from "@/components/admission/steps/PaymentStep";
import { ReviewStep } from "@/components/admission/steps/ReviewStep";
import {
  User,
  MapPin,
  FileText,
  GraduationCap,
  Wallet,
  CreditCard,
  ClipboardCheck,
} from "lucide-react";

import { NEW_APPLICATION_BREADCRUMBS } from "@/constants/page/admin/admission";

/* ─── Icon lookup for StepHeader ────────────────────────────────────── */
const STEP_ICON_MAP: Record<string, React.ReactNode> = {
  User: <User className="size-4" />,
  MapPin: <MapPin className="size-4" />,
  FileText: <FileText className="size-4" />,
  GraduationCap: <GraduationCap className="size-4" />,
  Wallet: <Wallet className="size-4" />,
  CreditCard: <CreditCard className="size-4" />,
  ClipboardCheck: <ClipboardCheck className="size-4" />,
};

const STEP_HEADER_ITEMS: StepItem[] = ADMISSION_STEP_CONFIG.map((s) => ({
  key: s.key,
  label: s.label,
  icon: STEP_ICON_MAP[s.iconName],
}));

/* ─── Helpers ───────────────────────────────────────────────────────── */
const BASE_PATH = "/admission/applications/new";

function navigateToStep(slug: string) {
  router.visit(`${BASE_PATH}/${slug}`, { preserveState: false });
}

/* ─── Page Component ────────────────────────────────────────────────── */

const ApplicationsNew = () => {
  const { step: stepSlug = "identity" } = usePage<{ step: string }>().props;
  const flowStep: ApplicationDeskFlowStep = SLUG_TO_STEP_KEY[stepSlug] ?? "identity";

  const form = useAdmissionFormStore();
  const { control, handleSubmit, watch, trigger, setValue, getValues, clearStorage, saveNow, resetForm } = form;

  const [uploadingDocType, setUploadingDocType] = useState<string | null>(null);
  const [docFileNames, setDocFileNames] = useState<Record<string, string>>({});
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const queryClient = useQueryClient();
  const content = useInstitutionContent();


  const [prefilled, setPrefilled] = useState(false);
  /* ── Read edit_id from URL and prefill ─────────────────────────── */
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const editId = params.get("edit_id");
    if (editId && !prefilled) {
      AdmissionApi.show(Number(editId)).then((res) => {
        setPrefilled(true);
        const appData = (res as { data?: Record<string, any> })?.data;
        if (appData && (form as any).prefillFromApplication) {
          (form as any).prefillFromApplication(appData);
        }
      });
    }
  }, [prefilled, form]);

  /* ── Completed steps tracking ─────────────────────────────────────── */
  const currentStepIdx = APPLICATION_DESK_FLOW_STEPS.indexOf(flowStep);
  const completedSteps = useMemo(
    () => APPLICATION_DESK_FLOW_STEPS.slice(0, currentStepIdx),
    [currentStepIdx],
  );

  /* ── Data queries ─────────────────────────────────────────────────── */
  const { data: currentSessionRes } = useQuery({
    queryKey: ["sessions-current"],
    queryFn: async () => {
      const res = await SessionApi.getCurrentSession();
      const body = (res as { data?: { data?: { id: number; name: string } | null } })?.data;
      return body?.data ?? null;
    },
  });

  const currentSessionId = currentSessionRes?.id ?? null;

  const streamId = watch("stream_id");
  const classId = watch("class_id");
  const prevStreamIdRef = useRef<string | number | undefined>(streamId);
  const isMountedRef = useRef(false);
  const isSubmittingRef = useRef(false);

  // Clear class_id whenever stream_id changes (skip the initial mount to preserve sessionStorage)
  useEffect(() => {
    if (!isMountedRef.current) {
      isMountedRef.current = true;
      prevStreamIdRef.current = streamId;
      return;
    }
    if (String(prevStreamIdRef.current) !== String(streamId)) {
      setValue("class_id", "", { shouldValidate: false });
    }
    prevStreamIdRef.current = streamId;
  }, [streamId, setValue]);

  /* ── Field options with institution content (identity step only) ──── */
  const basicFieldsWithOptions = useMemo(
    () =>
      APPLICATION_DESK_BASIC_FIELDS.filter((f) => f.name !== "stream_id").map((field) => {
        const SECTION_OVERRIDE_MAP: Record<string, string> = {
          "Academic details": content.form_section_academic_details,
          "Applicant details": content.form_section_applicant_details,
          "Additional details": content.form_section_additional_details,
        };
        const sectionOverride = (field.section && SECTION_OVERRIDE_MAP[field.section]) || field.section;
        return { ...field, section: sectionOverride };
      }),
    [content],
  );

  /* ── Lightweight label lookups for ReviewStep ─────────────────────── */
  const { data: mainStreamDetail } = useQuery({
    queryKey: [...MainStreamQueryKeys.detail(streamId as number)],
    queryFn: () => MainStreamApi.getMainStreamById(String(streamId)),
    enabled: !!streamId,
  });

  const { data: classDetail } = useQuery({
    queryKey: [...StreamQueryKeys.detail(classId as number)],
    queryFn: () => StreamApi.show(classId as number),
    enabled: !!classId,
  });

  /* ── Mutation ──────────────────────────────────────────────────────── */
  const createMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => AdmissionApi.store(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["admission-applications"] });
      clearStorage();
      const body = res as { data?: { id?: number }; id?: number };
      const id = body?.data?.id ?? body?.id;
      toast.success("Application created successfully.");
      if (id != null && !isNaN(Number(id))) {
        window.location.href = `/admission/applications/${id}`;
      } else {
        window.location.href = "/admission/applications";
      }
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? err?.message ?? "Failed to create application.";
      const validationErrors = err?.response?.data?.errors;
      if (validationErrors && typeof validationErrors === "object") {
        const firstMsg = Object.values(validationErrors).flat()[0];
        toast.error(firstMsg ?? msg);
      } else {
        toast.error(msg);
      }
    },
    onSettled: () => {
      isSubmittingRef.current = false;
    },
  });

  /* ── Update Mutation */
  const updateMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) => AdmissionApi.update(payload.id as number, payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["admission-applications"] });
      clearStorage();
      const body = res as { data?: { id?: number }; id?: number };
      const id = body?.data?.id ?? body?.id;
      toast.success("Application updated successfully.");
      if (id != null && !isNaN(Number(id))) {
        window.location.href = `/admission/applications/${id}`;
      } else {
        window.location.href = "/admission/applications";
      }
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? err?.message ?? "Failed to create application.";
      const validationErrors = err?.response?.data?.errors;
      if (validationErrors && typeof validationErrors === "object") {
        const firstMsg = Object.values(validationErrors).flat()[0];
        toast.error(firstMsg ?? msg);
      } else {
        toast.error(msg);
      }
    },
    onSettled: () => {
      isSubmittingRef.current = false;
    },
  });


  /* ── Step navigation ──────────────────────────────────────────────── */
  const goToStep = useCallback(
    (stepKey: ApplicationDeskFlowStep) => {
      saveNow();
      navigateToStep(STEP_KEY_TO_SLUG[stepKey]);
    },
    [saveNow],
  );

  const onContinueFromIdentity = async () => {
    const isValid = await trigger([
      "applicant_name", "dob", "gender", "father_name", "mother_name", "category", "mobile", "email",
    ]);
    if (isValid) {
      goToStep("address_guardian");
    } else {
      toast.error("Please fill all required identity and contact fields before continuing.");
    }
  };

  const onContinueFromAddressGuardian = async () => {
    const isValid = await trigger([
      "address_snapshot", "guardian_snapshot", "permanent_address_type", "has_local_guardian",
    ]);
    if (isValid) {
      goToStep("medical_documents");
    } else {
      toast.error("Please complete address and guardian details before continuing.");
    }
  };

  const onContinueFromMedicalDocuments = async () => {
    const isValid = await trigger([
      "documents", "medical_condition", "disability", "allergy",
    ]);
    if (isValid) {
      goToStep("academic");
    } else {
      toast.error("Please upload all required documents before continuing.");
    }
  };

  const onContinueFromAcademic = async () => {
    const isValid = await trigger(["stream_id", "class_id"]);
    if (isValid) {
      goToStep("services");
    } else {
      toast.error("Please select stream and class before continuing.");
    }
  };

  const onContinueFromServices = async () => {
    const isValid = await trigger([
      "fees", "inventory_items", "transport_stop_id", "transport_amount",
      "hostel_required", "hostel_amount", "discount_amount", "discount_reason",
    ]);
    if (isValid) {
      goToStep("payment");
    } else {
      toast.error("Please fix fees or services before continuing.");
    }
  };

  const onContinueFromPayment = async () => {
    const paymentValues = getValues();
    const { grandTotal } = computeFeeBreakdown(paymentValues);
    const { totalPaid } = computePaymentSummary(paymentValues, grandTotal);

    if (totalPaid > grandTotal) {
      toast.error("Overpayment is not allowed. Please reduce collected amount before continuing.");
      return;
    }

    const isValid = await form.trigger([
      "cash_amount", "online_amount", "online_transaction_id",
    ]);
    if (isValid) {
      goToStep("review");
    } else {
      toast.error("Please fix payment validation errors before continuing.");
    }
  };

  const onBack = () => {
    const idx = APPLICATION_DESK_FLOW_STEPS.indexOf(flowStep);
    if (idx > 0) goToStep(APPLICATION_DESK_FLOW_STEPS[idx - 1]);
  };

  const handleStepClick = useCallback(
    (key: string) => {
      const targetKey = key as ApplicationDeskFlowStep;
      const targetIdx = APPLICATION_DESK_FLOW_STEPS.indexOf(targetKey);
      // Only allow going back to completed steps
      if (targetIdx < currentStepIdx) {
        goToStep(targetKey);
      }
    },
    [currentStepIdx, goToStep],
  );

  /* ── Submit ────────────────────────────────────────────────────────── */
  const getFirstErrorMessage = (errs: Record<string, any>): string | null => {
    if (!errs || typeof errs !== "object") return null;
    for (const key of Object.keys(errs)) {
      const v = errs[key];
      if (v?.message) return v.message;
      if (typeof v === "object" && v !== null && !Array.isArray(v)) {
        const nested = getFirstErrorMessage(v);
        if (nested) return nested;
      }
    }
    return null;
  };



  const generatePayload = (values: any, isDraft = false) => {
    const { grandTotal, discountTotal } = computeFeeBreakdown(values);
    const { dueAmount } = computePaymentSummary(values, grandTotal);

    return {

      id: values.id || undefined,
      application_type: "new",
      process_status: isDraft ? "draft" : "pending",
      stream_id: values.stream_id ? Number(values.stream_id) : undefined,
      class_id: values.class_id ? Number(values.class_id) : undefined,
      applicant_name: values.applicant_name,
      father_name: values.father_name || undefined,
      mother_name: values.mother_name || undefined,
      dob: values.dob || undefined,
      gender: values.gender || undefined,
      category: values.category || undefined,
      caste: values.caste || undefined,
      religion: values.religion || undefined,
      nationality: values.nationality || undefined,
      blood_group: values.blood_group || undefined,
      aadhaar_no: values.aadhaar_no || undefined,
      abc_id: values.abc_id || undefined,
      apaar_id: values.apaar_id || undefined,
      father_mobile: values.father_mobile || undefined,
      father_qualification: values.father_qualification || undefined,
      previous_school_name: values.previous_school_name || undefined,
      previous_board: values.previous_board || undefined,
      previous_marks: values.previous_marks !== "" && values.previous_marks !== undefined ? Number(values.previous_marks) : undefined,
      has_tc: values.has_tc ?? undefined,
      has_government_portal: values.has_government_portal ?? undefined,
      government_portal_name: values.government_portal_name || undefined,
      hostel_required: values.hostel_required ?? undefined,
      hostel_id: values.hostel_id ? Number(values.hostel_id) : undefined,
      hostel_room_id: values.hostel_room_id ? Number(values.hostel_room_id) : undefined,
      hostel_amount: values.hostel_amount ? Number(values.hostel_amount) : undefined,
      medical_condition: values.medical_condition || undefined,
      disability: values.disability || undefined,
      allergy: values.allergy || undefined,
      address_snapshot: values.address_snapshot && Object.keys(values.address_snapshot).length > 0 ? values.address_snapshot : undefined,
      guardian_snapshot: values.guardian_snapshot && Object.keys(values.guardian_snapshot).length > 0 ? values.guardian_snapshot : undefined,
      mobile: values.mobile || undefined,
      email: values.email || undefined,
      fees: values.fees?.map(f => ({
        fee_particular_id: Number(f.fee_particular_id),
        amount: f.amount,
      })),
      inventory_items: values.inventory_items?.map(i => ({
        item_id: Number(i.item_id),
        quantity: i.quantity,
        price: i.price,
      })),
      transport_route_id: values.transport_route_id ? Number(values.transport_route_id) : undefined,
      transport_stop_id: values.transport_stop_id ? Number(values.transport_stop_id) : undefined,
      transport_amount: values.transport_amount ? Number(values.transport_amount) : 0,
      fee_regulation_profile_id: values.fee_regulation_profile_id ? Number(values.fee_regulation_profile_id) : undefined,
      discount_amount: discountTotal > 0 ? discountTotal : undefined,
      discount_reason: values.discount_reason || undefined,
      cash_amount: values.cash_amount || undefined,
      online_amount: values.online_amount || undefined,
      online_transaction_id: values.online_transaction_id || undefined,
      due_amount: dueAmount > 0 ? dueAmount : 0,
      documents: Object.entries(values.documents ?? {}).filter(([, path]) => path).map(([doc_type, path]) => ({ doc_type, path })),
    };
  };


  const onSaveDraft = () => {
    const values = getValues();
    const payload = generatePayload(values, true);
    if (payload.id) {
      updateMutation.mutate(payload);
    } else {
      createMutation.mutate(payload);
    }
  };

  const onSubmit = handleSubmit(
    (values) => {
      const payload = generatePayload(values, false);
      if (payload.id) {
        updateMutation.mutate(payload);
      } else {
        createMutation.mutate(payload);
      }
    },
    (formErrors) => {
      const firstMsg = getFirstErrorMessage(formErrors);
      toast.error(firstMsg ?? "Please fix the errors below before completing the application.");
    },
  );

  /* ── Display labels ────────────────────────────────────────────────── */
  const selectedSession = currentSessionRes?.name ?? "—";

  const selectedStream = useMemo(() => {
    const raw = (mainStreamDetail as any)?.data;
    const detail = raw?.data ?? raw;
    return detail?.name || "—";
  }, [mainStreamDetail]);

  const selectedClass = useMemo(() => {
    const raw = (classDetail as any)?.data;
    const detail = raw?.data ?? raw;
    return detail?.name || "—";
  }, [classDetail]);

  /* ── Document handlers ─────────────────────────────────────────────── */
  const handleDocUpload = useCallback(
    (key: string, file: File) => {
      setUploadingDocType(key);
      const label = APPLICATION_DESK_DOCUMENT_TYPES.find((t) => t.key === key)?.label ?? key;
      R2Api.uploadFile(file)
        .then((uploadPath) => {
          setValue("documents", { ...getValues("documents"), [key]: uploadPath });
          setDocFileNames((prev) => ({ ...prev, [key]: file.name }));
          setUploadingDocType(null);
          toast.success(`${label} uploaded`);
        })
        .catch(() => {
          toast.error(`Failed to upload ${label}`);
          setUploadingDocType(null);
        });
    },
    [setValue, getValues],
  );

  const handleDocRemove = useCallback(
    (key: string) => {
      const docs = { ...getValues("documents") };
      delete docs[key];
      setValue("documents", docs);
      setDocFileNames((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
      if (fileInputRefs.current?.[key]) fileInputRefs.current[key].value = "";
    },
    [setValue, getValues],
  );

  /* ── Step rendering ────────────────────────────────────────────────── */
  const totalSteps = APPLICATION_DESK_FLOW_STEPS.length;
  const stepIndex = currentStepIdx + 1;
  const common = { stepKey: flowStep, stepIndex, totalSteps };

  const STEP_CONTENT_MAP: Record<ApplicationDeskFlowStep, React.ReactNode> = {
    identity: (
      <IdentityStep
        {...common}
        fields={basicFieldsWithOptions as any}
        onContinue={onContinueFromIdentity}
      />
    ),
    address_guardian: (
      <AddressGuardianStep
        {...common}
        onBack={onBack}
        onContinue={onContinueFromAddressGuardian}
      />
    ),
    medical_documents: (
      <MedicalDocumentsStep
        {...common}
        onBack={onBack}
        onContinue={onContinueFromMedicalDocuments}
        docProps={{
          docFileNames,
          uploadingDocKey: uploadingDocType,
          fileInputRefs,
          onDocUpload: handleDocUpload,
          onDocRemove: handleDocRemove,
        }}
      />
    ),
    academic: (
      <AcademicStep
        {...common}
        onBack={onBack}
        onContinue={onContinueFromAcademic}
      />
    ),
    /*.......*/
    services: (
      <ServicesStep
        {...common}
        onBack={onBack}
        onContinue={onContinueFromServices}
      />
    ),
    payment: (
      <PaymentStep
        {...common}
        onBack={onBack}
        onContinue={onContinueFromPayment}
      />
    ),
    review: (
      <ReviewStep
        {...common}
        onBack={onBack}
        onSubmit={onSubmit}
        submitLoading={createMutation.isPending || updateMutation?.isPending}
        docFileNames={docFileNames}
        selectionLabels={{
          session: selectedSession,
          stream: selectedStream,
          class: selectedClass,
        }}
      />
    ),
  };

  return (
    <>
      <Head title="New application – Application Desk" />
      <FormProvider {...form}>
        <div className="max-w-4xl mx-auto space-y-6">
          {/* ── Step Header ──────────────────────────────────────── */}
          <div className="bg-muted/10 border-b border-border/40 p-4 sm:p-6 rounded-none shadow-none">
            <StepHeader
              steps={STEP_HEADER_ITEMS}
              currentStep={flowStep}
              completedSteps={[...completedSteps]}
              onStepClick={handleStepClick}
            />
          </div>

          {/* ── Step Content ─────────────────────────────────────── */}
          {STEP_CONTENT_MAP[flowStep] ?? null}
        </div>
      </FormProvider>
    </>
  );
};

ApplicationsNew.layoutProps = {
  backHref: "/admission/applications",
  backLabel: "Back to Application Desk",
};

export default ApplicationsNew;
