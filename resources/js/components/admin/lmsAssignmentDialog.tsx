import React from "react";
import { ModalDialog } from "../shared/Modal";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import Each from "@/components/Each";
import { useForm, type Resolver } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import lmsApi from "@/lib/api/lmsApi";
import { LmsClassesQueryKeys } from "@/lib/querykey/lmsClasses";
import { LmsAssignmentSchema, type LmsAssignmentFormValues } from "@/lib/validations/lms";
import { LMS_ASSIGNMENT_FORM_LAYOUT } from "@/constants/page/admin/lmsForms";
import { toast } from "sonner";

interface LmsAssignmentDialogProps {
  open: boolean;
  onClose: () => void;
  classId: number;
  allocationId?: number;
}

export function LmsAssignmentDialog({ open, onClose, classId, allocationId }: LmsAssignmentDialogProps) {
  const queryClient = useQueryClient();
  const { handleSubmit, control, reset } = useForm<LmsAssignmentFormValues>({
    resolver: zodResolver(LmsAssignmentSchema) as Resolver<LmsAssignmentFormValues>,
    defaultValues: { title: "", description: "", file_path: "", type: "assignment", due_at: "", max_score: "", allow_late: false },
    mode: "onChange",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: LmsAssignmentFormValues) =>
      lmsApi.assignments.store(classId, {
        title: payload.title,
        file_path: payload.file_path || null,
        description: payload.description || null,
        type: payload.type,
        due_at: payload.due_at || null,
        max_score: payload.max_score === "" ? null : Number(payload.max_score),
        allow_late: payload.allow_late ?? false,
        ...(allocationId != null ? { class_subject_allocation_id: allocationId } : {}),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: LmsClassesQueryKeys.assignments(classId) });
      toast.success("Curriculum item created successfully!");
      reset();
      onClose();
    },
  });

  return (
    <ModalDialog
      title="Add Curriculum Item"
      description="Create an assignment, homework, or project for this curriculum."
      open={open}
      onClose={onClose}
      handleSubmit={handleSubmit((data: LmsAssignmentFormValues) => mutate(data))}
      isLoading={isPending}
      submitLabel="Create Item"
    >
      <div className="grid grid-cols-1 gap-y-4">
        <Each
          of={LMS_ASSIGNMENT_FORM_LAYOUT}
          keyExtractor={(field) => field.name}
          nodatafound={<p className="text-sm text-muted-foreground">No form fields configured.</p>}
          render={(field) => {
            const isFullWidth = field.name === "title" || field.name === "description" || field.name === "file_path" || field.name === "allow_late";

            if (isFullWidth) {
              return (
                <ControlledFormComponent
                  key={field.name}
                  control={control}
                  {...field}
                  options={(field as any).options}
                />
              );
            }

            return null;
          }}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Each
            of={LMS_ASSIGNMENT_FORM_LAYOUT}
            keyExtractor={(field) => field.name}
            render={(field) => {
              const isGridField = field.name === "type" || field.name === "due_at" || field.name === "max_score";

              if (isGridField) {
                return (
                  <ControlledFormComponent
                    key={field.name}
                    control={control}
                    {...field}
                    options={(field as any).options}
                  />
                );
              }

              return null;
            }}
          />
        </div>
      </div>
    </ModalDialog>
  );
}
