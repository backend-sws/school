import React, { useEffect, useMemo } from "react";
import { ModalDialog } from "../shared/Modal";
import Each from "../Each";
import { useForm } from "react-hook-form";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query.client";
import SessionApi from "@/lib/api/sessionApi";
import SubjectCategoryApi from "@/lib/api/subjectCategoryApi";
import {
  SUBJECT_CATEGORY_DIALOG_FORM_LAYOUT,
  SUBJECT_CATEGORY_FORM_INITIAL_DATA,
} from "@/constants/page/admin/subjectCategory";
import { zodResolver } from "@hookform/resolvers/zod";
import { subjectCategoryDialogFormSchema } from "@/lib/validations/subjectCategory";
import { generateCodeFromName } from "@/lib/utils";

interface SubjectCategoryProps {
  open: boolean;
  onClose: (open: boolean) => void;
  data?: any | null;
}

export function SubjectCategoryDialog({
  open,
  onClose,
  data,
}: SubjectCategoryProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(subjectCategoryDialogFormSchema),
    defaultValues: SUBJECT_CATEGORY_FORM_INITIAL_DATA,
    mode: "onChange", // Enable real-time validation
  });
  const isEditMode = !!data?.id;
  const dataId = data?.id;
  const { data: SubjectCatergoryDetail, isLoading: isLoadingDetail } = useQuery(
    {
      queryKey: ["subject-category-detail", dataId],
      queryFn: () => SubjectCategoryApi.getSubjectCatergoryById(dataId),
      enabled: open && isEditMode,
    },
  );

  const formLayout = useMemo(() => {
    return SUBJECT_CATEGORY_DIALOG_FORM_LAYOUT.map((field) => {
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
    if (isEditMode && SubjectCatergoryDetail) {
      const fullData = SubjectCatergoryDetail?.data;

      reset({
        name: fullData.name,
        code: fullData.code,
      });
    } else {
      reset(SUBJECT_CATEGORY_FORM_INITIAL_DATA);
    }
  }, [isEditMode, SubjectCatergoryDetail, reset]);

  const { mutate: handleMutation, isPending: isSaving } = useMutation({
    mutationFn: (submitData: any) =>
      isEditMode
        ? SubjectCategoryApi.updateSubjectCatergory(dataId, submitData)
        : SubjectCategoryApi.createSubjectCatergory(submitData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subject-category"],
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
      title={isEditMode ? "Edit Subject Category" : "Add Subject Category"}
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
