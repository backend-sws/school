import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import transportApi from "@/lib/api/transportApi";
import { toast } from "sonner";
import { Calculator, Navigation } from "lucide-react";

export type TripLogData = {
  id?: number;
  transport_vehicle_id: number | string;
  transport_driver_id?: number | string | null;
  transport_route_id?: number | string | null;
  log_date: string;
  trip_type: string;
  purpose?: string;
  start_odometer: number | string;
  end_odometer?: number | string;
  total_km?: number | string;
  start_time?: string;
  end_time?: string;
  status: string;
  notes?: string;
};

interface TransportTripLogDialogProps {
  open: boolean;
  onClose: () => void;
  data?: TripLogData | null;
  preselectedVehicleId?: number;
  onSuccess?: () => void;
}

const defaultDate = () => new Date().toISOString().slice(0, 10);

export function TransportTripLogDialog({
  open,
  onClose,
  data,
  preselectedVehicleId,
  onSuccess,
}: TransportTripLogDialogProps) {
  const queryClient = useQueryClient();
  const isEditMode = !!data?.id;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TripLogData>({
    defaultValues: {
      transport_vehicle_id: preselectedVehicleId ?? "",
      transport_driver_id: "",
      transport_route_id: "",
      log_date: defaultDate(),
      trip_type: "regular",
      purpose: "Regular School Run",
      start_odometer: "",
      end_odometer: "",
      total_km: 0,
      start_time: "07:00",
      end_time: "09:30",
      status: "completed",
      notes: "",
    },
  });

  const selectedVehicleId = watch("transport_vehicle_id");
  const startOdo = watch("start_odometer");
  const endOdo = watch("end_odometer");

  // Fetch vehicles
  const { data: vehiclesData } = useQuery({
    queryKey: ["transport-vehicles-all"],
    queryFn: () => transportApi.vehicles.index({ per_page: 500 }),
    enabled: open,
  });

  // Fetch drivers
  const { data: driversData } = useQuery({
    queryKey: ["transport-drivers-all"],
    queryFn: () => transportApi.drivers.index({ per_page: 500 }),
    enabled: open,
  });

  // Fetch routes
  const { data: routesData } = useQuery({
    queryKey: ["transport-routes-all"],
    queryFn: () => transportApi.routes.index({ per_page: 500 }),
    enabled: open,
  });

  const vehicles = (vehiclesData?.data ?? []) as any[];
  const drivers = (driversData?.data ?? []) as any[];
  const routes = (routesData?.data ?? []) as any[];

  // Auto-fill odometer from vehicle's current odometer on new log
  useEffect(() => {
    if (!isEditMode && selectedVehicleId) {
      const v = vehicles.find((veh) => String(veh.id) === String(selectedVehicleId));
      if (v && Number(v.current_odometer) > 0 && (!startOdo || startOdo === "")) {
        setValue("start_odometer", Number(v.current_odometer));
      }
      if (v?.transport_driver_id && !watch("transport_driver_id")) {
        setValue("transport_driver_id", String(v.transport_driver_id));
      }
      if (v?.transport_route_id && !watch("transport_route_id")) {
        setValue("transport_route_id", String(v.transport_route_id));
      }
    }
  }, [selectedVehicleId, vehicles, isEditMode, setValue, startOdo, watch]);

  // Auto calculate total KM
  const calculatedKm = React.useMemo(() => {
    const s = parseFloat(String(startOdo));
    const e = parseFloat(String(endOdo));
    if (!isNaN(s) && !isNaN(e) && e >= s) {
      return Number((e - s).toFixed(2));
    }
    return 0;
  }, [startOdo, endOdo]);

  useEffect(() => {
    if (open) {
      if (data?.id) {
        reset({
          transport_vehicle_id: data.transport_vehicle_id,
          transport_driver_id: data.transport_driver_id ? String(data.transport_driver_id) : "",
          transport_route_id: data.transport_route_id ? String(data.transport_route_id) : "",
          log_date: typeof data.log_date === "string" ? data.log_date.slice(0, 10) : defaultDate(),
          trip_type: data.trip_type || "regular",
          purpose: data.purpose || "",
          start_odometer: data.start_odometer,
          end_odometer: data.end_odometer ?? "",
          total_km: data.total_km ?? 0,
          start_time: data.start_time ?? "",
          end_time: data.end_time ?? "",
          status: data.status || "completed",
          notes: data.notes || "",
        });
      } else {
        reset({
          transport_vehicle_id: preselectedVehicleId ?? "",
          transport_driver_id: "",
          transport_route_id: "",
          log_date: defaultDate(),
          trip_type: "regular",
          purpose: "Regular School Run",
          start_odometer: "",
          end_odometer: "",
          total_km: 0,
          start_time: "07:00",
          end_time: "09:30",
          status: "completed",
          notes: "",
        });
      }
    }
  }, [open, data, preselectedVehicleId, reset]);

  const mutation = useMutation({
    mutationFn: (formData: TripLogData) => {
      const payload: Record<string, any> = {
        transport_vehicle_id: Number(formData.transport_vehicle_id),
        transport_driver_id: formData.transport_driver_id ? Number(formData.transport_driver_id) : null,
        transport_route_id: formData.transport_route_id ? Number(formData.transport_route_id) : null,
        log_date: formData.log_date,
        trip_type: formData.trip_type,
        purpose: formData.purpose,
        start_odometer: Number(formData.start_odometer),
        end_odometer: formData.end_odometer !== "" && formData.end_odometer !== undefined ? Number(formData.end_odometer) : null,
        start_time: formData.start_time || null,
        end_time: formData.end_time || null,
        status: formData.status,
        notes: formData.notes,
      };
      return isEditMode
        ? transportApi.vehicleLogs.update(data!.id!, payload)
        : transportApi.vehicleLogs.store(payload);
    },
    onSuccess: () => {
      toast.success(isEditMode ? "Trip log updated successfully" : "Trip log saved successfully");
      queryClient.invalidateQueries({ queryKey: ["transport-vehicle-logs"] });
      queryClient.invalidateQueries({ queryKey: ["transport-vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["transport-vehicle-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["transport-fleet-analytics"] });
      onSuccess?.();
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to save trip log");
    },
  });

  const onSubmit = (formData: TripLogData) => {
    if (!formData.transport_vehicle_id) {
      toast.error("Please select a vehicle");
      return;
    }
    const s = Number(formData.start_odometer);
    const e = formData.end_odometer !== "" && formData.end_odometer !== undefined ? Number(formData.end_odometer) : null;
    if (e !== null && e < s) {
      toast.error("End odometer cannot be less than Start odometer");
      return;
    }
    mutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Navigation className="size-5 text-primary" />
            <span>{isEditMode ? "Edit Trip / Running Log" : "Log Vehicle Trip & Meter Reading"}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Vehicle */}
            <div className="space-y-1.5">
              <Label htmlFor="transport_vehicle_id" className="text-xs font-semibold">
                Vehicle <span className="text-destructive">*</span>
              </Label>
              <Select
                value={String(watch("transport_vehicle_id") || "")}
                onValueChange={(val) => setValue("transport_vehicle_id", val)}
                disabled={isEditMode || !!preselectedVehicleId}
              >
                <SelectTrigger id="transport_vehicle_id">
                  <SelectValue placeholder="Select Vehicle" />
                </SelectTrigger>
                <SelectContent>
                  {vehicles.map((v) => (
                    <SelectItem key={v.id} value={String(v.id)}>
                      {v.registration_number} {v.model_name ? `(${v.model_name})` : `(${v.vehicle_type})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date */}
            <div className="space-y-1.5">
              <Label htmlFor="log_date" className="text-xs font-semibold">
                Trip Date <span className="text-destructive">*</span>
              </Label>
              <Input id="log_date" type="date" {...register("log_date", { required: true })} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Driver */}
            <div className="space-y-1.5">
              <Label htmlFor="transport_driver_id" className="text-xs font-semibold">
                Driver Assigned
              </Label>
              <Select
                value={String(watch("transport_driver_id") || "")}
                onValueChange={(val) => setValue("transport_driver_id", val)}
              >
                <SelectTrigger id="transport_driver_id">
                  <SelectValue placeholder="Select Driver (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {drivers.map((d) => (
                    <SelectItem key={d.id} value={String(d.id)}>
                      {d.name} {d.mobile ? `(${d.mobile})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Route */}
            <div className="space-y-1.5">
              <Label htmlFor="transport_route_id" className="text-xs font-semibold">
                Route
              </Label>
              <Select
                value={String(watch("transport_route_id") || "")}
                onValueChange={(val) => setValue("transport_route_id", val)}
              >
                <SelectTrigger id="transport_route_id">
                  <SelectValue placeholder="Select Route (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {routes.map((r) => (
                    <SelectItem key={r.id} value={String(r.id)}>
                      {r.name} {r.code ? `(${r.code})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Trip Type */}
            <div className="space-y-1.5">
              <Label htmlFor="trip_type" className="text-xs font-semibold">
                Trip Type
              </Label>
              <Select
                value={watch("trip_type") || "regular"}
                onValueChange={(val) => setValue("trip_type", val)}
              >
                <SelectTrigger id="trip_type">
                  <SelectValue placeholder="Trip Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="regular">Regular School Route</SelectItem>
                  <SelectItem value="event">Sports / Event / Activity</SelectItem>
                  <SelectItem value="excursion">Picnic / Educational Trip</SelectItem>
                  <SelectItem value="maintenance">Maintenance / Service Run</SelectItem>
                  <SelectItem value="emergency">Emergency / Substitute</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Purpose */}
            <div className="space-y-1.5">
              <Label htmlFor="purpose" className="text-xs font-semibold">
                Purpose / Description
              </Label>
              <Input
                id="purpose"
                placeholder="e.g. Morning Student Pickup"
                {...register("purpose")}
              />
            </div>
          </div>

          {/* Odometer Card */}
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-primary">
              <span className="flex items-center gap-1.5">
                <Calculator className="size-4" />
                Odometer / Meter Reading (KM)
              </span>
              <span className="font-mono text-sm font-bold bg-primary/10 px-2.5 py-0.5 rounded-full">
                Total Distance: {calculatedKm} KM
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="start_odometer" className="text-xs font-medium">
                  Start Reading (KM) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="start_odometer"
                  type="number"
                  step="0.1"
                  placeholder="e.g. 15420.0"
                  {...register("start_odometer", { required: true })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="end_odometer" className="text-xs font-medium">
                  End Reading (KM)
                </Label>
                <Input
                  id="end_odometer"
                  type="number"
                  step="0.1"
                  placeholder="e.g. 15465.5"
                  {...register("end_odometer")}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="start_time" className="text-xs font-semibold">Start Time</Label>
              <Input id="start_time" type="time" {...register("start_time")} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="end_time" className="text-xs font-semibold">End Time</Label>
              <Input id="end_time" type="time" {...register("end_time")} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="status" className="text-xs font-semibold">Status</Label>
              <Select
                value={watch("status") || "completed"}
                onValueChange={(val) => setValue("status", val)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in_progress">In Progress</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-xs font-semibold">Notes / Remarks</Label>
            <Textarea
              id="notes"
              rows={2}
              placeholder="Any route deviation, traffic delays, vehicle condition remarks..."
              {...register("notes")}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={mutation.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving..." : isEditMode ? "Update Trip" : "Save Trip Log"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
