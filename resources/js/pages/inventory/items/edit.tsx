import { Head, Link, router } from "@inertiajs/react";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Boxes } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import inventoryApi from "@/lib/api/inventoryApi";
import { INVENTORY_ITEMS_BREADCRUMBS } from "@/constants/page/admin/inventory";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

interface PageProps {
  id: number;
}

const InventoryItemsEdit = ({ id }: PageProps) => {
  const [inventory_category_id, setInventoryCategoryId] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [unit, setUnit] = useState("piece");
  const [min_stock, setMinStock] = useState("0");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [is_active, setIsActive] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: res, isLoading } = useQuery({
    queryKey: ["inventory-item", id],
    queryFn: () => inventoryApi.items.show(id),
    enabled: !!id,
  });
  const item = res?.data ?? res;

  const { data: categoriesRes } = useQuery({
    queryKey: ["inventory-categories-list"],
    queryFn: () => inventoryApi.categories.index({ per_page: 200 }),
  });
  const categories = categoriesRes?.data ?? [];

  useEffect(() => {
    if (item?.id) {
      setInventoryCategoryId(String(item.inventory_category_id ?? ""));
      setName(item.name ?? "");
      setCode(item.code ?? "");
      setUnit(item.unit ?? "piece");
      setMinStock(String(item.min_stock ?? 0));
      setLocation(item.location ?? "");
      setDescription(item.description ?? "");
      setIsActive(item.is_active !== false);
    }
  }, [item]);

  const updateMutation = useMutation({
    mutationFn: (payload: Record<string, unknown>) =>
      inventoryApi.items.update(id, payload),
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
    updateMutation.mutate({
      inventory_category_id: inventory_category_id
        ? Number(inventory_category_id)
        : undefined,
      name,
      code: code || undefined,
      unit,
      min_stock: Number(min_stock) || 0,
      location: location || undefined,
      description: description || undefined,
      is_active,
    });
  };

  if (isLoading || !item?.id) {
    return (
      <>
        <Head title="Edit Item" />
        <div className="p-4 sm:p-6">Loading...</div>
      </>
    );
  }

  return (
    <>
      <Head title={`Edit ${item.name}`} />
      <div className="p-3 sm:p-5 space-y-5">
        <MainPageHeader
          breadcrumbs={INVENTORY_ITEMS_BREADCRUMBS}
          icon={Boxes}
          title={`Edit: ${item.name}`}
          subtitle="Update item details"
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
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                    className="h-9"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    maxLength={80}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="unit">Unit</Label>
                  <Input
                    id="unit"
                    className="h-9"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    maxLength={20}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="min_stock">Min stock</Label>
                  <Input
                    id="min_stock"
                    className="h-9"
                    type="number"
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
                    className="h-9"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
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
                <div className="flex items-center gap-2 col-span-full">
                  <Checkbox
                    id="is_active"
                    checked={is_active}
                    onCheckedChange={(checked) => setIsActive(checked as boolean)}
                  />
                  <Label htmlFor="is_active" className="cursor-pointer">Active</Label>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-2 border-t">
                <Button type="submit" disabled={updateMutation.isPending} className="w-full sm:w-auto">
                  {updateMutation.isPending ? "Saving..." : "Save"}
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

export default InventoryItemsEdit;
