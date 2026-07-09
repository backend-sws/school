import React, { useMemo } from 'react';
import { Head } from "@inertiajs/react";
import { useQuery } from "@tanstack/react-query";
import { useRegisterGuide } from '@/components/GuideProvider';
import { READMISSION_ANALYTICS_GUIDE } from "@/constants/guides/readmissionAnalytics";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { StatCard, StatCardSkeleton, Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, UserPlus, CheckCircle2, RotateCcw, Users, History, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TableRow, TableCell } from "@/components/ui/table";
import AnalyticsApi from "@/lib/api/analyticsApi";
import ReadmissionApi from "@/lib/api/readmissionApi";
import DataTable, { TableSkeletonLoader, TableEmptyState } from "@/components/dataTable";
import Each from "@/components/Each";
import useSearchFilter from "@/hooks/useSearchfilter";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Cell } from "recharts";
import { GraphCard } from "@/components/GraphCard";
import { ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AnalyticsFilterBar, AnalyticsFilterItem } from "@/components/shared";

const chartConfig = {
    eligible: {
        label: "Eligible for Re-Admit",
        color: "hsl(var(--primary)/0.1)",
    },
    admitted: {
        label: "Successfully Re-Admitted",
        color: "hsl(var(--primary))",
    },
} satisfies ChartConfig;

const ReadmissionAnalytics = () => {
useRegisterGuide(READMISSION_ANALYTICS_GUIDE);

    const { filter, handleFilter } = useSearchFilter({
        search_text: "",
        per_page: 15,
        page: 1,
    });

    const { data: analyticsRes, isLoading: isAnalyticsLoading } = useQuery({
        queryKey: ["analytics-readmission", filter.search_text],
        queryFn: () => AnalyticsApi.get("readmission", { search_text: filter.search_text }),
    });

    const { data: historyRes, isLoading: isHistoryLoading } = useQuery({
        queryKey: ["readmissions-history", filter.page, filter.per_page],
        queryFn: () => ReadmissionApi.history({ page: filter.page, per_page: filter.per_page }),
    });

    const historyData = historyRes?.data ?? [];
    const historyMeta = historyRes?.meta;
    const analyticsData = analyticsRes?.data;

    const stats = useMemo(() => {
        if (!analyticsData?.widgets) return [];
        const icons = [
            <UserPlus className="size-4" />,
            <CheckCircle2 className="size-4" />,
            <History className="size-4" />,
            <RotateCcw className="size-4" />
        ];
        const colors = [
            "bg-amber-500/10 text-amber-600",
            "bg-green-500/10 text-green-600",
            "bg-blue-500/10 text-blue-600",
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
        { title: "Re-Admission Analytics", href: "/admission/analytics/readmissions" },
    ];

    return (
        <>
            <Head title="Re-Admission Analytics" />
            <div className="space-y-6">
                <MainPageHeader
                    id="readmission-analytics-header"
                    breadcrumbs={breadcrumbs}
                    icon={BarChart3}
                    title="Re-Admission Analytics"
                    subtitle="Analyze student return patterns, retention trends, and gap duration metrics."
                />

                <div className="space-y-6">
                    <AnalyticsFilterBar
                        title="Retention Insights Filters"
                        icon={Search}
                        guide={READMISSION_ANALYTICS_GUIDE}
                    >
                        <AnalyticsFilterItem label="Search Identity" className="lg:col-span-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/50" />
                                <Input
                                    placeholder="Find patterns by student name or record ID..."
                                    value={filter.search_text}
                                    onChange={(e) => handleFilter({ search_text: e.target.value })}
                                    className="h-10 pl-10 rounded-xl border-border/50 bg-card focus-visible:ring-primary/20"
                                />
                            </div>
                        </AnalyticsFilterItem>
                    </AnalyticsFilterBar>

                    <div id="readmission-analytics-stats" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
                            title="Retention Funnel"
                            description="Eligible vs Processed Re-Admissions"
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
                                <div className="flex items-center gap-2 text-primary/70">
                                    <Users className="size-5" />
                                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em]">Recent History</CardTitle>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <DataTable
                                    columns={[
                                        { key: "student", label: "Student" },
                                        { key: "target", label: "Target Session" },
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
                                        nodatafound={<TableEmptyState colSpan={4} message="No retention data found" />}
                                        fallback={<TableSkeletonLoader columns={4} />}
                                        render={(history: any, index: number) => (
                                            <TableRow key={history.id} transition={{ delay: index * 0.03 }}>
                                                <TableCell className="font-semibold text-sm">{history.student?.user?.name || "—"}</TableCell>
                                                <TableCell className="text-xs font-medium text-muted-foreground">
                                                    {history.to_session?.name}
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

export default ReadmissionAnalytics;
