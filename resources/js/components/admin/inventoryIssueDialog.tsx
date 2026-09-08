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
import { LogOut, User, Package, Layers, Building2, Clock, IndianRupee } from "lucide-react";
import { toast } from "sonner";
import StaffApi from "@/lib/api/staffApi";

interface InventoryIssueDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const DEPARTMENTS = [
  "Sports",
  "Mess / Canteen",
  "Laboratory",
  "Library",
  "Administration",
  "Housekeeping",
  "Security",
  "Medical",
  "Academic / Classroom",
  "Other",
];

export function InventoryIssueDialog({ open, onClose, onSuccess }: InventoryIssueDialogProps) {
  const today = new Date().toISOString().split("T")[0];

  const [categoryId, setCategoryId] = useState("");
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [issuedToUserId, setIssuedToUserId] = useState("");
  const [issuedToName, setIssuedToName] = useState("");
  const [department, setDepartment] = useState("");
  const [purpose, setPurpose] = useState("");
  const [issuedAt, setIssuedAt] = useState(today);
  const [remarks, setRemarks] = useState("");

  // Load inventory items
  const { data: itemsData } = useQuery({
    queryKey: ["inventory-items-all"],
    queryFn: () => inventoryApi.items.index({ per_page: 500 }),
    enabled: open,
  });

  // Load inventory categories
  const { data: categoriesData } = useQuery({
    queryKey: ["inventory-categories-all"],
    queryFn: () => inventoryApi.categories.index({ per_page: 500 }),
    enabled: open,
  });

  // Load staff users safely via StaffApi
  const { data: usersData } = useQuery({
    queryKey: ["staff-users-list"],
    queryFn: () => StaffApi.listStaff({ per_page: 200 }),
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

  const staffOptions = useMemo(() => {
    const raw = (usersData as any)?.data?.data ?? (usersData as any)?.data ?? usersData ?? [];
    return Array.isArray(raw) ? raw : [];
  }, [usersData]);

  const selectedItem = useMemo(
    () => itemOptions.find((i: any) => String(i.id) === itemId),
    [itemOptions, itemId]
  );

  // Load active batches for selected item (for FIFO preview)
  const { data: batchesData } = useQuery({
    queryKey: ["inventory-item-batches", itemId],
    queryFn: () => inventoryApi.items.batches(itemId),
    enabled: open && !!itemId,
  });

  const activeBatches = useMemo(() => {
    const raw = (batchesData as any)?.data?.data ?? (batchesData as any)?.data ?? batchesData ?? [];
    return Array.isArray(raw) ? raw : [];
  }, [batchesData]);

  const fifoBreakdown = useMemo(() => {
    const qty = parseFloat(quantity) || 0;
    if (qty <= 0 || activeBatches.length === 0) return null;

    let remaining = qty;
    let totalCost = 0;
    const consumed: { batchNo: string; date?: string; unitCost: number; qty: number; amount: number; supplier?: string }[] = [];

    for (const b of activeBatches) {
      if (remaining <= 0) break;
      const avail = parseFloat(b.remaining_quantity) || 0;
      if (avail <= 0) continue;

      const take = Math.min(avail, remaining);
      const cost = parseFloat(b.unit_cost) || 0;
      const amount = take * cost;
      totalCost += amount;

      consumed.push({
        batchNo: b.batch_no,
        date: b.received_at,
        unitCost: cost,
        qty: take,
        amount,
        supplier: b.supplier_name,
      });

      remaining -= take;
    }

    return {
      consumed,
      totalCost,
      averageRate: qty > 0 ? totalCost / qty : 0,
      uncoveredQty: remaining > 0 ? remaining : 0,
    };
  }, [quantity, activeBatches]);

  const filteredItemOptions = useMemo(() => {
    const filtered = categoryId
      ? itemOptions.filter((i: any) => String(i.inventory_category_id) === String(categoryId))
      : itemOptions;
    return filtered.map((item: any) => ({
      key: String(item.id),
      value: String(item.id),
      text: `${item.name}${item.code ? ` (${item.code})` : ""} — Stock: ${Number(item.current_quantity).toFixed(2)} ${item.unit ?? ""}`,
    }));
  }, [itemOptions, categoryId]);

  const staffSelectOptions = useMemo(() => {
    return [
      { key: "none", value: "", text: "— None / Enter Manual Name —" },
      ...staffOptions.map((u: any) => ({
        key: String(u.id),
        value: String(u.id),
        text: `${u.name}${u.employee_id ? ` (${u.employee_id})` : ""}${u.phone ? ` • ${u.phone}` : ""}`,
      })),
    ];
  }, [staffOptions]);

  const departmentSelectOptions = useMemo(() => {
    return [
      { key: "none", value: "", text: "— Select Department (Optional) —" },
      ...DEPARTMENTS.map((d) => ({
        key: d,
        value: d,
        text: d,
      })),
    ];
  }, []);

  const handleCategoryChange = (newCatId: string) => {
    setCategoryId(newCatId);
    if (newCatId && selectedItem && String(selectedItem.inventory_category_id) !== String(newCatId)) {
      setItemId("");
    }
  };

  const handleItemChange = (newItemId: string) => {
    setItemId(newItemId);
    const item = itemOptions.find((i: any) => String(i.id) === String(newItemId));
    if (item?.inventory_category_id && !categoryId) {
      setCategoryId(String(item.inventory_category_id));
    }
  };

  const { mutate, isPending } = useMutation({
    mutationFn: (payload: Record<string, unknown>) => inventoryApi.issues.store(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-issues"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      handleReset();
      onSuccess?.();
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message ?? "Failed to issue item.";
      toast.error(msg);
    },
  });

  const handleReset = () => {
    setCategoryId("");
    setItemId("");
    setQuantity("");
    setIssuedToUserId("");
    setIssuedToName("");
    setDepartment("");
    setPurpose("");
    setIssuedAt(today);
    setRemarks("");
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!itemId) {
      toast.error("Please select an item.");
      return;
    }
    const qty = parseFloat(quantity);
    if (!qty || qty <= 0) {
      toast.error("Please enter a valid quantity.");
      return;
    }
    if (!issuedToUserId && !issuedToName.trim()) {
      toast.error("Please select a staff member or enter a recipient name.");
      return;
    }
    if (!issuedAt) {
      toast.error("Please select an issue date.");
      return;
    }

    // Stock check
    const currentStock = Number(selectedItem?.current_quantity ?? 0);
    if (qty > currentStock) {
      toast.error(`Insufficient stock. Available: ${currentStock}, Requested: ${qty}`);
      return;
    }

    mutate({
      inventory_item_id: parseInt(itemId),
      quantity: qty,
      issued_to_user_id: issuedToUserId ? parseInt(issuedToUserId) : undefined,
      issued_to_name: issuedToName.trim() || undefined,
      department: department || undefined,
      purpose: purpose.trim() || undefined,
      issued_at: issuedAt,
      remarks: remarks.trim() || undefined,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent className="sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <LogOut className="size-5 text-primary" />
            Issue / Dispatch Item
          </DialogTitle>
          <DialogDescription>
            Staff ko diya gaya saman record karein — stock automatically decrease hoga
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Category selection */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <Layers className="size-3.5 text-muted-foreground" />
              Category
            </Label>
            <SearchableSelectField
              value={categoryId}
              onChange={(val) => handleCategoryChange(String(val ?? ""))}
              options={categorySelectOptions}
              placeholder="All Categories"
              searchPlaceholder="Search category..."
            />
          </div>

          {/* Item select */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <Package className="size-3.5 text-primary" />
              Item <span className="text-destructive">*</span>
            </Label>
            <SearchableSelectField
              value={itemId}
              onChange={(val) => handleItemChange(String(val ?? ""))}
              options={filteredItemOptions}
              placeholder="— Select item —"
              searchPlaceholder="Search item name or code..."
              emptyText={categoryId ? "No items in selected category" : "No items found"}
            />
            {selectedItem && (
              <div className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-md bg-muted/50 border">
                <span className="text-muted-foreground">
                  Category: <strong className="text-foreground">{selectedItem.category?.name || "Uncategorized"}</strong>
                </span>
                <span>
                  Available Stock:{" "}
                  <strong className={Number(selectedItem.current_quantity) <= 0 ? "text-destructive" : "text-emerald-600 dark:text-emerald-400"}>
                    {Number(selectedItem.current_quantity).toFixed(3)} {selectedItem.unit ?? ""}
                  </strong>
                </span>
              </div>
            )}
          </div>

          {/* Quantity */}
          <div className="space-y-1.5">
            <Label htmlFor="issue-qty" className="text-xs font-semibold">
              Quantity <span className="text-destructive">*</span>
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="issue-qty"
                type="number"
                step="0.001"
                min="0.001"
                max={selectedItem ? Number(selectedItem.current_quantity) : undefined}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
                required
                className="h-9"
              />
              {selectedItem?.unit && (
                <span className="text-xs font-medium text-muted-foreground px-2 py-1.5 bg-muted rounded-md border whitespace-nowrap">
                  {selectedItem.unit}
                </span>
              )}
            </div>
          </div>

          {/* Active Batches & FIFO Cost Preview */}
          {selectedItem && (
            <div className="rounded-lg border bg-muted/30 p-3 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold flex items-center gap-1 text-muted-foreground">
                  <Clock className="size-3.5 text-primary" />
                  Available FIFO Stock Batches:
                </span>
                <span className="text-[11px] text-muted-foreground font-mono">
                  {activeBatches.length} batch{activeBatches.length !== 1 ? "es" : ""}
                </span>
              </div>

              {activeBatches.length > 0 ? (
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {activeBatches.map((b: any, idx: number) => (
                    <span
                      key={b.id ?? idx}
                      className="inline-flex items-center gap-1 text-[11px] bg-background border px-2 py-0.5 rounded font-mono"
                    >
                      <span className="font-medium text-foreground">{Number(b.remaining_quantity).toFixed(2)} {selectedItem.unit ?? ""}</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold">@ ₹{Number(b.unit_cost).toFixed(2)}</span>
                      {b.received_at && (
                        <span className="text-[10px] text-muted-foreground">
                          ({new Date(b.received_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })})
                        </span>
                      )}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground italic">No batch history recorded yet for this item.</p>
              )}

              {fifoBreakdown && (
                <div className="mt-2 pt-2 border-t space-y-1.5 bg-background/80 -mx-3 -mb-3 p-3 rounded-b-lg">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-foreground flex items-center gap-1">
                      <Layers className="size-3.5 text-emerald-600" />
                      FIFO Deduction Breakdown:
                    </span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono text-sm flex items-center gap-0.5">
                      <IndianRupee className="size-3.5" />
                      {fifoBreakdown.totalCost.toFixed(2)}
                    </span>
                  </div>

                  <div className="space-y-1">
                    {fifoBreakdown.consumed.map((c, idx) => (
                      <div key={idx} className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
                        <span>
                          • {c.qty.toFixed(2)} {selectedItem.unit ?? ""} from <strong>{c.batchNo}</strong> @ ₹{c.unitCost.toFixed(2)}
                        </span>
                        <span className="font-semibold text-foreground">₹{c.amount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t text-[11px] text-muted-foreground">
                    <span>Average Cost Rate:</span>
                    <strong className="text-foreground font-mono">₹{fifoBreakdown.averageRate.toFixed(2)} / {selectedItem.unit ?? "unit"}</strong>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Issued To */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold flex items-center gap-1.5">
              <User className="size-3.5 text-primary" />
              Issued To (Staff) <span className="text-destructive">*</span>
            </Label>
            <SearchableSelectField
              value={issuedToUserId}
              onChange={(val) => {
                const idStr = String(val ?? "");
                setIssuedToUserId(idStr);
                if (idStr) {
                  const staff = staffOptions.find((u: any) => String(u.id) === idStr);
                  if (staff) setIssuedToName(staff.name);
                }
              }}
              options={staffSelectOptions}
              placeholder="Search & select staff member..."
              searchPlaceholder="Search staff by name, ID, phone..."
            />
            <div className="pt-1">
              <Input
                id="issue-to-name"
                value={issuedToName}
                onChange={(e) => {
                  setIssuedToName(e.target.value);
                  if (issuedToUserId) setIssuedToUserId("");
                }}
                placeholder={staffOptions.length > 0 ? "Or type recipient name manually..." : "Enter recipient name"}
                className="h-8 text-xs"
              />
            </div>
            <p className="text-[11px] text-muted-foreground">Staff search karke choose karein ya manual naam type karein</p>
          </div>

          {/* Department & Issue Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold flex items-center gap-1">
                <Building2 className="size-3 text-muted-foreground" />
                Department
              </Label>
              <SearchableSelectField
                value={department}
                onChange={(val) => setDepartment(String(val ?? ""))}
                options={departmentSelectOptions}
                placeholder="Select department..."
                searchPlaceholder="Search department..."
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="issue-date" className="text-xs font-semibold">
                Issue Date <span className="text-destructive">*</span>
              </Label>
              <Input
                id="issue-date"
                type="date"
                value={issuedAt}
                onChange={(e) => setIssuedAt(e.target.value)}
                required
                className="h-10"
              />
            </div>
          </div>

          {/* Purpose */}
          <div className="space-y-1.5">
            <Label htmlFor="issue-purpose" className="text-xs font-semibold">
              Purpose / Use
            </Label>
            <Input
              id="issue-purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Football match, Cooking lunch, Science lab"
              className="h-9"
            />
          </div>

          {/* Remarks */}
          <div className="space-y-1.5">
            <Label htmlFor="issue-remarks" className="text-xs font-semibold">
              Remarks
            </Label>
            <Textarea
              id="issue-remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Any additional notes..."
              rows={2}
            />
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || (!!selectedItem && Number(selectedItem.current_quantity) <= 0)}
              className="gap-1.5"
            >
              <LogOut className="size-4" />
              {isPending ? "Issuing..." : "Issue Item"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
