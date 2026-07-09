import React, { useEffect, useMemo } from "react";
import { ModalDialog } from "../shared/Modal";
import Each from "../Each";
import { useForm } from "react-hook-form";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query.client";
import { useCollegeMainStreams } from "@/hooks/useCollegeMainStreams";
import StreamApi from "@/lib/api/streamApi";
import {
  SESSION_DIALOG_FORM_LAYOUT,
  SESSION_FORM_INITIAL_DATA,
} from "@/constants/page/admin/session";
import SessionApi from "@/lib/api/sessionApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { sessionDialogFormSchema } from "@/lib/validations/session";

interface SessionProps {
  open: boolean;
  onClose: (open: boolean) => void;
  data?: any | null;
}

export function SessionDialog({ open, onClose, data }: SessionProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(sessionDialogFormSchema),
    defaultValues: SESSION_FORM_INITIAL_DATA,
    mode: "onChange", // Enable real-time validation
  });
  const isEditMode = !!data?.id;
  const dataId = data?.id;

  const { data: suggestedYears } = useQuery({
    queryKey: ["sessions-suggested-years"],
    queryFn: () => SessionApi.getSuggestedYears(4),
    enabled: open && !isEditMode,
  });
  
  // Watch start_year to auto-update end_year
  const startYear = watch("start_year");
  
  useEffect(() => {
    // Auto-set end_year to start_year + 4 when start_year changes (only in create mode)
    if (!isEditMode && startYear) {
      setValue("end_year", Number(startYear) + 4);
    }
  }, [startYear, isEditMode, setValue]);
  const { data: SessionDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["session-detail", dataId],
    queryFn: () => SessionApi.getSessionById(dataId),
    enabled: open && isEditMode,
  });

  const formLayout = useMemo(() => {
    return SESSION_DIALOG_FORM_LAYOUT;
  }, [SessionDetail]);

  useEffect(() => {
    if (isEditMode && SessionDetail) {
      const fullData = SessionDetail?.data;

      reset({
        start_year: Number(fullData.start_year),
        end_year: Number(fullData.end_year),
      });
    } else if (!isEditMode && suggestedYears?.data) {
      const payload = suggestedYears.data?.data ?? suggestedYears.data;
      reset({
        start_year: Number(payload.start_year),
        end_year: Number(payload.end_year),
      });
    } else if (!isEditMode) {
      reset(SESSION_FORM_INITIAL_DATA);
    }
  }, [isEditMode, SessionDetail, suggestedYears, reset]);

  const { mutate: handleMutation, isPending: isSaving } = useMutation({
    mutationFn: (submitData: any) =>
      isEditMode
        ? SessionApi.updateSession(dataId, submitData)
        : SessionApi.createSession(submitData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["sessions"],
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
      title={isEditMode ? "Edit Session" : "Add Session"}
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
