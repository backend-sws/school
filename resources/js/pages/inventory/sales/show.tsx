import { useState } from "react";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageLoader } from "@/components/shared/PageLoader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PermissionGate } from "@/components/PermissionGate";
import { Head, Link, usePage } from "@inertiajs/react";
import { ShoppingCart, Printer, MapPin, Pencil, RotateCcw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import inventoryApi from "@/lib/api/inventoryApi";
import { InventorySaleDialog } from "@/components/admin/inventorySaleDialog";
import { InventorySaleReturnDialog } from "@/components/admin/inventorySaleReturnDialog";
import {
  INVENTORY_SALES_BREADCRUMBS,
  INVENTORY_SALES_GUIDELINES,
}
  from "@/constants/page/admin/inventory";

type Sale = {
  id: number;
  created_at: string;
  buyer_type: string;
  buyer_name?: string;
  total_amount: number;
  refunded_amount?: number;
  payment_status: string;
  remarks?: string;
  user?: { name: string };
  fee_payment_id?: number;
  fee_payment?: { id: number; payment_id?: string };
  lines?: Array<{
    id: number;
    quantity: number;
    returned_quantity?: number;
    unit_price: number;
    amount: number;
    item?: { id: number; name: string; code?: string; location?: string };
  }>;
};

const InventorySalesShow = () => {
  const { id } = usePage().props as { id: number };
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isReturnOpen, setIsReturnOpen] = useState(false);

  const { data: res, isLoading } = useQuery({
    queryKey: ["inventory-sale", id],
    queryFn: () => inventoryApi.sales.show(id),
  });
  const sale: Sale | undefined = res?.data;

  if (isLoading) {
    return (
      <>
        <Head title="Sale" />
        <PageLoader />
      </>
    );
  }

  if (!sale) {
    return null;
  }

  const buyerDisplay = sale.buyer_name ?? sale.user?.name ?? `— (${sale.buyer_type})`;
  const hasReturns = (sale.lines ?? []).some((l) => Number(l.returned_quantity ?? 0) > 0);

  return (
    <>
      <Head title={`Sale #${sale.id}`} />
      <InventorySaleDialog
        open={isEditOpen}
        sale={sale}
        onClose={() => setIsEditOpen(false)}
        onSuccess={() => setIsEditOpen(false)}
      />
      <InventorySaleReturnDialog
        open={isReturnOpen}
        sale={sale}
        onClose={() => setIsReturnOpen(false)}
        onSuccess={() => setIsReturnOpen(false)}
      />
      <div className="space-y-6">
        <MainPageHeader
          breadcrumbs={INVENTORY_SALES_BREADCRUMBS}
          icon={ShoppingCart}
          title={`SALE #${sale.id}`}
          subtitle={new Date(sale.created_at).toLocaleString()}
          guidance={INVENTORY_SALES_GUIDELINES}
        />
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/inventory/sales">Back to list</Link>
          </Button>
          <PermissionGate can="create_inventory_sales">
            <Button size="sm" asChild>
              <Link href="/inventory/sales/create">New sale</Link>
            </Button>
          </PermissionGate>
          {sale.payment_status === "pending" && (
            <>
              <PermissionGate can="create_inventory_sales">
                <Button variant="outline" size="sm" onClick={() => setIsEditOpen(true)}>
                  <Pencil className="mr-2 h-4 w-4" /> Edit Sale
                </Button>
              </PermissionGate>
              <PermissionGate can="create_inventory_sales">
                <Button size="sm" asChild>
                  <Link href={`/inventory/sales/${sale.id}/collect-payment`}>
                    Collect payment
                  </Link>
                </Button>
              </PermissionGate>
            </>
          )}
          {(sale.payment_status === "paid" || sale.payment_status === "partially_returned") && (
            <PermissionGate can="create_inventory_movements">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsReturnOpen(true)}
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-400 border-rose-200 dark:border-rose-900"
              >
                <RotateCcw className="mr-2 h-4 w-4" /> Return Items
              </Button>
            </PermissionGate>
          )}
          {(sale.payment_status === "paid" || sale.payment_status === "partially_returned" || sale.payment_status === "returned") && (
            <Button size="sm" variant="secondary" asChild>
              <a href={`/api/v1/inventory/sales/${sale.id}/receipt`} target="_blank" rel="noopener noreferrer">
                <Printer className="mr-2 h-4 w-4" /> Print Receipt
              </a>
            </Button>
          )}
        </div>

        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold">Details</h3>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Buyer:</span> {buyerDisplay}
            </p>
            <p>
              <span className="text-muted-foreground">Type:</span> {sale.buyer_type}
            </p>
            <p>
              <span className="text-muted-foreground">Total:</span>{" "}
              <span className="font-semibold">₹{Number(sale.total_amount).toFixed(2)}</span>
            </p>
            <p className="flex items-center gap-2">
              <span className="text-muted-foreground">Status:</span>
              {sale.payment_status === "paid" && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Paid
                </span>
              )}
              {sale.payment_status === "pending" && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                  Pending
                </span>
              )}
              {sale.payment_status === "partially_returned" && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 border border-orange-200 dark:border-orange-800">
                  Partially Returned
                </span>
              )}
              {sale.payment_status === "returned" && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                  Returned
                </span>
              )}
            </p>
            {Number(sale.refunded_amount ?? 0) > 0 && (
              <p>
                <span className="text-muted-foreground">Refunded Amount:</span>{" "}
                <span className="font-semibold text-rose-600 dark:text-rose-400">
                  ₹{Number(sale.refunded_amount).toFixed(2)}
                </span>
              </p>
            )}
            {sale.fee_payment_id && (
              <p>
                <span className="text-muted-foreground">Payment:</span>{" "}
                <Link
                  href={`/fees/payments/${sale.fee_payment_id}`}
                  className="text-primary hover:underline"
                >
                  View payment #{sale.fee_payment_id}
                </Link>
              </p>
            )}
            {sale.remarks && (
              <p>
                <span className="text-muted-foreground">Remarks:</span>{" "}
                <span className="whitespace-pre-line">{sale.remarks}</span>
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold">Line items</h3>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-right">Sold Qty</TableHead>
                  {hasReturns && <TableHead className="text-right text-rose-600">Returned Qty</TableHead>}
                  <TableHead className="text-right">Unit price</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(sale.lines ?? []).map((line) => (
                  <TableRow key={line.id}>
                    <TableCell>
                      <div>
                        <span className="font-medium">
                          {line.item?.name ?? `Item #${line.item?.id ?? ""}`}
                        </span>
                        {line.item?.code && (
                          <span className="text-muted-foreground ml-1">
                            ({line.item.code})
                          </span>
                        )}
                      </div>
                      {line.item?.location && (
                        <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <MapPin className="size-3 text-amber-600 dark:text-amber-400 shrink-0" />
                          <span>Loc: {line.item.location}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {line.quantity}
                    </TableCell>
                    {hasReturns && (
                      <TableCell className="text-right font-mono text-rose-600">
                        {Number(line.returned_quantity ?? 0) > 0 ? line.returned_quantity : "—"}
                      </TableCell>
                    )}
                    <TableCell className="text-right font-mono">
                      ₹{Number(line.unit_price).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      ₹{Number(line.amount).toFixed(2)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <p className="text-right font-semibold mt-2">
              Total: ₹{Number(sale.total_amount).toFixed(2)}
            </p>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default InventorySalesShow;
