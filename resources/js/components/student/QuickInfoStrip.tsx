import React from "react";
import Each from "@/components/Each";
import { Skeleton } from "@/components/ui/skeleton";
import { QUICK_INFO_STRIP_ITEMS, SEMESTER_ROMAN } from "@/constants/page/studentDashboard";
import type { QuickInfoStripItem } from "@/constants/page/studentDashboard";

export type QuickInfoStripProps = {
  isLoading?: boolean;
  /** When provided, use these items instead of default QUICK_INFO_STRIP_ITEMS (e.g. for school). */
  items?: readonly QuickInfoStripItem[];
  [key: string]: any;
};

function formatValue(key: string, value: string | number | undefined): string {
  if (value == null) return "—";
  if (key === "current_semester") {
    const n = typeof value === "number" ? value : parseInt(String(value), 10);
    return SEMESTER_ROMAN[n - 1] ?? String(value);
  }
  return String(value);
}

function StripLoader({ itemCount }: { itemCount: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 divide-x divide-y sm:divide-y lg:divide-y-0 divide-border">
      {Array.from({ length: Math.min(itemCount, 8) }).map((_, i) => (
        <div key={i} className="px-4 py-3.5 sm:px-5 sm:py-4 space-y-1.5">
          <Skeleton className="h-2.5 w-14" />
          <Skeleton className="h-4 w-20" />
        </div>
      ))}
    </div>
  );
}

export function QuickInfoStrip(props: QuickInfoStripProps) {
  const { isLoading, items: itemsProp, ...stripProps } = props;
  const items = itemsProp ?? QUICK_INFO_STRIP_ITEMS;

  return (
    <div className="rounded-2xl border border-border bg-card">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 divide-x divide-y sm:divide-y lg:divide-y-0 divide-border">
        <Each
          of={[...items]}
          keyExtractor={(item) => item.key}
          isLoading={isLoading}
          fallback={<StripLoader itemCount={items.length} />}
          render={({ key, label }) => (
            <div className="px-4 py-3.5 sm:px-5 sm:py-4 min-w-0">
              <p className="text-[11px] font-medium text-muted-foreground mb-0.5 truncate">
                {label}
              </p>
              <p className="text-sm font-semibold text-foreground truncate capitalize">
                {formatValue(key, stripProps[key])}
              </p>
            </div>
          )}
        />
      </div>
    </div>
  );
}
