import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input, type InputProps } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PasswordInputProps
  extends Omit<InputProps, "type" | "rightElement"> {
  /** Optional custom class for the toggle button */
  toggleButtonClassName?: string;
  /** When set, shows a "Forgot password?" link below the input (right-aligned) */
  forgotPasswordHref?: string;
  /** Whether to show the visibility toggle icon. Defaults to true. */
  showVisibilityToggle?: boolean;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      className,
      toggleButtonClassName,
      disabled,
      forgotPasswordHref,
      showVisibilityToggle = true,
      ...props
    },
    ref,
  ) => {
    const [visible, setVisible] = React.useState(false);

    const toggle = () => setVisible((prev) => !prev);

    return (
      <Input
        forgotPasswordHref={forgotPasswordHref}
        ref={ref}
        type={visible ? "text" : "password"}
        autoComplete={props.autoComplete ?? "current-password"}
        disabled={disabled}
        className={className}
        {...props}
        rightElement={
          showVisibilityToggle ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={toggle}
              disabled={disabled}
              tabIndex={-1}
              aria-label={visible ? "Hide password" : "Show password"}
              className={cn(
                "rounded p-0.5 text-muted-foreground hover:text-foreground h-auto w-auto",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                "disabled:pointer-events-none disabled:opacity-50",
                toggleButtonClassName
              )}
            >
              {visible ? (
                <EyeOff className="h-4 w-4" aria-hidden />
              ) : (
                <Eye className="h-4 w-4" aria-hidden />
              )}
            </Button>
          ) : null
        }
      />
    );
  }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
