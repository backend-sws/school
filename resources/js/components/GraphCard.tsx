import * as React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { cn } from "@/lib/utils";

interface GraphCardProps {
    title: string;
    description?: string;
    config: ChartConfig;
    children: React.ReactNode;
    className?: string;
    contentClassName?: string;
    delay?: number;
    variant?: "default" | "glass" | "elevated";
    aspectRatio?: "video" | "square" | "auto";
}

export function GraphCard({
    title,
    description,
    config,
    children,
    className,
    contentClassName,
    delay = 0,
    variant = "metrics",
    aspectRatio = "video",
}: GraphCardProps & { variant?: any }) {
    return (
        <Card
            variant={variant}
            animated
            delay={delay}
            className={cn("overflow-hidden group", className)}
        >
            <CardHeader className="pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-primary/70">
                        {title}
                    </CardTitle>
                    {description && (
                        <CardDescription className="text-[10px] font-medium text-muted-foreground/60">
                            {description}
                        </CardDescription>
                    )}
                </div>
            </CardHeader>
            <CardContent className={cn("px-4 pb-4 pt-2", contentClassName)}>
                {children ? (
                    <ChartContainer
                        config={config}
                        className={cn(
                            "w-full h-[240px] aspect-auto",
                            aspectRatio === "video" && "aspect-video",
                            aspectRatio === "square" && "aspect-square",
                            aspectRatio === "auto" && "h-full"
                        )}
                    >
                        {children as any}
                    </ChartContainer>
                ) : (
                    <div className="h-[240px] flex items-center justify-center text-[10px] text-muted-foreground uppercase font-black tracking-widest bg-muted/5 rounded-lg border border-dashed">
                        No Data Visualized
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
