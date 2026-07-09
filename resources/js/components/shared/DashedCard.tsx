import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DashedCardProps {
    label: string;
    description?: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    className?: string;
    isVisible?: boolean;
    variant?: "grid" | "list";
}

export function DashedCard({
    label,
    description,
    icon,
    onClick,
    className,
    isVisible = true,
    variant = "grid"
}: DashedCardProps) {
    const isListVariant = variant === "list";

    return (
        <Button
            type="button"
            variant="ghost"
            onClick={onClick}
            className={cn(
                "group relative flex flex-col text-left w-full min-h-0 overflow-hidden p-0 h-auto font-normal hover:bg-transparent",
                !isListVariant && "min-h-[280px]",
                isVisible ? "" : "hidden",
                className
            )}
        >
            <div className={cn(
                "relative size-full min-h-0 rounded-xl border-2 border-dashed border-muted-foreground/25 bg-muted/5 hover:bg-muted/10 hover:border-primary/50 transition-all flex items-center justify-center overflow-hidden",
                isListVariant ? "flex-row gap-3 py-4 px-6" : "flex-col gap-3 p-4"
            )}>
                <div className={cn(
                    "rounded-full bg-background shadow-sm flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105",
                    isListVariant ? "h-10 w-10" : "h-11 w-11"
                )}>
                    {icon || <Plus className={cn(isListVariant ? "size-5" : "size-5", "text-primary")} />}
                </div>
                <div className={cn("min-w-0", isListVariant ? "text-left" : "text-center")}>
                    <span className="block text-sm font-medium text-foreground truncate">{label}</span>
                    {description && (
                        <span className="block text-xs text-muted-foreground mt-0.5 line-clamp-2">
                            {description}
                        </span>
                    )}
                </div>
            </div>
        </Button>
    );
}
