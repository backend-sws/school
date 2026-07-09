import React from "react";
import { Controller, useWatch } from "react-hook-form";
import { FORM_TYPE } from "@/constants";
import { StepCard } from "../StepCard";
import { StepNavFooter } from "../StepNavFooter";
import { SectionHeader } from "../SectionHeader";
import { FeeTypesTable } from "../FeeTypesTable";
import { InventoryTable } from "../InventoryTable";
import { TransportFields } from "../TransportFields";
import { TotalSummaryCard } from "../TotalSummaryCard";
import { AsyncSelectField } from "@/components/shared/AsyncSelectField";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";
import { useInstitutionContent } from "@/hooks/useInstitutionContent";
import { useServicesStep } from "@/hooks/useServicesStep";
import type { ApplicationDeskFormValues } from "@/lib/validations/admission/application";
import {
  APPLICATION_DESK_STEP_LABELS,
  APPLICATION_DESK_STEP_SUBTITLES,
  type ApplicationDeskFlowStep,
} from "@/constants/admission/application";

// ── Props ───────────────────────────────────────────────────────────────

interface ServicesStepProps {
  stepKey: ApplicationDeskFlowStep;
  stepIndex: number;
  totalSteps: number;
  onBack: () => void;
  onContinue: () => void;
}

// ── Component ───────────────────────────────────────────────────────────

export function ServicesStep({
  stepKey,
  stepIndex,
  totalSteps,
  onBack,
  onContinue,
}: ServicesStepProps) {
  const content = useInstitutionContent();
  const contentMap = content as unknown as Record<string, string>;

  const stepLabel =
    contentMap[`step_${stepKey}`] ?? APPLICATION_DESK_STEP_LABELS[stepKey];
  const stepSubtitle =
    contentMap[`step_${stepKey}_subtitle`] ??
    APPLICATION_DESK_STEP_SUBTITLES[stepKey];

  const {
    control,
    watch,
    // Fee Profile
    profileAsyncConfig,
    selectedProfileId,
    isFetchingProfile,
    handleProfileSelect,
    // Fee Particulars
    feeFields,
    removeFee,
    feeTypeAsyncConfig,
    selectedFeeId,
    handleFeeSelectChange,
    addAmount,
    setAddAmount,
    handleAddFee,
    // Inventory
    inventoryFields,
    removeInventory,
    inventoryAsyncConfig,
    selectedInventoryId,
    handleInventorySelectChange,
    handleAddInventory,
    // Transport
    transportRouteId,
    transportRouteAsyncConfig,
    transportStopAsyncConfig,
    handleRouteChange,
    handleStopChange,

    // Hostel
    hostelId,
    hostelAsyncConfig,
    hostelRoomAsyncConfig,
    handleHostelChange,
    handleHostelRoomChange,

    // Totals
    totals,
  } = useServicesStep();

  const transportStopId = watch("transport_stop_id" as any);
  const hostelRequired = useWatch({ control, name: "hostel_required", defaultValue: false });

  return (
    <StepCard
      title={stepLabel}
      subtitle={stepSubtitle}
      stepIndex={stepIndex}
      totalSteps={totalSteps}
      className="shadow-none border-none rounded-none"
      footer={
        <StepNavFooter onBack={onBack} onPrimary={onContinue} primaryLabel="Continue to Payment" />
      }
    >
      <div className="space-y-8">
        {/* ── Academic Fees ────────────────────────────────── */}
        <section className="space-y-3">
          <SectionHeader title={contentMap.services_fee_section_label ?? "Academic Fees"} isFirstSection={true} />
          <FeeTypesTable<ApplicationDeskFormValues>
            control={control}
            name="fees"
            fields={feeFields}
            onRemove={removeFee}
            feeTypeAsyncConfig={feeTypeAsyncConfig}
            selectedId={selectedFeeId}
            onSelectedIdChange={handleFeeSelectChange}
            addAmount={addAmount}
            onAddAmountChange={setAddAmount}
            onAdd={handleAddFee}
            addPlaceholder={contentMap.services_add_fee_placeholder ?? "Search fee types..."}
            isLoading={isFetchingProfile}
            profileAsyncConfig={profileAsyncConfig}
            selectedProfileId={selectedProfileId}
            onProfileSelect={handleProfileSelect}
          />
        </section>

        {/* ── Inventory ────────────────────────────────────────── */}
        <section className="space-y-3">
          <SectionHeader title={contentMap.services_inventory_section_label ?? "Inventory & Kits"} isFirstSection={false} />
          <InventoryTable<ApplicationDeskFormValues>
            control={control}
            watch={watch}
            name="inventory_items"
            inventoryAsyncConfig={inventoryAsyncConfig}
            selectedId={selectedInventoryId}
            onSelectedIdChange={handleInventorySelectChange}
            onAdd={handleAddInventory}
            addPlaceholder="Search items..."
            fields={inventoryFields}
            onRemove={removeInventory}
          />
        </section>

        {/* ── Transport ────────────────────────────────────────── */}
        <section className="space-y-3">
          <SectionHeader title={contentMap.services_transport_section_label ?? "Transport Services"} isFirstSection={false} />
          <TransportFields<ApplicationDeskFormValues>
            control={control}
            routeAsyncConfig={transportRouteAsyncConfig}
            stopAsyncConfig={transportStopAsyncConfig}
            routeId={transportRouteId ?? ""}
            stopId={transportStopId ?? ""}
            onRouteChange={handleRouteChange}
            onStopChange={handleStopChange}
          />
        </section>

        {/* ── Hostel ───────────────────────────────────────────── */}
        <section className="space-y-3">
          <SectionHeader title={contentMap.services_hostel_section_label ?? "Hostel Accommodation"} isFirstSection={false} />
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Controller
                name="hostel_required"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="hostel_required"
                    checked={!!field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="hostel_required" className="text-sm font-normal cursor-pointer">
                Hostel accommodation required
              </Label>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InfoIcon className="size-4 text-muted-foreground shrink-0" aria-hidden />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-xs">
                    <p>Turn on if hostel accommodation is needed for this student.</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {hostelRequired && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-1 mt-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Hostel</label>
                  <Controller
                    name="hostel_id"
                    control={control}
                    render={({ field }) => (
                      <AsyncSelectField
                        asyncConfig={hostelAsyncConfig}
                        value={field.value ?? hostelId}
                        onChange={(val: any) => {
                          field.onChange(val);
                          handleHostelChange(val);
                        }}
                        placeholder="Select hostel…"
                        className="rounded-none"
                      />
                    )}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Room</label>
                  <Controller
                    name="hostel_room_id"
                    control={control}
                    render={({ field }) => (
                      <AsyncSelectField
                        asyncConfig={hostelRoomAsyncConfig}
                        value={field.value}
                        onChange={(val: any, meta: any) => {
                          field.onChange(val);
                          handleHostelRoomChange(val, meta);
                        }}
                        placeholder="Select room…"
                        disabled={!hostelId}
                        className="rounded-none"
                      />
                    )}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Monthly Fee (₹)</label>
                  <ControlledFormComponent
                    control={control as any}
                    name="hostel_amount"
                    type={FORM_TYPE.NUMBER_TEXT}
                    maxLength={10}
                    placeholder="0"
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ── Summary ──────────────────────────────────────────── */}
        <section className="space-y-3">
          <TotalSummaryCard
            feeTotal={totals.feeTotal}
            inventoryTotal={totals.inventoryTotal}
            transportTotal={totals.transportTotal}
            hostelTotal={totals.hostelTotal}
            discountTotal={totals.discountTotal}
          />
        </section>
      </div>
    </StepCard>
  );
}
