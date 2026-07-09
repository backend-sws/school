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
  INVENTORY_LOCATION_FORM_INITIAL,
  INVENTORY_LOCATION_DIALOG_FORM_LAYOUT,
} from "@/constants/page/admin/inventory";
import { InventoryLocationFormSchema, type InventoryLocationFormValues } from "@/lib/validations/inventory";

interface InventoryLocationDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
  data?: { id: number; name: string; code?: string } | null;
}

export function InventoryLocationDialog({ open, onClose, data }: InventoryLocationDialogProps) {
  const isEditMode = !!data?.id;
  const dataId = data?.id;

  const {
    handleSubmit,
    control,
    reset,
  } = useForm<InventoryLocationFormValues>({
    resolver: zodResolver(InventoryLocationFormSchema) as any,
    defaultValues: INVENTORY_LOCATION_FORM_INITIAL,
    mode: "onChange",
  });

  const { data: detail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["inventory-location", dataId],
    queryFn: () => inventoryApi.locations.show(dataId!),
    enabled: open && isEditMode && !!dataId,
  });

  const locationDetail = detail?.data ?? detail;

  useEffect(() => {
    if (isEditMode && locationDetail?.id) {
      reset({
        name: locationDetail.name ?? "",
        code: locationDetail.code ?? "",
      });
    } else {
      reset(INVENTORY_LOCATION_FORM_INITIAL);
    }
  }, [isEditMode, locationDetail, reset, open]);

  const { mutate: handleMutation, isPending: isSaving } = useMutation({
    mutationFn: (payload: InventoryLocationFormValues) =>
      isEditMode
        ? inventoryApi.locations.update(dataId!, payload)
        : inventoryApi.locations.store(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-locations"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-items-list"] });
      reset(INVENTORY_LOCATION_FORM_INITIAL);
      onClose(false);
    },
  });

  const onSubmit = (formData: InventoryLocationFormValues) => {
    handleMutation(formData);
  };

  return (
    <ModalDialog
      title={isEditMode ? "Edit Location" : "Add Location"}
      open={open}
      onClose={onClose}
      handleSubmit={handleSubmit(onSubmit) as any}
      isLoading={isSaving || (isEditMode && isLoadingDetail)}
    >
      <div className="grid gap-4">
        <Each
          of={INVENTORY_LOCATION_DIALOG_FORM_LAYOUT}
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
