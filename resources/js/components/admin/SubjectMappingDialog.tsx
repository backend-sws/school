import React, { useEffect, useMemo } from "react";
import { ModalDialog } from "../shared/Modal";
import Each from "../Each";
import { useForm } from "react-hook-form";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query.client";
import SubjectApi from "@/lib/api/subjectApi";
import { useCollegeStreams } from "@/hooks/useCollegeStreams";
import SubjectGroupApi from "@/lib/api/subjectGroupApi";
import {
  INITIAL_SUBJECT_MAPPING_FILTERS,
  SUBJECT_MAPPING_DIALOG_FORM_LAYOUT,
  SUBJECT_MAPPING_FORM_INITIAL_DATA,
} from "@/constants/page/admin/subjectMapping";
import { SUBJECT_DIALOG_FORM_LAYOUT } from "@/constants/page/admin/subject";
import { useCollegeSubject } from "@/hooks/useSubjects";
import SubjectCategoryApi from "@/lib/api/subjectCategoryApi";
import SubjectMappingApi from "@/lib/api/subjectMappingApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { subjectMappingDialogFormSchema } from "@/lib/validations/subjectMapping";

interface SubjectMappingProps {
  open: boolean;
  onClose: (open: boolean) => void;
  data?: any | null;
}

export function SubjectMappingDialog({
  open,
  onClose,
  data,
}: SubjectMappingProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(subjectMappingDialogFormSchema) as any,
    defaultValues: SUBJECT_MAPPING_FORM_INITIAL_DATA,
    mode: "onChange", // Enable real-time validation
  });
  const isEditMode = !!data?.id;
  const dataId = data?.id;
  const { data: subjectMappingDetail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["subjectMapping", dataId],
    queryFn: () => SubjectMappingApi.getSubjctMappingById(dataId),
    enabled: open && isEditMode,
  });
  const { subjects = [], isLoading: subjectsLoading } =
    useCollegeSubject();
  const { data: categoryData, isLoading: isLoadingCategory } = useQuery({
    queryKey: ["category"],
    queryFn: () => SubjectCategoryApi.getSubjectCategory(),
    enabled: open,
  });
  const formLayout = useMemo(() => {
    return SUBJECT_MAPPING_DIALOG_FORM_LAYOUT.map((field) => {
      if (field.name === "subject_id") {
        return {
          ...field,
          options: subjects,
        };
      }

      if (field.name === "category_ids") {
        return {
          ...field,
          options:
            categoryData?.data?.map((item: any) => ({
              key: String(item.id),
              value: String(item.id),
              text: item.name,
            })) ?? [],
        };
      }
      return field;
    });
  }, [subjects, categoryData]);

  useEffect(() => {
    if (isEditMode && subjectMappingDetail) {
      const fullData = subjectMappingDetail?.data;

      reset({
        subject_id: String(fullData?.subject_id),
        category_ids: fullData?.categories?.map((cat: any) => String(cat.id)) || [],
      });
    } else {
      reset(SUBJECT_MAPPING_FORM_INITIAL_DATA);
    }
  }, [isEditMode, subjectMappingDetail, reset]);

  const { mutate: handleMutation, isPending: isSaving } = useMutation({
    mutationFn: (submitData: any) =>
      isEditMode
        ? SubjectMappingApi.updateSubjectMapping(dataId, submitData)
        : SubjectMappingApi.createSubjectMapping(submitData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["subject-category-mapping"],
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
      title={isEditMode ? "Edit Subject Mapping" : "Add Subject Mapping"}
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
