import React, { useState, useMemo } from "react";
import { Head, Link } from "@inertiajs/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PageLoader } from "@/components/shared/PageLoader";
import { PermissionGate } from "@/components/PermissionGate";
import {
  ArrowLeft,
  Calendar,
  Fuel,
  Gauge,
  IndianRupee,
  Navigation,
  Pencil,
  Plus,
  Trash2,
  TrendingUp,
  Wrench,
  FileText,
  AlertTriangle,
  Receipt,
  FileSpreadsheet,
  Search,
  RotateCcw,
  ShieldCheck,
  History,
  Activity,
  CheckCircle2,
  Clock,
  Car,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import transportApi from "@/lib/api/transportApi";
import { TransportTripLogDialog } from "@/components/admin/transportTripLogDialog";
import { TransportFuelDialog } from "@/components/admin/transportFuelDialog";
import { TransportExpenseDialog } from "@/components/admin/transportExpenseDialog";
import { TransportVehicleDialog } from "@/components/admin/transportVehicleDialog";
import { toast } from "sonner";

interface PageProps {
  id: number;
}

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#6366f1"];

const TransportVehicleShow = ({ id }: PageProps) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("trips");

  // Filter States for Trips
  const [tripSearch, setTripSearch] = useState("");
  const [tripFromDate, setTripFromDate] = useState("");
  const [tripToDate, setTripToDate] = useState("");
  const [tripStatus, setTripStatus] = useState("all");

  // Filter States for Fuels
  const [fuelSearch, setFuelSearch] = useState("");
  const [fuelFromDate, setFuelFromDate] = useState("");
  const [fuelToDate, setFuelToDate] = useState("");
  const [fuelTypeFilter, setFuelTypeFilter] = useState("all");

  // Filter States for Expenses
  const [expenseSearch, setExpenseSearch] = useState("");
  const [expenseFromDate, setExpenseFromDate] = useState("");
  const [expenseToDate, setExpenseToDate] = useState("");
  const [expenseCategoryFilter, setExpenseCategoryFilter] = useState("all");

  // Dialog states
  const [tripDialogOpen, setTripDialogOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);

  const [fuelDialogOpen, setFuelDialogOpen] = useState(false);
  const [selectedFuel, setSelectedFuel] = useState<any>(null);

  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);

  const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);

  // Delete confirm states
  const [deleteConfirm, setDeleteConfirm] = useState<{
    open: boolean;
    type: "trip" | "fuel" | "expense";
    id: number;
    title: string;
  }>({
    open: false,
    type: "trip",
    id: 0,
    title: "",
  });

  // Fetch Vehicle Analytics & Details
  const { data: analyticsRes, isLoading } = useQuery({
    queryKey: ["transport-vehicle-analytics", id],
    queryFn: () => transportApi.analytics.vehicle(id),
  });

  // Fetch Trips with filters
  const tripParams = useMemo(() => {
    const p: Record<string, any> = { transport_vehicle_id: id, per_page: 100 };
    if (tripSearch) p.search = tripSearch;
    if (tripFromDate) p.from_date = tripFromDate;
    if (tripToDate) p.to_date = tripToDate;
    if (tripStatus && tripStatus !== "all") p.status = tripStatus;
    return p;
  }, [id, tripSearch, tripFromDate, tripToDate, tripStatus]);

  const { data: tripsRes, isLoading: isLoadingTrips } = useQuery({
    queryKey: ["transport-vehicle-logs", tripParams],
    queryFn: () => transportApi.vehicleLogs.index(tripParams),
  });

  // Fetch Fuel logs with filters
  const fuelParams = useMemo(() => {
    const p: Record<string, any> = { transport_vehicle_id: id, per_page: 100 };
    if (fuelSearch) p.search = fuelSearch;
    if (fuelFromDate) p.from_date = fuelFromDate;
    if (fuelToDate) p.to_date = fuelToDate;
    if (fuelTypeFilter && fuelTypeFilter !== "all") p.fuel_type = fuelTypeFilter;
    return p;
  }, [id, fuelSearch, fuelFromDate, fuelToDate, fuelTypeFilter]);

  const { data: fuelsRes, isLoading: isLoadingFuels } = useQuery({
    queryKey: ["transport-vehicle-fuels", fuelParams],
    queryFn: () => transportApi.vehicleFuels.index(fuelParams),
  });

  // Fetch Expenses with filters
  const expenseParams = useMemo(() => {
    const p: Record<string, any> = { transport_vehicle_id: id, per_page: 100 };
    if (expenseSearch) p.search = expenseSearch;
    if (expenseFromDate) p.from_date = expenseFromDate;
    if (expenseToDate) p.to_date = expenseToDate;
    if (expenseCategoryFilter && expenseCategoryFilter !== "all") p.category = expenseCategoryFilter;
    return p;
  }, [id, expenseSearch, expenseFromDate, expenseToDate, expenseCategoryFilter]);

  const { data: expensesRes, isLoading: isLoadingExpenses } = useQuery({
    queryKey: ["transport-vehicle-expenses", expenseParams],
    queryFn: () => transportApi.vehicleExpenses.index(expenseParams),
  });

  // Fetch Audit Logs for this vehicle
  const { data: auditLogsRes, isLoading: isLoadingAudits } = useQuery({
    queryKey: ["transport-vehicle-audit-logs", id],
    queryFn: () => transportApi.analytics.auditLogs(id),
    enabled: activeTab === "audit",
  });

  // Delete Mutations
  const deleteTripMutation = useMutation({
    mutationFn: (tripId: number) => transportApi.vehicleLogs.destroy(tripId),
    onSuccess: () => {
      toast.success("Trip log deleted");
      queryClient.invalidateQueries({ queryKey: ["transport-vehicle-logs"] });
      queryClient.invalidateQueries({ queryKey: ["transport-vehicle-analytics", id] });
      setDeleteConfirm((prev) => ({ ...prev, open: false }));
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Delete failed"),
  });

  const deleteFuelMutation = useMutation({
    mutationFn: (fuelId: number) => transportApi.vehicleFuels.destroy(fuelId),
    onSuccess: () => {
      toast.success("Fuel record deleted");
      queryClient.invalidateQueries({ queryKey: ["transport-vehicle-fuels"] });
      queryClient.invalidateQueries({ queryKey: ["transport-vehicle-analytics", id] });
      setDeleteConfirm((prev) => ({ ...prev, open: false }));
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Delete failed"),
  });

  const deleteExpenseMutation = useMutation({
    mutationFn: (expenseId: number) => transportApi.vehicleExpenses.destroy(expenseId),
    onSuccess: () => {
      toast.success("Expense record deleted");
      queryClient.invalidateQueries({ queryKey: ["transport-vehicle-expenses"] });
      queryClient.invalidateQueries({ queryKey: ["transport-vehicle-analytics", id] });
      setDeleteConfirm((prev) => ({ ...prev, open: false }));
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Delete failed"),
  });

  const handleDeleteConfirm = () => {
    if (deleteConfirm.type === "trip") deleteTripMutation.mutate(deleteConfirm.id);
    if (deleteConfirm.type === "fuel") deleteFuelMutation.mutate(deleteConfirm.id);
    if (deleteConfirm.type === "expense") deleteExpenseMutation.mutate(deleteConfirm.id);
  };

  // Excel Export Handlers
  const handleExportTrips = () => {
    const url = transportApi.vehicleLogs.exportUrl(tripParams);
    window.open(url, "_blank");
  };

  const handleExportFuels = () => {
    const url = transportApi.vehicleFuels.exportUrl(fuelParams);
    window.open(url, "_blank");
  };

  const handleExportExpenses = () => {
    const url = transportApi.vehicleExpenses.exportUrl(expenseParams);
    window.open(url, "_blank");
  };

  if (isLoading) {
    return <PageLoader />;
  }

  const payload = analyticsRes?.data ?? analyticsRes;
  const vehicle = payload?.vehicle;
  const kpis = payload?.kpis ?? {};
  const compliance = payload?.compliance ?? {};
  const monthlyTrends = payload?.monthly_trends ?? [];
  const expenseBreakdown = payload?.expense_breakdown ?? [];
  const fuelHistory = payload?.fuel_history ?? [];

  const trips = (tripsRes?.data ?? []) as any[];
  const fuels = (fuelsRes?.data ?? []) as any[];
  const expenses = (expensesRes?.data ?? []) as any[];
  const audits = (auditLogsRes?.data ?? []) as any[];

  // Determine critical document expiries
  const criticalExpiries = Object.entries(compliance).filter(([_, val]: [string, any]) => {
    return val?.status === "expired" || val?.status === "expiring_soon";
  });

  return (
    <TooltipProvider>
      <Head title={`${vehicle?.registration_number ?? "Vehicle"} - Transport Fleet 360`} />

      {/* Dialogs */}
      <TransportTripLogDialog
        open={tripDialogOpen}
        onClose={() => {
          setTripDialogOpen(false);
          setSelectedTrip(null);
        }}
        data={selectedTrip}
        preselectedVehicleId={id}
      />

      <TransportFuelDialog
        open={fuelDialogOpen}
        onClose={() => {
          setFuelDialogOpen(false);
          setSelectedFuel(null);
        }}
        data={selectedFuel}
        preselectedVehicleId={id}
      />

      <TransportExpenseDialog
        open={expenseDialogOpen}
        onClose={() => {
          setExpenseDialogOpen(false);
          setSelectedExpense(null);
        }}
        data={selectedExpense}
        preselectedVehicleId={id}
      />

      <TransportVehicleDialog
        open={vehicleDialogOpen}
        onClose={() => setVehicleDialogOpen(false)}
        data={vehicle}
      />

      <ConfirmDialog
        open={deleteConfirm.open}
        onOpenChange={(open) => setDeleteConfirm((prev) => ({ ...prev, open }))}
        title={`Delete ${deleteConfirm.type.toUpperCase()}`}
        description={`Are you sure you want to delete this record (${deleteConfirm.title})?`}
        onConfirm={handleDeleteConfirm}
        isLoading={
          deleteTripMutation.isPending ||
          deleteFuelMutation.isPending ||
          deleteExpenseMutation.isPending
        }
        confirmText="Delete"
        variant="danger"
        confirmationKeyword="DELETE"
      />

      <div className="space-y-6 pb-12">
        {/* Top Header & Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/transport/vehicles">
              <Button variant="outline" size="icon" className="size-9 rounded-xl hover:bg-muted/60">
                <ArrowLeft className="size-4" />
              </Button>
            </Link>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight font-mono text-foreground">
                  {vehicle?.registration_number}
                </h1>
                <Badge
                  variant={vehicle?.status === "active" ? "default" : "secondary"}
                  className="capitalize font-medium text-xs px-2.5 py-0.5 rounded-md"
                >
                  {vehicle?.status}
                </Badge>
                <Badge variant="outline" className="capitalize text-xs font-medium px-2 py-0.5">
                  {vehicle?.vehicle_type}
                </Badge>
                <Badge
                  variant="outline"
                  className="capitalize text-xs font-medium bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 px-2 py-0.5"
                >
                  {vehicle?.fuel_type || "diesel"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {vehicle?.model_name ? <strong className="text-foreground">{vehicle.model_name}</strong> : "School Fleet Vehicle"}
                {vehicle?.capacity ? ` • ${vehicle.capacity} Seats Capacity` : ""}
                {vehicle?.transportRoute ? ` • Route: ${vehicle.transportRoute.name}` : ""}
                {vehicle?.transportDriver ? ` • Driver: ${vehicle.transportDriver.name}` : ""}
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <PermissionGate can="update_transport_vehicles">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedTrip(null);
                  setTripDialogOpen(true);
                }}
                className="gap-1.5 rounded-lg shadow-sm"
              >
                <Navigation className="size-3.5 text-primary" />
                <span>Log Trip</span>
              </Button>
            </PermissionGate>

            <PermissionGate can="update_transport_vehicles">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedFuel(null);
                  setFuelDialogOpen(true);
                }}
                className="gap-1.5 rounded-lg text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 shadow-sm border-emerald-500/30"
              >
                <Fuel className="size-3.5 text-emerald-600" />
                <span>Add Fuel</span>
              </Button>
            </PermissionGate>

            <PermissionGate can="update_transport_vehicles">
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedExpense(null);
                  setExpenseDialogOpen(true);
                }}
                className="gap-1.5 rounded-lg text-amber-700 hover:text-amber-800 dark:text-amber-400 shadow-sm border-amber-500/30"
              >
                <Wrench className="size-3.5 text-amber-600" />
                <span>Log Expense</span>
              </Button>
            </PermissionGate>

            <PermissionGate can="update_transport_vehicles">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setVehicleDialogOpen(true)}
                className="gap-1.5 rounded-lg shadow-sm"
              >
                <Pencil className="size-3.5" />
                <span>Edit Vehicle</span>
              </Button>
            </PermissionGate>
          </div>
        </div>

        {/* Expiry Warning Alert Banner */}
        {criticalExpiries.length > 0 && (
          <div className="rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-950/30 p-4 text-amber-900 dark:text-amber-200 flex items-start gap-3 shadow-sm">
            <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs sm:text-sm">
              <span className="font-semibold">Compliance Alert: </span>
              {criticalExpiries.map(([key, val]: [string, any], idx) => (
                <span key={key}>
                  {idx > 0 && ", "}
                  <strong className="capitalize">{key}</strong> ({val.status_label})
                </span>
              ))}
              . Please renew document to ensure full legal compliance.
            </div>
          </div>
        )}

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <Card className="p-3.5 space-y-1 bg-gradient-to-br from-background to-muted/40 shadow-sm border rounded-xl">
            <div className="flex items-center justify-between text-muted-foreground text-xs">
              <span>Current Meter</span>
              <Gauge className="size-4 text-primary" />
            </div>
            <div className="text-xl font-bold font-mono tracking-tight text-foreground">
              {Number(kpis.current_odometer || 0).toLocaleString()} <span className="text-xs font-normal text-muted-foreground">KM</span>
            </div>
            <div className="text-[11px] text-muted-foreground">Odometer reading</div>
          </Card>

          <Card className="p-3.5 space-y-1 bg-gradient-to-br from-background to-muted/40 shadow-sm border rounded-xl">
            <div className="flex items-center justify-between text-muted-foreground text-xs">
              <span>Total Distance</span>
              <Navigation className="size-4 text-blue-600" />
            </div>
            <div className="text-xl font-bold font-mono tracking-tight text-foreground">
              {Number(kpis.total_km_run || 0).toLocaleString()} <span className="text-xs font-normal text-muted-foreground">KM</span>
            </div>
            <div className="text-[11px] text-muted-foreground">Across {kpis.total_trips || 0} trips</div>
          </Card>

          <Card className="p-3.5 space-y-1 bg-gradient-to-br from-emerald-500/10 to-background shadow-sm border border-emerald-500/30 rounded-xl">
            <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 text-xs font-medium">
              <span>Avg Mileage</span>
              <Fuel className="size-4 text-emerald-600" />
            </div>
            <div className="text-xl font-bold font-mono tracking-tight text-emerald-700 dark:text-emerald-400">
              {kpis.avg_mileage ? `${kpis.avg_mileage} km/L` : "—"}
            </div>
            <div className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80">Fuel efficiency</div>
          </Card>

          <Card className="p-3.5 space-y-1 bg-gradient-to-br from-background to-muted/40 shadow-sm border rounded-xl">
            <div className="flex items-center justify-between text-muted-foreground text-xs">
              <span>Total Fuel Cost</span>
              <IndianRupee className="size-4 text-emerald-600" />
            </div>
            <div className="text-xl font-bold font-mono tracking-tight text-foreground">
              ₹{Number(kpis.total_fuel_cost || 0).toLocaleString()}
            </div>
            <div className="text-[11px] text-muted-foreground">{kpis.total_fuel_liters || 0} Liters filled</div>
          </Card>

          <Card className="p-3.5 space-y-1 bg-gradient-to-br from-background to-muted/40 shadow-sm border rounded-xl">
            <div className="flex items-center justify-between text-muted-foreground text-xs">
              <span>Maintenance</span>
              <Wrench className="size-4 text-amber-600" />
            </div>
            <div className="text-xl font-bold font-mono tracking-tight text-foreground">
              ₹{Number(kpis.total_expenses || 0).toLocaleString()}
            </div>
            <div className="text-[11px] text-muted-foreground">Repairs & services</div>
          </Card>

          <Card className="p-3.5 space-y-1 bg-gradient-to-br from-indigo-500/10 to-background shadow-sm border border-indigo-500/30 rounded-xl">
            <div className="flex items-center justify-between text-indigo-800 dark:text-indigo-300 text-xs font-medium">
              <span>Cost / KM</span>
              <TrendingUp className="size-4 text-indigo-600" />
            </div>
            <div className="text-xl font-bold font-mono tracking-tight text-indigo-700 dark:text-indigo-400">
              ₹{kpis.cost_per_km ?? 0} <span className="text-xs font-normal text-muted-foreground">/km</span>
            </div>
            <div className="text-[11px] text-indigo-700/80 dark:text-indigo-400/80">Operating cost</div>
          </Card>
        </div>

        {/* Beautiful, Non-Overlapping Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="bg-muted/40 p-1.5 rounded-2xl border flex flex-wrap items-center gap-1.5">
            <TabsList className="bg-transparent h-auto p-0 gap-1.5 flex flex-wrap justify-start border-0">
              <TabsTrigger
                value="trips"
                className="normal-case tracking-normal rounded-xl px-4 py-2 text-xs sm:text-sm font-medium transition-all gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
              >
                <Navigation className="size-3.5" />
                <span>Trip Logs</span>
                {trips.length > 0 && (
                  <Badge variant="secondary" className="px-1.5 py-0 text-[10px] h-4 rounded-full font-mono">
                    {trips.length}
                  </Badge>
                )}
              </TabsTrigger>

              <TabsTrigger
                value="fuel"
                className="normal-case tracking-normal rounded-xl px-4 py-2 text-xs sm:text-sm font-medium transition-all gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <Fuel className="size-3.5" />
                <span>Fuel & Mileage</span>
                {fuels.length > 0 && (
                  <Badge variant="secondary" className="px-1.5 py-0 text-[10px] h-4 rounded-full font-mono">
                    {fuels.length}
                  </Badge>
                )}
              </TabsTrigger>

              <TabsTrigger
                value="expenses"
                className="normal-case tracking-normal rounded-xl px-4 py-2 text-xs sm:text-sm font-medium transition-all gap-2 data-[state=active]:bg-amber-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <Wrench className="size-3.5" />
                <span>Maintenance</span>
                {expenses.length > 0 && (
                  <Badge variant="secondary" className="px-1.5 py-0 text-[10px] h-4 rounded-full font-mono">
                    {expenses.length}
                  </Badge>
                )}
              </TabsTrigger>

              <TabsTrigger
                value="compliance"
                className="normal-case tracking-normal rounded-xl px-4 py-2 text-xs sm:text-sm font-medium transition-all gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
              >
                <ShieldCheck className="size-3.5" />
                <span>Compliance</span>
              </TabsTrigger>

              <TabsTrigger
                value="analytics"
                className="normal-case tracking-normal rounded-xl px-4 py-2 text-xs sm:text-sm font-medium transition-all gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
              >
                <TrendingUp className="size-3.5" />
                <span>Analytics</span>
              </TabsTrigger>

              <TabsTrigger
                value="audit"
                className="normal-case tracking-normal rounded-xl px-4 py-2 text-xs sm:text-sm font-medium transition-all gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
              >
                <History className="size-3.5" />
                <span>Audit Logs</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB 1: TRIP LOGS WITH SEARCH, DATE FILTERS & EXPORT */}
          <TabsContent value="trips" className="space-y-4">
            <Card className="rounded-xl shadow-sm border">
              <CardHeader className="pb-3 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-base font-semibold">Daily Vehicle Running & Meter Logs</CardTitle>
                    <CardDescription className="text-xs">
                      Daily meter readings, running distance, and driver records
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <PermissionGate can="view_transport_vehicles">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleExportTrips}
                        className="gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                      >
                        <FileSpreadsheet className="size-3.5 text-emerald-600" />
                        <span>Export Excel</span>
                      </Button>
                    </PermissionGate>

                    <PermissionGate can="update_transport_vehicles">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedTrip(null);
                          setTripDialogOpen(true);
                        }}
                        className="gap-1.5 text-xs"
                      >
                        <Plus className="size-3.5" />
                        <span>Log Trip</span>
                      </Button>
                    </PermissionGate>
                  </div>
                </div>

                {/* Filter Bar for Trips */}
                <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                  <div className="relative">
                    <Search className="size-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                    <Input
                      placeholder="Search purpose / notes..."
                      value={tripSearch}
                      onChange={(e) => setTripSearch(e.target.value)}
                      className="h-8 text-xs pl-8"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap">From:</span>
                    <Input
                      type="date"
                      value={tripFromDate}
                      onChange={(e) => setTripFromDate(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap">To:</span>
                    <Input
                      type="date"
                      value={tripToDate}
                      onChange={(e) => setTripToDate(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>

                  <Select value={tripStatus} onValueChange={setTripStatus}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>

                  {(tripSearch || tripFromDate || tripToDate || tripStatus !== "all") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setTripSearch("");
                        setTripFromDate("");
                        setTripToDate("");
                        setTripStatus("all");
                      }}
                      className="h-8 text-xs gap-1 text-muted-foreground hover:text-foreground"
                    >
                      <RotateCcw className="size-3" />
                      <span>Reset Filters</span>
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-4">
                {isLoadingTrips ? (
                  <div className="py-10 text-center text-sm text-muted-foreground">Loading trip logs...</div>
                ) : trips.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground space-y-3">
                    <Navigation className="size-10 mx-auto opacity-30 text-primary" />
                    <p className="text-sm">No trip logs found matching filters.</p>
                  </div>
                ) : (
                  <div className="rounded-xl border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40">
                          <TableHead className="w-28">Trip Date</TableHead>
                          <TableHead>Purpose & Type</TableHead>
                          <TableHead>Driver</TableHead>
                          <TableHead>Route</TableHead>
                          <TableHead className="text-right">Start KM</TableHead>
                          <TableHead className="text-right">End KM</TableHead>
                          <TableHead className="text-right font-bold text-primary">Distance Run</TableHead>
                          <TableHead>Timings</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="w-20 text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {trips.map((t: any) => (
                          <TableRow key={t.id} className="hover:bg-muted/30">
                            <TableCell className="font-medium text-xs font-mono">
                              {t.log_date ? String(t.log_date).slice(0, 10) : "—"}
                            </TableCell>
                            <TableCell>
                              <div className="font-medium text-xs">{t.purpose || "Regular Run"}</div>
                              <span className="text-[10px] text-muted-foreground capitalize">{t.trip_type}</span>
                            </TableCell>
                            <TableCell className="text-xs">{t.transport_driver?.name ?? "—"}</TableCell>
                            <TableCell className="text-xs text-muted-foreground">{t.transport_route?.name ?? "—"}</TableCell>
                            <TableCell className="text-right font-mono text-xs">{Number(t.start_odometer).toLocaleString()}</TableCell>
                            <TableCell className="text-right font-mono text-xs">
                              {t.end_odometer ? Number(t.end_odometer).toLocaleString() : "—"}
                            </TableCell>
                            <TableCell className="text-right font-mono text-xs font-bold text-primary">
                              {t.total_km ? `${t.total_km} km` : "—"}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {t.start_time ? `${t.start_time.slice(0, 5)} - ${t.end_time ? t.end_time.slice(0, 5) : "..."}` : "—"}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={t.status === "completed" ? "default" : t.status === "in_progress" ? "outline" : "secondary"}
                                className="text-[10px] capitalize px-2 py-0.5"
                              >
                                {t.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                <PermissionGate can="update_transport_vehicles">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-7"
                                    onClick={() => {
                                      setSelectedTrip(t);
                                      setTripDialogOpen(true);
                                    }}
                                  >
                                    <Pencil className="size-3.5" />
                                  </Button>
                                </PermissionGate>
                                <PermissionGate can="delete_transport_vehicles">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-7 text-destructive hover:bg-destructive/10"
                                    onClick={() =>
                                      setDeleteConfirm({
                                        open: true,
                                        type: "trip",
                                        id: t.id,
                                        title: `${t.log_date} (${t.purpose || "Trip"})`,
                                      })
                                    }
                                  >
                                    <Trash2 className="size-3.5" />
                                  </Button>
                                </PermissionGate>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: FUEL LOGS & MILEAGE */}
          <TabsContent value="fuel" className="space-y-4">
            <Card className="rounded-xl shadow-sm border">
              <CardHeader className="pb-3 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-base font-semibold">Fuel Refills, Bills & Mileage History</CardTitle>
                    <CardDescription className="text-xs">
                      Petrol/Diesel refueling expenses, receipts, and tank-to-tank mileage
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <PermissionGate can="view_transport_vehicles">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleExportFuels}
                        className="gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                      >
                        <FileSpreadsheet className="size-3.5 text-emerald-600" />
                        <span>Export Excel</span>
                      </Button>
                    </PermissionGate>

                    <PermissionGate can="update_transport_vehicles">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedFuel(null);
                          setFuelDialogOpen(true);
                        }}
                        className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                      >
                        <Plus className="size-3.5" />
                        <span>Add Fuel Entry</span>
                      </Button>
                    </PermissionGate>
                  </div>
                </div>

                {/* Filter Bar for Fuels */}
                <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                  <div className="relative">
                    <Search className="size-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                    <Input
                      placeholder="Search pump / slip no..."
                      value={fuelSearch}
                      onChange={(e) => setFuelSearch(e.target.value)}
                      className="h-8 text-xs pl-8"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap">From:</span>
                    <Input
                      type="date"
                      value={fuelFromDate}
                      onChange={(e) => setFuelFromDate(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap">To:</span>
                    <Input
                      type="date"
                      value={fuelToDate}
                      onChange={(e) => setFuelToDate(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>

                  <Select value={fuelTypeFilter} onValueChange={setFuelTypeFilter}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Fuel Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Fuel Types</SelectItem>
                      <SelectItem value="diesel">Diesel</SelectItem>
                      <SelectItem value="petrol">Petrol</SelectItem>
                      <SelectItem value="cng">CNG</SelectItem>
                      <SelectItem value="electric">Electric</SelectItem>
                    </SelectContent>
                  </Select>

                  {(fuelSearch || fuelFromDate || fuelToDate || fuelTypeFilter !== "all") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFuelSearch("");
                        setFuelFromDate("");
                        setFuelToDate("");
                        setFuelTypeFilter("all");
                      }}
                      className="h-8 text-xs gap-1 text-muted-foreground hover:text-foreground"
                    >
                      <RotateCcw className="size-3" />
                      <span>Reset Filters</span>
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-4">
                {isLoadingFuels ? (
                  <div className="py-10 text-center text-sm text-muted-foreground">Loading fuel records...</div>
                ) : fuels.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground space-y-3">
                    <Fuel className="size-10 mx-auto opacity-30 text-emerald-600" />
                    <p className="text-sm">No fuel refill entries found matching filters.</p>
                  </div>
                ) : (
                  <div className="rounded-xl border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40">
                          <TableHead className="w-28">Refill Date</TableHead>
                          <TableHead className="text-right">Meter Reading</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead className="text-right">Quantity (L)</TableHead>
                          <TableHead className="text-right">Rate / L</TableHead>
                          <TableHead className="text-right font-bold text-emerald-700 dark:text-emerald-400">Total (₹)</TableHead>
                          <TableHead>Calculated Mileage</TableHead>
                          <TableHead>Petrol Pump / Slip</TableHead>
                          <TableHead className="text-center">Bill Receipt</TableHead>
                          <TableHead className="w-20 text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {fuels.map((f: any) => (
                          <TableRow key={f.id} className="hover:bg-muted/30">
                            <TableCell className="font-medium text-xs font-mono">
                              <div>{f.fuel_date ? String(f.fuel_date).slice(0, 10) : "—"}</div>
                              {f.fuel_time && <span className="text-[10px] text-muted-foreground">{f.fuel_time.slice(0, 5)}</span>}
                            </TableCell>
                            <TableCell className="text-right font-mono text-xs font-semibold">
                              {Number(f.odometer_reading).toLocaleString()} km
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize text-[10px] px-2 py-0.5">
                                {f.fuel_type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-mono text-xs font-semibold">
                              {Number(f.liters).toFixed(2)} L
                            </TableCell>
                            <TableCell className="text-right font-mono text-xs text-muted-foreground">
                              ₹{Number(f.rate_per_liter).toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">
                              ₹{Number(f.total_amount).toLocaleString()}
                            </TableCell>
                            <TableCell>
                              {f.calculated_mileage ? (
                                <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono text-xs border border-emerald-300 px-2 py-0.5">
                                  {f.calculated_mileage} km/L
                                </Badge>
                              ) : f.is_full_tank ? (
                                <span className="text-[11px] text-muted-foreground italic">Full Tank Baseline</span>
                              ) : (
                                <span className="text-[11px] text-muted-foreground italic">Partial refill</span>
                              )}
                            </TableCell>
                            <TableCell className="text-xs">
                              <div className="truncate max-w-[140px]" title={f.vendor_name || ""}>
                                {f.vendor_name || "—"}
                              </div>
                              {f.invoice_number && (
                                <span className="text-[10px] text-muted-foreground font-mono">Slip #{f.invoice_number}</span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {f.bill_url ? (
                                <a
                                  href={f.bill_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                                >
                                  <Receipt className="size-3.5 text-primary" />
                                  <span>View Bill</span>
                                </a>
                              ) : (
                                <span className="text-xs text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                <PermissionGate can="update_transport_vehicles">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-7"
                                    onClick={() => {
                                      setSelectedFuel(f);
                                      setFuelDialogOpen(true);
                                    }}
                                  >
                                    <Pencil className="size-3.5" />
                                  </Button>
                                </PermissionGate>
                                <PermissionGate can="delete_transport_vehicles">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-7 text-destructive hover:bg-destructive/10"
                                    onClick={() =>
                                      setDeleteConfirm({
                                        open: true,
                                        type: "fuel",
                                        id: f.id,
                                        title: `Refill ${f.fuel_date} (₹${f.total_amount})`,
                                      })
                                    }
                                  >
                                    <Trash2 className="size-3.5" />
                                  </Button>
                                </PermissionGate>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: MAINTENANCE & EXPENSES */}
          <TabsContent value="expenses" className="space-y-4">
            <Card className="rounded-xl shadow-sm border">
              <CardHeader className="pb-3 border-b">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-base font-semibold">Vehicle Maintenance & Service Records</CardTitle>
                    <CardDescription className="text-xs">
                      Periodic service bills, repairs, tyres, parts replacement, and next service alerts
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <PermissionGate can="view_transport_vehicles">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleExportExpenses}
                        className="gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                      >
                        <FileSpreadsheet className="size-3.5 text-emerald-600" />
                        <span>Export Excel</span>
                      </Button>
                    </PermissionGate>

                    <PermissionGate can="update_transport_vehicles">
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedExpense(null);
                          setExpenseDialogOpen(true);
                        }}
                        className="gap-1.5 text-xs bg-amber-600 hover:bg-amber-700 text-white"
                      >
                        <Plus className="size-3.5" />
                        <span>Log Expense</span>
                      </Button>
                    </PermissionGate>
                  </div>
                </div>

                {/* Filter Bar for Expenses */}
                <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                  <div className="relative">
                    <Search className="size-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                    <Input
                      placeholder="Search title / vendor..."
                      value={expenseSearch}
                      onChange={(e) => setExpenseSearch(e.target.value)}
                      className="h-8 text-xs pl-8"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap">From:</span>
                    <Input
                      type="date"
                      value={expenseFromDate}
                      onChange={(e) => setExpenseFromDate(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>

                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] text-muted-foreground whitespace-nowrap">To:</span>
                    <Input
                      type="date"
                      value={expenseToDate}
                      onChange={(e) => setExpenseToDate(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>

                  <Select value={expenseCategoryFilter} onValueChange={setExpenseCategoryFilter}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="maintenance">Maintenance / Service</SelectItem>
                      <SelectItem value="repair">Mechanical Repair</SelectItem>
                      <SelectItem value="tyre">Tyres & Alignment</SelectItem>
                      <SelectItem value="battery">Battery</SelectItem>
                      <SelectItem value="insurance">Insurance Premium</SelectItem>
                      <SelectItem value="puc">Pollution (PUC)</SelectItem>
                      <SelectItem value="fitness">Fitness Certificate</SelectItem>
                      <SelectItem value="road_tax">Road Tax / Permit</SelectItem>
                      <SelectItem value="toll">Toll & Parking</SelectItem>
                      <SelectItem value="other">Other Expense</SelectItem>
                    </SelectContent>
                  </Select>

                  {(expenseSearch || expenseFromDate || expenseToDate || expenseCategoryFilter !== "all") && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setExpenseSearch("");
                        setExpenseFromDate("");
                        setExpenseToDate("");
                        setExpenseCategoryFilter("all");
                      }}
                      className="h-8 text-xs gap-1 text-muted-foreground hover:text-foreground"
                    >
                      <RotateCcw className="size-3" />
                      <span>Reset Filters</span>
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-4">
                {isLoadingExpenses ? (
                  <div className="py-10 text-center text-sm text-muted-foreground">Loading expense records...</div>
                ) : expenses.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground space-y-3">
                    <Wrench className="size-10 mx-auto opacity-30 text-amber-600" />
                    <p className="text-sm">No expenses found matching filters.</p>
                  </div>
                ) : (
                  <div className="rounded-xl border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40">
                          <TableHead className="w-28">Expense Date</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Work / Description</TableHead>
                          <TableHead>Workshop / Vendor</TableHead>
                          <TableHead className="text-right">At Meter</TableHead>
                          <TableHead className="text-right font-bold text-amber-700 dark:text-amber-400">Amount (₹)</TableHead>
                          <TableHead>Next Service Due</TableHead>
                          <TableHead className="text-center">Invoice</TableHead>
                          <TableHead className="w-20 text-center">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {expenses.map((e: any) => (
                          <TableRow key={e.id} className="hover:bg-muted/30">
                            <TableCell className="font-medium text-xs font-mono">
                              {e.expense_date ? String(e.expense_date).slice(0, 10) : "—"}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize text-[10px] px-2 py-0.5">
                                {e.category}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="font-medium text-xs">{e.title}</div>
                              {e.notes && <div className="text-[10px] text-muted-foreground truncate max-w-xs">{e.notes}</div>}
                            </TableCell>
                            <TableCell className="text-xs">
                              <div>{e.vendor_name || "—"}</div>
                              {e.invoice_number && (
                                <span className="text-[10px] text-muted-foreground font-mono">Inv #{e.invoice_number}</span>
                              )}
                            </TableCell>
                            <TableCell className="text-right font-mono text-xs">
                              {e.odometer_reading ? `${Number(e.odometer_reading).toLocaleString()} km` : "—"}
                            </TableCell>
                            <TableCell className="text-right font-mono text-xs font-bold text-amber-700 dark:text-amber-400">
                              ₹{Number(e.amount).toLocaleString()}
                            </TableCell>
                            <TableCell className="text-xs">
                              {e.next_service_date || e.next_service_odometer ? (
                                <div className="space-y-0.5">
                                  {e.next_service_date && (
                                    <div className="font-medium text-xs text-primary">
                                      {String(e.next_service_date).slice(0, 10)}
                                    </div>
                                  )}
                                  {e.next_service_odometer && (
                                    <div className="text-[10px] text-muted-foreground font-mono">
                                      @ {Number(e.next_service_odometer).toLocaleString()} km
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {e.bill_url ? (
                                <a
                                  href={e.bill_url}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                                >
                                  <FileText className="size-3.5" />
                                  <span>View Bill</span>
                                </a>
                              ) : (
                                <span className="text-xs text-muted-foreground">—</span>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-1">
                                <PermissionGate can="update_transport_vehicles">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-7"
                                    onClick={() => {
                                      setSelectedExpense(e);
                                      setExpenseDialogOpen(true);
                                    }}
                                  >
                                    <Pencil className="size-3.5" />
                                  </Button>
                                </PermissionGate>
                                <PermissionGate can="delete_transport_vehicles">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="size-7 text-destructive hover:bg-destructive/10"
                                    onClick={() =>
                                      setDeleteConfirm({
                                        open: true,
                                        type: "expense",
                                        id: e.id,
                                        title: `${e.title} (₹${e.amount})`,
                                      })
                                    }
                                  >
                                    <Trash2 className="size-3.5" />
                                  </Button>
                                </PermissionGate>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4: COMPLIANCE & DOCUMENTS */}
          <TabsContent value="compliance" className="space-y-4">
            <Card className="rounded-xl shadow-sm border">
              <CardHeader className="flex flex-row items-center justify-between pb-3 border-b">
                <div>
                  <CardTitle className="text-base font-semibold">Regulatory Compliance & Document Expiry Tracking</CardTitle>
                  <CardDescription className="text-xs">
                    Legal validity dates for transport insurance, fitness certificate, and permits
                  </CardDescription>
                </div>
                <PermissionGate can="update_transport_vehicles">
                  <Button size="sm" variant="outline" onClick={() => setVehicleDialogOpen(true)} className="gap-1.5 text-xs">
                    <Pencil className="size-3.5" />
                    <span>Update Dates</span>
                  </Button>
                </PermissionGate>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Insurance Card */}
                  <div className="rounded-xl border p-4 space-y-2 bg-gradient-to-br from-background to-muted/30">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">Insurance Policy</span>
                      <Badge
                        variant={
                          compliance.insurance?.status === "valid"
                            ? "default"
                            : compliance.insurance?.status === "expiring_soon"
                            ? "destructive"
                            : "outline"
                        }
                        className={
                          compliance.insurance?.status === "valid"
                            ? "bg-emerald-600 text-white"
                            : compliance.insurance?.status === "expiring_soon"
                            ? "bg-amber-600 text-white"
                            : ""
                        }
                      >
                        {compliance.insurance?.status_label}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Policy Number: <span className="font-mono font-medium text-foreground">{vehicle?.insurance_policy_number || "Not added"}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Expiry Date: <span className="font-mono font-semibold text-foreground">{compliance.insurance?.date || "—"}</span>
                    </div>
                  </div>

                  {/* PUC Card */}
                  <div className="rounded-xl border p-4 space-y-2 bg-gradient-to-br from-background to-muted/30">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">Pollution (PUC)</span>
                      <Badge
                        variant={
                          compliance.puc?.status === "valid"
                            ? "default"
                            : compliance.puc?.status === "expiring_soon"
                            ? "destructive"
                            : "outline"
                        }
                        className={
                          compliance.puc?.status === "valid"
                            ? "bg-emerald-600 text-white"
                            : compliance.puc?.status === "expiring_soon"
                            ? "bg-amber-600 text-white"
                            : ""
                        }
                      >
                        {compliance.puc?.status_label}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      PUC Status: <span className="capitalize font-medium text-foreground">{compliance.puc?.status || "—"}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Expiry Date: <span className="font-mono font-semibold text-foreground">{compliance.puc?.date || "—"}</span>
                    </div>
                  </div>

                  {/* Fitness Card */}
                  <div className="rounded-xl border p-4 space-y-2 bg-gradient-to-br from-background to-muted/30">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">Fitness Certificate</span>
                      <Badge
                        variant={
                          compliance.fitness?.status === "valid"
                            ? "default"
                            : compliance.fitness?.status === "expiring_soon"
                            ? "destructive"
                            : "outline"
                        }
                        className={
                          compliance.fitness?.status === "valid"
                            ? "bg-emerald-600 text-white"
                            : compliance.fitness?.status === "expiring_soon"
                            ? "bg-amber-600 text-white"
                            : ""
                        }
                      >
                        {compliance.fitness?.status_label}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      RTO Fitness: <span className="capitalize font-medium text-foreground">{compliance.fitness?.status || "—"}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Expiry Date: <span className="font-mono font-semibold text-foreground">{compliance.fitness?.date || "—"}</span>
                    </div>
                  </div>

                  {/* School Bus Permit */}
                  <div className="rounded-xl border p-4 space-y-2 bg-gradient-to-br from-background to-muted/30">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">School Bus Permit</span>
                      <Badge
                        variant={
                          compliance.permit?.status === "valid"
                            ? "default"
                            : compliance.permit?.status === "expiring_soon"
                            ? "destructive"
                            : "outline"
                        }
                        className={
                          compliance.permit?.status === "valid"
                            ? "bg-emerald-600 text-white"
                            : compliance.permit?.status === "expiring_soon"
                            ? "bg-amber-600 text-white"
                            : ""
                        }
                      >
                        {compliance.permit?.status_label}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Permit Status: <span className="capitalize font-medium text-foreground">{compliance.permit?.status || "—"}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Expiry Date: <span className="font-mono font-semibold text-foreground">{compliance.permit?.date || "—"}</span>
                    </div>
                  </div>

                  {/* Road Tax */}
                  <div className="rounded-xl border p-4 space-y-2 bg-gradient-to-br from-background to-muted/30">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">Road Tax Validity</span>
                      <Badge
                        variant={
                          compliance.road_tax?.status === "valid"
                            ? "default"
                            : compliance.road_tax?.status === "expiring_soon"
                            ? "destructive"
                            : "outline"
                        }
                        className={
                          compliance.road_tax?.status === "valid"
                            ? "bg-emerald-600 text-white"
                            : compliance.road_tax?.status === "expiring_soon"
                            ? "bg-amber-600 text-white"
                            : ""
                        }
                      >
                        {compliance.road_tax?.status_label}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Tax Status: <span className="capitalize font-medium text-foreground">{compliance.road_tax?.status || "—"}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Expiry Date: <span className="font-mono font-semibold text-foreground">{compliance.road_tax?.date || "—"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 5: ANALYTICS & CHARTS */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="rounded-xl shadow-sm border">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Monthly Running Distance (KM)</CardTitle>
                  <CardDescription className="text-xs">Distance traveled by this vehicle over the last 6 months</CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <RechartsTooltip />
                      <Bar dataKey="distance_km" name="Distance (KM)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="rounded-xl shadow-sm border">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Monthly Expenditure (Fuel vs Maintenance)</CardTitle>
                  <CardDescription className="text-xs">Comparison of fuel and repair costs over time</CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyTrends}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <RechartsTooltip />
                      <Area type="monotone" dataKey="fuel_cost" name="Fuel (₹)" stroke="#10b981" fill="#10b981" fillOpacity={0.2} />
                      <Area type="monotone" dataKey="maintenance_cost" name="Maintenance (₹)" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} />
                      <Legend />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="rounded-xl shadow-sm border">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Mileage Trend (km/L)</CardTitle>
                  <CardDescription className="text-xs">Tank-to-tank fuel efficiency across recent refuels</CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  {fuelHistory.filter((f: any) => f.calculated_mileage > 0).length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                      Fill full tanks across at least 2 refuels to view mileage trend curve.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[...fuelHistory].reverse()}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="fuel_date" tick={{ fontSize: 11 }} />
                        <YAxis domain={['auto', 'auto']} tick={{ fontSize: 12 }} />
                        <RechartsTooltip />
                        <Line
                          type="monotone"
                          dataKey="calculated_mileage"
                          name="Mileage (km/L)"
                          stroke="#059669"
                          strokeWidth={2}
                          dot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>

              <Card className="rounded-xl shadow-sm border">
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Expense Category Breakdown</CardTitle>
                  <CardDescription className="text-xs">Distribution of maintenance & service costs</CardDescription>
                </CardHeader>
                <CardContent className="h-72">
                  {expenseBreakdown.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                      No expense records to analyze.
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={expenseBreakdown}
                          dataKey="amount"
                          nameKey="category"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ name, percent }: { name?: string; percent?: number }) => `${name || ''} (${((percent || 0) * 100).toFixed(0)}%)`}
                        >
                          {expenseBreakdown.map((_: any, index: number) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip formatter={(val: any) => `₹${Number(val).toLocaleString()}`} />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 6: AUDIT TRAIL LOGS */}
          <TabsContent value="audit" className="space-y-4">
            <Card className="rounded-xl shadow-sm border">
              <CardHeader className="pb-3 border-b">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <History className="size-4 text-primary" />
                  <span>Vehicle & Operations Audit Trail</span>
                </CardTitle>
                <CardDescription className="text-xs">
                  Detailed timeline of who created, updated, or modified vehicle details, trips, fuel entries, and expenses
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {isLoadingAudits ? (
                  <div className="py-10 text-center text-sm text-muted-foreground">Loading audit trail...</div>
                ) : audits.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground space-y-2">
                    <Activity className="size-8 mx-auto opacity-30 text-primary" />
                    <p className="text-sm">No audit activity logged for this vehicle yet.</p>
                  </div>
                ) : (
                  <div className="rounded-xl border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40">
                          <TableHead className="w-40">Date & Time</TableHead>
                          <TableHead>User</TableHead>
                          <TableHead>Entity / Module</TableHead>
                          <TableHead>Action</TableHead>
                          <TableHead>Changes / Values</TableHead>
                          <TableHead className="text-right">IP Address</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {audits.map((a: any) => {
                          const actionColor =
                            a.action === "created"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-300"
                              : a.action === "updated"
                              ? "bg-blue-50 text-blue-700 border-blue-300"
                              : "bg-red-50 text-red-700 border-red-300";

                          return (
                            <TableRow key={a.id} className="hover:bg-muted/30">
                              <TableCell className="font-mono text-xs text-muted-foreground">
                                {a.created_at ? new Date(a.created_at).toLocaleString() : "—"}
                              </TableCell>
                              <TableCell>
                                <div className="font-medium text-xs">{a.user?.name || "System"}</div>
                                <div className="text-[10px] text-muted-foreground">{a.user?.email || ""}</div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="text-[10px] font-mono">
                                  {a.entity_type}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className={`capitalize text-[10px] ${actionColor}`}>
                                  {a.action}
                                </Badge>
                              </TableCell>
                              <TableCell className="max-w-xs truncate text-[11px] font-mono text-muted-foreground">
                                {a.new_values ? JSON.stringify(a.new_values) : "—"}
                              </TableCell>
                              <TableCell className="text-right font-mono text-xs text-muted-foreground">
                                {a.ip_address || "—"}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </TooltipProvider>
  );
};

export default TransportVehicleShow;
