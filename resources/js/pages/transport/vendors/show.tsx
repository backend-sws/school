import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Fuel,
  ArrowLeft,
  FileSpreadsheet,
  IndianRupee,
  Building2,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  FileText,
  CreditCard,
  Clock,
  Car,
  User,
  ExternalLink,
} from "lucide-react";

import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

import fuelVendorApi, { type VendorLedgerResponse } from "@/lib/api/fuelVendorApi";
import transportApi from "@/lib/api/transportApi";

const defaultDate = () => new Date().toISOString().slice(0, 10);

interface VendorShowProps {
  id: number;
}

export default function FuelVendorShow({ id }: VendorShowProps) {
  const queryClient = useQueryClient();
  const [settleModalOpen, setSettleModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("refills");

  // Settle Form State
  const [settleForm, setSettleForm] = useState({
    settlement_date: defaultDate(),
    amount: "",
    payment_mode: "bank_transfer",
    reference_number: "",
    notes: "",
  });

  // Query Vendor Ledger
  const { data: ledgerData, isLoading } = useQuery({
    queryKey: ["transport-fuel-vendor-ledger", id],
    queryFn: () => fuelVendorApi.ledger(id),
  });

  const rawData: any = ledgerData?.data;
  const payload: VendorLedgerResponse | undefined = rawData?.data ?? rawData;
  const vendor = payload?.vendor;
  const fuelLogs = payload?.fuel_logs ?? [];
  const settlements = payload?.settlements ?? [];
  const summary = payload?.summary ?? {
    total_credit: 0,
    total_paid_direct: 0,
    total_settled: 0,
    outstanding: 0,
  };

  // Open Settle Modal
  const handleOpenSettle = () => {
    setSettleForm({
      settlement_date: defaultDate(),
      amount: summary.outstanding ? String(summary.outstanding) : "",
      payment_mode: "bank_transfer",
      reference_number: "",
      notes: "",
    });
    setSettleModalOpen(true);
  };

  // Settle Mutation
  const settleMutation = useMutation({
    mutationFn: (formData: typeof settleForm) => {
      return fuelVendorApi.settle(id, {
        settlement_date: formData.settlement_date,
        amount: Number(formData.amount),
        payment_mode: formData.payment_mode,
        reference_number: formData.reference_number || undefined,
        notes: formData.notes || undefined,
      });
    },
    onSuccess: (res: any) => {
      toast.success(res?.data?.message || "Settlement payment recorded successfully");
      queryClient.invalidateQueries({ queryKey: ["transport-fuel-vendor-ledger", id] });
      queryClient.invalidateQueries({ queryKey: ["transport-fuel-vendors"] });
      queryClient.invalidateQueries({ queryKey: ["transport-vehicle-fuels"] });
      setSettleModalOpen(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Settlement failed");
    },
  });

  // Export vendor-specific Excel
  const handleExportVendorExcel = () => {
    const url = transportApi.vehicleFuels.exportUrl({ transport_fuel_vendor_id: String(id) });
    window.open(url, "_blank");
  };

  const breadcrumbs = [
    { title: "Transport", href: "/transport" },
    { title: "Fuel Vendors", href: "/transport/vendors" },
    { title: vendor?.name || "Vendor Details", href: `/transport/vendors/${id}` },
  ];

  if (isLoading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Loading fuel vendor details & ledger...
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <p>Vendor not found.</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/transport/vendors">Return to Vendors List</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Head title={`${vendor.name} — Fuel Ledger`} />

      <div className="space-y-6 pb-12">
        {/* Header with Back button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild className="h-9 w-9">
              <Link href="/transport/vendors">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-foreground">{vendor.name}</h1>
                <Badge
                  variant="secondary"
                  className={
                    vendor.is_active
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                      : "bg-muted text-muted-foreground"
                  }
                >
                  {vendor.is_active ? "Active Pump" : "Inactive"}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground mt-1">
                {vendor.city && (
                  <span className="flex items-center gap-1">
                    <MapPin className="size-3" /> {vendor.location ? `${vendor.location}, ` : ""}{vendor.city}
                    {vendor.state ? `, ${vendor.state}` : ""}
                  </span>
                )}
                {vendor.contact_name && (
                  <span className="flex items-center gap-1">
                    <User className="size-3" /> {vendor.contact_name}
                  </span>
                )}
                {vendor.contact_phone && (
                  <a href={`tel:${vendor.contact_phone}`} className="flex items-center gap-1 hover:underline text-primary">
                    <Phone className="size-3" /> {vendor.contact_phone}
                  </a>
                )}
                {vendor.gstin && (
                  <span className="font-mono bg-muted px-1.5 py-0.5 rounded text-[11px]">
                    GST: {vendor.gstin}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleExportVendorExcel}
              className="gap-2 border-emerald-600/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
            >
              <FileSpreadsheet className="size-4 text-emerald-600" />
              <span>Download Pump Excel</span>
            </Button>

            {summary.outstanding > 0 && (
              <Button onClick={handleOpenSettle} className="gap-2 bg-amber-600 hover:bg-amber-700 text-white">
                <Receipt className="size-4" />
                <span>Settle Due (₹{summary.outstanding.toLocaleString("en-IN")})</span>
              </Button>
            )}
          </div>
        </div>

        {/* Ledger Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Outstanding Due */}
          <Card className={`border shadow-sm ${summary.outstanding > 0 ? "border-amber-400 bg-amber-50/20 dark:bg-amber-950/20" : "border-border/70"}`}>
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <AlertTriangle className="size-3.5" /> Net Balance Due
                </p>
                <p className="text-2xl font-bold tracking-tight text-amber-700 dark:text-amber-400">
                  ₹{summary.outstanding.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {summary.outstanding > 0 ? "Pending payment settlement" : "All credit cleared"}
                </p>
              </div>
              <div className="size-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <IndianRupee className="size-5" />
              </div>
            </CardContent>
          </Card>

          {/* Total Credit Refills */}
          <Card className="border border-border/70 shadow-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total Credit Taken
                </p>
                <p className="text-2xl font-bold tracking-tight text-foreground">
                  ₹{summary.total_credit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] text-muted-foreground">Deferred payment refills</p>
              </div>
              <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Fuel className="size-5" />
              </div>
            </CardContent>
          </Card>

          {/* Total Settled */}
          <Card className="border border-border/70 shadow-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Total Settled Paid
                </p>
                <p className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
                  ₹{summary.total_settled.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] text-muted-foreground">Cleared via settlements</p>
              </div>
              <div className="size-11 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <CheckCircle2 className="size-5" />
              </div>
            </CardContent>
          </Card>

          {/* Direct Paid */}
          <Card className="border border-border/70 shadow-sm">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Direct Spot Paid
                </p>
                <p className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
                  ₹{summary.total_paid_direct.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] text-muted-foreground">Paid on refill spot (cash/UPI)</p>
              </div>
              <div className="size-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <CreditCard className="size-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs: Refills & Settlements */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="refills" className="gap-2">
              <Fuel className="size-4" />
              <span>Fuel Refills ({fuelLogs.length})</span>
            </TabsTrigger>
            <TabsTrigger value="settlements" className="gap-2">
              <Receipt className="size-4" />
              <span>Settlement Payments ({settlements.length})</span>
            </TabsTrigger>
          </TabsList>

          {/* ─── TAB 1: FUEL REFILLS TABLE ───────────────────────────────── */}
          <TabsContent value="refills">
            <Card className="border border-border/70 shadow-sm">
              <CardHeader className="p-4 border-b bg-muted/20 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Fuel Refill History</CardTitle>
                  <CardDescription className="text-xs">
                    All vehicle oil fillings recorded at {vendor.name}
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-xs border-emerald-600/30 text-emerald-700 dark:text-emerald-400"
                  onClick={handleExportVendorExcel}
                >
                  <FileSpreadsheet className="size-3.5" />
                  <span>Excel Export</span>
                </Button>
              </CardHeader>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead className="w-12 text-xs font-semibold">#</TableHead>
                      <TableHead className="text-xs font-semibold">Refill Date & Time</TableHead>
                      <TableHead className="text-xs font-semibold">Vehicle</TableHead>
                      <TableHead className="text-xs font-semibold">Driver</TableHead>
                      <TableHead className="text-xs font-semibold text-right">Quantity (L)</TableHead>
                      <TableHead className="text-xs font-semibold text-right">Rate / L</TableHead>
                      <TableHead className="text-xs font-semibold text-right">Total (₹)</TableHead>
                      <TableHead className="text-xs font-semibold text-center">Payment Status</TableHead>
                      <TableHead className="text-xs font-semibold">Bill / Slip No</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fuelLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="h-32 text-center text-muted-foreground text-sm">
                          No fuel refills recorded yet at this petrol pump.
                        </TableCell>
                      </TableRow>
                    ) : (
                      fuelLogs.map((log: any, idx: number) => {
                        const status = log.payment_status || "paid";
                        return (
                          <TableRow key={log.id} className="hover:bg-muted/30">
                            <TableCell className="text-xs text-muted-foreground">{idx + 1}</TableCell>

                            {/* Date */}
                            <TableCell className="text-xs whitespace-nowrap">
                              <span className="font-medium">
                                {typeof log.fuel_date === "string" ? log.fuel_date.slice(0, 10) : "—"}
                              </span>
                              {log.fuel_time && (
                                <span className="text-muted-foreground ml-1.5 text-[11px]">
                                  {log.fuel_time.slice(0, 5)}
                                </span>
                              )}
                            </TableCell>

                            {/* Vehicle */}
                            <TableCell>
                              <div className="text-xs space-y-0.5">
                                <span className="font-semibold text-foreground flex items-center gap-1">
                                  <Car className="size-3 text-muted-foreground" />
                                  {log.transport_vehicle?.registration_number ?? "—"}
                                </span>
                                {log.transport_vehicle?.vehicle_type && (
                                  <span className="text-[11px] text-muted-foreground capitalize">
                                    {log.transport_vehicle.vehicle_type}
                                  </span>
                                )}
                              </div>
                            </TableCell>

                            {/* Driver */}
                            <TableCell className="text-xs">
                              {log.transport_driver?.name ?? "—"}
                            </TableCell>

                            {/* Liters */}
                            <TableCell className="text-right text-xs font-medium">
                              {Number(log.liters || 0).toFixed(2)} L
                            </TableCell>

                            {/* Rate */}
                            <TableCell className="text-right text-xs text-muted-foreground">
                              ₹{Number(log.rate_per_liter || 0).toFixed(2)}
                            </TableCell>

                            {/* Total Amount */}
                            <TableCell className="text-right text-xs font-bold text-foreground">
                              ₹{Number(log.total_amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                            </TableCell>

                            {/* Payment Status */}
                            <TableCell className="text-center">
                              {status === "credit" ? (
                                <Badge variant="outline" className="border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-semibold text-[11px]">
                                  ⏳ Credit (Due)
                                </Badge>
                              ) : status === "settled" ? (
                                <Badge variant="outline" className="border-blue-400 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold text-[11px]">
                                  ✅ Settled
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-semibold text-[11px]">
                                  Direct Paid
                                </Badge>
                              )}
                            </TableCell>

                            {/* Bill / Invoice */}
                            <TableCell className="text-xs">
                              <div className="flex items-center gap-2">
                                {log.invoice_number ? (
                                  <span className="font-mono text-[11px] bg-muted px-1.5 py-0.5 rounded">
                                    {log.invoice_number}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground/60">—</span>
                                )}
                                {log.bill_url && (
                                  <a
                                    href={log.bill_url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-primary hover:underline"
                                    title="View Bill"
                                  >
                                    <FileText className="size-3.5" />
                                  </a>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>

          {/* ─── TAB 2: SETTLEMENTS TABLE ────────────────────────────────── */}
          <TabsContent value="settlements">
            <Card className="border border-border/70 shadow-sm">
              <CardHeader className="p-4 border-b bg-muted/20 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Payment Settlements</CardTitle>
                  <CardDescription className="text-xs">
                    Payments made to {vendor.name} to clear credit fuel bills
                  </CardDescription>
                </div>
                {summary.outstanding > 0 && (
                  <Button size="sm" onClick={handleOpenSettle} className="gap-1.5 text-xs bg-amber-600 hover:bg-amber-700 text-white">
                    <Receipt className="size-3.5" />
                    <span>Record Settlement</span>
                  </Button>
                )}
              </CardHeader>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead className="w-12 text-xs font-semibold">#</TableHead>
                      <TableHead className="text-xs font-semibold">Settlement Date</TableHead>
                      <TableHead className="text-xs font-semibold text-right">Amount Settled (₹)</TableHead>
                      <TableHead className="text-xs font-semibold">Payment Mode</TableHead>
                      <TableHead className="text-xs font-semibold">UTR / Reference No</TableHead>
                      <TableHead className="text-xs font-semibold">Remarks / Notes</TableHead>
                      <TableHead className="text-xs font-semibold text-right">Recorded At</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {settlements.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-32 text-center text-muted-foreground text-sm">
                          No settlements recorded yet for this petrol pump.
                        </TableCell>
                      </TableRow>
                    ) : (
                      settlements.map((s: any, idx: number) => (
                        <TableRow key={s.id} className="hover:bg-muted/30">
                          <TableCell className="text-xs text-muted-foreground">{idx + 1}</TableCell>

                          {/* Settlement Date */}
                          <TableCell className="text-xs font-semibold">
                            {typeof s.settlement_date === "string" ? s.settlement_date.slice(0, 10) : "—"}
                          </TableCell>

                          {/* Amount */}
                          <TableCell className="text-right text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            ₹{Number(s.amount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </TableCell>

                          {/* Payment Mode */}
                          <TableCell className="text-xs capitalize">
                            <Badge variant="secondary" className="font-normal text-xs">
                              {s.payment_mode ? s.payment_mode.replace("_", " ") : "Bank Transfer"}
                            </Badge>
                          </TableCell>

                          {/* Reference No */}
                          <TableCell className="text-xs font-mono">
                            {s.reference_number || "—"}
                          </TableCell>

                          {/* Notes */}
                          <TableCell className="text-xs text-muted-foreground max-w-xs truncate">
                            {s.notes || "—"}
                          </TableCell>

                          {/* Recorded At */}
                          <TableCell className="text-right text-xs text-muted-foreground">
                            {s.created_at ? new Date(s.created_at).toLocaleDateString("en-IN") : "—"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* ─── SETTLE PAYMENT MODAL ────────────────────────────────────────── */}
        <Dialog open={settleModalOpen} onOpenChange={setSettleModalOpen}>
          <DialogContent className="w-[95vw] sm:max-w-md max-h-[85vh] flex flex-col p-0 overflow-hidden">
            <DialogHeader className="p-4 sm:p-5 pb-3 border-b shrink-0 bg-background">
              <DialogTitle className="flex items-center gap-2 text-base">
                <Receipt className="size-5 text-amber-600" />
                <span>Record Settlement Payment</span>
              </DialogTitle>
              <DialogDescription className="text-xs">
                Make a payment towards <strong>{vendor.name}</strong> to clear pending credit fuel entries.
              </DialogDescription>
            </DialogHeader>

            <div className="overflow-y-auto px-4 sm:px-6 py-4 space-y-3.5 flex-1">
              <div className="rounded-xl p-3.5 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Current Due Balance</p>
                  <p className="text-lg font-bold text-amber-700 dark:text-amber-400">
                    ₹{summary.outstanding.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                {Number(settleForm.amount) > 0 && (
                  <div className="text-right">
                    <p className="text-xs font-medium text-muted-foreground">Remaining After</p>
                    <p className="text-sm font-semibold text-foreground">
                      ₹{Math.max(0, summary.outstanding - Number(settleForm.amount)).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <Label htmlFor="s_date" className="text-xs font-semibold">Settlement Date</Label>
                <Input
                  id="s_date"
                  type="date"
                  value={settleForm.settlement_date}
                  onChange={(e) => setSettleForm({ ...settleForm, settlement_date: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="s_amount" className="text-xs font-semibold">Payment Amount (₹)</Label>
                <Input
                  id="s_amount"
                  type="number"
                  placeholder="Enter amount to pay"
                  value={settleForm.amount}
                  onChange={(e) => setSettleForm({ ...settleForm, amount: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="s_mode" className="text-xs font-semibold">Payment Mode</Label>
                <Select
                  value={settleForm.payment_mode}
                  onValueChange={(val) => setSettleForm({ ...settleForm, payment_mode: val })}
                >
                  <SelectTrigger id="s_mode">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank_transfer">Bank Transfer / NEFT / RTGS</SelectItem>
                    <SelectItem value="upi">UPI / Online</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="cash">Cash</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label htmlFor="s_ref" className="text-xs font-semibold">UTR / Cheque / Ref Number</Label>
                <Input
                  id="s_ref"
                  placeholder="e.g. UTR-8291039120"
                  value={settleForm.reference_number}
                  onChange={(e) => setSettleForm({ ...settleForm, reference_number: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <Label htmlFor="s_notes" className="text-xs font-semibold">Notes / Remarks</Label>
                <Input
                  id="s_notes"
                  placeholder="e.g. Cleared bills up to 15th Sept"
                  value={settleForm.notes}
                  onChange={(e) => setSettleForm({ ...settleForm, notes: e.target.value })}
                />
              </div>
            </div>

            <DialogFooter className="p-3 sm:p-4 border-t shrink-0 bg-muted/20 flex flex-row items-center justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setSettleModalOpen(false)}>Cancel</Button>
              <Button
                type="button"
                size="sm"
                className="bg-amber-600 hover:bg-amber-700 text-white"
                onClick={() => {
                  if (!settleForm.amount || Number(settleForm.amount) <= 0) {
                    toast.error("Please enter a valid amount");
                    return;
                  }
                  settleMutation.mutate(settleForm);
                }}
                disabled={settleMutation.isPending}
              >
                {settleMutation.isPending ? "Recording..." : "Confirm & Settle"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
