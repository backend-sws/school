import React, { ReactNode } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StepCardProps {
  title: string;
  subtitle: string;
  stepIndex: number;
  totalSteps: number;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function StepCard({
  title,
  subtitle,
  stepIndex,
  totalSteps,
  children,
  footer,
  className,
}: StepCardProps) {
  return (
    <Card className={cn("shadow-none border-border/40 rounded-none", className)}>
      <CardHeader className="flex flex-row items-center justify-between py-4 px-6 border-b bg-muted/30 rounded-none">
        <div className="space-y-0.5">
          <h2 className="text-base font-bold text-foreground tracking-tight">{title}</h2>
          <p className="text-[13px] text-muted-foreground font-medium">{subtitle}</p>
        </div>
        <Badge variant="outline" className="text-[10px] font-bold px-2 py-0 h-5 bg-background rounded-none">
          Step {stepIndex} of {totalSteps}
        </Badge>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-6 space-y-6">
          {children}
        </div>
        {footer ? (
          <div className="bg-muted/10 p-4 rounded-none border-t border-border/40">
             {footer}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
