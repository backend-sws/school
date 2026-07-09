import * as React from "react"
import { cn } from "@/lib/utils"
import { FieldError } from "@/components/ui/field-error"
import { FORM_FIELD_LAYOUT } from "@/constants/shared/form"

interface InputProps extends React.ComponentProps<"input"> {
  error?: string
  helperText?: string
  leftElement?: React.ReactNode
  rightElement?: React.ReactNode
  /** When set, show character count below input (e.g. "0/50") in the same slot as error/helper text. Does not add layout if not provided. */
  maxLength?: number
  hideCharCount?: boolean
  forgotPasswordHref?: string
  showVisibilityToggle?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({
    className,
    type,
    error,
    helperText,
    leftElement,
    rightElement,
    maxLength: maxLengthProp,
    hideCharCount,
    id,
    "aria-describedby": ariaDescribedBy,
    value,
    forgotPasswordHref,
    showVisibilityToggle,
    ...props
  }, ref) => {
    const inputId = id || React.useId()
    const errorId = `${inputId}-error`
    const helperId = `${inputId}-helper`

    const describedBy = [
      ariaDescribedBy,
      error ? errorId : null,
      helperText && !error ? helperId : null,
    ].filter(Boolean).join(" ") || undefined

    const hasAdornment = leftElement || rightElement
    const currentLength =
      value == null || value === ""
        ? 0
        : typeof value === "string"
          ? value.length
          : String(value).length
    const showCharCount = maxLengthProp != null && !hideCharCount

    const inputElement = (
      <input
        type={type}
        id={inputId}
        ref={ref}
        data-slot="input"
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedBy}
        className={cn(
          // Base styles – use FORM_FIELD_LAYOUT.CONTROL_HEIGHT_CLASS (h-11) for consistency
          "flex w-full rounded-lg border border-input bg-background px-3 py-2 text-[15px] transition-all duration-300",
          "h-11", // Overriding to h-11 for Software Factory
          // Text and placeholder
          "text-foreground placeholder:text-muted-foreground",
          // Focus state
          "focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:border-primary",
          // File input styles
          "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
          // Disabled state
          "disabled:cursor-not-allowed disabled:opacity-50",
          // With adornments
          leftElement && "pl-10",
          rightElement && "pr-10",
          // Custom className should be applied before error styles to allow error to override
          className,
          // Error state
          error && "border-destructive focus-visible:ring-destructive/10 focus-visible:border-destructive",
        )}
        {...props}
        value={value}
        maxLength={maxLengthProp}
      />
    )

    // Always use the same wrapper + reserved row so every input has consistent height and spacing.
    return (
      <div className="w-full">
        {hasAdornment ? (
          <div className="relative">
            {leftElement && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
                {leftElement}
              </div>
            )}
            {inputElement}
            {rightElement && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {rightElement}
              </div>
            )}
          </div>
        ) : (
          inputElement
        )}

        {/* Helper row: height from content only (FORM_FIELD_LAYOUT). */}
        <div className={FORM_FIELD_LAYOUT.HELPER_ROW_CLASS}>
          <div className="min-w-0 flex-1 text-left">
            <FieldError id={errorId} message={error ?? ""} />
          </div>
          <div className="flex-shrink-0 text-right">
            {showCharCount && (
              <p className="text-xs leading-none text-muted-foreground">
                {currentLength}/{maxLengthProp}
              </p>
            )}
          </div>
          <div className="flex-shrink-0 text-right">
            {forgotPasswordHref && (
              <a href={forgotPasswordHref} className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2">
                Forgot password?
              </a>
            )}
          </div>
        </div>
      </div>
    )
  }
)

Input.displayName = "Input"

export { Input }
export type { InputProps }
