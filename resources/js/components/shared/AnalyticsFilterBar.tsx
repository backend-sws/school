import React, { useEffect } from "react";
import { Filter } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { GuideDefinition } from "@/types/guide";
import { useGuide } from "@/components/GuideProvider";

interface AnalyticsFilterBarProps {
    title?: string;
    icon?: React.ElementType;
    children: React.ReactNode;
    className?: string;
    gridClassName?: string;
    guide?: GuideDefinition;
    actions?: React.ReactNode;
    footer?: React.ReactNode;
}

export const AnalyticsFilterBar = ({
    title = "Insights Search Filters",
    icon: Icon = Filter,
    children,
    className,
    gridClassName,
    guide,
    actions,
    footer,
}: AnalyticsFilterBarProps) => {
    const { registerGuide } = useGuide();

    useEffect(() => {
        if (guide) {
            return registerGuide(guide);
        }
    }, [guide, registerGuide]);

    return (
        <Card className={cn("rounded-2xl border border-border/70 shadow-xs overflow-hidden bg-card", className)}>
            <CardHeader className="border-b border-border/60 bg-muted/30 px-6 py-3.5 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2 text-foreground font-semibold">
                    <Icon className="size-4 text-primary" />
                    <CardTitle className="text-xs font-bold uppercase tracking-wider">{title}</CardTitle>
                </div>
                {actions && <div className="flex items-center gap-2">{actions}</div>}
            </CardHeader>
            <CardContent className="p-6 space-y-4">
                <div className={cn("grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 items-end", gridClassName)}>
                    {children}
                </div>
                {footer}
            </CardContent>
        </Card>
    );
};

interface AnalyticsFilterItemProps {
    label: string;
    children: React.ReactNode;
    className?: string;
}

export const AnalyticsFilterItem = ({ label, children, className }: AnalyticsFilterItemProps) => {
    return (
        <div className={cn("space-y-2", className)}>
            <label className="text-[10px] font-black uppercase tracking-widest text-primary/60 px-0.5">
                {label}
            </label>
            {children}
        </div>
    );
};
