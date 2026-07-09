import DataTable, {
  TableEmptyState,
  TableSkeletonLoader,
} from "@/components/dataTable";
import Each from "@/components/Each";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FilterBar } from "@/components/filter-bar";
import { getSerialNumber } from "@/lib/utils";
import { Head } from "@inertiajs/react";
import { MapPin, Pencil, Plus, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useSearchFilter from "@/hooks/useSearchfilter";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDisclosure } from "@/hooks/useDisclosure";
import inventoryApi from "@/lib/api/inventoryApi";
import { InventoryLocationDialog } from "@/components/admin/inventoryLocationDialog";
import { PermissionGate } from "@/components/PermissionGate";
import {
  INVENTORY_LOCATIONS_BREADCRUMBS,
  INVENTORY_LOCATIONS_GUIDELINES,
} from "@/constants/page/admin/inventory";
import { useRegisterGuide } from '@/components/GuideProvider';
import { INVENTORY_LOCATIONS_GUIDE } from "@/constants/guides/inventory";
import React from 'react';

const COLUMNS = [
  { key: "serial", label: "#" },
  { key: "name", label: "Name" },
  { key: "code", label: "Code" },
  { key: "action", label: "Actions" },
];

const INITIAL_FILTERS = { page: 1, per_page: 15, search: "", search_by: "name" };

type LocationRow = { id: number; name: string; code?: string };

const InventoryLocationsIndex = () => {
  const queryClient = useQueryClient();
useRegisterGuide(INVENTORY_LOCATIONS_GUIDE);

  const { filter, handleFilter } = useSearchFilter(INITIAL_FILTERS);
  const locationDisclosure = useDisclosure<LocationRow>();
  const deleteDisclosure =
    useDisclosure<{ id: number; name: string; code?: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ["inventory-locations", filter],
    queryFn: () => inventoryApi.locations.index(filter),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => inventoryApi.locations.destroy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-locations"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-items-list"] });
      deleteDisclosure.onClose();
    },
  });

  const handleFilterChange = (updates: Record<string, unknown>) => {
    handleFilter({ ...updates, page: 1 });
  };

  const rows = (data?.data ?? []) as LocationRow[];

  return (
    <>
      <Head title="Inventory Locations" />
      <InventoryLocationDialog
        open={locationDisclosure.isOpen}
        onClose={() => locationDisclosure.onClose()}
        data={locationDisclosure.data ?? undefined}
      />
      <ConfirmDialog
        open={deleteDisclosure.isOpen}
        onOpenChange={deleteDisclosure.onClose}
        title="Delete Location"
        description={`Are you sure you want to delete "${deleteDisclosure.data?.name}"?`}
        onConfirm={() => deleteDisclosure.data && deleteMutation.mutate(deleteDisclosure.data.id)}
        isLoading={deleteMutation.isPending}
        confirmText="Delete"
        variant="danger"
        confirmationKeyword="DELETE"
      />
      <TooltipProvider>
        <div className="space-y-6">
          <MainPageHeader
            id="inventory-locations-header"
            breadcrumbs={INVENTORY_LOCATIONS_BREADCRUMBS}
            icon={MapPin}
            guidance={INVENTORY_LOCATIONS_GUIDE}
          />
          <div className="flex justify-end">
            <PermissionGate can="create_inventory_locations">
              <Button
                id="new-location-btn"
                className="w-full sm:w-auto"
                onClick={() => locationDisclosure.onOpen()}
              >
                <Plus className="size-4" />
                <span>Add Location</span>
              </Button>
            </PermissionGate>
          </div>
          <Card>
            <CardHeader className="pb-4">
              <FilterBar values={filter} onChange={handleFilterChange} showFilterButton={false}>
                <FilterBar.Renderer config={{
                  filters: [],
                  searchGroup: {
                    selectName: "search_by",
                    searchName: "search",
                    options: [
                      { value: "name", label: "Name" },
                      { value: "code", label: "Code" },
                    ],
                    placeholder: "Search locations...",
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
                handlePageSizeChange={(size) =>
                  handleFilter({ per_page: size, page: 1 })
                }
              >
                <Each
                  isLoading={isLoading}
                  of={data?.data}
                  nodatafound={
                    <TableEmptyState
                      colSpan={COLUMNS.length}
                      message="No locations found"
                      description="Add a location to use in item forms."
                    />
                  }
                  fallback={
                    <TableSkeletonLoader columns={COLUMNS.length} />
                  }
                  render={(row: { id: number; name: string; code?: string }, index) => (
                    <TableRow key={row.id} className="hover:bg-muted/50">
                      <TableCell className="w-16 text-muted-foreground font-mono text-sm">
                        {getSerialNumber(
                          data?.meta?.current_page ?? 1,
                          filter.per_page ?? 15,
                          index
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell className="text-muted-foreground">{row.code ?? "—"}</TableCell>
                      <TableCell className="w-1/6">
                        <div className="flex items-center gap-0.5">
                          <PermissionGate can="update_inventory_locations">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon-sm"
                                  variant="ghost"
                                  onClick={() => locationDisclosure.onOpen(row)}
                                >
                                  <Pencil className="size-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit</TooltipContent>
                            </Tooltip>
                          </PermissionGate>
                          <PermissionGate can="delete_inventory_locations">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon-sm"
                                  variant="ghost"
                                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                  onClick={() =>
                                    deleteDisclosure.onOpen({
                                      id: row.id,
                                      name: row.name,
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

export default InventoryLocationsIndex;
