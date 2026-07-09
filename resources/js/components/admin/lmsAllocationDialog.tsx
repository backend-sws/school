import React, { useEffect } from "react";
import { ModalDialog } from "../shared/Modal";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import lmsApi from "@/lib/api/lmsApi";
import SubjectApi from "@/lib/api/subjectApi";
import UserApi from "@/lib/api/userApi";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import { FORM_TYPE } from "@/constants/shared/form";
import { SubjectQueryKeys } from "@/lib/querykey/subject";
import { UserQueryKeys } from "@/lib/querykey/user";
import type { AsyncSelectConfig } from "@/types";

const schema = z.object({
  subject_id: z.union([z.number(), z.string()]).refine((v) => v !== "" && v !== undefined, "Subject is required").transform(Number),
  instructor_id: z.number().nullable().optional(),
});
type FormValues = z.infer<typeof schema>;

const SUBJECT_ASYNC_CONFIG: AsyncSelectConfig = {
  queryFn: (params) => SubjectApi.index(params),
  queryKey: SubjectQueryKeys.all,
  labelKey: "name",
  valueKey: "id",
};

const INSTRUCTOR_ASYNC_CONFIG: AsyncSelectConfig = {
  queryFn: (params) => UserApi.getUser(params),
  queryKey: UserQueryKeys.all,
  labelKey: "name",
  valueKey: "id",
};

interface LmsAllocationDialogProps {
  open: boolean;
  onClose: () => void;
  classId: number;
  streamId?: number;
  defaultSubjectId?: number;
  onSuccess?: () => void;
}

export function LmsAllocationDialog({ open, onClose, classId, streamId, defaultSubjectId, onSuccess }: LmsAllocationDialogProps) {
  const queryClient = useQueryClient();
  const { handleSubmit, control, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { subject_id: undefined as unknown as number, instructor_id: null },
    mode: "onChange",
  });

  useEffect(() => {
    if (open) {
      reset({
        subject_id: defaultSubjectId ?? (undefined as unknown as number),
        instructor_id: null,
      });
    }
  }, [open, defaultSubjectId, reset]);

  const subjectAsyncConfig: AsyncSelectConfig = streamId
    ? { ...SUBJECT_ASYNC_CONFIG, extraParams: { stream_id: streamId } }
    : SUBJECT_ASYNC_CONFIG;

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: FormValues) =>
      lmsApi.classes.storeAllocation(classId, {
        subject_id: payload.subject_id,
        instructor_id: payload.instructor_id && payload.instructor_id !== 0 ? payload.instructor_id : null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lms-class-allocations", classId] });
      reset();
      onSuccess?.();
      onClose();
    },
  });

  return (
    <ModalDialog
      title="Add subject"
      open={open}
      onClose={onClose}
      handleSubmit={handleSubmit((data) => mutate(data))}
      isLoading={isPending}
    >
      <div className="grid gap-4">
        <ControlledFormComponent
          control={control}
          name="subject_id"
          label="Subject"
          type={FORM_TYPE.ASYNC_SELECT}
          asyncConfig={subjectAsyncConfig}
          placeholder="e.g. Mathematics"
          required
        />
        <ControlledFormComponent
          control={control}
          name="instructor_id"
          label="Subject Teacher"
          type={FORM_TYPE.ASYNC_SELECT}
          asyncConfig={INSTRUCTOR_ASYNC_CONFIG}
          placeholder="e.g. Select teacher"
        />
      </div>
    </ModalDialog>
  );
}
