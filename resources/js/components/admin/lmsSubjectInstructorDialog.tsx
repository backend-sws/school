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
import { subjectTeacherSchema, type SubjectTeacherFormValues as FormValues } from "@/lib/validations/lms";
import { toast } from "sonner";
import type { AsyncSelectConfig } from "@/types";

const INSTRUCTOR_ASYNC_CONFIG: AsyncSelectConfig = {
    queryFn: (params) => UserApi.getUser({ ...params, role: "staff" }),
    queryKey: UserQueryKeys.all,
    labelKey: "name",
    valueKey: "id",
    extraParams: { role: "staff" },
};

interface LmsSubjectInstructorDialogProps {
    open: boolean;
    onClose: () => void;
    allocationId: number;
    classId: number;
    currentInstructorId?: number | null;
}

export function LmsSubjectInstructorDialog({ open, onClose, allocationId, classId, currentInstructorId }: LmsSubjectInstructorDialogProps) {
    const queryClient = useQueryClient();
    const { handleSubmit, control, reset } = useForm<FormValues>({
        resolver: zodResolver(subjectTeacherSchema),
        defaultValues: { instructor_id: currentInstructorId ?? "" },
        mode: "onChange",
    });

    const { mutate, isPending } = useMutation({
        mutationFn: (instructorId: number) => lmsApi.allocations.update(allocationId, { instructor_id: instructorId }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lms-class-allocations", classId] });
            toast.success("Instructor assigned successfully!");
            reset();
            onClose();
        },
    });

    return (
        <ModalDialog
            title="Assign Instructor"
            open={open}
            onClose={onClose}
            handleSubmit={handleSubmit((data) => mutate(Number(data.instructor_id)))}
            isLoading={isPending}
        >
            <div className="grid gap-4 py-4">
                <ControlledFormComponent
                    control={control}
                    name="instructor_id"
                    label="Select Instructor"
                    type={FORM_TYPE.ASYNC_SELECT}
                    asyncConfig={INSTRUCTOR_ASYNC_CONFIG}
                    placeholder="Search and select instructor..."
                    required
                    tooltip="This instructor will be responsible for teaching this subject in this class."
                />
            </div>
        </ModalDialog>
    );
}
