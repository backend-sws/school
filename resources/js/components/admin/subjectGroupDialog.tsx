import React, { useEffect, useMemo } from "react";
import { ModalDialog } from "../shared/Modal";
import Each from "../Each";
import { useForm } from "react-hook-form";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query.client";
import SessionApi from "@/lib/api/sessionApi";
import {
  SUBJECT_GROUP_DIALOG_FORM_LAYOUT,
  SUBJECT_GROUP_FORM_INITIAL_DATA,
} from "@/constants/page/admin/subjectGroup";
import SubjectGroupApi from "@/lib/api/subjectGroupApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { subjectGroupDialogFormSchema } from "@/lib/validations/subjectGroup";
import { generateCodeFromName } from "@/lib/utils";

interface SubjectGroupProps {
  open: boolean;
  onClose: (open: boolean) => void;
  data?: any | null;
}

export function SubjectGroupDialog({ open, onClose, data }: SubjectGroupProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(subjectGroupDialogFormSchema),
    defaultValues: SUBJECT_GROUP_FORM_INITIAL_DATA,
    mode: "onChange", // Enable real-time validation
  });
  const isEditMode = !!data?.id;
  const dataId = data?.id;
  const { data: SubjectGroupDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["subject-group", dataId],
    queryFn: () => SubjectGroupApi.getSubjectGroupById(dataId),
    enabled: open && isEditMode,
  });

  const formLayout = useMemo(() => {
    return SUBJECT_GROUP_DIALOG_FORM_LAYOUT.map((field) => {
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
  }, [isEditMode]);

  useEffect(() => {
    if (isEditMode && SubjectGroupDetail) {
      const fullData = SubjectGroupDetail?.data;

      reset({
        name: fullData.name,
        code: fullData.code,
      });
    } else {
      reset(SUBJECT_GROUP_FORM_INITIAL_DATA);
    }
  }, [isEditMode, SubjectGroupDetail, reset]);

  const { mutate: handleMutation, isPending: isSaving } = useMutation({
    mutationFn: (submitData: any) =>
      isEditMode
        ? SubjectGroupApi.updateSubjectGroup(dataId, submitData)
        : SubjectGroupApi.createSubjectGroup(submitData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subject-group"],
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
      title={isEditMode ? "Edit Subject Group" : "Add Subject Group"}
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
