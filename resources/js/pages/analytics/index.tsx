import { ChartBarDefault } from "@/components/charts/bar-chart";
import { ChartLineDefault } from "@/components/charts/line-chart";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { cn } from "@/lib/utils";
import { type BreadcrumbItem } from "@/types";
import { Head } from "@inertiajs/react";
import {
    BarChart3,
    TrendingUp,
    Download,
    BookOpen,
    UserPlus,
    Bus,
    Building2,
    ShoppingBag,
    Wallet,
    IndianRupee,
    FileText,
    CheckCircle2,
    Users,
    Percent,
    AlertCircle,
    Calendar,
    RotateCw,
    Clock,
    FileSpreadsheet,
    FileDown,
    ArrowUpRight,
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
import { useRegisterGuide } from "@/components/GuideProvider";
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

    // Fetch Academic Sessions
    const { data: sessionsData } = useQuery({
        queryKey: ["academic-sessions"],
        queryFn: async () => {
            const res = await api.get("/sessions");
            return res?.data ?? [];
        },
    });

    const academicSessions = Array.isArray(sessionsData?.data)
        ? sessionsData.data
        : (Array.isArray(sessionsData) ? sessionsData : []);

    const activeSession = academicSessions.find((s: any) => s.is_current) || academicSessions[0];

    // Filter states
    const [reportType, setReportType] = useState("financial-collection");
    const [selectedSessionId, setSelectedSessionId] = useState<string>("");
    const [activePreset, setActivePreset] = useState<string>("session");
    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");
    const [searchTxnId, setSearchTxnId] = useState("");
    const [searchDate, setSearchDate] = useState("");
    const [page, setPage] = useState(1);
    const [viewMode, setViewMode] = useState<"daily" | "monthly">("daily");

    // Initialize session and date boundaries
    useEffect(() => {
        if (activeSession && !selectedSessionId) {
            setSelectedSessionId(String(activeSession.id));
            const sStart = `${activeSession.start_year}-04-01`;
            const sEnd = activeSession.is_current
                ? new Date().toISOString().split("T")[0]
                : `${activeSession.end_year}-03-31`;
            setStartDate(sStart);
            setEndDate(sEnd);
        }
    }, [activeSession, selectedSessionId]);

    // Reset pagination on filter change
    useEffect(() => {
        setPage(1);
    }, [reportType, selectedSessionId, startDate, endDate, searchTxnId, searchDate, viewMode]);

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

        const currentTargetSession =
            academicSessions.find((s: any) => String(s.id) === selectedSessionId) || activeSession;
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

    const breadcrumbs: BreadcrumbItem[] = [
        { title: "Overview", href: "/analytics" },
    ];

    const {
        data: reportData,
        isLoading,
        isFetching,
        refetch,
    } = useQuery({
        queryKey: [
            "report",
            reportType,
            selectedSessionId,
            startDate,
            endDate,
            searchTxnId,
            searchDate,
            page,
            viewMode,
        ],
        queryFn: async () => {
            const res = await api.get(`/reports/${reportType}`, {
                params: {
                    academic_session_id: selectedSessionId,
                    start_date: startDate,
                    end_date: endDate,
                    transaction_id: searchTxnId,
                    search_date: searchDate,
                    page,
                    view_mode: viewMode,
                },
            });
            return res?.data ?? null;
        },
        enabled: Boolean(selectedSessionId || startDate),
        placeholderData: (previousData) => previousData,
    });

    const handleExport = (format: "excel" | "pdf" = "excel") => {
        const params = new URLSearchParams({
            format,
            is_export: "1",
            per_page: "100000",
            start_date: startDate,
            end_date: endDate,
            ...(selectedSessionId ? { academic_session_id: selectedSessionId } : {}),
            ...(viewMode ? { view_mode: viewMode } : {}),
        });
        window.open(`/api/v1/reports/${reportType}/export?${params.toString()}`, "_blank");
    };

    // Helper: Smart configuration for metric summary cards
    const getMetricConfig = (key: string) => {
        switch (key) {
            case "course_fees":
                return {
                    label: "Course & Tuition Fees",
                    icon: BookOpen,
                    accentColor: "text-blue-600 bg-blue-500/10 border-blue-500/20",
                    badge: "Core Tuition",
                    description: "Academic course collection",
                };
            case "admission_fees":
                return {
                    label: "Admission Fees",
                    icon: UserPlus,
                    accentColor: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
                    badge: "Admissions",
                    description: "Enrolment & registration",
                };
            case "transport_fees":
                return {
                    label: "Transport Fees",
                    icon: Bus,
                    accentColor: "text-amber-600 bg-amber-500/10 border-amber-500/20",
                    badge: "Transport",
                    description: "Bus fleet & transit fares",
                };
            case "hostel_fees":
                return {
                    label: "Hostel Fees",
                    icon: Building2,
                    accentColor: "text-purple-600 bg-purple-500/10 border-purple-500/20",
                    badge: "Boarding",
                    description: "Hostel rent & maintenance",
                };
            case "inventory_sales":
                return {
                    label: "Inventory Sales",
                    icon: ShoppingBag,
                    accentColor: "text-cyan-600 bg-cyan-500/10 border-cyan-500/20",
                    badge: "Store",
                    description: "Items, uniforms & kits",
                };
            case "grand_total":
                return {
                    label: "Grand Total Collected",
                    icon: Wallet,
                    accentColor: "text-indigo-600 bg-indigo-500/10 border-indigo-500/20",
                    badge: "Consolidated",
                    description: "Period total collected",
                    isHighlight: true,
                };
            case "received":
                return {
                    label: "Applications Received",
                    icon: FileText,
                    accentColor: "text-blue-600 bg-blue-500/10 border-blue-500/20",
                    badge: "Pipeline",
                    description: "Total submissions",
                };
            case "paid":
                return {
                    label: "Applications Paid",
                    icon: CheckCircle2,
                    accentColor: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
                    badge: "Paid",
                    description: "Paid applications",
                };
            case "enrolled":
                return {
                    label: "Students Enrolled",
                    icon: Users,
                    accentColor: "text-purple-600 bg-purple-500/10 border-purple-500/20",
                    badge: "Approved",
                    description: "Admitted into classes",
                };
            case "revenue":
                return {
                    label: "Total Revenue",
                    icon: IndianRupee,
                    accentColor: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
                    badge: "Revenue",
                    description: "Period collection sum",
                };
            case "conversion_rate":
                return {
                    label: "Conversion Rate",
                    icon: TrendingUp,
                    accentColor: "text-amber-600 bg-amber-500/10 border-amber-500/20",
                    badge: "Rate",
                    description: "Enrolled vs Received",
                };
            case "total_outstanding":
                return {
                    label: "Total Outstanding",
                    icon: AlertCircle,
                    accentColor: "text-rose-600 bg-rose-500/10 border-rose-500/20",
                    badge: "Dues",
                    description: "Unpaid dues across students",
                };
            default:
                return {
                    label: key.replace(/_/g, " ").toUpperCase(),
                    icon: TrendingUp,
                    accentColor: "text-primary bg-primary/10 border-primary/20",
                    badge: "Metric",
                    description: "Period total",
                };
        }
    };

    const activeSessionDisplayName = activeSession
        ? `${activeSession.name}${activeSession.is_current ? " (Active)" : ""}`
        : "Session";

    return (
        <>
            <Head title="Overview" />

            <div className="flex flex-col gap-5 p-4 md:p-6 max-w-[1600px] mx-auto w-full">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <MainPageHeader
                        breadcrumbs={breadcrumbs}
                        icon={BarChart3}
                        title="Overview"
                        subtitle="Real-time institutional performance metrics, financial trends, and academic analytics."
                    />

                    {/* Active Session Pill & Live Indicator */}
                    <div className="flex items-center gap-2 self-start md:self-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border/70 text-xs font-semibold text-foreground shadow-xs">
                            <span className="size-2 rounded-full bg-emerald-500" />
                            Session: {activeSessionDisplayName}
                        </span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => refetch()}
                            disabled={isFetching}
                            className="h-8.5 px-2.5 rounded-lg border-border/70 text-xs gap-1.5 font-medium"
                        >
                            <RotateCw className={cn("size-3.5", isFetching && "animate-spin text-primary")} />
                            <span className="hidden sm:inline">Refresh</span>
                        </Button>
                    </div>
                </div>

                {/* Filter Card */}
                <AnalyticsFilterBar
                    guide={ANALYTICS_OVERVIEW_GUIDE}
                    title="Insights Search Filters"
                    actions={
                        <div className="flex items-center gap-2">
                            <Button
                                onClick={() => handleExport("excel")}
                                size="sm"
                                variant="outline"
                                className="h-8 px-2.5 rounded-lg border-border/70 text-xs font-semibold gap-1.5 text-foreground hover:bg-muted"
                            >
                                <FileSpreadsheet className="size-3.5 text-emerald-600" />
                                <span className="hidden sm:inline">Export Excel</span>
                                <span className="sm:hidden">Excel</span>
                            </Button>
                            <Button
                                onClick={() => handleExport("pdf")}
                                size="sm"
                                variant="outline"
                                className="h-8 px-2.5 rounded-lg border-border/70 text-xs font-semibold gap-1.5 text-foreground hover:bg-muted"
                            >
                                <FileDown className="size-3.5 text-rose-600" />
                                <span className="hidden sm:inline">Export PDF</span>
                                <span className="sm:hidden">PDF</span>
                            </Button>
                        </div>
                    }
                    footer={
                        <div className="pt-3 border-t border-border/50 flex flex-wrap items-center justify-between gap-3">
                            {/* Presets Segmented Control */}
                            <div className="flex flex-wrap items-center gap-1">
                                <span className="text-[11px] font-semibold text-muted-foreground mr-1.5 flex items-center gap-1">
                                    <Calendar className="size-3 text-muted-foreground" />
                                    Presets:
                                </span>
                                {[
                                    { key: "session", label: "Session YTD" },
                                    { key: "full_session", label: "Full Session (12 Mo)" },
                                    { key: "this_month", label: "This Month" },
                                    { key: "last_30_days", label: "Last 30 Days" },
                                    { key: "all_time", label: "All Time" },
                                ].map((p) => (
                                    <button
                                        key={p.key}
                                        type="button"
                                        onClick={() => applyPreset(p.key)}
                                        className={cn(
                                            "px-2.5 py-1 text-xs rounded-md transition-all font-medium",
                                            activePreset === p.key
                                                ? "bg-foreground text-background font-semibold shadow-xs"
                                                : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                                        )}
                                    >
                                        {p.label}
                                    </button>
                                ))}
                            </div>

                            {/* Range Summary */}
                            <div className="text-[11px] font-medium text-muted-foreground">
                                Showing:{" "}
                                <span className="font-semibold text-foreground">
                                    {startDate || "Start"} to {endDate || "Today"}
                                </span>
                            </div>
                        </div>
                    }
                >
                    {/* Filter 1: Report Type */}
                    <AnalyticsFilterItem label="Report Type">
                        <Select value={reportType} onValueChange={setReportType}>
                            <SelectTrigger className="h-10 rounded-xl border-border/70 bg-background text-xs font-medium focus:ring-primary/20">
                                <SelectValue placeholder="Select Report" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                <Each
                                    of={REPORT_TYPES}
                                    render={(type) => (
                                        <SelectItem value={type.value} className="text-xs rounded-lg m-1">
                                            {type.label}
                                        </SelectItem>
                                    )}
                                />
                            </SelectContent>
                        </Select>
                    </AnalyticsFilterItem>

                    {/* Filter 2: Academic Session */}
                    <AnalyticsFilterItem label="Academic Session">
                        <Select
                            value={selectedSessionId || (activeSession ? String(activeSession.id) : "")}
                            onValueChange={handleSessionChange}
                        >
                            <SelectTrigger className="h-10 rounded-xl border-border/70 bg-background text-xs font-medium focus:ring-primary/20">
                                <SelectValue placeholder="Select Session" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                {academicSessions.map((s: any) => (
                                    <SelectItem key={s.id} value={String(s.id)} className="text-xs rounded-lg m-1">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">{s.name}</span>
                                            {s.is_current && (
                                                <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-emerald-500/10 text-emerald-600">
                                                    Active
                                                </span>
                                            )}
                                        </div>
                                    </SelectItem>
                                ))}
                                <SelectItem value="all" className="text-xs rounded-lg m-1 font-medium">
                                    All Sessions (Cumulative)
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </AnalyticsFilterItem>

                    {/* Filter 3: Start Date */}
                    <AnalyticsFilterItem label="Start Date">
                        <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => {
                                setStartDate(e.target.value);
                                setActivePreset("custom");
                            }}
                            className="h-10 rounded-xl border-border/70 bg-background text-xs focus-visible:ring-primary/20"
                        />
                    </AnalyticsFilterItem>

                    {/* Filter 4: End Date */}
                    <AnalyticsFilterItem label="End Date">
                        <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => {
                                setEndDate(e.target.value);
                                setActivePreset("custom");
                            }}
                            className="h-10 rounded-xl border-border/70 bg-background text-xs focus-visible:ring-primary/20"
                        />
                    </AnalyticsFilterItem>
                </AnalyticsFilterBar>

                {/* Main Data Section */}
                {reportData && (
                    <div className="flex flex-col gap-6">
                        {/* Executive Summary Cards */}
                        {reportData.data?.summary && (
                            <div className="space-y-2.5">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                        Executive Performance Metrics
                                    </h3>
                                    {isFetching && (
                                        <span className="text-[11px] text-muted-foreground animate-pulse">
                                            Updating...
                                        </span>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
                                    {Object.entries(reportData.data.summary).map(([key, value]) => {
                                        const config = getMetricConfig(key);
                                        const IconComponent = config.icon;

                                        const isCurrency = [
                                            "fees",
                                            "revenue",
                                            "total",
                                            "sales",
                                            "grand_total",
                                            "amount",
                                            "outstanding",
                                        ].some((k) => key.includes(k));
                                        const isPercentage = ["rate", "percentage"].some((k) => key.includes(k));

                                        let formattedValue = "";
                                        if (isCurrency) {
                                            formattedValue = `₹${(Number(value) || 0).toLocaleString("en-IN", {
                                                minimumFractionDigits: 2,
                                                maximumFractionDigits: 2,
                                            })}`;
                                        } else if (isPercentage) {
                                            formattedValue = `${Number(value) || 0}%`;
                                        } else {
                                            formattedValue = (Number(value) || 0).toLocaleString("en-IN");
                                        }

                                        return (
                                            <div
                                                key={key}
                                                className={cn(
                                                    "rounded-xl border p-4 transition-all duration-150 flex flex-col justify-between shadow-xs bg-card",
                                                    config.isHighlight
                                                        ? "border-primary/40 bg-primary/[0.02]"
                                                        : "border-border/70 hover:border-border"
                                                )}
                                            >
                                                <div className="flex items-start justify-between gap-2 mb-2.5">
                                                    <span className="text-[11px] font-semibold text-muted-foreground leading-tight">
                                                        {config.label}
                                                    </span>
                                                    <div
                                                        className={cn(
                                                            "size-7 shrink-0 rounded-lg flex items-center justify-center border",
                                                            config.accentColor
                                                        )}
                                                    >
                                                        <IconComponent className="size-3.5" />
                                                    </div>
                                                </div>

                                                <div className="space-y-1">
                                                    <div className="text-xl font-black tracking-tight text-foreground tabular-nums">
                                                        {formattedValue}
                                                    </div>
                                                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                                                        <span>{config.description}</span>
                                                        {config.badge && (
                                                            <span className="font-semibold text-foreground/70">
                                                                {config.badge}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Charts Row */}
                        {(reportData.data?.daily_trend ||
                            reportData.data?.breakdown ||
                            reportData.data?.stream_distribution) && (
                            <div id="analytics-charts" className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {reportData.data?.daily_trend && (
                                    <ChartLineDefault
                                        chartData={reportData.data.daily_trend}
                                        xAxisKey="date"
                                        yAxisKey="total"
                                        title="Daily Collection Trend"
                                        subText="Daily movement across the selected session and date range"
                                    />
                                )}
                                {reportData.data?.breakdown && (
                                    <ChartBarDefault
                                        chartData={reportData.data.breakdown}
                                        xAxisKey="name"
                                        yAxisKey="total"
                                        title="Revenue Distribution"
                                        subText="Collection breakdown across Tuition, Admissions, Transport & Hostel"
                                    />
                                )}
                                {reportData.data?.stream_distribution && !reportData.data?.breakdown && (
                                    <ChartBarDefault
                                        chartData={reportData.data.stream_distribution}
                                        xAxisKey="name"
                                        yAxisKey="total"
                                        title="Stream Distribution"
                                        subText="Candidate enrollment distribution across streams"
                                    />
                                )}
                            </div>
                        )}

                        {/* Data Table */}
                        {reportData.headers && reportData.data?.items && (
                            <article
                                id="analytics-table"
                                className="rounded-2xl border border-border/70 bg-card p-5 md:p-6 shadow-xs overflow-hidden"
                            >
                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
                                    <div className="space-y-1">
                                        <h3 className="text-base font-bold tracking-tight text-foreground">
                                            Detailed Records & Ledger
                                        </h3>
                                        <p className="text-xs text-muted-foreground">
                                            Historical ledger items for the selected academic session and timeframe
                                        </p>
                                    </div>
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                                        {/* Toggle daily vs monthly if available */}
                                        {reportType === "financial-collection" && (
                                            <div className="flex bg-muted/60 p-0.5 rounded-lg border border-border/50 text-xs">
                                                <button
                                                    type="button"
                                                    onClick={() => setViewMode("daily")}
                                                    className={cn(
                                                        "px-3 py-1.5 font-medium rounded-md transition-all",
                                                        viewMode === "daily"
                                                            ? "bg-background shadow-xs text-foreground font-semibold"
                                                            : "text-muted-foreground hover:text-foreground"
                                                    )}
                                                >
                                                    Daily Transactions
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setViewMode("monthly")}
                                                    className={cn(
                                                        "px-3 py-1.5 font-medium rounded-md transition-all",
                                                        viewMode === "monthly"
                                                            ? "bg-background shadow-xs text-foreground font-semibold"
                                                            : "text-muted-foreground hover:text-foreground"
                                                    )}
                                                >
                                                    Monthly Ledger
                                                </button>
                                            </div>
                                        )}

                                        {viewMode === "daily" && (
                                            <FilterBar
                                                values={{
                                                    transaction_id: searchTxnId,
                                                    search_date: searchDate,
                                                }}
                                                onChange={(updates) => {
                                                    if ("transaction_id" in updates)
                                                        setSearchTxnId(updates.transaction_id);
                                                    if ("search_date" in updates)
                                                        setSearchDate(updates.search_date);
                                                }}
                                                className="w-full sm:w-auto"
                                            >
                                                <FilterBar.Renderer
                                                    config={{
                                                        search: {
                                                            name: "transaction_id",
                                                            placeholder: "Search TXN ID / Student...",
                                                        },
                                                        filters: [
                                                            {
                                                                name: "search_date",
                                                                type: "date",
                                                                label: "Payment Date",
                                                                tooltip: "Filter by exact payment date",
                                                            },
                                                        ],
                                                    }}
                                                />
                                            </FilterBar>
                                        )}
                                    </div>
                                </div>

                                <div className="border border-border/70 rounded-xl overflow-hidden">
                                    <GenericReportTable
                                        columns={reportData.headers || []}
                                        data={reportData.data?.items || []}
                                        isLoading={isLoading}
                                        pagination={reportData.data?.pagination}
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
