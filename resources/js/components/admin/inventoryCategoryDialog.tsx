import React, { useEffect } from "react";
import { ModalDialog } from "../shared/Modal";
import Each from "../Each";
import { useForm } from "react-hook-form";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query.client";
import { zodResolver } from "@hookform/resolvers/zod";
import inventoryApi from "@/lib/api/inventoryApi";
import {
  INVENTORY_CATEGORY_FORM_INITIAL,
  INVENTORY_CATEGORY_DIALOG_FORM_LAYOUT,
} from "@/constants/page/admin/inventory";
import { InventoryCategoryFormSchema, type InventoryCategoryFormValues } from "@/lib/validations/inventory";

interface InventoryCategoryDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
  data?: { id: number; name: string; code?: string; description?: string } | null;
}

export function InventoryCategoryDialog({ open, onClose, data }: InventoryCategoryDialogProps) {
  const isEditMode = !!data?.id;
  const dataId = data?.id;

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<InventoryCategoryFormValues>({
    resolver: zodResolver(InventoryCategoryFormSchema) as any,
    defaultValues: INVENTORY_CATEGORY_FORM_INITIAL,
    mode: "onChange",
  });

  const { data: detail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["inventory-category", dataId],
    queryFn: () => inventoryApi.categories.show(dataId!),
    enabled: open && isEditMode && !!dataId,
  });

  const categoryDetail = detail?.data ?? detail;

  useEffect(() => {
    if (isEditMode && categoryDetail?.id) {
      reset({
        name: categoryDetail.name ?? "",
        code: categoryDetail.code ?? "",
        description: categoryDetail.description ?? "",
      });
    } else {
      reset(INVENTORY_CATEGORY_FORM_INITIAL);
    }
  }, [isEditMode, categoryDetail, reset, open]);

  const { mutate: handleMutation, isPending: isSaving } = useMutation({
    mutationFn: (payload: InventoryCategoryFormValues) =>
      isEditMode
        ? inventoryApi.categories.update(dataId!, payload)
        : inventoryApi.categories.store(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-categories"] });
      reset(INVENTORY_CATEGORY_FORM_INITIAL);
      onClose(false);
    },
  });

  const onSubmit = (formData: InventoryCategoryFormValues) => {
    handleMutation(formData);
  };

  return (
    <ModalDialog
      title={isEditMode ? "Edit Category" : "Add Category"}
      open={open}
      onClose={onClose}
      handleSubmit={handleSubmit(onSubmit) as any}
      isLoading={isSaving || (isEditMode && isLoadingDetail)}
    >
      <div className="grid gap-4">
        <Each
          of={INVENTORY_CATEGORY_DIALOG_FORM_LAYOUT}
          render={(form: any) => (
            <ControlledFormComponent
              control={control as any}
              options={form.options}
              {...form}
            />
          )}
        />
      </div>
    </ModalDialog>
  );
}
