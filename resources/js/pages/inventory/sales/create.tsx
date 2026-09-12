import React, { useMemo, useCallback, useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Each from "@/components/Each";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Head, Link, router } from "@inertiajs/react";
import {
  ShoppingCart,
  Plus,
  Trash2,
  MapPin,
  User,
  Mail,
  Phone,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import inventoryApi from "@/lib/api/inventoryApi";
import UserApi from "@/lib/api/userApi";
import { computeGstInclusivePrice, computeLineAmount } from "@/lib/utils";
import { InventoryQueryKeys } from "@/lib/querykey/inventory";
import { StudentQueryKeys } from "@/lib/querykey/student";
import {
  INVENTORY_SALES_BREADCRUMBS,
  INVENTORY_SALES_GUIDELINES,
  INVENTORY_SALE_FORM_INITIAL,
  INVENTORY_SALE_DIALOG_FORM_LAYOUT,
} from "@/constants/page/admin/inventory";
import {
  InventorySaleFormSchema,
  type InventorySaleFormValues,
  type InventorySaleFormInputValues,
} from "@/lib/validations/inventory";
import { toast } from "sonner";

// ── Types ────────────────────────────────────────────────────────────
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

// ── Helpers ──────────────────────────────────────────────────────────
function resolveUnitPrice(item: ItemOption | undefined, gstInclusive: boolean): number {
  if (!item) return 0;
  return computeGstInclusivePrice(
    Number(item.selling_price ?? 0),
    Number(item.gst_rate ?? 0),
    gstInclusive
  );
}

function parseUserId(raw: unknown): number {
  if (typeof raw === "number" && raw >= 1) return raw;
  if (typeof raw === "string" && raw !== "") {
    const n = Number(raw);
    return n >= 1 ? n : 0;
  }
  return 0;
}

function buildItemOptions(items: ItemOption[]) {
  return [
    { key: "select-item", text: "Select item", value: "" },
    ...items.map((i) => {
      const catName = i.category?.name;
      const codeText = i.code ? ` (${i.code})` : "";
      const locText = i.location ? `Loc: ${i.location}` : "";

      const searchText = [
        catName ? `[${catName}]` : "",
        i.name,
        i.code,
        `Stock: ${i.current_quantity}`,
        locText,
      ]
        .filter(Boolean)
        .join(" ");

      return {
        key: String(i.id),
        value: String(i.id),
        text: searchText,
        triggerText: `${catName ? `[${catName}] ` : ""}${i.name}${codeText} — Stock: ${i.current_quantity}`,
        label: (
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            {catName && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-muted text-muted-foreground border border-border/60 shrink-0">
                {catName}
              </span>
            )}
            <span className="font-semibold text-foreground text-xs">{i.name}</span>
            {i.code && (
              <span className="text-muted-foreground text-[11px]">({i.code})</span>
            )}
          </div>
        ),
        subtext: (
          <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] leading-tight">
            <span className="inline-flex items-center text-muted-foreground shrink-0">
              Stock: <strong className="ml-1 text-foreground font-semibold">{i.current_quantity}</strong>
            </span>
            {i.location ? (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-medium bg-amber-500/15 text-amber-900 dark:text-amber-200 border border-amber-500/30 break-words max-w-full">
                <MapPin className="size-3 shrink-0 text-amber-600 dark:text-amber-400" />
                <span>Loc: <span className="font-semibold text-amber-950 dark:text-amber-100">{i.location}</span></span>
              </span>
            ) : (
              <span className="text-muted-foreground/60 text-[10px] italic">
                📍 Loc: Not set
              </span>
            )}
          </div>
        ),
      };
    }),
  ];
}

const InventorySalesCreate = () => {
  const {
    control,
    watch,
    setValue,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<InventorySaleFormInputValues>({
    resolver: zodResolver(InventorySaleFormSchema) as any,
    defaultValues: INVENTORY_SALE_FORM_INITIAL as InventorySaleFormInputValues,
    mode: "onChange",
  });

  // ── Watched values ────────────────────────────────────────────
  const buyerType = watch("buyer_type");
  const userIdNum = parseUserId(watch("user_id"));
  const lines = watch("lines") ?? [];
  const newItemId = watch("new_item_id");
  const gstInclusive = watch("gst_inclusive") ?? false;

  // ── Buyer details query ───────────────────────────────────────
  const { data: userData } = useQuery({
    queryKey: StudentQueryKeys.detail(userIdNum),
    queryFn: () => UserApi.getUserById(String(userIdNum)),
    enabled: buyerType !== "other" && userIdNum >= 1,
  });

  const buyerInfo = useMemo(() => {
    const raw = (userData as Record<string, any>)?.data;
    if (!raw) return null;
    const sp = raw.student_profile || raw.studentProfile;
    return {
      name: (raw.name as string) ?? "",
      email: (raw.email as string) ?? "",
      mobile: (raw.mobile ?? raw.phone ?? "") as string,
      enrollment: (sp?.enrollment_no ?? raw.enrollment_no ?? sp?.reg_no ?? "") as string,
      stream: (sp?.stream?.name ?? "") as string,
      fatherName: (sp?.father_name ?? raw.father_name ?? "") as string,
    };
  }, [userData]);

  useEffect(() => {
    if (buyerInfo?.name && buyerType !== "other") {
      setValue("buyer_name", buyerInfo.name);
    }
  }, [buyerInfo, buyerType, setValue]);

  // ── Categories ────────────────────────────────────────────────
  const { data: categoriesRes } = useQuery({
    queryKey: ["inventory-categories-for-sale"],
    queryFn: () => inventoryApi.categories.index({ per_page: 200, for_sale: true }),
  });
  const rawCategories = (categoriesRes as Record<string, any>)?.data ?? [];
  const sellableCategories = useMemo(() => {
    return Array.isArray(rawCategories)
      ? rawCategories.filter((c: any) => c.is_sellable !== false)
      : [];
  }, [rawCategories]);

  const [categoryFilter, setCategoryFilter] = useState<string>("");

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

  // ── Inventory items ───────────────────────────────────────────
  const { data: itemsRes } = useQuery({
    queryKey: [...InventoryQueryKeys.itemsList(), "for-sale"],
    queryFn: () => inventoryApi.items.index({ per_page: 500, for_sale: true } as any),
  });
  const rawItems: ItemOption[] = (itemsRes as Record<string, any>)?.data ?? [];
  const items: ItemOption[] = useMemo(() => {
    return Array.isArray(rawItems)
      ? rawItems.filter((i) => !i.category || i.category.is_sellable !== false)
      : [];
  }, [rawItems]);

  const filteredItems = useMemo(() => {
    if (!categoryFilter) return items;
    return items.filter(
      (i) => String(i.inventory_category_id ?? i.category?.id) === String(categoryFilter)
    );
  }, [items, categoryFilter]);

  const selectedItem = useMemo(
    () => items.find((i) => i.id === Number(newItemId)) ?? null,
    [items, newItemId]
  );

  const computedUnitPrice = useMemo(
    () => resolveUnitPrice(selectedItem ?? undefined, gstInclusive),
    [selectedItem, gstInclusive]
  );

  useEffect(() => {
    if (newItemId && selectedItem) {
      setValue("new_unit_price", computedUnitPrice);
    } else {
      setValue("new_unit_price", "");
    }
  }, [newItemId, selectedItem, gstInclusive, computedUnitPrice, setValue]);

  const itemSelectOptions = useMemo(() => buildItemOptions(filteredItems), [filteredItems]);

  // ── Line Items Management ─────────────────────────────────────
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
        currentLines.filter((_, i) => i !== index)
      );
    },
    [watch, setValue]
  );

  const total = useMemo(
    () => lines.reduce((sum, l) => sum + computeLineAmount(l.quantity, l.unit_price), 0),
    [lines]
  );

  // ── Mutation ──────────────────────────────────────────────────
  const storeMutation = useMutation({
    mutationFn: (payload: {
      buyer_type: string;
      user_id?: number;
      buyer_name?: string;
      remarks?: string;
      lines: SaleLine[];
    }) => inventoryApi.sales.store(payload),
    onSuccess: (res: unknown) => {
      toast.success("Sale created successfully.");
      const body = (res as Record<string, any>)?.data;
      const payloadData = body?.data;
      const saleId = payloadData?.sale?.id;
      if (saleId) {
        router.visit(`/inventory/sales/${saleId}/collect-payment`);
      } else {
        router.visit("/inventory/sales");
      }
    },
    onError: (err: any) => {
      const msg = err?.response?.data?.message || "Failed to create sale.";
      toast.error(msg);
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
            ? data.buyer_name || "Walk-in"
            : data.buyer_name || undefined,
        remarks: data.remarks || undefined,
        lines: data.lines,
      });
    },
    [storeMutation]
  );

  const buyerLayoutFiltered = useMemo(
    () =>
      INVENTORY_SALE_DIALOG_FORM_LAYOUT.filter((f) => {
        if (f.name === "user_id") return buyerType !== "other";
        return true;
      }),
    [buyerType]
  );

  return (
    <>
      <Head title="New Sale" />
      <div className="space-y-6 max-w-5xl mx-auto pb-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <MainPageHeader
            breadcrumbs={INVENTORY_SALES_BREADCRUMBS}
            icon={ShoppingCart}
            title="NEW SALE"
            subtitle="Sell inventory items to students, parents, or walk-in customers."
            guidance={INVENTORY_SALES_GUIDELINES}
          />
          <Button variant="outline" size="sm" asChild className="gap-1.5 self-start">
            <Link href="/inventory/sales">
              <ArrowLeft className="size-4" />
              Back to Sales
            </Link>
          </Button>
        </div>

        <form onSubmit={handleSubmit((data) => onSubmit(data as InventorySaleFormValues))}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            {/* ── Left Column: Form Details (2 Cols) ── */}
            <div className="lg:col-span-2 space-y-6">
              {/* 1. Buyer Card */}
              <Card className="shadow-sm border-border/80">
                <CardHeader className="pb-3 border-b bg-muted/20">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <User className="size-4 text-primary" />
                    Buyer Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
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
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="size-3.5" />
                      {errors.user_id.message}
                    </p>
                  )}

                  {/* Buyer Profile Preview Card */}
                  {buyerInfo && buyerType !== "other" && (
                    <div className="p-3.5 bg-primary/5 rounded-xl border border-primary/20 space-y-2">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                          <CheckCircle2 className="size-4 text-primary shrink-0" />
                          <span>{buyerInfo.name}</span>
                          {buyerInfo.enrollment && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono font-medium">
                              {buyerInfo.enrollment}
                            </span>
                          )}
                        </div>
                        {buyerInfo.stream && (
                          <span className="text-xs px-2.5 py-0.5 rounded-md bg-background border border-border font-medium text-muted-foreground">
                            Class: {buyerInfo.stream}
                          </span>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-muted-foreground pt-1 border-t border-primary/10">
                        {buyerInfo.fatherName && (
                          <div>
                            Father: <strong className="text-foreground">{buyerInfo.fatherName}</strong>
                          </div>
                        )}
                        {buyerInfo.mobile && (
                          <div className="flex items-center gap-1.5">
                            <Phone className="size-3 text-muted-foreground" />
                            <span>{buyerInfo.mobile}</span>
                          </div>
                        )}
                        {buyerInfo.email && (
                          <div className="flex items-center gap-1.5 sm:col-span-2">
                            <Mail className="size-3 text-muted-foreground" />
                            <span>{buyerInfo.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* 2. Line Items Card */}
              <Card className="shadow-sm border-border/80">
                <CardHeader className="pb-3 border-b bg-muted/20 flex flex-row items-center justify-between">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <ShoppingCart className="size-4 text-primary" />
                    Line Items
                  </CardTitle>
                  {lines.length > 0 && (
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                      {lines.length} {lines.length === 1 ? "item" : "items"} added
                    </span>
                  )}
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  {/* Add item control box */}
                  <div className="p-4 rounded-xl bg-muted/40 border border-border/70 space-y-3.5">
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
                              const itemCatId = String(
                                selectedItem.inventory_category_id ?? selectedItem.category?.id ?? ""
                              );
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
                                  const itemCatId = String(
                                    item.inventory_category_id ?? item.category?.id ?? ""
                                  );
                                  if (itemCatId && !categoryFilter) {
                                    setCategoryFilter(itemCatId);
                                  }
                                }
                              }}
                              options={itemSelectOptions.filter((o) => o.value !== "")}
                              placeholder="Search & select item to sell..."
                              searchPlaceholder="Search item name, code, or location..."
                              emptyText={
                                categoryFilter
                                  ? "No sellable items in this category"
                                  : "No sellable items found"
                              }
                              className="w-full bg-background"
                              popoverClassName="w-[max(var(--radix-popover-trigger-width),460px)] sm:w-[520px] max-w-[min(92vw,600px)]"
                            />
                          )}
                        />
                      </div>
                    </div>

                    {/* Storage Location & Available Stock pill */}
                    {selectedItem && (
                      <div className="p-2.5 px-3.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 font-medium text-amber-900 dark:text-amber-200">
                          <MapPin className="size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                          <span>Storage Location:</span>
                          <span className="font-semibold text-amber-950 dark:text-amber-100 bg-amber-200/50 dark:bg-amber-900/40 px-1.5 py-0.5 rounded">
                            {selectedItem.location || "Not specified"}
                          </span>
                        </div>
                        <div className="text-muted-foreground text-[11px]">
                          Available Stock:{" "}
                          <span className="font-semibold text-foreground">
                            {selectedItem.current_quantity}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Bottom row: Qty, Unit Price, GST Inclusive, and Add Button */}
                    <div className="flex flex-wrap items-end gap-3 pt-1">
                      <div className="w-28 space-y-1">
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
                              value={(field.value as number | string | undefined) ?? 1}
                              onChange={(e) => field.onChange(e.target.value)}
                              placeholder="1"
                              className="h-9 bg-background font-mono"
                            />
                          )}
                        />
                      </div>

                      <div className="w-36 space-y-1">
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
                              value={(field.value as number | string | undefined) ?? ""}
                              onChange={(e) => field.onChange(e.target.value)}
                              placeholder="0.00"
                              className="h-9 bg-background font-mono"
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
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertCircle className="size-3.5" />
                      {errors.lines.message}
                    </p>
                  )}

                  {/* Added lines table */}
                  {lines.length > 0 ? (
                    <div className="border rounded-xl overflow-hidden shadow-xs">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/50">
                            <TableHead className="p-3 text-xs">Item</TableHead>
                            <TableHead className="p-3 text-right text-xs w-20">Qty</TableHead>
                            <TableHead className="p-3 text-right text-xs w-28">Unit Price</TableHead>
                            <TableHead className="p-3 text-right text-xs w-28">Amount</TableHead>
                            <TableHead className="w-12 p-3 text-center" />
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <Each
                            of={lines}
                            keyExtractor={(_: SaleLine, idx: number) => `line-${idx}`}
                            render={(line: SaleLine, idx: number) => {
                              const item = items.find((i) => i.id === line.inventory_item_id);
                              return (
                                <TableRow key={idx} className="hover:bg-muted/30">
                                  <TableCell className="p-3 text-xs">
                                    <div className="font-semibold text-foreground">
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
                                  <TableCell className="p-3 text-right text-xs font-mono font-medium">
                                    {line.quantity}
                                  </TableCell>
                                  <TableCell className="p-3 text-right text-xs font-mono">
                                    ₹{line.unit_price.toFixed(2)}
                                  </TableCell>
                                  <TableCell className="p-3 text-right text-xs font-mono font-semibold text-foreground">
                                    ₹{computeLineAmount(line.quantity, line.unit_price).toFixed(2)}
                                  </TableCell>
                                  <TableCell className="p-3 text-center">
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => removeLine(idx)}
                                      className="size-8 p-0 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                    >
                                      <Trash2 className="size-4" />
                                    </Button>
                                  </TableCell>
                                </TableRow>
                              );
                            }}
                          />
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-muted-foreground text-sm border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-1">
                      <ShoppingCart className="size-8 text-muted-foreground/40 mb-1" />
                      <p className="font-medium text-foreground">No items added to this sale yet</p>
                      <p className="text-xs">Select an item above and click &quot;Add to Sale&quot;.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* ── Right Column: Order Summary & Actions (1 Col) ── */}
            <div className="space-y-6">
              <Card className="shadow-sm border-border/80 sticky top-4">
                <CardHeader className="pb-3 border-b bg-muted/20">
                  <CardTitle className="text-base font-semibold">Sale Summary</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Total Items</span>
                      <span className="font-semibold text-foreground font-mono">{lines.length}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Total Quantity</span>
                      <span className="font-semibold text-foreground font-mono">
                        {lines.reduce((s, l) => s + Number(l.quantity), 0)}
                      </span>
                    </div>
                    <div className="border-t pt-3 flex justify-between items-baseline">
                      <span className="text-base font-bold text-foreground">Grand Total</span>
                      <span className="text-2xl font-bold text-primary font-mono">
                        ₹{total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 space-y-2 border-t">
                    <Button
                      type="submit"
                      className="w-full h-11 text-sm font-semibold shadow-md gap-2"
                      disabled={lines.length === 0 || storeMutation.isPending}
                    >
                      <ShoppingCart className="size-4" />
                      {storeMutation.isPending
                        ? "Creating Sale..."
                        : "Create Sale & Collect Payment"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      asChild
                      className="w-full h-10 text-sm"
                    >
                      <Link href="/inventory/sales">Cancel</Link>
                    </Button>
                  </div>

                  <div className="text-[11px] text-muted-foreground text-center pt-2">
                    Stock will be deducted immediately upon recording this sale.
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </>
  );
};

export default InventorySalesCreate;
