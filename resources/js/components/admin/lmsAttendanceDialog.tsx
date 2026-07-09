import React, { useMemo, useState, useEffect } from "react";
import { ModalDialog } from "../shared/Modal";
import Each from "@/components/Each";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import attendanceApi, { type AttendanceLevel } from "@/lib/api/attendanceApi";
import { ATTENDANCE_STATUS_OPTIONS } from "@/constants/page/admin/attendance";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CalendarIcon, Loader2 } from "lucide-react";

interface LmsAttendanceDialogProps {
    open: boolean;
    onClose: () => void;
    classId: number;
    allocationId?: number;
}

const defaultDate = () => new Date().toISOString().slice(0, 10);

export function LmsAttendanceDialog({ open, onClose, classId, allocationId }: LmsAttendanceDialogProps) {
    const queryClient = useQueryClient();
    const [date, setDate] = useState(defaultDate());
    const level: AttendanceLevel = allocationId ? "subject" : "class";

    const dailyParams = useMemo(() => ({
        lms_class_id: classId,
        date,
        level,
        ...(allocationId ? { class_subject_allocation_id: allocationId } : {}),
    }), [classId, date, level, allocationId]);

    const { data: dailyRes, isLoading: dailyLoading } = useQuery({
        queryKey: ["attendance-daily", dailyParams],
        queryFn: () => attendanceApi.getDaily(dailyParams),
        enabled: open && !!classId,
    });

    const records = dailyRes?.records ?? [];
    const [localRecords, setLocalRecords] = useState<Record<number, string>>({});

    useEffect(() => {
        if (records.length > 0) {
            const initial: Record<number, string> = {};
            records.forEach((r: any) => {
                initial[r.user_id] = r.status || "present";
            });
            setLocalRecords(initial);
        }
    }, [records]);

    const handleStatusChange = (userId: number, status: string) => {
        setLocalRecords((prev) => ({ ...prev, [userId]: status }));
    };

    const markAllAs = (status: string) => {
        const next: Record<number, string> = { ...localRecords };
        records.forEach((r: any) => {
            next[r.user_id] = status;
        });
        setLocalRecords(next);
    };

    const { mutate, isPending } = useMutation({
        mutationFn: (payload: Parameters<typeof attendanceApi.submitDaily>[0]) => attendanceApi.submitDaily(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["attendance-daily"] });
            queryClient.invalidateQueries({ queryKey: ["lms-class-attendance-summary", classId, allocationId] });
            toast.success("Attendance saved successfully!");
            onClose();
        },
        onError: () => {
            toast.error("Failed to save attendance.");
        }
    });

    const handleSubmit = () => {
        mutate({
            lms_class_id: classId,
            date,
            level,
            ...(allocationId ? { class_subject_allocation_id: allocationId } : {}),
            records: records.map((r: any) => ({
                user_id: r.user_id,
                status: localRecords[r.user_id] || "present",
            })),
        });
    };

    return (
        <ModalDialog
            title="Manage Attendance"
            description={allocationId ? "Mark attendance for this subject session." : "Mark daily attendance for the class."}
            open={open}
            onClose={onClose}
            handleSubmit={handleSubmit}
            isLoading={isPending}
            submitLabel="Save Attendance"
            className="sm:max-w-2xl"
        >
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                    <div className="space-y-2 flex-grow max-w-xs">
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                            <CalendarIcon className="size-3" />
                            Attendance Date
                        </Label>
                        <input
                            type="date"
                            className="flex h-10 w-full rounded-xl border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all outline-none"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="rounded-lg text-xs font-bold bg-green-500/5 text-green-600 border-green-500/10 hover:bg-green-500/10"
                            onClick={() => markAllAs("present")}
                        >
                            All Present
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="rounded-lg text-xs font-bold bg-red-500/5 text-red-600 border-red-500/10 hover:bg-red-500/10"
                            onClick={() => markAllAs("absent")}
                        >
                            All Absent
                        </Button>
                    </div>
                </div>

                <div className="relative rounded-2xl border border-border/60 bg-muted/5 overflow-hidden">
                    {dailyLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-3">
                            <Loader2 className="size-8 animate-spin text-primary" />
                            <p className="text-sm font-medium text-muted-foreground">Loading student list...</p>
                        </div>
                    ) : records.length === 0 ? (
                        <div className="py-20 text-center">
                            <p className="text-sm text-muted-foreground font-medium">No students enrolled in this class.</p>
                        </div>
                    ) : (
                        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                            <table className="w-full text-sm">
                                <thead className="sticky top-0 bg-card/80 backdrop-blur-sm border-b border-border/60 z-10">
                                    <tr>
                                        <th className="p-3 text-left font-bold text-muted-foreground uppercase tracking-tight text-[10px]">Student Name</th>
                                        <th className="p-3 text-right font-bold text-muted-foreground uppercase tracking-tight text-[10px]">Attendance Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border/40">
                                    <Each
                                        of={records}
                                        keyExtractor={(r) => r.user_id}
                                        render={(r) => (
                                            <tr key={r.user_id} className="group hover:bg-muted/30 transition-colors">
                                                <td className="p-3">
                                                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">{r.user_name}</p>
                                                </td>
                                                <td className="p-3 text-right">
                                                    <Select
                                                        value={localRecords[r.user_id] || "present"}
                                                        onValueChange={(v) => handleStatusChange(r.user_id, v)}
                                                    >
                                                        <SelectTrigger className="h-9 w-[130px] ml-auto rounded-lg border-border/60 bg-background/50 hover:bg-background transition-all">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="rounded-xl border-border/60">
                                                            {ATTENDANCE_STATUS_OPTIONS.map((o) => (
                                                                <SelectItem key={o.value} value={o.value} className="text-xs font-medium">
                                                                    {o.label}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </td>
                                            </tr>
                                        )}
                                    />
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </ModalDialog>
    );
}
