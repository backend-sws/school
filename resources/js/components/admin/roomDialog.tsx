import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { ModalDialog } from "@/components/shared/Modal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { hostelApi, type HostelRoom } from "@/lib/api/hostelApi";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { FORM_TYPE } from "@/constants/shared/form";

export type RoomDialogData = HostelRoom | null;

interface RoomDialogProps {
  open: boolean;
  onClose: () => void;
  data?: RoomDialogData;
}

export function RoomDialog({ open, onClose, data }: RoomDialogProps) {
  const isEditing = !!data;
  const queryClient = useQueryClient();

  // Fetch hostels for the dropdown
  const { data: hostelsResponse } = useQuery({
    queryKey: ["hostel-hostels-options"],
    queryFn: () => hostelApi.hostels.index({ per_page: 100 }), // Get all for select
    enabled: open,
  });
  
  const hostels = hostelsResponse?.data || [];
  const hostelOptions = hostels.map((h: any) => ({ 
    key: String(h.id),
    value: String(h.id), 
    text: h.name,
    label: h.name 
  }));

  const form = useForm({
    defaultValues: {
      hostel_id: null as number | null,
      floor_name: "",
      room_number: "",
      type: "double",
      bed_count: 2,
      monthly_fee: "",
      amenities: [],
      is_active: true,
    },
  });

  const { control, handleSubmit, reset, setError } = form;

  useEffect(() => {
    if (open) {
      if (data) {
        reset({
          hostel_id: data.hostel_id || null,
          floor_name: data.floor?.name || "",
          room_number: data.room_number || "",
          type: data.type || "double",
          bed_count: data.bed_count || 2,
          monthly_fee: data.monthly_fee ? String(data.monthly_fee) : "",
          amenities: data.amenities || [],
          is_active: data.is_active ?? true,
        });
      } else {
        reset({
          hostel_id: null,
          floor_name: "",
          room_number: "",
          type: "double",
          bed_count: 2,
          monthly_fee: "",
          amenities: [],
          is_active: true,
        });
      }
    }
  }, [open, data, reset]);

  const saveMutation = useMutation({
    mutationFn: (values: any) => {
      if (isEditing) {
        return hostelApi.rooms.update(data!.id, values);
      }
      return hostelApi.rooms.store(values);
    },
    onSuccess: (response) => {
      toast.success(response.message || `Room ${isEditing ? "updated" : "created"} successfully`);
      queryClient.invalidateQueries({ queryKey: ["hostel-rooms"] });
      onClose();
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        Object.entries(error.response.data.errors).forEach(([key, messages]) => {
          setError(key as any, { type: "server", message: (messages as string[])[0] });
        });
      } else {
        toast.error(error.response?.data?.message || "Failed to save room");
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
      title={isEditing ? "Edit Room" : "Add Room"}
      description={isEditing ? "Update details for this hostel room." : "Enter details for the new hostel room."}
      handleSubmit={handleSubmit(onSubmit)}
      isLoading={saveMutation.isPending}
      submitLabel={isEditing ? "Update" : "Create"}
    >
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-2 gap-4">
          <ControlledFormComponent
            control={control}
            name="hostel_id"
            type={FORM_TYPE.SELECT}
            label="Hostel"
            required
            options={hostelOptions}
            placeholder="Select hostel"
            className="col-span-1"
            searchable
          />
          <ControlledFormComponent
            control={control}
            name="floor_name"
            type={FORM_TYPE.TEXT}
            label="Floor"
            placeholder="Enter floor name (e.g. Ground Floor)"
            className="col-span-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ControlledFormComponent
            control={control}
            name="room_number"
            type={FORM_TYPE.TEXT}
            label="Room Number"
            required
            placeholder="e.g. 101"
            className="col-span-1"
          />
          <ControlledFormComponent
            control={control}
            name="type"
            type={FORM_TYPE.SELECT}
            label="Type"
            required
            options={[
              { value: "single", label: "Single" },
              { value: "double", label: "Double" },
              { value: "triple", label: "Triple" },
              { value: "dormitory", label: "Dormitory" },
            ]}
            className="col-span-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <ControlledFormComponent
            control={control}
            name="bed_count"
            type={FORM_TYPE.NUMBER}
            label="Bed Capacity"
            required
            min={1}
            max={50}
            className="col-span-1"
          />
          <ControlledFormComponent
            control={control}
            name="monthly_fee"
            type={FORM_TYPE.NUMBER}
            label="Monthly Fee"
            required
            placeholder="Enter monthly fee"
            min={0}
            className="col-span-1"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-1">
            <ControlledFormComponent
              control={control}
              name="amenities"
              type={FORM_TYPE.MULTI_TAG}
              label="Amenities"
              predefinedTags={["AC", "Non-AC", "Attached Bath", "Balcony", "Window"]}
              placeholder="Select or type amenities"
            />
          </div>
          <div className="col-span-1 flex items-center h-full pt-6">
            <ControlledFormComponent
              control={control}
              name="is_active"
              type={FORM_TYPE.CHECKBOX}
              label="Active"
              tooltip="If inactive, this room cannot be allocated"
            />
          </div>
        </div>
      </div>
    </ModalDialog>
  );
}
