import React, { useState, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query.client";
import inventoryApi from "@/lib/api/inventoryApi";
import inventoryVendorApi, { type InventoryVendor } from "@/lib/api/inventoryVendorApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import { SearchableSelectField } from "@/components/searchableSelectInput";
import {
  ShoppingCart,
  Plus,
  Trash2,
  IndianRupee,
  Package,
  Layers,
  Building2,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
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
  { key: "cash", value: "cash", text: "💵 Cash" },
  { key: "upi", value: "upi", text: "📱 UPI / Online" },
  { key: "bank", value: "bank", text: "🏦 Bank Transfer" },
  { key: "cheque", value: "cheque", text: "🧾 Cheque" },
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

  const [vendorId, setVendorId] = useState<string>("");
  const [supplierName, setSupplierName] = useState("");
  const [billNo, setBillNo] = useState("");
  const [purchasedAt, setPurchasedAt] = useState(today);
  const [paymentMode, setPaymentMode] = useState("cash");
  const [paymentStatus, setPaymentStatus] = useState<"paid" | "credit">("paid");
  const [remarks, setRemarks] = useState("");
  const [lines, setLines] = useState<PurchaseLine[]>([emptyLine()]);

  // Load registered vendors
  const { data: vendorsData } = useQuery({
    queryKey: ["inventory-vendors-active"],
    queryFn: () => inventoryVendorApi.index({ is_active: true, per_page: 200 }),
    enabled: open,
  });

  const vendors: InventoryVendor[] = useMemo(() => {
    const raw = vendorsData?.data;
    if (Array.isArray(raw?.data)) return raw.data;
    if (Array.isArray(raw)) return raw;
    return [];
  }, [vendorsData]);

  const selectedVendorObj = useMemo(() => {
    if (!vendorId || vendorId === "manual") return null;
    return vendors.find((v) => String(v.id) === String(vendorId)) || null;
  }, [vendorId, vendors]);

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
      setVendorId(purchase.inventory_vendor_id ? String(purchase.inventory_vendor_id) : "");
      setSupplierName(purchase.supplier_name || "");
      setBillNo(purchase.bill_no || "");
      setPurchasedAt(purchase.purchased_at ? String(purchase.purchased_at).slice(0, 10) : today);
      setPaymentMode(purchase.payment_mode || "cash");
      setPaymentStatus(purchase.payment_status === "credit" ? "credit" : "paid");
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

  const handleReset = () => {
    setVendorId("");
    setSupplierName("");
    setBillNo("");
    setPurchasedAt(today);
    setPaymentMode("cash");
    setPaymentStatus("paid");
    setRemarks("");
    setLines([emptyLine()]);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: any) => {
      return isEdit
        ? inventoryApi.purchases.update(purchase.id, payload)
        : inventoryApi.purchases.store(payload);
    },
    onSuccess: () => {
      toast.success(isEdit ? "Purchase updated successfully" : "Purchase recorded successfully");
      queryClient.invalidateQueries({ queryKey: ["inventory-purchases"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-vendors"] });
      handleReset();
      onSuccess?.();
      onClose();
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || err?.message || "Failed to save purchase";
      toast.error(msg);
    },
  });

  const totalCost = useMemo(() => {
    return lines.reduce((sum, line) => {
      const qty = parseFloat(line.quantity) || 0;
      const cost = parseFloat(line.unit_cost) || 0;
      return sum + qty * cost;
    }, 0);
  }, [lines]);

  const addLine = () => {
    setLines((prev) => [...prev, emptyLine()]);
  };

  const removeLine = (index: number) => {
    if (lines.length === 1) return;
    setLines((prev) => prev.filter((_, i) => i !== index));
  };

  const updateLine = (index: number, field: keyof PurchaseLine, value: string) => {
    setLines((prev) =>
      prev.map((l, i) => (i === index ? { ...l, [field]: value } : l))
    );
  };

  const getItemOptionsForLine = (catId?: string) => {
    const filtered = catId
      ? itemOptions.filter((it: any) => String(it.inventory_category_id) === String(catId))
      : itemOptions;
    return filtered.map((it: any) => ({
      key: String(it.id),
      value: String(it.id),
      text: it.name + (it.code ? ` (${it.code})` : "") + (it.unit ? ` [${it.unit}]` : ""),
    }));
  };

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

    const payload: any = {
      inventory_vendor_id: vendorId && vendorId !== "manual" ? parseInt(vendorId) : undefined,
      supplier_name: selectedVendorObj ? selectedVendorObj.name : supplierName || undefined,
      bill_no: billNo || undefined,
      purchased_at: purchasedAt,
      payment_mode: paymentStatus === "credit" ? "credit" : paymentMode,
      payment_status: paymentStatus,
      remarks: remarks || undefined,
      lines: validLines.map((l) => ({
        id: l.id,
        inventory_item_id: parseInt(l.inventory_item_id),
        quantity: parseFloat(l.quantity),
        unit_cost: parseFloat(l.unit_cost) || 0,
      })),
    };

    mutate(payload);
  };

  const getItemById = (id: string) => itemOptions.find((i: any) => String(i.id) === id);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="w-[95vw] sm:max-w-[850px] md:max-w-[900px] max-h-[85vh] flex flex-col p-0 overflow-hidden">
        {/* Fixed Header */}
        <DialogHeader className="p-4 sm:p-5 pb-3 border-b shrink-0 bg-background">
          <DialogTitle className="flex items-center gap-2 text-base">
            <ShoppingCart className="size-5 text-primary" />
            <span>{isEdit ? "Edit Purchase" : "Record Inventory Purchase"}</span>
          </DialogTitle>
          <DialogDescription className="text-xs">
            {isEdit
              ? "Update purchase record — stock quantities and supplier ledgers will sync automatically."
              : "Record stock purchases from registered suppliers or local market. Supports immediate and credit payment terms."}
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden min-h-0">
          <div className="overflow-y-auto px-4 sm:px-6 py-4 space-y-4 flex-1">
            {/* ─── Supplier & Payment Terms Card ─────────────────────────── */}
            <div className="rounded-xl border border-border/80 p-4 bg-muted/20 space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="size-3.5 text-primary" /> Supplier & Payment Terms
                </span>
                {paymentStatus === "credit" && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/50 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900">
                    <Clock className="size-3" /> Credit Purchase (Pay Later)
                  </span>
                )}
              </div>

              {/* Supplier Selection */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="inventory_vendor_id" className="text-xs font-semibold">
                    Select Supplier / Vendor
                  </Label>
                  <a
                    href="/inventory/vendors"
                    target="_blank"
                    className="text-[11px] text-primary hover:underline flex items-center gap-0.5"
                  >
                    <span>+ Manage Suppliers</span>
                    <ExternalLink className="size-2.5" />
                  </a>
                </div>

                <Select
                  value={vendorId ? String(vendorId) : "manual"}
                  onValueChange={(val) => {
                    if (val === "manual") {
                      setVendorId("");
                    } else {
                      setVendorId(val);
                      const selectedV = vendors.find((v) => String(v.id) === String(val));
                      if (selectedV) {
                        setSupplierName(selectedV.name);
                      }
                    }
                  }}
                >
                  <SelectTrigger id="inventory_vendor_id" className="w-full bg-background">
                    <SelectValue placeholder="Choose a registered supplier..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">✍️ Other / Unregistered Supplier</SelectItem>
                    {vendors.map((v) => (
                      <SelectItem key={v.id} value={String(v.id)}>
                        {v.name} {v.city ? `(${v.city})` : ""} {Number(v.outstanding_balance) > 0 ? `• Due: ₹${Number(v.outstanding_balance).toLocaleString("en-IN")}` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Selected Supplier Card OR Manual Input */}
              {selectedVendorObj ? (
                <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 rounded-lg bg-background border border-border/80 text-xs">
                  <div className="flex items-center gap-2">
                    <Building2 className="size-4 text-primary shrink-0" />
                    <div>
                      <span className="font-semibold text-foreground">{selectedVendorObj.name}</span>
                      <span className="text-muted-foreground ml-1.5">
                        {selectedVendorObj.city ? `(${selectedVendorObj.city})` : ""}
                        {selectedVendorObj.contact_phone ? ` • Ph: ${selectedVendorObj.contact_phone}` : ""}
                      </span>
                    </div>
                  </div>
                  <div>
                    {Number(selectedVendorObj.outstanding_balance) > 0 ? (
                      <Badge variant="outline" className="border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-[11px] font-bold">
                        Current Due: ₹{Number(selectedVendorObj.outstanding_balance).toLocaleString("en-IN")}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="border-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-[11px]">
                        Nil Due (₹0)
                      </Badge>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-1">
                  <Label htmlFor="supplier-name" className="text-xs font-semibold">
                    Supplier / Shop Name
                  </Label>
                  <Input
                    id="supplier-name"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    placeholder="e.g. Ram Kirana & General Store"
                    className="bg-background"
                  />
                </div>
              )}

              {/* Payment Terms Segmented Toggle */}
              <div className="space-y-2 pt-1">
                <Label className="text-xs font-semibold">Payment Terms</Label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-muted/60 rounded-xl border border-border/70">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentStatus("paid");
                      if (paymentMode === "credit") setPaymentMode("cash");
                    }}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      paymentStatus !== "credit"
                        ? "bg-background text-foreground shadow-xs border border-border/80"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <CheckCircle2 className={`size-4 ${paymentStatus !== "credit" ? "text-emerald-600" : ""}`} />
                    <span>Paid Immediately</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setPaymentStatus("credit");
                      setPaymentMode("credit");
                    }}
                    className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      paymentStatus === "credit"
                        ? "bg-amber-500 text-white shadow-xs font-bold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Clock className="size-4" />
                    <span>Credit Purchase (Pay Later)</span>
                  </button>
                </div>
              </div>

              {/* Dynamic Payment Details Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                <div className="space-y-1">
                  <Label htmlFor="bill-no" className="text-xs font-semibold">Bill / Invoice No.</Label>
                  <Input
                    id="bill-no"
                    value={billNo}
                    onChange={(e) => setBillNo(e.target.value)}
                    placeholder="e.g. INV-2026-081"
                    className="bg-background"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="purchased-at" className="text-xs font-semibold">
                    Purchase Date <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="purchased-at"
                    type="date"
                    value={purchasedAt}
                    onChange={(e) => setPurchasedAt(e.target.value)}
                    className="bg-background"
                    required
                  />
                </div>

                {paymentStatus === "paid" ? (
                  <div className="space-y-1">
                    <Label htmlFor="payment-mode" className="text-xs font-semibold">Payment Mode</Label>
                    <SearchableSelectField
                      value={paymentMode}
                      onChange={(val) => setPaymentMode(val || "cash")}
                      options={PAYMENT_MODES}
                      placeholder="Select payment mode"
                      searchPlaceholder="Search mode..."
                      className="bg-background"
                    />
                  </div>
                ) : (
                  <div className="space-y-1 sm:col-span-1 flex flex-col justify-end">
                    <Badge variant="outline" className="border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 py-2 justify-center text-xs">
                      Ledger Udhaar Bill
                    </Badge>
                  </div>
                )}
              </div>

              {paymentStatus === "credit" && (
                <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 p-2.5 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                  <AlertCircle className="size-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                  <span>
                    This purchase bill of <strong>₹{totalCost.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong> will be recorded under <strong>{selectedVendorObj?.name || supplierName || "the supplier"}</strong> as an unsettled credit balance. You can record payments later under <strong>Inventory → Suppliers → Settlements</strong>.
                  </span>
                </div>
              )}
            </div>

            {/* ─── Line Items Table ─────────────────────────────────────── */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold flex items-center gap-1.5 uppercase tracking-wider">
                  <Package className="size-3.5 text-primary" /> Items Purchased
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
                      <td colSpan={4} className="px-3 py-2 text-right text-xs font-semibold text-muted-foreground">
                        Total Cost
                      </td>
                      <td className="px-3 py-2 text-right font-bold text-emerald-600 dark:text-emerald-400">
                        {totalCost > 0 ? (
                          <span className="flex items-center justify-end gap-0.5 font-mono text-sm">
                            <IndianRupee className="size-3.5" />
                            {totalCost.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
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
            <div className="space-y-1">
              <Label htmlFor="purchase-remarks" className="text-xs font-semibold">Remarks / Notes</Label>
              <Textarea
                id="purchase-remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Any special remarks or delivery instructions..."
                rows={2}
              />
            </div>
          </div>

          {/* Fixed Sticky Footer */}
          <DialogFooter className="p-3 sm:p-4 border-t shrink-0 bg-muted/20 flex flex-row items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground">Total:</span>
              <span className="font-mono text-sm font-bold text-foreground">
                ₹{totalCost.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button type="button" variant="outline" size="sm" onClick={handleClose} disabled={isPending}>
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={isPending} className="bg-emerald-600 hover:bg-emerald-700 text-white">
                {isPending
                  ? isEdit ? "Updating..." : "Saving..."
                  : isEdit ? "Update Purchase" : "Save Purchase"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
