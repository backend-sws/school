import { Head } from "@inertiajs/react";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ATTENDANCE_SUMMARY_BREADCRUMBS, ATTENDANCE_LEVEL_OPTIONS } from "@/constants/page/admin/attendance";
import { BarChart3 } from "lucide-react";
import attendanceApi, { type AttendanceLevel } from "@/lib/api/attendanceApi";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from 'react';
import { useRegisterGuide } from '@/components/GuideProvider';
import { ATTENDANCE_SUMMARY_GUIDE } from "@/constants/guides/attendance";
import Each from '@/components/Each';

const defaultFrom = () => {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return d.toISOString().slice(0, 10);
};
const defaultTo = () => new Date().toISOString().slice(0, 10);

type ClassOption = { id: number; name: string; stream?: { name: string }; session?: { name: string } };

export default function AttendanceReportsSummary() {
useRegisterGuide(ATTENDANCE_SUMMARY_GUIDE);
  const [level, setLevel] = useState<AttendanceLevel | "">("");
  const [classId, setClassId] = useState<string>("");
  const [fromDate, setFromDate] = useState(defaultFrom());
  const [toDate, setToDate] = useState(defaultTo());

  const { data: classesRes } = useQuery({
    queryKey: ["attendance-classes"],
    queryFn: () => attendanceApi.classes({ all: true }),
  });
  const classes = ((classesRes as { data?: { data?: ClassOption[] } })?.data?.data ?? []) as ClassOption[];

  const params = useMemo(
    () => ({
      from_date: fromDate,
      to_date: toDate,
      ...(classId ? { lms_class_id: Number(classId) } : {}),
      ...(level ? { level } : {}),
    }),
    [fromDate, toDate, classId, level]
  );

  const { data: summaryRes, isLoading } = useQuery({
    queryKey: ["attendance-reports-summary", params],
    queryFn: () => attendanceApi.reports.summary(params),
  });
  const payload = summaryRes ?? null;
  const summary = payload?.summary;
  const thresholdPercentage = payload?.threshold_percentage ?? 75;

  const classOptions = useMemo(
    () =>
      classes.map((c) => ({
        value: String(c.id),
        label: `${c.name}${c.stream?.name ? ` · ${c.stream.name}` : ""}`,
      })),
    [classes]
  );

  return (
    <>
      <Head title="Attendance Summary" />
      <MainPageHeader
        id="attendance-summary-header"
        breadcrumbs={ATTENDANCE_SUMMARY_BREADCRUMBS}
        icon={BarChart3}
        title="Summary & Reports"
        subtitle="Aggregated attendance counts and percentage for a date range"
      />
      <Card className="mt-4">
        <CardContent className="pt-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>From date</Label>
              <input
                type="date"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>To date</Label>
              <input
                type="date"
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Class (optional)</Label>
              <Select value={classId} onValueChange={setClassId}>
                <SelectTrigger>
                  <SelectValue placeholder="All classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All classes</SelectItem>
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
            <div className="space-y-2">
              <Label>Level (optional)</Label>
              <Select value={level} onValueChange={(v) => setLevel(v as AttendanceLevel | "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Both" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Both</SelectItem>
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
          </div>

          {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
          {!isLoading && summary && (
            <div className="rounded-md border p-4 space-y-2" id="summary-table">
              <p className="font-medium">Summary ({fromDate} to {toDate})</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Present: {summary.present}</li>
                <li>Absent: {summary.absent}</li>
                <li>Late: {summary.late}</li>
                <li>Leave: {summary.leave}</li>
                <li>Holiday: {summary.holiday}</li>
                <li>Total: {summary.total}</li>
                <li>Percentage present: {summary.percentage_present}%</li>
              </ul>
              {thresholdPercentage != null && summary.percentage_present < thresholdPercentage && summary.total > 0 && (
                <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
                  Below {thresholdPercentage}% threshold — may affect exam eligibility (check institution policy).
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}