import React, { useEffect } from "react";
import { toast } from "sonner";
import { ModalDialog } from "../shared/Modal";
import Each from "../Each";
import { useForm } from "react-hook-form";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query.client";
import expenseApi from "@/lib/api/expenseApi";
import api from "@/lib/api/api";
import { zodResolver } from "@hookform/resolvers/zod";
import { expenseBudgetSchema, type ExpenseBudgetFormData } from "@/lib/validations/expense";
import { usePermittedFields } from "@/hooks/usePermittedFields";
import { BUDGET_FORM_FIELDS, BUDGET_DEFAULT_VALUES } from "@/constants/expenses/formConfig";
import { ExpenseQueryKeys } from "@/lib/querykey/expense";
import type { FormFieldConfig } from "@/types/formTypes";

interface ExpenseBudgetDialogProps {
  open: boolean;
  onClose: () => void;
  budget?: any | null;
}

export function ExpenseBudgetDialog({ open, onClose, budget }: ExpenseBudgetDialogProps) {
  const isEditMode = !!budget?.id;
  const dataId = budget?.id;

  const { visibleFields, permittedSchema } = usePermittedFields(
    BUDGET_FORM_FIELDS as FormFieldConfig[],
    expenseBudgetSchema,
  );

  // Fetch Categories
  const { data: categoriesResponse } = useQuery({
    queryKey: ExpenseQueryKeys.categoriesList({ is_active: true }),
    queryFn: () => expenseApi.categoriesIndex({ is_active: true }),
    enabled: open,
  });
  const categories = categoriesResponse?.data || [];

  // Fetch Sessions
  const { data: sessionsResponse } = useQuery({
    queryKey: ["academic-sessions-public"],
    queryFn: () => api.get("/public/sessions"),
    enabled: open,
  });
  const sessions = sessionsResponse?.data || [];

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExpenseBudgetFormData>({
    resolver: zodResolver(permittedSchema) as any,
    defaultValues: BUDGET_DEFAULT_VALUES as ExpenseBudgetFormData,
    mode: "onChange",
  });

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
      if (field.name === "session_id") {
        return {
          ...field,
          options: sessions.map((s: any) => ({
            key: String(s.id),
            value: String(s.id),
            text: s.name,
          })),
        };
      }
      return field;
    });
  }, [visibleFields, categories, sessions]);

  useEffect(() => {
    if (open) {
      if (isEditMode && budget) {
        reset({
          expense_category_id: budget.expense_category_id,
          session_id: budget.session_id,
          amount: parseFloat(budget.amount) || 0,
          alert_threshold: parseFloat(budget.alert_threshold) || 90,
        });
      } else {
        reset(BUDGET_DEFAULT_VALUES as ExpenseBudgetFormData);
      }
    }
  }, [open, isEditMode, budget, reset]);

  const mutation = useMutation({
    mutationFn: (data: ExpenseBudgetFormData) => {
      return isEditMode
        ? expenseApi.budgetsUpdate(dataId, data)
        : expenseApi.budgetsStore(data);
    },
    onSuccess: () => {
      toast.success(isEditMode ? "Budget allocation updated" : "Budget allocated successfully");
      queryClient.invalidateQueries({ queryKey: ExpenseQueryKeys.budgetsAll });
      queryClient.invalidateQueries({ queryKey: ["expenses-analytics"] });
      onClose();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Something went wrong");
    },
  });

  const onSubmit = (data: ExpenseBudgetFormData) => {
    mutation.mutate(data);
  };

  return (
    <ModalDialog
      open={open}
      onClose={onClose}
      title={isEditMode ? "Edit Budget Allocation" : "Set Expense Budget Limit"}
      className="max-w-md"
      isLoading={mutation.isPending}
      submitLabel={isEditMode ? "Update Budget" : "Save Budget"}
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
              error={errors[field.name as keyof ExpenseBudgetFormData]?.message}
            />
          )}
        />

        <input type="submit" className="hidden" />
      </form>
    </ModalDialog>
  );
}
