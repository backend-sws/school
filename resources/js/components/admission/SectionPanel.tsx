import React, { ReactNode } from "react";

interface SectionPanelProps {
  title?: string;
  children: ReactNode;
}

export function SectionPanel({ title, children }: SectionPanelProps) {
  return (
    <div className="rounded-lg border bg-muted/5 p-4 space-y-4">
      {title ? (
        <h3 className="text-sm font-semibold tracking-wide text-muted-foreground border-b pb-1">
          {title}
        </h3>
      ) : null}
      {children}
    </div>
  );
}
