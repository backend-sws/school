import { ChartLineDefault } from "@/components/charts/line-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, StatCard } from "@/components/ui/card";
import { type BreadcrumbItem, type SharedData } from "@/types";
import { Head, Link, usePage } from "@inertiajs/react";
import {
  GraduationCap,
  Users,
  IndianRupee,
  ClipboardList,
  LayoutGrid,
  UserPlus,
  Megaphone,
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

  // ─── Data Fetching ────────────────────────────────────────────────────────
  const { data: analytics } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await api.get<{ data: { widgets: any; recent_activity: any[]; fee_trend_chart: any[]; date_range: any } }>("/dashboard-stats");
      return res?.data ?? null;
    },
  });

  const widgets = analytics?.widgets;
  const feeTrendChart = analytics?.fee_trend_chart ?? [];
  const recentActivity = analytics?.recent_activity ?? [];

  const formatCurrency = (n: number) => {
    if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(1)}Cr`;
    if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(1)}L`;
    return `₹${n.toLocaleString("en-IN")}`;
  };

  // ─── Stats Config ──────────────────────────────────────────────────────────
  const stats = [
    {
      title: "Active Students",
      value: widgets != null ? String(widgets.total_students ?? 0) : "—",
      description: "Across all departments",
      icon: <Users />,
      trend: "up" as const,
      trendValue: "+12%",
    },
    {
      title: "New Admissions",
      value: widgets != null ? String(widgets.admission_stats?.total ?? 0) : "—",
      description: "This session",
      icon: <GraduationCap />,
      trend: "up" as const,
      trendValue: "+5%",
    },
    {
      title: "Total Revenue",
      value: widgets != null ? formatCurrency(Number(widgets.total_fee_collection ?? 0)) : "—",
      description: "Fee collections",
      icon: <IndianRupee />,
      trend: "up" as const,
      trendValue: "+8.2%",
    },
    {
      title: "System Alerts",
      value: widgets != null ? String(widgets.pending_tasks ?? 0) : "—",
      description: "Action required",
      icon: <ClipboardList />,
      trend: "neutral" as const,
    },
  ];

  // ─── Quick Actions (Only verified working links) ───────────────────────────
  const quickActions = [
    { title: "Add Student", href: "/students/candidate", icon: UserPlus, color: "text-blue-500", bg: "bg-blue-500/10" },
    { title: "Collect Fee", href: "/accounts/fee-hub/students", icon: IndianRupee, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "Post Notice", href: "/notice-management", icon: Megaphone, color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Manage Staff", href: "/settings/staff-directory", icon: Users, color: "text-purple-500", bg: "bg-purple-500/10" },
  ];

  return (
    <>
      <Head title="Management Dashboard" />

      <div className="flex flex-col gap-6 font-display">
        {/* ─── Hero Welcome Section (Enhanced Visuals) ─── */}
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* ─── Main Content Content ─── */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Each
                of={stats}
                render={(stat, index) => (
                  <StatCard
                    {...stat}
                    delay={index * 0.1}
                    variant="metrics"
                    className="border-sidebar-border/50 bg-card hover:border-primary/30 transition-all shadow-sm group"
                  />
                )}
              />
            </div>

            {/* Revenue Trend Chart */}
            <Card className="border-sidebar-border/50 bg-card shadow-sm overflow-hidden flex-1 flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-sidebar-border/30">
                <div>
                  <CardTitle className="text-lg font-black tracking-tight">Financial Performance</CardTitle>
                  <CardDescription>Fee collection and revenue trends over the last 6 months</CardDescription>
                </div>
                <div className="p-2 bg-emerald-500/10 rounded-lg">
                  <IndianRupee className="size-5 text-emerald-600" />
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-1 min-h-[350px]">
                <div className="h-full w-full p-4">
                  <ChartLineDefault
                    chartData={feeTrendChart}
                    xAxisKey="month"
                    yAxisKey="total"
                    title=""
                    subText=""
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ─── Right Sidebar: Workflow & Activity ─── */}
          <div className="lg:col-span-4 flex flex-col gap-6 text-display">
            {/* Quick Actions */}
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

            {/* Activities/Feed */}
            {recentActivity.length > 0 && (
              <section className="space-y-4 flex-1 flex flex-col">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground border-b border-sidebar-border/50 pb-2 mb-2 px-1">
                  Recent Operations
                </h3>
                <Card className="border-sidebar-border/50 bg-card p-0 shadow-sm overflow-hidden flex-1 flex flex-col">
                  <div className="flex flex-col flex-1 divide-y divide-sidebar-border/50">
                    {recentActivity.map((activity, i) => {
                      const Icon = activity.icon === 'GraduationCap' ? GraduationCap : IndianRupee;
                      return (
                        <div key={activity.type + i} className="flex items-center gap-4 p-4 hover:bg-sidebar-accent/30 transition-colors cursor-default group/act">
                          <div className={cn("size-8 rounded-lg flex items-center justify-center bg-sidebar-accent/50 shadow-sm", activity.color)}>
                            <Icon className="size-4" />
                          </div>
                          <div className="flex flex-col min-w-0 flex-1">
                            <span className="text-[13px] font-black text-foreground truncate">{activity.type}</span>
                            <span className="text-[11px] font-medium text-muted-foreground/80">{activity.user}</span>
                          </div>
                          <span className="text-[10px] font-bold text-muted-foreground/50 whitespace-nowrap">{activity.time}</span>
                        </div>
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
