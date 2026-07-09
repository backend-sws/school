import React, { ReactNode } from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import Each from "@/components/Each";

interface SummaryItem {
    label: string;
    value: ReactNode;
}

interface SummarySectionProps {
    title: string;
    icon: LucideIcon;
    items?: SummaryItem[];
    children?: ReactNode;
    className?: string;
    span?: 1 | 2;
}

export function SummarySection({
    title,
    icon: Icon,
    items,
    children,
    className,
    span = 1,
}: SummarySectionProps) {
    return (
        <div
            className={cn(
                "overflow-hidden space-y-3",
                span === 2 ? "md:col-span-2" : "",
                className
            )}
        >
            <div className="flex items-center gap-2.5 pb-2 border-b border-border/40">
                <div className="flex items-center justify-center size-6 rounded-none bg-primary/10 text-primary">
                    <Icon className="size-3.5" />
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/70">{title}</h3>
            </div>
            <>
                {items && (
                    <div className="space-y-3">
                        <Each
                            of={items}
                            keyExtractor={(item, idx) => `${item.label}-${idx}`}
                            render={(item) => (
                                <div className="flex items-center justify-between py-1.5 border-b border-border/10 last:border-0 last:pb-0">
                                    <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest shrink-0">
                                        {item.label}
                                    </span>
                                    <span className="text-xs font-bold text-foreground text-right pl-4">
                                        {item.value || "—"}
                                    </span>
                                </div>
                            )}
                        />
                    </div>
                )}
                {children}
            </>
        </div>
    );
}

