import React, { useState, useMemo } from "react";
import { Head, Link } from "@inertiajs/react";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import DataTable, { TableEmptyState, TableSkeletonLoader } from "@/components/dataTable";
import Each from "@/components/Each";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/filter-bar";
import {
  ShoppingCart,
  Plus,
  Eye,
  Pencil,
  IndianRupee,
  Receipt,
  User,
  Package,
  Building2,
  FileSpreadsheet,
  Clock,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  RotateCcw,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useSearchFilter from "@/hooks/useSearchfilter";
import { useDisclosure } from "@/hooks/useDisclosure";
import { getSerialNumber } from "@/lib/utils";
import inventoryApi from "@/lib/api/inventoryApi";
import inventoryVendorApi, { InventoryVendor } from "@/lib/api/inventoryVendorApi";
import { PermissionGate } from "@/components/PermissionGate";
import { FORM_TYPE } from "@/constants";
import { InventoryPurchaseDialog } from "@/components/admin/inventoryPurchaseDialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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
  inventory_vendor_id?: number;
  bill_no?: string;
  supplier_name?: string;
  vendor?: {
    id: number;
    name: string;
    contact_name?: string;
    contact_phone?: string;
    city?: string;
  };
  purchased_at: string;
  total_cost: string | number;
  payment_status?: "paid" | "credit" | "settled" | "reverted";
  settled_at?: string;
  payment_mode?: string;
  remarks?: string;
  expense_id?: number;
  purchased_by?: { id: number; name: string };
  reverted_at?: string;
  reverted_by?: { id: number; name: string };
  revert_reason?: string;
  lines?: PurchaseLine[];
}

const COLUMNS = [
  { key: "serial", label: "#" },
  { key: "date", label: "Date" },
  { key: "supplier", label: "Supplier / Bill" },
  { key: "items", label: "Items" },
  { key: "total_cost", label: "Total Cost" },
  { key: "payment_status", label: "Status" },
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
  payment_status: "",
};

const PAYMENT_MODES = [
  { key: "cash", text: "Cash", value: "cash" },
  { key: "upi", text: "UPI", value: "upi" },
  { key: "bank", text: "Bank Transfer", value: "bank" },
  { key: "cheque", text: "Cheque", value: "cheque" },
  { key: "credit", text: "Credit / Udhaar", value: "credit" },
];

const InventoryPurchasesIndex = () => {
  const queryClient = useQueryClient();
  const { filter, handleFilter } = useSearchFilter(INITIAL_FILTERS);
  const createDisclosure = useDisclosure();
  const [detailRow, setDetailRow] = useState<PurchaseRow | null>(null);
  const [editPurchase, setEditPurchase] = useState<PurchaseRow | null>(null);
  const [exportModalOpen, setExportModalOpen] = useState(false);

  // Revert purchase states
  const [revertRow, setRevertRow] = useState<PurchaseRow | null>(null);
  const [revertReason, setRevertReason] = useState("");
  const [isReverting, setIsReverting] = useState(false);

  // Export filters
  const [exportFilters, setExportFilters] = useState({
    inventory_vendor_id: "all",
    inventory_item_id: "all",
    payment_status: "all",
    from_date: "",
    to_date: "",
  });

  const { data, isLoading } = useQuery({
    queryKey: ["inventory-purchases", filter],
    queryFn: () => inventoryApi.purchases.index(filter),
  });

  // Query vendors for export modal
  const { data: vendorsData } = useQuery({
    queryKey: ["inventory-vendors-export-list"],
    queryFn: () => inventoryVendorApi.index({ per_page: 200 }),
    enabled: exportModalOpen,
  });

  // Query items for export modal
  const { data: itemsData } = useQuery({
    queryKey: ["inventory-items-export-list"],
    queryFn: () => inventoryApi.items.index({ per_page: 500 }),
    enabled: exportModalOpen,
  });

  const vendorsList: InventoryVendor[] = useMemo(() => {
    const raw = vendorsData?.data;
    if (Array.isArray(raw?.data)) return raw.data;
    if (Array.isArray(raw)) return raw;
    return [];
  }, [vendorsData]);

  const itemsList = useMemo(() => {
    const raw = (itemsData as any)?.data?.data ?? (itemsData as any)?.data ?? itemsData ?? [];
    return Array.isArray(raw) ? raw : [];
  }, [itemsData]);

  const stats = (data as any)?.meta?.stats;

  const handleFilterChange = (updates: Record<string, unknown>) => {
    handleFilter({ ...updates, page: 1 });
  };

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["inventory-purchases"] });
    queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
    queryClient.invalidateQueries({ queryKey: ["inventory-vendors"] });
    createDisclosure.onClose();
    setEditPurchase(null);
  };

  const pmLabel = (mode?: string) => {
    const found = PAYMENT_MODES.find((m) => m.value === mode);
    return found?.text ?? (mode ?? "—");
  };

  const handleTriggerExport = () => {
    const url = inventoryApi.purchases.exportUrl(exportFilters);
    window.open(url, "_blank");
    setExportModalOpen(false);
  };

  const handleOpenRevert = (row: PurchaseRow) => {
    setRevertRow(row);
    setRevertReason("");
  };

  const handleConfirmRevert = async () => {
    if (!revertRow) return;
    if (!revertReason.trim() || revertReason.trim().length < 3) {
      toast.error("Please enter a valid reason for reverting (at least 3 characters).");
      return;
    }

    setIsReverting(true);
    try {
      const res = await inventoryApi.purchases.revert(revertRow.id, { reason: revertReason.trim() });
      toast.success((res as any)?.data?.message || "Purchase reverted successfully. Stock deducted.");
      setRevertRow(null);
      setRevertReason("");
      if (detailRow?.id === revertRow.id) {
        setDetailRow((prev) =>
          prev
            ? {
                ...prev,
                payment_status: "reverted",
                reverted_at: new Date().toISOString(),
                revert_reason: revertReason.trim(),
              }
            : null
        );
      }
      queryClient.invalidateQueries({ queryKey: ["inventory-purchases"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-vendors"] });
    } catch (err: any) {
      const errorMsg = err?.response?.data?.message || err?.message || "Failed to revert purchase";
      toast.error(errorMsg);
    } finally {
      setIsReverting(false);
    }
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
        <DialogContent className="w-[95vw] sm:max-w-xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-4 sm:p-5 border-b shrink-0 bg-muted/20">
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Receipt className="size-5 text-primary" />
              <span>Purchase #{detailRow?.id} Details</span>
            </DialogTitle>
          </DialogHeader>

          {detailRow && (
            <div className="overflow-y-auto p-4 sm:p-6 space-y-4 flex-1 text-sm">
              <div className="grid grid-cols-2 gap-3 rounded-lg border bg-muted/30 p-4">
                <div>
                  <p className="text-xs text-muted-foreground">Purchase Date</p>
                  <p className="font-medium">
                    {new Date(detailRow.purchased_at).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Purchased By</p>
                  <p className="font-medium">{detailRow.purchased_by?.name ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Supplier / Vendor</p>
                  {detailRow.inventory_vendor_id ? (
                    <Link
                      href={`/inventory/vendors/${detailRow.inventory_vendor_id}`}
                      className="font-semibold text-primary hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <Building2 className="size-3.5" />
                      <span>{detailRow.vendor?.name ?? detailRow.supplier_name ?? `Vendor #${detailRow.inventory_vendor_id}`}</span>
                    </Link>
                  ) : (
                    <p className="font-medium">{detailRow.supplier_name ?? "—"}</p>
                  )}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Bill No.</p>
                  <p className="font-mono font-medium">{detailRow.bill_no ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Payment Status</p>
                  <div className="mt-0.5">
                    {detailRow.payment_status === "credit" ? (
                      <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 text-xs font-semibold gap-1">
                        <Clock className="size-3" />
                        Credit (Pending Settlement)
                      </Badge>
                    ) : detailRow.payment_status === "settled" ? (
                      <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700 text-xs font-semibold gap-1">
                        <CheckCircle2 className="size-3" />
                        Settled
                      </Badge>
                    ) : (
                      <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 text-xs font-semibold">
                        Direct Paid
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Cost</p>
                  <p className="font-bold text-base text-emerald-600 dark:text-emerald-400">
                    ₹{Number(detailRow.total_cost).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              </div>

              {detailRow.payment_status === "reverted" && (
                <div className="rounded-lg bg-destructive/10 border border-destructive/30 p-3.5 text-xs text-destructive flex items-start gap-2.5">
                  <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                  <div className="space-y-1.5 flex-1">
                    <p className="font-bold text-sm">Purchase Reverted / Cancelled</p>
                    <p className="text-muted-foreground leading-relaxed">
                      This purchase was reverted
                      {detailRow.reverted_at
                        ? ` on ${new Date(detailRow.reverted_at).toLocaleString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}`
                        : ""}
                      {detailRow.reverted_by?.name ? ` by ${detailRow.reverted_by.name}` : ""}.
                      The stock has been removed from inventory and linked expense voided.
                    </p>
                    {detailRow.revert_reason && (
                      <div className="mt-1 p-2.5 rounded bg-background/80 border text-foreground font-medium">
                        <span className="font-bold text-destructive">Reason: </span>
                        {detailRow.revert_reason}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {detailRow.payment_status === "credit" && (
                <div className="rounded-md bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 text-xs flex items-start gap-2.5 text-amber-800 dark:text-amber-200">
                  <AlertCircle className="size-4 shrink-0 mt-0.5 text-amber-600" />
                  <div>
                    <span className="font-semibold">Credit Purchase (Deferred Expense): </span>
                    Stock has been incremented. Accounts expense will be automatically created when this payment is settled via the Supplier Ledger.
                    {detailRow.inventory_vendor_id && (
                      <div className="mt-1.5">
                        <Link
                          href={`/inventory/vendors/${detailRow.inventory_vendor_id}`}
                          className="inline-flex items-center gap-1 font-semibold text-amber-900 dark:text-amber-100 underline hover:opacity-80"
                        >
                          Go to Supplier Ledger to Settle &rarr;
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {detailRow.settled_at && (
                <div className="rounded-md bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 px-3 py-2 text-xs flex items-center gap-2 text-blue-800 dark:text-blue-200">
                  <CheckCircle2 className="size-3.5 text-blue-600" />
                  <span>Settled on {new Date(detailRow.settled_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                </div>
              )}

              {detailRow.expense_id && (
                <div className="rounded-md bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 px-3 py-2 text-xs flex items-center gap-2 text-indigo-700 dark:text-indigo-300">
                  <IndianRupee className="size-3.5" />
                  <span>Linked to Expense #{detailRow.expense_id} — recorded in school accounts</span>
                </div>
              )}

              <div>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Items Purchased
                </p>
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
                          <td className="px-3 py-2 text-right font-mono">
                            {Number(line.quantity).toFixed(3)} {line.item?.unit ?? ""}
                          </td>
                          <td className="px-3 py-2 text-right font-mono">₹{Number(line.unit_cost).toFixed(2)}</td>
                          <td className="px-3 py-2 text-right font-mono font-semibold">₹{Number(line.amount).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-muted/30 border-t-2">
                      <tr>
                        <td colSpan={3} className="px-3 py-2 text-right font-semibold text-muted-foreground">
                          Total
                        </td>
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

          <DialogFooter className="p-3 sm:p-4 border-t shrink-0 bg-muted/20 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              {detailRow && detailRow.payment_status !== "reverted" && (
                <>
                  <PermissionGate can="update_inventory_items">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (!detailRow) return;
                        const r = detailRow;
                        setDetailRow(null);
                        setEditPurchase(r);
                      }}
                      className="gap-1.5"
                    >
                      <Pencil className="size-3.5" /> Edit Purchase
                    </Button>
                  </PermissionGate>
                  <PermissionGate can="delete_inventory_items">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        if (!detailRow) return;
                        handleOpenRevert(detailRow);
                      }}
                      className="gap-1.5"
                    >
                      <RotateCcw className="size-3.5" /> Revert Purchase
                    </Button>
                  </PermissionGate>
                </>
              )}
            </div>
            <Button variant="outline" size="sm" onClick={() => setDetailRow(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revert Purchase Confirmation Modal */}
      <Dialog
        open={Boolean(revertRow)}
        onOpenChange={(o) => !o && !isReverting && setRevertRow(null)}
      >
        <DialogContent className="w-[95vw] sm:max-w-md max-h-[90vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-4 sm:p-5 border-b shrink-0 bg-destructive/5">
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg text-destructive">
              <RotateCcw className="size-5" />
              <span>Revert Purchase #{revertRow?.id}</span>
            </DialogTitle>
          </DialogHeader>

          {revertRow && (
            <div className="overflow-y-auto p-4 sm:p-6 space-y-4 flex-1 text-sm">
              <div className="rounded-lg border bg-muted/40 p-3.5 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Supplier:</span>
                  <span className="font-semibold">
                    {revertRow.vendor?.name ?? revertRow.supplier_name ?? "—"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Bill No:</span>
                  <span className="font-mono">{revertRow.bill_no ?? "—"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Amount:</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{Number(revertRow.total_cost).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Status:</span>
                  <Badge variant="outline" className="text-[10px] capitalize">
                    {revertRow.payment_status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items:</span>
                  <span>{revertRow.lines?.length ?? 0} item line(s)</span>
                </div>
              </div>

              <div className="rounded-lg bg-amber-500/10 border border-amber-500/30 p-3.5 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2.5">
                <AlertTriangle className="size-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                <div className="space-y-1">
                  <p className="font-semibold">Important Warning</p>
                  <p>
                    Reverting this purchase will <strong>deduct the purchased stock</strong> from current inventory, record a return movement audit, and void/cancel any linked school expense.
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    If any of these items have already been issued to students or departments, the reversal will be blocked to avoid negative inventory.
                  </p>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="revert-reason" className="text-xs font-semibold flex items-center gap-1">
                  Reason for Reversion <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="revert-reason"
                  placeholder="E.g. Wrong bill entered, supplier delivered incorrect items, duplicate entry..."
                  value={revertReason}
                  onChange={(e) => setRevertReason(e.target.value)}
                  className="min-h-[90px] text-xs resize-none"
                  disabled={isReverting}
                />
                <p className="text-[10px] text-muted-foreground">
                  A descriptive reason is required for audit and accounting records.
                </p>
              </div>
            </div>
          )}

          <DialogFooter className="p-3 sm:p-4 border-t shrink-0 bg-muted/20 flex flex-row items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setRevertRow(null)}
              disabled={isReverting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleConfirmRevert}
              disabled={isReverting || revertReason.trim().length < 3}
              className="gap-1.5"
            >
              <RotateCcw className="size-3.5" />
              {isReverting ? "Reverting..." : "Confirm Revert"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Export Purchases Modal */}
      <Dialog open={exportModalOpen} onOpenChange={setExportModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-md max-h-[85vh] flex flex-col p-0 overflow-hidden">
          <DialogHeader className="p-4 sm:p-5 border-b shrink-0 bg-muted/20">
            <DialogTitle className="flex items-center gap-2 text-base sm:text-lg">
              <FileSpreadsheet className="size-5 text-emerald-600" />
              <span>Export Purchases Excel Report</span>
            </DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto p-4 sm:p-6 space-y-4 flex-1 text-sm">
            <p className="text-xs text-muted-foreground">
              Filter and download a comprehensive Excel (.xlsx) sheet of inventory purchases, supplier details, payment statuses, and costs.
            </p>

            {/* Filter by Vendor */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Supplier / Vendor</Label>
              <Select
                value={exportFilters.inventory_vendor_id}
                onValueChange={(val) =>
                  setExportFilters({ ...exportFilters, inventory_vendor_id: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Suppliers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">-- All Suppliers --</SelectItem>
                  {vendorsList.map((v) => (
                    <SelectItem key={v.id} value={String(v.id)}>
                      {v.name} {v.city ? `(${v.city})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filter by Item */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Inventory Item</Label>
              <Select
                value={exportFilters.inventory_item_id}
                onValueChange={(val) =>
                  setExportFilters({ ...exportFilters, inventory_item_id: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Items" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">-- All Items --</SelectItem>
                  {itemsList.map((it: any) => (
                    <SelectItem key={it.id} value={String(it.id)}>
                      {it.name} {it.code ? `(${it.code})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Filter by Payment Status */}
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Payment Status</Label>
              <Select
                value={exportFilters.payment_status}
                onValueChange={(val) =>
                  setExportFilters({ ...exportFilters, payment_status: val })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All Payment Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">-- All Payment Statuses --</SelectItem>
                  <SelectItem value="credit">⏳ Credit / Unsettled</SelectItem>
                  <SelectItem value="settled">✅ Settled</SelectItem>
                  <SelectItem value="paid">Direct Paid</SelectItem>
                  <SelectItem value="reverted">❌ Reverted</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="pur_exp_from" className="text-xs font-semibold">From Date</Label>
                <Input
                  id="pur_exp_from"
                  type="date"
                  value={exportFilters.from_date}
                  onChange={(e) => setExportFilters({ ...exportFilters, from_date: e.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pur_exp_to" className="text-xs font-semibold">To Date</Label>
                <Input
                  id="pur_exp_to"
                  type="date"
                  value={exportFilters.to_date}
                  onChange={(e) => setExportFilters({ ...exportFilters, to_date: e.target.value })}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="p-3 sm:p-4 border-t shrink-0 bg-muted/20 flex flex-row items-center justify-end gap-2">
            <Button type="button" variant="outline" size="sm" onClick={() => setExportModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5"
              onClick={handleTriggerExport}
            >
              <Download className="size-4" />
              <span>Download (.xlsx)</span>
            </Button>
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

        {/* 4 Stats Cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Card className="border-emerald-500/30 bg-emerald-500/[0.03]">
            <CardContent className="p-4 sm:p-5 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total Purchases
                </span>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                  {isLoading ? "..." : (stats?.total_purchases ?? 0)}
                </h3>
                <p className="text-[10px] text-muted-foreground">Entries recorded</p>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <ShoppingCart className="size-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-indigo-500/30 bg-indigo-500/[0.03]">
            <CardContent className="p-4 sm:p-5 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total Spent
                </span>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400">
                  {isLoading
                    ? "..."
                    : `₹${Number(stats?.total_cost ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
                </h3>
                <p className="text-[10px] text-muted-foreground">Filtered purchases cost</p>
              </div>
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                <IndianRupee className="size-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-500/30 bg-amber-500/[0.03]">
            <CardContent className="p-4 sm:p-5 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Credit Due (Udhaar)
                </span>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
                  {isLoading
                    ? "..."
                    : `₹${Number(stats?.total_credit ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
                </h3>
                <p className="text-[10px] text-muted-foreground">Pending settlements</p>
              </div>
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Clock className="size-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-500/30 bg-blue-500/[0.03]">
            <CardContent className="p-4 sm:p-5 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Settled Credit
                </span>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
                  {isLoading
                    ? "..."
                    : `₹${Number(stats?.total_settled ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}`}
                </h3>
                <p className="text-[10px] text-muted-foreground">Paid via vendor ledger</p>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                <CheckCircle2 className="size-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top actions bar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <Link href="/inventory/vendors">
            <Button variant="outline" size="sm" className="gap-1.5 shadow-sm">
              <Building2 className="size-4 text-primary" />
              <span>Suppliers Directory</span>
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setExportModalOpen(true)}
              className="gap-1.5 border-emerald-600/30 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/30 shadow-sm"
            >
              <FileSpreadsheet className="size-4 text-emerald-600" />
              <span>Export Excel</span>
            </Button>

            <PermissionGate can="create_inventory_items">
              <Button id="new-purchase-btn" size="sm" onClick={() => createDisclosure.onOpen()} className="gap-1.5 shadow-sm">
                <Plus className="size-4" />
                <span>Record Purchase</span>
              </Button>
            </PermissionGate>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-4">
            <FilterBar values={filter} onChange={handleFilterChange}>
              <FilterBar.Renderer
                config={{
                  filters: [
                    {
                      name: "payment_status",
                      type: FORM_TYPE.SELECT,
                      label: "Status",
                      placeholder: "All Payment Statuses",
                      options: [
                        { key: "all", text: "All Statuses", value: "" },
                        { key: "credit", text: "⏳ Credit (Due)", value: "credit" },
                        { key: "settled", text: "✅ Settled", value: "settled" },
                        { key: "paid", text: "Direct Paid", value: "paid" },
                        { key: "reverted", text: "❌ Reverted", value: "reverted" },
                      ],
                    },
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
                  <TableEmptyState
                    colSpan={COLUMNS.length}
                    message="No purchases found"
                    description="Record a purchase or register a vendor using the buttons above."
                  />
                }
                fallback={<TableSkeletonLoader columns={COLUMNS.length} />}
                render={(row: PurchaseRow, index) => (
                  <TableRow key={row.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="w-12 text-muted-foreground font-mono text-sm">
                      {getSerialNumber((data as any)?.meta?.current_page ?? 1, filter.per_page ?? 15, index)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap text-sm">
                      {new Date(row.purchased_at).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      {row.inventory_vendor_id ? (
                        <div>
                          <Link
                            href={`/inventory/vendors/${row.inventory_vendor_id}`}
                            className="group inline-flex items-center gap-1.5 font-medium text-foreground hover:text-primary transition-colors"
                          >
                            <Building2 className="size-3.5 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                            <span className="underline-offset-2 group-hover:underline">
                              {row.vendor?.name ?? row.supplier_name ?? `Vendor #${row.inventory_vendor_id}`}
                            </span>
                          </Link>
                          {row.bill_no && (
                            <p className="text-xs text-muted-foreground font-mono mt-0.5">Bill: {row.bill_no}</p>
                          )}
                        </div>
                      ) : (
                        <div>
                          <p className="font-medium">
                            {row.supplier_name ?? <span className="text-muted-foreground italic">No supplier</span>}
                          </p>
                          {row.bill_no && (
                            <p className="text-xs text-muted-foreground font-mono mt-0.5">Bill: {row.bill_no}</p>
                          )}
                        </div>
                      )}
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
                          <Badge variant="secondary" className="text-[10px]">
                            +{(row.lines ?? []).length - 3} more
                          </Badge>
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
                      {row.payment_status === "reverted" ? (
                        <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30 hover:bg-destructive/15 text-[11px] font-medium gap-1">
                          ❌ Reverted
                        </Badge>
                      ) : row.payment_status === "credit" ? (
                        <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700 hover:bg-amber-500/20 text-[11px] font-medium gap-1">
                          ⏳ Credit (Due)
                        </Badge>
                      ) : row.payment_status === "settled" ? (
                        <Badge className="bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700 hover:bg-blue-500/20 text-[11px] font-medium gap-1">
                          ✅ Settled
                        </Badge>
                      ) : (
                        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700 hover:bg-emerald-500/20 text-[11px] font-medium gap-1">
                          Direct Paid
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-sm">
                        <User className="size-3 text-muted-foreground" />
                        {row.purchased_by?.name ?? "—"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize text-xs">
                        {pmLabel(row.payment_mode)}
                      </Badge>
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
                        {row.payment_status !== "reverted" && (
                          <>
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
                            <PermissionGate can="delete_inventory_items">
                              <Button
                                size="icon-sm"
                                variant="ghost"
                                onClick={() => handleOpenRevert(row)}
                                title="Revert Purchase"
                                className="text-destructive/80 hover:text-destructive hover:bg-destructive/10"
                              >
                                <RotateCcw className="size-4" />
                              </Button>
                            </PermissionGate>
                          </>
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

export default InventoryPurchasesIndex;
