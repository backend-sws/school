import React, { useState, useMemo } from 'react';
import { Head, usePage } from "@inertiajs/react";
import { getInstitutionLabels } from "@/constants/scopeTypeDisplay";
import { useQuery } from "@tanstack/react-query";
import { feeCollectionApi } from "@/lib/api/feeCollectionApi";
import lmsApi from "@/lib/api/lmsApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
    TrendingUp,
    IndianRupee,
    School,
    BarChart3,
    Search,
    BookOpen,
    ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PageContainer } from "@/components/shared/page/PageContainer";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { AnalyticsFilterBar, AnalyticsFilterItem } from "@/components/shared";
import { StatCard, StatCardSkeleton } from "@/components/ui/card";
import Each from "@/components/Each";
import { useRegisterGuide } from '@/components/GuideProvider';
import { FEE_ANALYTICS_GUIDE } from "@/constants/guides/analytics";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    AreaChart,
    Area,
} from "recharts";
import { GraphCard } from "@/components/GraphCard";
import AnalyticsApi from "@/lib/api/analyticsApi";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";

const breadcrumbs = [
    { title: "Treasury & Fees", href: "/accounts/fee-hub" },
    { title: "Fee Analytics", href: "" },
];

function getAnalyticsGuidance(streamLabel: string) {
    return [
        "Monthly collection ledger: view totals by month for course fees, admissions, and certificates.",
        `Use ${streamLabel} filter to see collections for a specific ${streamLabel.toLowerCase()} only; leave as All for institution-wide totals.`,
        `Expected dues in Student Ledgers come from Fee Management (${streamLabel.toLowerCase()}-wise fee structure).`,
        "Aggregate Total row shows the sum for the selected period.",
    ];
}

const chartConfig = {
    collected_admission: {
        label: "Admissions",
        color: "hsl(var(--primary))",
    },
    collected_fees: {
        label: "Course Fees",
        color: "hsl(var(--primary))",
    },
    collected_certificate: {
        label: "Services",
        color: "hsl(var(--primary))",
    },
    total_collected: {
        label: "Total Collection",
        color: "hsl(var(--primary))",
    },
} satisfies ChartConfig;

export default function Analytics() {
useRegisterGuide(FEE_ANALYTICS_GUIDE);

    const scopeType = (usePage().props as { institution?: { type?: string } }).institution?.type ?? null;
    const labels = getInstitutionLabels(scopeType);

    const { data: classesRes } = useQuery({
        queryKey: ["lms-classes-list"],
        queryFn: () => lmsApi.classes.index({ per_page: 500 }),
    });
    const classes = classesRes?.data?.data || classesRes?.data || [];

    const currentDate = new Date();
    const startOfYear = `${currentDate.getFullYear()}-01`;
    const currentMonth = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`;
    const [from, setFrom] = useState(startOfYear);
    const [to, setTo] = useState(currentMonth);
    const [ledgerClassId, setLedgerClassId] = useState<string>("");

    const { data: analyticsRes, isLoading: analyticsLoading } = useQuery({
        queryKey: ["analytics-fee-hub", from, to, ledgerClassId],
        queryFn: () => AnalyticsApi.get("fee-hub", {
            start_date: from,
            end_date: to,
            lms_class_id: ledgerClassId
        })
    });

    const { data: ledgerRes, isLoading: ledgerLoading } = useQuery({
        queryKey: ["monthly-ledger", from, to, ledgerClassId],
        queryFn: () => feeCollectionApi.getMonthlyLedger({
            from,
            to,
            ...(ledgerClassId ? { lms_class_id: ledgerClassId } : {}),
        })
    });

    const ledgerData = ledgerRes?.data || [];
    const analyticsData = analyticsRes?.data;

    const statsTotals = useMemo(() => {
        return ledgerData.reduce((acc: any, row: any) => ({
            fees: acc.fees + (row.collected_fees || 0),
            admission: acc.admission + (row.collected_admission || 0),
            certs: acc.certs + (row.collected_certificate || 0),
            total: acc.total + (row.total_collected || 0),
        }), { fees: 0, admission: 0, certs: 0, total: 0 });
    }, [ledgerData]);

    const ledgerStats = useMemo(() => {
        if (!analyticsData?.widgets) return [];
        const icons = [
            <TrendingUp className="size-4" />,
            <BookOpen className="size-4" />,
            <School className="size-4" />,
            <ShieldCheck className="size-4" />,
        ];
        const colors = [
            "bg-blue-500/10 text-blue-600 font-semibold",
            "bg-emerald-500/10 text-emerald-600 font-semibold",
            "bg-amber-500/10 text-amber-600 font-semibold",
            "bg-purple-500/10 text-purple-600 font-semibold",
        ];
        return analyticsData.widgets.map((w: any, i: number) => ({
            ...w,
            icon: icons[i],
            colorClass: colors[i]
        }));
    }, [analyticsData]);

    return (
        <>
            <Head title="Monthly Analytics - Fee Hub" />

            <PageContainer maxWidth="full">
                <div className="space-y-6">
                    <MainPageHeader
                        id="fee-analytics-header"
                        breadcrumbs={breadcrumbs}
                        icon={BarChart3}
                        title="Fee Analytics"
                        subtitle="Detailed insights into fee collection across all revenue streams."
                    />
                    <AnalyticsFilterBar
                        guide={FEE_ANALYTICS_GUIDE}
                    >
                        <AnalyticsFilterItem label="Start Period">
                            <Input type="month" value={from} onChange={(e) => setFrom(e.target.value)} className="h-10 rounded-xl border-border/50 bg-card focus-visible:ring-primary/20" />
                        </AnalyticsFilterItem>
                        <AnalyticsFilterItem label="End Period">
                            <Input type="month" value={to} onChange={(e) => setTo(e.target.value)} className="h-10 rounded-xl border-border/50 bg-card focus-visible:ring-primary/20" />
                        </AnalyticsFilterItem>
                        <AnalyticsFilterItem label="Class Filter">
                            <Select value={ledgerClassId || "all"} onValueChange={(v) => setLedgerClassId(v === "all" ? "" : v)}>
                                <SelectTrigger className="h-10 rounded-xl border-border/50 bg-card">
                                    <SelectValue placeholder="All Streams" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="all" className="rounded-lg m-1">Institution-wide</SelectItem>
                                    <Each
                                        of={classes}
                                        keyExtractor={(cls: any) => String(cls.id)}
                                        render={(cls: any) => (
                                            <SelectItem key={cls.id} value={String(cls.id)} className="rounded-lg m-1">{cls.name}</SelectItem>
                                        )}
                                    />
                                </SelectContent>
                            </Select>
                        </AnalyticsFilterItem>
                    </AnalyticsFilterBar>

                    <div id="fee-stats-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Each
                            of={ledgerStats}
                            isLoading={analyticsLoading}
                            fallback={<Each of={[1, 2, 3, 4]} render={() => <StatCardSkeleton />} />}
                            render={(stat: any, index: number) => (
                                <StatCard {...stat} delay={index * 0.05} iconColor={stat.colorClass} />
                            )}
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        <GraphCard
                            title="Admissions"
                            description="Monthly enrollment collection"
                            config={chartConfig}
                            delay={0.2}
                        >
                            {ledgerData.length > 0 ? (
                                <BarChart data={ledgerData}>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(var(--primary), 0.05)" />
                                    <XAxis
                                        dataKey="month_label"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={10}
                                        fontSize={10}
                                        fontWeight="bold"
                                    />
                                    <YAxis hide />
                                    <ChartTooltip content={<ChartTooltipContent hideLabel />} cursor={false} />
                                    <Bar dataKey="collected_admission" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} barSize={24} />
                                </BarChart>
                            ) : null}
                        </GraphCard>

                        <GraphCard
                            title="Fee Collection"
                            description="Monthly course fee trends"
                            config={chartConfig}
                            delay={0.3}
                        >
                            {ledgerData.length > 0 ? (
                                <BarChart data={ledgerData}>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(var(--primary), 0.05)" />
                                    <XAxis
                                        dataKey="month_label"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={10}
                                        fontSize={10}
                                        fontWeight="bold"
                                    />
                                    <YAxis hide />
                                    <ChartTooltip content={<ChartTooltipContent hideLabel />} cursor={false} />
                                    <Bar dataKey="collected_fees" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} barSize={24} />
                                </BarChart>
                            ) : null}
                        </GraphCard>

                        <GraphCard
                            title="Services"
                            description="Monthly certificate & service collections"
                            config={chartConfig}
                            delay={0.4}
                        >
                            {ledgerData.length > 0 ? (
                                <BarChart data={ledgerData}>
                                    <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(var(--primary), 0.05)" />
                                    <XAxis
                                        dataKey="month_label"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={10}
                                        fontSize={10}
                                        fontWeight="bold"
                                    />
                                    <YAxis hide />
                                    <ChartTooltip content={<ChartTooltipContent hideLabel />} cursor={false} />
                                    <Bar dataKey="collected_certificate" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} barSize={24} />
                                </BarChart>
                            ) : null}
                        </GraphCard>

                        <GraphCard
                            title="Collection Trend"
                            description="Overall revenue performance"
                            config={chartConfig}
                            delay={0.5}
                        >
                            {ledgerData.length > 0 ? (
                                <AreaChart data={ledgerData}>
                                    <defs>
                                        <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.1} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(var(--primary), 0.05)" />
                                    <XAxis
                                        dataKey="month_label"
                                        axisLine={false}
                                        tickLine={false}
                                        tickMargin={10}
                                        fontSize={10}
                                        fontWeight="bold"
                                    />
                                    <YAxis hide />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Area
                                        type="monotone"
                                        dataKey="total_collected"
                                        stroke="hsl(var(--primary))"
                                        fillOpacity={1}
                                        fill="url(#colorTotal)"
                                        strokeWidth={3}
                                    />
                                </AreaChart>
                            ) : null}
                        </GraphCard>
                    </div>

                    <Card className="rounded-xl border shadow-sm overflow-hidden bg-background">
                        {ledgerLoading ? (
                            <div className="py-20 flex flex-col items-center gap-2">
                                <div className="size-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Analysing Stream Data...</p>
                            </div>
                        ) : ledgerData.length === 0 ? (
                            <div className="py-20 text-center space-y-4">
                                <Search className="size-10 text-muted-foreground/20 mx-auto" />
                                <div className="space-y-1">
                                    <h4 className="text-sm font-bold">No Collections Found</h4>
                                    <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">Try adjusting your time window or filter context.</p>
                                </div>
                            </div>
                        ) : (
                            <Table>
                                <TableHeader className="bg-muted/50">
                                    <TableRow>
                                        <TableHead className="py-4 px-6 font-bold uppercase tracking-wider text-[10px]">Month</TableHead>
                                        <TableHead className="py-4 text-right font-bold uppercase tracking-wider text-[10px]">Course Fees</TableHead>
                                        <TableHead className="py-4 text-right font-bold uppercase tracking-wider text-[10px]">Admission</TableHead>
                                        <TableHead className="py-4 text-right font-bold uppercase tracking-wider text-[10px]">Services</TableHead>
                                        <TableHead className="py-4 text-right px-6 font-bold uppercase tracking-wider text-[10px] text-primary bg-primary/5">Total</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    <Each
                                        of={ledgerData}
                                        keyExtractor={(row: any) => row.month}
                                        render={(row: any) => (
                                            <TableRow key={row.month} className="hover:bg-muted/30 transition-colors border-b last:border-0 border-muted/50">
                                                <TableCell className="px-6 py-4 font-semibold text-sm">
                                                    {row.month_label}
                                                </TableCell>
                                                <TableCell className="text-right py-4 tabular-nums text-sm font-medium">₹{(row.collected_fees || 0).toLocaleString()}</TableCell>
                                                <TableCell className="text-right py-4 tabular-nums text-sm font-medium">₹{(row.collected_admission || 0).toLocaleString()}</TableCell>
                                                <TableCell className="text-right py-4 tabular-nums text-sm font-medium">₹{(row.collected_certificate || 0).toLocaleString()}</TableCell>
                                                <TableCell className="text-right py-4 px-6 tabular-nums font-bold text-sm bg-primary/[0.02]">₹{(row.total_collected || 0).toLocaleString()}</TableCell>
                                            </TableRow>
                                        )}
                                    />
                                    <TableRow className="bg-muted/80 border-t border-muted-foreground/20">
                                        <TableCell className="px-6 py-5">
                                            <div className="text-[10px] font-bold uppercase tracking-wider text-primary">Aggregate Period Total</div>
                                        </TableCell>
                                        <TableCell className="text-right py-5 tabular-nums text-sm font-bold italic">₹{statsTotals.fees.toLocaleString()}</TableCell>
                                        <TableCell className="text-right py-5 tabular-nums text-sm font-bold italic">₹{statsTotals.admission.toLocaleString()}</TableCell>
                                        <TableCell className="text-right py-5 tabular-nums text-sm font-bold italic">₹{statsTotals.certs.toLocaleString()}</TableCell>
                                        <TableCell className="text-right py-5 px-6 tabular-nums font-black text-xl text-primary">
                                            ₹{statsTotals.total.toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        )}
                    </Card>
                </div>
            </PageContainer>
        </>
    );
}
