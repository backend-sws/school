import { useEffect, useState, useMemo } from "react";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Head, Link, router } from "@inertiajs/react";
import { ShoppingCart, Plus, Trash2, MapPin } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import inventoryApi from "@/lib/api/inventoryApi";
import {
  INVENTORY_SALES_BREADCRUMBS,
  INVENTORY_SALES_GUIDELINES,
  INVENTORY_SALE_BUYER_TYPES,
} from "@/constants/page/admin/inventory";
import Each from '@/components/Each';

type LineRow = {
  inventory_item_id: number;
  quantity: number;
  unit_price: number;
  amount: number;
};

type ItemOption = {
  id: number;
  name: string;
  code?: string;
  current_quantity: number;
  selling_price?: number;
  location?: string;
  inventory_category_id?: number;
  category?: {
    id: number;
    name: string;
    is_sellable?: boolean;
  };
};

const InventorySalesCreate = () => {
  const [buyerType, setBuyerType] = useState<string>("student");
  const [userId, setUserId] = useState<string>("");
  const [buyerName, setBuyerName] = useState<string>("");
  const [remarks, setRemarks] = useState<string>("");
  const [lines, setLines] = useState<LineRow[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [qty, setQty] = useState<string>("1");
  const [unitPrice, setUnitPrice] = useState<string>("");

  const { data: catRes } = useQuery({
    queryKey: ["inventory-categories-for-sale"],
    queryFn: () => inventoryApi.categories.index({ per_page: 200, for_sale: true }),
  });
  const rawCategories = (catRes as Record<string, any>)?.data ?? [];
  const sellableCategories = useMemo(() => {
    return Array.isArray(rawCategories) ? rawCategories.filter((c: any) => c.is_sellable !== false) : [];
  }, [rawCategories]);

  const { data: itemsRes } = useQuery({
    queryKey: ["inventory-items-for-sale"],
    queryFn: () => inventoryApi.items.index({ per_page: 500, for_sale: true } as any),
  });
  const rawItems: ItemOption[] = itemsRes?.data ?? [];
  const items: ItemOption[] = useMemo(() => {
    return Array.isArray(rawItems) ? rawItems.filter((i) => !i.category || i.category.is_sellable !== false) : [];
  }, [rawItems]);

  const filteredItems = useMemo(() => {
    if (!selectedCategoryId) return items;
    return items.filter(
      (i) => String(i.inventory_category_id ?? i.category?.id) === selectedCategoryId
    );
  }, [items, selectedCategoryId]);

  const selectedItem = useMemo(
    () => items.find((i) => i.id === Number(selectedItemId)),
    [items, selectedItemId]
  );

  const addLine = () => {
    const itemId = Number(selectedItemId);
    const quantity = parseFloat(qty) || 0;
    const unit_price = parseFloat(unitPrice) || (selectedItem?.selling_price ?? 0);
    if (!itemId || quantity <= 0) return;
    const amount = Math.round(quantity * unit_price * 100) / 100;
    setLines((prev) => [
      ...prev,
      { inventory_item_id: itemId, quantity, unit_price, amount },
    ]);
    setSelectedItemId("");
    setQty("1");
    setUnitPrice("");
  };

  const removeLine = (index: number) => {
    setLines((prev) => prev.filter((_, i) => i !== index));
  };

  const total = useMemo(
    () => lines.reduce((sum, l) => sum + l.amount, 0),
    [lines]
  );

  const storeMutation = useMutation({
    mutationFn: (payload: {
      buyer_type: string;
      user_id?: number;
      buyer_name?: string;
      remarks?: string;
      lines: { inventory_item_id: number; quantity: number; unit_price: number }[];
    }) => inventoryApi.sales.store(payload),
    onSuccess: (res: unknown) => {
      const body = (res as { data?: { data?: { sale?: { id: number } } } })?.data;
      const saleId = body?.data?.sale?.id;
      if (saleId) {
        router.visit(`/inventory/sales/${saleId}/collect-payment`);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lines.length === 0) return;
    const payload = {
      buyer_type: buyerType,
      user_id: buyerType !== "other" && userId ? Number(userId) : undefined,
      buyer_name: buyerType === "other" ? buyerName || "Walk-in" : buyerName || undefined,
      remarks: remarks || undefined,
      lines: lines.map((l) => ({
        inventory_item_id: l.inventory_item_id,
        quantity: l.quantity,
        unit_price: l.unit_price,
      })),
    };
    storeMutation.mutate(payload);
  };

  return (
    <>
      <Head title="New Sale" />
      <div className="space-y-6">
        <MainPageHeader
          breadcrumbs={INVENTORY_SALES_BREADCRUMBS}
          icon={ShoppingCart}
          title="NEW SALE"
          subtitle="Sell items to students, parents, or walk-in customers"
          guidance={INVENTORY_SALES_GUIDELINES}
        />
        <form onSubmit={handleSubmit}>
          <Card className="mb-6">
            <CardHeader>
              <h3 className="text-sm font-semibold">Buyer</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label>Buyer type</Label>
                  <select
                    value={buyerType}
                    onChange={(e) => setBuyerType(e.target.value)}
                    className="mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <Each
                      of={INVENTORY_SALE_BUYER_TYPES}
                      keyExtractor={(o) => String(o.value)}
                      render={(o) => (
                        <option key={o.value} value={o.value}>
                          {o.text}
                        </option>
                      )}
                    />
                  </select>
                </div>
                {buyerType !== "other" && (
                  <div>
                    <Label>User ID (student/parent)</Label>
                    <Input
                      type="number"
                      min={1}
                      value={userId}
                      onChange={(e) => setUserId(e.target.value)}
                      placeholder="Enter user ID"
                      required={buyerType !== "other"}
                      className="mt-1"
                    />
                  </div>
                )}
                {buyerType === "other" && (
                  <div>
                    <Label>Buyer name</Label>
                    <Input
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      placeholder="Walk-in customer name"
                      className="mt-1"
                    />
                  </div>
                )}
                <div className="sm:col-span-2">
                  <Label>Remarks (optional)</Label>
                  <Input
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Optional notes"
                    className="mt-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <h3 className="text-sm font-semibold">Line items</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2 items-end">
                <div className="min-w-[160px]">
                  <Label className="text-xs">Category</Label>
                  <select
                    value={selectedCategoryId}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      setSelectedCategoryId(newCat);
                      if (newCat && selectedItem) {
                        const itemCat = String(selectedItem.inventory_category_id ?? selectedItem.category?.id ?? "");
                        if (itemCat && itemCat !== newCat) {
                          setSelectedItemId("");
                          setUnitPrice("");
                        }
                      }
                    }}
                    className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-2 py-1 text-sm"
                  >
                    <option value="">All Categories</option>
                    <Each
                      of={sellableCategories}
                      keyExtractor={(c: any) => String(c.id)}
                      render={(c: any) => (
                        <option key={c.id} value={c.id}>
                          {c.name} {c.code ? `(${c.code})` : ""}
                        </option>
                      )}
                    />
                  </select>
                </div>
                <div className="min-w-[180px]">
                  <Label className="text-xs">Item</Label>
                  <select
                    value={selectedItemId}
                    onChange={(e) => {
                      setSelectedItemId(e.target.value);
                      const item = items.find(
                        (i) => i.id === Number(e.target.value)
                      );
                      if (item) {
                        setUnitPrice(String(item.selling_price ?? ""));
                        const catId = String(item.inventory_category_id ?? item.category?.id ?? "");
                        if (catId && !selectedCategoryId) {
                          setSelectedCategoryId(catId);
                        }
                      }
                    }}
                    className="mt-1 flex h-9 w-full rounded-md border border-input bg-background px-2 py-1 text-sm"
                  >
                    <option value="">Select item</option>
                    <Each
                      of={filteredItems}
                      keyExtractor={(i) => String(i.id)}
                      render={(i) => {
                        const loc = i.location ? ` • 📍 Loc: ${i.location}` : "";
                        const cat = i.category?.name ? `[${i.category.name}] ` : "";
                        return (
                          <option key={i.id} value={i.id}>
                            {cat}{i.name} {i.code ? `(${i.code})` : ""} — Stock: {i.current_quantity}{loc}
                          </option>
                        );
                      }}
                    />
                  </select>
                </div>
                <div className="w-20">
                  <Label className="text-xs">Qty</Label>
                  <Input
                    type="number"
                    min={0.001}
                    step="any"
                    value={qty}
                    onChange={(e) => setQty(e.target.value)}
                    className="mt-1 h-9"
                  />
                </div>
                <div className="w-24">
                  <Label className="text-xs">Unit price</Label>
                  <Input
                    type="number"
                    min={0}
                    step="0.01"
                    value={unitPrice}
                    onChange={(e) => setUnitPrice(e.target.value)}
                    placeholder={String(selectedItem?.selling_price ?? "")}
                    className="mt-1 h-9"
                  />
                </div>
                <Button type="button" onClick={addLine} size="sm">
                  <Plus className="size-4" />
                  Add
                </Button>
              </div>

              {selectedItem && (
                <div className="w-full p-2 px-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-medium text-amber-900 dark:text-amber-200">
                    <MapPin className="size-3.5 shrink-0 text-amber-600 dark:text-amber-400" />
                    <span>Storage Location:</span>
                    <span className="font-semibold text-amber-950 dark:text-amber-100 bg-amber-200/50 dark:bg-amber-900/40 px-1.5 py-0.5 rounded">
                      {selectedItem.location ? selectedItem.location : "Not specified"}
                    </span>
                  </div>
                  <div className="text-muted-foreground text-[11px]">
                    Available Stock: <span className="font-semibold text-foreground">{selectedItem.current_quantity}</span>
                  </div>
                </div>
              )}

              {lines.length > 0 && (
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="p-2">Item</TableHead>
                        <TableHead className="p-2 text-right">Qty</TableHead>
                        <TableHead className="p-2 text-right">Unit price</TableHead>
                        <TableHead className="p-2 text-right">Amount</TableHead>
                        <TableHead className="w-10 p-2" />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <Each
                        of={lines}
                        keyExtractor={(line, idx) => `line-${idx}`}
                        render={(line, idx) => {
                          const item = items.find((i) => i.id === line.inventory_item_id);
                          return (
                            <TableRow key={idx}>
                              <TableCell className="p-2 text-xs">
                                <div className="font-medium text-foreground">
                                  {item?.name ?? `Item #${line.inventory_item_id}`}
                                  {item?.code ? ` (${item.code})` : ""}
                                </div>
                                {item?.location && (
                                  <div className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                                    <MapPin className="size-3 text-amber-600 dark:text-amber-400 shrink-0" />
                                    <span>Loc: {item.location}</span>
                                  </div>
                                )}
                              </TableCell>
                              <TableCell className="p-2 text-right font-mono">
                                {line.quantity}
                              </TableCell>
                              <TableCell className="p-2 text-right font-mono">
                                ₹{line.unit_price.toFixed(2)}
                              </TableCell>
                              <TableCell className="p-2 text-right font-mono">
                                ₹{line.amount.toFixed(2)}
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
              )}
              {lines.length > 0 && (
                <p className="text-right font-semibold">
                  Total: ₹{total.toFixed(2)}
                </p>
              )}
            </CardContent>
          </Card>

          <div className="flex gap-2">
            <Button
              type="submit"
              disabled={lines.length === 0 || storeMutation.isPending}
            >
              {storeMutation.isPending ? "Creating…" : "Create sale & collect payment"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/inventory/sales">Cancel</Link>
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default InventorySalesCreate;
