import DataTable, {
  TableEmptyState,
  TableSkeletonLoader,
} from "@/components/dataTable";
import Each from "@/components/Each";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableCell, TableRow } from "@/components/ui/table";
import { FilterBar } from "@/components/filter-bar";
import { getSerialNumber } from "@/lib/utils";
import { Head, Link } from "@inertiajs/react";
import { ShoppingCart, Plus, DollarSign, CreditCard, Clock, Receipt } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import useSearchFilter from "@/hooks/useSearchfilter";
import { useDisclosure } from "@/hooks/useDisclosure";
import inventoryApi from "@/lib/api/inventoryApi";
import { InventorySaleDialog } from "@/components/admin/inventorySaleDialog";
import { PermissionGate } from "@/components/PermissionGate";
import {
  INVENTORY_SALES_BREADCRUMBS,
  INVENTORY_SALES_GUIDELINES,
} from "@/constants/page/admin/inventory";
import { useRegisterGuide } from '@/components/GuideProvider';
import { INVENTORY_SALES_GUIDE } from "@/constants/guides/inventory";
import React from 'react';
import { useFilterRegistry } from "@/hooks/useFilterRegistry";

const COLUMNS = [
  { key: "serial", label: "#" },
  { key: "date", label: "Date" },
  { key: "buyer", label: "Buyer" },
  { key: "total", label: "Total" },
  { key: "status", label: "Status" },
  { key: "actions", label: "Actions" },
];

const INITIAL_FILTERS = {
  page: 1,
  per_page: 15,
  payment_status: "all",
};

import SettingsTip from "@/components/shared/SettingsTip";

const InventorySalesIndex = () => {
useRegisterGuide(INVENTORY_SALES_GUIDE);

  const { filter, handleFilter, buildParams } = useSearchFilter(INITIAL_FILTERS);
  const filterConfig = useFilterRegistry("inventory_sales");
  const newSaleDisclosure = useDisclosure();

  const { data, isLoading } = useQuery({
    queryKey: ["inventory-sales", filter],
    queryFn: () =>
      inventoryApi.sales.index(buildParams()),
  });

  const handleFilterChange = (updates: Record<string, unknown>) => {
    handleFilter({ ...updates, page: 1 });
  };

  const stats = data?.meta?.stats;

  return (
    <>
      <Head title="Inventory Sales" />
      <div className="space-y-6">
        <MainPageHeader
          id="inventory-sales-header"
          breadcrumbs={INVENTORY_SALES_BREADCRUMBS}
          icon={ShoppingCart}
          title="Inventory Sales"
          subtitle="View and manage asset sales and transactions."
        />

        {/* ── Analytics Stats Section ── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Sales</span>
                <h3 className="text-2xl font-bold tracking-tight">
                  {isLoading ? "..." : (stats?.total_sales_count ?? 0)}
                </h3>
                <p className="text-[10px] text-muted-foreground">Transactions executed</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <Receipt className="size-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Revenue</span>
                <h3 className="text-2xl font-bold tracking-tight">
                  {isLoading ? "..." : `₹${Number(stats?.total_revenue ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </h3>
                <p className="text-[10px] text-muted-foreground">Sum of all sale values</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <DollarSign className="size-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount Paid</span>
                <h3 className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                  {isLoading ? "..." : `₹${Number(stats?.total_paid ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </h3>
                <p className="text-[10px] text-muted-foreground">Paid amount collected</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CreditCard className="size-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Amount Pending</span>
                <h3 className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                  {isLoading ? "..." : `₹${Number(stats?.total_pending ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </h3>
                <p className="text-[10px] text-muted-foreground">Awaiting payment settlement</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Clock className="size-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <PermissionGate can="create_inventory_sales">
            <Button
              id="new-sale-btn"
              onClick={() => newSaleDisclosure.onOpen()}
              className="w-full sm:w-auto"
            >
              <Plus className="size-4" />
              New sale
            </Button>
          </PermissionGate>
        </div>
        <Card>
          <CardHeader className="pb-4">
            <FilterBar values={filter} onChange={handleFilterChange}>
              <FilterBar.Renderer config={filterConfig} />
            </FilterBar>
          </CardHeader>
          <CardContent className="pt-0" id="inventory-sales-table">
            <InventorySaleDialog
              open={newSaleDisclosure.isOpen}
              onClose={(o) => !o && newSaleDisclosure.onClose()}
              onSuccess={() => {
                newSaleDisclosure.onClose();
              }}
            />
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
                    message="No sales found"
                    description="Create a new sale using the button above."
                  />
                }
                fallback={<TableSkeletonLoader columns={COLUMNS.length} />}
                render={(
                  row: {
                    id: number;
                    created_at: string;
                    buyer_name?: string;
                    buyer_type: string;
                    total_amount: number;
                    payment_status: string;
                    user?: { name: string };
                    fee_payment_id?: number;
                  },
                  index
                ) => (
                  <TableRow key={row.id} className="hover:bg-muted/50">
                    <TableCell className="w-16 text-muted-foreground font-mono text-sm">
                      {getSerialNumber(
                        data?.meta?.current_page ?? 1,
                        filter.per_page ?? 15,
                        index
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(row.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {row.buyer_name ?? row.user?.name ?? `— (${row.buyer_type})`}
                    </TableCell>
                    <TableCell className="font-mono">
                      ₹{Number(row.total_amount).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={
                          row.payment_status === "paid"
                            ? "text-green-600 font-medium"
                            : "text-amber-600"
                        }
                      >
                        {row.payment_status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/inventory/sales/${row.id}`}>View</Link>
                        </Button>
                        {row.payment_status === "pending" && (
                            <Button variant="default" size="sm" asChild>
                              <Link href={`/inventory/sales/${row.id}/collect-payment`}>
                                Collect
                              </Link>
                            </Button>
                          )}
                      </div>
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

export default InventorySalesIndex;
