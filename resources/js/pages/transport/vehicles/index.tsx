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
import { Bus, Pencil, Plus, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useSearchFilter from "@/hooks/useSearchfilter";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDisclosure } from "@/hooks/useDisclosure";
import transportApi from "@/lib/api/transportApi";
import { TransportVehicleDialog, type TransportVehicleDialogData } from "@/components/admin/transportVehicleDialog";
import { PermissionGate } from "@/components/PermissionGate";
import {
  TRANSPORT_VEHICLES_BREADCRUMBS,
  TRANSPORT_VEHICLES_GUIDELINES,
} from "@/constants/page/admin/transport";
import { useRegisterGuide } from '@/components/GuideProvider';
import { TRANSPORT_VEHICLES_GUIDE } from "@/constants/guides/transport";
import React from 'react';

const COLUMNS = [
  { key: "serial", label: "#" },
  { key: "registration_number", label: "Registration" },
  { key: "vehicle_type", label: "Type" },
  { key: "capacity", label: "Capacity" },
  { key: "status", label: "Status" },
  { key: "action", label: "Actions" },
];

const INITIAL_FILTERS = { page: 1, per_page: 15, search: "", search_by: "registration_number" };

type VehicleRow = {
  id: number;
  registration_number: string;
  vehicle_type?: string;
  capacity?: number;
  status?: string;
  transport_route_id?: number | null;
  transport_driver_id?: number | null;
};

const TransportVehiclesIndex = () => {
  const queryClient = useQueryClient();
useRegisterGuide(TRANSPORT_VEHICLES_GUIDE);
  const { filter, handleFilter } = useSearchFilter(INITIAL_FILTERS);
  const dialogDisclosure = useDisclosure<TransportVehicleDialogData>();
  const deleteDisclosure = useDisclosure<{ id: number; registration_number: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ["transport-vehicles", filter],
    queryFn: () => transportApi.vehicles.index(filter),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => transportApi.vehicles.destroy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transport-vehicles"] });
      deleteDisclosure.onClose();
    },
  });

  const handleFilterChange = (updates: Record<string, unknown>) => {
    handleFilter({ ...updates, page: 1 });
  };

  const rows = (data?.data ?? []) as VehicleRow[];

  return (
    <>
      <Head title="Transport Vehicles" />
      <TransportVehicleDialog
        open={dialogDisclosure.isOpen}
        onClose={() => dialogDisclosure.onClose()}
        data={dialogDisclosure.data ?? undefined}
      />
      <ConfirmDialog
        open={deleteDisclosure.isOpen}
        onOpenChange={deleteDisclosure.onClose}
        title="Delete Vehicle"
        description={`Are you sure you want to delete vehicle "${deleteDisclosure.data?.registration_number}"? Remove assignments first if any.`}
        onConfirm={() => deleteDisclosure.data && deleteMutation.mutate(deleteDisclosure.data.id)}
        isLoading={deleteMutation.isPending}
        confirmText="Delete"
        variant="danger"
        confirmationKeyword="DELETE"
      />
      <TooltipProvider>
        <div className="space-y-6">
          <MainPageHeader
            id="transport-vehicles-header"
            breadcrumbs={TRANSPORT_VEHICLES_BREADCRUMBS}
            icon={Bus}
            guidance={TRANSPORT_VEHICLES_GUIDE}
          />
          <div className="flex justify-end">
            <PermissionGate can="create_transport_vehicles">
              <Button onClick={() => dialogDisclosure.onOpen(null)}>
                <Plus className="size-4" />
                <span>Add Vehicle</span>
              </Button>
            </PermissionGate>
          </div>
          <Card>
            <CardHeader className="pb-4">
              <FilterBar values={filter} onChange={handleFilterChange}>
                <FilterBar.Renderer config={{
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
                }} />
              </FilterBar>
            </CardHeader>
            <CardContent className="pt-0" id="vehicles-table">
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
                      message="No vehicles found"
                      description="Add a vehicle to get started."
                    />
                  }
                  fallback={<TableSkeletonLoader columns={COLUMNS.length} />}
                  keyExtractor={(row: VehicleRow) => row.id}
                  render={(row: VehicleRow, index) => (
                    <TableRow key={row.id} className="hover:bg-muted/50">
                      <TableCell className="w-16 text-muted-foreground font-mono text-sm">
                        {getSerialNumber(data?.meta?.current_page ?? 1, filter.per_page ?? 15, index)}
                      </TableCell>
                      <TableCell className="font-medium">{row.registration_number}</TableCell>
                      <TableCell className="text-muted-foreground">{row.vehicle_type ?? "—"}</TableCell>
                      <TableCell>{row.capacity ?? "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{row.status ?? "—"}</TableCell>
                      <TableCell className="w-1/6">
                        <div className="flex items-center gap-0.5">
                          <PermissionGate can="update_transport_vehicles">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon-sm"
                                  variant="ghost"
                                  onClick={() => dialogDisclosure.onOpen(row)}
                                >
                                  <Pencil className="size-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit</TooltipContent>
                            </Tooltip>
                          </PermissionGate>
                          <PermissionGate can="delete_transport_vehicles">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon-sm"
                                  variant="ghost"
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() => deleteDisclosure.onOpen({ id: row.id, registration_number: row.registration_number })}
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

export default TransportVehiclesIndex;
