import DataTable, {
  TableEmptyState,
  TableSkeletonLoader,
} from "@/components/dataTable";
import Each from "@/components/Each";
import { MainPageHeader } from "@/components/shared/page/MainPageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TableCell, TableRow } from "@/components/ui/table";
import { FilterBar } from "@/components/filter-bar";
import { getSerialNumber } from "@/lib/utils";
import { Head, Link } from "@inertiajs/react";
import { ArrowLeftRight, CheckCircle2, History, Plus, RotateCcw, AlertTriangle, Info } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useSearchFilter from "@/hooks/useSearchfilter";
import { useDisclosure } from "@/hooks/useDisclosure";
import inventoryApi from "@/lib/api/inventoryApi";
import { InventoryMovementDialog } from "@/components/admin/inventoryMovementDialog";
import { PermissionGate } from "@/components/PermissionGate";
import {
  INVENTORY_MOVEMENTS_BREADCRUMBS,
} from "@/constants/page/admin/inventory";
import { useRegisterGuide } from '@/components/GuideProvider';
import { INVENTORY_MOVEMENTS_GUIDE } from "@/constants/guides/inventory";
import React, { useState } from 'react';
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

interface MovementRow {
  id: number;
  type: string;
  quantity: number | string;
  quantity_after?: number | string;
  created_at: string;
  is_reverted?: boolean;
  reverted_at?: string;
  revert_reason?: string;
  remarks?: string;
  reference_type?: string;
  reference_id?: number;
  item?: { id: number; name: string; code?: string; current_quantity?: number | string };
  performer?: { id: number; name: string };
  revertedBy?: { id: number; name: string };
}

const COLUMNS = [
  { key: "serial", label: "#" },
  { key: "item", label: "Item" },
  { key: "type", label: "Type" },
  { key: "quantity", label: "Quantity" },
  { key: "quantity_after", label: "Qty after" },
  { key: "status", label: "Status" },
  { key: "performer", label: "By" },
  { key: "created_at", label: "Date" },
  { key: "actions", label: "Actions" },
];

const INITIAL_FILTERS = {
  page: 1,
  per_page: 15,
  item_id: "",
  type: "",
  status: "",
};

const TYPES = [
  { value: "", label: "All Types", text: "All Types" },
  { value: "issue", label: "Issue", text: "Issue" },
  { value: "return", label: "Return", text: "Return" },
  { value: "receive", label: "Receive", text: "Receive" },
  { value: "adjust", label: "Adjust", text: "Adjust" },
];

const STATUS_OPTIONS = [
  { value: "", label: "All Status", text: "All Status" },
  { value: "active", label: "Active", text: "Active" },
  { value: "reverted", label: "Reverted", text: "Reverted" },
];

const InventoryMovementsIndex = () => {
  const queryClient = useQueryClient();
  useRegisterGuide(INVENTORY_MOVEMENTS_GUIDE);
  const { filter, handleFilter } = useSearchFilter(INITIAL_FILTERS);
  const recordDisclosure = useDisclosure();

  // Revert Dialog state
  const [revertingMovement, setRevertingMovement] = useState<MovementRow | null>(null);
  const [revertReason, setRevertReason] = useState("");

  // History Dialog state
  const [historyMovement, setHistoryMovement] = useState<MovementRow | null>(null);

  const onMovementSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["inventory-movements"] });
    queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
    queryClient.invalidateQueries({ queryKey: ["inventory-items-list"] });
    recordDisclosure.onClose();
  };

  const { data, isLoading } = useQuery({
    queryKey: ["inventory-movements", filter],
    queryFn: () =>
      inventoryApi.movements.index({
        ...filter,
        item_id: filter.item_id || undefined,
        type: (filter.type === "__all__" || !filter.type) ? undefined : filter.type,
        status: (filter.status === "__all__" || !filter.status) ? undefined : filter.status,
      }),
  });

  const { data: itemsRes } = useQuery({
    queryKey: ["inventory-items-list"],
    queryFn: () => inventoryApi.items.index({ per_page: 500 }),
  });
  const items = (itemsRes as any)?.data ?? itemsRes ?? [];
  const safeItems: Array<{ id: number; name: string; code?: string; current_quantity?: number }> = Array.isArray(items) ? items : [];

  const handleFilterChange = (updates: Record<string, unknown>) => {
    handleFilter({ ...updates, page: 1 });
  };

  // Revert mutation
  const revertMutation = useMutation({
    mutationFn: ({ id, reason }: { id: number; reason: string }) =>
      inventoryApi.movements.revert(id, { reason }),
    onSuccess: () => {
      toast.success("Stock movement reverted successfully. Stock balance updated.");
      queryClient.invalidateQueries({ queryKey: ["inventory-movements"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
      queryClient.invalidateQueries({ queryKey: ["inventory-items-list"] });
      setRevertingMovement(null);
      setRevertReason("");
    },
    onError: (error: any) => {
      const msg = error?.response?.data?.message || "Failed to revert stock movement.";
      toast.error(msg);
    },
  });

  const handleOpenRevert = (row: MovementRow) => {
    setRevertingMovement(row);
    setRevertReason("");
  };

  const handleConfirmRevert = () => {
    if (!revertingMovement) return;
    revertMutation.mutate({
      id: revertingMovement.id,
      reason: revertReason || "Reverted by administrator",
    });
  };

  // Helper to compute projected stock after revert
  const getProjectedStock = (movement: MovementRow) => {
    const matchedItem = safeItems.find((i) => i.id === movement.item?.id);
    const currentStock = Number(matchedItem?.current_quantity ?? movement.item?.current_quantity ?? 0);
    const qty = Number(movement.quantity);

    let reverseDelta = 0;
    if (movement.type === "issue") {
      reverseDelta = Math.abs(qty);
    } else if (movement.type === "receive" || movement.type === "return") {
      reverseDelta = -Math.abs(qty);
    } else if (movement.type === "adjust") {
      reverseDelta = -qty;
    }

    const projected = currentStock + reverseDelta;
    return { currentStock, reverseDelta, projected };
  };

  return (
    <>
      <Head title="Stock Movements" />
      <div className="space-y-6">
        <MainPageHeader
          id="inventory-movements-header"
          breadcrumbs={INVENTORY_MOVEMENTS_BREADCRUMBS}
          icon={ArrowLeftRight}
          guidance={INVENTORY_MOVEMENTS_GUIDE}
        />
        <div className="flex justify-end">
          <PermissionGate can="create_inventory_movements">
            <Button onClick={() => recordDisclosure.onOpen()} className="w-full sm:w-auto">
              <Plus className="size-4" />
              Record movement
            </Button>
          </PermissionGate>
        </div>
        <Card>
          <CardHeader className="pb-4">
            <FilterBar values={filter} onChange={handleFilterChange}>
              <FilterBar.Renderer
                config={{
                  filters: [
                    {
                      name: "type",
                      type: "select",
                      label: "Type",
                      placeholder: "Type",
                      options: TYPES,
                    },
                    {
                      name: "status",
                      type: "select",
                      label: "Status",
                      placeholder: "Status",
                      options: STATUS_OPTIONS,
                    },
                    {
                      name: "item_id",
                      type: "select",
                      label: "Item",
                      placeholder: "All items",
                      options: [
                        { value: "", label: "All items", text: "All items" },
                        ...safeItems.map((i) => ({
                          value: String(i.id),
                          label: `${i.name}${i.code ? ` (${i.code})` : ""}`,
                          text: `${i.name}${i.code ? ` (${i.code})` : ""}`,
                        })),
                      ],
                    },
                  ],
                }}
              />
            </FilterBar>
          </CardHeader>
          <CardContent className="pt-0" id="inventory-movements-table">
            <InventoryMovementDialog
              open={recordDisclosure.isOpen}
              onClose={recordDisclosure.onClose}
              onSuccess={onMovementSuccess}
            />

            <DataTable
              columns={COLUMNS}
              currentPage={data?.meta?.current_page ?? 1}
              lastPage={data?.meta?.last_page ?? 1}
              pageSize={filter.per_page ?? 15}
              totalRecords={data?.meta?.total ?? 0}
              handlePageChange={(page) => handleFilter({ page })}
              handlePageSizeChange={(size) =>
                handleFilter({ per_page: size, page: 1 })
              }
            >
              <Each
                isLoading={isLoading}
                of={data?.data}
                nodatafound={
                  <TableEmptyState
                    colSpan={COLUMNS.length}
                    message="No movements found"
                    description="Record a movement using the button above."
                  />
                }
                fallback={
                  <TableSkeletonLoader columns={COLUMNS.length} />
                }
                render={(row: MovementRow, index) => {
                  const isReverted = Boolean(row.is_reverted);

                  return (
                    <TableRow
                      key={row.id}
                      className={`hover:bg-muted/50 transition-colors ${
                        isReverted ? "bg-muted/20 text-muted-foreground" : ""
                      }`}
                    >
                      <TableCell className="w-16 text-muted-foreground font-mono text-sm">
                        {getSerialNumber(
                          data?.meta?.current_page ?? 1,
                          filter.per_page ?? 15,
                          index
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <Link
                            href={`/inventory/items/${row.item?.id}`}
                            className={`font-medium hover:underline ${
                              isReverted
                                ? "text-muted-foreground line-through opacity-80"
                                : "text-primary"
                            }`}
                          >
                            {row.item?.name ?? "—"}
                          </Link>
                          {row.item?.code && (
                            <span className="text-xs text-muted-foreground font-mono">
                              {row.item.code}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="capitalize">{row.type}</TableCell>
                      <TableCell className="font-mono">
                        <span
                          className={
                            row.type === "issue"
                              ? "text-rose-600 dark:text-rose-400 font-semibold"
                              : "text-emerald-600 dark:text-emerald-400 font-semibold"
                          }
                        >
                          {row.type === "issue"
                            ? "-"
                            : Number(row.quantity) > 0
                            ? "+"
                            : ""}
                          {row.type === "issue"
                            ? String(row.quantity).replace(/^-/, "")
                            : row.quantity}
                        </span>
                      </TableCell>
                      <TableCell className="font-mono">
                        {row.quantity_after ?? "—"}
                      </TableCell>
                      <TableCell>
                        {isReverted ? (
                          <button
                            type="button"
                            onClick={() => setHistoryMovement(row)}
                            className="inline-flex items-center"
                            title="Click to view revert details"
                          >
                            <Badge
                              variant="destructive"
                              className="bg-destructive/10 text-destructive hover:bg-destructive/20 border-destructive/20 gap-1 font-medium cursor-pointer"
                            >
                              <RotateCcw className="size-3" /> Reverted
                            </Badge>
                          </button>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800 gap-1 font-medium"
                          >
                            <CheckCircle2 className="size-3" /> Active
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{row.performer?.name ?? "—"}</TableCell>
                      <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                        {new Date(row.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center gap-1.5 justify-end">
                          {isReverted ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setHistoryMovement(row)}
                              className="h-8 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                            >
                              <History className="size-3.5" /> History
                            </Button>
                          ) : (
                            <PermissionGate can="create_inventory_movements">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpenRevert(row)}
                                className="h-8 gap-1.5 text-xs text-destructive hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                              >
                                <RotateCcw className="size-3.5" /> Revert
                              </Button>
                            </PermissionGate>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                }}
              />
            </DataTable>
          </CardContent>
        </Card>
      </div>

      {/* ── Revert Confirmation Dialog ── */}
      <Dialog
        open={Boolean(revertingMovement)}
        onOpenChange={(open) => !open && setRevertingMovement(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <RotateCcw className="size-5" /> Revert Stock Movement
            </DialogTitle>
            <DialogDescription>
              This will restore the inventory stock for this item and mark this movement as reverted.
            </DialogDescription>
          </DialogHeader>

          {revertingMovement && (() => {
            const { currentStock, reverseDelta, projected } = getProjectedStock(revertingMovement);
            const isNegativeAlert = projected < 0;

            return (
              <div className="space-y-4 py-2">
                {/* Movement details preview */}
                <div className="rounded-lg border bg-muted/40 p-3.5 space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Item:</span>
                    <span className="font-medium text-foreground">{revertingMovement.item?.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Original Movement:</span>
                    <span className="capitalize font-medium">
                      {revertingMovement.type} ({revertingMovement.quantity})
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Current Stock:</span>
                    <span className="font-mono font-medium">{currentStock}</span>
                  </div>
                  <div className="flex justify-between items-center border-t pt-2 font-medium">
                    <span className="text-muted-foreground">Stock After Revert:</span>
                    <span
                      className={`font-mono text-base ${
                        isNegativeAlert ? "text-destructive font-bold" : "text-emerald-600 dark:text-emerald-400 font-bold"
                      }`}
                    >
                      {projected} {reverseDelta > 0 ? `(+${reverseDelta})` : `(${reverseDelta})`}
                    </span>
                  </div>
                </div>

                {isNegativeAlert && (
                  <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-destructive text-sm flex gap-2 items-start">
                    <AlertTriangle className="size-4 shrink-0 mt-0.5" />
                    <span>
                      Cannot revert: Resulting stock would become negative ({projected}). Current stock is insufficient.
                    </span>
                  </div>
                )}

                {/* Reason Input */}
                <div className="space-y-2">
                  <Label htmlFor="revert-reason">
                    Reason for Revert <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="revert-reason"
                    placeholder="e.g. Accidental issue, entered incorrect quantity, order cancelled..."
                    value={revertReason}
                    onChange={(e) => setRevertReason(e.target.value)}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    This reason will be preserved in the movement audit history.
                  </p>
                </div>
              </div>
            );
          })()}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setRevertingMovement(null)}
              disabled={revertMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmRevert}
              disabled={
                revertMutation.isPending ||
                (revertingMovement && getProjectedStock(revertingMovement).projected < 0)
              }
            >
              {revertMutation.isPending ? "Reverting..." : "Confirm Revert"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Movement History & Audit Dialog ── */}
      <Dialog
        open={Boolean(historyMovement)}
        onOpenChange={(open) => !open && setHistoryMovement(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <History className="size-5 text-primary" /> Movement History & Audit
            </DialogTitle>
            <DialogDescription>
              Complete audit trail for Movement #{historyMovement?.id}
            </DialogDescription>
          </DialogHeader>

          {historyMovement && (
            <div className="space-y-4 py-2 text-sm">
              {/* Item Info Banner */}
              <div className="rounded-lg bg-primary/5 border border-primary/20 p-3 flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-primary">{historyMovement.item?.name}</h4>
                  {historyMovement.item?.code && (
                    <span className="text-xs text-muted-foreground font-mono">
                      Code: {historyMovement.item.code}
                    </span>
                  )}
                </div>
                {historyMovement.is_reverted ? (
                  <Badge variant="destructive" className="bg-destructive/10 text-destructive border-destructive/20 gap-1">
                    <RotateCcw className="size-3" /> Reverted
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    <CheckCircle2 className="size-3" /> Active
                  </Badge>
                )}
              </div>

              {/* Timeline Cards */}
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-muted-foreground/20">
                {/* 1. Original Movement Record */}
                <div className="relative">
                  <span className="absolute -left-6 top-1 size-4 rounded-full bg-primary border-4 border-background" />
                  <div className="rounded-md border p-3 bg-card space-y-1.5 shadow-sm">
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      <span className="font-semibold text-foreground uppercase tracking-wider">
                        Movement Recorded
                      </span>
                      <span>{new Date(historyMovement.created_at).toLocaleString()}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                      <div>
                        <span className="text-muted-foreground">Type: </span>
                        <span className="font-medium capitalize">{historyMovement.type}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Quantity: </span>
                        <span className="font-mono font-medium">{historyMovement.quantity}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Recorded By: </span>
                        <span className="font-medium">{historyMovement.performer?.name ?? "—"}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Qty After Entry: </span>
                        <span className="font-mono font-medium">{historyMovement.quantity_after ?? "—"}</span>
                      </div>
                    </div>
                    {historyMovement.remarks && (
                      <div className="text-xs pt-1 text-muted-foreground border-t mt-1">
                        Remarks: <span className="text-foreground">{historyMovement.remarks}</span>
                      </div>
                    )}
                    {historyMovement.reference_type && (
                      <div className="text-xs text-muted-foreground">
                        Reference: <span className="font-mono">{historyMovement.reference_type} #{historyMovement.reference_id}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Revert Audit Details (if reverted) */}
                {historyMovement.is_reverted && (
                  <div className="relative">
                    <span className="absolute -left-6 top-1 size-4 rounded-full bg-destructive border-4 border-background" />
                    <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3 space-y-2 shadow-sm">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-destructive uppercase tracking-wider flex items-center gap-1">
                          <RotateCcw className="size-3.5" /> Reverted Record
                        </span>
                        <span className="text-muted-foreground">
                          {historyMovement.reverted_at
                            ? new Date(historyMovement.reverted_at).toLocaleString()
                            : "—"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                        <div>
                          <span className="text-muted-foreground">Reverted By: </span>
                          <span className="font-medium text-foreground">
                            {historyMovement.revertedBy?.name ?? "Administrator"}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Stock Status: </span>
                          <span className="font-medium text-emerald-600 dark:text-emerald-400">
                            Restored
                          </span>
                        </div>
                      </div>
                      <div className="rounded bg-background/60 p-2 text-xs border border-destructive/10 mt-1">
                        <span className="font-medium text-muted-foreground block mb-0.5">
                          Revert Reason:
                        </span>
                        <p className="text-foreground italic">
                          "{historyMovement.revert_reason || "Reverted by user"}"
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setHistoryMovement(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InventoryMovementsIndex;
