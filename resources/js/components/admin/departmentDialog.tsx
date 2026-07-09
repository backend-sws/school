import React, { useEffect, useMemo } from "react";
import { ModalDialog } from "../shared/Modal";
import Each from "../Each";
import { useForm } from "react-hook-form";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query.client";
import { zodResolver } from "@hookform/resolvers/zod";
import DepartmentApi from "@/lib/api/departmentApi";
import {
  DEPARTMENT_DIALOG_FORM_LAYOUT,
  DEPARTMENT_FORM_INITIAL_DATA,
} from "@/constants/page/admin/department";
import { DepartmentFormSchema } from "@/lib/validations/department";
import { generateCodeFromName } from "@/lib/utils";

interface DepartmentProps {
  open: boolean;
  onClose: (open: boolean) => void;
  data?: any | null;
}

export function DepartmentDialog({ open, onClose, data }: DepartmentProps) {
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(DepartmentFormSchema),
    defaultValues: DEPARTMENT_FORM_INITIAL_DATA,
    mode: "onChange", // Enable real-time validation
  });
  const isEditMode = !!data?.id;
  const dataId = data?.id;

  const { data: DepartmentDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["department", dataId],
    queryFn: () => DepartmentApi.getDepartmentById(dataId),
    enabled: open && isEditMode,
  });

  const formLayout = useMemo(() => {
    return DEPARTMENT_DIALOG_FORM_LAYOUT.map((field) => {
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
    if (isEditMode && DepartmentDetail) {
      const fullData = DepartmentDetail?.data;
      reset({
        name: fullData.name,
        code: fullData.code,
      });
    } else {
      reset(DEPARTMENT_FORM_INITIAL_DATA);
    }
  }, [isEditMode, DepartmentDetail, reset]);

  const { mutate: handleMutation, isPending: isSaving } = useMutation({
    mutationFn: (submitData: any) =>
      isEditMode
        ? DepartmentApi.updateDepartment(dataId, submitData)
        : DepartmentApi.createDepartment(submitData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["department"],
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
      title={isEditMode ? "Edit Department" : "Add Department"}
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
