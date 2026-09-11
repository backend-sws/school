import { Head, Link } from "@inertiajs/react";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, StatCard } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ATTENDANCE_SUMMARY_BREADCRUMBS, ATTENDANCE_LEVEL_OPTIONS } from "@/constants/page/admin/attendance";
import {
  BarChart3,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  Users,
  AlertTriangle,
  ArrowRight,
  ClipboardCheck,
  Percent,
  CalendarCheck,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import attendanceApi, { type AttendanceLevel } from "@/lib/api/attendanceApi";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from 'react';
import { useRegisterGuide } from '@/components/GuideProvider';
import { ATTENDANCE_SUMMARY_GUIDE } from "@/constants/guides/attendance";
import { ChartDonut } from "@/components/charts/pie-chart";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCollegeSessions } from "@/hooks/useCollegeSessions";

const defaultFrom = () => {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return d.toISOString().slice(0, 10);
};
const defaultTo = () => new Date().toISOString().slice(0, 10);

type ClassOption = { id: number; name: string; session_id?: number; enrollments_count?: number; stream?: { name: string }; session?: { id?: number; name: string } };

export default function AttendanceReportsSummary() {
  useRegisterGuide(ATTENDANCE_SUMMARY_GUIDE);
  const [sessionId, setSessionId] = useState<string>("all");
  const [level, setLevel] = useState<AttendanceLevel | "all">("all");
  const [classId, setClassId] = useState<string>("all");
  const [fromDate, setFromDate] = useState(defaultFrom());
  const [toDate, setToDate] = useState(defaultTo());

  const { data: sessionsRes } = useCollegeSessions({});
  const sessions = sessionsRes?.data ?? [];

  const { data: classesRes } = useQuery({
    queryKey: ["attendance-classes"],
    queryFn: () => attendanceApi.classes({ all: true }),
  });
  const classes = ((classesRes as { data?: { data?: ClassOption[] } })?.data?.data ?? []) as ClassOption[];

  const params = useMemo(
    () => ({
      from_date: fromDate,
      to_date: toDate,
      ...(sessionId && sessionId !== "all" ? { session_id: Number(sessionId) } : {}),
      ...(classId && classId !== "all" ? { lms_class_id: Number(classId) } : {}),
      ...(level && level !== "all" ? { level: level as AttendanceLevel } : {}),
    }),
    [fromDate, toDate, sessionId, classId, level]
  );

  const { data: summaryRes, isLoading } = useQuery({
    queryKey: ["attendance-reports-summary", params],
    queryFn: () => attendanceApi.reports.summary(params),
  });
  const payload = (summaryRes as any)?.data || summaryRes || null;
  const summary = payload?.summary;
  const thresholdPercentage = payload?.threshold_percentage ?? 75;

  const classOptions = useMemo(() => {
    if (sessionId && sessionId !== "all") {
      const filtered = classes.filter((c: any) => String(c.session_id || c.session?.id) === String(sessionId));
      return filtered.map((c: any) => ({
        value: String(c.id),
        label: `${c.name}${c.stream?.name && c.stream.name !== c.name ? ` · ${c.stream.name}` : ""}`,
      }));
    }
    return classes.map((c: any) => ({
      value: String(c.id),
      label: `${c.name}${c.session?.name ? ` (${c.session.name})` : ""}${c.stream?.name && c.stream.name !== c.name ? ` · ${c.stream.name}` : ""}`,
    }));
  }, [classes, sessionId]);

  const totalRecords = summary?.total ?? 0;
  const presentRate = summary?.percentage_present ?? 0;
  const isCompliant = totalRecords > 0 ? presentRate >= thresholdPercentage : true;

  // Chart data for donut
  const statusChartData = useMemo(() => {
    if (!summary || summary.total === 0) return [];
    return [
      { name: "Present", value: summary.present, fill: "hsl(142, 71%, 45%)" },
      { name: "Absent", value: summary.absent, fill: "hsl(0, 84%, 60%)" },
      { name: "Late", value: summary.late, fill: "hsl(45, 93%, 47%)" },
      { name: "Leave", value: summary.leave, fill: "hsl(262, 83%, 58%)" },
      { name: "Holiday", value: summary.holiday, fill: "hsl(221, 83%, 53%)" },
    ].filter((item) => item.value > 0);
  }, [summary]);

  const stats = [
    {
      title: "Attendance Rate",
      value: summary ? `${presentRate}%` : "—",
      description: isCompliant ? `≥ ${thresholdPercentage}% compliant` : `Below ${thresholdPercentage}% threshold`,
      icon: <Percent />,
      trend: isCompliant ? "up" as const : "down" as const,
      trendValue: isCompliant ? "Pass" : "Alert",
      iconColor: isCompliant ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/10" : "bg-red-500/10 text-red-500 border-red-500/10",
    },
    {
      title: "Present",
      value: summary ? String(summary.present) : "—",
      description: "Marked present",
      icon: <CheckCircle2 />,
      trend: "up" as const,
      iconColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/10",
    },
    {
      title: "Absent",
      value: summary ? String(summary.absent) : "—",
      description: "Unexcused absence",
      icon: <XCircle />,
      trend: (summary?.absent ?? 0) > 0 ? "down" as const : "neutral" as const,
      iconColor: "bg-red-500/10 text-red-500 border-red-500/10",
    },
    {
      title: "Late",
      value: summary ? String(summary.late) : "—",
      description: "Tardy arrivals",
      icon: <Clock />,
      trend: "neutral" as const,
      iconColor: "bg-amber-500/10 text-amber-500 border-amber-500/10",
    },
    {
      title: "Leave / Excused",
      value: summary ? String(summary.leave) : "—",
      description: "Approved leaves",
      icon: <FileText />,
      trend: "neutral" as const,
      iconColor: "bg-purple-500/10 text-purple-500 border-purple-500/10",
    },
    {
      title: "Total Records",
      value: summary ? String(summary.total) : "—",
      description: "Total logs evaluated",
      icon: <Users />,
      trend: "neutral" as const,
      iconColor: "bg-blue-500/10 text-blue-500 border-blue-500/10",
    },
  ];

  return (
    <>
      <Head title="Attendance Analytics & Compliance" />
      <MainPageHeader
        breadcrumbs={ATTENDANCE_SUMMARY_BREADCRUMBS}
        icon={BarChart3}
        title="Analytics & Compliance"
        subtitle="Monitor student attendance trends, eligibility percentages and regulatory thresholds"
      />

      <div className="max-w-7xl mx-auto space-y-6 font-display">

        {/* ─── Filters Bar Card ─── */}
        <Card className="rounded-2xl border border-sidebar-border/60 bg-card p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 flex-1">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Session Filter</Label>
                <Select value={sessionId} onValueChange={(v) => { setSessionId(v); setClassId("all"); }}>
                  <SelectTrigger className="h-10 rounded-xl border-border bg-background font-medium">
                    <SelectValue placeholder="All Sessions" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">All Sessions</SelectItem>
                    {sessions.map((s: any) => (
                      <SelectItem key={s.id} value={String(s.id)}>
                        {s.name}{s.is_current ? " (Current)" : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="size-3.5" /> From Date
                </Label>
                <input
                  type="date"
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium focus-visible:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="size-3.5" /> To Date
                </Label>
                <input
                  type="date"
                  className="flex h-10 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-medium focus-visible:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Class Filter</Label>
                <Select value={classId} onValueChange={setClassId}>
                  <SelectTrigger className="h-10 rounded-xl border-border bg-background font-medium">
                    <SelectValue placeholder="All classes" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">All classes</SelectItem>
                    {classOptions.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tracking Level</Label>
                <Select value={level} onValueChange={(v) => setLevel(v as AttendanceLevel | "all")}>
                  <SelectTrigger className="h-10 rounded-xl border-border bg-background font-medium">
                    <SelectValue placeholder="Both Levels" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="all">Both (Class & Subject)</SelectItem>
                    {ATTENDANCE_LEVEL_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-2">
              <Button asChild variant="outline" className="h-10 rounded-xl font-semibold border-border">
                <Link href="/attendance">
                  <CalendarCheck className="size-4 mr-2" />
                  Attendance Center
                </Link>
              </Button>
            </div>
          </div>
        </Card>

        {/* ─── Loading Skeleton ─── */}
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-28 rounded-2xl bg-muted/40" />
            ))}
          </div>
        )}

        {/* ─── Loaded Metrics ─── */}
        {!isLoading && summary && (
          <>
            {/* 6 Key Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {stats.map((stat, idx) => (
                <StatCard
                  key={stat.title}
                  {...stat}
                  delay={idx * 0.06}
                  variant="metrics"
                  className="border-sidebar-border/50 bg-card hover:border-primary/40 transition-all shadow-sm"
                />
              ))}
            </div>

            {/* Threshold Compliance Banner */}
            {thresholdPercentage != null && summary.total > 0 && (
              <div className={cn(
                "rounded-2xl p-4 flex items-center justify-between gap-4 border shadow-sm",
                isCompliant
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-950 dark:text-emerald-200"
                  : "bg-amber-500/10 border-amber-500/20 text-amber-950 dark:text-amber-200"
              )}>
                <div className="flex items-center gap-3">
                  {isCompliant ? (
                    <div className="size-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0">
                      <ShieldCheck className="size-5" />
                    </div>
                  ) : (
                    <div className="size-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-600 shrink-0">
                      <AlertTriangle className="size-5" />
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-bold tracking-tight">
                      {isCompliant
                        ? `Compliance Standard Met (${presentRate}% ≥ ${thresholdPercentage}%)`
                        : `Attendance Below ${thresholdPercentage}% Regulatory Threshold (${presentRate}%)`}
                    </h4>
                    <p className="text-xs opacity-80 font-medium">
                      {isCompliant
                        ? `The average student presence meets the institution minimum requirements for academic eligibility.`
                        : `Current attendance average is under the required ${thresholdPercentage}% cutoff. Review under-attended classes to maintain exam eligibility.`}
                    </p>
                  </div>
                </div>

                <Button asChild size="sm" variant={isCompliant ? "default" : "destructive"} className="rounded-xl shrink-0 font-semibold">
                  <Link href="/attendance">
                    <ClipboardCheck className="size-3.5 mr-1.5" />
                    Mark Today
                  </Link>
                </Button>
              </div>
            )}

            {/* ─── Visual Analysis Row ─── */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Status Donut Distribution */}
              <div className="lg:col-span-5">
                <ChartDonut
                  chartData={statusChartData}
                  title="Status Distribution"
                  description={`Breakdown from ${fromDate} to ${toDate}`}
                  centerLabel="Evaluated"
                  centerValue={String(summary.total)}
                  className="border-sidebar-border/50 shadow-sm"
                />
              </div>

              {/* Progress and Compliance Benchmark */}
              <div className="lg:col-span-7">
                <Card className="h-full border-sidebar-border/50 bg-card shadow-sm p-6 flex flex-col justify-between space-y-6">
                  <div>
                    <CardTitle className="text-base font-black tracking-tight">Status Breakdown & Threshold</CardTitle>
                    <CardDescription className="text-xs mt-1">Detailed evaluation across all filtered records</CardDescription>
                  </div>

                  <div className="space-y-4">
                    {/* Present Progress */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="flex items-center gap-1.5 text-emerald-600">
                          <CheckCircle2 className="size-3.5" /> Present ({summary.present})
                        </span>
                        <span>{summary.total > 0 ? ((summary.present / summary.total) * 100).toFixed(1) : 0}%</span>
                      </div>
                      <div className="h-2.5 bg-muted/40 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${summary.total > 0 ? (summary.present / summary.total) * 100 : 0}%` }}
                          transition={{ duration: 1 }}
                          className="h-full bg-emerald-500 rounded-full"
                        />
                      </div>
                    </div>

                    {/* Absent Progress */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="flex items-center gap-1.5 text-red-600">
                          <XCircle className="size-3.5" /> Absent ({summary.absent})
                        </span>
                        <span>{summary.total > 0 ? ((summary.absent / summary.total) * 100).toFixed(1) : 0}%</span>
                      </div>
                      <div className="h-2.5 bg-muted/40 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${summary.total > 0 ? (summary.absent / summary.total) * 100 : 0}%` }}
                          transition={{ duration: 1 }}
                          className="h-full bg-red-500 rounded-full"
                        />
                      </div>
                    </div>

                    {/* Late Progress */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="flex items-center gap-1.5 text-amber-600">
                          <Clock className="size-3.5" /> Late ({summary.late})
                        </span>
                        <span>{summary.total > 0 ? ((summary.late / summary.total) * 100).toFixed(1) : 0}%</span>
                      </div>
                      <div className="h-2.5 bg-muted/40 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${summary.total > 0 ? (summary.late / summary.total) * 100 : 0}%` }}
                          transition={{ duration: 1 }}
                          className="h-full bg-amber-500 rounded-full"
                        />
                      </div>
                    </div>

                    {/* Leave Progress */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="flex items-center gap-1.5 text-purple-600">
                          <FileText className="size-3.5" /> Leave / Excused ({summary.leave})
                        </span>
                        <span>{summary.total > 0 ? ((summary.leave / summary.total) * 100).toFixed(1) : 0}%</span>
                      </div>
                      <div className="h-2.5 bg-muted/40 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${summary.total > 0 ? (summary.leave / summary.total) * 100 : 0}%` }}
                          transition={{ duration: 1 }}
                          className="h-full bg-purple-500 rounded-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Threshold Gauge Indicator */}
                  <div className="p-4 rounded-xl bg-sidebar-accent/30 border border-sidebar-border/40 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Threshold Benchmark</span>
                      <p className="text-sm font-black">{thresholdPercentage}% Institutional Target</p>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Current Standing</span>
                      <p className={cn("text-lg font-black", isCompliant ? "text-emerald-500" : "text-amber-500")}>
                        {presentRate}% {isCompliant ? "✓" : "⚠"}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* ─── Detailed Breakdown Table ─── */}
            <Card className="border-sidebar-border/50 bg-card shadow-sm overflow-hidden">
              <CardHeader className="border-b border-sidebar-border/30 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base font-black tracking-tight">Category Breakdown Table</CardTitle>
                    <CardDescription className="text-xs">Summary metrics table by status type</CardDescription>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-primary/10 text-primary">
                    {fromDate} to {toDate}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-sidebar-border/30 bg-muted/20 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        <th className="p-3.5 text-left">Attendance Category</th>
                        <th className="p-3.5 text-center">Total Entries</th>
                        <th className="p-3.5 text-center">Share of Total</th>
                        <th className="p-3.5 text-right">Academic Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-sidebar-border/30">
                      <tr className="hover:bg-muted/10 transition-colors">
                        <td className="p-3.5 font-bold flex items-center gap-2">
                          <div className="size-3 rounded-full bg-emerald-500" />
                          <span>Present</span>
                        </td>
                        <td className="p-3.5 text-center font-bold text-foreground">{summary.present}</td>
                        <td className="p-3.5 text-center font-medium text-muted-foreground">
                          {summary.total > 0 ? ((summary.present / summary.total) * 100).toFixed(1) : 0}%
                        </td>
                        <td className="p-3.5 text-right">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-500/10 text-emerald-600">
                            Valid Attendance
                          </span>
                        </td>
                      </tr>

                      <tr className="hover:bg-muted/10 transition-colors">
                        <td className="p-3.5 font-bold flex items-center gap-2">
                          <div className="size-3 rounded-full bg-red-500" />
                          <span>Absent</span>
                        </td>
                        <td className="p-3.5 text-center font-bold text-foreground">{summary.absent}</td>
                        <td className="p-3.5 text-center font-medium text-muted-foreground">
                          {summary.total > 0 ? ((summary.absent / summary.total) * 100).toFixed(1) : 0}%
                        </td>
                        <td className="p-3.5 text-right">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-red-500/10 text-red-600">
                            Unexcused
                          </span>
                        </td>
                      </tr>

                      <tr className="hover:bg-muted/10 transition-colors">
                        <td className="p-3.5 font-bold flex items-center gap-2">
                          <div className="size-3 rounded-full bg-amber-500" />
                          <span>Late</span>
                        </td>
                        <td className="p-3.5 text-center font-bold text-foreground">{summary.late}</td>
                        <td className="p-3.5 text-center font-medium text-muted-foreground">
                          {summary.total > 0 ? ((summary.late / summary.total) * 100).toFixed(1) : 0}%
                        </td>
                        <td className="p-3.5 text-right">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-amber-500/10 text-amber-600">
                            Conditional
                          </span>
                        </td>
                      </tr>

                      <tr className="hover:bg-muted/10 transition-colors">
                        <td className="p-3.5 font-bold flex items-center gap-2">
                          <div className="size-3 rounded-full bg-purple-500" />
                          <span>Leave</span>
                        </td>
                        <td className="p-3.5 text-center font-bold text-foreground">{summary.leave}</td>
                        <td className="p-3.5 text-center font-medium text-muted-foreground">
                          {summary.total > 0 ? ((summary.leave / summary.total) * 100).toFixed(1) : 0}%
                        </td>
                        <td className="p-3.5 text-right">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-purple-500/10 text-purple-600">
                            Approved
                          </span>
                        </td>
                      </tr>

                      <tr className="hover:bg-muted/10 transition-colors">
                        <td className="p-3.5 font-bold flex items-center gap-2">
                          <div className="size-3 rounded-full bg-blue-500" />
                          <span>Holiday / School Off</span>
                        </td>
                        <td className="p-3.5 text-center font-bold text-foreground">{summary.holiday}</td>
                        <td className="p-3.5 text-center font-medium text-muted-foreground">
                          {summary.total > 0 ? ((summary.holiday / summary.total) * 100).toFixed(1) : 0}%
                        </td>
                        <td className="p-3.5 text-right">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold bg-blue-500/10 text-blue-600">
                            Non-Instructional
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* ─── Empty State ─── */}
        {!isLoading && (!summary || summary.total === 0) && (
          <Card className="rounded-2xl border border-dashed border-sidebar-border p-12 text-center bg-card">
            <div className="max-w-md mx-auto space-y-4">
              <div className="size-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mx-auto">
                <BarChart3 className="size-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold">No Attendance Records Found</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  There are no attendance records in the selected date range ({fromDate} to {toDate}). Try selecting a different date range or marking attendance.
                </p>
              </div>
              <div className="pt-2 flex justify-center gap-3">
                <Button asChild className="rounded-xl font-semibold">
                  <Link href="/attendance">
                    <ClipboardCheck className="size-4 mr-2" />
                    Go to Attendance Center
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