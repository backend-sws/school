import { Head, Link, router } from "@inertiajs/react";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { FolderTree } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import inventoryApi from "@/lib/api/inventoryApi";
import { INVENTORY_CATEGORIES_BREADCRUMBS } from "@/constants/page/admin/inventory";

interface PageProps {
  id: number;
}

const InventoryCategoriesEdit = ({ id }: PageProps) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: res, isLoading } = useQuery({
    queryKey: ["inventory-category", id],
    queryFn: () => inventoryApi.categories.show(id),
    enabled: !!id,
  });

  const category = res?.data ?? res;

  useEffect(() => {
    if (category?.id) {
      setName(category.name ?? "");
      setCode(category.code ?? "");
      setDescription(category.description ?? "");
    }
  }, [category]);

  const updateMutation = useMutation({
    mutationFn: (payload: { name?: string; code?: string; description?: string }) =>
      inventoryApi.categories.update(id, payload),
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
    updateMutation.mutate({ name, code: code || undefined, description: description || undefined });
  };

  if (isLoading || !category?.id) {
    return (
      <>
        <Head title="Edit Category" />
        <div className="p-4 sm:p-6">Loading...</div>
      </>
    );
  }

  return (
    <>
      <Head title="Edit Category" />
      <div className="space-y-6">
        <MainPageHeader
          breadcrumbs={INVENTORY_CATEGORIES_BREADCRUMBS}
          icon={FolderTree}
          title="Edit Category"
          subtitle={category.name}
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
                <Button type="submit" disabled={updateMutation.isPending} className="w-full sm:w-auto">
                  {updateMutation.isPending ? "Saving..." : "Save"}
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

export default InventoryCategoriesEdit;
