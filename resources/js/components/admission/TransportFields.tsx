import React from "react";
import { Control, FieldValues, Controller } from "react-hook-form";
import { AsyncSelectField } from "@/components/shared/AsyncSelectField";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import { FORM_TYPE } from "@/constants";
import type { AsyncSelectConfig } from "@/types";

interface TransportFieldsProps<T extends FieldValues> {
  control: Control<T>;
  routeAsyncConfig: AsyncSelectConfig;
  stopAsyncConfig: AsyncSelectConfig;
  routeId: string | number;
  stopId: string | number;
  onRouteChange: (val: any) => void;
  onStopChange: (val: any) => void;
}

export function TransportFields<T extends FieldValues>({
  control,
  routeAsyncConfig,
  stopAsyncConfig,
  routeId,
  stopId,
  onRouteChange,
  onStopChange,
}: TransportFieldsProps<T>) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Route</label>
        <Controller
          name={"transport_route_id" as any}
          control={control}
          render={({ field }) => (
            <AsyncSelectField
              asyncConfig={routeAsyncConfig}
              value={field.value ?? routeId}
              onChange={(val: any) => {
                field.onChange(val);
                onRouteChange(val);
              }}
              placeholder="Select route…"
              className="rounded-none"
            />
          )}
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Pickup Stop</label>
        <Controller
          name={"transport_stop_id" as any}
          control={control}
          render={({ field }) => (
            <AsyncSelectField
              asyncConfig={stopAsyncConfig}
              value={field.value ?? stopId}
              onChange={(val: any, option?: any) => {
                field.onChange(val);
                onStopChange(val, option);
              }}
              placeholder="Select pickup stop…"
              disabled={!routeId && !field.value}
              className="rounded-none"
            />
          )}
        />
      </div>
      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Monthly Fee (₹)</label>
        <ControlledFormComponent
          control={control as Control<FieldValues>}
          name={"transport_amount" as any}
          type={FORM_TYPE.NUMBER_TEXT}
          maxLength={10}
          placeholder="0"
          className="h-10 rounded-none"
        />
      </div>
    </div>
  );
}
