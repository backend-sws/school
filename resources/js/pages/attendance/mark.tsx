import React, { useMemo, useState, useEffect } from "react";
import { Head } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  CalendarIcon,
  Loader2,
  Search,
  Users,
  BookOpen,
  XCircle,
  ClipboardCheck,
  ArrowRight,
  Clock,
  UserCheck,
  CalendarDays,
  Sparkles,
  PartyPopper,
  Sun,
  FileSpreadsheet,
  Upload,
  Download
} from "lucide-react";
import Each from "@/components/Each";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import attendanceApi, { type AttendanceLevel, type AttendanceRecordRow } from "@/lib/api/attendanceApi";
import { ATTENDANCE_STATUS_OPTIONS } from "@/constants/page/admin/attendance";
import { cn } from "@/lib/utils";
import { AttendanceRegisterMatrix } from "@/components/admin/attendanceRegisterMatrix";
import { AttendanceImportDialog } from "@/components/admin/attendanceImportDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCollegeSessions } from "@/hooks/useCollegeSessions";

const defaultDate = () => new Date().toISOString().slice(0, 10);

function getInitialClassIdFromUrl(): number | undefined {
  if (typeof window === "undefined") return undefined;
  const val = new URLSearchParams(window.location.search).get("classId");
  return val ? parseInt(val) : undefined;
}

export default function AttendanceMark() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"daily" | "monthly">("daily");
  const [sessionId, setSessionId] = useState<string>("all");
  const [selectedClassId, setSelectedClassId] = useState<number | undefined>(getInitialClassIdFromUrl());
  const [selectedAllocationId, setSelectedAllocationId] = useState<number | undefined>(undefined);
  const [date, setDate] = useState(defaultDate());
  const [searchQuery, setSearchQuery] = useState("");
  const [importOpen, setImportOpen] = useState(false);

  const { data: sessionsRes } = useCollegeSessions({});
  const sessions = sessionsRes?.data ?? [];

  // Fetch Classes
  const { data: classesRes, isLoading: classesLoading } = useQuery({
    queryKey: ["attendance-classes"],
    queryFn: () => attendanceApi.classes({ all: true }),
  });

  const classes = useMemo(() => {
    const raw = (classesRes as any)?.data?.data || (classesRes as any)?.data || classesRes;
    if (Array.isArray(raw)) return raw as { id: number; name: string; session_id?: number; session?: { id?: number; name: string } }[];
    return [];
  }, [classesRes]);

  const filteredClasses = useMemo(() => {
    if (sessionId && sessionId !== "all") {
      return classes.filter((c: any) => String(c.session_id || c.session?.id) === String(sessionId));
    }
    return classes;
  }, [classes, sessionId]);

  // Auto-select first class if none selected or not in filtered
  useEffect(() => {
    if (filteredClasses.length > 0) {
      if (!selectedClassId || !filteredClasses.some(c => c.id === selectedClassId)) {
        setSelectedClassId(filteredClasses[0].id);
        setSelectedAllocationId(undefined);
      }
    }
  }, [filteredClasses, selectedClassId]);

  // Fetch Allocations for selected class
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

  const level: AttendanceLevel = selectedAllocationId ? "subject" : "class";

  const dailyParams = useMemo(() => ({
    lms_class_id: selectedClassId!,
    date,
    level,
    ...(selectedAllocationId ? { class_subject_allocation_id: selectedAllocationId } : {}),
  }), [selectedClassId, date, level, selectedAllocationId]);

  const { data: dailyRes, isLoading: dailyLoading } = useQuery({
    queryKey: ["attendance-daily", dailyParams],
    queryFn: () => attendanceApi.getDaily(dailyParams),
    enabled: !!selectedClassId,
  });

  const rawDailyData = (dailyRes as any)?.data || dailyRes;
  const records = useMemo(
    () => rawDailyData?.records ?? [],
    [rawDailyData]
  ) as AttendanceRecordRow[];
  const meta = rawDailyData?.meta;

  const [localRecords, setLocalRecords] = useState<Record<number, string>>({});

  // Sync Records
  useEffect(() => {
    if (records.length > 0) {
      const initial: Record<number, string> = {};
      records.forEach((r) => {
        initial[r.user_id] = r.status || (meta?.is_holiday || meta?.is_sunday ? "holiday" : "present");
      });
      setLocalRecords(initial);
    } else {
      setLocalRecords((prev) => (Object.keys(prev).length > 0 ? {} : prev));
    }
  }, [records, meta]);

  const filteredRecords = useMemo(() => {
    if (!searchQuery) return records;
    const q = searchQuery.toLowerCase();
    return records.filter(r =>
      r.user_name.toLowerCase().includes(q) ||
      (r.roll_no && r.roll_no.toLowerCase().includes(q))
    );
  }, [records, searchQuery]);

  const stats = useMemo(() => {
    const total = records.length;
    const present = records.filter(r => (localRecords[r.user_id] || "present") === "present").length;
    const absent = records.filter(r => (localRecords[r.user_id] || "present") === "absent").length;
    const late = records.filter(r => localRecords[r.user_id] === "late").length;
    const leave = records.filter(r => localRecords[r.user_id] === "leave").length;
    const holiday = records.filter(r => localRecords[r.user_id] === "holiday").length;
    return { total, present, absent, late, leave, holiday };
  }, [records, localRecords]);

  const handleStatusChange = (userId: number, status: string) => {
    setLocalRecords((prev) => ({ ...prev, [userId]: status }));
  };

  const markAllAs = (status: string) => {
    const next: Record<number, string> = { ...localRecords };
    records.forEach((r) => {
      next[r.user_id] = status;
    });
    setLocalRecords(next);
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: Parameters<typeof attendanceApi.submitDaily>[0]) => attendanceApi.submitDaily(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance-daily"] });
      queryClient.invalidateQueries({ queryKey: ["attendance-ledger"] });
      if (selectedClassId) {
        queryClient.invalidateQueries({ queryKey: ["lms-class-attendance-summary", selectedClassId] });
      }
      toast.success("Attendance saved successfully!");
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
    mutate({
      lms_class_id: selectedClassId,
      date,
      level,
      ...(selectedAllocationId ? { class_subject_allocation_id: selectedAllocationId } : {}),
      records: records.map((r) => ({
        user_id: r.user_id,
        status: localRecords[r.user_id] || "present",
      })),
    });
  };

  const selectedClassObj = classes.find(c => c.id === selectedClassId);
  const selectedClassName = selectedClassObj
    ? (selectedClassObj.session?.name ? `${selectedClassObj.name} (${selectedClassObj.session.name})` : selectedClassObj.name)
    : "Class";

  return (
    <>
      <Head title="Mark Attendance" />

      <div className="max-w-[1300px] mx-auto space-y-8 pb-12">
        {/* Fancy Hero Header */}
        <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-emerald-600/10 via-background to-background p-8 md:p-10 border border-border shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-[24px] bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-600/20 ring-4 ring-emerald-500/10">
                  <ClipboardCheck className="size-9 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl md:text-4xl font-black tracking-tight text-foreground">
                    Class Attendance Register
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full border border-emerald-500/20">
                      <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                      {selectedClassName}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="size-3.5" />
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* View Mode Switcher Pills */}
            <div className="flex items-center p-1.5 bg-muted/60 backdrop-blur-md rounded-2xl border border-border">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setActiveTab("daily")}
                className={cn(
                  "rounded-xl px-5 py-2 text-xs font-bold transition-all",
                  activeTab === "daily"
                    ? "bg-background text-foreground shadow-md shadow-black/5"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <ClipboardCheck className="size-4 mr-2 text-primary" />
                Daily Marking
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setActiveTab("monthly")}
                className={cn(
                  "rounded-xl px-5 py-2 text-xs font-bold transition-all",
                  activeTab === "monthly"
                    ? "bg-background text-foreground shadow-md shadow-black/5"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <CalendarDays className="size-4 mr-2 text-primary" />
                Monthly Register (Calendar)
              </Button>
            </div>
          </div>
        </div>

        {/* Global Selectors: Session, Class & Subject */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-3xl bg-card border border-border shadow-md">
          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Session</Label>
            <Select
              value={sessionId}
              onValueChange={(v) => {
                setSessionId(v);
                setSelectedAllocationId(undefined);
              }}
            >
              <SelectTrigger className="h-11 rounded-xl border-border bg-background font-bold text-foreground">
                <SelectValue placeholder="All Sessions" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border">
                <SelectItem value="all" className="font-bold py-2.5">All Sessions</SelectItem>
                {sessions.map((s: any) => (
                  <SelectItem key={s.id} value={String(s.id)} className="font-bold py-2.5">
                    {s.name}{s.is_current ? " (Current)" : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Classroom</Label>
            <Select
              value={selectedClassId?.toString() || ""}
              onValueChange={(v) => {
                setSelectedClassId(parseInt(v));
                setSelectedAllocationId(undefined);
              }}
            >
              <SelectTrigger className="h-11 rounded-xl border-border bg-background font-bold text-foreground">
                <SelectValue placeholder="Choose Class" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border">
                {classesLoading ? (
                  <div className="flex items-center justify-center p-4 gap-2">
                    <Loader2 className="size-4 animate-spin text-primary" />
                    <span className="text-xs text-muted-foreground">Loading...</span>
                  </div>
                ) : (
                  filteredClasses.map((c: { id: number; name: string; session?: { name: string } }) => (
                    <SelectItem key={c.id} value={c.id.toString()} className="font-bold py-2.5">
                      {sessionId === "all" && c.session?.name ? `${c.name} (${c.session.name})` : c.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Subject / Allocation</Label>
            <Select
              value={selectedAllocationId?.toString() || "class"}
              onValueChange={(v) => setSelectedAllocationId(v === "class" ? undefined : parseInt(v))}
              disabled={!selectedClassId}
            >
              <SelectTrigger className="h-11 rounded-xl border-border bg-background font-bold text-foreground">
                <SelectValue placeholder="General Attendance" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border">
                <SelectItem value="class" className="font-bold text-primary py-2.5">
                  General (Class Level)
                </SelectItem>
                <Separator className="my-1" />
                {allocationsLoading ? (
                  <div className="flex items-center justify-center p-4 gap-2">
                    <Loader2 className="size-4 animate-spin text-primary" />
                    <span className="text-xs text-muted-foreground">Loading...</span>
                  </div>
                ) : (
                  allocations.map((a: { id: number; subject: { name: string } | null }) => (
                    <SelectItem key={a.id} value={a.id.toString()} className="font-bold py-2.5">
                      {a.subject?.name || "Unknown"}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Quick Tool</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setImportOpen(true)}
                disabled={!selectedClassId}
                className="w-full h-11 rounded-xl font-bold gap-2 text-xs border-border"
              >
                <Upload className="size-4 text-primary" />
                Import Excel Register
              </Button>
            </div>
          </div>
        </div>

        {/* Tab 1: Daily Marking View */}
        {activeTab === "daily" && (
          <div className="space-y-8">
            {/* Holiday / Sunday Alert Banner */}
            {meta?.is_holiday && (
              <div className="p-5 rounded-3xl bg-purple-500/10 border border-purple-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-purple-500/5">
                <div className="flex items-center gap-3.5">
                  <div className="size-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-md shadow-purple-600/20 shrink-0">
                    <PartyPopper className="size-6" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-purple-950 dark:text-purple-100 flex items-center gap-2">
                      Holiday Detected: {meta.holiday?.name}
                    </h4>
                    <p className="text-xs text-purple-800 dark:text-purple-300">
                      {meta.holiday?.description || "This date is marked as an institutional holiday in the calendar."}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="default"
                  size="sm"
                  onClick={() => markAllAs("holiday")}
                  className="rounded-xl font-bold bg-purple-600 hover:bg-purple-700 text-white shrink-0 shadow-md shadow-purple-600/20"
                >
                  <Sparkles className="size-3.5 mr-1.5" />
                  Set All as Holiday
                </Button>
              </div>
            )}

            {meta?.is_sunday && !meta?.is_holiday && (
              <div className="p-4 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20 shrink-0">
                    <Sun className="size-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-rose-950 dark:text-rose-100">
                      Sunday / Weekly Off
                    </h4>
                    <p className="text-xs text-rose-800 dark:text-rose-300">
                      The selected date is a Sunday.
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => markAllAs("holiday")}
                  className="rounded-xl font-bold border-rose-300 text-rose-700 hover:bg-rose-100 shrink-0"
                >
                  Mark All Off
                </Button>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Left Column: Date & Quick Actions */}
              <div className="lg:col-span-1 space-y-6">
                <div className="p-6 rounded-3xl bg-card border border-border shadow-md space-y-6">
                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Date</Label>
                    <div className="relative">
                      <CalendarIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                      <input
                        type="date"
                        className="flex h-12 w-full rounded-2xl border border-border bg-background pl-10 pr-3 text-sm font-bold text-foreground focus-visible:outline-none focus:ring-2 focus:ring-ring transition-all"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <p className="text-[11px] uppercase font-bold tracking-wider text-muted-foreground">
                      Batch Actions
                    </p>
                    <div className="grid grid-cols-1 gap-2.5">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => markAllAs("present")}
                        disabled={!records.length}
                        className="h-11 rounded-xl font-bold text-xs justify-start px-4 border-emerald-500/20 bg-emerald-500/5 text-emerald-700 hover:bg-emerald-500 hover:text-white transition-colors"
                      >
                        <UserCheck className="size-4 mr-2" />
                        All Present (P)
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => markAllAs("absent")}
                        disabled={!records.length}
                        className="h-11 rounded-xl font-bold text-xs justify-start px-4 border-rose-500/20 bg-rose-500/5 text-rose-700 hover:bg-rose-500 hover:text-white transition-colors"
                      >
                        <XCircle className="size-4 mr-2" />
                        All Absent (A)
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => markAllAs("holiday")}
                        disabled={!records.length}
                        className="h-11 rounded-xl font-bold text-xs justify-start px-4 border-purple-500/20 bg-purple-500/5 text-purple-700 hover:bg-purple-600 hover:text-white transition-colors"
                      >
                        <PartyPopper className="size-4 mr-2" />
                        All Holiday (H)
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  {/* Summary Counters */}
                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                      <p className="text-[10px] font-black uppercase text-emerald-700">Present</p>
                      <p className="text-2xl font-black text-emerald-700">{stats.present}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                      <p className="text-[10px] font-black uppercase text-rose-700">Absent</p>
                      <p className="text-2xl font-black text-rose-700">{stats.absent}</p>
                    </div>
                  </div>
                </div>

                <Button
                  className="w-full h-14 text-base font-black rounded-2xl shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:scale-[1.01] active:scale-[0.99] group"
                  onClick={handleSubmit}
                  disabled={isPending || !records.length}
                >
                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="size-5 animate-spin" />
                      Saving Records...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      Save & Commit Attendance
                      <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  )}
                </Button>
              </div>

              {/* Right Column: Student Attendance Roster */}
              <div className="lg:col-span-3 space-y-4">
                <div className="p-4 bg-card rounded-2xl border border-border flex items-center justify-between gap-4">
                  <div className="w-full max-w-md relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      placeholder="Search student by name or roll no..."
                      className="h-10 pl-10 rounded-xl border-border text-sm font-medium bg-background"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="text-xs font-bold text-muted-foreground flex items-center gap-2">
                    <Users className="size-4" />
                    <span>{records.length} Total Students</span>
                  </div>
                </div>

                <div className="rounded-3xl border border-border bg-card shadow-md overflow-hidden">
                  {dailyLoading ? (
                    <div className="py-32 flex flex-col items-center justify-center gap-3">
                      <Loader2 className="size-8 animate-spin text-primary" />
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                        Loading Student Roster...
                      </p>
                    </div>
                  ) : !selectedClassId ? (
                    <div className="py-24 text-center space-y-2">
                      <BookOpen className="size-10 text-muted-foreground/30 mx-auto" />
                      <p className="text-base font-bold text-foreground">Select Classroom</p>
                      <p className="text-xs text-muted-foreground">Please select a class above to mark attendance.</p>
                    </div>
                  ) : records.length === 0 ? (
                    <div className="py-24 text-center space-y-2">
                      <Users className="size-10 text-muted-foreground/30 mx-auto" />
                      <p className="text-base font-bold text-foreground">No Enrolled Students</p>
                      <p className="text-xs text-muted-foreground">No students found in this class.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead className="bg-muted/50 border-b border-border text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                          <tr>
                            <th className="px-6 py-3.5 text-left">Student</th>
                            <th className="px-6 py-3.5 text-right">Attendance Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                          <Each
                            of={filteredRecords}
                            keyExtractor={(r) => r.user_id.toString()}
                            render={(r) => (
                              <tr key={r.user_id} className="hover:bg-muted/30 transition-colors">
                                <td className="px-6 py-3.5">
                                  <div className="flex items-center gap-3.5">
                                    <div className="size-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm shrink-0">
                                      {r.user_name.charAt(0)}
                                    </div>
                                    <div>
                                      <p className="font-bold text-foreground text-sm leading-tight">
                                        {r.user_name}
                                      </p>
                                      <p className="text-[11px] font-mono text-muted-foreground">
                                        {r.roll_no || `ID: ${r.user_id}`}
                                      </p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-3.5 text-right">
                                  <StatusPillGroup
                                    value={localRecords[r.user_id] || "present"}
                                    onChange={(v) => handleStatusChange(r.user_id, v)}
                                  />
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
            </div>
          </div>
        )}

        {/* Tab 2: Monthly Register Matrix (Calendar View) */}
        {activeTab === "monthly" && selectedClassId && (
          <AttendanceRegisterMatrix
            classId={selectedClassId}
            className={selectedClassName}
            allocationId={selectedAllocationId}
            level={level}
          />
        )}
      </div>

      {/* Bulk Import Modal */}
      {selectedClassId && (
        <AttendanceImportDialog
          open={importOpen}
          onClose={() => setImportOpen(false)}
          classId={selectedClassId}
          className={selectedClassName}
          month={date.slice(0, 7)}
          allocationId={selectedAllocationId}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["attendance-daily"] });
            queryClient.invalidateQueries({ queryKey: ["attendance-ledger"] });
          }}
        />
      )}
    </>
  );
}

function StatusPillGroup({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="inline-flex gap-1.5 p-1 bg-muted/60 rounded-2xl border border-border/80">
      {ATTENDANCE_STATUS_OPTIONS.map((o) => {
        const isActive = value === o.value;

        const activeStyles =
          o.value === "present"
            ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
            : o.value === "absent"
              ? "bg-rose-500 text-white shadow-md shadow-rose-500/30"
              : o.value === "late"
                ? "bg-amber-500 text-white shadow-md shadow-amber-500/30"
                : o.value === "leave"
                  ? "bg-blue-500 text-white shadow-md shadow-blue-500/30"
                  : "bg-purple-600 text-white shadow-md shadow-purple-600/30";

        return (
          <Button
            key={o.value}
            type="button"
            variant="ghost"
            onClick={() => onChange(o.value)}
            className={cn(
              "px-3.5 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all h-auto",
              isActive
                ? activeStyles
                : "text-muted-foreground hover:text-foreground hover:bg-background/80"
            )}
          >
            {o.label}
          </Button>
        );
      })}
    </div>
  );
}
