import React from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  className?: string;
  isFirstSection?: boolean;
}

export function SectionHeader({ title, className, isFirstSection }: SectionHeaderProps) {
  return (
    <div className={cn(
      "border-b border-border/40 pb-2 mb-4", 
      !isFirstSection && "mt-8",
      className
    )}>
      <label className="text-[10px] font-black uppercase tracking-[0.25em] text-primary/70 block">
        {title}
      </label>
    </div>
  );
}
