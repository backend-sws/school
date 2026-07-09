import React from "react";
import { Control, FieldValues } from "react-hook-form";
import Each from "@/components/Each";
import DataTable, { TableSkeletonLoader } from "@/components/dataTable";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { AsyncSelectField } from "@/components/shared/AsyncSelectField";
import { FORM_TYPE } from "@/constants";
import { Trash2, Plus, Loader2, IndianRupee } from "lucide-react";
import { Input } from "@/components/ui/input";
import type { AsyncSelectConfig } from "@/types";

// ── Column Config ──────────────────────────────────────────────
const FEE_COLUMNS = [
  { key: "fee_type", label: "Fee Type" },
  { key: "amount", label: "Amount (₹)" },
  { key: "actions", label: "" },
];

// ── Props ──────────────────────────────────────────────────────
interface FeeTypesTableProps<T extends FieldValues> {
  control: Control<T>;
  name: string;
  fields: any[];
  onRemove: (index: number) => void;
  feeTypeAsyncConfig: AsyncSelectConfig;
  selectedId: string | number;
  onSelectedIdChange: (id: string | number, option?: any) => void;
  addAmount: string | number;
  onAddAmountChange: (val: any) => void;
  onAdd: (...args: any[]) => void;
  addPlaceholder?: string;
  isLoading?: boolean;
  profileAsyncConfig?: AsyncSelectConfig;
  selectedProfileId?: string | number;
  onProfileSelect?: (id: any) => void;
}

// ── Component ──────────────────────────────────────────────────
export function FeeTypesTable<T extends FieldValues>({
  control,
  name,
  fields,
  onRemove,
  feeTypeAsyncConfig,
  selectedId,
  onSelectedIdChange,
  addAmount,
  onAddAmountChange,
  onAdd,
  addPlaceholder = "Search fee types...",
  isLoading = false,
  profileAsyncConfig,
  selectedProfileId,
  onProfileSelect,
}: FeeTypesTableProps<T>) {
  return (
    <div className="flex flex-col gap-0 border border-border/40 overflow-hidden bg-background rounded-none">
      {/* ── Profile Selector (optional) ─────────────────────── */}
      {profileAsyncConfig && (
        <div className="flex items-end gap-3 p-4 border-b bg-background rounded-none">
          <div className="flex-1 min-w-[200px]">
            <label className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground ml-1 mb-1 block">
              Fee Profile
            </label>
            <AsyncSelectField
              asyncConfig={profileAsyncConfig}
              value={selectedProfileId ?? ""}
              onChange={(val: any) => onProfileSelect?.(val)}
              placeholder="Select fee profile..."
            />
          </div>
          {isLoading && <Loader2 className="size-5 animate-spin text-muted-foreground mb-2" />}
        </div>
      )}

      {/* ── Fee Table (DataTable + Each) ────────────────────── */}
      <DataTable
        columns={FEE_COLUMNS}
        isPaginated={false}
        maxHeight="none"
        variant="outline"
      >
        <Each
          of={fields}
          isLoading={isLoading}
          keyExtractor={(field, idx) => `${(field as { id?: string }).id ?? idx}-${selectedProfileId ?? 'default'}`}
          fallback={<TableSkeletonLoader columns={FEE_COLUMNS.length} rows={2} />}
          nodatafound={
            <TableRow className="hover:bg-transparent">
              <TableCell colSpan={FEE_COLUMNS.length} className="h-[200px]">
                <div className="flex flex-col items-center justify-center text-center py-8">
                  <IndianRupee className="size-8 text-muted-foreground/30 mb-3" />
                  <h3 className="text-base font-bold text-foreground">No fee items added</h3>
                  <p className="text-sm text-muted-foreground mt-1">Use the search below to add fee types.</p>
                </div>
              </TableCell>
            </TableRow>
          }
          render={(field, idx) => (
            <TableRow className="hover:bg-muted/50">
              <TableCell className="font-medium">
                {(field as any)._title ?? (field as any).fee_type_name ?? "Fee"}
              </TableCell>
              <TableCell>
                <ControlledFormComponent
                  control={control as Control<FieldValues>}
                  name={`${name}.${idx}.amount` as any}
                  type={FORM_TYPE.NUMBER_TEXT}
                  maxLength={10}
                  className="h-8 py-0 rounded-none"
                />
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
          )}
        />
      </DataTable>

      {/* ── Add Row ─────────────────────────────────────────── */}
      <div className="p-3 bg-background border-t flex flex-wrap items-end gap-3 rounded-none">
        <div className="flex-1 min-w-[200px]">
          <AsyncSelectField
            asyncConfig={feeTypeAsyncConfig}
            value={selectedId}
            onChange={(val: any, option?: any) => onSelectedIdChange(val, option)}
            placeholder={addPlaceholder}
            className="rounded-none"
          />
        </div>
        <div className="w-[120px]">
          <Input
            type="number"
            value={addAmount}
            onChange={(e) => onAddAmountChange(e.target.value)}
            placeholder="Amount"
            className="h-9 rounded-none"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAdd}
          disabled={!selectedId || !addAmount}
          className="gap-2 rounded-none"
        >
          <Plus className="size-4" />
          Add Fee
        </Button>
      </div>
    </div>
  );
}
