import React from "react";
import { Control, FieldValues, UseFormWatch } from "react-hook-form";
import Each from "@/components/Each";
import DataTable, { TableSkeletonLoader } from "@/components/dataTable";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { AsyncSelectField } from "@/components/shared/AsyncSelectField";
import { FORM_TYPE } from "@/constants";
import { Trash2, Plus, Package } from "lucide-react";
import type { AsyncSelectConfig } from "@/types";

// ── Column Config ──────────────────────────────────────────────
const INVENTORY_COLUMNS = [
  { key: "item", label: "Item" },
  { key: "price", label: "Price (₹)" },
  { key: "qty", label: "Qty" },
  { key: "total", label: "Total" },
  { key: "actions", label: "" },
];

// ── Props ──────────────────────────────────────────────────────
interface InventoryTableProps<T extends FieldValues> {
  control: Control<T>;
  watch: UseFormWatch<T>;
  name: string;
  inventoryAsyncConfig: AsyncSelectConfig;
  selectedId: string | number;
  onSelectedIdChange: (id: string | number, meta?: { name: string; selling_price: number }) => void;
  onAdd: () => void;
  addPlaceholder?: string;
  fields: any[];
  onRemove: (index: number) => void;
  isLoading?: boolean;
}

// ── Component ──────────────────────────────────────────────────
export function InventoryTable<T extends FieldValues>({
  control,
  watch,
  name,
  inventoryAsyncConfig,
  selectedId,
  onSelectedIdChange,
  onAdd,
  addPlaceholder = "Search kits/books...",
  fields,
  onRemove,
  isLoading = false,
}: InventoryTableProps<T>) {
  return (
    <div className="rounded-none border border-border/40 overflow-hidden text-sm bg-background">
      <DataTable
        columns={INVENTORY_COLUMNS}
        isPaginated={false}
        maxHeight="none"
        variant="outline"
      >
        <Each
          of={fields}
          isLoading={isLoading}
          keyExtractor={(field) => (field as { id?: string }).id ?? ""}
          fallback={<TableSkeletonLoader columns={INVENTORY_COLUMNS.length} rows={2} />}
          nodatafound={
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={INVENTORY_COLUMNS.length} className="h-[200px]">
                <div className="flex flex-col items-center justify-center text-center py-8">
                  <Package className="size-8 text-muted-foreground/30 mb-3" />
                  <h3 className="text-base font-bold text-foreground">No inventory items added</h3>
                  <p className="text-sm text-muted-foreground mt-1">Use the search below to add kits, books, or other items.</p>
                </div>
              </TableCell>
            </TableRow>
          }
          render={(field, idx) => {
            const title = (field as any)._title ?? "Unknown Item";
            const price = Number(watch(`${name}.${idx}.price` as any)) || 0;
            const qty = Number(watch(`${name}.${idx}.quantity` as any)) || 0;
            return (
              <TableRow className="hover:bg-muted/50">
                <TableCell className="font-medium">{title}</TableCell>
                <TableCell>₹{price.toLocaleString()}</TableCell>
                <TableCell>
                  <ControlledFormComponent
                    control={control as Control<FieldValues>}
                    name={`${name}.${idx}.quantity` as any}
                    type={FORM_TYPE.NUMBER_TEXT}
                    maxLength={10}
                    className="h-8 py-0 rounded-none"
                  />
                </TableCell>
                <TableCell className="font-semibold text-primary">
                  ₹{(price * qty).toLocaleString()}
                </TableCell>
                <TableCell>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive rounded-none"
                    onClick={() => onRemove(idx)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          }}
        />
      </DataTable>

      {/* ── Add Row ─────────────────────────────────────────── */}
      <div className="p-3 bg-muted/10 border-t flex flex-wrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <AsyncSelectField
            asyncConfig={inventoryAsyncConfig}
            value={selectedId}
            onChange={(val: any, option: any) =>
              onSelectedIdChange(val, option?.raw ? { name: option.raw.name, selling_price: Number(option.raw.selling_price || 0) } : undefined)
            }
            placeholder={addPlaceholder}
            className="rounded-none"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAdd}
          disabled={!selectedId}
          className="gap-2 rounded-none"
        >
          <Plus className="size-4" />
          Add Item
        </Button>
      </div>
    </div>
  );
}
