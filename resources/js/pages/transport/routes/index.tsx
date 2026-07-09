import DataTable, { TableEmptyState, TableSkeletonLoader } from "@/components/dataTable";
import Each from "@/components/Each";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableCell, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { FilterBar } from "@/components/filter-bar";
import { getSerialNumber } from "@/lib/utils";
import { Head, Link } from "@inertiajs/react";
import { ClipboardList, Eye, Pencil, Plus, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useSearchFilter from "@/hooks/useSearchfilter";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDisclosure } from "@/hooks/useDisclosure";
import transportApi from "@/lib/api/transportApi";
import { TransportRouteDialog, type TransportRouteDialogData } from "@/components/admin/transportRouteDialog";
import { PermissionGate } from "@/components/PermissionGate";
import { TRANSPORT_ROUTES_BREADCRUMBS, TRANSPORT_ROUTES_GUIDELINES } from "@/constants/page/admin/transport";
import { useRegisterGuide } from '@/components/GuideProvider';
import { TRANSPORT_ROUTES_GUIDE } from "@/constants/guides/transport";
import React, { useMemo } from 'react';
import { FORM_TYPE } from "@/constants";

const COLUMNS = [
  { key: "serial", label: "#" },
  { key: "name", label: "Name" },
  { key: "code", label: "Code" },
  { key: "stops_count", label: "Stops" },
  { key: "action", label: "Actions" },
];

const INITIAL_FILTERS = { page: 1, per_page: 15, search: "", search_by: "name", is_active: "all", stop_id: "all" };

type RouteRow = { id: number; name: string; code?: string; route_stops_count?: number };

const TransportRoutesIndex = () => {
  const queryClient = useQueryClient();
  useRegisterGuide(TRANSPORT_ROUTES_GUIDE);
  const { filter, handleFilter } = useSearchFilter(INITIAL_FILTERS);
  const dialogDisclosure = useDisclosure<TransportRouteDialogData>();
  const deleteDisclosure = useDisclosure<{ id: number; name: string }>();

  const { data: stopsRes } = useQuery({
    queryKey: ["transport-stops-list"],
    queryFn: () => transportApi.stops.index({ per_page: 200 }),
  });
  const stops = (stopsRes as any)?.data || [];

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
        tooltip: "Filter routes by active/inactive status",
      },
      {
        name: "stop_id",
        type: FORM_TYPE.SELECT,
        label: "Stop",
        placeholder: "Select stop",
        options: [
          { key: "all", text: "All Stops", value: "all" },
          ...((stops as any[]) || []).map((s: any) => ({
            key: String(s.id),
            text: s.name,
            value: String(s.id),
          })),
        ],
        tooltip: "Filter routes by assigned transport stop",
      },
    ],
    searchGroup: {
      selectName: "search_by",
      searchName: "search",
      options: [
        { value: "name", label: "Name" },
        { value: "code", label: "Code" },
      ],
      placeholder: "Search routes...",
    },
  }), [stops]);

  const { data, isLoading } = useQuery({
    queryKey: ["transport-routes", filter],
    queryFn: () => transportApi.routes.index(filter),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => transportApi.routes.destroy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transport-routes"] });
      deleteDisclosure.onClose();
    },
  });

  const rows = (data?.data ?? []) as RouteRow[];

  return (
    <>
      <Head title="Transport Routes" />
      <TransportRouteDialog open={dialogDisclosure.isOpen} onClose={() => dialogDisclosure.onClose()} data={dialogDisclosure.data ?? undefined} />
      <ConfirmDialog
        open={deleteDisclosure.isOpen}
        onOpenChange={deleteDisclosure.onClose}
        title="Delete Route"
        description={`Are you sure you want to delete "${deleteDisclosure.data?.name}"? Remove assignments first if any.`}
        onConfirm={() => deleteDisclosure.data && deleteMutation.mutate(deleteDisclosure.data.id)}
        isLoading={deleteMutation.isPending}
        confirmText="Delete"
        variant="danger"
        confirmationKeyword="DELETE"
      />
      <TooltipProvider>
        <div className="space-y-6">
          <MainPageHeader
            id="transport-routes-header"
            breadcrumbs={TRANSPORT_ROUTES_BREADCRUMBS}
            icon={ClipboardList}
            guidance={TRANSPORT_ROUTES_GUIDE}
          />
          <div className="flex justify-end">
            <PermissionGate can="create_transport_routes">
              <Button id="new-route-btn" onClick={() => dialogDisclosure.onOpen(null)}><Plus className="size-4" /><span>Add Route</span></Button>
            </PermissionGate>
          </div>
          <Card>
            <CardHeader className="pb-4">
              <FilterBar values={filter} onChange={(u) => handleFilter({ ...u, page: 1 })}>
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
                  keyExtractor={(row: RouteRow) => row.id}
                  nodatafound={<TableEmptyState colSpan={COLUMNS.length} message="No routes found" description="Add a route to get started." />}
                  fallback={<TableSkeletonLoader columns={COLUMNS.length} />}
                  render={(row: RouteRow, index) => (
                    <TableRow key={row.id} className="hover:bg-muted/50">
                      <TableCell className="w-16 text-muted-foreground font-mono text-sm">
                        {getSerialNumber(data?.meta?.current_page ?? 1, filter.per_page ?? 15, index)}
                      </TableCell>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell className="text-muted-foreground">{row.code ?? "—"}</TableCell>
                      <TableCell>{row.route_stops_count ?? 0}</TableCell>
                      <TableCell className="w-1/6">
                        <div className="flex items-center gap-0.5">
                          <Tooltip><TooltipTrigger asChild><Link href={`/transport/routes/${row.id}`}><Button size="icon-sm" variant="ghost"><Eye className="size-4" /></Button></Link></TooltipTrigger><TooltipContent>View</TooltipContent></Tooltip>
                          <PermissionGate can="update_transport_routes">
                            <Tooltip><TooltipTrigger asChild><Button size="icon-sm" variant="ghost" onClick={() => dialogDisclosure.onOpen(row)}><Pencil className="size-4" /></Button></TooltipTrigger><TooltipContent>Edit</TooltipContent></Tooltip>
                          </PermissionGate>
                          <PermissionGate can="delete_transport_routes">
                            <Tooltip><TooltipTrigger asChild><Button size="icon-sm" variant="ghost" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => deleteDisclosure.onOpen({ id: row.id, name: row.name })} disabled={deleteMutation.isPending}><Trash2 className="size-4" /></Button></TooltipTrigger><TooltipContent>Delete</TooltipContent></Tooltip>
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

export default TransportRoutesIndex;
