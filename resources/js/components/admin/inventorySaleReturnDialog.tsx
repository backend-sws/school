import React, { useState, useMemo, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/query.client";
import inventoryApi from "@/lib/api/inventoryApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RotateCcw, AlertCircle, IndianRupee, Undo2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface InventorySaleReturnDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  sale: any | null;
}

const REFUND_MODES = [
  { value: "cash", label: "Cash Refund" },
  { value: "upi", label: "UPI / Online Refund" },
  { value: "bank", label: "Bank Transfer" },
  { value: "credit", label: "Ledger Credit (No Cash Out)" },
  { value: "none", label: "No Refund / Exchange" },
];

const RETURN_REASONS = [
  "Wrong size / fitting",
  "Defective / damaged item",
  "Customer changed mind",
  "Excess / duplicate purchase",
  "Incorrect item issued",
  "Other",
];

export function InventorySaleReturnDialog({
  open,
  onClose,
  onSuccess,
  sale,
}: InventorySaleReturnDialogProps) {
  // Line return quantities: lineId -> quantity
  const [returnQtys, setReturnQtys] = useState<Record<number, number>>({});
  const [reasonCategory, setReasonCategory] = useState<string>("Wrong size / fitting");
  const [reasonNotes, setReasonNotes] = useState<string>("");
  const [refundMode, setRefundMode] = useState<string>("cash");

  // Reset when dialog opens or sale changes
  useEffect(() => {
    if (open && sale) {
      setReturnQtys({});
      setReasonCategory("Wrong size / fitting");
      setReasonNotes("");
      setRefundMode("cash");
    }
  }, [open, sale]);

  const lines = useMemo(() => {
    if (!sale?.lines) return [];
    return sale.lines.map((l: any) => {
      const soldQty = Number(l.quantity || 0);
      const returnedQty = Number(l.returned_quantity || 0);
      const returnableQty = Math.max(0, soldQty - returnedQty);
      const unitPrice = Number(l.unit_price || 0);
      return {
        id: Number(l.id),
        itemId: Number(l.inventory_item_id),
        itemName: l.item?.name ?? `Item #${l.inventory_item_id}`,
        itemCode: l.item?.code,
        soldQty,
        returnedQty,
        returnableQty,
        unitPrice,
      };
    });
  }, [sale]);

  const handleQtyChange = (lineId: number, maxQty: number, val: string) => {
    if (val === "") {
      setReturnQtys((prev) => {
        const next = { ...prev };
        delete next[lineId];
        return next;
      });
      return;
    }
    const num = parseFloat(val);
    if (isNaN(num) || num < 0) return;
    const clamped = Math.min(num, maxQty);
    setReturnQtys((prev) => ({
      ...prev,
      [lineId]: clamped,
    }));
  };

  const setFullReturn = (lineId: number, maxQty: number) => {
    setReturnQtys((prev) => ({
      ...prev,
      [lineId]: maxQty,
    }));
  };

  // Calculations
  const { totalReturnQty, totalRefundAmount, returnPayload } = useMemo(() => {
    let tQty = 0;
    let tAmount = 0;
    const payload: Array<{ inventory_sale_line_id: number; quantity: number }> = [];

    lines.forEach((l: any) => {
      const q = returnQtys[l.id] ?? 0;
      if (q > 0) {
        tQty += q;
        tAmount += q * l.unitPrice;
        payload.push({
          inventory_sale_line_id: l.id,
          quantity: q,
        });
      }
    });

    return {
      totalReturnQty: tQty,
      totalRefundAmount: Math.round(tAmount * 100) / 100,
      returnPayload: payload,
    };
  }, [lines, returnQtys]);

  const returnMutation = useMutation({
    mutationFn: (data: {
      lines: Array<{ inventory_sale_line_id: number; quantity: number }>;
      reason?: string;
      refund_mode?: string;
    }) => inventoryApi.sales.recordReturn(sale.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-sales"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-sale", sale?.id] });
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-movements"] });
      toast.success("Items returned successfully. Stock restored to inventory.");
      onClose();
      onSuccess?.();
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || "Failed to process return.";
      toast.error(msg);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (returnPayload.length === 0) {
      toast.error("Please enter at least one item quantity to return.");
      return;
    }

    const fullReason = reasonNotes ? `${reasonCategory}: ${reasonNotes}` : reasonCategory;

    returnMutation.mutate({
      lines: returnPayload,
      reason: fullReason,
      refund_mode: refundMode,
    });
  };

  if (!sale) return null;

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-3xl md:max-w-4xl w-full max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden shadow-2xl rounded-2xl border border-border/70 bg-background">
        <DialogHeader className="p-5 pb-4 bg-muted/20 border-b shrink-0 pr-12">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0">
                <Undo2 className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold tracking-tight">
                  Sales Return — Sale #{sale.id}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Specify returned items. Items will be restored to store inventory stock immediately.
                </DialogDescription>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
              <Badge variant="outline" className="text-xs capitalize py-1 px-2.5 bg-background">
                Buyer: {sale.buyer_name ?? sale.user?.name ?? sale.buyer_type}
              </Badge>
              <Badge
                variant="outline"
                className={
                  sale.payment_status === "paid"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 py-1 px-2.5 capitalize"
                    : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 py-1 px-2.5 capitalize"
                }
              >
                {sale.payment_status}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 min-h-0">
            {/* ── Table of sold items ── */}
            <div className="rounded-xl border border-border/70 bg-card overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <Table className="min-w-[620px]">
                  <TableHeader className="bg-muted/40">
                    <TableRow>
                      <TableHead className="w-[34%] pl-4 font-semibold text-xs text-muted-foreground">Item</TableHead>
                      <TableHead className="text-center w-[15%] font-semibold text-xs text-muted-foreground">Sold Qty</TableHead>
                      <TableHead className="text-center w-[16%] font-semibold text-xs text-muted-foreground">Prev. Returned</TableHead>
                      <TableHead className="text-center w-[18%] font-semibold text-xs text-muted-foreground">Return Qty</TableHead>
                      <TableHead className="text-right w-[17%] pr-4 font-semibold text-xs text-muted-foreground">Refund Subtotal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lines.map((l: any) => {
                      const currentInput = returnQtys[l.id] ?? 0;
                      const lineRefund = Math.round(currentInput * l.unitPrice * 100) / 100;
                      const isFullyReturned = l.returnableQty <= 0;

                      return (
                        <TableRow key={l.id} className={isFullyReturned ? "opacity-60 bg-muted/20" : "hover:bg-muted/30"}>
                          <TableCell className="pl-4 py-3">
                            <div className="flex flex-col">
                              <span className="font-semibold text-sm text-foreground">{l.itemName}</span>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                {l.itemCode && <span>Code: {l.itemCode}</span>}
                                <span>₹{l.unitPrice.toFixed(2)}/unit</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center font-mono font-medium py-3 text-sm">
                            {l.soldQty}
                          </TableCell>
                          <TableCell className="text-center font-mono py-3 text-sm">
                            {l.returnedQty > 0 ? (
                              <Badge variant="outline" className="text-xs bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400">
                                {l.returnedQty}
                              </Badge>
                            ) : (
                              <span className="text-muted-foreground">0</span>
                            )}
                          </TableCell>
                          <TableCell className="py-3">
                            {isFullyReturned ? (
                              <div className="flex items-center justify-center">
                                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                  <CheckCircle2 className="size-3.5" /> All Returned
                                </span>
                              </div>
                            ) : (
                              <div className="flex flex-col items-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <Input
                                    type="number"
                                    min={0}
                                    max={l.returnableQty}
                                    step="any"
                                    value={returnQtys[l.id] ?? ""}
                                    onChange={(e) => handleQtyChange(l.id, l.returnableQty, e.target.value)}
                                    placeholder="0"
                                    className="h-8 text-center font-mono text-sm w-20 px-1 border-muted-foreground/30 focus-visible:ring-1"
                                  />
                                  <Button
                                    type="button"
                                    variant="secondary"
                                    size="sm"
                                    onClick={() => setFullReturn(l.id, l.returnableQty)}
                                    className="h-8 px-2 text-[11px] font-medium hover:bg-primary/10 hover:text-primary transition-colors"
                                    title={`Return all (${l.returnableQty})`}
                                  >
                                    Max
                                  </Button>
                                </div>
                                <span className="text-[10px] text-muted-foreground mt-0.5">
                                  Max: {l.returnableQty}
                                </span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right font-mono font-semibold text-sm pr-4 py-3">
                            ₹{lineRefund.toFixed(2)}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* ── Return Parameters ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="return-reason" className="text-xs font-semibold">
                  Return Reason
                </Label>
                <Select value={reasonCategory} onValueChange={setReasonCategory}>
                  <SelectTrigger id="return-reason" className="h-9 text-xs">
                    <SelectValue placeholder="Select reason" />
                  </SelectTrigger>
                  <SelectContent>
                    {RETURN_REASONS.map((r) => (
                      <SelectItem key={r} value={r} className="text-xs">
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="refund-mode" className="text-xs font-semibold">
                  Refund Method
                </Label>
                <Select value={refundMode} onValueChange={setRefundMode}>
                  <SelectTrigger id="refund-mode" className="h-9 text-xs">
                    <SelectValue placeholder="Select refund mode" />
                  </SelectTrigger>
                  <SelectContent>
                    {REFUND_MODES.map((m) => (
                      <SelectItem key={m.value} value={m.value} className="text-xs">
                        {m.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="return-notes" className="text-xs font-semibold">
                Additional Notes / Remarks (Optional)
              </Label>
              <Input
                id="return-notes"
                value={reasonNotes}
                onChange={(e) => setReasonNotes(e.target.value)}
                placeholder="e.g. Student provided receipt; returned in original packaging..."
                className="h-9 text-xs"
              />
            </div>

            {/* ── Summary Card ── */}
            <div className="rounded-xl bg-rose-500/10 border border-rose-200 dark:border-rose-900/60 p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 text-rose-700 dark:text-rose-300">
                <div className="p-2 rounded-lg bg-rose-500/15 shrink-0">
                  <AlertCircle className="size-5" />
                </div>
                <div className="text-xs">
                  <span className="font-semibold block text-sm">Inventory Stock Recovery</span>
                  <span className="text-muted-foreground dark:text-rose-300/80">
                    {totalReturnQty > 0
                      ? `${totalReturnQty} item(s) will be automatically added back into store stock inventory.`
                      : "Enter return quantities above to see stock recovery and refund calculation."}
                  </span>
                </div>
              </div>
              <div className="text-left sm:text-right shrink-0 self-end sm:self-auto pl-10 sm:pl-0">
                <span className="text-xs text-muted-foreground block font-medium">Total Refund Amount</span>
                <span className="text-2xl font-bold font-mono text-rose-700 dark:text-rose-300">
                  ₹{totalRefundAmount.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter className="p-4 px-6 bg-muted/20 border-t shrink-0 flex flex-row items-center justify-between sm:justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={returnMutation.isPending}
              className="px-4"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={returnMutation.isPending || totalReturnQty <= 0}
              className="gap-2 px-5 font-semibold shadow-md shadow-destructive/20"
            >
              <RotateCcw className="size-4" />
              {returnMutation.isPending
                ? "Processing Return..."
                : totalReturnQty > 0
                ? `Process Return (${totalReturnQty} items)`
                : "Process Return"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
