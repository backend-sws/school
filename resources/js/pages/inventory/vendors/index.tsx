import React, { useState, useMemo } from "react";
import { Head, Link } from "@inertiajs/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Building2,
  Plus,
  Pencil,
  Trash2,
  FileSpreadsheet,
  IndianRupee,
  Phone,
  MapPin,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Receipt,
  ExternalLink,
  Search,
  Check,
  ShoppingBag,
  Package,
} from "lucide-react";

import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

import inventoryVendorApi, { type InventoryVendor } from "@/lib/api/inventoryVendorApi";
import inventoryApi from "@/lib/api/inventoryApi";

const defaultDate = () => new Date().toISOString().slice(0, 10);

export default function InventoryVendorsIndex() {
  const queryClient = useQueryClient();

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [balanceFilter, setBalanceFilter] = useState<string>("all");

  // Dialog states
  const [vendorModalOpen, setVendorModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<InventoryVendor | null>(null);

  const [settleModalOpen, setSettleModalOpen] = useState(false);
  const [settleVendor, setSettleVendor] = useState<InventoryVendor | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [vendorToDelete, setVendorToDelete] = useState<InventoryVendor | null>(null);

  const [exportModalOpen, setExportModalOpen] = useState(false);

  // Vendor Form State
  const [vendorForm, setVendorForm] = useState({
    name: "",
    contact_name: "",
    contact_phone: "",
    contact_email: "",
    location: "",
    city: "",
    state: "",
    pincode: "",
    gstin: "",
    pan: "",
    bank_name: "",
    bank_account_no: "",
    bank_ifsc: "",
    credit_limit: "",
    payment_terms: "on-demand",
    is_active: true,
    notes: "",
  });

  // Settle Form State
  const [settleForm, setSettleForm] = useState({
    settlement_date: defaultDate(),
    amount: "",
    payment_mode: "bank_transfer",
    reference_number: "",
    notes: "",
  });

  // Export Form State
  const [exportFilters, setExportFilters] = useState({
    inventory_vendor_id: "all",
    inventory_item_id: "all",
    payment_status: "all",
    from_date: "",
    to_date: "",
  });

  // Fetch Vendors
  const { data: vendorsData, isLoading } = useQuery({
    queryKey: ["inventory-vendors", search, statusFilter],
    queryFn: () =>
      inventoryVendorApi.index({
        search: search || undefined,
        is_active: statusFilter === "all" ? undefined : statusFilter === "active",
        per_page: 200,
      }),
  });

  // Fetch items for export filter
  const { data: itemsData } = useQuery({
    queryKey: ["inventory-items-all"],
    queryFn: () => inventoryApi.items.index({ per_page: 500 }),
    enabled: exportModalOpen,
  });

  const items = useMemo(() => {
    const raw = (itemsData as any)?.data?.data ?? (itemsData as any)?.data ?? itemsData ?? [];
    return Array.isArray(raw) ? raw : [];
  }, [itemsData]);

  const rawVendors: InventoryVendor[] = useMemo(() => {
    const raw = vendorsData?.data;
    if (Array.isArray(raw?.data)) return raw.data;
    if (Array.isArray(raw)) return raw;
    return [];
  }, [vendorsData]);

  // Client-side filter for balance
  const filteredVendors = useMemo(() => {
    return rawVendors.filter((v) => {
      if (balanceFilter === "due_only") {
        return Number(v.outstanding_balance || 0) > 0;
      }
      if (balanceFilter === "cleared") {
        return Number(v.outstanding_balance || 0) <= 0;
      }
      return true;
    });
  }, [rawVendors, balanceFilter]);

  // Aggregate stats
  const stats = useMemo(() => {
    let totalVendors = rawVendors.length;
    let totalOutstanding = 0;
    let totalPurchasesValue = 0;
    let totalSettled = 0;

    rawVendors.forEach((v) => {
      totalOutstanding += Number(v.outstanding_balance || 0);
      totalPurchasesValue += Number(v.total_purchases_amount || 0);
      totalSettled += Number(v.settled_amount || 0);
    });

    return { totalVendors, totalOutstanding, totalPurchasesValue, totalSettled };
  }, [rawVendors]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingVendor(null);
    setVendorForm({
      name: "",
      contact_name: "",
      contact_phone: "",
      contact_email: "",
      location: "",
      city: "",
      state: "",
      pincode: "",
      gstin: "",
      pan: "",
      bank_name: "",
      bank_account_no: "",
      bank_ifsc: "",
      credit_limit: "",
      payment_terms: "on-demand",
      is_active: true,
      notes: "",
    });
    setVendorModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (v: InventoryVendor) => {
    setEditingVendor(v);
    setVendorForm({
      name: v.name,
      contact_name: v.contact_name || "",
      contact_phone: v.contact_phone || "",
      contact_email: v.contact_email || "",
      location: v.location || "",
      city: v.city || "",
      state: v.state || "",
      pincode: v.pincode || "",
      gstin: v.gstin || "",
      pan: v.pan || "",
      bank_name: v.bank_name || "",
      bank_account_no: v.bank_account_no || "",
      bank_ifsc: v.bank_ifsc || "",
      credit_limit: v.credit_limit ? String(v.credit_limit) : "",
      payment_terms: v.payment_terms || "on-demand",
      is_active: v.is_active,
      notes: v.notes || "",
    });
    setVendorModalOpen(true);
  };

  // Open Settle Modal
  const handleOpenSettle = (v: InventoryVendor) => {
    setSettleVendor(v);
    setSettleForm({
      settlement_date: defaultDate(),
      amount: v.outstanding_balance ? String(v.outstanding_balance) : "",
      payment_mode: "bank_transfer",
      reference_number: "",
      notes: "",
    });
    setSettleModalOpen(true);
  };

  // Vendor Save Mutation
  const vendorMutation = useMutation({
    mutationFn: (formData: typeof vendorForm) => {
      const payload: any = {
        ...formData,
        credit_limit: formData.credit_limit ? Number(formData.credit_limit) : 0,
      };
      return editingVendor
        ? inventoryVendorApi.update(editingVendor.id, payload)
        : inventoryVendorApi.store(payload);
    },
    onSuccess: () => {
      toast.success(editingVendor ? "Supplier updated successfully" : "Supplier added successfully");
      queryClient.invalidateQueries({ queryKey: ["inventory-vendors"] });
      setVendorModalOpen(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Failed to save supplier");
    },
  });

  // Delete Vendor Mutation
  const deleteMutation = useMutation({
    mutationFn: (id: number) => inventoryVendorApi.destroy(id),
    onSuccess: () => {
      toast.success("Supplier deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["inventory-vendors"] });
      setDeleteModalOpen(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Cannot delete supplier with active purchase records");
    },
  });

  // Settlement Mutation
  const settleMutation = useMutation({
    mutationFn: (formData: typeof settleForm) => {
      if (!settleVendor) throw new Error("No supplier selected");
      return inventoryVendorApi.settle(settleVendor.id, {
        settlement_date: formData.settlement_date,
        amount: Number(formData.amount),
        payment_mode: formData.payment_mode,
        reference_number: formData.reference_number || undefined,
        notes: formData.notes || undefined,
      });
    },
    onSuccess: (res: any) => {
      toast.success(res?.data?.message || "Settlement payment recorded successfully");
      queryClient.invalidateQueries({ queryKey: ["inventory-vendors"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-purchases"] });
      setSettleModalOpen(false);
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Settlement failed");
    },
  });

  // Download Excel Report
  const handleTriggerExport = (customParams?: Record<string, string>) => {
    const params = customParams || exportFilters;
    const url = inventoryApi.purchases.exportUrl(params);
    window.open(url, "_blank");
    setExportModalOpen(false);
  };

  const breadcrumbs = [
    { title: "Inventory", href: "/inventory/items" },
    { title: "Suppliers & Vendors", href: "/inventory/vendors" },
  ];

  return (
    <>
      <Head title="Inventory Suppliers & Vendors" />

      <TooltipProvider>
        <div className="space-y-6 pb-12">
          {/* Page Header */}
          <MainPageHeader
            id="inventory-vendors-header"
            breadcrumbs={breadcrumbs}
            icon={Building2}
            title="Suppliers & Vendors"
            description="Manage inventory goods suppliers, deferred credit purchases, ledgers, and download purchase Excel reports."
          />

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="gap-2 border-emerald-600/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                onClick={() => setExportModalOpen(true)}
              >
                <FileSpreadsheet className="size-4 text-emerald-600" />
                <span>Export Purchases Excel</span>
              </Button>
            </div>

            <Button onClick={handleOpenCreate} className="gap-2 shadow-sm">
              <Plus className="size-4" />
              <span>Add Supplier</span>
            </Button>
          </div>

          {/* KPI Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Vendors */}
            <Card className="border border-border/70 shadow-sm">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Registered Suppliers
                  </p>
                  <p className="text-2xl font-bold tracking-tight">{stats.totalVendors}</p>
                  <p className="text-[11px] text-muted-foreground">Active inventory suppliers</p>
                </div>
                <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                  <Building2 className="size-5" />
                </div>
              </CardContent>
            </Card>

            {/* Total Outstanding Due */}
            <Card className={`border shadow-sm ${stats.totalOutstanding > 0 ? "border-amber-300 dark:border-amber-900 bg-amber-50/20 dark:bg-amber-950/10" : "border-border/70"}`}>
              <CardContent className="p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1">
                    <AlertTriangle className="size-3.5" /> Total Due / Credit
                  </p>
                  <p className="text-2xl font-bold tracking-tight text-amber-700 dark:text-amber-400">
                    ₹{stats.totalOutstanding.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-[11px] text-muted-foreground">Pending deferred settlements</p>
                </div>
                <div className="size-11 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                  <IndianRupee className="size-5" />
                </div>
              </CardContent>
            </Card>

            {/* Total Purchases Spend */}
            <Card className="border border-border/70 shadow-sm">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Total Purchases
                  </p>
                  <p className="text-2xl font-bold tracking-tight text-foreground">
                    ₹{stats.totalPurchasesValue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-[11px] text-muted-foreground">All logged inventory purchases</p>
                </div>
                <div className="size-11 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                  <ShoppingBag className="size-5" />
                </div>
              </CardContent>
            </Card>

            {/* Total Settled */}
            <Card className="border border-border/70 shadow-sm">
              <CardContent className="p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Total Settled
                  </p>
                  <p className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-400">
                    ₹{stats.totalSettled.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-[11px] text-muted-foreground">Payments made to suppliers</p>
                </div>
                <div className="size-11 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                  <CheckCircle2 className="size-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter Bar */}
          <Card className="border border-border/70">
            <CardContent className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
                  <Input
                    placeholder="Search supplier, contact, city..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active Only</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>

                {/* Outstanding Balance Filter */}
                <Select value={balanceFilter} onValueChange={setBalanceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Balance Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Balances</SelectItem>
                    <SelectItem value="due_only">⚠️ With Pending Due (Credit)</SelectItem>
                    <SelectItem value="cleared">✅ Fully Settled / Zero Due</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Vendors Table */}
          <Card className="border border-border/70 overflow-hidden shadow-sm">
            <CardHeader className="p-4 border-b bg-muted/20 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">Suppliers Directory</CardTitle>
                <CardDescription className="text-xs">
                  Showing {filteredVendors.length} supplier{filteredVendors.length === 1 ? "" : "s"}
                </CardDescription>
              </div>
            </CardHeader>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/40 hover:bg-muted/40">
                    <TableHead className="w-12 text-xs font-semibold">#</TableHead>
                    <TableHead className="text-xs font-semibold">Supplier Name & City</TableHead>
                    <TableHead className="text-xs font-semibold">Contact Details</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Total Purchases</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Total Purchase Value</TableHead>
                    <TableHead className="text-xs font-semibold text-right">Outstanding Due</TableHead>
                    <TableHead className="text-xs font-semibold text-center">Status</TableHead>
                    <TableHead className="text-xs font-semibold text-right w-52">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-32 text-center text-muted-foreground text-sm">
                        Loading suppliers...
                      </TableCell>
                    </TableRow>
                  ) : filteredVendors.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="h-32 text-center text-muted-foreground text-sm">
                        No suppliers found. Click <strong>Add Supplier</strong> to register your first vendor.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredVendors.map((vendor, index) => {
                      const due = Number(vendor.outstanding_balance || 0);
                      return (
                        <TableRow key={vendor.id} className="hover:bg-muted/30 transition-colors">
                          <TableCell className="text-xs text-muted-foreground">{index + 1}</TableCell>

                          {/* Name & Location */}
                          <TableCell>
                            <div className="space-y-0.5">
                              <Link
                                href={`/inventory/vendors/${vendor.id}`}
                                className="font-semibold text-sm text-foreground hover:text-primary hover:underline flex items-center gap-1.5"
                              >
                                <span>{vendor.name}</span>
                                <ExternalLink className="size-3 text-muted-foreground" />
                              </Link>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                {vendor.city && (
                                  <span className="flex items-center gap-1">
                                    <MapPin className="size-3" /> {vendor.city}
                                    {vendor.state ? `, ${vendor.state}` : ""}
                                  </span>
                                )}
                                {vendor.gstin && (
                                  <span className="text-[11px] bg-muted px-1.5 py-0.5 rounded font-mono">
                                    GST: {vendor.gstin}
                                  </span>
                                )}
                              </div>
                            </div>
                          </TableCell>

                          {/* Contact Details */}
                          <TableCell>
                            <div className="text-xs space-y-0.5">
                              {vendor.contact_name && (
                                <p className="font-medium text-foreground">{vendor.contact_name}</p>
                              )}
                              {vendor.contact_phone ? (
                                <a
                                  href={`tel:${vendor.contact_phone}`}
                                  className="text-muted-foreground hover:text-primary flex items-center gap-1"
                                >
                                  <Phone className="size-3" /> {vendor.contact_phone}
                                </a>
                              ) : (
                                <span className="text-muted-foreground/60">—</span>
                              )}
                            </div>
                          </TableCell>

                          {/* Total Purchases */}
                          <TableCell className="text-right text-xs font-medium">
                            {vendor.total_purchases || 0} bills
                          </TableCell>

                          {/* Total Value */}
                          <TableCell className="text-right text-xs font-semibold">
                            ₹{Number(vendor.total_purchases_amount || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                          </TableCell>

                          {/* Outstanding Due */}
                          <TableCell className="text-right">
                            {due > 0 ? (
                              <Badge
                                variant="outline"
                                className="border-amber-400 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold px-2 py-0.5"
                              >
                                ₹{due.toLocaleString("en-IN", { minimumFractionDigits: 2 })} Due
                              </Badge>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                                <Check className="size-3" /> Nil (₹0)
                              </span>
                            )}
                          </TableCell>

                          {/* Status */}
                          <TableCell className="text-center">
                            <Badge
                              variant="secondary"
                              className={
                                vendor.is_active
                                  ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20"
                                  : "bg-muted text-muted-foreground"
                              }
                            >
                              {vendor.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>

                          {/* Actions */}
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Settle button */}
                              {due > 0 && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-8 text-xs border-amber-400 text-amber-700 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30 gap-1 px-2.5"
                                  onClick={() => handleOpenSettle(vendor)}
                                >
                                  <Receipt className="size-3.5" />
                                  <span>Settle</span>
                                </Button>
                              )}

                              {/* View Ledger */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button size="sm" variant="ghost" asChild className="h-8 w-8 p-0">
                                    <Link href={`/inventory/vendors/${vendor.id}`}>
                                      <ExternalLink className="size-3.5" />
                                    </Link>
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>View Complete Ledger</TooltipContent>
                              </Tooltip>

                              {/* Download Report */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-emerald-600 hover:text-emerald-700"
                                    onClick={() => handleTriggerExport({ inventory_vendor_id: String(vendor.id) })}
                                  >
                                    <FileSpreadsheet className="size-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Download Excel for this supplier</TooltipContent>
                              </Tooltip>

                              {/* Edit */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0"
                                    onClick={() => handleOpenEdit(vendor)}
                                  >
                                    <Pencil className="size-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Edit Supplier</TooltipContent>
                              </Tooltip>

                              {/* Delete */}
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                                    onClick={() => {
                                      setVendorToDelete(vendor);
                                      setDeleteModalOpen(true);
                                    }}
                                  >
                                    <Trash2 className="size-3.5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Delete Supplier</TooltipContent>
                              </Tooltip>
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
        </div>

        {/* ─── ADD / EDIT SUPPLIER MODAL (RESPONSIVE & SCROLLABLE) ─────────── */}
        <Dialog open={vendorModalOpen} onOpenChange={setVendorModalOpen}>
          <DialogContent className="w-[95vw] sm:max-w-xl max-h-[85vh] flex flex-col p-0 overflow-hidden">
            <DialogHeader className="p-4 sm:p-5 pb-3 border-b shrink-0 bg-background">
              <DialogTitle className="flex items-center gap-2 text-base">
                <Building2 className="size-5 text-primary" />
                <span>{editingVendor ? "Edit Supplier / Vendor" : "Add Supplier (Inventory Vendor)"}</span>
              </DialogTitle>
              <DialogDescription className="text-xs">
                Register supplier details for stock purchase bills, credit tracking, and ledgers.
              </DialogDescription>
            </DialogHeader>

            <div className="overflow-y-auto px-4 sm:px-6 py-4 space-y-3.5 flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Vendor Name */}
                <div className="space-y-1 sm:col-span-2">
                  <Label htmlFor="iv_name" className="text-xs font-semibold">
                    Supplier / Vendor Name <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="iv_name"
                    placeholder="e.g. Apex Stationery & Book Store"
                    value={vendorForm.name}
                    onChange={(e) => setVendorForm({ ...vendorForm, name: e.target.value })}
                  />
                </div>

                {/* Location */}
                <div className="space-y-1 sm:col-span-2">
                  <Label htmlFor="iv_location" className="text-xs font-semibold">
                    Address / Market Location
                  </Label>
                  <Input
                    id="iv_location"
                    placeholder="e.g. Shop #12, Commercial Complex, Main Market"
                    value={vendorForm.location}
                    onChange={(e) => setVendorForm({ ...vendorForm, location: e.target.value })}
                  />
                </div>

                {/* City */}
                <div className="space-y-1">
                  <Label htmlFor="iv_city" className="text-xs font-semibold">City</Label>
                  <Input
                    id="iv_city"
                    placeholder="e.g. Patna"
                    value={vendorForm.city}
                    onChange={(e) => setVendorForm({ ...vendorForm, city: e.target.value })}
                  />
                </div>

                {/* State */}
                <div className="space-y-1">
                  <Label htmlFor="iv_state" className="text-xs font-semibold">State</Label>
                  <Input
                    id="iv_state"
                    placeholder="e.g. Bihar"
                    value={vendorForm.state}
                    onChange={(e) => setVendorForm({ ...vendorForm, state: e.target.value })}
                  />
                </div>

                {/* Contact Name */}
                <div className="space-y-1">
                  <Label htmlFor="iv_contact" className="text-xs font-semibold">Contact Person</Label>
                  <Input
                    id="iv_contact"
                    placeholder="e.g. Rajesh Kumar"
                    value={vendorForm.contact_name}
                    onChange={(e) => setVendorForm({ ...vendorForm, contact_name: e.target.value })}
                  />
                </div>

                {/* Contact Phone */}
                <div className="space-y-1">
                  <Label htmlFor="iv_phone" className="text-xs font-semibold">Phone Number</Label>
                  <Input
                    id="iv_phone"
                    placeholder="e.g. 9876543210"
                    value={vendorForm.contact_phone}
                    onChange={(e) => setVendorForm({ ...vendorForm, contact_phone: e.target.value })}
                  />
                </div>

                {/* Contact Email */}
                <div className="space-y-1">
                  <Label htmlFor="iv_email" className="text-xs font-semibold">Email (Optional)</Label>
                  <Input
                    id="iv_email"
                    type="email"
                    placeholder="e.g. supplier@example.com"
                    value={vendorForm.contact_email}
                    onChange={(e) => setVendorForm({ ...vendorForm, contact_email: e.target.value })}
                  />
                </div>

                {/* GSTIN */}
                <div className="space-y-1">
                  <Label htmlFor="iv_gstin" className="text-xs font-semibold">GSTIN (Optional)</Label>
                  <Input
                    id="iv_gstin"
                    placeholder="e.g. 10AAAAA0000A1Z5"
                    value={vendorForm.gstin}
                    onChange={(e) => setVendorForm({ ...vendorForm, gstin: e.target.value })}
                  />
                </div>

                {/* Credit Limit */}
                <div className="space-y-1">
                  <Label htmlFor="iv_credit_limit" className="text-xs font-semibold">Credit Limit (₹)</Label>
                  <Input
                    id="iv_credit_limit"
                    type="number"
                    placeholder="e.g. 50000 (0 = No limit)"
                    value={vendorForm.credit_limit}
                    onChange={(e) => setVendorForm({ ...vendorForm, credit_limit: e.target.value })}
                  />
                </div>

                {/* Payment Terms */}
                <div className="space-y-1">
                  <Label htmlFor="iv_terms" className="text-xs font-semibold">Payment Terms</Label>
                  <Select
                    value={vendorForm.payment_terms}
                    onValueChange={(val) => setVendorForm({ ...vendorForm, payment_terms: val })}
                  >
                    <SelectTrigger id="iv_terms">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="on-demand">On-Demand / Flexible</SelectItem>
                      <SelectItem value="weekly">Weekly Settlement</SelectItem>
                      <SelectItem value="monthly">Monthly Settlement</SelectItem>
                      <SelectItem value="quarterly">Quarterly Settlement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Bank Name */}
                <div className="space-y-1">
                  <Label htmlFor="iv_bank" className="text-xs font-semibold">Bank Name (Optional)</Label>
                  <Input
                    id="iv_bank"
                    placeholder="e.g. State Bank of India"
                    value={vendorForm.bank_name}
                    onChange={(e) => setVendorForm({ ...vendorForm, bank_name: e.target.value })}
                  />
                </div>

                {/* Bank Account */}
                <div className="space-y-1">
                  <Label htmlFor="iv_acc" className="text-xs font-semibold">Account Number</Label>
                  <Input
                    id="iv_acc"
                    placeholder="e.g. 30291049102"
                    value={vendorForm.bank_account_no}
                    onChange={(e) => setVendorForm({ ...vendorForm, bank_account_no: e.target.value })}
                  />
                </div>

                {/* Bank IFSC */}
                <div className="space-y-1">
                  <Label htmlFor="iv_ifsc" className="text-xs font-semibold">IFSC Code</Label>
                  <Input
                    id="iv_ifsc"
                    placeholder="e.g. SBIN0001234"
                    value={vendorForm.bank_ifsc}
                    onChange={(e) => setVendorForm({ ...vendorForm, bank_ifsc: e.target.value })}
                  />
                </div>

                {/* Status */}
                <div className="flex items-center justify-between pt-3 border-t sm:col-span-2">
                  <div className="space-y-0.5">
                    <Label htmlFor="iv_active" className="text-xs font-semibold cursor-pointer">Active Supplier</Label>
                    <p className="text-[11px] text-muted-foreground">Available for recording inventory purchases</p>
                  </div>
                  <Switch
                    id="iv_active"
                    checked={vendorForm.is_active}
                    onCheckedChange={(val) => setVendorForm({ ...vendorForm, is_active: val })}
                  />
                </div>

                {/* Notes */}
                <div className="space-y-1 sm:col-span-2">
                  <Label htmlFor="iv_notes" className="text-xs font-semibold">Notes / Special Instructions</Label>
                  <Textarea
                    id="iv_notes"
                    placeholder="e.g. Delivers uniforms every Tuesday, settlement via NEFT..."
                    rows={2}
                    value={vendorForm.notes}
                    onChange={(e) => setVendorForm({ ...vendorForm, notes: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="p-3 sm:p-4 border-t shrink-0 bg-muted/20 flex flex-row items-center justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setVendorModalOpen(false)}>Cancel</Button>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  if (!vendorForm.name.trim()) {
                    toast.error("Please enter supplier name");
                    return;
                  }
                  vendorMutation.mutate(vendorForm);
                }}
                disabled={vendorMutation.isPending}
              >
                {vendorMutation.isPending ? "Saving..." : editingVendor ? "Update Supplier" : "Create Supplier"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ─── SETTLE PAYMENT MODAL (RESPONSIVE & SCROLLABLE) ──────────────── */}
        <Dialog open={settleModalOpen} onOpenChange={setSettleModalOpen}>
          <DialogContent className="w-[95vw] sm:max-w-md max-h-[85vh] flex flex-col p-0 overflow-hidden">
            <DialogHeader className="p-4 sm:p-5 pb-3 border-b shrink-0 bg-background">
              <DialogTitle className="flex items-center gap-2 text-base">
                <Receipt className="size-5 text-amber-600" />
                <span>Record Settlement Payment</span>
              </DialogTitle>
              <DialogDescription className="text-xs">
                Make a payment towards <strong>{settleVendor?.name}</strong> to clear pending credit purchase bills.
              </DialogDescription>
            </DialogHeader>

            <div className="overflow-y-auto px-4 sm:px-6 py-4 space-y-3.5 flex-1">
              {/* Due Balance Info */}
              <div className="rounded-xl p-3.5 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Current Due Balance</p>
                  <p className="text-lg font-bold text-amber-700 dark:text-amber-400">
                    ₹{Number(settleVendor?.outstanding_balance || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </p>
                </div>
                {Number(settleForm.amount) > 0 && (
                  <div className="text-right">
                    <p className="text-xs font-medium text-muted-foreground">Remaining After</p>
                    <p className="text-sm font-semibold text-foreground">
                      ₹{Math.max(0, Number(settleVendor?.outstanding_balance || 0) - Number(settleForm.amount)).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                )}
              </div>

              {/* Settlement Date */}
              <div className="space-y-1">
                <Label htmlFor="is_date" className="text-xs font-semibold">Settlement Date</Label>
                <Input
                  id="is_date"
                  type="date"
                  value={settleForm.settlement_date}
                  onChange={(e) => setSettleForm({ ...settleForm, settlement_date: e.target.value })}
                />
              </div>

              {/* Amount */}
              <div className="space-y-1">
                <Label htmlFor="is_amount" className="text-xs font-semibold">Payment Amount (₹)</Label>
                <Input
                  id="is_amount"
                  type="number"
                  placeholder="Enter amount to pay"
                  value={settleForm.amount}
                  onChange={(e) => setSettleForm({ ...settleForm, amount: e.target.value })}
                />
              </div>

              {/* Payment Mode */}
              <div className="space-y-1">
                <Label htmlFor="is_mode" className="text-xs font-semibold">Payment Mode</Label>
                <Select
                  value={settleForm.payment_mode}
                  onValueChange={(val) => setSettleForm({ ...settleForm, payment_mode: val })}
                >
                  <SelectTrigger id="is_mode">
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

              {/* Reference Number */}
              <div className="space-y-1">
                <Label htmlFor="is_ref" className="text-xs font-semibold">UTR / Cheque / Ref Number</Label>
                <Input
                  id="is_ref"
                  placeholder="e.g. UTR-9182371902"
                  value={settleForm.reference_number}
                  onChange={(e) => setSettleForm({ ...settleForm, reference_number: e.target.value })}
                />
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <Label htmlFor="is_notes" className="text-xs font-semibold">Notes / Remarks</Label>
                <Input
                  id="is_notes"
                  placeholder="e.g. Payment made for books & uniforms purchase"
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

        {/* ─── EXPORT PURCHASES REPORT MODAL ───────────────────────────────── */}
        <Dialog open={exportModalOpen} onOpenChange={setExportModalOpen}>
          <DialogContent className="w-[95vw] sm:max-w-md max-h-[85vh] flex flex-col p-0 overflow-hidden">
            <DialogHeader className="p-4 sm:p-5 pb-3 border-b shrink-0 bg-background">
              <DialogTitle className="flex items-center gap-2 text-base">
                <FileSpreadsheet className="size-5 text-emerald-600" />
                <span>Download Purchases Report</span>
              </DialogTitle>
              <DialogDescription className="text-xs">
                Download an Excel (.xlsx) sheet of inventory purchases filtered by supplier, item, or date range.
              </DialogDescription>
            </DialogHeader>

            <div className="overflow-y-auto px-4 sm:px-6 py-4 space-y-3.5 flex-1">
              {/* Filter by Vendor */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Supplier / Vendor</Label>
                <Select
                  value={exportFilters.inventory_vendor_id}
                  onValueChange={(val) =>
                    setExportFilters({ ...exportFilters, inventory_vendor_id: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Suppliers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">-- All Suppliers --</SelectItem>
                    {rawVendors.map((v) => (
                      <SelectItem key={v.id} value={String(v.id)}>
                        {v.name} {v.city ? `(${v.city})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filter by Item */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Inventory Item</Label>
                <Select
                  value={exportFilters.inventory_item_id}
                  onValueChange={(val) =>
                    setExportFilters({ ...exportFilters, inventory_item_id: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Items" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">-- All Items --</SelectItem>
                    {items.map((it) => (
                      <SelectItem key={it.id} value={String(it.id)}>
                        {it.name} {it.code ? `(${it.code})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filter by Payment Status */}
              <div className="space-y-1">
                <Label className="text-xs font-semibold">Payment Status</Label>
                <Select
                  value={exportFilters.payment_status}
                  onValueChange={(val) =>
                    setExportFilters({ ...exportFilters, payment_status: val })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">-- All Payment Statuses --</SelectItem>
                    <SelectItem value="credit">Credit / Unsettled</SelectItem>
                    <SelectItem value="settled">Settled</SelectItem>
                    <SelectItem value="paid">Direct Paid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="iexp_from" className="text-xs font-semibold">From Date</Label>
                  <Input
                    id="iexp_from"
                    type="date"
                    value={exportFilters.from_date}
                    onChange={(e) => setExportFilters({ ...exportFilters, from_date: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="iexp_to" className="text-xs font-semibold">To Date</Label>
                  <Input
                    id="iexp_to"
                    type="date"
                    value={exportFilters.to_date}
                    onChange={(e) => setExportFilters({ ...exportFilters, to_date: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="p-3 sm:p-4 border-t shrink-0 bg-muted/20 flex flex-row items-center justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setExportModalOpen(false)}>Cancel</Button>
              <Button
                type="button"
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2"
                onClick={() => handleTriggerExport()}
              >
                <FileSpreadsheet className="size-4" />
                <span>Download (.xlsx)</span>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* ─── CONFIRM DELETE MODAL ────────────────────────────────────────── */}
        <ConfirmDialog
          open={deleteModalOpen}
          onOpenChange={setDeleteModalOpen}
          title="Delete Supplier"
          description={`Are you sure you want to delete "${vendorToDelete?.name}"? If there are any associated purchase records, deletion will be blocked.`}
          onConfirm={() => vendorToDelete && deleteMutation.mutate(vendorToDelete.id)}
          isLoading={deleteMutation.isPending}
          confirmText="Delete"
          variant="danger"
          confirmationKeyword="DELETE"
        />
      </TooltipProvider>
    </>
  );
}
