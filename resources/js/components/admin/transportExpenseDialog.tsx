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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import transportApi from "@/lib/api/transportApi";
import { toast } from "sonner";
import { Wrench, UploadCloud, FileText, CalendarClock } from "lucide-react";

export type ExpenseLogData = {
  id?: number;
  transport_vehicle_id: number | string;
  expense_date: string;
  category: string;
  title: string;
  amount: number | string;
  odometer_reading?: number | string;
  vendor_name?: string;
  invoice_number?: string;
  bill_url?: string;
  next_service_date?: string;
  next_service_odometer?: number | string;
  payment_mode: string;
  notes?: string;
};

interface TransportExpenseDialogProps {
  open: boolean;
  onClose: () => void;
  data?: ExpenseLogData | null;
  preselectedVehicleId?: number;
  onSuccess?: () => void;
}

const defaultDate = () => new Date().toISOString().slice(0, 10);

const EXPENSE_CATEGORIES = [
  { value: "maintenance", label: "Periodic Service / Maintenance" },
  { value: "repair", label: "Mechanical / Engine Repair" },
  { value: "electrical", label: "Electrical / AC Repair" },
  { value: "tyre", label: "Tyres & Wheel Alignment" },
  { value: "battery", label: "Battery Replacement / Check" },
  { value: "cleaning", label: "Washing & Detailing" },
  { value: "insurance", label: "Insurance Premium" },
  { value: "puc", label: "Pollution (PUC) Certificate" },
  { value: "fitness", label: "Fitness Certificate / Renewal" },
  { value: "road_tax", label: "Road Tax / Permit Fee" },
  { value: "toll", label: "Toll, Parking & Fastag" },
  { value: "fine", label: "Traffic Challan / Fine" },
  { value: "other", label: "Other Expense" },
];

export function TransportExpenseDialog({
  open,
  onClose,
  data,
  preselectedVehicleId,
  onSuccess,
}: TransportExpenseDialogProps) {
  const queryClient = useQueryClient();
  const isEditMode = !!data?.id;
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
  } = useForm<ExpenseLogData>({
    defaultValues: {
      transport_vehicle_id: preselectedVehicleId ?? "",
      expense_date: defaultDate(),
      category: "maintenance",
      title: "",
      amount: "",
      odometer_reading: "",
      vendor_name: "",
      invoice_number: "",
      next_service_date: "",
      next_service_odometer: "",
      payment_mode: "cash",
      notes: "",
    },
  });

  const selectedVehicleId = watch("transport_vehicle_id");

  // Fetch vehicles
  const { data: vehiclesData } = useQuery({
    queryKey: ["transport-vehicles-all"],
    queryFn: () => transportApi.vehicles.index({ per_page: 500 }),
    enabled: open,
  });

  const vehicles = (vehiclesData?.data ?? []) as any[];

  // Auto-fill odometer from vehicle
  useEffect(() => {
    if (!isEditMode && selectedVehicleId) {
      const v = vehicles.find((veh) => String(veh.id) === String(selectedVehicleId));
      if (v && Number(v.current_odometer) > 0 && !watch("odometer_reading")) {
        setValue("odometer_reading", Number(v.current_odometer));
      }
    }
  }, [selectedVehicleId, vehicles, isEditMode, setValue, watch]);

  useEffect(() => {
    if (open) {
      setSelectedFile(null);
      if (data?.id) {
        reset({
          transport_vehicle_id: data.transport_vehicle_id,
          expense_date: typeof data.expense_date === "string" ? data.expense_date.slice(0, 10) : defaultDate(),
          category: data.category || "maintenance",
          title: data.title || "",
          amount: data.amount,
          odometer_reading: data.odometer_reading ?? "",
          vendor_name: data.vendor_name || "",
          invoice_number: data.invoice_number || "",
          bill_url: data.bill_url || "",
          next_service_date: data.next_service_date ? String(data.next_service_date).slice(0, 10) : "",
          next_service_odometer: data.next_service_odometer ?? "",
          payment_mode: data.payment_mode || "cash",
          notes: data.notes || "",
        });
      } else {
        reset({
          transport_vehicle_id: preselectedVehicleId ?? "",
          expense_date: defaultDate(),
          category: "maintenance",
          title: "",
          amount: "",
          odometer_reading: "",
          vendor_name: "",
          invoice_number: "",
          bill_url: "",
          next_service_date: "",
          next_service_odometer: "",
          payment_mode: "cash",
          notes: "",
        });
      }
    }
  }, [open, data, preselectedVehicleId, reset]);

  const mutation = useMutation({
    mutationFn: (formData: ExpenseLogData) => {
      const fd = new FormData();
      fd.append("transport_vehicle_id", String(formData.transport_vehicle_id));
      fd.append("expense_date", formData.expense_date);
      fd.append("category", formData.category);
      fd.append("title", formData.title);
      fd.append("amount", String(formData.amount));
      if (formData.odometer_reading !== "" && formData.odometer_reading !== undefined) {
        fd.append("odometer_reading", String(formData.odometer_reading));
      }
      if (formData.vendor_name) fd.append("vendor_name", formData.vendor_name);
      if (formData.invoice_number) fd.append("invoice_number", formData.invoice_number);
      if (formData.next_service_date) fd.append("next_service_date", formData.next_service_date);
      if (formData.next_service_odometer) fd.append("next_service_odometer", String(formData.next_service_odometer));
      if (formData.payment_mode) fd.append("payment_mode", formData.payment_mode);
      if (formData.notes) fd.append("notes", formData.notes);
      if (selectedFile) {
        fd.append("bill_file", selectedFile);
      }

      return isEditMode
        ? transportApi.vehicleExpenses.update(data!.id!, fd)
        : transportApi.vehicleExpenses.store(fd);
    },
    onSuccess: () => {
      toast.success(isEditMode ? "Expense record updated successfully" : "Vehicle expense recorded successfully");
      queryClient.invalidateQueries({ queryKey: ["transport-vehicle-expenses"] });
      queryClient.invalidateQueries({ queryKey: ["transport-vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["transport-vehicle-analytics"] });
      queryClient.invalidateQueries({ queryKey: ["transport-fleet-analytics"] });
      onSuccess?.();
      onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to record vehicle expense");
    },
  });

  const onSubmit = (formData: ExpenseLogData) => {
    if (!formData.transport_vehicle_id) {
      toast.error("Please select a vehicle");
      return;
    }
    if (!formData.title?.trim()) {
      toast.error("Please enter description / title of work");
      return;
    }
    if (!formData.amount || Number(formData.amount) <= 0) {
      toast.error("Please enter expense amount");
      return;
    }
    mutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[620px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wrench className="size-5 text-amber-600" />
            <span>{isEditMode ? "Edit Vehicle Expense" : "Record Vehicle Expense & Maintenance"}</span>
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
              <Label htmlFor="expense_date" className="text-xs font-semibold">
                Expense Date <span className="text-destructive">*</span>
              </Label>
              <Input id="expense_date" type="date" {...register("expense_date", { required: true })} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Category */}
            <div className="space-y-1.5">
              <Label htmlFor="category" className="text-xs font-semibold">
                Expense Category <span className="text-destructive">*</span>
              </Label>
              <Select
                value={watch("category") || "maintenance"}
                onValueChange={(val) => setValue("category", val)}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {EXPENSE_CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div className="space-y-1.5">
              <Label htmlFor="amount" className="text-xs font-semibold">
                Amount (₹) <span className="text-destructive">*</span>
              </Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="e.g. 4500"
                {...register("amount", { required: true })}
              />
            </div>
          </div>

          {/* Title / Description */}
          <div className="space-y-1.5">
            <Label htmlFor="title" className="text-xs font-semibold">
              Work / Item Description <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="e.g. Full engine oil replacement, oil filter & coolant refill"
              {...register("title", { required: true })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Vendor / Garage */}
            <div className="space-y-1.5">
              <Label htmlFor="vendor_name" className="text-xs font-semibold">Workshop / Vendor</Label>
              <Input
                id="vendor_name"
                placeholder="e.g. Tata Authorized Service"
                {...register("vendor_name")}
              />
            </div>

            {/* Bill / Invoice Number */}
            <div className="space-y-1.5">
              <Label htmlFor="invoice_number" className="text-xs font-semibold">Invoice No</Label>
              <Input
                id="invoice_number"
                placeholder="e.g. INV-2026-881"
                {...register("invoice_number")}
              />
            </div>

            {/* Current Odometer */}
            <div className="space-y-1.5">
              <Label htmlFor="odometer_reading" className="text-xs font-semibold">Odometer at Service (KM)</Label>
              <Input
                id="odometer_reading"
                type="number"
                step="0.1"
                placeholder="e.g. 15800.0"
                {...register("odometer_reading")}
              />
            </div>
          </div>

          {/* Next Service Due Card */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-50/50 dark:bg-amber-950/20 p-4 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 dark:text-amber-300">
              <CalendarClock className="size-4" />
              <span>Next Service Due / Maintenance Alert (Optional)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="next_service_date" className="text-xs font-medium">
                  Next Service Due Date
                </Label>
                <Input id="next_service_date" type="date" {...register("next_service_date")} />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="next_service_odometer" className="text-xs font-medium">
                  Next Service Due Odometer (KM)
                </Label>
                <Input
                  id="next_service_odometer"
                  type="number"
                  step="0.1"
                  placeholder="e.g. 20000"
                  {...register("next_service_odometer")}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                  <SelectItem value="credit">Credit / Ledger</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bill / Invoice Upload */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Upload Invoice / Bill</Label>
              <div className="flex items-center gap-2">
                <label
                  htmlFor="expense_bill_file"
                  className="flex items-center gap-2 px-3 py-2 border rounded-lg cursor-pointer bg-muted/40 hover:bg-muted text-xs font-medium transition-colors w-full"
                >
                  <UploadCloud className="size-4 text-muted-foreground shrink-0" />
                  <span className="truncate">{selectedFile ? selectedFile.name : "Choose Bill (Image/PDF)"}</span>
                  <input
                    id="expense_bill_file"
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
                    className="flex items-center gap-1 text-xs text-primary underline shrink-0"
                  >
                    <FileText className="size-3.5" /> View
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="notes" className="text-xs font-semibold">Additional Notes</Label>
            <Textarea
              id="notes"
              rows={2}
              placeholder="e.g. 6-month warranty on battery, parts changed..."
              {...register("notes")}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={mutation.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={mutation.isPending} className="bg-amber-600 hover:bg-amber-700 text-white">
              {mutation.isPending ? "Saving..." : isEditMode ? "Update Expense" : "Save Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
