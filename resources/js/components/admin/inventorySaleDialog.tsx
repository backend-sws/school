import React, { useMemo, useCallback, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModalDialog } from "../shared/Modal";
import Each from "../Each";
import ControlledFormComponent from "../shared/ControlledFormComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { SearchableSelectField } from "@/components/searchableSelectInput";
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
} from "@/constants/page/admin/inventory";
import {
  InventorySaleFormSchema,
  type InventorySaleFormValues,
  type InventorySaleFormInputValues,
} from "@/lib/validations/inventory";
import { Plus, Trash2, User, Mail, Phone, MapPin } from "lucide-react";

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
  location?: string;
  inventory_category_id?: number;
  category?: {
    id: number;
    name: string;
    is_sellable?: boolean;
  };
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
    ...items.map((i) => {
      const loc = i.location ? ` • 📍 Loc: ${i.location}` : "";
      const cat = i.category?.name ? `[${i.category.name}] ` : "";
      return {
        key: String(i.id),
        text: `${cat}${i.name} ${i.code ? `(${i.code})` : ""} — Stock: ${i.current_quantity}${loc}`,
        value: String(i.id),
      };
    }),
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

  // ── Categories (available for sale) ─────────────────────────
  const { data: categoriesRes } = useQuery({
    queryKey: ["inventory-categories-for-sale"],
    queryFn: () => inventoryApi.categories.index({ per_page: 200, for_sale: true }),
    enabled: open,
  });
  const rawCategories = (categoriesRes as Record<string, any>)?.data ?? [];
  const sellableCategories = useMemo(() => {
    return Array.isArray(rawCategories) ? rawCategories.filter((c: any) => c.is_sellable !== false) : [];
  }, [rawCategories]);

  const [categoryFilter, setCategoryFilter] = React.useState<string>("");

  const categoryOptions = useMemo(() => {
    return [
      { key: "all", text: "All Categories", value: "" },
      ...sellableCategories.map((c: any) => ({
        key: String(c.id),
        text: c.name + (c.code ? ` (${c.code})` : ""),
        value: String(c.id),
      })),
    ];
  }, [sellableCategories]);

  // ── Inventory items (for line-item picker) ───────────────────
  const { data: itemsRes } = useQuery({
    queryKey: [...InventoryQueryKeys.itemsList(), "for-sale"],
    queryFn: () => inventoryApi.items.index({ per_page: 500, for_sale: true } as any),
    enabled: open,
  });
  const rawItems: ItemOption[] = (itemsRes as Record<string, any>)?.data ?? [];
  const items: ItemOption[] = useMemo(() => {
    return Array.isArray(rawItems) ? rawItems.filter((i) => !i.category || i.category.is_sellable !== false) : [];
  }, [rawItems]);

  const filteredItems = useMemo(() => {
    if (!categoryFilter) return items;
    return items.filter(
      (i) => String(i.inventory_category_id ?? i.category?.id) === String(categoryFilter)
    );
  }, [items, categoryFilter]);

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

  const itemSelectOptions = useMemo(() => buildItemOptions(filteredItems), [filteredItems]);

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
      className="sm:max-w-[700px] w-full"
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
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Line items</h3>
            {lines.length > 0 && (
              <span className="text-xs text-muted-foreground font-medium">
                {lines.length} {lines.length === 1 ? "item" : "items"} added
              </span>
            )}
          </div>

          {/* Add Item Card Container */}
          <div className="p-3.5 rounded-xl bg-muted/40 border border-border/70 space-y-3">
            {/* Top row: Category & Item */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-4 space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                  Category
                </label>
                <SearchableSelectField
                  value={categoryFilter}
                  onChange={(val) => {
                    const newCat = String(val ?? "");
                    setCategoryFilter(newCat);
                    if (newCat && selectedItem) {
                      const itemCatId = String(selectedItem.inventory_category_id ?? selectedItem.category?.id ?? "");
                      if (itemCatId && itemCatId !== newCat) {
                        setValue("new_item_id", "");
                        setValue("new_unit_price", "");
                      }
                    }
                  }}
                  options={categoryOptions}
                  placeholder="All Categories"
                  searchPlaceholder="Search category..."
                  className="w-full bg-background"
                />
              </div>

              <div className="sm:col-span-8 space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                  Item <span className="text-destructive">*</span>
                </label>
                <Controller
                  control={control}
                  name="new_item_id"
                  render={({ field }) => (
                    <SearchableSelectField
                      value={field.value}
                      onChange={(val) => {
                        field.onChange(val);
                        const item = items.find((i) => String(i.id) === String(val));
                        if (item) {
                          setValue("new_unit_price", resolveUnitPrice(item, gstInclusive));
                          const itemCatId = String(item.inventory_category_id ?? item.category?.id ?? "");
                          if (itemCatId && !categoryFilter) {
                            setCategoryFilter(itemCatId);
                          }
                        }
                      }}
                      options={itemSelectOptions.filter((o) => o.value !== "")}
                      placeholder="Select item to sell..."
                      searchPlaceholder="Search item name or code..."
                      emptyText={categoryFilter ? "No sellable items in this category" : "No sellable items found"}
                      className="w-full bg-background"
                    />
                  )}
                />
              </div>
            </div>

            {/* Storage Location & Available Stock pill (if item selected) */}
            {selectedItem && (
              <div className="p-2 px-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-medium text-amber-900 dark:text-amber-200">
                  <MapPin className="size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                  <span>Storage Location:</span>
                  <span className="font-semibold text-amber-950 dark:text-amber-100 bg-amber-200/50 dark:bg-amber-900/40 px-1.5 py-0.5 rounded">
                    {selectedItem.location || "Not specified"}
                  </span>
                </div>
                <div className="text-muted-foreground text-[11px]">
                  Available Stock: <span className="font-semibold text-foreground">{selectedItem.current_quantity}</span>
                </div>
              </div>
            )}

            {/* Bottom row: Qty, Unit Price, GST Inclusive, and Add Button */}
            <div className="flex flex-wrap items-end gap-3 pt-0.5">
              <div className="w-24 space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                  Qty <span className="text-destructive">*</span>
                </label>
                <Controller
                  control={control}
                  name="new_qty"
                  render={({ field }) => (
                    <Input
                      type="number"
                      min={0.001}
                      step="any"
                      value={field.value ?? 1}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="1"
                      className="h-9 bg-background"
                    />
                  )}
                />
              </div>

              <div className="w-32 space-y-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/80 block">
                  Unit Price (₹)
                </label>
                <Controller
                  control={control}
                  name="new_unit_price"
                  render={({ field }) => (
                    <Input
                      type="number"
                      min={0}
                      step="any"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="0.00"
                      className="h-9 bg-background"
                    />
                  )}
                />
              </div>

              <div className="flex items-center gap-2 pb-2">
                <Controller
                  control={control}
                  name="gst_inclusive"
                  render={({ field }) => (
                    <Checkbox
                      id="gst_inclusive_check"
                      checked={!!field.value}
                      onCheckedChange={(checked) => field.onChange(!!checked)}
                    />
                  )}
                />
                <label
                  htmlFor="gst_inclusive_check"
                  className="text-xs font-medium cursor-pointer text-muted-foreground hover:text-foreground select-none"
                  title="When checked, price includes GST"
                >
                  GST Inclusive
                </label>
              </div>

              <div className="ml-auto">
                <Button
                  type="button"
                  onClick={addLine}
                  size="sm"
                  className="h-9 px-4 font-medium gap-1.5 shadow-sm"
                  disabled={!watch("new_item_id")}
                >
                  <Plus className="size-4" />
                  Add to Sale
                </Button>
              </div>
            </div>
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
                      render={(line: SaleLine, idx: number) => {
                        const item = items.find((i) => i.id === line.inventory_item_id);
                        return (
                          <TableRow>
                            <TableCell className="p-2 text-xs">
                              <div className="font-medium text-foreground">
                                {item?.name ?? `#${line.inventory_item_id}`}
                                {item?.code ? ` (${item.code})` : ""}
                              </div>
                              {item?.location && (
                                <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                  <MapPin className="size-3 text-amber-600 dark:text-amber-400 shrink-0" />
                                  <span>Loc: {item.location}</span>
                                </div>
                              )}
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
                        );
                      }}
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
