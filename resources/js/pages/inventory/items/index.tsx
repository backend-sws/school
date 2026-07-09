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
import { Head, Link } from "@inertiajs/react";
import { Boxes, Eye, Pencil, Plus, Trash2, Package, Layers, AlertTriangle, XCircle } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FORM_TYPE } from "@/constants";
import useSearchFilter from "@/hooks/useSearchfilter";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDisclosure } from "@/hooks/useDisclosure";
import inventoryApi from "@/lib/api/inventoryApi";
import { InventoryItemDialog } from "@/components/admin/inventoryItemDialog";
import { PermissionGate } from "@/components/PermissionGate";
import {
  INVENTORY_ITEMS_BREADCRUMBS,
  INVENTORY_ITEMS_GUIDELINES,
} from "@/constants/page/admin/inventory";
import { useRegisterGuide } from '@/components/GuideProvider';
import { INVENTORY_ITEMS_GUIDE } from "@/constants/guides/inventory";
import React from 'react';

const COLUMNS = [
  { key: "serial", label: "#" },
  { key: "name", label: "Name" },
  { key: "code", label: "Code" },
  { key: "category", label: "Category" },
  { key: "quantity", label: "Stock" },
  { key: "min_stock", label: "Min Stock" },
  { key: "action", label: "Actions" },
];

const INITIAL_FILTERS = {
  page: 1,
  per_page: 15,
  search: "",
  search_by: "name",
  category_id: "",
};

type ItemRow = {
  id: number;
  name: string;
  code?: string;
  current_quantity?: number;
  category?: { name: string };
  inventory_category_id?: number;
  unit?: string;
  min_stock?: number;
  location?: string;
  description?: string;
  is_active?: boolean;
};

const InventoryItemsIndex = () => {
  const queryClient = useQueryClient();
useRegisterGuide(INVENTORY_ITEMS_GUIDE);
  const { filter, handleFilter } = useSearchFilter(INITIAL_FILTERS);
  const itemDisclosure = useDisclosure<ItemRow | null>();
  const deleteDisclosure = useDisclosure<{ id: number; name: string }>();

  const { data, isLoading } = useQuery({
    queryKey: ["inventory-items", filter],
    queryFn: () =>
      inventoryApi.items.index({
        ...filter,
        category_id: filter.category_id || undefined,
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => inventoryApi.items.destroy(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      deleteDisclosure.onClose();
    },
  });

  const handleFilterChange = (updates: Record<string, unknown>) => {
    handleFilter({ ...updates, page: 1 });
  };

  const { data: categoriesRes } = useQuery({
    queryKey: ["inventory-categories-all"],
    queryFn: () => inventoryApi.categories.index({ per_page: 500 }),
  });
  const categories = categoriesRes?.data || [];
  const categoryOptions = React.useMemo(() => [
    { key: "all", text: "All Categories", value: "all" },
    ...categories.map((c: any) => ({ key: String(c.id), text: c.name, value: String(c.id) })),
  ], [categories]);

  const filterConfig = React.useMemo(() => ({
    filters: [
      {
        name: "category_id",
        type: FORM_TYPE.SELECT,
        label: "Category",
        placeholder: "Select category",
        tooltip: "Filter items by category",
        options: categoryOptions,
      },
      {
        name: "stock_status",
        type: FORM_TYPE.SELECT,
        label: "Stock Status",
        placeholder: "Select status",
        tooltip: "Filter items by current stock level",
        options: [
          { key: "all", text: "All Levels", value: "all" },
          { key: "in_stock", text: "In Stock", value: "in_stock" },
          { key: "low_stock", text: "Low Stock", value: "low_stock" },
          { key: "out_of_stock", text: "Out of Stock", value: "out_of_stock" },
        ],
      },
      {
        name: "active_status",
        type: FORM_TYPE.SELECT,
        label: "Active Status",
        placeholder: "Select status",
        tooltip: "Filter items by active/inactive status",
        options: [
          { key: "all", text: "All Status", value: "all" },
          { key: "active", text: "Active", value: "active" },
          { key: "inactive", text: "Inactive", value: "inactive" },
        ],
      },
      {
        name: "location",
        type: FORM_TYPE.TEXT,
        label: "Location",
        placeholder: "Search location...",
        tooltip: "Filter items by location name",
      },
    ],
    searchGroup: {
      selectName: "search_by",
      searchName: "search",
      options: [
        { value: "name", label: "Name" },
        { value: "code", label: "Code" },
      ],
      placeholder: "Search items...",
    },
  }), [categoryOptions]);

  const stats = data?.meta?.stats;

  return (
    <>
      <Head title="Inventory Items" />
      <InventoryItemDialog
        open={itemDisclosure.isOpen}
        onClose={() => itemDisclosure.onClose()}
        data={itemDisclosure.data ?? undefined}
      />
      <ConfirmDialog
        open={deleteDisclosure.isOpen}
        onOpenChange={deleteDisclosure.onClose}
        title="Delete Item"
        description={`Are you sure you want to delete "${deleteDisclosure.data?.name}"?`}
        onConfirm={() =>
          deleteDisclosure.data && deleteMutation.mutate(deleteDisclosure.data.id)
        }
        isLoading={deleteMutation.isPending}
        confirmText="Delete"
        variant="danger"
        confirmationKeyword="DELETE"
      />
      <TooltipProvider>
        <div className="p-2 sm:p-3 md:p-4 space-y-4">
          <MainPageHeader
            id="inventory-items-header"
            breadcrumbs={INVENTORY_ITEMS_BREADCRUMBS}
            icon={Boxes}
            guidance={INVENTORY_ITEMS_GUIDE}
          />
          {/* ── Analytics Stats Section ── */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Items</span>
                  <h3 className="text-2xl font-bold tracking-tight">
                    {isLoading ? "..." : (stats?.total_items_count ?? 0)}
                  </h3>
                  <p className="text-[10px] text-muted-foreground">Unique items cataloged</p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <Package className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Stock</span>
                  <h3 className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                    {isLoading ? "..." : (stats?.total_stock_quantity ?? 0)}
                  </h3>
                  <p className="text-[10px] text-muted-foreground">Cumulative items in stock</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Layers className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Low Stock</span>
                  <h3 className={`text-2xl font-bold tracking-tight ${stats?.low_stock_count > 0 ? "text-amber-600 dark:text-amber-400" : ""}`}>
                    {isLoading ? "..." : (stats?.low_stock_count ?? 0)}
                  </h3>
                  <p className="text-[10px] text-muted-foreground">Below safety threshold</p>
                </div>
                <div className={`p-3 rounded-xl ${stats?.low_stock_count > 0 ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-muted text-muted-foreground"}`}>
                  <AlertTriangle className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Out of Stock</span>
                  <h3 className={`text-2xl font-bold tracking-tight ${stats?.out_of_stock_count > 0 ? "text-destructive" : ""}`}>
                    {isLoading ? "..." : (stats?.out_of_stock_count ?? 0)}
                  </h3>
                  <p className="text-[10px] text-muted-foreground">Out of stock items</p>
                </div>
                <div className={`p-3 rounded-xl ${stats?.out_of_stock_count > 0 ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}>
                  <XCircle className="size-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <PermissionGate can="create_inventory_items">
              <Button
                id="new-item-btn"
                className="w-full sm:w-auto"
                onClick={() => itemDisclosure.onOpen(null)}
              >
                <Plus className="size-4" />
                <span>Add Item</span>
              </Button>
            </PermissionGate>
          </div>
          <Card>
            <CardHeader className="pb-4">
              <FilterBar values={filter} onChange={handleFilterChange}>
                <FilterBar.Renderer config={filterConfig} />
              </FilterBar>
            </CardHeader>
            <CardContent className="pt-0" id="inventory-items-table">
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
                      message="No items found"
                      description="Add an item or select another category."
                    />
                  }
                  fallback={
                    <TableSkeletonLoader columns={COLUMNS.length} />
                  }
                  render={(row: ItemRow, index) => (
                    <TableRow key={row.id} className="hover:bg-muted/50">
                      <TableCell className="w-16 text-muted-foreground font-mono text-sm">
                        {getSerialNumber(
                          data?.meta?.current_page ?? 1,
                          filter.per_page ?? 15,
                          index
                        )}
                      </TableCell>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {row.code ?? "—"}
                      </TableCell>
                      <TableCell>
                        {row.category?.name ?? "—"}
                      </TableCell>
                      <TableCell className="font-mono">
                        {Number(row.current_quantity ?? 0)}
                      </TableCell>
                      <TableCell className="font-mono text-muted-foreground">
                        {Number(row.min_stock ?? 0)}
                      </TableCell>
                      <TableCell className="w-1/6">
                        <div className="flex items-center gap-0.5">
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button size="icon-sm" variant="ghost" asChild>
                                <Link href={`/inventory/items/${row.id}`}>
                                  <Eye className="size-4" />
                                </Link>
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>View</TooltipContent>
                          </Tooltip>
                          <PermissionGate can="update_inventory_items">
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon-sm"
                                  variant="ghost"
                                  onClick={() => itemDisclosure.onOpen(row)}
                                >
                                  <Pencil className="size-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Edit</TooltipContent>
                            </Tooltip>
                          </PermissionGate>
                          <PermissionGate can="delete_inventory_items">
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

export default InventoryItemsIndex;
