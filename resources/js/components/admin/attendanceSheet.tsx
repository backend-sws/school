import React, { useMemo, useState, useEffect } from "react";
import {
    Sheet,
    SheetContent,
    SheetTitle,
    SheetDescription,
} from "@/components/ui/sheet";
import Each from "@/components/Each";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import attendanceApi, { type AttendanceLevel } from "@/lib/api/attendanceApi";
import { ATTENDANCE_STATUS_OPTIONS } from "@/constants/page/admin/attendance";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
    CalendarIcon,
    Loader2,
    Search,
    BookOpen,
    XCircle,
    ClipboardCheck,
    UserCheck,
    AlertCircle,
    CheckCircle2,
} from "lucide-react";
import lmsApi from "@/lib/api/lmsApi";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { format, parseISO } from "date-fns";
import { PermissionGate } from "@/components/PermissionGate";

interface AttendanceSheetProps {
    open: boolean;
    onClose: () => void;
    initialClassId?: number;
    initialAllocationId?: number;
    initialDate?: string;
    mode?: "marking" | "reporting";
}

const defaultDate = () => new Date().toISOString().slice(0, 10);

export function AttendanceSheet({ open, onClose, initialClassId, initialAllocationId, initialDate, mode = "marking" }: AttendanceSheetProps) {
    const queryClient = useQueryClient();
    const [selectedClassId, setSelectedClassId] = useState<number | undefined>(initialClassId);
    const [selectedAllocationId, setSelectedAllocationId] = useState<number | undefined>(initialAllocationId);
    const [date, setDate] = useState(initialDate || defaultDate());
    const [searchQuery, setSearchQuery] = useState("");

    // Sync initials
    useEffect(() => {
        if (!open) return;
        const cId = Number(initialClassId);
        const aId = initialAllocationId ? Number(initialAllocationId) : undefined;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        if (!isNaN(cId) && cId > 0) setSelectedClassId(cId);

        if (!isNaN(aId as number)) setSelectedAllocationId(aId);

        // Lock to today if in marking mode
        if (mode === "marking") {
            setDate(defaultDate());
        }
    }, [open, initialClassId, initialAllocationId, mode]);

    // Fetch Classes - Always fetch to get names
    const { data: classesRes, isLoading: classesLoading } = useQuery({
        queryKey: ["attendance-classes"],
        queryFn: () => attendanceApi.classes({ all: true }),
        enabled: open,
    });

    const classes = useMemo(() => {
        const raw = (classesRes as { data?: unknown[] } | undefined)?.data;
        if (Array.isArray(raw)) return raw as { id: number; name: string }[];
        if (Array.isArray(classesRes)) return classesRes as unknown as { id: number; name: string }[];
        return [];
    }, [classesRes]);

    // Fetch Allocations for selected class
    const { data: allocationsRes, isLoading: allocationsLoading } = useQuery({
        queryKey: ["attendance-allocations", selectedClassId],
        queryFn: () => attendanceApi.allocationsForClass(selectedClassId!),
        enabled: !!selectedClassId,
    });

    const allocations = useMemo(() => {
        const raw = (allocationsRes as { data?: unknown[] } | undefined)?.data;
        if (Array.isArray(raw)) return raw as { id: number; subject: { name: string } | null }[];
        if (Array.isArray(allocationsRes)) return allocationsRes as unknown as { id: number; subject: { name: string } | null }[];
        return [];
    }, [allocationsRes]);

    const isGeneral = !selectedAllocationId || String(selectedAllocationId) === "class";
    const level: AttendanceLevel = isGeneral ? "class" : "subject";

    const dailyParams = useMemo(() => {
        if (!selectedClassId) return null;
        const allocationId = selectedAllocationId && String(selectedAllocationId) !== "class" ? Number(selectedAllocationId) : undefined;
        return {
            lms_class_id: Number(selectedClassId),
            date,
            level,
            ...(allocationId ? { class_subject_allocation_id: allocationId } : {}),
        };
    }, [selectedClassId, date, level, selectedAllocationId]);

    const { data: dailyRes, isLoading: dailyLoading } = useQuery({
        queryKey: ["attendance-daily", dailyParams],
        queryFn: () => attendanceApi.getDaily(dailyParams!),
        enabled: open && !!selectedClassId && !!dailyParams,
    });

    // Fetch Enrollments (Roster) - The fallback for when daily record is empty
    const { data: enrollmentsRes, isLoading: enrollmentsLoading } = useQuery({
        queryKey: ["attendance-enrollments", selectedClassId],
        queryFn: () => lmsApi.classes.enrollments(selectedClassId!),
        enabled: open && !!selectedClassId,
    });

    const enrollments = useMemo(() => {
        const res = enrollmentsRes as { data?: unknown[] } | unknown[] | undefined;
        const raw = (res as { data?: unknown[] })?.data ?? (res as unknown[]);
        return (Array.isArray(raw) ? raw as any[] : []);
    }, [enrollmentsRes]);

    const records = useMemo(() => {
        const dailyRecords = (dailyRes as any)?.data?.records ?? dailyRes?.records ?? [];
        if (dailyRecords.length > 0) return dailyRecords;

        // If no daily records, use enrollments as template
        return (enrollments || []).filter((e: any) => e.role === "student").map((e: any) => ({
            user_id: e.user_id,
            user_name: e.user?.name ?? `User #${e.user_id}`,
            status: "present", // Default to present for new records
            date,
        }));
    }, [dailyRes, enrollments, date]);

    const [localRecords, setLocalRecords] = useState<Record<number, string>>({});

    // Initialize and sync local state
    // We clear state when class, allocation, or date changes to prevent cross-entry data leakage
    useEffect(() => {
        if (!open) return;

        // Reset state on context shift
        setLocalRecords({});
    }, [selectedClassId, selectedAllocationId, date, open]);

    useEffect(() => {
        if (records.length > 0) {
            setLocalRecords((prev: Record<number, string>) => {
                const next = { ...prev };
                let hasChanged = false;

                records.forEach((r: any) => {
                    // Rule 1: Always prioritize API-provided status if it exists and differs from local
                    if (r.status && prev[r.user_id] !== r.status) {
                        next[r.user_id] = r.status;
                        hasChanged = true;
                    }
                    // Rule 2: If we have no local state for this student in THIS session, set default
                    else if (prev[r.user_id] === undefined) {
                        next[r.user_id] = r.status || "present";
                        hasChanged = true;
                    }
                });

                return hasChanged ? next : prev;
            });
        }
    }, [records]);

    const filteredRecords = useMemo(() => {
        if (!searchQuery) return records;
        return records.filter((r: any) =>
            r.user_name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [records, searchQuery]);

    const stats = useMemo(() => {
        const total = records.length;
        const present = records.filter((r: any) => (localRecords[r.user_id] || "present") === "present").length;
        const absent = total - present;
        return { total, present, absent };
    }, [records, localRecords]);

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
            if (selectedClassId) {
                queryClient.invalidateQueries({ queryKey: ["lms-class-attendance-summary", selectedClassId] });
            }
            toast.success("Attendance saved successfully!");
            onClose();
        },
        onError: () => {
            toast.error("Failed to save attendance.");
        }
    });

    const handleSubmit = () => {
        if (!selectedClassId) {
            toast.error("Please select a class first.");
            return;
        }

        const allocationId = selectedAllocationId && String(selectedAllocationId) !== "class" ? Number(selectedAllocationId) : undefined;

        mutate({
            lms_class_id: selectedClassId,
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
        <Sheet open={open} onOpenChange={onClose}>
            <SheetContent
                side="right"
                className="sm:max-w-4xl w-full p-0 flex flex-col h-full bg-background overflow-hidden border-l"
            >
                <div className="sr-only">
                    <SheetTitle>Attendance Register</SheetTitle>
                    <SheetDescription>Mark daily or subject-wise attendance for students.</SheetDescription>
                </div>

                {/* Header */}
                <div className="p-6 md:p-8 shrink-0 border-b bg-card">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/5">
                                <ClipboardCheck className="size-6" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold tracking-tight text-foreground">
                                    {mode === "marking" ? "Mark Attendance" : "Attendance Register"}
                                </h2>
                                {/* Context Ribbon */}
                                <div className="flex items-center gap-2 mt-0.5 text-sm text-muted-foreground">
                                    <span className="font-medium">{classes.find(c => c.id === selectedClassId)?.name || "—"}</span>
                                    <span className="text-border">·</span>
                                    <span>
                                        {selectedAllocationId && String(selectedAllocationId) !== "class"
                                            ? allocations.find(a => a.id === selectedAllocationId)?.subject?.name
                                            : "General"}
                                    </span>
                                    <span className="text-border">·</span>
                                    {mode === "reporting" ? (
                                        <div className="relative inline-flex items-center">
                                            <CalendarIcon className="absolute left-2 size-3.5 text-muted-foreground pointer-events-none" />
                                            <input
                                                type="date"
                                                className="h-7 rounded-lg border border-border bg-background pl-7 pr-2 text-xs font-medium text-foreground focus-visible:outline-none focus:ring-2 focus:ring-ring/20 transition-all cursor-pointer"
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)}
                                            />
                                        </div>
                                    ) : (
                                        <span>{format(parseISO(date), "dd MMM yyyy")}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="hidden md:flex items-center gap-6">
                            <StatColumn label="Present" value={stats.present} variant="success" />
                            <StatColumn label="Absent" value={stats.absent} variant="destructive" />
                            <StatColumn label="Total" value={stats.total} variant="muted" />
                        </div>
                    </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-grow overflow-y-auto pb-24">
                    <div className="p-6 md:p-8 space-y-6">

                        {/* Student List */}
                        <div className="rounded-2xl bg-card border border-border overflow-hidden">
                            {dailyLoading || enrollmentsLoading ? (
                                <ListLoadingView />
                            ) : !selectedClassId ? (
                                <ListEmptyView
                                    icon={BookOpen}
                                    title="Select a Class"
                                    description="Choose a class above to load the student roster."
                                />
                            ) : records.length === 0 ? (
                                <ListEmptyView
                                    icon={AlertCircle}
                                    title="No Students Found"
                                    description="No students are enrolled in this class."
                                />
                            ) : (
                                <>
                                    {/* Search & Quick Actions */}
                                    <div className="px-5 py-4 border-b border-border bg-card sticky top-0 z-10">
                                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                                            <div className="relative group w-full sm:max-w-xs">
                                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50 transition-colors group-focus-within:text-primary" />
                                                <Input
                                                    placeholder="Search student..."
                                                    className="h-9 pl-9 rounded-lg border-border bg-background text-sm font-medium placeholder:text-muted-foreground/40"
                                                    value={searchQuery}
                                                    onChange={(e) => setSearchQuery(e.target.value)}
                                                />
                                            </div>
                                            <div className="flex gap-2">
                                                <QuickActionButton
                                                    onClick={() => markAllAs("present")}
                                                    icon={UserCheck}
                                                    label="All Present"
                                                    variant="success"
                                                    disabled={!records.length}
                                                />
                                                <QuickActionButton
                                                    onClick={() => markAllAs("absent")}
                                                    icon={XCircle}
                                                    label="All Absent"
                                                    variant="destructive"
                                                    disabled={!records.length}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Column Headers */}
                                    <div className="hidden sm:flex items-center justify-between px-5 py-2 bg-muted/30 border-b border-border text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                        <span>Student</span>
                                        <span>Status</span>
                                    </div>

                                    {/* Student Rows */}
                                    <div className="divide-y divide-border">
                                        <Each
                                            of={filteredRecords}
                                            keyExtractor={(r) => r.user_id.toString()}
                                            render={(r) => (
                                                <div key={r.user_id} className="group flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-3 transition-colors hover:bg-accent/30">
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative shrink-0">
                                                            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                                                                {r.user_name.charAt(0)}
                                                            </div>
                                                            <div className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full bg-background border border-border flex items-center justify-center">
                                                                <div className={cn("size-2 rounded-full",
                                                                    (localRecords[r.user_id] || "present") === "present" ? "bg-success" :
                                                                        (localRecords[r.user_id] || "present") === "absent" ? "bg-destructive" :
                                                                            "bg-warning"
                                                                )} />
                                                            </div>
                                                        </div>
                                                        <div className="min-w-0">
                                                            <p className="text-sm font-medium text-foreground truncate">
                                                                {r.user_name}
                                                            </p>
                                                            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                                                                ID: {r.user_id}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <div className="shrink-0">
                                                        <StatusPillGroup
                                                            value={localRecords[r.user_id] || "present"}
                                                            onChange={(status) => handleStatusChange(r.user_id, status)}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        />
                                    </div>

                                    {filteredRecords.length === 0 && searchQuery && (
                                        <div className="py-16 text-center">
                                            <p className="text-sm text-muted-foreground">No students match "{searchQuery}"</p>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 md:p-6 bg-card border-t flex items-center justify-between gap-4 mt-auto shrink-0">
                    <div className="hidden md:flex items-center gap-2 text-muted-foreground">
                        <CheckCircle2 className="size-4 text-success" />
                        <p className="text-xs font-medium">Changes sync instantly.</p>
                    </div>
                    <PermissionGate can={mode === "marking" ? "mark_attendance" : "update_attendance"}>
                        <Button
                            className="flex-grow md:flex-grow-0 min-w-[180px] h-11 font-bold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all"
                            onClick={handleSubmit}
                            disabled={isPending || !records.length}
                        >
                            {isPending ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="size-4 animate-spin" />
                                    Saving...
                                </span>
                            ) : (
                                mode === "marking" ? "Save Attendance" : "Update Records"
                            )}
                        </Button>
                    </PermissionGate>
                </div>
            </SheetContent>
        </Sheet>
    );
}

// ─── Sub-components ──────────────────────────────────────────────

function StatColumn({ label, value, variant }: { label: string; value: number; variant: "success" | "destructive" | "muted" }) {
    const colorClass = variant === "success"
        ? "text-success"
        : variant === "destructive"
            ? "text-destructive"
            : "text-muted-foreground";

    return (
        <div className="text-center px-3">
            <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">{label}</p>
            <p className={cn("text-2xl font-bold tabular-nums", colorClass)}>{value}</p>
        </div>
    );
}


function QuickActionButton({ onClick, icon: Icon, label, variant, disabled }: { onClick: () => void; icon: React.ElementType; label: string; variant: "success" | "destructive"; disabled: boolean }) {
    const styles = variant === "success"
        ? "bg-success/10 text-success border-success/20 hover:bg-success hover:text-success-foreground"
        : "bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive hover:text-destructive-foreground";

    return (
        <Button
            type="button"
            variant="outline"
            className={cn("h-9 rounded-lg px-3 text-xs font-semibold border transition-all", styles)}
            onClick={onClick}
            disabled={disabled}
        >
            <Icon className="size-3.5 mr-1.5" />
            {label}
        </Button>
    );
}

function StatusPillGroup({ value, onChange }: { value: string; onChange: (v: string) => void }) {
    return (
        <div className="flex gap-1 p-1 rounded-lg bg-muted/50 w-fit">
            {ATTENDANCE_STATUS_OPTIONS.map((o) => {
                const isActive = value === o.value;

                const activeStyle = o.value === "present"
                    ? "bg-success text-success-foreground shadow-sm"
                    : o.value === "absent" ? "bg-destructive text-destructive-foreground shadow-sm" :
                        o.value === "late" ? "bg-warning text-warning-foreground shadow-sm" :
                            "bg-primary text-primary-foreground shadow-sm";

                return (
                    <Button
                        key={o.value}
                        variant="ghost"
                        onClick={() => onChange(o.value)}
                        className={cn(
                            "px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all duration-200 h-auto",
                            isActive
                                ? activeStyle
                                : "text-muted-foreground hover:text-foreground hover:bg-background"
                        )}
                    >
                        {o.label}
                    </Button>
                );
            })}
        </div>
    );
}


function ListLoadingView() {
    return (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="size-8 animate-spin text-primary/30" />
            <p className="text-sm font-medium text-muted-foreground">Loading roster...</p>
        </div>
    );
}

function ListEmptyView({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
    return (
        <div className="py-20 flex flex-col items-center justify-center text-center gap-4 px-8">
            <div className="size-16 bg-muted rounded-2xl flex items-center justify-center text-muted-foreground">
                <Icon className="size-8" />
            </div>
            <div className="space-y-1">
                <h4 className="text-lg font-bold text-foreground">{title}</h4>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}
