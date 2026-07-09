import React, { useMemo, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModalDialog } from "../shared/Modal";
import Each from "../Each";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query.client";
import inventoryApi from "@/lib/api/inventoryApi";
import UserApi from "@/lib/api/userApi";
import { computeGstInclusivePrice, computeLineAmount } from "@/lib/utils";
import { InventoryQueryKeys } from "@/lib/querykey/inventory";
import { StudentQueryKeys } from "@/lib/querykey/student";
import {
  INVENTORY_SALE_FORM_INITIAL,
  INVENTORY_SALE_DIALOG_FORM_LAYOUT,
  INVENTORY_SALE_LINE_ADD_LAYOUT,
} from "@/constants/page/admin/inventory";
import {
  InventorySaleFormSchema,
  type InventorySaleFormValues,
  type InventorySaleFormInputValues,
} from "@/lib/validations/inventory";
import { Plus, Trash2, User, Mail, Phone } from "lucide-react";

// ═══════════════════════════════════════════════════════════════════
//  Types (component-local — not shared outside)
// ═══════════════════════════════════════════════════════════════════

type ItemOption = {
  id: number;
  name: string;
  code?: string;
  current_quantity: number;
  selling_price?: number;
  gst_rate?: number;
};

type SaleLine = {
  inventory_item_id: number;
  quantity: number;
  unit_price: number;
};

interface InventorySaleDialogProps {
  open: boolean;
  onClose: (open: boolean) => void;
  onSuccess?: () => void;
}

// ═══════════════════════════════════════════════════════════════════
//  Helpers (pure functions — no side effects)
// ═══════════════════════════════════════════════════════════════════

/** Resolve effective unit price for an item (delegates to central util). */
function resolveUnitPrice(item: ItemOption | undefined, gstInclusive: boolean): number {
  if (!item) return 0;
  return computeGstInclusivePrice(
    Number(item.selling_price ?? 0),
    Number(item.gst_rate ?? 0),
    gstInclusive,
  );
}

/** Parse a raw form value to a positive integer user ID, or 0 if invalid. */
function parseUserId(raw: unknown): number {
  if (typeof raw === "number" && raw >= 1) return raw;
  if (typeof raw === "string" && raw !== "") {
    const n = Number(raw);
    return n >= 1 ? n : 0;
  }
  return 0;
}

/** Build select options from item list (factory: data → options). */
function buildItemOptions(items: ItemOption[]) {
  return [
    { key: "select-item", text: "Select item", value: "" },
    ...items.map((i) => ({
      key: String(i.id),
      text: `${i.name} ${i.code ? `(${i.code})` : ""} — Stock: ${i.current_quantity}`,
      value: String(i.id),
    })),
  ];
}

// ═══════════════════════════════════════════════════════════════════
//  Component
// ═══════════════════════════════════════════════════════════════════

export function InventorySaleDialog({
  open,
  onClose,
  onSuccess,
}: InventorySaleDialogProps) {
  const {
    control,
    watch,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<InventorySaleFormInputValues>({
    resolver: zodResolver(InventorySaleFormSchema),
    defaultValues: INVENTORY_SALE_FORM_INITIAL as InventorySaleFormInputValues,
    mode: "onChange",
  });

  // ── Watched values ────────────────────────────────────────────
  const buyerType = watch("buyer_type");
  const userIdNum = parseUserId(watch("user_id"));
  const lines = watch("lines") ?? [];
  const newItemId = watch("new_item_id");
  const gstInclusive = watch("gst_inclusive") ?? false;

  // ── Buyer data (student/parent info card) ────────────────────
  const { data: userData } = useQuery({
    queryKey: StudentQueryKeys.detail(userIdNum),
    queryFn: () => UserApi.getUserById(String(userIdNum)),
    enabled: open && buyerType !== "other" && userIdNum >= 1,
  });

  const buyerInfo = useMemo(() => {
    const raw = (userData as Record<string, any>)?.data;
    if (!raw) return null;
    return {
      name: (raw.name as string) ?? "",
      email: (raw.email as string) ?? "",
      mobile: (raw.mobile ?? raw.phone ?? "") as string,
      enrollment: (raw.student_profile?.enrollment_no ?? raw.enrollment_no ?? "") as string,
      stream: (raw.student_profile?.stream?.name ?? "") as string,
    };
  }, [userData]);

  // Auto-fill buyer_name when student/parent is selected
  useEffect(() => {
    if (buyerInfo?.name && buyerType !== "other") {
      setValue("buyer_name", buyerInfo.name);
    }
  }, [buyerInfo, buyerType, setValue]);

  // ── Inventory items (for line-item picker) ───────────────────
  const { data: itemsRes } = useQuery({
    queryKey: InventoryQueryKeys.itemsList(),
    queryFn: () => inventoryApi.items.index({ per_page: 500 }),
    enabled: open,
  });
  const items: ItemOption[] = (itemsRes as Record<string, any>)?.data ?? [];

  const selectedItem = useMemo(
    () => items.find((i) => i.id === Number(newItemId)) ?? null,
    [items, newItemId],
  );

  const computedUnitPrice = useMemo(
    () => resolveUnitPrice(selectedItem ?? undefined, gstInclusive),
    [selectedItem, gstInclusive],
  );

  // Auto-fill unit price when item selection or GST flag changes
  useEffect(() => {
    if (newItemId && selectedItem) {
      setValue("new_unit_price", computedUnitPrice);
    } else {
      setValue("new_unit_price", "");
    }
  }, [newItemId, selectedItem, gstInclusive, computedUnitPrice, setValue]);

  const itemSelectOptions = useMemo(() => buildItemOptions(items), [items]);

  // ── Line management ──────────────────────────────────────────
  const addLine = useCallback(() => {
    const rawItemId = getValues("new_item_id");
    const itemId = typeof rawItemId === "number" ? rawItemId : Number(rawItemId);
    const rawQty = getValues("new_qty");
    const quantity = typeof rawQty === "number" ? rawQty : parseFloat(String(rawQty)) || 0;
    const rawUnit = getValues("new_unit_price");
    const unitPriceNum = typeof rawUnit === "number" ? rawUnit : parseFloat(String(rawUnit));
    const unit_price =
      unitPriceNum > 0
        ? unitPriceNum
        : resolveUnitPrice(selectedItem ?? undefined, gstInclusive) ||
          (selectedItem?.selling_price ?? 0);
    if (!itemId || quantity <= 0) return;

    const currentLines = watch("lines") ?? [];
    setValue("lines", [
      ...currentLines,
      { inventory_item_id: itemId, quantity, unit_price },
    ]);
    setValue("new_item_id", "");
    setValue("new_qty", 1);
    setValue("new_unit_price", "");
  }, [selectedItem, gstInclusive, getValues, watch, setValue]);

  const removeLine = useCallback(
    (index: number) => {
      const currentLines = watch("lines") ?? [];
      setValue(
        "lines",
        currentLines.filter((_, i) => i !== index),
      );
    },
    [watch, setValue],
  );

  const total = useMemo(
    () => lines.reduce((sum, l) => sum + computeLineAmount(l.quantity, l.unit_price), 0),
    [lines],
  );

  // ── Mutation (create sale) ───────────────────────────────────
  const storeMutation = useMutation({
    mutationFn: (payload: {
      buyer_type: string;
      user_id?: number;
      buyer_name?: string;
      remarks?: string;
      lines: SaleLine[];
    }) => inventoryApi.sales.store(payload),
    onSuccess: (res: unknown) => {
      const body = (res as Record<string, any>)?.data;
      const payloadData = body?.data;
      const feePaymentId = payloadData?.fee_payment_id;
      const saleId = payloadData?.sale?.id;
      queryClient.invalidateQueries({ queryKey: InventoryQueryKeys.sales() });
      onClose(false);
      onSuccess?.();
      if (feePaymentId) {
        window.location.href = `/fees/payments/${feePaymentId}`;
      } else if (saleId) {
        window.location.href = `/inventory/sales/${saleId}`;
      }
    },
  });

  const onSubmit = useCallback(
    (data: InventorySaleFormValues) => {
      storeMutation.mutate({
        buyer_type: data.buyer_type,
        user_id:
          data.buyer_type !== "other" && data.user_id != null && data.user_id >= 1
            ? data.user_id
            : undefined,
        buyer_name:
          data.buyer_type === "other"
            ? (data.buyer_name || "Walk-in")
            : (data.buyer_name || undefined),
        remarks: data.remarks || undefined,
        lines: data.lines,
      });
    },
    [storeMutation],
  );

  // ── Layout filtering (buyer_type drives user_id visibility) ──
  const buyerLayoutFiltered = useMemo(
    () => INVENTORY_SALE_DIALOG_FORM_LAYOUT.filter((f) => {
      if (f.name === "user_id") return buyerType !== "other";
      return true;
    }),
    [buyerType],
  );

  // ── Render ───────────────────────────────────────────────────
  return (
    <ModalDialog
      title="NEW SALE"
      open={open}
      onClose={onClose}
      handleSubmit={handleSubmit((data) => onSubmit(data as InventorySaleFormValues))}
      isLoading={storeMutation.isPending}
      submitLabel="Create sale & collect payment"
      primaryDisabled={lines.length === 0}
      className="sm:max-w-[600px]"
    >
      <div className="space-y-4">
        {/* ── Buyer Section ── */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Buyer</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Each
              of={buyerLayoutFiltered}
              keyExtractor={(f) => f.name}
              render={(form) => (
                <div
                  className={
                    form.name === "remarks" ? "sm:col-span-2 w-full" : undefined
                  }
                >
                  <ControlledFormComponent<InventorySaleFormInputValues>
                    {...form}
                    control={control}
                    placeholder={
                      form.name === "buyer_name"
                        ? buyerType === "other"
                          ? "Walk-in customer name"
                          : "Loads from user or enter name"
                        : form.placeholder
                    }
                  />
                </div>
              )}
            />
          </div>
          {errors.user_id?.message && (
            <p className="text-xs text-destructive mt-1">{errors.user_id.message}</p>
          )}

          {/* Buyer Info Card — shows student/parent details after selection */}
          {buyerInfo && buyerType !== "other" && (
            <div className="mt-3 p-3 bg-muted/50 rounded-lg border space-y-1.5">
              <div className="flex items-center gap-2 text-sm font-medium">
                <User className="size-3.5 text-muted-foreground" />
                {buyerInfo.name}
                {buyerInfo.enrollment && (
                  <span className="text-xs text-muted-foreground">({buyerInfo.enrollment})</span>
                )}
              </div>
              {buyerInfo.email && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Mail className="size-3" />
                  {buyerInfo.email}
                </div>
              )}
              {buyerInfo.mobile && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Phone className="size-3" />
                  {buyerInfo.mobile}
                </div>
              )}
              {buyerInfo.stream && (
                <div className="text-xs text-muted-foreground">
                  Class: {buyerInfo.stream}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Line Items Section ── */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Line items</h3>

          {/* GST inclusive checkbox */}
          <div className="mb-3">
            <Each
              of={INVENTORY_SALE_LINE_ADD_LAYOUT.slice(0, 1)}
              keyExtractor={(f) => f.name}
              render={(form) => (
                <div className="w-full">
                  <ControlledFormComponent<InventorySaleFormInputValues>
                    {...form}
                    control={control}
                  />
                </div>
              )}
            />
          </div>

          {/* Item + Qty + Unit price + Add button */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_80px_100px_auto] sm:items-end">
            <Each
              of={INVENTORY_SALE_LINE_ADD_LAYOUT.slice(1)}
              keyExtractor={(f) => f.name}
              render={(form) => (
                <ControlledFormComponent<InventorySaleFormInputValues>
                  {...form}
                  control={control}
                  options={
                    form.name === "new_item_id"
                      ? itemSelectOptions
                      : form.options
                  }
                />
              )}
            />
            <Button type="button" onClick={addLine} size="sm" className="h-9">
              <Plus className="size-4" />
              Add
            </Button>
          </div>

          {errors.lines?.message && (
            <p className="text-xs text-destructive mt-1">{errors.lines.message}</p>
          )}

          {/* Added lines table */}
          {lines.length > 0 && (
            <>
              <div className="border rounded-md overflow-hidden mt-3">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="p-2 text-xs">Item</TableHead>
                      <TableHead className="p-2 text-right text-xs w-16">Qty</TableHead>
                      <TableHead className="p-2 text-right text-xs">Unit price</TableHead>
                      <TableHead className="p-2 text-right text-xs">Amount</TableHead>
                      <TableHead className="w-10 p-2" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <Each
                      of={lines}
                      keyExtractor={(_: SaleLine, idx: number) => `line-${idx}`}
                      render={(line: SaleLine, idx: number) => (
                        <TableRow>
                          <TableCell className="p-2 text-xs">
                            {items.find((i) => i.id === line.inventory_item_id)?.name ??
                              `#${line.inventory_item_id}`}
                          </TableCell>
                          <TableCell className="p-2 text-right text-xs">
                            {line.quantity}
                          </TableCell>
                          <TableCell className="p-2 text-right text-xs">
                            ₹{line.unit_price.toFixed(2)}
                          </TableCell>
                          <TableCell className="p-2 text-right text-xs">
                            ₹{computeLineAmount(line.quantity, line.unit_price).toFixed(2)}
                          </TableCell>
                          <TableCell className="p-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeLine(idx)}
                            >
                              <Trash2 className="size-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      )}
                    />
                  </TableBody>
                </Table>
              </div>
              <p className="text-right font-semibold text-sm mt-2">
                Total: ₹{total.toFixed(2)}
              </p>
            </>
          )}
        </div>
      </div>
    </ModalDialog>
  );
}
