import React, { useState, useMemo } from "react";
import { Head } from "@inertiajs/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import type { BreadcrumbItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { PermissionGate } from "@/components/PermissionGate";
import { toast } from "sonner";
import gateSecurityApi from "@/lib/api/gateSecurityApi";
import { GatePassDialog } from "@/components/gate-security/GatePassDialog";
import { GatePassExitDialog } from "@/components/gate-security/GatePassExitDialog";
import { PrintGatePassModal } from "@/components/gate-security/PrintGatePassModal";
import {
  ShieldCheck,
  Plus,
  FileSpreadsheet,
  Search,
  RotateCcw,
  Clock,
  LogOut,
  Printer,
  Pencil,
  Trash2,
  Users,
  AlertTriangle,
  CheckCircle2,
  Car,
  UserCheck,
  Calendar,
  Building,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { format, formatDistanceToNow, parseISO, differenceInMinutes } from "date-fns";

const BREADCRUMBS: BreadcrumbItem[] = [
  { title: "Dashboard", href: "/dashboard" },
  { title: "Gate Security", href: "/gate-security" },
  { title: "Visitor Register", href: "/gate-security" },
];

export default function GateSecurityIndex() {
  const queryClient = useQueryClient();

  // Active status tab: 'all' | 'inside' | 'checked_out' | 'overstayed'
  const [activeTab, setActiveTab] = useState<string>("inside");

  // Filters
  const [search, setSearch] = useState("");
  const [visitorType, setVisitorType] = useState("all");
  const [gateName, setGateName] = useState("all");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState("15");

  // Dialog states
  const [entryDialogOpen, setEntryDialogOpen] = useState(false);
  const [selectedPassForEdit, setSelectedPassForEdit] = useState<any | null>(null);

  const [exitDialogOpen, setExitDialogOpen] = useState(false);
  const [selectedPassForExit, setSelectedPassForExit] = useState<any | null>(null);

  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [selectedPassForPrint, setSelectedPassForPrint] = useState<any | null>(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [passToDelete, setPassToDelete] = useState<any | null>(null);

  // Fetch KPI Analytics
  const {
    data: analyticsData,
    isLoading: loadingAnalytics,
    refetch: refetchAnalytics,
  } = useQuery({
    queryKey: ["gate-security-analytics"],
    queryFn: async () => {
      const res: any = await gateSecurityApi.passes.analytics();
      return res?.data ?? res;
    },
    refetchInterval: 30000, // Auto-refresh KPIs every 30s
  });

  // Query parameters for passes list
  const queryParams = useMemo(() => {
    const p: Record<string, unknown> = {
      page,
      per_page: perPage,
    };
    if (search.trim()) p.search = search.trim();
    if (visitorType !== "all") p.visitor_type = visitorType;
    if (gateName !== "all") p.gate_name = gateName;
    if (fromDate) p.from_date = fromDate;
    if (toDate) p.to_date = toDate;

    // Apply tab filter
    if (activeTab === "inside") {
      p.status = "inside";
    } else if (activeTab === "checked_out") {
      p.status = "checked_out";
    } else if (activeTab === "overstayed") {
      p.status = "inside";
      p.overstayed = true;
    }

    return p;
  }, [page, perPage, search, visitorType, gateName, fromDate, toDate, activeTab]);

  // Fetch Passes Data
  const {
    data: passesResponse,
    isLoading: loadingPasses,
    isFetching: fetchingPasses,
    refetch: refetchPasses,
  } = useQuery({
    queryKey: ["gate-security-passes", queryParams],
    queryFn: async () => {
      const res: any = await gateSecurityApi.passes.index(queryParams);
      return res;
    },
    refetchInterval: 20000, // Live poll every 20s
  });

  const passesList: any[] = Array.isArray(passesResponse)
    ? passesResponse
    : Array.isArray(passesResponse?.data)
    ? passesResponse.data
    : [];

  const pagination = passesResponse?.meta || {
    current_page: 1,
    last_page: 1,
    total: passesList.length,
    per_page: Number(perPage),
  };

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => gateSecurityApi.passes.destroy(id),
    onSuccess: () => {
      toast.success("Visitor gate pass deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["gate-security-passes"] });
      queryClient.invalidateQueries({ queryKey: ["gate-security-analytics"] });
      setDeleteConfirmOpen(false);
      setPassToDelete(null);
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete visitor pass");
    },
  });

  // Reset all filters
  const handleResetFilters = () => {
    setSearch("");
    setVisitorType("all");
    setGateName("all");
    setFromDate("");
    setToDate("");
    setPage(1);
  };

  // Set today filter helper
  const handleFilterToday = () => {
    const todayStr = format(new Date(), "yyyy-MM-dd");
    setFromDate(todayStr);
    setToDate(todayStr);
    setPage(1);
  };

  // Handle Export Excel
  const handleExportExcel = () => {
    const url = gateSecurityApi.passes.exportUrl({
      search: search.trim() || undefined,
      status: activeTab === "all" ? undefined : activeTab === "overstayed" ? "inside" : activeTab,
      visitor_type: visitorType === "all" ? undefined : visitorType,
      gate_name: gateName === "all" ? undefined : gateName,
      from_date: fromDate || undefined,
      to_date: toDate || undefined,
      overstayed: activeTab === "overstayed" ? true : undefined,
    });
    window.open(url, "_blank");
  };

  const handleRefreshAll = () => {
    refetchPasses();
    refetchAnalytics();
    toast.info("Register refreshed");
  };

  return (
    <PermissionGate can="view_gate_passes">
      <Head title="Gate Security & Visitor Register" />

      <div className="space-y-6">
        {/* Main Header */}
        <MainPageHeader
          breadcrumbs={BREADCRUMBS}
          icon={ShieldCheck}
          title="Gate Security & Visitor Register"
          subtitle="Maintain live school gate entries, visitor identification, one-click exit logging, and visitor slips."
        >
          <div className="flex flex-wrap items-center gap-2.5">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshAll}
              disabled={fetchingPasses}
              className="text-xs gap-1.5 h-9"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${fetchingPasses ? "animate-spin" : ""}`} />
              Refresh
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportExcel}
              className="text-xs gap-1.5 h-9 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-950"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              Export Excel (.xlsx)
            </Button>

            <PermissionGate can="create_gate_passes">
              <Button
                size="sm"
                onClick={() => {
                  setSelectedPassForEdit(null);
                  setEntryDialogOpen(true);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5 h-9 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                New Visitor Entry (Check-In)
              </Button>
            </PermissionGate>
          </div>
        </MainPageHeader>

        {/* Real-Time KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Card 1: Currently Inside Campus */}
          <Card
            onClick={() => setActiveTab("inside")}
            className={`cursor-pointer transition-all hover:shadow-md border-emerald-200 dark:border-emerald-900 ${
              activeTab === "inside" ? "ring-2 ring-emerald-500 bg-emerald-50/40 dark:bg-emerald-950/20" : ""
            }`}
          >
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Inside Campus
              </CardTitle>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                {loadingAnalytics ? "--" : analyticsData?.inside_campus ?? 0}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                <Users className="w-3 h-3 text-emerald-500" />
                Active visitors right now
              </p>
            </CardContent>
          </Card>

          {/* Card 2: Today's Total Entries */}
          <Card
            onClick={() => {
              handleFilterToday();
              setActiveTab("all");
            }}
            className="cursor-pointer transition-all hover:shadow-md"
          >
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Today Entries
              </CardTitle>
              <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-black text-foreground">
                {loadingAnalytics ? "--" : analyticsData?.today_entries ?? 0}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Total entries logged today
              </p>
            </CardContent>
          </Card>

          {/* Card 3: Checked Out Today */}
          <Card
            onClick={() => {
              handleFilterToday();
              setActiveTab("checked_out");
            }}
            className={`cursor-pointer transition-all hover:shadow-md ${
              activeTab === "checked_out" ? "ring-2 ring-primary" : ""
            }`}
          >
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Checked Out
              </CardTitle>
              <div className="w-8 h-8 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-black text-foreground">
                {loadingAnalytics ? "--" : analyticsData?.today_exits ?? 0}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Completed visits today
              </p>
            </CardContent>
          </Card>

          {/* Card 4: Overstayed (> 3 hours) */}
          <Card
            onClick={() => setActiveTab("overstayed")}
            className={`cursor-pointer transition-all hover:shadow-md border-amber-300 dark:border-amber-900 ${
              activeTab === "overstayed" ? "ring-2 ring-amber-500 bg-amber-50/40 dark:bg-amber-950/20" : ""
            }`}
          >
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider">
                Overstay (&gt; 3h)
              </CardTitle>
              <div className="w-8 h-8 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 flex items-center justify-center">
                <AlertTriangle className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-black text-amber-600 dark:text-amber-400">
                {loadingAnalytics ? "--" : analyticsData?.overstayed_count ?? 0}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Inside campus &gt; 3 hours
              </p>
            </CardContent>
          </Card>

          {/* Card 5: Vehicles Inside */}
          <Card className="hover:shadow-md transition-all">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Vehicles Inside
              </CardTitle>
              <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 flex items-center justify-center">
                <Car className="w-4 h-4" />
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
                {loadingAnalytics ? "--" : analyticsData?.vehicles_inside ?? 0}
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                2W & 4W vehicles parked
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Bar & Tabs */}
        <div className="space-y-3 bg-card border rounded-xl p-4 shadow-sm">
          {/* Top Row: Tabs + Search */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <Tabs
              value={activeTab}
              onValueChange={(val) => {
                setActiveTab(val);
                setPage(1);
              }}
              className="w-full md:w-auto"
            >
              <TabsList className="grid grid-cols-4 w-full md:w-[480px]">
                <TabsTrigger value="inside" className="text-xs gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  Inside ({loadingAnalytics ? "-" : analyticsData?.inside_campus ?? 0})
                </TabsTrigger>
                <TabsTrigger value="all" className="text-xs">
                  All ({loadingAnalytics ? "-" : analyticsData?.total_passes ?? 0})
                </TabsTrigger>
                <TabsTrigger value="checked_out" className="text-xs">
                  Checked Out
                </TabsTrigger>
                <TabsTrigger value="overstayed" className="text-xs gap-1 text-amber-600 dark:text-amber-400">
                  <AlertTriangle className="w-3 h-3" />
                  Overstay ({loadingAnalytics ? "-" : analyticsData?.overstayed_count ?? 0})
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Keyword Search */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search visitor, phone, pass #, vehicle..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-9 h-9 text-xs"
              />
            </div>
          </div>

          {/* Bottom Filter Row: Date Range, Visitor Type, Gate, Reset */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-2 border-t border-border/50">
            {/* From Date */}
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                From Date
              </label>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => {
                  setFromDate(e.target.value);
                  setPage(1);
                }}
                className="h-8 text-xs"
              />
            </div>

            {/* To Date */}
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                To Date
              </label>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => {
                  setToDate(e.target.value);
                  setPage(1);
                }}
                className="h-8 text-xs"
              />
            </div>

            {/* Visitor Type Filter */}
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                Visitor Category
              </label>
              <Select
                value={visitorType}
                onValueChange={(val) => {
                  setVisitorType(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="parent">Parent / Guardian</SelectItem>
                  <SelectItem value="vendor">Vendor / Supplier</SelectItem>
                  <SelectItem value="guest">Guest / Relative</SelectItem>
                  <SelectItem value="contractor">Contractor / Worker</SelectItem>
                  <SelectItem value="delivery">Delivery / Courier</SelectItem>
                  <SelectItem value="alumni">Alumni</SelectItem>
                  <SelectItem value="official">Official / Inspector</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Gate Filter */}
            <div>
              <label className="text-[11px] font-semibold text-muted-foreground block mb-1">
                Gate
              </label>
              <Select
                value={gateName}
                onValueChange={(val) => {
                  setGateName(val);
                  setPage(1);
                }}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="All Gates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Gates</SelectItem>
                  <SelectItem value="Main Gate">Main Gate</SelectItem>
                  <SelectItem value="Gate 2 (East)">Gate 2 (East)</SelectItem>
                  <SelectItem value="Gate 3 (Back)">Gate 3 (Back)</SelectItem>
                  <SelectItem value="Admin Gate">Admin Gate</SelectItem>
                  <SelectItem value="Hostel Gate">Hostel Gate</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quick Actions / Reset */}
            <div className="flex items-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleFilterToday}
                className="h-8 text-xs flex-1"
              >
                Today
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-8 text-xs text-muted-foreground hover:text-foreground"
                title="Reset All Filters"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Reset
              </Button>
            </div>
          </div>
        </div>

        {/* Master Visitors Data Table */}
        <div className="bg-card border rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="w-12 text-center text-xs">#</TableHead>
                  <TableHead className="text-xs">Pass No.</TableHead>
                  <TableHead className="text-xs">Visitor Info</TableHead>
                  <TableHead className="text-xs">Whom to Meet / Purpose</TableHead>
                  <TableHead className="text-xs">Gate & Vehicle</TableHead>
                  <TableHead className="text-xs">In Time / Stay Duration</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-right text-xs pr-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingPasses ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-12 text-sm text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <RefreshCw className="w-6 h-6 animate-spin text-primary" />
                        <span>Loading visitor register...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : passesList.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-16 text-muted-foreground">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <ShieldCheck className="w-10 h-10 text-muted-foreground/40 stroke-1" />
                        <p className="text-sm font-medium">No visitor records found</p>
                        <p className="text-xs text-muted-foreground max-w-sm">
                          {search || fromDate || visitorType !== "all"
                            ? "Try adjusting your search criteria or date filters."
                            : "Click 'New Visitor Entry' above to register your first visitor at the school gate."}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  passesList.map((pass: any, index: number) => {
                    const isInside =
                      pass.is_inside ??
                      (pass.status === "inside" || pass.status === "inside_campus");

                    // Duration calculation
                    let stayStr = "-";
                    let isOverstay = false;
                    try {
                      const rawTime = pass.entry_time || pass.check_in_at;
                      const entryTime = rawTime ? parseISO(rawTime) : new Date();
                      const rawExit = pass.exit_time || pass.check_out_at;
                      const endTime = rawExit ? parseISO(rawExit) : new Date();
                      const diffMins = differenceInMinutes(endTime, entryTime);
                      const hrs = Math.floor(diffMins / 60);
                      const mins = diffMins % 60;
                      stayStr = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
                      if (isInside && diffMins > 180) isOverstay = true;
                    } catch (e) {
                      stayStr = "-";
                    }

                    return (
                      <TableRow
                        key={pass.id}
                        className={`hover:bg-muted/30 transition-colors ${
                          isOverstay ? "bg-amber-50/50 dark:bg-amber-950/20" : ""
                        }`}
                      >
                        {/* Serial */}
                        <TableCell className="text-center text-xs font-mono text-muted-foreground">
                          {(pagination.current_page - 1) * pagination.per_page + index + 1}
                        </TableCell>

                        {/* Pass Number */}
                        <TableCell>
                          <div className="flex flex-col items-start gap-1">
                            <span
                              onClick={() => {
                                setSelectedPassForPrint(pass);
                                setPrintModalOpen(true);
                              }}
                              className="font-mono text-xs font-bold text-primary hover:underline cursor-pointer tracking-wider"
                            >
                              {pass.pass_number}
                            </span>
                            {pass.accompanying_count > 0 && (
                              <span className="text-[10px] text-muted-foreground">
                                +{pass.accompanying_count} person(s)
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* Visitor Info */}
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <div className="relative w-9 h-9 shrink-0">
                              <div className="w-9 h-9 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-border">
                                {pass.visitor_name?.charAt(0) || "V"}
                              </div>
                              {pass.photo_url && (
                                <img
                                  src={pass.photo_url}
                                  alt={pass.visitor_name}
                                  className="w-9 h-9 rounded-full object-cover border border-border absolute inset-0 bg-background"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).style.display = "none";
                                  }}
                                />
                              )}
                            </div>
                            <div>
                              <div className="font-semibold text-xs text-foreground flex items-center gap-1.5">
                                <span>{pass.visitor_name}</span>
                                <Badge
                                  variant="secondary"
                                  className="text-[9px] px-1.5 py-0 capitalize font-medium"
                                >
                                  {pass.visitor_type}
                                </Badge>
                              </div>
                              <div className="text-[11px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                <span>{pass.phone}</span>
                                {pass.id_proof_type && (
                                  <>
                                    <span>•</span>
                                    <span className="capitalize">
                                      {pass.id_proof_type.replace("_", " ")}: {pass.id_proof_number || "✓"}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </TableCell>

                        {/* Whom to Meet / Purpose */}
                        <TableCell>
                          <div className="space-y-0.5 max-w-[220px]">
                            <div className="text-xs font-semibold text-foreground truncate">
                              {pass.staff?.name ? (
                                <span className="flex items-center gap-1 text-primary">
                                  <UserCheck className="w-3 h-3 shrink-0" />
                                  {pass.staff.name}
                                </span>
                              ) : pass.student_name ? (
                                <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                                  <Users className="w-3 h-3 shrink-0" />
                                  {pass.student_name}
                                </span>
                              ) : (
                                <span className="text-muted-foreground flex items-center gap-1">
                                  <Building className="w-3 h-3 shrink-0" />
                                  Admin / General
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-muted-foreground truncate" title={pass.purpose}>
                              {pass.purpose}
                            </p>
                          </div>
                        </TableCell>

                        {/* Gate & Vehicle */}
                        <TableCell>
                          <div className="space-y-0.5 text-xs">
                            <span className="font-medium text-foreground block">
                              {pass.gate_name || "Main Gate"}
                            </span>
                            {pass.vehicle_number ? (
                              <span className="font-mono text-[11px] font-semibold text-foreground flex items-center gap-1">
                                <Car className="w-3 h-3 text-muted-foreground" />
                                {pass.vehicle_number}
                              </span>
                            ) : (
                              <span className="text-[10px] text-muted-foreground">Walk-in</span>
                            )}
                          </div>
                        </TableCell>

                        {/* In Time / Duration */}
                        <TableCell>
                          <div className="space-y-0.5 text-xs">
                            <div className="font-medium text-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3 text-muted-foreground" />
                              {(() => {
                                const rawTime = pass.entry_time || pass.check_in_at;
                                if (!rawTime) return "-";
                                try {
                                  return format(parseISO(rawTime), "hh:mm a, dd MMM");
                                } catch (e) {
                                  return String(rawTime);
                                }
                              })()}
                            </div>
                            <div className="text-[11px] flex items-center gap-1">
                              <span className="text-muted-foreground">Duration:</span>
                              <span
                                className={`font-semibold ${
                                  isOverstay
                                    ? "text-red-600 dark:text-red-400 animate-pulse"
                                    : "text-foreground"
                                }`}
                              >
                                {stayStr}
                              </span>
                              {isInside && (
                                <span className="text-[10px] text-muted-foreground">(Live)</span>
                              )}
                            </div>
                          </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell>
                          {isInside ? (
                            <div className="flex items-center gap-1.5">
                              <span className="relative flex h-2.5 w-2.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                              </span>
                              <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 text-[10px] font-semibold">
                                Inside Campus
                              </Badge>
                            </div>
                          ) : (
                            <Badge
                              variant="secondary"
                              className="text-[10px] font-normal text-muted-foreground"
                            >
                              Checked Out
                            </Badge>
                          )}
                        </TableCell>

                        {/* Actions */}
                        <TableCell className="text-right pr-4">
                          <div className="flex items-center justify-end gap-1.5">
                            {/* Fast Checkout Button */}
                            {isInside && (
                              <PermissionGate can="checkout_gate_passes">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    setSelectedPassForExit(pass);
                                    setExitDialogOpen(true);
                                  }}
                                  className="h-7 px-2 text-[11px] font-semibold text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-800 hover:bg-amber-50 dark:hover:bg-amber-950 gap-1"
                                >
                                  <LogOut className="w-3 h-3" />
                                  Exit
                                </Button>
                              </PermissionGate>
                            )}

                            {/* Print Badge Button */}
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      setSelectedPassForPrint(pass);
                                      setPrintModalOpen(true);
                                    }}
                                    className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                                  >
                                    <Printer className="w-3.5 h-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent side="top">Print Gate Pass Slip</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>

                            {/* Edit Button */}
                            <PermissionGate can="update_gate_passes">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => {
                                        setSelectedPassForEdit(pass);
                                        setEntryDialogOpen(true);
                                      }}
                                      className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                                    >
                                      <Pencil className="w-3.5 h-3.5" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent side="top">Edit Details</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </PermissionGate>

                            {/* Delete Button */}
                            <PermissionGate can="delete_gate_passes">
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() => {
                                        setPassToDelete(pass);
                                        setDeleteConfirmOpen(true);
                                      }}
                                      className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent side="top">Delete Pass</TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </PermissionGate>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination Controls */}
          {pagination.total > 0 && (
            <div className="p-4 border-t flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>
                  Showing {(pagination.current_page - 1) * pagination.per_page + 1} to{" "}
                  {Math.min(pagination.current_page * pagination.per_page, pagination.total)} of{" "}
                  <strong>{pagination.total}</strong> records
                </span>
                <Select value={perPage} onValueChange={(val) => setPerPage(val)}>
                  <SelectTrigger className="h-7 w-16 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
                <span>per page</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.current_page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="h-7 px-2.5 text-xs"
                >
                  Previous
                </Button>
                <span className="px-2 font-medium text-foreground">
                  Page {pagination.current_page} of {pagination.last_page}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.current_page >= pagination.last_page}
                  onClick={() => setPage((p) => Math.min(pagination.last_page, p + 1))}
                  className="h-7 px-2.5 text-xs"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Dialogs */}
        {/* 1. New / Edit Entry Dialog */}
        <GatePassDialog
          open={entryDialogOpen}
          onClose={(refresh) => {
            setEntryDialogOpen(false);
            setSelectedPassForEdit(null);
            if (refresh) {
              refetchPasses();
              refetchAnalytics();
            }
          }}
          passData={selectedPassForEdit}
        />

        {/* 2. Exit / Check-out Dialog */}
        <GatePassExitDialog
          open={exitDialogOpen}
          onClose={(refresh) => {
            setExitDialogOpen(false);
            setSelectedPassForExit(null);
            if (refresh) {
              refetchPasses();
              refetchAnalytics();
            }
          }}
          pass={selectedPassForExit}
        />

        {/* 3. Printable Gate Pass Modal */}
        <PrintGatePassModal
          open={printModalOpen}
          onClose={() => {
            setPrintModalOpen(false);
            setSelectedPassForPrint(null);
          }}
          pass={selectedPassForPrint}
        />

        {/* 4. Delete Confirmation Dialog */}
        <ConfirmDialog
          open={deleteConfirmOpen}
          onOpenChange={(open) => {
            if (!open) {
              setDeleteConfirmOpen(false);
              setPassToDelete(null);
            }
          }}
          onClose={() => {
            setDeleteConfirmOpen(false);
            setPassToDelete(null);
          }}
          onConfirm={() => {
            if (passToDelete?.id) {
              deleteMutation.mutate(passToDelete.id);
            }
          }}
          title="Delete Visitor Gate Pass"
          description={`Are you sure you want to delete pass ${passToDelete?.pass_number} for ${passToDelete?.visitor_name}? This action cannot be undone.`}
          confirmText="Delete Pass"
          variant="danger"
          isLoading={deleteMutation.isPending}
        />
      </div>
    </PermissionGate>
  );
}
