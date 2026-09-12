import React, { useState, useMemo } from "react";
import { Head, Link } from "@inertiajs/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DataTable, {
  TableEmptyState,
  TableSkeletonLoader,
} from "@/components/dataTable";
import Each from "@/components/Each";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FilterBar } from "@/components/filter-bar";
import { getSerialNumber } from "@/lib/utils";
import {
  Bus,
  Pencil,
  Plus,
  Trash2,
  Eye,
  Fuel,
  Navigation,
  Wrench,
  IndianRupee,
  AlertTriangle,
  FileText,
  TrendingUp,
  Receipt,
  Car,
  FileSpreadsheet,
  Search,
  RotateCcw,
  History,
  Activity,
  ShieldCheck,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import useSearchFilter from "@/hooks/useSearchfilter";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDisclosure } from "@/hooks/useDisclosure";
import transportApi from "@/lib/api/transportApi";
import { TransportVehicleDialog, type TransportVehicleDialogData } from "@/components/admin/transportVehicleDialog";
import { TransportTripLogDialog } from "@/components/admin/transportTripLogDialog";
import { TransportFuelDialog } from "@/components/admin/transportFuelDialog";
import { TransportExpenseDialog } from "@/components/admin/transportExpenseDialog";
import { PermissionGate } from "@/components/PermissionGate";
import {
  TRANSPORT_VEHICLES_BREADCRUMBS,
} from "@/constants/page/admin/transport";
import { useRegisterGuide } from "@/components/GuideProvider";
import { TRANSPORT_VEHICLES_GUIDE } from "@/constants/guides/transport";
import { toast } from "sonner";

const VEHICLE_COLUMNS = [
  { key: "serial", label: "#" },
  { key: "registration_number", label: "Registration" },
  { key: "model_name", label: "Model / Fuel" },
  { key: "capacity", label: "Capacity" },
  { key: "current_odometer", label: "Meter (KM)" },
  { key: "route_driver", label: "Route & Driver" },
  { key: "status", label: "Status" },
  { key: "action", label: "Actions" },
];

const INITIAL_FILTERS = { page: 1, per_page: 15, search: "", search_by: "registration_number" };

type VehicleRow = {
  id: number;
  registration_number: string;
  vehicle_type?: string;
  model_name?: string;
  fuel_type?: string;
  capacity?: number;
  current_odometer?: number;
  status?: string;
  transport_route_id?: number | null;
  transport_driver_id?: number | null;
  transport_route?: { id: number; name: string; code?: string };
  transport_driver?: { id: number; name: string; mobile?: string };
};

const TransportVehiclesIndex = () => {
  const queryClient = useQueryClient();
  useRegisterGuide(TRANSPORT_VEHICLES_GUIDE);

  const [activeTab, setActiveTab] = useState("vehicles");
  const { filter, handleFilter } = useSearchFilter(INITIAL_FILTERS);

  // Dialog Disclosures
  const vehicleDialog = useDisclosure<TransportVehicleDialogData>();
  const deleteDisclosure = useDisclosure<{ id: number; registration_number: string }>();

  // Quick Action Dialog states
  const [selectedVehicleForAction, setSelectedVehicleForAction] = useState<number | undefined>(undefined);
  const [tripDialogOpen, setTripDialogOpen] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);

  const [fuelDialogOpen, setFuelDialogOpen] = useState(false);
  const [selectedFuel, setSelectedFuel] = useState<any>(null);

  const [expenseDialogOpen, setExpenseDialogOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);

  // Record delete confirmation (trips, fuels, expenses)
  const [deleteRecordConfirm, setDeleteRecordConfirm] = useState<{
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

  // Filter States for Trips Tab
  const [tripSearch, setTripSearch] = useState("");
  const [tripVehicleId, setTripVehicleId] = useState("all");
  const [tripFromDate, setTripFromDate] = useState("");
  const [tripToDate, setTripToDate] = useState("");
  const [tripStatus, setTripStatus] = useState("all");

  // Filter States for Fuel Tab
  const [fuelSearch, setFuelSearch] = useState("");
  const [fuelVehicleId, setFuelVehicleId] = useState("all");
  const [fuelFromDate, setFuelFromDate] = useState("");
  const [fuelToDate, setFuelToDate] = useState("");
  const [fuelTypeFilter, setFuelTypeFilter] = useState("all");

  // Filter States for Expenses Tab
  const [expenseSearch, setExpenseSearch] = useState("");
  const [expenseVehicleId, setExpenseVehicleId] = useState("all");
  const [expenseCategory, setExpenseCategory] = useState("all");
  const [expenseFromDate, setExpenseFromDate] = useState("");
  const [expenseToDate, setExpenseToDate] = useState("");

  // All Vehicles Lookup Query (for dropdown filtering)
  const { data: vehiclesLookupRes } = useQuery({
    queryKey: ["transport-vehicles-lookup"],
    queryFn: () => transportApi.vehicles.index({ per_page: 100 }),
  });
  const allVehicleOptions = (vehiclesLookupRes?.data ?? []) as VehicleRow[];

  // Fleet Analytics query
  const { data: fleetAnalyticsRes } = useQuery({
    queryKey: ["transport-fleet-analytics"],
    queryFn: () => transportApi.analytics.fleet(),
  });

  // Vehicles list query
  const { data: vehiclesData, isLoading: isLoadingVehicles } = useQuery({
    queryKey: ["transport-vehicles", filter],
    queryFn: () => transportApi.vehicles.index(filter),
  });

  // Trips Query with Filters
  const tripParams = useMemo(() => {
    const p: Record<string, any> = { per_page: 50 };
    if (tripSearch.trim()) p.search = tripSearch.trim();
    if (tripVehicleId && tripVehicleId !== "all") p.transport_vehicle_id = tripVehicleId;
    if (tripFromDate) p.from_date = tripFromDate;
    if (tripToDate) p.to_date = tripToDate;
    if (tripStatus && tripStatus !== "all") p.status = tripStatus;
    return p;
  }, [tripSearch, tripVehicleId, tripFromDate, tripToDate, tripStatus]);

  const { data: allTripsRes, isLoading: isLoadingTrips } = useQuery({
    queryKey: ["transport-all-trips", tripParams],
    queryFn: () => transportApi.vehicleLogs.index(tripParams),
    enabled: activeTab === "trips" || activeTab === "analytics",
  });

  // Fuel Refills Query with Filters
  const fuelParams = useMemo(() => {
    const p: Record<string, any> = { per_page: 50 };
    if (fuelSearch.trim()) p.search = fuelSearch.trim();
    if (fuelVehicleId && fuelVehicleId !== "all") p.transport_vehicle_id = fuelVehicleId;
    if (fuelFromDate) p.from_date = fuelFromDate;
    if (fuelToDate) p.to_date = fuelToDate;
    if (fuelTypeFilter && fuelTypeFilter !== "all") p.fuel_type = fuelTypeFilter;
    return p;
  }, [fuelSearch, fuelVehicleId, fuelFromDate, fuelToDate, fuelTypeFilter]);

  const { data: allFuelsRes, isLoading: isLoadingFuels } = useQuery({
    queryKey: ["transport-all-fuels", fuelParams],
    queryFn: () => transportApi.vehicleFuels.index(fuelParams),
    enabled: activeTab === "fuels" || activeTab === "analytics",
  });

  // Expenses Query with Filters
  const expenseParams = useMemo(() => {
    const p: Record<string, any> = { per_page: 50 };
    if (expenseSearch.trim()) p.search = expenseSearch.trim();
    if (expenseVehicleId && expenseVehicleId !== "all") p.transport_vehicle_id = expenseVehicleId;
    if (expenseCategory && expenseCategory !== "all") p.category = expenseCategory;
    if (expenseFromDate) p.from_date = expenseFromDate;
    if (expenseToDate) p.to_date = expenseToDate;
    return p;
  }, [expenseSearch, expenseVehicleId, expenseCategory, expenseFromDate, expenseToDate]);

  const { data: allExpensesRes, isLoading: isLoadingExpenses } = useQuery({
    queryKey: ["transport-all-expenses", expenseParams],
    queryFn: () => transportApi.vehicleExpenses.index(expenseParams),
    enabled: activeTab === "expenses" || activeTab === "analytics",
  });

  // Fleet Audit Logs Query
  const { data: fleetAuditsRes, isLoading: isLoadingAudits } = useQuery({
    queryKey: ["transport-fleet-audit-logs"],
    queryFn: () => transportApi.analytics.fleetAuditLogs(),
    enabled: activeTab === "audit",
  });

  // Vehicle Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => transportApi.vehicles.destroy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transport-vehicles"] });
      queryClient.invalidateQueries({ queryKey: ["transport-vehicles-lookup"] });
      queryClient.invalidateQueries({ queryKey: ["transport-fleet-analytics"] });
      toast.success("Vehicle deleted successfully");
      deleteDisclosure.onClose();
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to delete vehicle");
    },
  });

  // Trip Delete Mutation
  const deleteTripMutation = useMutation({
    mutationFn: (tripId: number) => transportApi.vehicleLogs.destroy(tripId),
    onSuccess: () => {
      toast.success("Trip log deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["transport-all-trips"] });
      queryClient.invalidateQueries({ queryKey: ["transport-fleet-analytics"] });
      setDeleteRecordConfirm((prev) => ({ ...prev, open: false }));
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to delete trip log"),
  });

  // Fuel Delete Mutation
  const deleteFuelMutation = useMutation({
    mutationFn: (fuelId: number) => transportApi.vehicleFuels.destroy(fuelId),
    onSuccess: () => {
      toast.success("Fuel record deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["transport-all-fuels"] });
      queryClient.invalidateQueries({ queryKey: ["transport-fleet-analytics"] });
      setDeleteRecordConfirm((prev) => ({ ...prev, open: false }));
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to delete fuel record"),
  });

  // Expense Delete Mutation
  const deleteExpenseMutation = useMutation({
    mutationFn: (expenseId: number) => transportApi.vehicleExpenses.destroy(expenseId),
    onSuccess: () => {
      toast.success("Expense record deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["transport-all-expenses"] });
      queryClient.invalidateQueries({ queryKey: ["transport-fleet-analytics"] });
      setDeleteRecordConfirm((prev) => ({ ...prev, open: false }));
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || "Failed to delete expense record"),
  });

  const handleDeleteRecordConfirm = () => {
    if (deleteRecordConfirm.type === "trip") deleteTripMutation.mutate(deleteRecordConfirm.id);
    if (deleteRecordConfirm.type === "fuel") deleteFuelMutation.mutate(deleteRecordConfirm.id);
    if (deleteRecordConfirm.type === "expense") deleteExpenseMutation.mutate(deleteRecordConfirm.id);
  };

  // Excel Export Handlers
  const handleExportVehicles = () => {
    window.open(transportApi.vehicles.exportUrl(filter), "_blank");
  };

  const handleExportTrips = () => {
    window.open(transportApi.vehicleLogs.exportUrl(tripParams), "_blank");
  };

  const handleExportFuels = () => {
    window.open(transportApi.vehicleFuels.exportUrl(fuelParams), "_blank");
  };

  const handleExportExpenses = () => {
    window.open(transportApi.vehicleExpenses.exportUrl(expenseParams), "_blank");
  };

  const fleetKpis = fleetAnalyticsRes?.data?.kpis ?? fleetAnalyticsRes?.kpis ?? {};
  const expiryAlerts = (fleetAnalyticsRes?.data?.expiry_alerts ?? fleetAnalyticsRes?.expiry_alerts ?? []) as any[];
  const monthlyTrends = (fleetAnalyticsRes?.data?.monthly_trends ?? fleetAnalyticsRes?.monthly_trends ?? []) as any[];
  const topVehicles = (fleetAnalyticsRes?.data?.top_vehicles_by_km ?? fleetAnalyticsRes?.top_vehicles_by_km ?? []) as any[];

  const rows = (vehiclesData?.data ?? []) as VehicleRow[];
  const trips = (allTripsRes?.data ?? []) as any[];
  const fuels = (allFuelsRes?.data ?? []) as any[];
  const expenses = (allExpensesRes?.data ?? []) as any[];
  const fleetAudits = (fleetAuditsRes?.data ?? []) as any[];

  return (
    <>
      <Head title="Transport Vehicles & Fleet Management" />

      {/* Dialogs */}
      <TransportVehicleDialog
        open={vehicleDialog.isOpen}
        onClose={() => vehicleDialog.onClose()}
        data={vehicleDialog.data ?? undefined}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["transport-vehicles"] });
          queryClient.invalidateQueries({ queryKey: ["transport-vehicles-lookup"] });
          queryClient.invalidateQueries({ queryKey: ["transport-fleet-analytics"] });
        }}
      />

      <TransportTripLogDialog
        open={tripDialogOpen}
        onClose={() => {
          setTripDialogOpen(false);
          setSelectedTrip(null);
          setSelectedVehicleForAction(undefined);
        }}
        data={selectedTrip}
        preselectedVehicleId={selectedVehicleForAction}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["transport-all-trips"] });
          queryClient.invalidateQueries({ queryKey: ["transport-fleet-analytics"] });
        }}
      />

      <TransportFuelDialog
        open={fuelDialogOpen}
        onClose={() => {
          setFuelDialogOpen(false);
          setSelectedFuel(null);
          setSelectedVehicleForAction(undefined);
        }}
        data={selectedFuel}
        preselectedVehicleId={selectedVehicleForAction}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["transport-all-fuels"] });
          queryClient.invalidateQueries({ queryKey: ["transport-fleet-analytics"] });
        }}
      />

      <TransportExpenseDialog
        open={expenseDialogOpen}
        onClose={() => {
          setExpenseDialogOpen(false);
          setSelectedExpense(null);
          setSelectedVehicleForAction(undefined);
        }}
        data={selectedExpense}
        preselectedVehicleId={selectedVehicleForAction}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["transport-all-expenses"] });
          queryClient.invalidateQueries({ queryKey: ["transport-fleet-analytics"] });
        }}
      />

      {/* Vehicle Delete Confirm Dialog */}
      <ConfirmDialog
        open={deleteDisclosure.isOpen}
        onOpenChange={deleteDisclosure.onClose}
        title="Delete Vehicle"
        description={`Are you sure you want to delete vehicle "${deleteDisclosure.data?.registration_number}"? Remove student assignments and logs first if any.`}
        onConfirm={() => deleteDisclosure.data && deleteMutation.mutate(deleteDisclosure.data.id)}
        isLoading={deleteMutation.isPending}
        confirmText="Delete"
        variant="danger"
        confirmationKeyword="DELETE"
      />

      {/* Records Delete Confirm Dialog */}
      <ConfirmDialog
        open={deleteRecordConfirm.open}
        onOpenChange={(open) => setDeleteRecordConfirm((prev) => ({ ...prev, open }))}
        title={`Delete ${deleteRecordConfirm.type.toUpperCase()} Record`}
        description={`Are you sure you want to delete this record (${deleteRecordConfirm.title})? This will also be recorded in the audit logs.`}
        onConfirm={handleDeleteRecordConfirm}
        isLoading={
          deleteTripMutation.isPending ||
          deleteFuelMutation.isPending ||
          deleteExpenseMutation.isPending
        }
        confirmText="Delete"
        variant="danger"
        confirmationKeyword="DELETE"
      />

      <TooltipProvider>
        <div className="space-y-6 pb-12">
          <MainPageHeader
            id="transport-vehicles-header"
            breadcrumbs={TRANSPORT_VEHICLES_BREADCRUMBS}
            icon={Bus}
            guidance={TRANSPORT_VEHICLES_GUIDE}
          />

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight">Fleet Management Hub</h2>
              <Badge variant="outline" className="font-mono text-xs">
                {fleetKpis.total_vehicles ?? rows.length} Vehicles
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <PermissionGate can="create_transport_vehicles">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedVehicleForAction(undefined);
                    setSelectedTrip(null);
                    setTripDialogOpen(true);
                  }}
                  className="gap-1.5"
                >
                  <Navigation className="size-4 text-primary" />
                  <span>Log Trip</span>
                </Button>
              </PermissionGate>

              <PermissionGate can="create_transport_vehicles">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedVehicleForAction(undefined);
                    setSelectedFuel(null);
                    setFuelDialogOpen(true);
                  }}
                  className="gap-1.5 text-emerald-700 hover:text-emerald-800 dark:text-emerald-400"
                >
                  <Fuel className="size-4 text-emerald-600" />
                  <span>Add Fuel</span>
                </Button>
              </PermissionGate>

              <PermissionGate can="create_transport_vehicles">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedVehicleForAction(undefined);
                    setSelectedExpense(null);
                    setExpenseDialogOpen(true);
                  }}
                  className="gap-1.5 text-amber-700 hover:text-amber-800 dark:text-amber-400"
                >
                  <Wrench className="size-4 text-amber-600" />
                  <span>Log Expense</span>
                </Button>
              </PermissionGate>

              <PermissionGate can="create_transport_vehicles">
                <Button size="sm" onClick={() => vehicleDialog.onOpen(null)} className="gap-1.5">
                  <Plus className="size-4" />
                  <span>Add Vehicle</span>
                </Button>
              </PermissionGate>
            </div>
          </div>

          {/* Fleet Document Expiry Alert Banner */}
          {expiryAlerts.length > 0 && (
            <div className="rounded-xl border border-amber-300 bg-amber-50 dark:bg-amber-950/30 p-4 text-amber-900 dark:text-amber-200 flex items-start gap-3 shadow-sm">
              <AlertTriangle className="size-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-sm">
                <span className="font-semibold">Regulatory Document Expirations ({expiryAlerts.length}): </span>
                {expiryAlerts.slice(0, 3).map((a, idx) => (
                  <span key={idx}>
                    {idx > 0 && ", "}
                    <strong className="font-mono">{a.registration_number}</strong> {a.document_type} (
                    {a.status === "expired" ? "Expired" : `Expires in ${a.days_diff}d`})
                  </span>
                ))}
                {expiryAlerts.length > 3 && ` and ${expiryAlerts.length - 3} more...`}
              </div>
            </div>
          )}

          {/* Fleet KPI Stat Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <Card className="p-3.5 space-y-1 bg-gradient-to-br from-background to-muted/40 shadow-sm border rounded-xl">
              <div className="flex items-center justify-between text-muted-foreground text-xs">
                <span>Fleet Size</span>
                <Car className="size-4 text-primary" />
              </div>
              <div className="text-xl font-bold font-mono tracking-tight">
                {fleetKpis.total_vehicles ?? 0} <span className="text-xs font-normal text-muted-foreground">buses</span>
              </div>
              <div className="text-[11px] text-muted-foreground">{fleetKpis.active_vehicles ?? 0} active in service</div>
            </Card>

            <Card className="p-3.5 space-y-1 bg-gradient-to-br from-background to-muted/40 shadow-sm border rounded-xl">
              <div className="flex items-center justify-between text-muted-foreground text-xs">
                <span>Distance This Month</span>
                <Navigation className="size-4 text-blue-600" />
              </div>
              <div className="text-xl font-bold font-mono tracking-tight">
                {Number(fleetKpis.month_km ?? 0).toLocaleString()} <span className="text-xs font-normal text-muted-foreground">KM</span>
              </div>
              <div className="text-[11px] text-muted-foreground">Fleet running distance</div>
            </Card>

            <Card className="p-3.5 space-y-1 bg-gradient-to-br from-emerald-500/10 to-background shadow-sm border border-emerald-500/30 rounded-xl">
              <div className="flex items-center justify-between text-emerald-800 dark:text-emerald-300 text-xs font-medium">
                <span>Avg Fleet Mileage</span>
                <Fuel className="size-4 text-emerald-600" />
              </div>
              <div className="text-xl font-bold font-mono tracking-tight text-emerald-700 dark:text-emerald-400">
                {fleetKpis.fleet_avg_mileage ? `${fleetKpis.fleet_avg_mileage} km/L` : "—"}
              </div>
              <div className="text-[11px] text-emerald-700/80 dark:text-emerald-400/80">Overall efficiency</div>
            </Card>

            <Card className="p-3.5 space-y-1 bg-gradient-to-br from-background to-muted/40 shadow-sm border rounded-xl">
              <div className="flex items-center justify-between text-muted-foreground text-xs">
                <span>Month Fuel Cost</span>
                <IndianRupee className="size-4 text-emerald-600" />
              </div>
              <div className="text-xl font-bold font-mono tracking-tight">
                ₹{Number(fleetKpis.month_fuel_cost ?? 0).toLocaleString()}
              </div>
              <div className="text-[11px] text-muted-foreground">{fleetKpis.month_fuel_liters ?? 0} L filled</div>
            </Card>

            <Card className="p-3.5 space-y-1 bg-gradient-to-br from-background to-muted/40 shadow-sm border rounded-xl">
              <div className="flex items-center justify-between text-muted-foreground text-xs">
                <span>Month Maintenance</span>
                <Wrench className="size-4 text-amber-600" />
              </div>
              <div className="text-xl font-bold font-mono tracking-tight">
                ₹{Number(fleetKpis.month_expense ?? 0).toLocaleString()}
              </div>
              <div className="text-[11px] text-muted-foreground">Repairs & service</div>
            </Card>

            <Card className="p-3.5 space-y-1 bg-gradient-to-br from-indigo-500/10 to-background shadow-sm border border-indigo-500/30 rounded-xl">
              <div className="flex items-center justify-between text-indigo-800 dark:text-indigo-300 text-xs font-medium">
                <span>Cost / KM</span>
                <TrendingUp className="size-4 text-indigo-600" />
              </div>
              <div className="text-xl font-bold font-mono tracking-tight text-indigo-700 dark:text-indigo-400">
                ₹{fleetKpis.fleet_cost_per_km ?? 0} <span className="text-xs font-normal text-muted-foreground">/km</span>
              </div>
              <div className="text-[11px] text-indigo-700/80 dark:text-indigo-400/80">Fleet running cost</div>
            </Card>
          </div>

          {/* Main Tabs Hub with Non-Overlapping Pills */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <div className="bg-muted/40 p-1.5 rounded-2xl border flex flex-wrap items-center gap-1.5">
              <TabsList className="bg-transparent h-auto p-0 gap-1.5 flex flex-wrap justify-start border-0">
                <TabsTrigger
                  value="vehicles"
                  className="normal-case tracking-normal rounded-xl px-4 py-2 text-xs sm:text-sm font-medium transition-all gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                >
                  <Car className="size-3.5" />
                  <span>Vehicles List</span>
                  {rows.length > 0 && (
                    <Badge variant="secondary" className="px-1.5 py-0 text-[10px] h-4 rounded-full font-mono">
                      {vehiclesData?.meta?.total ?? rows.length}
                    </Badge>
                  )}
                </TabsTrigger>

                <TabsTrigger
                  value="trips"
                  className="normal-case tracking-normal rounded-xl px-4 py-2 text-xs sm:text-sm font-medium transition-all gap-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
                >
                  <Navigation className="size-3.5" />
                  <span>Daily Trips</span>
                  {trips.length > 0 && (
                    <Badge variant="secondary" className="px-1.5 py-0 text-[10px] h-4 rounded-full font-mono">
                      {allTripsRes?.meta?.total ?? trips.length}
                    </Badge>
                  )}
                </TabsTrigger>

                <TabsTrigger
                  value="fuels"
                  className="normal-case tracking-normal rounded-xl px-4 py-2 text-xs sm:text-sm font-medium transition-all gap-2 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
                >
                  <Fuel className="size-3.5" />
                  <span>Fuel Refills</span>
                  {fuels.length > 0 && (
                    <Badge variant="secondary" className="px-1.5 py-0 text-[10px] h-4 rounded-full font-mono">
                      {allFuelsRes?.meta?.total ?? fuels.length}
                    </Badge>
                  )}
                </TabsTrigger>

                <TabsTrigger
                  value="expenses"
                  className="normal-case tracking-normal rounded-xl px-4 py-2 text-xs sm:text-sm font-medium transition-all gap-2 data-[state=active]:bg-amber-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
                >
                  <Wrench className="size-3.5" />
                  <span>Expenses</span>
                  {expenses.length > 0 && (
                    <Badge variant="secondary" className="px-1.5 py-0 text-[10px] h-4 rounded-full font-mono">
                      {allExpensesRes?.meta?.total ?? expenses.length}
                    </Badge>
                  )}
                </TabsTrigger>

                <TabsTrigger
                  value="analytics"
                  className="normal-case tracking-normal rounded-xl px-4 py-2 text-xs sm:text-sm font-medium transition-all gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
                >
                  <TrendingUp className="size-3.5" />
                  <span>Fleet Analytics</span>
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

            {/* TAB 1: VEHICLES FLEET */}
            <TabsContent value="vehicles" className="space-y-4">
              <Card className="rounded-xl shadow-sm border">
                <CardHeader className="pb-3 border-b">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <FilterBar values={filter} onChange={(updates) => handleFilter({ ...updates, page: 1 })}>
                      <FilterBar.Renderer
                        config={{
                          filters: [],
                          searchGroup: {
                            selectName: "search_by",
                            searchName: "search",
                            options: [
                              { value: "registration_number", label: "Reg No" },
                              { value: "vehicle_type", label: "Type" },
                            ],
                            placeholder: "Search vehicles...",
                          },
                        }}
                      />
                    </FilterBar>

                    <div className="flex items-center gap-2">
                      <PermissionGate can="view_transport_vehicles">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleExportVehicles}
                          className="gap-1.5 text-xs text-emerald-700 dark:text-emerald-400 border-emerald-500/30"
                        >
                          <FileSpreadsheet className="size-3.5 text-emerald-600" />
                          <span>Export Fleet</span>
                        </Button>
                      </PermissionGate>

                      <PermissionGate can="create_transport_vehicles">
                        <Button size="sm" onClick={() => vehicleDialog.onOpen(null)} className="gap-1.5 text-xs">
                          <Plus className="size-3.5" />
                          <span>Add Vehicle</span>
                        </Button>
                      </PermissionGate>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4" id="vehicles-table">
                  <DataTable
                    columns={VEHICLE_COLUMNS}
                    currentPage={vehiclesData?.meta?.current_page ?? 1}
                    lastPage={vehiclesData?.meta?.last_page ?? 1}
                    pageSize={filter.per_page ?? 15}
                    totalRecords={vehiclesData?.meta?.total ?? 0}
                    handlePageChange={(page) => handleFilter({ page })}
                    handlePageSizeChange={(size) => handleFilter({ per_page: size, page: 1 })}
                  >
                    <Each
                      of={rows}
                      isLoading={isLoadingVehicles}
                      nodatafound={
                        <TableEmptyState
                          colSpan={VEHICLE_COLUMNS.length}
                          message="No vehicles found"
                          description="Add a vehicle to start tracking your school fleet."
                        />
                      }
                      fallback={<TableSkeletonLoader columns={VEHICLE_COLUMNS.length} />}
                      keyExtractor={(row: VehicleRow) => row.id}
                      render={(row: VehicleRow, index) => (
                        <TableRow key={row.id} className="hover:bg-muted/50">
                          <TableCell className="w-12 text-muted-foreground font-mono text-xs">
                            {getSerialNumber(vehiclesData?.meta?.current_page ?? 1, filter.per_page ?? 15, index)}
                          </TableCell>
                          <TableCell>
                            <Link
                              href={`/transport/vehicles/${row.id}`}
                              className="font-bold text-sm text-primary hover:underline font-mono"
                            >
                              {row.registration_number}
                            </Link>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-xs">{row.model_name || row.vehicle_type || "—"}</div>
                            <span className="text-[10px] text-muted-foreground capitalize">
                              {row.fuel_type || "diesel"} • {row.vehicle_type}
                            </span>
                          </TableCell>
                          <TableCell className="text-xs">{row.capacity ? `${row.capacity} Seats` : "—"}</TableCell>
                          <TableCell className="font-mono text-xs font-semibold">
                            {Number(row.current_odometer || 0).toLocaleString()} km
                          </TableCell>
                          <TableCell className="text-xs">
                            <div className="truncate max-w-[150px]">
                              Route: <span className="font-medium">{row.transport_route?.name ?? "None"}</span>
                            </div>
                            <div className="text-[11px] text-muted-foreground truncate max-w-[150px]">
                              Driver: {row.transport_driver?.name ?? "None"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={row.status === "active" ? "default" : "secondary"}
                              className="capitalize text-[10px] px-1.5 py-0"
                            >
                              {row.status ?? "active"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {/* 360 View */}
                              <PermissionGate can="view_transport_vehicles">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Link href={`/transport/vehicles/${row.id}`}>
                                      <Button size="icon-sm" variant="ghost" className="text-primary hover:bg-primary/10">
                                        <Eye className="size-4" />
                                      </Button>
                                    </Link>
                                  </TooltipTrigger>
                                  <TooltipContent>360 Profile & Analytics</TooltipContent>
                                </Tooltip>
                              </PermissionGate>

                              {/* Quick Log Trip */}
                              <PermissionGate can="create_transport_vehicles">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="icon-sm"
                                      variant="ghost"
                                      onClick={() => {
                                        setSelectedVehicleForAction(row.id);
                                        setSelectedTrip(null);
                                        setTripDialogOpen(true);
                                      }}
                                    >
                                      <Navigation className="size-3.5 text-blue-600" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Log Trip</TooltipContent>
                                </Tooltip>
                              </PermissionGate>

                              {/* Quick Add Fuel */}
                              <PermissionGate can="create_transport_vehicles">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="icon-sm"
                                      variant="ghost"
                                      onClick={() => {
                                        setSelectedVehicleForAction(row.id);
                                        setSelectedFuel(null);
                                        setFuelDialogOpen(true);
                                      }}
                                    >
                                      <Fuel className="size-3.5 text-emerald-600" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Add Fuel</TooltipContent>
                                </Tooltip>
                              </PermissionGate>

                              {/* Quick Log Expense */}
                              <PermissionGate can="create_transport_vehicles">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="icon-sm"
                                      variant="ghost"
                                      onClick={() => {
                                        setSelectedVehicleForAction(row.id);
                                        setSelectedExpense(null);
                                        setExpenseDialogOpen(true);
                                      }}
                                    >
                                      <Wrench className="size-3.5 text-amber-600" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Log Expense</TooltipContent>
                                </Tooltip>
                              </PermissionGate>

                              {/* Edit */}
                              <PermissionGate can="update_transport_vehicles">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="icon-sm"
                                      variant="ghost"
                                      onClick={() => vehicleDialog.onOpen(row as any)}
                                    >
                                      <Pencil className="size-3.5" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Edit</TooltipContent>
                                </Tooltip>
                              </PermissionGate>

                              {/* Delete */}
                              <PermissionGate can="delete_transport_vehicles">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      size="icon-sm"
                                      variant="ghost"
                                      className="text-destructive hover:bg-destructive/10"
                                      onClick={() =>
                                        deleteDisclosure.onOpen({
                                          id: row.id,
                                          registration_number: row.registration_number,
                                        })
                                      }
                                      disabled={deleteMutation.isPending}
                                    >
                                      <Trash2 className="size-3.5" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Delete</TooltipContent>
                                </Tooltip>
                              </PermissionGate>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    />
                  </DataTable>
                </CardContent>
              </Card>
            </TabsContent>

            {/* TAB 2: DAILY TRIP LOGS (FLEET-WIDE) */}
            <TabsContent value="trips" className="space-y-4">
              <Card className="rounded-xl shadow-sm border">
                <CardHeader className="pb-3 border-b">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-base font-semibold">Fleet Trip Running History</CardTitle>
                      <CardDescription className="text-xs">
                        All vehicle trips, start/end meter readings, and distance records
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

                      <PermissionGate can="create_transport_vehicles">
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedVehicleForAction(undefined);
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

                  {/* Filter Bar for Fleet Trips */}
                  <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
                    <div className="relative">
                      <Search className="size-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                      <Input
                        placeholder="Search purpose / driver..."
                        value={tripSearch}
                        onChange={(e) => setTripSearch(e.target.value)}
                        className="h-8 text-xs pl-8"
                      />
                    </div>

                    <Select value={tripVehicleId} onValueChange={setTripVehicleId}>
                      <SelectTrigger className="h-8 text-xs font-mono">
                        <SelectValue placeholder="All Vehicles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Vehicles</SelectItem>
                        {allVehicleOptions.map((v) => (
                          <SelectItem key={v.id} value={String(v.id)}>
                            {v.registration_number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

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

                    {(tripSearch || tripVehicleId !== "all" || tripFromDate || tripToDate || tripStatus !== "all") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setTripSearch("");
                          setTripVehicleId("all");
                          setTripFromDate("");
                          setTripToDate("");
                          setTripStatus("all");
                        }}
                        className="h-8 text-xs text-muted-foreground gap-1"
                      >
                        <RotateCcw className="size-3" />
                        <span>Reset</span>
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  {isLoadingTrips ? (
                    <div className="py-8 text-center text-sm text-muted-foreground">Loading trip logs...</div>
                  ) : trips.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground space-y-3">
                      <Navigation className="size-10 mx-auto opacity-30" />
                      <p className="text-sm">No trip logs found matching filters.</p>
                    </div>
                  ) : (
                    <div className="rounded-xl border overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="w-28">Date</TableHead>
                            <TableHead>Vehicle</TableHead>
                            <TableHead>Purpose / Type</TableHead>
                            <TableHead>Driver</TableHead>
                            <TableHead className="text-right">Start KM</TableHead>
                            <TableHead className="text-right">End KM</TableHead>
                            <TableHead className="text-right font-bold">Total Run</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {trips.map((t: any) => (
                            <TableRow key={t.id} className="hover:bg-muted/30">
                              <TableCell className="font-medium text-xs font-mono">
                                {t.log_date ? String(t.log_date).slice(0, 10) : "—"}
                              </TableCell>
                              <TableCell>
                                <Link
                                  href={`/transport/vehicles/${t.transport_vehicle_id}`}
                                  className="font-bold text-xs font-mono text-primary hover:underline"
                                >
                                  {t.transport_vehicle?.registration_number ?? `Vehicle #${t.transport_vehicle_id}`}
                                </Link>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium text-xs">{t.purpose || "Regular Run"}</div>
                                <span className="text-[10px] text-muted-foreground capitalize">{t.trip_type}</span>
                              </TableCell>
                              <TableCell className="text-xs">{t.transport_driver?.name ?? "—"}</TableCell>
                              <TableCell className="text-right font-mono text-xs">{Number(t.start_odometer).toLocaleString()}</TableCell>
                              <TableCell className="text-right font-mono text-xs">
                                {t.end_odometer ? Number(t.end_odometer).toLocaleString() : "—"}
                              </TableCell>
                              <TableCell className="text-right font-mono text-xs font-bold text-primary">
                                {t.total_km ? `${t.total_km} km` : "—"}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={t.status === "completed" ? "default" : "secondary"}
                                  className="text-[10px] capitalize px-1.5 py-0"
                                >
                                  {t.status}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <Link href={`/transport/vehicles/${t.transport_vehicle_id}`}>
                                    <Button size="icon-sm" variant="ghost" className="text-primary hover:bg-primary/10">
                                      <Eye className="size-3.5" />
                                    </Button>
                                  </Link>
                                  <PermissionGate can="update_transport_vehicles">
                                    <Button
                                      size="icon-sm"
                                      variant="ghost"
                                      onClick={() => {
                                        setSelectedVehicleForAction(t.transport_vehicle_id);
                                        setSelectedTrip(t);
                                        setTripDialogOpen(true);
                                      }}
                                    >
                                      <Pencil className="size-3.5" />
                                    </Button>
                                  </PermissionGate>
                                  <PermissionGate can="delete_transport_vehicles">
                                    <Button
                                      size="icon-sm"
                                      variant="ghost"
                                      className="text-destructive hover:bg-destructive/10"
                                      onClick={() =>
                                        setDeleteRecordConfirm({
                                          open: true,
                                          type: "trip",
                                          id: t.id,
                                          title: `Trip on ${String(t.log_date).slice(0, 10)} (${t.total_km || 0} km)`,
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

            {/* TAB 3: FUEL REFILLS (FLEET-WIDE) */}
            <TabsContent value="fuels" className="space-y-4">
              <Card className="rounded-xl shadow-sm border">
                <CardHeader className="pb-3 border-b">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-base font-semibold">Fleet Fuel Refills & Mileage</CardTitle>
                      <CardDescription className="text-xs">
                        All petrol & diesel refueling entries across the school fleet
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

                      <PermissionGate can="create_transport_vehicles">
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedVehicleForAction(undefined);
                            setSelectedFuel(null);
                            setFuelDialogOpen(true);
                          }}
                          className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <Plus className="size-3.5" />
                          <span>Add Fuel Refill</span>
                        </Button>
                      </PermissionGate>
                    </div>
                  </div>

                  {/* Filter Bar for Fleet Fuel */}
                  <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
                    <div className="relative">
                      <Search className="size-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                      <Input
                        placeholder="Search pump / notes..."
                        value={fuelSearch}
                        onChange={(e) => setFuelSearch(e.target.value)}
                        className="h-8 text-xs pl-8"
                      />
                    </div>

                    <Select value={fuelVehicleId} onValueChange={setFuelVehicleId}>
                      <SelectTrigger className="h-8 text-xs font-mono">
                        <SelectValue placeholder="All Vehicles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Vehicles</SelectItem>
                        {allVehicleOptions.map((v) => (
                          <SelectItem key={v.id} value={String(v.id)}>
                            {v.registration_number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={fuelTypeFilter} onValueChange={setFuelTypeFilter}>
                      <SelectTrigger className="h-8 text-xs capitalize">
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

                    {(fuelSearch || fuelVehicleId !== "all" || fuelFromDate || fuelToDate || fuelTypeFilter !== "all") && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setFuelSearch("");
                          setFuelVehicleId("all");
                          setFuelFromDate("");
                          setFuelToDate("");
                          setFuelTypeFilter("all");
                        }}
                        className="h-8 text-xs text-muted-foreground gap-1"
                      >
                        <RotateCcw className="size-3" />
                        <span>Reset</span>
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  {isLoadingFuels ? (
                    <div className="py-8 text-center text-sm text-muted-foreground">Loading fuel records...</div>
                  ) : fuels.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground space-y-3">
                      <Fuel className="size-10 mx-auto opacity-30 text-emerald-600" />
                      <p className="text-sm">No fuel refill entries found matching filters.</p>
                    </div>
                  ) : (
                    <div className="rounded-xl border overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="w-28">Date</TableHead>
                            <TableHead>Vehicle</TableHead>
                            <TableHead className="text-right">Meter Reading</TableHead>
                            <TableHead className="text-right">Quantity (L)</TableHead>
                            <TableHead className="text-right">Rate / L</TableHead>
                            <TableHead className="text-right font-bold">Total (₹)</TableHead>
                            <TableHead>Calculated Mileage</TableHead>
                            <TableHead>Pump / Vendor</TableHead>
                            <TableHead className="text-center">Receipt</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {fuels.map((f: any) => (
                            <TableRow key={f.id} className="hover:bg-muted/30">
                              <TableCell className="font-medium text-xs font-mono">
                                {f.fuel_date ? String(f.fuel_date).slice(0, 10) : "—"}
                              </TableCell>
                              <TableCell>
                                <Link
                                  href={`/transport/vehicles/${f.transport_vehicle_id}`}
                                  className="font-bold text-xs font-mono text-primary hover:underline"
                                >
                                  {f.transport_vehicle?.registration_number ?? `Vehicle #${f.transport_vehicle_id}`}
                                </Link>
                              </TableCell>
                              <TableCell className="text-right font-mono text-xs">
                                {Number(f.odometer_reading).toLocaleString()} km
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
                                  <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-mono text-xs border border-emerald-300">
                                    {f.calculated_mileage} km/L
                                  </Badge>
                                ) : (
                                  <span className="text-[11px] text-muted-foreground italic">Full baseline</span>
                                )}
                              </TableCell>
                              <TableCell className="text-xs">
                                <div className="truncate max-w-[140px]">{f.vendor_name || "—"}</div>
                              </TableCell>
                              <TableCell className="text-center">
                                {f.bill_url ? (
                                  <a
                                    href={f.bill_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                                  >
                                    <Receipt className="size-3.5" />
                                    <span>View</span>
                                  </a>
                                ) : (
                                  <span className="text-xs text-muted-foreground">—</span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <Link href={`/transport/vehicles/${f.transport_vehicle_id}`}>
                                    <Button size="icon-sm" variant="ghost" className="text-primary hover:bg-primary/10">
                                      <Eye className="size-3.5" />
                                    </Button>
                                  </Link>
                                  <PermissionGate can="update_transport_vehicles">
                                    <Button
                                      size="icon-sm"
                                      variant="ghost"
                                      onClick={() => {
                                        setSelectedVehicleForAction(f.transport_vehicle_id);
                                        setSelectedFuel(f);
                                        setFuelDialogOpen(true);
                                      }}
                                    >
                                      <Pencil className="size-3.5" />
                                    </Button>
                                  </PermissionGate>
                                  <PermissionGate can="delete_transport_vehicles">
                                    <Button
                                      size="icon-sm"
                                      variant="ghost"
                                      className="text-destructive hover:bg-destructive/10"
                                      onClick={() =>
                                        setDeleteRecordConfirm({
                                          open: true,
                                          type: "fuel",
                                          id: f.id,
                                          title: `Refuel on ${String(f.fuel_date).slice(0, 10)} (₹${Number(f.total_amount).toLocaleString()})`,
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

            {/* TAB 4: MAINTENANCE & EXPENSES (FLEET-WIDE) */}
            <TabsContent value="expenses" className="space-y-4">
              <Card className="rounded-xl shadow-sm border">
                <CardHeader className="pb-3 border-b">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-base font-semibold">Fleet Maintenance & Expense Records</CardTitle>
                      <CardDescription className="text-xs">
                        All repair bills, periodic services, and upkeep expenses
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

                      <PermissionGate can="create_transport_vehicles">
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedVehicleForAction(undefined);
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

                  {/* Filter Bar for Fleet Expenses */}
                  <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
                    <div className="relative">
                      <Search className="size-3.5 absolute left-2.5 top-2.5 text-muted-foreground" />
                      <Input
                        placeholder="Search work / vendor..."
                        value={expenseSearch}
                        onChange={(e) => setExpenseSearch(e.target.value)}
                        className="h-8 text-xs pl-8"
                      />
                    </div>

                    <Select value={expenseVehicleId} onValueChange={setExpenseVehicleId}>
                      <SelectTrigger className="h-8 text-xs font-mono">
                        <SelectValue placeholder="All Vehicles" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Vehicles</SelectItem>
                        {allVehicleOptions.map((v) => (
                          <SelectItem key={v.id} value={String(v.id)}>
                            {v.registration_number}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select value={expenseCategory} onValueChange={setExpenseCategory}>
                      <SelectTrigger className="h-8 text-xs capitalize">
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Categories</SelectItem>
                        <SelectItem value="repair">Repair</SelectItem>
                        <SelectItem value="periodic_service">Periodic Service</SelectItem>
                        <SelectItem value="tyre">Tyre</SelectItem>
                        <SelectItem value="battery">Battery</SelectItem>
                        <SelectItem value="insurance">Insurance</SelectItem>
                        <SelectItem value="permit">Permit</SelectItem>
                        <SelectItem value="fitness">Fitness</SelectItem>
                        <SelectItem value="puc">PUC</SelectItem>
                        <SelectItem value="tax">Road Tax</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>

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

                    {(expenseSearch || expenseVehicleId !== "all" || expenseCategory !== "all" || expenseFromDate || expenseToDate) && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setExpenseSearch("");
                          setExpenseVehicleId("all");
                          setExpenseCategory("all");
                          setExpenseFromDate("");
                          setExpenseToDate("");
                        }}
                        className="h-8 text-xs text-muted-foreground gap-1"
                      >
                        <RotateCcw className="size-3" />
                        <span>Reset</span>
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  {isLoadingExpenses ? (
                    <div className="py-8 text-center text-sm text-muted-foreground">Loading expense records...</div>
                  ) : expenses.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground space-y-3">
                      <Wrench className="size-10 mx-auto opacity-30 text-amber-600" />
                      <p className="text-sm">No expenses recorded yet matching filters.</p>
                    </div>
                  ) : (
                    <div className="rounded-xl border overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="w-28">Date</TableHead>
                            <TableHead>Vehicle</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Work / Title</TableHead>
                            <TableHead>Vendor</TableHead>
                            <TableHead className="text-right font-bold">Amount (₹)</TableHead>
                            <TableHead>Next Service</TableHead>
                            <TableHead className="text-center">Bill</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {expenses.map((e: any) => (
                            <TableRow key={e.id} className="hover:bg-muted/30">
                              <TableCell className="font-medium text-xs font-mono">
                                {e.expense_date ? String(e.expense_date).slice(0, 10) : "—"}
                              </TableCell>
                              <TableCell>
                                <Link
                                  href={`/transport/vehicles/${e.transport_vehicle_id}`}
                                  className="font-bold text-xs font-mono text-primary hover:underline"
                                >
                                  {e.transport_vehicle?.registration_number ?? `Vehicle #${e.transport_vehicle_id}`}
                                </Link>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="capitalize text-[10px]">
                                  {e.category}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium text-xs">{e.title}</div>
                              </TableCell>
                              <TableCell className="text-xs">{e.vendor_name || "—"}</TableCell>
                              <TableCell className="text-right font-mono text-xs font-bold text-amber-700 dark:text-amber-400">
                                ₹{Number(e.amount).toLocaleString()}
                              </TableCell>
                              <TableCell className="text-xs">
                                {e.next_service_date ? String(e.next_service_date).slice(0, 10) : "—"}
                              </TableCell>
                              <TableCell className="text-center">
                                {e.bill_url ? (
                                  <a
                                    href={e.bill_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                                  >
                                    <FileText className="size-3.5" />
                                    <span>View</span>
                                  </a>
                                ) : (
                                  <span className="text-xs text-muted-foreground">—</span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <Link href={`/transport/vehicles/${e.transport_vehicle_id}`}>
                                    <Button size="icon-sm" variant="ghost" className="text-primary hover:bg-primary/10">
                                      <Eye className="size-3.5" />
                                    </Button>
                                  </Link>
                                  <PermissionGate can="update_transport_vehicles">
                                    <Button
                                      size="icon-sm"
                                      variant="ghost"
                                      onClick={() => {
                                        setSelectedVehicleForAction(e.transport_vehicle_id);
                                        setSelectedExpense(e);
                                        setExpenseDialogOpen(true);
                                      }}
                                    >
                                      <Pencil className="size-3.5" />
                                    </Button>
                                  </PermissionGate>
                                  <PermissionGate can="delete_transport_vehicles">
                                    <Button
                                      size="icon-sm"
                                      variant="ghost"
                                      className="text-destructive hover:bg-destructive/10"
                                      onClick={() =>
                                        setDeleteRecordConfirm({
                                          open: true,
                                          type: "expense",
                                          id: e.id,
                                          title: `${e.title || "Expense"} (₹${Number(e.amount).toLocaleString()})`,
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

            {/* TAB 5: FLEET ANALYTICS */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Fleet Distance Run */}
                <Card className="rounded-xl shadow-sm border">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">Fleet Distance Run (Last 6 Months)</CardTitle>
                    <CardDescription className="text-xs">Total distance logged across all school vehicles</CardDescription>
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

                {/* Fleet Expenditure (Fuel vs Maintenance) */}
                <Card className="rounded-xl shadow-sm border">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">Fleet Expenses (Fuel vs Maintenance)</CardTitle>
                    <CardDescription className="text-xs">Cost comparison for fuel refuels and vehicle repairs</CardDescription>
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

              {/* Top Vehicles Leaderboard */}
              {topVehicles.length > 0 && (
                <Card className="rounded-xl shadow-sm border">
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">Top Running Vehicles (by Total KM)</CardTitle>
                    <CardDescription className="text-xs">Vehicles with the highest logged distances</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                      {topVehicles.map((v, i) => (
                        <div key={i} className="rounded-xl border p-3 bg-muted/30 flex items-center justify-between">
                          <div>
                            <Link
                              href={`/transport/vehicles/${v.vehicle_id}`}
                              className="font-mono font-bold text-sm text-primary hover:underline"
                            >
                              {v.registration_number}
                            </Link>
                            <div className="text-[11px] text-muted-foreground">Rank #{i + 1}</div>
                          </div>
                          <span className="font-mono text-sm font-bold text-foreground">{v.total_km} km</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* TAB 6: FLEET AUDIT TRAIL LOGS */}
            <TabsContent value="audit" className="space-y-4">
              <Card className="rounded-xl shadow-sm border">
                <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <History className="size-4 text-primary" />
                    <span>Fleet Operations Audit Trail</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Comprehensive audit log of who created, updated, or deleted fleet vehicles, daily trips, fuel bills, and maintenance expenses
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  {isLoadingAudits ? (
                    <div className="py-10 text-center text-sm text-muted-foreground">Loading fleet audit logs...</div>
                  ) : fleetAudits.length === 0 ? (
                    <div className="py-12 text-center text-muted-foreground space-y-2">
                      <Activity className="size-8 mx-auto opacity-30 text-primary" />
                      <p className="text-sm">No fleet audit entries logged yet.</p>
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
                          {fleetAudits.map((a: any) => {
                            const actionColor =
                              a.action === "created"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-950/40 dark:text-emerald-300"
                                : a.action === "updated"
                                ? "bg-blue-50 text-blue-700 border-blue-300 dark:bg-blue-950/40 dark:text-blue-300"
                                : "bg-red-50 text-red-700 border-red-300 dark:bg-red-950/40 dark:text-red-300";

                            return (
                              <TableRow key={a.id} className="hover:bg-muted/30">
                                <TableCell className="font-mono text-xs text-muted-foreground">
                                  {a.created_at ? new Date(a.created_at).toLocaleString() : "—"}
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium text-xs text-foreground">{a.user?.name || "System"}</div>
                                  <div className="text-[10px] text-muted-foreground">{a.user?.email || "—"}</div>
                                </TableCell>
                                <TableCell>
                                  <Badge variant="outline" className="font-mono text-[10px] capitalize">
                                    {a.entity_type
                                      ? String(a.entity_type)
                                          .replace("TransportVehicleLog", "Trip Log")
                                          .replace("TransportVehicleFuel", "Fuel Refill")
                                          .replace("TransportVehicleExpense", "Expense")
                                          .replace("TransportVehicle", "Vehicle")
                                      : "Entity"}{" "}
                                    #{a.entity_id}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <Badge className={`text-[10px] font-semibold uppercase px-2 py-0.5 border ${actionColor}`}>
                                    {a.action}
                                  </Badge>
                                </TableCell>
                                <TableCell className="max-w-md">
                                  {a.new_values && Object.keys(a.new_values).length > 0 ? (
                                    <div className="text-[11px] font-mono bg-muted/50 p-1.5 rounded border max-h-20 overflow-y-auto space-y-0.5">
                                      {Object.entries(a.new_values).map(([k, v]: [string, any]) => (
                                        <div key={k} className="truncate">
                                          <span className="text-muted-foreground">{k}:</span>{" "}
                                          <span className="font-semibold text-foreground">
                                            {typeof v === "object" ? JSON.stringify(v) : String(v ?? "—")}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-xs text-muted-foreground italic">No value snapshot</span>
                                  )}
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
    </>
  );
};

export default TransportVehiclesIndex;
