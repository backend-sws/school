import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StudentQueryKeys } from "@/lib/querykey/student";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function ManageServicesModal({
  isOpen,
  onClose,
  student,
  institutionId,
}: {
  isOpen: boolean;
  onClose: () => void;
  student: any;
  institutionId: number;
}) {
  const queryClient = useQueryClient();
  const [serviceType, setServiceType] = React.useState<"transport" | "hostel">("transport");
  const [endDate, setEndDate] = React.useState<string>(new Date().toISOString().split("T")[0]);

  const profile = student?.student_profile ?? student?.studentProfile;
  const isTransportStoppable = profile?.is_transport_stoppable ?? false;
  const isHostelStoppable = profile?.is_hostel_stoppable ?? false;

  React.useEffect(() => {
    if (isTransportStoppable && !isHostelStoppable) setServiceType("transport");
    else if (!isTransportStoppable && isHostelStoppable) setServiceType("hostel");
  }, [isTransportStoppable, isHostelStoppable]);

  const stopMutation = useMutation({
    mutationFn: async () => {
      const { data } = await axios.put(`/api/v1/students/${student.id}/services/stop`, {
        institution_id: institutionId,
        service_type: serviceType,
        end_date: endDate,
      });
      return data;
    },
    onSuccess: () => {
      toast.success(`${serviceType === "transport" ? "Transport" : "Hostel"} service stopped successfully.`);
      queryClient.invalidateQueries({ queryKey: StudentQueryKeys.detail(institutionId, student.id) });
      onClose();
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to stop service");
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Stop Services (Mid-Session)</DialogTitle>
          <DialogDescription>
            Stop a student's Transport or Hostel allocation mid-session to halt future billing.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Select Service to Stop</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={serviceType === "transport" ? "default" : "outline"}
                onClick={() => setServiceType("transport")}
                disabled={!isTransportStoppable}
              >
                Transport
              </Button>
              <Button
                type="button"
                variant={serviceType === "hostel" ? "default" : "outline"}
                onClick={() => setServiceType("hostel")}
                disabled={!isHostelStoppable}
              >
                Hostel
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Stop Date</Label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Billing for the current and future months will adjust based on this end date.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={stopMutation.isPending}>
            Cancel
          </Button>
          <Button onClick={() => stopMutation.mutate()} disabled={stopMutation.isPending}>
            {stopMutation.isPending ? "Stopping..." : "Stop Service"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
