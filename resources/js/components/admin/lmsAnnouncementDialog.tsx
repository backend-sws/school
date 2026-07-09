import React from "react";
import { ModalDialog } from "../shared/Modal";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import Each from "@/components/Each";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import lmsApi from "@/lib/api/lmsApi";
import { LmsClassesQueryKeys } from "@/lib/querykey/lmsClasses";
import { LmsAnnouncementSchema, type LmsAnnouncementFormValues } from "@/lib/validations/lms";
import { LMS_ANNOUNCEMENT_FORM_LAYOUT } from "@/constants/page/admin/lmsForms";
import { toast } from "sonner";

interface LmsAnnouncementDialogProps {
  open: boolean;
  onClose: () => void;
  classId: number;
  allocationId: number;
}

export function LmsAnnouncementDialog({ open, onClose, classId, allocationId }: LmsAnnouncementDialogProps) {
  const queryClient = useQueryClient();
  const { handleSubmit, control, reset } = useForm<LmsAnnouncementFormValues>({
    resolver: zodResolver(LmsAnnouncementSchema),
    defaultValues: { title: "", body: "" },
    mode: "onChange",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (data: LmsAnnouncementFormValues) =>
      lmsApi.announcements.store(classId, {
        ...data,
        class_subject_allocation_id: allocationId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LmsClassesQueryKeys.announcements(classId) });
      toast.success("Announcement posted successfully!");
      onClose();
      reset();
    },
  });

  return (
    <ModalDialog
      open={open}
      onClose={onClose}
      title="Post Announcement"
      description="Share an update, reminder, or general announcement with the class."
      handleSubmit={handleSubmit((data) => mutate(data))}
      isLoading={isPending}
      submitLabel="Post Announcement"
    >
      <>
        <Each
          of={LMS_ANNOUNCEMENT_FORM_LAYOUT}
          keyExtractor={(field) => field.name}
          nodatafound={<p className="text-sm text-muted-foreground">No form fields configured.</p>}
          render={(field) => (
            <ControlledFormComponent
              control={control}
              {...field}
              options={(field as any).options}
            />
          )}
        />
      </>
    </ModalDialog>
  );
}
