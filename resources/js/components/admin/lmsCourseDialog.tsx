import React, { useEffect, useMemo } from "react";
import { ModalDialog } from "../shared/Modal";
import Each from "../Each";
import { useForm } from "react-hook-form";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateCodeFromName } from "@/lib/utils";
import lmsApi from "@/lib/api/lmsApi";
import {
  LMS_COURSE_FORM_INITIAL,
  LMS_COURSE_DIALOG_FORM_LAYOUT,
} from "@/constants/page/admin/lms";
import { LmsCourseFormSchema, type LmsCourseFormValues } from "@/lib/validations/lms";

export type LmsCourseDialogData = {
  id: number;
  scope_type?: string;
  scope_id?: number | null;
  stream_id?: number | null;
  subject_id?: number | null;
  session_id?: number | null;
  title: string;
  slug?: string;
  description?: string | null;
  status?: number;
  instructor_id?: number | null;
} | null;

interface LmsCourseDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
  data?: LmsCourseDialogData;
}

export function LmsCourseDialog({ open, onClose, data }: LmsCourseDialogProps) {
  const isEditMode = !!data?.id;
  const dataId = data?.id;
  const queryClient = useQueryClient();

  const { handleSubmit, control, reset, setValue, watch } = useForm<LmsCourseFormValues>({
    resolver: zodResolver(LmsCourseFormSchema) as any,
    defaultValues: LMS_COURSE_FORM_INITIAL as LmsCourseFormValues,
    mode: "onChange",
  });

  const scopeType = watch("scope_type");

  const formLayout = useMemo(
    () =>
      LMS_COURSE_DIALOG_FORM_LAYOUT.map((field) => {
        if (field.name === "title") {
          return {
            ...field,
            onValueChange: (val: string) => {
              if (!isEditMode && val) {
                setValue("slug", generateCodeFromName(val).replace(/\s+/g, "-").toLowerCase(), { shouldValidate: true });
              }
            },
          };
        }
        return field;
      }),
    [isEditMode, setValue]
  );

  const { data: detail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["lms-course", dataId],
    queryFn: () => lmsApi.courses.show(dataId!),
    enabled: open && isEditMode && !!dataId,
  });

  const courseDetail = useMemo(() => (detail as { data?: LmsCourseDialogData })?.data ?? detail, [detail]);

  useEffect(() => {
    if (!open) return;

    if (isEditMode && courseDetail && typeof courseDetail === "object" && "id" in courseDetail) {
      const scopeType = (courseDetail.scope_type as "global" | "stream" | "department" | "session") ?? "global";
      reset({
        scope_type: scopeType,
        scope_id: courseDetail.scope_id ?? null,
        stream_id: courseDetail.stream_id ?? null,
        department_id: scopeType === "department" ? (courseDetail.scope_id ?? null) : null,
        subject_id: courseDetail.subject_id ?? null,
        session_id: courseDetail.session_id ?? null,
        title: courseDetail.title ?? "",
        slug: courseDetail.slug ?? "",
        description: courseDetail.description ?? "",
        status: courseDetail.status ?? 1,
        instructor_id: courseDetail.instructor_id ?? null,
      } as LmsCourseFormValues);
    } else if (!isEditMode) {
      reset(LMS_COURSE_FORM_INITIAL as LmsCourseFormValues);
    }
  }, [isEditMode, courseDetail, reset, open]);

  const { mutate: handleMutation, isPending: isSaving } = useMutation({
    mutationFn: (payload: LmsCourseFormValues) => {
      const scopeId =
        scopeType === "stream"
          ? payload.stream_id ?? null
          : scopeType === "department"
            ? payload.department_id ?? null
            : scopeType === "session"
              ? payload.session_id ?? null
              : null;
      const body = {
        scope_type: payload.scope_type,
        scope_id: scopeId,
        stream_id: payload.stream_id ?? null,
        subject_id: payload.subject_id ?? null,
        session_id: payload.session_id ?? null,
        title: payload.title,
        slug: payload.slug || undefined,
        description: payload.description || null,
        status: payload.status ?? 1,
        instructor_id: payload.instructor_id ?? null,
      };
      return isEditMode
        ? lmsApi.courses.update(dataId!, body)
        : lmsApi.courses.store(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lms-courses"] });
      reset(LMS_COURSE_FORM_INITIAL as LmsCourseFormValues);
      onClose(false);
    },
  });

  const onSubmit = (formData: LmsCourseFormValues) => {
    handleMutation(formData);
  };

  return (
    <ModalDialog
      title={isEditMode ? "Edit Course" : "Add Course"}
      open={open}
      onClose={onClose}
      handleSubmit={handleSubmit(onSubmit)}
      isLoading={isSaving || (isEditMode && !!isLoadingDetail)}
    >
      <div className="grid gap-4">
        <Each
          of={formLayout}
          keyExtractor={(f: { name: string }) => f.name}
          render={(form: any) => (
            <ControlledFormComponent control={control} {...form} />
          )}
        />
      </div>
    </ModalDialog>
  );
}
