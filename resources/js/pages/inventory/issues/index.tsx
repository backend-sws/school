import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import DataTable, { TableEmptyState, TableSkeletonLoader } from "@/components/dataTable";
import Each from "@/components/Each";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/filter-bar";
import { LogOut, Plus, Eye, RotateCcw, User, Package, CheckCircle, IndianRupee, Layers } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useSearchFilter from "@/hooks/useSearchfilter";
import { useDisclosure } from "@/hooks/useDisclosure";
import { getSerialNumber } from "@/lib/utils";
import inventoryApi from "@/lib/api/inventoryApi";
import { PermissionGate } from "@/components/PermissionGate";
import { FORM_TYPE } from "@/constants";
import { InventoryIssueDialog } from "@/components/admin/inventoryIssueDialog";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const BREADCRUMBS = [
  { title: "Inventory", href: "/inventory/items" },
  { title: "Issues / Dispatch", href: "/inventory/issues" },
];

interface IssueRow {
  id: number;
  inventory_item_id: number;
  quantity: string | number;
  quantity_after?: string | number;
  returned_quantity: string | number;
  issued_to_user_id?: number;
  issued_to_name?: string;
  department?: string;
  purpose?: string;
  issued_at: string;
  remarks?: string;
  total_cost?: string | number;
  unit_cost?: string | number;
  issue_batches?: {
    id: number;
    quantity: number;
    unit_cost: number;
    amount: number;
    batch?: {
      id: number;
      batch_no: string;
      unit_cost: number;
      received_at?: string;
      supplier_name?: string;
    };
  }[];
  item?: { id: number; name: string; code?: string; unit?: string };
  issuedToUser?: { id: number; name: string };
  issuedBy?: { id: number; name: string };
}

const COLUMNS = [
  { key: "serial", label: "#" },
  { key: "date", label: "Issue Date" },
  { key: "item", label: "Item" },
  { key: "qty", label: "Qty" },
  { key: "issued_to", label: "Issued To" },
  { key: "department", label: "Dept / Purpose" },
  { key: "returned", label: "Returned" },
  { key: "issued_by", label: "Issued By" },
  { key: "actions", label: "Actions" },
];

const INITIAL_FILTERS = {
  page: 1,
  per_page: 15,
  search: "",
  from_date: "",
  to_date: "",
  item_id: "",
};

const InventoryIssuesIndex = () => {
  const queryClient = useQueryClient();
  const { filter, handleFilter } = useSearchFilter(INITIAL_FILTERS);
  const createDisclosure = useDisclosure();
  const [detailRow, setDetailRow] = useState<IssueRow | null>(null);
  const [returnDialog, setReturnDialog] = useState<IssueRow | null>(null);
  const [returnQty, setReturnQty] = useState("");
  const [returnRemarks, setReturnRemarks] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["inventory-issues", filter],
    queryFn: () =>
      inventoryApi.issues.index({
        ...filter,
        item_id: filter.item_id || undefined,
        from_date: (filter.from_date as string) || undefined,
        to_date: (filter.to_date as string) || undefined,
      }),
  });

  const stats = (data as any)?.meta?.stats;

  const { data: itemsRes } = useQuery({
    queryKey: ["inventory-items-list"],
    queryFn: () => inventoryApi.items.index({ per_page: 500 }),
  });
  const allItems: any[] = Array.isArray((itemsRes as any)?.data) ? (itemsRes as any).data : [];

  const returnMutation = useMutation({
    mutationFn: ({ id, qty, remarks }: { id: number; qty: number; remarks?: string }) =>
      inventoryApi.issues.recordReturn(id, { returned_quantity: qty, remarks }),
    onSuccess: () => {
      toast.success("Return recorded. Stock has been updated.");
      queryClient.invalidateQueries({ queryKey: ["inventory-issues"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      setReturnDialog(null);
      setReturnQty("");
      setReturnRemarks("");
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message ?? "Failed to record return.");
    },
  });

  const onIssueSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["inventory-issues"] });
    queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
    createDisclosure.onClose();
    toast.success("Item issued! Stock has been updated.");
  };

  const handleReturn = () => {
    if (!returnDialog) return;
    const qty = parseFloat(returnQty);
    if (!qty || qty <= 0) {
      toast.error("Please enter a valid return quantity.");
      return;
    }
    returnMutation.mutate({ id: returnDialog.id, qty, remarks: returnRemarks || undefined });
  };

  const handleFilterChange = (updates: Record<string, unknown>) => {
    handleFilter({ ...updates, page: 1 });
  };

  const outstanding = (row: IssueRow) =>
    Math.max(0, Number(row.quantity) - Number(row.returned_quantity));

  return (
    <>
      <Head title="Issues / Dispatch" />

      <InventoryIssueDialog
        open={createDisclosure.isOpen}
        onClose={createDisclosure.onClose}
        onSuccess={onIssueSuccess}
      />

      {/* Detail popup */}
      <Dialog open={Boolean(detailRow)} onOpenChange={(o) => !o && setDetailRow(null)}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <LogOut className="size-4 text-primary" />
              Issue #{detailRow?.id}
            </DialogTitle>
          </DialogHeader>
          {detailRow && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3 rounded-lg border bg-muted/30 p-4">
                <div>
                  <p className="text-xs text-muted-foreground">Item</p>
                  <p className="font-medium">{detailRow.item?.name ?? `Item #${detailRow.inventory_item_id}`}</p>
                  {detailRow.item?.code && <p className="text-xs font-mono text-muted-foreground">{detailRow.item.code}</p>}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Issue Date</p>
                  <p className="font-medium">{new Date(detailRow.issued_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Issued To</p>
                  <p className="font-medium">{detailRow.issuedToUser?.name ?? detailRow.issued_to_name ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Department</p>
                  <p className="font-medium">{detailRow.department ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Purpose</p>
                  <p className="font-medium">{detailRow.purpose ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Issued By</p>
                  <p className="font-medium">{detailRow.issuedBy?.name ?? "—"}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg border bg-rose-50 dark:bg-rose-950/30 border-rose-200 dark:border-rose-800 p-3">
                  <p className="text-xs text-muted-foreground mb-1">Issued</p>
                  <p className="text-lg font-bold text-rose-600 dark:text-rose-400">{Number(detailRow.quantity).toFixed(3)}</p>
                  <p className="text-[10px] text-muted-foreground">{detailRow.item?.unit ?? "units"}</p>
                </div>
                <div className="rounded-lg border bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 p-3">
                  <p className="text-xs text-muted-foreground mb-1">Returned</p>
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{Number(detailRow.returned_quantity).toFixed(3)}</p>
                  <p className="text-[10px] text-muted-foreground">{detailRow.item?.unit ?? "units"}</p>
                </div>
                <div className="rounded-lg border bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 p-3">
                  <p className="text-xs text-muted-foreground mb-1">Outstanding</p>
                  <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{outstanding(detailRow).toFixed(3)}</p>
                  <p className="text-[10px] text-muted-foreground">{detailRow.item?.unit ?? "units"}</p>
                </div>
              </div>

              {detailRow.total_cost && Number(detailRow.total_cost) > 0 && (
                <div className="flex items-center justify-between rounded-lg border bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 px-3 py-2 text-xs">
                  <span className="text-muted-foreground flex items-center gap-1 font-medium">
                    <IndianRupee className="size-3.5 text-emerald-600" /> Total Issue Value (FIFO):
                  </span>
                  <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300 text-sm">
                    ₹{Number(detailRow.total_cost).toFixed(2)}
                    {detailRow.unit_cost && Number(detailRow.unit_cost) > 0 && (
                      <span className="text-[10px] font-normal text-muted-foreground ml-1">
                        (Avg ₹{Number(detailRow.unit_cost).toFixed(2)}/{detailRow.item?.unit ?? "unit"})
                      </span>
                    )}
                  </span>
                </div>
              )}

              {detailRow.issue_batches && detailRow.issue_batches.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <Layers className="size-3 text-primary" /> Consumed FIFO Batches:
                  </p>
                  <div className="rounded-md border overflow-hidden text-xs">
                    <table className="w-full">
                      <thead className="bg-muted/50 text-[11px]">
                        <tr>
                          <th className="text-left px-2.5 py-1.5 font-medium">Batch / Source</th>
                          <th className="text-right px-2 py-1.5 font-medium">Qty</th>
                          <th className="text-right px-2 py-1.5 font-medium">Rate</th>
                          <th className="text-right px-2.5 py-1.5 font-medium">Cost</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y font-mono text-[11px]">
                        {detailRow.issue_batches.map((ib, idx) => (
                          <tr key={idx}>
                            <td className="px-2.5 py-1">
                              <div className="font-semibold text-foreground font-sans">{ib.batch?.batch_no ?? `Batch #${ib.id}`}</div>
                              {ib.batch?.received_at && (
                                <div className="text-[10px] text-muted-foreground">
                                  {new Date(ib.batch.received_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                                  {ib.batch.supplier_name ? ` • ${ib.batch.supplier_name}` : ""}
                                </div>
                              )}
                            </td>
                            <td className="px-2 py-1 text-right">{Number(ib.quantity).toFixed(2)}</td>
                            <td className="px-2 py-1 text-right">₹{Number(ib.unit_cost).toFixed(2)}</td>
                            <td className="px-2.5 py-1 text-right font-semibold text-emerald-600 dark:text-emerald-400">
                              ₹{Number(ib.amount).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {detailRow.remarks && (
                <div className="text-xs text-muted-foreground bg-muted/30 rounded-md p-3">
                  <span className="font-medium">Remarks: </span>{detailRow.remarks}
                </div>
              )}
            </div>
          )}
          <DialogFooter className="gap-2">
            {detailRow && outstanding(detailRow) > 0 && (
              <PermissionGate can="create_inventory_movements">
                <Button
                  variant="outline"
                  onClick={() => { setReturnDialog(detailRow); setDetailRow(null); }}
                  className="gap-1.5"
                >
                  <RotateCcw className="size-4" /> Record Return
                </Button>
              </PermissionGate>
            )}
            <Button variant="outline" onClick={() => setDetailRow(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Return Dialog */}
      <Dialog open={Boolean(returnDialog)} onOpenChange={(o) => !o && setReturnDialog(null)}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
              <RotateCcw className="size-4" /> Record Return
            </DialogTitle>
            <DialogDescription>
              Issue #{returnDialog?.id} — {returnDialog?.item?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="rounded-lg bg-muted/40 border p-3 text-sm grid grid-cols-2 gap-2">
              <div>
                <p className="text-xs text-muted-foreground">Issued To</p>
                <p className="font-medium">{returnDialog?.issuedToUser?.name ?? returnDialog?.issued_to_name ?? "—"}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Outstanding</p>
                <p className="font-bold text-amber-600 dark:text-amber-400">{returnDialog ? outstanding(returnDialog).toFixed(3) : "—"}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="return-qty">Return Quantity <span className="text-destructive">*</span></Label>
              <Input
                id="return-qty"
                type="number"
                step="0.001"
                min="0.001"
                max={returnDialog ? outstanding(returnDialog) : undefined}
                value={returnQty}
                onChange={(e) => setReturnQty(e.target.value)}
                placeholder="Enter quantity to return"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="return-remarks">Remarks</Label>
              <Textarea
                id="return-remarks"
                value={returnRemarks}
                onChange={(e) => setReturnRemarks(e.target.value)}
                placeholder="Optional remarks..."
                rows={2}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setReturnDialog(null)} disabled={returnMutation.isPending}>Cancel</Button>
            <Button onClick={handleReturn} disabled={returnMutation.isPending} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              {returnMutation.isPending ? "Recording..." : "Confirm Return"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="p-2 sm:p-3 md:p-4 space-y-4">
        <MainPageHeader
          id="inventory-issues-header"
          breadcrumbs={BREADCRUMBS}
          icon={LogOut}
          title="Issues / Dispatch"
          subtitle="Record item dispatch to staff — kisko kya saman diya"
        />

        {/* Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="border-rose-500/30 bg-rose-500/[0.03]">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Issues</span>
                <h3 className="text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
                  {isLoading ? "..." : (stats?.total_issues ?? 0)}
                </h3>
                <p className="text-[10px] text-muted-foreground">Dispatch entries</p>
              </div>
              <div className="p-3 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
                <LogOut className="size-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-500/30 bg-orange-500/[0.03]">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Total Qty Issued</span>
                <h3 className="text-2xl font-bold tracking-tight text-orange-600 dark:text-orange-400">
                  {isLoading ? "..." : Number(stats?.total_qty_issued ?? 0).toFixed(0)}
                </h3>
                <p className="text-[10px] text-muted-foreground">Units dispatched</p>
              </div>
              <div className="p-3 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
                <Package className="size-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-500/30 bg-amber-500/[0.03]">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Outstanding</span>
                <h3 className="text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                  {isLoading ? "..." : Number(stats?.total_outstanding ?? 0).toFixed(0)}
                </h3>
                <p className="text-[10px] text-muted-foreground">Not yet returned</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <RotateCcw className="size-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end">
          <PermissionGate can="create_inventory_movements">
            <Button id="new-issue-btn" onClick={() => createDisclosure.onOpen()}>
              <Plus className="size-4" />
              Issue Item
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
                      name: "item_id",
                      type: FORM_TYPE.SELECT,
                      label: "Item",
                      placeholder: "All items",
                      tooltip: "Filter by item",
                      options: [
                        { key: "", text: "All Items", value: "" },
                        ...allItems.map((i: any) => ({ key: String(i.id), text: i.name, value: String(i.id) })),
                      ],
                    },
                    {
                      name: "from_date",
                      type: FORM_TYPE.DATE,
                      label: "From Date",
                      placeholder: "From date",
                      tooltip: "Filter from this date",
                    },
                    {
                      name: "to_date",
                      type: FORM_TYPE.DATE,
                      label: "To Date",
                      placeholder: "To date",
                      tooltip: "Filter up to this date",
                    },
                  ],
                  searchGroup: {
                    selectName: "search_by",
                    searchName: "search",
                    options: [{ value: "staff", label: "Staff Name" }],
                    placeholder: "Search by staff or purpose...",
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
                  <TableEmptyState colSpan={COLUMNS.length} message="No issues found" description="Issue an item using the button above." />
                }
                fallback={<TableSkeletonLoader columns={COLUMNS.length} />}
                render={(row: IssueRow, index) => {
                  const out = outstanding(row);
                  const fullyReturned = out <= 0;
                  return (
                    <TableRow key={row.id} className={`hover:bg-muted/50 transition-colors ${fullyReturned ? "opacity-70" : ""}`}>
                      <TableCell className="w-12 text-muted-foreground font-mono text-sm">
                        {getSerialNumber((data as any)?.meta?.current_page ?? 1, filter.per_page ?? 15, index)}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-sm">
                        {new Date(row.issued_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{row.item?.name ?? `Item #${row.inventory_item_id}`}</p>
                        {row.item?.code && <p className="text-xs text-muted-foreground font-mono">{row.item.code}</p>}
                      </TableCell>
                      <TableCell className="font-mono font-semibold text-rose-600 dark:text-rose-400">
                        <div>
                          {Number(row.quantity).toFixed(3)}
                          <span className="text-[10px] font-normal text-muted-foreground ml-1">{row.item?.unit ?? ""}</span>
                        </div>
                        {row.total_cost && Number(row.total_cost) > 0 && (
                          <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                            ₹{Number(row.total_cost).toFixed(2)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <p className="font-medium">{row.issuedToUser?.name ?? row.issued_to_name ?? "—"}</p>
                      </TableCell>
                      <TableCell>
                        {row.department && <p className="text-sm font-medium">{row.department}</p>}
                        {row.purpose && <p className="text-xs text-muted-foreground">{row.purpose}</p>}
                        {!row.department && !row.purpose && <span className="text-muted-foreground">—</span>}
                      </TableCell>
                      <TableCell>
                        {fullyReturned ? (
                          <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 gap-1 text-[10px]">
                            <CheckCircle className="size-2.5" /> Returned
                          </Badge>
                        ) : (
                          <div>
                            <span className="text-xs font-mono font-semibold text-amber-600 dark:text-amber-400">{out.toFixed(3)}</span>
                            <span className="text-[10px] text-muted-foreground ml-1">pending</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-1 text-sm">
                          <User className="size-3 text-muted-foreground" />
                          {row.issuedBy?.name ?? "—"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button size="icon-sm" variant="ghost" onClick={() => setDetailRow(row)}>
                            <Eye className="size-4" />
                          </Button>
                          {!fullyReturned && (
                            <PermissionGate can="create_inventory_movements">
                              <Button
                                size="icon-sm"
                                variant="ghost"
                                onClick={() => { setReturnDialog(row); setReturnQty(""); setReturnRemarks(""); }}
                                className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-500/10"
                                title="Record return"
                              >
                                <RotateCcw className="size-4" />
                              </Button>
                            </PermissionGate>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                }}
              />
            </DataTable>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default InventoryIssuesIndex;
