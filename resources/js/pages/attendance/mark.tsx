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
} from "lucide-react";
import Each from "@/components/Each";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import attendanceApi, { type AttendanceLevel, type AttendanceRecordRow } from "@/lib/api/attendanceApi";
import { ATTENDANCE_STATUS_OPTIONS } from "@/constants/page/admin/attendance";
import { useMemo, useState, useEffect } from "react";
import { cn } from "@/lib/utils";

const defaultDate = () => new Date().toISOString().slice(0, 10);

function getInitialClassIdFromUrl(): number | undefined {
  if (typeof window === "undefined") return undefined;
  const val = new URLSearchParams(window.location.search).get("classId");
  return val ? parseInt(val) : undefined;
}

export default function AttendanceMark() {
  const queryClient = useQueryClient();
  const [selectedClassId, setSelectedClassId] = useState<number | undefined>(getInitialClassIdFromUrl());
  const [selectedAllocationId, setSelectedAllocationId] = useState<number | undefined>(undefined);
  const [date, setDate] = useState(defaultDate());
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch Classes
  const { data: classesRes, isLoading: classesLoading } = useQuery({
    queryKey: ["attendance-classes"],
    queryFn: () => attendanceApi.classes({ all: true }),
  });

  const classes = useMemo(() => {
    const raw = (classesRes as any)?.data?.data || (classesRes as any)?.data || classesRes;
    if (Array.isArray(raw)) return raw as { id: number; name: string }[];
    return [];
  }, [classesRes]);

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

  // API returns { success, data: { records, summary, ... } }; axios interceptor returns response.data
  const records = useMemo(
    () => (dailyRes as { data?: { records?: AttendanceRecordRow[] } } | undefined)?.data?.records ?? [],
    [dailyRes]
  ) as AttendanceRecordRow[];
  const [localRecords, setLocalRecords] = useState<Record<number, string>>({});

  // Sync Records
  useEffect(() => {
    if (records.length > 0) {
      const initial: Record<number, string> = {};
      records.forEach((r) => {
        initial[r.user_id] = r.status || "present";
      });
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalRecords(initial);
    } else {

      setLocalRecords((prev) => (Object.keys(prev).length > 0 ? {} : prev));
    }
  }, [records]);

  const filteredRecords = useMemo(() => {
    if (!searchQuery) return records;
    return records.filter(r =>
      r.user_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [records, searchQuery]);

  const stats = useMemo(() => {
    const total = records.length;
    const present = records.filter(r => (localRecords[r.user_id] || "present") === "present").length;
    const absent = total - present;
    return { total, present, absent };
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

  return (
    <>
      <Head title="Mark Attendance" />

      <div className="max-w-[1200px] mx-auto space-y-8">
        {/* Immersive Fancy Header */}
        <div className="relative overflow-hidden rounded-[40px] bg-gradient-to-br from-amber-600/10 via-background to-background p-10 border border-white/10 shadow-2xl">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="size-16 rounded-[28px] bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20 ring-4 ring-amber-500/10 transition-transform hover:scale-105 duration-500">
                  <ClipboardCheck className="size-9 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl font-black tracking-tighter text-foreground drop-shadow-sm">Mark Register</h2>
                  <div className="flex items-center gap-6 text-[11px] font-black text-muted-foreground/50 uppercase tracking-[0.2em] mt-1">
                    <span className="flex items-center gap-2 px-3 py-1 bg-green-500/5 text-green-600 rounded-full border border-green-500/10">
                      <div className="size-1.5 rounded-full bg-green-500 animate-pulse" />
                      Active Session
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="size-4" />
                      {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Stats in Header */}
            <div className="flex gap-6 p-3 bg-white/5 border border-white/10 rounded-[28px] backdrop-blur-md shadow-inner">
              <StatColumn label="TOTAL ENROLLMENT" value={stats.total} color="muted" />
              <Separator orientation="vertical" className="h-12 bg-white/10" />
              <StatColumn label="PRESENT" value={stats.present} color="green" />
              <Separator orientation="vertical" className="h-12 bg-white/10" />
              <StatColumn label="ABSENT" value={stats.absent} color="red" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar: Controls */}
          <div className="lg:col-span-1 space-y-8">
            <div className="p-8 rounded-[32px] bg-background/40 backdrop-blur-xl border border-white/5 shadow-xl space-y-8">
              <ConfigField label="CLASSROOM">
                <Select
                  value={selectedClassId?.toString()}
                  onValueChange={(v) => {
                    setSelectedClassId(parseInt(v));
                    setSelectedAllocationId(undefined);
                  }}
                >
                  <SelectTrigger className="h-14 rounded-2xl border-white/5 bg-muted/20 backdrop-blur-sm font-black text-foreground shadow-sm hover:bg-muted/30 transition-all">
                    <SelectValue placeholder="Choose Class" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-border/60 backdrop-blur-xl">
                    {classesLoading ? (
                      <LoadingIndicator label="Classes" />
                    ) : (
                      classes.map((c: { id: number; name: string }) => (
                        <SelectItem key={c.id} value={c.id.toString()} className="font-bold py-3">
                          {c.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </ConfigField>

              <ConfigField label="SUBJECT / SESSION">
                <Select
                  value={selectedAllocationId?.toString() || "class"}
                  onValueChange={(v) => setSelectedAllocationId(v === "class" ? undefined : parseInt(v))}
                  disabled={!selectedClassId}
                >
                  <SelectTrigger className="h-14 rounded-2xl border-white/5 bg-muted/20 backdrop-blur-sm font-black text-foreground shadow-sm hover:bg-muted/30 transition-all">
                    <SelectValue placeholder="Class Level" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-border/60 backdrop-blur-xl">
                    <SelectItem value="class" className="font-black text-amber-600 py-3">GENERAL ATTENDANCE</SelectItem>
                    <Separator className="my-2 bg-border/40" />
                    {allocationsLoading ? (
                      <LoadingIndicator label="Subjects" />
                    ) : (
                      allocations.map((a: { id: number; subject: { name: string } | null }) => (
                        <SelectItem key={a.id} value={a.id.toString()} className="font-bold py-3">
                          {a.subject?.name || "Unknown"}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </ConfigField>

              <ConfigField label="DATE">
                <div className="relative">
                  <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-amber-600/60 pointer-events-none" />
                  <input
                    type="date"
                    className="flex h-14 w-full rounded-2xl border-white/5 bg-muted/20 backdrop-blur-sm pl-12 pr-4 py-2 text-base font-black text-foreground ring-offset-background placeholder:text-muted-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/20 transition-all outline-none"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </ConfigField>

              <Separator className="bg-white/5" />

              <div className="space-y-4 pt-2">
                <p className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground/30 ml-1">Quick Actions</p>
                <div className="grid grid-cols-1 gap-3">
                  <QuickActionButton
                    onClick={() => markAllAs("present")}
                    icon={UserCheck}
                    label="BATCH PRESENT"
                    color="green"
                    disabled={!records.length}
                  />
                  <QuickActionButton
                    onClick={() => markAllAs("absent")}
                    icon={XCircle}
                    label="BATCH ABSENT"
                    color="red"
                    disabled={!records.length}
                  />
                </div>
              </div>
            </div>

            <Button
              className="w-full h-20 text-xl font-black rounded-[32px] shadow-2xl shadow-amber-500/20 bg-amber-500 hover:bg-amber-600 text-white transition-all hover:scale-[1.02] active:scale-[0.98] group"
              onClick={handleSubmit}
              disabled={isPending || !records.length}
            >
              {isPending ? (
                <div className="flex items-center">
                  <Loader2 className="size-7 animate-spin mr-3" />
                  COMMITTING...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-3">
                  FINALIZE RECORD
                  <ArrowRight className="size-7 group-hover:translate-x-1.5 transition-transform" />
                </div>
              )}
            </Button>
          </div>

          {/* Right Side: Student List */}
          <div className="lg:col-span-3 space-y-6">
            <div className="flex items-center justify-between p-4 bg-background/40 backdrop-blur-xl rounded-[28px] border border-white/5 shadow-inner">
              <div className="w-full max-w-lg relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-muted-foreground group-focus-within:text-amber-500 transition-colors pointer-events-none" />
                <Input
                  placeholder="Instant find student..."
                  className="h-12 pl-12 rounded-2xl border-none bg-muted/10 font-bold focus-visible:ring-amber-500/10 transition-all placeholder:text-muted-foreground/30"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="hidden md:flex items-center gap-3 px-6">
                <div className="size-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
                  <Users className="size-5" />
                </div>
                <p className="text-[10px] font-black text-muted-foreground/60 tracking-widest uppercase">
                  Register Index
                </p>
              </div>
            </div>

            <div className="relative rounded-[40px] border border-border/40 bg-background/50 backdrop-blur-md shadow-2xl overflow-hidden min-h-[600px]">
              {dailyLoading ? (
                <ListLoadingView />
              ) : !selectedClassId ? (
                <ListEmptyView
                  icon={BookOpen}
                  title="Awaiting Instruction"
                  description="Select a classroom from the sidebar to initialize the daily attendance register."
                />
              ) : records.length === 0 ? (
                <ListEmptyView
                  icon={Users}
                  title="Empty Classroom"
                  description="No student enrollments found for this specific class or subject session."
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead className="sticky top-0 bg-background/80 backdrop-blur-2xl border-b border-border/40 z-10 shadow-sm">
                      <tr>
                        <th className="p-8 text-left font-black text-muted-foreground/50 uppercase tracking-widest text-[11px]">Identity</th>
                        <th className="p-8 text-right font-black text-muted-foreground/50 uppercase tracking-widest text-[11px]">Record Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                      <Each
                        of={filteredRecords}
                        keyExtractor={(r) => r.user_id.toString()}
                        render={(r) => (
                          <tr key={r.user_id} className="group hover:bg-amber-500/[0.03] transition-all duration-300">
                            <td className="p-8">
                              <div className="flex items-center gap-5">
                                <div className="size-14 rounded-[22px] bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/10 flex items-center justify-center text-amber-600 font-black text-xl group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-500 shadow-sm">
                                  {r.user_name.charAt(0)}
                                </div>
                                <div className="space-y-1">
                                  <p className="text-xl font-black tracking-tight text-foreground group-hover:text-amber-600 transition-colors duration-300">{r.user_name}</p>
                                  <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em]">Reference: REG-{r.user_id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="p-8 text-right">
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
                  {filteredRecords.length === 0 && searchQuery && (
                    <div className="py-32 text-center group">
                      <div className="size-20 bg-muted/10 rounded-[30px] flex items-center justify-center text-muted-foreground/20 mx-auto mb-6 group-hover:scale-110 transition-transform duration-500 border border-white/5">
                        <Search className="size-10" />
                      </div>
                      <p className="text-xl font-black text-muted-foreground/20 italic tracking-tight">No match found for "{searchQuery}"</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Sub-components

function StatColumn({ label, value, color }: { label: string, value: number, color: "green" | "red" | "muted" }) {
  const colorClass = color === "green" ? "text-green-500" : color === "red" ? "text-red-500" : "text-muted-foreground";
  return (
    <div className="px-8 py-2 text-center min-w-[140px]">
      <p className="text-[10px] font-black tracking-[0.2em] text-muted-foreground/40 mb-1">{label}</p>
      <p className={cn("text-3xl font-black tracking-tighter", colorClass)}>{value}</p>
    </div>
  );
}

function ConfigField({ label, children }: { label: string, children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <Label className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground/30 ml-1">{label}</Label>
      {children}
    </div>
  );
}

function QuickActionButton({ onClick, icon: Icon, label, color, disabled }: { onClick: () => void; icon: React.ElementType; label: string; color: "green" | "red"; disabled: boolean }) {
  const baseClass = "h-14 rounded-2xl px-6 text-[11px] font-black uppercase tracking-widest border transition-all duration-300";
  const colorStyles = color === "green"
    ? "bg-green-500/5 text-green-600 border-green-500/10 hover:bg-green-500 hover:text-white hover:shadow-lg hover:shadow-green-500/20"
    : "bg-red-500/5 text-red-600 border-red-500/10 hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/20";

  return (
    <Button
      type="button"
      variant="outline"
      className={cn(baseClass, colorStyles)}
      onClick={onClick}
      disabled={disabled}
    >
      <Icon className="size-4 mr-3" />
      {label}
    </Button>
  );
}

function StatusPillGroup({ value, onChange }: { value: string, onChange: (v: string) => void }) {
  return (
    <div className="flex gap-2 justify-end bg-black/10 p-1.5 rounded-2xl border border-white/5 w-fit ml-auto shadow-inner">
      {ATTENDANCE_STATUS_OPTIONS.map((o) => {
        const isActive = value === o.value;
        return (
          <Button
            key={o.value}
            variant="ghost"
            onClick={() => onChange(o.value)}
            className={cn(
              "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-500 h-auto",
              isActive
                ? o.value === "present" ? "bg-green-500 text-white shadow-[0_8px_20px_rgba(34,197,94,0.4)] scale-105 hover:bg-green-600 hover:text-white" :
                  o.value === "absent" ? "bg-red-500 text-white shadow-[0_8px_20px_rgba(239,68,68,0.4)] scale-105 hover:bg-red-600 hover:text-white" :
                    o.value === "late" ? "bg-amber-500 text-white shadow-[0_8px_20px_rgba(245,158,11,0.4)] scale-105 hover:bg-amber-600 hover:text-white" :
                      "bg-blue-500 text-white shadow-[0_8px_20px_rgba(59,130,246,0.4)] scale-105 hover:bg-blue-600 hover:text-white"
                : "text-muted-foreground/30 hover:text-muted-foreground/60 hover:bg-white/5"
            )}
          >
            {o.label}
          </Button>
        );
      })}
    </div>
  );
}

function LoadingIndicator({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-center p-8 gap-3">
      <Loader2 className="size-6 animate-spin text-amber-500" />
      <span className="text-sm font-black uppercase tracking-widest text-muted-foreground">Loading {label}...</span>
    </div>
  );
}

function ListLoadingView() {
  return (
    <div className="flex flex-col items-center justify-center py-40 gap-8 bg-background/50 backdrop-blur-xl">
      <div className="relative">
        <div className="size-24 border-[8px] border-amber-500/10 border-t-amber-500 rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <UserCheck className="size-10 text-amber-500/20" />
        </div>
      </div>
      <p className="text-sm font-black text-muted-foreground/40 uppercase tracking-[0.4em] animate-pulse">Initializing Roster Data</p>
    </div>
  );
}

function ListEmptyView({ icon: Icon, title, description }: { icon: React.ElementType; title: string; description: string }) {
  return (
    <div className="py-40 flex flex-col items-center justify-center text-center gap-8 px-16 bg-background/50 backdrop-blur-xl">
      <div className="size-32 bg-muted/20 rounded-[45px] flex items-center justify-center text-muted-foreground/10 border border-white/5 shadow-inner transition-transform duration-700 hover:rotate-12">
        <Icon className="size-16" />
      </div>
      <div className="space-y-3 max-w-md">
        <h4 className="text-3xl font-black tracking-tight text-muted-foreground/60 leading-none">{title}</h4>
        <p className="text-base text-muted-foreground/30 font-bold leading-relaxed">{description}</p>
      </div>
    </div>
  );
}
