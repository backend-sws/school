import React, { useEffect } from "react";
import { toast } from "sonner";
import { ModalDialog } from "../shared/Modal";
import Each from "../Each";
import { useForm } from "react-hook-form";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query.client";
import expenseApi from "@/lib/api/expenseApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { expenseCategorySchema, type ExpenseCategoryFormData } from "@/lib/validations/expense";
import { generateCodeFromName } from "@/lib/utils";
import { usePermittedFields } from "@/hooks/usePermittedFields";
import { CATEGORY_FORM_FIELDS, CATEGORY_DEFAULT_VALUES, CATEGORY_PERMISSIONS } from "@/constants/expenses/formConfig";
import { ExpenseQueryKeys } from "@/lib/querykey/expense";
import type { FormFieldConfig } from "@/types/formTypes";

interface ExpenseCategoryDialogProps {
  open: boolean;
  onClose: () => void;
  category?: any | null;
}

export function ExpenseCategoryDialog({ open, onClose, category }: ExpenseCategoryDialogProps) {
  const isEditMode = !!category?.id;
  const dataId = category?.id;

  const { visibleFields, permittedSchema } = usePermittedFields(
    CATEGORY_FORM_FIELDS as FormFieldConfig[],
    expenseCategorySchema,
  );

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ExpenseCategoryFormData>({
    resolver: zodResolver(permittedSchema) as any,
    defaultValues: CATEGORY_DEFAULT_VALUES as ExpenseCategoryFormData,
    mode: "onChange",
  });

  const formLayout = React.useMemo(() => {
    return visibleFields.map((field) => {
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
  }, [visibleFields, isEditMode, setValue]);

  useEffect(() => {
    if (open) {
      if (isEditMode && category) {
        reset({
          name: category.name || "",
          code: category.code || "",
          description: category.description || "",
          is_active: category.is_active,
        });
      } else {
        reset(CATEGORY_DEFAULT_VALUES as ExpenseCategoryFormData);
      }
    }
  }, [open, isEditMode, category, reset]);

  const mutation = useMutation({
    mutationFn: (data: ExpenseCategoryFormData) => {
      return isEditMode
        ? expenseApi.categoriesUpdate(dataId, data)
        : expenseApi.categoriesStore(data);
    },
    onSuccess: (res) => {
      toast.success(isEditMode ? "Category updated successfully" : "Category created successfully");
      queryClient.invalidateQueries({ queryKey: ExpenseQueryKeys.categoriesAll });
      onClose();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Something went wrong");
    },
  });

  const onSubmit = (data: ExpenseCategoryFormData) => {
    mutation.mutate(data);
  };

  return (
    <ModalDialog
      open={open}
      onClose={onClose}
      title={isEditMode ? "Edit Expense Category" : "New Expense Category"}
      className="max-w-md"
      isLoading={mutation.isPending}
      submitLabel={isEditMode ? "Update Category" : "Save Category"}
      onPrimaryClick={handleSubmit(onSubmit)}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <Each
          of={formLayout}
          render={(field) => (
            <ControlledFormComponent
              control={control}
              name={field.name}
              label={field.label}
              type={field.type}
              placeholder={field.placeholder}
              required={field.required}
              options={field.options}
              tooltip={field.tooltip}
              error={errors[field.name as keyof ExpenseCategoryFormData]?.message}
            />
          )}
        />

        <input type="submit" className="hidden" />
      </form>
    </ModalDialog>
  );
}
