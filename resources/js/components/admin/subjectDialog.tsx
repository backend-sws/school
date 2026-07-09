import React, { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { ModalDialog } from "../shared/Modal";
import Each from "../Each";
import { useForm } from "react-hook-form";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query.client";
import {
  SUBJECT_FORM_FIELDS,
  SUBJECT_DEFAULT_VALUES,
  getSubjectContent,
  getSubjectFormFields,
} from "@/constants/subject/formConfig";
import { SubjectQueryKeys } from "@/lib/querykey/subject";
import subjectApi from "@/lib/api/subjectApi";
import { useCollegeStreams } from "@/hooks/useCollegeStreams";
import { zodResolver } from "@hookform/resolvers/zod";
import { subjectDialogFormSchema } from "@/lib/validations/subject";
import { generateCodeFromName } from "@/lib/utils";
import { useInstitutionContent } from "@/hooks/useInstitutionContent";

interface SubjectDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
  data?: any | null;
}

export function SubjectDialog({ open, onClose, data }: SubjectDialogProps) {
  const contentMap = useInstitutionContent();
  const CONTENT = useMemo(() => getSubjectContent(contentMap), [contentMap]);

  // Resolve scope-type-aware labels for form fields
  const resolvedFields = useMemo(
    () => getSubjectFormFields(contentMap, SUBJECT_FORM_FIELDS),
    [contentMap],
  );

  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(subjectDialogFormSchema) as any,
    defaultValues: SUBJECT_DEFAULT_VALUES,
    mode: "onChange",
  });

  const isEditMode = !!data?.id;
  const dataId = data?.id;

  const { data: SubjectDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: SubjectQueryKeys.detail(dataId),
    queryFn: () => subjectApi.show(dataId),
    enabled: open && isEditMode,
  });

  const { streams = [] } = useCollegeStreams({ enabled: open });

  const formLayout = useMemo(() => {
    return resolvedFields.map((form) => {
      if (form.name === "name") {
        return {
          ...form,
          onValueChange: (val: string) => {
            if (!isEditMode) {
              setValue("code", generateCodeFromName(val), {
                shouldValidate: true,
              });
            }
          },
        };
      }
      if (form.name === "stream_id") {
        return { ...form, options: streams };
      }
      return form;
    });
  }, [isEditMode, resolvedFields, streams]);

  useEffect(() => {
    if (isEditMode && SubjectDetail) {
      const fullData = SubjectDetail?.data;
      reset({
        name: fullData?.name,
        code: fullData?.code,
        stream_id: String(fullData?.stream_id),
        is_practical: fullData?.is_practical,
      } as any);
    }
  }, [isEditMode, SubjectDetail, reset]);

  const { mutate: handleMutation, isPending: isSaving } = useMutation({
    mutationFn: (submitData: any) =>
      isEditMode
        ? subjectApi.update(dataId, submitData)
        : subjectApi.store(submitData),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: SubjectQueryKeys.all });
      toast.success(res?.data?.message || `Subject ${isEditMode ? "updated" : "created"} successfully`);
      reset(SUBJECT_DEFAULT_VALUES);
      onClose(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to save subject");
    },
  });

  const onSubmit = (formData: any) => handleMutation(formData);

  return (
    <ModalDialog
      title={isEditMode ? CONTENT.editTitle : CONTENT.createTitle}
      open={open}
      onClose={onClose}
      handleSubmit={handleSubmit(onSubmit)}
      isLoading={isSaving || isLoadingDetail}
    >
      <div className="grid gap-1">
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
    </ModalDialog>
  );
}
