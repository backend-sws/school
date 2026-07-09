import DataTable, {
  TableEmptyState,
  TableSkeletonLoader,
} from "@/components/dataTable";
import Each from "@/components/Each";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableCell, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FilterBar } from "@/components/filter-bar";
import { getSerialNumber } from "@/lib/utils";
import { Head } from "@inertiajs/react";
import { ClipboardList, Pencil, Plus, Trash2, IndianRupee, AlertCircle, BusFront, Download, Loader2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useSearchFilter from "@/hooks/useSearchfilter";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDisclosure } from "@/hooks/useDisclosure";
import transportApi from "@/lib/api/transportApi";
import lmsApi from "@/lib/api/lmsApi";
import { TransportAssignmentDialog, type TransportAssignmentDialogData } from "@/components/admin/transportAssignmentDialog";
import { PermissionGate } from "@/components/PermissionGate";
import {
  TRANSPORT_ASSIGNMENTS_BREADCRUMBS,
  TRANSPORT_ASSIGNMENTS_GUIDELINES,
} from "@/constants/page/admin/transport";
import { useRegisterGuide } from '@/components/GuideProvider';
import { TRANSPORT_ASSIGNMENTS_GUIDE } from "@/constants/guides/transport";
import React, { useMemo, useState } from 'react';
import { FORM_TYPE } from "@/constants";

const COLUMNS = [
  { key: "serial", label: "#" },
  { key: "user", label: "Student" },
  { key: "class", label: "Class" },
  { key: "route", label: "Route" },
  { key: "stop", label: "Stop" },
  { key: "fare", label: "Fare (₹)" },
  { key: "effective_from", label: "From" },
  { key: "effective_until", label: "Until" },
  { key: "action", label: "Actions" },
];

const INITIAL_FILTERS = {
  page: 1,
  per_page: 15,
  search: "",
  search_by: "student",
  route_id: "all",
  stop_id: "all",
  class_id: "all",
  vehicle_id: "all",
  effective_on: "",
};

type AssignmentRow = {
  id: number;
  user_id: number;
  transport_route_id: number;
  transport_stop_id: number;
  effective_from: string;
  effective_until?: string | null;
  user?: { id: number; name: string; email?: string };
  transport_route?: { id: number; name: string; code?: string };
  transport_stop?: { id: number; name: string; code?: string };
};

const TransportAssignmentsIndex = () => {
  const queryClient = useQueryClient();
  useRegisterGuide(TRANSPORT_ASSIGNMENTS_GUIDE);
  const { filter, handleFilter } = useSearchFilter(INITIAL_FILTERS);
  const dialogDisclosure = useDisclosure<TransportAssignmentDialogData>();
  const deleteDisclosure = useDisclosure<{ id: number; studentName: string }>();
  const [isExporting, setIsExporting] = useState(false);

  // Queries for filters
  const { data: classesRes } = useQuery({
    queryKey: ["lms-classes"],
    queryFn: () => lmsApi.classes.index({ per_page: 500 }),
  });
  const classes = Array.isArray((classesRes as any)?.data) ? (classesRes as any).data : Array.isArray(classesRes) ? classesRes : [];

  const { data: routesRes } = useQuery({
    queryKey: ["transport-routes-list"],
    queryFn: () => transportApi.routes.index({ per_page: 500 }),
  });
  const routes = (routesRes as any)?.data || [];

  const { data: stopsRes } = useQuery({
    queryKey: ["transport-stops-list"],
    queryFn: () => transportApi.stops.index({ per_page: 500 }),
  });
  const stops = (stopsRes as any)?.data || [];

  const { data: vehiclesRes } = useQuery({
    queryKey: ["transport-vehicles-list"],
    queryFn: () => transportApi.vehicles.index({ per_page: 500 }),
  });
  const vehicles = (vehiclesRes as any)?.data || [];

  const { data: assignmentsRes, isLoading } = useQuery({
    queryKey: ["transport-assignments", filter],
    queryFn: () =>
      transportApi.assignments.index({
        page: filter.page,
        per_page: filter.per_page,
        search: filter.search || undefined,
        route_id: filter.route_id === "all" ? undefined : filter.route_id,
        stop_id: filter.stop_id === "all" ? undefined : filter.stop_id,
        class_id: filter.class_id === "all" ? undefined : filter.class_id,
        vehicle_id: filter.vehicle_id === "all" ? undefined : filter.vehicle_id,
        effective_on: filter.effective_on || undefined,
      }),
  });

  const list = (assignmentsRes?.data ?? []) as any[];
  const stats = (assignmentsRes as any)?.meta?.stats ?? { total_assignments: 0, monthly_revenue: 0, total_routes: 0, total_vehicles: 0 };

  const filterConfig = useMemo(() => ({
    filters: [
      {
        name: "class_id",
        type: FORM_TYPE.SELECT,
        label: "Class",
        placeholder: "Select class",
        options: [
          { key: "all", text: "All Classes", value: "all" },
          ...classes.map((c: any) => ({
            key: String(c.id),
            text: c.name,
            value: String(c.id),
          })),
        ],
      },
      {
        name: "route_id",
        type: FORM_TYPE.SELECT,
        label: "Route",
        placeholder: "Select route",
        options: [
          { key: "all", text: "All Routes", value: "all" },
          ...routes.map((r: any) => ({
            key: String(r.id),
            text: r.name,
            value: String(r.id),
          })),
        ],
      },
      {
        name: "stop_id",
        type: FORM_TYPE.SELECT,
        label: "Stop",
        placeholder: "Select stop",
        options: [
          { key: "all", text: "All Stops", value: "all" },
          ...stops.map((s: any) => ({
            key: String(s.id),
            text: s.name,
            value: String(s.id),
          })),
        ],
      },
      {
        name: "vehicle_id",
        type: FORM_TYPE.SELECT,
        label: "Vehicle",
        placeholder: "Select vehicle",
        options: [
          { key: "all", text: "All Vehicles", value: "all" },
          ...vehicles.map((v: any) => ({
            key: String(v.id),
            text: `${v.registration_number} (${v.vehicle_type || 'Bus'})`,
            value: String(v.id),
          })),
        ],
      },
    ],
    searchGroup: {
      selectName: "search_by",
      searchName: "search",
      options: [
        { value: "student", label: "Student Name" },
      ],
      placeholder: "Search student...",
    },
  }), [classes, routes, stops, vehicles]);

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams();
      if (filter.search) params.append("search", filter.search);
      if (filter.route_id && filter.route_id !== "all") params.append("route_id", String(filter.route_id));
      if (filter.stop_id && filter.stop_id !== "all") params.append("stop_id", String(filter.stop_id));
      if (filter.class_id && filter.class_id !== "all") params.append("class_id", String(filter.class_id));
      if (filter.vehicle_id && filter.vehicle_id !== "all") params.append("vehicle_id", String(filter.vehicle_id));

      const downloadUrl = `/api/v1/transport/assignments/export?${params.toString()}`;
      window.open(downloadUrl, "_blank");
    } catch (err) {
      console.error("Export failed", err);
    } finally {
      setIsExporting(false);
    }
  };

  const deleteMutation = useMutation({
    mutationFn: (id: number) => transportApi.assignments.destroy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transport-assignments"] });
      deleteDisclosure.onClose();
    },
  });

  const handleFilterChange = (updates: Record<string, unknown>) => {
    handleFilter({ ...updates, page: 1 });
  };

  const rows = list as AssignmentRow[];

  const toDialogData = (row: AssignmentRow): TransportAssignmentDialogData =>
    row
      ? {
        id: row.id,
        user_id: row.user_id,
        transport_route_id: row.transport_route_id,
        transport_stop_id: row.transport_stop_id,
        effective_from: row.effective_from,
        effective_until: row.effective_until ?? undefined,
        user: row.user,
        transport_route: row.transport_route,
        transport_stop: row.transport_stop,
      }
      : null;

  return (
    <>
      <Head title="Transport Assignments" />
      <TransportAssignmentDialog
        open={dialogDisclosure.isOpen}
        onClose={() => dialogDisclosure.onClose()}
        data={dialogDisclosure.data ?? undefined}
      />
      <ConfirmDialog
        open={deleteDisclosure.isOpen}
        onOpenChange={deleteDisclosure.onClose}
        title="Delete Assignment"
        description={`Are you sure you want to remove this assignment for "${deleteDisclosure.data?.studentName}"?`}
        onConfirm={() => deleteDisclosure.data && deleteMutation.mutate(deleteDisclosure.data.id)}
        isLoading={deleteMutation.isPending}
        confirmText="Delete"
        variant="danger"
        confirmationKeyword="DELETE"
      />
      <TooltipProvider>
        <div className="space-y-6">
          <MainPageHeader
            id="transport-assignments-header"
            breadcrumbs={TRANSPORT_ASSIGNMENTS_BREADCRUMBS}
            icon={ClipboardList}
            guidance={TRANSPORT_ASSIGNMENTS_GUIDE}
          />
          {/* Analytics stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white dark:bg-card border-border/50 shadow-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Total Assignments</p>
                  <p className="text-2xl font-black text-foreground">{stats.total_assignments}</p>
                </div>
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <ClipboardList className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-card border-border/50 shadow-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Est. Monthly Revenue</p>
                  <p className="text-2xl font-black text-foreground">₹{new Intl.NumberFormat("en-IN", { minimumFractionDigits: 0 }).format(stats.monthly_revenue)}</p>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <IndianRupee className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-card border-border/50 shadow-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Active Routes</p>
                  <p className="text-2xl font-black text-foreground">{stats.total_routes}</p>
                </div>
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <BusFront className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-card border-border/50 shadow-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Active Fleet</p>
                  <p className="text-2xl font-black text-foreground">{stats.total_vehicles}</p>
                </div>
                <div className="p-3 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                  <AlertCircle className="size-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <Button
                variant="outline"
                onClick={handleExportExcel}
                disabled={isExporting}
              >
                {isExporting ? (
                  <Loader2 className="size-4 animate-spin mr-2" />
                ) : (
                  <Download className="size-4 mr-2" />
                )}
                <span>Export Excel</span>
              </Button>
            </div>
            <PermissionGate can="create_transport_assignments">
              <Button id="new-assignment-btn" onClick={() => dialogDisclosure.onOpen(null)}>
                <Plus className="size-4" />
                <span>Add Assignment</span>
              </Button>
            </PermissionGate>
          </div>

          <Card>
            <CardHeader className="pb-4">
              <FilterBar values={filter} onChange={handleFilterChange}>
                <FilterBar.Renderer config={filterConfig} />
              </FilterBar>
            </CardHeader>
            <CardContent className="pt-0" id="assignments-table">
              <DataTable
                columns={COLUMNS}
                currentPage={assignmentsRes?.meta?.current_page ?? 1}
                lastPage={assignmentsRes?.meta?.last_page ?? 1}
                pageSize={filter.per_page ?? 15}
                totalRecords={assignmentsRes?.meta?.total ?? 0}
                handlePageChange={(page) => handleFilter({ page })}
                handlePageSizeChange={(size) => handleFilter({ per_page: size, page: 1 })}
              >
                <Each
                  of={rows}
                  isLoading={isLoading}
                  nodatafound={
                    <TableEmptyState
                      colSpan={COLUMNS.length}
                      message="No assignments found"
                      description="Add an assignment to get started."
                    />
                  }
                  fallback={<TableSkeletonLoader columns={COLUMNS.length} />}
                  keyExtractor={(row: AssignmentRow) => row.id}
                  render={(row: AssignmentRow, index) => (
                    <TableRow key={row.id} className="hover:bg-muted/50">
                      <TableCell className="w-16 text-muted-foreground font-mono text-sm">
                        {getSerialNumber(assignmentsRes?.meta?.current_page ?? 1, filter.per_page ?? 15, index)}
                      </TableCell>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground tracking-tight">{row.user?.name ?? row.user_id}</span>
                          {row.user?.student_profile?.reg_no && (
                            <span className="text-[11px] text-muted-foreground font-mono">Reg: {row.user.student_profile.reg_no}</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {(() => {
                          const studentEnrollments = row.user?.student_profile?.current_enrollments ?? (row.user as any)?.studentProfile?.currentEnrollments;
                          return Array.isArray(studentEnrollments) && studentEnrollments.length > 0
                            ? (studentEnrollments[0].lms_class?.name ?? studentEnrollments[0].lmsClass?.name ?? "—")
                            : "—";
                        })()}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {row.transport_route ? `${row.transport_route.name}${row.transport_route.code ? ` (${row.transport_route.code})` : ""}` : "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{row.transport_stop?.name ?? row.transport_stop_id}</TableCell>
                      <TableCell className="font-semibold text-foreground">
                        ₹{(row as any).monthly_amount ? Number((row as any).monthly_amount).toFixed(2) : "0.00"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">{row.effective_from?.slice(0, 10) ?? "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{row.effective_until ? row.effective_until.slice(0, 10) : "—"}</TableCell>
                      <TableCell className="w-1/6">
                        <div className="flex items-center gap-0.5">
                          <PermissionGate can="update_transport_assignments">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon-sm"
                                  variant="ghost"
                                  onClick={() => dialogDisclosure.onOpen(toDialogData(row))}
                                >
                                  <Pencil className="size-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit</TooltipContent>
                            </Tooltip>
                          </PermissionGate>
                          <PermissionGate can="delete_transport_assignments">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon-sm"
                                  variant="ghost"
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() =>
                                    deleteDisclosure.onOpen({
                                      id: row.id,
                                      studentName: row.user?.name ?? "Student",
                                    })
                                  }
                                  disabled={deleteMutation.isPending}
                                >
                                  <Trash2 className="size-4" />
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
        </div>
      </TooltipProvider>
    </>
  );
};

export default TransportAssignmentsIndex;
