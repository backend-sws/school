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
import { FolderTree, Pencil, Plus, Trash2 } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useSearchFilter from "@/hooks/useSearchfilter";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDisclosure } from "@/hooks/useDisclosure";
import inventoryApi from "@/lib/api/inventoryApi";
import { InventoryCategoryDialog } from "@/components/admin/inventoryCategoryDialog";
import { PermissionGate } from "@/components/PermissionGate";
import {
  INVENTORY_CATEGORIES_BREADCRUMBS,
  INVENTORY_CATEGORIES_GUIDELINES,
} from "@/constants/page/admin/inventory";
import { useRegisterGuide } from '@/components/GuideProvider';
import { INVENTORY_CATEGORIES_GUIDE } from "@/constants/guides/inventory";
import React from 'react';

const COLUMNS = [
  { key: "serial", label: "#" },
  { key: "name", label: "Name" },
  { key: "code", label: "Code" },
  { key: "action", label: "Actions" },
];

const INITIAL_FILTERS = { page: 1, per_page: 15, search: "", search_by: "name" };

const InventoryCategoriesIndex = () => {
  const queryClient = useQueryClient();
useRegisterGuide(INVENTORY_CATEGORIES_GUIDE);
  const { filter, handleFilter } = useSearchFilter(INITIAL_FILTERS);
  const categoryDisclosure = useDisclosure<{ id: number; name: string; code?: string; description?: string } | null>();
  const deleteDisclosure = useDisclosure<{ id: number; name: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ["inventory-categories", filter],
    queryFn: () => inventoryApi.categories.index(filter),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => inventoryApi.categories.destroy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-categories"] });
      deleteDisclosure.onClose();
    },
  });

  const handleFilterChange = (updates: Record<string, unknown>) => {
    handleFilter({ ...updates, page: 1 });
  };

  return (
    <>
      <Head title="Inventory Categories" />
      <InventoryCategoryDialog
        open={categoryDisclosure.isOpen}
        onClose={(o) => categoryDisclosure.onClose()}
        data={categoryDisclosure.data ?? undefined}
      />
      <ConfirmDialog
        open={deleteDisclosure.isOpen}
        onOpenChange={deleteDisclosure.onClose}
        title="Delete Category"
        description={`Are you sure you want to delete "${deleteDisclosure.data?.name}"? Remove or reassign items first if it has any.`}
        onConfirm={() => deleteDisclosure.data && deleteMutation.mutate(deleteDisclosure.data.id)}
        isLoading={deleteMutation.isPending}
        confirmText="Delete"
        variant="danger"
        confirmationKeyword="DELETE"
      />
      <TooltipProvider>
        <div className="space-y-6">
          <MainPageHeader
            id="inventory-categories-header"
            breadcrumbs={INVENTORY_CATEGORIES_BREADCRUMBS}
            icon={FolderTree}
            guidance={INVENTORY_CATEGORIES_GUIDE}
          />
          <div className="flex justify-end">
            <PermissionGate can="create_inventory_categories">
              <Button
                id="new-category-btn"
                className="w-full sm:w-auto"
                onClick={() => categoryDisclosure.onOpen(null)}
              >
                <Plus className="size-4" />
                <span>Add Category</span>
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
                    placeholder: "Search categories...",
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
                      message="No categories found"
                      description="Add a category to get started."
                    />
                  }
                  fallback={
                    <TableSkeletonLoader columns={COLUMNS.length} />
                  }
                  render={(row: { id: number; name: string; code?: string; description?: string }, index) => (
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
                          <PermissionGate can="update_inventory_categories">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon-sm"
                                  variant="ghost"
                                  onClick={() => categoryDisclosure.onOpen(row)}
                                >
                                  <Pencil className="size-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit</TooltipContent>
                            </Tooltip>
                          </PermissionGate>
                          <PermissionGate can="delete_inventory_categories">
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

export default InventoryCategoriesIndex;
