import { Head, Link } from "@inertiajs/react";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, StatCard } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ATTENDANCE_DAILY_BREADCRUMBS,
  ATTENDANCE_STATUS_OPTIONS,
  ATTENDANCE_LEVEL_OPTIONS,
} from "@/constants/page/admin/attendance";
import {
  CalendarCheck,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Users,
  ClipboardList,
  ArrowRight,
  BookOpen,
} from "lucide-react";
import attendanceApi, { type AttendanceLevel, type DailyResponse, type AttendanceRecordRow } from "@/lib/api/attendanceApi";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from 'react';
import { useRegisterGuide } from '@/components/GuideProvider';
import { ATTENDANCE_DAILY_GUIDE } from "@/constants/guides/attendance";
import { cn } from "@/lib/utils";
import Each from '@/components/Each';

const defaultDate = () => new Date().toISOString().slice(0, 10);

function getInitialClassIdFromUrl(): string {
  if (typeof window === "undefined") return "";
  return new URLSearchParams(window.location.search).get("classId") ?? "";
}

type ClassOption = { id: number; name: string; enrollments_count?: number; stream?: { name: string }; session?: { name: string } };
type AllocationOption = { id: number; subject: { id: number; name: string; code?: string } | null };

export default function AttendanceReportsDaily() {
  useRegisterGuide(ATTENDANCE_DAILY_GUIDE);
  const [level, setLevel] = useState<AttendanceLevel>("class");
  const [classId, setClassId] = useState<string>(getInitialClassIdFromUrl);
  const [date, setDate] = useState(defaultDate());
  const [allocationId, setAllocationId] = useState<string>("");

  const { data: classesRes } = useQuery({
    queryKey: ["attendance-classes"],
    queryFn: () => attendanceApi.classes({ all: true }),
  });
  const classes = ((classesRes as { data?: { data?: ClassOption[] } })?.data?.data ?? []) as ClassOption[];

  const { data: allocationsData } = useQuery({
    queryKey: ["attendance-allocations", classId],
    queryFn: () => attendanceApi.allocationsForClass(Number(classId)),
    enabled: !!classId && level === "subject",
  });
  const allocations = ((allocationsData as { data?: AllocationOption[] })?.data ?? []) as AllocationOption[];

  const params = useMemo(() => {
    if (!classId || !date) return null;
    return {
      lms_class_id: Number(classId),
      date,
      level,
      ...(level === "subject" && allocationId ? { class_subject_allocation_id: Number(allocationId) } : {}),
    };
  }, [classId, date, level, allocationId]);

  const { data: reportRes, isLoading } = useQuery({
    queryKey: ["attendance-reports-daily", params],
    queryFn: () => attendanceApi.reports.daily(params!),
    enabled: !!params && (level !== "subject" || !!allocationId),
  });
  const payload = (reportRes as any)?.data || reportRes || null;
  const records = (payload?.records ?? []) as AttendanceRecordRow[];
  const summary = payload?.summary;

  const classOptions = useMemo(
    () =>
      classes.map((c) => ({
        value: String(c.id),
        label: `${c.name}${c.stream?.name ? ` · ${c.stream.name}` : ""}`,
      })),
    [classes]
  );
  const allocationOptions = useMemo(
    () =>
      allocations.map((a) => ({
        value: String(a.id),
        label: a.subject?.name ?? `Allocation ${a.id}`,
      })),
    [allocations]
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "present":
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-emerald-500/10 text-emerald-600"><CheckCircle2 className="size-3" /> Present</span>;
      case "absent":
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-red-500/10 text-red-600"><XCircle className="size-3" /> Absent</span>;
      case "late":
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-600"><Clock className="size-3" /> Late</span>;
      case "leave":
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-purple-500/10 text-purple-600"><FileText className="size-3" /> Leave</span>;
      case "holiday":
        return <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-500/10 text-blue-600"><Calendar className="size-3" /> Holiday</span>;
      default:
        return <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-muted text-foreground">{status}</span>;
    }
  };

  return (
    <>
      <Head title="Daily Attendance Register" />
      <MainPageHeader
        id="attendance-daily-header"
        breadcrumbs={ATTENDANCE_DAILY_BREADCRUMBS}
        icon={CalendarCheck}
        title="Daily Register"
        subtitle="View and verify daily attendance logs across classes and subjects"
      />

      <div className="max-w-7xl mx-auto space-y-6 font-display">
        {/* ─── Filters Card ─── */}
        <Card className="rounded-2xl border border-sidebar-border/60 bg-card p-6 shadow-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Level</Label>
              <Select value={level} onValueChange={(v) => setLevel(v as AttendanceLevel)}>
                <SelectTrigger className="h-10 rounded-xl border-border bg-background font-medium">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {ATTENDANCE_LEVEL_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Class</Label>
              <Select value={classId} onValueChange={(v) => { setClassId(v); setAllocationId(""); }}>
                <SelectTrigger className="h-10 rounded-xl border-border bg-background font-medium">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {classOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {level === "subject" && (
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Subject</Label>
                <Select value={allocationId} onValueChange={setAllocationId}>
                  <SelectTrigger className="h-10 rounded-xl border-border bg-background font-medium">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {allocationOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="size-3.5" /> Date
              </Label>
              <input
                type="date"
                className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium focus-visible:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>
        </Card>

        {/* ─── Summary Quick Bar ─── */}
        {summary && summary.total > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <Card variant="metrics" className="p-4 border-sidebar-border/50 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Present</p>
              <p className="text-2xl font-black text-emerald-500">{summary.present}</p>
            </Card>
            <Card variant="metrics" className="p-4 border-sidebar-border/50 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Absent</p>
              <p className="text-2xl font-black text-red-500">{summary.absent}</p>
            </Card>
            <Card variant="metrics" className="p-4 border-sidebar-border/50 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Late</p>
              <p className="text-2xl font-black text-amber-500">{summary.late}</p>
            </Card>
            <Card variant="metrics" className="p-4 border-sidebar-border/50 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Leave</p>
              <p className="text-2xl font-black text-purple-500">{summary.leave}</p>
            </Card>
            <Card variant="metrics" className="p-4 border-sidebar-border/50 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Holiday</p>
              <p className="text-2xl font-black text-blue-500">{summary.holiday}</p>
            </Card>
            <Card variant="metrics" className="p-4 border-sidebar-border/50 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total</p>
              <p className="text-2xl font-black">{summary.total}</p>
            </Card>
          </div>
        )}

        {/* ─── Records Table ─── */}
        {!isLoading && records.length > 0 && (
          <Card className="border-sidebar-border/50 bg-card shadow-sm overflow-hidden">
            <CardHeader className="border-b border-sidebar-border/30 pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-black tracking-tight">Student Register</CardTitle>
                  <CardDescription className="text-xs">Individual attendance records for {date}</CardDescription>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-primary/10 text-primary">
                  {records.length} Students
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-sidebar-border/30 bg-muted/20 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      <th className="p-3.5 text-left w-16">#</th>
                      <th className="p-3.5 text-left">Student Name</th>
                      <th className="p-3.5 text-center">Status</th>
                      <th className="p-3.5 text-left">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-sidebar-border/30">
                    <Each
                      of={records}
                      render={(r: AttendanceRecordRow, i: number) => (
                        <tr key={r.user_id} className="hover:bg-muted/10 transition-colors">
                          <td className="p-3.5 font-bold text-muted-foreground/60">{i + 1}</td>
                          <td className="p-3.5 font-bold text-foreground">{r.user_name}</td>
                          <td className="p-3.5 text-center">{getStatusBadge(r.status)}</td>
                          <td className="p-3.5 text-muted-foreground text-xs">{r.remarks || "—"}</td>
                        </tr>
                      )}
                    />
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* ─── Empty State ─── */}
        {!isLoading && classId && date && (level !== "subject" || allocationId) && records.length === 0 && (
          <Card className="rounded-2xl border border-dashed border-sidebar-border p-12 text-center bg-card">
            <div className="max-w-md mx-auto space-y-4">
              <div className="size-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mx-auto">
                <Users className="size-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold">No Records for this Selection</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  No attendance records exist for the selected class and date ({date}).
                </p>
              </div>
              <div className="pt-2 flex justify-center gap-3">
                <Button asChild className="rounded-xl font-semibold">
                  <Link href="/attendance">
                    <CalendarCheck className="size-4 mr-2" />
                    Open Attendance Sheet
                  </Link>
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </>
  );
}
