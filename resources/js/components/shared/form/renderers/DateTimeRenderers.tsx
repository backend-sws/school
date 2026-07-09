import { format, getYear } from "date-fns";
import { FORM_TYPE } from "@/constants";
import { cn } from "@/lib/utils";
import { SmartDateTimePicker } from "@/components/ui/smart-datetime-picker";
import { BaseFieldProps, PREMIUM_INPUT_CLASSES } from "../types";
import { FieldError } from "@/components/ui/field-error";

export const DateTimeRenderers = (props: BaseFieldProps) => {
  const {
    type,
    value,
    onChange,
    onBlur,
    disabled,
    placeholder,
    className,
    error,
  } = props;

  switch (type) {
    case FORM_TYPE.DATE:
      return (
        <div className="w-full">
          <SmartDateTimePicker
            mode="date"
            value={value ? new Date(value as string) : undefined}
            onChange={(date) => onChange(date ? date.toISOString() : "")}
            onBlur={onBlur}
            disabled={disabled}
            placeholder={placeholder || "Select date"}
            className={cn(PREMIUM_INPUT_CLASSES, className, error && "border-destructive focus-visible:ring-destructive/10 hover:border-destructive/50")}
          />
          <FieldError message={error ?? ""} />
        </div>
      );

    case FORM_TYPE.TIME:
      return (
        <div className="w-full">
          <SmartDateTimePicker
            mode="time"
            value={value ? new Date(`1970-01-01T${value}`) : undefined}
            onChange={(date) => onChange(date ? format(date, "HH:mm:ss") : "")}
            onBlur={onBlur}
            disabled={disabled}
            placeholder={placeholder || "Select time"}
            className={cn(PREMIUM_INPUT_CLASSES, className, "h-11", error && "border-destructive focus-visible:ring-destructive/10 hover:border-destructive/50")}
          />
          <FieldError message={error ?? ""} />
        </div>
      );

    case FORM_TYPE.DATETIME:
      return (
        <div className="w-full">
          <SmartDateTimePicker
            mode="datetime"
            value={value ? new Date(value as string) : undefined}
            onChange={(date) => onChange(date ? date.toISOString() : "")}
            onBlur={onBlur}
            disabled={disabled}
            placeholder={placeholder || "Select date & time"}
            className={cn(PREMIUM_INPUT_CLASSES, className, "h-11", error && "border-destructive focus-visible:ring-destructive/10 hover:border-destructive/50")}
          />
          <FieldError message={error ?? ""} />
        </div>
      );

    case FORM_TYPE.YEAR:
      return (
        <div className="w-full">
          <SmartDateTimePicker
            mode="year"
            value={value ? new Date(`${value}-01-01`) : undefined}
            onChange={(date) => onChange(date ? getYear(date).toString() : "")}
            onBlur={onBlur}
            disabled={disabled}
            placeholder={placeholder || "Select year"}
            className={cn(PREMIUM_INPUT_CLASSES, className, "h-11", error && "border-destructive focus-visible:ring-destructive/10 hover:border-destructive/50")}
          />
          <FieldError message={error ?? ""} />
        </div>
      );

    case FORM_TYPE.MONTH:
      return (
        <div className="w-full">
          <SmartDateTimePicker
            mode="month"
            value={value ? new Date(value as string) : undefined}
            onChange={(date) => onChange(date ? date.toISOString() : "")}
            onBlur={onBlur}
            disabled={disabled}
            placeholder={placeholder || "Select month"}
            className={cn(PREMIUM_INPUT_CLASSES, className, "h-11", error && "border-destructive focus-visible:ring-destructive/10 hover:border-destructive/50")}
          />
          <FieldError message={error ?? ""} />
        </div>
      );

    default:
      return null;
  }
};
