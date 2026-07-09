import { ChartBarDefault } from "@/components/charts/bar-chart";
import { ChartLineDefault } from "@/components/charts/line-chart";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { StatCard } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Each from "@/components/Each";
import { Head, Link } from "@inertiajs/react";
import {
  Building2,
  Building,
  History,
  Shield,
  Users,
  GraduationCap,
  IndianRupee,
  ClipboardList,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/api";
import { DASHBOARD_STATS_DATA } from "@/constants";

interface Summary {
  institutions_count: number;
  organizations_count: number;
  active_trials: number;
  monthly_revenue: number;
  tier_breakdown: Record<string, number>;
}

interface OrganizationData {
  id: number;
  name: string;
  tier: string;
  status: string;
  ends_at: string | null;
  institutions_count: number;
}

interface SuperAdminLandingProps {
  summary?: Summary;
  organizations?: OrganizationData[];
}

const BREADCRUMBS = [{ title: "Super Admin", href: "/super-admin" }];

export default function SuperAdminLandingPage({
  summary = { institutions_count: 0, organizations_count: 0, active_trials: 0, monthly_revenue: 0, tier_breakdown: {} },
  organizations = [],
}: SuperAdminLandingProps) {

  const { data: analytics } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const res = await api.get<{
        data?: {
          widgets?: {
            total_students?: number;
            admission_stats?: { total?: number };
            total_fee_collection?: number;
            pending_tasks?: number;
          };
          admission_breakdown_chart?: Array<{
            month: string;
            new_admissions?: number;
            re_admissions?: number;
          }>;
          fee_trend_chart?: Array<{ month: string; total?: number }>;
          date_range?: { from: string; to: string };
        };
      }>("/dashboard-stats");
      return res?.data ?? null;
    },
  });

  const widgets = analytics?.widgets;
  const admissionChart = analytics?.admission_breakdown_chart ?? [];
  const feeTrendChart = analytics?.fee_trend_chart ?? [];
  const dateRange = analytics?.date_range;

  const formatCurrency = (n: number) => {
    if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(1)}Cr`;
    if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(1)}L`;
    if (n >= 1_000) return `₹${(n / 1_000).toFixed(1)}K`;
    return `₹${n}`;
  };

  const admissionChartData =
    admissionChart.length > 0
      ? admissionChart.map((d) => ({
        month: d.month,
        admissions: (d.new_admissions ?? 0) + (d.re_admissions ?? 0),
      }))
      : DASHBOARD_STATS_DATA.totalAdmissions;

  const feeChartData =
    feeTrendChart.length > 0
      ? feeTrendChart.map((d) => ({ month: d.month, feescount: Number(d.total ?? 0) }))
      : DASHBOARD_STATS_DATA.totalFees;

  const stats = [
    {
      title: "Institutions",
      value: String(summary.institutions_count ?? 0),
      description: "Total registered",
      icon: <Building2 />,
    },
    {
      title: "Organisations",
      value: String(summary.organizations_count ?? 0),
      description: "Parent groups",
      icon: <Building />,
    },
    {
      title: "Active Trials",
      value: String(summary.active_trials ?? 0),
      description: "New organizations",
      icon: <Zap className="text-yellow-500" />,
      trend: "up" as const,
    },
    {
      title: "Monthly Revenue",
      value: formatCurrency(summary.monthly_revenue ?? 0),
      description: "Estimated MRR",
      icon: <IndianRupee className="text-green-500" />,
      trend: "up" as const,
    },
    {
      title: "Total Students",
      value: widgets != null ? String(widgets.total_students ?? 0) : "—",
      description: "Across all institutions",
      icon: <Users />,
    },
    {
      title: "Admissions",
      value: widgets != null ? String(widgets.admission_stats?.total ?? 0) : "—",
      description: dateRange ? `${dateRange.from} – ${dateRange.to}` : "This period",
      icon: <GraduationCap />,
    },
    {
      title: "Fee Collection",
      value: widgets != null ? formatCurrency(Number(widgets.total_fee_collection ?? 0)) : "—",
      description: dateRange ? `${dateRange.from} – ${dateRange.to}` : "This period",
      icon: <IndianRupee />,
    },
    {
      title: "Pending Tasks",
      value: widgets != null ? String(widgets.pending_tasks ?? 0) : "—",
      description: "Requires attention",
      icon: <ClipboardList />,
    },
  ];

  return (
    <>
      <Head title="Super Admin – Analytics" />

      <div className="flex flex-col gap-3 sm:gap-4 p-2 sm:p-3 md:p-4">
        <MainPageHeader
          breadcrumbs={BREADCRUMBS}
          icon={Shield}
          title="Super Admin"
          subtitle="System-wide analytics and key metrics across all institutions."
          guidance="Monitor key metrics and charts below. View audit logs for system-wide activity."
        />

        {/* Stats: system overview + live analytics */}
        <section aria-label="Key metrics">
          <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4 xl:grid-cols-4">
            <Each
              of={stats}
              render={(stat, index) => (
                <StatCard {...stat} delay={index * 0.05} />
              )}
            />
          </div>
        </section>

        {/* Organizations Table */}
        <section className="bg-card rounded-xl border p-6">
          <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Organizations Management
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-4 py-3">Org Name</th>
                  <th className="px-4 py-3">Tier</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Institutions</th>
                  <th className="px-4 py-3">Expiry</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <Each
                  of={organizations}
                  render={(org) => (
                    <tr key={org.id} className="hover:bg-muted/30 transition-colors group">
                      <td className="px-4 py-4 font-bold text-foreground">{org.name}</td>
                      <td className="px-4 py-4">
                        <Badge variant="outline" className="capitalize font-bold text-[10px] tracking-tighter">
                          {org.tier}
                        </Badge>
                      </td>
                      <td className="px-4 py-4">
                        <Badge
                          variant={org.status === 'Active' ? 'default' : 'destructive'}
                          className={org.status === 'Active' ? 'bg-success hover:bg-success/90 text-success-foreground' : ''}
                        >
                          {org.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-4 font-mono font-bold">{org.institutions_count}</td>
                      <td className="px-4 py-4 text-muted-foreground font-medium">
                        {org.ends_at || 'N/A'}
                      </td>
                    </tr>
                  )}
                />
              </tbody>
            </table>
          </div>
        </section>

        {/* Charts */}
        <section aria-label="Analytics charts">
          <div className="grid gap-2 sm:gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <article className="rounded-xl border border-border bg-card overflow-hidden">
              <ChartBarDefault
                chartData={admissionChartData}
                xAxisKey="month"
                yAxisKey="admissions"
                title="Admissions"
                subText={dateRange ? `${dateRange.from} – ${dateRange.to}` : "By month"}
              />
            </article>
            <article className="rounded-xl border border-border bg-card overflow-hidden">
              <ChartBarDefault
                chartData={feeChartData}
                xAxisKey="month"
                yAxisKey="feescount"
                title="Fee collection"
                subText={dateRange ? `${dateRange.from} – ${dateRange.to}` : "By month"}
              />
            </article>
            <article className="rounded-xl border border-border bg-card overflow-hidden md:col-span-2 lg:col-span-1">
              <ChartLineDefault />
            </article>
          </div>
        </section>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-3">
          <Button asChild size="default" variant="default">
            <Link href="/admin/audit-logs" className="inline-flex items-center gap-2">
              <History className="size-4" />
              View Audit Logs
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
