import DataTable, {
  TableEmptyState,
  TableSkeletonLoader,
} from "@/components/dataTable";
import Each from "@/components/Each";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableCell, TableRow } from "@/components/ui/table";
import { Head, Link } from "@inertiajs/react";
import { AlertTriangle, ShieldAlert, Clock, TrendingDown, Eye, Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import inventoryApi from "@/lib/api/inventoryApi";
import {
  INVENTORY_LOW_STOCK_BREADCRUMBS,
} from "@/constants/page/admin/inventory";
import { useRegisterGuide } from '@/components/GuideProvider';
import { INVENTORY_LOW_STOCK_GUIDE } from "@/constants/guides/inventory";
import React, { useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/filter-bar";
import useSearchFilter from "@/hooks/useSearchfilter";
import { FORM_TYPE } from "@/constants";
import { toast } from "sonner";

const COLUMNS = [
  { key: "name", label: "Item" },
  { key: "code", label: "Code" },
  { key: "category", label: "Category" },
  { key: "current", label: "Current" },
  { key: "min", label: "Min stock" },
  { key: "action", label: "Action" },
];

const INITIAL_FILTERS = { page: 1, per_page: 15, search: "", category_id: "all", max_quantity: "" };

const FILTER_MAPPING = {
  category_id: { paramName: "category_id", skipValues: ["all"] },
  search: { paramName: "search", skipValues: [""] },
  max_quantity: { paramName: "max_quantity", skipValues: [""] },
  per_page: { paramName: "per_page" },
  page: { paramName: "page" },
};

const InventoryLowStock = () => {
  useRegisterGuide(INVENTORY_LOW_STOCK_GUIDE);

  const { filter, handleFilter, buildParams } = useSearchFilter(INITIAL_FILTERS);

  const listParams = useMemo(() => buildParams(FILTER_MAPPING), [filter, buildParams]);

  const { data, isLoading } = useQuery({
    queryKey: ["inventory-low-stock", listParams],
    queryFn: () => inventoryApi.reports.lowStock(listParams),
  });

  const { data: categoriesRes } = useQuery({
    queryKey: ["inventory-categories-all"],
    queryFn: () => inventoryApi.categories.index({ per_page: 500 }),
  });

  const categories = categoriesRes?.data || [];
  const categoryOptions = useMemo(() => [
    { key: "all", text: "All Categories", value: "all" },
    ...categories.map((c: any) => ({ key: String(c.id), text: c.name, value: String(c.id) })),
  ], [categories]);

  const filterConfig = useMemo(() => ({
    filters: [
      {
        name: "category_id",
        type: FORM_TYPE.SELECT,
        label: "Category",
        placeholder: "Select category",
        tooltip: "Filter low stock items by category",
        options: categoryOptions,
      },
      {
        name: "max_quantity",
        type: FORM_TYPE.NUMBER_TEXT,
        label: "Max Quantity",
        placeholder: "e.g. 10",
        tooltip: "Show items with current quantity less than or equal to this number",
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

  const items = data?.data ?? [];
  const meta = data?.meta;
  const stats = meta?.stats ?? { total_low_stock: 0, out_of_stock: 0, warning_stock: 0, total_deficit: 0 };

  const handleFilterChange = (updates: Record<string, unknown>) => {
    handleFilter({ ...updates, page: 1 });
  };

  const handleExport = async () => {
    try {
      const params = buildParams(FILTER_MAPPING);
      toast.promise(inventoryApi.reports.exportLowStock(params), {
        loading: "Generating low stock Excel report...",
        success: "Low stock list exported successfully!",
        error: "Failed to generate low stock Excel report.",
      });
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Failed to download low stock report.");
    }
  };

  return (
    <>
      <Head title="Low Stock Report" />
      <div className="space-y-6">
        <MainPageHeader
          id="inventory-low-stock-header"
          breadcrumbs={INVENTORY_LOW_STOCK_BREADCRUMBS}
          icon={AlertTriangle}
          guidance={INVENTORY_LOW_STOCK_GUIDE}
        >
          <Button
            variant="outline"
            onClick={handleExport}
            className="rounded-xl h-11 border-border bg-background shadow-sm hover:bg-muted font-bold text-xs uppercase tracking-wider flex items-center gap-2"
          >
            <Download className="size-4 text-muted-foreground" />
            <span>Export Excel</span>
          </Button>
        </MainPageHeader>

        {/* Analytics stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white dark:bg-card border-border/50 shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Total Low Stock</p>
                <p className="text-2xl font-black text-foreground">{stats.total_low_stock}</p>
              </div>
              <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <AlertTriangle className="size-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-card border-border/50 shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Out of Stock</p>
                <p className="text-2xl font-black text-foreground">{stats.out_of_stock}</p>
              </div>
              <div className="p-3 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400">
                <ShieldAlert className="size-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-card border-border/50 shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Warning Stock</p>
                <p className="text-2xl font-black text-foreground">{stats.warning_stock}</p>
              </div>
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <Clock className="size-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-card border-border/50 shadow-sm">
            <CardContent className="p-6 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Deficit Qty</p>
                <p className="text-2xl font-black text-foreground">{stats.total_deficit}</p>
              </div>
              <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <TrendingDown className="size-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <FilterBar values={filter} onChange={handleFilterChange}>
              <FilterBar.Renderer config={filterConfig} />
            </FilterBar>
          </CardHeader>
          <CardContent className="pt-0" id="inventory-low-stock-table">
            <DataTable
              columns={COLUMNS}
              currentPage={meta?.current_page ?? 1}
              lastPage={meta?.last_page ?? 1}
              pageSize={Number(filter.per_page) || 15}
              totalRecords={meta?.total ?? 0}
              handlePageChange={(page) => handleFilter({ page })}
              handlePageSizeChange={(size) => handleFilter({ per_page: size, page: 1 })}
            >
              <Each
                isLoading={isLoading}
                of={items}
                nodatafound={
                  <TableEmptyState
                    colSpan={COLUMNS.length}
                    message="No low stock items"
                    description="All items are above their minimum stock level."
                  />
                }
                fallback={
                  <TableSkeletonLoader columns={COLUMNS.length} />
                }
                render={(row: {
                  id: number;
                  name: string;
                  code?: string;
                  current_quantity?: number;
                  min_stock?: number;
                  category?: { name: string };
                }) => (
                  <TableRow key={row.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">{row.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {row.code ?? "—"}
                    </TableCell>
                    <TableCell>{row.category?.name ?? "—"}</TableCell>
                    <TableCell className="font-mono font-medium">
                      {Number(row.current_quantity ?? 0)}
                    </TableCell>
                    <TableCell className="font-mono text-muted-foreground">
                      {Number(row.min_stock ?? 0)}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" asChild className="rounded-xl">
                        <Link href={`/inventory/items/${row.id}`}>
                          <Eye className="size-4 mr-1.5 text-muted-foreground" />
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                )}
              />
            </DataTable>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default InventoryLowStock;
