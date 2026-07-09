import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatTheme = "blue" | "emerald" | "primary" | "rose" | "amber" | "accent";

interface LmsStatCardProps {
    icon: LucideIcon;
    title: string;
    value: React.ReactNode;
    subValue?: React.ReactNode;
    theme?: StatTheme;
    action?: React.ReactNode;
    children?: React.ReactNode;
    className?: string;
    delay?: number;
    animated?: boolean;
}

const themeStyles: Record<StatTheme, { bg: string; text: string }> = {
    blue: { bg: "bg-info/10", text: "text-info" },
    emerald: { bg: "bg-success/10", text: "text-success" },
    primary: { bg: "bg-primary/10", text: "text-primary" },
    rose: { bg: "bg-destructive/10", text: "text-destructive" },
    amber: { bg: "bg-warning/10", text: "text-warning" },
    accent: { bg: "bg-accent/10", text: "text-accent" },
};

export const LmsStatCard = ({
    icon: Icon,
    title,
    value,
    subValue,
    theme = "blue",
    action,
    children,
    className,
    delay = 0,
    animated = true,
}: LmsStatCardProps) => {
    const styles = themeStyles[theme];

    return (
        <Card
            variant="metrics"
            animated={animated}
            delay={delay}
            hoverable
            className={cn("group rounded-3xl", className)}
        >
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <div className="space-y-4 w-full">
                        <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-sm border border-border/10", styles.bg, styles.text)}>
                            <Icon className="size-6" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">{title}</p>
                            <div className="flex flex-col">
                                <div className="text-xl font-bold text-foreground flex items-baseline gap-2">
                                    {value}
                                </div>
                                {subValue && (
                                    <div className="text-sm text-muted-foreground">
                                        {subValue}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {action && (
                        <div className="shrink-0 ml-2">
                            {action}
                        </div>
                    )}
                </div>
                {children && (
                    <div className="mt-6">
                        {children}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
