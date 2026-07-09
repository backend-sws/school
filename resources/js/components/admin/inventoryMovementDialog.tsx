import React from "react";
import { ModalDialog } from "../shared/Modal";
import Each from "../Each";
import { useForm } from "react-hook-form";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query.client";
import { zodResolver } from "@hookform/resolvers/zod";
import inventoryApi from "@/lib/api/inventoryApi";
import {
  INVENTORY_MOVEMENT_FORM_INITIAL,
  INVENTORY_MOVEMENT_DIALOG_FORM_LAYOUT,
} from "@/constants/page/admin/inventory";
import {
  InventoryMovementFormSchema,
  type InventoryMovementFormValues,
  type InventoryMovementFormInputValues,
} from "@/lib/validations/inventory";

interface InventoryMovementDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function InventoryMovementDialog({ open, onClose, onSuccess }: InventoryMovementDialogProps) {
  const {
    handleSubmit,
    control,
    reset,
  } = useForm<InventoryMovementFormInputValues>({
    resolver: zodResolver(InventoryMovementFormSchema) as any,
    defaultValues: INVENTORY_MOVEMENT_FORM_INITIAL,
    mode: "onChange",
  });

  const { data: itemsData, isLoading: isLoadingItems } = useQuery({
    queryKey: ["inventory-items-all"],
    queryFn: () => inventoryApi.items.index({ per_page: 500 }),
    enabled: open,
  });

  const itemOptions = React.useMemo(() => {
    const items = (itemsData as any)?.data ?? itemsData ?? [];
    return (Array.isArray(items) ? items : []).map((i: any) => ({
      key: String(i.id),
      value: i.id,
      text: i.name + (i.code ? ` (${i.code})` : ""),
    }));
  }, [itemsData]);

  const formLayout = React.useMemo(() => {
    return INVENTORY_MOVEMENT_DIALOG_FORM_LAYOUT.map((field) => {
      if (field.name === "inventory_item_id") {
        return { ...field, options: itemOptions };
      }
      return field;
    });
  }, [itemOptions]);

  const { mutate: handleMutation, isPending: isSaving } = useMutation({
    mutationFn: (payload: InventoryMovementFormValues) =>
      inventoryApi.movements.store(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-movements"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-low-stock"] });
      reset(INVENTORY_MOVEMENT_FORM_INITIAL);
      onClose();
      onSuccess?.();
    },
  });

  const onSubmit = (formData: InventoryMovementFormValues) => {
    handleMutation(formData);
  };

  return (
    <ModalDialog
      title="Record movement"
      open={open}
      onClose={(o) => onClose()}
      handleSubmit={handleSubmit(onSubmit) as any}
      isLoading={isSaving || isLoadingItems}
      className="sm:max-w-[480px]"
    >
      <div className="grid gap-4">
        <Each
          of={formLayout}
          render={(form: any) => (
            <ControlledFormComponent
              control={control as any}
              {...form}
            />
          )}
        />
      </div>
    </ModalDialog>
  );
}
