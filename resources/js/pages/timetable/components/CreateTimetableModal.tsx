import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import TimetableApi from '@/lib/api/timetableApi';
import { useCollegeSessions } from '@/hooks/useCollegeSessions';
import { toast } from 'sonner';
import { router } from '@inertiajs/react';
import { Calendar, Loader2 } from 'lucide-react';
import { CreateTimetableSchema, type CreateTimetableValues } from '@/lib/validations/timetable';

interface CreateTimetableModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateTimetableModal({ open, onOpenChange }: CreateTimetableModalProps) {
    const queryClient = useQueryClient();

    const form = useForm<CreateTimetableValues>({
        resolver: zodResolver(CreateTimetableSchema) as any,
        defaultValues: {
            session_id: '',
            timetable_template_id: '',
            status: 'draft' as any,
        }
    });

    const { sessions, isLoading: sessionsLoading } = useCollegeSessions({ enabled: open });

    const { data: templates, isLoading: templatesLoading } = useQuery({
        queryKey: ['timetable-templates'],
        queryFn: () => TimetableApi.getTemplates().then(res => res.data),
        enabled: open
    });

    const createMutation = useMutation({
        mutationFn: (data: CreateTimetableValues) => TimetableApi.createTimetable(data),
        onSuccess: (response) => {
            toast.success("Timetable created successfully");
            onOpenChange(false);
            queryClient.invalidateQueries({ queryKey: ['timetables'] });
            // Redirect to builder
            const timetableId = response.data.id;
            router.visit(`/timetable/${timetableId}/builder`);
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create timetable");
        }
    });

    const onSubmit = (data: CreateTimetableValues) => {
        createMutation.mutate(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                        <Calendar className="size-6 text-primary" />
                    </div>
                    <DialogTitle className="text-2xl font-black">Create New Timetable</DialogTitle>
                    <DialogDescription>
                        Initialize a new schedule by selecting a session and a template.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit) as any} className="space-y-6 py-4">
                    <ControlledFormComponent
                        control={form.control as any}
                        name="session_id"
                        label="Academic Session"
                        type="select"
                        placeholder={sessionsLoading ? "Loading sessions..." : "Select Academic Session"}
                        options={sessions}
                        disabled={sessionsLoading}
                    />

                    <ControlledFormComponent
                        control={form.control as any}
                        name="timetable_template_id"
                        label="Timetable Template"
                        type="select"
                        placeholder={templatesLoading ? "Loading templates..." : "Select Template"}
                        options={templates?.map((t: any) => ({ key: String(t.id), text: t.name, value: String(t.id) })) || []}
                        disabled={templatesLoading}
                    />

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="font-bold"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={createMutation.isPending}
                            className="font-bold min-w-[120px]"
                        >
                            {createMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Initialize & Build"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
