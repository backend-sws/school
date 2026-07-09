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
import { UserCircle, Pencil, Plus, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useSearchFilter from "@/hooks/useSearchfilter";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDisclosure } from "@/hooks/useDisclosure";
import transportApi from "@/lib/api/transportApi";
import { TransportDriverDialog, type TransportDriverDialogData } from "@/components/admin/transportDriverDialog";
import { PermissionGate } from "@/components/PermissionGate";
import {
  TRANSPORT_DRIVERS_BREADCRUMBS,
  TRANSPORT_DRIVERS_GUIDELINES,
} from "@/constants/page/admin/transport";
import { useRegisterGuide } from '@/components/GuideProvider';
import { TRANSPORT_DRIVERS_GUIDE } from "@/constants/guides/transport";
import React from 'react';

const COLUMNS = [
  { key: "serial", label: "#" },
  { key: "name", label: "Name" },
  { key: "license_number", label: "License" },
  { key: "mobile", label: "Mobile" },
  { key: "is_active", label: "Active" },
  { key: "action", label: "Actions" },
];

const INITIAL_FILTERS = { page: 1, per_page: 15, search: "", search_by: "name" };

type DriverRow = {
  id: number;
  name: string;
  license_number?: string;
  license_valid_until?: string;
  mobile?: string;
  email?: string;
  is_active?: boolean;
};

const TransportDriversIndex = () => {
  const queryClient = useQueryClient();
useRegisterGuide(TRANSPORT_DRIVERS_GUIDE);
  const { filter, handleFilter } = useSearchFilter(INITIAL_FILTERS);
  const dialogDisclosure = useDisclosure<TransportDriverDialogData>();
  const deleteDisclosure = useDisclosure<{ id: number; name: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ["transport-drivers", filter],
    queryFn: () => transportApi.drivers.index(filter),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => transportApi.drivers.destroy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transport-drivers"] });
      deleteDisclosure.onClose();
    },
  });

  const handleFilterChange = (updates: Record<string, unknown>) => {
    handleFilter({ ...updates, page: 1 });
  };

  const rows = (data?.data ?? []) as DriverRow[];

  return (
    <>
      <Head title="Transport Drivers" />
      <TransportDriverDialog
        open={dialogDisclosure.isOpen}
        onClose={() => dialogDisclosure.onClose()}
        data={dialogDisclosure.data ?? undefined}
      />
      <ConfirmDialog
        open={deleteDisclosure.isOpen}
        onOpenChange={deleteDisclosure.onClose}
        title="Delete Driver"
        description={`Are you sure you want to delete "${deleteDisclosure.data?.name}"? Remove vehicle/assignment links first if any.`}
        onConfirm={() => deleteDisclosure.data && deleteMutation.mutate(deleteDisclosure.data.id)}
        isLoading={deleteMutation.isPending}
        confirmText="Delete"
        variant="danger"
        confirmationKeyword="DELETE"
      />
      <TooltipProvider>
        <div className="space-y-6">
          <MainPageHeader
            id="transport-drivers-header"
            breadcrumbs={TRANSPORT_DRIVERS_BREADCRUMBS}
            icon={UserCircle}
            guidance={TRANSPORT_DRIVERS_GUIDE}
          />
          <div className="flex justify-end">
            <PermissionGate can="create_transport_drivers">
              <Button id="new-driver-btn" onClick={() => dialogDisclosure.onOpen(null)}>
                <Plus className="size-4" />
                <span>Add Driver</span>
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
                      { value: "name", label: "Name" },
                      { value: "license", label: "License" },
                    ],
                    placeholder: "Search drivers...",
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
                      message="No drivers found"
                      description="Add a driver to get started."
                    />
                  }
                  fallback={<TableSkeletonLoader columns={COLUMNS.length} />}
                  keyExtractor={(row: DriverRow) => row.id}
                  render={(row: DriverRow, index) => (
                    <TableRow key={row.id} className="hover:bg-muted/50">
                      <TableCell className="w-16 text-muted-foreground font-mono text-sm">
                        {getSerialNumber(data?.meta?.current_page ?? 1, filter.per_page ?? 15, index)}
                      </TableCell>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell className="text-muted-foreground">{row.license_number ?? "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{row.mobile ?? "—"}</TableCell>
                      <TableCell>{row.is_active ? "Yes" : "No"}</TableCell>
                      <TableCell className="w-1/6">
                        <div className="flex items-center gap-0.5">
                          <PermissionGate can="update_transport_drivers">
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
                          <PermissionGate can="delete_transport_drivers">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon-sm"
                                  variant="ghost"
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
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
      </TooltipProvider>
    </>
  );
};

export default TransportDriversIndex;
