import React, { useState, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query.client";
import inventoryApi from "@/lib/api/inventoryApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShoppingCart, Plus, Trash2, IndianRupee, Package } from "lucide-react";
import { toast } from "sonner";

interface PurchaseLine {
  inventory_item_id: string;
  quantity: string;
  unit_cost: string;
}

interface InventoryPurchaseDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const PAYMENT_MODES = [
  { value: "cash", label: "Cash" },
  { value: "upi", label: "UPI" },
  { value: "bank", label: "Bank Transfer" },
  { value: "cheque", label: "Cheque" },
];

const emptyLine = (): PurchaseLine => ({
  inventory_item_id: "",
  quantity: "",
  unit_cost: "",
});

export function InventoryPurchaseDialog({ open, onClose, onSuccess }: InventoryPurchaseDialogProps) {
  const today = new Date().toISOString().split("T")[0];

  const [supplierName, setSupplierName] = useState("");
  const [billNo, setBillNo] = useState("");
  const [purchasedAt, setPurchasedAt] = useState(today);
  const [paymentMode, setPaymentMode] = useState("cash");
  const [remarks, setRemarks] = useState("");
  const [lines, setLines] = useState<PurchaseLine[]>([emptyLine()]);

  const { data: itemsData } = useQuery({
    queryKey: ["inventory-items-all"],
    queryFn: () => inventoryApi.items.index({ per_page: 500 }),
    enabled: open,
  });

  const itemOptions = useMemo(() => {
    const raw = (itemsData as any)?.data?.data ?? (itemsData as any)?.data ?? itemsData ?? [];
    return Array.isArray(raw) ? raw : [];
  }, [itemsData]);

  const totalCost = useMemo(() => {
    return lines.reduce((sum, l) => {
      const qty = parseFloat(l.quantity) || 0;
      const cost = parseFloat(l.unit_cost) || 0;
      return sum + qty * cost;
    }, 0);
  }, [lines]);

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: Record<string, unknown>) => inventoryApi.purchases.store(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-purchases"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      handleReset();
      onSuccess?.();
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? "Failed to record purchase.";
      toast.error(msg);
    },
  });

  const handleReset = () => {
    setSupplierName("");
    setBillNo("");
    setPurchasedAt(today);
    setPaymentMode("cash");
    setRemarks("");
    setLines([emptyLine()]);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const addLine = () => setLines((prev) => [...prev, emptyLine()]);

  const removeLine = (i: number) =>
    setLines((prev) => prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev);

  const updateLine = (i: number, field: keyof PurchaseLine, value: string) =>
    setLines((prev) => prev.map((l, idx) => idx === i ? { ...l, [field]: value } : l));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate lines
    const validLines = lines.filter((l) => l.inventory_item_id && parseFloat(l.quantity) > 0);
    if (validLines.length === 0) {
      toast.error("Please add at least one item with quantity.");
      return;
    }
    if (!purchasedAt) {
      toast.error("Please select a purchase date.");
      return;
    }

    mutate({
      supplier_name: supplierName || undefined,
      bill_no: billNo || undefined,
      purchased_at: purchasedAt,
      payment_mode: paymentMode,
      remarks: remarks || undefined,
      lines: validLines.map((l) => ({
        inventory_item_id: parseInt(l.inventory_item_id),
        quantity: parseFloat(l.quantity),
        unit_cost: parseFloat(l.unit_cost) || 0,
      })),
    });
  };

  const getItemById = (id: string) => itemOptions.find((i: any) => String(i.id) === id);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="size-5 text-primary" />
            Record Purchase
          </DialogTitle>
          <DialogDescription>
            Market se kharida hua saman record karein — stock automatically update hoga
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Header fields */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplier-name">Supplier / Shop Name</Label>
              <Input
                id="supplier-name"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                placeholder="e.g. Ram Kirana Store"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bill-no">Bill / Invoice No.</Label>
              <Input
                id="bill-no"
                value={billNo}
                onChange={(e) => setBillNo(e.target.value)}
                placeholder="e.g. INV-001"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="purchased-at">Purchase Date <span className="text-destructive">*</span></Label>
              <Input
                id="purchased-at"
                type="date"
                value={purchasedAt}
                onChange={(e) => setPurchasedAt(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment-mode">Payment Mode</Label>
              <Select value={paymentMode} onValueChange={setPaymentMode}>
                <SelectTrigger id="payment-mode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAYMENT_MODES.map((m) => (
                    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-semibold flex items-center gap-1.5">
                <Package className="size-4 text-primary" />
                Items Purchased
              </Label>
              <Button type="button" variant="outline" size="sm" onClick={addLine} className="h-7 text-xs gap-1">
                <Plus className="size-3" /> Add Item
              </Button>
            </div>

            <div className="rounded-lg border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-3 py-2 font-medium text-xs w-2/5">Item <span className="text-destructive">*</span></th>
                    <th className="text-left px-3 py-2 font-medium text-xs w-1/5">Quantity <span className="text-destructive">*</span></th>
                    <th className="text-left px-3 py-2 font-medium text-xs w-1/5">Unit Cost (₹)</th>
                    <th className="text-right px-3 py-2 font-medium text-xs w-1/5">Amount</th>
                    <th className="w-8" />
                  </tr>
                </thead>
                <tbody>
                  {lines.map((line, i) => {
                    const qty = parseFloat(line.quantity) || 0;
                    const cost = parseFloat(line.unit_cost) || 0;
                    const amount = qty * cost;
                    const item = getItemById(line.inventory_item_id);
                    return (
                      <tr key={i} className="border-t">
                        <td className="px-2 py-1.5">
                          <select
                            className="w-full rounded-md border border-input bg-background px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-ring"
                            value={line.inventory_item_id}
                            onChange={(e) => updateLine(i, "inventory_item_id", e.target.value)}
                            required
                          >
                            <option value="">— Select item —</option>
                            {itemOptions.map((item: any) => (
                              <option key={item.id} value={String(item.id)}>
                                {item.name}{item.code ? ` (${item.code})` : ""}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-2 py-1.5">
                          <div className="flex items-center gap-1">
                            <Input
                              type="number"
                              min="0.001"
                              step="0.001"
                              className="h-8 text-xs"
                              value={line.quantity}
                              onChange={(e) => updateLine(i, "quantity", e.target.value)}
                              placeholder="0"
                              required
                            />
                            {item?.unit && <span className="text-[10px] text-muted-foreground whitespace-nowrap">{item.unit}</span>}
                          </div>
                        </td>
                        <td className="px-2 py-1.5">
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            className="h-8 text-xs"
                            value={line.unit_cost}
                            onChange={(e) => updateLine(i, "unit_cost", e.target.value)}
                            placeholder="0.00"
                          />
                        </td>
                        <td className="px-3 py-1.5 text-right font-mono text-sm font-medium">
                          {amount > 0 ? `₹${amount.toFixed(2)}` : "—"}
                        </td>
                        <td className="px-2 py-1.5">
                          {lines.length > 1 && (
                            <Button type="button" size="icon-sm" variant="ghost" onClick={() => removeLine(i)}
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive size-6">
                              <Trash2 className="size-3" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="border-t-2 bg-muted/30">
                  <tr>
                    <td colSpan={3} className="px-3 py-2 text-right text-sm font-semibold text-muted-foreground">Total Cost</td>
                    <td className="px-3 py-2 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      {totalCost > 0 ? (
                        <span className="flex items-center justify-end gap-0.5">
                          <IndianRupee className="size-3.5" />
                          {totalCost.toFixed(2)}
                        </span>
                      ) : "—"}
                    </td>
                    <td />
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Remarks */}
          <div className="space-y-2">
            <Label htmlFor="purchase-remarks">Remarks</Label>
            <Textarea
              id="purchase-remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Any notes about this purchase..."
              rows={2}
            />
          </div>

          {/* Expense notice */}
          {totalCost > 0 && (
            <div className="rounded-md bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 px-3 py-2 text-xs text-indigo-700 dark:text-indigo-300 flex items-center gap-2">
              <IndianRupee className="size-3.5 shrink-0" />
              An expense entry of <strong>₹{totalCost.toFixed(2)}</strong> will be auto-created in Accounts under "Inventory Purchases"
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Record Purchase"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
