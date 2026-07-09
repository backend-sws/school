import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { hostelApi, type HostelComplaint } from "@/lib/api/hostelApi";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { FORM_TYPE } from "@/constants/shared/form";
import { Badge } from "@/components/ui/badge";

export type ComplaintDialogData = HostelComplaint | null;

interface ComplaintDialogProps {
  open: boolean;
  onClose: () => void;
  data?: ComplaintDialogData;
}

export function ComplaintDialog({ open, onClose, data }: ComplaintDialogProps) {
  const isEditing = !!data;
  const queryClient = useQueryClient();

  const { data: roomsResponse, isLoading: isLoadingRooms } = useQuery({
    queryKey: ["hostel-rooms-options"],
    queryFn: () => hostelApi.rooms.index({ per_page: 500 }),
    enabled: open && !isEditing,
  });

  const roomOptions = (roomsResponse?.data || []).map((r: any) => ({
    value: r.id,
    text: `${r.hostel?.name || 'Unknown Hostel'} - Room ${r.room_number}`
  }));

  const form = useForm({
    defaultValues: {
      hostel_room_id: null as number | null,
      subject: "",
      description: "",
      status: "open",
    },
  });

  const { control, handleSubmit, reset, setError } = form;

  useEffect(() => {
    if (open) {
      if (data) {
        reset({
          status: data.status || "open",
        });
      } else {
        reset({
          hostel_room_id: null,
          subject: "",
          description: "",
          status: "open",
        });
      }
    }
  }, [open, data, reset]);

  const saveMutation = useMutation({
    mutationFn: (values: any) => {
      if (isEditing) {
        return hostelApi.complaints.update(data!.id, { status: values.status });
      }
      return hostelApi.complaints.store(values);
    },
    onSuccess: (response) => {
      toast.success(response.message || `Complaint ${isEditing ? "updated" : "created"} successfully`);
      queryClient.invalidateQueries({ queryKey: ["hostel-complaints"] });
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
        toast.error(error.response?.data?.message || "Failed to save complaint");
      }
    },
  });

  const onSubmit = (values: any) => {
    saveMutation.mutate(values);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Update Complaint Status" : "Create Complaint"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Change the current status of this complaint." : "Enter details for the new hostel complaint."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {isEditing && data ? (
              <div className="bg-muted/30 p-4 rounded-md space-y-3 mb-2 border">
                <div>
                  <span className="text-xs font-semibold uppercase text-muted-foreground">Subject</span>
                  <p className="font-medium">{data.subject}</p>
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase text-muted-foreground">Details</span>
                  <p className="text-sm mt-1 whitespace-pre-wrap">{data.description || "No description provided."}</p>
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="text-xs text-muted-foreground">
                    By: <span className="font-medium text-foreground">{data.user?.name}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Room: <span className="font-medium text-foreground">{data.room?.room_number}</span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <ControlledFormComponent
                  control={control}
                  name="hostel_room_id"
                  type={FORM_TYPE.SELECT}
                  label="Room"
                  required
                  options={roomOptions}
                  placeholder={isLoadingRooms ? "Loading rooms..." : "Select room"}
                  disabled={isLoadingRooms}
                />

                <ControlledFormComponent
                  control={control}
                  name="subject"
                  type={FORM_TYPE.TEXT}
                  label="Subject"
                  required
                  placeholder="e.g. Broken Fan in Room 101"
                />

                <ControlledFormComponent
                  control={control}
                  name="description"
                  type={FORM_TYPE.TEXTAREA}
                  label="Description"
                  placeholder="Provide more details about the issue..."
                  rows={4}
                />
              </>
            )}

            <ControlledFormComponent
              control={control}
              name="status"
              type={FORM_TYPE.SELECT}
              label="Status"
              required
              options={[
                { value: "open", label: "Open" },
                { value: "in_progress", label: "In Progress" },
                { value: "resolved", label: "Resolved" },
                { value: "closed", label: "Closed" },
              ]}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Update Status" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
