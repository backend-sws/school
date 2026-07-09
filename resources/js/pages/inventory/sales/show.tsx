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
import { ShoppingCart, Printer } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import inventoryApi from "@/lib/api/inventoryApi";
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
  payment_status: string;
  remarks?: string;
  user?: { name: string };
  fee_payment_id?: number;
  fee_payment?: { id: number; payment_id?: string };
  lines?: Array<{
    id: number;
    quantity: number;
    unit_price: number;
    amount: number;
    item?: { id: number; name: string; code?: string };
  }>;
};

const InventorySalesShow = () => {
  const { id } = usePage().props as { id: number };
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

  return (
    <>
      <Head title={`Sale #${sale.id}`} />
      <div className="space-y-6">
        <MainPageHeader
          breadcrumbs={INVENTORY_SALES_BREADCRUMBS}
          icon={ShoppingCart}
          title={`SALE #${sale.id}`}
          subtitle={new Date(sale.created_at).toLocaleString()}
          guidance={INVENTORY_SALES_GUIDELINES}
        />
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/inventory/sales">Back to list</Link>
          </Button>
          <PermissionGate can="create_inventory_sales">
            <Button size="sm" asChild>
              <Link href="/inventory/sales/create">New sale</Link>
            </Button>
          </PermissionGate>
          {sale.payment_status === "pending" && (
            <PermissionGate can="create_inventory_sales">
              <Button size="sm" asChild>
                <Link href={`/inventory/sales/${sale.id}/collect-payment`}>
                  Collect payment
                </Link>
              </Button>
            </PermissionGate>
          )}
          {sale.payment_status === "paid" && (
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
            <p>
              <span className="text-muted-foreground">Status:</span>{" "}
              <span
                className={
                  sale.payment_status === "paid"
                    ? "text-green-600 font-medium"
                    : "text-amber-600"
                }
              >
                {sale.payment_status}
              </span>
            </p>
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
                <span className="text-muted-foreground">Remarks:</span> {sale.remarks}
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
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Unit price</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(sale.lines ?? []).map((line) => (
                  <TableRow key={line.id}>
                    <TableCell>
                      {line.item?.name ?? `Item #${line.item?.id ?? ""}`}
                      {line.item?.code && (
                        <span className="text-muted-foreground ml-1">
                          ({line.item.code})
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {line.quantity}
                    </TableCell>
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
