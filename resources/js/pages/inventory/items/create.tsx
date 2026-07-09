import { Head, Link, router } from "@inertiajs/react";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Boxes } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import inventoryApi from "@/lib/api/inventoryApi";
import { INVENTORY_ITEMS_BREADCRUMBS } from "@/constants/page/admin/inventory";
import { cn } from "@/lib/utils";

const InventoryItemsCreate = () => {
  const [inventory_category_id, setInventoryCategoryId] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [unit, setUnit] = useState("piece");
  const [min_stock, setMinStock] = useState("0");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: categoriesRes } = useQuery({
    queryKey: ["inventory-categories-list"],
    queryFn: () => inventoryApi.categories.index({ per_page: 200 }),
  });
  const categories = categoriesRes?.data ?? [];

  const createMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      inventoryApi.items.store(payload),
    onSuccess: () => {
      router.visit("/inventory/items");
    },
    onError: (err: {
      response?: { data?: { errors?: Record<string, string[]> } };
    }) => {
      const e = err?.response?.data?.errors;
      if (e) {
        const next: Record<string, string> = {};
        Object.entries(e).forEach(([k, v]) => {
          next[k] = Array.isArray(v) ? v[0] : String(v);
        });
        setErrors(next);
      }
    },
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    createMutation.mutate({
      inventory_category_id: Number(inventory_category_id),
      name,
      code: code || undefined,
      unit,
      min_stock: Number(min_stock) || 0,
      location: location || undefined,
      description: description || undefined,
    });
  };

  return (
    <>
      <Head title="Add Item" />
      <div className="p-3 sm:p-5 space-y-5">
        <MainPageHeader
          breadcrumbs={INVENTORY_ITEMS_BREADCRUMBS}
          icon={Boxes}
          title="Add Item"
          subtitle="Create a new inventory item"
        />
        <Card className="max-w-2xl">
          <CardHeader>
            <form onSubmit={submit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    value={inventory_category_id}
                    onChange={(e) => setInventoryCategoryId(e.target.value)}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                  >
                    <option value="">Select category</option>
                    {categories.map((c: { id: number; name: string }) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  {errors.inventory_category_id && (
                    <p className="text-sm text-destructive">
                      {errors.inventory_category_id}
                    </p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Item name"
                    maxLength={200}
                    className={cn("h-9", errors.name ? "border-destructive" : "")}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="code">Code</Label>
                  <Input
                    id="code"
                    value={code}
                    className="h-9"
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="SKU / code"
                    maxLength={80}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    value={unit}
                    className="h-9"
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="piece, box, set..."
                    maxLength={20}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="min_stock">Min stock (low-threshold)</Label>
                  <Input
                    id="min_stock"
                    type="number"
                    className="h-9"
                    min={0}
                    step="any"
                    value={min_stock}
                    onChange={(e) => setMinStock(e.target.value)}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={location}
                    className="h-9"
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Storage location"
                    maxLength={150}
                  />
                </div>
                <div className="space-y-1.5 col-span-full">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={2}
                    className="resize-none"
                  />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                <Button type="submit" disabled={createMutation.isPending} className="w-full sm:w-auto">
                  {createMutation.isPending ? "Saving..." : "Save"}
                </Button>
                <Button type="button" variant="outline" asChild className="w-full sm:w-auto">
                  <Link href="/inventory/items">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardHeader>
        </Card>
      </div>
    </>
  );
};

export default InventoryItemsCreate;
