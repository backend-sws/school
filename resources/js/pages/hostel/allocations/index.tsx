import DataTable, {
  TableEmptyState,
  TableSkeletonLoader,
} from "@/components/dataTable";
import Each from "@/components/Each";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableCell, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FilterBar } from "@/components/filter-bar";
import { getSerialNumber } from "@/lib/utils";
import { Head, Link } from "@inertiajs/react";
import { Pencil, Plus, Trash2, UserCheck, FileText } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useSearchFilter from "@/hooks/useSearchfilter";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDisclosure } from "@/hooks/useDisclosure";
import { hostelApi, type HostelAllocation } from "@/lib/api/hostelApi";
import { AllocationDialog, type AllocationDialogData } from "@/components/admin/allocationDialog";
import { PermissionGate } from "@/components/PermissionGate";
import { HOSTEL_BREADCRUMBS } from "@/constants/page/admin/hostel";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { useState } from "react";
import { Building, IndianRupee, Calendar, ArrowUpRight, Download, Loader2 } from "lucide-react";
import { FORM_TYPE } from "@/constants";

const COLUMNS = [
  { key: "serial", label: "#" },
  { key: "user", label: "Resident" },
  { key: "room", label: "Hostel / Room / Bed" },
  { key: "rent_due", label: "Rent / Dues" },
  { key: "dates", label: "Check-in / Check-out" },
  { key: "status", label: "Status" },
  { key: "action", label: "Actions" },
];

const INITIAL_FILTERS = { page: 1, per_page: 15, search: "", status: "all", hostel_id: "all" };

const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "bg-emerald-500/10 text-emerald-500 border-emerald-200";
    case "checked_out": return "bg-slate-500/10 text-slate-500 border-slate-200";
    case "cancelled": return "bg-red-500/10 text-red-500 border-red-200";
    default: return "bg-gray-500/10 text-gray-500";
  }
};

const HostelAllocationsIndex = () => {
  const queryClient = useQueryClient();
  const { filter, handleFilter } = useSearchFilter(INITIAL_FILTERS);
  const dialogDisclosure = useDisclosure<AllocationDialogData>();
  const deleteDisclosure = useDisclosure<{ id: number; name: string }>();
  const [isExporting, setIsExporting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["hostel-allocations", filter],
    queryFn: () => hostelApi.allocations.index({
      page: filter.page,
      per_page: filter.per_page,
      search: filter.search || undefined,
      status: filter.status === "all" ? undefined : filter.status,
      hostel_id: filter.hostel_id === "all" ? undefined : filter.hostel_id,
    }),
  });

  const { data: hostelsResponse } = useQuery({
    queryKey: ["hostel-hostels-options"],
    queryFn: () => hostelApi.hostels.index({ per_page: 100 }),
  });
  const hostelOptions = [
    { key: "all", text: "All Hostels", value: "all" },
    ...(hostelsResponse?.data || []).map((h: any) => ({
      key: String(h.id),
      text: h.name,
      value: String(h.id),
    })),
  ];

  const deleteMutation = useMutation({
    mutationFn: (id: number) => hostelApi.allocations.destroy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hostel-allocations"] });
      deleteDisclosure.onClose();
    },
  });

  const handleFilterChange = (updates: Record<string, unknown>) => {
    handleFilter({ ...updates, page: 1 });
  };

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const params = new URLSearchParams();
      if (filter.search) params.append("search", filter.search);
      if (filter.hostel_id && filter.hostel_id !== "all") params.append("hostel_id", String(filter.hostel_id));
      if (filter.status && filter.status !== "all") params.append("status", String(filter.status));

      const downloadUrl = `/api/v1/hostel/allocations/export?${params.toString()}`;
      window.open(downloadUrl, "_blank");
    } catch (err) {
      console.error("Export failed", err);
    } finally {
      setIsExporting(false);
    }
  };

  const rows = (data?.data ?? []) as HostelAllocation[];
  const stats = (data as any)?.meta?.stats ?? { total_allocations: 0, monthly_revenue: 0, new_this_month: 0, total_beds_capacity: 0 };

  return (
    <>
      <Head title="Hostel Allocations" />
      <AllocationDialog
        open={dialogDisclosure.isOpen}
        onClose={() => dialogDisclosure.onClose()}
        data={dialogDisclosure.data ?? undefined}
      />
      <ConfirmDialog
        open={deleteDisclosure.isOpen}
        onOpenChange={deleteDisclosure.onClose}
        title="Delete Allocation"
        description={`Are you sure you want to delete the allocation for "${deleteDisclosure.data?.name}"? This action cannot be undone.`}
        onConfirm={() => deleteDisclosure.data && deleteMutation.mutate(deleteDisclosure.data.id)}
        isLoading={deleteMutation.isPending}
        confirmText="Delete"
        variant="danger"
        confirmationKeyword="DELETE"
      />
      <TooltipProvider>
        <div className="space-y-6">
          <MainPageHeader
            icon={UserCheck}
            title="Room Allocations"
            subtitle="Manage and track room assignments for residents."
            breadcrumbs={[...HOSTEL_BREADCRUMBS, { title: "Allocations", href: "/hostel/allocations" }]}
          />

          {/* Analytics stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white dark:bg-card border-border/50 shadow-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Active Allocations</p>
                  <p className="text-2xl font-black text-foreground">{stats.total_allocations}</p>
                </div>
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <Building className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-card border-border/50 shadow-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Monthly Revenue</p>
                  <p className="text-2xl font-black text-foreground">₹{Number(stats.monthly_revenue).toFixed(2)}</p>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <IndianRupee className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-card border-border/50 shadow-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">New checked-in (Month)</p>
                  <p className="text-2xl font-black text-foreground">{stats.new_this_month}</p>
                </div>
                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Calendar className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-card border-border/50 shadow-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Beds Occupancy Rate</p>
                  <p className="text-2xl font-black text-foreground">
                    {stats.total_beds_capacity ? Math.round((stats.total_allocations / stats.total_beds_capacity) * 100) : 0}%
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <ArrowUpRight className="size-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={handleExportExcel}
              disabled={isExporting}
              className="w-full sm:w-auto"
            >
              {isExporting ? (
                <Loader2 className="size-4 animate-spin mr-2" />
              ) : (
                <Download className="size-4 mr-2" />
              )}
              <span>Export Excel</span>
            </Button>
            <PermissionGate can="create_hostels">
              <Button
                onClick={() => dialogDisclosure.onOpen(null)}
                className="w-full sm:w-auto"
              >
                <Plus className="size-4 mr-2" />
                <span>New Allocation</span>
              </Button>
            </PermissionGate>
          </div>

          <div className="l-blur-fade l-blur-fade-delay-1">
            <Card>
              <CardHeader className="pb-4">
                <FilterBar values={filter} onChange={handleFilterChange}>
                  <FilterBar.Renderer config={{
                    filters: [
                      {
                        name: "hostel_id",
                        type: FORM_TYPE.SELECT,
                        label: "Hostel",
                        placeholder: "Select hostel",
                        options: hostelOptions
                      },
                      {
                        name: "status",
                        type: FORM_TYPE.SELECT,
                        label: "Status",
                        placeholder: "Select status",
                        options: [
                          { key: "all", text: "All Statuses", value: "all" },
                          { key: "active", text: "Active", value: "active" },
                          { key: "checked_out", text: "Checked Out", value: "checked_out" },
                          { key: "cancelled", text: "Cancelled", value: "cancelled" },
                        ]
                      }
                    ],
                    searchGroup: {
                      selectName: "search_by",
                      searchName: "search",
                      options: [
                        { value: "user_name", label: "Resident Name" },
                      ],
                      placeholder: "Search residents...",
                    },
                  }} />
                </FilterBar>
              </CardHeader>
              <CardContent className="pt-0">
                <DataTable
                  columns={COLUMNS}
                  currentPage={data?.meta?.current_page ?? 1}
                  lastPage={data?.meta?.last_page ?? 1}
                  pageSize={filter.per_page ?? 15}
                  totalRecords={data?.meta?.total ?? 0}
                  handlePageChange={(page) => handleFilter({ page })}
                  handlePageSizeChange={(size) => handleFilter({ per_page: size, page: 1 })}
                >
                  <Each
                    of={rows}
                    isLoading={isLoading}
                    nodatafound={
                      <TableEmptyState
                        colSpan={COLUMNS.length}
                        message="No allocations found"
                        description="There are currently no allocations matching your filters."
                      />
                    }
                    fallback={<TableSkeletonLoader columns={COLUMNS.length} />}
                    keyExtractor={(row) => row.id}
                    render={(row, index) => (
                      <TableRow key={row.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="w-16 text-muted-foreground font-mono text-xs">
                          {getSerialNumber(data?.meta?.current_page ?? 1, filter.per_page ?? 15, index)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-semibold text-foreground tracking-tight">{row.user?.name ?? 'Unknown'}</span>
                            {row.user?.student_profile && (
                              <span className="text-xs text-muted-foreground font-medium">
                                {[
                                  row.user.student_profile.stream?.name,
                                  row.user.student_profile.reg_no ? `Reg: ${row.user.student_profile.reg_no}` : null
                                ].filter(Boolean).join(" | ")}
                              </span>
                            )}
                            <span className="text-[10px] text-muted-foreground/60">{row.user?.email}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{row.room?.hostel?.name ?? 'N/A'}</span>
                            <span className="text-xs text-muted-foreground">Room {row.room?.room_number ?? 'N/A'} (Bed {row.bed?.bed_label ?? 'N/A'})</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-0.5">
                            <span className="font-semibold text-sm text-foreground">₹{Number(row.monthly_amount ?? row.room?.monthly_fee ?? 0).toFixed(2)}</span>
                            {row.due_amount && row.due_amount > 0 ? (
                              <span className="text-[10px] text-rose-600 dark:text-rose-400 font-bold bg-rose-50 dark:bg-rose-950/30 px-1.5 py-0.5 rounded w-fit">Due: ₹{Number(row.due_amount).toFixed(2)}</span>
                            ) : (
                              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/30 px-1.5 py-0.5 rounded w-fit">No Dues</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          <div className="flex flex-col">
                            <span>{format(new Date(row.check_in_date), "MMM d, yyyy")}</span>
                            {row.check_out_date && (
                              <span className="text-xs text-muted-foreground">to {format(new Date(row.check_out_date), "MMM d, yyyy")}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={`capitalize ${getStatusColor(row.status)}`}>
                            {row.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="w-1/6">
                          <div className="flex items-center gap-0.5">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button size="icon-sm" variant="ghost" asChild className="hover:text-primary hover:bg-primary/5">
                                  <Link href={`/accounts/fee-hub/students?student=${row.user_id}`}>
                                    <FileText className="size-4" />
                                  </Link>
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>View Ledger</TooltipContent>
                            </Tooltip>
                            <PermissionGate can="update_hostels">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon-sm"
                                    variant="ghost"
                                    onClick={() => dialogDisclosure.onOpen(row)}
                                    className="hover:text-primary hover:bg-primary/5"
                                  >
                                    <Pencil className="size-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Edit Status</TooltipContent>
                              </Tooltip>
                            </PermissionGate>
                            <PermissionGate can="delete_hostels">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon-sm"
                                    variant="ghost"
                                    className="text-destructive/60 hover:text-destructive hover:bg-destructive/5"
                                    onClick={() => deleteDisclosure.onOpen({ id: row.id, name: row.user?.name || `ID #${row.id}` })}
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
        </div>
      </TooltipProvider>
    </>
  );
};

export default HostelAllocationsIndex;
