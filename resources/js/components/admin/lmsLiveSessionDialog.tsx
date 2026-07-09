import React from "react";
import { ModalDialog } from "../shared/Modal";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import Each from "@/components/Each";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import lmsApi from "@/lib/api/lmsApi";
import { LmsClassesQueryKeys } from "@/lib/querykey/lmsClasses";
import { LmsLiveSessionSchema, type LmsLiveSessionFormValues } from "@/lib/validations/lms";
import { LMS_LIVE_SESSION_FORM_LAYOUT } from "@/constants/page/admin/lmsForms";
import { toast } from "sonner";

interface LmsLiveSessionDialogProps {
  open: boolean;
  onClose: () => void;
  classId: number;
  allocationId?: number;
}

export function LmsLiveSessionDialog({ open, onClose, classId, allocationId }: LmsLiveSessionDialogProps) {
  const queryClient = useQueryClient();
  const { handleSubmit, control, reset } = useForm<LmsLiveSessionFormValues>({
    resolver: zodResolver(LmsLiveSessionSchema),
    defaultValues: { title: "", scheduled_at: "", ends_at: "", meeting_url: "", meeting_provider: "" },
    mode: "onChange",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: LmsLiveSessionFormValues) =>
      lmsApi.liveSessions.store(classId, {
        title: payload.title,
        scheduled_at: payload.scheduled_at,
        ends_at: payload.ends_at || null,
        meeting_url: payload.meeting_url || null,
        meeting_provider: payload.meeting_provider || null,
        ...(allocationId != null ? { class_subject_allocation_id: allocationId } : {}),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LmsClassesQueryKeys.liveSessions(classId) });
      toast.success("Live session scheduled successfully!");
      reset();
      onClose();
    },
  });

  return (
    <ModalDialog
      title="Add Live Session"
      description="Schedule a live class and add the meeting link."
      open={open}
      onClose={onClose}
      handleSubmit={handleSubmit((data) => mutate(data))}
      isLoading={isPending}
      submitLabel="Schedule Live"
    >
      <div className="grid gap-4 py-4">
        <Each
          of={LMS_LIVE_SESSION_FORM_LAYOUT}
          keyExtractor={(field) => field.name}
          nodatafound={<p className="text-sm text-muted-foreground">No form fields configured.</p>}
          render={(field) => (
            <ControlledFormComponent
              key={field.name}
              control={control}
              {...field}
              options={(field as any).options}
            />
          )}
        />
      </div>
    </ModalDialog>
  );
}
