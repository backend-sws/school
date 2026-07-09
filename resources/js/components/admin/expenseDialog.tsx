import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { ModalDialog } from "../shared/Modal";
import { R2FileUpload } from "@/components/shared/R2FileUpload";
import Each from "../Each";
import { useForm } from "react-hook-form";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query.client";
import expenseApi from "@/lib/api/expenseApi";
import R2Api from "@/lib/api/r2Api";
import { zodResolver } from "@hookform/resolvers/zod";
import { expenseSchema, type ExpenseFormData } from "@/lib/validations/expense";
import { usePermittedFields } from "@/hooks/usePermittedFields";
import { EXPENSE_FORM_FIELDS, EXPENSE_DEFAULT_VALUES } from "@/constants/expenses/formConfig";
import { ExpenseQueryKeys } from "@/lib/querykey/expense";
import type { FormFieldConfig } from "@/types/formTypes";
import { Paperclip, Loader2, Check, AlertCircle } from "lucide-react";

interface ExpenseDialogProps {
  open: boolean;
  onClose: () => void;
  expense?: any | null;
}

export function ExpenseDialog({ open, onClose, expense }: ExpenseDialogProps) {
  const isEditMode = !!expense?.id;
  const dataId = expense?.id;

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const { visibleFields, permittedSchema } = usePermittedFields(
    EXPENSE_FORM_FIELDS as FormFieldConfig[],
    expenseSchema,
  );

  // Get active categories to populate dropdown
  const { data: categoriesResponse } = useQuery({
    queryKey: ExpenseQueryKeys.categoriesList({ is_active: true }),
    queryFn: () => expenseApi.categoriesIndex({ is_active: true }),
    enabled: open,
  });

  const categories = categoriesResponse?.data || [];

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ExpenseFormData>({
    resolver: zodResolver(permittedSchema) as any,
    defaultValues: EXPENSE_DEFAULT_VALUES as ExpenseFormData,
    mode: "onChange",
  });

  const attachmentPath = watch("attachment");

  // Injects category options dynamically
  const formLayout = React.useMemo(() => {
    return visibleFields.map((field) => {
      if (field.name === "expense_category_id") {
        return {
          ...field,
          options: categories.map((c: any) => ({
            key: String(c.id),
            value: String(c.id),
            text: c.name,
          })),
        };
      }
      // We will hide attachment from the auto-render field config list since we render a custom upload zone
      if (field.name === "attachment") {
        return { ...field, type: "hidden" };
      }
      return field;
    });
  }, [visibleFields, categories]);

  useEffect(() => {
    if (open) {
      if (isEditMode && expense) {
        reset({
          expense_category_id: expense.expense_category_id,
          title: expense.title || "",
          amount: parseFloat(expense.amount) || 0,
          date: expense.date ? expense.date.split("T")[0] : new Date().toISOString().split("T")[0],
          payment_mode: expense.payment_mode || "Cash",
          reference_no: expense.reference_no || "",
          payee: expense.payee || "",
          description: expense.description || "",
          attachment: expense.attachment || "",
          status: expense.status || "pending",
        });
      } else {
        reset(EXPENSE_DEFAULT_VALUES as ExpenseFormData);
      }
      setUploading(false);
      setUploadProgress(0);
    }
  }, [open, isEditMode, expense, reset]);

  const mutation = useMutation({
    mutationFn: (data: ExpenseFormData) => {
      return isEditMode
        ? expenseApi.expensesUpdate(dataId, data)
        : expenseApi.expensesStore(data);
    },
    onSuccess: (res: any) => {
      const warning = res.data?.warning;
      if (warning) {
        toast.warning(warning, { duration: 6000 });
      }
      toast.success(isEditMode ? "Expense updated successfully" : "Expense logged successfully");
      queryClient.invalidateQueries({ queryKey: ExpenseQueryKeys.expensesAll });
      queryClient.invalidateQueries({ queryKey: ["expenses-analytics"] });
      onClose();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Something went wrong");
    },
  });

  const onSubmit = (data: ExpenseFormData) => {
    mutation.mutate(data);
  };

  return (
    <ModalDialog
      open={open}
      onClose={onClose}
      title={isEditMode ? "Edit Expense Log" : "Log College Expense"}
      className="max-w-lg"
      isLoading={mutation.isPending}
      primaryDisabled={uploading}
      submitLabel={isEditMode ? "Update Expense" : "Log Expense"}
      onPrimaryClick={handleSubmit(onSubmit)}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Each
            of={formLayout}
            render={(field) => {
              if (field.type === "hidden") return null;
              // Some take full width
              const isFullWidth = ["title", "description", "expense_category_id", "payee"].includes(field.name);
              return (
                <div className={isFullWidth ? "col-span-1 md:col-span-2" : "col-span-1"}>
                  <ControlledFormComponent
                    control={control}
                    name={field.name}
                    label={field.label}
                    type={field.type}
                    placeholder={field.placeholder}
                    required={field.required}
                    options={field.options}
                    tooltip={field.tooltip}
                    error={errors[field.name as keyof ExpenseFormData]?.message}
                  />
                </div>
              );
            }}
          />
        </div>

        {/* Invoice / Receipt File Upload Section */}
        <div className="border-t pt-4">
          <label className="block text-sm font-medium mb-1.5 flex items-center gap-1">
            Invoice / Receipt Attachment
          </label>
          <R2FileUpload
            value={attachmentPath}
            onChange={(path) => setValue("attachment", path, { shouldValidate: true })}
            disabled={uploading}
            maxSizeLabel="Max 5MB (PDF, PNG, JPG)"
          />
          {errors.attachment && (
            <p className="text-xs text-destructive mt-1 flex items-center gap-0.5">
              <AlertCircle className="size-3" /> {errors.attachment.message}
            </p>
          )}
        </div>

        <input type="submit" className="hidden" />
      </form>
    </ModalDialog>
  );
}
