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
} from "lucide-react";
import Each from "@/components/Each";
import { useRegisterGuide } from '@/components/GuideProvider';
import { DASHBOARD_GUIDE } from "@/constants/guides/dashboard";
import { useNavigation } from "@/hooks/use-navigation";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/api";
import { motion } from "framer-motion";
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

export default function Dashboard() {
  const { auth, institution } = usePage<SharedData>().props;
  const { getMetadata } = useNavigation();
  useRegisterGuide(DASHBOARD_GUIDE);

  const metadata = getMetadata("/dashboard");
  const institutionType = institution?.type || "institution";

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const firstName = auth.user?.name?.split(" ")[0] || "Administrator";

  // ─── Date Range State & Presets ───────────────────────────────────────────
  const [startDate, setStartDate] = React.useState<string>("2025-01-01");
  const [endDate, setEndDate] = React.useState<string>(() => new Date().toISOString().split("T")[0]);
  const [activePreset, setActivePreset] = React.useState<string>("session");

  const applyPreset = (preset: string) => {
    setActivePreset(preset);
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    if (preset === "session") {
      setStartDate("2025-01-01");
      setEndDate(todayStr);
    } else if (preset === "this_year") {
      const yearStart = `${today.getFullYear()}-01-01`;
      setStartDate(yearStart);
      setEndDate(todayStr);
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
      setStartDate("2024-01-01");
      setEndDate(todayStr);
    }
  };

  // ─── Data Fetching ────────────────────────────────────────────────────────
  const { data: analytics, isFetching } = useQuery({
    queryKey: ["dashboard-stats", startDate, endDate],
    queryFn: async () => {
      const res = await api.get<{ data: any }>("/dashboard-stats", {
        params: {
          start_date: startDate,
          end_date: endDate,
        },
      });
      return res?.data ?? null;
    },
  });

  const widgets = analytics?.widgets;
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

  const formatCurrency = (n: number) => {
    if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(1)}Cr`;
    if (n >= 1_00_00_000) return `₹${(n / 1_00_000).toFixed(1)}L`;
    if (n >= 1_000) return `₹${(n / 1_000).toFixed(1)}K`;
    return `₹${n.toLocaleString("en-IN")}`;
  };

  // ─── Stats Config (All with Clickable Routes) ──────────────────────────────
  const stats = [
    {
      title: "Active Students",
      value: widgets != null ? String(widgets.total_students ?? 0) : "—",
      description: "Manage student registry",
      icon: <Users />,
      trend: "up" as const,
      trendValue: widgets?.total_students > 0 ? `${widgets.total_students}` : undefined,
      iconColor: "bg-blue-500/10 text-blue-500 border-blue-500/10",
      href: "/students/manage",
    },
    {
      title: "Total Staff",
      value: widgets != null ? String(widgets.total_staff ?? 0) : "—",
      description: "View staff directory",
      icon: <Building2 />,
      trend: "neutral" as const,
      iconColor: "bg-purple-500/10 text-purple-500 border-purple-500/10",
      href: "/settings/staff-directory",
    },
    {
      title: "Total Revenue",
      value: widgets != null ? formatCurrency(Number(widgets.total_fee_collection ?? 0)) : "—",
      description: "View fee analytics",
      icon: <IndianRupee />,
      trend: "up" as const,
      trendValue: Number(widgets?.total_fee_collection ?? 0) > 0 ? "Collected" : undefined,
      iconColor: "bg-emerald-500/10 text-emerald-500 border-emerald-500/10",
      href: "/accounts/fee-hub/analytics",
    },
    {
      title: "Pending Fees",
      value: widgets != null ? formatCurrency(Number(widgets.pending_fee ?? 0)) : "—",
      description: "View dues & overdues",
      icon: <Clock />,
      trend: Number(widgets?.pending_fee ?? 0) > 0 ? "down" as const : "neutral" as const,
      trendValue: Number(widgets?.pending_fee ?? 0) > 0 ? "Pending" : undefined,
      iconColor: "bg-amber-500/10 text-amber-500 border-amber-500/10",
      href: "/accounts/fee-hub/dues",
    },
    {
      title: "Collection Rate",
      value: widgets != null ? `${widgets.fee_collection_rate ?? 0}%` : "—",
      description: "View payment history",
      icon: <CheckCircle2 />,
      trend: Number(widgets?.fee_collection_rate ?? 0) >= 70 ? "up" as const : "down" as const,
      trendValue: Number(widgets?.fee_collection_rate ?? 0) >= 70 ? "Healthy" : "Low",
      iconColor: "bg-cyan-500/10 text-cyan-500 border-cyan-500/10",
      href: "/fees/payments",
    },
    {
      title: "Attendance Rate",
      value: widgets != null ? `${widgets.attendance_rate ?? 0}%` : "—",
      description: "Daily attendance logs",
      icon: <CalendarDays />,
      trend: Number(widgets?.attendance_rate ?? 0) >= 75 ? "up" as const : "down" as const,
      trendValue: Number(widgets?.attendance_rate ?? 0) >= 75 ? "Good" : "Needs attention",
      iconColor: "bg-indigo-500/10 text-indigo-500 border-indigo-500/10",
      href: "/attendance",
    },
  ];

  // ─── Quick Actions ───────────────────────────────────────────────────────
  const quickActions = [
    { title: "Add Student", href: "/students/candidate", icon: UserPlus, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Collect Fee", href: "/students/manage", icon: IndianRupee, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Post Notice", href: "/notice-management", icon: Megaphone, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Manage Staff", href: "/settings/staff-directory", icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  // ─── Revenue vs Expenses Chart Config ──────────────────────────────────────
  const revenueExpenseConfig: ChartConfig = {
    revenue: { label: "Revenue", color: "hsl(142, 71%, 45%)" },
    expenses: { label: "Expenses", color: "hsl(0, 84%, 60%)" },
  };

  // ─── Attendance Trend Chart Config ────────────────────────────────────────
  const attendanceConfig: ChartConfig = {
    rate: { label: "Attendance %", color: "hsl(221, 83%, 53%)" },
  };

  return (
    <>
      <Head title="Management Dashboard" />

      <div className="flex flex-col gap-6 font-display">
        {/* ─── Hero Welcome Section ─── */}
        <section className="relative overflow-hidden rounded-3xl bg-indigo-950 px-8 py-10 text-white shadow-xl">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <motion.h1
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl md:text-5xl font-black tracking-tighter"
              >
                {getGreeting()}, {firstName}
              </motion.h1>
              <p className="text-indigo-200/80 font-medium text-lg">
                Here's what's happening at your {institutionType} today.
              </p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <span className="text-3xl font-black tracking-tighter text-indigo-100">
                {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
              </span>
              <span className="text-indigo-300 font-bold uppercase tracking-widest text-xs">
                {new Date().toLocaleDateString("en-IN", { weekday: "long" })}
              </span>
            </div>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 size-80 rounded-full bg-primary/20 blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 size-60 rounded-full bg-violet-500/10 blur-[80px] pointer-events-none" />
        </section>

        {/* ─── Date Range Filter Bar ─── */}
        <div className="flex flex-col xl:flex-row items-stretch xl:items-center justify-between gap-4 p-4 rounded-2xl bg-card border border-sidebar-border/50 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
              <CalendarDays className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">Analytics Period</span>
                {isFetching && (
                  <span className="inline-flex items-center text-[10px] font-semibold text-primary animate-pulse">
                    Updating...
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                Filter revenue, collections & metrics between two dates
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Quick Presets */}
            <div className="flex flex-wrap items-center rounded-xl bg-muted/40 p-1 border border-border/40 text-xs">
              <button
                type="button"
                onClick={() => applyPreset("session")}
                className={cn(
                  "px-2.5 py-1 rounded-lg font-semibold transition-all",
                  activePreset === "session"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                2025-26 Session
              </button>
              <button
                type="button"
                onClick={() => applyPreset("this_year")}
                className={cn(
                  "px-2.5 py-1 rounded-lg font-semibold transition-all",
                  activePreset === "this_year"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                This Year
              </button>
              <button
                type="button"
                onClick={() => applyPreset("this_month")}
                className={cn(
                  "px-2.5 py-1 rounded-lg font-semibold transition-all",
                  activePreset === "this_month"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                This Month
              </button>
              <button
                type="button"
                onClick={() => applyPreset("last_30_days")}
                className={cn(
                  "px-2.5 py-1 rounded-lg font-semibold transition-all",
                  activePreset === "last_30_days"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Last 30 Days
              </button>
              <button
                type="button"
                onClick={() => applyPreset("all_time")}
                className={cn(
                  "px-2.5 py-1 rounded-lg font-semibold transition-all",
                  activePreset === "all_time"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                All Time
              </button>
            </div>

            {/* Two Date Range Inputs */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-muted/20 border border-border/50 rounded-xl px-2.5 py-1">
                <span className="text-[11px] font-semibold text-muted-foreground">From</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setActivePreset("custom");
                  }}
                  className="bg-transparent text-xs font-semibold text-foreground focus:outline-none cursor-pointer"
                />
              </div>
              <div className="flex items-center gap-1.5 bg-muted/20 border border-border/50 rounded-xl px-2.5 py-1">
                <span className="text-[11px] font-semibold text-muted-foreground">To</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setActivePreset("custom");
                  }}
                  className="bg-transparent text-xs font-semibold text-foreground focus:outline-none cursor-pointer"
                />
              </div>
              {activePreset !== "session" && (
                <button
                  type="button"
                  onClick={() => applyPreset("session")}
                  className="p-1.5 rounded-xl border border-border/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                  title="Reset to default session"
                >
                  <RotateCcw className="size-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ─── Stats Cards Row (6 Clickable Cards) ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Each
            of={stats}
            render={(stat, index) => (
              <Link key={stat.title} href={stat.href} className="group block focus:outline-none">
                <StatCard
                  {...stat}
                  delay={index * 0.08}
                  variant="metrics"
                  className="border-sidebar-border/50 bg-card group-hover:border-primary/50 group-hover:shadow-md group-hover:-translate-y-1 transition-all duration-200 shadow-sm cursor-pointer relative"
                />
              </Link>
            )}
          />
        </div>

        {/* ─── Main Content Grid ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* ─── Left Column (Charts) ─── */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* Revenue vs Expenses (Stacked Bar) */}
            <Card className="border-sidebar-border/50 bg-card shadow-sm overflow-hidden group/card hover:border-primary/30 transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-sidebar-border/30">
                <div>
                  <CardTitle className="text-lg font-black tracking-tight">Revenue vs Expenses</CardTitle>
                  <CardDescription>Monthly comparison over last 6 months</CardDescription>
                </div>
                <Link
                  href="/accounts/expenses"
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 transition-colors text-xs font-semibold"
                >
                  <BarChart3 className="size-4" />
                  <span>Expenses Hub</span>
                  <ArrowUpRight className="size-3.5" />
                </Link>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[300px] w-full p-4">
                  {revenueVsExpenses.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2 border-2 border-dashed border-border/30 rounded-xl bg-muted/5">
                      <BarChart3 className="h-8 w-8 opacity-20" />
                      <p className="text-xs font-medium italic">No financial data available</p>
                    </div>
                  ) : (
                    <ChartContainer config={revenueExpenseConfig} className="h-full w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={revenueVsExpenses} margin={{ top: 20, right: 20, left: -10, bottom: 0 }}>
                          <defs>
                            <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.9} />
                              <stop offset="95%" stopColor="hsl(142, 71%, 45%)" stopOpacity={0.4} />
                            </linearGradient>
                            <linearGradient id="expGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.9} />
                              <stop offset="95%" stopColor="hsl(0, 84%, 60%)" stopOpacity={0.4} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/20" />
                          <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={12} className="text-[10px] text-muted-foreground font-medium" tick={{ fontSize: 10, fill: 'currentColor' }} />
                          <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(v: any) => `₹${v >= 1000 ? (v / 1000).toFixed(0) + 'k' : v}`} className="text-[10px] text-muted-foreground" tick={{ fontSize: 10, fill: 'currentColor' }} width={55} />
                          <ChartTooltip
                            cursor={{ fill: "hsl(var(--muted))", opacity: 0.15 }}
                            content={<ChartTooltipContent formatter={(value) => `₹${Number(value).toLocaleString("en-IN")}`} />}
                          />
                          <Bar dataKey="revenue" fill="url(#revGradient)" radius={[4, 4, 0, 0]} maxBarSize={28} animationDuration={1500} />
                          <Bar dataKey="expenses" fill="url(#expGradient)" radius={[4, 4, 0, 0]} maxBarSize={28} animationDuration={1500} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  )}
                </div>
                {/* Legend */}
                <div className="flex items-center justify-center gap-6 pb-4">
                  <Link href="/accounts/fee-hub/analytics" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <span className="text-[11px] font-medium text-muted-foreground hover:text-foreground">Revenue (View Analytics)</span>
                  </Link>
                  <Link href="/accounts/expenses" className="flex items-center gap-1.5 hover:opacity-80 transition-opacity">
                    <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                    <span className="text-[11px] font-medium text-muted-foreground hover:text-foreground">Expenses (View Records)</span>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Fee Trend + Attendance Trend Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Fee Collection Trend */}
              <Card className="border-sidebar-border/50 bg-card shadow-sm overflow-hidden flex flex-col group/card hover:border-primary/30 transition-all">
                <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-sidebar-border/30">
                  <div>
                    <CardTitle className="text-sm font-black tracking-tight">Fee Collection Trend</CardTitle>
                    <CardDescription className="text-xs">Monthly fee collection</CardDescription>
                  </div>
                  <Link
                    href="/fees/payments"
                    className="inline-flex items-center gap-1 p-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors text-xs font-semibold"
                    title="View Payments"
                  >
                    <TrendingUp className="size-4" />
                    <ArrowUpRight className="size-3" />
                  </Link>
                </CardHeader>
                <CardContent className="p-0 flex-1 min-h-[250px]">
                  <Link href="/fees/payments" className="block h-full w-full p-4 cursor-pointer">
                    <ChartLineDefault
                      chartData={feeTrendChart}
                      xAxisKey="month"
                      yAxisKey="total"
                      title=""
                      subText=""
                    />
                  </Link>
                </CardContent>
              </Card>

              {/* Attendance Trend (7 days) */}
              <Card className="border-sidebar-border/50 bg-card shadow-sm overflow-hidden flex flex-col group/card hover:border-primary/30 transition-all">
                <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-sidebar-border/30">
                  <div>
                    <CardTitle className="text-sm font-black tracking-tight">Attendance Trend</CardTitle>
                    <CardDescription className="text-xs">Last 7 days rate</CardDescription>
                  </div>
                  <Link
                    href="/attendance"
                    className="inline-flex items-center gap-1 p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-500 transition-colors text-xs font-semibold"
                    title="View Attendance"
                  >
                    <Activity className="size-4" />
                    <ArrowUpRight className="size-3" />
                  </Link>
                </CardHeader>
                <CardContent className="p-0 flex-1 min-h-[250px]">
                  <Link href="/attendance" className="block h-full w-full p-4 cursor-pointer">
                    {attendanceTrend.length === 0 || attendanceTrend.every((d: any) => d.total === 0) ? (
                      <div className="h-full flex flex-col items-center justify-center text-muted-foreground gap-2 border-2 border-dashed border-border/30 rounded-xl bg-muted/5">
                        <Activity className="h-8 w-8 opacity-20" />
                        <p className="text-xs font-medium italic">No attendance data yet</p>
                      </div>
                    ) : (
                      <ChartContainer config={attendanceConfig} className="h-full w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={attendanceTrend} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="attendGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0.4} />
                                <stop offset="100%" stopColor="hsl(221, 83%, 53%)" stopOpacity={0} />
                              </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-muted/20" />
                            <XAxis dataKey="day" tickLine={false} axisLine={false} tickMargin={8} className="text-[10px] text-muted-foreground" tick={{ fontSize: 10, fill: 'currentColor' }} />
                            <YAxis tickLine={false} axisLine={false} tickMargin={4} tickFormatter={(v: any) => `${v}%`} className="text-[10px] text-muted-foreground" tick={{ fontSize: 10, fill: 'currentColor' }} width={40} domain={[0, 100]} />
                            <ChartTooltip
                              cursor={{ stroke: "hsl(221, 83%, 53%)", strokeWidth: 1, strokeDasharray: "4 4" }}
                              content={<ChartTooltipContent formatter={(value) => `${value}%`} />}
                            />
                            <Area
                              dataKey="rate"
                              type="monotone"
                              stroke="hsl(221, 83%, 53%)"
                              strokeWidth={2.5}
                              fillOpacity={1}
                              fill="url(#attendGradient)"
                              activeDot={{ r: 5, fill: "hsl(221, 83%, 53%)", stroke: "#fff", strokeWidth: 2 }}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </ChartContainer>
                    )}
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Students per Class + Admission by Stream Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Students per Class */}
              <Card className="border-sidebar-border/50 bg-card shadow-sm overflow-hidden group/card hover:border-primary/30 transition-all">
                <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-sidebar-border/30">
                  <div>
                    <CardTitle className="text-sm font-black tracking-tight">Students per Class</CardTitle>
                    <CardDescription className="text-xs">Top classes by enrollment</CardDescription>
                  </div>
                  <Link
                    href="/lms/classes"
                    className="inline-flex items-center gap-1 p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 transition-colors text-xs font-semibold"
                    title="View Classes"
                  >
                    <BookOpen className="size-4" />
                    <ArrowUpRight className="size-3" />
                  </Link>
                </CardHeader>
                <CardContent className="p-4">
                  {studentsPerClass.length === 0 ? (
                    <div className="h-[200px] flex flex-col items-center justify-center text-muted-foreground gap-2 border-2 border-dashed border-border/30 rounded-xl bg-muted/5">
                      <BookOpen className="h-8 w-8 opacity-20" />
                      <p className="text-xs font-medium italic">No class data available</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                      {studentsPerClass.map((item: any, idx: number) => {
                        const maxStudents = Math.max(...studentsPerClass.map((s: any) => s.students), 1);
                        const percentage = (item.students / maxStudents) * 100;
                        return (
                          <Link key={idx} href="/lms/classes" className="block space-y-1 group/item hover:opacity-80 transition-opacity">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-semibold text-foreground/80 group-hover/item:text-primary transition-colors truncate max-w-[70%]">{item.name}</span>
                              <span className="text-[11px] font-black text-foreground">{item.students}</span>
                            </div>
                            <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 1, delay: idx * 0.08 }}
                                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"
                              />
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Admission by Main Stream */}
              <Card className="border-sidebar-border/50 bg-card shadow-sm overflow-hidden group/card hover:border-primary/30 transition-all">
                <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-sidebar-border/30">
                  <div>
                    <CardTitle className="text-sm font-black tracking-tight">Students by Section</CardTitle>
                    <CardDescription className="text-xs">Distribution across streams</CardDescription>
                  </div>
                  <Link
                    href="/organization/streams"
                    className="inline-flex items-center gap-1 p-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 text-purple-500 transition-colors text-xs font-semibold"
                    title="View Streams"
                  >
                    <GraduationCap className="size-4" />
                    <ArrowUpRight className="size-3" />
                  </Link>
                </CardHeader>
                <CardContent className="p-4">
                  {admissionByMainStream.length === 0 ? (
                    <div className="h-[200px] flex flex-col items-center justify-center text-muted-foreground gap-2 border-2 border-dashed border-border/30 rounded-xl bg-muted/5">
                      <GraduationCap className="h-8 w-8 opacity-20" />
                      <p className="text-xs font-medium italic">No stream data available</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5 max-h-[280px] overflow-y-auto pr-1">
                      {admissionByMainStream.map((item: any, idx: number) => {
                        const maxStudents = Math.max(...admissionByMainStream.map((s: any) => s.students), 1);
                        const percentage = (item.students / maxStudents) * 100;
                        const streamColors = ['from-violet-500 to-purple-500', 'from-emerald-500 to-teal-500', 'from-amber-500 to-orange-500', 'from-blue-500 to-cyan-500', 'from-pink-500 to-rose-500'];
                        return (
                          <Link key={idx} href="/organization/streams" className="block space-y-1 group/item hover:opacity-80 transition-opacity">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-semibold text-foreground/80 group-hover/item:text-primary transition-colors truncate max-w-[70%]">{item.name}</span>
                              <span className="text-[11px] font-black text-foreground">{item.students}</span>
                            </div>
                            <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 1, delay: idx * 0.08 }}
                                className={cn("h-full rounded-full bg-gradient-to-r", streamColors[idx % streamColors.length])}
                              />
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* ─── Right Sidebar ─── */}
          <div className="lg:col-span-4 flex flex-col gap-6 text-display">

            {/* Quick Actions (Command Center) */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-sidebar-border/50 pb-2 mb-2 px-1">
                <LayoutGrid className="size-4 text-primary" />
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                  Command Center
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <Link key={action.title} href={action.href} className="group/action">
                    <Card variant="action" className="p-4 flex flex-col items-center justify-center gap-3 h-32 border-dashed border-2 hover:border-solid hover:border-primary/30 hover:bg-sidebar-accent/20 transition-all shadow-sm">
                      <div className={cn("size-10 rounded-xl flex items-center justify-center transition-transform group-hover/action:scale-110 group-hover/action:rotate-3", action.bg, action.color)}>
                        <action.icon className="size-5" />
                      </div>
                      <span className="text-[12px] font-black tracking-tight text-foreground/80 group-hover/action:text-primary transition-colors text-center">
                        {action.title}
                      </span>
                    </Card>
                  </Link>
                ))}
              </div>
            </section>

            {/* Fee by Category Donut (Clickable) */}
            <Link href="/accounts/fee-hub/fee-types" className="block group focus:outline-none">
              <ChartDonut
                chartData={feeByCategory}
                title="Fee by Category"
                description="Revenue breakdown • Click to manage"
                isCurrency
                centerLabel="Total"
                centerValue={widgets ? formatCurrency(Number(widgets.total_fee_collection ?? 0)) : "—"}
                className="border-sidebar-border/50 shadow-sm group-hover:border-primary/50 group-hover:shadow-md transition-all cursor-pointer"
              />
            </Link>

            {/* Gender Distribution Donut (Clickable) */}
            <Link href="/students/analytics" className="block group focus:outline-none">
              <ChartDonut
                chartData={genderDistribution}
                title="Gender Distribution"
                description="Student demographics • Click for details"
                centerLabel="Students"
                centerValue={widgets ? String(widgets.total_students ?? 0) : "—"}
                className="border-sidebar-border/50 shadow-sm group-hover:border-primary/50 group-hover:shadow-md transition-all cursor-pointer"
              />
            </Link>

            {/* Fee by Payment Mode (Clickable) */}
            <Link href="/fees/payments" className="block group focus:outline-none">
              <ChartDonut
                chartData={feeByMode}
                title="Collection by Mode"
                description="Payment methods • Click to view log"
                isCurrency
                className="border-sidebar-border/50 shadow-sm group-hover:border-primary/50 group-hover:shadow-md transition-all cursor-pointer"
              />
            </Link>

            {/* Summary Cards (All 4 Clickable) */}
            <div className="grid grid-cols-2 gap-3">
              <Link href="/admission/applications" className="group focus:outline-none">
                <Card variant="metrics" className="p-4 border-sidebar-border/50 shadow-sm group-hover:border-primary/50 group-hover:shadow-md group-hover:-translate-y-0.5 transition-all cursor-pointer">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">New Admissions</p>
                      <ArrowUpRight className="size-3 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-2xl font-black tracking-tight">{widgets?.admission_stats?.total ?? 0}</p>
                    <p className="text-[10px] font-medium text-muted-foreground/80">This session</p>
                  </div>
                </Card>
              </Link>

              <Link href="/accounts/expenses" className="group focus:outline-none">
                <Card variant="metrics" className="p-4 border-sidebar-border/50 shadow-sm group-hover:border-primary/50 group-hover:shadow-md group-hover:-translate-y-0.5 transition-all cursor-pointer">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Total Expenses</p>
                      <ArrowUpRight className="size-3 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-2xl font-black tracking-tight">{widgets ? formatCurrency(Number(widgets.total_expenses ?? 0)) : "—"}</p>
                    <p className="text-[10px] font-medium text-muted-foreground/80">Approved</p>
                  </div>
                </Card>
              </Link>

              <Link href="/accounts/expenses/records" className="group focus:outline-none">
                <Card variant="metrics" className="p-4 border-sidebar-border/50 shadow-sm group-hover:border-primary/50 group-hover:shadow-md group-hover:-translate-y-0.5 transition-all cursor-pointer">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Net Revenue</p>
                      <ArrowUpRight className="size-3 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                    </div>
                    <p className={cn("text-2xl font-black tracking-tight", Number(widgets?.net_revenue ?? 0) >= 0 ? "text-emerald-500" : "text-red-500")}>
                      {widgets ? formatCurrency(Math.abs(Number(widgets.net_revenue ?? 0))) : "—"}
                    </p>
                    <p className="text-[10px] font-medium text-muted-foreground/80">Revenue - Expenses</p>
                  </div>
                </Card>
              </Link>

              <Link href="/lms/classes" className="group focus:outline-none">
                <Card variant="metrics" className="p-4 border-sidebar-border/50 shadow-sm group-hover:border-primary/50 group-hover:shadow-md group-hover:-translate-y-0.5 transition-all cursor-pointer">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">Active Classes</p>
                      <ArrowUpRight className="size-3 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                    </div>
                    <p className="text-2xl font-black tracking-tight">{widgets?.total_classes ?? 0}</p>
                    <p className="text-[10px] font-medium text-muted-foreground/80">Current session</p>
                  </div>
                </Card>
              </Link>
            </div>

            {/* Recent Notices (Clickable) */}
            {recentNotices.length > 0 && (
              <section className="space-y-4">
                <div className="flex items-center justify-between border-b border-sidebar-border/50 pb-2 mb-2 px-1">
                  <div className="flex items-center gap-2">
                    <Bell className="size-4 text-amber-500" />
                    <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                      Recent Notices
                    </h3>
                  </div>
                  <Link href="/notice-management" className="text-[11px] font-bold text-primary hover:underline flex items-center gap-0.5">
                    View all <ArrowUpRight className="size-3" />
                  </Link>
                </div>
                <Card className="border-sidebar-border/50 bg-card p-0 shadow-sm overflow-hidden">
                  <div className="flex flex-col divide-y divide-sidebar-border/50">
                    {recentNotices.map((notice: any) => (
                      <Link key={notice.id} href="/notice-management" className="flex items-center gap-3 p-3.5 hover:bg-sidebar-accent/30 transition-colors cursor-pointer group/notice">
                        <div className="size-7 rounded-lg flex items-center justify-center bg-amber-500/10 text-amber-500 shrink-0 group-hover/notice:scale-105 transition-transform">
                          <Megaphone className="size-3.5" />
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span className="text-[12px] font-bold text-foreground group-hover/notice:text-primary transition-colors truncate">{notice.title}</span>
                          <span className="text-[10px] font-medium text-muted-foreground/60">{notice.time}</span>
                        </div>
                        <ArrowUpRight className="size-3.5 text-muted-foreground/30 group-hover/notice:text-primary transition-colors" />
                      </Link>
                    ))}
                  </div>
                </Card>
              </section>
            )}

            {/* Recent Activity (Clickable) */}
            {recentActivity.length > 0 && (
              <section className="space-y-4 flex-1 flex flex-col">
                <div className="flex items-center justify-between border-b border-sidebar-border/50 pb-2 mb-2 px-1">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
                    Recent Operations
                  </h3>
                </div>
                <Card className="border-sidebar-border/50 bg-card p-0 shadow-sm overflow-hidden flex-1 flex flex-col">
                  <div className="flex flex-col flex-1 divide-y divide-sidebar-border/50">
                    {recentActivity.map((activity: any, i: number) => {
                      const Icon = activity.icon === 'GraduationCap' ? GraduationCap : IndianRupee;
                      const targetHref = activity.type === 'Admission' ? '/admission/applications' : '/fees/payments';
                      return (
                        <Link
                          key={activity.type + i}
                          href={targetHref}
                          className="flex items-center gap-4 p-4 hover:bg-sidebar-accent/30 transition-colors cursor-pointer group/act"
                        >
                          <div className={cn("size-8 rounded-lg flex items-center justify-center bg-sidebar-accent/50 shadow-sm group-hover/act:scale-105 transition-transform", activity.color)}>
                            <Icon className="size-4" />
                          </div>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-[13px] font-black text-foreground group-hover/act:text-primary transition-colors truncate">{activity.type}</span>
                            <span className="text-[11px] font-medium text-muted-foreground/80">{activity.user}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-[10px] font-bold text-muted-foreground/50 whitespace-nowrap">{activity.time}</span>
                            <ArrowUpRight className="size-3 text-muted-foreground/30 group-hover/act:text-primary transition-colors" />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </Card>
              </section>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
