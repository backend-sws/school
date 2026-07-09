import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ModalDialog } from "@/components/shared/Modal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { hostelApi, type HostelAllocation } from "@/lib/api/hostelApi";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { FORM_TYPE } from "@/constants/shared/form";
import UserApi from "@/lib/api/userApi";
import { UserQueryKeys } from "@/lib/querykey/user";

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

  // Fetch Users
  const { data: usersResponse, isLoading: isLoadingUsers } = useQuery({
    queryKey: UserQueryKeys.all,
    queryFn: () => UserApi.getUser({ per_page: 200 }),
    enabled: open && !isEditing,
  });

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

  const users = Array.isArray(usersResponse) ? usersResponse : (usersResponse?.data || []);
  const userOptions = users.map((u: any) => {
    const sp = u.student_profile;
    const classInfo = sp?.stream?.name ? sp.stream.name : "";
    const regNo = sp?.reg_no ? `Reg: ${sp.reg_no}` : "";
    const extra = [classInfo, regNo].filter(Boolean).join(" | ");
    const textLabel = extra ? `${u.name} (${extra})` : u.name;
    return {
      key: String(u.id),
      value: String(u.id),
      text: textLabel,
      label: textLabel
    };
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
    text: `Room ${r.room_number}`,
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

  useEffect(() => {
    if (open) {
      if (data) {
        reset({
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
      if (isEditing) {
        return hostelApi.allocations.update(data!.id, {
          status: values.status,
          check_out_date: values.check_out_date || null,
          remarks: values.remarks,
        });
      }
      return hostelApi.allocations.store(values);
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
      description={isEditing ? "Update check-out date or status." : "Allocate a room and bed to a user."}
      handleSubmit={handleSubmit(onSubmit)}
      isLoading={saveMutation.isPending || isLoadingHostels || isLoadingFloors || isLoadingRooms || isLoadingBeds}
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
            <div className="pt-2 border-t flex items-center justify-between text-sm">
              <div className="text-muted-foreground">
                Hostel: <span className="font-medium text-foreground">{data.room?.hostel?.name}</span>
              </div>
              <div className="text-muted-foreground">
                Room: <span className="font-medium text-foreground">{data.room?.room_number}</span>
              </div>
              <div className="text-muted-foreground">
                Bed: <span className="font-medium text-foreground">{data.bed?.bed_label || "Auto"}</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            <ControlledFormComponent
              control={control}
              name="user_id"
              type={FORM_TYPE.SELECT}
              label="Resident (User)"
              required
              options={userOptions}
              placeholder={isLoadingUsers ? "Loading users..." : "Select user"}
              disabled={isLoadingUsers}
              searchable
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
