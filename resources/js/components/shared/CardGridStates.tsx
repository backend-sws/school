import React from "react";
import { LucideIcon, Layers } from "lucide-react";

// ─── Card Grid Empty State ───────────────────────────────────────────────────

interface CardGridEmptyStateProps {
  /** Title text shown in the empty state */
  title: string;
  /** Description text shown below the title */
  description: string;
  /** Optional icon to display (defaults to Layers) */
  icon?: LucideIcon;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Reusable empty-state placeholder for card-grid pages.
 * Renders a dashed-bordered panel with an icon, title, and description.
 */
export function CardGridEmptyState({
  title,
  description,
  icon: Icon = Layers,
  className,
}: CardGridEmptyStateProps) {
  return (
    <div
      className={`col-span-full flex flex-col items-center justify-center rounded-3xl border border-dashed border-border/60 bg-muted/5 py-20 text-center ${className ?? ""}`}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground mb-4">
        <Icon className="size-8" />
      </div>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-muted-foreground max-w-xs mx-auto mt-1">
        {description}
      </p>
    </div>
  );
}

// ─── Card Grid Skeleton ──────────────────────────────────────────────────────

interface CardGridSkeletonProps {
  /** Number of skeleton cards to render (default: 6) */
  count?: number;
  /** Height class for each skeleton (default: "h-40") */
  height?: string;
  /** Additional CSS classes for each skeleton card */
  className?: string;
}

/**
 * Reusable loading skeleton for card-grid pages.
 * Renders a configurable number of pulsing placeholder cards.
 */
export function CardGridSkeleton({
  count = 6,
  height = "h-40",
  className,
}: CardGridSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`${height} rounded-3xl bg-muted/40 animate-pulse border border-border/40 ${className ?? ""}`}
        />
      ))}
    </>
  );
}
