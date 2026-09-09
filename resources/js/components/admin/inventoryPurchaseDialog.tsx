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
import { SearchableSelectField } from "@/components/searchableSelectInput";
import { ShoppingCart, Plus, Trash2, IndianRupee, Package, Layers } from "lucide-react";
import { toast } from "sonner";

interface PurchaseLine {
  id?: number;
  category_id?: string;
  inventory_item_id: string;
  quantity: string;
  unit_cost: string;
}

interface InventoryPurchaseDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  purchase?: any | null;
}

const PAYMENT_MODES = [
  { key: "cash", value: "cash", text: "Cash" },
  { key: "upi", value: "upi", text: "UPI" },
  { key: "bank", value: "bank", text: "Bank Transfer" },
  { key: "cheque", value: "cheque", text: "Cheque" },
];

const emptyLine = (): PurchaseLine => ({
  category_id: "",
  inventory_item_id: "",
  quantity: "",
  unit_cost: "",
});

export function InventoryPurchaseDialog({ open, onClose, onSuccess, purchase }: InventoryPurchaseDialogProps) {
  const today = new Date().toISOString().split("T")[0];
  const isEdit = Boolean(purchase?.id);

  const [supplierName, setSupplierName] = useState("");
  const [billNo, setBillNo] = useState("");
  const [purchasedAt, setPurchasedAt] = useState(today);
  const [paymentMode, setPaymentMode] = useState("cash");
  const [remarks, setRemarks] = useState("");
  const [lines, setLines] = useState<PurchaseLine[]>([emptyLine()]);

  // Load items
  const { data: itemsData } = useQuery({
    queryKey: ["inventory-items-all"],
    queryFn: () => inventoryApi.items.index({ per_page: 500 }),
    enabled: open,
  });

  // Load categories
  const { data: categoriesData } = useQuery({
    queryKey: ["inventory-categories-all"],
    queryFn: () => inventoryApi.categories.index({ per_page: 500 }),
    enabled: open,
  });

  const categories = useMemo(() => {
    const raw = (categoriesData as any)?.data?.data ?? (categoriesData as any)?.data ?? categoriesData ?? [];
    return Array.isArray(raw) ? raw : [];
  }, [categoriesData]);

  const categorySelectOptions = useMemo(() => {
    return [
      { key: "all", value: "", text: "All Categories" },
      ...categories.map((c: any) => ({
        key: String(c.id),
        value: String(c.id),
        text: c.name + (c.code ? ` (${c.code})` : ""),
      })),
    ];
  }, [categories]);

  const itemOptions = useMemo(() => {
    const raw = (itemsData as any)?.data?.data ?? (itemsData as any)?.data ?? itemsData ?? [];
    return Array.isArray(raw) ? raw : [];
  }, [itemsData]);

  // Sync purchase data on open / edit change
  React.useEffect(() => {
    if (!open) return;

    if (purchase) {
      setSupplierName(purchase.supplier_name || "");
      setBillNo(purchase.bill_no || "");
      setPurchasedAt(purchase.purchased_at ? String(purchase.purchased_at).slice(0, 10) : today);
      setPaymentMode(purchase.payment_mode || "cash");
      setRemarks(purchase.remarks || "");

      if (purchase.lines && purchase.lines.length > 0) {
        setLines(
          purchase.lines.map((l: any) => ({
            id: l.id,
            category_id: String(l.item?.inventory_category_id || l.category_id || ""),
            inventory_item_id: String(l.inventory_item_id),
            quantity: String(l.quantity),
            unit_cost: String(l.unit_cost ?? ""),
          }))
        );
      } else {
        setLines([emptyLine()]);
      }
    } else {
      handleReset();
    }
  }, [open, purchase]);

  // Auto-fill category_id for lines once items are loaded
  React.useEffect(() => {
    if (!open || itemOptions.length === 0) return;
    setLines((prev) =>
      prev.map((l) => {
        if (!l.category_id && l.inventory_item_id) {
          const item = itemOptions.find((it: any) => String(it.id) === String(l.inventory_item_id));
          if (item?.inventory_category_id) {
            return { ...l, category_id: String(item.inventory_category_id) };
          }
        }
        return l;
      })
    );
  }, [open, itemOptions]);

  const getItemOptionsForLine = (catId?: string) => {
    const filtered = catId
      ? itemOptions.filter((it: any) => String(it.inventory_category_id) === String(catId))
      : itemOptions;
    return filtered.map((item: any) => ({
      key: String(item.id),
      value: String(item.id),
      text: `${item.name}${item.code ? ` (${item.code})` : ""}${item.unit ? ` [${item.unit}]` : ""}`,
    }));
  };

  const totalCost = useMemo(() => {
    return lines.reduce((sum, l) => {
      const qty = parseFloat(l.quantity) || 0;
      const cost = parseFloat(l.unit_cost) || 0;
      return sum + qty * cost;
    }, 0);
  }, [lines]);

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      isEdit && purchase?.id
        ? inventoryApi.purchases.update(purchase.id, payload)
        : inventoryApi.purchases.store(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-purchases"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      toast.success(isEdit ? "Purchase updated successfully!" : "Purchase recorded! Stock has been updated.");
      handleReset();
      onSuccess?.();
      onClose();
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? (isEdit ? "Failed to update purchase." : "Failed to record purchase.");
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
    setLines((prev) => (prev.length > 1 ? prev.filter((_, idx) => idx !== i) : prev));

  const updateLine = (i: number, field: keyof PurchaseLine, value: string) =>
    setLines((prev) => prev.map((l, idx) => (idx === i ? { ...l, [field]: value } : l)));

  const handleCategoryChange = (i: number, newCatId: string) => {
    setLines((prev) =>
      prev.map((l, idx) => {
        if (idx !== i) return l;
        const currentItem = itemOptions.find((it: any) => String(it.id) === l.inventory_item_id);
        const itemBelongsToNewCat =
          !newCatId || (currentItem && String(currentItem.inventory_category_id) === String(newCatId));
        return {
          ...l,
          category_id: newCatId,
          inventory_item_id: itemBelongsToNewCat ? l.inventory_item_id : "",
          unit_cost: itemBelongsToNewCat ? l.unit_cost : "",
        };
      })
    );
  };

  const handleItemChange = (i: number, newItemId: string) => {
    const item = itemOptions.find((it: any) => String(it.id) === String(newItemId));
    setLines((prev) =>
      prev.map((l, idx) => {
        if (idx !== i) return l;
        return {
          ...l,
          inventory_item_id: newItemId,
          category_id: l.category_id || (item?.inventory_category_id ? String(item.inventory_category_id) : ""),
          unit_cost: l.unit_cost || (item?.purchase_price ? String(item.purchase_price) : ""),
        };
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
        id: l.id,
        inventory_item_id: parseInt(l.inventory_item_id),
        quantity: parseFloat(l.quantity),
        unit_cost: parseFloat(l.unit_cost) || 0,
      })),
    });
  };

  const getItemById = (id: string) => itemOptions.find((i: any) => String(i.id) === id);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-[800px] md:max-w-[860px] max-w-[96vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="size-5 text-primary" />
            {isEdit ? "Edit Purchase" : "Record Purchase"}
          </DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Kharide hue saman ka record update karein — stock aur expenses automatically sync honge"
              : "Market se kharida hua saman record karein — stock automatically update hoga"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Header fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
              <SearchableSelectField
                value={paymentMode}
                onChange={(val) => setPaymentMode(val || "cash")}
                options={PAYMENT_MODES}
                placeholder="Select payment mode"
                searchPlaceholder="Search mode..."
              />
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

            <div className="rounded-lg border overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left px-3 py-2 font-medium text-xs w-[26%]">
                      <span className="flex items-center gap-1">
                        <Layers className="size-3 text-muted-foreground" /> Category
                      </span>
                    </th>
                    <th className="text-left px-3 py-2 font-medium text-xs w-[32%]">
                      Item <span className="text-destructive">*</span>
                    </th>
                    <th className="text-left px-3 py-2 font-medium text-xs w-[17%]">
                      Quantity <span className="text-destructive">*</span>
                    </th>
                    <th className="text-left px-3 py-2 font-medium text-xs w-[14%]">
                      Unit Cost (₹)
                    </th>
                    <th className="text-right px-3 py-2 font-medium text-xs w-[11%]">
                      Amount
                    </th>
                    <th className="w-8 px-1" />
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
                        <td className="px-2 py-1.5 align-middle">
                          <SearchableSelectField
                            value={line.category_id || ""}
                            onChange={(val) => handleCategoryChange(i, String(val ?? ""))}
                            options={categorySelectOptions}
                            placeholder="All Categories"
                            searchPlaceholder="Search category..."
                            className="h-8 text-xs"
                          />
                        </td>
                        <td className="px-2 py-1.5 align-middle">
                          <SearchableSelectField
                            value={line.inventory_item_id}
                            onChange={(val) => handleItemChange(i, String(val ?? ""))}
                            options={getItemOptionsForLine(line.category_id)}
                            placeholder="Select item..."
                            searchPlaceholder="Search item name / code..."
                            className="h-8 text-xs"
                            emptyText={line.category_id ? "No items in category" : "No items found"}
                          />
                        </td>
                        <td className="px-2 py-1.5 align-middle">
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
                            {item?.unit && (
                              <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                {item.unit}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-2 py-1.5 align-middle">
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
                        <td className="px-3 py-1.5 text-right font-mono text-xs font-semibold align-middle whitespace-nowrap">
                          {amount > 0 ? `₹${amount.toFixed(2)}` : "—"}
                        </td>
                        <td className="px-1 py-1.5 align-middle text-center">
                          {lines.length > 1 && (
                            <Button
                              type="button"
                              size="icon-sm"
                              variant="ghost"
                              onClick={() => removeLine(i)}
                              className="text-destructive hover:bg-destructive/10 hover:text-destructive size-6"
                            >
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
                    <td colSpan={4} className="px-3 py-2 text-right text-sm font-semibold text-muted-foreground">
                      Total Cost
                    </td>
                    <td className="px-3 py-2 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      {totalCost > 0 ? (
                        <span className="flex items-center justify-end gap-0.5 font-mono text-sm">
                          <IndianRupee className="size-3.5" />
                          {totalCost.toFixed(2)}
                        </span>
                      ) : (
                        "—"
                      )}
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
              {isEdit ? (
                <span>Linked expense entry will be automatically updated to <strong>₹{totalCost.toFixed(2)}</strong></span>
              ) : (
                <span>An expense entry of <strong>₹{totalCost.toFixed(2)}</strong> will be auto-created in Accounts under "Inventory Purchases"</span>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? isEdit ? "Updating..." : "Saving..."
                : isEdit ? "Update Purchase" : "Record Purchase"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
