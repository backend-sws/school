import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { hostelApi, type HostelMessPlan } from "@/lib/api/hostelApi";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { FORM_TYPE } from "@/constants/shared/form";

export type MessPlanDialogData = HostelMessPlan | null;

interface MessPlanDialogProps {
  open: boolean;
  onClose: () => void;
  data?: MessPlanDialogData;
}

export function MessPlanDialog({ open, onClose, data }: MessPlanDialogProps) {
  const isEditing = !!data;
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      name: "",
      type: "both",
      monthly_fee: "",
      description: "",
      is_active: true,
    },
  });

  const { control, handleSubmit, reset, setError } = form;

  useEffect(() => {
    if (open) {
      if (data) {
        reset({
          name: data.name || "",
          type: data.type || "both",
          monthly_fee: data.monthly_fee ? String(data.monthly_fee) : "",
          description: data.description || "",
          is_active: data.is_active ?? true,
        });
      } else {
        reset({
          name: "",
          type: "both",
          monthly_fee: "",
          description: "",
          is_active: true,
        });
      }
    }
  }, [open, data, reset]);

  const saveMutation = useMutation({
    mutationFn: (values: any) => {
      if (isEditing) {
        return hostelApi.messPlans.update(data!.id, values);
      }
      return hostelApi.messPlans.store(values);
    },
    onSuccess: (response) => {
      toast.success(response.message || `Mess plan ${isEditing ? "updated" : "created"} successfully`);
      queryClient.invalidateQueries({ queryKey: ["hostel-mess-plans"] });
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
        toast.error(error.response?.data?.message || "Failed to save mess plan");
      }
    },
  });

  const onSubmit = (values: any) => {
    saveMutation.mutate({
      ...values,
      monthly_fee: values.monthly_fee ? Number(values.monthly_fee) : 0,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Mess Plan" : "Add Mess Plan"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Update dining plan details below." : "Enter details for the new mess plan."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <ControlledFormComponent
              control={control}
              name="name"
              type={FORM_TYPE.TEXT}
              label="Plan Name"
              required
              placeholder="e.g. Standard Veg Plan"
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <ControlledFormComponent
                  control={control}
                  name="type"
                  type={FORM_TYPE.SELECT}
                  label="Dietary Type"
                  required
                  options={[
                    { value: "veg", label: "Vegetarian" },
                    { value: "non-veg", label: "Non-Vegetarian" },
                    { value: "both", label: "Both" },
                  ]}
                />
              </div>

              <div className="col-span-1">
                <ControlledFormComponent
                  control={control}
                  name="monthly_fee"
                  type={FORM_TYPE.NUMBER}
                  label="Monthly Fee"
                  required
                  min={0}
                />
              </div>
            </div>

            <ControlledFormComponent
              control={control}
              name="description"
              type={FORM_TYPE.TEXTAREA}
              label="Description"
              placeholder="What's included in this plan..."
              rows={3}
            />

            <ControlledFormComponent
              control={control}
              name="is_active"
              type={FORM_TYPE.CHECKBOX}
              label="Active Plan"
              tooltip="If unchecked, this plan cannot be assigned to new residents."
            />
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
