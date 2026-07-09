import { Info } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface HelperTooltipProps {
    content: ReactNode;
    children?: ReactNode;
    className?: string;
    side?: "top" | "right" | "bottom" | "left";
    iconClassName?: string;
}

export function HelperTooltip({
    content,
    children,
    className,
    side = "top",
    iconClassName,
}: HelperTooltipProps) {
    if (!content) return null;
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                {children ? (
                    children
                ) : (
                    <button
                        type="button"
                        className={cn(
                            "inline-flex items-center justify-center rounded-full transition-colors cursor-help outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-accent/50 p-1",
                            className
                        )}
                        aria-label="More information"
                    >
                        <Info
                            className={cn(
                                "size-3.5 text-muted-foreground/60 hover:text-primary transition-colors",
                                iconClassName
                            )}
                        />
                    </button>
                )}
            </TooltipTrigger>
            <TooltipContent side={side} className={cn("max-w-xs", className)}>
                {content}
            </TooltipContent>
        </Tooltip>
    );
}
