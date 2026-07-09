import React, { ReactNode, useMemo } from "react";
import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { cn } from "@/lib/utils";
import { FORM_TYPE, FORM_FIELD_LAYOUT } from "@/constants";
import { Label } from "@/components/ui/label";
import { HelperTooltip } from "@/components/ui/helper-tooltip";
import { FieldError } from "@/components/ui/field-error";

// Import Factory Renderers
import { BaseInputRenderers } from "./form/renderers/BaseInputRenderers";
import { SelectionRenderers } from "./form/renderers/SelectionRenderers";
import { DateTimeRenderers } from "./form/renderers/DateTimeRenderers";
import { SpecializedRenderers } from "./form/renderers/SpecializedRenderers";
import { BaseFieldProps, PREMIUM_LABEL_CLASSES } from "./form/types";

// Re-export shared types
export type { FieldOption, StyleConfig, BaseFieldProps } from "./form/types";

// Re-export specialized components (if used elsewhere)
export { DropdownField, SelectionRenderers as SelectionField } from "./form/renderers/SelectionRenderers";
export { CheckboxRadioField } from "./form/renderers/SelectionRenderers";

// ============================================================================
// Factory Registry Mapping
// ============================================================================
const RENDERER_GROUPS = {
  BASE: [
    FORM_TYPE.TEXT, FORM_TYPE.EMAIL, FORM_TYPE.PHONE, FORM_TYPE.URL,
    FORM_TYPE.TEXTAREA, FORM_TYPE.PASSWORD, FORM_TYPE.NUMBER,
    FORM_TYPE.NUMBER_TEXT, FORM_TYPE.CARD_NUMBER, FORM_TYPE.CARD_EXPIRY,
    FORM_TYPE.CARD_CVV, FORM_TYPE.DOMAIN_SLUG
  ],
  SELECTION: [
    FORM_TYPE.SELECT, FORM_TYPE.DROPDOWN, FORM_TYPE.MULTI_SELECT,
    FORM_TYPE.ASYNC_SELECT, FORM_TYPE.CHECKBOX, FORM_TYPE.RADIO
  ],
  DATE_TIME: [
    FORM_TYPE.DATE, FORM_TYPE.TIME, FORM_TYPE.DATETIME,
    FORM_TYPE.YEAR, FORM_TYPE.MONTH
  ],
  SPECIALIZED: [
    FORM_TYPE.EDITOR, FORM_TYPE.FILE, FORM_TYPE.FILE_SELECT,
    FORM_TYPE.LIST, FORM_TYPE.MULTI_TAG, FORM_TYPE.PHONE_WITH_CODE,
    FORM_TYPE.COLOR, FORM_TYPE.REPEATER
  ],
};

// ============================================================================
// Internal Field Factory (FieldUI)
// ============================================================================
function FieldUI(props: any) {
  const { type } = props;

  // Polymorphic Dispatcher
  const renderContent = () => {
    if (RENDERER_GROUPS.BASE.includes(type)) return <BaseInputRenderers {...props} />;
    if (RENDERER_GROUPS.SELECTION.includes(type)) return <SelectionRenderers {...props} />;
    if (RENDERER_GROUPS.DATE_TIME.includes(type)) return <DateTimeRenderers {...props} />;
    if (RENDERER_GROUPS.SPECIALIZED.includes(type)) {
      return <SpecializedRenderers {...props} renderField={FieldUI} />;
    }

    // Fallback to Base (handles default text inputs)
    return <BaseInputRenderers {...props} />;
  };

  return renderContent();
}

// ============================================================================
// Public Controlled Components
// ============================================================================

export interface ControlledFormProps<T extends FieldValues> extends Omit<BaseFieldProps, "onChange" | "value"> {
  control: Control<T>;
  name: any; // Relaxed to support dynamic config iteration
  label?: ReactNode;
  required?: boolean;
  tooltip?: string;
  hideAsterisk?: boolean;
  onValueChange?: (value: any, option?: any) => void;
  // Renderer-specific props
  [key: string]: any;
}

/**
 * Standard Controlled Form Component
 * Decouples rendering via a Software Factory pattern.
 */
export function ControlledFormComponent<T extends FieldValues>(props: ControlledFormProps<T>) {
  const {
    control,
    name,
    label,
    required,
    tooltip,
    helperText,
    error: manualError,
    hideAsterisk,
    onValueChange,
    className,
    ...rendererProps
  } = props;

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        <div className={cn("form-field-container w-full group/field", className)}>
          {label && (
            <label className={cn(PREMIUM_LABEL_CLASSES, "group-hover/field:text-primary transition-colors")}>
              <span className="flex items-center gap-1.5">
                {label}
                {!hideAsterisk && required && <span className="text-destructive ml-0.5">*</span>}
              </span>
              {tooltip && <HelperTooltip content={tooltip} />}
            </label>
          )}

          <FieldUI
            {...rendererProps}
            name={name}
            value={value}
            onChange={(val: any, opt: any) => {
              onChange(val);
              onValueChange?.(val, opt);
            }}
            onBlur={onBlur}
            error={manualError || error?.message}
            control={control}
          />

          {helperText && !manualError && !error && (
            <p className="mt-[var(--space-1)] text-[12px] text-muted-foreground/60 leading-relaxed px-1">
              {helperText}
            </p>
          )}
        </div>
      )}
    />
  );
}

/**
 * A lighter version for use inside repeaters or complex layouts
 */
export function ControlledFormDataField(props: any) {
  return <ControlledFormComponent {...props} hideCharCount />;
}

export default ControlledFormComponent;
