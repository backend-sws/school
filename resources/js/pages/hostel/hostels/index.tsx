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
import { getSerialNumber, cn } from "@/lib/utils";
import { Head, Link } from "@inertiajs/react";
import { Pencil, Plus, Trash2, Building, Eye } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useSearchFilter from "@/hooks/useSearchfilter";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDisclosure } from "@/hooks/useDisclosure";
import { hostelApi, type Hostel } from "@/lib/api/hostelApi";
import { HostelDialog, type HostelDialogData } from "@/components/admin/hostelDialog";
import { PermissionGate } from "@/components/PermissionGate";
import {
  HOSTEL_BREADCRUMBS,
} from "@/constants/page/admin/hostel";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { DoorOpen, Bed, Percent } from "lucide-react";
import { FORM_TYPE } from "@/constants";

const COLUMNS = [
  { key: "serial", label: "#" },
  { key: "name", label: "Name" },
  { key: "code", label: "Code" },
  { key: "type", label: "Type" },
  { key: "warden", label: "Warden" },
  { key: "capacity", label: "Beds (Occ / Total)" },
  { key: "action", label: "Actions" },
];

const INITIAL_FILTERS = { page: 1, per_page: 15, search: "", type: "all" };

const HostelsIndex = () => {
  const queryClient = useQueryClient();
  const { filter, handleFilter } = useSearchFilter(INITIAL_FILTERS);
  const dialogDisclosure = useDisclosure<HostelDialogData>();
  const deleteDisclosure = useDisclosure<{ id: number; name: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ["hostel-hostels", filter],
    queryFn: () => hostelApi.hostels.index({
      page: filter.page,
      per_page: filter.per_page,
      search: filter.search || undefined,
      type: filter.type === "all" ? undefined : filter.type,
    }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => hostelApi.hostels.destroy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hostel-hostels"] });
      deleteDisclosure.onClose();
    },
  });

  const handleFilterChange = (updates: Record<string, unknown>) => {
    handleFilter({ ...updates, page: 1 });
  };

  const rows = (data?.data ?? []) as Hostel[];
  const stats = (data as any)?.meta?.stats ?? { total_buildings: 0, total_rooms: 0, total_beds: 0, occupied_beds: 0 };

  return (
    <>
      <Head title="Hostel Buildings" />
      <HostelDialog
        open={dialogDisclosure.isOpen}
        onClose={() => dialogDisclosure.onClose()}
        data={dialogDisclosure.data ?? undefined}
      />
      <ConfirmDialog
        open={deleteDisclosure.isOpen}
        onOpenChange={deleteDisclosure.onClose}
        title="Delete Hostel"
        description={`Are you sure you want to delete "${deleteDisclosure.data?.name}"? This action cannot be undone.`}
        onConfirm={() => deleteDisclosure.data && deleteMutation.mutate(deleteDisclosure.data.id)}
        isLoading={deleteMutation.isPending}
        confirmText="Delete"
        variant="danger"
        confirmationKeyword="DELETE"
      />
      <TooltipProvider>
        <div className="space-y-6">
          <MainPageHeader
            icon={Building}
            title="Hostel Buildings"
            subtitle="Manage hostel buildings, their types, and assigned wardens."
            breadcrumbs={[...HOSTEL_BREADCRUMBS, { title: "Buildings", href: "/hostel/hostels" }]}
          />

          {/* Analytics stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white dark:bg-card border-border/50 shadow-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Total Buildings</p>
                  <p className="text-2xl font-black text-foreground">{stats.total_buildings}</p>
                </div>
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <Building className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-card border-border/50 shadow-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Total Rooms</p>
                  <p className="text-2xl font-black text-foreground">{stats.total_rooms}</p>
                </div>
                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <DoorOpen className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-card border-border/50 shadow-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Total Beds</p>
                  <p className="text-2xl font-black text-foreground">{stats.occupied_beds} / {stats.total_beds}</p>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Bed className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-card border-border/50 shadow-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Occupancy Rate</p>
                  <p className="text-2xl font-black text-foreground">
                    {stats.total_beds ? Math.round((stats.occupied_beds / stats.total_beds) * 100) : 0}%
                  </p>
                </div>
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Percent className="size-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <PermissionGate can="create_hostels">
              <Button
                onClick={() => dialogDisclosure.onOpen(null)}
                className="w-full sm:w-auto"
              >
                <Plus className="size-4 mr-2" />
                <span>Add Hostel</span>
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
                          { key: "boys", text: "Boys", value: "boys" },
                          { key: "girls", text: "Girls", value: "girls" },
                          { key: "co-ed", text: "Co-ed", value: "co-ed" },
                          { key: "staff", text: "Staff", value: "staff" },
                        ]
                      }
                    ],
                    searchGroup: {
                      selectName: "search_by",
                      searchName: "search",
                      options: [
                        { value: "name", label: "Name or Code" },
                      ],
                      placeholder: "Search hostels...",
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
                        message="No hostels found"
                        description="Add a hostel building to get started."
                      />
                    }
                    fallback={<TableSkeletonLoader columns={COLUMNS.length} />}
                    keyExtractor={(row) => row.id}
                    render={(row, index) => (
                      <TableRow key={row.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="w-16 text-muted-foreground font-mono text-xs">
                          {getSerialNumber(data?.meta?.current_page ?? 1, filter.per_page ?? 15, index)}
                        </TableCell>
                        <TableCell className="font-semibold text-foreground tracking-tight">
                          <Link href={`/hostel/hostels/${row.id}`} className="hover:underline text-primary">
                            {row.name}
                          </Link>
                        </TableCell>
                        <TableCell>
                           <span className="font-mono text-[11px] bg-muted/40 px-1.5 py-0.5 rounded border border-border/20 text-muted-foreground">
                            {row.code ?? "—"}
                           </span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {row.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm">{row.warden_name || 'Unassigned'}</span>
                            {row.warden_contact && <span className="text-xs text-muted-foreground">{row.warden_contact}</span>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{row.occupied_beds_count ?? 0} / {row.beds_count ?? 0}</span>
                            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary" 
                                style={{ width: `${row.beds_count ? Math.min(100, ((row.occupied_beds_count ?? 0) / (row.beds_count ?? 1)) * 100) : 0}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="w-1/6">
                          <div className="flex items-center gap-0.5">
                            <PermissionGate can="view_hostels">
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button size="icon-sm" variant="ghost" asChild className="hover:text-primary hover:bg-primary/5">
                                    <Link href={`/hostel/hostels/${row.id}`}>
                                      <Eye className="size-4" />
                                    </Link>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>View Rooms & Floors</TooltipContent>
                              </Tooltip>
                            </PermissionGate>
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
                                <TooltipContent>Edit</TooltipContent>
                              </Tooltip>
                            </PermissionGate>
                            <PermissionGate can="delete_hostels">
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

export default HostelsIndex;
