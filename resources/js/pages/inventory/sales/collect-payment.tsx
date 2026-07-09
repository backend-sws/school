import { useState } from "react";
import { Head, Link, usePage, router } from "@inertiajs/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageLoader } from "@/components/shared/PageLoader";
import { ShoppingCart, Banknote, CreditCard, SplitSquareHorizontal, IndianRupee, CheckCircle, Printer } from "lucide-react";
import { INVENTORY_SALES_BREADCRUMBS } from "@/constants/page/admin/inventory";
import inventoryApi from "@/lib/api/inventoryApi";
import { toast } from "sonner";

const BREADCRUMBS = [
    ...INVENTORY_SALES_BREADCRUMBS,
    { title: "COLLECT PAYMENT", href: "#" },
];

export default function InventorySaleCollectPayment() {
    const { id } = usePage().props as unknown as { id: number };
    const queryClient = useQueryClient();

    const { data: res, isLoading } = useQuery({
        queryKey: ["inventory-sale", id],
        queryFn: () => inventoryApi.sales.show(id),
    });
    const sale = res?.data as any;

    const [mode, setMode] = useState<"cash" | "online" | "split">("cash");
    const [amount, setAmount] = useState<string>("");
    const [cashAmount, setCashAmount] = useState<string>("");
    const [onlineAmount, setOnlineAmount] = useState<string>("");
    const [txnId, setTxnId] = useState("");
    const [remarks, setRemarks] = useState("");

    const total = sale ? Number(sale.total_amount) : 0;

    // pre-fill amount when sale loads
    const amountValue = amount !== "" ? parseFloat(amount) || 0 : total;
    const cashValue = cashAmount !== "" ? parseFloat(cashAmount) || 0 : 0;
    const onlineValue = onlineAmount !== "" ? parseFloat(onlineAmount) || 0 : 0;

    const confirmMutation = useMutation({
        mutationFn: (data: Record<string, unknown>) =>
            inventoryApi.sales.confirm(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["inventory-sale", id] });
            queryClient.invalidateQueries({ queryKey: ["inventory-sales"] });
            toast.success("Payment collected! Stock has been updated.");
            router.visit(`/inventory/sales/${sale.id}`);
        },
        onError: (err: any) => {
            const msg =
                err?.response?.data?.message ||
                err?.response?.data?.errors?.[Object.keys(err?.response?.data?.errors ?? {})[0]]?.[0] ||
                err?.message ||
                "Failed to collect payment.";
            toast.error(msg);
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const cash = mode === "cash" ? amountValue : mode === "split" ? cashValue : 0;
        const online = mode === "online" ? amountValue : mode === "split" ? onlineValue : 0;
        const payTotal = mode === "split" ? cash + online : amountValue;

        if (payTotal <= 0) {
            toast.error("Amount must be greater than zero.");
            return;
        }
        if ((mode === "online" || (mode === "split" && online > 0)) && !txnId.trim()) {
            toast.error("Transaction ID / UTR is required for online payment.");
            return;
        }

        confirmMutation.mutate({
            payment_mode: mode,
            amount: payTotal,
            cash_amount: cash,
            online_amount: online,
            transaction_id: txnId.trim() || undefined,
            remarks: remarks.trim() || undefined,
        });
    };

    if (isLoading) {
        return (
            <>
                <Head title="Collect Payment" />
                <PageLoader />
            </>
        );
    }

    if (!sale) {
        return (
            <>
                <Head title="Collect Payment" />
                <div className="p-6 text-destructive">Sale not found.</div>
            </>
        );
    }

    if (sale.payment_status === "paid") {
        return (
            <>
                <Head title="Payment Complete" />
                <div className="space-y-6">
                    <MainPageHeader
                        breadcrumbs={BREADCRUMBS}
                        icon={ShoppingCart}
                        title={`SALE #${sale.id}`}
                        subtitle="Payment Collection"
                        guidance={[]}
                    />
                    <Card className="max-w-md mx-auto mt-10">
                        <CardContent className="py-10 flex flex-col items-center gap-4 text-center">
                            <CheckCircle className="size-12 text-green-500" />
                            <div>
                                <p className="text-lg font-bold">Payment Already Collected!</p>
                                <p className="text-sm text-muted-foreground mt-1">
                                    Sale #{sale.id} is already <span className="text-green-600 font-semibold">paid</span>.
                                </p>
                            </div>
                            <div className="flex gap-2">
                                <Button asChild variant="outline">
                                    <Link href={`/inventory/sales/${sale.id}`}>Back to Sale</Link>
                                </Button>
                                <Button asChild>
                                    <a href={`/api/v1/inventory/sales/${sale.id}/receipt`} target="_blank" rel="noopener noreferrer">
                                        <Printer className="mr-2 h-4 w-4" /> Print Receipt
                                    </a>
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </>
        );
    }

    const modeOptions = [
        { value: "cash", label: "Cash", icon: Banknote },
        { value: "online", label: "Online / UPI", icon: CreditCard },
        { value: "split", label: "Split", icon: SplitSquareHorizontal },
    ];

    const buyerDisplay =
        sale.buyer_name ?? sale.user?.name ?? `Walk-in (${sale.buyer_type})`;

    return (
        <>
            <Head title={`Collect Payment — Sale #${sale.id}`} />
            <div className="space-y-6">
                <MainPageHeader
                    breadcrumbs={BREADCRUMBS}
                    icon={ShoppingCart}
                    title={`COLLECT PAYMENT — SALE #${sale.id}`}
                    subtitle={`${buyerDisplay} · ${new Date(sale.created_at).toLocaleDateString()}`}
                    guidance={["Collecting payment will mark the sale as paid and deduct stock from inventory."]}
                />

                <div className="grid gap-6 sm:grid-cols-[1fr_360px]">
                    {/* Sale summary */}
                    <Card>
                        <CardHeader>
                            <h3 className="text-sm font-semibold">Sale Summary</h3>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Buyer</span>
                                <span className="font-medium">{buyerDisplay}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Status</span>
                                <span className="text-amber-600 font-medium capitalize">{sale.payment_status}</span>
                            </div>
                            <hr />
                            {(sale.lines ?? []).map((line: any) => (
                                <div key={line.id} className="flex justify-between text-xs">
                                    <span>{line.item?.name ?? `Item #${line.inventory_item_id}`} × {line.quantity}</span>
                                    <span className="font-mono">₹{Number(line.amount).toFixed(2)}</span>
                                </div>
                            ))}
                            <hr />
                            <div className="flex justify-between font-bold text-base">
                                <span>Total</span>
                                <span className="flex items-center gap-1">
                                    <IndianRupee className="size-4" />
                                    {Number(sale.total_amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment form */}
                    <Card>
                        <CardHeader>
                            <h3 className="text-sm font-semibold">Payment Details</h3>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Mode selector */}
                                <div className="space-y-2">
                                    <Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                                        Payment Mode
                                    </Label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {modeOptions.map(({ value, label, icon: Icon }) => (
                                            <button
                                                key={value}
                                                type="button"
                                                onClick={() => setMode(value as any)}
                                                className={`flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs font-medium transition-all ${mode === value
                                                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                                                    : "border-border bg-muted/30 text-muted-foreground hover:border-primary/40"
                                                    }`}
                                            >
                                                <Icon className="size-4" />
                                                {label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Amount(s) */}
                                {mode !== "split" ? (
                                    <div className="space-y-1.5">
                                        <Label htmlFor="amount">Amount (₹)</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                                            <Input
                                                id="amount"
                                                type="number"
                                                min={0}
                                                step="0.01"
                                                placeholder={String(total)}
                                                value={amount}
                                                onChange={(e) => setAmount(e.target.value)}
                                                className="pl-7 font-mono"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                                <Label htmlFor="cash">Cash (₹)</Label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                                                    <Input
                                                        id="cash"
                                                        type="number"
                                                        min={0}
                                                        step="0.01"
                                                        value={cashAmount}
                                                        onChange={(e) => setCashAmount(e.target.value)}
                                                        className="pl-7 font-mono"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label htmlFor="online">Online (₹)</Label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">₹</span>
                                                    <Input
                                                        id="online"
                                                        type="number"
                                                        min={0}
                                                        step="0.01"
                                                        value={onlineAmount}
                                                        onChange={(e) => setOnlineAmount(e.target.value)}
                                                        className="pl-7 font-mono"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        {(cashValue + onlineValue) > 0 && (
                                            <p className="text-right text-xs text-muted-foreground -mt-2">
                                                Total: ₹{(cashValue + onlineValue).toFixed(2)}
                                            </p>
                                        )}
                                    </>
                                )}

                                {/* Transaction ID */}
                                {(mode === "online" || mode === "split") && (
                                    <div className="space-y-1.5">
                                        <Label htmlFor="txn">
                                            Transaction ID / UTR
                                            {mode === "online" && <span className="text-destructive ml-1">*</span>}
                                        </Label>
                                        <Input
                                            id="txn"
                                            placeholder="e.g. UPI123456789"
                                            value={txnId}
                                            onChange={(e) => setTxnId(e.target.value)}
                                        />
                                    </div>
                                )}

                                {/* Remarks */}
                                <div className="space-y-1.5">
                                    <Label htmlFor="remarks">Remarks (optional)</Label>
                                    <Input
                                        id="remarks"
                                        placeholder="Optional note"
                                        value={remarks}
                                        onChange={(e) => setRemarks(e.target.value)}
                                    />
                                </div>

                                <div className="flex gap-2 pt-1">
                                    <Button
                                        type="submit"
                                        disabled={confirmMutation.isPending}
                                        className="flex-1 font-semibold"
                                    >
                                        {confirmMutation.isPending ? "Confirming…" : "Confirm"}
                                    </Button>
                                    <Button type="button" variant="outline" asChild>
                                        <Link href={`/inventory/sales/${sale.id}`}>Cancel</Link>
                                    </Button>
                                </div>


                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}
