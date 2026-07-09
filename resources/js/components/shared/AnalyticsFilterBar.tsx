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
    guide?: GuideDefinition;
}

export const AnalyticsFilterBar = ({
    title = "Insights Search Filters",
    icon: Icon = Filter,
    children,
    className,
    guide
}: AnalyticsFilterBarProps) => {
    const { registerGuide } = useGuide();

    useEffect(() => {
        if (guide) {
            return registerGuide(guide);
        }
    }, [guide, registerGuide]);

    return (
        <Card className={cn("rounded-2xl border border-border/50 shadow-sm overflow-hidden bg-muted/10", className)}>
            <CardHeader className="border-b bg-card/50 backdrop-blur-md px-6 py-4 flex flex-row items-center justify-between space-y-0">
                <div className="flex items-center gap-2 text-primary/70">
                    <Icon className="size-4" />
                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em]">{title}</CardTitle>
                </div>
            </CardHeader>
            <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                    {children}
                </div>
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
