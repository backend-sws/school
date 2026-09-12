import React, { useEffect, useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import transportApi from "@/lib/api/transportApi";
import { toast } from "sonner";
import { Fuel, UploadCloud, IndianRupee, FileText } from "lucide-react";

export type FuelLogData = {
  id?: number;
  transport_vehicle_id: number | string;
  transport_driver_id?: number | string | null;
  fuel_date: string;
  fuel_time?: string;
  fuel_type: string;
  odometer_reading: number | string;
  liters: number | string;
  rate_per_liter: number | string;
  total_amount?: number | string;
  is_full_tank: boolean;
  vendor_name?: string;
  payment_mode: string;
  invoice_number?: string;
  bill_url?: string;
  notes?: string;
};

interface TransportFuelDialogProps {
  open: boolean;
  onClose: () => void;
  data?: FuelLogData | null;
  preselectedVehicleId?: number;
  onSuccess?: () => void;
}

const defaultDate = () => new Date().toISOString().slice(0, 10);
const defaultTime = () => new Date().toTimeString().slice(0, 5);

export function TransportFuelDialog({
  open,
  onClose,
  data,
  preselectedVehicleId,
  onSuccess,
}: TransportFuelDialogProps) {
  const queryClient = useQueryClient();
  const isEditMode = !!data?.id;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm<FuelLogData>({
    defaultValues: {
      transport_vehicle_id: preselectedVehicleId ?? "",
      transport_driver_id: "",
      fuel_date: defaultDate(),
      fuel_time: defaultTime(),
      fuel_type: "diesel",
      odometer_reading: "",
      liters: "",
      rate_per_liter: "",
      total_amount: "",
      is_full_tank: true,
      vendor_name: "",
      payment_mode: "cash",
      invoice_number: "",
      notes: "",
    },
  });

  const selectedVehicleId = watch("transport_vehicle_id");
  const liters = watch("liters");
  const rate = watch("rate_per_liter");
  const isFullTank = watch("is_full_tank");

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

  const vehicles = (vehiclesData?.data ?? []) as any[];
  const drivers = (driversData?.data ?? []) as any[];

  // Auto-fill fuel type and odometer from vehicle
  useEffect(() => {
    if (!isEditMode && selectedVehicleId) {
      const v = vehicles.find((veh) => String(veh.id) === String(selectedVehicleId));
      if (v) {
        if (v.fuel_type) setValue("fuel_type", v.fuel_type);
        if (Number(v.current_odometer) > 0 && !watch("odometer_reading")) {
          setValue("odometer_reading", Number(v.current_odometer));
        }
        if (v.transport_driver_id && !watch("transport_driver_id")) {
          setValue("transport_driver_id", String(v.transport_driver_id));
        }
      }
    }
  }, [selectedVehicleId, vehicles, isEditMode, setValue, watch]);

  // Auto calculate total cost
  const calculatedTotal = React.useMemo(() => {
    const l = parseFloat(String(liters));
    const r = parseFloat(String(rate));
    if (!isNaN(l) && !isNaN(r) && l > 0 && r > 0) {
      return Number((l * r).toFixed(2));
    }
    return 0;
  }, [liters, rate]);

  useEffect(() => {
    if (calculatedTotal > 0) {
      setValue("total_amount", calculatedTotal);
    }
  }, [calculatedTotal, setValue]);

  useEffect(() => {
    if (open) {
      setSelectedFile(null);
      if (data?.id) {
        reset({
          transport_vehicle_id: data.transport_vehicle_id,
          transport_driver_id: data.transport_driver_id ? String(data.transport_driver_id) : "",
          fuel_date: typeof data.fuel_date === "string" ? data.fuel_date.slice(0, 10) : defaultDate(),
          fuel_time: data.fuel_time ?? defaultTime(),
          fuel_type: data.fuel_type || "diesel",
          odometer_reading: data.odometer_reading,
          liters: data.liters,
          rate_per_liter: data.rate_per_liter,
          total_amount: data.total_amount ?? "",
          is_full_tank: data.is_full_tank !== undefined ? Boolean(data.is_full_tank) : true,
          vendor_name: data.vendor_name || "",
          payment_mode: data.payment_mode || "cash",
          invoice_number: data.invoice_number || "",
          bill_url: data.bill_url || "",
          notes: data.notes || "",
        });
      } else {
        reset({
          transport_vehicle_id: preselectedVehicleId ?? "",
          transport_driver_id: "",
          fuel_date: defaultDate(),
          fuel_time: defaultTime(),
          fuel_type: "diesel",
          odometer_reading: "",
          liters: "",
          rate_per_liter: "",
          total_amount: "",
          is_full_tank: true,
          vendor_name: "",
          payment_mode: "cash",
          invoice_number: "",
          bill_url: "",
          notes: "",
        });
      }
    }
  }, [open, data, preselectedVehicleId, reset]);

  const mutation = useMutation({
    mutationFn: (formData: FuelLogData) => {
      const fd = new FormData();
      fd.append("transport_vehicle_id", String(formData.transport_vehicle_id));
      if (formData.transport_driver_id) {
        fd.append("transport_driver_id", String(formData.transport_driver_id));
      }
      fd.append("fuel_date", formData.fuel_date);
      if (formData.fuel_time) fd.append("fuel_time", formData.fuel_time);
      fd.append("fuel_type", formData.fuel_type);
      fd.append("odometer_reading", String(formData.odometer_reading));
      fd.append("liters", String(formData.liters));
      fd.append("rate_per_liter", String(formData.rate_per_liter));
      fd.append("total_amount", String(formData.total_amount || calculatedTotal));
      fd.append("is_full_tank", formData.is_full_tank ? "1" : "0");
      if (formData.vendor_name) fd.append("vendor_name", formData.vendor_name);
      if (formData.payment_mode) fd.append("payment_mode", formData.payment_mode);
      if (formData.invoice_number) fd.append("invoice_number", formData.invoice_number);
      if (formData.notes) fd.append("notes", formData.notes);
      if (selectedFile) {
        fd.append("bill_file", selectedFile);
      }

      return isEditMode
        ? transportApi.vehicleFuels.update(data!.id!, fd)
        : transportApi.vehicleFuels.store(fd);
    },
    onSuccess: () => {
      toast.success(isEditMode ? "Fuel record updated successfully" : "Fuel refill recorded successfully");
      queryClient.invalidateQueries({ queryKey: ["transport-vehicle-fuels"] });
      queryClient.invalidateQueries({ queryKey: ["transport-vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["transport-vehicle-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["transport-fleet-analytics"] });
      onSuccess?.();
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to record fuel refill");
    },
  });

  const onSubmit = (formData: FuelLogData) => {
    if (!formData.transport_vehicle_id) {
      toast.error("Please select a vehicle");
      return;
    }
    if (!formData.liters || Number(formData.liters) <= 0) {
      toast.error("Please enter quantity (liters)");
      return;
    }
    if (!formData.rate_per_liter || Number(formData.rate_per_liter) <= 0) {
      toast.error("Please enter rate per liter");
      return;
    }
    mutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Fuel className="size-5 text-emerald-600" />
            <span>{isEditMode ? "Edit Fuel Record" : "Record Fuel Refill & Mileage"}</span>
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

            {/* Driver */}
            <div className="space-y-1.5">
              <Label htmlFor="transport_driver_id" className="text-xs font-semibold">
                Driver
              </Label>
              <Select
                value={String(watch("transport_driver_id") || "")}
                onValueChange={(val) => setValue("transport_driver_id", val)}
              >
                <SelectTrigger id="transport_driver_id">
                  <SelectValue placeholder="Driver (optional)" />
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
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Date */}
            <div className="space-y-1.5">
              <Label htmlFor="fuel_date" className="text-xs font-semibold">
                Refill Date <span className="text-destructive">*</span>
              </Label>
              <Input id="fuel_date" type="date" {...register("fuel_date", { required: true })} />
            </div>

            {/* Time */}
            <div className="space-y-1.5">
              <Label htmlFor="fuel_time" className="text-xs font-semibold">Time</Label>
              <Input id="fuel_time" type="time" {...register("fuel_time")} />
            </div>

            {/* Fuel Type */}
            <div className="space-y-1.5">
              <Label htmlFor="fuel_type" className="text-xs font-semibold">Fuel Type</Label>
              <Select
                value={watch("fuel_type") || "diesel"}
                onValueChange={(val) => setValue("fuel_type", val)}
              >
                <SelectTrigger id="fuel_type">
                  <SelectValue placeholder="Fuel Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diesel">Diesel</SelectItem>
                  <SelectItem value="petrol">Petrol</SelectItem>
                  <SelectItem value="cng">CNG</SelectItem>
                  <SelectItem value="electric">EV Charging</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Odometer at Refill */}
          <div className="space-y-1.5">
            <Label htmlFor="odometer_reading" className="text-xs font-semibold">
              Odometer Reading at Refill (KM) <span className="text-destructive">*</span>
            </Label>
            <Input
              id="odometer_reading"
              type="number"
              step="0.1"
              placeholder="e.g. 15600.0"
              {...register("odometer_reading", { required: true })}
            />
          </div>

          {/* Cost & Quantity Calculation Card */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-800 dark:text-emerald-300">
              <span className="flex items-center gap-1.5">
                <IndianRupee className="size-4" />
                Fuel Pricing & Calculation
              </span>
              <span className="font-mono text-sm font-bold bg-emerald-100 dark:bg-emerald-900/60 px-3 py-0.5 rounded-full">
                Total: ₹{(watch("total_amount") || calculatedTotal).toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="liters" className="text-xs font-medium">
                  Quantity (Liters) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="liters"
                  type="number"
                  step="0.01"
                  placeholder="e.g. 45.5"
                  {...register("liters", { required: true })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="rate_per_liter" className="text-xs font-medium">
                  Price / Liter (₹) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="rate_per_liter"
                  type="number"
                  step="0.01"
                  placeholder="e.g. 91.50"
                  {...register("rate_per_liter", { required: true })}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="total_amount" className="text-xs font-medium">
                  Total Amount (₹)
                </Label>
                <Input
                  id="total_amount"
                  type="number"
                  step="0.01"
                  placeholder="Auto-calculated"
                  {...register("total_amount")}
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-emerald-500/20">
              <div className="space-y-0.5">
                <Label htmlFor="full-tank-toggle" className="text-xs font-semibold cursor-pointer">
                  Full Tank Refill
                </Label>
                <p className="text-[11px] text-muted-foreground">
                  Enables accurate tank-to-tank Mileage (km/L) calculation
                </p>
              </div>
              <Switch
                id="full-tank-toggle"
                checked={isFullTank}
                onCheckedChange={(val) => setValue("is_full_tank", val)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Vendor */}
            <div className="space-y-1.5">
              <Label htmlFor="vendor_name" className="text-xs font-semibold">Petrol Pump Name</Label>
              <Input
                id="vendor_name"
                placeholder="e.g. HP Petrol Pump, NH-31"
                {...register("vendor_name")}
              />
            </div>

            {/* Payment Mode */}
            <div className="space-y-1.5">
              <Label htmlFor="payment_mode" className="text-xs font-semibold">Payment Mode</Label>
              <Select
                value={watch("payment_mode") || "cash"}
                onValueChange={(val) => setValue("payment_mode", val)}
              >
                <SelectTrigger id="payment_mode">
                  <SelectValue placeholder="Payment Mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="upi">UPI / Online</SelectItem>
                  <SelectItem value="card">Debit / Credit Card</SelectItem>
                  <SelectItem value="fuel_card">Fuel Card</SelectItem>
                  <SelectItem value="credit">Credit / Ledger</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Invoice Number */}
            <div className="space-y-1.5">
              <Label htmlFor="invoice_number" className="text-xs font-semibold">Slip / Bill No</Label>
              <Input
                id="invoice_number"
                placeholder="e.g. HP-94812"
                {...register("invoice_number")}
              />
            </div>
          </div>

          {/* Bill / Receipt File Upload */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Upload Bill / Receipt Slip</Label>
            <div className="flex items-center gap-3">
              <label
                htmlFor="bill_file"
                className="flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer bg-muted/40 hover:bg-muted text-xs font-medium transition-colors"
              >
                <UploadCloud className="size-4 text-muted-foreground" />
                <span>{selectedFile ? selectedFile.name : "Choose Bill (Image/PDF)"}</span>
                <input
                  id="bill_file"
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setSelectedFile(e.target.files[0]);
                    }
                  }}
                />
              </label>
              {watch("bill_url") && !selectedFile && (
                <a
                  href={watch("bill_url")}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-xs text-primary underline"
                >
                  <FileText className="size-3.5" /> View current bill
                </a>
              )}
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-xs font-semibold">Notes / Remarks</Label>
            <Textarea
              id="notes"
              rows={2}
              placeholder="e.g. Fuel additive added, filled during emergency return..."
              {...register("notes")}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={mutation.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {mutation.isPending ? "Saving..." : isEditMode ? "Update Fuel" : "Save Fuel Entry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
