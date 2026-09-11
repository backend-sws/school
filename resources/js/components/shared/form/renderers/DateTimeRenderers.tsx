import { format, getYear } from "date-fns";
import { FORM_TYPE } from "@/constants";
import { cn } from "@/lib/utils";
import { SmartDateTimePicker } from "@/components/ui/smart-datetime-picker";
import { BaseFieldProps, PREMIUM_INPUT_CLASSES } from "../types";
import { FieldError } from "@/components/ui/field-error";

function parseLocalDate(val?: string | Date | null): Date | undefined {
  if (!val) return undefined;
  if (val instanceof Date) return isNaN(val.getTime()) ? undefined : val;
  const str = String(val).trim();
  if (!str) return undefined;

  // If exact YYYY-MM-DD format (no time), create local midnight Date
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) {
    const parts = str.split("-").map(Number);
    if (parts.length === 3 && !parts.some(isNaN)) {
      return new Date(parts[0], parts[1] - 1, parts[2]);
    }
  }

  // If ISO string with timezone or datetime string, convert to local Date at midnight
  const d = new Date(str);
  if (!isNaN(d.getTime())) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  return undefined;
}

function parseLocalTime(val?: string | null): Date | undefined {
  if (!val) return undefined;
  const str = String(val).trim();
  if (!str) return undefined;
  const parts = str.split(":");
  if (parts.length >= 2) {
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    const seconds = parts[2] ? parseInt(parts[2], 10) : 0;
    if (!isNaN(hours) && !isNaN(minutes) && !isNaN(seconds)) {
      const d = new Date();
      d.setHours(hours, minutes, seconds, 0);
      return d;
    }
  }
  return undefined;
}

function parseLocalDateTime(val?: string | Date | null): Date | undefined {
  if (!val) return undefined;
  if (val instanceof Date) return isNaN(val.getTime()) ? undefined : val;
  const str = String(val).trim();
  if (!str) return undefined;
  const match = str.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/);
  if (match) {
    const [, y, m, d, h, min, s] = match.map(Number);
    return new Date(y, m - 1, d, h, min, s || 0);
  }
  const parsed = new Date(str);
  return isNaN(parsed.getTime()) ? undefined : parsed;
}

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
            value={parseLocalDate(value as string)}
            onChange={(date) => onChange(date ? format(date, "yyyy-MM-dd") : "")}
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
            value={parseLocalTime(value as string)}
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
            value={parseLocalDateTime(value as string)}
            onChange={(date) => onChange(date ? format(date, "yyyy-MM-dd HH:mm:ss") : "")}
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
            value={parseLocalDate(value as string)}
            onChange={(date) => onChange(date ? format(date, "yyyy-MM") : "")}
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
