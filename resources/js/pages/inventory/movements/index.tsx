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
import { ArrowLeftRight, Plus } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useSearchFilter from "@/hooks/useSearchfilter";
import { useDisclosure } from "@/hooks/useDisclosure";
import inventoryApi from "@/lib/api/inventoryApi";
import { InventoryMovementDialog } from "@/components/admin/inventoryMovementDialog";
import { PermissionGate } from "@/components/PermissionGate";
import {
  INVENTORY_MOVEMENTS_BREADCRUMBS,
  INVENTORY_MOVEMENTS_GUIDELINES,
} from "@/constants/page/admin/inventory";
import { useRegisterGuide } from '@/components/GuideProvider';
import { INVENTORY_MOVEMENTS_GUIDE } from "@/constants/guides/inventory";
import React from 'react';

const COLUMNS = [
  { key: "serial", label: "#" },
  { key: "item", label: "Item" },
  { key: "type", label: "Type" },
  { key: "quantity", label: "Quantity" },
  { key: "quantity_after", label: "Qty after" },
  { key: "performer", label: "By" },
  { key: "created_at", label: "Date" },
];

const INITIAL_FILTERS = {
  page: 1,
  per_page: 15,
  item_id: "",
  type: "__all__",
};

const TYPES = [
  { value: "__all__", label: "All" },
  { value: "issue", label: "Issue" },
  { value: "return", label: "Return" },
  { value: "receive", label: "Receive" },
  { value: "adjust", label: "Adjust" },
];

const InventoryMovementsIndex = () => {
  const queryClient = useQueryClient();
  useRegisterGuide(INVENTORY_MOVEMENTS_GUIDE);
  const { filter, handleFilter } = useSearchFilter(INITIAL_FILTERS);
  const recordDisclosure = useDisclosure();
  const onMovementSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["inventory-movements"] });
    queryClient.invalidateQueries({ queryKey: ["inventory-items"] });
    recordDisclosure.onClose();
  };

  const { data, isLoading } = useQuery({
    queryKey: ["inventory-movements", filter],
    queryFn: () =>
      inventoryApi.movements.index({
        ...filter,
        item_id: filter.item_id || undefined,
        type: filter.type === "__all__" ? undefined : filter.type || undefined,
      }),
  });

  const { data: itemsRes } = useQuery({
    queryKey: ["inventory-items-list"],
    queryFn: () => inventoryApi.items.index({ per_page: 500 }),
  });
  const items = itemsRes?.data ?? [];

  const handleFilterChange = (updates: Record<string, unknown>) => {
    handleFilter({ ...updates, page: 1 });
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
              <FilterBar.Renderer config={{ filters: [{ name: "type", type: "select", label: "Type", placeholder: "Type", options: TYPES }, { name: "item_id", type: "select", label: "Item", placeholder: "All items", options: [{ value: "", label: "All items" }, ...items.map((i: { id: number; name: string; code?: string }) => ({ value: String(i.id), label: `${i.name}${i.code ? ` (${i.code})` : ""}` }))] }] }} />
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
                render={(
                  row: {
                    id: number;
                    type: string;
                    quantity: number;
                    quantity_after?: number;
                    created_at: string;
                    item?: { id: number; name: string };
                    performer?: { name: string };
                  },
                  index
                ) => (
                  <TableRow key={row.id} className="hover:bg-muted/50">
                    <TableCell className="w-16 text-muted-foreground font-mono text-sm">
                      {getSerialNumber(
                        data?.meta?.current_page ?? 1,
                        filter.per_page ?? 15,
                        index
                      )}
                    </TableCell>
                    <TableCell>
                      <Link
                        href={`/inventory/items/${row.item?.id}`}
                        className="text-primary hover:underline"
                      >
                        {row.item?.name ?? "—"}
                      </Link>
                    </TableCell>
                    <TableCell className="capitalize">{row.type}</TableCell>
                    <TableCell className="font-mono">
                      {row.type === 'issue' ? "-" : (Number(row.quantity) > 0 ? "+" : "")}
                      {row.type === 'issue' ? String(row.quantity).replace(/^-/, '') : row.quantity}
                    </TableCell>
                    <TableCell className="font-mono">
                      {row.quantity_after ?? "—"}
                    </TableCell>
                    <TableCell>{row.performer?.name ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(row.created_at).toLocaleString()}
                    </TableCell>
                  </TableRow>
                )}
              />
            </DataTable>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default InventoryMovementsIndex;
