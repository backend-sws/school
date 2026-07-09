import React, { useEffect, useMemo } from "react";
import { ModalDialog } from "../shared/Modal";
import Each from "../Each";
import { useForm } from "react-hook-form";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query.client";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateCodeFromName } from "@/lib/utils";
import transportApi from "@/lib/api/transportApi";
import { TRANSPORT_STOP_FORM_INITIAL, TRANSPORT_STOP_DIALOG_FORM_LAYOUT } from "@/constants/page/admin/transport";
import { TransportStopFormSchema, type TransportStopFormValues, type TransportStopFormInputValues } from "@/lib/validations/transport";


export type TransportStopDialogData = {
  id: number;
  name: string;
  code?: string;
  address?: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
  is_active?: boolean;
} | null;

interface TransportStopDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
  data?: TransportStopDialogData;
}

export function TransportStopDialog({ open, onClose, data }: TransportStopDialogProps) {
  const isEditMode = !!data?.id;
  const dataId = data?.id;

  const { handleSubmit, control, reset, setValue } = useForm<TransportStopFormInputValues, any, TransportStopFormValues>({
    resolver: zodResolver(TransportStopFormSchema) as any,
    defaultValues: TRANSPORT_STOP_FORM_INITIAL as any,
    mode: "onChange",
  });


  const formLayout = useMemo(
    () =>
      TRANSPORT_STOP_DIALOG_FORM_LAYOUT.map((field) => {
        if (field.name === "name") {
          return {
            ...field,
            onValueChange: (val: string) => {
              if (!isEditMode) {
                setValue("code", generateCodeFromName(val), { shouldValidate: true });
              }
            },
          };
        }
        return field;
      }),
    [isEditMode, setValue]
  );

  const { data: detail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["transport-stop", dataId],
    queryFn: () => transportApi.stops.show(dataId!),
    enabled: open && isEditMode && !!dataId,
  });

  const stopDetail = (detail as { data?: TransportStopDialogData })?.data ?? detail;

  useEffect(() => {
    if (isEditMode && stopDetail?.id) {
      reset({
        name: stopDetail.name ?? "",
        code: stopDetail.code ?? "",
        address: stopDetail.address ?? "",
        landmark: stopDetail.landmark ?? "",
        latitude: stopDetail.latitude != null ? stopDetail.latitude : "",
        longitude: stopDetail.longitude != null ? stopDetail.longitude : "",
        is_active: stopDetail.is_active ?? true,
      });
    } else {
      reset(TRANSPORT_STOP_FORM_INITIAL as any);
    }

  }, [isEditMode, stopDetail, reset, open]);

  const { mutate: handleMutation, isPending: isSaving } = useMutation({
    mutationFn: (payload: TransportStopFormValues) =>
      isEditMode
        ? transportApi.stops.update(dataId!, payload)
        : transportApi.stops.store(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transport-stops"] });
      reset(TRANSPORT_STOP_FORM_INITIAL as any);
      onClose(false);
    },

  });

  const onSubmit = (formData: TransportStopFormValues) => {
    handleMutation(formData);
  };

  return (
    <ModalDialog
      title={isEditMode ? "Edit Stop" : "Add Stop"}
      open={open}
      onClose={onClose}
      handleSubmit={handleSubmit(onSubmit) as any}
      isLoading={isSaving || (isEditMode && !!isLoadingDetail)}
    >
      <div className="grid gap-4">
        <Each
          of={formLayout}
          render={(form: any) => (
            <ControlledFormComponent control={control as any} options={form.options as any} {...form} />
          )}
        />
      </div>
    </ModalDialog>
  );
}
