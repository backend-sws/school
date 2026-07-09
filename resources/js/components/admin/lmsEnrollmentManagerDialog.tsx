import React, { useMemo, useState } from "react";
import { ModalDialog } from "../shared/Modal";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import lmsApi from "@/lib/api/lmsApi";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import { FORM_TYPE } from "@/constants/shared/form";
import { mapToOptions } from "@/lib/utils/lms";
import { UserMinus, UserPlus, Users, Trash2, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "../ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import { LmsEnrollmentManagerSchema, type LmsEnrollmentManagerFormValues as FormValues } from "@/lib/validations/lms";

interface LmsEnrollmentManagerDialogProps {
    open: boolean;
    onClose: () => void;
    classId: number;
}

export function LmsEnrollmentManagerDialog({ open, onClose, classId }: LmsEnrollmentManagerDialogProps) {
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState("current");
    const [searchQuery, setSearchQuery] = useState("");

    const { handleSubmit, control, reset } = useForm<FormValues>({
        resolver: zodResolver(LmsEnrollmentManagerSchema),
        defaultValues: { user_ids: [] },
        mode: "onChange",
    });

    // Fetch CURRENT enrollments
    const { data: enrollmentsRes, isLoading: enrollmentsLoading } = useQuery({
        queryKey: ["lms-class-enrollments", classId],
        queryFn: () => lmsApi.classes.enrollments(classId),
        enabled: open,
    });

    const enrollments = useMemo(() => {
        const raw = (enrollmentsRes as any)?.data ?? [];
        return (Array.isArray(raw) ? raw : []) as any[];
    }, [enrollmentsRes]);

    const students = useMemo(() => enrollments.filter(e => e.role === "student"), [enrollments]);

    const filteredStudents = useMemo(() => {
        if (!searchQuery) return students;
        return students.filter(s =>
            s.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [students, searchQuery]);

    // Fetch AVAILABLE students (not enrolled)
    const { data: availableRes, isLoading: availableLoading } = useQuery({
        queryKey: ["lms-class-available-students", classId],
        queryFn: () => lmsApi.classes.availableStudents(classId),
        enabled: open && activeTab === "add",
    });

    const availableOptions = useMemo(() => mapToOptions(availableRes as unknown), [availableRes]);

    // Remove Mutation
    const { mutate: removeMutate, isPending: removingId } = useMutation({
        mutationFn: (userId: number) => lmsApi.classes.removeEnrollment(classId, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lms-class-enrollments", classId] });
            queryClient.invalidateQueries({ queryKey: ["lms-class-available-students", classId] });
        },
    });

    // Add Mutation
    const { mutate: addMutate, isPending: isAdding } = useMutation({
        mutationFn: async (payload: FormValues) => {
            const enrollments = payload.user_ids.map((userId) =>
                lmsApi.classes.storeEnrollment(classId, { user_id: userId, role: "student" })
            );
            return Promise.all(enrollments);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lms-class-enrollments", classId] });
            queryClient.invalidateQueries({ queryKey: ["lms-class-available-students", classId] });
            reset();
            setActiveTab("current");
        },
    });

    return (
        <ModalDialog
            title="Manage Students"
            open={open}
            onClose={onClose}
            handleSubmit={activeTab === "add" ? handleSubmit((data) => addMutate(data)) : undefined}
            isLoading={isAdding}
            className="sm:max-w-[600px]"
        >
            <div className="w-full">
                <div className="flex w-full grid-cols-2 h-11 bg-muted/60 p-1 rounded-xl mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => setActiveTab("current")}
                        className={cn(
                            "flex-1 rounded-lg font-bold text-sm transition-all h-auto py-2",
                            activeTab === "current" ? "bg-background shadow-sm text-foreground hover:bg-background" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Current Members ({students.length})
                    </Button>
                    <Button
                        variant="ghost"
                        onClick={() => setActiveTab("add")}
                        className={cn(
                            "flex-1 rounded-lg font-bold text-sm transition-all h-auto py-2",
                            activeTab === "add" ? "bg-background shadow-sm text-foreground hover:bg-background" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        Add New Students
                    </Button>
                </div>

                {activeTab === "current" && (
                    <div className="space-y-4 outline-none">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                                placeholder="Filter current students..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-10 rounded-xl bg-muted/30 border-none focus-visible:ring-1 focus-visible:ring-primary/20"
                            />
                        </div>

                        <ScrollArea className="h-[350px] pr-4">
                            {enrollmentsLoading ? (
                                <div className="flex h-32 items-center justify-center">
                                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                </div>
                            ) : filteredStudents.length > 0 ? (
                                <div className="grid gap-2">
                                    {filteredStudents.map((enrollment) => (
                                        <div
                                            key={enrollment.id}
                                            className="flex items-center justify-between rounded-xl border border-border/40 bg-card p-3 transition-all hover:border-primary/20 hover:bg-muted/5 group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                                                    {enrollment.user?.name?.charAt(0) || "U"}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold tracking-tight">{enrollment.user?.name}</span>
                                                    <span className="text-xs text-muted-foreground">{enrollment.user?.email}</span>
                                                </div>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeMutate(enrollment.user_id)}
                                                className="h-8 w-8 rounded-full p-0 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-48 text-muted-foreground gap-3">
                                    <Users className="size-10 opacity-20" />
                                    <p className="text-sm font-medium">No students found matching your search.</p>
                                </div>
                            )}
                        </ScrollArea>
                    </div>
                )}

                {activeTab === "add" && (
                    <div className="space-y-4 outline-none">
                        <div className="rounded-2xl border border-dashed border-border/60 bg-muted/5 p-6">
                            <div className="flex flex-col items-center gap-2 mb-6 text-center">
                                <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center">
                                    <UserPlus className="size-5 text-primary" />
                                </div>
                                <h4 className="font-bold tracking-tight">Add New Enrollments</h4>
                                <p className="text-xs text-muted-foreground max-w-[280px]">
                                    Search for students who are not yet part of this classroom and add them in bulk.
                                </p>
                            </div>

                            <ControlledFormComponent
                                control={control}
                                name="user_ids"
                                label="Select Students"
                                type={FORM_TYPE.MULTI_SELECT}
                                options={availableOptions}
                                placeholder="Search by name or email..."
                                required
                            />
                        </div>
                    </div>
                )}
            </div>
        </ModalDialog>
    );
}
