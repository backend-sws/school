import * as React from "react"
import { cn } from "@/lib/utils"

interface SwitchProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
    ({ className, checked, onCheckedChange, disabled, ...props }, ref) => (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            data-state={checked ? "checked" : "unchecked"}
            disabled={disabled}
            ref={ref}
            onClick={(e) => {
                e.preventDefault();
                if (!disabled && onCheckedChange) {
                    onCheckedChange(!checked);
                }
            }}
            className={cn(
                "peer inline-flex h-6 w-10 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-all duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/10 focus-visible:border-primary disabled:cursor-not-allowed disabled:opacity-50",
                checked ? "bg-primary" : "bg-muted hover:bg-muted/80",
                className
            )}
            {...props}
        >
            <span
                className={cn(
                    "pointer-events-none block h-5 w-5 rounded-full bg-background shadow-sm ring-0 transition-all duration-300 ease-in-out",
                    checked ? "translate-x-4" : "translate-x-0"
                )}
            />
        </button>
    )
)

Switch.displayName = "Switch"

export { Switch }
