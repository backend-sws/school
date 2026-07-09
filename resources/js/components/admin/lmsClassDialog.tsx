import React, { useEffect, useMemo } from "react";
import { ModalDialog } from "../shared/Modal";
import Each from "../Each";
import { useForm } from "react-hook-form";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import lmsApi from "@/lib/api/lmsApi";
import {
  LMS_CLASS_FORM_INITIAL,
  LMS_CLASS_DIALOG_FORM_LAYOUT,
} from "@/constants/page/admin/lms";
import { LmsClassFormSchema, type LmsClassFormValues } from "@/lib/validations/lms";
import { generateCodeFromName } from "@/lib/utils";

export type LmsClassDialogData = {
  id: number;
  name: string;
  code?: string | null;
  stream_id?: number | null;
  lms_course_id?: number | null;
  class_subject_allocation_id?: number | null;
  session_id?: number | null;
  section?: string | null;
  status?: number;
  fee_collection_frequency?: string | null;
} | null;

interface LmsClassDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
  data?: LmsClassDialogData;
  onSuccess?: () => void;
  /** Pre-fill when adding from stream page */
  defaultStreamId?: number | null;
  defaultSessionId?: number | null;
  /** Default name = "{defaultStreamName} - Section {defaultSection}"; section field set for #section badge */
  defaultStreamName?: string | null;
  defaultSection?: string | null;
}

export function LmsClassDialog({ open, onClose, data, onSuccess, defaultStreamId, defaultSessionId, defaultStreamName, defaultSection }: LmsClassDialogProps) {
  const isEditMode = !!data?.id;
  const dataId = data?.id;
  const queryClient = useQueryClient();

  const { handleSubmit, control, reset, setValue } = useForm<LmsClassFormValues>({
    resolver: zodResolver(LmsClassFormSchema) as any,
    defaultValues: LMS_CLASS_FORM_INITIAL as LmsClassFormValues,
    mode: "onChange",
  });

  const formLayout = useMemo(() => LMS_CLASS_DIALOG_FORM_LAYOUT, []);

  const { data: detail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["lms-class", dataId],
    queryFn: () => lmsApi.classes.show(dataId!),
    enabled: open && isEditMode && !!dataId,
  });

  const classDetail = (detail as { data?: LmsClassDialogData })?.data ?? detail;

  useEffect(() => {
    if (isEditMode && classDetail && typeof classDetail === "object" && "id" in classDetail) {
      reset({
        name: classDetail.name ?? "",
        code: classDetail.code ?? "",
        stream_id: classDetail.stream_id ?? null,
        lms_course_id: classDetail.lms_course_id ?? null,
        class_subject_allocation_id: classDetail.class_subject_allocation_id ?? null,
        session_id: classDetail.session_id ?? null,
        section: classDetail.section ?? "",
        status: classDetail.status ?? 1,
      } as LmsClassFormValues);
    } else {
      const streamName = defaultStreamName?.trim() || "";
      const sectionLabel = defaultSection?.trim() || "A";
      const defaultName = streamName ? `${streamName} - Section ${sectionLabel}` : "";
      reset({
        ...LMS_CLASS_FORM_INITIAL,
        stream_id: defaultStreamId ?? LMS_CLASS_FORM_INITIAL.stream_id,
        session_id: defaultSessionId ?? LMS_CLASS_FORM_INITIAL.session_id,
        name: defaultName,
        section: sectionLabel,
      } as LmsClassFormValues);
    }
  }, [isEditMode, classDetail, reset, open, defaultStreamId, defaultSessionId, defaultStreamName, defaultSection]);

  const { mutate: handleMutation, isPending: isSaving } = useMutation({
    mutationFn: (payload: LmsClassFormValues) => {
      const code = payload.code?.trim() || generateCodeFromName(payload.name);
      const body = isEditMode
        ? {
          name: payload.name,
          code: code || null,
          stream_id: payload.stream_id ?? null,
          lms_course_id: payload.lms_course_id ?? null,
          class_subject_allocation_id: payload.class_subject_allocation_id ?? null,
          session_id: payload.session_id ?? null,
          section: payload.section?.trim() || null,
          status: payload.status ?? 1,
        }
        : {
          name: payload.name,
          code: code || null,
          stream_id: defaultStreamId ?? null,
          lms_course_id: null,
          class_subject_allocation_id: null,
          session_id: defaultSessionId ?? null,
          section: payload.section?.trim() || defaultSection?.trim() || null,
          status: 1,
        };
      return isEditMode ? lmsApi.classes.update(dataId!, body) : lmsApi.classes.store(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lms-classes"] });
      reset(LMS_CLASS_FORM_INITIAL as LmsClassFormValues);
      onSuccess?.();
      onClose(false);
    },
  });

  const onSubmit = (formData: LmsClassFormValues) => {
    handleMutation(formData);
  };

  return (
    <ModalDialog
      title={isEditMode ? "Edit Classroom" : "Add Classroom"}
      open={open}
      onClose={onClose}
      handleSubmit={handleSubmit(onSubmit as any)}
      isLoading={isSaving || (isEditMode && !!isLoadingDetail)}
    >
      <div className="grid gap-4">
        <Each
          of={formLayout}
          keyExtractor={(f: any) => f.name}
          render={(form: any) => (
            <ControlledFormComponent control={control} options={form.options} {...form} />
          )}
        />
      </div>
    </ModalDialog>
  );
}
