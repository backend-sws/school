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
import { Head } from "@inertiajs/react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useSearchFilter from "@/hooks/useSearchfilter";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDisclosure } from "@/hooks/useDisclosure";
import { hostelApi, type HostelRoom } from "@/lib/api/hostelApi";
import { RoomDialog, type RoomDialogData } from "@/components/admin/roomDialog";
import { PermissionGate } from "@/components/PermissionGate";
import { HOSTEL_BREADCRUMBS } from "@/constants/page/admin/hostel";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Badge } from "@/components/ui/badge";
import { FORM_TYPE } from "@/constants";
import React, { useState } from 'react';
import { Download, Loader2, Bed, UserCheck, CheckCircle2, DoorOpen, Building } from "lucide-react";

const COLUMNS = [
  { key: "serial", label: "#" },
  { key: "hostel", label: "Hostel & Floor" },
  { key: "room_number", label: "Room No." },
  { key: "type", label: "Type" },
  { key: "capacity", label: "Beds" },
  { key: "fee", label: "Monthly Fee" },
  { key: "action", label: "Actions" },
];

const INITIAL_FILTERS = { page: 1, per_page: 15, search: "", type: "all", hostel_id: "all", availability: "all" };

const HostelRoomsIndex = () => {
  const queryClient = useQueryClient();
  const { filter, handleFilter } = useSearchFilter(INITIAL_FILTERS);
  const dialogDisclosure = useDisclosure<RoomDialogData>();
  const deleteDisclosure = useDisclosure<{ id: number; name: string }>();
  const [isExporting, setIsExporting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["hostel-rooms", filter],
    queryFn: () => hostelApi.rooms.index({
      page: filter.page,
      per_page: filter.per_page,
      search: filter.search || undefined,
      type: filter.type === "all" ? undefined : filter.type,
      hostel_id: filter.hostel_id === "all" ? undefined : filter.hostel_id,
      availability: filter.availability === "all" ? undefined : filter.availability,
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
    mutationFn: (id: number) => hostelApi.rooms.destroy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hostel-rooms"] });
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
      if (filter.type && filter.type !== "all") params.append("type", String(filter.type));
      if (filter.availability && filter.availability !== "all") params.append("availability", String(filter.availability));

      const downloadUrl = `/api/v1/hostel/rooms/export?${params.toString()}`;
      window.open(downloadUrl, "_blank");
    } catch (err) {
      console.error("Export failed", err);
    } finally {
      setIsExporting(false);
    }
  };

  const rows = (data?.data ?? []) as HostelRoom[];
  const stats = (data as any)?.meta?.stats ?? { total_rooms: 0, total_beds: 0, occupied_beds: 0, available_beds: 0 };

  return (
    <>
      <Head title="Hostel Rooms" />
      <RoomDialog
        open={dialogDisclosure.isOpen}
        onClose={() => dialogDisclosure.onClose()}
        data={dialogDisclosure.data ?? undefined}
      />
      <ConfirmDialog
        open={deleteDisclosure.isOpen}
        onOpenChange={deleteDisclosure.onClose}
        title="Delete Room"
        description={`Are you sure you want to delete room "${deleteDisclosure.data?.name}"? This action cannot be undone.`}
        onConfirm={() => deleteDisclosure.data && deleteMutation.mutate(deleteDisclosure.data.id)}
        isLoading={deleteMutation.isPending}
        confirmText="Delete"
        variant="danger"
        confirmationKeyword="DELETE"
      />
      <TooltipProvider>
        <div className="space-y-6">
          <MainPageHeader
            icon={DoorOpen}
            title="Rooms Management"
            subtitle="Manage rooms across all hostel buildings."
            breadcrumbs={[...HOSTEL_BREADCRUMBS, { title: "Rooms", href: "/hostel/rooms" }]}
          />

          {/* Analytics stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-white dark:bg-card border-border/50 shadow-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Total Rooms</p>
                  <p className="text-2xl font-black text-foreground">{stats.total_rooms}</p>
                </div>
                <div className="p-3 rounded-2xl bg-primary/10 text-primary">
                  <Building className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-card border-border/50 shadow-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Beds Capacity</p>
                  <p className="text-2xl font-black text-foreground">{stats.total_beds}</p>
                </div>
                <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  <Bed className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-card border-border/50 shadow-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Occupied Beds</p>
                  <p className="text-2xl font-black text-foreground">{stats.occupied_beds}</p>
                </div>
                <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <UserCheck className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-card border-border/50 shadow-sm">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Available Beds</p>
                  <p className="text-2xl font-black text-foreground">{stats.available_beds}</p>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-5" />
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
                <span>Add Room</span>
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
                        name: "type",
                        type: FORM_TYPE.SELECT,
                        label: "Type",
                        placeholder: "Select type",
                        options: [
                          { key: "all", text: "All Types", value: "all" },
                          { key: "single", text: "Single", value: "single" },
                          { key: "double", text: "Double", value: "double" },
                          { key: "triple", text: "Triple", value: "triple" },
                          { key: "dormitory", text: "Dormitory", value: "dormitory" },
                        ]
                      },
                      {
                        name: "availability",
                        type: FORM_TYPE.SELECT,
                        label: "Availability",
                        placeholder: "Select availability",
                        options: [
                          { key: "all", text: "All", value: "all" },
                          { key: "available", text: "Available Beds", value: "available" },
                          { key: "full", text: "Fully Occupied", value: "full" },
                        ]
                      }
                    ],
                    searchGroup: {
                      selectName: "search_by",
                      searchName: "search",
                      options: [
                        { value: "room_number", label: "Room Number" },
                      ],
                      placeholder: "Search rooms...",
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
                        message="No rooms found"
                        description="Add a room to get started."
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
                            <span className="font-semibold text-foreground tracking-tight">{row.hostel?.name ?? '—'}</span>
                            <span className="text-xs text-muted-foreground">{row.floor?.name ?? 'No Floor'}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium text-primary">
                          {row.room_number}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {row.type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{row.occupied_beds_count ?? 0} / {row.bed_count}</span>
                            <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-primary" 
                                style={{ width: `${Math.min(100, ((row.occupied_beds_count ?? 0) / row.bed_count) * 100)}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {row.monthly_fee ? `₹${row.monthly_fee}` : "—"}
                        </TableCell>
                        <TableCell className="w-1/6">
                          <div className="flex items-center gap-0.5">
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
                                    onClick={() => deleteDisclosure.onOpen({ id: row.id, name: row.room_number })}
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

export default HostelRoomsIndex;
