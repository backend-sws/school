import React from "react";
import { FORM_TYPE } from "@/constants";
import { cn } from "@/lib/utils";
import Each from "@/components/Each";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SmartCombobox } from "@/components/ui/smart-combobox";
import { MultiSelectField } from "@/components/multiSelectionInput";
import { AsyncSelectField } from "@/components/shared/AsyncSelectField";
import { BaseFieldProps, FieldOption, PREMIUM_INPUT_CLASSES } from "../types";
import { FieldError } from "@/components/ui/field-error";

// ── Checkbox/Radio Component ─────────────────────────────────────────────
export const CheckboxRadioField = ({
  isRadio,
  options = [],
  onChange,
  value,
  disabled,
  onBlur,
}: any) => {
  if (isRadio) {
    return (
      <RadioGroup
        value={value as string}
        onValueChange={onChange}
        disabled={disabled}
        onBlur={onBlur}
        className="flex flex-col sm:flex-row sm:flex-wrap gap-2"
      >
        <Each
          of={options}
          render={({ key, text, value: optionValue }: any) => (
            <div
              key={key}
              className="group flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all duration-200 hover:bg-white/5 border border-transparent"
            >
              <RadioGroupItem
                value={optionValue}
                id={key}
                className="border-input text-primary focus:ring-primary/20"
              />
              <Label
                htmlFor={key}
                className="font-medium text-[13px] cursor-pointer text-muted-foreground group-hover:text-primary transition-colors"
              >
                {text || optionValue}
              </Label>
            </div>
          )}
        />
      </RadioGroup>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      <Each
        of={options}
        render={({ key, text, value: optionValue }: any) => (
          <div
            key={key}
            className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-all group cursor-pointer"
          >
            <Checkbox
              id={key}
              checked={Array.isArray(value) ? value.includes(optionValue) : value === optionValue}
              onCheckedChange={(checked) => {
                if (Array.isArray(value)) {
                  onChange(checked ? [...value, optionValue] : value.filter((v: any) => v !== optionValue));
                } else {
                  onChange(checked ? optionValue : "");
                }
              }}
              disabled={disabled}
              onBlur={onBlur}
              className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
            />
            <Label
              htmlFor={key}
              className="font-medium text-[13px] cursor-pointer text-muted-foreground group-hover:text-primary transition-colors"
            >
              {text || optionValue}
            </Label>
          </div>
        )}
      />
    </div>
  );
};

// ── Dropdown Component ───────────────────────────────────────────────────
export const DropdownField = ({
  options = [],
  onChange,
  value,
  disabled,
  placeholder,
  searchable,
  editable,
  error,
  onBlur,
  className,
}: any) => {
  const errorClassName = error ? "border-destructive focus-visible:ring-destructive/20" : "";

  if (searchable || editable) {
    return (
      <SmartCombobox
        options={options as FieldOption[]}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        disabled={disabled}
        placeholder={placeholder}
        editable={editable}
        className={cn(className, errorClassName)}
        error={error}
      />
    );
  }

  const toSelectValue = (v: unknown) =>
    v === "EMPTY_VALUE" || v == null || v === "" ? "EMPTY_VALUE" : String(v);

  const handleValueChange = (stringValue: string) => {
    const selectedOption = options.find((opt: any) => toSelectValue(opt.value) === stringValue);
    if (selectedOption) {
      onChange(stringValue === "EMPTY_VALUE" ? "" : selectedOption.value);
    }
  };

  const valueKey = options.findIndex((opt: any) => opt.value === value);
  const displayValue = valueKey >= 0
    ? toSelectValue(options[valueKey].value)
    : value != null && value !== ""
      ? String(value)
      : undefined;

  return (
    <div className="w-full">
      <Select value={displayValue} onValueChange={handleValueChange} disabled={disabled}>
        <SelectTrigger
          className={cn(PREMIUM_INPUT_CLASSES, className, errorClassName)}
          aria-invalid={!!error}
          onBlur={onBlur}
        >
          <SelectValue placeholder={placeholder || "Select an option"} />
        </SelectTrigger>
        <SelectContent className="max-h-[240px] rounded-2xl border-border shadow-2xl bg-card backdrop-blur-xl ring-1 ring-white/10">
          <Each
            of={options}
            render={({ key, text, value: optionValue }: any) => {
              const stringValue = toSelectValue(optionValue);
              return (
                <SelectItem 
                  key={key} 
                  value={stringValue}
                  className="text-[14px] text-muted-foreground focus:bg-accent focus:text-accent-foreground py-2.5"
                >
                  {text || (stringValue === "EMPTY_VALUE" ? placeholder : stringValue) || placeholder}
                </SelectItem>
              );
            }}
          />
        </SelectContent>
      </Select>
      {error && <FieldError message={error} />}
    </div>
  );
};

// ── Main Selection Renderer ─────────────────────────────────────────────
export const SelectionRenderers = (props: BaseFieldProps & { asyncConfig?: any }) => {
  const {
    type,
    options,
    value,
    onChange,
    onBlur,
    disabled,
    placeholder,
    className,
    error,
    searchable,
    editable,
    asyncConfig,
    name,
    valueKey,
  } = props as any;

  switch (type) {
    case FORM_TYPE.CHECKBOX:
      if (!options || options.length === 0) {
        return (
          <div className="w-full">
            <div className={cn("rounded-md p-2 flex items-center gap-2", error && "ring-2 ring-destructive/30 border border-destructive/50")}>
              <Checkbox
                id={name || "single-checkbox"}
                checked={!!value}
                onCheckedChange={(checked) => onChange(!!checked)}
                disabled={disabled}
                onBlur={onBlur}
              />
            </div>
            <FieldError message={error ?? ""} />
          </div>
        );
      }
      return (
        <div className="w-full">
          <div className={cn("rounded-md p-2", error && "ring-2 ring-destructive/30 border border-destructive/50")}>
            <CheckboxRadioField
              type={type}
              options={options}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              disabled={disabled}
            />
          </div>
          <FieldError message={error ?? ""} />
        </div>
      );

    case FORM_TYPE.RADIO:
      return (
        <div className="w-full">
          <div className={cn("p-1", error && "border-l-2 border-destructive pl-3")}>
            <CheckboxRadioField
              isRadio
              type={type}
              options={options}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              disabled={disabled}
            />
          </div>
          <FieldError message={error ?? ""} />
        </div>
      );

    case FORM_TYPE.SELECT:
    case FORM_TYPE.DROPDOWN:
      return (
        <DropdownField
          options={options}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          searchable={searchable}
          editable={editable}
          error={error}
          className={className}
        />
      );

    case FORM_TYPE.MULTI_SELECT:
      return (
        <MultiSelectField
          options={options as FieldOption[] ?? []}
          value={Array.isArray(value) ? value : []}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          error={error}
          className={className}
          valueKey={valueKey}
        />
      );

    case FORM_TYPE.ASYNC_SELECT:
      return (
        <AsyncSelectField
          asyncConfig={asyncConfig}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          error={error}
          className={className}
        />
      );

    default:
      return null;
  }
};
