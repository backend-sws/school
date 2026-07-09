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
import { Head } from "@inertiajs/react";
import { Pencil, Plus, Trash2, BusFront } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useSearchFilter from "@/hooks/useSearchfilter";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDisclosure } from "@/hooks/useDisclosure";
import transportApi from "@/lib/api/transportApi";
import { TransportStopDialog, type TransportStopDialogData } from "@/components/admin/transportStopDialog";
import { PermissionGate } from "@/components/PermissionGate";
import {
  TRANSPORT_STOPS_BREADCRUMBS,
} from "@/constants/page/admin/transport";
import { useRegisterGuide } from '@/components/GuideProvider';
import { TRANSPORT_STOPS_GUIDE } from "@/constants/guides/transport";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import React, { useMemo } from 'react';
import { FORM_TYPE } from "@/constants";

const COLUMNS = [
  { key: "serial", label: "#" },
  { key: "name", label: "Name" },
  { key: "code", label: "Code" },
  { key: "address", label: "Address" },
  { key: "action", label: "Actions" },
];

const INITIAL_FILTERS = { page: 1, per_page: 15, search: "", search_by: "name", is_active: "all", route_id: "all" };

type StopRow = {
  id: number;
  name: string;
  code?: string;
  address?: string;
  landmark?: string;
  is_active?: boolean;
};

const TransportStopsIndex = () => {
  const queryClient = useQueryClient();
  useRegisterGuide(TRANSPORT_STOPS_GUIDE);
  const { filter, handleFilter } = useSearchFilter(INITIAL_FILTERS);
  const dialogDisclosure = useDisclosure<TransportStopDialogData>();
  const deleteDisclosure = useDisclosure<{ id: number; name: string }>();

  const { data: routesRes } = useQuery({
    queryKey: ["transport-routes-list"],
    queryFn: () => transportApi.routes.index({ per_page: 200 }),
  });
  const routes = (routesRes as any)?.data || [];

  const filterConfig = useMemo(() => ({
    filters: [
      {
        name: "is_active",
        type: FORM_TYPE.SELECT,
        label: "Status",
        placeholder: "Select status",
        options: [
          { key: "all", text: "All Status", value: "all" },
          { key: "1", text: "Active Only", value: "1" },
          { key: "0", text: "Inactive Only", value: "0" },
        ],
        tooltip: "Filter stops by active/inactive status",
      },
      {
        name: "route_id",
        type: FORM_TYPE.SELECT,
        label: "Route",
        placeholder: "Select route",
        options: [
          { key: "all", text: "All Routes", value: "all" },
          ...((routes as any[]) || []).map((r: any) => ({
            key: String(r.id),
            text: `${r.name} (${r.code ?? 'N/A'})`,
            value: String(r.id),
          })),
        ],
        tooltip: "Filter stops by assigned transport route",
      },
    ],
    searchGroup: {
      selectName: "search_by",
      searchName: "search",
      options: [
        { value: "name", label: "Name" },
        { value: "code", label: "Code" },
      ],
      placeholder: "Search stops...",
    },
  }), [routes]);

  const { data, isLoading } = useQuery({
    queryKey: ["transport-stops", filter],
    queryFn: () => transportApi.stops.index(filter),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => transportApi.stops.destroy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transport-stops"] });
      deleteDisclosure.onClose();
    },
  });

  const handleFilterChange = (updates: Record<string, unknown>) => {
    handleFilter({ ...updates, page: 1 });
  };

  const rows = (data?.data ?? []) as StopRow[];

  return (
    <>
      <Head title="Transport Stops" />
      <TransportStopDialog
        open={dialogDisclosure.isOpen}
        onClose={() => dialogDisclosure.onClose()}
        data={dialogDisclosure.data ?? undefined}
      />
      <ConfirmDialog
        open={deleteDisclosure.isOpen}
        onOpenChange={deleteDisclosure.onClose}
        title="Delete Stop"
        description={`Are you sure you want to delete "${deleteDisclosure.data?.name}"? It will be removed from all routes.`}
        onConfirm={() => deleteDisclosure.data && deleteMutation.mutate(deleteDisclosure.data.id)}
        isLoading={deleteMutation.isPending}
        confirmText="Delete"
        variant="danger"
        confirmationKeyword="DELETE"
      />
      <TooltipProvider>
        <div className="space-y-6">
          <MainPageHeader
            icon={BusFront}
            title="Transport Stops"
            subtitle="Manage and organize your institution's transport pick-up and drop-off points."
            breadcrumbs={TRANSPORT_STOPS_BREADCRUMBS}
            guidance={TRANSPORT_STOPS_GUIDE.pageGuidance}
          />

          <div className="flex justify-end">
            <PermissionGate can="create_transport_stops">
              <Button
                id="new-stop-btn"
                onClick={() => dialogDisclosure.onOpen(null)}
                className="w-full sm:w-auto"
              >
                <Plus className="size-4" />
                <span>Add Stop</span>
              </Button>
            </PermissionGate>
          </div>

          <div className="l-blur-fade l-blur-fade-delay-1">
            <Card>
              <CardHeader className="pb-4">
                <FilterBar values={filter} onChange={handleFilterChange}>
                  <FilterBar.Renderer config={filterConfig} />
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
                        message="No stops found"
                        description="Add a stop to get started."
                      />
                    }
                    fallback={<TableSkeletonLoader columns={COLUMNS.length} />}
                    keyExtractor={(row: StopRow) => row.id}
                    render={(row: StopRow, index) => (
                      <TableRow key={row.id} className="hover:bg-muted/50 transition-colors">
                        <TableCell className="w-16 text-muted-foreground font-mono text-xs">
                          {getSerialNumber(data?.meta?.current_page ?? 1, filter.per_page ?? 15, index)}
                        </TableCell>
                        <TableCell className="font-semibold text-foreground tracking-tight">{row.name}</TableCell>
                        <TableCell>
                           <span className="font-mono text-[11px] bg-muted/40 px-1.5 py-0.5 rounded border border-border/20 text-muted-foreground">
                            {row.code ?? "—"}
                           </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground/80 max-w-[200px] truncate italic text-sm">
                          {row.address ?? "—"}
                        </TableCell>
                        <TableCell className="w-1/6">
                          <div className="flex items-center gap-0.5">
                            <PermissionGate can="update_transport_stops">
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
                            <PermissionGate can="delete_transport_stops">
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

export default TransportStopsIndex;
