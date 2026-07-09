import React from "react";
import { Control, FieldValues, Path } from "react-hook-form";
import { cn } from "@/lib/utils";
import ControlledFormComponent from "@/components/shared/ControlledFormComponent";
import Each from "@/components/Each";

export interface FieldConfig {
  name: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  tooltip?: string;
  options?: { key: string; value: string | number | boolean; text: string }[];
  maxLength?: number;
  section?: string;
  className?: string;
  disabled?: boolean;
  accept?: string;
  fileMode?: "single" | "multiple" | "avatar" | "portrait";
}

interface FormFieldsFromConfigProps<T extends FieldValues> {
  control: Control<T>;
  fields: FieldConfig[];
  columns?: "1" | "2";
  compact?: boolean;
  getClassName?: (field: FieldConfig) => string;
  renderSectionHeader?: (section: string, isFirstSection?: boolean) => React.ReactNode;
}

export function FormFieldsFromConfig<T extends FieldValues>({
  control,
  fields,
  columns = "2",
  compact = false,
  getClassName,
  renderSectionHeader,
}: FormFieldsFromConfigProps<T>) {
  const gapClass = compact ? "gap-x-4 gap-y-2" : "gap-x-6 gap-y-4";
  const gridClass =
    columns === "2"
      ? `grid grid-cols-1 md:grid-cols-2 w-full min-w-0 ${gapClass}`
      : compact
        ? "space-y-2"
        : "space-y-4";

  return (
    <div className={gridClass}>
      <Each
        of={fields}
        keyExtractor={(f) => f.name}
        render={(field) => {
          const isFirstOfSection =
            field.section &&
            fields.findIndex((f) => f.section === field.section) === fields.indexOf(field);
          const isFirstSection =
            !!field.section && fields.findIndex((f) => f.section) === fields.indexOf(field);
          const sectionHeader = isFirstOfSection
            ? renderSectionHeader?.(field.section!, isFirstSection)
            : null;
          const wrapperClass = getClassName?.(field) ?? field.className ?? "";
          const gridCellClass = columns === "2" ? "min-w-0 w-full" : "";
          return (
            <React.Fragment key={field.name}>
              {sectionHeader ? (
                <div className="md:col-span-2 w-full">{sectionHeader}</div>
              ) : null}
              <div className={[wrapperClass, gridCellClass].filter(Boolean).join(" ") || undefined}>
                <ControlledFormComponent
                  control={control as Control<FieldValues>}
                  name={field.name as Path<T>}
                  type={field.type}
                  label={field.label}
                  placeholder={field.placeholder}
                  required={field.required}
                  tooltip={field.tooltip}
                  options={field.options}
                  maxLength={field.maxLength}
                  className={cn(
                    "rounded-none",
                    columns === "2" ? "w-full" : "",
                    field.className
                  )}
                  disabled={field.disabled}
                  accept={field.accept}
                  fileMode={field.fileMode}
                />
              </div>
            </React.Fragment>
          );
        }}
      />
    </div>
  );
}
