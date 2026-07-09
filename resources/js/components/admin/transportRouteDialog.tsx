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
import {
  TRANSPORT_ROUTE_FORM_INITIAL,
  TRANSPORT_ROUTE_DIALOG_FORM_LAYOUT,
} from "@/constants/page/admin/transport";
import { TransportRouteFormSchema, type TransportRouteFormValues } from "@/lib/validations/transport";

export type TransportRouteDialogData = {
  id: number;
  name: string;
  code?: string;
  description?: string;
  is_active?: boolean;
} | null;

interface TransportRouteDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
  data?: TransportRouteDialogData;
}

export function TransportRouteDialog({ open, onClose, data }: TransportRouteDialogProps) {
  const isEditMode = !!data?.id;
  const dataId = data?.id;

  const { handleSubmit, control, reset, setValue } = useForm<TransportRouteFormValues>({
    resolver: zodResolver(TransportRouteFormSchema) as any,
    defaultValues: TRANSPORT_ROUTE_FORM_INITIAL,
    mode: "onChange",
  });

  const formLayout = useMemo(
    () =>
      TRANSPORT_ROUTE_DIALOG_FORM_LAYOUT.map((field) => {
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
    queryKey: ["transport-route", dataId],
    queryFn: () => transportApi.routes.show(dataId!),
    enabled: open && isEditMode && !!dataId,
  });

  const routeDetail = (detail as { data?: TransportRouteDialogData })?.data ?? detail;

  useEffect(() => {
    if (isEditMode && routeDetail?.id) {
      reset({
        name: routeDetail.name ?? "",
        code: routeDetail.code ?? "",
        description: routeDetail.description ?? "",
        is_active: routeDetail.is_active ?? true,
      });
    } else {
      reset(TRANSPORT_ROUTE_FORM_INITIAL);
    }
  }, [isEditMode, routeDetail, reset, open]);

  const { mutate: handleMutation, isPending: isSaving } = useMutation({
    mutationFn: (payload: TransportRouteFormValues) =>
      isEditMode ? transportApi.routes.update(dataId!, payload) : transportApi.routes.store(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["transport-routes"] });
      reset(TRANSPORT_ROUTE_FORM_INITIAL);
      onClose(false);
    },
  });

  return (
    <ModalDialog
      title={isEditMode ? "Edit Route" : "Add Route"}
      open={open}
      onClose={onClose}
      handleSubmit={handleSubmit((formData) => handleMutation(formData)) as any}
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
