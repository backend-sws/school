import React, { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { ModalDialog } from "../shared/Modal";
import Each from "../Each";
import { useForm } from "react-hook-form";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query.client";
import { useCollegeMainStreams } from "@/hooks/useCollegeMainStreams";
import streamApi from "@/lib/api/streamApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { streamSchema, type StreamFormData } from "@/lib/validations/stream";
import { generateCodeFromName } from "@/lib/utils";
import { useInstitutionContent } from "@/hooks/useInstitutionContent";
import {
  STREAM_DEFAULT_VALUES,
  getStreamContent,
  getStreamFormFields,
  STREAM_FORM_FIELDS,
} from "@/constants/stream/formConfig";
import { usePermittedFields } from "@/hooks/usePermittedFields";
import type { FormFieldConfig } from "@/types/formTypes";

interface StreamProps {
  open: boolean;
  onClose: (open: boolean) => void;
  stream?: any | null;
}

export function StreamDialog({ open, onClose, stream }: StreamProps) {
  const contentMap = useInstitutionContent();
  const CONTENT = useMemo(() => getStreamContent(contentMap), [contentMap]);

  // Resolve scope-type-aware form labels
  const resolvedFields = useMemo(
    () => getStreamFormFields(contentMap, STREAM_FORM_FIELDS),
    [contentMap],
  );

  // Permission-gated fields + dynamic schema
  const { visibleFields, permittedSchema } = usePermittedFields(
    resolvedFields,
    streamSchema,
  );

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<StreamFormData>({
    resolver: zodResolver(permittedSchema) as any,
    defaultValues: STREAM_DEFAULT_VALUES as StreamFormData,
    mode: "onChange",
  });

  const isEditMode = !!stream?.id;
  const dataId = stream?.id;

  const { data: StreamDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["stream-detail", dataId],
    queryFn: () => streamApi.show(dataId),
    enabled: open && isEditMode,
  });

  const { data: mainStreamResponse, isLoading: mainStreamLoading } =
    useCollegeMainStreams({ enabled: open });

  // Inject main_stream_id options + auto-code from name
  const formLayout = useMemo(() => {
    return visibleFields.map((field: FormFieldConfig) => {
      if (field.name === "main_stream_id") {
        return {
          ...field,
          options:
            mainStreamResponse?.data?.map((item: any) => ({
              key: String(item.id),
              value: String(item.id),
              text: item.name,
            })) ?? [],
        };
      }
      if (field.name === "name") {
        return {
          ...field,
          onValueChange: (val: string) => {
            if (!isEditMode) {
              setValue("code", generateCodeFromName(val), {
                shouldValidate: true,
              });
            }
          },
        };
      }
      return field;
    });
  }, [visibleFields, mainStreamResponse, isEditMode, setValue]);

  useEffect(() => {
    if (isEditMode && StreamDetail) {
      const fullData = StreamDetail?.data;
      reset({
        name: fullData.name,
        code: fullData.code,
        duration_years: String(fullData.duration_years) as StreamFormData["duration_years"],
        main_stream_id: String(fullData.main_stream_id),
      });
    } else {
      reset(STREAM_DEFAULT_VALUES as StreamFormData);
    }
  }, [isEditMode, StreamDetail, reset]);

  const { mutate: handleMutation, isPending: isSaving } = useMutation({
    mutationFn: (submitData: StreamFormData) =>
      isEditMode
        ? streamApi.update(dataId, submitData as unknown as Record<string, unknown>)
        : streamApi.store(submitData as unknown as Record<string, unknown>),
    onSuccess: (res: any) => {
      queryClient.invalidateQueries({ queryKey: ["streams"] });
      toast.success(res?.data?.message || `Saved successfully`);
      reset();
      onClose(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "Failed to save");
    },
  });

  const onSubmit = (data: StreamFormData) => {
    handleMutation(data);
  };

  return (
    <ModalDialog
      title={isEditMode ? CONTENT.editTitle : CONTENT.createTitle}
      open={open}
      onClose={onClose}
      handleSubmit={handleSubmit(onSubmit as any)}
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
