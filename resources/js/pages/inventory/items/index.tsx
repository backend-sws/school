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
import { Boxes, Eye, Pencil, Plus, Trash2, Package, Layers, AlertTriangle, XCircle, IndianRupee, ShoppingBag, Send, ArrowLeftRight, ShoppingCart } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FORM_TYPE } from "@/constants";
import useSearchFilter from "@/hooks/useSearchfilter";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDisclosure } from "@/hooks/useDisclosure";
import inventoryApi from "@/lib/api/inventoryApi";
import { InventoryItemDialog } from "@/components/admin/inventoryItemDialog";
import { InventoryPurchaseDialog } from "@/components/admin/inventoryPurchaseDialog";
import { InventoryIssueDialog } from "@/components/admin/inventoryIssueDialog";
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
  { key: "price", label: "Price (Cost / Sell)" },
  { key: "stock_value", label: "Stock Value" },
  { key: "action", label: "Actions" },
];

const INITIAL_FILTERS = {
  page: 1,
  per_page: 15,
  search: "",
  search_by: "name",
  category_id: "",
  stock_status: "all",
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
  purchase_price?: number | string;
  selling_price?: number | string;
};

const InventoryItemsIndex = () => {
  const queryClient = useQueryClient();
useRegisterGuide(INVENTORY_ITEMS_GUIDE);
  const { filter, handleFilter } = useSearchFilter(INITIAL_FILTERS);
  const itemDisclosure = useDisclosure<ItemRow | null>();
  const deleteDisclosure = useDisclosure<{ id: number; name: string }>();
  const purchaseDisclosure = useDisclosure();
  const issueDisclosure = useDisclosure();

  const { data, isLoading } = useQuery({
    queryKey: ["inventory-items", filter],
    queryFn: () =>
      inventoryApi.items.index({
        ...filter,
        category_id: filter.category_id || undefined,
        stock_status: filter.stock_status === "all" ? undefined : filter.stock_status,
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
  const currentStockStatus = (filter.stock_status as string) || "all";

  const handleCardClick = (targetStatus: string) => {
    if (targetStatus === "all") {
      handleFilter({ stock_status: "all", page: 1 });
    } else {
      const nextStatus = currentStockStatus === targetStatus ? "all" : targetStatus;
      handleFilter({ stock_status: nextStatus, page: 1 });
    }
  };

  return (
    <>
      <Head title="Inventory Items" />
      <InventoryItemDialog
        open={itemDisclosure.isOpen}
        onClose={() => itemDisclosure.onClose()}
        data={itemDisclosure.data ?? undefined}
      />
      <InventoryPurchaseDialog
        open={purchaseDisclosure.isOpen}
        onClose={purchaseDisclosure.onClose}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
        }}
      />
      <InventoryIssueDialog
        open={issueDisclosure.isOpen}
        onClose={issueDisclosure.onClose}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
        }}
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
          {/* ── Sub-Navigation Tabs ── */}
          <div className="flex flex-wrap items-center gap-2 border-b pb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary text-primary-foreground shadow-sm">
              <Boxes className="size-3.5" />
              <span>Items Catalog</span>
            </span>
            <Link
              href="/inventory/purchases"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border"
            >
              <ShoppingBag className="size-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Purchases (खरीद)</span>
            </Link>
            <Link
              href="/inventory/issues"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border"
            >
              <Send className="size-3.5 text-blue-600 dark:text-blue-400" />
              <span>Issues / Dispatch (निकासी)</span>
            </Link>
            <Link
              href="/inventory/movements"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border"
            >
              <ArrowLeftRight className="size-3.5" />
              <span>Stock Movements</span>
            </Link>
            <Link
              href="/inventory/sales"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border"
            >
              <ShoppingCart className="size-3.5" />
              <span>Sales</span>
            </Link>
            <Link
              href="/inventory/reports/low-stock"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors border"
            >
              <AlertTriangle className="size-3.5 text-amber-500" />
              <span>Low Stock</span>
            </Link>
          </div>
          {/* ── Analytics Stats Section (Clickable to Filter) ── */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {/* 1. Total Items */}
            <Card
              role="button"
              tabIndex={0}
              onClick={() => handleCardClick("all")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCardClick("all");
                }
              }}
              className={`cursor-pointer select-none transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 relative overflow-hidden group ${
                currentStockStatus === "all"
                  ? "ring-2 ring-primary/60 border-primary/50 bg-primary/[0.04] shadow-sm"
                  : "hover:border-primary/40 hover:bg-muted/20"
              }`}
            >
              <CardContent className="p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Total Items
                    </span>
                    {currentStockStatus === "all" && (
                      <span className="text-[10px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        All
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight">
                    {isLoading ? "..." : (stats?.total_items_count ?? 0)}
                  </h3>
                  <p className="text-[10px] text-muted-foreground">
                    Unique items {currentStockStatus === "all" ? "• Active" : "• Click to view all"}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform duration-200">
                  <Package className="size-5" />
                </div>
              </CardContent>
            </Card>

            {/* 2. Total Stock */}
            <Card
              role="button"
              tabIndex={0}
              onClick={() => handleCardClick("in_stock")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCardClick("in_stock");
                }
              }}
              className={`cursor-pointer select-none transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 relative overflow-hidden group ${
                currentStockStatus === "in_stock"
                  ? "ring-2 ring-emerald-500/60 border-emerald-500/50 bg-emerald-500/[0.04] shadow-sm"
                  : "hover:border-emerald-500/40 hover:bg-muted/20"
              }`}
            >
              <CardContent className="p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Total Stock
                    </span>
                    {currentStockStatus === "in_stock" && (
                      <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                        In Stock
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                    {isLoading ? "..." : (stats?.total_stock_quantity ?? 0)}
                  </h3>
                  <p className="text-[10px] text-muted-foreground">
                    Cumulative units {currentStockStatus === "in_stock" ? "• Filtered" : "• Click to filter"}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-200">
                  <Layers className="size-5" />
                </div>
              </CardContent>
            </Card>

            {/* 3. Total Stock Value (Rupees) */}
            <Card
              className="transition-all duration-200 hover:shadow-md relative overflow-hidden group border-indigo-500/30 bg-indigo-500/[0.03]"
            >
              <CardContent className="p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Stock Value
                    </span>
                    <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                      Cost (₹)
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
                    {isLoading
                      ? "..."
                      : `₹${Number(stats?.total_stock_value ?? 0).toLocaleString("en-IN", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`}
                  </h3>
                  <p className="text-[10px] text-muted-foreground">
                    Retail: ₹{Number(stats?.total_retail_value ?? 0).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-200">
                  <IndianRupee className="size-5" />
                </div>
              </CardContent>
            </Card>

            {/* 3. Low Stock */}
            <Card
              role="button"
              tabIndex={0}
              onClick={() => handleCardClick("low_stock")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCardClick("low_stock");
                }
              }}
              className={`cursor-pointer select-none transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 relative overflow-hidden group ${
                currentStockStatus === "low_stock"
                  ? "ring-2 ring-amber-500/60 border-amber-500/50 bg-amber-500/[0.04] shadow-sm"
                  : "hover:border-amber-500/40 hover:bg-muted/20"
              }`}
            >
              <CardContent className="p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Low Stock
                    </span>
                    {currentStockStatus === "low_stock" && (
                      <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full">
                        Filtered
                      </span>
                    )}
                  </div>
                  <h3 className={`text-2xl font-bold tracking-tight ${stats?.low_stock_count > 0 ? "text-amber-600 dark:text-amber-400" : ""}`}>
                    {isLoading ? "..." : (stats?.low_stock_count ?? 0)}
                  </h3>
                  <p className="text-[10px] text-muted-foreground">
                    Below safety threshold {currentStockStatus === "low_stock" ? "• Filtered (click to reset)" : "• Click to filter"}
                  </p>
                </div>
                <div className={`p-3 rounded-xl group-hover:scale-110 transition-transform duration-200 ${stats?.low_stock_count > 0 ? "bg-amber-500/10 text-amber-600 dark:text-amber-400" : "bg-muted text-muted-foreground"}`}>
                  <AlertTriangle className="size-5" />
                </div>
              </CardContent>
            </Card>

            {/* 4. Out of Stock */}
            <Card
              role="button"
              tabIndex={0}
              onClick={() => handleCardClick("out_of_stock")}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleCardClick("out_of_stock");
                }
              }}
              className={`cursor-pointer select-none transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 relative overflow-hidden group ${
                currentStockStatus === "out_of_stock"
                  ? "ring-2 ring-destructive/60 border-destructive/50 bg-destructive/[0.04] shadow-sm"
                  : "hover:border-destructive/40 hover:bg-muted/20"
              }`}
            >
              <CardContent className="p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Out of Stock
                    </span>
                    {currentStockStatus === "out_of_stock" && (
                      <span className="text-[10px] font-semibold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
                        Filtered
                      </span>
                    )}
                  </div>
                  <h3 className={`text-2xl font-bold tracking-tight ${stats?.out_of_stock_count > 0 ? "text-destructive" : ""}`}>
                    {isLoading ? "..." : (stats?.out_of_stock_count ?? 0)}
                  </h3>
                  <p className="text-[10px] text-muted-foreground">
                    Out of stock items {currentStockStatus === "out_of_stock" ? "• Filtered (click to reset)" : "• Click to filter"}
                  </p>
                </div>
                <div className={`p-3 rounded-xl group-hover:scale-110 transition-transform duration-200 ${stats?.out_of_stock_count > 0 ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}>
                  <XCircle className="size-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-muted-foreground font-medium hidden sm:inline">Quick Actions:</span>
              <Button
                variant="outline"
                size="sm"
                className="text-xs gap-1.5 border-emerald-500/30 hover:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                onClick={() => purchaseDisclosure.onOpen()}
              >
                <ShoppingBag className="size-3.5 text-emerald-600" />
                <span>Record Purchase</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-xs gap-1.5 border-blue-500/30 hover:bg-blue-500/10 text-blue-700 dark:text-blue-400"
                onClick={() => issueDisclosure.onOpen()}
              >
                <Send className="size-3.5 text-blue-600" />
                <span>Issue / Dispatch Item</span>
              </Button>
            </div>
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
                      <TableCell className="font-mono text-sm">
                        <div>
                          <span className="font-medium">
                            ₹{Number(row.purchase_price ?? 0).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                          {row.selling_price ? (
                            <span className="text-[11px] text-muted-foreground block">
                              Sell: ₹{Number(row.selling_price).toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        <div>
                          <span className="font-bold text-foreground">
                            ₹{(
                              Number(row.current_quantity ?? 0) *
                              Number(row.purchase_price ?? row.selling_price ?? 0)
                            ).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                          {row.selling_price && Number(row.current_quantity ?? 0) > 0 ? (
                            <span className="text-[11px] text-muted-foreground block">
                              Retail: ₹{(
                                Number(row.current_quantity ?? 0) *
                                Number(row.selling_price)
                              ).toLocaleString("en-IN", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              })}
                            </span>
                          ) : null}
                        </div>
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
