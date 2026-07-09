import React, { useEffect } from "react";
import { ModalDialog } from "../shared/Modal";
import Each from "../Each";
import { useForm } from "react-hook-form";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query.client";
import { zodResolver } from "@hookform/resolvers/zod";
import transportApi from "@/lib/api/transportApi";
import {
  TRANSPORT_DRIVER_FORM_INITIAL,
  TRANSPORT_DRIVER_DIALOG_FORM_LAYOUT,
} from "@/constants/page/admin/transport";
import { TransportDriverFormSchema, type TransportDriverFormValues } from "@/lib/validations/transport";

export type TransportDriverDialogData = {
  id: number;
  name: string;
  license_number?: string;
  license_valid_until?: string;
  mobile?: string;
  email?: string;
  is_active?: boolean;
} | null;

interface TransportDriverDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
  data?: TransportDriverDialogData;
}

export function TransportDriverDialog({ open, onClose, data }: TransportDriverDialogProps) {
  const isEditMode = !!data?.id;
  const dataId = data?.id;

  const { handleSubmit, control, reset } = useForm<TransportDriverFormValues>({
    resolver: zodResolver(TransportDriverFormSchema) as any,
    defaultValues: TRANSPORT_DRIVER_FORM_INITIAL,
    mode: "onChange",
  });

  const { data: detail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["transport-driver", dataId],
    queryFn: () => transportApi.drivers.show(dataId!),
    enabled: open && isEditMode && !!dataId,
  });

  const driverDetail = (detail as { data?: TransportDriverDialogData })?.data ?? detail;

  useEffect(() => {
    if (isEditMode && driverDetail?.id) {
      reset({
        name: driverDetail.name ?? "",
        license_number: driverDetail.license_number ?? "",
        license_valid_until: driverDetail.license_valid_until ?? "",
        mobile: driverDetail.mobile ?? "",
        email: driverDetail.email ?? "",
        is_active: driverDetail.is_active ?? true,
      });
    } else {
      reset(TRANSPORT_DRIVER_FORM_INITIAL);
    }
  }, [isEditMode, driverDetail, reset, open]);

  const { mutate: handleMutation, isPending: isSaving } = useMutation({
    mutationFn: (payload: TransportDriverFormValues) =>
      isEditMode ? transportApi.drivers.update(dataId!, payload) : transportApi.drivers.store(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transport-drivers"] });
      reset(TRANSPORT_DRIVER_FORM_INITIAL);
      onClose(false);
    },
  });

  return (
    <ModalDialog
      title={isEditMode ? "Edit Driver" : "Add Driver"}
      open={open}
      onClose={onClose}
      handleSubmit={handleSubmit((formData) => handleMutation(formData)) as any}
      isLoading={isSaving || (isEditMode && !!isLoadingDetail)}
    >
      <div className="grid gap-4">
        <Each
          of={TRANSPORT_DRIVER_DIALOG_FORM_LAYOUT}
          render={(form: any) => (
            <ControlledFormComponent control={control as any} options={form.options as any} {...form} />
          )}
        />
      </div>
    </ModalDialog>
  );
}
