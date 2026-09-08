import React, { useState, useMemo } from 'react';
import { Head, Link } from "@inertiajs/react";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Each from "@/components/Each";
import {
  ATTENDANCE_BREADCRUMBS,
  ATTENDANCE_GUIDELINES,
} from "@/constants/page/admin/attendance";
import {
  CalendarCheck,
  CalendarIcon,
  ClipboardCheck,
  ArrowRight,
  FileText,
  BarChart3,
  CheckCircle2,
  Loader2,
  Users,
  Building2,
  Sparkles,
  Search,
  BookOpen,
  ArrowUpRight,
  ShieldAlert,
  Calendar,
} from "lucide-react";
import { AttendanceSheet } from "@/components/admin/attendanceSheet";
import { PermissionGate } from "@/components/PermissionGate";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import attendanceApi from "@/lib/api/attendanceApi";
import { useRegisterGuide } from '@/components/GuideProvider';
import { ATTENDANCE_DASHBOARD_GUIDE } from "@/constants/guides/attendance";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AttendanceIndex() {
  const [sheetOpen, setSheetOpen] = useState(false);
  useRegisterGuide(ATTENDANCE_DASHBOARD_GUIDE);
  const [sheetMode, setSheetMode] = useState<"marking" | "reporting">("marking");

  // Class & Subject selection state
  const [selectedClassId, setSelectedClassId] = useState<number | undefined>();
  const [selectedAllocationId, setSelectedAllocationId] = useState<number | undefined>();
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [classSearch, setClassSearch] = useState("");

  // Fetch classes
  const { data: classesRes, isLoading: classesLoading } = useQuery({
    queryKey: ["attendance-classes"],
    queryFn: () => attendanceApi.classes({ all: true }),
  });

  const classes = useMemo(() => {
    const raw = (classesRes as any)?.data?.data || (classesRes as any)?.data || classesRes;
    if (Array.isArray(raw)) return raw as { id: number; name: string; stream?: { name: string }; session?: { name: string } }[];
    return [];
  }, [classesRes]);

  // Filtered classes by search
  const filteredClasses = useMemo(() => {
    if (!classSearch.trim()) return classes;
    const q = classSearch.toLowerCase();
    return classes.filter(
      (c) => c.name.toLowerCase().includes(q) || c.stream?.name?.toLowerCase().includes(q)
    );
  }, [classes, classSearch]);

  // Fetch allocations for selected class
  const { data: allocationsRes, isLoading: allocationsLoading } = useQuery({
    queryKey: ["attendance-allocations", selectedClassId],
    queryFn: () => attendanceApi.allocationsForClass(selectedClassId!),
    enabled: !!selectedClassId,
  });

  const allocations = useMemo(() => {
    const raw = (allocationsRes as any)?.data?.data || (allocationsRes as any)?.data || allocationsRes;
    if (Array.isArray(raw)) return raw as { id: number; subject: { name: string } | null }[];
    return [];
  }, [allocationsRes]);

  const openSheet = (mode: "marking" | "reporting", classId?: number) => {
    const targetClassId = classId ?? selectedClassId;
    if (!targetClassId) return;
    if (classId) setSelectedClassId(classId);
    setSheetMode(mode);
    setSheetOpen(true);
  };

  return (
    <>
      <Head title="Attendance Management Center" />
      <MainPageHeader
        id="attendance-header"
        breadcrumbs={ATTENDANCE_BREADCRUMBS}
        icon={CalendarCheck}
        title="Attendance Center"
        subtitle="Precision tracking, daily marking, and compliance reporting for your institution"
        guidance={ATTENDANCE_GUIDELINES}
      />

      <div className="max-w-7xl mx-auto space-y-8 font-display">

        {/* ─── Hero Quick-Action Card ─── */}
        <Card className="rounded-3xl border border-sidebar-border/60 bg-card p-6 shadow-sm">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-sidebar-border/30 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <ClipboardCheck className="size-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">Quick Attendance Marking</h3>
                  <p className="text-xs text-muted-foreground">Select a class and date to take or review attendance</p>
                </div>
              </div>
              <span className="text-xs font-bold text-muted-foreground px-3 py-1 rounded-full bg-sidebar-accent/50 border border-sidebar-border/40">
                {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short", year: "numeric" })}
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-end gap-4">
              <div className="flex-1 space-y-1.5" id="class-selector">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Select Class</label>
                <Select
                  value={selectedClassId?.toString()}
                  onValueChange={(v) => {
                    setSelectedClassId(parseInt(v));
                    setSelectedAllocationId(undefined);
                  }}
                >
                  <SelectTrigger className="h-11 rounded-xl border-border bg-background font-medium">
                    <SelectValue placeholder="Choose a classroom..." />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {classesLoading ? (
                      <div className="flex items-center justify-center p-4 gap-2">
                        <Loader2 className="size-4 animate-spin text-primary" />
                        <span className="text-xs text-muted-foreground">Loading classes...</span>
                      </div>
                    ) : (
                      classes.map((c) => (
                        <SelectItem key={c.id} value={c.id.toString()} className="font-medium">
                          {c.name} {c.stream?.name ? `(${c.stream.name})` : ""}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subject Level (Optional)</label>
                <Select
                  value={selectedAllocationId?.toString() || "class"}
                  onValueChange={(v) => setSelectedAllocationId(v === "class" ? undefined : parseInt(v))}
                  disabled={!selectedClassId}
                >
                  <SelectTrigger className="h-11 rounded-xl border-border bg-background font-medium">
                    <SelectValue placeholder="General (Class Level)" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="class" className="font-semibold text-xs">
                      General (Class Level)
                    </SelectItem>
                    <Separator className="my-1" />
                    {allocationsLoading ? (
                      <div className="flex items-center justify-center p-4 gap-2">
                        <Loader2 className="size-4 animate-spin text-primary" />
                        <span className="text-xs text-muted-foreground">Loading allocations...</span>
                      </div>
                    ) : (
                      allocations.map((a: { id: number; subject: { name: string } | null }) => (
                        <SelectItem key={a.id} value={a.id.toString()} className="font-medium">
                          {a.subject?.name || "Unknown Subject"}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Date</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  <input
                    type="date"
                    className="flex h-11 w-full rounded-xl border border-border bg-background pl-10 pr-3 py-2 text-sm font-medium text-foreground focus-visible:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <PermissionGate can="mark_attendance">
                  <Button
                    id="mark-attendance-btn"
                    className="h-11 rounded-xl bg-primary text-primary-foreground font-bold px-6 shadow-sm hover:shadow transition-all"
                    onClick={() => openSheet("marking")}
                    disabled={!selectedClassId}
                  >
                    <ClipboardCheck className="size-4 mr-2" />
                    Mark Attendance
                  </Button>
                </PermissionGate>
                <PermissionGate can="view_attendance">
                  <Button
                    variant="outline"
                    className="h-11 rounded-xl font-bold px-5 border-border"
                    onClick={() => openSheet("reporting")}
                    disabled={!selectedClassId}
                  >
                    <FileText className="size-4 mr-2" />
                    View Register
                  </Button>
                </PermissionGate>
              </div>
            </div>
          </div>
        </Card>

        {/* ─── 3 Main Report & Action Cards ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/attendance/reports/summary" className="group block focus:outline-none">
            <Card className="h-full border border-sidebar-border/60 bg-card rounded-3xl p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden">
              <div className="flex flex-col h-full justify-between gap-6">
                <div className="space-y-4">
                  <div className="size-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                    <BarChart3 className="size-7" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black tracking-tight group-hover:text-primary transition-colors">Analytics & Compliance</h3>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-600">75% Target</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                      Evaluate student attendance rates, aggregate status breakdown, and verify regulatory examination thresholds.
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-xs font-bold text-primary group-hover:underline">
                  View Analytics <ArrowRight className="size-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/attendance/reports/daily" className="group block focus:outline-none">
            <Card className="h-full border border-sidebar-border/60 bg-card rounded-3xl p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden">
              <div className="flex flex-col h-full justify-between gap-6">
                <div className="space-y-4">
                  <div className="size-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                    <FileText className="size-7" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black tracking-tight group-hover:text-primary transition-colors">Daily Register</h3>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-600">Daily Log</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                      Inspect individual student attendance status records for any specific day across all classroom streams.
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-xs font-bold text-primary group-hover:underline">
                  Open Register <ArrowRight className="size-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/lms/classes" className="group block focus:outline-none">
            <Card className="h-full border border-sidebar-border/60 bg-card rounded-3xl p-6 transition-all duration-300 hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 relative overflow-hidden">
              <div className="flex flex-col h-full justify-between gap-6">
                <div className="space-y-4">
                  <div className="size-14 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-600 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                    <BookOpen className="size-7" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black tracking-tight group-hover:text-primary transition-colors">LMS Classroom Hub</h3>
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-500/10 text-purple-600">Classes</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-medium leading-relaxed">
                      Manage classrooms, subject allocations, assigned faculty instructors, and timetable schedules.
                    </p>
                  </div>
                </div>
                <div className="flex items-center text-xs font-bold text-primary group-hover:underline">
                  Manage Classrooms <ArrowRight className="size-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* ─── All Classrooms Quick-Mark Matrix ─── */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-sidebar-border/50 pb-3 px-1">
            <div>
              <h3 className="text-base font-black tracking-tight">Active Classrooms ({classes.length})</h3>
              <p className="text-xs text-muted-foreground">Select any class to quickly mark or review attendance</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <Input
                placeholder="Search classroom..."
                className="h-9 pl-9 rounded-xl text-xs bg-background"
                value={classSearch}
                onChange={(e) => setClassSearch(e.target.value)}
              />
            </div>
          </div>

          {classesLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-36 rounded-2xl bg-muted/40" />
              ))}
            </div>
          )}

          {!classesLoading && filteredClasses.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredClasses.map((c) => (
                <Card
                  key={c.id}
                  className="rounded-2xl border border-sidebar-border/60 bg-card p-5 hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between space-y-4 group/item"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between">
                      <div className="size-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-xs">
                        {c.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-[10px] font-bold text-muted-foreground px-2 py-0.5 rounded-md bg-sidebar-accent/50">
                        {c.session?.name || "Active Session"}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-foreground group-hover/item:text-primary transition-colors truncate">
                      {c.name}
                    </h4>
                    {c.stream?.name && (
                      <p className="text-xs text-muted-foreground font-medium truncate">
                        {c.stream.name}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-sidebar-border/30 flex items-center gap-2">
                    <Button
                      size="sm"
                      className="flex-1 rounded-xl text-xs font-bold h-8"
                      onClick={() => openSheet("marking", c.id)}
                    >
                      <ClipboardCheck className="size-3.5 mr-1" /> Mark
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-xl text-xs font-bold h-8 px-3 border-border"
                      onClick={() => openSheet("reporting", c.id)}
                    >
                      <FileText className="size-3.5" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {!classesLoading && filteredClasses.length === 0 && (
            <Card className="rounded-2xl border border-dashed border-sidebar-border p-8 text-center bg-card">
              <p className="text-xs text-muted-foreground">No classrooms matched "{classSearch}"</p>
            </Card>
          )}
        </div>
      </div>

      <AttendanceSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        initialClassId={selectedClassId}
        initialAllocationId={selectedAllocationId}
        initialDate={selectedDate}
        mode={sheetMode}
      />
    </>
  );
}
