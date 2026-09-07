import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, subDays, startOfMonth, endOfMonth, parseISO } from "date-fns";
import {
    User2,
    Users,
    UserCheck,
    UserX,
    Calendar,
    CalendarDays,
    Percent,
    TrendingUp,
    Clock,
    ClipboardCheck,
    Download,
    Filter,
    ChevronDown,
    SlidersHorizontal,
    Sparkles,
    CheckCircle2,
    AlertTriangle,
    FileSpreadsheet
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import attendanceApi from "@/lib/api/attendanceApi";
import { PermissionGate } from "@/components/PermissionGate";

interface ClassAttendanceAnalyticsHeaderProps {
    classId: number;
    className: string;
    classTeacherName?: string | null;
    enrollmentsCount: number;
    onOpenMarking: () => void;
    onOpenRegister: () => void;
    onOpenRoster?: () => void;
}

type PeriodPreset = "today" | "yesterday" | "last7" | "thisMonth" | "custom";

export function ClassAttendanceAnalyticsHeader({
    classId,
    className,
    classTeacherName,
    enrollmentsCount,
    onOpenMarking,
    onOpenRegister,
    onOpenRoster,
}: ClassAttendanceAnalyticsHeaderProps) {
    const todayStr = useMemo(() => format(new Date(), "yyyy-MM-dd"), []);
    const [preset, setPreset] = useState<PeriodPreset>("today");
    const [customFrom, setCustomFrom] = useState(todayStr);
    const [customTo, setCustomTo] = useState(todayStr);
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Compute Date Range from Preset
    const { fromDate, toDate, periodLabel } = useMemo(() => {
        const today = new Date();
        switch (preset) {
            case "today":
                return {
                    fromDate: todayStr,
                    toDate: todayStr,
                    periodLabel: `Today (${format(today, "dd MMM yyyy")})`,
                };
            case "yesterday": {
                const yest = subDays(today, 1);
                const yestStr = format(yest, "yyyy-MM-dd");
                return {
                    fromDate: yestStr,
                    toDate: yestStr,
                    periodLabel: `Yesterday (${format(yest, "dd MMM yyyy")})`,
                };
            }
            case "last7": {
                const start = subDays(today, 6);
                return {
                    fromDate: format(start, "yyyy-MM-dd"),
                    toDate: todayStr,
                    periodLabel: `Last 7 Days (${format(start, "dd MMM")} – ${format(today, "dd MMM")})`,
                };
            }
            case "thisMonth": {
                const start = startOfMonth(today);
                return {
                    fromDate: format(start, "yyyy-MM-dd"),
                    toDate: todayStr,
                    periodLabel: `This Month (${format(start, "MMMM yyyy")})`,
                };
            }
            case "custom":
                return {
                    fromDate: customFrom,
                    toDate: customTo,
                    periodLabel: `${format(parseISO(customFrom), "dd MMM yyyy")} – ${format(parseISO(customTo), "dd MMM yyyy")}`,
                };
        }
    }, [preset, todayStr, customFrom, customTo]);

    // Fetch Summary Report
    const { data: summaryRes, isLoading } = useQuery({
        queryKey: ["lms-class-attendance-analytics", classId, fromDate, toDate],
        queryFn: () =>
            attendanceApi.reports.summary({
                lms_class_id: classId,
                from_date: fromDate,
                to_date: toDate,
                level: "class",
            }),
        enabled: !!classId,
    });

    const summaryData = (summaryRes as any)?.data?.summary || summaryRes?.summary;
    const threshold = (summaryRes as any)?.data?.threshold_percentage || summaryRes?.threshold_percentage || 75;

    const presentCount = summaryData?.present ?? 0;
    const absentCount = summaryData?.absent ?? 0;
    const lateCount = summaryData?.late ?? 0;
    const leaveCount = summaryData?.leave ?? 0;
    const holidayCount = summaryData?.holiday ?? 0;
    const totalRecords = summaryData?.total ?? 0;
    const attendancePercentage = summaryData?.percentage_present ?? (totalRecords > 0 ? Math.round(((presentCount + lateCount) / totalRecords) * 100) : 0);

    const isAboveThreshold = attendancePercentage >= threshold;

    return (
        <div className="space-y-4">
            {/* Top Bar: Title, Date Filter & Quick Actions */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 md:p-5 rounded-3xl bg-card border border-border/80 shadow-sm">
                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center gap-2.5">
                        <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                            <TrendingUp className="size-5" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black tracking-tight text-foreground">
                                Attendance & Engagement Analytics
                            </h3>
                            <p className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                                <CalendarDays className="size-3 text-primary" />
                                {periodLabel}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                    {/* Period Selector Dropdown */}
                    <div className="flex items-center gap-1.5 p-1 bg-muted/60 rounded-2xl border border-border">
                        <Select
                            value={preset}
                            onValueChange={(val: PeriodPreset) => setPreset(val)}
                        >
                            <SelectTrigger className="h-8 border-none bg-transparent font-bold text-xs shadow-none w-36">
                                <SelectValue placeholder="Period" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-border">
                                <SelectItem value="today" className="text-xs font-bold">
                                    Today
                                </SelectItem>
                                <SelectItem value="yesterday" className="text-xs font-bold">
                                    Yesterday
                                </SelectItem>
                                <SelectItem value="last7" className="text-xs font-bold">
                                    Last 7 Days
                                </SelectItem>
                                <SelectItem value="thisMonth" className="text-xs font-bold">
                                    This Month
                                </SelectItem>
                                <SelectItem value="custom" className="text-xs font-bold">
                                    Custom Range...
                                </SelectItem>
                            </SelectContent>
                        </Select>

                        {preset === "custom" && (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 rounded-xl text-[11px] font-bold border-border gap-1"
                                    >
                                        <SlidersHorizontal className="size-3" />
                                        Pick Dates
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-4 rounded-2xl border-border bg-card shadow-2xl space-y-3">
                                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Custom Date Range
                                    </p>
                                    <div className="grid grid-cols-2 gap-3 text-xs">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-muted-foreground">From</label>
                                            <input
                                                type="date"
                                                value={customFrom}
                                                onChange={(e) => setCustomFrom(e.target.value)}
                                                className="h-8 w-full rounded-lg border border-border bg-background px-2 text-xs font-medium"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-bold text-muted-foreground">To</label>
                                            <input
                                                type="date"
                                                value={customTo}
                                                onChange={(e) => setCustomTo(e.target.value)}
                                                className="h-8 w-full rounded-lg border border-border bg-background px-2 text-xs font-medium"
                                            />
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )}
                    </div>

                    {onOpenRoster && (
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onOpenRoster}
                            className="h-9 rounded-xl font-bold text-xs border-primary/40 bg-primary/5 text-primary hover:bg-primary/10 shadow-xs gap-1.5"
                        >
                            <Users className="size-3.5" />
                            Student 360° Roster
                        </Button>
                    )}

                    <PermissionGate can="mark_attendance">
                        <Button
                            type="button"
                            size="sm"
                            onClick={onOpenMarking}
                            className="h-9 rounded-xl font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/90 shadow-md shadow-primary/20 gap-1.5"
                        >
                            <ClipboardCheck className="size-3.5" />
                            Mark Attendance
                        </Button>
                    </PermissionGate>

                    <PermissionGate can="view_attendance">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onOpenRegister}
                            className="h-9 rounded-xl font-bold text-xs border-border shadow-xs hover:bg-muted gap-1.5"
                        >
                            <CalendarDays className="size-3.5 text-primary" />
                            Monthly Register
                        </Button>
                    </PermissionGate>
                </div>
            </div>

            {/* Metric KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1: Teacher & Students */}
                <div className="p-4 rounded-2xl border border-border/70 bg-card shadow-xs flex items-center justify-between gap-3 hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-3">
                        <div className="size-11 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold shrink-0 border border-blue-500/20">
                            <User2 className="size-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                Class Teacher
                            </p>
                            <p className="truncate text-sm font-bold text-foreground">
                                {classTeacherName || "Not Assigned"}
                            </p>
                            <p className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1 mt-0.5">
                                <Users className="size-3" />
                                <span className="font-bold text-foreground">{enrollmentsCount}</span> Students Enrolled
                            </p>
                        </div>
                    </div>
                </div>

                {/* Card 2: Attendance Rate / Compliance */}
                <div className="p-4 rounded-2xl border border-border/70 bg-card shadow-xs space-y-2 hover:border-primary/30 transition-all">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            Attendance Rate
                        </span>
                        <Badge
                            variant="outline"
                            className={cn(
                                "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                                isAboveThreshold
                                    ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30"
                                    : "bg-amber-500/10 text-amber-700 border-amber-500/30"
                            )}
                        >
                            {isAboveThreshold ? (
                                <span className="flex items-center gap-1">
                                    <CheckCircle2 className="size-3 text-emerald-600" /> Target {threshold}% Met
                                </span>
                            ) : (
                                <span className="flex items-center gap-1">
                                    <AlertTriangle className="size-3 text-amber-600" /> Below {threshold}%
                                </span>
                            )}
                        </Badge>
                    </div>
                    <div className="flex items-baseline justify-between gap-2">
                        <span className={cn("text-2xl font-black tracking-tight", isAboveThreshold ? "text-emerald-600" : "text-amber-600")}>
                            {isLoading ? "..." : `${attendancePercentage}%`}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-medium">
                            {totalRecords} session marks
                        </span>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                            className={cn("h-full transition-all duration-500 rounded-full", isAboveThreshold ? "bg-emerald-500" : "bg-amber-500")}
                            style={{ width: `${Math.min(100, attendancePercentage)}%` }}
                        />
                    </div>
                </div>

                {/* Card 3: Present & Punctuality */}
                <div className="p-4 rounded-2xl border border-border/70 bg-card shadow-xs flex items-center justify-between gap-3 hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-3">
                        <div className="size-11 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold shrink-0 border border-emerald-500/20">
                            <UserCheck className="size-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                Present & On-Time
                            </p>
                            <p className="text-2xl font-black text-emerald-600 leading-none mt-0.5">
                                {isLoading ? "..." : presentCount}
                            </p>
                            <p className="text-[11px] font-semibold text-muted-foreground mt-1 flex items-center gap-1">
                                <Clock className="size-3 text-amber-600" />
                                <span className="text-amber-600 font-bold">{lateCount}</span> Late arrivals
                            </p>
                        </div>
                    </div>
                </div>

                {/* Card 4: Absent & Leaves */}
                <div className="p-4 rounded-2xl border border-border/70 bg-card shadow-xs flex items-center justify-between gap-3 hover:border-primary/30 transition-all">
                    <div className="flex items-center gap-3">
                        <div className="size-11 rounded-2xl bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold shrink-0 border border-rose-500/20">
                            <UserX className="size-5" />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                                Absent & Leaves
                            </p>
                            <p className="text-2xl font-black text-rose-600 leading-none mt-0.5">
                                {isLoading ? "..." : absentCount}
                            </p>
                            <p className="text-[11px] font-semibold text-muted-foreground mt-1 flex items-center gap-1">
                                <span className="size-1.5 rounded-full bg-blue-500 inline-block" />
                                <span className="text-blue-600 font-bold">{leaveCount}</span> Approved Leaves
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
