import * as React from "react";
import { cn } from "@/lib/utils";
import { FORM_FIELD_LAYOUT } from "@/constants/shared/form";

export interface FieldErrorProps {
  message: string;
  id?: string;
  className?: string;
  /** When true, wrap in the standard form helper row. Slot stays in DOM; no fixed height. Use for all form fields. */
  reserveSpace?: boolean;
}

/**
 * Single place for form field error display (bullet + red text).
 * Use everywhere so error styling and layout stay consistent.
 * Helper row height is only from content – no fixed min-height.
 */
export function FieldError({ message, id, className }: FieldErrorProps) {
  if (!message) return null;

  return (
    <p
      id={id}
      role="alert"
      className={cn("field-error-tag", className)}
    >
      {message}
    </p>
  );
}
