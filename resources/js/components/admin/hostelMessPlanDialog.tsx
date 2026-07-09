import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { hostelApi, type HostelMessPlan } from "@/lib/api/hostelApi";
import { Switch } from "@/components/ui/switch";

export type HostelMessPlanDialogData = HostelMessPlan | null;

interface Props {
  open: boolean;
  onClose: () => void;
  data?: HostelMessPlanDialogData;
}

export function HostelMessPlanDialog({ open, onClose, data }: Props) {
  const isEditing = !!data;
  const queryClient = useQueryClient();

  const { data: formData, setData, reset, clearErrors } = useForm({
    name: "",
    type: "veg",
    monthly_fee: "",
    description: "",
    is_active: true,
  });

  const [apiErrors, setApiErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (open) {
      if (data) {
        setData({
          name: data.name || "",
          type: data.type || "veg",
          monthly_fee: data.monthly_fee?.toString() || "",
          description: data.description || "",
          is_active: data.is_active ?? true,
        });
      } else {
        reset();
      }
      setApiErrors({});
      clearErrors();
    }
  }, [open, data]);

  const saveMutation = useMutation({
    mutationFn: (values: typeof formData) => {
      const payload = {
        ...values,
        monthly_fee: values.monthly_fee ? parseFloat(values.monthly_fee) : 0,
      };
      if (isEditing) {
        return hostelApi.messPlans.update(data!.id, payload);
      }
      return hostelApi.messPlans.store(payload);
    },
    onSuccess: (response) => {
      toast.success(response.message || `Mess Plan ${isEditing ? "updated" : "created"} successfully`);
      queryClient.invalidateQueries({ queryKey: ["hostel-mess-plans"] });
      onClose();
    },
    onError: (error: any) => {
      if (error.response?.data?.errors) {
        setApiErrors(error.response.data.errors);
      } else {
        toast.error(error.response?.data?.message || "Failed to save mess plan");
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiErrors({});
    saveMutation.mutate(formData);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Mess Plan" : "Add Mess Plan"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Update mess plan details." : "Create a new mess/dining plan for hostel residents."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="required">Plan Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setData("name", e.target.value)}
                placeholder="e.g. Standard Veg Plan"
              />
              {apiErrors.name && <p className="text-sm text-destructive">{apiErrors.name[0]}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type" className="required">Dietary Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setData("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="veg">Vegetarian</SelectItem>
                    <SelectItem value="non-veg">Non-Vegetarian</SelectItem>
                    <SelectItem value="both">Both (Mixed)</SelectItem>
                  </SelectContent>
                </Select>
                {apiErrors.type && <p className="text-sm text-destructive">{apiErrors.type[0]}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="monthly_fee" className="required">Monthly Fee (₹)</Label>
                <Input
                  id="monthly_fee"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.monthly_fee}
                  onChange={(e) => setData("monthly_fee", e.target.value)}
                  placeholder="0.00"
                />
                {apiErrors.monthly_fee && <p className="text-sm text-destructive">{apiErrors.monthly_fee[0]}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setData("description", e.target.value)}
                placeholder="Details about meals included..."
                rows={2}
              />
            </div>

            <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="space-y-0.5">
                <Label>Active Status</Label>
                <p className="text-sm text-muted-foreground">
                  Available for new allocations
                </p>
              </div>
              <Switch
                checked={formData.is_active}
                onCheckedChange={(val) => setData("is_active", val)}
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
