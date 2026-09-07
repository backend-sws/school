import React, { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { format, parse, addMonths, subMonths } from "date-fns";
import {
    ChevronLeft,
    ChevronRight,
    Download,
    Upload,
    Search,
    Loader2,
    Calendar,
    Users,
    Sparkles,
    Check,
    X,
    Clock,
    AlertCircle,
    CalendarDays,
    MousePointerClick,
    Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import attendanceApi, {
    type AttendanceLevel,
    type AttendanceLedgerData,
    type LedgerStudentRow
} from "@/lib/api/attendanceApi";
import { AttendanceImportDialog } from "./attendanceImportDialog";
import { PermissionGate } from "@/components/PermissionGate";

interface AttendanceRegisterMatrixProps {
    classId: number;
    className?: string;
    allocationId?: number;
    initialMonth?: string;
    level?: AttendanceLevel;
}

export function AttendanceRegisterMatrix({
    classId,
    className,
    allocationId,
    initialMonth,
    level = "class"
}: AttendanceRegisterMatrixProps) {
    const queryClient = useQueryClient();
    const [month, setMonth] = useState(initialMonth || format(new Date(), "yyyy-MM"));
    const [searchQuery, setSearchQuery] = useState("");
    const [openCellKey, setOpenCellKey] = useState<string | null>(null);
    const [importOpen, setImportOpen] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [clickMode, setClickMode] = useState<"popover" | "quick">("popover"); // 'popover' or 'quick' (1-click cycle)

    // Fetch Monthly Ledger Matrix
    const { data: ledgerRes, isLoading, refetch } = useQuery({
        queryKey: ["attendance-ledger", classId, month, allocationId, level],
        queryFn: () => attendanceApi.ledger({
            lms_class_id: classId,
            month,
            level,
            class_subject_allocation_id: allocationId || undefined,
        }),
        enabled: !!classId,
    });

    const ledger: AttendanceLedgerData | undefined = useMemo(() => {
        const raw = (ledgerRes as any)?.data?.data || (ledgerRes as any)?.data || ledgerRes;
        return raw as AttendanceLedgerData | undefined;
    }, [ledgerRes]);

    const filteredMatrix = useMemo(() => {
        if (!ledger?.matrix) return [];
        if (!searchQuery.trim()) return ledger.matrix;
        const q = searchQuery.trim().toLowerCase();
        return ledger.matrix.filter(
            (s) =>
                s.name.toLowerCase().includes(q) ||
                (s.roll_no && s.roll_no.toLowerCase().includes(q)) ||
                s.user_id.toString().includes(q)
        );
    }, [ledger?.matrix, searchQuery]);

    // Single Cell Mark Mutation
    const { mutate: markCell } = useMutation({
        mutationFn: (payload: {
            lms_class_id: number;
            user_id: number;
            date: string;
            status: string;
            level?: AttendanceLevel;
            class_subject_allocation_id?: number | null;
        }) => attendanceApi.markCell(payload),
        onMutate: async (newRecord) => {
            await queryClient.cancelQueries({ queryKey: ["attendance-ledger", classId, month, allocationId, level] });
            const previousData = queryClient.getQueryData(["attendance-ledger", classId, month, allocationId, level]);

            queryClient.setQueryData(["attendance-ledger", classId, month, allocationId, level], (old: any) => {
                if (!old) return old;
                const oldLedger = old.data?.data || old.data || old;
                const newMatrix = (oldLedger.matrix || []).map((row: LedgerStudentRow) => {
                    if (row.user_id === newRecord.user_id) {
                        const oldStatus = row.days[newRecord.date]?.status;
                        const newDays = {
                            ...row.days,
                            [newRecord.date]: newRecord.status === "clear" ? null : { status: newRecord.status }
                        };

                        const summary = { ...row.summary };
                        if (oldStatus && summary[oldStatus as keyof typeof summary] !== undefined) {
                            summary[oldStatus as keyof typeof summary] = Math.max(0, summary[oldStatus as keyof typeof summary] - 1);
                            summary.total_marked = Math.max(0, summary.total_marked - 1);
                        }
                        if (newRecord.status !== "clear" && summary[newRecord.status as keyof typeof summary] !== undefined) {
                            summary[newRecord.status as keyof typeof summary]++;
                            summary.total_marked++;
                        }

                        return { ...row, days: newDays, summary };
                    }
                    return row;
                });

                return {
                    ...old,
                    data: {
                        ...(old.data || old),
                        matrix: newMatrix
                    }
                };
            });

            return { previousData };
        },
        onError: (err: any, _newRecord, context) => {
            if (context?.previousData) {
                queryClient.setQueryData(["attendance-ledger", classId, month, allocationId, level], context.previousData);
            }
            toast.error(err?.response?.data?.message || "Failed to update attendance mark.");
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ["attendance-ledger", classId, month, allocationId, level] });
            queryClient.invalidateQueries({ queryKey: ["attendance-daily"] });
        }
    });

    const handleCellMark = (userId: number, dateStr: string, status: string) => {
        setOpenCellKey(null);
        markCell({
            lms_class_id: classId,
            user_id: userId,
            date: dateStr,
            status,
            level,
            class_subject_allocation_id: allocationId || undefined,
        });
    };

    const handleCellClick = (userId: number, dateStr: string, currentStatus?: string | null) => {
        if (clickMode === "quick") {
            // Quick cycle: empty -> present -> absent -> late -> leave -> clear
            let nextStatus = "present";
            if (!currentStatus) nextStatus = "present";
            else if (currentStatus === "present") nextStatus = "absent";
            else if (currentStatus === "absent") nextStatus = "late";
            else if (currentStatus === "late") nextStatus = "leave";
            else if (currentStatus === "leave") nextStatus = "holiday";
            else nextStatus = "clear";

            handleCellMark(userId, dateStr, nextStatus);
        } else {
            const cellKey = `${userId}-${dateStr}`;
            setOpenCellKey(openCellKey === cellKey ? null : cellKey);
        }
    };

    const handlePrevMonth = () => {
        const d = parse(month + "-01", "yyyy-MM-dd", new Date());
        setMonth(format(subMonths(d, 1), "yyyy-MM"));
    };

    const handleNextMonth = () => {
        const d = parse(month + "-01", "yyyy-MM-dd", new Date());
        setMonth(format(addMonths(d, 1), "yyyy-MM"));
    };

    const handleExport = async () => {
        try {
            setExporting(true);
            const res = await attendanceApi.export({
                lms_class_id: classId,
                month,
                level,
                class_subject_allocation_id: allocationId || undefined,
            });

            const blob = new Blob([res.data as any], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `attendance_register_${className || "class"}_${month}.xlsx`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
            toast.success("Attendance register exported to Excel!");
        } catch (e) {
            toast.error("Failed to export attendance register");
        } finally {
            setExporting(false);
        }
    };

    const monthLabel = useMemo(() => {
        try {
            return format(parse(month + "-01", "yyyy-MM-dd", new Date()), "MMMM yyyy");
        } catch {
            return month;
        }
    }, [month]);

    const renderCellStatus = (
        status?: string | null,
        isHoliday?: boolean,
        isSunday?: boolean
    ) => {
        if (!status) {
            if (isHoliday) {
                return (
                    <span className="inline-flex size-7 items-center justify-center rounded-lg bg-purple-500/10 text-purple-700 font-extrabold text-[10px] border border-purple-500/20 shadow-xs pointer-events-none">
                        HOL
                    </span>
                );
            }
            if (isSunday) {
                return (
                    <span className="inline-flex size-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600 font-bold text-[10px] border border-rose-500/20 shadow-xs pointer-events-none">
                        SUN
                    </span>
                );
            }
            return (
                <span className="inline-flex size-7 items-center justify-center rounded-lg text-muted-foreground/40 font-medium text-xs hover:bg-primary/10 hover:text-primary transition-colors pointer-events-none">
                    -
                </span>
            );
        }

        switch (status) {
            case "present":
                return (
                    <span className="inline-flex size-7 items-center justify-center rounded-lg bg-emerald-500 text-white font-black text-xs shadow-xs pointer-events-none">
                        P
                    </span>
                );
            case "absent":
                return (
                    <span className="inline-flex size-7 items-center justify-center rounded-lg bg-rose-500 text-white font-black text-xs shadow-xs pointer-events-none">
                        A
                    </span>
                );
            case "late":
                return (
                    <span className="inline-flex size-7 items-center justify-center rounded-lg bg-amber-500 text-white font-black text-xs shadow-xs pointer-events-none">
                        LT
                    </span>
                );
            case "leave":
                return (
                    <span className="inline-flex size-7 items-center justify-center rounded-lg bg-blue-500 text-white font-black text-xs shadow-xs pointer-events-none">
                        L
                    </span>
                );
            case "holiday":
                return (
                    <span className="inline-flex size-7 items-center justify-center rounded-lg bg-purple-600 text-white font-black text-xs shadow-xs pointer-events-none">
                        H
                    </span>
                );
            default:
                return (
                    <span className="inline-flex size-7 items-center justify-center rounded-lg bg-slate-500 text-white font-bold text-xs pointer-events-none">
                        {status.slice(0, 1).toUpperCase()}
                    </span>
                );
        }
    };

    return (
        <div className="space-y-5">
            {/* Top Toolbar: Month Picker, Controls & Actions */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 md:p-5 rounded-3xl bg-card border border-border shadow-sm">
                <div className="flex flex-wrap items-center gap-3">
                    {/* Month Navigator */}
                    <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-2xl border border-border/60">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={handlePrevMonth}
                            className="size-8 rounded-xl"
                            title="Previous Month"
                        >
                            <ChevronLeft className="size-4" />
                        </Button>
                        <div className="px-3 py-1 text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-2">
                            <CalendarDays className="size-3.5 text-primary" />
                            {monthLabel}
                        </div>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={handleNextMonth}
                            className="size-8 rounded-xl"
                            title="Next Month"
                        >
                            <ChevronRight className="size-4" />
                        </Button>
                    </div>

                    {/* Mode Toggle: Popover vs 1-Click Fast Cycle */}
                    <div className="flex items-center p-1 bg-muted/50 rounded-2xl border border-border/60">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setClickMode("popover")}
                            className={cn(
                                "h-7 rounded-xl px-2.5 text-[11px] font-bold transition-all",
                                clickMode === "popover"
                                    ? "bg-background text-foreground shadow-xs"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                            title="Click opens options popup"
                        >
                            <Menu className="size-3 mr-1 text-primary" />
                            Menu Mode
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setClickMode("quick")}
                            className={cn(
                                "h-7 rounded-xl px-2.5 text-[11px] font-bold transition-all",
                                clickMode === "quick"
                                    ? "bg-background text-foreground shadow-xs"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                            title="Click directly cycles P -> A -> LT -> L"
                        >
                            <MousePointerClick className="size-3 mr-1 text-primary" />
                            1-Click Mode
                        </Button>
                    </div>

                    <div className="relative w-full sm:w-56">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                        <Input
                            placeholder="Filter student..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="h-9 pl-8 rounded-xl border-border text-xs bg-background placeholder:text-muted-foreground/50"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    <PermissionGate can="view_attendance">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleExport}
                            disabled={exporting || isLoading || !ledger}
                            className="h-9 rounded-xl gap-1.5 text-xs font-bold border-border shadow-xs hover:bg-muted"
                        >
                            {exporting ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
                            Export Excel
                        </Button>
                    </PermissionGate>

                    <PermissionGate can="mark_attendance">
                        <Button
                            type="button"
                            variant="default"
                            size="sm"
                            onClick={() => setImportOpen(true)}
                            className="h-9 rounded-xl gap-1.5 text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20"
                        >
                            <Upload className="size-3.5" />
                            Import Excel
                        </Button>
                    </PermissionGate>
                </div>
            </div>

            {/* Status Legend */}
            <div className="flex flex-wrap items-center gap-4 px-2 text-xs font-medium text-muted-foreground">
                <div className="flex items-center gap-1.5">
                    <span className="size-3 rounded-md bg-emerald-500 inline-block shadow-xs" />
                    <span className="text-foreground font-semibold">P</span> = Present
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="size-3 rounded-md bg-rose-500 inline-block shadow-xs" />
                    <span className="text-foreground font-semibold">A</span> = Absent
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="size-3 rounded-md bg-amber-500 inline-block shadow-xs" />
                    <span className="text-foreground font-semibold">LT</span> = Late
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="size-3 rounded-md bg-blue-500 inline-block shadow-xs" />
                    <span className="text-foreground font-semibold">L</span> = Leave
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="size-3 rounded-md bg-purple-600 inline-block shadow-xs" />
                    <span className="text-purple-700 font-semibold">H / HOL</span> = Holiday
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="size-3 rounded-md bg-rose-100 border border-rose-300 inline-block" />
                    <span className="text-rose-600 font-semibold">SUN</span> = Sunday
                </div>
            </div>

            {/* Calendar Register Matrix Table */}
            <div className="rounded-3xl border border-border bg-card shadow-xl overflow-hidden">
                {isLoading ? (
                    <div className="py-32 flex flex-col items-center justify-center gap-3">
                        <Loader2 className="size-8 animate-spin text-primary" />
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            Building Attendance Register...
                        </p>
                    </div>
                ) : !ledger || ledger.matrix.length === 0 ? (
                    <div className="py-24 text-center space-y-2">
                        <Users className="size-10 text-muted-foreground/30 mx-auto" />
                        <p className="text-base font-bold text-foreground">No Enrolled Students</p>
                        <p className="text-xs text-muted-foreground">
                            There are no active students enrolled in this class.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto max-h-[70vh] relative">
                        <table className="w-full text-xs text-left border-collapse select-none">
                            {/* Table Header */}
                            <thead className="sticky top-0 z-20 bg-muted/90 backdrop-blur-md border-b border-border text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                                <tr>
                                    {/* Sticky Student Header */}
                                    <th className="px-5 py-3.5 sticky left-0 z-30 bg-card shadow-[2px_0_5px_rgba(0,0,0,0.05)] min-w-[200px]">
                                        Student Information
                                    </th>

                                    {/* Day Columns 1..31 */}
                                    {Array.from({ length: ledger.days_in_month }).map((_, i) => {
                                        const d = i + 1;
                                        const dateStr = `${month}-${String(d).padStart(2, "0")}`;
                                        const meta = ledger.days_meta?.[dateStr];
                                        const isHoliday = Boolean(meta?.holiday);
                                        const isSunday = Boolean(meta?.is_sunday);

                                        return (
                                            <th
                                                key={d}
                                                className={cn(
                                                    "px-1 py-2 text-center min-w-[38px] border-r border-border/30 transition-colors",
                                                    isHoliday && "bg-purple-500/10 text-purple-900 border-b-2 border-b-purple-500",
                                                    isSunday && "bg-rose-500/10 text-rose-700 font-black"
                                                )}
                                                title={
                                                    isHoliday
                                                        ? `Holiday: ${meta?.holiday?.name || "Official Holiday"}`
                                                        : isSunday
                                                            ? "Sunday (Weekly Off)"
                                                            : `${meta?.day_name || ""} ${d} ${monthLabel}`
                                                }
                                            >
                                                <div className="text-[11px] font-black leading-tight">{d}</div>
                                                {isHoliday ? (
                                                    <span className="text-[8px] font-extrabold text-purple-700 block tracking-tighter">
                                                        HOL
                                                    </span>
                                                ) : isSunday ? (
                                                    <span className="text-[8px] font-bold text-rose-600 block tracking-tighter">
                                                        SUN
                                                    </span>
                                                ) : (
                                                    <span className="text-[8px] font-medium text-muted-foreground/60 block tracking-tighter">
                                                        {meta?.day_name?.slice(0, 2)}
                                                    </span>
                                                )}
                                            </th>
                                        );
                                    })}

                                    {/* Summary Column Headers */}
                                    <th className="px-3 py-3.5 text-center bg-emerald-500/10 text-emerald-700 font-extrabold border-l border-border">
                                        P
                                    </th>
                                    <th className="px-3 py-3.5 text-center bg-rose-500/10 text-rose-700 font-extrabold">
                                        A
                                    </th>
                                    <th className="px-3 py-3.5 text-center bg-amber-500/10 text-amber-700 font-extrabold">
                                        LT
                                    </th>
                                    <th className="px-3 py-3.5 text-center bg-blue-500/10 text-blue-700 font-extrabold">
                                        L
                                    </th>
                                    <th className="px-3 py-3.5 text-center bg-purple-500/10 text-purple-700 font-extrabold">
                                        H
                                    </th>
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody className="divide-y divide-border">
                                {filteredMatrix.map((row) => (
                                    <tr
                                        key={row.user_id}
                                        className="hover:bg-muted/30 transition-colors group"
                                    >
                                        {/* Sticky Student Column */}
                                        <td className="px-5 py-2.5 sticky left-0 z-10 bg-card shadow-[2px_0_5px_rgba(0,0,0,0.05)]">
                                            <div className="flex items-center gap-2.5">
                                                <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                                                    {row.name.charAt(0)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="font-bold text-foreground truncate max-w-[140px]" title={row.name}>
                                                        {row.name}
                                                    </p>
                                                    <p className="text-[10px] text-muted-foreground/70 font-mono truncate">
                                                        {row.roll_no}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Day Cells 1..31 */}
                                        {Array.from({ length: ledger.days_in_month }).map((_, i) => {
                                            const d = i + 1;
                                            const dateStr = `${month}-${String(d).padStart(2, "0")}`;
                                            const dayData = row.days[dateStr];
                                            const meta = ledger.days_meta?.[dateStr];
                                            const isHoliday = Boolean(meta?.holiday);
                                            const isSunday = Boolean(meta?.is_sunday);
                                            const cellKey = `${row.user_id}-${dateStr}`;

                                            return (
                                                <td
                                                    key={d}
                                                    className={cn(
                                                        "px-0.5 py-1 text-center border-r border-border/20 relative",
                                                        isHoliday && "bg-purple-500/[0.04]",
                                                        isSunday && "bg-rose-500/[0.04]"
                                                    )}
                                                >
                                                    <Popover
                                                        open={openCellKey === cellKey}
                                                        onOpenChange={(isOpen) => setOpenCellKey(isOpen ? cellKey : null)}
                                                        modal={false}
                                                    >
                                                        <PopoverTrigger asChild>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    handleCellClick(row.user_id, dateStr, dayData?.status);
                                                                }}
                                                                className="w-full h-8 mx-auto rounded-lg flex items-center justify-center transition-transform active:scale-90 hover:scale-105 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                                title={`Click to mark attendance for ${row.name} on ${dateStr}`}
                                                            >
                                                                {renderCellStatus(dayData?.status, isHoliday, isSunday)}
                                                            </button>
                                                        </PopoverTrigger>
                                                        <PopoverContent
                                                            className="w-64 p-3.5 shadow-2xl z-[99999] rounded-2xl border-border bg-card"
                                                            align="center"
                                                            side="top"
                                                            sideOffset={6}
                                                        >
                                                            <div className="border-b border-border pb-2.5 mb-2.5">
                                                                <p className="font-bold text-xs text-foreground truncate">
                                                                    {row.name}
                                                                </p>
                                                                <div className="text-[11px] text-muted-foreground flex items-center justify-between mt-0.5">
                                                                    <span>
                                                                        {format(parse(dateStr, "yyyy-MM-dd", new Date()), "EEE, dd MMM yyyy")}
                                                                    </span>
                                                                    {isHoliday && (
                                                                        <span className="text-[9px] font-bold text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded-full">
                                                                            Holiday
                                                                        </span>
                                                                    )}
                                                                    {isSunday && !isHoliday && (
                                                                        <span className="text-[9px] font-bold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded-full">
                                                                            Sunday
                                                                        </span>
                                                                    )}
                                                                </div>
                                                                {meta?.holiday?.name && (
                                                                    <div className="text-[10px] text-purple-700 font-semibold mt-1.5 p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 truncate">
                                                                        🎉 {meta.holiday.name}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Quick Status Buttons */}
                                                            <div className="grid grid-cols-2 gap-1.5 mb-2">
                                                                <Button
                                                                    type="button"
                                                                    size="sm"
                                                                    variant={dayData?.status === "present" ? "default" : "outline"}
                                                                    className={cn(
                                                                        "h-8 text-xs font-bold justify-start rounded-xl",
                                                                        dayData?.status === "present"
                                                                            ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                                                            : "hover:bg-emerald-50 text-emerald-700 border-emerald-200"
                                                                    )}
                                                                    onClick={() => handleCellMark(row.user_id, dateStr, "present")}
                                                                >
                                                                    <span className="size-2 rounded-full bg-emerald-500 mr-1.5 shrink-0" />
                                                                    Present (P)
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    size="sm"
                                                                    variant={dayData?.status === "absent" ? "default" : "outline"}
                                                                    className={cn(
                                                                        "h-8 text-xs font-bold justify-start rounded-xl",
                                                                        dayData?.status === "absent"
                                                                            ? "bg-rose-600 hover:bg-rose-700 text-white"
                                                                            : "hover:bg-rose-50 text-rose-700 border-rose-200"
                                                                    )}
                                                                    onClick={() => handleCellMark(row.user_id, dateStr, "absent")}
                                                                >
                                                                    <span className="size-2 rounded-full bg-rose-500 mr-1.5 shrink-0" />
                                                                    Absent (A)
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    size="sm"
                                                                    variant={dayData?.status === "late" ? "default" : "outline"}
                                                                    className={cn(
                                                                        "h-8 text-xs font-bold justify-start rounded-xl",
                                                                        dayData?.status === "late"
                                                                            ? "bg-amber-500 hover:bg-amber-600 text-white"
                                                                            : "hover:bg-amber-50 text-amber-700 border-amber-200"
                                                                    )}
                                                                    onClick={() => handleCellMark(row.user_id, dateStr, "late")}
                                                                >
                                                                    <span className="size-2 rounded-full bg-amber-500 mr-1.5 shrink-0" />
                                                                    Late (LT)
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    size="sm"
                                                                    variant={dayData?.status === "leave" ? "default" : "outline"}
                                                                    className={cn(
                                                                        "h-8 text-xs font-bold justify-start rounded-xl",
                                                                        dayData?.status === "leave"
                                                                            ? "bg-blue-600 hover:bg-blue-700 text-white"
                                                                            : "hover:bg-blue-50 text-blue-700 border-blue-200"
                                                                    )}
                                                                    onClick={() => handleCellMark(row.user_id, dateStr, "leave")}
                                                                >
                                                                    <span className="size-2 rounded-full bg-blue-500 mr-1.5 shrink-0" />
                                                                    Leave (L)
                                                                </Button>
                                                            </div>

                                                            <div className="grid grid-cols-1 gap-1.5">
                                                                <Button
                                                                    type="button"
                                                                    size="sm"
                                                                    variant={dayData?.status === "holiday" ? "default" : "outline"}
                                                                    className={cn(
                                                                        "h-8 text-xs font-bold justify-start rounded-xl",
                                                                        dayData?.status === "holiday"
                                                                            ? "bg-purple-600 hover:bg-purple-700 text-white"
                                                                            : "hover:bg-purple-50 text-purple-700 border-purple-200"
                                                                    )}
                                                                    onClick={() => handleCellMark(row.user_id, dateStr, "holiday")}
                                                                >
                                                                    <span className="size-2 rounded-full bg-purple-500 mr-1.5 shrink-0" />
                                                                    Mark Holiday (H)
                                                                </Button>

                                                                {dayData?.status && (
                                                                    <Button
                                                                        type="button"
                                                                        size="sm"
                                                                        variant="ghost"
                                                                        className="h-7 text-xs text-muted-foreground hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                                                                        onClick={() => handleCellMark(row.user_id, dateStr, "clear")}
                                                                    >
                                                                        Clear Mark (-)
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>
                                                </td>
                                            );
                                        })}

                                        {/* Summary Counts */}
                                        <td className="px-3 py-2 text-center border-l border-border font-bold text-emerald-600 bg-emerald-500/5">
                                            {row.summary.present}
                                        </td>
                                        <td className="px-3 py-2 text-center font-bold text-rose-600 bg-rose-500/5">
                                            {row.summary.absent}
                                        </td>
                                        <td className="px-3 py-2 text-center font-bold text-amber-600 bg-amber-500/5">
                                            {row.summary.late}
                                        </td>
                                        <td className="px-3 py-2 text-center font-bold text-blue-600 bg-blue-500/5">
                                            {row.summary.leave}
                                        </td>
                                        <td className="px-3 py-2 text-center font-bold text-purple-600 bg-purple-500/5">
                                            {row.summary.holiday}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Bulk Import Modal */}
            <AttendanceImportDialog
                open={importOpen}
                onClose={() => setImportOpen(false)}
                classId={classId}
                className={className}
                month={month}
                allocationId={allocationId}
                onSuccess={() => refetch()}
            />
        </div>
    );
}
