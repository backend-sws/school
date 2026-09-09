import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import DataTable, { TableEmptyState, TableSkeletonLoader } from "@/components/dataTable";
import Each from "@/components/Each";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/filter-bar";
import { ShoppingCart, Plus, Eye, Pencil, IndianRupee, Receipt, User, Package } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useSearchFilter from "@/hooks/useSearchfilter";
import { useDisclosure } from "@/hooks/useDisclosure";
import { getSerialNumber } from "@/lib/utils";
import inventoryApi from "@/lib/api/inventoryApi";
import { PermissionGate } from "@/components/PermissionGate";
import { FORM_TYPE } from "@/constants";
import { InventoryPurchaseDialog } from "@/components/admin/inventoryPurchaseDialog";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const BREADCRUMBS = [
  { title: "Inventory", href: "/inventory/items" },
  { title: "Purchases", href: "/inventory/purchases" },
];

interface PurchaseLine {
  id: number;
  inventory_item_id: number;
  quantity: string | number;
  unit_cost: string | number;
  amount: string | number;
  item?: { id: number; name: string; code?: string; unit?: string; inventory_category_id?: number };
}

interface PurchaseRow {
  id: number;
  bill_no?: string;
  supplier_name?: string;
  purchased_at: string;
  total_cost: string | number;
  payment_mode?: string;
  remarks?: string;
  expense_id?: number;
  purchased_by?: { id: number; name: string };
  lines?: PurchaseLine[];
}

const COLUMNS = [
  { key: "serial", label: "#" },
  { key: "date", label: "Date" },
  { key: "supplier", label: "Supplier / Bill" },
  { key: "items", label: "Items" },
  { key: "total_cost", label: "Total Cost" },
  { key: "purchased_by", label: "Purchased By" },
  { key: "payment_mode", label: "Mode" },
  { key: "actions", label: "Actions" },
];

const INITIAL_FILTERS = {
  page: 1,
  per_page: 15,
  search: "",
  from_date: "",
  to_date: "",
};

const PAYMENT_MODES = [
  { key: "cash", text: "Cash", value: "cash" },
  { key: "upi", text: "UPI", value: "upi" },
  { key: "bank", text: "Bank Transfer", value: "bank" },
  { key: "cheque", text: "Cheque", value: "cheque" },
];

const InventoryPurchasesIndex = () => {
  const queryClient = useQueryClient();
  const { filter, handleFilter } = useSearchFilter(INITIAL_FILTERS);
  const createDisclosure = useDisclosure();
  const [detailRow, setDetailRow] = useState<PurchaseRow | null>(null);
  const [editPurchase, setEditPurchase] = useState<PurchaseRow | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["inventory-purchases", filter],
    queryFn: () => inventoryApi.purchases.index(filter),
  });

  const stats = (data as any)?.meta?.stats;

  const handleFilterChange = (updates: Record<string, unknown>) => {
    handleFilter({ ...updates, page: 1 });
  };

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["inventory-purchases"] });
    queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
    createDisclosure.onClose();
    setEditPurchase(null);
  };

  const pmLabel = (mode?: string) => {
    const found = PAYMENT_MODES.find((m) => m.value === mode);
    return found?.text ?? (mode ?? "—");
  };

  return (
    <>
      <Head title="Inventory Purchases" />
      <InventoryPurchaseDialog
        open={createDisclosure.isOpen || Boolean(editPurchase)}
        purchase={editPurchase}
        onClose={() => {
          createDisclosure.onClose();
          setEditPurchase(null);
        }}
        onSuccess={onSuccess}
      />

      {/* Detail popup */}
      <Dialog open={Boolean(detailRow)} onOpenChange={(o) => !o && setDetailRow(null)}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Receipt className="size-4 text-primary" />
              Purchase #{detailRow?.id}
            </DialogTitle>
          </DialogHeader>
          {detailRow && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3 rounded-lg border bg-muted/30 p-4">
                <div>
                  <p className="text-xs text-muted-foreground">Date</p>
                  <p className="font-medium">{new Date(detailRow.purchased_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Purchased By</p>
                  <p className="font-medium">{detailRow.purchased_by?.name ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Supplier</p>
                  <p className="font-medium">{detailRow.supplier_name ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Bill No.</p>
                  <p className="font-mono font-medium">{detailRow.bill_no ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Payment Mode</p>
                  <p className="font-medium capitalize">{pmLabel(detailRow.payment_mode)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Cost</p>
                  <p className="font-bold text-emerald-600 dark:text-emerald-400">₹{Number(detailRow.total_cost).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</p>
                </div>
              </div>

              {detailRow.expense_id && (
                <div className="rounded-md bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 px-3 py-2 text-xs flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                  <IndianRupee className="size-3.5" />
                  Linked to Expense #{detailRow.expense_id} — auto-recorded in accounts
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Items Purchased</p>
                <div className="rounded-lg border overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-muted/50">
                      <tr>
                        <th className="text-left px-3 py-2 font-medium">Item</th>
                        <th className="text-right px-3 py-2 font-medium">Qty</th>
                        <th className="text-right px-3 py-2 font-medium">Unit Cost</th>
                        <th className="text-right px-3 py-2 font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(detailRow.lines ?? []).map((line, i) => (
                        <tr key={line.id ?? i} className="border-t">
                          <td className="px-3 py-2">
                            <p className="font-medium">{line.item?.name ?? `Item #${line.inventory_item_id}`}</p>
                            {line.item?.code && <p className="text-muted-foreground font-mono">{line.item.code}</p>}
                          </td>
                          <td className="px-3 py-2 text-right font-mono">{Number(line.quantity).toFixed(3)} {line.item?.unit ?? ""}</td>
                          <td className="px-3 py-2 text-right font-mono">₹{Number(line.unit_cost).toFixed(2)}</td>
                          <td className="px-3 py-2 text-right font-mono font-semibold">₹{Number(line.amount).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-muted/30 border-t-2">
                      <tr>
                        <td colSpan={3} className="px-3 py-2 text-right font-semibold text-muted-foreground">Total</td>
                        <td className="px-3 py-2 text-right font-bold text-emerald-600 dark:text-emerald-400">
                          ₹{Number(detailRow.total_cost).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              {detailRow.remarks && (
                <div className="text-xs text-muted-foreground bg-muted/30 rounded-md p-3">
                  <span className="font-medium">Remarks: </span>{detailRow.remarks}
                </div>
              )}
            </div>
          )}
          <DialogFooter className="flex justify-between sm:justify-between items-center w-full">
            <PermissionGate can="update_inventory_items">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const r = detailRow;
                  setDetailRow(null);
                  setEditPurchase(r);
                }}
                className="gap-1.5"
              >
                <Pencil className="size-3.5" /> Edit Purchase
              </Button>
            </PermissionGate>
            <Button variant="outline" onClick={() => setDetailRow(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="p-2 sm:p-3 md:p-4 space-y-4">
        <MainPageHeader
          id="inventory-purchases-header"
          breadcrumbs={BREADCRUMBS}
          icon={ShoppingCart}
          title="Purchases"
          subtitle="Record market purchases — saman khareedne ka record"
        />

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="border-emerald-500/30 bg-emerald-500/[0.03]">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Purchases</span>
                <h3 className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                  {isLoading ? "..." : (stats?.total_purchases ?? 0)}
                </h3>
                <p className="text-[10px] text-muted-foreground">Purchase entries</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <ShoppingCart className="size-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-indigo-500/30 bg-indigo-500/[0.03]">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Spent</span>
                <h3 className="text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
                  {isLoading ? "..." : `₹${Number(stats?.total_cost ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
                </h3>
                <p className="text-[10px] text-muted-foreground">Filtered total purchase cost</p>
              </div>
              <div className="p-3 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <IndianRupee className="size-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-500/30 bg-amber-500/[0.03]">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Auto-Linked</span>
                <h3 className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">Expenses</h3>
                <p className="text-[10px] text-muted-foreground">Each purchase creates expense entry</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Receipt className="size-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <PermissionGate can="create_inventory_items">
            <Button id="new-purchase-btn" onClick={() => createDisclosure.onOpen()}>
              <Plus className="size-4" />
              Record Purchase
            </Button>
          </PermissionGate>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <FilterBar values={filter} onChange={handleFilterChange}>
              <FilterBar.Renderer
                config={{
                  filters: [
                    {
                      name: "from_date",
                      type: FORM_TYPE.DATE,
                      label: "From Date",
                      placeholder: "From date",
                      tooltip: "Filter purchases from this date",
                    },
                    {
                      name: "to_date",
                      type: FORM_TYPE.DATE,
                      label: "To Date",
                      placeholder: "To date",
                      tooltip: "Filter purchases up to this date",
                    },
                  ],
                  searchGroup: {
                    selectName: "search_by",
                    searchName: "search",
                    options: [{ value: "supplier", label: "Supplier / Bill" }],
                    placeholder: "Search supplier or bill no...",
                  },
                }}
              />
            </FilterBar>
          </CardHeader>
          <CardContent className="pt-0">
            <DataTable
              columns={COLUMNS}
              currentPage={(data as any)?.meta?.current_page ?? 1}
              lastPage={(data as any)?.meta?.last_page ?? 1}
              pageSize={filter.per_page ?? 15}
              totalRecords={(data as any)?.meta?.total ?? 0}
              handlePageChange={(page) => handleFilter({ page })}
              handlePageSizeChange={(size) => handleFilter({ per_page: size, page: 1 })}
            >
              <Each
                isLoading={isLoading}
                of={(data as any)?.data}
                nodatafound={
                  <TableEmptyState colSpan={COLUMNS.length} message="No purchases found" description="Record a purchase using the button above." />
                }
                fallback={<TableSkeletonLoader columns={COLUMNS.length} />}
                render={(row: PurchaseRow, index) => (
                  <TableRow key={row.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="w-12 text-muted-foreground font-mono text-sm">
                      {getSerialNumber((data as any)?.meta?.current_page ?? 1, filter.per_page ?? 15, index)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      {new Date(row.purchased_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{row.supplier_name ?? <span className="text-muted-foreground italic">No supplier</span>}</p>
                      {row.bill_no && <p className="text-xs text-muted-foreground font-mono">Bill: {row.bill_no}</p>}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {(row.lines ?? []).slice(0, 3).map((line, i) => (
                          <Badge key={i} variant="outline" className="text-[10px] font-normal gap-1">
                            <Package className="size-2.5" />
                            {line.item?.name ?? `Item ${line.inventory_item_id}`}
                          </Badge>
                        ))}
                        {(row.lines ?? []).length > 3 && (
                          <Badge variant="secondary" className="text-[10px]">+{(row.lines ?? []).length - 3} more</Badge>
                        )}
                        {(row.lines ?? []).length === 0 && <span className="text-muted-foreground text-xs">—</span>}
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold text-emerald-600 dark:text-emerald-400">
                      ₹{Number(row.total_cost).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      {row.expense_id && (
                        <p className="text-[10px] font-normal text-muted-foreground flex items-center gap-0.5">
                          <Receipt className="size-2.5" /> Exp #{row.expense_id}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-sm">
                        <User className="size-3 text-muted-foreground" />
                        {row.purchased_by?.name ?? "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize text-xs">{pmLabel(row.payment_mode)}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          size="icon-sm"
                          variant="ghost"
                          onClick={() => setDetailRow(row)}
                          title="View Details"
                        >
                          <Eye className="size-4" />
                        </Button>
                        <PermissionGate can="update_inventory_items">
                          <Button
                            size="icon-sm"
                            variant="ghost"
                            onClick={() => setEditPurchase(row)}
                            title="Edit Purchase"
                            className="text-muted-foreground hover:text-foreground"
                          >
                            <Pencil className="size-4" />
                          </Button>
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
    </>
  );
};

export default InventoryPurchasesIndex;
