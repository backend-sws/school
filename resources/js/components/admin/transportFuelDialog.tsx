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
import { Badge } from "@/components/ui/badge";
import {
  Fuel,
  UploadCloud,
  IndianRupee,
  FileText,
  Building2,
  AlertCircle,
  CheckCircle2,
  Clock,
  ExternalLink,
} from "lucide-react";
import fuelVendorApi, { type FuelVendor } from "@/lib/api/fuelVendorApi";

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
  transport_fuel_vendor_id?: number | string | null;
  vendor_name?: string;
  payment_mode: string;
  payment_status?: "paid" | "credit" | "settled";
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
      transport_fuel_vendor_id: "",
      vendor_name: "",
      payment_mode: "cash",
      payment_status: "paid",
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

  // Fetch fuel vendors
  const { data: vendorsData } = useQuery({
    queryKey: ["transport-fuel-vendors-list"],
    queryFn: () => fuelVendorApi.index({ is_active: true, per_page: 300 }),
    enabled: open,
  });

  const vehicles = (vehiclesData?.data ?? []) as any[];
  const drivers = (driversData?.data ?? []) as any[];
  const vendors = React.useMemo(() => {
    const raw: any = vendorsData?.data;
    if (Array.isArray(raw?.data)) return raw.data as FuelVendor[];
    if (Array.isArray(raw)) return raw as FuelVendor[];
    return [];
  }, [vendorsData]);

  const selectedVendorId = watch("transport_fuel_vendor_id");
  const selectedVendorObj = React.useMemo(() => {
    if (!selectedVendorId) return null;
    return vendors.find((v) => String(v.id) === String(selectedVendorId)) || null;
  }, [selectedVendorId, vendors]);

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
          transport_fuel_vendor_id: (data as any).transport_fuel_vendor_id ? String((data as any).transport_fuel_vendor_id) : "",
          vendor_name: data.vendor_name || "",
          payment_mode: data.payment_mode || "cash",
          payment_status: ((data as any).payment_status as "paid" | "credit") || "paid",
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
          transport_fuel_vendor_id: "",
          vendor_name: "",
          payment_mode: "cash",
          payment_status: "paid",
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
      if (formData.transport_fuel_vendor_id) {
        fd.append("transport_fuel_vendor_id", String(formData.transport_fuel_vendor_id));
      }
      if (formData.vendor_name) fd.append("vendor_name", formData.vendor_name);
      if (formData.payment_mode) fd.append("payment_mode", formData.payment_mode);
      if (formData.payment_status) fd.append("payment_status", formData.payment_status);
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
      queryClient.invalidateQueries({ queryKey: ["transport-fuel-vendors-list"] });
      queryClient.invalidateQueries({ queryKey: ["transport-fuel-vendor-ledger"] });
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
      <DialogContent className="w-[95vw] sm:max-w-[620px] max-h-[85vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-4 sm:p-5 pb-3 border-b shrink-0 bg-background">
          <DialogTitle className="flex items-center gap-2 text-base">
            <Fuel className="size-5 text-emerald-600" />
            <span>{isEditMode ? "Edit Fuel Record" : "Record Fuel Refill & Mileage"}</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col flex-1 overflow-hidden min-h-0">
          <div className="overflow-y-auto px-4 sm:px-6 py-4 space-y-4 flex-1">
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

          {/* Petrol Pump / Vendor Selection & Payment Status */}
          <div className="rounded-xl border border-border/70 p-4 bg-muted/20 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Building2 className="size-3.5 text-primary" /> Petrol Pump & Payment Terms
              </span>
              {watch("payment_status") === "credit" && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/50 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900">
                  <Clock className="size-3" /> Credit Refill (Pay Later)
                </span>
              )}
            </div>

            {/* Petrol Pump Selection */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="vendor_id" className="text-xs font-semibold">
                  Select Petrol Pump (Vendor)
                </Label>
                <a
                  href="/transport/vendors"
                  target="_blank"
                  className="text-[11px] text-primary hover:underline flex items-center gap-0.5"
                >
                  <span>+ Manage Pumps</span>
                  <ExternalLink className="size-2.5" />
                </a>
              </div>

              <Select
                value={watch("transport_fuel_vendor_id") ? String(watch("transport_fuel_vendor_id")) : "manual"}
                onValueChange={(val) => {
                  if (val === "manual") {
                    setValue("transport_fuel_vendor_id", "");
                  } else {
                    setValue("transport_fuel_vendor_id", Number(val));
                    const selectedV = vendors.find((v) => String(v.id) === String(val));
                    if (selectedV) {
                      setValue("vendor_name", selectedV.name);
                    }
                  }
                }}
              >
                <SelectTrigger id="vendor_id" className="w-full bg-background">
                  <SelectValue placeholder="Choose a registered petrol pump..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">✍️ Other / Unregistered Petrol Pump</SelectItem>
                  {vendors.map((v) => (
                    <SelectItem key={v.id} value={String(v.id)}>
                      {v.name} {v.city ? `(${v.city})` : ""} {Number(v.outstanding_balance) > 0 ? `• Due: ₹${Number(v.outstanding_balance).toLocaleString("en-IN")}` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selected Pump Summary Card OR Manual Input */}
            {selectedVendorObj ? (
              <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-lg bg-background border border-border/80 text-xs">
                <div className="flex items-center gap-2">
                  <Building2 className="size-4 text-primary shrink-0" />
                  <div>
                    <span className="font-semibold text-foreground">{selectedVendorObj.name}</span>
                    <span className="text-muted-foreground ml-1.5">
                      {selectedVendorObj.city ? `(${selectedVendorObj.city})` : ""}
                      {selectedVendorObj.contact_phone ? ` • Ph: ${selectedVendorObj.contact_phone}` : ""}
                    </span>
                  </div>
                </div>
                <div>
                  {Number(selectedVendorObj.outstanding_balance) > 0 ? (
                    <Badge variant="outline" className="border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[11px] font-bold">
                      Current Due: ₹{Number(selectedVendorObj.outstanding_balance).toLocaleString("en-IN")}
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px]">
                      Nil Due (₹0)
                    </Badge>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <Label htmlFor="vendor_name" className="text-xs font-semibold">
                  Pump / Supplier Name
                </Label>
                <Input
                  id="vendor_name"
                  placeholder="e.g. Sharma Petrol Pump, NH-31"
                  className="bg-background"
                  {...register("vendor_name")}
                />
              </div>
            )}

            {/* Payment Terms: Segmented Control */}
            <div className="space-y-2 pt-1">
              <Label className="text-xs font-semibold">Payment Terms</Label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-muted/60 rounded-xl border border-border/70">
                <button
                  type="button"
                  onClick={() => {
                    setValue("payment_status", "paid");
                    if (watch("payment_mode") === "credit") setValue("payment_mode", "cash");
                  }}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    watch("payment_status") !== "credit"
                      ? "bg-background text-foreground shadow-xs border border-border/80"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <CheckCircle2 className={`size-4 ${watch("payment_status") !== "credit" ? "text-emerald-600" : ""}`} />
                  <span>Paid Immediately</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setValue("payment_status", "credit");
                    setValue("payment_mode", "credit");
                  }}
                  className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    watch("payment_status") === "credit"
                      ? "bg-amber-500 text-white shadow-xs font-bold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Clock className="size-4" />
                  <span>Credit (Pay Later)</span>
                </button>
              </div>
            </div>

            {/* Payment Details Inputs */}
            {watch("payment_status") === "credit" ? (
              <div className="space-y-3 pt-1">
                <div className="space-y-1.5">
                  <Label htmlFor="invoice_number" className="text-xs font-semibold">Slip / Bill Number</Label>
                  <Input
                    id="invoice_number"
                    placeholder="e.g. HP-94812"
                    className="bg-background"
                    {...register("invoice_number")}
                  />
                </div>

                <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-2.5 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                  <AlertCircle className="size-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                  <span>
                    This fuel expense of <strong>₹{(watch("total_amount") || calculatedTotal).toLocaleString()}</strong> will be logged under <strong>{watch("vendor_name") || selectedVendorObj?.name || "the selected petrol pump"}</strong> as an unsettled credit balance. You can record payments later under <strong>Transport → Fuel Vendors</strong>.
                  </span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <Label htmlFor="payment_mode" className="text-xs font-semibold">Payment Mode</Label>
                  <Select
                    value={watch("payment_mode") || "cash"}
                    onValueChange={(val) => setValue("payment_mode", val)}
                  >
                    <SelectTrigger id="payment_mode" className="bg-background">
                      <SelectValue placeholder="Payment Mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">💵 Cash</SelectItem>
                      <SelectItem value="upi">📱 UPI / Online</SelectItem>
                      <SelectItem value="card">💳 Debit / Credit Card</SelectItem>
                      <SelectItem value="fuel_card">⛽ Fuel Card</SelectItem>
                      <SelectItem value="bank_transfer">🏦 Bank Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="invoice_number" className="text-xs font-semibold">Slip / Bill Number</Label>
                  <Input
                    id="invoice_number"
                    placeholder="e.g. HP-94812"
                    className="bg-background"
                    {...register("invoice_number")}
                  />
                </div>
              </div>
            )}
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
          </div>

          <DialogFooter className="p-3 sm:p-4 border-t shrink-0 bg-muted/20 flex flex-row items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={mutation.isPending}>
              Cancel
            </Button>
            <Button type="submit" size="sm" disabled={mutation.isPending} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {mutation.isPending ? "Saving..." : isEditMode ? "Update Fuel" : "Save Fuel Entry"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
