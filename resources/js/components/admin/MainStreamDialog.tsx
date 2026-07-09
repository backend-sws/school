import React, { useEffect, useMemo } from "react";
import { ModalDialog } from "../shared/Modal";
import Each from "../Each";
import { useForm } from "react-hook-form";
import {
  MAIN_STREAM_FORM_INITIAL_DATA,
  getMainStreamFormLayout,
} from "@/constants/page/admin/mainStream";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import { useMutation, useQuery } from "@tanstack/react-query";
import MainStreamApi from "@/lib/api/mainStreamApi";
import { queryClient } from "@/lib/query.client";
import { zodResolver } from "@hookform/resolvers/zod";
import { mainStreamFormSchema } from "@/lib/validations/mainStream";
import { generateCodeFromName } from "@/lib/utils";

interface MainStreamProps {
  open: boolean;
  onClose: (open: boolean) => void;
  mainStream?: any | null;
  /** Content engine label — e.g. "Level" (school), "Main Course Stream" (college) */
  mainStreamLabel?: string;
}

export function MainStreamDialog({
  open,
  onClose,
  mainStream,
  mainStreamLabel = "Main Stream",
}: MainStreamProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(mainStreamFormSchema),

    defaultValues: MAIN_STREAM_FORM_INITIAL_DATA,
    mode: "onChange", // Enable real-time validation
  });
  const isEditMode = !!mainStream?.id;

  const formLayout = useMemo(() => {
    return getMainStreamFormLayout(mainStreamLabel).map((form) => {
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
      return form;
    });
  }, [isEditMode, mainStreamLabel]);

  const mainStreamId = mainStream?.id;
  const { data: mainStreamDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["main-stream-detail", mainStreamId],
    queryFn: () => MainStreamApi.getMainStreamById(mainStreamId),
    enabled: open && isEditMode,
  });

  useEffect(() => {
    if (isEditMode && mainStreamDetail) {
      const fullData = mainStreamDetail?.data;

      reset({
        name: fullData.name,
        code: fullData.code,
      });
    } else {
      reset(MAIN_STREAM_FORM_INITIAL_DATA);
    }
  }, [isEditMode, mainStreamDetail, reset]);

  const { mutate: handleMutation, isPending: isSaving } = useMutation({
    mutationFn: (submitData: any) =>
      isEditMode
        ? MainStreamApi.updateMainStream(mainStreamId, submitData)
        : MainStreamApi.createMainStream(submitData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["main-streams"],
      });
      reset();
      onClose(false);
    },
    onError: (error: any) => {
      // Global mutationCache handles this
    },
  });

  const onSubmit = (data: any) => {
    handleMutation(data);
  };

  return (
    <ModalDialog
      title={isEditMode ? `Edit ${mainStreamLabel}` : `Add ${mainStreamLabel}`}
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

