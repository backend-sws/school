import React, { useEffect, useMemo } from "react";
import { ModalDialog } from "../shared/Modal";
import Each from "../Each";
import { useForm } from "react-hook-form";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query.client";
import {
    FACULTY_DIALOG_FORM_LAYOUT,
    FACULTY_FORM_INITIAL_DATA,
} from "@/constants/page/admin/website";
import FacultyApi from "@/lib/api/facultyApi";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDepartments } from "@/hooks/useDepartments";

const facultySchema = z.object({
    name: z.string().min(1, "Name is required"),
    designation: z.string().min(1, "Designation is required"),
    department_id: z.any().refine(val => !!val, "Department is required"),
    phone: z.string().optional(),
    email: z.string().email("Invalid email").or(z.literal("")).optional(),
    hide_phone: z.boolean().or(z.number()).transform(v => !!v),
    hide_email: z.boolean().or(z.number()).transform(v => !!v),
    status: z.number().default(1),
});

interface FacultyDialogProps {
    open: boolean;
    onClose: (open: boolean) => void;
    data?: any | null;
}

export function FacultyDialog({ open, onClose, data }: FacultyDialogProps) {
    const { departments, isLoading: isLoadingDepts } = useDepartments();

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(facultySchema),
        defaultValues: FACULTY_FORM_INITIAL_DATA,
        mode: "onChange",
    });

    const isEditMode = !!data?.id;
    const dataId = data?.id;

    const { data: facultyDetail, isLoading: isLoadingDetail } = useQuery({
        queryKey: ["faculties", dataId],
        queryFn: () => FacultyApi.getFacultyById(dataId),
        enabled: open && isEditMode,
    });

    const formLayout = useMemo(() => {
        return FACULTY_DIALOG_FORM_LAYOUT.map(field => {
            if (field.name === 'department_id') {
                return { ...field, options: departments };
            }
            return field;
        });
    }, [departments]);

    useEffect(() => {
        if (isEditMode && facultyDetail) {
            const fullData = facultyDetail?.data;
            reset({
                name: fullData.name,
                designation: fullData.designation,
                department_id: fullData.department_id,
                phone: fullData.phone || "",
                email: fullData.email || "",
                hide_phone: !!fullData.hide_phone,
                hide_email: !!fullData.hide_email,
                status: fullData.status,
            });
        } else {
            reset(FACULTY_FORM_INITIAL_DATA);
        }
    }, [isEditMode, facultyDetail, reset]);

    const { mutate: handleMutation, isPending: isSaving } = useMutation({
        mutationFn: (submitData: any) => {
            return isEditMode
                ? FacultyApi.updateFaculty(dataId, submitData)
                : FacultyApi.createFaculty(submitData);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["faculties"],
            });
            reset();
            onClose(false);
        },
    });

    const onSubmit = (data: any) => {
        handleMutation(data);
    };

    return (
        <ModalDialog
            title={isEditMode ? "Edit Faculty" : "Add Faculty"}
            open={open}
            onClose={onClose}
            handleSubmit={handleSubmit(onSubmit)}
            isLoading={isSaving || isLoadingDetail || isLoadingDepts}
        >
            <div className="grid gap-4">
                <Each
                    of={formLayout}
                    render={(form: any) => (
                        <ControlledFormComponent
                            control={control}
                            options={form.options}
                            {...form}
                        />
                    )}
                />
            </div>
        </ModalDialog>
    );
}
