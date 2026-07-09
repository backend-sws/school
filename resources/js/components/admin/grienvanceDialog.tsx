import React, { useEffect, useMemo } from "react";
import { ModalDialog } from "../shared/Modal";
import Each from "../Each";
import { useForm } from "react-hook-form";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query.client";

import SubjectGroupApi from "@/lib/api/subjectGroupApi";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  GRIEVANCE_DIALOG_FORM_LAYOUT,
  GRIEVANCE_FORM_INITIAL_DATA,
} from "@/constants/page/admin/grievance";
import GrievancesApi from "@/lib/api/grievancesApi";
import { GrievanceDialogFormSchema } from "@/lib/validations/grievances";

interface SubjectGroupProps {
  open: boolean;
  onClose: (open: boolean) => void;
  data?: any | null;
}

export function GrievancesDialog({ open, onClose, data }: SubjectGroupProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(GrievanceDialogFormSchema) as any,
    defaultValues: GRIEVANCE_FORM_INITIAL_DATA,
    mode: "onChange", // Enable real-time validation
  });
  const isEditMode = !!data?.id;
  const dataId = data?.id;
  const { data: grievancesDetails, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["grievances", dataId],
    queryFn: () => GrievancesApi.getGrievancesById(dataId),
    enabled: open && isEditMode,
  });

  const formLayout = useMemo(() => {
    return GRIEVANCE_DIALOG_FORM_LAYOUT;
  }, [grievancesDetails]);

  useEffect(() => {
    if (isEditMode && grievancesDetails) {
      const fullData = grievancesDetails?.data;

      reset({
        resolution: fullData?.resolution,
        status: fullData?.status,
      });
    } else {
      reset(GRIEVANCE_DIALOG_FORM_LAYOUT as any);
    }
  }, [isEditMode, grievancesDetails, reset]);

  const { mutate: handleMutation, isPending: isSaving } = useMutation({
    mutationFn: (submitData: any) =>
      GrievancesApi.updateGrievances(dataId, submitData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["grievances"],
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
      title={isEditMode ? "Edit Grivances" : "Add Subject Group"}
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
