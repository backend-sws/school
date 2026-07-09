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
  TRANSPORT_VEHICLE_FORM_INITIAL,
  TRANSPORT_VEHICLE_DIALOG_FORM_LAYOUT,
} from "@/constants/page/admin/transport";
import { TransportVehicleFormSchema, type TransportVehicleFormValues } from "@/lib/validations/transport";

export type TransportVehicleDialogData = {
  id: number;
  registration_number: string;
  vehicle_type?: string;
  capacity?: number;
  transport_route_id?: number | null;
  transport_driver_id?: number | null;
  status?: string;
  notes?: string;
} | null;

interface TransportVehicleDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
  data?: TransportVehicleDialogData;
}

export function TransportVehicleDialog({ open, onClose, data }: TransportVehicleDialogProps) {
  const isEditMode = !!data?.id;
  const dataId = data?.id;

  const { handleSubmit, control, reset } = useForm<TransportVehicleFormValues>({
    resolver: zodResolver(TransportVehicleFormSchema) as any,
    defaultValues: TRANSPORT_VEHICLE_FORM_INITIAL,
    mode: "onChange",
  });

  const { data: detail, isLoading: isLoadingDetail } = useQuery({
    queryKey: ["transport-vehicle", dataId],
    queryFn: () => transportApi.vehicles.show(dataId!),
    enabled: open && isEditMode && !!dataId,
  });

  const { data: routesData, isLoading: isLoadingRoutes } = useQuery({
    queryKey: ["transport-routes-all"],
    queryFn: () => transportApi.routes.index({ per_page: 500 }),
    enabled: open,
  });

  const { data: driversData, isLoading: isLoadingDrivers } = useQuery({
    queryKey: ["transport-drivers-all"],
    queryFn: () => transportApi.drivers.index({ per_page: 500 }),
    enabled: open,
  });

  const routeOptions = React.useMemo(() => {
    const routes = (routesData as any)?.data ?? routesData ?? [];
    return (Array.isArray(routes) ? routes : []).map((r: any) => ({
      key: String(r.id),
      value: r.id,
      text: r.name,
    }));
  }, [routesData]);

  const driverOptions = React.useMemo(() => {
    const drivers = (driversData as any)?.data ?? driversData ?? [];
    return (Array.isArray(drivers) ? drivers : []).map((d: any) => ({
      key: String(d.id),
      value: d.id,
      text: d.name,
    }));
  }, [driversData]);

  const formLayout = React.useMemo(() => {
    return TRANSPORT_VEHICLE_DIALOG_FORM_LAYOUT.map((field) => {
      if (field.name === "transport_route_id") {
        return { ...field, options: routeOptions };
      }
      if (field.name === "transport_driver_id") {
        return { ...field, options: driverOptions };
      }
      return field;
    });
  }, [routeOptions, driverOptions]);

  const vehicleDetail = (detail as { data?: TransportVehicleDialogData })?.data ?? (detail as any);

  useEffect(() => {
    if (isEditMode && vehicleDetail?.id) {
      reset({
        registration_number: vehicleDetail.registration_number ?? "",
        vehicle_type: (vehicleDetail.vehicle_type as "bus" | "van" | "cab") ?? "bus",
        capacity: vehicleDetail.capacity ?? "",
        transport_route_id: vehicleDetail.transport_route_id ?? "",
        transport_driver_id: vehicleDetail.transport_driver_id ?? "",
        status: (vehicleDetail.status as "active" | "maintenance" | "inactive") ?? "active",
        notes: vehicleDetail.notes ?? "",
      });
    } else {
      reset(TRANSPORT_VEHICLE_FORM_INITIAL);
    }
  }, [isEditMode, vehicleDetail, reset, open]);

  const { mutate: handleMutation, isPending: isSaving } = useMutation({
    mutationFn: (payload: TransportVehicleFormValues) =>
      isEditMode
        ? transportApi.vehicles.update(dataId!, {
          ...payload,
          transport_route_id: payload.transport_route_id === "" ? null : Number(payload.transport_route_id),
          transport_driver_id: payload.transport_driver_id === "" ? null : Number(payload.transport_driver_id),
        })
        : transportApi.vehicles.store({
          ...payload,
          capacity: Number(payload.capacity),
          transport_route_id: payload.transport_route_id === "" ? null : Number(payload.transport_route_id),
          transport_driver_id: payload.transport_driver_id === "" ? null : Number(payload.transport_driver_id),
        }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transport-vehicles"] });
      reset(TRANSPORT_VEHICLE_FORM_INITIAL);
      onClose(false);
    },
  });

  return (
    <ModalDialog
      title={isEditMode ? "Edit Vehicle" : "Add Vehicle"}
      open={open}
      onClose={onClose}
      handleSubmit={handleSubmit((formData) => handleMutation(formData)) as any}
      isLoading={isSaving || (isEditMode && !!isLoadingDetail) || isLoadingRoutes || isLoadingDrivers}
    >
      <div className="grid gap-4">
        <Each
          of={formLayout}
          render={(form: any) => (
            <ControlledFormComponent control={control as any} {...form} />
          )}
        />
      </div>
    </ModalDialog>
  );
}
