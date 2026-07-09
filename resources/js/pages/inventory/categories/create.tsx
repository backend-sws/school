import { Head, Link, router } from "@inertiajs/react";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FolderTree } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import inventoryApi from "@/lib/api/inventoryApi";
import {
  INVENTORY_CATEGORIES_BREADCRUMBS,
} from "@/constants/page/admin/inventory";

const InventoryCategoriesCreate = () => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = useMutation({
    mutationFn: (payload: { name: string; code?: string; description?: string }) =>
      inventoryApi.categories.store(payload),
    onSuccess: () => {
      router.visit("/inventory/categories");
    },
    onError: (err: { response?: { data?: { errors?: Record<string, string[]> } } }) => {
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
    createMutation.mutate({ name, code: code || undefined, description: description || undefined });
  };

  return (
    <>
      <Head title="Add Category" />
      <div className="space-y-6">
        <MainPageHeader
          breadcrumbs={INVENTORY_CATEGORIES_BREADCRUMBS}
          icon={FolderTree}
          title="Add Category"
          subtitle="Create a new inventory category"
        />
        <Card className="max-w-xl">
          <CardHeader>
            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Lab Equipment"
                  maxLength={100}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Optional short code"
                  maxLength={50}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional description"
                  rows={3}
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="submit" disabled={createMutation.isPending} className="w-full sm:w-auto">
                  {createMutation.isPending ? "Saving..." : "Save"}
                </Button>
                <Button type="button" variant="outline" asChild className="w-full sm:w-auto">
                  <Link href="/inventory/categories">Cancel</Link>
                </Button>
              </div>
            </form>
          </CardHeader>
        </Card>
      </div>
    </>
  );
};

export default InventoryCategoriesCreate;
