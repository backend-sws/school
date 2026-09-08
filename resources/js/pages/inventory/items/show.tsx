import React, { useMemo } from "react";
import { PermissionGate } from "@/components/PermissionGate";
import { Head, Link } from "@inertiajs/react";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Boxes, Pencil, Layers, Clock, IndianRupee, ShoppingCart, CheckCircle, Package } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import inventoryApi from "@/lib/api/inventoryApi";
import { INVENTORY_ITEMS_BREADCRUMBS } from "@/constants/page/admin/inventory";
import { PageLoader } from "@/components/shared/PageLoader";

interface PageProps {
  id: number;
}

interface BatchRow {
  id: number;
  batch_no: string;
  purchase_line_id?: number;
  received_quantity: number | string;
  remaining_quantity: number | string;
  unit_cost: number | string;
  received_at: string;
  supplier_name?: string;
  status: string;
}

const InventoryItemsShow = ({ id }: PageProps) => {
  const { data: res, isLoading } = useQuery({
    queryKey: ["inventory-item", id],
    queryFn: () => inventoryApi.items.show(id),
    enabled: !!id,
  });

  const item = res?.data ?? res;

  const batches: BatchRow[] = useMemo(() => {
    return Array.isArray(item?.batches) ? item.batches : [];
  }, [item?.batches]);

  const currentQty = Number(item?.current_quantity ?? 0);

  const totalBatchStockValue = useMemo(() => {
    if (batches.length === 0) {
      return currentQty * Number(item?.purchase_price ?? item?.selling_price ?? 0);
    }
    return batches.reduce((sum: number, b: BatchRow) => {
      const rem = parseFloat(String(b.remaining_quantity)) || 0;
      const cost = parseFloat(String(b.unit_cost)) || 0;
      return sum + rem * cost;
    }, 0);
  }, [batches, currentQty, item?.purchase_price, item?.selling_price]);

  const activeBatches = useMemo(() => {
    return batches.filter((b: BatchRow) => (parseFloat(String(b.remaining_quantity)) || 0) > 0);
  }, [batches]);

  const averageBatchCost = useMemo(() => {
    if (batches.length === 0 || currentQty <= 0) return Number(item?.purchase_price ?? 0);
    return totalBatchStockValue / currentQty;
  }, [batches, currentQty, totalBatchStockValue, item?.purchase_price]);

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

        {/* Details & Pricing */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Package className="size-4 text-primary" />
                Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p>
                <span className="text-muted-foreground">Category:</span>{" "}
                <span className="font-medium">{item.category?.name ?? "—"}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Unit:</span>{" "}
                <span className="font-medium">{item.unit ?? "piece"}</span>
              </p>
              <p>
                <span className="text-muted-foreground">Current quantity:</span>{" "}
                <span className="font-mono font-bold text-base text-foreground">
                  {currentQty.toFixed(3)} {item.unit ?? "piece"}
                </span>
              </p>
              <p>
                <span className="text-muted-foreground">Min stock:</span>{" "}
                <span className="font-mono">{Number(item.min_stock ?? 0)}</span>
              </p>
              {item.location && (
                <p>
                  <span className="text-muted-foreground">Location:</span>{" "}
                  <span>{item.location}</span>
                </p>
              )}
              {item.description && (
                <p>
                  <span className="text-muted-foreground">Description:</span>{" "}
                  <span>{item.description}</span>
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <IndianRupee className="size-4 text-emerald-600" />
                Pricing & Valuation (FIFO)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Purchase Price (Base/Latest):</span>
                <span className="font-mono font-medium">
                  ₹{Number(item.purchase_price ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>

              {batches.length > 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Layers className="size-3.5 text-primary" /> Weighted Avg Cost (FIFO):
                  </span>
                  <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{averageBatchCost.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Selling Price:</span>
                <span className="font-mono font-medium">
                  ₹{Number(item.selling_price ?? 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>

              {item.margin_percentage !== undefined && item.margin_percentage !== null && (
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Margin:</span>
                  <span className="font-mono">{Number(item.margin_percentage)}%</span>
                </div>
              )}

              <div className="pt-2 border-t space-y-1">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground font-medium">Current Stock Value (Cost):</span>
                  <span className="font-mono font-bold text-base text-emerald-600 dark:text-emerald-400">
                    ₹{totalBatchStockValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>Current Stock Value (Retail):</span>
                  <span className="font-mono font-medium">
                    ₹{(currentQty * Number(item.selling_price ?? 0)).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FIFO Stock Batches Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <div>
              <CardTitle className="text-base font-semibold flex items-center gap-2">
                <Layers className="size-4 text-primary" />
                FIFO Stock Batches (लॉट / स्टॉक विवरण)
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                Alag-alag purchase rates aur unka bacha hua stock — saman issue hone par sabse puraana batch pehle deduct hoga
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 text-xs">
                {activeBatches.length} Active Lot{activeBatches.length !== 1 ? "s" : ""}
              </Badge>
              {batches.length > activeBatches.length && (
                <Badge variant="outline" className="text-muted-foreground text-xs">
                  {batches.length - activeBatches.length} Exhausted
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {batches.length === 0 ? (
              <div className="text-center py-6 text-sm text-muted-foreground bg-muted/20 rounded-lg border border-dashed">
                <Layers className="size-8 mx-auto mb-2 opacity-40 text-muted-foreground" />
                <p className="font-medium">No stock batches recorded yet</p>
                <p className="text-xs mt-1">Market se khareeda hua saman 'Record Purchase' se add karein taaki batch-wise rates track ho sakein.</p>
              </div>
            ) : (
              <div className="rounded-lg border overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50 text-xs">
                    <tr>
                      <th className="text-left px-3 py-2 font-medium">Batch / Bill No</th>
                      <th className="text-left px-3 py-2 font-medium">Purchase Date</th>
                      <th className="text-left px-3 py-2 font-medium">Supplier</th>
                      <th className="text-right px-3 py-2 font-medium">Rate / Unit</th>
                      <th className="text-right px-3 py-2 font-medium">Purchased</th>
                      <th className="text-right px-3 py-2 font-medium">Remaining</th>
                      <th className="text-right px-3 py-2 font-medium">Batch Value (₹)</th>
                      <th className="text-center px-3 py-2 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y text-xs">
                    {batches.map((b) => {
                      const remQty = parseFloat(String(b.remaining_quantity)) || 0;
                      const recQty = parseFloat(String(b.received_quantity)) || 0;
                      const cost = parseFloat(String(b.unit_cost)) || 0;
                      const batchVal = remQty * cost;
                      const isExhausted = remQty <= 0;

                      return (
                        <tr key={b.id} className={`hover:bg-muted/40 transition-colors ${isExhausted ? "opacity-60 bg-muted/10" : ""}`}>
                          <td className="px-3 py-2.5 font-medium">
                            <span className="font-mono font-semibold text-foreground">{b.batch_no}</span>
                          </td>
                          <td className="px-3 py-2.5 whitespace-nowrap text-muted-foreground">
                            {b.received_at ? new Date(b.received_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
                          </td>
                          <td className="px-3 py-2.5 text-muted-foreground">
                            {b.supplier_name ?? "—"}
                          </td>
                          <td className="px-3 py-2.5 text-right font-mono font-semibold text-foreground">
                            ₹{cost.toFixed(2)}
                          </td>
                          <td className="px-3 py-2.5 text-right font-mono text-muted-foreground">
                            {recQty.toFixed(3)} <span className="text-[10px]">{item.unit ?? ""}</span>
                          </td>
                          <td className="px-3 py-2.5 text-right font-mono">
                            <span className={`font-bold ${isExhausted ? "text-muted-foreground line-through" : "text-emerald-600 dark:text-emerald-400"}`}>
                              {remQty.toFixed(3)}
                            </span>{" "}
                            <span className="text-[10px] text-muted-foreground">{item.unit ?? ""}</span>
                          </td>
                          <td className="px-3 py-2.5 text-right font-mono font-semibold text-foreground">
                            {batchVal > 0 ? `₹${batchVal.toFixed(2)}` : "—"}
                          </td>
                          <td className="px-3 py-2.5 text-center">
                            {isExhausted ? (
                              <Badge variant="outline" className="text-[10px] text-muted-foreground border-muted">
                                Exhausted (0)
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400">
                                Active
                              </Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="border-t-2 bg-muted/30 text-xs font-semibold">
                    <tr>
                      <td colSpan={5} className="px-3 py-2.5 text-right text-muted-foreground">
                        Total Remaining Stock Value (Cost):
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono font-bold text-foreground">
                        {currentQty.toFixed(3)} {item.unit ?? ""}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        ₹{totalBatchStockValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Movements */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-semibold flex items-center gap-2">
              <Clock className="size-4 text-primary" />
              Recent stock movements
            </CardTitle>
          </CardHeader>
          <CardContent>
            {movements.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No movements yet. Record issue, receive, or adjust from Stock Movements.
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
