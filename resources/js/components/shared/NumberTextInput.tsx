import { Input } from "@/components/ui/input";
import { applyInlineStyles } from "@/lib/utils";

export interface NumberTextInputProps {
  value?: number | string | boolean | null;
  onChange: (value: number | string) => void;
  placeholder?: string;
  style?: Record<string, string | number>;
  className?: string;
  maxLength?: number;
  error?: string;
  disabled?: boolean;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  id?: string;
}

/**
 * Number input rendered as type="text" (no spinners).
 * Supports decimal degrees and other floats.
 * Use for coordinates, amounts, or other numeric fields where a plain text box is preferred.
 */
export function NumberTextInput({
  value,
  onChange,
  placeholder,
  style,
  className,
  maxLength,
  error,
  disabled,
  onBlur,
  onKeyDown,
  id,
}: NumberTextInputProps) {
  return (
    <Input
      type="text"
      inputMode="numeric"
      autoComplete="off"
      value={
        (typeof value === "number" || (typeof value === "string" && value !== ""))
          ? String(value)
          : ""
      }
      onChange={(e) => {
        const v = e.target.value;
        if (v === "") return onChange("");
        
        // Allow valid numeric prefixes (like "-", "25.", "25.1")
        if (/^-?\d*\.?\d*$/.test(v)) {
          // If it ends with a dot or is just a prefix, pass it as a string to preserve formatting
          if (v === "-" || v === "." || v === "-." || v.includes(".")) {
            onChange(v);
          } else {
            const n = Number(v);
            if (!Number.isNaN(n)) onChange(n);
          }
        }
      }}
      style={style ? applyInlineStyles(style) : undefined}
      placeholder={placeholder}
      maxLength={maxLength}
      error={error}
      disabled={disabled}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      className={className}
      id={id}
    />
  );
}
