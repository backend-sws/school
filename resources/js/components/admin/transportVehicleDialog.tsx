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

export interface TransportVehicleDialogProps {
  open: boolean;
  onClose: (open?: boolean) => void;
  data?: TransportVehicleDialogData;
  onSuccess?: () => void;
}

export function TransportVehicleDialog({ open, onClose, data, onSuccess }: TransportVehicleDialogProps) {
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
        model_name: vehicleDetail.model_name ?? "",
        fuel_type: (vehicleDetail.fuel_type as "diesel" | "petrol" | "cng" | "electric") ?? "diesel",
        capacity: vehicleDetail.capacity ?? "",
        current_odometer: vehicleDetail.current_odometer ?? "",
        transport_route_id: vehicleDetail.transport_route_id ?? "",
        transport_driver_id: vehicleDetail.transport_driver_id ?? "",
        status: (vehicleDetail.status as "active" | "maintenance" | "inactive") ?? "active",
        insurance_policy_number: vehicleDetail.insurance_policy_number ?? "",
        insurance_expiry_date: vehicleDetail.insurance_expiry_date ? String(vehicleDetail.insurance_expiry_date).slice(0, 10) : "",
        puc_expiry_date: vehicleDetail.puc_expiry_date ? String(vehicleDetail.puc_expiry_date).slice(0, 10) : "",
        fitness_expiry_date: vehicleDetail.fitness_expiry_date ? String(vehicleDetail.fitness_expiry_date).slice(0, 10) : "",
        permit_expiry_date: vehicleDetail.permit_expiry_date ? String(vehicleDetail.permit_expiry_date).slice(0, 10) : "",
        notes: vehicleDetail.notes ?? "",
      });
    } else {
      reset(TRANSPORT_VEHICLE_FORM_INITIAL);
    }
  }, [isEditMode, vehicleDetail, reset, open]);

  const { mutate: handleMutation, isPending: isSaving } = useMutation({
    mutationFn: (payload: TransportVehicleFormValues) => {
      const cleanPayload: Record<string, any> = {
        ...payload,
        capacity: Number(payload.capacity),
        current_odometer: payload.current_odometer !== "" && payload.current_odometer !== undefined ? Number(payload.current_odometer) : 0,
        transport_route_id: payload.transport_route_id === "" ? null : Number(payload.transport_route_id),
        transport_driver_id: payload.transport_driver_id === "" ? null : Number(payload.transport_driver_id),
        insurance_expiry_date: payload.insurance_expiry_date || null,
        puc_expiry_date: payload.puc_expiry_date || null,
        fitness_expiry_date: payload.fitness_expiry_date || null,
        permit_expiry_date: payload.permit_expiry_date || null,
      };

      return isEditMode
        ? transportApi.vehicles.update(dataId!, cleanPayload)
        : transportApi.vehicles.store(cleanPayload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transport-vehicles"] });
      reset(TRANSPORT_VEHICLE_FORM_INITIAL);
      onClose(false);
      onSuccess?.();
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
