import { School, Package, Bus, Building2, History, Banknote, Globe } from "lucide-react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import Each from "@/components/Each";

// ── Types ──────────────────────────────────────────────────────
interface SummaryRow {
  label: string;
  amount: number;
  icon: React.ElementType;
  variant?: "default" | "destructive";
}

interface TotalSummaryCardProps {
  feeTotal: number;
  inventoryTotal: number;
  transportTotal: number;
  hostelTotal?: number;
  discountTotal?: number;
  scope?: "school" | "college";
  /** Optional payment info — when provided, renders a payment footer */
  cashAmount?: number;
  onlineAmount?: number;
  dueAmount?: number;
}

// ── Payment stat cards config ──────────────────────────────────
const buildPaymentStats = (cashAmount: number, onlineAmount: number, totalPaid: number, dueAmount: number) => [
  { label: "Cash Collection", value: cashAmount, icon: Banknote, color: "" },
  { label: "Online / UPI", value: onlineAmount, icon: Globe, color: "" },
  { label: "Net Received", value: totalPaid, icon: Banknote, color: "text-green-600", bg: "bg-green-500/10 border-green-500/20" },
  { label: "Due Amount", value: dueAmount, icon: Banknote, color: dueAmount > 0 ? "text-amber-500" : "text-green-600", bg: dueAmount > 0 ? "bg-amber-500/10 border-amber-500/20" : "bg-green-500/10 border-green-500/20" },
];

// ── Component ──────────────────────────────────────────────────
export function TotalSummaryCard({
  feeTotal,
  inventoryTotal,
  transportTotal,
  hostelTotal = 0,
  discountTotal = 0,
  scope = "college",
  cashAmount,
  onlineAmount,
  dueAmount,
}: TotalSummaryCardProps) {
  const isSchool = scope === "school";
  const grandTotal = Math.max(0, feeTotal + inventoryTotal + transportTotal + hostelTotal - discountTotal);
  const showPayment = cashAmount !== undefined || onlineAmount !== undefined;
  const totalPaid = (cashAmount ?? 0) + (onlineAmount ?? 0);

  const rows: SummaryRow[] = [
    { label: isSchool ? "Admission Fees" : "Academic Fees", amount: feeTotal, icon: School },
    { label: isSchool ? "Inventory & Books" : "Inventory & Kits", amount: inventoryTotal, icon: Package },
    { label: "Transport Services", amount: transportTotal, icon: Bus },
    { label: "Hostel Accommodation", amount: hostelTotal, icon: Building2 },
  ];

  // Conditionally add discount row
  if (discountTotal > 0) {
    rows.push({ label: "Concession / Discount", amount: discountTotal, icon: History, variant: "destructive" });
  }

  const paymentStats = showPayment
    ? buildPaymentStats(cashAmount ?? 0, onlineAmount ?? 0, totalPaid, dueAmount ?? 0)
    : [];

  return (
    <div className="w-full border border-border/40 overflow-hidden animate-in fade-in duration-700 bg-background rounded-none">
      <div className="flex flex-col lg:flex-row">
        {/* Fee breakdown – left column */}
        <div className="flex-1 border-b lg:border-b-0 lg:border-r border-border/60 bg-background">
          <Table>
            <TableBody>
              <Each
                of={rows}
                keyExtractor={(row, idx) => row.label}
                render={(row) => (
                  <TableRow className="hover:bg-transparent border-border/40">
                    <TableCell className="py-4 px-6">
                      <div className={`flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] ${row.variant === "destructive" ? "text-destructive" : "text-muted-foreground"}`}>
                        <row.icon className="size-4 shrink-0 opacity-70" />
                        {row.label}
                      </div>
                    </TableCell>
                    <TableCell className={`text-right py-4 px-6 font-semibold tabular-nums ${row.variant === "destructive" ? "text-destructive" : "text-foreground"}`}>
                      {row.variant === "destructive" ? "- " : ""}₹{row.amount.toLocaleString()}
                    </TableCell>
                  </TableRow>
                )}
              />
            </TableBody>
          </Table>
        </div>

        {/* Grand Total – right column */}
        <div className="lg:w-[320px] p-8 flex flex-col justify-center items-center lg:items-end bg-background border-border/40">
          <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground mb-2">
            Grand Total
          </label>
          <div className="flex items-baseline gap-0.5">
            <span className="text-2xl font-black text-blue-700 dark:text-blue-400 mr-1">₹</span>
            <span className="text-5xl lg:text-6xl font-black tracking-tighter text-blue-700 dark:text-blue-400 tabular-nums leading-none">
              {grandTotal.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Payment footer */}
      {showPayment && (
        <div className="border-t border-border/60 bg-background px-6 py-4 flex flex-col gap-3">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <Each
              of={paymentStats}
              keyExtractor={(stat) => stat.label}
              render={(stat) => (
                <div className={`flex items-center gap-2.5 px-4 py-3 rounded-none border ${stat.bg || "bg-background border-border/40"}`}>
                  <stat.icon className="size-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</p>
                    <p className={`text-sm font-bold tabular-nums ${stat.color}`}>₹{stat.value.toLocaleString()}</p>
                  </div>
                </div>
              )}
            />
          </div>
        </div>
      )}
    </div>
  );
}
