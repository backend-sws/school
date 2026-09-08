import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ModalDialog } from "@/components/shared/Modal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Utensils, Home, Calculator } from "lucide-react";
import { hostelApi, type HostelAllocation } from "@/lib/api/hostelApi";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { FORM_TYPE } from "@/constants/shared/form";
import UserApi from "@/lib/api/userApi";
import { UserQueryKeys } from "@/lib/querykey/user";
import type { AsyncSelectConfig } from "@/types";

export type AllocationDialogData = HostelAllocation | null;

interface AllocationDialogProps {
  open: boolean;
  onClose: () => void;
  data?: AllocationDialogData;
}

export function AllocationDialog({ open, onClose, data }: AllocationDialogProps) {
  const isEditing = !!data;
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      user_id: null as number | null,
      hostel_id: null as number | null,
      hostel_floor_id: null as number | null,
      hostel_room_id: null as number | null,
      hostel_bed_id: null as number | null,
      hostel_mess_plan_id: null as string | null,
      check_in_date: new Date().toISOString().split('T')[0],
      check_out_date: "",
      status: "active",
      remarks: "",
    },
  });

  const { control, handleSubmit, reset, setError, watch } = form;

  const selectedHostelId = watch("hostel_id");
  const selectedFloorId = watch("hostel_floor_id");
  const selectedRoomId = watch("hostel_room_id");
  const selectedMessPlanId = watch("hostel_mess_plan_id");

  // User Search Async Config
  const userAsyncConfig: AsyncSelectConfig = useMemo(() => ({
    queryFn: (params) => UserApi.getUser(params),
    queryKey: UserQueryKeys.all,
    labelKey: "name",
    valueKey: "id",
    searchKey: "search",
    perPage: 50,
    multiple: false,
  }), []);

  // Fetch Hostels
  const { data: hostelsResponse, isLoading: isLoadingHostels } = useQuery({
    queryKey: ["hostel-options"],
    queryFn: () => hostelApi.hostels.index({ per_page: 100 }),
    enabled: open && !isEditing,
  });

  // Fetch Floors for selected Hostel
  const { data: floorsResponse, isLoading: isLoadingFloors } = useQuery({
    queryKey: ["hostel-floor-options", selectedHostelId],
    queryFn: () => hostelApi.floors.index(selectedHostelId as number),
    enabled: open && !isEditing && !!selectedHostelId,
  });

  // Fetch Rooms for selected Floor (or Hostel if no floor)
  const { data: roomsResponse, isLoading: isLoadingRooms } = useQuery({
    queryKey: ["hostel-room-options", selectedHostelId, selectedFloorId],
    queryFn: () => hostelApi.rooms.index({
      hostel_id: selectedHostelId,
      hostel_floor_id: selectedFloorId,
      availability: "available",
      per_page: 500
    }),
    enabled: open && !isEditing && !!selectedHostelId,
  });

  // Fetch Beds for selected Room
  const { data: bedsResponse, isLoading: isLoadingBeds } = useQuery({
    queryKey: ["hostel-beds-options", selectedRoomId],
    queryFn: () => hostelApi.beds.index({ hostel_room_id: selectedRoomId, per_page: 100 }),
    enabled: open && !isEditing && !!selectedRoomId,
  });

  // Fetch Active Mess Plans
  const { data: messPlansResponse, isLoading: isLoadingMessPlans } = useQuery({
    queryKey: ["hostel-mess-plans-active"],
    queryFn: () => hostelApi.messPlans.index({ is_active: true, per_page: 100 }),
    enabled: open,
  });

  const hostelOptions = (hostelsResponse?.data || []).map((h: any) => ({
    key: String(h.id),
    value: String(h.id),
    text: h.name,
    label: h.name
  }));

  const floors = Array.isArray(floorsResponse) ? floorsResponse : (floorsResponse?.data || []);
  const floorOptions = floors.map((f: any) => ({
    key: String(f.id),
    value: String(f.id),
    text: `${f.name} (Floor ${f.floor_number})`,
    label: `${f.name} (Floor ${f.floor_number})`
  }));

  const rooms = Array.isArray(roomsResponse) ? roomsResponse : (roomsResponse?.data || []);
  const roomOptions = rooms.map((r: any) => ({
    key: String(r.id),
    value: String(r.id),
    text: `Room ${r.room_number} (${r.type || 'Standard'} — ₹${Number(r.monthly_fee || 0).toLocaleString('en-IN')}/mo)`,
    label: `Room ${r.room_number}`
  }));

  const beds = Array.isArray(bedsResponse) ? bedsResponse : (bedsResponse?.data || []);
  const bedOptions = beds
    .filter((b: any) => b.status === "vacant")
    .map((b: any) => ({
      key: String(b.id),
      value: String(b.id),
      text: `Bed ${b.bed_label}`,
      label: `Bed ${b.bed_label}`
    }));

  const messPlans = Array.isArray(messPlansResponse) ? messPlansResponse : (messPlansResponse?.data || []);
  const messPlanOptions = [
    { key: "none", value: "none", text: "None / No Mess Plan (₹0)", label: "None / No Mess Plan (₹0)" },
    ...messPlans.map((mp: any) => ({
      key: String(mp.id),
      value: String(mp.id),
      text: `${mp.name} (${mp.type}) — ₹${Number(mp.monthly_fee || 0).toLocaleString('en-IN')}/mo`,
      label: `${mp.name} (${mp.type}) — ₹${Number(mp.monthly_fee || 0).toLocaleString('en-IN')}/mo`
    }))
  ];

  // Pricing calculations for live preview
  const selectedRoom = rooms.find((r: any) => String(r.id) === String(selectedRoomId));
  const roomPrice = Number(selectedRoom?.monthly_fee || 0);

  const selectedMessPlan = selectedMessPlanId && selectedMessPlanId !== "none"
    ? messPlans.find((mp: any) => String(mp.id) === String(selectedMessPlanId))
    : null;
  const messPrice = Number(selectedMessPlan?.monthly_fee || 0);
  const totalMonthlyFee = roomPrice + messPrice;

  useEffect(() => {
    if (open) {
      if (data) {
        reset({
          hostel_mess_plan_id: data.hostel_mess_plan_id ? String(data.hostel_mess_plan_id) : "none",
          status: data.status || "active",
          check_out_date: data.check_out_date || "",
          remarks: data.remarks || "",
        });
      } else {
        reset({
          user_id: null,
          hostel_id: null,
          hostel_floor_id: null,
          hostel_room_id: null,
          hostel_bed_id: null,
          hostel_mess_plan_id: null,
          check_in_date: new Date().toISOString().split('T')[0],
          check_out_date: "",
          status: "active",
          remarks: "",
        });
      }
    }
  }, [open, data, reset]);

  // Reset dependent fields when parent changes
  useEffect(() => {
    if (!open || isEditing) return;
    form.setValue("hostel_floor_id", null);
    form.setValue("hostel_room_id", null);
    form.setValue("hostel_bed_id", null);
  }, [selectedHostelId]);

  useEffect(() => {
    if (!open || isEditing) return;
    form.setValue("hostel_room_id", null);
    form.setValue("hostel_bed_id", null);
  }, [selectedFloorId]);

  useEffect(() => {
    if (!open || isEditing) return;
    form.setValue("hostel_bed_id", null);
  }, [selectedRoomId]);

  const saveMutation = useMutation({
    mutationFn: (values: any) => {
      const messPlanId = values.hostel_mess_plan_id && values.hostel_mess_plan_id !== "none"
        ? Number(values.hostel_mess_plan_id)
        : null;
      if (isEditing) {
        return hostelApi.allocations.update(data!.id, {
          status: values.status,
          check_out_date: values.check_out_date || null,
          hostel_mess_plan_id: messPlanId,
          remarks: values.remarks,
        });
      }
      return hostelApi.allocations.store({
        ...values,
        hostel_mess_plan_id: messPlanId,
      });
    },
    onSuccess: (response) => {
      toast.success(response.message || `Allocation ${isEditing ? "updated" : "created"} successfully`);
      queryClient.invalidateQueries({ queryKey: ["hostel-allocations"] });
      queryClient.invalidateQueries({ queryKey: ["hostel-rooms"] });
      queryClient.invalidateQueries({ queryKey: ["hostel-beds-options"] });
      onClose();
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(([key, messages]) => {
          setError(key as any, {
            type: "manual",
            message: (messages as string[])[0],
          });
        });
      } else {
        toast.error(error.response?.data?.message || "Failed to save allocation");
      }
    },
  });

  const onSubmit = (values: any) => {
    saveMutation.mutate(values);
  };

  return (
    <ModalDialog
      open={open}
      onClose={onClose as any}
      title={isEditing ? "Update Allocation" : "New Allocation"}
      description={isEditing ? "Update allocation status, mess plan, or check-out date." : "Allocate a room, bed, and optional mess plan to a user."}
      handleSubmit={handleSubmit(onSubmit)}
      isLoading={saveMutation.isPending || isLoadingHostels || isLoadingFloors || isLoadingRooms || isLoadingBeds || isLoadingMessPlans}
      submitLabel={isEditing ? "Update Allocation" : "Create Allocation"}
    >
      <div className="grid gap-4 py-2">
        {isEditing && data ? (
          <div className="bg-muted/30 p-4 rounded-md space-y-3 mb-2 border">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold uppercase text-muted-foreground">User</span>
                <p className="font-medium">{data.user?.name}</p>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold uppercase text-muted-foreground">Check-in</span>
                <p className="font-medium">{data.check_in_date}</p>
              </div>
            </div>
            <div className="pt-2 border-t flex flex-wrap items-center justify-between text-sm gap-2">
              <div className="text-muted-foreground">
                Hostel: <span className="font-medium text-foreground">{data.room?.hostel?.name}</span>
              </div>
              <div className="text-muted-foreground">
                Room: <span className="font-medium text-foreground">{data.room?.room_number} (₹{Number(data.room_monthly_amount ?? data.room?.monthly_fee ?? 0).toLocaleString('en-IN')}/mo)</span>
              </div>
              <div className="text-muted-foreground">
                Bed: <span className="font-medium text-foreground">{data.bed?.bed_label || "Auto"}</span>
              </div>
              <div className="text-muted-foreground">
                Mess Plan: <span className="font-medium text-foreground">{data.mess_plan?.name ? `${data.mess_plan.name} (₹${Number(data.mess_monthly_amount ?? data.mess_plan.monthly_fee ?? 0).toLocaleString('en-IN')}/mo)` : "None"}</span>
              </div>
              <div className="text-muted-foreground w-full flex items-center justify-between pt-1 border-t border-dashed">
                <span className="text-xs font-medium">Total Monthly Fee (Ledger):</span>
                <span className="font-bold text-base text-primary">₹{Number(data.monthly_amount ?? 0).toLocaleString('en-IN')}/mo</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            <ControlledFormComponent
              control={control}
              name="user_id"
              type={FORM_TYPE.ASYNC_SELECT}
              label="Resident (User)"
              required
              asyncConfig={userAsyncConfig}
              placeholder="Search by name, reg no, or email..."
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <ControlledFormComponent
                  control={control}
                  name="hostel_id"
                  type={FORM_TYPE.SELECT}
                  label="Hostel"
                  required
                  options={hostelOptions}
                  placeholder={isLoadingHostels ? "Loading..." : "Select hostel"}
                  disabled={isLoadingHostels}
                  searchable
                />
              </div>
              <div className="col-span-1">
                <ControlledFormComponent
                  control={control}
                  name="hostel_floor_id"
                  type={FORM_TYPE.SELECT}
                  label="Floor"
                  options={floorOptions}
                  placeholder={!selectedHostelId ? "Select hostel first" : isLoadingFloors ? "Loading..." : "All Floors"}
                  disabled={!selectedHostelId || isLoadingFloors}
                  searchable
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <ControlledFormComponent
                  control={control}
                  name="hostel_room_id"
                  type={FORM_TYPE.SELECT}
                  label="Room"
                  required
                  options={roomOptions}
                  placeholder={!selectedHostelId ? "Select hostel first" : isLoadingRooms ? "Loading..." : "Select room"}
                  disabled={!selectedHostelId || isLoadingRooms}
                  searchable
                />
              </div>
              <div className="col-span-1">
                <ControlledFormComponent
                  control={control}
                  name="hostel_bed_id"
                  type={FORM_TYPE.SELECT}
                  label="Bed"
                  options={bedOptions}
                  placeholder={
                    !selectedRoomId
                      ? "Select room first"
                      : isLoadingBeds
                        ? "Loading beds..."
                        : bedOptions.length === 0
                          ? "No vacant beds"
                          : "Auto-assign or select"
                  }
                  disabled={!selectedRoomId || isLoadingBeds || bedOptions.length === 0}
                  tooltip="Leave blank to auto-assign the first vacant bed."
                  searchable
                />
              </div>
            </div>

            <ControlledFormComponent
              control={control}
              name="hostel_mess_plan_id"
              type={FORM_TYPE.SELECT}
              label="Dining / Mess Plan (Optional)"
              options={messPlanOptions}
              placeholder={isLoadingMessPlans ? "Loading plans..." : "Select dining plan (Optional)"}
              disabled={isLoadingMessPlans}
              tooltip="Select a dining/meal plan for this resident. The monthly fee will be combined with room rent in the Student Fee Ledger."
              searchable
            />

            {/* Live Fee Preview Card */}
            {selectedRoom && (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2.5 transition-all animate-in fade-in">
                <div className="flex items-center justify-between text-xs font-bold text-primary uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <Calculator className="size-3.5" />
                    Monthly Fee Ledger Preview
                  </span>
                  <span className="text-[10px] font-semibold lowercase bg-primary/10 text-primary px-2.5 py-0.5 rounded-full">
                    Auto-added to Fee Ledger
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-primary/10 text-xs">
                  <div>
                    <span className="text-muted-foreground block text-[11px] flex items-center gap-1">
                      <Home className="size-3" /> Room Rent
                    </span>
                    <span className="font-semibold text-foreground">₹{roomPrice.toLocaleString('en-IN')}/mo</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[11px] flex items-center gap-1">
                      <Utensils className="size-3" /> Mess Plan
                    </span>
                    <span className="font-semibold text-foreground">
                      {messPrice > 0 ? `+ ₹${messPrice.toLocaleString('en-IN')}/mo` : "₹0 (None)"}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-muted-foreground block text-[11px]">Total Monthly</span>
                    <span className="font-black text-sm text-primary">₹{totalMonthlyFee.toLocaleString('en-IN')}/mo</span>
                  </div>
                </div>
              </div>
            )}

            <ControlledFormComponent
              control={control}
              name="check_in_date"
              type={FORM_TYPE.DATE}
              label="Check-in Date"
              required
            />
          </>
        )}

        {isEditing && (
          <>
            <ControlledFormComponent
              control={control}
              name="hostel_mess_plan_id"
              type={FORM_TYPE.SELECT}
              label="Dining / Mess Plan"
              options={messPlanOptions}
              placeholder={isLoadingMessPlans ? "Loading plans..." : "Select dining plan"}
              disabled={isLoadingMessPlans}
              tooltip="Updating this will update the resident's monthly billing in the Student Fee Ledger."
              searchable
            />

            <ControlledFormComponent
              control={control}
              name="status"
              type={FORM_TYPE.SELECT}
              label="Status"
              required
              options={[
                { value: "active", text: "Active" },
                { value: "checked_out", text: "Checked Out" },
                { value: "cancelled", text: "Cancelled" },
              ]}
            />

            <ControlledFormComponent
              control={control}
              name="check_out_date"
              type={FORM_TYPE.DATE}
              label="Check-out Date"
              tooltip="Required if status is changed to Checked Out."
            />
          </>
        )}

        <ControlledFormComponent
          control={control}
          name="remarks"
          type={FORM_TYPE.TEXTAREA}
          label="Remarks"
          placeholder="Any additional notes..."
          rows={2}
        />
      </div>
    </ModalDialog>
  );
}
