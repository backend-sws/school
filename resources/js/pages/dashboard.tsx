import { ChartLineDefault } from "@/components/charts/line-chart";
import { ChartDonut } from "@/components/charts/pie-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, StatCard } from "@/components/ui/card";
import { type SharedData } from "@/types";
import { Head, Link, usePage } from "@inertiajs/react";
import {
  GraduationCap,
  Users,
  IndianRupee,
  LayoutGrid,
  UserPlus,
  Megaphone,
  TrendingUp,
  Clock,
  CheckCircle2,
  BookOpen,
  BarChart3,
  Activity,
  Bell,
  ArrowUpRight,
  CalendarDays,
  Building2,
  RotateCcw,
  Bus,
  Building,
  Layers,
  ChevronRight,
  ArrowRight,
  Wallet,
  Car,
  CreditCard,
  DoorOpen,
  Filter,
  Check,
} from "lucide-react";
import Each from "@/components/Each";
import { useRegisterGuide } from "@/components/GuideProvider";
import { DASHBOARD_GUIDE } from "@/constants/guides/dashboard";
import { useNavigation } from "@/hooks/use-navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/api";
import { cn } from "@/lib/utils";
import * as React from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export default function Dashboard() {
  const { auth, institution } = usePage<SharedData>().props;
  const { getMetadata } = useNavigation();
  useRegisterGuide(DASHBOARD_GUIDE);

  const metadata = getMetadata("/dashboard");
  const institutionType = institution?.type || "institution";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const firstName = auth.user?.name?.split(" ")[0] || "Administrator";

  // ─── Academic Session & Date Filters ──────────────────────────────────────
  const [selectedSessionId, setSelectedSessionId] = React.useState<string>("");
  const [startDate, setStartDate] = React.useState<string>("");
  const [endDate, setEndDate] = React.useState<string>("");
  const [activePreset, setActivePreset] = React.useState<string>("session");

  // ─── Data Fetching ────────────────────────────────────────────────────────
  const { data: analytics, isFetching } = useQuery({
    queryKey: ["dashboard-stats", selectedSessionId, startDate, endDate],
    queryFn: async () => {
      const res = await api.get<{ data: any }>("/dashboard-stats", {
        params: {
          academic_session_id: selectedSessionId || undefined,
          start_date: startDate || undefined,
          end_date: endDate || undefined,
        },
      });
      return res?.data ?? null;
    },
  });

  const academicSessions = analytics?.academic_sessions ?? [];
  const activeSession = analytics?.active_session;
  const widgets = analytics?.widgets;
  const revenueStreams = analytics?.revenue_streams ?? [];
  const transportAnalytics = analytics?.transport_analytics ?? {
    total_revenue: 0,
    active_subscriptions: 0,
    monthly_run_rate: 0,
    total_routes: 0,
    total_vehicles: 0,
    top_routes: [],
  };
  const hostelAnalytics = analytics?.hostel_analytics ?? {
    total_revenue: 0,
    total_beds: 0,
    occupied_beds: 0,
    vacant_beds: 0,
    occupancy_rate: 0,
    active_residents: 0,
    monthly_run_rate: 0,
    total_hostels: 0,
    total_rooms: 0,
  };

  const feeTrendChart = analytics?.fee_trend_chart ?? [];
  const recentActivity = analytics?.recent_activity ?? [];
  const genderDistribution = analytics?.gender_distribution ?? [];
  const feeByMode = analytics?.fee_by_mode ?? [];
  const feeByCategory = analytics?.fee_by_category ?? [];
  const studentsPerClass = analytics?.students_per_class ?? [];
  const admissionByMainStream = analytics?.admission_by_main_stream ?? [];
  const revenueVsExpenses = analytics?.revenue_vs_expenses ?? [];
  const attendanceTrend = analytics?.attendance_trend ?? [];
  const recentNotices = analytics?.recent_notices ?? [];

  // Synchronize session and dates on initial data arrival
  React.useEffect(() => {
    if (activeSession && !selectedSessionId) {
      setSelectedSessionId(String(activeSession.id));
      if (!startDate) setStartDate(activeSession.start_date);
      if (!endDate) {
        setEndDate(activeSession.is_current ? new Date().toISOString().split("T")[0] : activeSession.end_date);
      }
    }
  }, [activeSession, selectedSessionId, startDate, endDate]);

  const handleSessionChange = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setActivePreset("session");

    if (sessionId === "all") {
      setStartDate("2024-01-01");
      setEndDate(new Date().toISOString().split("T")[0]);
      return;
    }

    const sessionObj = academicSessions.find((s: any) => String(s.id) === sessionId);
    if (sessionObj) {
      const sStart = `${sessionObj.start_year}-04-01`;
      const sEnd = sessionObj.is_current
        ? new Date().toISOString().split("T")[0]
        : `${sessionObj.end_year}-03-31`;
      setStartDate(sStart);
      setEndDate(sEnd);
    }
  };

  const applyPreset = (preset: string) => {
    setActivePreset(preset);
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    const currentTargetSession = academicSessions.find((s: any) => String(s.id) === selectedSessionId) || activeSession;
    const sessionStartYear = currentTargetSession?.start_year ?? today.getFullYear();
    const sessionEndYear = currentTargetSession?.end_year ?? today.getFullYear() + 1;

    if (preset === "session") {
      setStartDate(`${sessionStartYear}-04-01`);
      setEndDate(currentTargetSession?.is_current ? todayStr : `${sessionEndYear}-03-31`);
    } else if (preset === "full_session") {
      setStartDate(`${sessionStartYear}-04-01`);
      setEndDate(`${sessionEndYear}-03-31`);
    } else if (preset === "this_month") {
      const monthStart = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`;
      setStartDate(monthStart);
      setEndDate(todayStr);
    } else if (preset === "last_30_days") {
      const past30 = new Date(today);
      past30.setDate(today.getDate() - 30);
      setStartDate(past30.toISOString().split("T")[0]);
      setEndDate(todayStr);
    } else if (preset === "all_time") {
      setSelectedSessionId("all");
      setStartDate("2024-01-01");
      setEndDate(todayStr);
    }
  };

  const formatCurrency = (n: number) => {
    if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)} Cr`;
    if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(2)} L`;
    if (n >= 1_000) return `₹${(n / 1_000).toFixed(1)} K`;
    return `₹${Number(n || 0).toLocaleString("en-IN")}`;
  };

  // ─── Executive Metric Cards (Clean, Professional SaaS Styling) ─────────────
  const stats = [
    {
      title: "Session Revenue",
      value: widgets != null ? formatCurrency(Number(widgets.total_fee_collection ?? 0)) : "—",
      description: `Net: ${formatCurrency(Number(widgets?.net_revenue ?? 0))} after expenses`,
      icon: <IndianRupee className="size-4" />,
      trend: "up" as const,
      trendValue: Number(widgets?.total_fee_collection ?? 0) > 0 ? "Collected" : undefined,
      iconColor: "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/40",
      href: "/accounts/fee-hub/analytics",
    },
    {
      title: "Collection Rate",
      value: widgets != null ? `${widgets.fee_collection_rate ?? 0}%` : "—",
      description: `Pending Dues: ${formatCurrency(Number(widgets?.pending_fee ?? 0))}`,
      icon: <CheckCircle2 className="size-4" />,
      trend: Number(widgets?.fee_collection_rate ?? 0) >= 70 ? ("up" as const) : ("down" as const),
      trendValue: Number(widgets?.fee_collection_rate ?? 0) >= 70 ? "Healthy" : "Attention",
      iconColor: "bg-cyan-50 dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border border-cyan-200/60 dark:border-cyan-800/40",
      href: "/accounts/fee-hub/dues",
    },
    {
      title: "Transport Riders",
      value: `${transportAnalytics.active_subscriptions ?? 0}`,
      description: `${formatCurrency(transportAnalytics.total_revenue ?? 0)} • ${formatCurrency(transportAnalytics.monthly_run_rate ?? 0)}/mo`,
      icon: <Bus className="size-4" />,
      trend: "up" as const,
      trendValue: `${transportAnalytics.total_routes || 0} Routes`,
      iconColor: "bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800/40",
      href: "/transport/assignments",
    },
    {
      title: "Hostel Residents",
      value: `${hostelAnalytics.active_residents ?? 0}`,
      description: `${hostelAnalytics.occupancy_rate ?? 0}% Occupancy (${hostelAnalytics.occupied_beds}/${hostelAnalytics.total_beds} Beds)`,
      icon: <Building2 className="size-4" />,
      trend: "neutral" as const,
      trendValue: formatCurrency(hostelAnalytics.total_revenue ?? 0),
      iconColor: "bg-violet-50 dark:bg-violet-950/40 text-violet-600 dark:text-violet-400 border border-violet-200/60 dark:border-violet-800/40",
      href: "/hostel/allocations",
    },
    {
      title: "Admissions in Session",
      value: widgets?.admission_stats ? `${widgets.admission_stats.total}` : "—",
      description: `${widgets?.admission_stats?.new_admission ?? 0} New • ${widgets?.admission_stats?.re_admission ?? 0} Re-admitted`,
      icon: <UserPlus className="size-4" />,
      trend: "up" as const,
      trendValue: formatCurrency(Number(widgets?.admission_stats?.paid_revenue ?? 0)),
      iconColor: "bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/40",
      href: "/admission/applications",
    },
    {
      title: "Enrolled Students",
      value: widgets != null ? String(widgets.total_students ?? 0) : "—",
      description: `${widgets?.total_classes ?? 0} Classes active in session`,
      icon: <Users className="size-4" />,
      trend: "up" as const,
      trendValue: widgets?.total_students > 0 ? `${widgets.total_students}` : undefined,
      iconColor: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700",
      href: "/students/manage",
    },
  ];

  // ─── Quick Actions ───────────────────────────────────────────────────────
  const quickActions = [
    { title: "Add Student", href: "/students/candidate", icon: UserPlus, desc: "New candidate entry" },
    { title: "Collect Fee", href: "/students/manage", icon: IndianRupee, desc: "Desk receipt payment" },
    { title: "Assign Transport", href: "/transport/assignments", icon: Bus, desc: "Route assignment" },
    { title: "Allocate Bed", href: "/hostel/allocations", icon: DoorOpen, desc: "Room allocation" },
    { title: "Post Notice", href: "/notice-management", icon: Megaphone, desc: "Broadcast notice" },
    { title: "Staff Directory", href: "/settings/staff-directory", icon: Users, desc: "Manage employees" },
  ];

  const revenueExpenseConfig: ChartConfig = {
    revenue: { label: "Revenue Inflow", color: "#10b981" },
    expenses: { label: "Expenses", color: "#f43f5e" },
  };

  const attendanceConfig: ChartConfig = {
    rate: { label: "Attendance %", color: "#3b82f6" },
  };

  const activeSessionDisplayName = activeSession?.name || "2026-2027";

  return (
    <>
      <Head title={`Executive Dashboard - Academic Session ${activeSessionDisplayName}`} />

      <div className="flex flex-col gap-6">
        {/* ─── Top SaaS Page Header (Clean, Light/Dark Native) ─── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-border/60">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-foreground">
                Overview & Operations
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Live Session: {activeSessionDisplayName}
              </span>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">
              {getGreeting()}, <span className="font-semibold text-foreground">{firstName}</span>. Institutional metrics, fee collection, transport and hostel analytics.
            </p>
          </div>

          <div className="flex items-center gap-2.5 text-xs text-muted-foreground font-medium self-start md:self-auto">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border/60 shadow-xs">
              <CalendarDays className="size-3.5 text-muted-foreground" />
              <span>
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "short",
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {/* ─── Academic Session & Date Filter Bar ─── */}
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 p-3.5 rounded-xl bg-card border border-border/70 shadow-xs">
          {/* Left: Academic Session Dropdown */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-medium">
              <span className="text-muted-foreground whitespace-nowrap">Session:</span>
              <Select
                value={selectedSessionId || (activeSession ? String(activeSession.id) : "")}
                onValueChange={handleSessionChange}
              >
                <SelectTrigger className="h-8.5 w-[190px] text-xs font-semibold bg-background border-border/80 shadow-xs">
                  <SelectValue placeholder="Select Session" />
                </SelectTrigger>
                <SelectContent>
                  {academicSessions.map((s: any) => (
                    <SelectItem key={s.id} value={String(s.id)} className="text-xs">
                      <span className="flex items-center gap-2">
                        <span className="font-medium">{s.name}</span>
                        {s.is_current && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-emerald-500/10 text-emerald-600">
                            Active
                          </span>
                        )}
                      </span>
                    </SelectItem>
                  ))}
                  <SelectItem value="all" className="text-xs font-medium">
                    All Sessions (Cumulative)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {isFetching && (
              <span className="inline-flex items-center text-[11px] font-medium text-muted-foreground animate-pulse">
                Refreshing...
              </span>
            )}
          </div>

          {/* Right: Presets & Date Inputs */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Presets Segmented Control */}
            <div className="inline-flex items-center rounded-lg bg-muted/60 p-0.5 border border-border/50 text-xs">
              <button
                type="button"
                onClick={() => applyPreset("session")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-all font-medium",
                  activePreset === "session"
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Session YTD
              </button>
              <button
                type="button"
                onClick={() => applyPreset("full_session")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-all font-medium",
                  activePreset === "full_session"
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Full Session (12 Mo)
              </button>
              <button
                type="button"
                onClick={() => applyPreset("this_month")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-all font-medium",
                  activePreset === "this_month"
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                This Month
              </button>
              <button
                type="button"
                onClick={() => applyPreset("last_30_days")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-all font-medium",
                  activePreset === "last_30_days"
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Last 30 Days
              </button>
              <button
                type="button"
                onClick={() => applyPreset("all_time")}
                className={cn(
                  "px-2.5 py-1 rounded-md transition-all font-medium",
                  activePreset === "all_time"
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                All Time
              </button>
            </div>

            {/* Date Inputs */}
            <div className="flex items-center gap-1.5 text-xs">
              <div className="flex items-center gap-1.5 bg-background border border-border/70 rounded-lg px-2 py-1 shadow-xs">
                <span className="text-[11px] text-muted-foreground font-medium">From</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setActivePreset("custom");
                  }}
                  className="bg-transparent text-xs text-foreground focus:outline-none cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-1.5 bg-background border border-border/70 rounded-lg px-2 py-1 shadow-xs">
                <span className="text-[11px] text-muted-foreground font-medium">To</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setActivePreset("custom");
                  }}
                  className="bg-transparent text-xs text-foreground focus:outline-none cursor-pointer"
                />
              </div>
              {activePreset !== "session" && (
                <button
                  type="button"
                  onClick={() => applyPreset("session")}
                  className="p-1.5 rounded-lg border border-border/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  title="Reset to session default"
                >
                  <RotateCcw className="size-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ─── Primary Executive Metric Cards (6 Cards) ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5">
          {stats.map((stat) => (
            <Link key={stat.title} href={stat.href} className="block group focus:outline-none">
              <div className="p-4 rounded-xl bg-card border border-border/70 group-hover:border-border/90 group-hover:shadow-xs transition-all flex flex-col justify-between h-full">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {stat.title}
                  </span>
                  <div className={cn("size-7 rounded-lg flex items-center justify-center shrink-0", stat.iconColor)}>
                    {stat.icon}
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-2xl font-bold tracking-tight text-foreground tabular-nums">
                    {stat.value}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-1 truncate">
                    {stat.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ─── Revenue Breakdown Hub (Fee Collection, Transport, Hostel) ─── */}
        <div className="rounded-xl bg-card border border-border/70 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-bold text-foreground">
                Revenue Streams & Fee Distribution
              </h2>
              <p className="text-xs text-muted-foreground">
                Total ₹{Number(widgets?.total_fee_collection ?? 0).toLocaleString("en-IN")} collected across operational heads in session {activeSessionDisplayName}
              </p>
            </div>
            <Link
              href="/accounts/fee-hub/analytics"
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline self-start sm:self-auto"
            >
              Fee Analytics <ArrowUpRight className="size-3.5" />
            </Link>
          </div>

          <div className="p-4 space-y-4">
            {/* Proportional Segment Bar (Solid Colors, No Gradients) */}
            <div className="h-2.5 w-full bg-muted rounded-full overflow-hidden flex">
              {revenueStreams.map((stream: any) => {
                if (!stream.percentage || stream.percentage <= 0) return null;
                return (
                  <div
                    key={stream.key}
                    style={{ width: `${stream.percentage}%`, backgroundColor: stream.fill }}
                    className="h-full transition-all duration-300"
                    title={`${stream.name}: ₹${Number(stream.value).toLocaleString("en-IN")} (${stream.percentage}%)`}
                  />
                );
              })}
            </div>

            {/* Stream Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Tuition & Academic */}
              <Link href="/fees/payments" className="block group/s focus:outline-none">
                <div className="p-3.5 rounded-lg border border-border/60 bg-muted/20 group-hover/s:border-border transition-colors">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-muted-foreground flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-blue-600 shrink-0" />
                      Tuition & Academic
                    </span>
                    <span className="font-medium text-[11px] text-muted-foreground">
                      {revenueStreams.find((s: any) => s.key === "tuition")?.percentage ?? 0}%
                    </span>
                  </div>
                  <p className="text-lg font-bold text-foreground mt-2 tabular-nums">
                    {formatCurrency(Number(widgets?.tuition_revenue ?? 0))}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Monthly class fee collections
                  </p>
                </div>
              </Link>

              {/* Admission Fees */}
              <Link href="/admission/applications" className="block group/s focus:outline-none">
                <div className="p-3.5 rounded-lg border border-border/60 bg-muted/20 group-hover/s:border-border transition-colors">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-muted-foreground flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-purple-600 shrink-0" />
                      Admission Inflow
                    </span>
                    <span className="font-medium text-[11px] text-muted-foreground">
                      {revenueStreams.find((s: any) => s.key === "admission")?.percentage ?? 0}%
                    </span>
                  </div>
                  <p className="text-lg font-bold text-foreground mt-2 tabular-nums">
                    {formatCurrency(Number(widgets?.admission_stats?.paid_revenue ?? 0))}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {widgets?.admission_stats?.total ?? 0} Applications processed
                  </p>
                </div>
              </Link>

              {/* Transport Fees */}
              <Link href="/transport/assignments" className="block group/s focus:outline-none">
                <div className="p-3.5 rounded-lg border border-border/60 bg-muted/20 group-hover/s:border-border transition-colors">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-muted-foreground flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-amber-600 shrink-0" />
                      Transport Services
                    </span>
                    <span className="font-medium text-[11px] text-muted-foreground">
                      {revenueStreams.find((s: any) => s.key === "transport")?.percentage ?? 0}%
                    </span>
                  </div>
                  <p className="text-lg font-bold text-foreground mt-2 tabular-nums">
                    {formatCurrency(Number(transportAnalytics.total_revenue ?? 0))}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {transportAnalytics.active_subscriptions ?? 0} Subscriptions active
                  </p>
                </div>
              </Link>

              {/* Hostel Fees */}
              <Link href="/hostel/allocations" className="block group/s focus:outline-none">
                <div className="p-3.5 rounded-lg border border-border/60 bg-muted/20 group-hover/s:border-border transition-colors">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-muted-foreground flex items-center gap-1.5">
                      <span className="size-2 rounded-full bg-emerald-600 shrink-0" />
                      Hostel & Boarding
                    </span>
                    <span className="font-medium text-[11px] text-muted-foreground">
                      {revenueStreams.find((s: any) => s.key === "hostel")?.percentage ?? 0}%
                    </span>
                  </div>
                  <p className="text-lg font-bold text-foreground mt-2 tabular-nums">
                    {formatCurrency(Number(hostelAnalytics.total_revenue ?? 0))}
                  </p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    {hostelAnalytics.active_residents ?? 0} Residents allocated
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        {/* ─── Transport & Hostel Analytical Panels ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Transport Fleet & Routes Panel */}
          <div className="rounded-xl bg-card border border-border/70 shadow-xs flex flex-col justify-between overflow-hidden">
            <div className="p-4 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-muted flex items-center justify-center text-foreground">
                  <Bus className="size-3.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Transport & Bus Fleet Operations</h3>
                  <p className="text-[11px] text-muted-foreground">Route performance and rider distribution</p>
                </div>
              </div>
              <Link
                href="/transport/routes"
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5"
              >
                Routes <ArrowUpRight className="size-3" />
              </Link>
            </div>

            <div className="p-4 space-y-4">
              {/* Top 3 Metric Pills */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-lg bg-muted/30 border border-border/40">
                  <span className="text-[10px] font-semibold uppercase text-muted-foreground block">Active Riders</span>
                  <span className="text-base font-bold text-foreground tabular-nums mt-0.5 block">{transportAnalytics.active_subscriptions ?? 0}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/30 border border-border/40">
                  <span className="text-[10px] font-semibold uppercase text-muted-foreground block">Monthly Run Rate</span>
                  <span className="text-base font-bold text-foreground tabular-nums mt-0.5 block">{formatCurrency(transportAnalytics.monthly_run_rate ?? 0)}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/30 border border-border/40">
                  <span className="text-[10px] font-semibold uppercase text-muted-foreground block">Fleet Routes</span>
                  <span className="text-base font-bold text-foreground tabular-nums mt-0.5 block">{transportAnalytics.total_routes ?? 0}</span>
                </div>
              </div>

              {/* Route Breakdown List */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold uppercase text-muted-foreground tracking-wider block">
                  Top Active Routes
                </span>
                <div className="divide-y divide-border/40 max-h-[160px] overflow-y-auto pr-1">
                  {transportAnalytics.top_routes?.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic py-2">No active routes recorded</p>
                  ) : (
                    transportAnalytics.top_routes?.map((route: any) => (
                      <Link
                        key={route.id}
                        href={`/transport/routes/${route.id}`}
                        className="py-2 px-1 flex items-center justify-between text-xs hover:bg-muted/40 transition-colors rounded group/r"
                      >
                        <span className="font-medium text-foreground group-hover/r:text-primary transition-colors truncate max-w-[65%]">
                          {route.name}
                        </span>
                        <div className="flex items-center gap-2.5 shrink-0">
                          <span className="font-semibold text-foreground tabular-nums">{route.assigned_students} students</span>
                          <span className="text-[11px] text-muted-foreground tabular-nums font-mono">₹{Number(route.monthly_revenue).toLocaleString("en-IN")}/mo</span>
                        </div>
                      </Link>
                    ))
                  )}
                </div>
              </div>

              {/* Footer Links */}
              <div className="pt-2 border-t border-border/40 flex items-center gap-2">
                <Link
                  href="/transport/assignments"
                  className="flex-1 py-1.5 px-3 rounded-lg bg-muted hover:bg-muted/80 text-foreground font-semibold text-xs text-center transition-colors border border-border/50"
                >
                  Manage Student Assignments
                </Link>
                <Link
                  href="/transport/vehicles"
                  className="py-1.5 px-3 rounded-lg hover:bg-muted text-muted-foreground font-medium text-xs transition-colors"
                >
                  Vehicles ({transportAnalytics.total_vehicles})
                </Link>
              </div>
            </div>
          </div>

          {/* Hostel Accommodations & Occupancy Panel */}
          <div className="rounded-xl bg-card border border-border/70 shadow-xs flex flex-col justify-between overflow-hidden">
            <div className="p-4 border-b border-border/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="size-7 rounded-lg bg-muted flex items-center justify-center text-foreground">
                  <Building className="size-3.5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-foreground">Hostel & Housing Operations</h3>
                  <p className="text-[11px] text-muted-foreground">Capacity, bed occupancy and resident census</p>
                </div>
              </div>
              <Link
                href="/hostel/allocations"
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5"
              >
                Allocations <ArrowUpRight className="size-3" />
              </Link>
            </div>

            <div className="p-4 space-y-4">
              {/* Top 3 Metric Pills */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-lg bg-muted/30 border border-border/40">
                  <span className="text-[10px] font-semibold uppercase text-muted-foreground block">Active Residents</span>
                  <span className="text-base font-bold text-foreground tabular-nums mt-0.5 block">{hostelAnalytics.active_residents ?? 0}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/30 border border-border/40">
                  <span className="text-[10px] font-semibold uppercase text-muted-foreground block">Monthly Run Rate</span>
                  <span className="text-base font-bold text-foreground tabular-nums mt-0.5 block">{formatCurrency(hostelAnalytics.monthly_run_rate ?? 0)}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-muted/30 border border-border/40">
                  <span className="text-[10px] font-semibold uppercase text-muted-foreground block">Occupancy Rate</span>
                  <span className="text-base font-bold text-foreground tabular-nums mt-0.5 block">{hostelAnalytics.occupancy_rate ?? 0}%</span>
                </div>
              </div>

              {/* Occupancy Meter */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-muted-foreground">Bed Capacity Utilization</span>
                  <span className="font-bold text-foreground tabular-nums">
                    {hostelAnalytics.occupied_beds ?? 0} Occupied / {hostelAnalytics.total_beds ?? 0} Total Beds
                  </span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden flex">
                  <div
                    style={{ width: `${hostelAnalytics.occupancy_rate ?? 0}%` }}
                    className="h-full bg-slate-900 dark:bg-slate-100 rounded-full transition-all duration-300"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-0.5">
                  <span>Occupied: {hostelAnalytics.occupied_beds ?? 0} beds</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">Available: {hostelAnalytics.vacant_beds ?? 0} beds vacant</span>
                </div>
              </div>

              {/* Footer Links */}
              <div className="pt-2 border-t border-border/40 flex items-center gap-2">
                <Link
                  href="/hostel/allocations"
                  className="flex-1 py-1.5 px-3 rounded-lg bg-muted hover:bg-muted/80 text-foreground font-semibold text-xs text-center transition-colors border border-border/50"
                >
                  Manage Resident Allocations
                </Link>
                <Link
                  href="/hostel/rooms"
                  className="py-1.5 px-3 rounded-lg hover:bg-muted text-muted-foreground font-medium text-xs transition-colors"
                >
                  Rooms ({hostelAnalytics.total_rooms})
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Financial Charts & Operations Section ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* Left Column (Charts) */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* Revenue vs Expenses (Solid Modern Bars) */}
            <div className="rounded-xl bg-card border border-border/70 shadow-xs overflow-hidden">
              <div className="p-4 border-b border-border/50 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-foreground">Revenue Inflow vs Approved Expenses</h3>
                  <p className="text-xs text-muted-foreground">
                    Monthly comparison for session {activeSessionDisplayName}
                  </p>
                </div>
                <Link
                  href="/accounts/expenses"
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5"
                >
                  Expenses Ledger <ArrowUpRight className="size-3" />
                </Link>
              </div>
              <div className="p-4">
                <div className="h-[280px] w-full">
                  {revenueVsExpenses.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground text-xs italic">
                      No financial data available for this range
                    </div>
                  ) : (
                    <ChartContainer config={revenueExpenseConfig} className="h-full w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueVsExpenses} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                          <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/40" />
                          <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            className="text-[11px] text-muted-foreground font-medium"
                            tick={{ fontSize: 11, fill: "currentColor" }}
                          />
                          <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={6}
                            tickFormatter={(v: any) => `₹${v >= 1000 ? (v / 1000).toFixed(0) + "k" : v}`}
                            className="text-[11px] text-muted-foreground font-medium"
                            tick={{ fontSize: 11, fill: "currentColor" }}
                            width={50}
                          />
                          <ChartTooltip
                            cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
                            content={<ChartTooltipContent formatter={(value) => `₹${Number(value).toLocaleString("en-IN")}`} />}
                          />
                          <Bar dataKey="revenue" fill="#10b981" radius={[3, 3, 0, 0]} maxBarSize={22} />
                          <Bar dataKey="expenses" fill="#f43f5e" radius={[3, 3, 0, 0]} maxBarSize={22} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  )}
                </div>
                {/* Legend */}
                <div className="flex items-center justify-center gap-6 pt-3 border-t border-border/40 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-xs bg-[#10b981]" />
                    <span>Revenue Inflow</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="size-2.5 rounded-xs bg-[#f43f5e]" />
                    <span>Approved Expenses</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Fee Collection Trend + Attendance Trend */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Fee Collection Trend */}
              <div className="rounded-xl bg-card border border-border/70 shadow-xs flex flex-col justify-between overflow-hidden">
                <div className="p-3.5 border-b border-border/50 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Fee Collection Momentum</h4>
                    <p className="text-[11px] text-muted-foreground">Monthly receipt progression</p>
                  </div>
                  <Link href="/fees/payments" className="text-xs font-semibold text-primary hover:underline">
                    View Payments <ArrowUpRight className="size-3 inline" />
                  </Link>
                </div>
                <div className="p-3.5 flex-1 min-h-[220px]">
                  <Link href="/fees/payments" className="block h-full w-full cursor-pointer">
                    <ChartLineDefault
                      chartData={feeTrendChart}
                      xAxisKey="month"
                      yAxisKey="total"
                      title=""
                      subText=""
                    />
                  </Link>
                </div>
              </div>

              {/* Attendance Trend */}
              <div className="rounded-xl bg-card border border-border/70 shadow-xs flex flex-col justify-between overflow-hidden">
                <div className="p-3.5 border-b border-border/50 flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Attendance Trend</h4>
                    <p className="text-[11px] text-muted-foreground">Last 7 days present percentage</p>
                  </div>
                  <Link href="/attendance" className="text-xs font-semibold text-primary hover:underline">
                    Log <ArrowUpRight className="size-3 inline" />
                  </Link>
                </div>
                <div className="p-3.5 flex-1 min-h-[220px]">
                  {attendanceTrend.length === 0 || attendanceTrend.every((d: any) => d.total === 0) ? (
                    <div className="h-full flex items-center justify-center text-xs text-muted-foreground italic">
                      No attendance data recorded
                    </div>
                  ) : (
                    <ChartContainer config={attendanceConfig} className="h-full w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={attendanceTrend} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/40" />
                          <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={6} className="text-[10px] text-muted-foreground" tick={{ fontSize: 10, fill: "currentColor" }} />
                          <YAxis tickLine={false} axisLine={false} tickMargin={4} tickFormatter={(v: any) => `${v}%`} className="text-[10px] text-muted-foreground" tick={{ fontSize: 10, fill: "currentColor" }} width={35} domain={[0, 100]} />
                          <ChartTooltip
                            cursor={{ stroke: "#3b82f6", strokeWidth: 1 }}
                            content={<ChartTooltipContent formatter={(value) => `${value}%`} />}
                          />
                          <Area
                            dataKey="rate"
                            type="monotone"
                            stroke="#3b82f6"
                            strokeWidth={2}
                            fill="#3b82f6"
                            fillOpacity={0.15}
                            activeDot={{ r: 4, fill: "#3b82f6" }}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  )}
                </div>
              </div>
            </div>

            {/* Students per Class & Stream Distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Students per Class */}
              <div className="rounded-xl bg-card border border-border/70 shadow-xs p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between pb-3 border-b border-border/50">
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Students per Class</h4>
                    <p className="text-[11px] text-muted-foreground">Class enrollments in session</p>
                  </div>
                  <Link href="/lms/classes" className="text-xs font-semibold text-primary hover:underline">
                    Classes <ArrowUpRight className="size-3 inline" />
                  </Link>
                </div>
                <div className="space-y-2 pt-3 max-h-[220px] overflow-y-auto pr-1">
                  {studentsPerClass.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic py-2">No class data available</p>
                  ) : (
                    studentsPerClass.map((item: any, idx: number) => {
                      const maxStudents = Math.max(...studentsPerClass.map((s: any) => s.students), 1);
                      const percentage = (item.students / maxStudents) * 100;
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-foreground truncate max-w-[70%]">{item.name}</span>
                            <span className="font-bold text-foreground tabular-nums">{item.students}</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              style={{ width: `${percentage}%` }}
                              className="h-full bg-slate-800 dark:bg-slate-200 rounded-full"
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Stream Distribution */}
              <div className="rounded-xl bg-card border border-border/70 shadow-xs p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between pb-3 border-b border-border/50">
                  <div>
                    <h4 className="text-xs font-bold text-foreground">Stream Distribution</h4>
                    <p className="text-[11px] text-muted-foreground">Academic sections enrollment</p>
                  </div>
                  <Link href="/organization/streams" className="text-xs font-semibold text-primary hover:underline">
                    Streams <ArrowUpRight className="size-3 inline" />
                  </Link>
                </div>
                <div className="space-y-2 pt-3 max-h-[220px] overflow-y-auto pr-1">
                  {admissionByMainStream.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic py-2">No stream data available</p>
                  ) : (
                    admissionByMainStream.map((item: any, idx: number) => {
                      const maxStudents = Math.max(...admissionByMainStream.map((s: any) => s.students), 1);
                      const percentage = (item.students / maxStudents) * 100;
                      return (
                        <div key={idx} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-foreground truncate max-w-[70%]">{item.name}</span>
                            <span className="font-bold text-foreground tabular-nums">{item.students}</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              style={{ width: `${percentage}%` }}
                              className="h-full bg-blue-600 rounded-full"
                            />
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Sidebar Widgets) */}
          <div className="lg:col-span-4 flex flex-col gap-4">

            {/* Quick Actions (Command Center) */}
            <div className="rounded-xl bg-card border border-border/70 shadow-xs p-4">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground block mb-3">
                Quick Shortcuts
              </span>
              <div className="grid grid-cols-2 gap-2">
                {quickActions.map((action) => (
                  <Link
                    key={action.title}
                    href={action.href}
                    className="p-3 rounded-lg border border-border/60 hover:bg-muted/50 hover:border-border transition-colors flex flex-col gap-1 text-left group"
                  >
                    <action.icon className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span className="text-xs font-bold text-foreground mt-1">{action.title}</span>
                    <span className="text-[10px] text-muted-foreground truncate">{action.desc}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Payment Modes Donut */}
            <Link href="/fees/payments" className="block group focus:outline-none">
              <ChartDonut
                chartData={feeByMode}
                title="Payment Modes"
                description={`Tender breakdown in session ${activeSessionDisplayName}`}
                isCurrency
                centerLabel="Total"
                centerValue={widgets ? formatCurrency(Number(widgets.total_fee_collection ?? 0)) : "—"}
                className="border-border/70 shadow-xs group-hover:border-border transition-colors cursor-pointer"
              />
            </Link>

            {/* Gender Demographics Donut */}
            <Link href="/students/analytics" className="block group focus:outline-none">
              <ChartDonut
                chartData={genderDistribution}
                title="Student Demographics"
                description="Gender ratio in enrolled students"
                centerLabel="Students"
                centerValue={widgets ? String(widgets.total_students ?? 0) : "—"}
                className="border-border/70 shadow-xs group-hover:border-border transition-colors cursor-pointer"
              />
            </Link>

            {/* Recent Operations Log */}
            {recentActivity.length > 0 && (
              <div className="rounded-xl bg-card border border-border/70 shadow-xs overflow-hidden">
                <div className="p-3.5 border-b border-border/50 flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">Recent Operations</span>
                  <span className="text-[11px] text-muted-foreground">Live feed</span>
                </div>
                <div className="divide-y divide-border/40">
                  {recentActivity.map((activity: any, i: number) => {
                    const targetHref = activity.type === "Admission" ? "/admission/applications" : "/fees/payments";
                    return (
                      <Link
                        key={activity.type + i}
                        href={targetHref}
                        className="p-3 flex items-center justify-between text-xs hover:bg-muted/40 transition-colors group/act"
                      >
                        <div className="flex items-center gap-2.5 truncate max-w-[70%]">
                          <span className={cn(
                            "size-2 rounded-full shrink-0",
                            activity.type === "Admission" ? "bg-purple-500" : "bg-emerald-500"
                          )} />
                          <div className="truncate">
                            <span className="font-semibold text-foreground group-hover/act:text-primary transition-colors truncate block">
                              {activity.user}
                            </span>
                            <span className="text-[10px] text-muted-foreground">
                              {activity.type} {activity.amount > 0 && `• ₹${Number(activity.amount).toLocaleString("en-IN")}`}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] text-muted-foreground shrink-0">{activity.time}</span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Recent Notices */}
            {recentNotices.length > 0 && (
              <div className="rounded-xl bg-card border border-border/70 shadow-xs overflow-hidden">
                <div className="p-3.5 border-b border-border/50 flex items-center justify-between">
                  <span className="text-xs font-bold text-foreground">Recent Notices</span>
                  <Link href="/notice-management" className="text-xs font-semibold text-primary hover:underline">
                    View all <ArrowUpRight className="size-3 inline" />
                  </Link>
                </div>
                <div className="divide-y divide-border/40">
                  {recentNotices.map((notice: any) => (
                    <Link
                      key={notice.id}
                      href="/notice-management"
                      className="p-3 flex items-center justify-between text-xs hover:bg-muted/40 transition-colors group/nt"
                    >
                      <div className="flex items-center gap-2 truncate max-w-[75%]">
                        <Megaphone className="size-3.5 text-muted-foreground shrink-0" />
                        <span className="font-medium text-foreground group-hover/nt:text-primary transition-colors truncate">
                          {notice.title}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground shrink-0">{notice.time}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
