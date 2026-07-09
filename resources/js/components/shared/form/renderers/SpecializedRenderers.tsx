import React, { ReactNode } from "react";
import { FORM_TYPE, FORM_FIELD_LAYOUT } from "@/constants";
import { cn } from "@/lib/utils";
import Each from "@/components/Each";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import { Controller, useFieldArray, Control, FieldValues } from "react-hook-form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { HelperTooltip } from "@/components/ui/helper-tooltip";
import { AnimatePresence, motion } from "framer-motion";
import RichTextEditor from "@/components/richTextEditor";
import { FormFileInput } from "@/components/shared/FormFileInput";
import FileSelector from "@/components/ui/FileSelector";
import { ListField } from "@/components/ui/list-field";
import { MultiTagInput } from "@/components/ui/multi-tag-input";
import { PhoneWithCodeInput } from "@/components/shared/PhoneWithCodeInput";
import { ColorPickerField } from "@/components/shared/ColorPickerField";
import { FieldError } from "@/components/ui/field-error";
import { BaseFieldProps, PREMIUM_LABEL_CLASSES } from "../types";

// ── Repeater Component ───────────────────────────────────────────────────
export const RepeaterField = ({
  control,
  name,
  disabled,
  fields = [],
  addLabel = "Add Row",
  renderField, // Factory pass-through
}: any) => {
  const {
    fields: arrayFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name,
  });

  const handleAdd = () => {
    const newItem = fields.reduce((acc: any, field: any) => {
      acc[field.name] = field.defaultValue ?? "";
      return acc;
    }, {} as any);
    append(newItem);
  };

  return (
    <div className="space-y-4">
      <div className="hidden sm:block overflow-hidden rounded-xl border border-border/60 bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-b border-border/50 bg-muted/20">
              <Each
                of={fields}
                render={(field: any) => (
                  <TableHead key={field.name} className="h-10 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    <label className={cn(PREMIUM_LABEL_CLASSES, "mb-0", field.required && "after:content-['*'] after:text-destructive after:ml-0.5")}>
                      {field.label}
                      {field.tooltip && <HelperTooltip content={field.tooltip} />}
                    </label>
                  </TableHead>
                )}
              />
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence mode="popLayout">
              {arrayFields.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="group border-b hover:bg-transparent transition-colors"
                >
                  <Each
                    of={fields}
                    render={(field: any) => (
                      <TableCell key={field.name} className="py-1.5 px-1 align-top border-none">
                        <Controller
                          control={control}
                          name={`${name}.${index}.${field.name}` as any}
                          render={({ field: rField, fieldState: { error } }) => {
                            if (typeof renderField !== "function") {
                                if (process.env.NODE_ENV === "development") {
                                    console.warn(`[RepeaterField] renderField prop is missing for "${name}.${index}.${field.name}". Direct usage is discouraged; use ControlledFormComponent.`);
                                }
                                return null;
                            }
                            return renderField({
                              ...field,
                              value: rField.value,
                              onChange: rField.onChange,
                              onBlur: rField.onBlur,
                              disabled,
                              error: error?.message,
                              className: "h-11 text-[15px]",
                            });
                          }}
                        />
                      </TableCell>
                    )}
                  />
                  <TableCell className="py-2 px-1 text-right align-top pt-2.5">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      disabled={disabled}
                      className="size-8 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/5 transition-all rounded-md"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </TableCell>
                </motion.tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
      </div>

      {/* Mobile Card View */}
      <div className="sm:hidden space-y-3">
        <Each
          of={arrayFields}
          render={(item, index) => (
            <div key={item.id} className="relative p-4 rounded-xl border border-border bg-card/30 backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Row #{index + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                  disabled={disabled}
                  className="text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <div className="grid gap-4">
                <Each
                  of={fields}
                  render={(field: any) => (
                    <div key={field.name} className="space-y-1.5">
                      <Label className="text-xs font-medium text-muted-foreground">
                        {field.label}
                        {field.tooltip && <HelperTooltip content={field.tooltip} className="inline-flex ml-1" />}
                      </Label>
                      <Controller
                        control={control}
                        name={`${name}.${index}.${field.name}` as any}
                        render={({ field: rField, fieldState: { error } }) => {
                          if (typeof renderField !== "function") return null;
                          return renderField({
                            ...field,
                            value: rField.value,
                            onChange: rField.onChange,
                            onBlur: rField.onBlur,
                            disabled,
                            error: error?.message,
                            className: "h-10 text-base sm:text-sm",
                          });
                        }}
                      />
                    </div>
                  )}
                />
              </div>
            </div>
          )}
        />
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleAdd}
        disabled={disabled}
        className="w-full border-dashed border-2 border-border hover:border-primary/40 hover:bg-accent text-muted-foreground/60 hover:text-primary transition-all font-bold py-6 rounded-lg shadow-none uppercase text-[11px] tracking-widest"
      >
        <Plus className="size-4 mr-2" />
        {addLabel}
      </Button>
    </div>
  );
};

// ── Main Specialized Renderer ───────────────────────────────────────────
export interface SpecializedFieldProps<T extends FieldValues> extends Omit<BaseFieldProps, "onChange" | "value"> {
  control: Control<T>;
  name: any;
  label?: ReactNode;
}

export const SpecializedRenderers = <T extends FieldValues>(props: SpecializedFieldProps<T> & { renderField?: any; [key: string]: any }) => {
  const {
    type,
    value,
    onChange,
    onBlur,
    disabled,
    placeholder,
    className,
    error,
    fileMode,
    maxFiles,
    accept,
    maxItems,
    maxTags,
    predefinedTags,
    defaultPhoneCode,
    control,
    name,
    fields,
    repeaterFields,
    addLabel,
    renderField,
    onUploadingChange,
  } = props;

  switch (type) {
    case FORM_TYPE.EDITOR:
      return (
        <div className="w-full">
          <div className={cn("rounded-lg overflow-hidden border border-input transition-all focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10", error && "border-destructive focus-within:border-destructive focus-within:ring-destructive/10")}>
            <RichTextEditor value={value as string} onChange={onChange} />
          </div>
          <FieldError message={error ?? ""} />
        </div>
      );

    case FORM_TYPE.FILE_SELECT:
      return (
        <div className="w-full">
          <div className={cn(error && "rounded-md ring-2 ring-destructive/50 border border-destructive")}>
            <FileSelector value={value} onChange={onChange} onBlur={onBlur} />
          </div>
          <FieldError message={error ?? ""} />
        </div>
      );

    case FORM_TYPE.FILE:
      return (
        <div className="w-full">
          <FormFileInput
            value={value}
            onChange={onChange}
            fileMode={fileMode as any}
            maxFiles={maxFiles}
            accept={accept}
            onBlur={onBlur}
            disabled={disabled}
            error={!!error}
            className={className}
            onUploadingChange={onUploadingChange}
          />
          <FieldError message={error ?? ""} />
        </div>
      );

    case FORM_TYPE.LIST:
      return (
        <div className="w-full">
          <ListField
            value={Array.isArray(value) ? value : value ? JSON.parse(value as string) : []}
            onChange={(items) => onChange(JSON.stringify(items))}
            placeholder={placeholder}
            disabled={disabled}
            error={!!error}
            maxItems={maxItems}
            className={className}
          />
          <FieldError message={error ?? ""} />
        </div>
      );

    case FORM_TYPE.MULTI_TAG:
      return (
        <div className="w-full">
          <MultiTagInput
            value={Array.isArray(value) ? value : []}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            error={!!error}
            maxTags={maxTags}
            predefinedTags={predefinedTags}
            className={className}
          />
          <FieldError message={error ?? ""} />
        </div>
      );

    case FORM_TYPE.PHONE_WITH_CODE:
      return (
        <PhoneWithCodeInput
          value={value as string}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          placeholder={placeholder}
          error={error}
          className={className}
          defaultCountryCode={defaultPhoneCode}
        />
      );

    case FORM_TYPE.COLOR:
      return (
        <ColorPickerField
          value={(value as string) || ""}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          disabled={disabled}
          error={error}
          className={className}
        />
      );

    case FORM_TYPE.REPEATER:
      return (
        <div className="w-full">
          <div className={cn("rounded-lg overflow-hidden", error && "ring-2 ring-destructive/50 border border-destructive")}>
            <RepeaterField
              control={control}
              name={name || ""}
              disabled={disabled}
              fields={fields || repeaterFields || []}
              addLabel={addLabel}
              renderField={renderField}
            />
          </div>
          <FieldError message={error ?? ""} />
        </div>
      );

    default:
      return null;
  }
};
