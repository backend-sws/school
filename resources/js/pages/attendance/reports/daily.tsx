import { Head } from "@inertiajs/react";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { CalendarCheck } from "lucide-react";
import attendanceApi, { type AttendanceLevel, type DailyResponse, type AttendanceRecordRow } from "@/lib/api/attendanceApi";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from 'react';
import { useRegisterGuide } from '@/components/GuideProvider';
import { ATTENDANCE_DAILY_GUIDE } from "@/constants/guides/attendance";
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
  const payload = reportRes ?? null;
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

  return (
    <>
      <Head title="Daily Register" />
      <MainPageHeader
        id="attendance-daily-header"
        breadcrumbs={ATTENDANCE_DAILY_BREADCRUMBS}
        icon={CalendarCheck}
        title="Daily Register"
        subtitle="View attendance for a class and date"
      />
      <Card className="mt-4">
        <CardContent className="pt-6 space-y-4" id="daily-filter-bar">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Level</Label>
              <Select value={level} onValueChange={(v) => setLevel(v as AttendanceLevel)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <Each
                      of={ATTENDANCE_LEVEL_OPTIONS}
                      keyExtractor={(o) => String(o.value)}
                      render={(o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  )}
                  />
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Class</Label>
              <Select value={classId} onValueChange={(v) => { setClassId(v); setAllocationId(""); }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <Each
                      of={classOptions}
                      keyExtractor={(o) => String(o.value)}
                      render={(o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  )}
                  />
                </SelectContent>
              </Select>
            </div>
            {level === "subject" && (
              <div className="space-y-2">
                <Label>Subject</Label>
                <Select value={allocationId} onValueChange={setAllocationId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <Each
                        of={allocationOptions}
                        keyExtractor={(o) => String(o.value)}
                        render={(o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    )}
                    />
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="space-y-2">
              <Label>Date</Label>
              <input
                type="date"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          </div>

          {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
          {!isLoading && records.length > 0 && (
            <>
              {summary && (
                <p className="text-sm text-muted-foreground">
                  Present: {summary.present} · Absent: {summary.absent} · Late: {summary.late} · Leave: {summary.leave} · Holiday: {summary.holiday} · Total: {summary.total}
                </p>
              )}
              <div className="rounded-md border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="p-2 text-left font-medium">#</th>
                      <th className="p-2 text-left font-medium">Student</th>
                      <th className="p-2 text-left font-medium">Status</th>
                      <th className="p-2 text-left font-medium">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    <Each
                        of={records}
                        keyExtractor={(rAttendanceRecordRow) => String(r.user_id)}
                        render={(r: AttendanceRecordRow, i: number) => (
                      <tr key={r.user_id} className="border-b">
                        <td className="p-2">{i + 1}</td>
                        <td className="p-2">{r.user_name}</td>
                        <td className="p-2">{ATTENDANCE_STATUS_OPTIONS.find((o) => o.value === r.status)?.label ?? r.status}</td>
                        <td className="p-2">{r.remarks ?? "—"}</td>
                      </tr>
                    )}
                    />
                  </tbody>
                </table>
              </div>
            </>
          )}
          {!isLoading && classId && date && (level !== "subject" || allocationId) && records.length === 0 && (
            <p className="text-sm text-muted-foreground">No students or no data for this selection.</p>
          )}
        </CardContent>
      </Card>
    </>
  );
}
