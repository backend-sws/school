import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface TooltipWrapperProps {
    children: ReactNode;
    content: ReactNode;
    side?: "top" | "right" | "bottom" | "left";
    className?: string;
}

export function TooltipWrapper({
    children,
    content,
    side = "top",
    className = "",
}: TooltipWrapperProps) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <div className={cn("w-max", className)}>
                    {children}
                </div>
            </TooltipTrigger>
            <TooltipContent side={side}>
                {content}
            </TooltipContent>
        </Tooltip>
    );
}
