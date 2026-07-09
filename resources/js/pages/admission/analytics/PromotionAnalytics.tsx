import React, { useMemo } from 'react';
import { Head } from "@inertiajs/react";
import { useQuery } from "@tanstack/react-query";
import { useRegisterGuide } from '@/components/GuideProvider';
import { PROMOTION_ANALYTICS_GUIDE } from "@/constants/guides/promotionAnalytics";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { StatCard, StatCardSkeleton, Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, ArrowUpCircle, CheckCircle2, AlertTriangle, RotateCcw, Users, Filter } from "lucide-react";
import PromotionApi from "@/lib/api/promotionApi";
import DataTable, { TableSkeletonLoader, TableEmptyState } from "@/components/dataTable";
import Each from "@/components/Each";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnalyticsFilterBar, AnalyticsFilterItem } from "@/components/shared";
import AnalyticsApi from "@/lib/api/analyticsApi";
import { TableRow, TableCell } from "@/components/ui/table";
import useSearchFilter from "@/hooks/useSearchfilter";
import { useCollegeSessions } from "@/hooks/useCollegeSessions";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import { GraphCard } from "@/components/GraphCard";
import { ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const chartConfig = {
    eligible: {
        label: "Eligible Students",
        color: "hsl(var(--primary))",
    },
    promoted: {
        label: "Successfully Promoted",
        color: "hsl(var(--primary))",
    },
} satisfies ChartConfig;

const PromotionAnalytics = () => {
useRegisterGuide(PROMOTION_ANALYTICS_GUIDE);

    const { filter, handleFilter } = useSearchFilter({
        session_id: "",
        per_page: 15,
        page: 1,
    });

    const { data: sessionsRes } = useCollegeSessions({});
    const sessions = sessionsRes?.data ?? [];

    const { data: analyticsRes, isLoading: isAnalyticsLoading } = useQuery({
        queryKey: ["analytics-promotion", filter.session_id],
        queryFn: () => AnalyticsApi.get("promotion", { session_id: filter.session_id }),
    });

    const { data: historyRes, isLoading: isHistoryLoading } = useQuery({
        queryKey: ["promotions-history", filter.page, filter.per_page],
        queryFn: () => PromotionApi.history({ page: filter.page, per_page: filter.per_page }),
    });

    const historyData = historyRes?.data ?? [];
    const historyMeta = historyRes?.meta;
    const analyticsData = analyticsRes?.data;

    const stats = useMemo(() => {
        if (!analyticsData?.widgets) return [];
        const icons = [
            <ArrowUpCircle className="size-4" />,
            <CheckCircle2 className="size-4" />,
            <AlertTriangle className="size-4" />,
            <RotateCcw className="size-4" />
        ];
        const colors = [
            "bg-blue-500/10 text-blue-600",
            "bg-green-500/10 text-green-600",
            "bg-amber-500/10 text-amber-600",
            "bg-red-500/10 text-red-600"
        ];
        return analyticsData.widgets.map((w: any, i: number) => ({
            ...w,
            icon: icons[i],
            colorClass: colors[i]
        }));
    }, [analyticsData]);

    const chartData = useMemo(() => {
        if (!analyticsData?.chart) return [];
        return analyticsData.chart.map((c: any) => ({
            ...c,
            fill: c.name === "Eligible" ? "hsl(var(--primary)/0.1)" : "hsl(var(--primary))"
        }));
    }, [analyticsData]);

    const breadcrumbs = [
        { title: "Analytics", href: "/admission/stats" },
        { title: "Promotion Analytics", href: "/admission/analytics/promotions" },
    ];

    return (
        <>
            <Head title="Promotion Analytics" />
            <div className="space-y-6">
                <MainPageHeader
                    id="promotion-analytics-header"
                    breadcrumbs={breadcrumbs}
                    icon={BarChart3}
                    title="Promotion Analytics"
                    subtitle="Track student transition trends, promotion velocity, and retention accuracy."
                />

                <div className="space-y-6">
                    <AnalyticsFilterBar
                        title="Promotion Insights Filters"
                        icon={Users}
                        guide={PROMOTION_ANALYTICS_GUIDE}
                    >
                        <AnalyticsFilterItem label="Target Academic Session" className="lg:col-span-3">
                            <Select value={filter.session_id || "all"} onValueChange={(v) => handleFilter({ session_id: v === "all" ? "" : v })}>
                                <SelectTrigger className="h-10 rounded-xl border-border/50 bg-card">
                                    <SelectValue placeholder="Select active session context" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="all" className="rounded-lg m-1">Institution Default</SelectItem>
                                    <Each
                                        of={sessions}
                                        keyExtractor={(s: any) => String(s.id)}
                                        render={(s: any) => (
                                            <SelectItem key={s.id} value={String(s.id)} className="rounded-lg m-1">{s.name}</SelectItem>
                                        )}
                                    />
                                </SelectContent>
                            </Select>
                        </AnalyticsFilterItem>
                    </AnalyticsFilterBar>

                    <div id="promotion-analytics-stats" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Each
                            of={stats}
                            isLoading={isAnalyticsLoading || isHistoryLoading}
                            fallback={<Each of={[1, 2, 3, 4]} render={() => <StatCardSkeleton />} />}
                            render={(stat, index) => (
                                <StatCard {...stat} delay={index * 0.05} iconColor={stat.colorClass} />
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <GraphCard
                            title="Promotion Funnel"
                            description="Conversion from eligibility to promotion"
                            config={chartConfig}
                            delay={0.2}
                            className="lg:col-span-1"
                        >
                            <BarChart data={chartData} margin={{ left: -20, right: 20 }}>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(var(--primary), 0.05)" />
                                <XAxis
                                    dataKey="name"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={10}
                                    fontSize={10}
                                    fontWeight="bold"
                                />
                                <YAxis hide />
                                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={32}>
                                    <Each
                                        of={chartData}
                                        keyExtractor={(entry: any, index: number) => `cell-${index}`}
                                        render={(entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={entry.fill} />
                                        )}
                                    />
                                </Bar>
                            </BarChart>
                        </GraphCard>

                        <Card className="lg:col-span-2 overflow-hidden border-border/50">
                            <CardHeader className="pb-4">
                                <div className="flex items-center gap-2">
                                    <Users className="size-5 text-primary/70" />
                                    <CardTitle className="text-sm font-black uppercase tracking-widest">Recent Activity</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <DataTable
                                    columns={[
                                        { key: "student", label: "Student" },
                                        { key: "transition", label: "Transition" },
                                        { key: "status", label: "Status" },
                                        { key: "date", label: "Date" },
                                    ]}
                                    currentPage={historyMeta?.current_page ?? 1}
                                    lastPage={historyMeta?.last_page ?? 1}
                                    pageSize={filter.per_page}
                                    totalRecords={historyMeta?.total ?? 0}
                                    handlePageChange={(page) => handleFilter({ page })}
                                    handlePageSizeChange={(size) => handleFilter({ per_page: size, page: 1 })}
                                >
                                    <Each
                                        of={historyData}
                                        isLoading={isHistoryLoading}
                                        nodatafound={<TableEmptyState colSpan={4} message="No conversion data found" />}
                                        fallback={<TableSkeletonLoader columns={4} />}
                                        render={(history: any, index: number) => (
                                            <TableRow key={history.id} transition={{ delay: index * 0.03 }}>
                                                <TableCell className="font-semibold text-sm">{history.student?.user?.name || "—"}</TableCell>
                                                <TableCell className="text-xs font-medium text-muted-foreground">
                                                    {history.from_session?.name} → {history.to_session?.name}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant={history.status === 'completed' ? 'default' : 'secondary'} className="rounded-full px-3 text-[10px] font-black uppercase tracking-tight">
                                                        {history.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-xs tabular-nums text-muted-foreground/60">
                                                    {new Date(history.created_at).toLocaleDateString()}
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    />
                                </DataTable>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
};

export default PromotionAnalytics;
