import { ChartBarDefault } from "@/components/charts/bar-chart";
import { ChartLineDefault } from "@/components/charts/line-chart";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { StatCard } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { type BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import {
    BarChart3,
    TrendingUp,
    Download,
} from "lucide-react";
import Each from "@/components/Each";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/api";
import GenericReportTable from "@/components/reports/GenericReportTable";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { AnalyticsFilterBar, AnalyticsFilterItem } from "@/components/shared";
import { FilterBar } from "@/components/filter-bar/filter-bar";
import { useRegisterGuide } from '@/components/GuideProvider';
import { ANALYTICS_OVERVIEW_GUIDE } from "@/constants/guides/analytics";

const REPORT_TYPES = [
    { value: "financial-collection", label: "Financial Collection" },
    { value: "admission-analytics", label: "Admission Overview" },
    { value: "promotion-analytics", label: "Promotion Analysis" },
    { value: "readmission-analytics", label: "Re-Admission Analysis" },
    { value: "outstanding-dues", label: "Outstanding Dues" },
    { value: "attendance-analytics", label: "Attendance Analytics" },
    { value: "inventory", label: "Inventory Report" },
    { value: "student-performance", label: "Student Performance" },
];

export default function AnalyticsDashboard() {
useRegisterGuide(ANALYTICS_OVERVIEW_GUIDE);

    const [reportType, setReportType] = useState("financial-collection");
    const [startDate, setStartDate] = useState(
        new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            .toISOString()
            .split("T")[0]
    );
    const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
    const [searchTxnId, setSearchTxnId] = useState("");
    const [searchDate, setSearchDate] = useState("");
    const [page, setPage] = useState(1);
    const [viewMode, setViewMode] = useState<"daily" | "monthly">("daily");

    useEffect(() => {
        setPage(1);
    }, [reportType, startDate, endDate, searchTxnId, searchDate, viewMode]);

    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Overview", href: "/analytics" },
    ];

    const { data: reportData, isLoading, refetch } = useQuery({
        queryKey: ["report", reportType, startDate, endDate, searchTxnId, searchDate, page, viewMode],
        queryFn: async () => {
            const res = await api.get(`/reports/${reportType}`, {
                params: {
                    start_date: startDate,
                    end_date: endDate,
                    transaction_id: searchTxnId,
                    search_date: searchDate,
                    page,
                    view_mode: viewMode
                },
            });
            return res?.data ?? null;
        },
    });

    const handleExport = () => {
        window.open(`/api/v1/reports/${reportType}/export?start_date=${startDate}&end_date=${endDate}`, "_blank");
    };

    return (
        <>
            <Head title="Overview" />

            <div className="flex flex-col gap-4 p-4">
                <MainPageHeader
                    breadcrumbs={breadcrumbs}
                    icon={BarChart3}
                    title="Overview"
                    subtitle="Real-time institutional performance metrics, financial trends, and academic analytics."
                />

                <AnalyticsFilterBar
                    guide={ANALYTICS_OVERVIEW_GUIDE}
                >
                    <AnalyticsFilterItem label="Report Type">
                        <Select value={reportType} onValueChange={setReportType}>
                            <SelectTrigger className="h-10 rounded-xl border-border/50 bg-card focus:ring-primary/20">
                                <SelectValue placeholder="Select Report" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <Each
                                    of={REPORT_TYPES}
                                    render={(type) => (
                                        <SelectItem value={type.value} className="rounded-lg m-1">
                                            {type.label}
                                        </SelectItem>
                                    )}
                                />
                            </SelectContent>
                        </Select>
                    </AnalyticsFilterItem>

                    <AnalyticsFilterItem label="Start Date">
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="h-10 rounded-xl border-border/50 bg-card focus-visible:ring-primary/20"
                        />
                    </AnalyticsFilterItem>

                    <AnalyticsFilterItem label="End Date">
                        <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="h-10 rounded-xl border-border/50 bg-card focus-visible:ring-primary/20"
                        />
                    </AnalyticsFilterItem>

                    <AnalyticsFilterItem label="Actions">
                        <Button
                            onClick={handleExport}
                            className="h-10 w-full rounded-xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                        >
                            <Download className="size-3" />
                            Export Data
                        </Button>
                    </AnalyticsFilterItem>
                </AnalyticsFilterBar>

                {reportData && (
                    <div className="flex flex-col gap-6">
                        {/* Summary Cards */}
                        {reportData.data?.summary && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <Each
                                    of={Object.entries(reportData.data.summary)}
                                    render={([key, value], index) => {
                                        const isCurrency = ['fees', 'revenue', 'total', 'sales', 'grand_total'].some(k => key.includes(k));
                                        const isPercentage = ['rate', 'percentage'].some(k => key.includes(k));
                                        let formattedValue = '';
                                        if (isCurrency) {
                                            formattedValue = `₹${(Number(value) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
                                        } else if (isPercentage) {
                                            formattedValue = `${(Number(value) || 0)}%`;
                                        } else {
                                            formattedValue = (Number(value) || 0).toLocaleString('en-IN');
                                        }
                                        return (
                                            <StatCard
                                                title={key.replace(/_/g, " ").toUpperCase()}
                                                value={formattedValue}
                                                description="Period total"
                                                icon={<TrendingUp className="h-4 w-4" />}
                                                delay={index * 0.05}
                                            />
                                        );
                                    }}
                                />
                            </div>
                        )}

                        {/* Charts Row */}
                        {reportData.data?.daily_trend && (
                            <div id="analytics-charts" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                <ChartLineDefault
                                    chartData={reportData.data.daily_trend}
                                    xAxisKey="date"
                                    yAxisKey="total"
                                    title="Daily Trend"
                                    subText="Daily financial collection over the selected period"
                                />
                                <ChartBarDefault
                                    chartData={reportData.data.breakdown}
                                    xAxisKey="name"
                                    yAxisKey="total"
                                    title="Distribution Analysis"
                                    subText="Collection breakdown by fee type"
                                />
                            </div>
                        )}

                        {/* Data Table */}
                        {reportData.headers && reportData.data?.items && (
                            <article id="analytics-table" className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm overflow-hidden">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="space-y-1">
                                        <h3 className="text-lg font-bold tracking-tight">Detailed Records</h3>
                                        <p className="text-xs text-muted-foreground">Historical data for the selected period</p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-center gap-4">
                                        <div className="flex bg-muted p-1 rounded-lg">
                                            <button
                                                onClick={() => setViewMode("daily")}
                                                className={cn(
                                                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                                                    viewMode === "daily" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                                                )}
                                            >
                                                Daily Records
                                            </button>
                                            <button
                                                onClick={() => setViewMode("monthly")}
                                                className={cn(
                                                    "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
                                                    viewMode === "monthly" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                                                )}
                                            >
                                                Monthly Ledger
                                            </button>
                                        </div>
                                        <FilterBar
                                            values={{ transaction_id: searchTxnId, search_date: searchDate }}
                                            onChange={(updates) => {
                                                if ('transaction_id' in updates) setSearchTxnId(updates.transaction_id);
                                                if ('search_date' in updates) setSearchDate(updates.search_date);
                                            }}
                                            className="w-full sm:w-auto"
                                        >
                                            <FilterBar.Renderer config={{ search: { name: "transaction_id", placeholder: "Search TXN ID..." }, filters: [{ name: "search_date", type: "date", label: "Payment Date", tooltip: "Filter by exact payment date" }] }} />
                                        </FilterBar>
                                    </div>
                                </div>
                                <div className="border border-border/50 rounded-xl overflow-hidden">
                                    <GenericReportTable
                                        columns={reportData.headers}
                                        data={reportData.data.items}
                                        isLoading={isLoading}
                                        pagination={reportData.data.pagination}
                                        onPageChange={setPage}
                                    />
                                </div>
                            </article>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
