import React, { type ReactNode } from "react";
import { type LucideIcon } from "lucide-react";
import Each from "@/components/Each";
import { Skeleton } from "@/components/ui/skeleton";

interface FieldGroup {
  fields: ReadonlyArray<{ key: string; label: string }>;
  /** Optional bg class for this group row (e.g. "bg-muted/20") */
  bg?: string;
  /** Use monospace font for values */
  mono?: boolean;
}

interface InfoGridCardProps {
  icon: LucideIcon;
  title: string;
  /** Record to read values from (e.g. personalInfo or academicRecord) */
  data: Record<string, unknown>;
  /** One or more groups of fields — each renders as a 3-col grid row */
  groups: FieldGroup[];
  isLoading?: boolean;
  /** Optional extra content below all groups (e.g. previous education) */
  children?: ReactNode;
}

const GridLoader = ({ count }: { count: number }) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="px-5 py-4">
        <Skeleton className="h-2.5 w-20 mb-1.5" />
        <Skeleton className="h-4 w-28" />
      </div>
    ))}
  </>
);

export function InfoGridCard({
  icon: Icon,
  title,
  data,
  groups,
  isLoading = false,
  children,
}: InfoGridCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-border bg-muted/30">
        <div className="p-1.5 rounded-lg bg-primary/10">
          <Icon size={15} className="text-primary" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      </div>

      {/* Field groups */}
      {groups.map((group, gIdx) => (
        <div
          key={gIdx}
          className={`grid grid-cols-2 sm:grid-cols-3 divide-x divide-y sm:divide-y divide-border/50 ${
            gIdx > 0 ? "border-t border-border" : ""
          } ${group.bg ?? ""}`}
        >
          <Each
            of={[...group.fields]}
            keyExtractor={(item) => item.key}
            isLoading={isLoading}
            fallback={<GridLoader count={group.fields.length} />}
            render={({ key, label }) => (
              <div className="px-5 py-4 min-w-0">
                <p className="text-[11px] font-medium text-muted-foreground mb-0.5">
                  {label}
                </p>
                <p
                  className={`text-sm font-semibold text-foreground break-words capitalize ${
                    group.mono ? "font-mono" : ""
                  }`}
                  title={String(data[key] ?? "")}
                >
                  {(data[key] as string) ?? "—"}
                </p>
              </div>
            )}
          />
        </div>
      ))}

      {/* Optional extra content */}
      {children}
    </div>
  );
}
