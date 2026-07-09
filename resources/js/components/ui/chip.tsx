import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type ChipVariant = "sky" | "emerald" | "violet" | "amber" | "indigo" | "rose" | "slate" | "primary";

interface ChipProps {
  children: React.ReactNode;
  variant?: ChipVariant;
  className?: string;
}

const variantStyles: Record<ChipVariant, string> = {
  sky: "bg-sky-50 text-sky-700",
  emerald: "bg-emerald-50 text-emerald-700",
  violet: "bg-violet-50 text-violet-700",
  amber: "bg-amber-50 text-amber-700",
  indigo: "bg-indigo-50 text-indigo-700",
  rose: "bg-rose-50 text-rose-700",
  slate: "bg-slate-100 text-slate-600",
  primary: "bg-primary text-primary-foreground",
};

export function Chip({ children, variant = "slate", className }: ChipProps) {
  return (
    <span
      className={cn(
        "inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold whitespace-nowrap",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

interface ChipItem {
  label: string;
  variant?: ChipVariant;
}

interface ChipGroupProps {
  items: ChipItem[];
  maxVisible?: number;
  className?: string;
}

export function ChipGroup({ items, maxVisible = 3, className }: ChipGroupProps) {
  if (!items || items.length === 0) {
    return <span className="text-muted-foreground/50 text-sm">—</span>;
  }

  const visibleItems = items.slice(0, maxVisible);
  const hiddenItems = items.slice(maxVisible);
  const hasMore = hiddenItems.length > 0;

  return (
    <div className={cn("flex flex-wrap items-center gap-0.5", className)}>
      {visibleItems.map((item, index) => (
        <Chip key={`${item.label}-${index}`} variant={item.variant}>
          {item.label}
        </Chip>
      ))}
      {hasMore && (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="inline-flex px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-500 cursor-pointer hover:bg-slate-200 transition-colors">
              +{hiddenItems.length} more
            </span>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-[200px]">
            <div className="flex flex-wrap gap-1">
              {hiddenItems.map((item, index) => (
                <Chip key={`hidden-${item.label}-${index}`} variant={item.variant}>
                  {item.label}
                </Chip>
              ))}
            </div>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
