import React, { useEffect } from 'react';
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
import SubjectApi from '@/lib/api/subjectApi';
import StaffApi from '@/lib/api/staffApi';
import { toast } from 'sonner';
import { BookOpen, User, MapPin, Loader2 } from 'lucide-react';
import { TimetableEntrySchema, type TimetableEntryValues } from '@/lib/validations/timetable';

interface TimetableEntryModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    timetableId: string | number;
    slotId: string | number | null;
    dayOfWeek: number | null;
    initialData?: any;
}

export function TimetableEntryModal({
    open,
    onOpenChange,
    timetableId,
    slotId,
    dayOfWeek,
    initialData
}: TimetableEntryModalProps) {
    const queryClient = useQueryClient();

    const form = useForm<TimetableEntryValues>({
        resolver: zodResolver(TimetableEntrySchema) as any,
        defaultValues: {
            period_slot_id: String(slotId || ''),
            day_of_week: dayOfWeek || 1,
            activity_type: 'App\\Models\\Subject',
            activity_id: '',
            teacher_id: '',
            room_id: '',
        }
    });

    useEffect(() => {
        if (open) {
            form.reset({
                period_slot_id: String(slotId || ''),
                day_of_week: dayOfWeek || 1,
                activity_type: initialData?.activity_type || 'App\\Models\\Subject',
                activity_id: String(initialData?.activity_id || ''),
                teacher_id: String(initialData?.teacher_id || ''),
                room_id: String(initialData?.room_id || ''),
            });
        }
    }, [open, slotId, dayOfWeek, initialData, form]);

    const { data: subjects, isLoading: subjectsLoading } = useQuery({
        queryKey: ['subjects'],
        queryFn: () => SubjectApi.getSubjects().then(res => res.data),
        enabled: open
    });

    const { data: staff, isLoading: staffLoading } = useQuery({
        queryKey: ['staff'],
        queryFn: () => StaffApi.listStaff().then(res => res.data),
        enabled: open
    });

    const { data: rooms, isLoading: roomsLoading } = useQuery({
        queryKey: ['rooms'],
        queryFn: () => TimetableApi.getRooms().then(res => res.data),
        enabled: open
    });

    const saveMutation = useMutation({
        mutationFn: (data: TimetableEntryValues) => TimetableApi.saveEntries(timetableId, [data]),
        onSuccess: () => {
            toast.success("Entry saved successfully");
            onOpenChange(false);
            queryClient.invalidateQueries({ queryKey: ['timetable', String(timetableId)] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to save entry");
        }
    });

    const onSubmit = (data: TimetableEntryValues) => {
        saveMutation.mutate(data);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-black flex items-center gap-2">
                        {initialData ? 'Edit Schedule Entry' : 'Add Schedule Entry'}
                    </DialogTitle>
                    <DialogDescription>
                        Assign a subject, teacher, and room to this time slot.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(onSubmit) as any} className="space-y-4 py-4">
                    <ControlledFormComponent
                        control={form.control as any}
                        name="activity_id"
                        label="Subject / Activity"
                        type="select"
                        placeholder={subjectsLoading ? "Loading subjects..." : "Select Subject"}
                        options={subjects?.map((s: any) => ({ key: String(s.id), text: s.name, value: String(s.id) })) || []}
                        disabled={subjectsLoading}
                    />

                    <ControlledFormComponent
                        control={form.control as any}
                        name="teacher_id"
                        label="Instructor (Optional)"
                        type="select"
                        placeholder={staffLoading ? "Loading staff..." : "Select Instructor"}
                        options={staff?.map((s: any) => ({ key: String(s.id), text: s.name, value: String(s.id) })) || []}
                        disabled={staffLoading}
                    />

                    <ControlledFormComponent
                        control={form.control as any}
                        name="room_id"
                        label="Room / Lab (Optional)"
                        type="select"
                        placeholder={roomsLoading ? "Loading rooms..." : "Select Room"}
                        options={rooms?.map((r: any) => ({ key: String(r.id), text: r.name, value: String(r.id) })) || []}
                        disabled={roomsLoading}
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
                            disabled={saveMutation.isPending}
                            className="font-bold min-w-[120px]"
                        >
                            {saveMutation.isPending ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                "Save Entry"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
