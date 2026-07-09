import React, { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, InfoIcon } from "lucide-react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { StepCard } from "../StepCard";
import { StepNavFooter } from "../StepNavFooter";
import { SectionHeader } from "../SectionHeader";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ApplicationDeskFormValues } from "@/lib/validations/admission/application";
import {
  APPLICATION_DESK_STEP_LABELS,
  APPLICATION_DESK_STEP_SUBTITLES,
  APPLICATION_DESK_PREVIOUS_SCHOOL_FIELDS,
  HAS_GOVERNMENT_PORTAL_FIELD,
  GOVERNMENT_PORTAL_NAME_FIELD,
  type ApplicationDeskFlowStep,
} from "@/constants/admission/application";
import { FORM_TYPE } from "@/constants/shared/form";
import { useInstitutionContent } from "@/hooks/useInstitutionContent";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import Each from "@/components/Each";
import MainStreamApi from "@/lib/api/mainStreamApi";
import StreamApi from "@/lib/api/streamApi";
import { MainStreamQueryKeys } from "@/lib/querykey/mainStream";
import { StreamQueryKeys } from "@/lib/querykey/stream";
import type { AsyncSelectConfig } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";

/* ── Transition Card Molecule ───────────────────────────────────────── */

interface TransitionInfo {
  streamName?: string;
  sessionName?: string;
  regNo?: string;
  studentName?: string;
}

const TransitionCard = ({ from, to }: { from: TransitionInfo; to: TransitionInfo }) => (
  <div className="rounded-xl border border-emerald-100 bg-emerald-50/30 p-5 shadow-sm">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider border-emerald-200 bg-emerald-50 text-emerald-700 h-5 px-1.5">
          Re-Admission
        </Badge>
        <span className="text-xs font-semibold text-emerald-900/60 uppercase tracking-tight">Academic Transition</span>
      </div>
      <div className="flex -space-x-2">
        <div className="size-2 rounded-full bg-emerald-400 animate-pulse" />
      </div>
    </div>
    
    <div className="flex items-center gap-6">
      {/* FROM: Current Enrollment */}
      <div className="flex-1 flex gap-4 items-start p-3 rounded-lg bg-white border border-emerald-100/50 shadow-sm">
        <Avatar className="size-10 rounded-lg border-2 border-emerald-50 shrink-0">
          <AvatarFallback className="bg-emerald-100 text-emerald-700 font-bold rounded-lg text-xs">
            {from.studentName?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || "ST"}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mb-0.5">Current Standing</p>
          <p className="text-sm font-bold text-emerald-950 truncate">{from.studentName || "Student"}</p>
          <p className="text-xs font-medium text-emerald-700/80">{from.streamName || "—"}</p>
          <div className="flex items-center gap-2 mt-1">
             <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">{from.regNo || "—"}</span>
             <span className="text-[10px] text-muted-foreground/60">{from.sessionName || "—"}</span>
          </div>
        </div>
      </div>

      {/* Connecting Flow */}
      <div className="flex flex-col items-center gap-1 opacity-40">
        <motion.div 
          animate={{ x: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ArrowRight className="size-5 text-emerald-600" />
        </motion.div>
      </div>

      {/* TO: New Placement */}
      <div className="flex-1 p-3 rounded-lg border-2 border-dashed border-emerald-200/60 bg-emerald-50/50 flex flex-col justify-center min-h-[76px]">
        <p className="text-[10px] uppercase tracking-widest text-emerald-600/70 font-bold mb-0.5 text-center">Next Placement</p>
        <AnimatePresence mode="wait">
          <motion.div
            key={to.streamName || 'empty'}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-center"
          >
            <p className="text-sm font-bold text-emerald-900">
              {to.streamName || "Select Class Below"}
            </p>
            {to.sessionName && <p className="text-xs text-emerald-700/60">{to.sessionName}</p>}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  </div>
);

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

export interface AcademicStepProps {
  stepKey: ApplicationDeskFlowStep;
  stepIndex: number;
  totalSteps: number;
  onBack: () => void;
  onContinue: () => void;
  /** When 'readmission', shows "From → To" class transition UX */
  mode?: "new" | "readmission";
}

export function AcademicStep({
  stepKey,
  stepIndex,
  totalSteps,
  onBack,
  onContinue,
  mode = "new",
}: AcademicStepProps) {
  const { control } = useFormContext<ApplicationDeskFormValues>();
  const content = useInstitutionContent();
  const contentMap = content as unknown as Record<string, string>;
  const stepLabel =
    contentMap[`step_${stepKey}`] ?? APPLICATION_DESK_STEP_LABELS[stepKey];
  const stepSubtitle =
    contentMap[`step_${stepKey}_subtitle`] ??
    APPLICATION_DESK_STEP_SUBTITLES[stepKey];

  const isReadmission = mode === "readmission";

  // useWatch guarantees re-render on value change
  const hasGovernmentPortal = useWatch({ control, name: "has_government_portal" });

  // Read _from metadata for re-admission transition display
  const fromStreamName = useWatch({ control, name: "_from_stream_name" });
  const fromSessionName = useWatch({ control, name: "_from_session_name" });
  const fromRegNo = useWatch({ control, name: "_from_reg_no" });
  const studentName = useWatch({ control, name: "applicant_name" });

  // Live preview for "To" card
  const selectedStreamId = useWatch({ control, name: "stream_id" });
  const toStreamName = useWatch({ control, name: "_to_stream_name" });
  const toClassName = useWatch({ control, name: "_to_class_name" });

  const { setValue } = useFormContext<ApplicationDeskFormValues>();
  
  /* ── Async configs ─────────────────────────────────────────────────── */
  const mainStreamAsyncConfig: AsyncSelectConfig = useMemo(
    () => ({
      queryFn: (params: Record<string, any>) => MainStreamApi.getMainStreams(params),
      queryKey: MainStreamQueryKeys.all,
      labelKey: "name",
      valueKey: "id",
    }),
    [],
  );

  const hasStream = !!selectedStreamId;

  const classAsyncConfig: AsyncSelectConfig = useMemo(
    () => ({
      queryFn: (params: Record<string, any>) => StreamApi.index(params),
      queryKey: StreamQueryKeys.all,
      labelKey: "name",
      valueKey: "id",
      extraParams: { main_stream_id: selectedStreamId },
      enabled: hasStream,
    }),
    [selectedStreamId, hasStream],
  );

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
          onPrimary={onContinue}
          primaryLabel="Continue to Services"
        />
      }
    >
      <div className="space-y-8">
        {/* ── Re-Admission: From → To Transition Card ───────────── */}
        {isReadmission && (fromStreamName || fromSessionName) && (
          <TransitionCard 
            from={{
              streamName: fromStreamName,
              sessionName: fromSessionName,
              regNo: fromRegNo,
              studentName: studentName
            }}
            to={{
              streamName: toClassName || toStreamName || "Target Placement",
              sessionName: toClassName 
                ? "Direct Placement" 
                : (toStreamName ? "Awaiting class selection..." : "Pending selection"),
            }}
          />
        )}

        <SectionHeader
          title={isReadmission ? "Select new class" : (content.form_section_academic_details || "Academic details")}
          isFirstSection={!isReadmission || !(fromStreamName || fromSessionName)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {/* Main class (stream) — async select */}
          <div className="md:col-span-2">
            <ControlledFormComponent
              control={control as any}
              name="stream_id"
              type={FORM_TYPE.ASYNC_SELECT}
              label={content.form_stream_program}
              placeholder={content.form_select_stream}
              tooltip={content.form_tooltip_stream}
              required
              asyncConfig={mainStreamAsyncConfig}
              onValueChange={(_, opt) => {
                setValue("_to_stream_name", opt?.label ?? "");
                setValue("_to_class_name", ""); // Reset class when stream changes
              }}
            />
          </div>

          {/* Class — async select, depends on stream_id */}
          <div className="md:col-span-2">
            <ControlledFormComponent
              control={control as any}
              name="class_id"
              type={FORM_TYPE.ASYNC_SELECT}
              label={content.form_class}
              placeholder={hasStream ? content.form_select_class : "Select main class first"}
              tooltip={content.form_tooltip_class}
              required
              asyncConfig={classAsyncConfig}
              disabled={!hasStream}
              onValueChange={(_, opt) => {
                setValue("_to_class_name", opt?.label ?? "");
              }}
            />
          </div>
        </div>

        <div className="space-y-3">
          <SectionHeader title="Previous education" isFirstSection={false} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            <Each
              of={APPLICATION_DESK_PREVIOUS_SCHOOL_FIELDS}
              keyExtractor={(f) => f.name}
              render={(field) => (
                <div className={field.className}>
                  <ControlledFormComponent
                    control={control as any}
                    name={field.name as any}
                    type={field.type}
                    label={field.label}
                    placeholder={field.placeholder}
                    tooltip={field.tooltip}
                    maxLength={field.maxLength}
                  />
                </div>
              )}
            />
          </div>
        </div>

        <div className="space-y-3">
          <SectionHeader title={HAS_GOVERNMENT_PORTAL_FIELD.label} isFirstSection={false} />

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Controller
                name="has_government_portal"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="has_government_portal"
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="has_government_portal" className="text-sm font-normal cursor-pointer">
                Registered on government portal
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="size-4 text-muted-foreground shrink-0" aria-hidden />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p>{HAS_GOVERNMENT_PORTAL_FIELD.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {hasGovernmentPortal && (
              <div className="pt-0.5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div className={GOVERNMENT_PORTAL_NAME_FIELD.className}>
                    <ControlledFormComponent
                      control={control as any}
                      name={GOVERNMENT_PORTAL_NAME_FIELD.name}
                      type={GOVERNMENT_PORTAL_NAME_FIELD.type}
                      label={GOVERNMENT_PORTAL_NAME_FIELD.label}
                      placeholder={GOVERNMENT_PORTAL_NAME_FIELD.placeholder}
                      tooltip={GOVERNMENT_PORTAL_NAME_FIELD.tooltip}
                      maxLength={GOVERNMENT_PORTAL_NAME_FIELD.maxLength}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </StepCard>
  );
}
