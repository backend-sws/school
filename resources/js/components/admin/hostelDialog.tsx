import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { hostelApi, type Hostel } from "@/lib/api/hostelApi";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { FORM_TYPE } from "@/constants/shared/form";

export type HostelDialogData = Hostel | null;

interface HostelDialogProps {
  open: boolean;
  onClose: () => void;
  data?: HostelDialogData;
}

export function HostelDialog({ open, onClose, data }: HostelDialogProps) {
  const isEditing = !!data;
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      name: "",
      code: "",
      type: "boys",
      warden_user_id: null as number | null,
      warden_name: "",
      warden_contact: "",
      address: "",
      description: "",
    },
  });

  const { control, handleSubmit, reset, setError } = form;

  useEffect(() => {
    if (open) {
      if (data) {
        reset({
          name: data.name || "",
          code: data.code || "",
          type: data.type || "boys",
          warden_user_id: data.warden_user_id || null,
          warden_name: data.warden_name || "",
          warden_contact: data.warden_contact || "",
          address: data.address || "",
          description: data.description || "",
        });
      } else {
        reset({
          name: "",
          code: "",
          type: "boys",
          warden_user_id: null,
          warden_name: "",
          warden_contact: "",
          address: "",
          description: "",
        });
      }
    }
  }, [open, data, reset]);

  const saveMutation = useMutation({
    mutationFn: (values: any) => {
      if (isEditing) {
        return hostelApi.hostels.update(data!.id, values);
      }
      return hostelApi.hostels.store(values);
    },
    onSuccess: (response) => {
      toast.success(response.message || `Hostel ${isEditing ? "updated" : "created"} successfully`);
      queryClient.invalidateQueries({ queryKey: ["hostel-hostels"] });
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
        toast.error(error.response?.data?.message || "Failed to save hostel");
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
            <DialogTitle>{isEditing ? "Edit Hostel" : "Add Hostel"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Update hostel details below." : "Enter details for the new hostel building."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <ControlledFormComponent
                  control={control}
                  name="name"
                  type={FORM_TYPE.TEXT}
                  label="Name"
                  required
                  placeholder="e.g. Boys Hostel A"
                />
              </div>

              <div className="col-span-1">
                <ControlledFormComponent
                  control={control}
                  name="code"
                  type={FORM_TYPE.TEXT}
                  label="Code"
                  placeholder="e.g. BHA"
                />
              </div>

              <div className="col-span-1">
                <ControlledFormComponent
                  control={control}
                  name="type"
                  type={FORM_TYPE.SELECT}
                  label="Type"
                  required
                  options={[
                    { value: "boys", label: "Boys" },
                    { value: "girls", label: "Girls" },
                    { value: "co-ed", label: "Co-ed" },
                    { value: "staff", label: "Staff" },
                  ]}
                  placeholder="Select type"
                />
              </div>
            </div>

            <div>
              <ControlledFormComponent
                control={control}
                name="warden_name"
                type={FORM_TYPE.TEXT}
                label="Warden Name"
                placeholder="Name of the hostel warden"
              />
            </div>

            <div>
              <ControlledFormComponent
                control={control}
                name="warden_contact"
                type={FORM_TYPE.PHONE_WITH_CODE}
                label="Warden Contact"
                placeholder="Phone number"
              />
            </div>

            <div>
              <ControlledFormComponent
                control={control}
                name="description"
                type={FORM_TYPE.TEXTAREA}
                label="Description"
                placeholder="Any additional notes..."
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={saveMutation.isPending}>
              {saveMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? "Save Changes" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
