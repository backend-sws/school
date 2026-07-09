import { PermissionGate } from "@/components/PermissionGate";
import { Head, Link } from "@inertiajs/react";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Boxes, Pencil } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import inventoryApi from "@/lib/api/inventoryApi";
import { INVENTORY_ITEMS_BREADCRUMBS } from "@/constants/page/admin/inventory";
import { PageLoader } from "@/components/shared/PageLoader";

interface PageProps {
  id: number;
}

const InventoryItemsShow = ({ id }: PageProps) => {
  const { data: res, isLoading } = useQuery({
    queryKey: ["inventory-item", id],
    queryFn: () => inventoryApi.items.show(id),
    enabled: !!id,
  });

  const item = res?.data ?? res;

  if (isLoading) {
    return (
      <>
        <Head title="Item" />
        <PageLoader />
      </>
    );
  }

  if (!item?.id) {
    return null;
  }

  const movements = item.movements ?? [];

  return (
    <>
      <Head title={item.name} />
      <div className="space-y-6">
        <MainPageHeader
          breadcrumbs={INVENTORY_ITEMS_BREADCRUMBS}
          icon={Boxes}
          title={item.name}
          subtitle={item.code ? `Code: ${item.code}` : "Inventory item"}
        />
        <div className="flex flex-wrap gap-2">
          <PermissionGate can="update_inventory_items">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href={`/inventory/items/${id}/edit`}>
                <Pencil className="size-4" />
                Edit
              </Link>
            </Button>
          </PermissionGate>
          <PermissionGate can="create_inventory_movements">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/inventory/movements">Record movement</Link>
            </Button>
          </PermissionGate>
        </div>
        <Card>
          <CardHeader>
            <h3 className="font-medium">Details</h3>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Category:</span>{" "}
              {item.category?.name ?? "—"}
            </p>
            <p>
              <span className="text-muted-foreground">Unit:</span>{" "}
              {item.unit ?? "piece"}
            </p>
            <p>
              <span className="text-muted-foreground">Current quantity:</span>{" "}
              <span className="font-mono font-medium">
                {Number(item.current_quantity ?? 0)}
              </span>
            </p>
            <p>
              <span className="text-muted-foreground">Min stock:</span>{" "}
              {Number(item.min_stock ?? 0)}
            </p>
            {item.location && (
              <p>
                <span className="text-muted-foreground">Location:</span>{" "}
                {item.location}
              </p>
            )}
            {item.description && (
              <p>
                <span className="text-muted-foreground">Description:</span>{" "}
                {item.description}
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <h3 className="font-medium">Recent movements</h3>
          </CardHeader>
          <CardContent>
            {movements.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No movements yet. Record issue, receive, or adjust from Stock
                Movements.
              </p>
            ) : (
              <ul className="space-y-2 text-sm">
                {movements.map((m: { id: number; type: string; quantity: number; quantity_after?: number; created_at: string; performer?: { name: string } }) => (
                  <li key={m.id} className="flex justify-between border-b pb-2">
                    <span>
                      <span className="font-medium capitalize">{m.type}</span>{" "}
                      {m.type === 'issue' ? "-" : (Number(m.quantity) > 0 ? "+" : "")}
                      {m.type === 'issue' ? String(m.quantity).replace(/^-/, '') : m.quantity} → {m.quantity_after ?? "—"} by{" "}
                      {m.performer?.name ?? "—"}
                    </span>
                    <span className="text-muted-foreground">
                      {new Date(m.created_at).toLocaleString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default InventoryItemsShow;
