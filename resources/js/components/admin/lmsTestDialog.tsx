import React from "react";
import { ModalDialog } from "../shared/Modal";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import Each from "@/components/Each";
import { useForm, type Resolver } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import lmsApi from "@/lib/api/lmsApi";
import { LmsClassesQueryKeys } from "@/lib/querykey/lmsClasses";
import { LmsTestSchema, type LmsTestFormValues } from "@/lib/validations/lms";
import { LMS_TEST_FORM_LAYOUT } from "@/constants/page/admin/lmsForms";
import { toast } from "sonner";

interface LmsTestDialogProps {
  open: boolean;
  onClose: () => void;
  classId: number;
  allocationId?: number;
}

export function LmsTestDialog({ open, onClose, classId, allocationId }: LmsTestDialogProps) {
  const queryClient = useQueryClient();
  const { handleSubmit, control, reset } = useForm<LmsTestFormValues>({
    resolver: zodResolver(LmsTestSchema) as Resolver<LmsTestFormValues>,
    defaultValues: { title: "", description: "", duration_minutes: "", max_attempts: 1 },
    mode: "onChange",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: LmsTestFormValues) =>
      lmsApi.tests.store(classId, {
        title: payload.title,
        description: payload.description || null,
        duration_minutes: payload.duration_minutes === "" ? null : Number(payload.duration_minutes),
        max_attempts: payload.max_attempts === "" ? 1 : Number(payload.max_attempts),
        ...(allocationId != null ? { class_subject_allocation_id: allocationId } : {}),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LmsClassesQueryKeys.tests(classId) });
      toast.success("Test created successfully!");
      reset();
      onClose();
    },
  });

  return (
    <ModalDialog
      title="Add Test"
      description="Add a test or quiz with duration and attempt limit."
      open={open}
      onClose={onClose}
      handleSubmit={handleSubmit((data: LmsTestFormValues) => mutate(data))}
      isLoading={isPending}
      submitLabel="Create Test"
    >
      <div className="grid gap-4 py-4">
        <Each
          of={LMS_TEST_FORM_LAYOUT}
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
