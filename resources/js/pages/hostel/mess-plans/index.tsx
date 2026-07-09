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
import { getSerialNumber, formatCurrency } from "@/lib/utils";
import { Head } from "@inertiajs/react";
import { Pencil, Plus, Trash2, Utensils, CheckCircle2, XCircle } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useSearchFilter from "@/hooks/useSearchfilter";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDisclosure } from "@/hooks/useDisclosure";
import { hostelApi, type HostelMessPlan } from "@/lib/api/hostelApi";
import { MessPlanDialog, type MessPlanDialogData } from "@/components/admin/messPlanDialog";
import { PermissionGate } from "@/components/PermissionGate";
import { HOSTEL_BREADCRUMBS } from "@/constants/page/admin/hostel";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import { FORM_TYPE } from "@/constants";
import { Download, Loader2, Salad, Flame, Activity, ShieldAlert } from "lucide-react";

const COLUMNS = [
  { key: "serial", label: "#" },
  { key: "name", label: "Plan Name" },
  { key: "type", label: "Type" },
  { key: "fee", label: "Monthly Fee" },
  { key: "status", label: "Status" },
  { key: "action", label: "Actions" },
];

const INITIAL_FILTERS = { page: 1, per_page: 15, search: "", type: "all", is_active: "all" };

const HostelMessPlansIndex = () => {
  const queryClient = useQueryClient();
  const { filter, handleFilter } = useSearchFilter(INITIAL_FILTERS);
  const dialogDisclosure = useDisclosure<MessPlanDialogData>();
  const deleteDisclosure = useDisclosure<{ id: number; name: string }>();
  const [isExporting, setIsExporting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["hostel-mess-plans", filter],
    queryFn: () => hostelApi.messPlans.index({
      page: filter.page,
      per_page: filter.per_page,
      search: filter.search || undefined,
      type: filter.type === "all" ? undefined : filter.type,
      is_active: filter.is_active === "all" ? undefined : filter.is_active,
    }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => hostelApi.messPlans.destroy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hostel-mess-plans"] });
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
      if (filter.type && filter.type !== "all") params.append("type", String(filter.type));
      if (filter.is_active && filter.is_active !== "all") params.append("is_active", String(filter.is_active));

      const downloadUrl = `/api/v1/hostel/mess-plans/export?${params.toString()}`;
      window.open(downloadUrl, "_blank");
    } catch (err) {
      console.error("Export failed", err);
    } finally {
      setIsExporting(false);
    }
  };

  const rows = (data?.data ?? []) as HostelMessPlan[];
  const stats = (data as any)?.meta?.stats ?? { total_plans: 0, active_plans: 0, veg_plans: 0, non_veg_plans: 0 };

  return (
    <>
      <Head title="Hostel Mess Plans" />
      <MessPlanDialog
        open={dialogDisclosure.isOpen}
        onClose={() => dialogDisclosure.onClose()}
        data={dialogDisclosure.data ?? undefined}
      />
      <ConfirmDialog
        open={deleteDisclosure.isOpen}
        onOpenChange={deleteDisclosure.onClose}
        title="Delete Mess Plan"
        description={`Are you sure you want to delete the plan "${deleteDisclosure.data?.name}"? This action cannot be undone.`}
        onConfirm={() => deleteDisclosure.data && deleteMutation.mutate(deleteDisclosure.data.id)}
        isLoading={deleteMutation.isPending}
        confirmText="Delete"
        variant="danger"
        confirmationKeyword="DELETE"
      />
      <TooltipProvider>
        <div className="space-y-6">
          <MainPageHeader
            icon={Utensils}
            title="Mess Plans Management"
            subtitle="Manage dining options available to hostel residents."
            breadcrumbs={[...HOSTEL_BREADCRUMBS, { title: "Mess Plans", href: "/hostel/mess-plans" }]}
          />

          {/* Analytics stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white dark:bg-card border-border/50 shadow-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Total Plans</p>
                  <p className="text-2xl font-black text-foreground">{stats.total_plans}</p>
                </div>
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <Utensils className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-card border-border/50 shadow-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Active Plans</p>
                  <p className="text-2xl font-black text-foreground">{stats.active_plans}</p>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Activity className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-card border-border/50 shadow-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Vegetarian Plans</p>
                  <p className="text-2xl font-black text-foreground">{stats.veg_plans}</p>
                </div>
                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Salad className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-card border-border/50 shadow-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Non-Veg/Both Plans</p>
                  <p className="text-2xl font-black text-foreground">{stats.non_veg_plans}</p>
                </div>
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Flame className="size-5" />
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
                <span>Add Mess Plan</span>
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
                        name: "type",
                        type: FORM_TYPE.SELECT,
                        label: "Type",
                        placeholder: "Select type",
                        options: [
                          { key: "all", text: "All Types", value: "all" },
                          { key: "veg", text: "Vegetarian", value: "veg" },
                          { key: "non-veg", text: "Non-Vegetarian", value: "non-veg" },
                          { key: "both", text: "Both", value: "both" },
                        ]
                      },
                      {
                        name: "is_active",
                        type: FORM_TYPE.SELECT,
                        label: "Status",
                        placeholder: "Select status",
                        options: [
                          { key: "all", text: "All Statuses", value: "all" },
                          { key: "1", text: "Active", value: "1" },
                          { key: "0", text: "Inactive", value: "0" },
                        ]
                      }
                    ],
                    searchGroup: {
                      selectName: "search_by",
                      searchName: "search",
                      options: [
                        { value: "name", label: "Plan Name" },
                      ],
                      placeholder: "Search plans...",
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
                        message="No mess plans found"
                        description="Add a mess plan to offer dining services."
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
                          <div className="font-semibold text-foreground tracking-tight">{row.name}</div>
                          {row.description && <div className="text-xs text-muted-foreground truncate max-w-[200px]">{row.description}</div>}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className="capitalize">
                            {row.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-mono">
                          {formatCurrency(row.monthly_fee)}
                        </TableCell>
                        <TableCell>
                          {row.is_active ? (
                            <div className="flex items-center text-green-600 gap-1 text-xs font-medium">
                              <CheckCircle2 className="w-3 h-3" /> Active
                            </div>
                          ) : (
                            <div className="flex items-center text-muted-foreground gap-1 text-xs font-medium">
                              <XCircle className="w-3 h-3" /> Inactive
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="w-1/6">
                          <div className="flex items-center gap-0.5">
                            <PermissionGate can="update_hostel_mess_plans">
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
                                <TooltipContent>Edit</TooltipContent>
                              </Tooltip>
                            </PermissionGate>
                            <PermissionGate can="delete_hostel_mess_plans">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon-sm"
                                    variant="ghost"
                                    className="text-destructive/60 hover:text-destructive hover:bg-destructive/5"
                                    onClick={() => deleteDisclosure.onOpen({ id: row.id, name: row.name })}
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

export default HostelMessPlansIndex;
