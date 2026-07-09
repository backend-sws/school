import React, { useMemo, ReactNode } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { StepCard } from "../StepCard";
import { StepNavFooter } from "../StepNavFooter";
import { SummarySection } from "../SummarySection";
import { TotalSummaryCard } from "../TotalSummaryCard";
import Each from "@/components/Each";
import R2Api from "@/lib/api/r2Api";
import { SectionHeader } from "../SectionHeader";
import type { ApplicationDeskFormValues } from "@/lib/validations/admission/application";
import {
  APPLICATION_DESK_STEP_LABELS,
  APPLICATION_DESK_STEP_SUBTITLES,
  APPLICATION_DESK_DOCUMENT_TYPES,
  REVIEW_SECTION_CONFIG,
  type ApplicationDeskFlowStep,
  type ReviewSectionKey,
} from "@/constants/admission/application";
import { useInstitutionContent } from "@/hooks/useInstitutionContent";
import { computeFeeBreakdown, computePaymentSummary } from "@/lib/utils";
import {
  GraduationCap,
  User,
  MapPin,
  ShieldCheck,
  Stethoscope,
  CreditCard,
  Phone,
  Mail,
  FileCheck,
  HeartPulse,
  Info,
  type LucideIcon,
} from "lucide-react";

// ── Icon map ──────────────────────────────────────────────────────────
const ICON_MAP: Record<string, LucideIcon> = {
  GraduationCap,
  User,
  MapPin,
  ShieldCheck,
  Stethoscope,
  CreditCard,
};

// ── Types ─────────────────────────────────────────────────────────────
interface SelectionLabels {
  session: string;
  stream: string;
  class: string;
}

interface SectionRenderContext {
  data: ApplicationDeskFormValues;
  selectionLabels: SelectionLabels;
  docFileNames: Record<string, string>;
  uploadedDocs: { label: string; fileName: string }[];
  getDocPreview: (key: string) => ReactNode;
  feeSum: number;
  invSum: number;
  transportAmt: number;
  hostelAmt: number;
  discountAmt: number;
  grandTotal: number;
  totalPaid: number;
  dueAmount: number;
  correspondenceAddress: string;
  permanentAddress: string;
}

interface SectionOutput {
  items?: { label: string; value: ReactNode }[];
  children?: ReactNode;
}

// ── Helpers ───────────────────────────────────────────────────────────
const formatAddress = (addr?: Record<string, any>) => {
  if (!addr) return "—";
  const parts = [addr.line1, addr.line2, addr.city, addr.state, addr.pincode].filter(Boolean);
  return parts.length > 0 ? parts.join(", ") : "—";
};

// ── Section renderer map ──────────────────────────────────────────────
const SECTION_RENDERERS: Record<ReviewSectionKey, (ctx: SectionRenderContext) => SectionOutput> = {
  academic: ({ selectionLabels }) => ({
    children: (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Stream / Program</p>
          <p className="text-sm font-bold text-foreground">{selectionLabels.stream || "—"}</p>
        </div>
        <div className="space-y-1.5 border-l sm:pl-6 border-border/40">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Target Class</p>
          <p className="text-sm font-bold text-foreground">{selectionLabels.class || "—"}</p>
        </div>
      </div>
    ),
  }),

  applicant: ({ data }) => ({
    items: [
      { label: "Full Name", value: data.applicant_name },
      { label: "Father's Name", value: data.father_name },
      { label: "Mother's Name", value: data.mother_name },
      { label: "Date of Birth", value: data.dob ? new Date(data.dob).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—" },
      { label: "Gender", value: data.gender },
      { label: "Blood Group", value: data.blood_group },
      { label: "Aadhaar", value: data.aadhaar_no },
      { label: "Category", value: data.category },
    ],
  }),

  contact: ({ data, correspondenceAddress, permanentAddress }) => ({
    items: [
      {
        label: "Mobile Number",
        value: (
          <div className="flex items-center gap-1.5 justify-end">
            <Phone className="size-3 text-primary/60" />
            <span>{data.mobile}</span>
          </div>
        ),
      },
      {
        label: "Email Address",
        value: (
          <div className="flex items-center gap-1.5 justify-end">
            <Mail className="size-3 text-primary/60" />
            <span className="truncate max-w-[150px]">{data.email}</span>
          </div>
        ),
      },
    ],
    children: (
      <div className="mt-4 pt-4 border-t space-y-4">
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1.5">Correspondence address</p>
          <p className="text-xs font-medium text-foreground leading-relaxed">{correspondenceAddress}</p>
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1.5">Permanent address</p>
          <p className="text-xs font-medium text-foreground leading-relaxed">
            {data.permanent_address_type === "same" ? "Same as correspondence" : permanentAddress}
          </p>
        </div>
      </div>
    ),
  }),

  guardian: ({ data }) => ({
    items: [
      { label: "Guardian", value: data.guardian_snapshot?.name || "—" },
      { label: "Occupation", value: (data.guardian_snapshot as any)?.occupation || "—" },
      { label: "Annual Income", value: (data.guardian_snapshot as any)?.income ? `₹${(data.guardian_snapshot as any).income.toLocaleString()}` : "—" },
      { label: "Guardian Aadhaar", value: (data.guardian_snapshot as any)?.aadhaar_no || "—" },
    ],
    children: (data.has_local_guardian || (data.guardian_snapshot as any)?.emergency_contact?.name) ? (
      <div className="mt-4 pt-4 border-t space-y-4">
        {data.has_local_guardian && (
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Local guardian</p>
            <div className="text-right">
              <p className="text-xs font-bold">{(data.guardian_snapshot as any).local_guardian?.name}</p>
              <p className="text-[10px] text-muted-foreground">{(data.guardian_snapshot as any).local_guardian?.relationship} • {(data.guardian_snapshot as any).local_guardian?.phone}</p>
            </div>
          </div>
        )}
        {(data.guardian_snapshot as any)?.emergency_contact?.name && (
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Emergency contact</p>
            <div className="text-right">
              <p className="text-xs font-bold text-destructive">{(data.guardian_snapshot as any).emergency_contact.name}</p>
              <p className="text-[10px] text-muted-foreground">{(data.guardian_snapshot as any).emergency_contact.relationship} • {(data.guardian_snapshot as any).emergency_contact.mobile}</p>
            </div>
          </div>
        )}
      </div>
    ) : undefined,
  }),

  medical: ({ data, uploadedDocs, getDocPreview }) => ({
    children: (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary">
            <HeartPulse className="size-3.5" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Medical context</span>
          </div>
          <p className="text-xs font-bold">
            {[data.medical_condition, data.disability, data.allergy].filter(Boolean).join(", ") || "None declared"}
          </p>
        </div>

        <div className="pt-4 border-t space-y-4">
          <div className="flex items-center gap-2 text-primary pb-1">
            <FileCheck className="size-3.5" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Document Previews</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            <Each
              of={uploadedDocs}
              keyExtractor={(doc, i) => `${doc.label}-${i}`}
              nodatafound={
                <p className="text-xs text-muted-foreground italic">No documents uploaded.</p>
              }
              render={(doc) => {
                const docType = APPLICATION_DESK_DOCUMENT_TYPES.find(t => t.label === doc.label);
                return (
                  <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/30 border border-border/40 group hover:border-primary/30 transition-colors">
                    {docType && getDocPreview(docType.key)}
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-foreground truncate">{doc.label}</p>
                      <p className="text-[9px] text-muted-foreground uppercase tracking-tight font-medium truncate italic">{doc.fileName}</p>
                    </div>
                    <div className="size-7 rounded-full bg-background border flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Info className="size-3.5 text-muted-foreground" />
                    </div>
                  </div>
                );
              }}
            />
          </div>
        </div>
      </div>
    ),
  }),

  financial: ({ feeSum, invSum, transportAmt, hostelAmt, discountAmt, totalPaid, dueAmount, data }) => ({
    children: (
      <TotalSummaryCard
        feeTotal={feeSum}
        inventoryTotal={invSum}
        transportTotal={transportAmt}
        hostelTotal={hostelAmt}
        discountTotal={discountAmt}
        cashAmount={Number(data.cash_amount) || 0}
        onlineAmount={Number(data.online_amount) || 0}
        dueAmount={dueAmount}
      />
    ),
  }),
};

// ── Component ─────────────────────────────────────────────────────────
interface ReviewStepProps {
  stepKey: ApplicationDeskFlowStep;
  stepIndex: number;
  totalSteps: number;
  onBack: () => void;
  onSubmit: () => void;
  submitLoading?: boolean;
  docFileNames: Record<string, string>;
  selectionLabels: SelectionLabels;
}

export function ReviewStep({
  stepKey,
  stepIndex,
  totalSteps,
  onBack,
  onSubmit,
  submitLoading = false,
  docFileNames,
  selectionLabels,
}: ReviewStepProps) {
  const { control } = useFormContext<ApplicationDeskFormValues>();
  const content = useInstitutionContent();
  const contentMap = content as unknown as Record<string, string>;
  const stepLabel =
    contentMap[`step_${stepKey}`] ?? APPLICATION_DESK_STEP_LABELS[stepKey];
  const stepSubtitle =
    contentMap[`step_${stepKey}_subtitle`] ??
    APPLICATION_DESK_STEP_SUBTITLES[stepKey];

  const data = useWatch({ control }) as ApplicationDeskFormValues;

  const correspondenceAddress = formatAddress(data.address_snapshot?.correspondence);
  const permanentAddress = formatAddress(data.address_snapshot?.permanent);

  const uploadedDocs = useMemo(() => {
    const docMap = data.documents || {};
    return APPLICATION_DESK_DOCUMENT_TYPES.filter((t) => docMap[t.key])
      .map((t) => ({ label: t.label, fileName: docFileNames[t.key] || "Uploaded" }));
  }, [data.documents, docFileNames]);

  const summary = useMemo(() => {
    const breakdown = computeFeeBreakdown(data);
    const summary = computePaymentSummary(data, breakdown.grandTotal);
    return { ...breakdown, ...summary };
  }, [data]);

  const {
    feeTotal: feeSum,
    inventoryTotal: invSum,
    transportTotal: transportAmt,
    hostelTotal: hostelAmt,
    discountTotal: discountAmt,
    grandTotal,
    totalPaid,
    dueAmount
  } = summary;

  const getDocPreview = (key: string): ReactNode => {
    const val = data.documents?.[key];
    if (!val) return null;
    const isImage = typeof val === "string" && (val.startsWith("data:image/") || /\.(jpg|jpeg|png|gif|webp)$/i.test(val));

    if (isImage) {
      return (
        <div className="size-12 rounded-none bg-muted border overflow-hidden shrink-0">
          <img src={R2Api.imageSrc(val)} alt="Preview" className="size-full object-cover" />
        </div>
      );
    }
    return (
      <div className="size-12 rounded-none bg-primary/5 border border-primary/10 flex items-center justify-center shrink-0">
        <FileCheck className="size-5 text-primary/60" />
      </div>
    );
  };

  // Build render context once
  const ctx: SectionRenderContext = {
    data, selectionLabels, docFileNames, uploadedDocs, getDocPreview,
    feeSum, invSum, transportAmt, hostelAmt, discountAmt, grandTotal, totalPaid, dueAmount,
    correspondenceAddress, permanentAddress,
  };

  return (
    <StepCard
      title={stepLabel}
      subtitle={stepSubtitle}
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      className="shadow-none border-none rounded-none"
      footer={
        <StepNavFooter
          onBack={onBack}
          onPrimary={onSubmit}
          primaryLabel={submitLoading ? "Creating…" : "Complete Onboarding"}
          primaryLoading={submitLoading}
        />
      }
    >
      <div className="space-y-8">
        <Each
          of={REVIEW_SECTION_CONFIG}
          keyExtractor={(s) => s.key}
          render={(section) => {
            const { items, children } = SECTION_RENDERERS[section.key as ReviewSectionKey](ctx);
            return (
              <SummarySection
                title={section.title}
                icon={ICON_MAP[section.iconName] ?? User}
                items={items}
                className={section.className}
              >
                {children}
              </SummarySection>
            );
          }}
        />
      </div>
    </StepCard>
  );
}
