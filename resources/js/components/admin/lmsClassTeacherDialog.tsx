import React from "react";
import { ModalDialog } from "../shared/Modal";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import lmsApi from "@/lib/api/lmsApi";
import UserApi from "@/lib/api/userApi";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import { FORM_TYPE } from "@/constants/shared/form";
import { UserQueryKeys } from "@/lib/querykey/user";
import { LmsClassTeacherSchema, type LmsClassTeacherFormValues as FormValues } from "@/lib/validations/lms";
import type { AsyncSelectConfig } from "@/types";

const TEACHER_ASYNC_CONFIG: AsyncSelectConfig = {
    queryFn: (params) => UserApi.getUser({ ...params, role: "staff" }),
    queryKey: UserQueryKeys.all,
    labelKey: "name",
    valueKey: "id",
    extraParams: { role: "staff" },
};

interface LmsClassTeacherDialogProps {
    open: boolean;
    onClose: () => void;
    classId: number;
    currentTeacherId?: number;
    onSuccess?: () => void;
}

export function LmsClassTeacherDialog({ open, onClose, classId, currentTeacherId, onSuccess }: LmsClassTeacherDialogProps) {
    const queryClient = useQueryClient();
    const { handleSubmit, control, reset } = useForm<FormValues>({
        resolver: zodResolver(LmsClassTeacherSchema),
        defaultValues: { class_teacher_id: currentTeacherId },
        mode: "onChange",
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (teacherId: number) => lmsApi.classes.update(classId, { class_teacher_id: teacherId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lms-class", classId] });
            reset();
            onSuccess?.();
            onClose();
        },
    });

    return (
        <ModalDialog
            title="Assign Class Teacher"
            open={open}
            onClose={onClose}
            handleSubmit={handleSubmit((data) => mutate(data.class_teacher_id))}
            isLoading={isPending}
        >
            <div className="grid gap-4 py-4">
                <ControlledFormComponent
                    control={control}
                    name="class_teacher_id"
                    label="Select Teacher"
                    type={FORM_TYPE.ASYNC_SELECT}
                    asyncConfig={TEACHER_ASYNC_CONFIG}
                    placeholder="Search and select teacher..."
                    required
                    tooltip="This teacher will be responsible for managing this class."
                />
            </div>
        </ModalDialog>
    );
}
