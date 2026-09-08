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
import { Badge } from "@/components/ui/badge";
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

const INITIAL_FILTERS = { page: 1, per_page: 15, search: "", category_id: "all", max_quantity: "", stock_status: "all" };

const FILTER_MAPPING = {
  category_id: { paramName: "category_id", skipValues: ["all"] },
  search: { paramName: "search", skipValues: [""] },
  max_quantity: { paramName: "max_quantity", skipValues: [""] },
  stock_status: { paramName: "stock_status", skipValues: ["all"] },
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
        {(() => {
          const currentStatus = String(filter.stock_status || "all");
          const handleCardClick = (targetStatus: "all" | "out_of_stock" | "warning_stock") => {
            if (targetStatus === "all") {
              handleFilter({ stock_status: "all", page: 1 });
            } else {
              const next = currentStatus === targetStatus ? "all" : targetStatus;
              handleFilter({ stock_status: next, page: 1 });
            }
          };

          const isTotalActive = currentStatus === "all";
          const isOutOfStockActive = currentStatus === "out_of_stock";
          const isWarningStockActive = currentStatus === "warning_stock";

          return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card
                role="button"
                tabIndex={0}
                onClick={() => handleCardClick("all")}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleCardClick("all"); } }}
                className={`border-border/50 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 select-none ${
                  isTotalActive
                    ? "ring-2 ring-amber-500/70 bg-amber-500/[0.04] dark:bg-amber-500/[0.08]"
                    : "bg-white dark:bg-card hover:border-amber-500/40"
                }`}
              >
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Total Low Stock</p>
                      {isTotalActive && (
                        <Badge variant="outline" className="h-4 px-1.5 text-[9px] font-bold text-amber-600 border-amber-500/30">
                          Active
                        </Badge>
                      )}
                    </div>
                    <p className="text-2xl font-black text-foreground">{isLoading ? "..." : stats.total_low_stock}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                    <AlertTriangle className="size-5" />
                  </div>
                </CardContent>
              </Card>

              <Card
                role="button"
                tabIndex={0}
                onClick={() => handleCardClick("out_of_stock")}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleCardClick("out_of_stock"); } }}
                className={`border-border/50 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 select-none ${
                  isOutOfStockActive
                    ? "ring-2 ring-red-500/70 bg-red-500/[0.04] dark:bg-red-500/[0.08]"
                    : "bg-white dark:bg-card hover:border-red-500/40"
                }`}
              >
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Out of Stock</p>
                      {isOutOfStockActive && (
                        <Badge variant="outline" className="h-4 px-1.5 text-[9px] font-bold text-red-600 border-red-500/30">
                          Active
                        </Badge>
                      )}
                    </div>
                    <p className="text-2xl font-black text-foreground">{isLoading ? "..." : stats.out_of_stock}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400">
                    <ShieldAlert className="size-5" />
                  </div>
                </CardContent>
              </Card>

              <Card
                role="button"
                tabIndex={0}
                onClick={() => handleCardClick("warning_stock")}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleCardClick("warning_stock"); } }}
                className={`border-border/50 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 select-none ${
                  isWarningStockActive
                    ? "ring-2 ring-blue-500/70 bg-blue-500/[0.04] dark:bg-blue-500/[0.08]"
                    : "bg-white dark:bg-card hover:border-blue-500/40"
                }`}
              >
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Warning Stock</p>
                      {isWarningStockActive && (
                        <Badge variant="outline" className="h-4 px-1.5 text-[9px] font-bold text-blue-600 border-blue-500/30">
                          Active
                        </Badge>
                      )}
                    </div>
                    <p className="text-2xl font-black text-foreground">{isLoading ? "..." : stats.warning_stock}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <Clock className="size-5" />
                  </div>
                </CardContent>
              </Card>

              <Card
                role="button"
                tabIndex={0}
                onClick={() => handleCardClick("warning_stock")}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleCardClick("warning_stock"); } }}
                className={`border-border/50 shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 select-none ${
                  isWarningStockActive
                    ? "ring-2 ring-indigo-500/70 bg-indigo-500/[0.04] dark:bg-indigo-500/[0.08]"
                    : "bg-white dark:bg-card hover:border-indigo-500/40"
                }`}
              >
                <CardContent className="p-6 flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground/60">Deficit Qty</p>
                      {isWarningStockActive && (
                        <Badge variant="outline" className="h-4 px-1.5 text-[9px] font-bold text-indigo-600 border-indigo-500/30">
                          Active
                        </Badge>
                      )}
                    </div>
                    <p className="text-2xl font-black text-foreground">{isLoading ? "..." : stats.total_deficit}</p>
                  </div>
                  <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <TrendingDown className="size-5" />
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })()}

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
