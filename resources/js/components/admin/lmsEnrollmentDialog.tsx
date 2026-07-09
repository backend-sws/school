import React from "react";
import { ModalDialog } from "../shared/Modal";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import lmsApi from "@/lib/api/lmsApi";
import UserApi from "@/lib/api/userApi";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import { FORM_TYPE } from "@/constants/shared/form";
import { UserQueryKeys } from "@/lib/querykey/user";
import type { AsyncSelectConfig } from "@/types";

const schema = z.object({
  user_ids: z.array(z.number()).min(1, "Select at least one student"),
  role: z.enum(["student", "teacher"]),
});
type FormValues = z.infer<typeof schema>;

const STUDENT_ASYNC_CONFIG: AsyncSelectConfig = {
  queryFn: (params) => UserApi.getUser({ ...params, role: "student" }),
  queryKey: UserQueryKeys.all,
  labelKey: "name",
  valueKey: "id",
  extraParams: { role: "student" },
  multiple: true,
};

interface LmsEnrollmentDialogProps {
  open: boolean;
  onClose: () => void;
  classId: number;
  enrolledUserIds?: number[];
  onSuccess?: () => void;
}

export function LmsEnrollmentDialog({ open, onClose, classId, enrolledUserIds = [], onSuccess }: LmsEnrollmentDialogProps) {
  const queryClient = useQueryClient();
  const { handleSubmit, control, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { user_ids: [], role: "student" },
    mode: "onChange",
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (payload: FormValues) => {
      // Enroll each user individually since the API currently takes a single user_id
      const enrollments = payload.user_ids.map((userId) =>
        lmsApi.classes.storeEnrollment(classId, { user_id: userId, role: payload.role })
      );
      return Promise.all(enrollments);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["lms-class-enrollments", classId] });
      reset();
      onSuccess?.();
      onClose();
    },
  });

  return (
    <ModalDialog
      title="Add enrollment"
      open={open}
      onClose={onClose}
      handleSubmit={handleSubmit((data) => mutate(data))}
      isLoading={isPending}
    >
      <div className="grid gap-4">
        <ControlledFormComponent
          control={control}
          name="user_ids"
          label="Students"
          type={FORM_TYPE.ASYNC_SELECT}
          asyncConfig={STUDENT_ASYNC_CONFIG}
          placeholder="Search and select students..."
          required
          tooltip="Only users with the 'student' role are shown here."
        />
      </div>
    </ModalDialog>
  );
}
