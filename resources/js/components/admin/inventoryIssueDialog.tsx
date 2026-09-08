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
import { LogOut, User, Package } from "lucide-react";
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
  "Other",
];

export function InventoryIssueDialog({ open, onClose, onSuccess }: InventoryIssueDialogProps) {
  const today = new Date().toISOString().split("T")[0];

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

  // Load staff users safely via StaffApi
  const { data: usersData } = useQuery({
    queryKey: ["staff-users-list"],
    queryFn: () => StaffApi.listStaff({ per_page: 200 }),
    enabled: open,
  });

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

    if (!itemId) { toast.error("Please select an item."); return; }
    const qty = parseFloat(quantity);
    if (!qty || qty <= 0) { toast.error("Please enter a valid quantity."); return; }
    if (!issuedToUserId && !issuedToName.trim()) {
      toast.error("Please select a staff member or enter a name."); return;
    }
    if (!issuedAt) { toast.error("Please select an issue date."); return; }

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
      <DialogContent className="sm:max-w-[520px]">
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
          {/* Item select */}
          <div className="space-y-2">
            <Label htmlFor="issue-item">
              <Package className="size-3.5 inline mr-1" />
              Item <span className="text-destructive">*</span>
            </Label>
            <select
              id="issue-item"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              required
            >
              <option value="">— Select item —</option>
              {itemOptions.map((item: any) => (
                <option key={item.id} value={String(item.id)}>
                  {item.name}{item.code ? ` (${item.code})` : ""} — Stock: {Number(item.current_quantity).toFixed(3)} {item.unit ?? ""}
                </option>
              ))}
            </select>
            {selectedItem && (
              <p className="text-xs text-muted-foreground">
                Current stock: <span className={`font-semibold ${Number(selectedItem.current_quantity) <= 0 ? "text-destructive" : "text-emerald-600"}`}>
                  {Number(selectedItem.current_quantity).toFixed(3)} {selectedItem.unit ?? ""}
                </span>
              </p>
            )}
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <Label htmlFor="issue-qty">Quantity <span className="text-destructive">*</span></Label>
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
            />
          </div>

          {/* Issued To */}
          <div className="space-y-2">
            <Label>
              <User className="size-3.5 inline mr-1" />
              Issued To <span className="text-destructive">*</span>
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {staffOptions.length > 0 ? (
                <div className="col-span-2">
                  <select
                    id="issue-staff"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    value={issuedToUserId}
                    onChange={(e) => { setIssuedToUserId(e.target.value); setIssuedToName(""); }}
                  >
                    <option value="">— Select staff (optional) —</option>
                    {staffOptions.map((u: any) => (
                      <option key={u.id} value={String(u.id)}>{u.name}</option>
                    ))}
                  </select>
                </div>
              ) : null}
              <div className={staffOptions.length > 0 ? "col-span-2" : "col-span-2"}>
                <Input
                  id="issue-to-name"
                  value={issuedToName}
                  onChange={(e) => { setIssuedToName(e.target.value); setIssuedToUserId(""); }}
                  placeholder={staffOptions.length > 0 ? "Or type name manually..." : "Enter recipient name"}
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Staff select karein ya naam type karein</p>
          </div>

          {/* Department */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="issue-dept">Department</Label>
              <select
                id="issue-dept"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
              >
                <option value="">— Select department (optional) —</option>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="issue-date">Issue Date <span className="text-destructive">*</span></Label>
              <Input
                id="issue-date"
                type="date"
                value={issuedAt}
                onChange={(e) => setIssuedAt(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Purpose */}
          <div className="space-y-2">
            <Label htmlFor="issue-purpose">Purpose / Use</Label>
            <Input
              id="issue-purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Football match, Cooking lunch, Lab experiment"
            />
          </div>

          {/* Remarks */}
          <div className="space-y-2">
            <Label htmlFor="issue-remarks">Remarks</Label>
            <Textarea
              id="issue-remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Any additional notes..."
              rows={2}
            />
          </div>

          <DialogFooter className="gap-2">
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
